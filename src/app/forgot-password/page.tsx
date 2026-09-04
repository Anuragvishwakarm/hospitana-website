"use client";

import Link from "next/link";
import { ArrowLeft, Phone, MapPin, Clock, KeyRound, ArrowUpRight } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <section className="container-x py-12 md:py-16">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-forest-700 transition mb-8"
      >
        <ArrowLeft size={14} /> Back to sign in
      </Link>

      <div className="max-w-3xl">
        <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center">
          <KeyRound size={26} strokeWidth={1.4} className="text-forest-700" />
        </div>

        <div className="eyebrow mt-8">Forgot password</div>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[0.98] text-ink-900">
          No problem.<br />
          <span className="serif-italic text-clay-500">Reception will help.</span>
        </h1>
        <p className="mt-8 text-ink-500 text-lg leading-relaxed max-w-2xl">
          We don't auto-email reset links yet (SMS OTP is coming soon). In the meantime,
          a quick phone call to reception is the fastest way. They verify your identity
          against your UHID, set a temporary password, and tell you what it is.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* Call option */}
          <a
            href="tel:08429933131"
            className="card-soft p-8 group hover:shadow-[0_24px_48px_-20px_rgba(15,31,29,0.18)] transition"
          >
            <Phone size={26} strokeWidth={1.3} className="text-clay-500" />
            <div className="eyebrow mt-5">Call reception</div>
            <div className="font-display text-4xl text-ink-900 mt-3">084299 33131</div>
            <div className="mt-4 text-sm text-ink-500">
              Keep your phone number and full name ready. They'll look you up and reset
              your password within 5 minutes.
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-clay-500 font-medium">
              Tap to call{" "}
              <ArrowUpRight
                size={12}
                className="transition-transform group-hover:rotate-45"
              />
            </div>
          </a>

          {/* Visit option */}
          <div className="card-soft p-8">
            <MapPin size={26} strokeWidth={1.3} className="text-forest-700" />
            <div className="eyebrow mt-5">Walk in</div>
            <div className="font-display text-2xl text-ink-900 mt-3 leading-snug">
              GT Road, near Durgaganj Chauraha, Bhadohi — 221401
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
              <Clock size={14} className="text-forest-700" />
              <span>Reception: 8:00 AM – 9:00 PM daily</span>
            </div>
            <div className="mt-6 text-sm text-ink-500">
              Carry any ID — Aadhaar or your OPD slip is enough.
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="mt-16 pt-10 border-t border-ink-800/10">
          <div className="eyebrow">What happens next</div>
          <ol className="mt-6 space-y-6 max-w-2xl">
            {[
              ["Verify identity", "Reception confirms your name, UHID, and registered phone."],
              ["Temporary password", "They reset your account to a one-time password — you get it over phone or in person."],
              ["Sign in & change it", "Log in at /login with that password, then open Settings → Change password and pick a new one."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-5">
                <div className="font-display text-3xl text-clay-500 leading-none">
                  0{i + 1}
                </div>
                <div>
                  <div className="font-display text-xl text-ink-900">{t}</div>
                  <div className="text-sm text-ink-500 mt-1">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 text-sm text-ink-500">
          Remembered your password after all?{" "}
          <Link href="/login" className="link-underline text-forest-700 font-medium">
            Back to sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
