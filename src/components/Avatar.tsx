"use client";

import { useState } from "react";

/**
 * Doctor avatar with graceful fallback.
 *
 * - Uses a plain <img> (NOT next/image), because we don't control the
 *   remote format. Next's optimizer rejects SVG with 400.
 * - If the src is missing OR the image fails to load, renders initials
 *   on a forest-green background instead of a broken-image icon.
 * - Accepts the same className you'd give <Image fill>, e.g.
 *     "absolute inset-0 w-full h-full object-cover"
 */
export default function DoctorAvatar({
  src,
  name,
  className = "",
  rounded = false,
}: {
  src?: string | null;
  name: string;
  className?: string;
  rounded?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  const initials = name
    .replace(/^dr\.?\s*/i, "") // strip leading "Dr." before taking initials
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "DR";

  const roundedCls = rounded ? "rounded-full" : "";

  if (!src || errored) {
    return (
      <div
        className={`${className} ${roundedCls} bg-forest-700 flex items-center justify-center select-none`}
        aria-label={name}
      >
        <span className="font-display text-cream-100 text-[clamp(1.5rem,6vw,4rem)] tracking-tight">
          {initials}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className={`${className} ${roundedCls}`}
      loading="lazy"
    />
  );
}
