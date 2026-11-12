import { CAP_PIXELS, FONT_WEIGHT } from "./constants";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

// Finds the size of one pixel of the font: draw a few letters offscreen and
// take the gcd of the horizontal ink runs across some rows.
export function measureCell(family: string, fontSize: number, capHeight: number): number {
  const fallback = Math.max(1, Math.round(capHeight / CAP_PIXELS));

  try {
    const w = Math.ceil(fontSize * 4);
    const h = Math.ceil(fontSize * 1.6);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return fallback;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.font = `${FONT_WEIGHT} ${fontSize}px ${family}`;
    ctx.fillText("HEIL", 4, h * 0.8);

    const runs: number[] = [];
    for (const row of [0.45, 0.55, 0.65]) {
      const y = Math.floor(h * 0.8 - capHeight * row);
      if (y < 0 || y >= h) continue;

      const pixels = ctx.getImageData(0, y, w, 1).data;
      let run = 0;
      for (let x = 0; x < w; x++) {
        if (pixels[x * 4] > 127) {
          run++;
        } else {
          if (run > 0) runs.push(run);
          run = 0;
        }
      }
      if (run > 0) runs.push(run);
    }

    if (!runs.length) return fallback;
    const cell = runs.reduce(gcd);
    return cell >= 2 ? cell : fallback;
  } catch {
    return fallback;
  }
}
