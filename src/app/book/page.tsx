"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Phone,
  Copy,
  LogIn,
  UserPlus,
  Lock,
  AlertCircle,
} from "lucide-react";
import {
  getDoctors,
  bookAppointment,
  getAvailableSlots,
  type AvailableSlot,
} from "@/lib/api";
import { type Doctor } from "@/lib/mockData";
import { useAuth } from "@/store/auth";

export default function BookPage() {
  return (
    <Suspense fallback={<div className="container-x py-32 text-ink-500">Loading…</div>}>
      <BookInner />
    </Suspense>
  );
}

function BookInner() {
  const router = useRouter();
  const params = useSearchParams();
  const prefilledDoctor = params.get("doctor");

  const { token, user, hydrated } = useAuth();
  const isLoggedIn = Boolean(token && user);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    department: "",
    doctor_id: prefilledDoctor || "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState<{ ref: string; status: string; token: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoctors().then((d) => {
      setDoctors(d);
      if (prefilledDoctor) {
        const doc = d.find((x) => String(x.id) === prefilledDoctor);
        if (doc) setForm((f) => ({ ...f, department: doc.department }));
      }
    });
  }, [prefilledDoctor]);

  // Fetch available slots whenever doctor + date are set
  useEffect(() => {
    if (!form.doctor_id || !form.appointment_date || !isLoggedIn) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    getAvailableSlots(Number(form.doctor_id), form.appointment_date)
      .then((s) => setSlots(s))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [form.doctor_id, form.appointment_date, isLoggedIn]);

  const filteredDoctors = form.department
    ? doctors.filter((d) => d.department === form.department)
    : doctors;

  const departments = Array.from(new Set(doctors.map((d) => d.department))).filter(Boolean);

  /* ═════ 1. Waiting for hydration ═════ */
  if (!hydrated) {
    return <div className="container-x py-32 text-ink-500">Loading…</div>;
  }

  /* ═════ 2. Not signed in — hard gate ═════ */
  if (!isLoggedIn) {
    const returnUrl = encodeURIComponent(
      "/book" + (prefilledDoctor ? `?doctor=${prefilledDoctor}` : ""),
    );
    return (
      <section className="container-x py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-forest-50 flex items-center justify-center">
            <Lock size={30} className="text-forest-700" strokeWidth={1.5} />
          </div>
          <div className="eyebrow mt-8">Sign in required</div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[0.98] text-ink-900">
            To book an appointment,<br />
            <span className="serif-italic text-clay-500">we need to know you.</span>
          </h1>
          <p className="mt-8 text-ink-500 text-lg leading-relaxed max-w-xl mx-auto">
            Booking lands straight in our hospital system, so your doctor sees your
            history before you walk in. Takes a minute.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <Link
              href={`/register?return=${returnUrl}`}
              className="group card-soft p-8 text-left hover:shadow-[0_24px_48px_-20px_rgba(15,31,29,0.18)] transition"
            >
              <UserPlus size={26} strokeWidth={1.3} className="text-clay-500" />
              <div className="font-display text-2xl mt-5 text-ink-900">New here?</div>
              <div className="text-sm text-ink-500 mt-2">
                Create an account in 60 seconds.
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-clay-500 font-medium">
                Register <ArrowUpRight size={12} className="transition-transform group-hover:rotate-45" />
              </div>
            </Link>
            <Link
              href={`/login?return=${returnUrl}`}
              className="group card-soft p-8 text-left hover:shadow-[0_24px_48px_-20px_rgba(15,31,29,0.18)] transition"
            >
              <LogIn size={26} strokeWidth={1.3} className="text-forest-700" />
              <div className="font-display text-2xl mt-5 text-ink-900">Visited before?</div>
              <div className="text-sm text-ink-500 mt-2">
                Sign in to book and see past visits.
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-forest-700 font-medium">
                Sign in <ArrowUpRight size={12} className="transition-transform group-hover:rotate-45" />
              </div>
            </Link>
          </div>
          <div className="mt-14 text-sm text-ink-500 flex items-center justify-center gap-3 flex-wrap">
            <span>Can't register online?</span>
            <a href="tel:08429933131" className="btn-outline !py-2 !px-4 !text-xs">
              <Phone size={12} /> Call 084299 33131
            </a>
          </div>
        </div>
      </section>
    );
  }

  /* ═════ 3. Logged in — booking form ═════ */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.doctor_id) {
      setError("Please select a doctor.");
      return;
    }
    if (!form.appointment_date) {
      setError("Please pick a date.");
      return;
    }
    if (!form.appointment_time) {
      setError("Please pick an available time slot.");
      return;
    }

    setSubmitting(true);
    try {
      // Backend expects "HH:MM:SS" for the Time column. Pad if needed.
      const time =
        form.appointment_time.length === 5
          ? `${form.appointment_time}:00`
          : form.appointment_time;

      const res = await bookAppointment({
        patient_id: user!.id,
        doctor_id: Number(form.doctor_id),
        appointment_date: form.appointment_date,
        appointment_time: time,
        reason: form.reason || "OPD consultation",
      });

      setConfirm({
        ref: `APT-${String(res.id).padStart(6, "0")}`,
        status: res.status || "pending",
        token: res.token_number || 0,
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 409) {
        setError(
          detail ||
            "This slot was just taken. Please pick another available time.",
        );
        // Refresh slots so the newly-booked one greys out
        if (form.doctor_id && form.appointment_date) {
          const fresh = await getAvailableSlots(
            Number(form.doctor_id),
            form.appointment_date,
          );
          setSlots(fresh);
          setForm((f) => ({ ...f, appointment_time: "" }));
        }
      } else {
        setError(
          detail || "Couldn't book right now. Please try again or call reception.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (confirm) {
    return (
      <section className="container-x py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-forest-50 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-forest-700" />
          </div>
          <h1 className="mt-8 font-display text-6xl text-ink-900 leading-[0.98]">
            Appointment<br />
            <span className="serif-italic text-clay-500">booked.</span>
          </h1>
          <p className="mt-6 text-ink-500 text-lg leading-relaxed">
            Your appointment is saved in our system. Reception will call within 2 working
            hours to confirm the exact timing.
          </p>
          <div className="mt-10 card-soft p-8 text-left">
            <div className="flex items-start justify-between">
              <div>
                <div className="eyebrow">Reference</div>
                <div className="font-display text-3xl text-ink-900 mt-2">{confirm.ref}</div>
                <div className="text-xs uppercase tracking-widest text-clay-500 mt-2">
                  Status: {confirm.status}
                </div>
              </div>
              {confirm.token > 0 && (
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-ink-500">
                    Your token
                  </div>
                  <div className="font-display text-5xl text-forest-900 mt-1">
                    {confirm.token}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-5 pt-5 border-t border-ink-800/10">
              <button
                onClick={() => navigator.clipboard?.writeText(confirm.ref)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-500 hover:text-forest-700"
              >
                <Copy size={12} /> Copy reference
              </button>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/" className="btn-outline">Back to home</Link>
            <a href="tel:08429933131" className="btn-primary">
              <Phone size={14} /> Call reception
            </a>
          </div>
        </div>
      </section>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="container-x py-16">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16">
        <div className="lg:sticky lg:top-32 h-fit">
          <div className="eyebrow">Book appointment</div>
          <h1 className="mt-6 font-display text-6xl md:text-7xl leading-[0.96] text-ink-900">
            Hello <span className="serif-italic text-clay-500">{user!.first_name}</span>,<br />
            pick a doctor.
          </h1>
          <p className="mt-8 text-ink-500 leading-relaxed text-lg">
            Your details are already on file. Choose a department, a doctor, and a
            time slot that's actually free.
          </p>

          <div className="mt-8 text-sm flex items-center gap-3 border border-ink-800/10 rounded-2xl p-4 max-w-sm">
            <div className="w-9 h-9 rounded-full bg-forest-700 text-cream-100 flex items-center justify-center font-display">
              {user!.first_name[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-ink-800">
                {user!.first_name} {user!.last_name}
              </div>
              <div className="text-xs text-ink-500">{user!.phone} · {user!.email}</div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="card-soft p-8 md:p-12 space-y-8">
          {/* STEP 1 — Department */}
          <div>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-display text-clay-500 text-2xl">01</span>
              <label className="eyebrow">Department</label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, department: "", doctor_id: "" })}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition ${
                  form.department === ""
                    ? "bg-forest-700 text-cream-100"
                    : "bg-cream-50 border border-ink-800/10 text-ink-800 hover:border-forest-700"
                }`}
              >
                Any
              </button>
              {departments.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, department: d, doctor_id: "" })}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition ${
                    form.department === d
                      ? "bg-forest-700 text-cream-100"
                      : "bg-cream-50 border border-ink-800/10 text-ink-800 hover:border-forest-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2 — Doctor (required) */}
          <div>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-display text-clay-500 text-2xl">02</span>
              <label className="eyebrow">Doctor <span className="normal-case text-clay-500">*required</span></label>
            </div>
            <select
              required
              value={form.doctor_id}
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value, appointment_time: "" })}
              className="w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display"
            >
              <option value="">Select a doctor…</option>
              {filteredDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization} (₹{d.consultation_fee})
                </option>
              ))}
            </select>
          </div>

          {/* STEP 3 — Date */}
          <div>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-display text-clay-500 text-2xl">03</span>
              <label className="eyebrow">Date</label>
            </div>
            <input
              type="date"
              required
              min={today}
              value={form.appointment_date}
              onChange={(e) =>
                setForm({ ...form, appointment_date: e.target.value, appointment_time: "" })
              }
              className="w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display"
            />
          </div>

          {/* STEP 4 — Slot picker */}
          {form.doctor_id && form.appointment_date && (
            <div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-display text-clay-500 text-2xl">04</span>
                <label className="eyebrow">Available time slots</label>
              </div>
              {slotsLoading ? (
                <div className="text-sm text-ink-500">Checking available slots…</div>
              ) : slots.length === 0 ? (
                <div className="text-sm text-ink-500 flex items-center gap-2">
                  <AlertCircle size={14} /> No slots could be loaded. Try another date.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setForm({ ...form, appointment_time: s.time })}
                        className={`py-2.5 rounded-full text-xs font-medium border transition ${
                          !s.available
                            ? "border-ink-800/5 bg-ink-800/5 text-ink-400 line-through cursor-not-allowed"
                            : form.appointment_time === s.time
                              ? "bg-forest-700 border-forest-700 text-cream-100"
                              : "border-ink-800/15 text-ink-800 hover:border-forest-700"
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-ink-500">
                    Morning OPD 9:00 – 13:00 · Evening OPD 17:00 – 20:00 · Greyed-out
                    times are already booked.
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 5 — Reason */}
          <div>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-display text-clay-500 text-2xl">05</span>
              <label className="eyebrow">Reason <span className="normal-case text-ink-400 tracking-normal">(optional)</span></label>
            </div>
            <textarea
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="A quick line — e.g. Chest pain since last night / Follow-up for blood report"
              className="w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none resize-none"
            />
          </div>

          {error && (
            <div className="text-sm text-clay-600 bg-clay-50 border border-clay-400/30 px-4 py-3 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-6 border-t border-ink-800/10 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-ink-500 max-w-xs">
              Reception may call or SMS to confirm exact timing.
            </p>
            <button
              type="submit"
              disabled={submitting || !form.appointment_time}
              className="btn-clay disabled:opacity-50"
            >
              {submitting ? "Booking…" : "Confirm booking"}
              <ArrowUpRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
