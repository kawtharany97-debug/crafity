import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

export default function LabelPage({ allProducts, lang, setLang }) {
  const { labelName } = useParams();
  const labelTitles = {
    English: {
      "best-seller": "Best Sellers",
      "new-arrival": "New Arrivals",
    },
    Arabic: {
      "best-seller": "الأكثر مبيعًا",
      "new-arrival": "وصل حديثًا",
    },
  };

const formattedLabel = labelTitles[lang][labelName] || labelName;

const pageTitle = `${formattedLabel} | Crafity Lebanon`;

const pageDescription =
  lang === "Arabic"
    ? `تصفح ${formattedLabel} من كرافيتي لبنان، منتجات يدوية وهدايا مصنوعة بحب.`
    : `Browse ${formattedLabel} products from Crafity Lebanon. Handmade gifts, crafts and supplies.`;
  const [showBackToTop, setShowBackToTop] = useState(false);

  const filteredProducts = allProducts.filter(
    (item) =>
      item.label?.trim().toLowerCase() ===
      labelName?.trim().toLowerCase()
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
  }, [labelName]);

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
      href={`https://crafity-lb.com/label/${labelName}`}
    />
  </Helmet>

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
  
  {/* Existing page starts here */}
    <div className="min-h-screen bg-[#f7f0eb] text-[#4b3d39] overflow-x-hidden">
      <section className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="mt-8 mb-8">
          <p className="text-xs font-bold text-[#d9779b] uppercase tracking-wider mb-3">
            All
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#4b3d39]">
            {formattedLabel}
          </h1>
        </div>

        <ProductGrid items={filteredProducts} lang={lang} />
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