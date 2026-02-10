"use client";

import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

export function ProductImage({ src, alt, fill, className, sizes }: ProductImageProps) {
  const isDataUrl = src.startsWith("data:");

  if (isDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- base64 data URLs require native img
      <img
        src={src}
        alt={alt}
        className={className}
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
    />
  );
}
