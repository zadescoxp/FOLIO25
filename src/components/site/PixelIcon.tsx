"use client";

import { useState } from "react";

const FRAMES = [
  [
    ".....#.....",
    ".....#.....",
    "...........",
    "....###....",
    "...#####...",
    "##.#####.##",
    "...#####...",
    "....###....",
    "...........",
    ".....#.....",
    ".....#.....",
  ],
  [
    "#.........#",
    ".#.......#.",
    "...........",
    "....###....",
    "...#####...",
    "...#####...",
    "...#####...",
    "....###....",
    "...........",
    ".#.......#.",
    "#.........#",
  ],
];

const toPath = (rows: string[]) =>
  rows
    .flatMap((row, y) => row.split("").map((cell, x) => (cell === "#" ? `M${x} ${y}h1v1h-1z` : "")))
    .join("");

/**
 * A pixel sun that spins by swapping whole frames. Rotating it would blur the pixels;
 * stepping between hand-drawn frames keeps every one of them on the grid. It's also a
 * toy: clicking it sends it spinning for a moment.
 */
export default function PixelIcon({ delay = 0 }: { delay?: number }) {
  const [burst, setBurst] = useState(false);
  const slot = burst ? 0.14 : 0.55;

  return (
    <button
      type="button"
      className="pixel-button"
      aria-label="Spin the sun"
      onClick={() => {
        setBurst(true);
        window.setTimeout(() => setBurst(false), 1200);
      }}
    >
      <svg className="pixel-icon" viewBox="0 0 11 11" shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
        {FRAMES.map((rows, i) => (
          <path
            key={i}
            d={toPath(rows)}
            style={{ animationDuration: `${slot * FRAMES.length}s`, animationDelay: `${delay + i * slot}s` }}
          />
        ))}
      </svg>
    </button>
  );
}
