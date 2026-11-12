"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";

const ZOOM = 1.5;

// zooms in on whatever the cursor is over
export function Avatar({ src, alt }: { src: string; alt: string }) {
  const [hovering, setHovering] = useState(false);
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const origin = useMotionTemplate`${x}px ${y}px`;

  const follow = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - box.left);
    y.set(e.clientY - box.top);
  };

  return (
    <div
      className="squircle mb-4 aspect-square w-full max-w-[200px] cursor-pointer overflow-hidden"
      onMouseEnter={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        x.jump(e.clientX - box.left);
        y.jump(e.clientY - box.top);
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={follow}
    >
      <motion.div
        className="h-full w-full"
        style={{ transformOrigin: origin }}
        animate={{ scale: hovering ? ZOOM : 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          sizes="200px"
          priority
          className="block h-full w-full object-cover"
        />
      </motion.div>
    </div>
  );
}
