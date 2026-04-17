"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /public/contact-leads when backend endpoint is added
    setSent(true);
  };

  return (
    <>
      <section className="container-x pt-16 pb-16">
        <div className="eyebrow">
          <span className="inline-block w-8 h-px bg-forest-700 align-middle mr-3" />
          Contact
        </div>
        <h1 className="mt-6 font-display text-6xl md:text-8xl leading-[0.96] text-ink-900">
          Say <span className="serif-italic text-clay-500">hello</span>,<br />
          or ring the bell.
        </h1>
      </section>

      <section className="container-x pb-24 grid lg:grid-cols-[1fr_1.2fr] gap-16">
        {/* LEFT: details */}
        <div className="space-y-10">
          <div className="card-soft p-8">
            <Phone size={28} strokeWidth={1.3} className="text-forest-700" />
            <div className="eyebrow mt-5">24 × 7 Emergency</div>
            <a
              href="tel:08429933131"
              className="font-display text-5xl text-ink-900 mt-3 block hover:text-clay-500 transition"
            >
              084299 33131
            </a>
            <div className="mt-3 text-sm text-ink-500">
              Ambulance dispatch within 12 minutes across Bhadohi municipality.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card-soft p-6">
              <MapPin size={20} strokeWidth={1.3} className="text-forest-700" />
              <div className="eyebrow mt-4">Visit us</div>
              <div className="mt-2 font-display text-lg leading-snug text-ink-900">
                GT Road, near Durgaganj Chauraha, Bhadohi, UP — 221401
              </div>
            </div>

            <div className="card-soft p-6">
              <Mail size={20} strokeWidth={1.3} className="text-forest-700" />
              <div className="eyebrow mt-4">Email</div>
              <a
                href="mailto:care@saharahospital.in"
                className="mt-2 font-display text-lg text-ink-900 block break-all"
              >
                care@saharahospital.in
              </a>
            </div>

            <div className="card-soft p-6 sm:col-span-2">
              <Clock size={20} strokeWidth={1.3} className="text-forest-700" />
              <div className="eyebrow mt-4">OPD Hours</div>
              <div className="mt-3 space-y-1.5 text-sm text-ink-800">
                <div className="flex justify-between">
                  <span>Mon – Sat</span>
                  <span className="font-display">10:00 AM – 2:00 PM · 5:00 PM – 8:00 PM</span>
                </div>
                <div className="flex justify-between text-ink-500">
                  <span>Sunday</span>
                  <span className="font-display">Emergency only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Static map placeholder */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-ink-800/10">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=82.55%2C25.38%2C82.62%2C25.42&layer=mapnik&marker=25.40,82.58"
              className="absolute inset-0 w-full h-full grayscale contrast-[1.05]"
              loading="lazy"
            />
          </div>
        </div>

        {/* RIGHT: form */}
        <div>
          {sent ? (
            <div className="card-soft p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-forest-50 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-forest-700" />
              </div>
              <h2 className="mt-6 font-display text-4xl text-ink-900">
                Message <span className="serif-italic text-clay-500">received</span>.
              </h2>
              <p className="mt-4 text-ink-500">
                Someone from reception will reach out within 2 working hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-soft p-10 md:p-12 space-y-6">
              <div>
                <div className="eyebrow">Write to us</div>
                <h2 className="mt-3 font-display text-4xl text-ink-900 leading-[1]">
                  General enquiry, feedback,<br /> or a thank-you note.
                </h2>
              </div>

              <div>
                <label className="eyebrow block">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-3 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display"
                />
              </div>

              <div>
                <label className="eyebrow block">Phone</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-3 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display"
                />
              </div>

              <div>
                <label className="eyebrow block">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-3 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none resize-none"
                />
              </div>

              <button type="submit" className="btn-primary">
                Send message <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
