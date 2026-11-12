import { drawBonds } from "./bonds";
import { measureCell } from "./cell";
import {
  BOND,
  CAP_HEIGHT,
  FIRST_BASELINE,
  FONT_WEIGHT,
  FPS,
  HOLD_TICKS,
  JITTER,
  LINE_PITCH,
  MOVE_TICKS,
  RETURN_TICKS,
  SCATTERS_MAX,
  SCATTERS_MIN,
  STAGGER,
} from "./constants";
import * as eases from "./eases";
import { centerX, pick, type Letter } from "./letter";
import { POSES } from "./poses";

type Options = {
  lines: string[];
  background: string;
  ink: string;
};

// Draws the name on a canvas, scatters it into a molecule and folds it back.
export class NameAnimation {
  readonly ok: boolean;

  private ctx: CanvasRenderingContext2D | null;
  private family = "sans-serif";
  private font = "";
  private cell = 1;

  private letters: Letter[] = [];
  private pairs: [number, number][] = []; // neighbours in the same word

  private poseOrder: number[] = [];
  private cycleTicks = 0;

  private running = false;
  private frame = 0;
  private createdAt = 0;
  private cycleStart = 0;
  private lastTick = -1;
  private clock = 0; // seconds since creation, drives bow and twitch

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: Options,
  ) {
    this.ctx = canvas.getContext("2d");
    this.ok = !!this.ctx;
    if (this.ok) this.resize();
  }

  resize() {
    const box = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(box.width * dpr);
    this.canvas.height = Math.round(box.height * dpr);

    this.layout();
    this.lastTick = -1;
    if (!this.running) this.renderStill();
  }

  setFont(family: string) {
    this.family = family;
    this.layout();

    if (!this.running) this.renderStill();
    else if (this.lastTick >= 0) this.render(this.lastTick);
  }

  start() {
    if (this.running || !this.ok) return;
    this.running = true;
    this.cycleStart = performance.now();
    if (!this.createdAt) this.createdAt = this.cycleStart;
    if (!this.poseOrder.length) this.newCycle();

    const tick = (now: number) => {
      if (!this.running) return;
      this.clock = (now - this.createdAt) / 1000;
      const t = ((now - this.cycleStart) / 1000) * FPS;

      if (t >= this.cycleTicks) {
        this.cycleStart = now;
        this.newCycle();
        this.lastTick = 0;
      } else {
        this.lastTick = t;
      }
      this.render(this.lastTick);
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  // the plain name, used for reduced motion
  renderStill() {
    if (!this.poseOrder.length) this.newCycle();
    this.render(this.cycleTicks - 1);
  }

  private layout() {
    const ctx = this.ctx;
    if (!ctx) return;
    const { width, height } = this.canvas;

    // size the font so a capital H is CAP_HEIGHT of the card
    ctx.font = `${FONT_WEIGHT} 100px ${this.family}`;
    const capAt100 = ctx.measureText("H").actualBoundingBoxAscent || 72;
    const size = (CAP_HEIGHT * height * 100) / capAt100;
    this.font = `${FONT_WEIGHT} ${size}px ${this.family}`;
    ctx.font = this.font;
    this.cell = measureCell(this.family, size, CAP_HEIGHT * height) * BOND.cellScale;

    this.letters = [];
    this.pairs = [];

    this.opts.lines.forEach((word, line) => {
      const baseline = (FIRST_BASELINE + line * LINE_PITCH) * height;
      const left = (width - ctx.measureText(word).width) / 2;
      const first = this.letters.length;

      for (let i = 0; i < word.length; i++) {
        const metrics = ctx.measureText(word[i]);
        this.letters.push({
          char: word[i],
          line,
          x: left + ctx.measureText(word.slice(0, i)).width,
          y: baseline,
          left: -(metrics.actualBoundingBoxLeft || 0),
          right: metrics.actualBoundingBoxRight || metrics.width,
          top: -(metrics.actualBoundingBoxAscent || size * 0.5),
          bottom: metrics.actualBoundingBoxDescent || 0,
          poseX: [],
          poseY: [],
        });
        if (i > 0) this.pairs.push([first + i - 1, first + i]);
      }

      this.placePoses(this.letters.slice(first), line, height);
    });
  }

  // works out where each letter of a word goes in every pose
  private placePoses(word: Letter[], line: number, height: number) {
    const typesetMiddle = (centerX(word[0]) + centerX(word[word.length - 1])) / 2;

    for (const pose of POSES) {
      const gaps = pose.gaps[line];
      const dys = pose.dy[line];

      let span = 0;
      for (let i = 1; i < word.length; i++) span += pick(gaps, i - 1);
      span *= height;

      let x = typesetMiddle + pose.shift[line] * height - span / 2;
      word.forEach((letter, i) => {
        if (i > 0) x += pick(gaps, i - 1) * height;
        letter.poseX.push(x - centerX(letter));
        letter.poseY.push(pick(dys, i) * height);
      });
    }
  }

  // random poses, never the same one twice in a row
  private newCycle() {
    const count = SCATTERS_MIN + Math.floor(Math.random() * (SCATTERS_MAX - SCATTERS_MIN + 1));
    const order: number[] = [];
    let prev = -1;

    for (let i = 0; i < count; i++) {
      let pose = Math.floor(Math.random() * POSES.length);
      if (pose === prev) pose = (pose + 1) % POSES.length;
      order.push(pose);
      prev = pose;
    }

    this.poseOrder = order;
    this.cycleTicks = count * MOVE_TICKS + RETURN_TICKS + HOLD_TICKS;
  }

  // fixed pseudo-random lag per letter
  private lag(i: number) {
    const h = Math.sin(i * 12.9898) * 43758.5453;
    return (h - Math.floor(h)) * STAGGER;
  }

  private offsetAt(letter: Letter, i: number, t: number): [number, number] {
    const lag = 1 + this.lag(i);
    const moves = this.poseOrder.length;
    const scatterEnd = moves * MOVE_TICKS;

    if (t < scatterEnd) {
      const k = Math.min(moves - 1, Math.floor(t / MOVE_TICKS));
      const local = t - k * MOVE_TICKS;
      const p = eases.sample(eases.MOVE, (local / lag) * ((eases.MOVE.length - 1) / MOVE_TICKS));

      const prev = this.poseOrder[k - 1];
      const next = this.poseOrder[k];
      const fromX = k === 0 ? 0 : letter.poseX[prev];
      const fromY = k === 0 ? 0 : letter.poseY[prev];
      return [
        fromX + (letter.poseX[next] - fromX) * p,
        fromY + (letter.poseY[next] - fromY) * p,
      ];
    }

    const local = t - scatterEnd;
    if (local >= RETURN_TICKS) return [0, 0];

    const p = eases.sample(
      eases.RETURN,
      (local / lag) * ((eases.RETURN.length - 1) / RETURN_TICKS),
    );
    const last = this.poseOrder[moves - 1];
    return [letter.poseX[last] * (1 - p), letter.poseY[last] * (1 - p)];
  }

  // 0 while folded, eases to 1 once the molecule has formed
  private twitchStrength(t: number) {
    const end = this.poseOrder.length * MOVE_TICKS;
    if (t <= BOND.startTick || t >= end) return 0;

    const e = Math.min(t - BOND.startTick, end - t) / JITTER.easeTicks;
    const u = Math.min(1, Math.max(0, e));
    return u * u * (3 - 2 * u);
  }

  // a one cell nudge now and then, thresholded so it hops rather than glides
  private twitch(i: number, strength: number): [number, number] {
    if (strength < 0.5) return [0, 0];

    const w = (Math.PI * 2) / JITTER.seconds;
    const step = JITTER.cells * this.cell;

    const sy = Math.sin(this.clock * w + i * 2.9);
    if (Math.abs(sy) >= JITTER.gate) return [0, Math.sign(sy) * step];

    const sx = Math.sin(this.clock * w * 0.73 + i * 1.7);
    if (Math.abs(sx) >= JITTER.gate) return [Math.sign(sx) * step, 0];

    return [0, 0];
  }

  private render(t: number) {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.fillStyle = this.opts.background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.font = this.font;
    ctx.fillStyle = this.opts.ink;

    const strength = this.twitchStrength(t);
    const offsets = this.letters.map((letter, i) => {
      const [ox, oy] = this.offsetAt(letter, i, t);
      const [tx, ty] = this.twitch(i, strength);
      return [ox + tx, oy + ty] as [number, number];
    });

    this.letters.forEach((l, i) => {
      ctx.fillText(l.char, l.x + offsets[i][0], l.y + offsets[i][1]);
    });

    const bondsEnd = this.poseOrder.length * MOVE_TICKS + RETURN_TICKS - BOND.stopBeforeHome;
    if (t >= BOND.startTick && t <= bondsEnd) {
      drawBonds(ctx, this.letters, this.pairs, offsets, this.cell, this.clock);
    }
  }
}
