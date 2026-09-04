import Link from "next/link";
import DoctorAvatar from "@/components/Avatar";
import {
  Activity, Ambulance, ArrowRight, Baby, BedDouble, Bone, Brain,
  CheckCircle2, Clock3, FlaskConical, HeartPulse, MapPin, Phone,
  Pill, ShieldCheck, Stethoscope, Syringe, UsersRound,
} from "lucide-react";
import { getDoctors, getHospitalPhotos, getHospitalStats, getWards } from "@/lib/api";

export const revalidate = 60;

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:8000";

function resolveUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

const departments = [
  { name: "Cardiology", icon: HeartPulse, text: "Heart care, diagnostics and cardiac consultations." },
  { name: "Orthopaedics", icon: Bone, text: "Bone, joint, spine and trauma care." },
  { name: "Paediatrics", icon: Baby, text: "Complete healthcare for infants and children." },
  { name: "General Medicine", icon: Stethoscope, text: "Everyday medical care and chronic disease support." },
  { name: "Gynaecology", icon: Activity, text: "Women’s health, maternity and preventive care." },
  { name: "Neurology", icon: Brain, text: "Brain, spine and nervous-system consultations." },
  { name: "Dermatology", icon: Syringe, text: "Skin, hair and allergy care." },
  { name: "General Surgery", icon: UsersRound, text: "Experienced surgical teams and follow-up care." },
];

const services = [
  { title: "24/7 Emergency", icon: Ambulance, text: "Rapid emergency response with doctors and support staff available around the clock." },
  { title: "Pharmacy", icon: Pill, text: "In-hospital medicine dispensing and stock-supported patient care." },
  { title: "Diagnostic Laboratory", icon: FlaskConical, text: "Routine and specialist tests with digital order and report tracking." },
  { title: "ICU & Critical Care", icon: Activity, text: "Monitored beds and coordinated critical-care support." },
  { title: "Beds & Admissions", icon: BedDouble, text: "Live ward availability and streamlined patient admission." },
  { title: "Preventive Care", icon: ShieldCheck, text: "Consultations and tests that support early detection and healthier living." },
];

const tips = [
  { category: "Preventive care", title: "Five health checks adults should discuss with their doctor", date: "Health Guide" },
  { category: "Emergency", title: "When chest pain needs immediate medical attention", date: "Patient Safety" },
  { category: "Family health", title: "Preparing children for a comfortable hospital visit", date: "Care Advice" },
];

export default async function HomePage() {
  const [doctors, wards, stats, photos] = await Promise.all([
    getDoctors(), getWards(), getHospitalStats(), getHospitalPhotos(),
  ]);

  const featuredDoctors = doctors.slice(0, 4);
  const totalBeds = wards.reduce((sum, ward) => sum + ward.total_beds, 0);
  const availableBeds = wards.reduce((sum, ward) => sum + ward.available_beds, 0);
  const heroImage = photos[0]?.photo_url
    ? resolveUrl(photos[0].photo_url)
    : "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=2070&q=85";

  return (
    <>
      <section className="relative min-h-[640px] overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${heroImage}")` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-blue-900/35" />
        <div className="container-x relative flex min-h-[640px] items-center py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <ShieldCheck size={17} /> Trusted healthcare in Bhadohi since 2009
            </div>
            <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              Your Health,<br />Our Priority
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50 sm:text-xl">
              Compassionate hospital care, experienced doctors and essential medical services—available for your family 24 hours a day.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/book" className="btn-primary !bg-white !px-8 !py-4 !text-base !text-blue-700 hover:!bg-blue-50">
                Book Appointment <ArrowRight size={18} />
              </Link>
              <Link href="/doctors" className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white transition hover:bg-white hover:text-blue-700">
                Find a Doctor
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-blue-50">
              <span className="flex items-center gap-2"><Clock3 size={17} /> Open 24/7</span>
              <span className="flex items-center gap-2"><ShieldCheck size={17} /> Ayushman Bharat support</span>
              <span className="flex items-center gap-2"><MapPin size={17} /> Bhadohi, Uttar Pradesh</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-red-600 text-white">
        <div className="container-x grid gap-5 py-5 text-center sm:grid-cols-3 sm:text-left">
          <a href="tel:08429933131" className="flex items-center justify-center gap-3 sm:justify-start">
            <Phone size={22} /><span><strong className="block">Emergency</strong><span className="text-red-100">084299 33131 · Available 24/7</span></span>
          </a>
          <div className="flex items-center justify-center gap-3">
            <Clock3 size={22} /><span><strong className="block">Hospital Hours</strong><span className="text-red-100">Open 24 hours daily</span></span>
          </div>
          <a href="tel:08429933131" className="flex items-center justify-center gap-3 sm:justify-end">
            <Ambulance size={24} /><span><strong className="block">Ambulance</strong><span className="text-red-100">Call 084299 33131</span></span>
          </a>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl shadow-xl">
            <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85")' }} />
            <div className="absolute bottom-5 right-5 rounded-lg bg-white p-5 shadow-lg">
              <div className="text-3xl font-extrabold text-primary">17+</div>
              <div className="text-sm font-medium text-gray-600">Years of service</div>
            </div>
          </div>
          <div>
            <p className="eyebrow">About Sahara Hospital</p>
            <h2 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">Quality care, close to home</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Sahara Hospital brings essential specialties, emergency support and coordinated patient services together at one trusted location in Bhadohi.
            </p>
            <div className="mt-7 space-y-3">
              {["Experienced specialists and caring clinical teams", "Integrated appointments, laboratory, pharmacy and billing", "Live bed availability and smooth admission support"].map((item) => (
                <p key={item} className="flex items-start gap-3 text-gray-700"><CheckCircle2 className="mt-0.5 shrink-0 text-secondary" size={20} /> {item}</p>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-200 pt-7 text-center">
              <div><strong className="block text-3xl text-primary">{stats.doctors || featuredDoctors.length}+</strong><span className="text-sm text-gray-500">Doctors</span></div>
              <div><strong className="block text-3xl text-primary">{totalBeds || stats.beds}+</strong><span className="text-sm text-gray-500">Beds</span></div>
              <div><strong className="block text-3xl text-primary">{stats.departments || departments.length}+</strong><span className="text-sm text-gray-500">Specialities</span></div>
            </div>
            <Link href="/about" className="btn-primary mt-8">Learn More About Us <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Medical Departments</p>
            <h2 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">Specialist care for every stage of life</h2>
            <p className="mt-5 text-lg text-gray-600">Find the right department and book directly with an available doctor.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map(({ name, icon: Icon, text }) => (
              <Link key={name} href={`/doctors?dept=${encodeURIComponent(name)}`} className="group rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-primary transition group-hover:bg-primary group-hover:text-white"><Icon size={28} /></span>
                <h3 className="mt-5 text-xl font-bold text-gray-900">{name}</h3>
                <p className="mt-3 leading-6 text-gray-600">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">View doctors <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href="/departments" className="btn-outline">View All Departments</Link></div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="eyebrow">Meet Our Doctors</p><h2 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">Care from experienced specialists</h2></div>
            <Link href="/doctors" className="btn-outline">View All Doctors <ArrowRight size={17} /></Link>
          </div>
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDoctors.map((doctor) => (
              <article key={doctor.id} className="overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-[4/3] overflow-hidden bg-blue-50">
                  <DoctorAvatar src={doctor.photo_url} name={doctor.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-primary">{doctor.specialization}</p>
                  <h3 className="mt-1 text-xl font-bold text-gray-900">{doctor.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{doctor.qualification} · {doctor.experience_years}+ years</p>
                  <div className="mt-5 flex gap-2"><Link href={`/doctors/${doctor.id}`} className="btn-outline flex-1 !px-3 !py-2">Profile</Link><Link href={`/book?doctor=${doctor.id}`} className="btn-primary flex-1 !px-3 !py-2">Book</Link></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-900 py-20 text-white">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Our Services</p><h2 className="mt-3 text-4xl font-bold sm:text-5xl">Complete hospital support under one roof</h2></div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ title, icon: Icon, text }) => (
              <div key={title} className="rounded-xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                <Icon size={32} className="text-blue-200" /><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-blue-100">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href="/services" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-800 hover:bg-blue-50">Explore All Services <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-800 text-white shadow-xl">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Online Appointment</p>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Book your hospital visit in a few simple steps</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">Create your patient account, choose a doctor and select an available OPD time. Your booking goes directly into the hospital system.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/book" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 font-semibold text-primary hover:bg-blue-50">Book Appointment <ArrowRight size={17} /></Link><a href="tel:08429933131" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white px-7 py-3.5 font-semibold hover:bg-white/10"><Phone size={17} /> Call Reception</a></div>
            </div>
            <div className="flex items-center bg-blue-950/30 p-8 sm:p-12">
              <div className="w-full rounded-xl bg-white p-6 text-gray-800 shadow-lg">
                <h3 className="text-xl font-bold">Live hospital availability</h3>
                <div className="mt-5 flex items-end justify-between border-b border-gray-100 pb-5"><span className="text-gray-600">Beds currently available</span><strong className="text-4xl text-secondary">{availableBeds}</strong></div>
                <div className="mt-5 flex items-end justify-between"><span className="text-gray-600">Total active beds</span><strong className="text-3xl text-primary">{totalBeds}</strong></div>
                <Link href="/rooms" className="btn-outline mt-6 w-full">View Beds & Rooms</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div><p className="eyebrow">Patient Information</p><h2 className="mt-3 text-4xl font-bold text-gray-900">A smoother hospital experience</h2><p className="mt-5 text-lg leading-8 text-gray-600">Know what to bring, how admission works and where to find your appointment details before you arrive.</p><Link href="/patient-info" className="btn-primary mt-7">View Patient Information <ArrowRight size={17} /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[["Patient account", "Register once to manage appointments and your medical profile."], ["Admission support", "Reception coordinates your ward, bed and assigned doctor."], ["Digital records", "View scheduled appointments and keep profile details updated."], ["Cashless care", "Ask reception about Ayushman Bharat and supported insurance."]].map(([title, text]) => <div key={title} className="rounded-xl bg-white p-5 shadow-md"><CheckCircle2 className="text-secondary" /><h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3><p className="mt-2 text-gray-600">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center"><p className="eyebrow">Health Resources</p><h2 className="mt-3 text-4xl font-bold text-gray-900">Useful guidance for patients and families</h2></div>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {tips.map((tip, index) => <article key={tip.title} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md"><div className={`h-2 ${index === 0 ? "bg-primary" : index === 1 ? "bg-red-600" : "bg-secondary"}`} /><div className="p-6"><p className="text-sm font-semibold text-primary">{tip.category}</p><h3 className="mt-3 text-xl font-bold leading-7 text-gray-900">{tip.title}</h3><p className="mt-5 text-sm text-gray-500">{tip.date}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div><p className="eyebrow">Contact Us</p><h2 className="mt-3 text-4xl font-bold text-gray-900">We’re here whenever you need care</h2><p className="mt-5 text-lg leading-8 text-gray-600">Call reception for appointments, admission questions or emergency support.</p><div className="mt-8 space-y-4"><a href="tel:08429933131" className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-primary"><Phone /></span><span><strong className="block text-gray-900">084299 33131</strong><span className="text-sm text-gray-500">Emergency & reception</span></span></a><div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-primary"><MapPin /></span><span><strong className="block text-gray-900">Sahara Hospital</strong><span className="text-sm text-gray-500">GT Road, Bhadohi, UP — 221401</span></span></div></div><Link href="/contact" className="btn-primary mt-7">Contact Details <ArrowRight size={17} /></Link></div>
          <div className="min-h-[360px] overflow-hidden rounded-xl bg-gray-200 shadow-lg"><iframe title="Sahara Hospital location" src="https://www.openstreetmap.org/export/embed.html?bbox=82.53%2C25.37%2C82.63%2C25.47&layer=mapnik" className="h-full min-h-[360px] w-full border-0" loading="lazy" /></div>
        </div>
      </section>
    </>
  );
}
