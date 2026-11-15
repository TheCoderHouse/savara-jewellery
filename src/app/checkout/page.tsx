"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { products } from "@/lib/products";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/store";

type Errors = Record<string, string>;
function Field({
  id,
  label,
  error,
  ...rest
}: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div data-err={!!error}>
      <label htmlFor={id} className="mb-1.5 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">{label}</label>
      <input id={id} aria-invalid={!!error} className={`field ${error ? "!border-ruby" : ""}`} {...rest} />
      {error && <p className="mt-1 text-xs text-ruby">{error}</p>}
    </div>
  );
}

const PAYMENTS = [
  ["upi", "UPI", "Pay with any UPI app"],
  ["card", "Credit / Debit card", "Visa, Mastercard, RuPay, Amex"],
  ["netbanking", "Net banking", "All major Indian banks"],
  ["cod", "Pay on delivery", "Available on orders up to ₹1,00,000"],
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { ready, lines, totals, coupon, placeOrder } = useStore();
  const [f, setF] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pin: "", payment: "upi", card: "", exp: "", cvv: "", upi: "" });
  const [err, setErr] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  if (ready && lines.length === 0 && !busy) {
    return (
      <div className="container-x py-40 text-center lg:pt-60">
        <p className="font-display text-4xl">Your bag is empty</p>
        <Link href="/collections/all" className="btn btn-dark mt-8">Continue shopping</Link>
      </div>
    );
  }

  const validate = () => {
    const e: Errors = {};
    if (f.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (f.address.trim().length < 6) e.address = "Enter your full address";
    if (f.city.trim().length < 2) e.city = "Enter your city";
    if (f.state.trim().length < 2) e.state = "Enter your state";
    if (!/^[1-9]\d{5}$/.test(f.pin)) e.pin = "Enter a valid 6-digit pincode";
    if (f.payment === "upi" && !/^[\w.-]+@[\w]+$/.test(f.upi)) e.upi = "Enter a valid UPI ID (name@bank)";
    if (f.payment === "card") {
      if (f.card.replace(/\s/g, "").length < 15) e.card = "Enter a valid card number";
      if (!/^\d{2}\/\d{2}$/.test(f.exp)) e.exp = "MM/YY";
      if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = "Invalid";
    }
    if (f.payment === "cod" && totals.total > 100000) e.payment = "Pay on delivery isn’t available above ₹1,00,000";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      document.querySelector("[data-err='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const o = placeOrder({
        name: f.name,
        email: f.email,
        phone: f.phone,
        address: f.address,
        city: `${f.city}, ${f.state}`,
        pin: f.pin,
        payment: PAYMENTS.find((p) => p[0] === f.payment)![1],
      });
      router.push(`/order-confirmation?o=${o.number}`);
    }, 1100);
  };

  const p = (id: keyof typeof f) => ({ value: f[id], onChange: set(id), error: err[id] });

  return (
    <div className="container-x pb-28 pt-40 lg:pt-52">
      <h1 className="font-display text-5xl sm:text-6xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted">Demo checkout — no real payment is taken and nothing is sent anywhere.</p>

      <form onSubmit={submit} noValidate className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-3xl">Contact</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field {...p("name")} id="name" label="Full name" autoComplete="name" /></div>
              <Field {...p("email")} id="email" label="Email" type="email" autoComplete="email" />
              <Field {...p("phone")} id="phone" label="Mobile" inputMode="numeric" maxLength={10} autoComplete="tel-national" />
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl">Delivery address</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field {...p("address")} id="address" label="Address" autoComplete="street-address" /></div>
              <Field {...p("city")} id="city" label="City" autoComplete="address-level2" />
              <Field {...p("state")} id="state" label="State" autoComplete="address-level1" />
              <Field {...p("pin")} id="pin" label="Pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" />
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl">Payment</h2>
            <div className="mt-6 space-y-3" role="radiogroup" aria-label="Payment method">
              {PAYMENTS.map(([v, l, d]) => (
                <label key={v} className={`flex cursor-pointer items-center gap-4 border p-4 transition ${f.payment === v ? "border-emerald bg-cream" : "border-line"}`}>
                  <input type="radio" name="payment" value={v} checked={f.payment === v} onChange={() => setF({ ...f, payment: v })} className="accent-[var(--emerald)]" />
                  <span>
                    <span className="block text-sm font-medium">{l}</span>
                    <span className="block text-xs text-muted">{d}</span>
                  </span>
                </label>
              ))}
              {err.payment && <p className="text-sm text-ruby">{err.payment}</p>}
            </div>
            {f.payment === "upi" && <div className="mt-5"><Field {...p("upi")} id="upi" label="UPI ID" placeholder="name@bank" /></div>}
            {f.payment === "card" && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field {...p("card")} id="card" label="Card number" inputMode="numeric" placeholder="4242 4242 4242 4242" maxLength={19} /></div>
                <Field {...p("exp")} id="exp" label="Expiry" placeholder="MM/YY" maxLength={5} />
                <Field {...p("cvv")} id="cvv" label="CVV" inputMode="numeric" maxLength={4} type="password" />
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit border border-line bg-cream p-7 lg:sticky lg:top-44">
          <h2 className="font-display text-3xl">Your order</h2>
          <ul className="mt-6 divide-y divide-line">
            {lines.map((l) => {
              const p = products.find((x) => x.id === l.id)!;
              return (
                <li key={`${l.id}-${l.size}`} className="flex gap-4 py-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory">
                    <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                    <span className="absolute right-0 top-0 grid h-5 w-5 place-items-center bg-emerald text-[0.65rem] text-ivory">{l.qty}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-lg leading-tight">{p.name}</p>
                    <p className="text-xs text-muted">{l.size ? `Size ${l.size}` : p.metal}</p>
                  </div>
                  <p className="text-sm">{formatINR(p.price * l.qty)}</p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-teal"><dt>Discount {coupon && `(${coupon})`}</dt><dd>− {formatINR(totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Insured shipping</dt><dd>{totals.shipping === 0 ? "Complimentary" : formatINR(totals.shipping)}</dd></div>
            <div className="flex items-baseline justify-between border-t border-line pt-4">
              <dt className="text-[0.74rem] uppercase tracking-[0.22em]">Total</dt>
              <dd className="font-display text-3xl">{formatINR(totals.total)}</dd>
            </div>
          </dl>
          <button disabled={busy} className="btn btn-dark mt-7 w-full">{busy ? "Placing order…" : `Pay ${formatINR(totals.total)}`}</button>
          <p className="mt-3 text-center text-xs text-muted">Secured · BIS hallmarked · 15-day returns</p>
          <Link href="/cart" className="mt-4 block text-center text-sm text-muted underline-offset-4 hover:underline">Back to bag</Link>
        </aside>
      </form>
    </div>
  );
}
