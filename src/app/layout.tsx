import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sahara Hospital — Bhadohi, UP",
  description:
    "Compassionate hospital care in Bhadohi. Doctors across cardiology, " +
    "paediatrics, general medicine and more. Book appointments online.",
  keywords: [
    "Sahara Hospital",
    "Bhadohi hospital",
    "UP hospital",
    "doctor appointment",
    "ICU Bhadohi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable}`}
    >
      <body className="bg-[#fdf8ef] text-[#0f2a34] antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />

        {/*
          AI assistant — floating chatbot on every page.
          - Reads access_token from localStorage to auto-auth logged-in patients.
          - Persists session_id in localStorage so multi-turn memory survives
            page navigation.
          - Hidden behind a small teal pill at bottom-right until opened.
        */}
        <AIChatbot />
      </body>
    </html>
  );
}