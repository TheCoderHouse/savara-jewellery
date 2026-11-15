import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection, productsFor } from "@/lib/products";
import { Listing } from "@/components/Listing";
import { RoomHero } from "@/components/RoomHero";
import { formatINR } from "@/lib/format";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return c ? { title: c.title, description: c.blurb } : {};
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const list = productsFor(slug);
  const isCategory = ["all", "new-arrivals", "bestsellers"].includes(slug);

  const min = Math.min(...list.map((p) => p.price));

  return (
    <>
      <RoomHero slug={c.slug} title={c.title} blurb={c.blurb} image={c.thumb} pos={c.thumbPos} thumb={c.thumb} thumbPos={c.thumbPos} count={list.length} from={formatINR(min)} />
      <div id="pieces" className="room-light relative scroll-mt-0 bg-cream">
        <div className="container-x pb-4 pt-24 text-center">
          <p className="eyebrow">Inside the room</p>
          <h2 className="h-section mt-3">{c.title}</h2>
        </div>
        <Suspense fallback={<div className="container-x py-24 text-center text-muted">Loading collection…</div>}>
          <Listing products={list} showCategories={isCategory} />
        </Suspense>
      </div>
    </>
  );
}
