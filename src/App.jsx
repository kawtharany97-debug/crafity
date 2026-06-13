import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";

const bucketUrl = "https://difogkabffvfdmwyykcc.supabase.co/storage/v1/object/public/products/";

export default function App() {
  const [lang, setLang] = useState("English");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [macrameProducts, setMacrameProducts] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [heroSliderIndex, setHeroSliderIndex] = useState(0);
  const [sliderDirection, setSliderDirection] = useState(1);

  const toggleDetails = (itemId) => {
    setExpandedDetails(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // 1. Unified state for all products
const [allProducts, setAllProducts] = useState([]);

// 3. Logic to determine what to show
const isSupabaseCategory = (catName) => {
  // Map your display names to database category keys
  const map = {
    "Macrame": "macrame", "المكرامية": "macrame",
    "Beads": "beads", "خرز": "beads",
    "Resin Art": "resin", "أعمال الريزن": "resin",
    "Candles": "candles", "شمع": "candles",
    "Crochet Art": "crochet", "كروشيه": "crochet",
    "Giftbox": "giftbox", "حزمة هدايا": "giftbox",
    "Gypsum Art": "gypsum", "كونكريت": "gypsum",
    "Soap Art": "soap", "صابون": "soap",
    "Supplies": "supplies", "مواد أوّليّة": "supplies",
    };
  return map[catName];
};

const categoryKey = isSupabaseCategory(selectedCategory);
const displayedItems = categoryKey 
  ? allProducts.filter(item => item.category === categoryKey)
  : currentCategoryBlock?.items || [];

  // Categories data remains unchanged...
  const [categoriesData, setCategoriesData] = useState({
  English: [
      { categoryName: "Macrame", icon: "/cat-macrame.jpg"}, 
      { categoryName: "Resin Art", icon: "/cat-resin.jpg"},
      { categoryName: "Candles", icon: "/cat-candles.jpg"},
      { categoryName: "Handmade Soap", icon: "/cat-soap.jpg"},
      { categoryName: "Tools & Supplies", icon: "/cat-supplies.jpg"}, 
      { categoryName: "Giftbox", icon: "/cat-giftbox.jpg"}, 
      { categoryName: "Crochet", icon: "/cat-crochet.jpg"},
      { categoryName: "Gypsum", icon: "/cat-gypsum.jpg"}, 
      { categoryName: "Beads", icon: "/cat-beads.jpg"}, 
  ], 
  Arabic: [
      { categoryName: "المكرامية", icon: "/cat-macrame.jpg"}, 
      { categoryName: "أعمال الريزن", icon: "/cat-resin.jpg"},
      { categoryName: "الشموع", icon: "/cat-candles.jpg"},
      { categoryName: "الصابون الطبيعي", icon: "/cat-soap.jpg"}, 
      { categoryName: "الأدوات والمستلزمات", icon: "/cat-supplies.jpg"}, 
      { categoryName: "الهدايا والتذكارات", icon: "/cat-giftbox.jpg"}, 
      { categoryName: "الكروشيه", icon: "/cat-crochet.jpg"},
      { categoryName: "كونكريت", icon: "/cat-gypsum.jpg"}, 
      { categoryName: "خرز", icon: "/cat-beads.jpg"},
    ]
  });
   
  // Unified Premium Slider Source Dataset
  const showcaseProducts = [
    { 
      id: "sc-1", 
      badge: "BEST SELLER 🔥", 
      badgeAr: "الأكثر مبيعاً 🔥",
      name: "Boho Macrame Mirror", 
      nameAr: "مرآة مكرامية بوهيمية",
      price: "20,00 $", 
      image: "macrame/macrame1.jpg",
      bgTheme: "from-[#eae4e9] via-[#fffbfd] to-[#dfd7de]",
      textColor: "text-[#8e7c8a]",
      description: "Beautifully woven boho wall mirror with complex geometric macrame fringes."
    },
    { 
      id: "sc-2", 
      badge: "NEW ARRIVAL ✨", 
      badgeAr: "وصلنا حديثاً ✨",
      name: "Ocean Resin Coasters", 
      nameAr: "طقم قواعد أكواب البحر",
      price: "32,00 $", 
      image: "resin/resin1.jpg",
      bgTheme: "from-[#e0f2f1] via-[#ffffff] to-[#b2dfdb]",
      textColor: "text-[#00796b]",
      description: "Glossy epoxy resin coasters capturing a multi-tonal marine shoreline look."
    },
    { 
      id: "sc-3", 
      badge: "HOT ITEM ⚡", 
      badgeAr: "مميز للغاية ⚡",
      name: "Scented Soy Candle", 
      nameAr: "شمعة الصويا المعطرة",
      price: "18,00 $", 
      image: "candles/candles1.jpg",
      bgTheme: "from-[#fdf0ed] via-[#fffdfd] to-[#f8d7da]",
      textColor: "text-[#b0525b]",
      description: "Eco-friendly natural wax poured with rich therapeutic woodsy oil scents."
    },
    { 
      id: "sc-4", 
      badge: "TRENDING NOW 💖", 
      badgeAr: "رائج الآن 💖",
      name: "Macrame Shoulder Bag", 
      nameAr: "حقيبة كتف مكرامية أنيقة",
      price: "18,00 $", 
      image: "macrame/macrame4.jpg",
      bgTheme: "from-[#fcefe9] via-[#ffffff] to-[#f3dcd0]",
      textColor: "text-[#c27854]",
      description: "Sturdy, lightweight crossbody bag crafted from durable twisted cotton fibers."
    }
  ];

  // Automatic slide rotation loop
  useEffect(() => {
  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.error("Error loading products:", error);
    else setMacrameProducts(data || []);
  }
  fetchProducts();
  }, []);
  
  const changeSlide = (way) => {
    setSliderDirection(way);
    if (way === 1) {
      setHeroSliderIndex((prev) => (prev + 1) % showcaseProducts.length);
    } else {
      setHeroSliderIndex((prev) => (prev - 1 + showcaseProducts.length) % showcaseProducts.length);
    }
  };

  const translations = {
    English: {
      dir: "ltr",
      logo: "Crafity",
      navbarSlogan: "Crafity made with love in very artistic modern powerfull look", 
      heroSlogan: "MADE WITH LOVE",
      searchPlaceholder: "Search products...",
      heroBadge: "✨ Handmade Artistic Store",
      heroTitleLine1: "Elegant Handmade",
      heroTitleLine2: "Creations & Gifts",
      heroDesc: "Handmade gifts crafted with elegance, warmth, and creativity.",
      btnShop: "Shop Collection",
      catTitle: "Shop by Category",
      backBtn: "← Back to Categories",
      allFilter: "All",
      addToCart: "Add To Cart",
      quickView: "Quick view",
      detailsView: "Details",
      inStock: "In stock",
      soldOut: "Sold out",
      uploadPhoto: "Change Photo 📷",
      inputNamePlaceholder: "Enter item name...",
      inputPricePlaceholder: "Price...",
      custNotification: "✨ Customization Available upon request via WhatsApp",
      footerDesc: "Handmade artistic creations designed with elegance and love.",
      quickLinks: "Quick Links",
      linkHome: "Home",
      linkCategories: "Categories",
      contactChannels: "Contact Us",
      contactDesc: "Connect with us on our official social channels:",
      copyright: "© 2026 Crafity — Made With Love",
      orderWhatsapp: "Order via WhatsApp 💬",
      close: "Close"
    },
    Arabic: {
      dir: "rtl",
      logo: "كرافيتي",
      navbarSlogan: "كرافيتي صُنعت بكل حب بمظهر عصري، فني وقوي للغاية",
      heroSlogan: "صُنعت بكل حب",
      searchPlaceholder: "اببحث عن المنتجات...",
      heroBadge: "✨ متجر أعمال فنية مصنوعة يدوياً",
      heroTitleLine1: "إبداعات وهدايا",
      heroTitleLine2: "يدوية أنيقة",
      heroDesc: "هدايا مصنوعة يدويًا بدقة، دفء، ولمسات إبداعية ساحرة.",
      btnShop: "تسوّق المجموعة",
      catTitle: "تسوق حسب الفئة",
      backBtn: "← العودة إلى الأقسام",
      allFilter: "الكل",
      addToCart: "أضف إلى السلة",
      quickView: "عرض سريع",
      detailsView: "التفاصيل",
      inStock: "متوفر",
      soldOut: "نفذت الكمية",
      uploadPhoto: "تغيير الصورة 📷",
      inputNamePlaceholder: "أدخل اسم المنتج...",
      inputPricePlaceholder: "السعر...",
      custNotification: "✨ التخصيص متوفر عند الطلب عبر واتساب",
      footerDesc: "قطع فنية مصنوعة يدوياً مصممة بكل حب ورقي لتناسب ذوقك.",
      quickLinks: "روابط سريعة",
      linkHome: "الرئيسية",
      linkCategories: "الأقسام",
      contactChannels: "تواصل معنا",
      contactDesc: "تواصل معنا مباشرة عبر قنواتنا الرسمية:",
      copyright: "© ٢٠٢٦ كرافيتي — صنع بكل حب",
      orderWhatsapp: "اطلب عبر واتساب 💬",
      close: "إغلاق"
    }
  };

  const t = translations[lang];

  // Fashion look slider animations mirroring the requested split composition
  const backgroundVariants = {
    enter: (dir) => ({ opacity: 0 }),
    center: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.6 } }
  };

  const mainFrameVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
      scale: 1.05
    }),
    center: {
      x: "0%",
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      transition: { duration: 0.85, ease: [0.33, 1, 0.68, 1] }
    },
    exit: (dir) => ({
      x: dir > 0 ? "-30%" : "30%",
      clipPath: dir > 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
      opacity: 0.6,
      transition: { duration: 0.75, ease: [0.32, 0, 0.67, 0] }
    })
  };

  const textPaneVariants = {
    enter: { opacity: 0, y: 15 },
    center: { opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.5 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  const renderIcon = (iconSource, altText) => {
    if (iconSource.startsWith("/")) {
      return (
        <img 
          src={iconSource} 
          alt={altText} 
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerText = "✨";
          }}
        />
      );
    }
    return iconSource;
  };

  const sendOrderToWhatsApp = (item) => {
    const phoneNumber = "9613183656";
    let message = "";
    if (lang === "Arabic") {
      message = `مرحباً كرافيتي! أود طلب المنتج التالي:\n\n` +
                `📦 *المنتج:* ${item.nameAr || item.name}\n` +
                `💰 *السعر:* ${item.price}\n` +
                `🔗 *الحالة:* طلب مباشرة من واجهة العرض الرئيسية المتحركة`;
    } else {
      message = `Hello Crafity! I would like to order this item:\n\n` +
                `📦 *Product:* ${item.name}\n` +
                `💰 *Price:* ${item.price}\n` +
                `🔗 *Context:* Requested from interactive premium dynamic hero slider`;
    }
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const currentCategoryBlock = categoriesData[lang].find(cat => cat.categoryName === selectedCategory);
  
  // Mapping display names to database category keys
const categoryMap = {
  "Macrame": "macrame", "المكرامية": "macrame",
  "Resin Art": "resin", "أعمال الريزن": "resin",
  "Candles": "candles", "الشموع": "candles",
  "Handmade Soap": "soap", "الصابون الطبيعي": "soap",
  "Crochet": "crochet", "الكروشيه": "crochet",
  "Gypsum": "gypsum", "كونكريت": "gypsum",
  "Beads": "beads", "خرز": "beads",
  "Giftbox": "giftbox", "حزمة الهدايا": "giftbox",
  "Supplies": "supplies", "مواد أوّليّة": "supplies"
};

// Filter the products from Supabase
const dbCategoryKey = categoryMap[selectedCategory];
const displayedItems = selectedCategory 
  ? allProducts.filter(item => item.category === dbKey) 
  : [];

  const activeSlide = showcaseProducts[heroSliderIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      dir={t.dir}
      className={`min-h-screen bg-[#f7f0eb] text-[#4b3d39] overflow-x-hidden ${t.dir === 'rtl' ? 'font-sans text-right' : 'font-sans text-left'}`}
    >
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-center md:justify-start min-w-[180px]">
            <img 
              src="/logo.png" 
              alt={t.logo} 
              className="h-24 md:h-28 w-auto object-contain cursor-pointer transition-transform duration-200 active:scale-95"
              onClick={() => setSelectedCategory(null)}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<div class="text-3xl font-light tracking-wide text-[#d9779b] py-4">${t.logo}</div>`;
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full md:w-72 px-4 py-2 rounded-full border border-orange-100 bg-[#fffaf9] outline-none focus:ring-2 focus:ring-orange-200/50"
            />
            <select 
              value={lang} 
              onChange={(e) => { setLang(e.target.value); setSelectedCategory(null); }}
              className="px-4 py-2 rounded-full border border-orange-100 bg-white text-[#4b3d39]"
            >
              <option value="English">English</option>
              <option value="Arabic">العربية</option>
            </select>
          </div>
        </div>
      </header>

      {/* Premium Fashion Split Slider Engine */}
      <AnimatePresence mode="wait">
        {!selectedCategory && (
          <section className="relative w-full overflow-hidden min-h-[560px] lg:min-h-[640px] flex items-center transition-colors duration-700">
            <AnimatePresence initial={false} custom={sliderDirection}>
              <motion.div
                key={`bg-${heroSliderIndex}`}
                custom={sliderDirection}
                variants={backgroundVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={`absolute inset-0 bg-gradient-to-br ${activeSlide.bgTheme}`}
              />
            </AnimatePresence>

            <div className="relative max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
              <div className="lg:col-span-5 space-y-6 lg:pr-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${heroSliderIndex}`}
                    variants={textPaneVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-4"
                  >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white/50 text-[#d9779b] text-xs font-bold tracking-widest uppercase">
                      {lang === "Arabic" ? activeSlide.badgeAr : activeSlide.badge}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] text-[#4b3d39] tracking-tight">
                      {lang === "Arabic" ? activeSlide.nameAr : activeSlide.name}
                    </h2>
                    <p className="text-2xl font-serif italic text-[#d9779b] font-medium">
                      {activeSlide.price}
                    </p>
                    <p className="text-sm md:text-base text-stone-600/90 leading-relaxed max-w-md">
                      {activeSlide.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => sendOrderToWhatsApp(activeSlide)}
                    className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition shadow-[0_10px_25px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t.orderWhatsapp}
                  </button>
                  <button
                    onClick={() => setQuickViewItem({
                      id: activeSlide.id,
                      name: lang === "Arabic" ? activeSlide.nameAr : activeSlide.name,
                      price: activeSlide.price,
                      image: activeSlide.image,
                      inStock: true,
                      description: activeSlide.description
                    })}
                    className="px-6 py-3.5 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/60 text-stone-700 font-medium text-sm transition hover:bg-white"
                  >
                    {t.quickView}
                  </button>
                </div>

                <div className="pt-6 flex items-center gap-3">
                  <button
                    onClick={() => changeSlide(-1)}
                    className="w-11 h-11 rounded-full bg-white/90 shadow-sm border border-stone-100 flex items-center justify-center text-stone-700 hover:bg-[#d9779b] hover:text-white transition active:scale-95"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => changeSlide(1)}
                    className="w-11 h-11 rounded-full bg-white/90 shadow-sm border border-stone-100 flex items-center justify-center text-stone-700 hover:bg-[#d9779b] hover:text-white transition active:scale-95"
                  >
                    →
                  </button>
                  <div className="ml-4 flex gap-1.5">
                    {showcaseProducts.map((_, idx) => (
                      <span 
                        key={idx}
                        onClick={() => {
                          setSliderDirection(idx > heroSliderIndex ? 1 : -1);
                          setHeroSliderIndex(idx);
                        }}
                        className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${idx === heroSliderIndex ? 'w-6 bg-[#d9779b]' : 'w-1.5 bg-stone-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center lg:justify-end relative h-[420px] lg:h-[500px] w-full">
                <div className="relative w-full max-w-[440px] h-full rounded-[36px] p-2 bg-white/30 backdrop-blur-md shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-white/40">
                  <div className="relative w-full h-full rounded-[28px] overflow-hidden group">
                    <AnimatePresence initial={false} custom={sliderDirection}>
                      <motion.div
                        key={`frame-${heroSliderIndex}`}
                        custom={sliderDirection}
                        variants={mainFrameVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full cursor-zoom-in"
                        onClick={() => setQuickViewItem({
                          id: activeSlide.id,
                          name: lang === "Arabic" ? activeSlide.nameAr : activeSlide.name,
                          price: activeSlide.price,
                          image: activeSlide.image,
                          inStock: true,
                          description: activeSlide.description
                        })}
                      >
                        <img 
                          src={activeSlide.image} 
                          alt={activeSlide.name} 
                          className="w-full h-full object-cover select-none transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-80" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </AnimatePresence>

      <section className="max-w-7xl mx-auto px-6 py-12 min-h-[500px]">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="grid-layout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#4b3d39]">{t.catTitle}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categoriesData[lang].map((cat) => (
                  <div 
                    key={cat.categoryName}
                    onClick={() => setSelectedCategory(cat.categoryName)}
                    className="group cursor-pointer flex flex-col items-center"
                  >
                    <div className="aspect-square w-full bg-[#fff9f6] rounded-2xl flex items-center justify-center border-2 border-stone-100 group-hover:border-[#d9779b] transition-all duration-300 shadow-sm relative overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-300">
                        {renderIcon(cat.icon, cat.categoryName)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details-layout"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setSelectedCategory(null)}
                className="px-5 py-2 text-xs font-semibold tracking-wide rounded-full border border-orange-100 text-stone-600 bg-white hover:bg-orange-50/50 transition"
              >
                {t.backBtn}
              </button>
              <div className="flex items-center gap-4 overflow-x-auto py-2 border-b border-orange-50">
                {categoriesData[lang].map((cat) => (
                  <button
                    key={cat.categoryName}
                    onClick={() => setSelectedCategory(cat.categoryName)}
                    className={`w-12 h-12 rounded-full border text-lg flex items-center justify-center transition-all flex-shrink-0 relative overflow-hidden bg-[#fff9f6] ${
                      selectedCategory === cat.categoryName 
                        ? 'border-[#d9779b] shadow-sm scale-95' 
                        : 'border-orange-100/70'
                    }`}
                    title={cat.categoryName}
                  >
                    {renderIcon(cat.icon, cat.categoryName)}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-[#d9779b] uppercase tracking-wider mb-4">{t.allFilter}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedItems.map((item, itemIndex) => {
                  const formattedPrice = item.price && item.price.includes('$') ? item.price : `${item.price || "0.00"} $`;
                  const isExpanded = !!expandedDetails[item.id];
                  return (
                    <div key={item.id} className="group bg-white rounded-2xl p-4 border border-orange-50/70 shadow-sm flex flex-col justify-between relative">
                      <div className="relative aspect-square w-full rounded-xl bg-[#fffaf9] overflow-hidden flex flex-col items-center justify-center border border-orange-50/30">
                        {item.image ? (
                          <img 
  src={`${bucketUrl}${item.image}`} 
  alt={item.name} 
  className="w-full h-full object-cover"
  onError={(e) => e.target.src = '/placeholder.png'} 
/>
                        ) : null}
                        <div className={`${item.image ? 'hidden' : 'flex'} absolute inset-0 text-center text-stone-300 flex-col items-center justify-center p-4`}>
                          <span className="text-2xl block mb-1">📦</span>
                          <span className="text-[9px] tracking-wider uppercase font-semibold text-stone-400">Preview</span>
                        </div>
                      </div>
                      <div className="pt-4 space-y-1">
                        <div className="text-sm font-bold text-[#4b3d39]">{formattedPrice}</div>
                        <div className="text-xs text-stone-500 font-medium">{item.name}</div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-2 bg-orange-50/30 rounded-xl p-2 border border-orange-100/50"
                          >
                            <p className="text-[11px] leading-relaxed text-stone-600 font-normal">
                              {item.description || (lang === "Arabic" ? "صنع يدويا بكل حب وعناية فائقة بالتفاصيل." : "Crafted delicately by hand with supreme attention to detail.")}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="pt-3">
                        <button 
                          onClick={() => sendOrderToWhatsApp(item)}
                          className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition"
                        >
                          {t.orderWhatsapp}
                        </button>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-2 border-t border-orange-50/50 text-[10px]">
                        <div className="flex items-center gap-2">
                          <span 
                            onClick={() => setQuickViewItem(item)}
                            className="text-stone-400 hover:text-[#d9779b] font-medium cursor-pointer uppercase tracking-wider"
                          >
                            {t.quickView}
                          </span>
                          <span className="text-stone-300">|</span>
                          <span 
                            onClick={() => toggleDetails(item.id)}
                            className={`font-medium cursor-pointer uppercase tracking-wider transition ${isExpanded ? 'text-[#d9779b]' : 'text-stone-400 hover:text-[#d9779b]'}`}
                          >
                            {t.detailsView}
                          </span>
                        </div>
                        <span className={`font-bold ${item.inStock ? 'text-emerald-600' : 'text-stone-400'}`}>
                          {item.inStock ? t.inStock : t.soldOut}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setQuickViewItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-orange-50 p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-square w-full rounded-2xl bg-stone-50 overflow-hidden relative border border-orange-50/40">
                {quickViewItem.image ? (
                  <img src={quickViewItem.image} alt={quickViewItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                    <span className="text-4xl mb-2">📦</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase">
                  {quickViewItem.inStock ? t.inStock : t.soldOut}
                </span>
                <h4 className="text-xl font-medium text-[#4b3d39]">{quickViewItem.name}</h4>
                <p className="text-lg font-bold text-[#d9779b]">{quickViewItem.price}</p>
                <p className="text-xs text-stone-500 pt-1 leading-relaxed">
                  {quickViewItem.description || (lang === "Arabic" ? "صنع يدويا بكل حب وعناية فائقة بالتفاصيل." : "Crafted delicately by hand with supreme attention to detail.")}
                </p>
              </div>
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    sendOrderToWhatsApp(quickViewItem);
                    setQuickViewItem(null);
                  }}
                  className="py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-md flex items-center justify-center gap-1 transition"
                >
                  {t.orderWhatsapp}
                </button>
                <button 
                  onClick={() => setQuickViewItem(null)}
                  className="py-3 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 font-medium text-xs transition"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-gradient-to-r from-orange-50/30 to-rose-50/20 py-10 border-t border-b border-orange-50/60 text-center px-6">
        <p className="text-sm md:text-base font-light tracking-wide text-stone-600">
          {t.custNotification}
        </p>
      </section>

      <footer className="bg-[#4b3d39] text-white py-16 px-6 text-center md:text-left">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h4 className="text-3xl font-light text-orange-50">{t.logo}</h4>
            <p className="mt-4 text-orange-100/70 text-sm">{t.footerDesc}</p>
          </div>
          <div>
            <h5 className="text-xl mb-4 text-orange-50">{t.quickLinks}</h5>
            <ul className="space-y-3 text-orange-100/70 text-sm">
              <li className="cursor-pointer hover:text-orange-200 transition" onClick={() => setSelectedCategory(null)}>{t.linkHome}</li>
              <li className="cursor-pointer hover:text-orange-200 transition">{t.linkCategories}</li>
            </ul>
          </div>
          <div>
            <h5 className="text-xl mb-4 text-orange-50">{t.contactChannels}</h5>
            <p className="text-sm text-orange-100/70 mb-4">{t.contactDesc}</p>
            <div className="flex items-center gap-6 justify-center md:justify-start">
              <a href="https://instagram.com/crafity.lb" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition duration-300" title="Instagram">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://www.pinterest.com/venerash447/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition duration-300" title="Pinterest">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#E60023"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.62 0 11.988-5.367 11.988-11.987C24.005 5.367 18.636 0 12.017 0z" /></svg>
              </a>
              <a href="https://tiktok.com/@crafity.lb" target="_blank" rel="noopener noreferrer" className="w-7 h-7 inline-flex items-center justify-center hover:scale-110 transition duration-300" title="TikTok">
                <svg className="w-full h-full" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#000000" /><path d="M24 11.23a4.87 4.87 0 0 1-3.18-1.2A5.15 5.15 0 0 1 19.34 7h-3.41v11.75c0 .64-.17 1.25-.49 1.77A3.28 3.28 0 0 1 14 21.64a3.17 3.17 0 0 1-3.66-.58 3.42 3.42 0 0 1-.9-2.31c0-1.07.49-2 1.26-2.6a3.12 3.12 0 0 1 1.93-.67c.36 0 .7.07 1 .21v-3.55a8.21 8.21 0 0 0-1-.06A6.67 6.67 0 0 0 8 18.75a6.76 6.76 0 0 0 6.67 6.75A6.6 6.6 0 0 0 21 20.33V13.8A8.34 8.34 0 0 0 24 15v-3.77z" fill="#FFFFFF" /></svg>
              </a>
              <a href="https://wa.me/9613183656" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition duration-300" title="WhatsApp">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-orange-100/10 mt-12 pt-6 text-center text-orange-100/50 text-sm">
          {t.copyright}
        </div>
      </footer>
    </motion.div>
  );
}