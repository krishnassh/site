"use client";

import Image from "next/image";
import { useState } from "react";

// github's generated cards fail now and then, so fall back to the name
export function RepoImage({ src, name }: { src: string; name: string }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="flex aspect-[2/1] w-full items-center justify-center border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-4 text-center text-sm font-medium text-neutral-400 dark:text-neutral-500">
        {name}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={1280}
      height={640}
      sizes="(min-width: 640px) 300px, 90vw"
      priority
      onError={() => setBroken(true)}
      className="aspect-[2/1] w-full border-b border-neutral-200 dark:border-neutral-800 object-cover"
    />
  );
}
