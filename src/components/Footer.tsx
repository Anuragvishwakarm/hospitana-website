import Link from "next/link";
import { Clock3, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const explore = [["About Us", "/about"], ["Departments", "/departments"], ["Our Doctors", "/doctors"], ["Services", "/services"], ["Beds & Rooms", "/rooms"]];
const patientLinks = [["Book Appointment", "/book"], ["Patient Login", "/login"], ["My Profile", "/profile"], ["Patient Information", "/patient-info"], ["Contact Us", "/contact"]];

export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-900 text-white">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl font-bold">+</span><span className="text-xl font-bold">Sahara Hospital</span></Link>
            <p className="mt-5 max-w-sm text-base leading-7 text-gray-300">Compassionate, dependable healthcare for Bhadohi and nearby communities, available 24 hours a day.</p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700"><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 hover:bg-pink-700"><Instagram size={18} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">{explore.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-blue-300">{label}</Link></li>)}</ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Patient Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">{patientLinks.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-blue-300">{label}</Link></li>)}</ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Contact & Hours</h3>
            <div className="mt-5 space-y-4 text-sm leading-6 text-gray-300">
              <p className="flex gap-3"><MapPin className="mt-1 shrink-0 text-blue-400" size={17} /> GT Road, near Durgaganj Chauraha, Bhadohi, UP — 221401</p>
              <a href="tel:08429933131" className="flex gap-3 hover:text-blue-300"><Phone className="shrink-0 text-blue-400" size={17} /> 084299 33131</a>
              <a href="mailto:care@saharahospital.in" className="flex gap-3 hover:text-blue-300"><Mail className="shrink-0 text-blue-400" size={17} /> care@saharahospital.in</a>
              <p className="flex gap-3"><Clock3 className="shrink-0 text-blue-400" size={17} /> Emergency and hospital services: Open 24/7</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container-x flex flex-col justify-between gap-2 py-5 text-sm text-gray-400 md:flex-row"><span>© {new Date().getFullYear()} Sahara Hospital. All rights reserved.</span><span>Powered by Hospitana Hospital Management System</span></div>
      </div>
    </footer>
  );
}
