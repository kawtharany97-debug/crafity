import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

export default function CategoryPage({
  allProducts,
  lang,
  setLang,
}) {

  const { categoryName } = useParams();
  
  const categoryNames = {
  English: {
    macrame: "Macrame",
    resin: "Resin Art",
    candles: "Candles",
    soap: "Soap",
    crochet: "Crochet",
    gypsum: "Gypsum",
    beads: "Beads",
    giftbox: "Giftbox",
    supplies: "Tools & Supplies",
  },

  Arabic: {
    macrame: "المكرامية",
    resin: "أعمال الريزن",
    candles: "الشموع",
    soap: "الصابون الطبيعي",
    crochet: "الكروشيه",
    gypsum: "الجبس",
    beads: "الخرز",
    giftbox: "الهدايا",
    supplies: "الأدوات والمستلزمات",
  },
};

const formattedCategory =
  categoryNames[lang][categoryName] || categoryName;  

const categoryDescriptions = {
  macrame:
    "Crafity offers handmade macrame in Lebanon, including wall hangings, plant hangers, lamps, shelves, keychains and elegant home decor pieces. Each macrame item is crafted with care, making it perfect for handmade gifts, boho decoration and warm artistic spaces.",
  resin:
    "Crafity offers handmade resin art in Lebanon, including decorative trays, coasters, accessories, home decor pieces and personalized resin gifts. Each piece is crafted with care, making it perfect for birthdays, souvenirs, events and elegant handmade gifts.",
  candles:
    "Crafity offers handmade candles in Lebanon for gifts, home decoration, events and cozy spaces. Discover elegant candle designs made with love, perfect for birthdays, souvenirs, romantic gifts and artistic handmade decor.",
  soap:
    "Crafity offers handmade soap in Lebanon with artistic shapes, beautiful colors and elegant gift-ready designs. These handmade soap pieces are perfect for souvenirs, personal gifts, events and decorative bathroom displays.",
  crochet:
    "Crafity offers handmade crochet in Lebanon, including accessories, bags, baby items, decorative pieces and creative gifts. Each crochet product is made with soft materials and careful details for a warm handmade touch.",
  gypsum:
    "Crafity offers handmade gypsum and concrete-style art in Lebanon, including trays, home decor pieces, souvenirs and elegant decorative items. These handmade designs are perfect for gifts, events and modern artistic spaces.",
  beads:
    "Crafity offers beads and handmade beaded accessories in Lebanon for bags, jewelry, decorations and creative DIY projects. Discover elegant beaded handmade items and craft materials designed for unique gifts and artistic creations.",
  giftbox:
    "Crafity offers handmade gift boxes and souvenirs in Lebanon for birthdays, weddings, baby showers, events and special occasions. Discover elegant gift ideas, personalized souvenirs and handmade boxes crafted with love.",
  supplies:
    "Crafity offers craft supplies in Lebanon for macrame, resin, crochet, beads, candles, gypsum and DIY handmade projects. Find essential materials and creative supplies for artists, crafters and handmade business owners.",
};

const categorySeo = {
  macrame: {
    title: "Macrame Lebanon | Handmade Macrame Decor & Gifts | Crafity",
    description:
      "Shop handmade macrame in Lebanon from Crafity. Discover wall hangings, plant hangers, lamps, shelves, keychains and elegant handmade decor.",
  },
  resin: {
    title: "Resin Art Lebanon | Handmade Resin Gifts, Trays & Decor | Crafity",
    description:
      "Shop handmade resin art in Lebanon from Crafity. Discover resin trays, coasters, decor pieces, accessories and personalized handmade gifts.",
  },
  candles: {
    title: "Handmade Candles Lebanon | Elegant Candle Gifts | Crafity",
    description:
      "Shop handmade candles in Lebanon from Crafity. Discover elegant candle gifts, home decor candles and artistic candle designs made with love.",
  },
  soap: {
    title: "Handmade Soap Lebanon | Artistic Soap Gifts | Crafity",
    description:
      "Shop handmade soap in Lebanon from Crafity. Discover artistic soap designs, souvenirs, event gifts and elegant handmade soap pieces.",
  },
  crochet: {
    title: "Crochet Lebanon | Handmade Crochet Gifts & Accessories | Crafity",
    description:
      "Shop handmade crochet in Lebanon from Crafity. Discover crochet bags, accessories, baby items, decor pieces and creative handmade gifts.",
  },
  gypsum: {
    title: "Gypsum Art Lebanon | Handmade Decor & Souvenirs | Crafity",
    description:
      "Shop handmade gypsum and concrete-style art in Lebanon from Crafity. Discover trays, decor pieces, souvenirs and elegant handmade gifts.",
  },
  beads: {
    title: "Beads Lebanon | Handmade Beaded Accessories & Supplies | Crafity",
    description:
      "Shop beads and handmade beaded accessories in Lebanon from Crafity. Discover beaded bags, jewelry materials, decorations and craft supplies.",
  },
  giftbox: {
    title: "Gift Box Lebanon | Handmade Gift Boxes & Souvenirs | Crafity",
    description:
      "Shop handmade gift boxes and souvenirs in Lebanon from Crafity. Discover elegant gifts for birthdays, weddings, baby showers and events.",
  },
  supplies: {
    title: "Craft Supplies Lebanon | Handmade Materials & Tools | Crafity",
    description:
      "Shop craft supplies in Lebanon from Crafity. Find materials for macrame, resin, crochet, beads, candles, gypsum and DIY handmade projects.",
  },
};

const categoryDescription =
  categoryDescriptions[categoryName] ||
  `Shop handmade ${formattedCategory} products from Crafity Lebanon.`;

const pageTitle =
  categorySeo[categoryName]?.title || `${formattedCategory} | Crafity Lebanon`;

const pageDescription =
  categorySeo[categoryName]?.description ||
  `Shop handmade ${formattedCategory} products from Crafity Lebanon. Discover premium handcrafted gifts and craft supplies.`;

const categoryDescription =
  categoryDescriptions[categoryName] ||
  `Shop handmade ${formattedCategory} products from Crafity Lebanon.`;

  const categorySeo = {
  resin: {
    title: "Resin Art Lebanon | Handmade Resin Gifts, Trays & Decor | Crafity",
    description:
      "Shop handmade resin art in Lebanon from Crafity. Discover resin trays, coasters, decor pieces, accessories and personalized handmade gifts.",
  },
  macrame: {
    title: "Macrame Lebanon | Handmade Macrame Decor & Gifts | Crafity",
    description:
      "Shop handmade macrame in Lebanon from Crafity. Discover wall hangings, plant hangers, lamps, shelves, keychains and elegant handmade decor.",
  },
  candles: {
    title: "Handmade Candles Lebanon | Elegant Candle Gifts | Crafity",
    description:
      "Shop handmade candles in Lebanon from Crafity. Discover elegant candle gifts, home decor candles and artistic candle designs made with love.",
  },
};

const pageTitle =
  categorySeo[categoryName]?.title || `${formattedCategory} | Crafity Lebanon`;

const pageDescription =
  categorySeo[categoryName]?.description ||
  `Shop handmade ${formattedCategory} products from Crafity Lebanon. Discover premium handcrafted gifts and craft supplies.`;

  const [showBackToTop, setShowBackToTop] = useState(false);

  const filteredProducts = allProducts.filter(
    (item) =>
      item.category?.trim().toLowerCase() ===
      categoryName?.trim().toLowerCase()
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [categoryName]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
  <Helmet>
    <title>{pageTitle}</title>

    <meta
      name="description"
      content={pageDescription}
    />

    <link
      rel="canonical"
      href={`https://crafity-lb.com/category/${categoryName}`}
    />
  </Helmet>

  {/* Existing page starts here */}
    <div className="min-h-screen bg-[#f7f0eb] text-[#4b3d39] overflow-x-hidden">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

  <Link
    to="/"
    className="inline-flex px-5 py-2 text-xs font-semibold tracking-wide rounded-full border border-orange-100 text-stone-600 bg-white hover:bg-orange-50/50 transition"
  >
    {lang === "Arabic" ? "← الرئيسية" : "← Back to Home"}
  </Link>

  <select
    value={lang}
    onChange={(e) => setLang(e.target.value)}
    className="px-4 py-2 rounded-full border border-orange-100 bg-white"
  >
    <option value="English">English</option>
    <option value="Arabic">العربية</option>
  </select>

</div>
        <div className="mt-8 mb-8">
  <p className="text-xs font-bold text-[#d9779b] uppercase tracking-wider mb-3">
    All
  </p>

  <h1 className="text-3xl font-semibold tracking-tight text-[#4b3d39]">
    {formattedCategory}
  </h1>
</div>

<div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 border-b border-orange-100">
  {[
    "macrame",
    "resin",
    "candles",
    "soap",
    "crochet",
    "gypsum",
    "beads",
    "giftbox",
    "supplies",
  ].map((cat) => (
    <Link
      key={cat}
      to={`/category/${cat}`}
      className={`px-5 py-2 rounded-full text-sm whitespace-nowrap transition ${
        categoryName === cat
          ? "bg-[#d9779b] text-white"
          : "bg-white border border-orange-100 text-[#4b3d39] hover:bg-orange-50"
      }`}
    >
      {categoryNames[lang][cat]}
    </Link>
  ))}
</div>

<p className="max-w-3xl text-sm leading-7 text-stone-600 mb-8">
  {categoryDescription}
</p>

<ProductGrid
  items={filteredProducts}
  lang={lang}
/>
      </section>

      {showBackToTop && (
        <div className="fixed bottom-8 right-8 z-50">
  <button
    onClick={scrollToTop}
    className="w-16 h-16 rounded-full bg-[#fff9f6] border border-[#d9779b]/30 shadow-lg flex items-center justify-center hover:scale-105 transition"
  >
    <span className="text-[#d9779b] text-2xl">↑</span>
  </button>
</div>
      )}
    </div>
    </>
  );
}