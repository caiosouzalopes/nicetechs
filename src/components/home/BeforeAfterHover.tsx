"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  labelBefore?: string;
  labelAfter?: string;
  className?: string;
};

export function BeforeAfterHover({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  labelBefore = "Antes",
  labelAfter = "Depois",
  className = "",
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`before-after-wrap relative w-full aspect-[3/4] overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="img"
      aria-label={`${beforeAlt}. Passe o mouse para ver ${afterAlt}.`}
    >
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={afterAlt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="before-overlay">
        <Image
          src={beforeImage}
          alt={beforeAlt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <span
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-all duration-300 ${
            isHovered
              ? "bg-primary/20 text-primary border border-primary/40"
              : "bg-amber-900/40 text-amber-200 border border-amber-600/50"
          }`}
        >
          {labelBefore}
        </span>
        <span
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-all duration-300 ${
            isHovered
              ? "bg-primary/30 text-primary border border-primary/50"
              : "bg-primary/10 text-primary/80 border border-primary/30"
          }`}
        >
          {labelAfter}
        </span>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 rounded-lg bg-black/50 px-3 py-2 text-center text-xs text-white backdrop-blur-sm">
        {isHovered ? "✨ Limpo!" : "Passe o mouse para ver o resultado da limpeza"}
      </div>
    </div>
  );
}
