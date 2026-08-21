"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
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
  themeColor: string;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
  registered: boolean;
  checking: boolean;
  loading: boolean;
  onRegister: () => void;
  onUnregister: () => void;
  onRequireLogin: () => void;
}

// Pre-defined detailed programs / agendas for each event
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

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  registered,
  checking,
  loading,
  onRegister,
  onUnregister,
  onRequireLogin,
}: EventDetailsModalProps) {
  const { user } = useAuth();
  const [confirmMode, setConfirmMode] = useState<"register" | "unregister" | null>(null);
  const program = PROGRAMS[event.id] || [];

  // Reset confirm state when the modal closes or registration status changes
  useEffect(() => {
    if (!isOpen) setConfirmMode(null);
  }, [isOpen]);

  useEffect(() => {
    setConfirmMode(null);
  }, [registered]);

  const handleRegisterClick = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setConfirmMode("register");
  };

  const handleUnregisterClick = () => {
    setConfirmMode("unregister");
  };

  const handleConfirm = () => {
    if (confirmMode === "register") {
      onRegister();
    } else if (confirmMode === "unregister") {
      onUnregister();
    }
    setConfirmMode(null);
  };

  const statusLabel = {
    upcoming: "Upcoming",
    live: "Live Now",
    past: "Completed",
  };

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
          style={{ "--theme-color": event.themeColor } as React.CSSProperties}
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
              x
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderAccent} />
              <div
                className={
                  event.status === "live"
                    ? styles.statusLive
                    : event.status === "past"
                    ? styles.statusPast
                    : styles.statusUpcoming
                }
              >
                {statusLabel[event.status]}
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
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer: Registration CTA */}
            <div className={styles.modalFooter}>
              {checking || loading ? (
                <button className={styles.regBtnLoading} disabled>
                  <span className={styles.spinner} />
                  {checking ? "Checking..." : "Processing..."}
                </button>
              ) : event.status === "past" ? (
                <button className={styles.regBtnDisabled} disabled>
                  Event Ended
                </button>
              ) : confirmMode === "register" ? (
                <div className={styles.confirmBox}>
                  <p className={styles.confirmTitle}>Confirm Registration</p>
                  <div className={styles.confirmDetails}>
                    <span>Date: {event.date}</span>
                    <span>Time: {event.time}</span>
                    <span>Venue: {event.location}</span>
                  </div>
                  <div className={styles.confirmActions}>
                    <button className={styles.confirmCancel} onClick={() => setConfirmMode(null)}>
                      Cancel
                    </button>
                    <button className={styles.confirmAccept} onClick={handleConfirm}>
                      Confirm Registration
                    </button>
                  </div>
                </div>
              ) : confirmMode === "unregister" ? (
                <div className={styles.confirmBox}>
                  <p className={styles.confirmTitle}>Cancel Registration?</p>
                  <p className={styles.confirmSubtitle}>
                    Are you sure you want to withdraw from {event.title}?
                  </p>
                  <div className={styles.confirmActions}>
                    <button className={styles.confirmCancel} onClick={() => setConfirmMode(null)}>
                      Keep Registration
                    </button>
                    <button className={styles.confirmUnregister} onClick={handleConfirm}>
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              ) : !user ? (
                <button className={styles.regBtnNotRegistered} onClick={onRequireLogin}>
                  Sign in to Register
                </button>
              ) : registered ? (
                <button className={styles.regBtnRegistered} onClick={handleUnregisterClick}>
                  Registered — Cancel Registration
                </button>
              ) : (
                <button className={styles.regBtnNotRegistered} onClick={handleRegisterClick}>
                  Register for Event
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
