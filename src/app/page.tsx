"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import styles from "./home.module.css";

const keywords = ["Liftoff.", "Creativity.", "Innovation.", "Collaboration.", "Learning.", "AI.", "Curiosity.", "Impact."];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % keywords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "4rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 style={{ fontSize: "4rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          <span style={{ fontFamily: "sans-serif" }}>Experience</span>{" "}
          <span style={{ display: "inline-block", position: "relative", verticalAlign: "top" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={keywords[index]}
                initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-playful)",
                  ...(keywords[index] === "Liftoff."
                    ? {
                      background: "linear-gradient(135deg, #ff4e50, #f9d423)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
                    : { color: "teal", WebkitTextFillColor: "teal" }),
                }}
              >
                {keywords[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontSize: "1.5rem", opacity: 0.7, maxWidth: "600px", lineHeight: 1.6 }}
      >
        This is <span style={{ color: "#0d9488", fontFamily: "var(--font-inter)", fontWeight: "600" }}>ACM Student Chapter</span> BVDUDET, Navi Mumbai
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontSize: "1.3rem", opacity: 0.8, maxWidth: "600px", lineHeight: 1.6, marginTop: "-0.5rem" }}
      >
        Join the community that&apos;s building the future of computing.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/events">
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "#0d9488", color: "#ffffff" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: "0.65rem 1.25rem",
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "#0d9488",
              backgroundColor: "transparent",
              border: "2px solid #0d9488",
              cursor: "pointer",
              borderRadius: "4px",
              outline: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Explore Events
          </motion.button>
        </Link>
      </motion.div>

      {/* Launch section: its scroll space drives the rocket animation. */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={styles.launchSection}
      >
        <span className={`${styles.spark} ${styles.sparkOne}`} aria-hidden="true">✦</span>
        <span className={`${styles.spark} ${styles.sparkTwo}`} aria-hidden="true">✦</span>

        <div className={styles.launchContent}>
          <p className={styles.eyebrow}>ACM Student Chapter</p>
          <h2>
            More than just a Classroom
          </h2>
          <p className={styles.launchCopy}>
            Go beyond the syllabus. Explore ideas that spark curiosity, meet people who challenge your thinking, and turn possibilities into something real.
          </p>
        </div>

        <div className={styles.deviceCollage} aria-hidden="true">
          <div className={`${styles.device} ${styles.laptop}`}>
            <Image src="/illustrations/laptop.svg" alt="" width={220} height={160} />
          </div>
          <div className={`${styles.device} ${styles.headphones}`}>
            <Image src="/illustrations/headphones.svg" alt="" width={150} height={150} />
          </div>
          <div className={`${styles.device} ${styles.watch}`}>
            <Image src="/illustrations/smartwatch.svg" alt="" width={130} height={150} />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
