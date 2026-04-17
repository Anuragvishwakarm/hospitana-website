"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff, ShieldCheck, ChevronDown } from "lucide-react";
import { registerPatient } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container-x py-32 text-ink-500">Loading…</div>}>
      <RegisterInner />
    </Suspense>
  );
}

function RegisterInner() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("return") || "/profile";
  const setAuth = useAuth((s) => s.setAuth);

  const [showOptional, setShowOptional] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    gender: "",
    blood_group: "",
    address: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload: any = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone,
        password: form.password,
      };
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.dob) payload.dob = form.dob;
      if (form.gender) payload.gender = form.gender;
      if (form.blood_group) payload.blood_group = form.blood_group;
      if (form.address.trim()) payload.address = form.address.trim();

      const res = await registerPatient(payload);
      setAuth(res.access_token, res.user);
      router.push(returnTo);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Couldn't create the account. Try a different email/phone or a stronger password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] grid lg:grid-cols-2">
      {/* LEFT */}
      <div className="relative bg-forest-700 text-cream-100 p-12 md:p-20 flex flex-col justify-between overflow-hidden">
        <svg className="absolute -top-20 -right-20 w-[500px] opacity-15 text-clay-400" viewBox="0 0 200 200" fill="currentColor">
          <path d="M42.9,-57.1C54.4,-47.4,61.6,-32.5,66.1,-16.5C70.5,-0.6,72.2,16.4,65.7,29.8C59.2,43.2,44.6,53,29.2,58.5C13.9,64,-2.2,65.2,-18.3,62.1C-34.4,59,-50.5,51.5,-60.4,39C-70.3,26.4,-74,8.8,-70.7,-7.1C-67.5,-23.1,-57.3,-37.4,-44.4,-47.5C-31.5,-57.6,-15.8,-63.5,0.3,-63.9C16.4,-64.3,31.5,-66.8,42.9,-57.1Z" transform="translate(100 100)" />
        </svg>
        <div className="relative">
          <div className="eyebrow !text-clay-400">New Patient</div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[0.98]">
            Create your<br />
            <span className="serif-italic text-clay-400">Sahara account.</span>
          </h1>
          <p className="mt-8 text-cream-100/75 max-w-md leading-relaxed">
            One account for your entire family. Book appointments, see reports, track
            prescriptions, pay bills — all in one place. A permanent UHID is issued
            on signup.
          </p>
        </div>
        <div className="relative flex items-center gap-3 text-sm text-cream-100/60 mt-12">
          <ShieldCheck size={16} className="text-clay-400" />
          Your data is encrypted and never sold. Period.
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-10 md:p-12">
        <form onSubmit={submit} className="w-full max-w-md space-y-5">
          <div className="eyebrow">Register</div>
          <h2 className="font-display text-4xl text-ink-900 leading-tight">
            Takes less than<br />
            <span className="serif-italic text-clay-500">60 seconds.</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="eyebrow block">First name</label>
              <input type="text" required value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="mt-2 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none font-display" />
            </div>
            <div>
              <label className="eyebrow block">Last name</label>
              <input type="text" required value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="mt-2 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none font-display" />
            </div>
          </div>

          <div>
            <label className="eyebrow block">
              Phone <span className="normal-case text-clay-500">*required</span>
            </label>
            <input type="tel" required pattern="[0-9]{10}" maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-2 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none font-display" />
          </div>

          <div>
            <label className="eyebrow block">
              Email <span className="normal-case text-ink-400 tracking-normal">(optional)</span>
            </label>
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none font-display" />
          </div>

          <div>
            <label className="eyebrow block">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} required minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full px-0 py-3 pr-10 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none font-display" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-ink-500">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mt-1 text-xs text-ink-400">Minimum 6 characters.</div>
          </div>

          {/* Collapsible optional medical info */}
          <button type="button" onClick={() => setShowOptional(!showOptional)}
            className="flex items-center gap-2 text-sm font-medium text-forest-700 pt-2">
            <ChevronDown size={14} className={`transition-transform ${showOptional ? "rotate-180" : ""}`} />
            {showOptional ? "Skip medical details" : "Add medical details"}
            <span className="text-xs text-ink-400 font-normal normal-case">(can do later)</span>
          </button>

          {showOptional && (
            <div className="space-y-4 pt-2 pl-6 border-l-2 border-forest-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block">Date of birth</label>
                  <input type="date" value={form.dob} max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="mt-2 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none font-display" />
                </div>
                <div>
                  <label className="eyebrow block">Gender</label>
                  <select value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="mt-2 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none font-display">
                    <option value="">—</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="eyebrow block">Blood group</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <button key={bg} type="button"
                      onClick={() => setForm({ ...form, blood_group: form.blood_group === bg ? "" : bg })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        form.blood_group === bg
                          ? "bg-clay-500 border-clay-500 text-cream-100"
                          : "border-ink-800/15 text-ink-800 hover:border-clay-500"
                      }`}>
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="eyebrow block">Address</label>
                <textarea rows={2} value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Village / Mohalla, Town, District"
                  className="mt-2 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none resize-none" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-clay-600 bg-clay-50 border border-clay-400/30 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50">
            {loading ? "Creating account…" : "Create account"}
            <ArrowUpRight size={14} />
          </button>

          <div className="text-center text-sm text-ink-500 pt-4 border-t border-ink-800/10">
            Already have an account?{" "}
            <Link href={`/login${returnTo ? `?return=${encodeURIComponent(returnTo)}` : ""}`}
              className="link-underline text-forest-700 font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
