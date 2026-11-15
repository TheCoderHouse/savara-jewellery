export type Category =
  | "rings"
  | "earrings"
  | "necklaces"
  | "pendants"
  | "bangles"
  | "bridal";

export type Occasion = "Wedding" | "Everyday" | "Festive" | "Party" | "Gifting";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  metal: string;
  stone: string;
  price: number;
  compareAt?: number;
  images: string[];
  occasions: Occasion[];
  tagline: string;
  description: string;
  badge?: "New" | "Bestseller" | "Limited" | "Heirloom";
  rating: number;
  reviews: number;
  weight: number; // grams
  sizes?: string[];
  bestseller?: boolean;
  isNew?: boolean;
  details: [string, string][];
};

export const RING_SIZES = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];
export const BANGLE_SIZES = ["2.2", "2.4", "2.6", "2.8"];
export const METALS = ["22K Yellow Gold", "18K Yellow Gold", "18K Rose Gold", "18K White Gold", "925 Sterling Silver"];

type Seed = [
  name: string,
  category: Category,
  metal: string,
  stone: string,
  price: number,
  images: number[],
  occasions: Occasion[],
  tagline: string,
  opts?: Partial<
    Pick<Product, "compareAt" | "badge" | "weight" | "bestseller" | "isNew">
  >,
];

const seeds: Seed[] = [
  // ───────── RINGS
  ["Aria Bezel Solitaire", "rings", "18K White Gold", "Lab-grown Diamond", 58500, [37, 49], ["Everyday", "Gifting"], "A single diamond, held with quiet confidence.", { bestseller: true, weight: 3.4 }],
  ["Celeste Halo Engagement Ring", "rings", "18K White Gold", "Natural Diamond", 124000, [41, 27], ["Wedding", "Gifting"], "A brilliant centre stone ringed in pavé light.", { badge: "Bestseller", bestseller: true, weight: 4.1, compareAt: 138000 }],
  ["Nilam Sapphire Filigree Ring", "rings", "18K White Gold", "Blue Sapphire", 96000, [64], ["Party", "Wedding"], "Hand-pierced filigree around a deep Ceylon-blue sapphire.", { badge: "Limited", weight: 6.8 }],
  ["Royale Sapphire Cluster Ring", "rings", "18K White Gold", "Blue Sapphire", 78500, [25], ["Party", "Festive"], "Oval sapphires wreathed in a diamond halo.", { isNew: true, weight: 5.2 }],
  ["Nazar Evil-Eye Bead Ring", "rings", "18K Yellow Gold", "Enamel", 14900, [47, 23], ["Everyday", "Gifting"], "A protective charm on a delicate beaded band.", { isNew: true, bestseller: true, weight: 1.9 }],
  ["Ruby Rail Band", "rings", "18K Rose Gold", "Ruby & Diamond", 62000, [48], ["Party", "Wedding"], "A bar of Burmese-red rubies framed by pavé diamonds.", { weight: 5.6 }],
  ["Stellar Cocktail Ring", "rings", "18K Yellow Gold", "Natural Diamond", 84000, [53], ["Party", "Festive"], "A starburst of diamonds with a soft, glowing finish.", { badge: "New", isNew: true, weight: 5.9 }],
  ["Hridaya Heart Ring", "rings", "22K Yellow Gold", "Diamond Accent", 18500, [29], ["Everyday", "Gifting"], "A sculpted heart that holds a single spark.", { weight: 2.6 }],
  ["Eternal Four-Prong Solitaire", "rings", "Platinum", "Natural Diamond", 148000, [49, 37], ["Wedding"], "The classic proposal ring in pure platinum.", { bestseller: true, weight: 4.8 }],
  ["Midnight Pavé Solitaire", "rings", "18K White Gold", "Lab-grown Diamond", 69500, [27], ["Wedding", "Party"], "A wide pavé band that glitters in low light.", { weight: 4.6 }],
  ["Twin Vine Silver Ring", "rings", "925 Sterling Silver", "None", 4900, [13], ["Everyday"], "Two intertwined vines, oxidised by hand.", { weight: 3.1 }],

  // ───────── EARRINGS
  ["Mor Pearl Chandelier Earrings", "earrings", "18K Yellow Gold", "Freshwater Pearl", 38500, [31, 52], ["Festive", "Wedding"], "Peacock-scale tiers strung with lustrous pearls.", { bestseller: true, weight: 7.8 }],
  ["Tri-Tone Floral Drops", "earrings", "18K Yellow Gold", "None", 68000, [46], ["Festive", "Party"], "Three blossoms in yellow, rose and white gold.", { badge: "New", isNew: true, weight: 6.4 }],
  ["Ruby Teardrop Earrings", "earrings", "18K Yellow Gold", "Ruby & Diamond", 112000, [20], ["Wedding", "Festive"], "Pear-cut rubies suspended in diamond-set halos.", { badge: "Bestseller", bestseller: true, weight: 8.9 }],
  ["Pavé Cascade Diamond Drops", "earrings", "18K Yellow Gold", "Natural Diamond", 96500, [50], ["Party", "Wedding"], "Geometric frames that move with every turn.", { weight: 6.7 }],
  ["Noor Onyx Statement Studs", "earrings", "925 Sterling Silver", "Black Onyx", 7900, [30], ["Everyday", "Festive"], "Sunburst studs set with faceted onyx.", { bestseller: true, weight: 9.2 }],
  ["Firoza Oxidised Jhumkas", "earrings", "925 Sterling Silver", "Turquoise", 9500, [21], ["Festive", "Everyday"], "Lantern jhumkas with turquoise drops.", { weight: 8.1 }],
  ["Indra Gemstone Drop Earrings", "earrings", "18K Yellow Gold", "Multi-gem", 44500, [12], ["Party", "Gifting"], "A spectrum of rose-cut gemstones in one drop.", { isNew: true, weight: 5.3 }],

  // ───────── NECKLACES
  ["Nila Aqua Topaz Necklace", "necklaces", "925 Sterling Silver", "Blue Topaz", 24000, [62], ["Party", "Gifting"], "Eight oval topaz in scrolled silver settings.", { weight: 28 }],
  ["Amethyst Y-Necklace", "necklaces", "925 Sterling Silver", "Amethyst", 22500, [61], ["Party", "Gifting"], "Pear-cut amethyst converging on a rose-quartz drop.", { weight: 24 }],
  ["Boond Teardrop Gold Necklace", "necklaces", "22K Yellow Gold", "None", 145000, [42, 45], ["Festive", "Wedding"], "Five matte-and-polish drops on a beaded chain.", { badge: "Heirloom", bestseller: true, weight: 18.6 }],
  ["Heirloom Gold Chain Collection", "necklaces", "22K Yellow Gold", "None", 72000, [58], ["Everyday", "Gifting"], "Hallmarked chains in rope, link and figaro.", { weight: 9.8 }],
  ["Layered Lapis & Turquoise Stack", "necklaces", "18K Yellow Gold", "Lapis & Turquoise", 108000, [33], ["Party", "Gifting"], "A curated stack of tennis chains and a moon medallion.", { badge: "New", isNew: true, weight: 22.4 }],
  ["Floret Pearl Collar", "necklaces", "18K Rose Gold", "Pearl & Morganite", 53500, [55], ["Wedding", "Party"], "A blossoming collar of pearl and blush stones.", { weight: 14.2 }],
  ["Chevron Heritage Necklace", "necklaces", "925 Sterling Silver", "None", 13800, [32], ["Festive", "Everyday"], "Three engraved chevrons with teardrop charms.", { weight: 42 }],
  ["Rajasthani Silver Collar", "necklaces", "925 Sterling Silver", "None", 11900, [19], ["Festive", "Everyday"], "A traditional tribal collar in oxidised silver.", { weight: 55 }],
  ["Baroque Pearl & Labradorite Necklace", "necklaces", "18K Yellow Gold", "Pearl & Labradorite", 135000, [52], ["Wedding", "Party"], "Sculptural baroque pearls with flashing labradorite.", { badge: "Limited", weight: 20.5 }],
  ["Trikona Layering Chains", "necklaces", "18K Yellow Gold", "None", 31800, [1], ["Everyday", "Gifting"], "Three whisper-fine chains with geometric charms.", { weight: 6.2 }],

  // ───────── PENDANTS
  ["Ember Amethyst Teardrop Pendant", "pendants", "18K Yellow Gold", "Amethyst", 16800, [24], ["Everyday", "Gifting"], "A single drop of violet on a fine gold chain.", { bestseller: true, weight: 2.4 }],
  ["Halo Solitaire Pendant", "pendants", "18K White Gold", "Natural Diamond", 46000, [56], ["Everyday", "Gifting", "Party"], "A halo of diamonds resting at the collarbone.", { badge: "Bestseller", bestseller: true, weight: 3.1 }],
  ["Sapphire Devotion Pendant", "pendants", "18K Yellow Gold", "Blue Sapphire", 28000, [39], ["Festive", "Gifting"], "Sapphire pavé over a hand-engraved gold motif.", { weight: 4.5 }],
  ["Pushpa Diamond Mangalsutra Pendant", "pendants", "18K Yellow Gold", "Natural Diamond", 128000, [44], ["Wedding", "Gifting"], "Floral diamond clusters, a contemporary mangalsutra.", { badge: "Heirloom", weight: 4.9 }],
  ["Meenakari Mandala Pendant", "pendants", "22K Yellow Gold", "Enamel", 96000, [45], ["Festive", "Wedding"], "Hand-painted enamel under a filigree mandala.", { isNew: true, weight: 12.4 }],
  ["Kamal Silver Pendant Necklace", "pendants", "925 Sterling Silver", "None", 8400, [51], ["Everyday", "Festive"], "A lotus-fan pendant with granulation detail.", { weight: 16 }],
  ["Lunar Disc Pendant", "pendants", "925 Sterling Silver", "Druzy", 5900, [17], ["Everyday", "Gifting"], "A sparkling druzy disc, polished to a moon-glow.", { weight: 7.5 }],
  ["Rosé Druzy Disc Pendant", "pendants", "925 Sterling Silver", "Druzy", 5900, [18], ["Everyday", "Gifting"], "The same disc in a warm rosé finish.", { weight: 7.5 }],
  ["Mayura Statement Pendant", "pendants", "925 Sterling Silver", "Turquoise & Ruby", 21500, [6], ["Festive", "Party"], "A peacock-inspired pendant in tribal silver.", { weight: 38 }],

  // ───────── BANGLES & BRACELETS
  ["Swan Pavé Bangle Pair", "bangles", "18K Rose Gold", "Cubic Zirconia", 88000, [43], ["Party", "Gifting"], "A swan in pavé, paired with a sleek diamond band.", { badge: "New", isNew: true, weight: 22 }],
  ["Rubina Emerald Polki Bangles", "bangles", "18K Yellow Gold", "Ruby & Emerald", 52000, [35], ["Wedding", "Festive"], "Ruby and emerald cabochons between rows of stones.", { bestseller: true, weight: 24 }],
  ["Phool Oxidised Kada", "bangles", "925 Sterling Silver", "None", 14500, [34], ["Festive", "Everyday"], "Flower-capped kada with charming silver bells.", { weight: 46 }],
  ["Heritage Gold Bangles, Set of 8", "bangles", "22K Yellow Gold", "None", 385000, [65, 9], ["Wedding", "Festive"], "Eight hand-engraved bangles with granulated detail.", { badge: "Heirloom", weight: 62 }],
  ["Gold Filigree Bangle Pair", "bangles", "22K Yellow Gold", "None", 162000, [60], ["Festive", "Wedding"], "A classic pair, beaded and banded by master karigars.", { weight: 26 }],
  ["Rosé Pearl Station Bracelet", "bangles", "18K White Gold", "Pearl", 24800, [36], ["Everyday", "Gifting"], "Pearls in pink and white on a whisper chain.", { weight: 3.2 }],
  ["Moti Gold-Edge Kada", "bangles", "22K Yellow Gold", "Mother-of-pearl", 46500, [11], ["Festive", "Gifting"], "Mother-of-pearl framed in beaded gold.", { weight: 15 }],
  ["Papillon Diamond Bracelet", "bangles", "18K White Gold", "Natural Diamond", 195000, [63], ["Party", "Wedding"], "A flexible diamond cuff with a butterfly motif.", { badge: "Limited", weight: 16.5 }],

  // ───────── BRIDAL
  ["Rajwada Temple Bridal Set", "bridal", "22K Yellow Gold", "Ruby & Emerald", 340000, [3, 2], ["Wedding"], "Temple-style pendant and jhumkas in ruby and pearl.", { badge: "Heirloom", bestseller: true, weight: 48 }],
  ["Maharani Kundan Choker Set", "bridal", "22K Yellow Gold", "Kundan & Pearl", 585000, [59, 35], ["Wedding"], "A regal choker, rani haar, nath and maang tikka.", { badge: "Limited", weight: 96 }],
  ["Polki Emerald Bridal Necklace", "bridal", "22K Yellow Gold", "Polki & Emerald", 428000, [40], ["Wedding"], "Polki drops and emerald beads in a layered bridal necklace.", { bestseller: true, weight: 72 }],
  ["Gulab Pearl Rani Haar", "bridal", "22K Yellow Gold", "Pearl & Gemstone", 298000, [8], ["Wedding", "Festive"], "A long rani haar of pearl strands and gold pendants.", { weight: 54 }],
  ["Kundan Bridal Nath", "bridal", "22K Yellow Gold", "Kundan & Pearl", 64000, [16], ["Wedding"], "A scalloped nath with emerald beads and pearls.", { weight: 9.5 }],
  ["Pearl & Diamond Tiara", "bridal", "18K White Gold", "Pearl & Diamond", 145000, [38], ["Wedding"], "A fleur-de-lis crown, set with pearls and diamonds.", { badge: "New", isNew: true, weight: 28 }],
  ["Nakshi Silver Maang Tikka", "bridal", "925 Sterling Silver", "Opal", 12800, [57], ["Festive", "Wedding"], "A tribal-inspired tikka with swinging silver spears.", { weight: 18 }],
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function describe(s: Seed): string {
  const [name, category, metal, stone, , , occasions, tagline] = s;
  const stoneLine =
    stone === "None"
      ? "Its beauty lies entirely in the metalwork — every surface hand-finished."
      : `Set with ${stone.toLowerCase()}, each stone is individually hand-selected and graded by our in-house gemmologists.`;
  return `${tagline} Crafted in ${metal} by our master artisans, the ${name} is designed for ${occasions
    .join(" and ")
    .toLowerCase()} moments and made to be worn for decades. ${stoneLine} Every ${category === "bridal" ? "bridal piece" : category.replace(/s$/, "")} is hallmarked, certified and delivered in our signature emerald keepsake box.`;
}

export const products: Product[] = seeds.map((s, i) => {
  const [name, category, metal, stone, price, imgs, occasions, tagline, opts = {}] = s;
  const sizes =
    category === "rings" ? RING_SIZES : category === "bangles" && /Bangle|Kada/.test(name) ? BANGLE_SIZES : undefined;
  return {
    id: `AU${String(i + 101)}`,
    slug: slugify(name),
    name,
    category,
    metal,
    stone,
    price,
    compareAt: opts.compareAt,
    images: imgs.map((n) => `/img/${n}.webp`),
    occasions,
    tagline,
    description: describe(s),
    badge: opts.badge,
    rating: Math.round((4.5 + ((i * 37) % 6) / 12) * 10) / 10,
    reviews: 12 + ((i * 53) % 190),
    weight: opts.weight ?? 5,
    sizes,
    bestseller: opts.bestseller,
    isNew: opts.isNew,
    details: [
      ["Metal", metal],
      ["Gemstone", stone === "None" ? "—" : stone],
      ["Approx. weight", `${opts.weight ?? 5} g`],
      ["Certification", metal.includes("925") ? "925 Hallmarked" : "BIS Hallmarked · IGI/GIA on diamonds"],
      ["Collection", category === "bridal" ? "Bridal Atelier" : "Signature"],
      ["Style code", `AU${i + 101}`],
    ],
  };
});

export const COLLECTIONS: {
  slug: string;
  title: string;
  blurb: string;
  image: string;
  pos: string;
  thumb: string; // category thumbnail (jewellery photo) shown on the home page
  thumbPos: string;
  t: number; // position in the hero video (seconds) this room opens at
  match: (p: Product) => boolean;
}[] = [
  { slug: "all", title: "All Jewellery", blurb: "The complete Savara collection.", image: "/img/58.webp", pos: "50% 50%", thumb: "/img/58.webp", thumbPos: "50% 50%", t: 1.0, match: () => true },
  { slug: "new-arrivals", title: "New Arrivals", blurb: "Freshly finished at our atelier this season.", image: "/img/53.webp", pos: "50% 50%", thumb: "/img/53.webp", thumbPos: "50% 50%", t: 4.5, match: (p) => !!p.isNew },
  { slug: "bestsellers", title: "Bestsellers", blurb: "The pieces our clients return to, again and again.", image: "/img/50.webp", pos: "50% 50%", thumb: "/img/50.webp", thumbPos: "50% 50%", t: 9.0, match: (p) => !!p.bestseller },
  { slug: "rings", title: "Rings", blurb: "From proposal solitaires to everyday stackers.", image: "/img/64.webp", pos: "50% 50%", thumb: "/img/64.webp", thumbPos: "50% 50%", t: 0.3, match: (p) => p.category === "rings" },
  { slug: "earrings", title: "Earrings", blurb: "Studs, drops and jhumkas with presence.", image: "/img/46.webp", pos: "55% 40%", thumb: "/img/46.webp", thumbPos: "55% 40%", t: 2.4, match: (p) => p.category === "earrings" },
  { slug: "necklaces", title: "Necklaces", blurb: "Collars, chains and heirloom haars.", image: "/img/45.webp", pos: "45% 55%", thumb: "/img/45.webp", thumbPos: "45% 55%", t: 3.8, match: (p) => p.category === "necklaces" },
  { slug: "pendants", title: "Pendants", blurb: "Quiet statements, worn close.", image: "/img/56.webp", pos: "45% 50%", thumb: "/img/56.webp", thumbPos: "45% 50%", t: 5.2, match: (p) => p.category === "pendants" },
  { slug: "bangles", title: "Bangles & Bracelets", blurb: "Kadas, kangans and diamond cuffs.", image: "/img/65.webp", pos: "30% 50%", thumb: "/img/65.webp", thumbPos: "30% 50%", t: 6.6, match: (p) => p.category === "bangles" },
  { slug: "bridal", title: "Bridal Atelier", blurb: "Heirloom sets for the most important day.", image: "/img/bridal-necklace.webp", pos: "50% 50%", thumb: "/img/bridal-necklace.webp", thumbPos: "50% 50%", t: 8.0, match: (p) => p.category === "bridal" },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const ROOMS = ["bridal", "rings", "earrings", "necklaces", "pendants", "bangles"];
export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
export const productsFor = (slug: string) => {
  const c = getCollection(slug);
  return c ? products.filter(c.match) : [];
};
export const related = (p: Product, n = 4) => {
  const same = products.filter((x) => x.id !== p.id && x.category === p.category);
  const rest = products.filter((x) => x.id !== p.id && x.category !== p.category && x.stone === p.stone);
  return [...same, ...rest].slice(0, n);
};
export const getByIds = (ids: string[]) =>
  ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];

export function search(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const words = t.split(/\s+/);
  return products.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.metal} ${p.stone} ${p.occasions.join(" ")} ${p.tagline}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

/** Itemised price breakup for the product page (illustrative mock). */
export function priceBreakup(p: Product) {
  const gst = Math.round(p.price * 0.03);
  const base = p.price - gst;
  const making = Math.round(base * 0.14);
  const stoneVal = p.stone === "None" ? 0 : Math.round(base * 0.28);
  const metal = base - making - stoneVal;
  return { metal, stone: stoneVal, making, gst, total: p.price };
}
