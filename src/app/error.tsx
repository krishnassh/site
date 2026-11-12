"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-neutral-700">
      <p>Something broke.</p>
      <button
        onClick={reset}
        className="mt-2 cursor-pointer text-neutral-500 underline hover:text-neutral-900"
      >
        Try again
      </button>
    </div>
  );
}
