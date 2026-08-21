import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Image src="/acm-logo.png" alt="ACM Logo" width={40} height={40} />
          <span className={styles.brand}>ACM</span>
        </div>
        <div className={styles.socials}>
          <a
            href="https://www.instagram.com/acm_bvdudet?igsi=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Follow us on Instagram
          </a>
        </div>
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} ACM. All rights reserved.
      </div>
    </footer>
  );
}
