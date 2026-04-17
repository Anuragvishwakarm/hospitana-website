import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sahara Hospital, Bhadohi — Healing, Rooted Here.",
  description:
    "A full-service multispeciality hospital in Bhadohi, Uttar Pradesh. Check live bed availability, book an appointment with our doctors, and explore our wards — cash, cashless, and Ayushman Bharat accepted.",
  keywords: [
    "Sahara Hospital",
    "Bhadohi hospital",
    "hospital UP",
    "book doctor appointment",
    "bed availability",
    "Hospitana",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="bg-cream-100">
        <Navbar />
        <main className="relative z-[2]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
