import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, Users, Award, Handshake } from "lucide-react";
import { getHospitalPhotos } from "@/lib/api";

// Revalidate every 5 minutes so newly uploaded photos show up without redeploy
export const revalidate = 300;

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:8000";

function resolveUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Fallback used only when admin hasn't uploaded any photos yet
const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1600&auto=format&fit=crop&q=80";

export default async function AboutPage() {
  const photos = await getHospitalPhotos();

  // Pick first photo for the big banner, rest for the mosaic below
  const heroPhoto = photos[0];
  const mosaicPhotos = photos.slice(1, 7); // up to 6 mosaic tiles

  const heroSrc = heroPhoto ? resolveUrl(heroPhoto.photo_url) : FALLBACK_HERO;

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

      {/* HERO IMAGE — uses first uploaded photo, falls back to stock */}
      <section className="container-x mb-24">
        <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden">
          <Image
            src={heroSrc}
            alt={heroPhoto?.caption || "Sahara Hospital"}
            fill
            className="object-cover"
            priority
            unoptimized={!!heroPhoto} // skip Next optimizer for backend-hosted photos
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-cream-100 font-display text-3xl md:text-5xl max-w-2xl leading-[1.05]">
            "Bhadohi deserves care that doesn't need a{" "}
            <span className="serif-italic">five-hour bus ride.</span>"
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

      {/* ═══════════ PHOTO MOSAIC — only shows if admin has uploaded ═══════════ */}
      {mosaicPhotos.length > 0 && (
        <section className="container-x py-16">
          <div className="flex flex-wrap items-end justify-between mb-12 gap-6">
            <div>
              <div className="eyebrow">Behind our walls</div>
              <h2 className="mt-4 font-display text-5xl text-ink-900 leading-[1]">
                See the place<br />
                <span className="serif-italic text-clay-500">
                  before you come.
                </span>
              </h2>
            </div>
            <p className="text-ink-500 max-w-sm leading-relaxed">
              Honest photos of the hospital, not stock images. Taken on weekdays,
              during regular OPD hours.
            </p>
          </div>

          {/* Editorial mosaic — first image large, rest smaller */}
          <div className="grid grid-cols-6 gap-3 auto-rows-[180px]">
            {mosaicPhotos.map((photo, i) => {
              // Varying sizes for editorial feel
              const spans = [
                "col-span-4 row-span-2", // big hero tile
                "col-span-2 row-span-1",
                "col-span-2 row-span-1",
                "col-span-3 row-span-1",
                "col-span-3 row-span-1",
                "col-span-6 row-span-1", // wide bottom
              ];
              const spanClass = spans[i] || "col-span-2 row-span-1";

              return (
                <div
                  key={photo.id}
                  className={`relative rounded-2xl overflow-hidden bg-forest-50 group ${spanClass}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveUrl(photo.photo_url)}
                    alt={photo.caption || `Sahara Hospital photo ${photo.id}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-900/80 to-transparent px-5 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-cream-100 text-sm font-display leading-tight">
                        {photo.caption}
                      </p>
                      {photo.category && (
                        <div className="text-[10px] uppercase tracking-widest text-clay-400 mt-1">
                          {photo.category.replace("-", " ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

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