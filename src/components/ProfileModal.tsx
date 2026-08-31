"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import styles from "./ProfileModal.module.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnboarding?: boolean;
}

export default function ProfileModal({ isOpen, onClose, isOnboarding = false }: ProfileModalProps) {
  const { user, profile, saveProfile } = useAuth();
  
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sync fields with existing profile details whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      if (profile) {
        setYear(profile.year || "");
        setBranch(profile.branch || "");
        setSection(profile.section || "");
      }
    }
  }, [isOpen, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!year || !branch || !section.trim()) {
      setError("Please fill in all required academic fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await saveProfile({
        year,
        branch,
        section: section.trim().toUpperCase(),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      console.error("Profile save failed:", err);
      const message = err instanceof Error ? err.message : "Failed to save profile";
      setError(message);
    } finally {
      setLoading(false);
    }
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

            <h2 className={styles.title}>
              {isOnboarding ? "Complete Profile" : "Edit Profile"}
            </h2>
            <p className={styles.subtitle}>
              {isOnboarding
                ? "Welcome! Please enter your academic details to finish setting up your account."
                : "Update your academic information for event registrations"}
            </p>

            <form onSubmit={handleSave}>
              {error && <div className={styles.errorMsg}>{error}</div>}
              {success && <div className={styles.successMsg}>Profile updated successfully!</div>}

              <div className={styles.formGroup}>
                <label htmlFor="year-select" className={styles.label}>Academic Year *</label>
                <select
                  id="year-select"
                  className={styles.select}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Year</option>
                  <option value="First Year">FE - First Year</option>
                  <option value="Second Year">SE - Second Year</option>
                  <option value="Third Year">TE - Third Year</option>
                  <option value="Fourth Year">BE - Fourth Year</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="branch-select" className={styles.label}>Branch *</label>
                <select
                  id="branch-select"
                  className={styles.select}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Branch</option>
                  <option value="AIML">AIML - Artificial Intelligence & Machine Learning</option>
                  <option value="CSE">CSE - Computer Science & Engineering</option>
                  <option value="CSBA">CSBA - Computer Systems & Business Administration</option>
                  <option value="IT">IT - Information Technology</option>
                  <option value="EXTC">EXTC - Electronics & Telecommunication</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="section-input" className={styles.label}>Section / Division *</label>
                <input
                  id="section-input"
                  type="text"
                  className={styles.input}
                  placeholder="e.g. A, B, C, D"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.btnSave}
                disabled={loading}
              >
                {loading ? "Saving..." : isOnboarding ? "Complete Setup" : "Save Profile"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


