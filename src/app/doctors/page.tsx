"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DoctorAvatar from "@/components/Avatar";
import { Search, ArrowUpRight, Star, Clock, Languages } from "lucide-react";
import { getDoctors } from "@/lib/api";
import { DEPARTMENTS, type Doctor } from "@/lib/mockData";
import { useSearchParams } from "next/navigation";

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="container-x py-32 text-ink-500">Loading…</div>}>
      <DoctorsInner />
    </Suspense>
  );
}

function DoctorsInner() {
  const params = useSearchParams();
  const initialDept = params.get("dept") || "all";

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<string>(initialDept);

  useEffect(() => {
    setLoading(true);
    getDoctors().then((d) => {
      setDoctors(d);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = doctors;
    if (dept !== "all") list = list.filter((d) => d.department === dept);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q),
      );
    }
    return list;
  }, [doctors, dept, search]);

  return (
    <>
      {/* ===== HEADER ===== */}
      <section className="container-x pt-16 pb-20">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-end">
          <div>
            <div className="eyebrow">
              <span className="inline-block w-8 h-px bg-forest-700 align-middle mr-3" />
              Our Doctors
            </div>
            <h1 className="mt-6 font-display text-6xl md:text-8xl leading-[0.96] text-ink-900">
              Meet the people<br />
              <span className="serif-italic text-clay-500">behind the white coats.</span>
            </h1>
          </div>
          <p className="text-lg text-ink-500 leading-relaxed lg:pb-6">
            Every doctor here lives in or around Bhadohi. No outstation visiting-consultants,
            no “please wait for availability” loops. The person you book is the person who sees you.
          </p>
        </div>
      </section>

      {/* ===== FILTERS ===== */}
      <section className="sticky top-[108px] z-20 bg-cream-100/95 backdrop-blur-md border-b border-ink-800/10">
        <div className="container-x">
          {/* Row 1 — Search */}
          <div className="pt-5 pb-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, specialisation or condition…"
                className="w-full pl-14 pr-12 py-4 rounded-full bg-cream-50 border border-ink-800/10 focus:border-forest-700 focus:outline-none text-base font-display placeholder:text-ink-400 placeholder:font-body placeholder:text-sm transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-ink-500 hover:bg-ink-800/10 transition"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Row 2 — Department pills (horizontal scroll on overflow) */}
          <div className="pb-4 flex items-center gap-4">
            <span className="eyebrow shrink-0 hidden md:inline">Department</span>

            <div className="relative flex-1 -mx-2 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 px-2 min-w-max">
                {/* All */}
                <FilterPill
                  active={dept === "all"}
                  onClick={() => setDept("all")}
                  label="All"
                  count={doctors.length}
                />
                {/* Per-department, with live count from loaded doctors */}
                {DEPARTMENTS.map((d) => {
                  const count = doctors.filter((doc) => doc.department === d).length;
                  return (
                    <FilterPill
                      key={d}
                      active={dept === d}
                      onClick={() => setDept(d)}
                      label={d}
                      count={count}
                    />
                  );
                })}
              </div>

              {/* Soft right-edge fade hint that more pills are scrollable */}
              <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-cream-100 to-transparent md:hidden" />
            </div>

            {(dept !== "all" || search) && (
              <button
                onClick={() => { setDept("all"); setSearch(""); }}
                className="shrink-0 text-xs text-clay-500 hover:text-clay-600 font-medium uppercase tracking-widest link-underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===== RESULTS ===== */}
      <section className="container-x py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-ink-500">
            {loading ? "Loading…" : `${filtered.length} doctor${filtered.length === 1 ? "" : "s"} found`}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-cream-50 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="font-display text-3xl text-ink-900">No doctors match that search.</div>
            <button
              onClick={() => { setSearch(""); setDept("all"); }}
              className="btn-outline mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc, idx) => (
              <Link
                key={doc.id}
                href={`/doctors/${doc.id}`}
                className="group relative overflow-hidden rounded-[28px] bg-cream-50 border border-ink-800/5 hover:shadow-[0_32px_64px_-20px_rgba(15,31,29,0.2)] transition-all duration-500"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <DoctorAvatar
                    src={doc.photo_url}
                    name={doc.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/10 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-100/95 text-[10px] font-medium uppercase tracking-wider">
                      {doc.department}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-100/95 text-[11px] font-medium">
                      <Star size={10} fill="#C76D52" className="text-clay-500" /> {doc.rating}
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-cream-100">
                    <div className="font-display text-[26px] leading-tight">{doc.name}</div>
                    <div className="text-sm opacity-85 mt-1">{doc.specialization}</div>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-ink-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} /> {doc.experience_years} yrs
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Languages size={12} /> {doc.languages.slice(0, 2).join(", ")}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-ink-800/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-ink-500">
                        OPD Consultation
                      </div>
                      <div className="font-display text-xl text-forest-900">
                        ₹{doc.consultation_fee}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-clay-500 uppercase tracking-widest font-medium">
                      Book
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:rotate-45"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/* ─── Filter pill — refined editorial style with count badge ────────────── */
function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  const empty = count === 0;
  return (
    <button
      onClick={onClick}
      disabled={empty && !active}
      className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.08em] font-medium whitespace-nowrap transition-all duration-300 ${
        active
          ? "bg-forest-700 text-cream-100 shadow-[0_8px_20px_-8px_rgba(15,76,74,0.5)]"
          : empty
            ? "bg-transparent text-ink-400 border border-ink-800/10 cursor-not-allowed"
            : "bg-cream-50 border border-ink-800/10 text-ink-800 hover:border-forest-700 hover:bg-cream-100"
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-[10px] font-display rounded-full px-1.5 py-px tabular-nums leading-tight ${
          active
            ? "bg-cream-100/15 text-clay-400"
            : empty
              ? "text-ink-400"
              : "bg-ink-800/5 text-ink-500 group-hover:bg-forest-50 group-hover:text-forest-700"
        }`}
      >
        {count}
      </span>
    </button>
  );
}