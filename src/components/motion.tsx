"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Fade/slide-in on scroll. Single shared IntersectionObserver. */
let io: IntersectionObserver | null = null;
function observer() {
  if (!io && typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io?.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
  }
  return io;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "h2" | "h3";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = observer();
    if (!o) {
      el.classList.add("in");
      return;
    }
    o.observe(el);
    return () => o.unobserve(el);
  }, []);
  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Comp>
  );
}

/**
 * Scroll-linked parallax. Moves its child vertically relative to the viewport
 * centre. Uses a single rAF-throttled scroll listener and transform only.
 */
export function Parallax({
  children,
  speed = 0.15,
  className = "",
  scale = 1,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  scale?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const el = inner.current;
    if (!w || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = w.getBoundingClientRect();
      const vh = window.innerHeight;
      const mid = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-mid * speed).toFixed(1)}px, 0) scale(${scale})`;
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const vis = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "20% 0px" },
    );
    vis.observe(w);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      vis.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, scale]);

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="h-full w-full will-change-transform" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
