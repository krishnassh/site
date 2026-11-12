export type Letter = {
  char: string;
  line: number;

  // typeset position (x is the left of the glyph, y the baseline)
  x: number;
  y: number;

  // ink box relative to x/y
  left: number;
  right: number;
  top: number;
  bottom: number;

  // where the letter sits in each pose, relative to its typeset spot
  poseX: number[];
  poseY: number[];
};

export const centerX = (l: Letter) => l.x + (l.left + l.right) / 2;
export const centerY = (l: Letter) => l.y + (l.top + l.bottom) / 2;

// at the same index, or the last one if the list is too short
export const pick = <T>(list: T[], i: number): T => list[i] ?? list[list.length - 1];
