"use client";


import { motion } from "framer-motion";











import { EventCard } from "@/components/EventCard";
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
  hidden?: boolean;
}

const EVENTS: EventData[] = [
  {
    id: "system-on-trials",
    title: "System On Trials",
    date: "Sep 24, 2026",
    time: "9:15 AM - 12:15 PM",
    location: "Seminar Hall",
    description:
      "1. Each team has 3-5 members.\n2. Three teams compete in a single round debate.\n3. All topics are confidential and disclosed only during the event.\n4. A jury presents evidence and teams get a short time to think before debate resumes.\n5. One special guest with a legal background will be present as judge.",
    tags: ["Courtroom", "Exhibit X", "Debate", "Ethics"],
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, #d4af37, #b8860b, #8a6515)",
    themeColor: "#b8860b",
  },
  {
    id: "first-year-orientation",
    title: "First Year Orientation",
    date: "Aug 20, 2026",
    time: "1 PM - 4:30 PM",
    location: "CC Lab",
    description:
      "Design Roulette\nWhat happens when a Zombie gets a perfume, a Pirate gets instant noodles, and an Anime theme ties it all together? That was the challenge behind our first-year orientation event, Design Roulette, organized by ACM × BIS.\nStudents spun three wheels to randomly determine their client, product, and design theme—then had one shot to turn that unexpected combination into a compelling design. With combinations ranging from Barbie selling sneakers to Pirates selling noodles in an anime style, students had to think fast, get creative, and make the impossible look intentional.\nOne spin. Three constraints. One design. Make it count.",
    tags: ["Orientation", "Design", "Fun"],
    status: "past",
    accentGradient: "linear-gradient(135deg, #ec4899, #db2777)",
    themeColor: "#db2777",
  },
  {
    id: "egt-3-0",
    title: "Engineers Got Talent EGT 3.0",
    date: "Sep 25, 2026",
    time: "4 PM - 8 PM",
    location: "Seminar Hall",
    description:
      "A stage for engineers to share music, performances, and unexpected talents with the whole campus.",
    tags: ["Music", "Performance", "Open Stage"],
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, #166534, #22c55e)",
    themeColor: "#1a8a2e",
    hidden: true,
  },
];

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
        {EVENTS.filter((event) => !event.hidden).map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}
