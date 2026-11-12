// timing is counted in ticks, FPS ticks per second
export const FPS = 32;
export const MOVE_TICKS = 20; // one scatter pose to the next
export const RETURN_TICKS = 17; // last pose back to the typeset name
export const HOLD_TICKS = 8; // rest on the typeset name before looping
export const SCATTERS_MIN = 2;
export const SCATTERS_MAX = 4;

// share of the move each letter lags by, so they don't all land together
export const STAGGER = 0.08;

// sizes are fractions of the card height
export const CAP_HEIGHT = 44 / 304;
export const FIRST_BASELINE = 140 / 304;
export const LINE_PITCH = 67.5 / 304;

export const FONT_WEIGHT = 400;
export const FONT_VAR = "--font-pixel";

// pixels in a capital letter of the font, used if the grid can't be measured
export const CAP_PIXELS = 9;

export const BOND = {
  cellScale: 0.5, // bond cells are half a font pixel
  airCells: 2, // gap between a bond and the letter at either end
  minCells: 1,
  weightCells: 2, // thickness
  bowCells: 1, // how far a bond sags off the straight line
  bowSeconds: 7,
  startTick: 3,
  stopBeforeHome: 2,
};

// small one pixel twitch while the letters are scattered
export const JITTER = {
  cells: 1,
  seconds: 5.2,
  gate: 0.975,
  easeTicks: 6,
};
