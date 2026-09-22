import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function GavelIcon({ size = 24, color = "currentColor", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Sound Block */}
      <path d="M14 20h7" />
      <path d="M13 22h9" />
      <path d="M14.5 18h6" />
      
      {/* Gavel Head */}
      <rect x="2.5" y="4.5" width="6" height="11" rx="1.5" transform="rotate(-45 5.5 10)" />
      <path d="M2 6.5l3.5-3.5" />
      <path d="M9 13.5l3.5-3.5" />

      {/* Gavel Handle */}
      <path d="M9.5 7.5L19 17" strokeWidth="2.5" />
      <circle cx="19.5" cy="17.5" r="1" fill={color} />

      {/* Impact sparks */}
      <path d="M12 17l-1 2" strokeWidth="1.5" opacity="0.7" />
      <path d="M16 15l2-1" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

export function ScalesOfJusticeIcon({ size = 24, color = "currentColor", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Central Column */}
      <line x1="12" y1="3" x2="12" y2="21" />
      <circle cx="12" cy="3" r="1.5" fill={color} />
      {/* Base */}
      <path d="M7 21h10" />
      <path d="M9 19h6" />

      {/* Beam */}
      <path d="M4 7l8-2 8 2" />

      {/* Left Scale */}
      <line x1="4" y1="7" x2="2" y2="13" strokeWidth="1.5" />
      <line x1="4" y1="7" x2="6" y2="13" strokeWidth="1.5" />
      <path d="M1.5 13a2.5 2.5 0 0 0 5 0z" fill={color} fillOpacity="0.15" />

      {/* Right Scale */}
      <line x1="20" y1="7" x2="18" y2="13" strokeWidth="1.5" />
      <line x1="20" y1="7" x2="22" y2="13" strokeWidth="1.5" />
      <path d="M17.5 13a2.5 2.5 0 0 0 5 0z" fill={color} fillOpacity="0.15" />
    </svg>
  );
}

export function CourtEmblemIcon({ size = 36, color = "currentColor", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Outer Wreath / Circle */}
      <circle cx="24" cy="24" r="21" strokeWidth="2.5" strokeDasharray="5 2" />
      <circle cx="24" cy="24" r="18" strokeWidth="1" opacity="0.6" />

      {/* Star at top */}
      <path d="M24 8l1 2.5 2.5.5-2 1.8.5 2.7-2-1.3-2 1.3.5-2.7-2-1.8 2.5-.5z" fill={color} strokeWidth="0.5" />

      {/* Central Pillar */}
      <line x1="24" y1="16" x2="24" y2="35" strokeWidth="2.2" />
      <path d="M18 35h12" strokeWidth="2.5" />

      {/* Beam */}
      <path d="M14 20h20" strokeWidth="2" />

      {/* Left Pan */}
      <line x1="14" y1="20" x2="12" y2="26" strokeWidth="1.2" />
      <line x1="14" y1="20" x2="16" y2="26" strokeWidth="1.2" />
      <path d="M11 26q3 3 6 0z" fill={color} fillOpacity="0.3" strokeWidth="1.5" />

      {/* Right Pan */}
      <line x1="34" y1="20" x2="32" y2="26" strokeWidth="1.2" />
      <line x1="34" y1="20" x2="36" y2="26" strokeWidth="1.2" />
      <path d="M31 26q3 3 6 0z" fill={color} fillOpacity="0.3" strokeWidth="1.5" />
    </svg>
  );
}
