import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-[2] mt-32 bg-forest-900 text-cream-100">
      {/* Big wordmark */}
      <div className="container-x pt-20 pb-10 border-b border-cream-100/10">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-12">
          <div>
            <div className="eyebrow !text-clay-400">Sahara Hospital</div>
            <h3 className="font-display text-4xl md:text-5xl mt-4 leading-[1.05]">
              Care that <span className="serif-italic text-clay-400">stays</span>
              <br /> with you.
            </h3>
            <p className="mt-6 text-cream-100/70 max-w-sm leading-relaxed">
              Serving Bhadohi, Gopiganj, Aurai, Suriyawan and beyond since 2009. 82 beds,
              14 specialities, one promise.
            </p>
          </div>

          <div>
            <div className="eyebrow !text-clay-400 mb-5">Visit</div>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin size={16} className="shrink-0 mt-1 text-clay-400" />
                <span>GT Road, near Durgaganj Chauraha,<br /> Bhadohi, UP — 221401</span>
              </div>
              <div className="flex gap-3">
                <Phone size={16} className="shrink-0 mt-1 text-clay-400" />
                <a href="tel:08429933131">084299 33131</a>
              </div>
              <div className="flex gap-3">
                <Mail size={16} className="shrink-0 mt-1 text-clay-400" />
                <a href="mailto:care@saharahospital.in">care@saharahospital.in</a>
              </div>
            </div>
          </div>

          <div>
            <div className="eyebrow !text-clay-400 mb-5">Explore</div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/doctors" className="hover:text-clay-400">Our Doctors</Link></li>
              <li><Link href="/rooms" className="hover:text-clay-400">Beds & Rooms</Link></li>
              <li><Link href="/book" className="hover:text-clay-400">Book Appointment</Link></li>
              <li><Link href="/about" className="hover:text-clay-400">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-clay-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow !text-clay-400 mb-5">Patients</div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/login" className="hover:text-clay-400">Patient Login</Link></li>
              <li><a href="#" className="hover:text-clay-400">Insurance & Cashless</a></li>
              <li><a href="#" className="hover:text-clay-400">Ayushman Bharat</a></li>
              <li><a href="#" className="hover:text-clay-400">Download Reports</a></li>
              <li><a href="#" className="hover:text-clay-400">Feedback</a></li>
            </ul>

            <div className="flex gap-4 mt-8">
              <a href="#" className="p-2 rounded-full border border-cream-100/20 hover:bg-clay-500 hover:border-clay-500 transition">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 rounded-full border border-cream-100/20 hover:bg-clay-500 hover:border-clay-500 transition">
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized display wordmark */}
      {/* <div className="container-x overflow-hidden">
        <div className="font-display text-[18vw] md:text-[15vw] leading-[0.85] text-cream-100/5 select-none tracking-tighter -mb-4">
          Sahara<span className="serif-italic">.</span>
        </div>
      </div> */}

      <div className="container-x py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-cream-100/50 border-t border-cream-100/10">
        <span>© {new Date().getFullYear()} Sahara Hospital Pvt. Ltd. · Reg. No. UP-BDH-2009-417</span>
        <span>
          Powered by <span className="text-clay-400">Hospitana HMS</span> · Built with care.
        </span>
      </div>
    </footer>
  );
}
