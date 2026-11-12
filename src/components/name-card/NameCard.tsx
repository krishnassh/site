"use client";

import { useEffect, useRef } from "react";
import { FONT_VAR, FONT_WEIGHT } from "./constants";
import { NameAnimation } from "./engine";

type Props = {
  name: string; // split on spaces, one word per line
  background: string;
  ink?: string;
};

// next/font gives the pixel font a generated family name, read it back
// from the css variable
function pixelFontFamily() {
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden";
  probe.style.fontFamily = `var(${FONT_VAR})`;
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily.split(",")[0].replace(/["']/g, "").trim();
  probe.remove();
  return family;
}

export function NameCard({ name, background, ink = "#fdfefd" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animation: NameAnimation | null = null;
    let visible = false;

    // only animate while the card is on screen and the tab is open
    const update = () => {
      if (!animation || reduceMotion) return;
      if (visible && !document.hidden) animation.start();
      else animation.stop();
    };

    // wait a frame so the canvas has its final size
    const frame = requestAnimationFrame(() => {
      animation = new NameAnimation(canvas, {
        lines: name.split(" "),
        background,
        ink,
      });
      if (!animation.ok) return;

      if (reduceMotion) animation.renderStill();
      else update();

      const family = pixelFontFamily();
      if (family && document.fonts) {
        document.fonts
          .load(`${FONT_WEIGHT} 1em "${family}"`)
          .then(() => animation?.setFont(`"${family}", sans-serif`))
          .catch(() => {});
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        update();
      },
      { threshold: 0.2 },
    );
    observer.observe(canvas);
    document.addEventListener("visibilitychange", update);

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => animation?.resize(), 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("resize", onResize);
      animation?.stop();
    };
  }, [name, background, ink]);

  return (
    <div
      role="img"
      aria-label={name}
      style={{ backgroundColor: background }}
      className="relative aspect-[1344/620] w-full select-none overflow-hidden rounded-xl"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
