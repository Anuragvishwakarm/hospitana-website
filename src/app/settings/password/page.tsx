"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { changePassword } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token, user, hydrated } = useAuth();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!token || !user) router.push("/login?return=/settings/password");
  }, [hydrated, token, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.new_password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (form.new_password !== form.confirm_password) {
      setError("New passwords don't match.");
      return;
    }
    if (form.new_password === form.current_password) {
      setError("New password must be different from current.");
      return;
    }

    setSaving(true);
    try {
      await changePassword(form.current_password, form.new_password);
      setSuccess(true);
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Couldn't change password. Please check current password and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated || !user) {
    return <div className="container-x py-32 text-ink-500">Loading…</div>;
  }

  return (
    <section className="container-x py-12 md:py-16">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-forest-700 transition mb-8"
      >
        <ArrowLeft size={14} /> Back to profile
      </Link>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 max-w-5xl">
        {/* LEFT */}
        <div>
          <div className="eyebrow">Settings</div>
          <h1 className="mt-6 font-display text-5xl md:text-6xl leading-[0.98] text-ink-900">
            Change<br />
            <span className="serif-italic text-clay-500">password.</span>
          </h1>
          <p className="mt-8 text-ink-500 leading-relaxed">
            If reception gave you a default password when you registered at the hospital,
            this is the place to change it to something only you know.
          </p>

          <div className="mt-10 space-y-4 text-sm">
            <div className="flex gap-3 text-ink-500">
              <ShieldCheck size={16} className="text-forest-700 shrink-0 mt-0.5" />
              <span>Passwords are hashed with bcrypt. Even our staff can't read them.</span>
            </div>
            <div className="flex gap-3 text-ink-500">
              <KeyRound size={16} className="text-forest-700 shrink-0 mt-0.5" />
              <span>Use at least 6 characters. A mix of letters and numbers is stronger.</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {success ? (
            <div className="card-soft p-10 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-forest-50 flex items-center justify-center">
                <CheckCircle2 size={30} className="text-forest-700" />
              </div>
              <h2 className="mt-6 font-display text-4xl text-ink-900 leading-tight">
                Password<br />
                <span className="serif-italic text-clay-500">updated.</span>
              </h2>
              <p className="mt-4 text-ink-500">
                Your new password is active. Use it the next time you sign in.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link href="/profile" className="btn-outline">
                  Back to profile
                </Link>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn-primary"
                >
                  Change again
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="card-soft p-8 md:p-10 space-y-6">
              {/* Current */}
              <div>
                <label className="eyebrow block">Current password</label>
                <div className="relative">
                  <input
                    type={showPw.current ? "text" : "password"}
                    required
                    value={form.current_password}
                    onChange={(e) =>
                      setForm({ ...form, current_password: e.target.value })
                    }
                    className="mt-3 w-full px-0 py-3 pr-10 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display"
                    placeholder="What reception gave you, or your existing password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw({ ...showPw, current: !showPw.current })}
                    className="absolute right-0 top-1/2 translate-y-1 p-2 text-ink-500"
                    tabIndex={-1}
                  >
                    {showPw.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New */}
              <div>
                <label className="eyebrow block">New password</label>
                <div className="relative">
                  <input
                    type={showPw.next ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.new_password}
                    onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                    className="mt-3 w-full px-0 py-3 pr-10 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw({ ...showPw, next: !showPw.next })}
                    className="absolute right-0 top-1/2 translate-y-1 p-2 text-ink-500"
                    tabIndex={-1}
                  >
                    {showPw.next ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="eyebrow block">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showPw.confirm ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.confirm_password}
                    onChange={(e) =>
                      setForm({ ...form, confirm_password: e.target.value })
                    }
                    className="mt-3 w-full px-0 py-3 pr-10 bg-transparent border-b border-ink-800/20 focus:border-forest-700 focus:outline-none text-lg font-display"
                    placeholder="Type it again"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPw({ ...showPw, confirm: !showPw.confirm })
                    }
                    className="absolute right-0 top-1/2 translate-y-1 p-2 text-ink-500"
                    tabIndex={-1}
                  >
                    {showPw.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-clay-600 bg-clay-50 border border-clay-400/30 px-4 py-3 rounded-xl flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-4 border-t border-ink-800/10 flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/forgot-password"
                  className="text-xs text-ink-500 link-underline"
                >
                  Forgot your current password?
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary disabled:opacity-50"
                >
                  {saving ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
