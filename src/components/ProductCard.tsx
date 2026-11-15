"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatINR, pctOff } from "@/lib/format";
import { useStore } from "@/context/store";
import { HeartIcon } from "./icons";

export function ProductCard({
  product: p,
  priority = false,
  sizes = "(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const saved = wishlist.includes(p.id);
  const off = pctOff(p.price, p.compareAt);
  const second = p.images[1];
  const href = `/product/${p.slug}`;

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Link href={href} aria-label={p.name} className="absolute inset-0 block">
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes={sizes}
            quality={70}
            priority={priority}
            className="zoom-img object-cover"
          />
          {second && (
            <Image
              src={second}
              alt=""
              fill
              sizes={sizes}
              quality={70}
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </Link>
        {(p.badge || off > 0) && (
          <span className="pointer-events-none absolute left-3 top-3 bg-ivory/95 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-emerald">
            {off > 0 ? `${off}% off` : p.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(p.id)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ivory/90 text-emerald transition hover:bg-ivory"
        >
          <HeartIcon filled={saved} width={18} height={18} className={saved ? "text-ruby" : ""} />
        </button>
        {p.sizes ? (
          <Link
            href={href}
            tabIndex={-1}
            className="absolute inset-x-3 bottom-3 hidden translate-y-2 bg-emerald/95 py-3 text-center text-[0.68rem] uppercase tracking-[0.24em] text-ivory opacity-0 transition duration-500 hover:bg-gold md:block md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            Select size
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => addToCart(p.id)}
            className="absolute inset-x-3 bottom-3 hidden translate-y-2 bg-emerald/95 py-3 text-[0.68rem] uppercase tracking-[0.24em] text-ivory opacity-0 transition duration-500 hover:bg-gold md:block md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            Quick add
          </button>
        )}
      </div>
      <Link href={href} className="block pt-4">
        <h3 className="font-display text-[1.3rem] leading-snug">{p.name}</h3>
        <p className="mt-0.5 text-[0.78rem] text-muted">
          {p.metal}
          {p.stone !== "None" ? ` · ${p.stone}` : ""}
        </p>
        <p className="mt-2 text-[0.95rem] tracking-wide">
          {formatINR(p.price)}
          {p.compareAt && <span className="ml-2 text-[0.8rem] text-muted line-through">{formatINR(p.compareAt)}</span>}
        </p>
      </Link>
    </article>
  );
}
