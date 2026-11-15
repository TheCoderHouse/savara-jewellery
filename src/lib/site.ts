export const SITE = {
  name: "SAVARA",
  tagline: "Fine Jewellery House",
  est: "Est. 1924",
  url: "https://savara.example",
  email: "concierge@savara.example",
  phone: "+91 98 7654 3210",
  freeShippingThreshold: 25000,
  gstRate: 0.03,
  coupons: {
    WELCOME10: { type: "percent", value: 10, label: "10% off your first order" },
    BRIDAL5: { type: "percent", value: 5, label: "5% off bridal pieces" },
    SAVARA2000: { type: "flat", value: 2000, label: "₹2,000 off orders above ₹40,000", min: 40000 },
  } as Record<string, { type: "percent" | "flat"; value: number; label: string; min?: number }>,
};

export const NAV = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Rings", href: "/collections/rings" },
  { label: "Earrings", href: "/collections/earrings" },
  { label: "Necklaces", href: "/collections/necklaces" },
  { label: "Pendants", href: "/collections/pendants" },
  { label: "Bangles & Bracelets", href: "/collections/bangles" },
  { label: "Bridal", href: "/collections/bridal" },
];
