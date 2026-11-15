"use client";

import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "./icons";

export function Carousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div className="mb-6 hidden justify-end gap-3 md:flex">
        <button aria-label="Previous" onClick={() => scroll(-1)} className="grid h-11 w-11 place-items-center border border-line transition hover:border-emerald hover:bg-emerald hover:text-ivory">
          <ArrowLeft />
        </button>
        <button aria-label="Next" onClick={() => scroll(1)} className="grid h-11 w-11 place-items-center border border-line transition hover:border-emerald hover:bg-emerald hover:text-ivory">
          <ArrowRight />
        </button>
      </div>
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 max-md:-mx-5 max-md:px-5 md:gap-7"
      >
        {children}
      </div>
    </div>
  );
}
