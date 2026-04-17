"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Phone, LogOut } from "lucide-react";
import { useAuth } from "@/store/auth";

const NAV_LINKS = [
  { label: "Doctors", href: "/doctors" },
  { label: "Beds & Rooms", href: "/rooms" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const { token, user, hydrated, logout } = useAuth();
  const isLoggedIn = Boolean(token && user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <div className="relative z-40 bg-forest-900 text-cream-100">
        <div className="container-x flex items-center justify-between py-2 text-[11px] font-medium uppercase tracking-[0.18em]">
          <span className="hidden md:inline opacity-80">
            24 × 7 Emergency · Ayushman Bharat · Cashless insurance accepted
          </span>
          <span className="md:hidden opacity-80">Sahara Hospital, Bhadohi</span>
          <a href="tel:08429933131" className="flex items-center gap-2 hover:text-clay-400 transition">
            <Phone size={12} /> 084299 33131
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-cream-100/85 backdrop-blur-md border-b border-ink-800/10" : "bg-transparent"
        }`}
      >
        <div className="container-x flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-3 group">
            <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
              <circle cx="20" cy="20" r="19" fill="#0F4C4A" />
              <path
                d="M13 12 V28 M13 20 H27 M27 12 V28"
                stroke="#FAF6EF"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="20" cy="20" r="1.8" fill="#C76D52" />
            </svg>
            <div className="leading-none">
              <div className="font-display text-[22px] font-semibold text-ink-900 tracking-tight">
                Sahara
              </div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-forest-700 font-medium mt-0.5">
                Hospital · Bhadohi
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-ink-800 link-underline">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!hydrated ? (
              <div className="w-20 h-8" />
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border border-ink-800/15 hover:border-forest-700 transition"
                >
                  <span className="w-8 h-8 rounded-full bg-forest-700 text-cream-100 flex items-center justify-center font-display text-sm">
                    {user!.first_name[0].toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">Hi, {user!.first_name}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 min-w-[220px] card-soft p-3 z-50">
                    <div className="px-3 py-2 border-b border-ink-800/10">
                      <div className="text-xs text-ink-500 uppercase tracking-widest">
                        Signed in as
                      </div>
                      <div className="text-sm font-medium mt-0.5 truncate">{user!.email}</div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-cream-100"
                    >
                      My profile
                    </Link>
                    <Link
                      href="/book"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-cream-100"
                    >
                      Book appointment
                    </Link>
                    <Link
                      href="/settings/password"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-cream-100"
                    >
                      Change password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-cream-100 text-clay-600"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-ink-800 link-underline">
                  Sign in
                </Link>
                <Link href="/book" className="btn-clay !py-3 !px-5 !text-xs">
                  Book Appointment
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 -mr-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-ink-800/10 bg-cream-100">
            <div className="container-x py-6 flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-display text-2xl text-ink-900">
                  {l.label}
                </Link>
              ))}

              <div className="border-t border-ink-800/10 pt-4 mt-2">
                {hydrated && isLoggedIn ? (
                  <>
                    <div className="text-sm text-ink-500 mb-3">
                      Signed in as <span className="font-medium text-ink-800">{user!.first_name}</span>
                    </div>
                    <Link href="/profile" onClick={() => setOpen(false)} className="block text-sm text-ink-500 mb-3">
                      My profile →
                    </Link>
                    <Link href="/book" onClick={() => setOpen(false)} className="btn-clay self-start mb-3">
                      Book Appointment
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setOpen(false); }}
                      className="flex items-center gap-2 text-sm text-clay-600"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="block text-sm text-ink-500 mb-3">
                      Sign in →
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)} className="block text-sm text-ink-500 mb-3">
                      Create account →
                    </Link>
                    <Link href="/book" onClick={() => setOpen(false)} className="btn-clay self-start">
                      Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
