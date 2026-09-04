"use client";

import { useState } from "react";
import { CheckCircle2, Clock3, Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section className="bg-primary py-20 text-white"><div className="container-x text-center"><p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Contact Sahara Hospital</p><h1 className="mt-4 text-5xl font-extrabold sm:text-6xl">How can we help?</h1><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-50">Call for urgent help, appointment assistance, admission information or a general enquiry.</p></div></section>
      <section className="bg-gray-50 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <a href="tel:08429933131" className="flex gap-4 rounded-xl bg-white p-6 shadow-md"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600"><Phone /></span><span><strong className="block text-lg text-gray-900">Emergency & Reception</strong><span className="mt-1 block text-gray-600">084299 33131 · Available 24/7</span></span></a>
              <div className="flex gap-4 rounded-xl bg-white p-6 shadow-md"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary"><MapPin /></span><span><strong className="block text-lg text-gray-900">Visit Us</strong><span className="mt-1 block text-gray-600">GT Road, near Durgaganj Chauraha, Bhadohi, UP — 221401</span></span></div>
              <a href="mailto:care@saharahospital.in" className="flex gap-4 rounded-xl bg-white p-6 shadow-md"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary"><Mail /></span><span><strong className="block text-lg text-gray-900">Email</strong><span className="mt-1 block break-all text-gray-600">care@saharahospital.in</span></span></a>
              <div className="flex gap-4 rounded-xl bg-white p-6 shadow-md"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700"><Clock3 /></span><span><strong className="block text-lg text-gray-900">OPD Hours</strong><span className="mt-1 block text-gray-600">Mon–Sat: 9 AM–1 PM and 5 PM–8 PM</span></span></div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-7 shadow-lg sm:p-9">
            {sent ? <div className="flex min-h-[420px] flex-col items-center justify-center text-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700"><CheckCircle2 size={32} /></span><h2 className="mt-6 text-3xl font-bold text-gray-900">Message received</h2><p className="mt-3 max-w-md text-gray-600">Reception will contact you during working hours. For urgent care, please call 084299 33131.</p><button type="button" onClick={() => setSent(false)} className="btn-outline mt-7">Send another message</button></div> : <form onSubmit={handleSubmit}><p className="eyebrow">Send an Enquiry</p><h2 className="mt-3 text-3xl font-bold text-gray-900">Write to our reception team</h2><div className="mt-7 grid gap-6 sm:grid-cols-2"><label className="text-sm font-semibold text-gray-700">Your name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-normal outline-none focus:border-primary focus:ring-2 focus:ring-blue-100" /></label><label className="text-sm font-semibold text-gray-700">Phone number<input required type="tel" pattern="[0-9]{10}" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-normal outline-none focus:border-primary focus:ring-2 focus:ring-blue-100" /></label></div><label className="mt-6 block text-sm font-semibold text-gray-700">How can we help?<textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-base font-normal outline-none focus:border-primary focus:ring-2 focus:ring-blue-100" /></label><button type="submit" className="btn-primary mt-6">Send Message <Send size={17} /></button><p className="mt-4 text-sm text-gray-500">This form is for general enquiries only. Do not share urgent or sensitive medical information.</p></form>}
          </div>
        </div>
      </section>
      <section className="container-x py-16"><div className="h-[420px] overflow-hidden rounded-xl shadow-lg"><iframe title="Sahara Hospital location" src="https://www.openstreetmap.org/export/embed.html?bbox=82.55%2C25.38%2C82.62%2C25.42&layer=mapnik&marker=25.40,82.58" className="h-full w-full border-0" loading="lazy" /></div></section>
    </>
  );
}
