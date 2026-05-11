"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:8000";

function resolveUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

type Props = {
  photos: Array<{ id: number; photo_url: string; caption?: string | null }>;
  /** Used when photos list is empty. */
  fallbackSrc: string;
  /** ms per slide. Default 5000. */
  interval?: number;
  /**
   * Full-bleed mode: dots centered at the bottom, no caption overlay.
   * (Caption overlay would overlap the hero text.)
   */
  fullBleed?: boolean;
};

const FALLBACK_ALT = "Sahara Hospital";

export default function HeroSlideshow({
  photos,
  fallbackSrc,
  interval = 5000,
  fullBleed = false,
}: Props) {
  const slides =
    photos.length > 0
      ? photos.map((p) => ({
          src: resolveUrl(p.photo_url),
          alt: p.caption || FALLBACK_ALT,
        }))
      : [{ src: fallbackSrc, alt: FALLBACK_ALT }];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [index, paused, slides.length, interval]);

  // Pause when tab is hidden
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const jumpTo = (i: number) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIndex(i);
  };

  return (
    <div className="relative w-full h-full">
      {/* Slide stack */}
      {slides.map((slide, i) => {
        const active = i === index;
        const isFirst = i === 0;
        return (
          <div
            key={`${slide.src}-${i}`}
            aria-hidden={!active}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: active ? 1 : 0 }}
          >
            {isFirst ? (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority
                unoptimized={!slide.src.startsWith("https://images.unsplash")}
                sizes="100vw"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.src}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        );
      })}

      {/* Dot navigation */}
      {slides.length > 1 && (
        <div
          className={`absolute z-30 flex gap-2 ${
            fullBleed
              ? "bottom-20 left-1/2 -translate-x-1/2"
              : "bottom-6 right-6"
          }`}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "w-10 h-1.5 bg-cream-100"
                  : "w-1.5 h-1.5 bg-cream-100/50 hover:bg-cream-100/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Caption — only shown in card mode (not full-bleed, it would fight with hero text) */}
      {!fullBleed && slides[index].alt !== FALLBACK_ALT && (
        <div className="absolute bottom-6 left-6 max-w-xs z-10">
          <div className="text-cream-100 text-xs font-display leading-snug bg-forest-900/60 backdrop-blur-sm px-3 py-2 rounded-lg">
            {slides[index].alt}
          </div>
        </div>
      )}
    </div>
  );
}