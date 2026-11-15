"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * The room's backdrop is a still frame from the hero video — the exact frame the
 * entry transition lands on. It stays put (no video playback); it only deepens and
 * eases in slightly as you scroll down into the product listing.
 */
export function RoomStage({ image, pos }: { image: string; pos: string }) {
  const zoom = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      if (dim.current) dim.current.style.opacity = String(0.18 + p * 0.62);
      if (zoom.current && !reduced) zoom.current.style.transform = `scale(${1 + p * 0.05})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("scroll", on, { passive: true });
    paint();
    return () => {
      window.removeEventListener("scroll", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-emerald-deep" aria-hidden>
      <div ref={zoom} className="absolute inset-0 will-change-transform">
        <div className="room-arrive absolute inset-0">
          <Image src={image} alt="" fill priority sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: pos }} />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-deep/60 to-transparent" />
      <div ref={dim} className="absolute inset-0 bg-emerald-deep" style={{ opacity: 0.18 }} />
    </div>
  );
}
