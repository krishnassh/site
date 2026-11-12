// sampled by hand rather than a curve, fast start and a long tail
export const MOVE = [
  0, 0.014, 0.044, 0.193, 0.317, 0.545, 0.621, 0.735, 0.777, 0.838, 0.868,
  0.908, 0.924, 0.95, 0.962, 0.979, 0.985, 0.994, 0.996, 1,
];

export const RETURN = [
  0, 0.0115, 0.023, 0.0475, 0.072, 0.1835, 0.295, 0.3645, 0.434, 0.534, 0.634,
  0.667, 0.7, 0.7495, 0.799, 0.8175, 0.836, 0.862, 0.888, 0.8995, 0.911, 0.9275,
  0.944, 0.949, 0.954, 0.9685, 0.983, 0.985, 0.987, 0.9915, 0.996, 0.998, 1,
];

// t is a fractional index into the table
export function sample(table: number[], t: number): number {
  if (t <= 0) return table[0];
  const i = Math.floor(t);
  if (i >= table.length - 1) return table[table.length - 1];
  return table[i] + (table[i + 1] - table[i]) * (t - i);
}
