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
    id: "hackathon-2026",
    title: "ACM Hackathon 2026",
    date: "Aug 23-24, 2026",
    time: "10 AM - 10 AM",
    location: "BV Campus, Navi Mumbai",
    description: "Build, break, and ship in 24 hours! Join 200+ developers for ACM's flagship hackathon with exciting tracks, amazing prizes, and unlimited pizza.",
    tags: ["Rs.50K Prizes", "Swag", "Mentorship", "Certificates"],
    status: "upcoming" as const,
    accentGradient: "linear-gradient(135deg, #8f1d18, #c43a31)",
    themeColor: "#c43a31"
  },
  {
    id: "webdev-bootcamp",
    title: "Web Dev Bootcamp",
    date: "Sep 5-7, 2026",
    time: "2 PM - 5 PM",
    location: "CS Lab 301",
    description: "A hands-on 3-day bootcamp covering React, Next.js, and modern CSS. Build a real project from scratch and deploy it live.",
    tags: ["React", "Next.js", "Hands-on", "Free"],
    status: "upcoming" as const,
    accentGradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    themeColor: "#5b4cbc"
  },
  {
    id: "ai-workshop",
    title: "Intro to AI / ML Workshop",
    date: "Sep 15, 2026",
    time: "11 AM - 3 PM",
    location: "Auditorium B",
    description: "Dive into the fundamentals of machine learning with hands-on Python exercises. No prior ML experience needed - just curiosity!",
    tags: ["Python", "ML Basics", "Beginner Friendly"],
    status: "upcoming" as const,
    accentGradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    themeColor: "#1a8a2e"
  },
  {
    id: "egt-3-0",
    title: "Engineers Got Talent EGT 3.0",
    date: "Sep 5, 2026",
    time: "4 PM - 8 PM",
    location: "Main Auditorium",
    description: "A stage for engineers to share music, performances, and unexpected talents with the whole campus.",
    tags: ["Music", "Performance", "Open Stage"],
    status: "upcoming" as const,
    accentGradient: "linear-gradient(135deg, #166534, #22c55e)",
    themeColor: "#1a8a2e"
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
        {EVENTS.map((event, i) => (
          <EventCardItem key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}
