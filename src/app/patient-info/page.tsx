import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, HelpCircle, ShieldCheck, UserRound } from "lucide-react";

const steps = [
  ["1", "Registration", "Provide basic contact details and receive your unique hospital ID."],
  ["2", "Clinical assessment", "The care team reviews your needs and guides you to the right doctor or ward."],
  ["3", "Admission or consultation", "Complete the required documents and begin your planned care."],
  ["4", "Discharge and follow-up", "Receive instructions, bills and follow-up appointment guidance."],
];

const faqs = [
  ["What should I bring for my visit?", "Carry a valid photo ID, previous prescriptions or reports, and details of medicines you currently take."],
  ["What are the OPD timings?", "Most OPD slots run Monday to Saturday, 9:00 AM–1:00 PM and 5:00 PM–8:00 PM. Availability varies by doctor."],
  ["Can I book online?", "Yes. Sign in or create a patient account, choose a doctor and select a live available time slot."],
  ["How do I check bed availability?", "Open the Beds & Rooms page to view ward-level availability. Final admission is confirmed by reception."],
  ["Is emergency care available at night?", "Yes. Emergency support is available 24 hours a day. Call 084299 33131 before arrival when possible."],
];

export default function PatientInfoPage() {
  return (
    <>
      <section className="bg-primary py-20 text-white"><div className="container-x text-center"><p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Before Your Visit</p><h1 className="mt-4 text-5xl font-extrabold sm:text-6xl">Patient Information</h1><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-50">Useful information to help you prepare for appointments, admission and follow-up care.</p></div></section>
      <section className="py-20"><div className="container-x"><div className="mx-auto max-w-3xl text-center"><p className="eyebrow">Admission Process</p><h2 className="mt-3 text-4xl font-bold text-gray-900">What to expect</h2></div><div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-4">{steps.map(([number, title, text]) => <div key={number} className="text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">{number}</span><h3 className="mt-5 text-xl font-bold text-gray-900">{title}</h3><p className="mt-3 leading-7 text-gray-600">{text}</p></div>)}</div></div></section>
      <section className="bg-gray-50 py-20"><div className="container-x grid gap-7 md:grid-cols-3">{[
        { icon: UserRound, title: "Patient account", text: "Register once to book appointments and maintain your contact and medical profile.", href: "/register", label: "Create account" },
        { icon: FileText, title: "Prepare documents", text: "Bring identification, insurance or scheme details, past reports and current prescriptions.", href: "/profile", label: "My profile" },
        { icon: ShieldCheck, title: "Insurance support", text: "Contact reception before admission for Ayushman Bharat and cashless-process guidance.", href: "/contact", label: "Contact reception" },
      ].map(({ icon: Icon, title, text, href, label }) => <article key={title} className="rounded-xl bg-white p-7 shadow-lg"><Icon size={30} className="text-primary" /><h3 className="mt-5 text-2xl font-bold text-gray-900">{title}</h3><p className="mt-3 leading-7 text-gray-600">{text}</p><Link href={href} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">{label} <ArrowRight size={16} /></Link></article>)}</div></section>
      <section className="py-20"><div className="container-x max-w-4xl"><div className="text-center"><HelpCircle className="mx-auto text-primary" size={38} /><h2 className="mt-4 text-4xl font-bold text-gray-900">Frequently Asked Questions</h2></div><div className="mt-10 space-y-4">{faqs.map(([question, answer]) => <article key={question} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><h3 className="flex items-start gap-3 text-lg font-bold text-gray-900"><CheckCircle2 className="mt-0.5 shrink-0 text-secondary" size={20} />{question}</h3><p className="mt-3 pl-8 leading-7 text-gray-600">{answer}</p></article>)}</div></div></section>
      <section className="bg-blue-900 py-14 text-white"><div className="container-x text-center"><h2 className="text-3xl font-bold">Ready to plan your visit?</h2><p className="mt-3 text-blue-100">Book online or call reception for help.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/book" className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 font-semibold text-blue-800">Book Appointment</Link><a href="tel:08429933131" className="inline-flex items-center justify-center rounded-lg border border-white px-7 py-3 font-semibold">Call 084299 33131</a></div></div></section>
    </>
  );
}
