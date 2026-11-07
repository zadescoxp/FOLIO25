"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import works from "@/content/works.json";

type Work = {
  title: string;
  category: string;
  client: string;
  year: number;
  description: string;
  links: { label: string; url: string }[];
  video?: string;
  images: string[];
};

const SPAWN_DISTANCE = 120; // px of pointer travel between images
const SPAWN_INTERVAL = 700; // ms between images while the pointer rests on a row
const VISIBLE_MS = 950;

/**
 * Pops a work's images out at the pointer, in a loop, while it hovers that work's row.
 * Lives outside React state: it runs on every pointer move and must not cause re-renders.
 */
function createTrail(layer: HTMLElement) {
  let work: Work | null = null;
  let row: HTMLElement | null = null;
  let index = 0;
  let x = 0;
  let y = 0;
  let lastX = 0;
  let lastY = 0;
  let timer = 0;
  const loaded = new Map<string, HTMLImageElement>();

  const preload = (src: string) => {
    if (loaded.has(src)) return;
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    loaded.set(src, image);
  };

  const spawn = (dx: number, dy: number) => {
    if (!work?.images.length) return;
    const src = work.images[index++ % work.images.length];
    const image = loaded.get(src);
    if (!image?.complete || !image.naturalWidth) return preload(src);

    const item = document.createElement("div");
    item.className = "trail-item";
    item.innerHTML = '<i></i><i></i><i></i><i></i>';
    const copy = image.cloneNode() as HTMLImageElement;
    copy.alt = "";
    item.prepend(copy);
    const pill = document.createElement("span");
    pill.textContent = work.title.toLowerCase().replace(/\s+/g, "-");
    item.append(pill);
    layer.append(item);

    const w = item.offsetWidth;
    const h = item.offsetHeight;
    // Stays fully on screen, including its tilt, drift and name pill: never cut by an edge.
    const edge = 28;
    const fit = (value: number, size: number, room: number, before = edge) =>
      Math.max(before, Math.min(room - size - edge, value));
    const left = Math.round(fit(x - w / 2, w, window.innerWidth));
    const top = Math.round(fit(y - h / 2, h, window.innerHeight, edge + 20));
    const tilt = (Math.random() - 0.5) * 7;
    // Carries on in the direction the pointer was moving, which reads as being thrown out.
    const driftX = fit(left + Math.max(-70, Math.min(70, dx * 0.5)), w, window.innerWidth) - left;
    const driftY = fit(top + Math.max(-70, Math.min(70, dy * 0.5)), h, window.innerHeight, edge + 20) - top;
    const at = (tx: number, ty: number, s: number, r: number) =>
      `translate3d(${left + tx}px, ${top + ty}px, 0) rotate(${r}deg) scale(${s})`;

    const pop = item.animate(
      [
        { transform: at(0, 0, 0.5, tilt * 2), opacity: 0 },
        { transform: at(driftX, driftY, 1, tilt), opacity: 1, offset: 0.34 },
        { transform: at(driftX, driftY, 1, tilt), opacity: 1, offset: 0.78 },
        { transform: at(driftX, driftY, 0.88, tilt * 0.6), opacity: 0 },
      ],
      { duration: VISIBLE_MS + 350, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
    );
    pop.onfinish = () => item.remove();
  };

  const stopTimer = () => {
    window.clearInterval(timer);
    timer = 0;
  };

  // Scrolling moves rows under a resting pointer without any pointer event firing.
  const pointerStillOnRow = () => {
    if (!row) return false;
    const r = row.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  return {
    preload,
    start(next: Work, el: HTMLElement, px: number, py: number) {
      work = next;
      row = el;
      x = lastX = px;
      y = lastY = py;
      next.images.forEach(preload);
      spawn(0, 0);
      stopTimer();
      timer = window.setInterval(() => {
        if (pointerStillOnRow()) spawn(0, 0);
        else this.stop();
      }, SPAWN_INTERVAL);
    },
    move(px: number, py: number) {
      x = px;
      y = py;
      const dx = px - lastX;
      const dy = py - lastY;
      if (Math.hypot(dx, dy) >= SPAWN_DISTANCE) {
        spawn(dx, dy);
        lastX = px;
        lastY = py;
      }
    },
    stop() {
      work = null;
      row = null;
      stopTimer();
    },
    /** Stop, and take away what is already on screen. */
    clear() {
      this.stop();
      layer.querySelectorAll<HTMLElement>(".trail-item").forEach((item) => {
        item.getAnimations().forEach((a) => a.cancel());
        item.remove();
      });
    },
  };
}

function Detail({ work, open }: { work: Work; open: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (open && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.play().catch(() => {});
    else video.pause();
  }, [open]);

  const images = work.video ? work.images.slice(0, 2) : work.images.slice(0, 3);

  return (
    <div className="work-body">
      <div className="work-inner">
        <p className="work-desc">{work.description}</p>
        {work.links.length > 0 && (
          <ul className="work-links">
            {work.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        {open && (work.video || images.length > 0) && (
          <div className="work-media">
            {work.video && (
              <video ref={videoRef} src={work.video} poster={work.images[0]} muted loop playsInline autoPlay />
            )}
            {images.map((src) => (
              // Plain img: these are already sized local files, shown only once a row opens.
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={`${work.title} screenshot`} loading="lazy" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkList() {
  const list = works as Work[];
  const [open, setOpen] = useState<number | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<ReturnType<typeof createTrail> | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const trail = createTrail(layer);
    trailRef.current = trail;
    // Load quietly once the page is idle, so the first hover has images ready.
    const idle = window.setTimeout(() => list.forEach((work) => work.images.forEach(trail.preload)), 2500);
    return () => {
      window.clearTimeout(idle);
      trail.clear();
      trailRef.current = null;
    };
  }, [list]);

  const enter = (e: ReactPointerEvent<HTMLButtonElement>, index: number) => {
    const row = e.currentTarget;
    const rect = row.getBoundingClientRect();
    // The white fill slides in from whichever edge the pointer came through.
    row.style.setProperty("--from", e.clientY < rect.top + rect.height / 2 ? "-100%" : "100%");
    row.dataset.hover = "true";
    if (e.pointerType === "mouse" && openRef.current !== index) {
      trailRef.current?.start(list[index], row, e.clientX, e.clientY);
    }
  };

  const leave = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const row = e.currentTarget;
    const rect = row.getBoundingClientRect();
    row.style.setProperty("--from", e.clientY < rect.top + rect.height / 2 ? "-100%" : "100%");
    delete row.dataset.hover;
    trailRef.current?.stop();
  };

  const toggle = (index: number, e: ReactPointerEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    const opening = open !== index;
    setOpen(opening ? index : null);
    if (opening) trailRef.current?.clear();
    else trailRef.current?.start(list[index], e.currentTarget, e.clientX, e.clientY);
  };

  return (
    <>
      <div className="work-table" role="list">
        <div className="work-head" aria-hidden="true">
          <span>Project</span>
          <span>Category</span>
          <span>Client</span>
          <span>Year</span>
        </div>
        {list.map((work, index) => (
          <article key={work.title} className="work" role="listitem" data-open={open === index}>
            <button
              type="button"
              className="work-row"
              data-build={work.title}
              aria-expanded={open === index}
              onPointerEnter={(e) => enter(e, index)}
              onPointerLeave={leave}
              onPointerMove={(e) => {
                if (e.pointerType === "mouse" && openRef.current !== index) trailRef.current?.move(e.clientX, e.clientY);
              }}
              onClick={(e) => toggle(index, e)}
            >
              <i className="work-fill" aria-hidden="true" />
              {[work.title, work.category, work.client, String(work.year)].map((text, cell) => (
                <span className="work-cell" key={cell}>
                  <span data-type="">{text}</span>
                </span>
              ))}
            </button>
            <Detail work={work} open={open === index} />
          </article>
        ))}
      </div>
      <div ref={layerRef} className="trail" aria-hidden="true" />
    </>
  );
}
