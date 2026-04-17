"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Check,
  X,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  User as UserIcon,
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Stethoscope,
  Ban,
  Sparkles,
  KeyRound,
  Settings,
} from "lucide-react";
import {
  getMyRecord,
  updateMyProfile,
  updateMyBasicInfo,
  myAppointments,
  cancelAppointment,
  type PatientRecord,
  type Appointment,
} from "@/lib/api";
import { useAuth } from "@/store/auth";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ProfilePage() {
  const router = useRouter();
  const { token, user, hydrated, setAuth, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [apptsLoading, setApptsLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<any>({});

  // Hydration + auth gate. Watch ONLY hydrated + token, never `user` —
  // including `user` causes an infinite loop because loadAll updates the
  // auth store, which changes `user`, which retriggers the effect.
  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.push("/login?return=/profile");
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, token]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const rec = await getMyRecord();
      setRecord(rec);
      setForm({
        first_name: rec.first_name,
        last_name: rec.last_name,
        phone: rec.phone,
        dob: rec.profile?.dob || "",
        gender: rec.profile?.gender || "",
        blood_group: rec.profile?.blood_group || "",
        address: rec.profile?.address || "",
        city: rec.profile?.city || "",
        state: rec.profile?.state || "",
        pincode: rec.profile?.pincode || "",
        emergency_contact_name: rec.profile?.emergency_contact_name || "",
        emergency_contact_phone: rec.profile?.emergency_contact_phone || "",
        allergies: rec.profile?.allergies || "",
        existing_conditions: rec.profile?.existing_conditions || "",
      });
      // Sync auth store with fresh UHID — but ONLY if it changed.
      // Calling setAuth unconditionally creates a new `user` object reference
      // every time, which can cascade into re-renders elsewhere.
      if (
        rec.profile?.uhid &&
        user &&
        token &&
        user.uhid !== rec.profile.uhid
      ) {
        setAuth(token, { ...user, uhid: rec.profile.uhid });
      }
    } catch (e: any) {
      if (e?.response?.status === 401) {
        logout();
        router.push("/login?return=/profile");
      } else {
        setError("Couldn't load your record. Try refreshing.");
      }
    } finally {
      setLoading(false);
    }

    setApptsLoading(true);
    try {
      const list = await myAppointments();
      setAppts(list);
    } catch {
      setAppts([]);
    } finally {
      setApptsLoading(false);
    }
  };

  const save = async () => {
    if (!record) return;
    setSaving(true);
    setError("");
    try {
      // 1) Basic info (first/last/phone) — goes to PUT /patients/{id}
      const basicChanged =
        form.first_name !== record.first_name ||
        form.last_name !== record.last_name ||
        form.phone !== record.phone;
      if (basicChanged) {
        await updateMyBasicInfo(record.id, {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
        });
      }

      // 2) Profile info (dob, address, medical…) — goes to PUT /patients/{id}/profile
      const profilePayload: any = {};
      const fields = [
        "dob", "gender", "blood_group", "address", "city", "state", "pincode",
        "emergency_contact_name", "emergency_contact_phone", "allergies", "existing_conditions",
      ];
      for (const f of fields) {
        if ((form[f] || "") !== (record.profile?.[f as keyof typeof record.profile] || "")) {
          profilePayload[f] = form[f] || null;
        }
      }
      if (Object.keys(profilePayload).length) {
        await updateMyProfile(record.id, profilePayload);
      }

      await loadAll();
      setEditMode(false);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    if (record) {
      setForm({
        first_name: record.first_name,
        last_name: record.last_name,
        phone: record.phone,
        dob: record.profile?.dob || "",
        gender: record.profile?.gender || "",
        blood_group: record.profile?.blood_group || "",
        address: record.profile?.address || "",
        city: record.profile?.city || "",
        state: record.profile?.state || "",
        pincode: record.profile?.pincode || "",
        emergency_contact_name: record.profile?.emergency_contact_name || "",
        emergency_contact_phone: record.profile?.emergency_contact_phone || "",
        allergies: record.profile?.allergies || "",
        existing_conditions: record.profile?.existing_conditions || "",
      });
    }
    setEditMode(false);
    setError("");
  };

  const cancelAppt = async (id: number) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      setAppts((list) => list.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Couldn't cancel. Try again.");
    }
  };

  if (!hydrated || loading) {
    return <div className="container-x py-32 text-ink-500">Loading your record…</div>;
  }
  if (!record) {
    return (
      <div className="container-x py-32 text-center">
        <div className="font-display text-3xl text-ink-900">Couldn't load your profile.</div>
        <button onClick={loadAll} className="btn-outline mt-6">Try again</button>
      </div>
    );
  }

  const fullName = `${record.first_name} ${record.last_name}`.trim();
  const initials = (record.first_name?.[0] || "") + (record.last_name?.[0] || "");

  return (
    <>
      {/* ═══════════ HEADER CARD ═══════════ */}
      <section className="container-x pt-14 pb-10">
        <div className="relative rounded-[32px] bg-forest-700 text-cream-100 overflow-hidden p-10 md:p-14">
          <svg className="absolute -top-20 -right-20 w-[500px] opacity-10 text-clay-400" viewBox="0 0 200 200" fill="currentColor">
            <path d="M42.9,-57.1C54.4,-47.4,61.6,-32.5,66.1,-16.5C70.5,-0.6,72.2,16.4,65.7,29.8C59.2,43.2,44.6,53,29.2,58.5C13.9,64,-2.2,65.2,-18.3,62.1C-34.4,59,-50.5,51.5,-60.4,39C-70.3,26.4,-74,8.8,-70.7,-7.1C-67.5,-23.1,-57.3,-37.4,-44.4,-47.5C-31.5,-57.6,-15.8,-63.5,0.3,-63.9C16.4,-64.3,31.5,-66.8,42.9,-57.1Z" transform="translate(100 100)" />
          </svg>

          <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-cream-100/10 border-2 border-cream-100/20 flex items-center justify-center font-display text-5xl">
              {initials.toUpperCase()}
            </div>
            <div>
              <div className="eyebrow !text-clay-400">Welcome back</div>
              <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[0.98]">
                {fullName}
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream-100/75">
                <span className="flex items-center gap-2"><Phone size={14} className="text-clay-400" /> {record.phone}</span>
                {record.email && !record.email.endsWith("@hospitana.local") && (
                  <span className="flex items-center gap-2"><Mail size={14} className="text-clay-400" /> {record.email}</span>
                )}
              </div>
            </div>

            {/* UHID */}
            {record.profile?.uhid && (
              <div className="card-soft !bg-cream-100 !text-ink-900 px-6 py-5 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <BadgeCheck size={14} className="text-forest-700" />
                  <span className="eyebrow">UHID</span>
                </div>
                <div className="font-display text-3xl mt-2 text-forest-900">{record.profile.uhid}</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-500 mt-1">Permanent</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ WELCOME BANNER — walk-in patients or sparse profiles ═══════════ */}
      {(() => {
        const p = record.profile;
        const profileIncomplete =
          !p?.dob || !p?.address || !p?.emergency_contact_phone;
        const hasDummyEmail = record.email?.endsWith("@hospitana.local");

        if (!profileIncomplete && !hasDummyEmail) return null;

        return (
          <section className="container-x py-4">
            <div className="card-soft p-6 md:p-7 bg-clay-50/60 border-clay-400/30 grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div className="flex gap-4 items-start">
                <Sparkles size={22} className="text-clay-500 shrink-0 mt-1" />
                <div>
                  <div className="font-display text-xl text-ink-900 leading-tight">
                    {hasDummyEmail
                      ? "Welcome! Let's complete your record."
                      : "A few details are missing."}
                  </div>
                  <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
                    {hasDummyEmail
                      ? "Reception registered you at the hospital. Add your email, emergency contact, and any allergies — it takes under a minute and helps our doctors care for you better."
                      : "Adding your DOB, address, and emergency contact helps us reach you faster and gives doctors context before you walk in."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditMode(true);
                  setTimeout(() => {
                    document.getElementById("profile-details")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}
                className="btn-clay self-start md:self-center shrink-0"
              >
                Complete profile
                <ArrowUpRight size={14} />
              </button>
            </div>

            {hasDummyEmail && (
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-500 justify-end">
                <KeyRound size={12} />
                <span>Using a default password?</span>
                <Link
                  href="/settings/password"
                  className="link-underline text-forest-700 font-medium"
                >
                  Change it here →
                </Link>
              </div>
            )}
          </section>
        );
      })()}

      {/* ═══════════ QUICK ACTIONS ═══════════ */}
      <section className="container-x py-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <Link href="/book" className="card-soft p-5 flex items-center justify-between hover:border-forest-700 transition">
            <div>
              <div className="font-display text-xl text-ink-900">Book new appointment</div>
              <div className="text-xs text-ink-500 mt-1">Pick a doctor, date, and time</div>
            </div>
            <ArrowUpRight size={18} className="text-clay-500" />
          </Link>
          <Link href="/doctors" className="card-soft p-5 flex items-center justify-between hover:border-forest-700 transition">
            <div>
              <div className="font-display text-xl text-ink-900">Our doctors</div>
              <div className="text-xs text-ink-500 mt-1">See full team</div>
            </div>
            <ArrowUpRight size={18} className="text-forest-700" />
          </Link>
          <Link href="/rooms" className="card-soft p-5 flex items-center justify-between hover:border-forest-700 transition">
            <div>
              <div className="font-display text-xl text-ink-900">Bed availability</div>
              <div className="text-xs text-ink-500 mt-1">Live across wards</div>
            </div>
            <ArrowUpRight size={18} className="text-forest-700" />
          </Link>
        </div>
      </section>

      {/* ═══════════ APPOINTMENTS ═══════════ */}
      <section className="container-x py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="eyebrow">Appointments</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 leading-[1]">
              Your <span className="serif-italic text-clay-500">visits</span>
            </h2>
          </div>
          <div className="text-sm text-ink-500">{appts.length} total</div>
        </div>

        {apptsLoading ? (
          <div className="text-ink-500">Loading appointments…</div>
        ) : appts.length === 0 ? (
          <div className="card-soft p-10 text-center">
            <CalendarIcon size={32} strokeWidth={1.2} className="text-forest-700 mx-auto" />
            <div className="font-display text-2xl text-ink-900 mt-4">No appointments yet.</div>
            <p className="text-sm text-ink-500 mt-2">
              Book your first OPD visit and it'll show up here.
            </p>
            <Link href="/book" className="btn-clay mt-6 inline-flex">
              Book appointment <ArrowUpRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appts.map((a) => {
              const cancelled = a.status === "cancelled";
              const completed = a.status === "completed";
              const past = new Date(a.appointment_date) < new Date(new Date().toDateString());
              return (
                <div key={a.id}
                  className={`card-soft p-6 grid sm:grid-cols-[auto_1fr_auto_auto] gap-6 items-center ${cancelled ? "opacity-60" : ""}`}>
                  <div className="text-center min-w-[70px]">
                    <div className="text-[10px] uppercase tracking-widest text-clay-500">
                      {new Date(a.appointment_date).toLocaleDateString("en-IN", { month: "short" })}
                    </div>
                    <div className="font-display text-4xl text-ink-900 leading-none">
                      {new Date(a.appointment_date).getDate()}
                    </div>
                    <div className="text-xs text-ink-500 mt-1">
                      {a.appointment_time?.slice(0, 5)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Stethoscope size={14} className="text-forest-700" />
                      <span className="font-display text-xl text-ink-900">
                        {a.doctor_name || `Doctor #${a.doctor_id}`}
                      </span>
                      {a.token_number ? (
                        <span className="text-xs text-ink-500">· Token #{a.token_number}</span>
                      ) : null}
                    </div>
                    {a.reason && (
                      <div className="text-sm text-ink-500 mt-1 line-clamp-1">{a.reason}</div>
                    )}
                  </div>

                  <div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${
                      cancelled ? "bg-ink-800/10 text-ink-500" :
                      completed ? "bg-forest-50 text-forest-700" :
                      "bg-clay-50 text-clay-600"
                    }`}>
                      {a.status}
                    </span>
                  </div>

                  <div>
                    {!cancelled && !completed && !past && (
                      <button onClick={() => cancelAppt(a.id)}
                        className="text-xs text-clay-600 hover:text-clay-400 flex items-center gap-1 uppercase tracking-widest font-medium">
                        <Ban size={12} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════ PROFILE DETAILS ═══════════ */}
      <section id="profile-details" className="container-x py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="eyebrow">Profile</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 leading-[1]">
              Personal <span className="serif-italic text-clay-500">details</span>
            </h2>
          </div>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="btn-outline">
              <Pencil size={12} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={cancel} className="btn-outline" disabled={saving}>
                <X size={12} /> Cancel
              </button>
              <button onClick={save} className="btn-primary" disabled={saving}>
                <Check size={14} /> {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 text-sm text-clay-600 bg-clay-50 border border-clay-400/30 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* BASIC INFO */}
          <div className="card-soft p-8">
            <div className="flex items-center gap-2 mb-5">
              <UserIcon size={18} className="text-forest-700" />
              <span className="eyebrow">Basic info</span>
            </div>
            <Field label="First name" value={form.first_name} edit={editMode}
              onChange={(v) => setForm({ ...form, first_name: v })} />
            <Field label="Last name" value={form.last_name} edit={editMode}
              onChange={(v) => setForm({ ...form, last_name: v })} />
            <Field label="Phone" value={form.phone} edit={editMode} type="tel"
              onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Email" value={record.email} edit={false}
              onChange={() => { }} note="Email can't be changed." />
          </div>

          {/* PERSONAL */}
          <div className="card-soft p-8">
            <div className="flex items-center gap-2 mb-5">
              <CalendarIcon size={18} className="text-forest-700" />
              <span className="eyebrow">Personal</span>
            </div>
            <Field label="Date of birth" type="date" value={form.dob?.slice(0, 10) || ""}
              edit={editMode}
              onChange={(v) => setForm({ ...form, dob: v })} />
            <div className="py-4 border-b border-ink-800/10">
              <div className="eyebrow mb-2">Gender</div>
              {editMode ? (
                <div className="flex gap-2 flex-wrap">
                  {["male", "female", "other"].map((g) => (
                    <button key={g} onClick={() => setForm({ ...form, gender: form.gender === g ? "" : g })}
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium border transition ${
                        form.gender === g
                          ? "bg-forest-700 border-forest-700 text-cream-100"
                          : "border-ink-800/15 text-ink-800 hover:border-forest-700"
                      }`}>{g}</button>
                  ))}
                </div>
              ) : (
                <div className="font-display text-lg text-ink-900">{form.gender || "—"}</div>
              )}
            </div>
            <div className="py-4">
              <div className="eyebrow mb-2">Blood group</div>
              {editMode ? (
                <div className="flex gap-2 flex-wrap">
                  {BLOOD_GROUPS.map((bg) => (
                    <button key={bg} type="button"
                      onClick={() => setForm({ ...form, blood_group: form.blood_group === bg ? "" : bg })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        form.blood_group === bg
                          ? "bg-clay-500 border-clay-500 text-cream-100"
                          : "border-ink-800/15 text-ink-800 hover:border-clay-500"
                      }`}>{bg}</button>
                  ))}
                </div>
              ) : (
                <div className="font-display text-2xl text-clay-500">
                  {form.blood_group || <span className="text-ink-400 text-base">Not set</span>}
                </div>
              )}
            </div>
          </div>

          {/* ADDRESS */}
          <div className="card-soft p-8 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={18} className="text-forest-700" />
              <span className="eyebrow">Address</span>
            </div>
            <Field label="Street / village / mohalla" value={form.address} edit={editMode} type="textarea"
              onChange={(v) => setForm({ ...form, address: v })} />
            <div className="grid grid-cols-3 gap-4">
              <Field label="City" value={form.city} edit={editMode}
                onChange={(v) => setForm({ ...form, city: v })} />
              <Field label="State" value={form.state} edit={editMode}
                onChange={(v) => setForm({ ...form, state: v })} />
              <Field label="Pincode" value={form.pincode} edit={editMode}
                onChange={(v) => setForm({ ...form, pincode: v })} />
            </div>
          </div>

          {/* EMERGENCY */}
          <div className="card-soft p-8">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle size={18} className="text-clay-500" />
              <span className="eyebrow">Emergency contact</span>
            </div>
            <Field label="Name" value={form.emergency_contact_name} edit={editMode}
              onChange={(v) => setForm({ ...form, emergency_contact_name: v })} />
            <Field label="Phone" type="tel" value={form.emergency_contact_phone} edit={editMode}
              onChange={(v) => setForm({ ...form, emergency_contact_phone: v })} />
          </div>

          {/* MEDICAL */}
          <div className="card-soft p-8">
            <div className="flex items-center gap-2 mb-5">
              <Heart size={18} className="text-clay-500" />
              <span className="eyebrow">Medical</span>
            </div>
            <Field label="Allergies" type="textarea"
              value={form.allergies} edit={editMode}
              onChange={(v) => setForm({ ...form, allergies: v })}
              placeholder="e.g. Penicillin, dust, peanuts" />
            <Field label="Existing conditions" type="textarea"
              value={form.existing_conditions} edit={editMode}
              onChange={(v) => setForm({ ...form, existing_conditions: v })}
              placeholder="e.g. Diabetes Type 2 since 2018, Hypertension" />
          </div>
        </div>
      </section>

      {/* ═══════════ ACCOUNT & SECURITY ═══════════ */}
      <section className="container-x py-14 pb-24">
        <div className="eyebrow">Account</div>
        <h2 className="mt-3 font-display text-4xl text-ink-900 leading-[1]">
          Security &{" "}
          <span className="serif-italic text-clay-500">sign-in</span>
        </h2>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link
            href="/settings/password"
            className="card-soft p-6 group flex items-start gap-5 hover:border-forest-700 transition"
          >
            <KeyRound size={24} strokeWidth={1.3} className="text-forest-700 shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-display text-xl text-ink-900">Change password</div>
              <div className="text-sm text-ink-500 mt-1">
                Update the password you use to sign in.
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="text-clay-500 shrink-0 transition-transform group-hover:rotate-45"
            />
          </Link>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="card-soft p-6 group flex items-start gap-5 hover:border-clay-500 transition text-left"
          >
            <Ban size={24} strokeWidth={1.3} className="text-clay-500 shrink-0 mt-1" />
            <div className="flex-1">
              <div className="font-display text-xl text-ink-900">Sign out</div>
              <div className="text-sm text-ink-500 mt-1">
                Sign out on this device. Your data stays safe.
              </div>
            </div>
          </button>
        </div>
      </section>
    </>
  );
}

/* ─── Small inline editable field component ─────────────────────────────── */
function Field({
  label, value, edit, onChange, type = "text", note, placeholder,
}: {
  label: string;
  value: string;
  edit: boolean;
  onChange: (v: string) => void;
  type?: "text" | "tel" | "date" | "textarea";
  note?: string;
  placeholder?: string;
}) {
  return (
    <div className="py-4 border-b border-ink-800/10 last:border-0">
      <div className="eyebrow mb-2">{label}</div>
      {edit ? (
        type === "textarea" ? (
          <textarea rows={2} value={value || ""} placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-0 py-2 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none resize-none" />
        ) : (
          <input type={type} value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-0 py-2 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none font-display text-lg" />
        )
      ) : (
        <div className="font-display text-lg text-ink-900 whitespace-pre-wrap">
          {value || <span className="text-ink-400 text-base italic font-body">Not set</span>}
        </div>
      )}
      {note && <div className="text-xs text-ink-400 mt-1">{note}</div>}
    </div>
  );
}