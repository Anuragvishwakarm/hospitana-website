import Link from "next/link";
import Image from "next/image";
import DoctorAvatar from "@/components/Avatar";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Clock,
  Languages,
  GraduationCap,
  Calendar,
  ArrowUpRight,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { getDoctor, getDoctors } from "@/lib/api";

export const revalidate = 300;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function DoctorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [doc, allDoctors] = await Promise.all([
    getDoctor(params.id),
    getDoctors(),
  ]);
  if (!doc) notFound();

  const related = allDoctors
    .filter((d) => d.department === doc.department && d.id !== doc.id)
    .slice(0, 3);

  return (
    <>
      {/* Back */}
      <div className="container-x pt-10">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-forest-700 transition"
        >
          <ArrowLeft size={14} /> All doctors
        </Link>
      </div>

      {/* HEADER */}
      <section className="container-x pt-10 pb-16">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
          {/* Portrait */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_40px_80px_-24px_rgba(15,31,29,0.28)]">
              <DoctorAvatar
                src={doc.photo_url}
                name={doc.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Rating chip */}
            <div className="absolute -bottom-6 -right-6 card-soft px-6 py-4 flex items-center gap-3 animate-float">
              <Star size={22} fill="#C76D52" className="text-clay-500" />
              <div>
                <div className="font-display text-3xl text-ink-900">{doc.rating}</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-500">
                  {doc.consultations.toLocaleString()} consults
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="eyebrow">
              <span className="inline-block w-8 h-px bg-forest-700 align-middle mr-3" />
              {doc.department}
            </div>
            <h1 className="mt-6 font-display text-6xl md:text-7xl leading-[0.98] text-ink-900">
              {doc.name}
            </h1>
            <div className="mt-4 text-xl text-clay-500 font-display serif-italic">
              {doc.specialization}
            </div>

            <p className="mt-8 text-lg text-ink-500 leading-relaxed">{doc.bio}</p>

            {/* Stat strip */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="border-t border-ink-800/20 pt-4">
                <div className="font-display text-4xl text-forest-900">
                  {doc.experience_years}
                  <span className="text-clay-500">+</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-ink-500 mt-1">
                  Years Experience
                </div>
              </div>
              <div className="border-t border-ink-800/20 pt-4">
                <div className="font-display text-4xl text-forest-900">
                  ₹{doc.consultation_fee}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-ink-500 mt-1">
                  OPD Fee
                </div>
              </div>
              <div className="border-t border-ink-800/20 pt-4">
                <div className="font-display text-4xl text-forest-900">
                  {doc.languages.length}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-ink-500 mt-1">
                  Languages
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`/book?doctor=${doc.id}`} className="btn-clay">
                Book Appointment <ArrowUpRight size={14} />
              </Link>
              <a href="tel:08429933131" className="btn-outline">
                <Phone size={14} /> Call Reception
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS GRID */}
      <section className="container-x py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Qualification */}
          <div className="card-soft p-8">
            <GraduationCap size={28} strokeWidth={1.3} className="text-forest-700" />
            <div className="eyebrow mt-5">Qualification</div>
            <div className="mt-3 font-display text-xl text-ink-900 leading-snug">
              {doc.qualification}
            </div>
          </div>

          {/* Languages */}
          <div className="card-soft p-8">
            <Languages size={28} strokeWidth={1.3} className="text-forest-700" />
            <div className="eyebrow mt-5">Consults in</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {doc.languages.map((l) => (
                <span
                  key={l}
                  className="px-3 py-1 rounded-full bg-forest-50 text-forest-700 text-sm"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="card-soft p-8">
            <Calendar size={28} strokeWidth={1.3} className="text-forest-700" />
            <div className="eyebrow mt-5">OPD Schedule</div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {DAYS.map((d) => {
                const active = doc.available_days.includes(d);
                return (
                  <span
                    key={d}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-xs font-medium border ${
                      active
                        ? "bg-forest-700 text-cream-100 border-forest-700"
                        : "bg-transparent text-ink-400 border-ink-800/15"
                    }`}
                  >
                    {d[0]}
                  </span>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-ink-500 flex items-center gap-2">
              <Clock size={12} /> 10:00 AM – 2:00 PM · 5:00 PM – 8:00 PM
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I TREAT — decorative list */}
      <section className="container-x py-16">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12">
          <div>
            <div className="eyebrow">Conditions I see most</div>
            <h2 className="mt-4 font-display text-5xl leading-[1] text-ink-900">
              What I <span className="serif-italic text-clay-500">treat</span>.
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              "Routine consultation",
              "Second opinion reviews",
              "Chronic disease management",
              "Pre-surgery evaluation",
              "Post-operative follow-up",
              "Rural outreach referrals",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-800">
                <CheckCircle2 size={18} className="text-forest-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="container-x py-16">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-4xl text-ink-900">
              Also in <span className="serif-italic text-clay-500">{doc.department}</span>
            </h2>
            <Link href={`/doctors?dept=${doc.department}`} className="text-sm link-underline text-ink-800">
              See department →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {related.map((d) => (
              <Link
                key={d.id}
                href={`/doctors/${d.id}`}
                className="group relative overflow-hidden rounded-3xl bg-cream-50 border border-ink-800/5"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <DoctorAvatar
                    src={d.photo_url}
                    name={d.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/75 via-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-cream-100">
                    <div className="font-display text-xl">{d.name}</div>
                    <div className="text-xs opacity-80">{d.specialization}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
