"use client";

import { useRef } from "react";
import { useAutoScroll } from "./useAutoScroll";

type Tool = { name: string; icon: string; href: string };

export function ToolsScroller({
  tools,
  seconds,
}: {
  tools: Tool[];
  seconds: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useAutoScroll(ref, seconds);

  // rendered twice so the loop has no gap
  const row = [...tools, ...tools];

  return (
    <div
      ref={ref}
      className="no-scrollbar overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <ul className="flex w-max items-center py-1">
        {row.map((tool, i) => {
          const copy = i >= tools.length;
          return (
            <li key={i} aria-hidden={copy}>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener"
                draggable={false}
                tabIndex={copy ? -1 : 0}
                className="group flex select-none items-center gap-2.5 px-4 py-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/tools/${tool.icon}`}
                  alt=""
                  draggable={false}
                  className="h-7 w-7 opacity-60 grayscale dark:opacity-80 dark:brightness-[2.5] transition duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 dark:group-hover:brightness-150"
                />
                <span className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                  {tool.name}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
