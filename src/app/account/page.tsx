"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatINR } from "@/lib/format";
import { SITE } from "@/lib/site";
import { useStore } from "@/context/store";

export default function AccountPage() {
  const { ready, orders, wishlist, notify } = useStore();
  const [f, setF] = useState({ name: "", phone: "", date: "", note: "" });
  const [err, setErr] = useState("");

  const book = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2 || !/^[6-9]\d{9}$/.test(f.phone) || !f.date) return setErr("Please add your name, a 10-digit mobile and a preferred date.");
    setErr("");
    setF({ name: "", phone: "", date: "", note: "" });
    notify("Request received — our concierge will call you shortly");
  };

  return (
    <div className="container-x pb-28 pt-40 lg:pt-52">
      <p className="eyebrow">Welcome back</p>
      <h1 className="font-display mt-3 text-5xl sm:text-6xl">Your account</h1>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="flex items-end justify-between border-b border-line pb-4">
            <h2 className="font-display text-3xl">Orders</h2>
            <Link href="/wishlist" className="link-underline text-[0.72rem] uppercase tracking-[0.22em]">Wishlist ({ready ? wishlist.length : 0})</Link>
          </div>
          {!ready ? null : orders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-2xl">No orders yet</p>
              <p className="mt-2 text-sm text-muted">Orders you place in this demo will be listed here.</p>
              <Link href="/collections/all" className="btn btn-dark mt-6">Start browsing</Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {orders.map((o) => (
                <li key={o.number} className="py-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{o.number}</p>
                    <p className="text-sm text-muted">{new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    {o.lines.slice(0, 4).map((l) => (
                      <div key={l.id + l.size} className="relative h-16 w-14 overflow-hidden bg-cream"><Image src={l.image} alt={l.name} fill sizes="56px" className="object-cover" /></div>
                    ))}
                    <p className="ml-auto text-right">
                      <span className="font-display text-2xl">{formatINR(o.totals.total)}</span>
                      <span className="block text-xs text-teal">Confirmed · Preparing for dispatch</span>
                    </p>
                  </div>
                  <Link href={`/order-confirmation?o=${o.number}`} className="link-underline mt-3 text-[0.7rem] uppercase tracking-[0.2em]">View details</Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="concierge" className="h-fit border border-line bg-cream p-8">
          <h2 className="font-display text-3xl">Private viewing</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Reserve an appointment at our maison or a video consultation with a jewellery stylist.</p>
          <form onSubmit={book} noValidate className="mt-6 space-y-4">
            <input className="field !bg-ivory" placeholder="Full name" aria-label="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input className="field !bg-ivory" placeholder="Mobile number" inputMode="numeric" maxLength={10} aria-label="Mobile number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, "") })} />
            <input className="field !bg-ivory" type="date" aria-label="Preferred date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
            <textarea className="field !bg-ivory" rows={3} placeholder="Looking for… (bridal set, engagement ring)" aria-label="Notes" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
            {err && <p className="text-sm text-ruby">{err}</p>}
            <button className="btn btn-dark w-full">Request appointment</button>
          </form>
          <p className="mt-5 text-xs text-muted">Or write to <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        </section>
      </div>
    </div>
  );
}
