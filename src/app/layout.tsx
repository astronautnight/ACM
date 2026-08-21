import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Rocket from "@/components/Rocket";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-playful",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACM | Home",
  description: "A textured Next.js application using Framer Motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <body>
        <Providers>
          <Header />
          <Rocket />
          <main style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

