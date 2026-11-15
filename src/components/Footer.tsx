"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { useStore } from "@/context/store";

export function Footer() {
  const { notify } = useStore();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Please enter a valid email address.");
    setErr("");
    setEmail("");
    notify("Welcome to Savara — your code WELCOME10 is on its way");
  };

  return (
    <footer className="bg-emerald-deep text-ivory">
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="eyebrow !text-gold-light">The Savara Letter</p>
          <h2 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            Be the first to see <em className="text-gold-light">what we’re crafting.</em>
          </h2>
          <form onSubmit={submit} className="mt-8 flex max-w-md border-b border-ivory/40 focus-within:border-gold-light" noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ivory/50"
            />
            <button className="px-2 text-[0.7rem] uppercase tracking-[0.24em] text-gold-light transition hover:text-ivory">Subscribe</button>
          </form>
          {err && <p className="mt-2 text-xs text-[#f0a79b]">{err}</p>}
          <p className="mt-3 text-xs text-ivory/60">Enjoy 10% off your first order. Unsubscribe anytime.</p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterCol
            title="Shop"
            links={[
              ["New Arrivals", "/collections/new-arrivals"],
              ["Rings", "/collections/rings"],
              ["Earrings", "/collections/earrings"],
              ["Necklaces", "/collections/necklaces"],
              ["Bangles & Bracelets", "/collections/bangles"],
              ["Bridal Atelier", "/collections/bridal"],
            ]}
          />
          <FooterCol
            title="Client Care"
            links={[
              ["Track an order", "/account"],
              ["Wishlist", "/wishlist"],
              ["Shipping & returns", "/account"],
              ["Ring size guide", "/collections/rings"],
              ["Jewellery care", "/account"],
              ["Contact us", "/account"],
            ]}
          />
          <div className="col-span-2 sm:col-span-1">
            <h3 className="eyebrow !text-gold-light">Visit</h3>
            <address className="mt-5 text-sm not-italic leading-7 text-ivory/80">
              Savara Maison
              <br />
              12 Mount Road, Chennai
              <br />
              Mon–Sat · 10am – 8pm
              <br />
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-gold-light">{SITE.phone}</a>
              <br />
              <a href={`mailto:${SITE.email}`} className="hover:text-gold-light">{SITE.email}</a>
            </address>
          </div>
        </div>
      </div>

      <div className="container-x">
        <p className="font-display select-none text-center text-[clamp(3.5rem,17vw,16rem)] font-light leading-[0.8] tracking-[0.12em] text-ivory/[0.06]" aria-hidden>
          {SITE.name}
        </p>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-ivory/15 py-8 text-xs text-ivory/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name} Fine Jewellery. All rights reserved. Demo storefront — mock data.</p>
          <p className="tracking-[0.18em] uppercase">BIS Hallmarked · IGI Certified · Insured Delivery</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="eyebrow !text-gold-light">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-ivory/80">
        {links.map(([l, h]) => (
          <li key={l}>
            <Link href={h} className="transition hover:text-gold-light">{l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
