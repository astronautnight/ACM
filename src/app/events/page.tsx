"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  registerForEvent,
  unregisterFromEvent,
  isUserRegistered,
  getRegistrationCount,
} from "@/lib/events";
import EventDetailsModal from "@/components/EventDetailsModal";
import LoginModal from "@/components/LoginModal";
import { getIllustrationForIndex } from "@/components/illustrations/TechIllustrations";
import styles from "./events.module.css";

/* ------------------------------------------------------------------ */
/*  Event data                                                          */
/* ------------------------------------------------------------------ */
interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  tags: string[];
  status: "upcoming" | "live" | "past";
  accentGradient: string;
  themeColor: string;
}

const EVENTS: EventData[] = [
  {
    id: "hackathon-2026",
    title: "ACM Hackathon 2026",
    date: "Aug 23-24, 2026",
    time: "10 AM - 10 AM (24h)",
    location: "BV Campus, Navi Mumbai",
    description:
      "Build, break, and ship in 24 hours! Join 200+ developers for ACM's flagship hackathon with exciting tracks, amazing prizes, and unlimited pizza.",
    tags: ["Rs.50K Prizes", "Swag", "Mentorship", "Certificates"],
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, #0d9488, #06b6d4)",
    themeColor: "#c43a31",
  },
  {
    id: "webdev-bootcamp",
    title: "Web Dev Bootcamp",
    date: "Sep 5-7, 2026",
    time: "2 PM - 5 PM",
    location: "CS Lab 301",
    description:
      "A hands-on 3-day bootcamp covering React, Next.js, and modern CSS. Build a real project from scratch and deploy it live.",
    tags: ["React", "Next.js", "Hands-on", "Free"],
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    themeColor: "#5b4cbc",
  },
  {
    id: "ai-workshop",
    title: "Intro to AI / ML Workshop",
    date: "Sep 15, 2026",
    time: "11 AM - 3 PM",
    location: "Auditorium B",
    description:
      "Dive into the fundamentals of machine learning with hands-on Python exercises. No prior ML experience needed - just curiosity!",
    tags: ["Python", "ML Basics", "Beginner Friendly"],
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    themeColor: "#1a8a2e",
  },
  {
    id: "open-source-sprint",
    title: "Open Source Sprint",
    date: "Oct 1-2, 2026",
    time: "All Day",
    location: "Online + Campus Hub",
    description:
      "Contribute to real open-source projects with ACM mentors. Learn Git workflows, write your first PR, and get your contributions counted for Hacktoberfest!",
    tags: ["Open Source", "Git", "Hacktoberfest", "Hybrid"],
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, #10b981, #059669)",
    themeColor: "#e83e8c",
  },
];

/* ------------------------------------------------------------------ */
/*  Event Card Component                                               */
/* ------------------------------------------------------------------ */
function EventCard({ event, index }: { event: EventData; index: number }) {
  const { user } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [regCount, setRegCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const illustration = getIllustrationForIndex(index);

  /* Check registration status + count on mount */
  const loadStatus = useCallback(async () => {
    await Promise.resolve();
    if (!user) {
      setRegistered(false);
      setChecking(false);
      return;
    }
    try {
      const [isReg, count] = await Promise.all([
        isUserRegistered(event.id, user.uid),
        getRegistrationCount(event.id),
      ]);
      setRegistered(isReg);
      setRegCount(count);
    } catch {
      /* Firestore not available or network error - silently fail */
    } finally {
      setChecking(false);
    }
  }, [user, event.id]);

  useEffect(() => {
    void Promise.resolve().then(loadStatus);
  }, [loadStatus]);

  /* Register for the event */
  const handleRegister = async () => {
    if (!user || loading) return;
    setLoading(true);
    try {
      await registerForEvent(event.id, user.uid, {
        displayName: user.displayName,
        email: user.email,
      });
      setRegistered(true);
      setRegCount((c) => c + 1);
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* Unregister from the event */
  const handleUnregister = async () => {
    if (!user || loading) return;
    setLoading(true);
    try {
      await unregisterFromEvent(event.id, user.uid);
      setRegistered(false);
      setRegCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Unregister failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = {
    upcoming: "Upcoming",
    live: "Live Now",
    past: "Completed",
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.1 * index,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ "--theme-color": event.themeColor } as React.CSSProperties}
    >
      {/* Top accent bar (hidden by CSS) */}
      <div
        className={styles.cardAccent}
        style={{ background: event.accentGradient }}
      />

      {/* Status badge */}
      <div
        className={
          event.status === "live"
            ? styles.statusLive
            : event.status === "past"
            ? styles.statusPast
            : styles.statusUpcoming
        }
      >
        {event.status === "live" && <span className={styles.liveDot} />}
        {statusLabel[event.status]}
      </div>

      {/* Content area: text + illustration side by side */}
      <div className={styles.cardContent}>
        <div className={styles.cardText}>
          <h3 className={styles.cardTitle}>{event.title}</h3>

          <div className={styles.cardMeta}>
            <span className={styles.cardMetaItem}>
              <span className={styles.metaLabel}>Date</span> {event.date}
            </span>
            <span className={styles.cardMetaItem}>
              <span className={styles.metaLabel}>Time</span> {event.time}
            </span>
            <span className={styles.cardMetaItem}>
              <span className={styles.metaLabel}>Venue</span> {event.location}
            </span>
          </div>

          <p className={styles.cardDesc}>{event.description}</p>
        </div>

        {/* Illustration */}
        <div className={styles.cardIllustration}>
          <Image
            src={illustration.src}
            alt={illustration.alt}
            width={160}
            height={160}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>

      {/* Tags */}
      <div className={styles.tags}>
        {event.tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>

      {/* Divider */}
      <hr className={styles.cardDivider} />

      {/* Footer */}
      <div className={styles.cardFooter}>
        <span className={styles.regCount}>
          {checking ? "..." : `${regCount} registered`}
        </span>

        <div className={styles.footerActions}>
          <button
            className={styles.viewEventBtn}
            onClick={() => setDetailsOpen(true)}
          >
            {registered && !checking ? "Registered" : "View Event"}
          </button>
        </div>
      </div>

      <EventDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        event={event}
        registered={registered}
        checking={checking}
        loading={loading}
        onRegister={handleRegister}
        onUnregister={handleUnregister}
        onRequireLogin={() => {
          setDetailsOpen(false);
          setLoginOpen(true);
        }}
      />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function EventsPage() {
  return (
    <div className={styles.pageContainer}>
      <motion.div
        className={styles.pageHeader}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.headerLeft}>
          <div className={styles.headerBar} />
          <h1 className={styles.pageTitle}>Upcoming Events</h1>
        </div>
      </motion.div>

      <div className={styles.eventsGrid}>
        {EVENTS.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}

