"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Rocket() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // Changed input range [0, 0.2, 0.5, 0.8, 1] to compress the scroll distance required
  // The rocket will now complete its journey earlier in the scroll
  const rocketY = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.5, 0.7], [0, -50, -200, -500, -1200]);

  const exhaustHeight = useTransform(scrollYProgress, [0, 0.05, 0.1, 0.5], [0, 200, 400, 2500]);
  const exhaustOpacity = useTransform(scrollYProgress, [0, 0.01, 0.05, 0.5], [0, 1, 1, 1]);

  if (pathname !== "/") {
    return null;
  }

  return (
    <div className="rocketContainer">
      <motion.div
        style={{
          y: rocketY,
          width: "300px", // Scaled up width
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <svg
          viewBox="0 0 100 310"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "300px", // Scaled up width
            height: "930px", // Scaled up height (300 * 3.1)
            color: "var(--text-color)",
            display: "block",
            flexShrink: 0,
          }}
        >
          {/* Main Body outlines */}
          <path d="M 30,290 L 30,210 Q 50,215 70,210 L 70,290 Q 50,295 30,290 Z" fill="rgba(0,0,0,0.02)" />
          <path d="M 30,210 L 30,190 Q 50,195 70,190 L 70,210 Q 50,215 30,210 Z" fill="rgba(0,0,0,0.05)" />
          <path d="M 30,190 L 30,120 Q 50,125 70,120 L 70,190 Q 50,195 30,190 Z" fill="rgba(0,0,0,0.02)" />
          <path d="M 30,120 L 37,100 Q 50,103 63,100 L 70,120 Q 50,125 30,120 Z" fill="rgba(0,0,0,0.05)" />
          <path d="M 37,100 L 37,60 Q 50,63 63,60 L 63,100 Q 50,103 37,100 Z" fill="rgba(0,0,0,0.02)" />
          <path d="M 37,60 L 44,40 Q 50,42 56,40 L 63,60 Q 50,63 37,60 Z" fill="rgba(0,0,0,0.04)" />
          <path d="M 44,40 L 50,30 L 56,40 Q 50,42 44,40 Z" fill="rgba(0,0,0,0.06)" />
          <path d="M 50,30 L 50,10 M 48,10 L 52,10 L 52,5 L 48,5 Z" />

          {/* Fins & Engine bells */}
          <path d="M 30,270 L 15,290 L 30,290 Z" fill="rgba(0,0,0,0.05)" />
          <path d="M 70,270 L 85,290 L 70,290 Z" fill="rgba(0,0,0,0.05)" />
          <path d="M 42,275 L 42,295 M 58,275 L 58,295" />
          <path d="M 35,292 C 30,300 30,305 32,305 C 36,306 42,306 44,305 C 45,305 45,300 42,293" fill="rgba(0,0,0,0.1)" />
          <path d="M 47,294 C 45,302 45,307 47,307 C 50,308 50,308 53,307 C 55,307 55,302 53,294" fill="rgba(0,0,0,0.1)" />
          <path d="M 65,292 C 70,300 70,305 68,305 C 64,306 58,306 56,305 C 55,305 55,300 58,293" fill="rgba(0,0,0,0.1)" />

          {/* Vertical texture lines and 3D shading */}
          <path d="M 35,212 L 35,291 M 40,213 L 40,293 M 60,213 L 60,293 M 65,212 L 65,291" strokeWidth="0.5" opacity="0.3" />
          <path d="M 35,122 L 35,191 M 40,123 L 40,193 M 60,123 L 60,193 M 65,122 L 65,191" strokeWidth="0.5" opacity="0.3" />
          <path d="M 68,289 L 68,211 M 68,189 L 68,121 M 61,99 L 61,61" strokeWidth="2" stroke="rgba(0,0,0,0.1)" />

          {/* ADDED: External fuel line conduits (running vertically) */}
          <path d="M 32,290 L 32,210" strokeWidth="1" stroke="currentColor" opacity="0.7" />
          <path d="M 68,190 L 68,120" strokeWidth="1" stroke="currentColor" opacity="0.7" />

          {/* ADDED: S-II to S-IVB Interstage structural cross-bracing details */}
          <path d="M 30,120 L 63,100 M 70,120 L 37,100" strokeWidth="0.5" stroke="currentColor" opacity="0.3" />
          <path d="M 40,120 L 50,100 M 60,120 L 50,100" strokeWidth="0.5" stroke="currentColor" opacity="0.3" />

          {/* ADDED: Panel hatches & technical markings */}
          <rect x="34" y="70" width="4" height="6" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
          <rect x="62" y="165" width="4" height="4" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
          <circle cx="50" cy="50" r="1.5" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />

          {/* ADDED: Additional horizontal stage band lines */}
          <path d="M 30,240 Q 50,244 70,240" strokeWidth="0.8" stroke="currentColor" opacity="0.5" />
          <path d="M 30,265 Q 50,269 70,265" strokeWidth="0.8" stroke="currentColor" opacity="0.5" />
          <path d="M 30,150 Q 50,154 70,150" strokeWidth="0.8" stroke="currentColor" opacity="0.5" />
          
          {/* ADDED: Text markings (ACM / Saturn V) */}
          <text x="50" y="234" fontFamily="var(--font-inter), sans-serif" fontSize="7.5" fontWeight="800" fill="currentColor" textAnchor="middle" letterSpacing="1.5" opacity="0.9">A</text>
          <text x="50" y="245" fontFamily="var(--font-inter), sans-serif" fontSize="7.5" fontWeight="800" fill="currentColor" textAnchor="middle" letterSpacing="1.5" opacity="0.9">C</text>
          <text x="50" y="256" fontFamily="var(--font-inter), sans-serif" fontSize="7.5" fontWeight="800" fill="currentColor" textAnchor="middle" letterSpacing="1.5" opacity="0.9">M</text>
          
          <text x="50" y="168" fontFamily="var(--font-inter), sans-serif" fontSize="4" fontWeight="400" fill="currentColor" textAnchor="middle" letterSpacing="1.5" opacity="0.5">SATURN V</text>
        </svg>

        <motion.div
          style={{
            width: "75px", // Wider flame to match larger rocket
            height: exhaustHeight,
            opacity: exhaustOpacity,
            background: "linear-gradient(to bottom, #ff4e50 0%, #f9d423 20%, transparent 100%)",
            borderRadius: "40px",
            filter: "blur(10px)",
            marginTop: "-10px",
            flexShrink: 0,
          }}
        />
      </motion.div>
    </div>
  );
}

