import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

export default function CategoryPage({ allProducts }) {
  const { categoryName } = useParams();
  const formattedCategory = categoryName
  ?.replace(/-/g, " ")
  .replace(/\b\w/g, (char) => char.toUpperCase());

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
        <Link
          to="/"
          className="inline-flex px-5 py-2 text-xs font-semibold tracking-wide rounded-full border border-orange-100 text-stone-600 bg-white hover:bg-orange-50/50 transition"
        >
          ← Back to Home
        </Link>

        <div className="mt-8 mb-8">
          <p className="text-xs font-bold text-[#d9779b] uppercase tracking-wider mb-3">
            All
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#4b3d39]">
            {formattedCategory}
          </h1>
        </div>

        <ProductGrid items={filteredProducts} lang="English" />
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