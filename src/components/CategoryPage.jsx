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
    "Discover handmade macrame products in Lebanon, including wall hangings, lamps, shelves, keychains, plant hangers, and home decor pieces crafted with care by Crafity.",
  resin:
    "Shop resin art in Lebanon, including handmade trays, coasters, accessories, decorations, and unique personalized gifts designed with artistic details.",
  candles:
    "Explore handmade candles in Lebanon made for gifts, home decoration, events, and cozy spaces. Crafity offers elegant candle designs crafted with love.",
  soap:
    "Find handmade soap in Lebanon with beautiful artistic designs, perfect for gifts, souvenirs, and personal use.",
  crochet:
    "Browse crochet gifts in Lebanon, including handmade accessories, decorations, baby items, and creative pieces made with soft materials.",
  gypsum:
    "Shop handmade gypsum and concrete art in Lebanon, including home decor, trays, souvenirs, and elegant decorative pieces.",
  beads:
    "Discover beads and handmade accessories in Lebanon for jewelry making, crafts, decorations, and creative DIY projects.",
  giftbox:
    "Explore handmade gift boxes and souvenirs in Lebanon, perfect for birthdays, events, weddings, baby showers, and special occasions.",
  supplies:
    "Shop craft supplies in Lebanon, including materials for macrame, resin, crochet, beads, candles, gypsum, and DIY handmade projects.",
};

const categoryDescription =
  categoryDescriptions[categoryName] ||
  `Shop handmade ${formattedCategory} products from Crafity Lebanon.`;

  const pageTitle = `${formattedCategory} | Crafity Lebanon`;

  const pageDescription = `Shop handmade ${formattedCategory} products from Crafity Lebanon. Discover premium handcrafted gifts and craft supplies.`;

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
      href={`https://www.crafity-lb.com/category/${categoryName}`}
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 z-50 flex justify-end">
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