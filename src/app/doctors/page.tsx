"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Clock3, Languages, Search, Star, Stethoscope } from "lucide-react";
import DoctorAvatar from "@/components/Avatar";
import { getDoctors } from "@/lib/api";
import { DEPARTMENTS, type Doctor } from "@/lib/mockData";

export default function DoctorsPage() {
  return <Suspense fallback={<div className="container-x py-24 text-gray-500">Loading doctors…</div>}><DoctorsDirectory /></Suspense>;
}

function DoctorsDirectory() {
  const params = useSearchParams();
  const initialDepartment = params.get("dept") || "all";
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(initialDepartment);

  useEffect(() => {
    setLoading(true);
    getDoctors().then(setDoctors).finally(() => setLoading(false));
  }, []);

  useEffect(() => setDepartment(initialDepartment), [initialDepartment]);

  const departmentOptions = useMemo(
    () => Array.from(new Set([...DEPARTMENTS, ...doctors.map((doctor) => doctor.department)])).filter(Boolean),
    [doctors],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const departmentMatches = department === "all" || doctor.department.toLowerCase() === department.toLowerCase();
      const searchMatches = !query || [doctor.name, doctor.specialization, doctor.department, doctor.qualification].some((value) => value.toLowerCase().includes(query));
      return departmentMatches && searchMatches;
    });
  }, [doctors, department, search]);

  return (
    <>
      <section className="bg-primary py-20 text-white">
        <div className="container-x text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Our Medical Team</p>
          <h1 className="mt-4 text-5xl font-extrabold sm:text-6xl">Find a Doctor</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-50">Search by name or speciality, view doctor details and choose an available appointment slot.</p>
        </div>
      </section>

      <section className="sticky top-[114px] z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="container-x py-5">
          <div className="grid gap-4 md:grid-cols-[1fr_280px]">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctor, speciality or qualification" className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-blue-100" />
            </label>
            <select value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-blue-100">
              <option value="all">All departments</option>
              {departmentOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-x">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div><h2 className="text-2xl font-bold text-gray-900">{department === "all" ? "All Doctors" : department}</h2><p className="mt-1 text-gray-500">{loading ? "Loading…" : `${filtered.length} doctor${filtered.length === 1 ? "" : "s"} found`}</p></div>
            <Link href="/departments" className="hidden font-semibold text-primary hover:text-blue-800 sm:inline-flex">Browse departments <ArrowRight className="ml-2" size={17} /></Link>
          </div>

          {loading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-[420px] animate-pulse rounded-xl bg-white shadow-md"><div className="h-56 bg-blue-100" /><div className="space-y-3 p-6"><div className="h-4 rounded bg-gray-200" /><div className="h-6 rounded bg-gray-200" /><div className="h-4 rounded bg-gray-200" /></div></div>)}</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl bg-white px-6 py-16 text-center shadow-md"><Stethoscope className="mx-auto text-blue-300" size={44} /><h2 className="mt-5 text-2xl font-bold text-gray-900">No doctors found</h2><p className="mt-2 text-gray-600">Try another name or select all departments.</p><button type="button" onClick={() => { setSearch(""); setDepartment("all"); }} className="btn-primary mt-6">Clear Filters</button></div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((doctor) => (
                <article key={doctor.id} className="overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-blue-50"><DoctorAvatar src={doctor.photo_url} name={doctor.name} className="h-full w-full object-cover" /><span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">Available</span></div>
                  <div className="p-5">
                    <p className="text-sm font-semibold text-primary">{doctor.specialization}</p>
                    <h2 className="mt-1 text-xl font-bold text-gray-900">{doctor.name}</h2>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">{doctor.qualification}</p>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2"><Clock3 size={15} className="text-primary" /> {doctor.experience_years}+ years experience</p>
                      <p className="flex items-center gap-2"><Languages size={15} className="text-primary" /> {doctor.languages.join(", ")}</p>
                      <p className="flex items-center gap-2"><Star size={15} className="fill-amber-400 text-amber-400" /> {doctor.rating.toFixed(1)} patient rating</p>
                    </div>
                    <div className="mt-5 flex gap-2"><Link href={`/doctors/${doctor.id}`} className="btn-outline flex-1 !px-3 !py-2.5">Profile</Link><Link href={`/book?doctor=${doctor.id}`} className="btn-primary flex-1 !px-3 !py-2.5">Book</Link></div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
