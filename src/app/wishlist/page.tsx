"use client";

import Link from "next/link";
import { getByIds } from "@/lib/products";
import { useStore } from "@/context/store";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const { ready, wishlist } = useStore();
  const items = getByIds(wishlist);

  return (
    <div className="container-x pb-28 pt-40 lg:pt-52">
      <p className="eyebrow">Saved for later</p>
      <h1 className="font-display mt-3 text-5xl sm:text-6xl">Wishlist</h1>
      {!ready ? null : items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">Nothing saved yet</p>
          <p className="mt-3 text-muted">Tap the heart on any piece to keep it here.</p>
          <Link href="/collections/all" className="btn btn-dark mt-8">Discover pieces</Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
