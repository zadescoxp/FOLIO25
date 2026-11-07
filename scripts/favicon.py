#!/usr/bin/env python3
"""Generate the site icons: a pixel Z with an agent cursor at its corner.

Drawn on a 16 x 16 grid, so it stays sharp at real tab size. Needs Pillow.
  python3 scripts/favicon.py
"""
from pathlib import Path

from PIL import Image

ART = [
    "................",
    ".##############.",
    ".##############.",
    ".##############.",
    ".........#####..",
    "........#####...",
    ".......#####....",
    "......#####.....",
    ".....#####.b....",
    "....#####..bb...",
    "...#####...bbb..",
    ".#########.bbbb.",
    ".#########.bbbbb",
    ".#########.bbb..",
    "...........b.bb.",
    "................",
]
TILE = (17, 17, 16)
COLORS = {"#": (241, 240, 236), "b": (74, 107, 255)}
hex_of = lambda rgb: "#%02x%02x%02x" % rgb
APP = Path(__file__).resolve().parent.parent / "src" / "app"


def raster(size):
    im = Image.new("RGB", (16, 16), TILE)
    for y, row in enumerate(ART):
        for x, cell in enumerate(row):
            if cell in COLORS:
                im.putpixel((x, y), COLORS[cell])
    return im.resize((size, size), Image.NEAREST)


def svg():
    parts = [f'<rect width="16" height="16" fill="{hex_of(TILE)}"/>']
    for key, rgb in COLORS.items():
        d = "".join(
            f"M{x} {y}h1v1h-1z" for y, row in enumerate(ART) for x, cell in enumerate(row) if cell == key
        )
        parts.append(f'<path fill="{hex_of(rgb)}" d="{d}"/>')
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">'
        + "".join(parts)
        + "</svg>\n"
    )


(APP / "icon.svg").write_text(svg())
raster(180).save(APP / "apple-icon.png", optimize=True)
raster(48).save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
