"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";

export type CartLine = { id: string; size?: string; qty: number };
export type Order = {
  number: string;
  date: string;
  lines: { id: string; name: string; size?: string; qty: number; price: number; image: string }[];
  totals: Totals;
  customer: { name: string; email: string; phone: string; address: string; city: string; pin: string; payment: string };
};
export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  count: number;
};

type Ctx = {
  ready: boolean;
  lines: CartLine[];
  wishlist: string[];
  coupon: string | null;
  couponError: string | null;
  totals: Totals;
  cartOpen: boolean;
  searchOpen: boolean;
  toast: string | null;
  orders: Order[];
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  addToCart: (id: string, size?: string, qty?: number, open?: boolean) => void;
  updateQty: (id: string, size: string | undefined, qty: number) => void;
  removeLine: (id: string, size?: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  placeOrder: (customer: Order["customer"]) => Order;
  notify: (msg: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);
const KEY = "savara:v1";

const priceOf = (id: string) => products.find((p) => p.id === id)?.price ?? 0;

function compute(lines: CartLine[], coupon: string | null): Totals {
  const subtotal = lines.reduce((s, l) => s + priceOf(l.id) * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  let discount = 0;
  const c = coupon ? SITE.coupons[coupon] : undefined;
  if (c && (!c.min || subtotal >= c.min)) {
    discount = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
  }
  const shipping = subtotal === 0 || subtotal >= SITE.freeShippingThreshold ? 0 : 499;
  return { subtotal, discount, shipping, count, total: Math.max(0, subtotal - discount + shipping) };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setLines(d.lines ?? []);
        setWishlist(d.wishlist ?? []);
        setCoupon(d.coupon ?? null);
        setOrders(d.orders ?? []);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ lines, wishlist, coupon, orders }));
    } catch {}
  }, [ready, lines, wishlist, coupon, orders]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart: Ctx["addToCart"] = useCallback(
    (id, size, qty = 1, open = true) => {
      setLines((prev) => {
        const i = prev.findIndex((l) => l.id === id && l.size === size);
        if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
        return [...prev, { id, size, qty }];
      });
      if (open) setCartOpen(true);
    },
    [],
  );

  const updateQty: Ctx["updateQty"] = useCallback((id, size, qty) => {
    setLines((prev) =>
      prev.flatMap((l) => (l.id === id && l.size === size ? (qty <= 0 ? [] : [{ ...l, qty: Math.min(10, qty) }]) : [l])),
    );
  }, []);

  const removeLine: Ctx["removeLine"] = useCallback(
    (id, size) => setLines((prev) => prev.filter((l) => !(l.id === id && l.size === size))),
    [],
  );

  const clearCart = useCallback(() => {
    setLines([]);
    setCoupon(null);
  }, []);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const has = prev.includes(id);
        notify(has ? "Removed from wishlist" : "Saved to wishlist");
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [notify],
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const c = code.trim().toUpperCase();
      const def = SITE.coupons[c];
      const sub = lines.reduce((s, l) => s + priceOf(l.id) * l.qty, 0);
      if (!def) {
        setCouponError("That code isn’t valid.");
        return false;
      }
      if (def.min && sub < def.min) {
        setCouponError(`Add items worth ₹${def.min.toLocaleString("en-IN")} or more to use this code.`);
        return false;
      }
      setCoupon(c);
      setCouponError(null);
      notify(`${c} applied`);
      return true;
    },
    [lines, notify],
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
  }, []);

  const totals = useMemo(() => compute(lines, coupon), [lines, coupon]);

  const placeOrder: Ctx["placeOrder"] = useCallback(
    (customer) => {
      const order: Order = {
        number: `AU-${Date.now().toString().slice(-8)}`,
        date: new Date().toISOString(),
        lines: lines.map((l) => {
          const p = products.find((x) => x.id === l.id)!;
          return { id: l.id, name: p.name, size: l.size, qty: l.qty, price: p.price, image: p.images[0] };
        }),
        totals,
        customer,
      };
      setOrders((prev) => [order, ...prev]);
      setLines([]);
      setCoupon(null);
      return order;
    },
    [lines, totals],
  );

  // lock body scroll when overlays are open
  useEffect(() => {
    const lock = cartOpen || searchOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, searchOpen]);

  const value: Ctx = {
    ready,
    lines,
    wishlist,
    coupon,
    couponError,
    totals,
    cartOpen,
    searchOpen,
    toast,
    orders,
    setCartOpen,
    setSearchOpen,
    addToCart,
    updateQty,
    removeLine,
    clearCart,
    toggleWishlist,
    applyCoupon,
    removeCoupon,
    placeOrder,
    notify,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
