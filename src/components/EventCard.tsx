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
import { getIllustrationForEvent } from "@/components/illustrations/TechIllustrations";
import styles from "../app/events/events.module.css";

/* ------------------------------------------------------------------ */
/*  Event data (Type reused)                                            */
/* ------------------------------------------------------------------ */
export interface EventData {
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

/* ------------------------------------------------------------------ */
/*  Event Card Component                                               */
/* ------------------------------------------------------------------ */
export function EventCard({ event, index }: { event: EventData; index: number }) {
  const { user, profile } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [regCount, setRegCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const illustration = getIllustrationForEvent(event.id, index);

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
        year: profile?.year,
        branch: profile?.branch,
        section: profile?.section,
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
    past: "Concluded",
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
      <div
        className={styles.cardAccent}
        style={{ background: event.accentGradient }}
      />
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
      <div className={styles.tags}>
        {event.tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
      <hr className={styles.cardDivider} />
      <div className={styles.cardFooter}>
        <span className={styles.regCount}>
          {user && event.status !== "past"
            ? checking
              ? "..."
              : `${regCount} registered`
            : ""}
        </span>
        <div className={styles.footerActions}>
          <button
            className={styles.viewEventBtn}
            onClick={() => setDetailsOpen(true)}
            style={{
              backgroundColor: event.status === "past" ? "#a8a29e" : "var(--theme-color)",
              borderColor: event.status === "past" ? "#a8a29e" : "var(--theme-color)"
            }}
          >
            {event.status === "past"
              ? "Concluded"
              : registered && !checking
              ? "Registered"
              : "View Event"}
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

