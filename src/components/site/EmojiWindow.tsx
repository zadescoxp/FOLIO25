"use client";

import { useEffect, useRef } from "react";

const SIZE = 16;
const TICK_MS = 1000 / 15; // tiles change in steps, which keeps it feeling digital
const WAVE_S = 1.5;
const HOLD_S = 1.7;
const BAND_ROWS = 4;

const EMPTY = "#24272a";
const LINES = "#1b1d1f";
const BANDS = ["#e0592f", "#f6b93b", "#d968d6"]; // bottom to top of the wave
const PALETTE: Record<string, string> = {
  ".": EMPTY,
  K: "#141414",
  W: "#efeee8",
  Y: "#f6b93b",
  R: "#e0592f",
  B: "#2f55ff",
};

const EMOJIS: { words: string[]; art: string[] }[] = [
  {
    words: ["DEAD", "LINE"],
    art: [
      "................",
      ".....WWWWWW.....",
      "...WWWWWWWWWW...",
      "..WWWWWWWWWWWW..",
      "..WWWWWWWWWWWW..",
      "..WKKKWWWWKKKW..",
      "..WKKKWWWWKKKW..",
      "..WKKKWWWWKKKW..",
      "..WWWWWKKWWWWW..",
      "...WWWWKKWWWW...",
      "....WWWWWWWW....",
      "....WKWKWKWW....",
      "....WKWKWKWW....",
      "....WWWWWWWW....",
      "................",
      "................",
    ],
  },
  {
    words: ["IT", "WORKS"],
    art: [
      "................",
      ".....YYYYYY.....",
      "...YYYYYYYYYY...",
      "..YYYYYYYYYYYY..",
      ".YYYYYYYYYYYYYY.",
      ".YYYKKYYYYKKYYY.",
      ".YYYKKYYYYKKYYY.",
      ".YYYYYYYYYYYYYY.",
      ".YYYYYYYYYYYYYY.",
      ".YYKYYYYYYYYKYY.",
      ".YYKKYYYYYYKKYY.",
      "..YYKKKKKKKKYY..",
      "...YYYKKKKYYY...",
      ".....YYYYYY.....",
      "................",
      "................",
    ],
  },
  {
    words: ["ON", "FIRE"],
    art: [
      ".......R........",
      ".......RR.......",
      "......RRR.......",
      "....R.RRRR......",
      "....RRRRRRR.R...",
      "...RRRRYRRRRR...",
      "...RRRYYRRRRRR..",
      "..RRRRYYYRRRRR..",
      "..RRRYYYYYRRRR..",
      "..RRYYYYYYYRRR..",
      "..RRYYYWWYYRRR..",
      "..RRYYWWWWYYRR..",
      "...RRYWWWWYRR...",
      "....RRYWWYRR....",
      ".....RRRRRR.....",
      "................",
    ],
  },
  {
    words: ["SHIPPED"],
    art: [
      "................",
      ".....YYYYYY.....",
      "...YYYYYYYYYY...",
      "..YYYYYYYYYYYY..",
      ".YYYYYYYYYYYYYY.",
      ".KKKKKKKKKKKKKK.",
      ".YKKKKYYYYKKKKY.",
      ".YYKKYYYYYYKKYY.",
      ".YYYYYYYYYYYYYY.",
      ".YYYYYYYYYYYYYY.",
      ".YYYYYYYYYYKKYY.",
      "..YYKKKKKKKKYY..",
      "...YYYYYYYYYY...",
      ".....YYYYYY.....",
      "................",
      "................",
    ],
  },
  {
    words: ["AGENTS", "ONLINE"],
    art: [
      ".......WW.......",
      ".......WW.......",
      "...BBBBBBBBBB...",
      "..BBBBBBBBBBBB..",
      "..BBWWWBBWWWBB..",
      "..BBWKWBBWKWBB..",
      "..BBWWWBBWWWBB..",
      "..BBBBBBBBBBBB..",
      ".WBBBBBBBBBBBBW.",
      ".WBBKWKWKWKWBBW.",
      ".WBBBBBBBBBBBBW.",
      "..BBBBBBBBBBBB..",
      "....BB....BB....",
      "....BB....BB....",
      "...BBB....BBB...",
      "................",
    ],
  },
];

// Same inputs give the same jag, so a wave's edge holds its shape as it rises.
const jag = (column: number, band: number) => {
  const v = Math.sin(column * 12.9898 + band * 78.233) * 43758.5453;
  return Math.floor((v - Math.floor(v)) * 4) - 1;
};

const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

/**
 * A little app window. Jagged colour bands rise through a 16 x 16 grid, leaving a new
 * pixel emoji behind them, while the panel's words resolve one letter at a time.
 */
export default function EmojiWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordsRef = useRef<HTMLParagraphElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const wordsEl = wordsRef.current;
    const countEl = countRef.current;
    if (!canvas || !ctx || !wordsEl || !countEl) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cell = 1;
    let offset = 0;
    let index = 0;
    let startedAt = 0;
    let visible = false;
    let timer = 0;
    let lastWords = "";
    // Each letter comes in at its own moment, in a fixed shuffled order per word.
    const letterOrder = EMOJIS.map(({ words }) => words.join("\n").split("").map(() => Math.random()));

    const drawGrid = (colorAt: (row: number, column: number) => string) => {
      ctx.fillStyle = LINES;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          ctx.fillStyle = colorAt(r, c);
          ctx.fillRect(offset + c * cell, offset + r * cell, cell - 1, cell - 1);
        }
      }
    };

    const showWords = (emoji: number, progress: number) => {
      const text = EMOJIS[emoji].words.join("\n");
      const order = letterOrder[emoji];
      const next = text
        .split("")
        .map((letter, i) => (letter === "\n" || order[i] * 0.8 < progress ? letter : " "))
        .join("");
      if (next !== lastWords) {
        wordsEl.textContent = next;
        lastWords = next;
      }
      countEl.textContent = `${String(emoji + 1).padStart(2, "0")}/${String(EMOJIS.length).padStart(2, "0")}`;
    };

    const render = (now: number) => {
      const cycle = (now - startedAt) / 1000;
      const nextIndex = (index + 1) % EMOJIS.length;
      const current = EMOJIS[index].art;
      if (cycle < HOLD_S) {
        drawGrid((r, c) => PALETTE[current[r][c]]);
        showWords(index, 1);
        return;
      }
      const t = (cycle - HOLD_S) / WAVE_S;
      if (t >= 1) {
        index = nextIndex;
        startedAt = now;
        drawGrid((r, c) => PALETTE[EMOJIS[index].art[r][c]]);
        showWords(index, 1);
        return;
      }
      const next = EMOJIS[nextIndex].art;
      // The fronts climb from below the grid to well above it, so both ends are clean.
      const climb = ease(t) * (SIZE + BAND_ROWS * (BANDS.length + 1) + 3) - 3;
      drawGrid((r, c) => {
        const fromBottom = SIZE - 1 - r;
        // Lowest front first: new emoji, then orange, yellow, pink, then the old emoji.
        if (fromBottom < climb - BAND_ROWS * BANDS.length + jag(c, 0)) return PALETTE[next[r][c]];
        for (let band = 0; band < BANDS.length; band++) {
          const front = climb - BAND_ROWS * (BANDS.length - 1 - band) + jag(c, band + 1);
          if (fromBottom < front) return BANDS[band];
        }
        return PALETTE[current[r][c]];
      });
      showWords(nextIndex, t);
    };

    const tick = () => {
      if (visible && !document.hidden) render(performance.now());
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      const size = Math.round(box.width * dpr);
      canvas.width = canvas.height = size;
      // Whole-pixel tiles, so every grid line is the same crisp width.
      cell = Math.floor(size / SIZE);
      offset = Math.floor((size - cell * SIZE) / 2);
      render(performance.now());
    };

    const sizer = new ResizeObserver(resize);
    sizer.observe(canvas);
    const watcher = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) startedAt = performance.now();
    });
    watcher.observe(canvas);
    startedAt = performance.now();
    if (!still) timer = window.setInterval(tick, TICK_MS);

    return () => {
      window.clearInterval(timer);
      sizer.disconnect();
      watcher.disconnect();
    };
  }, []);

  return (
    <div className="emoji-window" role="img" aria-label="Animated pixel emoji: skull, smile, fire, sunglasses and robot">
      <div className="emoji-body" aria-hidden="true">
        <div className="emoji-panel">
          <p ref={wordsRef} className="emoji-words" />
          <div className="emoji-meta">
            <span className="emoji-mark">Zade</span>
            <span className="emoji-note">Current<br />mood<br />Folio@26</span>
            <span ref={countRef} className="emoji-count" />
          </div>
        </div>
        <div className="emoji-stage">
          <canvas ref={canvasRef} className="emoji-grid" />
        </div>
      </div>
    </div>
  );
}
