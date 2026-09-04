"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Clock3,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/store/auth";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Departments", href: "/departments", dropdown: true },
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Beds & Rooms", href: "/rooms" },
  { label: "Contact", href: "/contact" },
];

const DEPARTMENTS = [
  "Cardiology", "Orthopaedics", "Paediatrics", "General Medicine",
  "Gynaecology", "Dermatology", "ENT", "General Surgery",
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { token, user, hydrated, logout } = useAuth();
  const isLoggedIn = Boolean(token && user);

  useEffect(() => {
    setMobileOpen(false);
    setDepartmentOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="bg-blue-900 text-white">
        <div className="container-x flex min-h-10 items-center justify-between gap-4 py-2 text-sm">
          <div className="flex items-center gap-5">
            <a href="tel:08429933131" className="flex items-center gap-2 font-medium hover:text-blue-200">
              <Phone size={15} /> Emergency: 084299 33131
            </a>
            <a href="mailto:care@saharahospital.in" className="hidden items-center gap-2 hover:text-blue-200 sm:flex">
              <Mail size={15} /> care@saharahospital.in
            </a>
          </div>
          <div className="hidden items-center gap-5 lg:flex">
            <span className="flex items-center gap-2"><Clock3 size={15} /> Open 24 Hours</span>
            <span className="flex items-center gap-2"><MapPin size={15} /> Bhadohi, Uttar Pradesh</span>
          </div>
        </div>
      </div>

      <div className="container-x flex h-[74px] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Sahara Hospital home">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-sm">+</span>
          <span>
            <span className="block text-xl font-bold leading-tight text-gray-900">Sahara Hospital</span>
            <span className="block text-xs font-medium uppercase tracking-[0.12em] text-blue-700">Hospitana Care</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.href} className="relative">
                <button
                  type="button"
                  onClick={() => setDepartmentOpen((open) => !open)}
                  className={`flex items-center gap-1 py-6 text-sm font-semibold transition-colors ${pathname.startsWith("/departments") ? "text-primary" : "text-gray-700 hover:text-primary"}`}
                  aria-expanded={departmentOpen}
                >
                  {link.label} <ChevronDown size={15} />
                </button>
                {departmentOpen && (
                  <div className="absolute left-0 top-full w-64 overflow-hidden rounded-lg border border-gray-100 bg-white py-2 shadow-xl">
                    <Link href="/departments" className="block border-b border-gray-100 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-blue-50">View all departments</Link>
                    {DEPARTMENTS.map((department) => (
                      <Link key={department} href={`/doctors?dept=${encodeURIComponent(department)}`} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary">
                        {department}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href} className={`py-6 text-sm font-semibold transition-colors ${pathname === link.href ? "text-primary" : "text-gray-700 hover:text-primary"}`}>
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!hydrated ? (
            <div className="h-10 w-28" />
          ) : isLoggedIn ? (
            <div ref={accountRef} className="relative">
              <button type="button" onClick={() => setAccountOpen((open) => !open)} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">{user!.first_name[0].toUpperCase()}</span>
                Hi, {user!.first_name} <ChevronDown size={14} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-12 w-60 rounded-lg border border-gray-100 bg-white p-2 shadow-xl">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-gray-900">{user!.first_name} {user!.last_name}</p>
                    <p className="truncate text-xs text-gray-500">{user!.email}</p>
                  </div>
                  <Link href="/profile" className="mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"><UserRound size={16} /> My profile</Link>
                  <Link href="/settings/password" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-blue-50">Change password</Link>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={16} /> Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-primary">Patient Login</Link>
          )}
          <Link href="/book" className="btn-primary !px-5 !py-2.5">Book Appointment</Link>
          <a href="tel:08429933131" className="btn-clay !px-4 !py-2.5">Emergency</a>
        </div>

        <button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden" aria-label="Toggle navigation" aria-expanded={mobileOpen}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-5 md:hidden">
          <nav className="container-x !px-0 py-3">
            {NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className="block border-b border-gray-100 py-3 text-base font-semibold text-gray-700">{link.label}</Link>)}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href={isLoggedIn ? "/profile" : "/login"} className="btn-outline !px-3">{isLoggedIn ? "My Profile" : "Patient Login"}</Link>
              <Link href="/book" className="btn-primary !px-3">Book Appointment</Link>
            </div>
            <a href="tel:08429933131" className="btn-clay mt-3 w-full">Emergency: 084299 33131</a>
          </nav>
        </div>
      )}
    </header>
  );
}
