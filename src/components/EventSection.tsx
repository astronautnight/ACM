"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./EventSection.module.css";
import { getIllustrationForEvent } from "@/components/illustrations/TechIllustrations";
import { useAuth } from "@/context/AuthContext";
import {
  registerForEvent,
  unregisterFromEvent,
  isUserRegistered,
} from "@/lib/events";
import EventDetailsModal from "@/components/EventDetailsModal";
import LoginModal from "@/components/LoginModal";
const EVENTS = [
  {
    id: "first-year-orientation",
    title: "First Year Orientation",
    date: "Aug 20, 2026",
    time: "1 PM - 4:30 PM",
    location: "CC Lab",
    description: "Design Roulette...",
    tags: ["Orientation", "Design", "Fun"],
    status: "past" as const,
    accentGradient: "linear-gradient(135deg, #ec4899, #db2777)",
    themeColor: "#db2777"
  },
  {
    id: "system-on-trials",
    title: "SOT 2.0",
    date: "Sep 24, 2026",
    time: "9:15 AM - 12:15 PM",
    location: "Seminar Hall",
    description: "1. Each team has 3-5 members.\n2. Three teams compete in a single round debate.\n3. All topics are confidential and disclosed only during the event.\n4. A jury presents evidence and teams get a short time to think before debate resumes.\n5. One special guest with a legal background will be present as judge.",
    tags: ["Courtroom", "Exhibit X", "Debate", "Ethics"],
    status: "upcoming" as const,
    accentGradient: "linear-gradient(135deg, #d4af37, #b8860b, #8a6515)",
    themeColor: "#b8860b"
  },
  {
    id: "egt-3-0",
    title: "Engineers Got Talent EGT 3.0",
    date: "Sep 25, 2026",
    time: "4 PM - 8 PM",
    location: "Seminar Hall",
    description: "A stage for engineers to share music, performances, and unexpected talents with the whole campus.",
    tags: ["Music", "Performance", "Open Stage"],
    status: "upcoming" as const,
    accentGradient: "linear-gradient(135deg, #166534, #22c55e)",
    themeColor: "#1a8a2e",
    hidden: true,
  },
];

type EventItem = (typeof EVENTS)[number];

function EventCardItem({ event, index }: { event: EventItem; index: number }) {
  const { user, profile } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [checking, setChecking] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkReg() {
      if (!user) {
        setChecking(false);
        return;
      }
      try {
        const isReg = await isUserRegistered(event.id, user.uid);
        setRegistered(isReg);
      } catch {
      } finally {
        setChecking(false);
      }
    }
    void checkReg();
  }, [user, event.id]);

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
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUnregister = async () => {
    if (!user || loading) return;
    setLoading(true);
    try {
      await unregisterFromEvent(event.id, user.uid);
      setRegistered(false);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <>
      <motion.div className={styles.card} whileHover={{ y: -2 }} style={{ "--theme-color": event.themeColor } as React.CSSProperties}>
        <div className={styles.cardContent}>
          <div className={styles.cardText}>
            <h3 className={styles.cardTitle}>{event.title}</h3>
            <div className={styles.cardMeta}>
              <span>{event.date}</span>
              <span>{event.time}</span>
              <span>{event.location}</span>
            </div>
          </div>
          <div className={styles.cardIllustration}>
            <Image
              src={getIllustrationForEvent(event.id, index).src}
              alt={event.title}
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div className={styles.cardFooter}>
          <button
            className={styles.viewEventBtn}
            onClick={() => setDetailsOpen(true)}
            style={{
              backgroundColor: event.status === "past" ? "#a8a29e" : event.themeColor,
              borderColor: event.status === "past" ? "#a8a29e" : event.themeColor
            }}
          >
            {checking ? "..." : event.status === "past" ? "Concluded" : registered ? "Registered" : "View Event"}
          </button>
        </div>
      </motion.div>
      <EventDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        event={event}
        registered={registered}
        checking={checking}
        loading={loading}
        onRegister={handleRegister}
        onUnregister={handleUnregister}
        onRequireLogin={() => { setDetailsOpen(false); setLoginOpen(true); }}
        onRegistrationSuccess={() => setRegistered(true)}
      />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default function EventSection() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Upcoming Events</h2>
      </div>
      <div className={styles.grid}>
        {EVENTS.filter((event) => !("hidden" in event && event.hidden)).map((event, i) => (
          <EventCardItem key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}
