"use client";

import Image from "next/image";

interface IllustrationProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}

const ILLUSTRATION_FILES = [
  { src: "/illustrations/laptop.svg", alt: "Laptop illustration" },
  { src: "/illustrations/headphones.svg", alt: "Headphones illustration" },
  { src: "/illustrations/speaker.svg", alt: "Speaker illustration" },
  { src: "/illustrations/smartwatch.svg", alt: "Smartwatch illustration" },
  { src: "/illustrations/keyboard.svg", alt: "Keyboard illustration" },
  { src: "/illustrations/mouse.svg", alt: "Mouse illustration" },
];

export function TechIllustration({
  index,
  className,
  style,
  size = 180,
}: IllustrationProps & { index: number }) {
  const illus = ILLUSTRATION_FILES[index % ILLUSTRATION_FILES.length];
  return (
    <Image
      src={illus.src}
      alt={illus.alt}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain", ...style }}
      priority
    />
  );
}

export function getIllustrationForIndex(index: number) {
  return ILLUSTRATION_FILES[index % ILLUSTRATION_FILES.length];
}
