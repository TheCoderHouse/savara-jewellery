"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./motion";
import { ChevronDown, CloseIcon } from "./icons";
import { formatINR } from "@/lib/format";

const SORTS = [
  ["featured", "Featured"],
  ["new", "Newest"],
  ["low", "Price: Low to High"],
  ["high", "Price: High to Low"],
  ["rating", "Top Rated"],
] as const;

const PRICE_BANDS: [string, number, number][] = [
  ["Under ₹15,000", 0, 15000],
  ["₹15,000 – ₹50,000", 15000, 50000],
  ["₹50,000 – ₹1,50,000", 50000, 150000],
  ["Above ₹1,50,000", 150000, Infinity],
];
const STONES = ["Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "Amethyst", "Topaz", "Turquoise", "Onyx"];
const OCCASIONS = ["Wedding", "Festive", "Party", "Everyday", "Gifting"];
const CATS: [string, string][] = [
  ["rings", "Rings"],
  ["earrings", "Earrings"],
  ["necklaces", "Necklaces"],
  ["pendants", "Pendants"],
  ["bangles", "Bangles & Bracelets"],
  ["bridal", "Bridal"],
];
const PAGE = 12;

type Filters = { cat: string[]; metal: string[]; stone: string[]; occasion: string[]; price: number[] };
const empty: Filters = { cat: [], metal: [], stone: [], occasion: [], price: [] };

export function Listing({ products, showCategories = true }: { products: Product[]; showCategories?: boolean }) {
  const sp = useSearchParams();
  const initOcc = sp.get("occasion");
  const [f, setF] = useState<Filters>({ ...empty, occasion: initOcc && OCCASIONS.includes(initOcc) ? [initOcc] : [] });
  const [sort, setSort] = useState<(typeof SORTS)[number][0]>("featured");
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(PAGE);

  const metals = useMemo(() => Array.from(new Set(products.map((p) => p.metal))), [products]);

  const toggle = <K extends keyof Filters>(k: K, v: Filters[K][number]) => {
    setShown(PAGE);
    setF((prev) => {
      const arr = prev[k] as (string | number)[];
      return { ...prev, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] } as Filters;
    });
  };

  const list = useMemo(() => {
    let out = products.filter((p) => {
      if (f.cat.length && !f.cat.includes(p.category)) return false;
      if (f.metal.length && !f.metal.includes(p.metal)) return false;
      if (f.stone.length && !f.stone.some((s) => p.stone.toLowerCase().includes(s.toLowerCase()))) return false;
      if (f.occasion.length && !f.occasion.some((o) => p.occasions.includes(o as never))) return false;
      if (f.price.length && !f.price.some((i) => p.price >= PRICE_BANDS[i][1] && p.price < PRICE_BANDS[i][2])) return false;
      return true;
    });
    out = [...out];
    if (sort === "low") out.sort((a, b) => a.price - b.price);
    else if (sort === "high") out.sort((a, b) => b.price - a.price);
    else if (sort === "rating") out.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    else if (sort === "new") out.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return out;
  }, [products, f, sort]);

  const activeCount = f.cat.length + f.metal.length + f.stone.length + f.occasion.length + f.price.length;
  const range = list.length ? `${formatINR(Math.min(...list.map((p) => p.price)))} – ${formatINR(Math.max(...list.map((p) => p.price)))}` : "";

  const panel = (
    <div className="space-y-1">
      {showCategories && (
        <Group title="Category" defaultOpen>
          {CATS.map(([v, l]) => (
            <Check key={v} label={l} checked={f.cat.includes(v)} onChange={() => toggle("cat", v)} />
          ))}
        </Group>
      )}
      <Group title="Occasion" defaultOpen>
        {OCCASIONS.map((o) => (
          <Check key={o} label={o} checked={f.occasion.includes(o)} onChange={() => toggle("occasion", o)} />
        ))}
      </Group>
      <Group title="Price" defaultOpen>
        {PRICE_BANDS.map(([l], i) => (
          <Check key={l} label={l} checked={f.price.includes(i)} onChange={() => toggle("price", i)} />
        ))}
      </Group>
      <Group title="Metal">
        {metals.map((m) => (
          <Check key={m} label={m} checked={f.metal.includes(m)} onChange={() => toggle("metal", m)} />
        ))}
      </Group>
      <Group title="Gemstone">
        {STONES.map((s) => (
          <Check key={s} label={s} checked={f.stone.includes(s)} onChange={() => toggle("stone", s)} />
        ))}
      </Group>
    </div>
  );

  return (
    <div className="container-x pb-24">
      <div className="flex items-center justify-between gap-4 border-y border-line py-4">
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] lg:hidden">
          Filters {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-[0.65rem] text-white">{activeCount}</span>}
        </button>
        <p className="hidden text-sm text-muted lg:block">
          {list.length} {list.length === 1 ? "piece" : "pieces"}
          {range && <span className="ml-2">· {range}</span>}
        </p>
        <label className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden text-[0.72rem] uppercase tracking-[0.22em] text-muted sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="cursor-pointer border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-gold"
          >
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-40">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="eyebrow !text-ink">Filter</h2>
              {activeCount > 0 && (
                <button onClick={() => setF(empty)} className="link-underline text-xs text-muted">
                  Clear all
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <div>
          {activeCount > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {[
                ...f.cat.map((v) => ["cat", v, CATS.find((c) => c[0] === v)![1]] as const),
                ...f.occasion.map((v) => ["occasion", v, v] as const),
                ...f.metal.map((v) => ["metal", v, v] as const),
                ...f.stone.map((v) => ["stone", v, v] as const),
                ...f.price.map((i) => ["price", i, PRICE_BANDS[i][0]] as const),
              ].map(([k, v, l]) => (
                <button key={`${k}${v}`} onClick={() => toggle(k as keyof Filters, v as never)} className="flex items-center gap-2 border border-line bg-cream px-3 py-1.5 text-xs transition hover:border-gold">
                  {l} <CloseIcon width={12} height={12} />
                </button>
              ))}
            </div>
          )}

          {list.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-3xl">No pieces match your filters</p>
              <button onClick={() => setF(empty)} className="btn btn-outline-dark mt-6">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-7">
                {list.slice(0, shown).map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 90}>
                    <ProductCard product={p} priority={i < 3} sizes="(min-width:1024px) 28vw, (min-width:768px) 33vw, 50vw" />
                  </Reveal>
                ))}
              </div>
              {shown < list.length && (
                <div className="mt-16 text-center">
                  <p className="mb-4 text-sm text-muted">
                    Showing {Math.min(shown, list.length)} of {list.length}
                  </p>
                  <button onClick={() => setShown((s) => s + PAGE)} className="btn btn-outline-dark">
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button aria-label="Close filters" className="fade-in absolute inset-0 bg-emerald-deep/60" onClick={() => setOpen(false)} />
          <div className="drawer-in room-light absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-ivory" style={{ animationName: "none" }}>
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-2xl">Filters</h2>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-3">{panel}</div>
            <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
              <button onClick={() => setF(empty)} className="btn btn-outline-dark !px-4">
                Clear
              </button>
              <button onClick={() => setOpen(false)} className="btn btn-dark !px-4">
                Show {list.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [o, setO] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-4">
      <button onClick={() => setO(!o)} aria-expanded={o} className="flex w-full items-center justify-between text-left text-[0.74rem] uppercase tracking-[0.22em]">
        {title}
        <ChevronDown className={`transition-transform duration-300 ${o ? "rotate-180" : ""}`} />
      </button>
      {o && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="grid h-4 w-4 shrink-0 place-items-center border border-ink/40 transition peer-checked:border-emerald peer-checked:bg-emerald peer-focus-visible:ring-2 peer-focus-visible:ring-gold">
        {checked && <span className="block h-1.5 w-1.5 bg-ivory" />}
      </span>
      {label}
    </label>
  );
}
