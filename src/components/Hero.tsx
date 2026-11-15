"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRooms } from "@/context/rooms";
import { ArrowRight } from "./icons";

export type RoomCard = {
  slug: string;
  title: string;
  sub: string;
  count: number;
  image: string; // room frame
  pos: string;
  thumb: string; // category thumbnail
  thumbPos: string;
};

/**
 * One pinned scene, three beats, all driven by scroll:
 *  1. The video scrubs forward to the last frame (woman presenting the necklace case).
 *  2. The first room card appears inside that case, exactly where she is pointing.
 *  3. The video fades away and the remaining room cards glide in from the right.
 */
const VEND = 0.5; // scroll progress at which the video reaches its last frame
const CARD_IN: [number, number] = [0.455, 0.54]; // first card appears
const RAIL: [number, number] = [0.56, 0.97]; // cards travel
const VIDEO_OUT: [number, number] = [0.56, 0.74];

export function Hero({ rooms }: { rooms: RoomCard[] }) {
  const router = useRouter();
  const { hidden, entering, enterRoom } = useRooms();

  const wrap = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const videoBox = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const mid = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    rooms.forEach((r) => router.prefetch(`/collections/${r.slug}`));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const v = video.current;
    const w = wrap.current;
    if (!v || !w) return;

    const n = rooms.length;
    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

    let dur = v.duration || 10;
    let target = 0; // scroll progress we want
    let cur = 0; // eased progress we render
    let raf = 0;
    let lastTime = -1;

    // geometry (recomputed on resize)
    let vw = 0, vh = 0, cw = 0, ch = 0, gap = 0, start = 0, travel = 0, top = 0, railLeft = 0, mobile = false;
    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      mobile = vw < 768;
      if (mobile) {
        ch = Math.min(vh * 0.6, ((vw * 0.7) * 4) / 3);
        cw = ch * 0.75;
        gap = 16;
        railLeft = 0;
      } else {
        ch = Math.min(vh * 0.72, 640);
        cw = Math.min(ch * 0.75, vw * 0.3);
        ch = cw / 0.75;
        gap = 32;
        railLeft = vw * 0.34;
      }
      const anchorCenter = mobile ? vw * 0.5 : vw * 0.645; // centre of the necklace case in the video
      start = anchorCenter - cw / 2;
      const total = n * cw + (n - 1) * gap;
      travel = Math.max(0, start - (vw - 40 - total));
      top = (vh - ch) / 2 + (mobile ? 0 : vh * 0.02);
      cards.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${cw}px`;
        el.style.height = `${ch}px`;
        el.style.top = `${top}px`;
      });
      if (layer.current) {
        const m = `linear-gradient(to right, transparent ${railLeft}px, #000 ${railLeft + (mobile ? 0 : 110)}px)`;
        layer.current.style.maskImage = m;
        layer.current.style.webkitMaskImage = m;
      }
    };

    const render = (p: number) => {
      const vp = clamp(p / VEND);

      // video time follows scroll (never plays by itself)
      const tm = vp * (dur - 0.05);
      if (!v.seeking && Math.abs(tm - lastTime) > 0.001) {
        lastTime = tm;
        try {
          v.currentTime = tm;
        } catch {}
      }

      // headline beats
      if (intro.current) {
        const o = 1 - seg(vp, 0.06, 0.28);
        intro.current.style.opacity = String(o);
        intro.current.style.transform = `translate3d(0, ${(1 - o) * -40}px, 0)`;
      }
      if (mid.current) {
        const o = Math.min(seg(vp, 0.3, 0.42), 1 - seg(vp, 0.52, 0.62));
        mid.current.style.opacity = String(o);
        mid.current.style.transform = `translate3d(0, ${(1 - seg(vp, 0.3, 0.42)) * 30}px, 0)`;
      }
      if (outro.current) {
        const o = seg(vp, 0.84, 0.97) * (1 - seg(p, 0.56, 0.62)) * (mobile ? 1 - seg(p, 0.47, 0.52) : 1);
        outro.current.style.opacity = String(o);
        outro.current.style.transform = `translate3d(0, ${(1 - seg(vp, 0.84, 0.97)) * 40}px, 0)`;
        outro.current.style.pointerEvents = o > 0.6 ? "auto" : "none";
      }
      if (heading.current) {
        const o = seg(p, 0.62, 0.72);
        heading.current.style.opacity = String(o);
        heading.current.style.transform = `translate3d(0, ${(1 - o) * 30}px, 0)`;
      }
      if (cue.current) cue.current.style.opacity = String(1 - seg(p, 0.02, 0.1));
      if (bar.current) bar.current.style.transform = `scaleY(${p})`;

      // video fades away, stage settles to deep green
      const vo = seg(p, VIDEO_OUT[0], VIDEO_OUT[1]);
      if (videoBox.current) {
        videoBox.current.style.opacity = String(1 - vo);
        videoBox.current.style.transform = `scale(${1 + vo * 0.1})`;
      }
      if (veil.current) veil.current.style.opacity = String(vo);

      // cards
      const a1 = seg(p, CARD_IN[0], CARD_IN[1]);
      const t = seg(p, RAIL[0], RAIL[1]);
      const slideIn = 1 - seg(t, 0, 0.14); // later cards glide in from the right at the start of the rail
      cards.current.forEach((el, i) => {
        if (!el) return;
        let x = start + i * (cw + gap) - t * travel;
        let op: number;
        if (i === 0) {
          op = a1;
        } else {
          x += slideIn * vw * 0.4;
          op = clamp((vw - x) / (cw * 0.5)) * (1 - slideIn);
        }
        const sc = 0.9 + 0.1 * op;
        el.style.transform = `translate3d(${x}px,0,0) scale(${sc})`;
        el.style.opacity = String(op);
        el.style.pointerEvents = op > 0.5 ? "auto" : "none";
        el.style.visibility = op < 0.01 ? "hidden" : "visible";
      });
      if (counter.current) {
        // which card is closest to the focus point
        const focus = mobile ? vw * 0.5 : vw * 0.645;
        let best = 0;
        let bd = Infinity;
        cards.current.forEach((el, i) => {
          const x = start + i * (cw + gap) - t * travel + slideIn * (i ? vw * 0.4 : 0) + cw / 2;
          const d = Math.abs(x - focus);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        counter.current.textContent = `0${best + 1}`;
      }
    };

    const tick = () => {
      raf = 0;
      const d = target - cur;
      cur = Math.abs(d) < 0.0004 ? target : cur + d * 0.14;
      render(cur);
      if (cur !== target || v.seeking) raf = requestAnimationFrame(tick);
    };

    const progressNow = () => {
      const r = w.getBoundingClientRect();
      return clamp(-r.top / (w.offsetHeight - window.innerHeight));
    };
    const onScroll = () => {
      target = progressNow();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const wrapTop = () => w.getBoundingClientRect().top + window.scrollY;
    const scrollForP = (p: number) => wrapTop() + p * (w.offsetHeight - window.innerHeight);

    // exit-room hook: put a given card in the middle of the screen, instantly
    const onFocus = (e: Event) => {
      const slug = (e as CustomEvent<{ slug: string }>).detail.slug;
      const i = rooms.findIndex((r) => r.slug === slug);
      if (i < 0) return;
      const wantCentre = vw * 0.5;
      const centreAtT0 = start + i * (cw + gap) + cw / 2;
      const t = clamp((centreAtT0 - wantCentre) / (travel || 1));
      const p = i === 0 && t === 0 ? 0.56 : RAIL[0] + t * (RAIL[1] - RAIL[0]);
      window.scrollTo({ top: scrollForP(p), behavior: "instant" });
      target = cur = progressNow();
      render(cur);
    };

    const onMeta = () => {
      dur = v.duration || dur;
      onScroll();
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    v.pause();
    if (v.readyState >= 1) onMeta();
    else v.addEventListener("loadedmetadata", onMeta, { once: true });
    const unlock = () => {
      v.play().then(() => v.pause()).catch(() => {});
    };
    window.addEventListener("touchstart", unlock, { once: true, passive: true });

    measure();
    target = cur = progressNow();
    render(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("savara:focus-room", onFocus);
    (window as unknown as { __heroScrollFor?: (p: number) => number }).__heroScrollFor = scrollForP;
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("savara:focus-room", onFocus);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rooms]);

  const goRooms = () => {
    const f = (window as unknown as { __heroScrollFor?: (p: number) => number }).__heroScrollFor;
    if (f) window.scrollTo({ top: f(0.57), behavior: "smooth" });
  };

  return (
    <section ref={wrap} id="hero-scrub" className="relative h-[880svh] bg-cream text-ivory">
      <div className="sticky top-0 h-[100svh] min-h-[600px] w-full overflow-hidden">
        {/* video */}
        <div ref={videoBox} className="absolute inset-0 will-change-transform">
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            poster="/video/hero-poster.webp"
            aria-hidden
            tabIndex={-1}
          >
            <source src="/video/hero-scrub.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(42,29,12,0.6)_0%,rgba(42,29,12,0)_24%,rgba(42,29,12,0)_46%,rgba(42,29,12,0.8)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(42,29,12,0.55)_0%,rgba(42,29,12,0)_60%)]" />
        </div>
        <div ref={veil} className="pointer-events-none absolute inset-0 bg-cream" style={{ opacity: 0 }} />

        {/* intro */}
        <div ref={intro} className="container-x absolute inset-x-0 bottom-0 pb-[clamp(5rem,11vh,8rem)] will-change-transform">
          <p className="eyebrow hero-in !text-gold-light" style={{ "--d": "300ms" } as React.CSSProperties}>
            Savara Fine Jewellery · Since 1924
          </p>
          <h1
            className="font-hero hero-in mt-5 max-w-[15ch] text-[clamp(2.6rem,6.4vw,6.2rem)] leading-[1.02]"
            style={{ "--d": "500ms" } as React.CSSProperties}
          >
            Jewellery made to be <span className="hero-accent">remembered.</span>
          </h1>
          <p className="hero-in mt-7 max-w-md text-[0.98rem] leading-7 text-ivory/85" style={{ "--d": "750ms" } as React.CSSProperties}>
            Hand-finished diamonds and 22K gold. Scroll to step inside our maison.
          </p>
        </div>

        {/* mid caption */}
        <div ref={mid} className="container-x pointer-events-none absolute inset-x-0 bottom-[16vh] opacity-0 will-change-transform">
          <p className="eyebrow !text-gold-light">The Maison</p>
          <p className="font-hero mt-4 max-w-[16ch] text-[clamp(2.1rem,4.4vw,4rem)] leading-[1.06]">A century of gold, <span className="hero-accent">set by hand.</span></p>
        </div>

        {/* outro (left of the case) */}
        <div ref={outro} className="container-x absolute inset-x-0 bottom-[12vh] opacity-0 will-change-transform">
          <p className="eyebrow !text-gold-light">Every piece has a room</p>
          <p className="font-hero mt-4 max-w-[13ch] text-[clamp(2.3rem,5vw,4.6rem)] leading-[1.04]">
            Choose your <span className="hero-accent">room.</span>
          </p>
          <button onClick={goRooms} className="btn btn-gold mt-8">
            Enter the rooms <ArrowRight />
          </button>
        </div>

        {/* rooms heading (left column once the video has gone) */}
        <div ref={heading} className="pointer-events-none absolute left-0 top-1/2 hidden w-[32vw] -translate-y-1/2 pl-[clamp(1.25rem,4vw,3.5rem)] opacity-0 md:block">
          <p className="eyebrow">The Rooms</p>
          <h2 className="h-section mt-4 text-ink">Step into a&nbsp;room</h2>
          <p className="mt-5 max-w-xs text-muted">Each collection lives in its own space. Choose one and walk in.</p>
          <p className="mt-10 flex items-baseline gap-3 text-muted">
            <span ref={counter} className="font-display text-5xl leading-none text-gold">01</span>
            <span className="text-xs tracking-[0.3em]">/ 0{rooms.length}</span>
          </p>
        </div>

        {/* room cards */}
        <div ref={layer} className="absolute inset-0">
          {rooms.map((r, i) => (
            <div
              key={r.slug}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="absolute left-0 top-0 will-change-transform"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <div
                className="h-full w-full transition-[opacity,transform,filter] duration-[900ms] ease-out"
                style={entering && entering !== r.slug ? { opacity: 0, transform: "scale(0.9)", filter: "blur(6px)" } : undefined}
              >
                <RoomCardView
                  index={i}
                  room={r}
                  hidden={hidden === r.slug}
                  onEnter={(el) =>
                    enterRoom({ slug: r.slug, title: r.title, image: r.image, pos: r.pos, thumb: r.thumb, thumbPos: r.thumbPos, el })
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* scroll cue + progress */}
        <div ref={cue} className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.34em] text-ivory/70 sm:flex" aria-hidden>
          <span>Scroll</span>
          <span className="relative block h-10 w-px overflow-hidden bg-ivory/25">
            <span className="absolute inset-0 bg-gold-light" style={{ animation: "scroll-cue 2.4s ease-in-out infinite" }} />
          </span>
        </div>
        <div className="pointer-events-none absolute right-5 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-ivory/20 md:block" aria-hidden>
          <div ref={bar} className="h-full w-full origin-top bg-gold-light" style={{ transform: "scaleY(0)" }} />
        </div>
      </div>
    </section>
  );
}

function RoomCardView({
  index,
  room,
  hidden,
  onEnter,
}: {
  index: number;
  room: RoomCard;
  hidden: boolean;
  onEnter: (el: HTMLElement) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <Link
      ref={ref}
      href={`/collections/${room.slug}`}
      data-room={room.slug}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (ref.current) onEnter(ref.current);
      }}
      className="group relative block h-full w-full overflow-hidden bg-emerald shadow-[0_30px_70px_-25px_rgba(60,40,10,0.45)] ring-1 ring-gold/40"
      style={{ visibility: hidden ? "hidden" : "visible" }}
      aria-label={`Enter the ${room.title} room — ${room.count} pieces`}
    >
      <Image
        src={room.thumb}
        alt=""
        fill
        loading="eager"
        sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 60vw" quality={70}
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        style={{ objectPosition: room.thumbPos }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/10 to-transparent" />
      <span className="absolute left-5 top-5 text-[0.65rem] uppercase tracking-[0.3em] text-ivory/80">0{index + 1}</span>
      <span className="absolute right-5 top-5 translate-y-1 text-[0.62rem] uppercase tracking-[0.28em] text-gold-light opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        Enter →
      </span>
      <p className="font-display absolute leading-none text-ivory" style={{ left: "1.5rem", bottom: "1.5rem", fontSize: "1.9rem", fontWeight: 400 }}>
        {room.title}
        <span className="mt-2 block font-sans text-[0.72rem] font-normal tracking-[0.08em] text-ivory/70">
          {room.sub} · {room.count}
        </span>
      </p>
    </Link>
  );
}
