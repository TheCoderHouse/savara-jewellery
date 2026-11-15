import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const HeartIcon = ({ filled, ...p }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.8 3.7 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.3 0 5.3 3.3 4.2 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z" />
  </svg>
);
export const BagIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
);
export const UserIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 20.5c1.2-4 4.2-5.5 8-5.5s6.8 1.5 8 5.5" /></svg>
);
export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M3 7h18M3 12h18M3 17h12" /></svg>
);
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 18, height: 18, ...p })}><path d="M4 12h16M14 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 18, height: 18, ...p })}><path d="M20 12H4M10 6l-6 6 6 6" /></svg>
);
export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 16, height: 16, ...p })}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 16, height: 16, ...p })}><path d="M5 12h14" /></svg>
);
export const StarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 14, height: 14, ...p })} fill="currentColor" stroke="none">
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
  </svg>
);
export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 18, height: 18, ...p })}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const TruckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 28, height: 28, strokeWidth: 1, ...p })}><path d="M2 6h11v10H2zM13 10h4l3 3v3h-7" /><circle cx="6.5" cy="17.5" r="1.7" /><circle cx="16.5" cy="17.5" r="1.7" /></svg>
);
export const ShieldIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 28, height: 28, strokeWidth: 1, ...p })}><path d="M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.5 7.5-5 7.5-9.5V6L12 3Z" /><path d="m8.8 12 2.3 2.3 4.2-4.6" /></svg>
);
export const GemIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 28, height: 28, strokeWidth: 1, ...p })}><path d="M6 4h12l3.5 5L12 20.5 2.5 9 6 4Z" /><path d="M2.5 9h19M9 4l3 5 3-5M12 9v11.5" /></svg>
);
export const RefreshIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 28, height: 28, strokeWidth: 1, ...p })}><path d="M20 11a8 8 0 0 0-14.5-4M4 13a8 8 0 0 0 14.5 4" /><path d="M5.5 3v4h4M18.5 21v-4h-4" /></svg>
);
export const ChevronDown = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 16, height: 16, ...p })}><path d="m6 9 6 6 6-6" /></svg>
);
export const ArrowUp = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 18, height: 18, ...p })}><path d="M12 20V4M6 10l6-6 6 6" /></svg>
);
