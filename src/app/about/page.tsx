import Image from "next/image";
import Link from "next/link";
import { Award, CheckCircle2, HeartHandshake, ShieldCheck, UsersRound } from "lucide-react";
import { getHospitalPhotos } from "@/lib/api";

export const revalidate = 300;

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") || "http://localhost:8000";
const FALLBACK = "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1600&q=85";

function resolveUrl(url?: string | null) {
  if (!url) return FALLBACK;
  return url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default async function AboutPage() {
  const photos = await getHospitalPhotos();
  const hero = photos[0];
  const gallery = photos.slice(1, 7);

  return (
    <>
      <section className="bg-primary py-20 text-white">
        <div className="container-x text-center"><p className="text-sm font-semibold uppercase tracking-widest text-blue-100">About Sahara Hospital</p><h1 className="mt-4 text-5xl font-extrabold sm:text-6xl">Care with compassion and responsibility</h1><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-50">Serving Bhadohi and nearby communities with dependable hospital care since 2009.</p></div>
      </section>

      <section className="py-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-xl">
            <Image src={resolveUrl(hero?.photo_url)} alt={hero?.caption || "Sahara Hospital"} fill className="object-cover" priority unoptimized={Boolean(hero)} />
          </div>
          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">Healthcare Bhadohi can count on</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">Sahara Hospital was built around a simple goal: patients should be able to receive respectful, coordinated medical care close to home.</p>
            <p className="mt-4 text-lg leading-8 text-gray-600">Today our doctors, nurses and support teams work through one connected hospital system—from appointment and admission to laboratory, pharmacy and billing.</p>
            <div className="mt-7 space-y-3">{["Patient dignity at every step", "Clear communication and transparent bills", "Modern systems with personal care"].map((item) => <p key={item} className="flex items-center gap-3 font-medium text-gray-700"><CheckCircle2 className="text-secondary" size={20} />{item}</p>)}</div>
            <Link href="/book" className="btn-primary mt-8">Book an Appointment</Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center"><p className="eyebrow">What Guides Us</p><h2 className="mt-3 text-4xl font-bold text-gray-900">Our values in everyday care</h2></div>
          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-4">{[
            { icon: HeartHandshake, title: "Compassion", text: "We listen, explain and treat every patient with dignity." },
            { icon: ShieldCheck, title: "Safety", text: "Clinical processes are organised around safe, accountable care." },
            { icon: UsersRound, title: "Teamwork", text: "Doctors and departments coordinate around the patient." },
            { icon: Award, title: "Excellence", text: "We improve our standards, systems and service continuously." },
          ].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-xl bg-white p-7 shadow-lg"><span className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-primary"><Icon size={28} /></span><h3 className="mt-5 text-xl font-bold text-gray-900">{title}</h3><p className="mt-3 leading-7 text-gray-600">{text}</p></article>)}</div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="py-20">
          <div className="container-x"><div className="text-center"><p className="eyebrow">Hospital Gallery</p><h2 className="mt-3 text-4xl font-bold text-gray-900">Inside Sahara Hospital</h2></div><div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-3">{gallery.map((photo, index) => <div key={photo.id} className={`relative overflow-hidden rounded-xl bg-gray-100 ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}><Image src={resolveUrl(photo.photo_url)} alt={photo.caption || "Sahara Hospital facility"} fill className="object-cover transition duration-500 hover:scale-105" unoptimized /></div>)}</div></div>
        </section>
      )}

      <section className="bg-blue-900 py-16 text-white">
        <div className="container-x grid gap-8 text-center sm:grid-cols-4">{[["2009", "Established"], ["24/7", "Emergency Care"], ["14+", "Specialities"], ["1", "Connected Care Team"]].map(([value, label]) => <div key={label}><strong className="block text-4xl font-extrabold">{value}</strong><span className="mt-2 block text-blue-200">{label}</span></div>)}</div>
      </section>
    </>
  );
}
