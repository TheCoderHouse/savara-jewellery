"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products } from "@/lib/products";
import { formatINR } from "@/lib/format";
import { SITE } from "@/lib/site";
import { useStore } from "@/context/store";
import { MinusIcon, PlusIcon } from "@/components/icons";

export default function CartPage() {
  const { ready, lines, totals, coupon, couponError, updateQty, removeLine, applyCoupon, removeCoupon, toggleWishlist, wishlist } = useStore();
  const [code, setCode] = useState("");

  return (
    <div className="container-x pb-28 pt-40 lg:pt-52">
      <h1 className="font-display text-5xl sm:text-6xl">Your Bag</h1>

      {!ready ? (
        <p className="mt-16 text-muted">Loading…</p>
      ) : lines.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">Your bag is empty</p>
          <p className="mt-3 text-muted">Pieces you add will appear here.</p>
          <Link href="/collections/all" className="btn btn-dark mt-8">Continue shopping</Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((l) => {
              const p = products.find((x) => x.id === l.id)!;
              const saved = wishlist.includes(p.id);
              return (
                <li key={`${l.id}-${l.size}`} className="grid grid-cols-[6.5rem_1fr] gap-5 py-7 sm:grid-cols-[9rem_1fr_auto]">
                  <Link href={`/product/${p.slug}`} className="relative aspect-[4/5] overflow-hidden bg-cream">
                    <Image src={p.images[0]} alt={p.name} fill sizes="144px" className="object-cover" />
                  </Link>
                  <div className="flex flex-col">
                    <Link href={`/product/${p.slug}`} className="font-display text-2xl leading-tight">{p.name}</Link>
                    <p className="mt-1 text-sm text-muted">{p.metal}{l.size ? ` · Size ${l.size}` : ""}</p>
                    <p className="mt-1 text-sm text-muted">{formatINR(p.price)} each</p>
                    <div className="mt-auto flex flex-wrap items-center gap-5 pt-5">
                      <div className="inline-flex items-center border border-line">
                        <button aria-label="Decrease" className="grid h-10 w-10 place-items-center" onClick={() => updateQty(l.id, l.size, l.qty - 1)}><MinusIcon /></button>
                        <span className="w-8 text-center text-sm">{l.qty}</span>
                        <button aria-label="Increase" className="grid h-10 w-10 place-items-center" onClick={() => updateQty(l.id, l.size, l.qty + 1)}><PlusIcon /></button>
                      </div>
                      <button className="link-underline text-[0.7rem] uppercase tracking-[0.2em] text-muted" onClick={() => removeLine(l.id, l.size)}>Remove</button>
                      {!saved && (
                        <button className="link-underline text-[0.7rem] uppercase tracking-[0.2em] text-muted" onClick={() => { toggleWishlist(p.id); removeLine(l.id, l.size); }}>
                          Move to wishlist
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="col-span-2 text-right font-display text-2xl sm:col-span-1">{formatINR(p.price * l.qty)}</p>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit border border-line bg-cream p-7 lg:sticky lg:top-44">
            <h2 className="font-display text-3xl">Order summary</h2>

            <div className="mt-6">
              {coupon ? (
                <div className="flex items-center justify-between border border-gold bg-ivory px-4 py-3 text-sm">
                  <span><strong className="font-medium">{coupon}</strong> · {SITE.coupons[coupon]?.label}</span>
                  <button onClick={removeCoupon} className="link-underline text-xs text-muted">Remove</button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (code.trim() && applyCoupon(code)) setCode(""); }} className="flex gap-2">
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code" className="field !bg-ivory uppercase" />
                  <button className="btn btn-outline-dark !px-5">Apply</button>
                </form>
              )}
              {couponError && <p className="mt-2 text-sm text-ruby">{couponError}</p>}
              {!coupon && <p className="mt-2 text-xs text-muted">Try WELCOME10, BRIDAL5 or SAVARA2000</p>}
            </div>

            <dl className="mt-7 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
              {totals.discount > 0 && <div className="flex justify-between text-teal"><dt>Discount</dt><dd>− {formatINR(totals.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted">Insured shipping</dt><dd>{totals.shipping === 0 ? "Complimentary" : formatINR(totals.shipping)}</dd></div>
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <dt className="text-[0.74rem] uppercase tracking-[0.22em]">Total</dt>
                <dd className="font-display text-3xl">{formatINR(totals.total)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted">Inclusive of GST.</p>
            <Link href="/checkout" className="btn btn-dark mt-7 w-full">Proceed to checkout</Link>
            <Link href="/collections/all" className="mt-4 block text-center text-sm text-muted underline-offset-4 hover:underline">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
