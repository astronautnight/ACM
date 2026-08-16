"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./EventDetailsModal.module.css";

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
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
}

const TAG_ICONS: Record<string, string> = {
  "₹50K Prizes": "🏆",
  Swag: "🎁",
  Mentorship: "⭐",
  Certificates: "📜",
  React: "⚛️",
  "Next.js": "Ⓝ",
  "Hands-on": "</>",
  Free: "🆓",
  Python: "🐍",
  "ML Basics": "🧠",
  "Beginner Friendly": "🌱",
  "Open Source": "🌐",
  Git: "🔀",
  Hacktoberfest: "🎃",
  Hybrid: "🔗",
};

// Pre-defined detailed programs / agendas for each event to show real curriculum details
const PROGRAMS: Record<string, { time: string; details: string }[]> = {
  "hackathon-2026": [
    { time: "10:00 AM", details: "Check-in, Registration & Networking Breakfast" },
    { time: "11:00 AM", details: "Opening Ceremony, Guidelines & Theme Announcement" },
    { time: "12:00 PM", details: "Hacking phase begins! Teams start brainstorm & coding" },
    { time: "02:30 PM", details: "Mentor Session: Speed design reviews & validation" },
    { time: "08:00 PM", details: "Dinner serving & progress checkpoint reviews" },
    { time: "12:00 AM", details: "Midnight Coding Challenge with special bonus prizes" },
    { time: "08:00 AM", details: "Breakfast & Devpost submission final preparation" },
    { time: "10:00 AM", details: "Project Demos, Judging panels & Closing awards ceremony" },
  ],
  "webdev-bootcamp": [
    { time: "Day 1", details: "Modern HTML5 Semantic markup, Flexbox, CSS Grid & Responsive layouts" },
    { time: "Day 2", details: "Deep dive into React core concepts, hooks (useState, useEffect), and JSX" },
    { time: "Day 3", details: "Next.js routing, server vs client rendering, state, and deploying to Vercel" },
  ],
  "ai-workshop": [
    { time: "11:00 AM", details: "Introduction to Machine Learning, Regression vs Classification" },
    { time: "11:45 AM", details: "Python libraries workshop: NumPy, Pandas & Data structures" },
    { time: "01:00 PM", details: "Lunch Break & Peer interaction" },
    { time: "01:45 PM", details: "Hands-on: Training a prediction model using Scikit-Learn" },
    { time: "02:30 PM", details: "Building simple Neural Networks & Q&A session" },
  ],
  "open-source-sprint": [
    { time: "Day 1", details: "Git essentials: branches, resolving merge conflicts, and PR conventions" },
    { time: "Day 2", details: "Live hacking sprint: Claiming issues, writing tests, and filing your first pull request" },
  ],
};

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  const program = PROGRAMS[event.id] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              ×
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderAccent} style={{ background: event.accentGradient }} />
              <div
                className={
                  event.status === "live"
                    ? styles.statusLive
                    : event.status === "past"
                    ? styles.statusPast
                    : styles.statusUpcoming
                }
              >
                {event.status === "live" ? "Live Now" : event.status === "past" ? "Completed" : "Upcoming"}
              </div>
              <h2 className={styles.title}>{event.title}</h2>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Date</span>
                  <span className={styles.metaValue}>{event.date}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Time</span>
                  <span className={styles.metaValue}>{event.time}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Location</span>
                  <span className={styles.metaValue}>{event.location}</span>
                </div>
              </div>

              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>About the Event</h4>
                <p className={styles.description}>{event.description}</p>
              </div>

              {program.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Program Schedule</h4>
                  <div className={styles.timeline}>
                    {program.map((item, idx) => (
                      <div key={idx} className={styles.timelineItem}>
                        <span className={styles.timelineTime}>{item.time}</span>
                        <p className={styles.timelineContent}>{item.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Tags & Perks</h4>
                <div className={styles.tags}>
                  {event.tags.map((t) => (
                    <span key={t} className={styles.tag}>
                      {TAG_ICONS[t] && <span style={{ marginRight: '4px' }}>{TAG_ICONS[t]}</span>}
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
