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
  Baby,
  Activity,
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
    const id = setInterval(load, 60_000); // refresh every minute
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
              No phone tag. No “sir, bed check karke batate hain.” This page is wired
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
      <section className="container-x py-16 space-y-5">
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

            return (
              <div
                key={ward.id}
                className="group relative card-soft overflow-hidden"
              >
                <div className="grid lg:grid-cols-[auto_1.3fr_1fr_auto] gap-6 lg:gap-10 p-6 lg:p-8 items-start">
                  {/* Icon / index */}
                  <div className="flex lg:block items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-forest-700 text-cream-100 flex items-center justify-center shrink-0">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-500 mt-2 lg:mt-3">
                      0{idx + 1} · {ward.type.replace("-", " ")}
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl text-ink-900 leading-tight">
                      {ward.name}
                    </h3>
                    <p className="mt-3 text-ink-500 leading-relaxed max-w-xl">
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

                  {/* Availability numbers */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`font-display text-6xl ${
                          full
                            ? "text-clay-500"
                            : nearlyFull
                              ? "text-clay-500"
                              : "text-forest-900"
                        }`}
                      >
                        {ward.available_beds}
                      </span>
                      <span className="font-display text-2xl text-ink-500">
                        / {ward.total_beds}
                      </span>
                    </div>
                    <div className="text-xs uppercase tracking-widest text-ink-500 mt-1">
                      {full ? "Fully occupied" : nearlyFull ? "Nearly full" : "Available"}
                    </div>

                    {/* Bed grid — visual */}
                    <div className="mt-5 grid grid-cols-10 gap-1.5 max-w-[280px]">
                      {ward.beds.slice(0, 30).map((b) => (
                        <div
                          key={b.id}
                          title={`${b.bed_number} — ${b.is_occupied ? "Occupied" : "Free"}`}
                          className={`aspect-square rounded-[4px] ${
                            b.is_occupied ? "bg-ink-800/15" : "bg-forest-500"
                          }`}
                        />
                      ))}
                      {ward.beds.length > 30 && (
                        <div className="col-span-10 text-[10px] text-ink-400 mt-1">
                          +{ward.beds.length - 30} more beds
                        </div>
                      )}
                    </div>

                    {/* Occupancy bar */}
                    <div className="mt-4 h-1 rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          full ? "bg-clay-500" : "bg-forest-700"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="lg:text-right">
                    <div className="text-[10px] uppercase tracking-widest text-ink-500">
                      Daily charge
                    </div>
                    <div className="font-display text-3xl text-forest-900 mt-1">
                      {ward.daily_charge === 0
                        ? "Free"
                        : `₹${ward.daily_charge.toLocaleString()}`}
                    </div>
                    <Link
                      href={`/book?ward=${ward.id}`}
                      className={`mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.08em] font-medium transition ${
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
            );
          })
        )}
      </section>

      {/* ===== LEGEND ===== */}
      <section className="container-x py-10">
        <div className="flex flex-wrap gap-6 items-center justify-center text-sm text-ink-500 border-t border-ink-800/10 pt-8">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-[4px] bg-forest-500 inline-block" /> Free bed
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-[4px] bg-ink-800/15 inline-block" /> Occupied
          </span>
          <span>·</span>
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
