// Scatter poses, one entry per line of the name.
//   gaps  distance between neighbouring letters
//   shift sideways move of the whole line
//   dy    vertical offset of each letter
// Lists are shorter than the name sometimes, the last value gets reused.
// Numbers were drawn on a 304px tall card.

export type Pose = {
  gaps: number[][];
  shift: number[];
  dy: number[][];
};

const p = (...values: number[]) => values.map((v) => v / 304);

export const POSES: Pose[] = [
  {
    gaps: [p(56.3, 58.5, 64.6, 71.0), p(75.3, 74.7, 77.6, 90.2)],
    shift: p(4.5, -10.2),
    dy: [p(-30, -13, -6, -13, -30), p(8, 19, 30, 41, 52)],
  },
  {
    gaps: [p(67.8, 65.9, 65.1, 77.9), p(74.2, 72.5, 94.6, 81.7)],
    shift: p(-3.8, 12.7),
    dy: [p(-6, -30, -54, -30, -6), p(48.4, 42.1, 11.6, 17.9, 48.4)],
  },
  {
    gaps: [p(60.6, 60.8, 68.9, 68.0), p(94.9, 92.1, 80.5, 76.9)],
    shift: p(-13.1, 6.6),
    dy: [p(-54, -42, -30, -18, -6), p(8, 8, 8, 52, 52)],
  },
  {
    gaps: [p(75.1, 70.3, 60.8, 73.5), p(89.5, 76.7, 87.4, 77.3)],
    shift: p(-4.6, -2.9),
    dy: [p(-27, -6.2, -33, -53.8, -27), p(30, 45.6, 52, 45.6, 30)],
  },
  {
    gaps: [p(70.2, 74.4, 77.1, 77.5), p(95.8, 91.0, 79.4, 76.2)],
    shift: p(4.9, -11.4),
    dy: [p(-54, -54, -54, -6, -6), p(52, 30, 8, 30, 52)],
  },
  {
    gaps: [p(60.2, 76.3, 69.2, 71.3), p(74.3, 81.6, 93.8, 87.6)],
    shift: p(-1.3, 8.4),
    dy: [p(-30, -13, -6, -13, -30), p(8, 19, 30, 41, 52)],
  },
];
