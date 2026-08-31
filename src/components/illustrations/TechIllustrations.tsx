"use client";

import Image from "next/image";

interface IllustrationProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}

const ILLUSTRATION_FILES = [
  { src: "/illustrations/palette.svg", alt: "Palette illustration" },
  { src: "/illustrations/laptop.svg", alt: "Laptop illustration" },
  { src: "/illustrations/headphones.svg", alt: "Headphones illustration" },
  { src: "/illustrations/speaker.svg", alt: "Speaker illustration" },
  { src: "/illustrations/egt.svg", alt: "Mechanical keyboard, piano, and microphone outline" },
  { src: "/illustrations/smartwatch.svg", alt: "Smartwatch illustration" },
  { src: "/illustrations/keyboard.svg", alt: "Keyboard illustration" },
  { src: "/illustrations/mouse.svg", alt: "Mouse illustration" },
];

const EVENT_ILLUSTRATION_MAP: Record<string, { src: string; alt: string }> = {
  "first-year-orientation": { src: "/illustrations/palette.svg", alt: "Palette illustration" },
  "hackathon-2026": { src: "/illustrations/laptop.svg", alt: "Laptop illustration" },
  "webdev-bootcamp": { src: "/illustrations/headphones.svg", alt: "Headphones illustration" },
  "ai-workshop": { src: "/illustrations/speaker.svg", alt: "Speaker illustration" },
  "egt-3-0": { src: "/illustrations/egt.svg", alt: "Mechanical keyboard, piano, and microphone outline" },
  "open-source-sprint": { src: "/illustrations/smartwatch.svg", alt: "Smartwatch illustration" },
};

export function TechIllustration({
  index,
  eventId,
  className,
  style,
  size = 180,
}: IllustrationProps & { index?: number; eventId?: string }) {
  const illus = (eventId && EVENT_ILLUSTRATION_MAP[eventId]) || (typeof index === "number" ? ILLUSTRATION_FILES[index % ILLUSTRATION_FILES.length] : ILLUSTRATION_FILES[0]);
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

export function getIllustrationForEvent(eventId: string, index?: number) {
  if (EVENT_ILLUSTRATION_MAP[eventId]) {
    return EVENT_ILLUSTRATION_MAP[eventId];
  }
  return typeof index === "number"
    ? ILLUSTRATION_FILES[index % ILLUSTRATION_FILES.length]
    : ILLUSTRATION_FILES[0];
}

export function getIllustrationForIndex(index: number) {
  return ILLUSTRATION_FILES[index % ILLUSTRATION_FILES.length];
}
