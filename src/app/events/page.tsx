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
}

const EVENTS: EventData[] = [
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

