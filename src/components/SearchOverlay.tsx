"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { search, products } from "@/lib/products";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/store";
import { CloseIcon, SearchIcon } from "./icons";

const POPULAR = ["Diamond ring", "Pearl", "Gold bangles", "Bridal", "Sapphire", "Silver jhumka"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(q).slice(0, 6), [q]);

  useEffect(() => {
    if (!searchOpen) return;
    input.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const go = (term: string) => {
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const suggestions = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <div className="fade-in fixed inset-0 z-[80] overflow-y-auto bg-ivory" role="dialog" aria-modal="true" aria-label="Search">
      <div className="container-x py-6">
        <div className="flex justify-end">
          <button aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <form
          className="mx-auto mt-8 max-w-3xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) go(q.trim());
          }}
        >
          <div className="flex items-center gap-4 border-b border-ink pb-4">
            <SearchIcon />
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search rings, pearls, bridal…"
              className="font-display w-full bg-transparent text-3xl outline-none placeholder:text-muted/60 sm:text-4xl"
              aria-label="Search the collection"
            />
          </div>
        </form>

        <div className="mx-auto mt-10 max-w-3xl">
          {q.trim() === "" ? (
            <>
              <p className="eyebrow">Popular searches</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {POPULAR.map((t) => (
                  <button key={t} onClick={() => go(t)} className="border border-line px-4 py-2 text-sm transition hover:border-gold hover:text-gold">
                    {t}
                  </button>
                ))}
              </div>
              <p className="eyebrow mt-12">Trending now</p>
              <ul className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <Link href={`/product/${p.slug}`} onClick={() => setSearchOpen(false)} className="group block">
                      <div className="relative aspect-square overflow-hidden bg-cream">
                        <Image src={p.images[0]} alt={p.name} fill sizes="200px" className="zoom-img object-cover" />
                      </div>
                      <p className="font-display mt-2 text-lg leading-tight">{p.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : results.length === 0 ? (
            <p className="text-muted">No pieces found for “{q}”. Try “gold”, “diamond” or “pearl”.</p>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link href={`/product/${p.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-5 py-4">
                      <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-cream">
                        <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="flex-1">
                        <span className="font-display block text-xl leading-tight">{p.name}</span>
                        <span className="text-xs text-muted">{p.metal}</span>
                      </span>
                      <span className="text-sm">{formatINR(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={() => go(q.trim())} className="btn btn-outline-dark mt-6">
                View all results
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
