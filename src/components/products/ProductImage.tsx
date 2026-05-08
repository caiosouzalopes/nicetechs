"use client";

import Image from "next/image";

interface ProductImageProps {
  src: string | string[];
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

export function ProductImage({ src, alt, fill, className, sizes }: ProductImageProps) {
  const imageSrc = Array.isArray(src) ? src[0] || "" : src;
  const isDataUrl = imageSrc.startsWith("data:");

  if (isDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- base64 data URLs require native img
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : undefined}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
    />
  );
}
