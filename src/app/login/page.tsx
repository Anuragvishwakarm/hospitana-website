"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { loginPatient } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-x py-32 text-ink-500">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("return") || "/profile";
  const setAuth = useAuth((s) => s.setAuth);

  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const identifier = method === "email"
        ? { email: form.identifier }
        : { phone: form.identifier };
      const res = await loginPatient(identifier, form.password);
      setAuth(res.access_token, res.user);
      router.push(returnTo);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Couldn't sign you in. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="relative bg-forest-700 text-cream-100 p-12 md:p-20 flex flex-col justify-between overflow-hidden">
        <svg className="absolute -top-20 -right-20 w-[500px] opacity-15 text-clay-400" viewBox="0 0 200 200" fill="currentColor">
          <path d="M42.9,-57.1C54.4,-47.4,61.6,-32.5,66.1,-16.5C70.5,-0.6,72.2,16.4,65.7,29.8C59.2,43.2,44.6,53,29.2,58.5C13.9,64,-2.2,65.2,-18.3,62.1C-34.4,59,-50.5,51.5,-60.4,39C-70.3,26.4,-74,8.8,-70.7,-7.1C-67.5,-23.1,-57.3,-37.4,-44.4,-47.5C-31.5,-57.6,-15.8,-63.5,0.3,-63.9C16.4,-64.3,31.5,-66.8,42.9,-57.1Z" transform="translate(100 100)" />
        </svg>
        <div className="relative">
          <div className="eyebrow !text-clay-400">Patient Portal</div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[0.98]">
            Welcome<br />
            <span className="serif-italic text-clay-400">back.</span>
          </h1>
          <p className="mt-8 text-cream-100/75 max-w-md leading-relaxed">
            Sign in to book appointments, see reports, and track your family's care.
          </p>
        </div>
        <div className="relative flex items-center gap-3 text-sm text-cream-100/60 mt-12">
          <ShieldCheck size={16} className="text-clay-400" />
          End-to-end encrypted. Records stay on our servers in India.
        </div>
      </div>

      <div className="flex items-center justify-center p-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div className="eyebrow">Sign in</div>
          <h2 className="font-display text-4xl text-ink-900 leading-tight">
            Use your phone<br />
            <span className="serif-italic text-clay-500">or email.</span>
          </h2>

          {/* Toggle */}
          <div className="inline-flex p-1 bg-cream-200/50 rounded-full">
            <button type="button" onClick={() => setMethod("phone")}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium transition ${
                method === "phone" ? "bg-forest-700 text-cream-100" : "text-ink-500"
              }`}>Phone</button>
            <button type="button" onClick={() => setMethod("email")}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium transition ${
                method === "email" ? "bg-forest-700 text-cream-100" : "text-ink-500"
              }`}>Email</button>
          </div>

          <div>
            <label className="eyebrow block">{method === "phone" ? "Phone" : "Email"}</label>
            <input
              type={method === "phone" ? "tel" : "email"}
              required
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              className="mt-3 w-full px-0 py-3 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display"
            />
          </div>

          <div>
            <label className="eyebrow block">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-3 w-full px-0 py-3 pr-10 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-ink-500">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-clay-600 bg-clay-50 border border-clay-400/30 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50">
            {loading ? "Signing in…" : "Sign in"}
            <ArrowUpRight size={14} />
          </button>

          <div className="text-center">
            <Link href="/forgot-password" className="text-xs text-ink-500 link-underline">
              Forgot password?
            </Link>
          </div>

          <div className="text-center text-sm text-ink-500 pt-4 border-t border-ink-800/10">
            Don't have an account yet?{" "}
            <Link href={`/register${returnTo ? `?return=${encodeURIComponent(returnTo)}` : ""}`}
              className="link-underline text-forest-700 font-medium">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
