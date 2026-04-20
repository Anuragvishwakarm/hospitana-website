"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
  Check,
  RefreshCw,
  Tv,
  Wifi,
  Wind,
  Droplet,
  ShieldCheck,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getWards } from "@/lib/api";
import type { Ward } from "@/lib/mockData";

const wardIcons: Record<Ward["type"], any> = {
  emergency: Activity,
  icu: ShieldCheck,
  general: Users,
  "semi-private": BedDouble,
  private: Tv,
  deluxe: Wifi,
};

const amenityIcons: Record<string, any> = {
  AC: Wind,
  TV: Tv,
  "Wi-Fi": Wifi,
  "Oxygen outlet": Droplet,
  Fridge: Droplet,
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:8000";

function resolveUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Lightweight gallery — single large image + dot nav + arrows
function WardGallery({ photos, wardName }: { photos: string[]; wardName: string }) {
  const [idx, setIdx] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-forest-50 border border-ink-800/10 flex items-center justify-center">
        <BedDouble size={40} className="text-forest-700/30" />
      </div>
    );
  }

  const go = (d: number) => setIdx((i) => (i + d + photos.length) % photos.length);

  return (
    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-forest-50 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveUrl(photos[idx])}
        alt={`${wardName} — photo ${idx + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
        loading="lazy"
      />

      {photos.length > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream-100/85 backdrop-blur flex items-center justify-center text-ink-800 hover:bg-cream-100 opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream-100/85 backdrop-blur flex items-center justify-center text-ink-800 hover:bg-cream-100 opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-cream-100" : "w-1.5 bg-cream-100/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function RoomsPage() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const load = () => {
    setLoading(true);
    getWards().then((w) => {
      setWards(w);
      setLoading(false);
      setLastUpdated(new Date());
    });
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  const filtered =
    activeType === "all" ? wards : wards.filter((w) => w.type === activeType);

  const totalBeds = wards.reduce((s, w) => s + w.total_beds, 0);
  const availableBeds = wards.reduce((s, w) => s + w.available_beds, 0);
  const occupancyPct = totalBeds
    ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100)
    : 0;

  const types = Array.from(new Set(wards.map((w) => w.type)));

  return (
    <>
      {/* ===== HEADER ===== */}
      <section className="container-x pt-16 pb-16">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-end">
          <div>
            <div className="eyebrow flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-clay-500 animate-pulse-soft" />
              Live · Updated just now
            </div>
            <h1 className="mt-6 font-display text-6xl md:text-8xl leading-[0.96] text-ink-900">
              Every bed,<br />
              <span className="serif-italic text-clay-500">in real time.</span>
            </h1>
            <p className="mt-6 text-lg text-ink-500 max-w-lg leading-relaxed">
              No phone tag. No "sir, bed check karke batate hain." This page is wired
              directly to the ward station — what you see is what's actually open.
            </p>
          </div>

          {/* Occupancy gauge */}
          <div className="card-soft p-8">
            <div className="flex items-center justify-between mb-5">
              <span className="eyebrow">Hospital occupancy</span>
              <button
                onClick={load}
                className="text-ink-500 hover:text-forest-700 transition"
                aria-label="Refresh"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-display text-7xl text-forest-900">{occupancyPct}</span>
              <span className="font-display text-3xl text-ink-500 mb-2">%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-forest-50 overflow-hidden">
              <div
                className="h-full bg-forest-700 transition-all duration-700"
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between text-xs text-ink-500">
              <span>{availableBeds} beds available</span>
              <span>{totalBeds} total beds</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTER PILLS ===== */}
      <section className="container-x py-5 sticky top-[108px] z-20 bg-cream-100/90 backdrop-blur-md border-y border-ink-800/10">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveType("all")}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition ${
              activeType === "all"
                ? "bg-forest-700 text-cream-100"
                : "bg-cream-50 border border-ink-800/10 text-ink-800 hover:border-forest-700"
            }`}
          >
            All wards
          </button>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition capitalize ${
                activeType === t
                  ? "bg-forest-700 text-cream-100"
                  : "bg-cream-50 border border-ink-800/10 text-ink-800 hover:border-forest-700"
              }`}
            >
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
      </section>

      {/* ===== WARD LIST ===== */}
      <section className="container-x py-16 space-y-8">
        {loading && wards.length === 0 ? (
          <div className="py-24 text-center text-ink-500">Loading beds…</div>
        ) : (
          filtered.map((ward, idx) => {
            const Icon = wardIcons[ward.type] || BedDouble;
            const pct = Math.round(
              ((ward.total_beds - ward.available_beds) / ward.total_beds) * 100,
            );
            const full = ward.available_beds === 0;
            const nearlyFull = ward.available_beds / ward.total_beds < 0.25;
            const photos = (ward as any).photos || [];

            return (
              <div
                key={ward.id}
                className="group relative card-soft overflow-hidden grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10"
              >
                {/* Gallery column */}
                <div className="p-4 lg:p-6">
                  <WardGallery photos={photos} wardName={ward.name} />
                </div>

                {/* Info column */}
                <div className="p-6 lg:py-8 lg:pr-8 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-700 text-cream-100 flex items-center justify-center">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-ink-500">
                        0{idx + 1} · {ward.type.replace("-", " ")}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl md:text-4xl text-ink-900 leading-tight">
                      {ward.name}
                    </h3>
                    <p className="mt-3 text-ink-500 leading-relaxed">
                      {ward.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {ward.amenities.map((a) => {
                        const AI = amenityIcons[a] || Check;
                        return (
                          <span
                            key={a}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200/70 text-ink-800 text-xs"
                          >
                            <AI size={11} className="text-forest-700" />
                            {a}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability + CTA row */}
                  <div className="grid grid-cols-[1fr_auto] gap-6 items-end pt-5 border-t border-ink-800/10">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-ink-500">
                        Availability
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span
                          className={`font-display text-5xl ${
                            full || nearlyFull ? "text-clay-500" : "text-forest-900"
                          }`}
                        >
                          {ward.available_beds}
                        </span>
                        <span className="font-display text-xl text-ink-500">
                          / {ward.total_beds}
                        </span>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-cream-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${
                            full ? "bg-clay-500" : "bg-forest-700"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-ink-500">
                        Daily
                      </div>
                      <div className="font-display text-2xl text-forest-900 mt-1">
                        {ward.daily_charge === 0
                          ? "Free"
                          : `₹${ward.daily_charge.toLocaleString()}`}
                      </div>
                      <Link
                        href={`/book?ward=${ward.id}`}
                        className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.08em] font-medium transition ${
                          full
                            ? "bg-ink-800/10 text-ink-400 cursor-not-allowed pointer-events-none"
                            : "bg-clay-500 text-cream-100 hover:bg-clay-600"
                        }`}
                      >
                        {full ? "Waitlist" : "Reserve"} <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ===== LEGEND ===== */}
      <section className="container-x py-10">
        <div className="flex flex-wrap gap-6 items-center justify-center text-sm text-ink-500 border-t border-ink-800/10 pt-8">
          <span>
            Last refreshed:{" "}
            <span className="font-medium text-ink-800">
              {lastUpdated.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </span>
          <span>·</span>
          <span>Auto-refreshes every 60 seconds</span>
        </div>
      </section>
    </>
  );
}