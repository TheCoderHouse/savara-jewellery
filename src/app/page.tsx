import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Parallax, Reveal } from "@/components/motion";
import { Carousel } from "@/components/Carousel";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, GemIcon, RefreshIcon, ShieldIcon, StarIcon, TruckIcon } from "@/components/icons";
import { COLLECTIONS, ROOMS, products } from "@/lib/products";

const OCCASIONS = [
  { label: "Wedding", img: "/img/40.webp" },
  { label: "Festive", img: "/img/42.webp" },
  { label: "Party", img: "/img/64.webp" },
  { label: "Everyday", img: "/img/47.webp" },
  { label: "Gifting", img: "/img/49.webp" },
];

const REVIEWS = [
  { q: "The sapphire ring arrived in a box so beautiful I almost didn’t open it. It’s even more luminous in person.", n: "Ananya R.", c: "Mumbai" },
  { q: "We bought my entire bridal set from Savara. The kundan work is museum-grade and the team never rushed us.", n: "Meera & Kabir", c: "Jaipur" },
  { q: "Hallmarked, certified, insured — and the pearl earrings feel like they were made for me. Worth every rupee.", n: "Sana K.", c: "Bengaluru" },
];

const SUB: Record<string, string> = {
  rings: "Solitaires & stackers",
  earrings: "Drops, studs & jhumkas",
  necklaces: "Collars & heirloom haars",
  pendants: "Quiet statements",
  bangles: "Kadas, kangans & cuffs",
  bridal: "Heirloom wedding sets",
};

export default function Home() {
  const rooms = ROOMS.map((slug) => {
    const c = COLLECTIONS.find((x) => x.slug === slug)!;
    return {
      slug,
      title: c.title,
      sub: SUB[slug],
      count: products.filter(c.match).length,
      image: c.thumb,
      pos: c.thumbPos,
      thumb: c.thumb,
      thumbPos: c.thumbPos,
    };
  });
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 8);
  const fresh = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <>
      <Hero rooms={rooms} />

      {/* trust marquee */}
      <div className="overflow-hidden border-b border-line bg-cream py-4" aria-hidden>
        <div className="marquee flex w-max gap-14 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.34em] text-emerald">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-14">
              {["BIS Hallmarked", "IGI & GIA Certified Diamonds", "Lifetime Exchange", "Insured Doorstep Delivery", "15-Day Easy Returns", "Handcrafted Since 1924"].map((t) => (
                <span key={t} className="flex items-center gap-14">
                  {t} <span className="text-gold">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* intro */}
      <section className="section-y container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr_1fr]">
          <Reveal className="hidden lg:block">
            <Parallax className="aspect-[3/4]" speed={0.1} scale={1.2}>
              <div className="relative h-full w-full">
                <Image src="/img/50.webp" alt="Diamond drop earrings on silk" fill sizes="25vw" className="object-cover" />
              </div>
            </Parallax>
          </Reveal>
          <div className="text-center">
            <Reveal>
              <p className="eyebrow">The Maison</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="h-section mt-5">
                Made by hand. <em className="text-teal">Held for generations.</em>
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mx-auto mt-7 max-w-lg text-[1.02rem] leading-8 text-muted">
                For a hundred years our karigars have shaped gold, set stones and finished every surface by hand. Each Savara piece is
                hallmarked, certified and made to be passed from one generation to the next.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <Link href="/collections/all" className="btn btn-outline-dark mt-9">
                Discover the collection
              </Link>
            </Reveal>
          </div>
          <Reveal delay={150} className="hidden lg:block">
            <Parallax className="aspect-[3/4]" speed={0.18} scale={1.25}>
              <div className="relative h-full w-full">
                <Image src="/img/27.webp" alt="Pavé diamond solitaire ring" fill sizes="25vw" className="object-cover" />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* bestsellers */}
      <section className="bg-cream py-[clamp(4.5rem,8vw,8rem)]">
        <div className="container-x">
          <Reveal className="mb-10 max-w-xl">
            <p className="eyebrow">Most loved</p>
            <h2 className="h-section mt-4">Bestsellers</h2>
            <p className="mt-4 text-muted">The pieces our clients return to — and gift — again and again.</p>
          </Reveal>
          <Carousel>
            {bestsellers.map((p) => (
              <div key={p.id} className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-[24%]">
                <ProductCard product={p} sizes="(min-width:1024px) 24vw, 70vw" />
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* heritage gold parallax banner */}
      <section className="relative isolate flex min-h-[78svh] items-center overflow-hidden bg-black text-ivory">
        <Parallax className="absolute inset-0 -z-10" speed={0.12} scale={1.3}>
          <div className="relative h-full w-full">
            <Image src="/img/65.webp" alt="Stack of 22 karat gold bangles" fill sizes="100vw" quality={80} className="object-cover" />
          </div>
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <div className="container-x py-24">
          <Reveal>
            <p className="eyebrow !text-gold-light">22 Karat · Heritage Gold</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="h-section mt-5 max-w-[12ch] !text-[clamp(2.8rem,6.4vw,6rem)]">
              Gold, the way it was <em className="text-gold-light">meant to be.</em>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-md leading-8 text-ivory/80">
              Granulation, filigree and hand-engraving — techniques that take years to master and a lifetime to appreciate.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <Link href="/collections/bangles" className="btn btn-gold mt-9">
              Shop gold bangles <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* occasions */}
      <section className="section-y container-x">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Shop by occasion</p>
          <h2 className="h-section mt-4">For every chapter</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {OCCASIONS.map((o, i) => (
            <Reveal key={o.label} delay={i * 80} className={i === 4 ? "col-span-2 md:col-span-1" : ""}>
              <Link href={`/collections/all?occasion=${o.label}`} className="group relative block aspect-[3/4] overflow-hidden bg-cream max-md:aspect-[4/5]">
                <Image src={o.img} alt="" fill sizes="(min-width:768px) 20vw, 50vw" className="zoom-img object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/10 to-transparent" />
                <span className="font-display absolute inset-x-0 bottom-6 text-center text-[2rem] text-ivory">{o.label}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* craft */}
      <section className="bg-[#d8bf98] text-ink">
        <div className="container-x grid items-center gap-14 py-[clamp(4.5rem,9vw,9rem)] lg:grid-cols-2">
          <Reveal>
            <Parallax className="aspect-[4/3] lg:aspect-[5/6]" speed={0.1} scale={1.2}>
              <div className="relative h-full w-full">
                <Image src="/img/23.webp" alt="Loose diamonds held in tweezers" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              </div>
            </Parallax>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow !text-[#6b4a14]">Our craft</p>
              <h2 className="h-section mt-4">From rough stone to <em className="text-[#6b4a14]">heirloom.</em></h2>
            </Reveal>
            <ol className="mt-12 space-y-9">
              {[
                ["Ethical sourcing", "Every diamond and gemstone is traceable, conflict-free and graded by IGI or GIA."],
                ["Master artisans", "Our karigars cast, carve, pierce and set each piece by hand — never rushed, never mass-produced."],
                ["Certified & hallmarked", "BIS-hallmarked gold, certified stones and a lifetime exchange promise on every order."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 120} as="li">
                  <div className="flex gap-6">
                    <span className="font-display text-5xl leading-none text-[#8a6320]">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-2xl">{t}</h3>
                      <p className="mt-2 max-w-md leading-7 text-ink/80">{d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* bridal split */}
      <section className="grid lg:grid-cols-2">
        <Parallax className="relative min-h-[70svh] bg-cream lg:min-h-[88svh]" speed={0.08} scale={1.2}>
          <div className="relative h-full min-h-[70svh] w-full lg:min-h-[88svh]">
            <Image src="/img/40.webp" alt="Bride wearing a polki and emerald necklace set" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" style={{ objectPosition: "50% 30%" }} />
          </div>
        </Parallax>
        <div className="flex items-center bg-cream px-[clamp(1.5rem,6vw,6rem)] py-20">
          <div className="max-w-lg">
            <Reveal><p className="eyebrow">The Bridal Atelier</p></Reveal>
            <Reveal delay={100}>
              <h2 className="h-section mt-5">Your story, set in <em className="text-teal">gold.</em></h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 leading-8 text-muted">
                Polki, kundan, pearls and emeralds — composed into complete bridal sets by our atelier. Book a private viewing and our
                stylists will curate pieces around your outfit, your family’s traditions and your day.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/collections/bridal" className="btn btn-dark">Shop bridal sets</Link>
                <Link href="/account" className="btn btn-outline-dark">Book a viewing</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* new arrivals */}
      <section className="section-y container-x">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Just finished</p>
            <h2 className="h-section mt-4">New arrivals</h2>
          </div>
          <Link href="/collections/new-arrivals" className="link-underline hidden text-[0.72rem] uppercase tracking-[0.24em] sm:inline-block">
            Shop all new
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
          {fresh.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* as worn gallery */}
      <section className="overflow-hidden bg-cream py-[clamp(4.5rem,8vw,8rem)]">
        <div className="container-x">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow">As worn</p>
            <h2 className="h-section mt-4">Jewellery that lives with you</h2>
          </Reveal>
          <div className="grid grid-cols-2 items-start gap-4 md:grid-cols-4 md:gap-6">
            {[
              ["/img/55.webp", "aspect-[3/4]", 0.05, "md:mt-0"],
              ["/img/12.webp", "aspect-[4/5]", 0.14, "md:mt-16"],
              ["/img/19.webp", "aspect-[3/4]", 0.08, "md:mt-6"],
              ["/img/57.webp", "aspect-[4/5]", 0.16, "md:mt-24"],
            ].map(([src, ar, sp, mt]) => (
              <Reveal key={src as string} className={mt as string}>
                <Parallax className={`${ar} bg-sand`} speed={sp as number} scale={1.22}>
                  <div className="relative h-full w-full">
                    <Image src={src as string} alt="Savara jewellery worn by a client" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
                  </div>
                </Parallax>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="section-y container-x">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Client stories</p>
          <h2 className="h-section mt-4">Loved by those who wear it</h2>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.n} delay={i * 120}>
              <figure className="h-full border border-line bg-ivory p-8">
                <div className="flex gap-1 text-gold">{[0, 1, 2, 3, 4].map((s) => <StarIcon key={s} />)}</div>
                <blockquote className="font-display mt-5 text-[1.5rem] leading-snug">“{r.q}”</blockquote>
                <figcaption className="mt-6 text-[0.72rem] uppercase tracking-[0.22em] text-muted">
                  {r.n} — {r.c}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* services */}
      <section className="border-y border-line bg-cream">
        <div className="container-x grid grid-cols-2 gap-10 py-14 lg:grid-cols-4">
          {[
            [<ShieldIcon key="s" />, "Certified & hallmarked", "BIS gold · IGI/GIA diamonds"],
            [<TruckIcon key="t" />, "Insured delivery", "Complimentary over ₹25,000"],
            [<RefreshIcon key="r" />, "15-day returns", "Plus lifetime exchange"],
            [<GemIcon key="g" />, "Complimentary care", "Cleaning & polishing for life"],
          ].map(([icon, t, d]) => (
            <div key={t as string} className="text-center">
              <div className="mx-auto grid h-12 place-items-center text-gold">{icon}</div>
              <h3 className="font-display mt-3 text-xl">{t}</h3>
              <p className="mt-1 text-[0.82rem] text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
