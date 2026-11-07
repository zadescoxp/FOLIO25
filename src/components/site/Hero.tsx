"use client";

import { useEffect, useRef } from "react";
import CatChase from "./CatChase";
import PixelIcon from "./PixelIcon";

const HOLD_MS = 1150; // how long the name rests small in the centre
const FLY_MS = 1100;
const GRID_COLUMNS = 20;

const flyEase = "cubic-bezier(0.76, 0, 0.24, 1)";

/**
 * Pinned cover. It opens on a small name with its captions beneath, then the name flies
 * up into the headline as the captions glide out to the sides, and the agents build the
 * rest. It fades out as the work table scrolls up over it.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const leftRef = useRef<HTMLParagraphElement>(null);
  const rightRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll fade
  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const t = Math.min(1, window.scrollY / (window.innerHeight * 0.7));
      hero.style.setProperty("--fade", String(1 - t));
      hero.style.visibility = t >= 1 ? "hidden" : "visible";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Intro
  useEffect(() => {
    const hero = ref.current;
    const name = nameRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!hero || !name || !left || !right) return;
    const nav = document.querySelector<HTMLElement>(".site-nav");
    const start = () => {
      document.documentElement.dataset.swarm = "go";
      window.dispatchEvent(new Event("swarm:start"));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.scrollY > 10) {
      hero.dataset.intro = "done";
      nav?.setAttribute("data-ready", "true");
      start();
      return;
    }

    // Measured from where everything will end up, then played backwards from the centre.
    const nameBox = name.getBoundingClientRect();
    const leftBox = left.getBoundingClientRect();
    const rightBox = right.getBoundingClientRect();
    const scale = Math.min(0.62, 44 / nameBox.height);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2 - 24;
    const nameFrom = `translate3d(${cx - (nameBox.left + nameBox.width / 2)}px, ${cy - (nameBox.top + nameBox.height / 2)}px, 0) scale(${scale})`;
    const below = cy + (nameBox.height * scale) / 2 + 2;
    const spread = Math.max(70, nameBox.width * scale * 0.72);
    const leftFrom = `translate3d(${cx - spread - leftBox.left}px, ${below - leftBox.top}px, 0)`;
    const rightFrom = `translate3d(${cx + spread - rightBox.right}px, ${below - rightBox.top}px, 0)`;

    name.style.transform = nameFrom;
    left.style.transform = leftFrom;
    right.style.transform = rightFrom;
    hero.dataset.intro = "small";

    const fly = window.setTimeout(() => {
      const options: KeyframeAnimationOptions = { duration: FLY_MS, easing: flyEase, fill: "forwards" };
      name.animate([{ transform: nameFrom }, { transform: "none" }], options);
      left.animate([{ transform: leftFrom }, { transform: "none" }], options);
      right.animate([{ transform: rightFrom }, { transform: "none" }], options);
      nav?.setAttribute("data-ready", "true");
    }, HOLD_MS);

    // The agents arrive as the name is landing.
    const build = window.setTimeout(() => {
      hero.dataset.intro = "done";
      start();
    }, HOLD_MS + FLY_MS * 0.72);

    return () => {
      window.clearTimeout(fly);
      window.clearTimeout(build);
    };
  }, []);

  // Pixel flash grid: the tile under the pointer blinks white, inverting whatever it covers.
  useEffect(() => {
    const hero = ref.current;
    const grid = gridRef.current;
    if (!hero || !grid || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let lastCell = -1;
    const onMove = (e: PointerEvent) => {
      const size = window.innerWidth / GRID_COLUMNS;
      const column = Math.floor(e.clientX / size);
      const row = Math.floor(e.clientY / size);
      const cell = row * GRID_COLUMNS + column;
      if (cell === lastCell) return;
      lastCell = cell;
      const tile = document.createElement("i");
      tile.style.cssText = `left:${column * size}px;top:${row * size}px;width:${Math.ceil(size)}px;height:${Math.ceil(size)}px`;
      grid.append(tile);
      window.setTimeout(() => tile.remove(), 280);
    };
    const onLeave = () => {
      lastCell = -1;
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} className="hero" id="top">
      <h1 className="hero-title">
        <span ref={nameRef} className="hero-line hero-name">
          <span className="rise"><span className="script">Z</span>ade</span>
        </span>
        <span className="hero-line" data-build="Headline">
          <span data-type="" className="hero-text">I build softwares</span>
        </span>
        <span className="hero-line" data-build="Role">
          <span data-type="" className="hero-text hero-pixel">
            <PixelIcon />AI Engineer<PixelIcon delay={-0.55} />
          </span>
        </span>
        <span className="hero-line" data-build="Location">
          <span data-type="" className="hero-text">Based in Bengaluru</span>
        </span>
        <span className="hero-line" data-build="Folio">
          <span data-type="" className="hero-text">
            <span className="hero-folio">Folio@26<CatChase /></span>
          </span>
        </span>
      </h1>
      <p ref={leftRef} className="hero-side hero-side--left">Claude<br />abuser</p>
      <p ref={rightRef} className="hero-side hero-side--right">Token<br />burner</p>
      <div ref={gridRef} className="hero-grid" aria-hidden="true" />
    </section>
  );
}
