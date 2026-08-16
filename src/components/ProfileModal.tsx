"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/users";
import styles from "./ProfileModal.module.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load existing profile details when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFetching(true);
      setError(null);
      setSuccess(false);
      getUserProfile(user.uid)
        .then((data) => {
          if (data) {
            setYear(data.year || "");
            setBranch(data.branch || "");
            setSection(data.section || "");
          }
        })
        .catch((err) => {
          console.error("Failed to load profile details:", err);
          setError("Failed to load profile details.");
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [isOpen, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserProfile(user.uid, {
        year,
        branch,
        section,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
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

            <h2 className={styles.title}>Edit Profile</h2>
            <p className={styles.subtitle}>Update your academic information for event registrations</p>

            {fetching ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <span style={{ fontSize: "0.9rem", opacity: 0.6 }}>Loading profile...</span>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                {error && <div className={styles.errorMsg}>{error}</div>}
                {success && <div className={styles.successMsg}>Profile updated successfully!</div>}

                <div className={styles.formGroup}>
                  <label htmlFor="year-select" className={styles.label}>Academic Year</label>
                  <select
                    id="year-select"
                    className={styles.select}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Year</option>
                    <option value="First Year">First Year (FE)</option>
                    <option value="Second Year">Second Year (SE)</option>
                    <option value="Third Year">Third Year (TE)</option>
                    <option value="Fourth Year">Fourth Year (BE)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="branch-select" className={styles.label}>Branch</label>
                  <select
                    id="branch-select"
                    className={styles.select}
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Branch</option>
                    <option value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</option>
                    <option value="Computer Science Engineering">Computer Science Engineering</option>
                    <option value="Computer System with Business Administration">Computer System with Business Administration</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="section-input" className={styles.label}>Section / Division</label>
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
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
