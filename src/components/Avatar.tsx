"use client";

import { useState } from "react";

/**
 * Doctor avatar with graceful fallback.
 *
 * - Uses a plain <img> (NOT next/image) because we don't control the
 *   remote format (uploaded JPG/PNG/WEBP, ui-avatars PNG, dicebear SVG).
 * - Backend may return a RELATIVE path like `/uploads/doctors/7.jpg`.
 *   We resolve it against the API host so the browser can fetch it.
 * - If the src is missing OR the image fails to load, renders initials
 *   on a forest-green background instead of a broken-image icon.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:8000";

function resolveUrl(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  // Relative path from backend — prefix with API host
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

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
  const resolvedSrc = resolveUrl(src);

  const initials =
    name
      .replace(/^dr\.?\s*/i, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "DR";

  const roundedCls = rounded ? "rounded-full" : "";

  if (!resolvedSrc || errored) {
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
      src={resolvedSrc}
      alt={name}
      onError={() => setErrored(true)}
      className={`${className} ${roundedCls}`}
      loading="lazy"
    />
  );
}