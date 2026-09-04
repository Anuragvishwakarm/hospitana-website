import Link from "next/link";
import {
  Activity, ArrowRight, Baby, Bone, Brain, Ear, HeartPulse,
  ShieldPlus, Sparkles, Stethoscope,
} from "lucide-react";

const departments = [
  { name: "Cardiology", icon: HeartPulse, description: "Consultation and diagnostic support for heart and cardiovascular conditions.", services: ["Cardiac consultation", "ECG support", "Blood-pressure care"] },
  { name: "Orthopaedics", icon: Bone, description: "Care for bones, joints, sports injuries, fractures and mobility concerns.", services: ["Fracture care", "Joint consultation", "Physiotherapy guidance"] },
  { name: "Paediatrics", icon: Baby, description: "Family-centred medical care for newborns, children and adolescents.", services: ["Child consultation", "Growth monitoring", "Vaccination guidance"] },
  { name: "General Medicine", icon: Stethoscope, description: "Primary medical care, diagnosis and management of common illnesses.", services: ["General OPD", "Chronic care", "Preventive checks"] },
  { name: "Gynaecology", icon: Activity, description: "Respectful women’s health, maternity and reproductive-care services.", services: ["Women’s OPD", "Antenatal care", "Maternity support"] },
  { name: "Neurology", icon: Brain, description: "Assessment and care planning for brain, spine and nerve conditions.", services: ["Neurology OPD", "Headache clinic", "Nerve assessment"] },
  { name: "Dermatology", icon: Sparkles, description: "Diagnosis and treatment support for skin, hair and allergy concerns.", services: ["Skin consultation", "Allergy review", "Hair care"] },
  { name: "ENT", icon: Ear, description: "Specialist care for ear, nose, throat and related conditions.", services: ["ENT consultation", "Hearing review", "Sinus care"] },
  { name: "General Surgery", icon: ShieldPlus, description: "Surgical consultation, procedures and coordinated recovery care.", services: ["Surgical OPD", "Minor procedures", "Post-operative care"] },
];

export default function DepartmentsPage() {
  return (
    <>
      <section className="bg-primary py-20 text-white">
        <div className="container-x text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Clinical Specialities</p>
          <h1 className="mt-4 text-5xl font-extrabold sm:text-6xl">Medical Departments</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-50">Experienced teams working together to provide dependable healthcare for patients of every age.</p>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="container-x grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {departments.map(({ name, icon: Icon, description, services }) => (
            <article key={name} className="rounded-xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-primary"><Icon size={29} /></span>
              <h2 className="mt-5 text-2xl font-bold text-gray-900">{name}</h2>
              <p className="mt-3 leading-7 text-gray-600">{description}</p>
              <ul className="mt-5 space-y-2 text-sm text-gray-600">{services.map((service) => <li key={service} className="flex gap-2"><span className="text-secondary">✓</span>{service}</li>)}</ul>
              <Link href={`/doctors?dept=${encodeURIComponent(name)}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:text-blue-800">Find a doctor <ArrowRight size={16} /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="container-x py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Not sure which department you need?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">Call reception and briefly describe your concern. Our team will guide you to the right specialist.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><a href="tel:08429933131" className="btn-primary">Call 084299 33131</a><Link href="/book" className="btn-outline">Book Appointment</Link></div>
      </section>
    </>
  );
}
