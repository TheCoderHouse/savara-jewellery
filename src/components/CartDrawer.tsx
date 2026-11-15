"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { products } from "@/lib/products";
import { formatINR } from "@/lib/format";
import { SITE } from "@/lib/site";
import { useStore } from "@/context/store";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon } from "./icons";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, totals, updateQty, removeLine } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;
  const remaining = Math.max(0, SITE.freeShippingThreshold - totals.subtotal);
  const progress = Math.min(100, (totals.subtotal / SITE.freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button aria-label="Close bag" className="fade-in absolute inset-0 bg-emerald-deep/60 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} />
      <aside className="drawer-in absolute right-0 top-0 flex h-full w-full max-w-[28rem] flex-col bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl">Your Bag <span className="text-muted">({totals.count})</span></h2>
          <button aria-label="Close" onClick={() => setCartOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {lines.length > 0 && (
          <div className="border-b border-line bg-cream px-6 py-4">
            <p className="text-[0.78rem]">
              {remaining > 0 ? (
                <>Add <strong className="font-medium">{formatINR(remaining)}</strong> more for complimentary insured shipping</>
              ) : (
                <>You’ve unlocked <strong className="font-medium">complimentary insured shipping</strong></>
              )}
            </p>
            <div className="mt-2 h-[3px] bg-sand">
              <div className="h-full bg-gold transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <BagIcon width={40} height={40} className="text-gold" />
              <p className="font-display text-2xl">Your bag is empty</p>
              <p className="max-w-xs text-sm text-muted">Discover pieces made to be treasured for generations.</p>
              <Link href="/collections/all" onClick={() => setCartOpen(false)} className="btn btn-dark mt-2">
                Explore the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map((l) => {
                const p = products.find((x) => x.id === l.id)!;
                return (
                  <li key={`${l.id}-${l.size}`} className="flex gap-4 py-5">
                    <Link href={`/product/${p.slug}`} onClick={() => setCartOpen(false)} className="relative block h-28 w-24 shrink-0 overflow-hidden bg-cream">
                      <Image src={p.images[0]} alt={p.name} fill sizes="96px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <Link href={`/product/${p.slug}`} onClick={() => setCartOpen(false)} className="font-display text-lg leading-tight">
                          {p.name}
                        </Link>
                        <p className="text-sm">{formatINR(p.price * l.qty)}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {p.metal}
                        {l.size ? ` · Size ${l.size}` : ""}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center border border-line">
                          <button aria-label="Decrease" className="grid h-8 w-8 place-items-center" onClick={() => updateQty(l.id, l.size, l.qty - 1)}>
                            <MinusIcon />
                          </button>
                          <span className="w-7 text-center text-sm">{l.qty}</span>
                          <button aria-label="Increase" className="grid h-8 w-8 place-items-center" onClick={() => updateQty(l.id, l.size, l.qty + 1)}>
                            <PlusIcon />
                          </button>
                        </div>
                        <button className="link-underline text-[0.7rem] uppercase tracking-[0.2em] text-muted" onClick={() => removeLine(l.id, l.size)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line bg-ivory px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.72rem] uppercase tracking-[0.22em]">Subtotal</span>
              <span className="font-display text-2xl">{formatINR(totals.subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">Inclusive of GST. Shipping &amp; coupons calculated at checkout.</p>
            <div className="mt-4 grid gap-3">
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn btn-dark">
                Checkout
              </Link>
              <Link href="/cart" onClick={() => setCartOpen(false)} className="btn btn-outline-dark">
                View bag
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
