"use client";

import { useEffect, useRef } from "react";

// strip as wide as the content column, two projects per column. once it is centered
// on screen the mouse wheel moves it sideways, and the page scroll comes back at either end
export function ProjectsStrip({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let target = el.scrollLeft;
    let raf = 0;
    let last = 0;

    // glide towards the target instead of jumping a whole wheel notch at once
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = target;
        raf = 0;
        return;
      }
      el.scrollLeft += diff * (1 - Math.exp(-dt / 90));
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already sideways
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; // lines -> px
      const dir = Math.sign(delta);

      // the page scrolls as usual until the strip sits in the middle of the
      // screen, a hard flick lands exactly on the middle instead of past it
      const rect = el.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 1;
      // on a short page the strip can't reach the middle, the bottom will do
      const centered = Math.abs(offset) <= 3 || atBottom;
      if (!centered) {
        if (offset * dir > 0 && Math.abs(offset) <= Math.abs(delta)) {
          e.preventDefault();
          window.scrollBy(0, offset);
        }
        return;
      }

      const max = el.scrollWidth - el.clientWidth;
      if (!raf) target = el.scrollLeft; // pick up wherever a drag left it
      const atStart = target <= 0 && dir < 0;
      const atEnd = target >= max - 1 && dir > 0;
      if (max <= 0 || atStart || atEnd) return; // page scrolls on from either end
      e.preventDefault();

      target = Math.min(max, Math.max(0, target + delta));
      if (reduceMotion) {
        el.scrollLeft = target;
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    // let go of the animation when the user grabs the strip themselves
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // on the window, the pointer isn't over the strip while the page scrolls to it.
    // non passive to be able to preventDefault
    window.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", stop);
    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", stop);
    };
  }, []);

  return (
    <div className="relative mx-auto max-w-4xl px-6">
      <ul
        ref={ref}
        className="no-scrollbar grid auto-cols-[18rem] grid-flow-col grid-rows-1 gap-4 sm:grid-rows-2 pointer-coarse:snap-x pointer-coarse:snap-mandatory overflow-x-auto overscroll-x-contain pb-3 will-change-scroll sm:auto-cols-[20rem]"
      >
        {children}
      </ul>
      {/* fades are overlays, a mask-image on the scroller repaints every frame */}
      <div className="pointer-events-none absolute inset-y-0 left-6 w-8 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-950" />
      <div className="pointer-events-none absolute inset-y-0 right-6 w-8 bg-gradient-to-l from-neutral-50 to-transparent dark:from-neutral-950" />
    </div>
  );
}
