import { BOND } from "./constants";
import { centerX, centerY, type Letter } from "./letter";

// how far from the middle of a box to its edge, going in direction (ux, uy)
function edgeDistance(halfW: number, halfH: number, ux: number, uy: number) {
  const tx = ux !== 0 ? halfW / Math.abs(ux) : Infinity;
  const ty = uy !== 0 ? halfH / Math.abs(uy) : Infinity;
  return Math.min(tx, ty);
}

// A bond is the space left between two neighbouring letters, filled with
// square cells on the font's own pixel grid.
export function drawBonds(
  ctx: CanvasRenderingContext2D,
  letters: Letter[],
  pairs: [number, number][],
  offsets: [number, number][],
  cell: number,
  clock: number,
) {
  const centers = letters.map((l, i) => [
    centerX(l) + offsets[i][0],
    centerY(l) + offsets[i][1],
  ]);

  for (const [ia, ib] of pairs) {
    const a = letters[ia];
    const b = letters[ib];
    const dx = centers[ib][0] - centers[ia][0];
    const dy = centers[ib][1] - centers[ia][1];
    const dist = Math.hypot(dx, dy);
    if (dist < 1) continue;

    const ux = dx / dist;
    const uy = dy / dist;
    const edgeA = edgeDistance((a.right - a.left) / 2, (a.bottom - a.top) / 2, ux, uy);
    const edgeB = edgeDistance((b.right - b.left) / 2, (b.bottom - b.top) / 2, ux, uy);

    const air = BOND.airCells * cell;
    const usable = dist - edgeA - edgeB - 2 * air;
    const count = Math.floor(usable / cell);
    if (count < BOND.minCells) continue;

    const first = edgeA + air + (usable - count * cell) / 2;
    const bow =
      BOND.bowCells * cell * Math.sin(clock * ((Math.PI * 2) / BOND.bowSeconds) + ia * 1.1);
    const size = BOND.weightCells * cell;

    for (let k = 0; k < count; k++) {
      const along = first + (k + 0.5) * cell;
      const sag = count > 1 ? Math.sin((Math.PI * (k + 0.5)) / count) : 0;
      const x = centers[ia][0] + ux * along - uy * bow * sag;
      const y = centers[ia][1] + uy * along + ux * bow * sag;

      // snap to the grid so diagonals stair-step like the letters
      ctx.fillRect(
        Math.round((x - size / 2) / cell) * cell,
        Math.round((y - size / 2) / cell) * cell,
        size,
        size,
      );
    }
  }
}
