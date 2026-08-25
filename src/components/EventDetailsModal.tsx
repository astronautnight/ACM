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

  const hasDownloadableTicket =
    event.id === "hackathon-2026" || event.id === "egt-3-0";

  const handleDownloadCard = () => {
    const attendeeName = user?.displayName || "Rajas Berde";
    const year = "2nd Year";
    const department = event.id === "egt-3-0" ? "Computer Engineering" : "AI & ML";
    const accent = event.themeColor;
    const darkAccent = event.id === "egt-3-0" ? "#166534" : "#8f1d18";
    const eventDate = event.date.toUpperCase();
    const toRgb = (hex: string) => {
      const normalized = hex.replace("#", "");
      return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255);
    };
    const color = (hex: string, stroke = false) => `${toRgb(hex).map((value) => value.toFixed(3)).join(" ")} ${stroke ? "RG" : "rg"}`;
    const escapePdf = (value: string) => value.replace(/[^\x20-\x7E]/g, "?").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const text = (font: "F1" | "F2", size: number, x: number, y: number, value: string, fill = "#211f1c") =>
      `${color(fill)} BT /${font} ${size} Tf ${x} ${y} Td (${escapePdf(value)}) Tj ET`;
    const rectangle = (x: number, y: number, width: number, height: number, fill: string) => `${color(fill)} ${x} ${y} ${width} ${height} re f`;
    const titleLines = event.id === "egt-3-0"
      ? ["ENGINEERS GOT", "TALENT EGT 3.0"]
      : ["ACM HACKATHON", "2026"];
    const content = [
      rectangle(0, 0, 595, 842, "#e6dfd2"),
      rectangle(20, 20, 555, 802, "#f6f0e5"),
      `${color(darkAccent, true)} 3 w 20 20 555 802 re S`,
      rectangle(20, 708, 555, 114, accent),
      text("F2", 12, 48, 794, "ACM STUDENT CHAPTER", "#f8f3ea"),
      text("F2", 52, 48, 736, "EVENT", "#f8f3ea"),
      text("F2", 52, 198, 736, "TICKET", "#f8f3ea"),
      rectangle(47, 650, 225, 34, darkAccent),
      text("F2", 14, 61, 661, "UPCOMING EVENT", "#f8f3ea"),
      text("F1", 17, 48, 617, "Show up. Stand out. Make it yours.", darkAccent),
      text("F2", 34, 48, 557, titleLines[0]),
      text("F2", 34, 48, 516, titleLines[1]),
      `${color("#211f1c", true)} 1.5 w 48 493 m 547 493 l S`,
      rectangle(48, 446, 78, 25, accent),
      text("F2", 11, 59, 455, "DATE", "#f8f3ea"),
      text("F2", 20, 48, 418, eventDate),
      `${color("#211f1c", true)} 0.8 w 48 404 m 547 404 l S`,
      rectangle(48, 362, 92, 25, accent),
      text("F2", 11, 58, 371, "VENUE", "#f8f3ea"),
      text("F2", 18, 48, 335, event.location.toUpperCase()),
      `${color("#211f1c", true)} 0.8 w 48 321 m 547 321 l S`,
      rectangle(48, 279, 78, 25, accent),
      text("F2", 11, 59, 288, "TIME", "#f8f3ea"),
      text("F2", 18, 48, 251, event.time.toUpperCase()),
      `${color(darkAccent, true)} 1 w [4 4] 0 d 48 220 m 547 220 l S [] 0 d`,
      rectangle(48, 170, 125, 25, accent),
      text("F2", 11, 59, 179, "REGISTERED", "#f8f3ea"),
      text("F2", 24, 48, 139, attendeeName),
      text("F1", 13, 48, 117, `${year}  |  ${department}`, "#5a564e"),
      rectangle(380, 118, 145, 68, darkAccent),
      text("F2", 11, 411, 161, "STATUS", "#f8f3ea"),
      text("F2", 17, 399, 137, "REGISTERED", "#f8f3ea"),
      rectangle(20, 20, 555, 62, darkAccent),
      text("F2", 13, 48, 57, "READY TO MAKE AN IMPACT?", "#f8f3ea"),
      text("F1", 11, 48, 38, `SEE YOU AT ${event.title.toUpperCase()}`, "#f8f3ea"),
      ...Array.from({ length: 32 }, (_, index) => {
        const x = 476 + (index % 8) * 9;
        const y = 592 - Math.floor(index / 8) * 9;
        return `${color(accent)} ${x} ${y} 2.2 2.2 re f`;
      }),
    ].join("\n");

    const encoder = new TextEncoder();
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
      `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}\nendstream`,
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(encoder.encode(pdf).length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = encoder.encode(pdf).length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.id}-event-ticket.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
                <div className={styles.registeredActions}>
                  <button className={styles.regBtnRegistered} onClick={handleUnregisterClick}>
                    Cancel Registration
                  </button>
                  {hasDownloadableTicket && (
                    <button className={styles.downloadCardBtn} onClick={handleDownloadCard}>
                      Download Event Ticket
                    </button>
                  )}
                </div>
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
