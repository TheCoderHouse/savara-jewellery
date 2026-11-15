"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/store";
import { CheckIcon } from "@/components/icons";

function Confirmation() {
  const n = useSearchParams().get("o");
  const { ready, orders } = useStore();
  const order = orders.find((o) => o.number === n);

  if (!ready) return null;
  if (!order)
    return (
      <div className="py-16 text-center">
        <p className="font-display text-4xl">Order not found</p>
        <Link href="/account" className="btn btn-dark mt-8">View your orders</Link>
      </div>
    );

  const eta = new Date(order.date);
  eta.setDate(eta.getDate() + 4);

  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald text-gold-light"><CheckIcon width={30} height={30} /></span>
      <p className="eyebrow mt-8">Thank you, {order.customer.name.split(" ")[0]}</p>
      <h1 className="font-display mt-3 text-5xl sm:text-6xl">Your order is placed</h1>
      <p className="mt-4 text-muted">
        Order <strong className="font-medium text-ink">{order.number}</strong> · A confirmation has been sent to {order.customer.email}.
      </p>

      <div className="mt-12 border border-line bg-cream p-7 text-left sm:p-10">
        <ul className="divide-y divide-line">
          {order.lines.map((l) => (
            <li key={`${l.id}${l.size}`} className="flex items-center gap-5 py-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory"><Image src={l.image} alt="" fill sizes="64px" className="object-cover" /></div>
              <div className="flex-1">
                <p className="font-display text-xl leading-tight">{l.name}</p>
                <p className="text-xs text-muted">Qty {l.qty}{l.size ? ` · Size ${l.size}` : ""}</p>
              </div>
              <p className="text-sm">{formatINR(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatINR(order.totals.subtotal)}</dd></div>
          {order.totals.discount > 0 && <div className="flex justify-between text-teal"><dt>Discount</dt><dd>− {formatINR(order.totals.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{order.totals.shipping === 0 ? "Complimentary" : formatINR(order.totals.shipping)}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-medium"><dt>Total paid</dt><dd>{formatINR(order.totals.total)}</dd></div>
        </dl>
        <div className="mt-8 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-3">
          <div><p className="eyebrow !text-muted">Ships to</p><p className="mt-2 leading-6">{order.customer.address}<br />{order.customer.city} {order.customer.pin}</p></div>
          <div><p className="eyebrow !text-muted">Payment</p><p className="mt-2">{order.customer.payment}</p></div>
          <div><p className="eyebrow !text-muted">Estimated delivery</p><p className="mt-2">{eta.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p></div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/collections/all" className="btn btn-dark">Continue shopping</Link>
        <Link href="/account" className="btn btn-outline-dark">View orders</Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="container-x pb-28 pt-40 lg:pt-52">
      <Suspense fallback={null}>
        <Confirmation />
      </Suspense>
    </div>
  );
}
