import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getProduct, products, related } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.tagline,
    openGraph: { images: [p.images[0]], title: p.name, description: p.tagline },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const col = getCollection(p.category);
  const rel = related(p, 4);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images.map((i) => `${SITE.url}${i}`),
    description: p.tagline,
    sku: p.id,
    brand: { "@type": "Brand", name: SITE.name },
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
    offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: "https://schema.org/InStock" },
  };

  return (
    <div className="pt-36 lg:pt-44">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="container-x pb-24">
        <nav aria-label="Breadcrumb" className="mb-8 text-[0.7rem] uppercase tracking-[0.22em] text-muted">
          <Link href="/" className="hover:text-gold">Home</Link> <span className="mx-2">/</span>
          {col && (
            <>
              <Link href={`/collections/${col.slug}`} className="hover:text-gold">{col.title}</Link> <span className="mx-2">/</span>
            </>
          )}
          <span className="text-ink">{p.name}</span>
        </nav>
        <ProductDetail product={p} />
      </div>

      {rel.length > 0 && (
        <section className="bg-cream py-20">
          <div className="container-x">
            <p className="eyebrow">You may also love</p>
            <h2 className="h-section mt-4">Complete the look</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
              {rel.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
