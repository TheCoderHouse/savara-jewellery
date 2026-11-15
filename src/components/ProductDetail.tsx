"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { priceBreakup, type Product } from "@/lib/products";
import { formatINR, pctOff } from "@/lib/format";
import { useStore } from "@/context/store";
import { ChevronDown, HeartIcon, MinusIcon, PlusIcon, RefreshIcon, ShieldIcon, StarIcon, TruckIcon } from "./icons";

export function ProductDetail({ product: p }: { product: Product }) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, notify } = useStore();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState<string | undefined>();
  const [sizeErr, setSizeErr] = useState(false);
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState<string | null>(null);
  const [pinErr, setPinErr] = useState("");
  const saved = wishlist.includes(p.id);
  const off = pctOff(p.price, p.compareAt);
  const bk = priceBreakup(p);
  const sizeLabel = p.category === "rings" ? "Ring size (India)" : "Bangle size (inches)";

  const add = (goCheckout = false) => {
    if (p.sizes && !size) {
      setSizeErr(true);
      return false;
    }
    addToCart(p.id, size, qty, !goCheckout);
    if (goCheckout) router.push("/checkout");
    return true;
  };

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setEta(null);
      return setPinErr("Enter a valid 6-digit pincode.");
    }
    setPinErr("");
    const d = new Date();
    d.setDate(d.getDate() + (p.price > 100000 ? 5 : 3));
    setEta(d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }));
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* gallery */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="grid gap-3 md:grid-cols-[5rem_1fr]">
            <div className="order-2 flex gap-3 md:order-1 md:flex-col">
              {p.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={active === i}
                  className={`relative aspect-square w-16 overflow-hidden border bg-cream transition md:w-full ${active === i ? "border-emerald" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
            <div
              className="relative order-1 aspect-[4/5] cursor-zoom-in overflow-hidden bg-cream md:order-2"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom(null)}
            >
              <Image
                key={p.images[active]}
                src={p.images[active]}
                alt={`${p.name} — view ${active + 1}`}
                fill
                priority
                sizes="(min-width:1024px) 55vw, 100vw"
                quality={80}
                className="fade-in object-cover transition-transform duration-300 ease-out"
                style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
              {(p.badge || off > 0) && (
                <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-emerald">
                  {off > 0 ? `${off}% off` : p.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* info */}
        <div>
          <p className="eyebrow">{p.category === "bangles" ? "Bangles & Bracelets" : p.category}</p>
          <h1 className="font-display mt-3 text-[clamp(2.4rem,4.4vw,3.8rem)] font-light leading-[1.02]">{p.name}</h1>
          <p className="mt-3 text-muted">{p.tagline}</p>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="flex gap-0.5 text-gold">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} />
              ))}
            </span>
            <span className="text-muted">
              {p.rating} · {p.reviews} reviews
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="font-display text-4xl">{formatINR(p.price)}</p>
            {p.compareAt && <p className="text-muted line-through">{formatINR(p.compareAt)}</p>}
          </div>
          <p className="mt-1 text-xs text-muted">Inclusive of all taxes · Free insured shipping over ₹25,000</p>

          <dl className="mt-7 grid grid-cols-2 gap-px bg-line text-sm">
            {[
              ["Metal", p.metal],
              ["Stone", p.stone === "None" ? "—" : p.stone],
            ].map(([k, v]) => (
              <div key={k} className="bg-ivory py-3 pr-3">
                <dt className="text-[0.66rem] uppercase tracking-[0.22em] text-muted">{k}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>

          {p.sizes && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-[0.72rem] uppercase tracking-[0.22em]">
                  {sizeLabel} {size && <span className="ml-2 text-gold">{size}</span>}
                </p>
                <button
                  className="link-underline text-xs text-muted"
                  onClick={() => notify("Size guide: measure the inner diameter of a ring that fits you")}
                >
                  Size guide
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={sizeLabel}>
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    role="radio"
                    aria-checked={size === s}
                    onClick={() => {
                      setSize(s);
                      setSizeErr(false);
                    }}
                    className={`h-11 min-w-11 border px-3 text-sm transition ${size === s ? "border-emerald bg-emerald text-ivory" : "border-line hover:border-emerald"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeErr && <p className="mt-2 text-sm text-ruby">Please select a size to continue.</p>}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <div className="inline-flex items-center border border-line">
              <button aria-label="Decrease quantity" className="grid h-14 w-11 place-items-center" onClick={() => setQty(Math.max(1, qty - 1))}>
                <MinusIcon />
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button aria-label="Increase quantity" className="grid h-14 w-11 place-items-center" onClick={() => setQty(Math.min(10, qty + 1))}>
                <PlusIcon />
              </button>
            </div>
            <button className="btn btn-dark flex-1" onClick={() => add(false)}>
              Add to bag
            </button>
            <button
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={saved}
              onClick={() => toggleWishlist(p.id)}
              className="grid h-14 w-14 shrink-0 place-items-center border border-line transition hover:border-ruby"
            >
              <HeartIcon filled={saved} className={saved ? "text-ruby" : ""} />
            </button>
          </div>
          <button className="btn btn-outline-dark mt-3 w-full" onClick={() => add(true)}>
            Buy it now
          </button>

          {/* delivery */}
          <form onSubmit={check} className="mt-8 border border-line p-5">
            <p className="text-[0.72rem] uppercase tracking-[0.22em]">Check delivery</p>
            <div className="mt-3 flex gap-2">
              <input
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter pincode"
                aria-label="Pincode"
                className="field"
              />
              <button className="btn btn-outline-dark !px-6">Check</button>
            </div>
            {pinErr && <p className="mt-2 text-sm text-ruby">{pinErr}</p>}
            {eta && (
              <p className="mt-3 text-sm text-teal">
                ✓ Insured delivery by <strong className="font-medium">{eta}</strong>
              </p>
            )}
          </form>

          <ul className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            {[
              [<ShieldIcon key="a" width={22} height={22} />, "Certified & hallmarked"],
              [<TruckIcon key="b" width={22} height={22} />, "Insured delivery"],
              [<RefreshIcon key="c" width={22} height={22} />, "15-day returns"],
            ].map(([i, t]) => (
              <li key={t as string} className="flex items-center gap-3 text-muted">
                <span className="text-gold">{i}</span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-line">
            <Acc title="Description" defaultOpen>
              <p className="leading-7 text-muted">{p.description}</p>
            </Acc>
            <Acc title="Product details">
              <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 text-sm">
                {p.details.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Acc>
            <Acc title="Price breakup">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line">
                  <Row k={`${p.metal.split(" ").slice(0, 2).join(" ")} (${p.weight} g)`} v={formatINR(bk.metal)} />
                  {bk.stone > 0 && <Row k="Gemstones" v={formatINR(bk.stone)} />}
                  <Row k="Making charges" v={formatINR(bk.making)} />
                  <Row k="GST (3%)" v={formatINR(bk.gst)} />
                  <Row k="Total" v={formatINR(bk.total)} bold />
                </tbody>
              </table>
            </Acc>
            <Acc title="Shipping & returns">
              <p className="leading-7 text-muted">
                Every order ships fully insured in our emerald keepsake box. Free on orders over ₹25,000, otherwise ₹499. Return within 15
                days for a full refund, or exchange for life at 100% of the metal value.
              </p>
            </Acc>
            <Acc title="Care">
              <p className="leading-7 text-muted">
                Store separately in the pouch provided, avoid perfume and chlorinated water, and bring your piece to any Savara maison for
                complimentary cleaning and polishing.
              </p>
            </Acc>
          </div>
        </div>
      </div>

      {/* sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-ivory/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="leading-tight">
          <p className="font-display text-xl">{formatINR(p.price)}</p>
        </div>
        <button className="btn btn-dark flex-1 !py-3.5" onClick={() => add(false)}>
          Add to bag
        </button>
      </div>
    </>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <tr className={bold ? "font-medium" : ""}>
      <td className="py-2.5 text-muted">{k}</td>
      <td className="py-2.5 text-right">{v}</td>
    </tr>
  );
}

function Acc({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [o, setO] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button onClick={() => setO(!o)} aria-expanded={o} className="flex w-full items-center justify-between py-5 text-left text-[0.74rem] uppercase tracking-[0.22em]">
        {title}
        <ChevronDown className={`transition-transform duration-300 ${o ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ${o ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
