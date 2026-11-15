"use client";

import { useEffect, useRef } from "react";
import { useRooms } from "@/context/rooms";
import { ArrowUp } from "./icons";
import { RoomStage } from "./RoomStage";

export function RoomHero({
  slug,
  title,
  blurb,
  image,
  pos,
  thumb,
  thumbPos,
  count,
  from,
}: {
  slug: string;
  title: string;
  blurb: string;
  image: string;
  pos: string;
  thumb: string;
  thumbPos: string;
  count: number;
  from: string;
}) {
  const { exitRoom } = useRooms();
  const copy = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const t = Math.min(1, y / window.innerHeight);
      if (copy.current) {
        copy.current.style.transform = `translate3d(0, ${-y * 0.18}px, 0)`;
        copy.current.style.opacity = String(Math.max(0, 1 - t * 1.5));
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", on, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Leave the room by scrolling back to the top (no button needed).
  useEffect(() => {
    let armed = false; // ignore the first moments while the entrance settles
    let wentDown = false;
    let fired = false;
    let startY = 0;
    const t = setTimeout(() => (armed = true), 1800);

    const leave = () => {
      if (fired || !armed) return;
      fired = true;
      exitRoom({ slug, title, image, pos, thumb, thumbPos });
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 260) wentDown = true;
      if (hint.current) hint.current.style.opacity = y > 400 ? "1" : "0";
      // arrived back at the top after having scrolled down into the room
      if (wentDown && y <= 2) leave();
    };
    // pushing further up while already at the top
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY <= 2 && e.deltaY < -24) leave();
    };
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (window.scrollY <= 2 && e.touches[0].clientY - startY > 70) leave();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [slug, title, image, pos, thumb, thumbPos, exitRoom]);

  return (
    <>
      <RoomStage image={image} pos={pos} />

      <section className="relative h-[100dvh] min-h-[560px] w-full text-ivory">
        <div ref={copy} className="absolute inset-x-0 bottom-0 will-change-transform" style={{ paddingInline: "clamp(1.25rem, 4vw, 3.5rem)", paddingBottom: "clamp(5rem, 11vh, 8rem)" }}>
          <h1 className="room-rise font-display text-[clamp(3.2rem,8vw,7rem)] font-light leading-none" style={{ "--d": "100ms" } as React.CSSProperties}>{title}</h1>
          <div className="room-rise mt-6 flex flex-wrap items-end justify-between gap-6" style={{ "--d": "600ms" } as React.CSSProperties}>
            <p className="max-w-md text-ivory/85">{blurb}</p>
            <p className="text-[0.7rem] uppercase tracking-[0.26em] text-gold-light">
              {count} pieces · from {from}
            </p>
          </div>
        </div>

        <a
          href="#pieces"
          className="room-rise absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.34em] text-ivory/75 transition hover:text-ivory"
          style={{ "--d": "1100ms" } as React.CSSProperties}
        >
          Walk in
          <span className="relative block h-10 w-px overflow-hidden bg-ivory/25">
            <span className="absolute inset-0 bg-gold-light" style={{ animation: "scroll-cue 2.4s ease-in-out infinite" }} />
          </span>
        </a>
      </section>

      <div
        ref={hint}
        className="pointer-events-none fixed bottom-6 right-5 z-40 flex items-center gap-3 bg-emerald-deep/90 px-5 py-3.5 text-[0.66rem] uppercase tracking-[0.24em] text-ivory/90 opacity-0 backdrop-blur transition-opacity duration-500 sm:right-8"
        aria-hidden
      >
        <ArrowUp /> Scroll up to leave the room
      </div>
    </>
  );
}
