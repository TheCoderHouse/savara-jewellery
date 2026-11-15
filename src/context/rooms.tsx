"use client";

/**
 * "Walk into a room" transition (Motion for choreography).
 *
 * ENTER  1. The room card opens up to fill the screen while the frame pushes toward
 *           its vanishing point. Two copies of the image move at different speeds
 *           (edges fast, centre slow) so it reads as depth, not a flat zoom.
 *        2. The push accelerates, blurs and vignettes — we rush through the doorway —
 *           while the room's own frame arrives from the distance (small → full).
 *        3. Route changes underneath; overlay dissolves; room title rises in.
 *
 * EXIT   Mirror: dissolve to the room frame, route home, pull back out of the doorway
 *        while the frame shrinks into its card and the card name returns.
 */

import Image from "next/image";
import { animate } from "motion";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Ov = {
  mode: "enter" | "exit";
  title: string;
  image: string; // room frame
  pos: string;
  thumb: string; // category thumbnail
  thumbPos: string;
  rect: { left: number; top: number; width: number; height: number };
};

type Ctx = {
  hidden: string | null;
  entering: string | null;
  enterRoom: (a: { slug: string; title: string; image: string; pos: string; thumb: string; thumbPos: string; el: HTMLElement }) => void;
  exitRoom: (a: { slug: string; title: string; image: string; pos: string; thumb: string; thumbPos: string }) => void;
};

const RoomCtx = createContext<Ctx | null>(null);
export const useRooms = () => {
  const c = useContext(RoomCtx);
  if (!c) throw new Error("useRooms outside provider");
  return c;
};

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const IN_OUT = [0.76, 0, 0.24, 1] as const;
const ARRIVE_SCALE = 1.16; // the room page starts at this scale and settles to 1

const titleMetrics = () => ({
  size: Math.min(112, Math.max(51, window.innerWidth * 0.08)),
  left: Math.min(56, Math.max(20, window.innerWidth * 0.04)),
  bottom: Math.min(128, Math.max(80, window.innerHeight * 0.11)),
});

export function RoomProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ov, setOv] = useState<Ov | null>(null);
  const [hidden, setHidden] = useState<string | null>(null);
  const [entering, setEntering] = useState<string | null>(null);
  const job = useRef<{ kind: "enter" | "exit"; slug: string } | null>(null);
  const busy = useRef(false);
  const phase2 = useRef<Promise<unknown> | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const edge = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const shade2 = useRef<HTMLDivElement>(null);
  const titleEl = useRef<HTMLParagraphElement>(null);

  // swallow wheel/touch while a transition runs
  const active = ov !== null;
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stop = (e: Event) => e.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, [active]);

  const html = () => document.documentElement;

  /* ───────────────────────── ENTER ───────────────────────── */
  const enterRoom: Ctx["enterRoom"] = useCallback(
    async ({ slug, title, image, pos, thumb, thumbPos, el }) => {
      if (busy.current) return;
      const href = `/collections/${slug}`;
      if (reduced()) return router.push(href);
      busy.current = true;
      const r = el.getBoundingClientRect();
      html().classList.add("room-entering"); // hides the room's copy until we reveal
      setHidden(slug);
      setEntering(slug);
      setOv({ mode: "enter", title, image, pos, thumb, thumbPos, rect: { left: r.left, top: r.top, width: r.width, height: r.height } });
      await frame();
      await frame();
      if (!root.current) return;

      const m = titleMetrics();

      // the card opens to full-screen while the picture eases forward (one image, no copies)
      const grow = 1.15;
      await Promise.all([
        animate(root.current, { left: 0, top: 0, width: "100vw", height: "100dvh" }, { duration: grow, ease: IN_OUT }).finished,
        animate(edge.current!, { scale: [1, ARRIVE_SCALE] }, { duration: grow, ease: IN_OUT }).finished,
        animate(shade2.current!, { opacity: [0, 1] }, { duration: grow, ease: "easeInOut" }).finished,
        animate(
          titleEl.current!,
          { fontSize: ["30px", `${m.size}px`], left: ["24px", `${m.left}px`], bottom: ["24px", `${m.bottom}px`] },
          { duration: grow, ease: IN_OUT },
        ).finished,
      ]);

      // route changes underneath; the room opens on the very same picture at the same scale
      router.push(href);
      job.current = { kind: "enter", slug };
      const rush = Promise.all([
        animate(titleEl.current!, { opacity: [1, 0] }, { duration: 0.35, ease: "easeIn" }).finished,
      ]);
      phase2.current = rush;
      await rush;

      // safety: never leave the overlay stuck if navigation is slow
      setTimeout(() => {
        if (job.current?.kind === "enter") finishEnter();
      }, 4000);
    },
    [router], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const finishEnter = useCallback(async () => {
    if (!root.current) return;
    job.current = null;
    await phase2.current; // the rush-through must finish first
    window.scrollTo({ top: 0, behavior: "instant" }); // the room always opens at its top
    await wait(200); // let the room paint + decode its frame
    html().classList.remove("room-entering"); // room title + copy rise in now
    await animate(root.current, { opacity: [1, 0] }, { duration: 0.7, ease: "easeOut" }).finished;
    setOv(null);
    setHidden(null);
    setEntering(null);
    busy.current = false;
  }, []);

  /* ───────────────────────── EXIT ───────────────────────── */
  const exitRoom: Ctx["exitRoom"] = useCallback(
    async ({ slug, title, image, pos, thumb, thumbPos }) => {
      if (busy.current) return;
      if (reduced()) return router.push("/");
      busy.current = true;
      setHidden(slug);
      setOv({ mode: "exit", title, image, pos, thumb, thumbPos, rect: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight } });
      await frame();
      await frame();
      if (!root.current) return;
      await animate(root.current, { opacity: [0, 1] }, { duration: 0.45, ease: "easeOut" }).finished;
      job.current = { kind: "exit", slug };
      router.push("/");
      setTimeout(() => {
        if (job.current?.kind === "exit") finishExit(slug, true);
      }, 4000);
    },
    [router], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const finishExit = useCallback(async (slug: string, force = false) => {
    job.current = null;
    let tile: HTMLElement | null = null;
    for (let i = 0; i < 60 && !tile; i++) {
      tile = document.querySelector<HTMLElement>(`[data-room="${slug}"]`);
      if (!tile) await frame();
    }
    const out = async () => {
      if (root.current) await animate(root.current, { opacity: [1, 0] }, { duration: 0.6 }).finished;
      setOv(null);
      setHidden(null);
      busy.current = false;
    };
    if (!tile || force || !root.current) return out();

    await wait(120);
    // the home hero is a pinned scroll scene — ask it to bring this card to the middle
    window.dispatchEvent(new CustomEvent("savara:focus-room", { detail: { slug } }));
    await frame();
    await frame();
    window.dispatchEvent(new CustomEvent("savara:focus-room", { detail: { slug } }));
    await frame();
    const r = tile.getBoundingClientRect();
    const m = titleMetrics();

    // the room shrinks back into its card
    await Promise.all([
      animate(
        root.current,
        { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` },
        { duration: 1.2, ease: IN_OUT },
      ).finished,
      animate(shade2.current!, { opacity: [1, 0] }, { duration: 1.1 }).finished,
      animate(
        titleEl.current!,
        { opacity: [0, 1], fontSize: [`${m.size}px`, "30px"], left: [`${m.left}px`, "24px"], bottom: [`${m.bottom}px`, "24px"] },
        { duration: 0.9, delay: 0.3, ease: IN_OUT },
      ).finished,
    ]);
    setHidden(null);
    await frame();
    setOv(null);
    busy.current = false;
  }, []);

  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
    const j = job.current;
    if (!j) return;
    if (j.kind === "enter" && pathname.startsWith("/collections/")) finishEnter();
    if (j.kind === "exit" && pathname === "/") finishExit(j.slug);
  }, [pathname, finishEnter, finishExit]);

  const isExit = ov?.mode === "exit";
  const layer = "absolute inset-0 will-change-transform";

  return (
    <RoomCtx.Provider value={{ hidden, entering, enterRoom, exitRoom }}>
      {children}
      {ov && (
        <div
          ref={root}
          aria-hidden
          className="fixed z-[120] overflow-hidden bg-emerald-deep"
          style={{
            left: ov.rect.left,
            top: ov.rect.top,
            width: ov.rect.width,
            height: ov.rect.height,
            opacity: isExit ? 0 : 1,
            willChange: "left, top, width, height, opacity",
          }}
        >
          {/* single picture layer */}
          <div ref={edge} className={layer} style={{ transformOrigin: "50% 50%" }}>
            <Pic src={ov.thumb} pos={ov.thumbPos} />
          </div>

          <div ref={shade} className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/10 to-transparent" />
          <div ref={shade2} className="absolute inset-0" style={{ opacity: isExit ? 1 : 0 }}>
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-deep/60 to-transparent" />
            <div className="absolute inset-0 bg-emerald-deep" style={{ opacity: 0.18 }} />
          </div>
          <p
            ref={titleEl}
            className="font-display absolute leading-none text-ivory"
            style={
              isExit
                ? { opacity: 0, left: titleMetrics().left, bottom: titleMetrics().bottom, fontSize: titleMetrics().size, fontWeight: 300, transformOrigin: "0 100%" }
                : { left: 24, bottom: 24, fontSize: 30, fontWeight: 400, transformOrigin: "0 100%", whiteSpace: "nowrap" }
            }
          >
            {ov.title}
          </p>
        </div>
      )}
    </RoomCtx.Provider>
  );
}

function Pic({ src, pos }: { src: string; pos: string }) {
  return <Image src={src} alt="" fill sizes="100vw" quality={80} priority className="object-cover" style={{ objectPosition: pos }} />;
}
