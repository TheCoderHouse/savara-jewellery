"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { useStore } from "@/context/store";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";

export function Header() {
  const pathname = usePathname();
  const { totals, wishlist, setCartOpen, setSearchOpen, ready } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const overMedia = pathname === "/" || pathname.startsWith("/collections/");
  const [pastMedia, setPastMedia] = useState(false);
  const solid = !overMedia || pastMedia || menu;

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 40);
      // header turns solid only once the full-bleed hero/room image is behind us
      const hero = document.getElementById("hero-scrub");
      const limit = hero ? hero.offsetHeight - 90 : window.innerHeight - 90;
      let past = window.scrollY > limit;
      if (hero) {
        // once the video has faded into the cream "rooms" stage, use the solid header
        const prog = -hero.getBoundingClientRect().top / (hero.offsetHeight - window.innerHeight);
        if (prog > 0.6) past = true;
      }
      setPastMedia(past);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const count = ready ? totals.count : 0;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,color,box-shadow] duration-500 ${
          solid ? "bg-ivory/95 text-ink shadow-[0_1px_0_var(--line)] backdrop-blur-md" : "bg-emerald-deep/50 text-ivory shadow-[0_1px_0_rgba(250,246,238,0.12)] backdrop-blur-md backdrop-saturate-150 [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]"
        }`}
      >
        <div className="container-x">
          <div className={`grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 ${scrolled ? "h-[3.6rem]" : "h-[4.6rem]"}`}>
            <div className="flex items-center gap-5">
              <button className="lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}>
                <MenuIcon />
              </button>
              <button className="hidden items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] lg:flex" onClick={() => setSearchOpen(true)}>
                <SearchIcon width={20} height={20} /> Search
              </button>
            </div>

            <Link href="/" aria-label={`${SITE.name} — home`} className="text-center leading-none">
              <span className="font-display block text-[1.75rem] font-medium tracking-[0.34em] sm:text-[2.1rem]">
                {SITE.name}
              </span>
              <span className={`mt-1 hidden text-[0.52rem] uppercase tracking-[0.5em] sm:block ${solid ? "text-gold" : "text-gold-light"}`}>
                {SITE.tagline}
              </span>
            </Link>

            <div className="flex items-center justify-end gap-4 sm:gap-5">
              <button className="lg:hidden" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </button>
              <Link href="/account" aria-label="Account" className="hidden sm:block">
                <UserIcon />
              </Link>
              <Link href="/wishlist" aria-label="Wishlist" className="relative hidden sm:block">
                <HeartIcon />
                {ready && wishlist.length > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.6rem] text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button aria-label={`Bag, ${count} items`} className="relative" onClick={() => setCartOpen(true)}>
                <BagIcon />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.6rem] text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          <nav
            aria-label="Primary"
            className={`hidden items-center justify-center gap-9 border-t transition-colors duration-500 lg:flex ${
              solid ? "border-line" : "border-ivory/20"
            } ${scrolled ? "h-10" : "h-12"}`}
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`link-underline text-[0.7rem] uppercase tracking-[0.24em] ${pathname === n.href ? "active" : ""}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* mobile menu */}
      {menu && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-emerald-deep text-ivory fade-in lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-[4.6rem] items-center justify-between px-5">
            <span className="font-display text-2xl tracking-[0.3em]">{SITE.name}</span>
            <button aria-label="Close menu" onClick={() => setMenu(false)}>
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 pb-10 pt-6">
            {NAV.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                className="hero-in font-display border-b border-ivory/10 py-4 text-[2rem]"
                style={{ "--d": `${i * 50}ms` } as React.CSSProperties}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-8 flex gap-8 text-[0.72rem] uppercase tracking-[0.24em] text-gold-light">
              <Link href="/account">Account</Link>
              <Link href="/wishlist">Wishlist ({wishlist.length})</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
