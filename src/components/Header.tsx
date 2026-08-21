"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";
import ProfileModal from "./ProfileModal";
import Image from "next/image";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
  };

  return (
    <>
      <motion.header
        className={styles.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/" className={styles.logo}>
          <Image src="/acm-logo.png" alt="ACM Logo" width={32} height={32} className={styles.logoImg} />
          <span>ACM</span>
        </Link>
        <nav>
          <ul className={styles.nav}>
            <li><Link href="/" className={styles.navLink}>Home</Link></li>
            <li><Link href="/events" className={styles.navLink}>Events</Link></li>
            <li><Link href="#about" className={styles.navLink}>About</Link></li>
          </ul>
        </nav>

        <button
          className={styles.menuButton}
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
        </button>

        {/* Auth section — top right */}
        <div className={styles.authSection} ref={dropdownRef}>
          {loading ? (
            <div className={styles.loadingDot} />
          ) : user ? (
            <div className={styles.userContainer}>
              <div
                className={styles.userInfo}
                onClick={() => setDropdownOpen((prev) => !prev)}
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className={styles.avatar}>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                </div>
                <span className={styles.userName}>
                  {user.displayName || "User"}
                </span>
                <svg
                  className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ""}`}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className={styles.dropdown}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <button
                      className={styles.dropdownItem}
                      onClick={() => {
                        setDropdownOpen(false);
                        setProfileOpen(true);
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Edit Profile
                    </button>
                    <button className={styles.dropdownItemLogout} onClick={handleLogout}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              className={styles.signInBtn}
              onClick={() => setModalOpen(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Mobile navigation"
          >
            <button className={styles.closeMenuButton} onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">
              <span />
              <span />
            </button>
            <nav>
              <ul className={styles.mobileNav}>
                <li><Link href="/" onClick={() => setMobileMenuOpen(false)}>Home <span>›</span></Link></li>
                <li><Link href="/events" onClick={() => setMobileMenuOpen(false)}>Events <span>›</span></Link></li>
                <li><Link href="#about" onClick={() => setMobileMenuOpen(false)}>About <span>›</span></Link></li>
              </ul>
            </nav>

            <div className={styles.mobileAccount}>
              {loading ? (
                <div className={styles.loadingDot} />
              ) : user ? (
                <>
                  <button className={styles.mobileProfileButton} onClick={() => { setMobileMenuOpen(false); setProfileOpen(true); }}>
                    <span className={styles.avatar}>{user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}</span>
                    Profile
                  </button>
                  <button className={styles.mobileLogoutButton} onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <button className={styles.mobileSignInButton} onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}>
                  Sign In
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
