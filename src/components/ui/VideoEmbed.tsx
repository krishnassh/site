"use client";

import { useState } from "react";

// plain youtube player. the thumbnail is only there so one click starts the
// video (autoplay) instead of one click for the page and another for youtube
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [started, setStarted] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-neutral-300 bg-black dark:border-neutral-700">
      {started ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setStarted(true)}
          aria-label={`Play ${title}`}
          className="group relative block h-full w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-transform group-hover:scale-110">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
