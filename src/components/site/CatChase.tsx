"use client";

import { useEffect, useRef } from "react";

const CAT = {
  sit: [
    ".........#...#",
    ".........#####",
    ".........#.#.#",
    "#........#####",
    "#...#########.",
    "#..##########.",
    ".#.##########.",
    "..###########.",
    "...##.##.##.##",
    "...#...#.#...#",
  ],
  walk: [
    ".........#...#",
    ".........#####",
    ".........#.#.#",
    "#........#####",
    ".#..#########.",
    ".#.##########.",
    "..###########.",
    "..###########.",
    "..##.##...##..",
    ".##...##...##.",
  ],
  crouch: [
    "..............",
    "..............",
    ".........#...#",
    ".........#####",
    "#........#.#.#",
    ".#.....#######",
    "..###########.",
    "..###########.",
    ".###########..",
    ".##.##....####",
  ],
  leap: [
    ".........#...#",
    ".........#####",
    "#........#.#.#",
    ".#.......#####",
    "..###########.",
    "..###########.",
    "...#########..",
    "..##.......##.",
    ".##.........##",
    "..............",
  ],
};

const BUTTERFLY = [
  [
    "##.....##",
    "###.#.###",
    "#########",
    ".#######.",
    "..##.##..",
    ".##...##.",
  ],
  [
    ".........",
    "..##.##..",
    "..#####..",
    "...###...",
    "...###...",
    "..#...#..",
  ],
];

const toPath = (rows: string[]) =>
  rows
    .flatMap((row, y) => row.split("").map((cell, x) => (cell === "#" ? `M${x} ${y}h1v1h-1z` : "")))
    .join("");

const CAT_PATHS = Object.fromEntries(Object.entries(CAT).map(([k, v]) => [k, toPath(v)])) as Record<
  keyof typeof CAT,
  string
>;
const BUTTERFLY_PATHS = BUTTERFLY.map(toPath);

const CAT_W = 14;
const CAT_H = 10;
const FLY_W = 9;
const FLY_H = 6;

/**
 * A pixel cat that keeps trying to catch a butterfly. It trots underneath, crouches and
 * leaps, and the butterfly always rises just out of reach. The cat never wins.
 */
export default function CatChase() {
  const sceneRef = useRef<HTMLSpanElement>(null);
  const catRef = useRef<SVGSVGElement>(null);
  const catPathRef = useRef<SVGPathElement>(null);
  const flyRef = useRef<SVGSVGElement>(null);
  const flyPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const cat = catRef.current;
    const catPath = catPathRef.current;
    const fly = flyRef.current;
    const flyPath = flyPathRef.current;
    if (!scene || !cat || !catPath || !fly || !flyPath) return;

    let width = 100;
    let height = 40;
    let pixel = 2;
    let em = 60;

    const resize = () => {
      em = parseFloat(getComputedStyle(scene).fontSize);
      width = scene.offsetWidth;
      height = scene.offsetHeight;
      // Whole device-friendly pixels, so the art stays square and crisp at every size.
      pixel = Math.max(2, Math.round(em * 0.055));
      cat.style.width = `${CAT_W * pixel}px`;
      cat.style.height = `${CAT_H * pixel}px`;
      fly.style.width = `${FLY_W * pixel}px`;
      fly.style.height = `${FLY_H * pixel}px`;
    };
    resize();
    const sizer = new ResizeObserver(resize);
    sizer.observe(scene);

    let state: "chase" | "crouch" | "leap" | "rest" = "chase";
    let stateAt = 0;
    let catX = 0.2; // both x positions are fractions of the scene's width
    let leapFrom = 0;
    let leapTo = 0;
    let dodge = 0;
    let facing = 1;

    const draw = (t: number, dt: number) => {
      const room = Math.max(1, width - CAT_W * pixel);

      // Butterfly: a wandering loop that climbs away whenever the cat jumps.
      dodge *= Math.exp(-dt * 1.3);
      const flyX = 0.5 + 0.42 * Math.sin(t * 0.83) + 0.08 * Math.sin(t * 2.3);
      const lift = 0.22 + 0.34 * (0.5 + 0.5 * Math.sin(t * 1.37 + 1)) + 0.06 * Math.sin(t * 5.1) + dodge;
      const flyPx = flyX * (width - FLY_W * pixel);
      const flyPy = height - FLY_H * pixel - lift * em;

      // Cat
      const since = t - stateAt;
      const flyCentre = flyPx + (FLY_W * pixel) / 2;
      const catCentre = catX * room + (CAT_W * pixel) / 2;
      const gap = flyCentre - catCentre;
      let hop = 0;
      let frame: keyof typeof CAT = "sit";

      if (state === "chase") {
        if (Math.abs(gap) > pixel) facing = gap > 0 ? 1 : -1;
        const step = Math.sign(gap) * Math.min(Math.abs(gap), em * 1.5 * dt);
        catX = Math.min(1, Math.max(0, catX + step / room));
        frame = Math.abs(gap) > pixel * 2 && Math.floor(t * 9) % 2 ? "walk" : "sit";
        if (Math.abs(gap) < em * 0.5 && lift < 0.42) {
          state = "crouch";
          stateAt = t;
        }
      } else if (state === "crouch") {
        frame = "crouch";
        if (since > 0.24) {
          state = "leap";
          stateAt = t;
          leapFrom = catX;
          leapTo = Math.min(1, Math.max(0, catX + gap / room));
          dodge += 0.75; // always just out of reach
        }
      } else if (state === "leap") {
        const p = Math.min(1, since / 0.52);
        catX = leapFrom + (leapTo - leapFrom) * p;
        hop = Math.sin(p * Math.PI) * em * 0.62;
        frame = "leap";
        if (p >= 1) {
          state = "rest";
          stateAt = t;
        }
      } else {
        frame = "sit";
        if (since > 0.65) {
          state = "chase";
          stateAt = t;
        }
      }

      // Everything lands on the art's own pixel grid, which keeps the 8-bit feel.
      const snap = (v: number) => Math.round(v / pixel) * pixel;
      const x = snap(catX * room);
      const y = snap(height - CAT_H * pixel - hop);
      cat.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${facing})`;
      catPath.setAttribute("d", CAT_PATHS[frame]);

      fly.style.transform = `translate3d(${snap(flyPx)}px, ${snap(flyPy)}px, 0)`;
      flyPath.setAttribute("d", BUTTERFLY_PATHS[Math.floor(t * 9) % 2]);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(1, 0);
      return () => sizer.disconnect();
    }

    let raf = 0;
    let visible = true;
    let last = performance.now();
    let clock = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      clock += dt;
      draw(clock, dt);
    };
    raf = requestAnimationFrame(frame);
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    watcher.observe(scene);

    return () => {
      cancelAnimationFrame(raf);
      sizer.disconnect();
      watcher.disconnect();
    };
  }, []);

  return (
    <span ref={sceneRef} className="cat-scene" aria-hidden="true">
      <svg ref={catRef} viewBox={`0 0 ${CAT_W} ${CAT_H}`} shapeRendering="crispEdges" fill="currentColor">
        <path ref={catPathRef} d={CAT_PATHS.sit} />
      </svg>
      <svg ref={flyRef} className="cat-scene-fly" viewBox={`0 0 ${FLY_W} ${FLY_H}`} shapeRendering="crispEdges" fill="currentColor">
        <path ref={flyPathRef} d={BUTTERFLY_PATHS[0]} />
      </svg>
    </span>
  );
}
