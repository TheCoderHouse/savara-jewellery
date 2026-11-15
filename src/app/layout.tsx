import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { Toast } from "@/components/Toast";
import { SITE } from "@/lib/site";
import { RoomProvider } from "@/context/rooms";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const hero = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Fine Jewellery House · Diamonds, Gold & Bridal`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Hand-finished diamond, gold and gemstone jewellery. BIS hallmarked, IGI certified, insured delivery. Explore rings, earrings, necklaces, bangles and the Bridal Atelier.",
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} — Fine Jewellery House`,
    description: "Heirloom jewellery, made to be worn, gifted and remembered.",
    images: ["/video/hero-poster.webp"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a1d0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${hero.variable}`}>
      <body className="flex min-h-screen flex-col">
        <StoreProvider>
          <RoomProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <Toast />
        </RoomProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
