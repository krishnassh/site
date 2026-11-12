import { useEffect, type RefObject } from "react";

// Drifts an overflow-x container sideways forever. The content is expected to
// be two identical halves, so wrapping at half the width is seamless.
// Pauses on hover/touch, and still scrolls by wheel, touch or drag.
export function useAutoScroll(ref: RefObject<HTMLElement | null>, seconds: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const half = () => el.scrollWidth / 2;
    const wrap = (v: number) => ((v % half()) + half()) % half();

    let pos = el.scrollLeft;
    let paused = false;
    let dragging = false;
    let dragStart = 0;
    let scrollStart = 0;
    let dragDistance = 0;

    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      if (!paused && !dragging && !reduceMotion) {
        pos = wrap(pos + (half() / (seconds * 1000)) * (now - last));
        el.scrollLeft = pos;
      }
      last = now;
      frame = requestAnimationFrame(tick);
    });

    const pause = () => (paused = true);
    const resume = () => {
      paused = false;
      pos = el.scrollLeft;
    };

    const onScroll = () => {
      if (!paused && !dragging) return;
      pos = wrap(el.scrollLeft);
      if (pos !== el.scrollLeft) el.scrollLeft = pos;
    };

    // mouse wheel scrolls sideways
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      dragDistance = 0;
      dragStart = e.clientX;
      scrollStart = el.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      dragDistance = Math.abs(e.clientX - dragStart);
      el.scrollLeft = scrollStart - (e.clientX - dragStart);
    };
    const onPointerUp = () => {
      dragging = false;
      pos = el.scrollLeft;
    };

    // ending a drag over a link shouldn't open it
    const onClick = (e: MouseEvent) => {
      if (dragDistance > 5) {
        e.preventDefault();
        e.stopPropagation();
      }
      dragDistance = 0;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("click", onClick, true);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("click", onClick, true);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [ref, seconds]);
}
