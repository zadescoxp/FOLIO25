"use client";

import { useEffect, useRef } from "react";

const LOOKAHEAD = 2; // box agents already flying in, ready for their turn
const ARRIVE_S = 0.5; // a box agent still in flight by now starts its turn anyway
const NEXT_AT = 0.75; // the next component starts when this box is this far along
const TEXT_BOX_S = 0.22;
const SCAN_S = 0.32;
const FADE_S = 0.3;
const LEAVE_S = 0.32;

type Agent = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  k: number;
  type: boolean; // I-beam instead of an arrow
  name: string;
  bornAt: number;
  leftAt: number; // below 0 while still working
};

type Line = {
  el: HTMLElement;
  rightEdges: number[]; // viewport x after each character; x never changes with scroll
  elRight: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  boxAt: number; // seconds after the component starts
  typeAt: number;
  typeFor: number;
  boxer: Agent | null;
  typist: Agent | null;
  typed: boolean;
};

type Job = {
  el: HTMLElement;
  label: string;
  x0: number;
  y0: number; // document space, so frames stay glued to content while scrolling
  x1: number;
  y1: number;
  pinned: boolean; // inside the sticky hero, so it stays put while the page scrolls
  drag: number;
  scan: boolean;
  lines: Line[];
  boxer: Agent | null;
  hiredAt: number;
  startedAt: number;
  endsAt: number; // seconds after the component starts
  built: boolean;
};

const smooth = (x: number) => {
  const v = Math.min(1, Math.max(0, x));
  return v * v * v * (v * (v * 6 - 15) + 10);
};

/** Where each character ends, and the box around the text, measured without touching the DOM. */
function measureLine(el: HTMLElement, scroll: number): Omit<Line, "boxAt" | "typeAt" | "typeFor" | "boxer" | "typist" | "typed"> | null {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const rightEdges: number[] = [];
  let left = Infinity;
  let top = Infinity;
  let bottom = -Infinity;
  let node = walker.nextNode() as Text | null;
  while (node) {
    for (let i = 0; i < node.length; i++) {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      rightEdges.push(r.right);
      left = Math.min(left, r.left);
      top = Math.min(top, r.top);
      bottom = Math.max(bottom, r.bottom);
    }
    node = walker.nextNode() as Text | null;
  }
  if (!rightEdges.length) return null;
  return {
    el,
    rightEdges,
    elRight: el.getBoundingClientRect().right,
    x0: left,
    y0: top + scroll,
    x1: Math.max(...rightEdges),
    y1: bottom + scroll,
  };
}

/**
 * The agents. An agent exists only while it has a job, and every component gets a crew:
 *   1. a box agent drags out the component's frame,
 *   2. a scan line sweeps tall panels as they fill,
 *   3. a text-box agent drags a box inside it for each piece of text,
 *   4. an I-beam typist types that text in, one character at a time.
 * Components start strictly one by one: the next box begins when this one is 75% drawn.
 * With no work on the page, nothing is drawn at all.
 */
export default function Swarm() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const targets = () => Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));
    const reveal = (el: HTMLElement) => {
      el.dataset.built = "true";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets().forEach((el) => {
        el.querySelectorAll<HTMLElement>("[data-type]").forEach((text) => {
          text.dataset.typing = "true";
        });
        reveal(el);
      });
      return;
    }

    let width = 1;
    let height = 1;
    let raf = 0;
    let last = performance.now();
    let clock = 0;
    let dirty = false;
    let turnAt = 0;
    let serial = Math.floor(Math.random() * 40);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const family = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim();
      ctx.font = `9px ${family || "monospace"}`;
      ctx.textBaseline = "middle";
    };
    resize();

    const agents: Agent[] = [];
    const waiting: Job[] = [];
    const active: Job[] = [];

    const spawn = (x: number, y: number, type = false): Agent => {
      const angle = Math.random() * Math.PI * 2;
      const reach = 110 + Math.random() * 170;
      serial = (serial % 48) + 1;
      const agent: Agent = {
        x: x + Math.cos(angle) * reach,
        y: y + Math.sin(angle) * reach,
        vx: 0,
        vy: 0,
        tx: x,
        ty: y,
        k: 70,
        type,
        name: `agent-${String(serial).padStart(2, "0")}`,
        bornAt: clock,
        leftAt: -1,
      };
      agents.push(agent);
      return agent;
    };

    const dismiss = (agent: Agent | null) => {
      if (!agent || agent.leftAt >= 0) return;
      const angle = Math.random() * Math.PI * 2;
      agent.leftAt = clock;
      agent.tx = agent.x + Math.cos(angle) * 170;
      agent.ty = agent.y + Math.sin(angle) * 170;
      agent.k = 18;
    };

    const enqueue = (el: HTMLElement) => {
      if (el.dataset.built || el.dataset.queued) return;
      el.dataset.queued = "true";
      const pinned = !!el.closest(".hero");
      // The hero has already been scrolled away: nobody is watching this one get built.
      if (pinned && window.scrollY > height * 0.35) {
        el.querySelectorAll<HTMLElement>("[data-type]").forEach((text) => {
          text.dataset.typing = "true";
        });
        reveal(el);
        return;
      }
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const scroll = pinned ? 0 : window.scrollY;
      const top = rect.top + parseFloat(style.paddingTop) + scroll;
      const bottom = rect.bottom - parseFloat(style.paddingBottom) + scroll;
      const tall = bottom - top;
      const drag = tall > 200 ? 0.75 : tall > 46 ? 0.5 : 0.4;
      const scan = tall >= 44;

      // Each piece of text gets its slot after the box is nearly drawn.
      let cursor = drag * 0.85;
      const lines: Line[] = [];
      for (const textEl of Array.from(el.querySelectorAll<HTMLElement>("[data-type]"))) {
        const measured = measureLine(textEl, scroll);
        if (!measured) {
          textEl.dataset.typing = "true";
          continue;
        }
        const count = measured.rightEdges.length;
        const typeAt = cursor + TEXT_BOX_S;
        const typeFor = Math.min(0.85, Math.max(0.14, count * (tall > 46 ? 0.042 : 0.024)));
        lines.push({ ...measured, boxAt: cursor, typeAt, typeFor, boxer: null, typist: null, typed: false });
        cursor += 0.09;
      }
      const lastType = lines.reduce((end, l) => Math.max(end, l.typeAt + l.typeFor), 0);

      waiting.push({
        el,
        label: el.dataset.build || "",
        x0: rect.left + parseFloat(style.paddingLeft),
        y0: top,
        x1: rect.right - parseFloat(style.paddingRight),
        y1: bottom,
        pinned,
        drag,
        scan,
        lines,
        boxer: null,
        hiredAt: -1,
        startedAt: -1,
        endsAt: Math.max(drag + (scan ? SCAN_S : 0), lastType) + 0.12,
        built: false,
      });
    };

    const scrollOf = (job: Job) => (job.pinned ? 0 : window.scrollY);

    const isVisible = (job: Job) => {
      if (job.pinned) return window.scrollY < height * 0.35;
      const scroll = window.scrollY;
      return job.y1 - scroll > 0 && job.y0 - scroll < height;
    };

    const skip = (job: Job) => {
      for (const line of job.lines) line.el.dataset.typing = "true";
      reveal(job.el);
      dismiss(job.boxer);
    };

    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            enqueue(entry.target as HTMLElement);
            seen.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );

    // The hero's intro animation decides when the page is ready to be built.
    const begin = () => targets().forEach((el) => seen.observe(el));
    // Either it has already said so (a reload part-way down the page), or it will.
    if (document.documentElement.dataset.swarm === "go") begin();
    else window.addEventListener("swarm:start", begin, { once: true });

    const step = (dt: number) => {
      // Scrolled past before its turn came: show it now, so nothing lags behind the reader.
      for (let i = waiting.length - 1; i >= 0; i--) {
        if (!isVisible(waiting[i])) {
          skip(waiting[i]);
          waiting.splice(i, 1);
        }
      }

      for (let i = 0; i < Math.min(LOOKAHEAD, waiting.length); i++) {
        const job = waiting[i];
        if (!job.boxer) {
          job.boxer = spawn(job.x0, job.y0 - scrollOf(job));
          job.hiredAt = clock;
        }
      }

      const head = waiting[0];
      if (head?.boxer && clock >= turnAt) {
        const near = Math.hypot(head.boxer.x - head.x0, head.boxer.y - (head.y0 - scrollOf(head))) < 22;
        if (near || clock - head.hiredAt > ARRIVE_S) {
          head.startedAt = clock;
          turnAt = clock + head.drag * NEXT_AT;
          active.push(head);
          waiting.shift();
        }
      }

      for (let i = active.length - 1; i >= 0; i--) {
        const job = active[i];
        const t = clock - job.startedAt;
        const scroll = scrollOf(job);

        if (job.boxer && job.boxer.leftAt < 0) {
          const e = smooth(t / job.drag);
          job.boxer.tx = job.x0 + (job.x1 - job.x0) * e;
          job.boxer.ty = job.y0 + (job.y1 - job.y0) * e - scroll;
          job.boxer.k = 120;
          if (t >= job.drag) dismiss(job.boxer);
        }

        for (const line of job.lines) {
          const midY = (line.y0 + line.y1) / 2 - scroll;
          if (!line.boxer && t >= line.boxAt - 0.28) line.boxer = spawn(line.x0, line.y0 - scroll);
          if (line.boxer && line.boxer.leftAt < 0) {
            const e = smooth((t - line.boxAt) / TEXT_BOX_S);
            line.boxer.tx = line.x0 + (line.x1 - line.x0) * e;
            line.boxer.ty = line.y0 + (line.y1 - line.y0) * e - scroll;
            line.boxer.k = 150;
            if (t >= line.boxAt + TEXT_BOX_S) dismiss(line.boxer);
          }
          if (!line.typist && t >= line.typeAt - 0.3) line.typist = spawn(line.x0, midY, true);
          if (line.typist && line.typist.leftAt < 0) {
            const p = Math.min(1, Math.max(0, (t - line.typeAt) / line.typeFor));
            const shown = Math.floor(p * line.rightEdges.length);
            const caret = shown === 0 ? line.x0 : line.rightEdges[shown - 1];
            line.typist.tx = caret + 2;
            line.typist.ty = midY;
            line.typist.k = t < line.typeAt ? 90 : 400;
            if (t >= line.typeAt) {
              // A moving clip reveals the text. Unlike wrapping letters in spans,
              // this keeps the type's kerning exactly as designed.
              line.el.style.clipPath = `inset(-0.6em ${line.elRight - caret}px -0.6em -0.6em)`;
              if (!line.el.dataset.typing) line.el.dataset.typing = "true";
            }
            if (p >= 1) {
              line.el.style.clipPath = "";
              line.typed = true;
              dismiss(line.typist);
            }
          }
        }

        if (!job.built && t >= job.drag) {
          job.built = true;
          reveal(job.el);
        }
        if (t >= job.endsAt + FADE_S) active.splice(i, 1);
      }

      for (let i = agents.length - 1; i >= 0; i--) {
        const a = agents[i];
        // Critically damped spring: arrives without ever overshooting or jittering.
        const c = 2 * Math.sqrt(a.k);
        a.vx += (a.k * (a.tx - a.x) - c * a.vx) * dt;
        a.vy += (a.k * (a.ty - a.y) - c * a.vy) * dt;
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        if (a.leftAt >= 0 && clock - a.leftAt > LEAVE_S) agents.splice(i, 1);
      }
    };

    const drawFrame = (
      x0: number,
      y0: number,
      w: number,
      h: number,
      alpha: number,
      label: string,
      fill: number,
    ) => {
      const x = Math.round(x0) + 0.5;
      const y = Math.round(y0) + 0.5;
      const rw = Math.round(w);
      const rh = Math.round(h);
      ctx.globalAlpha = alpha;
      if (fill > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${fill})`;
        ctx.fillRect(x, y, rw, rh);
      }
      ctx.strokeStyle = "#f1f0ec";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, rw, rh);
      ctx.fillStyle = "#111110";
      for (const [cx, cy] of [[x, y], [x + rw, y], [x, y + rh], [x + rw, y + rh]]) {
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      if (label) {
        const text = `${label}  ${rw}×${rh}`;
        const tw = ctx.measureText(text).width + 8;
        ctx.fillStyle = "#3a3a36";
        ctx.fillRect(x - 0.5, y - 15.5, tw, 13);
        ctx.fillStyle = "#f1f0ec";
        ctx.fillText(text, x + 3.5, y - 8.5);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const job of active) {
        const t = clock - job.startedAt;
        const scroll = scrollOf(job);
        const fade = t > job.endsAt ? Math.max(0, 1 - (t - job.endsAt) / FADE_S) : 1;
        const e = smooth(t / job.drag);
        const top = job.y0 - scroll;
        const w = (job.x1 - job.x0) * e;
        const h = (job.y1 - job.y0) * e;
        drawFrame(job.x0, top, w, h, fade, job.label, 0.035);

        // The scan line that sweeps a panel as it fills.
        if (job.scan && t > job.drag && t < job.drag + SCAN_S) {
          const p = (t - job.drag) / SCAN_S;
          const y = top + (job.y1 - job.y0) * p;
          ctx.globalAlpha = Math.sin(p * Math.PI);
          ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
          ctx.fillRect(job.x0, y - 3, job.x1 - job.x0, 6);
          ctx.fillStyle = "#fff";
          ctx.fillRect(job.x0, y - 0.5, job.x1 - job.x0, 1);
        }

        for (const line of job.lines) {
          if (t < line.boxAt) continue;
          const lineFade = line.typed ? fade : 1;
          const le = smooth((t - line.boxAt) / TEXT_BOX_S);
          const lh = line.y1 - line.y0;
          drawFrame(
            line.x0 - 2,
            line.y0 - scroll - 1,
            (line.x1 - line.x0 + 4) * le,
            (lh + 2) * le,
            lineFade * 0.8,
            lh > 30 ? "Text" : "",
            0,
          );
          // The caret: a solid bar that sits at the end of what has been typed.
          if (!line.typed && t >= line.typeAt) {
            const p = Math.min(1, (t - line.typeAt) / line.typeFor);
            const shown = Math.floor(p * line.rightEdges.length);
            const caret = shown === 0 ? line.x0 : line.rightEdges[shown - 1];
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#fff";
            ctx.fillRect(Math.round(caret) + 1, line.y0 - scroll, 1, lh);
          }
        }
      }

      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      for (const a of agents) {
        const born = Math.min(1, (clock - a.bornAt) / 0.14);
        const gone = a.leftAt < 0 ? 1 : Math.max(0, 1 - (clock - a.leftAt) / LEAVE_S);
        ctx.globalAlpha = born * gone;
        ctx.strokeStyle = "#111110";
        ctx.fillStyle = "#fff";
        let labelX = a.x + 9;
        let labelY = a.y + 11;
        if (a.type) {
          // An I-beam, which is what says "this one is typing".
          const x = Math.round(a.x + 3) + 0.5;
          const y = Math.round(a.y);
          ctx.strokeStyle = "#fff";
          ctx.beginPath();
          ctx.moveTo(x - 3, y - 7);
          ctx.lineTo(x + 3, y - 7);
          ctx.moveTo(x, y - 7);
          ctx.lineTo(x, y + 7);
          ctx.moveTo(x - 3, y + 7);
          ctx.lineTo(x + 3, y + 7);
          ctx.stroke();
          labelX = a.x + 6;
          labelY = a.y + 10;
        } else {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(a.x + 9, a.y + 5.4);
          ctx.lineTo(a.x + 5, a.y + 6.4);
          ctx.lineTo(a.x + 2.8, a.y + 10.6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        const tw = ctx.measureText(a.name).width + 10;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, tw, 13, 6.5);
        ctx.fill();
        ctx.fillStyle = "#111110";
        ctx.fillText(a.name, labelX + 5, labelY + 7);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      clock += dt;
      const busy = agents.length > 0 || active.length > 0 || waiting.length > 0;
      if (!busy) {
        if (dirty) ctx.clearRect(0, 0, width, height);
        dirty = false;
        return;
      }
      dirty = true;
      step(dt);
      draw();
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      seen.disconnect();
      window.removeEventListener("swarm:start", begin);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="swarm" aria-hidden="true" />;
}
