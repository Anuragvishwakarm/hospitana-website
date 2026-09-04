import Link from "next/link";
import {
  Activity, Ambulance, ArrowRight, BedDouble, ClipboardPlus,
  FlaskConical, HeartPulse, Pill, ShieldCheck, Stethoscope,
} from "lucide-react";

const services = [
  { title: "Emergency Care", icon: Ambulance, description: "Immediate medical attention and coordinated emergency support, available 24/7.", features: ["24-hour availability", "Rapid clinical assessment", "Ambulance coordination"] },
  { title: "Outpatient Consultation", icon: Stethoscope, description: "Appointments with experienced doctors across multiple medical specialities.", features: ["Online booking", "Live slot availability", "Follow-up consultation"] },
  { title: "Pharmacy", icon: Pill, description: "Convenient medicine dispensing connected with hospital prescriptions and patient records.", features: ["Medicine inventory", "Prescription dispensing", "Batch and expiry tracking"] },
  { title: "Diagnostic Laboratory", icon: FlaskConical, description: "Structured test ordering, sample collection and digital result management.", features: ["Test catalogue", "Sample tracking", "Digital reports"] },
  { title: "Beds & Admissions", icon: BedDouble, description: "Ward-based admissions with live bed status and organised discharge records.", features: ["Live availability", "Ward selection", "Admission and discharge"] },
  { title: "Critical Care", icon: HeartPulse, description: "Monitored support for patients who need continuous observation and intensive care.", features: ["ICU support", "Clinical monitoring", "Specialist coordination"] },
  { title: "Patient Records", icon: ClipboardPlus, description: "Secure patient profiles with UHID, appointments and essential medical information.", features: ["Unique hospital ID", "Profile history", "Appointment records"] },
  { title: "Cashless Support", icon: ShieldCheck, description: "Guidance for eligible government schemes and supported insurance processes.", features: ["Ayushman Bharat guidance", "Insurance assistance", "Transparent billing"] },
  { title: "Preventive Care", icon: Activity, description: "Routine consultations and diagnostic services that support early detection.", features: ["Health consultation", "Routine tests", "Ongoing care guidance"] },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-primary py-20 text-white">
        <div className="container-x text-center"><p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Hospital Care</p><h1 className="mt-4 text-5xl font-extrabold sm:text-6xl">Our Services</h1><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-50">Connected medical and support services designed to make every hospital visit safer and simpler.</p></div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="container-x grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, icon: Icon, description, features }) => (
            <article key={title} className="rounded-xl bg-white p-7 shadow-lg">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-primary"><Icon size={29} /></span>
              <h2 className="mt-5 text-2xl font-bold text-gray-900">{title}</h2>
              <p className="mt-3 leading-7 text-gray-600">{description}</p>
              <ul className="mt-5 space-y-2 text-sm text-gray-600">{features.map((feature) => <li key={feature} className="flex gap-2"><span className="font-bold text-secondary">✓</span>{feature}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-red-600 py-14 text-white">
        <div className="container-x flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left"><div><h2 className="text-3xl font-bold">Need urgent medical help?</h2><p className="mt-2 text-red-100">Emergency support is available around the clock.</p></div><a href="tel:08429933131" className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-bold text-red-600 hover:bg-red-50">Call 084299 33131 <ArrowRight size={17} /></a></div>
      </section>
      <section className="container-x py-16 text-center"><h2 className="text-3xl font-bold text-gray-900">Plan your consultation</h2><p className="mt-3 text-lg text-gray-600">Choose a specialist and select an available OPD slot online.</p><Link href="/book" className="btn-primary mt-7">Book Appointment <ArrowRight size={17} /></Link></section>
    </>
  );
}
