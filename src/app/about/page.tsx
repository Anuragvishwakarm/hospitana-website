import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, Users, Award, Handshake } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* HEADER */}
      <section className="container-x pt-16 pb-20">
        <div className="eyebrow">
          <span className="inline-block w-8 h-px bg-forest-700 align-middle mr-3" />
          Our story
        </div>
        <h1 className="mt-6 font-display text-6xl md:text-[120px] leading-[0.92] text-ink-900 max-w-5xl">
          Small hospital. <span className="serif-italic text-clay-500">Big heart.</span>
        </h1>
        <p className="mt-8 text-xl text-ink-500 leading-relaxed max-w-2xl">
          Sahara Hospital started in 2009 with four beds above a chemist shop on GT Road.
          Seventeen years later, we still pick up the phone ourselves.
        </p>
      </section>

      {/* IMAGE BLOCK */}
      <section className="container-x mb-24">
        <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1600&auto=format&fit=crop&q=80"
            alt="Sahara Hospital"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-cream-100 font-display text-3xl md:text-5xl max-w-2xl leading-[1.05]">
            “Bhadohi deserves care that doesn't need a <span className="serif-italic">five-hour bus ride.</span>”
            <div className="mt-4 text-sm uppercase tracking-widest opacity-80">
              — Dr. V.N. Mishra, founder
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="container-x py-16">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16">
          <div>
            <div className="eyebrow">What guides us</div>
            <h2 className="mt-4 font-display text-5xl text-ink-900 leading-[1]">
              Four things<br />
              we <span className="serif-italic text-clay-500">don't</span> compromise on.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Heart,
                t: "Dignity first",
                d: "Whether the patient is on Ayushman Bharat or a private policy, the same bed, same nurse, same waiting time.",
              },
              {
                icon: Users,
                t: "Local over branded",
                d: "Every permanent doctor lives within 15 km. You bump into them at the sabzi mandi — that's the point.",
              },
              {
                icon: Award,
                t: "NABH standards",
                d: "Infection control, sterile protocols, and independent audits — the same standards a Tier-1 hospital follows.",
              },
              {
                icon: Handshake,
                t: "Transparent bills",
                d: "Itemised, printed, explained before you pay. No surprises in the discharge slip.",
              },
            ].map((v) => (
              <div key={v.t} className="card-soft p-8">
                <v.icon size={28} strokeWidth={1.3} className="text-forest-700" />
                <div className="font-display text-2xl text-ink-900 mt-5">{v.t}</div>
                <p className="mt-3 text-sm text-ink-500 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="container-x py-16">
        <div className="eyebrow">Milestones</div>
        <h2 className="mt-4 font-display text-5xl text-ink-900 leading-[1]">
          Seventeen years, <span className="serif-italic text-clay-500">one page</span>.
        </h2>
        <div className="mt-12 grid md:grid-cols-4 gap-[1px] bg-ink-800/10 rounded-3xl overflow-hidden border border-ink-800/10">
          {[
            { y: "2009", t: "Opened on GT Road", d: "4 beds, one GP, one nurse." },
            { y: "2014", t: "Moved to new building", d: "40 beds, OT and lab commissioned." },
            { y: "2019", t: "ICU + cath lab", d: "First cardiac stent performed on-site." },
            { y: "2026", t: "82 beds · 14 depts", d: "Going digital with Hospitana HMS." },
          ].map((m) => (
            <div key={m.y} className="bg-cream-100 p-8">
              <div className="font-display text-4xl text-clay-500">{m.y}</div>
              <div className="mt-4 font-display text-xl text-ink-900">{m.t}</div>
              <div className="mt-2 text-sm text-ink-500">{m.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-16">
        <Link
          href="/contact"
          className="group relative overflow-hidden rounded-[32px] bg-forest-700 text-cream-100 p-12 md:p-16 block hover:bg-forest-900 transition"
        >
          <div className="eyebrow !text-clay-400">Want to work with us?</div>
          <h3 className="mt-4 font-display text-5xl md:text-7xl leading-[0.98] max-w-3xl">
            We're always hiring<br />
            <span className="serif-italic">nurses, technicians,</span> and good doctors.
          </h3>
          <div className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-widest">
            Drop your CV{" "}
            <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
          </div>
        </Link>
      </section>
    </>
  );
}
