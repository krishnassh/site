"use client";

const COLORS = { dark: "#0a0a0a", light: "#fafafa" };

// iOS style squircle: superellipse |x|^n + |y|^n = 1 with n = 5, which has the
// continuous curvature css border-radius (and corner-shape: squircle) lack
const SIZE = 36;
const OUTLINE = (() => {
  const n = 5;
  const r = SIZE / 2 - 0.5; // keep the 1px stroke inside the box
  const steps = 128;
  let d = "";
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = SIZE / 2 + r * Math.sign(c) * Math.abs(c) ** (2 / n);
    const y = SIZE / 2 + r * Math.sign(s) * Math.abs(s) ** (2 / n);
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d + "Z";
})();

export function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? COLORS.dark : COLORS.light);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      className="absolute right-6 top-16 md:top-4 flex h-9 w-9 cursor-pointer items-center justify-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden="true"
        className="absolute inset-0 fill-white stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700"
      >
        <path d={OUTLINE} />
      </svg>
      {/* sun, shown in dark mode */}
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="relative hidden dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* moon, shown in light mode */}
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative block dark:hidden"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
