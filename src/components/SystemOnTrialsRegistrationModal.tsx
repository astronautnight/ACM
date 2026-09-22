"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { registerForEvent } from "@/lib/events";
import { GavelIcon, ScalesOfJusticeIcon, CourtEmblemIcon } from "@/components/icons/JusticeIcons";
import styles from "./SystemOnTrialsRegistrationModal.module.css";

interface SystemOnTrialsRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDownloadTicket?: () => void;
}

interface MemberData {
  fullName: string;
  email: string;
  contactNumber: string;
  yearClass: string;
  department: string;
}

export default function SystemOnTrialsRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  onDownloadTicket,
}: SystemOnTrialsRegistrationModalProps) {
  const { user, profile } = useAuth();

  // Section 1 — Team Details
  const [teamName, setTeamName] = useState("");
  const [collegeDepartment, setCollegeDepartment] = useState("");
  const [teamSize, setTeamSize] = useState<3 | 4 | 5>(3);
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("");
  const [teamLeaderContact, setTeamLeaderContact] = useState("");

  // Section 2 — Team Members
  const [members, setMembers] = useState<MemberData[]>([
    { fullName: "", email: "", contactNumber: "", yearClass: "", department: "" }, // Member 1 (Leader)
    { fullName: "", email: "", contactNumber: "", yearClass: "", department: "" }, // Member 2
    { fullName: "", email: "", contactNumber: "", yearClass: "", department: "" }, // Member 3
    { fullName: "", email: "", contactNumber: "", yearClass: "", department: "" }, // Member 4
    { fullName: "", email: "", contactNumber: "", yearClass: "", department: "" }, // Member 5
  ]);

  // Section 4 — Declaration
  const [declaration1, setDeclaration1] = useState(false);
  const [declaration2, setDeclaration2] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [gavelStruck, setGavelStruck] = useState(false);

  // Sync leader info with Member 1
  const updateMember = (index: number, field: keyof MemberData, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Pre-fill user profile defaults on open
  useEffect(() => {
    if (user && isOpen) {
      const name = user.displayName || "";
      const mail = user.email || "";
      setTeamLeaderName((prev) => prev || name);
      setTeamLeaderEmail((prev) => prev || mail);
      setMembers((prev) => {
        const updated = [...prev];
        if (!updated[0].fullName) updated[0].fullName = name;
        if (!updated[0].email) updated[0].email = mail;
        if (profile?.branch && !updated[0].department) updated[0].department = profile.branch;
        if (profile?.year && !updated[0].yearClass) updated[0].yearClass = profile.year;
        return updated;
      });
      if (profile?.branch) {
        setCollegeDepartment((prev) => prev || profile.branch || "");
      }
    }
  }, [user, profile, isOpen]);

  // Auto-sync Team Leader fields to Member 1 if Member 1 hasn't deviated
  const handleLeaderNameChange = (val: string) => {
    setTeamLeaderName(val);
    updateMember(0, "fullName", val);
  };

  const handleLeaderEmailChange = (val: string) => {
    setTeamLeaderEmail(val);
    updateMember(0, "email", val);
  };

  const handleLeaderContactChange = (val: string) => {
    setTeamLeaderContact(val);
    updateMember(0, "contactNumber", val);
  };

  // Reset modal state
  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setGavelStruck(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || submitting) return;

    if (!declaration1 || !declaration2) {
      alert("Please accept both declaration checkboxes to proceed with court registration.");
      return;
    }

    setSubmitting(true);
    setGavelStruck(true);

    const activeMembers = members.slice(0, teamSize);

    try {
      await registerForEvent("system-on-trials", user.uid, {
        displayName: teamLeaderName || user.displayName,
        email: teamLeaderEmail || user.email,
        year: activeMembers[0].yearClass,
        branch: activeMembers[0].department,
        section: profile?.section,
        // @ts-expect-error extra fields stored in firestore
        teamName,
        collegeDepartment,
        teamSize: `${teamSize} Members`,
        teamLeaderName,
        teamLeaderEmail,
        teamLeaderContact,
        teamMembers: activeMembers,
        declarationsAccepted: true,
        registeredAt: new Date().toISOString(),
      });

      onSuccess();
      setIsSuccess(true);
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Failed to confirm registration. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
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
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerTopRow}>
                <div className={styles.courtBadge}>
                  <CourtEmblemIcon size={16} color="#f7e7a8" />
                  ACM Judicial Chambers • Official Registration
                </div>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Dismiss">
                  ✕
                </button>
              </div>

              <div className={styles.titleArea}>
                <div className={styles.headerIcons}>
                  <GavelIcon size={28} color="#b8860b" />
                  <ScalesOfJusticeIcon size={28} color="#b8860b" />
                </div>
                <div>
                  <h2 className={styles.title}>System on Trials</h2>
                  <p className={styles.subtitle}>Team Registration & Official Court Appearance Form</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {isSuccess ? (
              <div className={styles.successContainer}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CourtEmblemIcon size={64} color="#b8860b" />
                </motion.div>

                <span className={styles.successBadge}>Verdict: Appearance Entered</span>
                <h3 className={styles.successTitle}>Registration Confirmed</h3>
                <p className={styles.successText}>
                  Your team <strong>{teamName}</strong> has been officially confirmed on the court docket for <strong>SYSTEM ON TRIALS</strong> on September 25, 2026.
                </p>

                <div className={styles.verdictDocket}>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>Case Ref</span>
                    <span className={styles.docketVal}>SOT-2026-ACM</span>
                  </div>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>Team Name</span>
                    <span className={styles.docketVal}>{teamName}</span>
                  </div>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>Team Leader</span>
                    <span className={styles.docketVal}>{teamLeaderName}</span>
                  </div>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>Team Size</span>
                    <span className={styles.docketVal}>{teamSize} Members</span>
                  </div>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>Date & Time</span>
                    <span className={styles.docketVal}>Sep 25, 2026 • 10:00 AM - 12:00 PM (Tentative)</span>
                  </div>
                </div>

                <div className={styles.successActions}>
                  {onDownloadTicket && (
                    <button className={styles.downloadTicketBtn} onClick={onDownloadTicket}>
                      <GavelIcon size={16} color="#f7e7a8" />
                      Download Court Docket Ticket
                    </button>
                  )}
                  <button className={styles.doneBtn} onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                <div className={styles.body}>
                  {/* Section 1 — Team Details */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <GavelIcon size={16} color="#4a3810" />
                        Section 1 — Team Details
                      </h4>
                      <span className={styles.sectionTag}>Required</span>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Team Name <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          className={styles.input}
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Enter team name"
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Department <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <select
                          required
                          className={styles.select}
                          value={collegeDepartment}
                          onChange={(e) => setCollegeDepartment(e.target.value)}
                        >
                          <option value="" disabled>Select Department</option>
                          <option value="AIML">AIML</option>
                          <option value="CSE">CSE</option>
                          <option value="CSBS">CSBS</option>
                          <option value="IT">IT</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Team Size <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <select
                          required
                          className={styles.select}
                          value={teamSize}
                          onChange={(e) => setTeamSize(Number(e.target.value) as 3 | 4 | 5)}
                        >
                          <option value={3}>3 Members</option>
                          <option value={4}>4 Members</option>
                          <option value={5}>5 Members</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Team Leader Name <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          className={styles.input}
                          value={teamLeaderName}
                          onChange={(e) => handleLeaderNameChange(e.target.value)}
                          placeholder="Full name of leader"
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Team Leader Email <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <input
                          type="email"
                          required
                          className={styles.input}
                          value={teamLeaderEmail}
                          onChange={(e) => handleLeaderEmailChange(e.target.value)}
                          placeholder="leader@bvdet.edu.in"
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Team Leader Contact Number <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          className={styles.input}
                          value={teamLeaderContact}
                          onChange={(e) => handleLeaderContactChange(e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2 — Team Members */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <ScalesOfJusticeIcon size={16} color="#4a3810" />
                        Section 2 — Team Members ({teamSize} Members Compulsory)
                      </h4>
                      <span className={styles.sectionTag}>{teamSize} Members</span>
                    </div>

                    {/* Member 1 – Team Leader */}
                    <div className={`${styles.memberCard} ${styles.memberCardLeader}`}>
                      <div className={styles.memberHeader}>
                        <h5 className={styles.memberNameTitle}>
                          <CourtEmblemIcon size={16} color="#4a3810" />
                          Member 1 – Team Leader
                        </h5>
                        <span className={styles.memberBadge}>Lead Counsel</span>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Full Name <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className={styles.input}
                            value={members[0].fullName}
                            onChange={(e) => updateMember(0, "fullName", e.target.value)}
                            placeholder="Full Name"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Email ID <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="email"
                            required
                            className={styles.input}
                            value={members[0].email}
                            onChange={(e) => updateMember(0, "email", e.target.value)}
                            placeholder="Email ID"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Contact Number <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            className={styles.input}
                            value={members[0].contactNumber}
                            onChange={(e) => updateMember(0, "contactNumber", e.target.value)}
                            placeholder="Contact Number"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Year / Class <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className={styles.input}
                            value={members[0].yearClass}
                            onChange={(e) => updateMember(0, "yearClass", e.target.value)}
                            placeholder="e.g. FE, SE, TE, BE"
                          />
                        </div>
                        <div className={`${styles.fieldGroup} ${styles.formGridFull}`}>
                          <label className={styles.fieldLabel}>
                            Department <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <select
                            required
                            className={styles.select}
                            value={members[0].department}
                            onChange={(e) => updateMember(0, "department", e.target.value)}
                          >
                            <option value="" disabled>Select Department</option>
                            <option value="AIML">AIML</option>
                            <option value="CSE">CSE</option>
                            <option value="CSBS">CSBS</option>
                            <option value="IT">IT</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Member 2 */}
                    <div className={styles.memberCard}>
                      <div className={styles.memberHeader}>
                        <h5 className={styles.memberNameTitle}>
                          <GavelIcon size={16} color="#b8860b" />
                          Member 2
                        </h5>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Full Name <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className={styles.input}
                            value={members[1].fullName}
                            onChange={(e) => updateMember(1, "fullName", e.target.value)}
                            placeholder="Full Name"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Email ID <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="email"
                            required
                            className={styles.input}
                            value={members[1].email}
                            onChange={(e) => updateMember(1, "email", e.target.value)}
                            placeholder="Email ID"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Contact Number <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            className={styles.input}
                            value={members[1].contactNumber}
                            onChange={(e) => updateMember(1, "contactNumber", e.target.value)}
                            placeholder="Contact Number"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Year / Class <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className={styles.input}
                            value={members[1].yearClass}
                            onChange={(e) => updateMember(1, "yearClass", e.target.value)}
                            placeholder="e.g. FE, SE, TE, BE"
                          />
                        </div>
                        <div className={`${styles.fieldGroup} ${styles.formGridFull}`}>
                          <label className={styles.fieldLabel}>
                            Department <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <select
                            required
                            className={styles.select}
                            value={members[1].department}
                            onChange={(e) => updateMember(1, "department", e.target.value)}
                          >
                            <option value="" disabled>Select Department</option>
                            <option value="AIML">AIML</option>
                            <option value="CSE">CSE</option>
                            <option value="CSBS">CSBS</option>
                            <option value="IT">IT</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Member 3 */}
                    <div className={styles.memberCard}>
                      <div className={styles.memberHeader}>
                        <h5 className={styles.memberNameTitle}>
                          <GavelIcon size={16} color="#b8860b" />
                          Member 3
                        </h5>
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Full Name <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className={styles.input}
                            value={members[2].fullName}
                            onChange={(e) => updateMember(2, "fullName", e.target.value)}
                            placeholder="Full Name"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Email ID <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="email"
                            required
                            className={styles.input}
                            value={members[2].email}
                            onChange={(e) => updateMember(2, "email", e.target.value)}
                            placeholder="Email ID"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Contact Number <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            className={styles.input}
                            value={members[2].contactNumber}
                            onChange={(e) => updateMember(2, "contactNumber", e.target.value)}
                            placeholder="Contact Number"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>
                            Year / Class <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className={styles.input}
                            value={members[2].yearClass}
                            onChange={(e) => updateMember(2, "yearClass", e.target.value)}
                            placeholder="e.g. FE, SE, TE, BE"
                          />
                        </div>
                        <div className={`${styles.fieldGroup} ${styles.formGridFull}`}>
                          <label className={styles.fieldLabel}>
                            Department <span className={styles.requiredAsterisk}>*</span>
                          </label>
                          <select
                            required
                            className={styles.select}
                            value={members[2].department}
                            onChange={(e) => updateMember(2, "department", e.target.value)}
                          >
                            <option value="" disabled>Select Department</option>
                            <option value="AIML">AIML</option>
                            <option value="CSE">CSE</option>
                            <option value="CSBS">CSBS</option>
                            <option value="IT">IT</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Member 4 (Only if 4 or 5 Members) */}
                    {teamSize >= 4 && (
                      <div className={styles.memberCard}>
                        <div className={styles.memberHeader}>
                          <h5 className={styles.memberNameTitle}>
                            <GavelIcon size={16} color="#b8860b" />
                            Member 4
                          </h5>
                        </div>
                        <div className={styles.formGrid}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                              Full Name <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                              type="text"
                              required
                              className={styles.input}
                              value={members[3].fullName}
                              onChange={(e) => updateMember(3, "fullName", e.target.value)}
                              placeholder="Full Name"
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                              Email ID <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                              type="email"
                              required
                              className={styles.input}
                              value={members[3].email}
                              onChange={(e) => updateMember(3, "email", e.target.value)}
                              placeholder="Email ID"
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                              Contact Number <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              className={styles.input}
                              value={members[3].contactNumber}
                              onChange={(e) => updateMember(3, "contactNumber", e.target.value)}
                              placeholder="Contact Number"
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                              Year / Class <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                              type="text"
                              required
                              className={styles.input}
                              value={members[3].yearClass}
                              onChange={(e) => updateMember(3, "yearClass", e.target.value)}
                              placeholder="e.g. FE, SE, TE, BE"
                            />
                          </div>
                          <div className={`${styles.fieldGroup} ${styles.formGridFull}`}>
                            <label className={styles.fieldLabel}>
                              Department <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <select
                              required
                              className={styles.select}
                              value={members[3].department}
                              onChange={(e) => updateMember(3, "department", e.target.value)}
                            >
                              <option value="" disabled>Select Department</option>
                              <option value="AIML">AIML</option>
                              <option value="CSE">CSE</option>
                              <option value="CSBS">CSBS</option>
                              <option value="IT">IT</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Member 5 (Only if 5 Members) */}
                    {teamSize === 5 && (
                      <div className={styles.memberCard}>
                        <div className={styles.memberHeader}>
                          <h5 className={styles.memberNameTitle}>
                            <GavelIcon size={16} color="#b8860b" />
                            Member 5
                          </h5>
                        </div>
                        <div className={styles.formGrid}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                              Full Name <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                              type="text"
                              required
                              className={styles.input}
                              value={members[4].fullName}
                              onChange={(e) => updateMember(4, "fullName", e.target.value)}
                              placeholder="Full Name"
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                              Email ID <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                              type="email"
                              required
                              className={styles.input}
                              value={members[4].email}
                              onChange={(e) => updateMember(4, "email", e.target.value)}
                              placeholder="Email ID"
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                              Contact Number <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              className={styles.input}
                              value={members[4].contactNumber}
                              onChange={(e) => updateMember(4, "contactNumber", e.target.value)}
                              placeholder="Contact Number"
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                              Year / Class <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                              type="text"
                              required
                              className={styles.input}
                              value={members[4].yearClass}
                              onChange={(e) => updateMember(4, "yearClass", e.target.value)}
                              placeholder="e.g. FE, SE, TE, BE"
                            />
                          </div>
                          <div className={`${styles.fieldGroup} ${styles.formGridFull}`}>
                            <label className={styles.fieldLabel}>
                              Department <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <select
                              required
                              className={styles.select}
                              value={members[4].department}
                              onChange={(e) => updateMember(4, "department", e.target.value)}
                            >
                              <option value="" disabled>Select Department</option>
                              <option value="AIML">AIML</option>
                              <option value="CSE">CSE</option>
                              <option value="CSBS">CSBS</option>
                              <option value="IT">IT</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 4 — Declaration */}
                  <div className={styles.declarationSection}>
                    <div className={styles.sectionHeader} style={{ borderBottomColor: "#b8860b" }}>
                      <h4 className={styles.sectionTitle}>
                        <CourtEmblemIcon size={16} color="#4a3810" />
                        Section 4 — Declaration
                      </h4>
                      <span className={styles.sectionTag}>Compulsory</span>
                    </div>

                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        required
                        className={styles.checkboxInput}
                        checked={declaration1}
                        onChange={(e) => setDeclaration1(e.target.checked)}
                      />
                      <span className={styles.checkboxLabel}>
                        I confirm that all information provided above is correct and that all team members agree to participate in <strong>SYSTEM ON TRIALS</strong>.
                      </span>
                    </label>

                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        required
                        className={styles.checkboxInput}
                        checked={declaration2}
                        onChange={(e) => setDeclaration2(e.target.checked)}
                      />
                      <span className={styles.checkboxLabel}>
                        I agree to follow the event rules, including courtroom decorum, no personal attacks/offensive language, and the organizers&apos; instructions. The event rules state that only registered participants may speak and that judges&apos; decisions are final and binding.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                  <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={submitting}>
                    Dismiss
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting || !declaration1 || !declaration2}
                    style={{
                      transform: gavelStruck ? "scale(0.98)" : undefined,
                    }}
                  >
                    <GavelIcon size={18} color="#2b2008" />
                    {submitting ? "Deliberating..." : "Confirm Registration"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
