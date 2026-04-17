import Link from "next/link";
import Image from "next/image";
import DoctorAvatar from "@/components/Avatar";
import {
  ArrowUpRight,
  Heart,
  Activity,
  Bone,
  Baby,
  Stethoscope,
  Sparkles,
  Ear,
  Pill,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { getDoctors, getWards, getHospitalStats } from "@/lib/api";

// Prevent caching so bed availability feels live
export const revalidate = 60;

const serviceIcons: Record<string, any> = {
  Cardiology: Heart,
  Orthopaedics: Bone,
  Gynaecology: Activity,
  Paediatrics: Baby,
  "General Surgery": Stethoscope,
  Dermatology: Sparkles,
  ENT: Ear,
  "General Medicine": Pill,
};

export default async function HomePage() {
  const [doctors, wards, stats] = await Promise.all([
    getDoctors(),
    getWards(),
    getHospitalStats(),
  ]);

  const featuredDoctors = doctors.slice(0, 4);
  const totalBeds = wards.reduce((s, w) => s + w.total_beds, 0);
  const availableBeds = wards.reduce((s, w) => s + w.available_beds, 0);
  const icu = wards.find((w) => w.type === "icu");

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pt-10 pb-32">
        {/* decorative dot pattern top-right */}
        <div className="absolute top-24 right-0 w-[340px] h-[340px] dot-pattern opacity-60 pointer-events-none" />
        {/* organic blob bottom-left */}
        <svg
          className="absolute -bottom-32 -left-24 w-[520px] opacity-[0.08] text-forest-700 pointer-events-none"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M42.9,-57.1C54.4,-47.4,61.6,-32.5,66.1,-16.5C70.5,-0.6,72.2,16.4,65.7,29.8C59.2,43.2,44.6,53,29.2,58.5C13.9,64,-2.2,65.2,-18.3,62.1C-34.4,59,-50.5,51.5,-60.4,39C-70.3,26.4,-74,8.8,-70.7,-7.1C-67.5,-23.1,-57.3,-37.4,-44.4,-47.5C-31.5,-57.6,-15.8,-63.5,0.3,-63.9C16.4,-64.3,31.5,-66.8,42.9,-57.1Z" transform="translate(100 100)" />
        </svg>

        <div className="container-x relative">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-16 items-start">
            {/* Left: Display headline */}
            <div className="pt-12">
              <div className="eyebrow animate-fade-up">
                <span className="inline-block w-8 h-px bg-forest-700 align-middle mr-3" />
                Bhadohi, Uttar Pradesh · Est. 2009
              </div>

              <h1 className="mt-8 text-[54px] md:text-[84px] lg:text-[92px] font-display font-[400] leading-[0.96] tracking-[-0.03em] text-ink-900 animate-fade-up">
                Healing,<br />
                <span className="serif-italic font-[500]">rooted</span> in
                <span className="text-clay-500"> Bhadohi</span>.
              </h1>

              <p
                className="mt-8 max-w-lg text-lg text-ink-500 leading-relaxed animate-fade-up"
                style={{ animationDelay: "0.15s" }}
              >
                82 beds, 24 specialist doctors, and a culture that still runs on chai and
                patience. Check live bed availability, meet our doctors, and book an OPD
                slot in under a minute.
              </p>

              <div
                className="mt-10 flex flex-wrap gap-4 animate-fade-up"
                style={{ animationDelay: "0.3s" }}
              >
                <Link href="/book" className="btn-clay">
                  Book Appointment
                  <ArrowUpRight size={16} />
                </Link>
                <Link href="/rooms" className="btn-outline">
                  Check Bed Availability
                </Link>
              </div>

              {/* Trust line */}
              <div
                className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up"
                style={{ animationDelay: "0.45s" }}
              >
                <div className="flex items-center gap-2 text-sm text-ink-500">
                  <Clock size={14} className="text-forest-700" /> 24×7 Emergency
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-500">
                  <ShieldCheck size={14} className="text-forest-700" /> Ayushman Bharat
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-clay-500" />
                  NABH accredited
                </div>
              </div>
            </div>

            {/* Right: image card + floating data cards */}
            <div
              className="relative h-[560px] animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Main image */}
              <div className="absolute top-0 right-0 w-[85%] h-[78%] rounded-[32px] overflow-hidden shadow-[0_40px_80px_-24px_rgba(15,31,29,0.28)]">
                <Image
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&auto=format&fit=crop&q=80"
                  alt="Sahara Hospital staff at work"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 via-transparent" />
              </div>

              {/* Live bed card — floating bottom-left */}
              <div className="absolute bottom-0 left-0 w-[300px] card-soft p-6 animate-float" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-clay-500 animate-pulse-soft" />
                  <span className="eyebrow">Live Availability</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-5xl text-forest-900">{availableBeds}</span>
                  <span className="font-display text-xl text-ink-500">/ {totalBeds}</span>
                </div>
                <div className="text-sm text-ink-500 mt-1">beds free right now</div>

                <div className="mt-4 pt-4 border-t border-ink-800/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-500">ICU</div>
                    <div className="font-display text-lg text-forest-900">
                      {icu?.available_beds ?? 0} / {icu?.total_beds ?? 0}
                    </div>
                  </div>
                  <Link href="/rooms" className="text-xs text-clay-500 link-underline uppercase tracking-wider">
                    View wards →
                  </Link>
                </div>
              </div>

              {/* Stats card — top-left */}
              <div className="absolute top-8 left-0 card-soft px-5 py-4 max-w-[210px]">
                <div className="text-[10px] uppercase tracking-[0.2em] text-forest-700 font-medium">
                  Since 2009
                </div>
                <div className="font-display text-3xl text-ink-900 mt-1">
                  {(stats.patients_served_yearly / 1000).toFixed(0)}K+
                </div>
                <div className="text-xs text-ink-500 leading-snug">
                  patients looked after, every year
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RUNNING MARQUEE ===== */}
      <section className="border-y border-ink-800/10 bg-forest-700 text-cream-100 overflow-hidden py-5">
        <div className="flex animate-marquee gap-16 whitespace-nowrap font-display text-2xl md:text-3xl">
          {[...Array(2)].map((_, g) => (
            <div key={g} className="flex gap-16 shrink-0">
              {[
                "Cardiology",
                "Orthopaedics",
                "Gynaecology",
                "Paediatrics",
                "General Surgery",
                "Dermatology",
                "ENT",
                "General Medicine",
                "Pathology",
                "Radiology",
              ].map((s) => (
                <span key={s + g} className="flex items-center gap-16">
                  {s}
                  <span className="text-clay-400">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== BIG STATS ===== */}
      <section className="container-x py-24">
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { label: "Years serving", value: stats.years_serving, suffix: "" },
            { label: "Specialist Doctors", value: stats.doctors, suffix: "+" },
            { label: "Departments", value: stats.departments, suffix: "" },
            { label: "Surgeries / year", value: stats.surgeries_yearly, suffix: "+" },
          ].map((s) => (
            <div key={s.label} className="border-t border-ink-800/20 pt-6">
              <div className="font-display text-6xl md:text-7xl text-forest-900">
                {s.value.toLocaleString()}
                <span className="text-clay-500">{s.suffix}</span>
              </div>
              <div className="mt-2 text-sm uppercase tracking-widest text-ink-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="container-x py-24">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-end mb-16">
          <div>
            <div className="eyebrow">What we do</div>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[1] text-ink-900">
              Fourteen departments.<br />
              <span className="serif-italic text-clay-500">One</span> hospital.
            </h2>
          </div>
          <p className="text-ink-500 text-lg leading-relaxed max-w-lg justify-self-end">
            From a routine fever to a cardiac emergency, you walk in through one gate
            and our teams coordinate the rest. Below are the departments our patients
            visit most often.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-ink-800/10 rounded-3xl overflow-hidden border border-ink-800/10">
          {Object.keys(serviceIcons).map((name, i) => {
            const Icon = serviceIcons[name];
            return (
              <Link
                href={`/doctors?dept=${encodeURIComponent(name)}`}
                key={name}
                className="group bg-cream-100 p-8 hover:bg-forest-700 hover:text-cream-100 transition-all duration-500"
              >
                <Icon size={32} strokeWidth={1.3} className="text-forest-700 group-hover:text-clay-400 transition-colors" />
                <div className="mt-10 font-display text-2xl">{name}</div>
                <div className="mt-2 text-sm text-ink-500 group-hover:text-cream-100/70">
                  {(doctors.filter((d) => d.department === name).length || 1)} specialist
                  {doctors.filter((d) => d.department === name).length !== 1 ? "s" : ""} ·
                  OPD daily
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition">
                  Meet doctors <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURED DOCTORS ===== */}
      <section className="container-x py-24">
        <div className="flex flex-wrap items-end justify-between mb-14 gap-6">
          <div>
            <div className="eyebrow">Meet the team</div>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[1] text-ink-900">
              Doctors who <span className="serif-italic text-clay-500">know</span><br />
              your neighbourhood.
            </h2>
          </div>
          <Link href="/doctors" className="btn-outline">
            See all {doctors.length} doctors <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDoctors.map((doc, i) => (
            <Link
              href={`/doctors/${doc.id}`}
              key={doc.id}
              className="group relative overflow-hidden rounded-3xl bg-cream-50 border border-ink-800/5"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <DoctorAvatar
                  src={doc.photo_url}
                  name={doc.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/0 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-100/90 text-[10px] font-medium uppercase tracking-wider">
                  {doc.department}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-cream-100">
                  <div className="font-display text-[22px] leading-tight">{doc.name}</div>
                  <div className="text-xs opacity-80 mt-1">{doc.specialization}</div>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="text-xs text-ink-500">
                  {doc.experience_years} yrs experience
                </div>
                <div className="text-xs font-medium text-forest-700">
                  ₹{doc.consultation_fee} · OPD
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== WARDS PREVIEW + EDITORIAL QUOTE ===== */}
      <section className="container-x py-24">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-16">
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="eyebrow">Wards & Rooms</div>
            <h2 className="mt-4 font-display text-5xl leading-[1] text-ink-900">
              From a general bed to a <span className="serif-italic text-clay-500">deluxe suite</span>.
            </h2>
            <p className="mt-6 text-ink-500 leading-relaxed">
              Transparent daily charges, live occupancy, and no middleman. Book a room
              straight from your phone — your bed will be made before you reach.
            </p>
            <Link href="/rooms" className="btn-primary mt-8">
              See every bed <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {wards.map((w) => {
              const pct = Math.round((w.available_beds / w.total_beds) * 100);
              const busy = pct < 30;
              return (
                <div
                  key={w.id}
                  className="group grid grid-cols-[1fr_auto] gap-6 items-center p-6 rounded-2xl border border-ink-800/10 hover:border-forest-700 hover:bg-cream-50 transition"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          busy ? "bg-clay-500" : "bg-forest-500"
                        }`}
                      />
                      <span className="eyebrow !text-ink-500">{w.type}</span>
                    </div>
                    <div className="font-display text-[26px] mt-1 text-ink-900">{w.name}</div>
                    <div className="text-sm text-ink-500 mt-1">
                      {w.daily_charge === 0
                        ? "No room charge"
                        : `₹${w.daily_charge.toLocaleString()} / day`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl text-forest-900">
                      {w.available_beds}
                      <span className="text-ink-400 text-lg"> / {w.total_beds}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-500 mt-1">
                      {busy ? "Almost full" : "Available"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL ===== */}
      <section className="container-x py-24">
        <div className="relative rounded-[40px] bg-forest-700 text-cream-100 overflow-hidden p-12 md:p-20">
          <div className="absolute top-8 right-12 font-display text-[180px] leading-none text-cream-100/15 serif-italic">
            &ldquo;
          </div>
          <div className="max-w-3xl relative">
            <div className="eyebrow !text-clay-400">A patient's note</div>
            <blockquote className="mt-6 font-display text-3xl md:text-[42px] leading-[1.2]">
              Mummy ko midnight chest pain hua. Hum Bhadohi se nikle, 20 minute mein pahunche —
              cath lab already ready tha. Dr. Mishra ne stent daal diya uss raat.{" "}
              <span className="serif-italic text-clay-400">
                Six months ho gaye, mummy roz sabzi-mandi jaati hai.
              </span>
            </blockquote>
            <div className="mt-8 text-sm text-cream-100/70">
              — Ramesh Maurya · Carpet-weaver, Gopiganj · January 2026
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="container-x py-24">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/book"
            className="group relative overflow-hidden rounded-[32px] bg-clay-500 text-cream-100 p-12 hover:bg-clay-600 transition"
          >
            <div className="eyebrow !text-cream-100/70">Start here</div>
            <h3 className="mt-4 font-display text-5xl leading-[1]">
              Book an appointment<br />
              <span className="serif-italic">in under a minute.</span>
            </h3>
            <div className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest">
              Reserve your slot{" "}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:rotate-45"
              />
            </div>
          </Link>

          <Link
            href="tel:08429933131"
            className="group relative overflow-hidden rounded-[32px] bg-ink-900 text-cream-100 p-12 hover:bg-forest-900 transition"
          >
            <div className="eyebrow !text-cream-100/70">24 × 7 Emergency</div>
            <h3 className="mt-4 font-display text-5xl leading-[1]">
              084299<br />
              <span className="serif-italic text-clay-400">33131</span>
            </h3>
            <div className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest">
              Call ambulance{" "}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:rotate-45"
              />
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
