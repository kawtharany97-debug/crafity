import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useNavigate } from "react-router-dom";

const bucketUrl =
  'https://difogkabffvfdmwyykcc.supabase.co/storage/v1/object/public';

export default function Home({ allProducts, lang, setLang }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [macrameProducts, setMacrameProducts] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [heroSliderIndex, setHeroSliderIndex] = useState(0);
  const [sliderDirection, setSliderDirection] = useState(1);
  const [sliderStarted, setSliderStarted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const resultsRef = useRef(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedShowcaseLabel, setSelectedShowcaseLabel] = useState(null);

  const getProductImage = (item) => {
    const image = item?.image_url || item?.image || '';
    if (!image) return '';

    if (image.startsWith('http')) return image;

    return `${bucketUrl}${image.replace('/images/', '/')}`;
  };

  const getProductVideo = (item) => {
    const image = item?.video;
    if (!image) return '';

    if (image.startsWith('http')) return image;

    return `${bucketUrl}${image.replace('/images/', '/')}`;
  };

  const toggleDetails = (itemId) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // 1. Unified state for all products
  const [products, setAllProducts] = useState([]);

  // 3. Logic to determine what to show
  const isSupabaseCategory = (catName) => {
    // Map your display names to database category keys
    const map = {
      Macrame: 'macrame',
      المكرامية: 'macrame',
      Beads: 'beads',
      خرز: 'beads',
      'Resin Art': 'resin',
      'أعمال الريزن': 'resin',
      Candles: 'candles',
      شمع: 'candles',
      'Crochet': 'crochet',
      كروشيه: 'crochet',
      Giftbox: 'giftbox',
      'حزمة هدايا': 'giftbox',
      'Gypsum': 'gypsum',
      كونكريت: 'gypsum',
      'Soap': 'soap',
      صابون: 'soap',
      'Tools & Supplies': 'supplies',
      'مواد أوّليّة': 'supplies',
    };
    return map[catName];
  };

  // Categories data remains unchanged...
  const [categoriesData, setCategoriesData] = useState({
    English: [
      { categoryName: 'Macrame', icon: '/cat-macrame.webp' },
      { categoryName: 'Resin Art', icon: '/cat-resin.webp' },
      { categoryName: 'Candles', icon: '/cat-candles.webp' },
      { categoryName: 'Soap', icon: '/cat-soap.webp' },
      { categoryName: 'Crochet', icon: '/cat-crochet.webp' },
      { categoryName: 'Gypsum', icon: '/cat-gypsum.webp' },
      { categoryName: 'Beads', icon: '/cat-beads.webp' },
      { categoryName: 'Giftbox', icon: '/cat-giftbox.webp' },
      { categoryName: 'Tools & Supplies', icon: '/cat-supplies.webp' },
    ],
    Arabic: [
      { categoryName: 'المكرامية', icon: '/cat-macrame.webp' },
      { categoryName: 'أعمال الريزن', icon: '/cat-resin.webp' },
      { categoryName: 'الشموع', icon: '/cat-candles.webp' },
      { categoryName: 'الصابون الطبيعي', icon: '/cat-soap.webp' },
      { categoryName: 'الكروشيه', icon: '/cat-crochet.webp' },
      { categoryName: 'كونكريت', icon: '/cat-gypsum.webp' },
      { categoryName: 'خرز', icon: '/cat-beads.webp' },
      { categoryName: 'الهدايا والتذكارات', icon: '/cat-giftbox.webp' },
      { categoryName: 'الأدوات والمستلزمات', icon: '/cat-supplies.webp' },
    ],
  });

  const [showcaseProducts, setShowcaseProducts] = useState([]);

  const isVideo = (url) => {
    if (!url) return false;

    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };
  // Automatic slide rotation loop
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Supabase Error:', error);
      } else {
        setAllProducts(data || []);
        const showcaseLabels = ['trending-item'];

        const items = (data || [])
          .filter((product) => showcaseLabels.includes(product.label))
          .map((product) => ({
            id: product.id,
            badge: product.label.replace(/-/g, ' ').toUpperCase(),
            name: product.name,
            name_ar: product.name_ar,
            price: `${product.price} $`,
            image_url: product.image_url
              ? `${bucketUrl}${product.image_url.replace('/images/', '/')}`
              : `${bucketUrl}/products/placeholder.webp`,
            description: product.description || 'Beautiful handcrafted item.',
            description_ar: product.description_ar || '',
            video: product.video,
          }));
        console.log(items);
        setShowcaseProducts(items);
      }
    }
    fetchProducts();
  }, []);

useEffect(() => {
  const startSlider = () => setSliderStarted(true);

  window.addEventListener("pointerdown", startSlider, { once: true });
  window.addEventListener("touchstart", startSlider, { once: true, passive: true });
  window.addEventListener("keydown", startSlider, { once: true });

  return () => {
    window.removeEventListener("pointerdown", startSlider);
    window.removeEventListener("touchstart", startSlider);
    window.removeEventListener("keydown", startSlider);
  };
}, []);

  // Auto-slide
 useEffect(() => {
  if (!sliderStarted || showcaseProducts.length <= 1) return;

  const interval = setInterval(() => {
    setSliderDirection(1);
    setHeroSliderIndex((prev) => (prev + 1) % showcaseProducts.length);
  }, 3000);

  return () => clearInterval(interval);
}, [showcaseProducts.length, sliderStarted]);

  const changeSlide = (way) => {
    setSliderDirection(way);
    if (way === 1) {
      setHeroSliderIndex((prev) => (prev + 1) % showcaseProducts.length);
    } else {
      setHeroSliderIndex(
        (prev) => (prev - 1 + showcaseProducts.length) % showcaseProducts.length
      );
    }
  };

  const translations = {
    English: {
      dir: 'ltr',
      logo: 'Crafity',
      navbarSlogan:
        'Crafity made with love in very artistic modern powerfull look',
      heroSlogan: 'MADE WITH LOVE',
      searchPlaceholder: 'Search products...',
      heroBadge: '✨ Handmade Artistic Store',
      heroTitleLine1: 'Elegant Handmade',
      heroTitleLine2: 'Creations & Gifts',
      heroDesc: 'Handmade gifts crafted with elegance, warmth, and creativity.',
      btnShop: 'Shop Collection',
      catTitle: 'Shop by Category',
      backBtn: '← Back to Categories',
      allFilter: 'All',
      addToCart: 'Add To Cart',
      quickView: 'Quick view',
      detailsView: 'Details',
      inStock: 'In stock',
      soldOut: 'Sold out',
      uploadPhoto: 'Change Photo 📷',
      inputNamePlaceholder: 'Enter item name...',
      inputPricePlaceholder: 'Price...',
      custNotification: '✨ Customization Available upon request via WhatsApp',
      footerDesc:
        'Handmade artistic creations designed with elegance and love.',
      quickLinks: 'Quick Links',
      linkHome: 'Home',
      linkCategories: 'Categories',
      contactChannels: 'Contact Us',
      contactDesc: 'Connect with us on our official social channels:',
      copyright: '©️ 2026 Crafity — Made With Love',
      orderWhatsapp: 'Order via WhatsApp 💬',
      close: 'Close',
      bestSellers: 'Best Sellers',
      newArrivals: 'New Arrivals',
    },
    Arabic: {
      dir: 'rtl',
      logo: 'كرافيتي',
      navbarSlogan: 'كرافيتي صُنعت بكل حب بمظهر عصري، فني وقوي للغاية',
      heroSlogan: 'صُنعت بكل حب',
      searchPlaceholder: 'اببحث عن المنتجات...',
      heroBadge: '✨ متجر أعمال فنية مصنوعة يدوياً',
      heroTitleLine1: 'إبداعات وهدايا',
      heroTitleLine2: 'يدوية أنيقة',
      heroDesc: 'هدايا مصنوعة يدويًا بدقة، دفء، ولمسات إبداعية ساحرة.',
      btnShop: 'تسوّق المجموعة',
      catTitle: 'تسوق حسب الفئة',
      backBtn: '← العودة إلى الأقسام',
      allFilter: 'الكل',
      addToCart: 'أضف إلى السلة',
      quickView: 'عرض سريع',
      detailsView: 'التفاصيل',
      inStock: 'متوفر',
      soldOut: 'نفذت الكمية',
      uploadPhoto: 'تغيير الصورة 📷',
      inputNamePlaceholder: 'أدخل اسم المنتج...',
      inputPricePlaceholder: 'السعر...',
      custNotification: '✨ التخصيص متوفر عند الطلب عبر واتساب',
      footerDesc: 'قطع فنية مصنوعة يدوياً مصممة بكل حب ورقي لتناسب ذوقك.',
      quickLinks: 'روابط سريعة',
      linkHome: 'الرئيسية',
      linkCategories: 'الأقسام',
      contactChannels: 'تواصل معنا',
      contactDesc: 'تواصل معنا مباشرة عبر قنواتنا الرسمية:',
      copyright: '©️ ٢٠٢٦ كرافيتي — صنع بكل حب',
      orderWhatsapp: 'اطلب عبر واتساب 💬',
      close: 'إغلاق',
      bestSellers: 'الأكثر مبيعًا',
      newArrivals: 'وصل حديثًا',
    },
  };

  const t = translations[lang];

  // Fashion look slider animations mirroring the requested split composition
  const backgroundVariants = {
    enter: (dir) => ({ opacity: 0 }),
    center: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.6 } },
  };

  const mainFrameVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
      scale: 1.05,
    }),
    center: {
      x: '0%',
      clipPath: 'inset(0% 0% 0% 0%)',
      scale: 1,
      transition: { duration: 0.85, ease: [0.33, 1, 0.68, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? '-30%' : '30%',
      clipPath: dir > 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
      opacity: 0.6,
      transition: { duration: 0.75, ease: [0.32, 0, 0.67, 0] },
    }),
  };

  const textPaneVariants = {
    enter: { opacity: 0, y: 15 },
    center: { opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.5 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
  };

  const renderIcon = (iconSource, altText) => {
    if (iconSource.startsWith('/')) {
      return (
        <img
  src={iconSource}
  alt={altText}
  width="400"
  height="400"
  loading="lazy"
  decoding="async"
  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
  onError={(e) => {
    e.target.style.display = 'none';
    e.target.parentNode.innerText = '✨';
  }}
/>
      );
    }
    return iconSource;
  };

  const sendOrderToWhatsApp = (item) => {
    const phoneNumber = '9613183656';
    let message = '';
    if (lang === 'Arabic') {
      message =
        `مرحباً كرافيتي! أود طلب المنتج التالي:\n\n` +
        `📦 *المنتج:* ${item.name_ar || item.name}\n` +
        `💰 *السعر:* ${item.price}\n` +
        `🔗 *الحالة:* طلب مباشرة من واجهة العرض الرئيسية المتحركة`;
    } else {
      message =
        `Hello Crafity! I would like to order this item:\n\n` +
        `📦 *Product:* ${lang === 'Arabic' ? item.name_ar : item.name}\n` +
        `💰 *Price:* ${item.price}\n` +
        `🔗 *Context:* Requested from interactive premium dynamic hero slider`;
    }
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const currentCategoryBlock = categoriesData[lang].find(
    (cat) => cat.categoryName === selectedCategory
  );

  // Mapping display names to database category keys
  const categoryMap = {
    Macrame: 'macrame',
    المكرامية: 'macrame',
    'Resin Art': 'resin',
    'أعمال الريزن': 'resin',
    Candles: 'candles',
    الشموع: 'candles',
    'Soap': 'soap',
    'الصابون الطبيعي': 'soap',
    Crochet: 'crochet',
    الكروشيه: 'crochet',
    Gypsum: 'gypsum',
    كونكريت: 'gypsum',
    Beads: 'beads',
    خرز: 'beads',
    Giftbox: 'giftbox',
    'حزمة الهدايا': 'giftbox',
    'Tools & Supplies': 'supplies',
    'مواد أوّليّة': 'supplies',
  };

  const dbKey = categoryMap[selectedCategory];

  const displayedItems =
    searchTerm.trim() !== ''
      ? allProducts.filter((item) =>
          [
            item.name,
            item.name_ar,
            item.description,
            item.description_ar,
            item.category,
          ]
            .filter(Boolean)
            .some((field) =>
              field.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
      : selectedShowcaseLabel
      ? allProducts.filter((item) => item.label === selectedShowcaseLabel)
      : selectedCategory
      ? allProducts.filter((item) => item.category === dbKey)
      : [];

  const isSearching = searchTerm.trim() !== '';
  const activeSlide = showcaseProducts[heroSliderIndex] || {};

  const pageTitle = selectedShowcaseLabel
    ? selectedShowcaseLabel === 'best-seller'
      ? lang === 'Arabic'
        ? 'الأكثر مبيعاً'
        : 'Best Sellers'
      : lang === 'Arabic'
      ? 'وصل حديثاً'
      : 'New Arrivals'
    : selectedCategory;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    if (isSearching && displayedItems.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [searchTerm, displayedItems.length]);

  const bestSellerProducts = allProducts
    .filter(
      (product) =>
        product.label === 'best-seller' || product.label === 'best-sellers'
    )
    .slice(0, 4);

  const newArrivalProducts = allProducts
    .filter(
      (product) =>
        product.label === 'new-arrival' || product.label === 'new-arrivals'
    )
    .slice(0, 4);

  return (
    <>
  <Helmet>
  <title>
    {selectedCategory
      ? `${selectedCategory} | Crafity Lebanon`
      : selectedShowcaseLabel
      ? `${pageTitle} | Crafity Lebanon`
      : "Crafity Lebanon | Handmade Macrame, Candles, Resin Art & Craft Supplies"}
  </title>

  <meta
    name="description"
    content={
      selectedCategory
        ? `Shop handmade ${selectedCategory} products in Lebanon from Crafity.`
        : selectedShowcaseLabel
        ? `Browse ${pageTitle} at Crafity Lebanon.`
        : "Shop handmade macrame, candles, soap, resin art, crochet, gypsum, beads and craft supplies in Lebanon."
    }
  />

  <link
    rel="canonical"
    href={`https://crafity-lb.com${
      window.location.pathname
    }`}
  />
</Helmet>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      dir={t.dir}
      className={`min-h-screen bg-[#f7f0eb] text-[#4b3d39] overflow-x-hidden ${
        t.dir === 'rtl' ? 'font-sans text-right' : 'font-sans text-left'
      }`}
    >
    <h1 className="hidden">
      Crafity Lebanon - Handmade Crafts, Candles, Soap, Resin Art, Crochet and Craft Supplies
    </h1>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-50 shadow-sm">
  <div className="w-full px-6 py-0 h-[95px] flex flex-row items-center justify-between gap-4">

    <div className="flex items-center justify-start w-[25vw] min-w-[420px] -ml-2 overflow-visible">
      <img
        src="/logo.webp"
        alt="Crafity Lebanon Handmade Crafts Store"
        width="1800"
        height="500"
        className="h-[92px] w-[620px] object-contain object-left cursor-pointer transition-transform duration-200 active:scale-95"
        onClick={() => {
          setSelectedCategory(null);
          setSelectedShowcaseLabel(null);
          setSearchTerm('');
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentNode.innerHTML = `<div class="text-3xl font-light tracking-wide text-[#d9779b] py-4">${t.logo}</div>`;
        }}
      />
    </div>

    <div className="flex items-center gap-3 w-full md:w-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchPlaceholder}
        className="w-full md:w-72 px-4 py-2 rounded-full border border-orange-100 bg-[#fffaf9] outline-none focus:ring-2 focus:ring-orange-200/50"
      />

      <select
        value={lang}
        aria-label="Choose language"
        onChange={(e) => {
          setLang(e.target.value);
          setSelectedCategory(null);
        }}
        className="px-4 py-2 rounded-full border border-orange-100 bg-white text-[#4b3d39]"
      >
        <option value="English">English</option>
        <option value="Arabic">العربية</option>
      </select>
    </div>

  </div>
</header>

      <main>
      {/* Premium Fashion Split Slider Engine */}
      <AnimatePresence mode="wait">
        {!selectedCategory && !selectedShowcaseLabel && (
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
              <div
                className={`lg:col-span-5 order-2 lg:order-1 text-center ${
                  lang === 'Arabic' ? 'lg:text-right' : 'lg:text-left'
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${heroSliderIndex}`}
                    variants={textPaneVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-4"
                  >
                    <h2 className="text-2xl md:text-2xl lg:text-2xl font-light leading-[1.1] text-[#4b3d39] tracking-tight">
                      {lang === 'Arabic'
                        ? activeSlide.name_ar
                        : activeSlide.name}
                    </h2>

                    <p
                      className={`text-center ${
                        lang === 'Arabic' ? 'lg:text-right' : 'lg:text-left'
                      } text-2xl font-serif italic text-[#d9779b] font-medium`}
                    >
                      {activeSlide.price}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="pt-6 flex items-center justify-center lg:justify-start gap-3">
                  <button
                    aria-label="Previous slide"
                    onClick={() => changeSlide(-1)}
                    className="w-11 h-11 rounded-full bg-white/90 shadow-sm border border-stone-100 flex items-center justify-center text-stone-700 hover:bg-[#d9779b] hover:text-white transition active:scale-95"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                          lang === 'Arabic' ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'
                        }
                      />
                    </svg>
                  </button>

                  <button
                    aria-label="Next slide"
                    onClick={() => changeSlide(1)}
                    className="w-11 h-11 rounded-full bg-white/90 shadow-sm border border-stone-100 flex items-center justify-center text-stone-700 hover:bg-[#d9779b] hover:text-white transition active:scale-95"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                          lang === 'Arabic' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'
                        }
                      />
                    </svg>
                  </button>

                  <div className="ml-4 flex gap-1.5">
                    {showcaseProducts.map((_, idx) => (
                      <button
  key={idx}
  type="button"
  aria-label={`Go to slide ${idx + 1}`}
  onClick={() => {
    setSliderDirection(idx > heroSliderIndex ? 1 : -1);
    setHeroSliderIndex(idx);
  }}
  className="w-10 h-10 flex items-center justify-center rounded-full"
>
  <span
    className={`h-1.5 rounded-full transition-all duration-300 ${
      idx === heroSliderIndex
        ? 'w-6 bg-[#d9779b]'
        : 'w-2 bg-stone-300'
    }`}
  />
</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center lg:justify-end relative h-[420px] lg:h-[500px] w-full">
                <div className="relative w-full max-w-[440px] h-full rounded-[36px] p-2 bg-white/30 backdrop-blur-md shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-white/40">
                  <div className="relative w-full h-full rounded-[28px] group">
                    <div className="absolute -top-12 left-0 z-30">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white/50 text-[#d9779b] text-xs font-bold tracking-widest uppercase">
                        {lang === 'Arabic'
                          ? activeSlide.badgeAr
                          : activeSlide.badge}
                      </span>
                    </div>

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
                          onClick={() =>
                            setQuickViewItem({
                              id: activeSlide.id,
                              name:
                                lang === 'Arabic'
                                  ? activeSlide.name_ar
                                  : activeSlide.name,
                              price: activeSlide.price.replace('$', ''),
                              image: activeSlide.image_url,
                              image_url: activeSlide.image_url,
                              inStock: true,
                              description:
                                lang === 'Arabic'
                                  ? activeSlide.description_ar
                                  : activeSlide.description,
                            })
                          }
                        >
                          {activeSlide?.video ? (
                            <video
                              src={getProductVideo(activeSlide)}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                          ) : (
                            <img
  src={getProductImage(activeSlide)}
  alt={`${activeSlide.name} handmade craft by Crafity Lebanon`}
  width="440"
  height="500"
  loading="eager"
  fetchPriority="high"
  decoding="async"
  className="w-full h-full object-cover select-none transition duration-700 group-hover:scale-105"
/>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-80" />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </AnimatePresence>

      <section className="max-w-7xl mx-auto px-6 pt-0 pb-2 min-h-[500px]">
        <AnimatePresence mode="wait">
          {!selectedCategory && !selectedShowcaseLabel && !isSearching ? (
            <motion.div
              key="grid-layout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 -mt-6"
            >
              <div className="-mt-8">
                <h3 className="text-2xl font-semibold tracking-tight text-[#4b3d39]">
                  {t.catTitle}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categoriesData[lang].map((cat) => (
                  <div
                    key={cat.categoryName}
                    onClick={() => {
                      console.log("Category name", cat)
                      navigate(`/category/${isSupabaseCategory(cat.categoryName)}`);
                    }}
                    className="group cursor-pointer flex flex-col items-center"
                  >
                    <div className="aspect-square w-full bg-[#fff9f6] rounded-2xl flex items-center justify-center border-2 border-stone-100 group-hover:border-[#d9779b] transition-all duration-300 shadow-sm relative overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-300">
                        {renderIcon(
                          cat.icon,
                          `${cat.categoryName} category at Crafity Lebanon`
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                {/* Best Sellers Section */}
                <div className="w-full lg:ml-0 rounded-[2rem] border border-[#ead8d0] bg-white/65 p-5 shadow-sm">
                  <div className="mb-5">
                    <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#d9779b] shadow-sm border border-[#f1ded8]">
                      {t.bestSellers}
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      navigate("/label/best-seller");
                    }}
                    className="cursor-pointer"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
                      {bestSellerProducts.map((product) => (
                        <div
                          key={product.id}
                          className="group relative overflow-hidden rounded-[2rem] bg-stone-100 shadow-sm border border-stone-100"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                            <img
                              src={getProductImage(product)}
                              alt={`${product.name} handmade craft by Crafity Lebanon`}
                              width="400"
                              height="500"
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover select-none transition duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-80" />

                            <div className="absolute bottom-4 left-4 right-4">
                              <h4 className="text-white font-semibold text-sm line-clamp-1">
                                {product.name}
                              </h4>
                              <p className="text-white/90 text-sm mt-1">
                                {product.price} $
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* New Arrivals Section */}
                <div
                  onClick={() => {
                    navigate("/label/new-arrival");
                  }}
                  className="cursor-pointer"
                >
                  <div className="w-full lg:ml-0 rounded-[2rem] border border-[#ead8d0] bg-white/65 p-5 shadow-sm">
                    <div className="mb-5">
                      <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#d9779b] shadow-sm border border-[#f1ded8]">
                        {t.newArrivals}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
                      {newArrivalProducts.map((product) => (
                        <div
                          key={product.id}
                          className="group relative overflow-hidden rounded-[2rem] bg-stone-100 shadow-sm border border-stone-100"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                            <img
                              src={getProductImage(product)}
                              alt={`${product.name} handmade craft by Crafity Lebanon`}
                              width="400"
                              height="500"
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover select-none transition duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-80" />

                            <div className="absolute bottom-4 left-4 right-4">
                              <h4 className="text-white font-semibold text-sm line-clamp-1">
                                {product.name}
                              </h4>
                              <p className="text-white/90 text-sm mt-1">
                                {product.price} $
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
              {!isSearching && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedShowcaseLabel(null);
                    setSearchTerm('');
                  }}
                  className="mt-4 px-5 py-2 text-xs font-semibold tracking-wide rounded-full border border-orange-100 text-stone-600 bg-white hover:bg-orange-50/50 transition"
                >
                  {t.backBtn}
                </button>
              )}
              {!isSearching && (
                <div
                  className="flex items-center gap-4 overflow-x-auto py-2 border-b border-orange-50
  [scrollbar-color:transparent_transparent]
  [&::-webkit-scrollbar]:h-2
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-transparent"
                >
                  {categoriesData[lang].map((cat) => (
                    <button
                      key={cat.categoryName}
                      onClick={() => {
                        setSelectedCategory(cat.categoryName);
                        setSelectedShowcaseLabel(null);
                      }}
                      className={`w-24 h-24 rounded-full border text-lg flex items-center justify-center transition-all flex-shrink-0 relative overflow-hidden bg-[#fff9f6] ${
                        selectedCategory === cat.categoryName
                          ? 'border-[#d9779b] shadow-sm scale-95'
                          : 'border-orange-100/70'
                      }`}
                      title={cat.categoryName}
                    >
                      {renderIcon(
                        cat.icon,
                        `${cat.categoryName} category at Crafity Lebanon`
                      )}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[#d9779b] uppercase tracking-wider mb-4">
                  {t.allFilter}
                </p>
              </div>
              <div
                ref={resultsRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {displayedItems.map((item) => {
                  const formattedPrice =
                    item.price && String(item.price).includes('$')
                      ? item.price
                      : `${item.price || '0.00'} $`;
                  const isExpanded = !!expandedDetails[item.id];
                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl p-4 border border-orange-50/70 shadow-sm flex flex-col justify-between relative"
                    >
                      <div className="relative aspect-square w-full rounded-xl bg-[#fffaf9] overflow-hidden flex flex-col items-center justify-center border border-orange-50/30">
                        {item.image_url ? (
                          <img
                            src={getProductImage(item)}
                            alt={`${item.name} handmade craft by Crafity Lebanon`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                'https://via.placeholder.com/400?text=Image+Not+Found';
                            }}
                            loading="lazy"
                            decoding="async"
                            onClick={(e) => {
                              e.stopPropagation();

                              const image = getProductImage(item);
                              console.log('IMAGE CLICKED:', image);

                              setFullscreenImage(image);
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="pt-4 space-y-1">
                        <div className="text-sm font-bold text-[#4b3d39]">
                          {formattedPrice}
                        </div>
                        <div className="text-xs text-stone-500 font-medium">
                          {lang === 'Arabic' ? item.name_ar : item.name}
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-2 bg-orange-50/30 rounded-xl p-2 border border-orange-100/50"
                          >
                            <p className="text-[11px] leading-relaxed text-stone-600 font-normal">
                              {lang === 'Arabic'
                                ? item.description_ar ||
                                  'صنع يدويا بكل حب وعناية فائقة بالتفاصيل.'
                                : item.description ||
                                  'Crafted delicately by hand with supreme attention to detail.'}
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
                            onClick={() =>
                              setQuickViewItem({
                                id: item.id,
                                name:
                                  lang === 'Arabic' ? item.name_ar : item.name,
                                price: item.price,
                                image: item.image_url,
                                image_url: item.image_url,
                                inStock: true,
                                description:
                                  lang === 'Arabic'
                                    ? item.description_ar
                                    : item.description,
                              })
                            }
                            className="text-stone-400 hover:text-[#d9779b] font-medium cursor-pointer uppercase tracking-wider"
                          >
                            {t.quickView}
                          </span>
                          <span className="text-stone-300">|</span>
                          <span
                            onClick={() => toggleDetails(item.id)}
                            className={`font-medium cursor-pointer uppercase tracking-wider transition ${
                              isExpanded
                                ? 'text-[#d9779b]'
                                : 'text-stone-400 hover:text-[#d9779b]'
                            }`}
                          >
                            {t.detailsView}
                          </span>
                        </div>
                        <span className={`font-bold ${'text-emerald-600'}`}>
                          {t.inStock}
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

       </main>

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
                {quickViewItem.image_url ? (
                  <img
                    src={getProductImage(quickViewItem)}
                    alt={`${quickViewItem.name} handmade craft by Crafity Lebanon`}
                    className="w-full h-full object-cover"
                    onClick={() =>
                      setFullscreenImage(getProductImage(quickViewItem))
                    }
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                    <span className="text-4xl mb-2">📦</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      No Image
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase">
                  {t.inStock}
                </span>
                <h4 className="text-xl font-medium text-[#4b3d39]">
                  {quickViewItem.name}
                </h4>
                <p className="text-lg font-bold text-[#d9779b]">
                  {`${quickViewItem.price} $`}
                </p>
                <p className="text-xs text-stone-500 pt-1 leading-relaxed">
                  {quickViewItem.description ||
                    (lang === 'Arabic'
                      ? 'صنع يدويا بكل حب وعناية فائقة بالتفاصيل.'
                      : 'Crafted delicately by hand with supreme attention to detail.')}
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
                  aria-label="Close"
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
            <h5 className="text-xl mb-4 text-orange-50">{t.contactChannels}</h5>
            <p className="text-sm text-orange-100/70 mb-4">{t.contactDesc}</p>
            <div className="flex items-center gap-6 justify-center md:justify-start">
              <a
                href="https://instagram.com/crafity.lb"
                target="_blank"
                rel="me noopener noreferrer"
                className="hover:scale-110 transition duration-300"
                title="Instagram"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#E4405F">
  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
</svg>
                  
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61554831868002&rdid=Wzm1jwqiEEJfMPE2&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18FTL5zJC9%2F#"
                target="_blank"
                rel="me noopener noreferrer"
                className="hover:scale-110 transition duration-300"
                title="Facebook"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.009 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.926-1.956 1.875v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.082 24 18.092 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@crafity.lb"
                target="_blank"
                rel="me noopener noreferrer"
                className="w-7 h-7 inline-flex items-center justify-center hover:scale-110 transition duration-300"
                title="TikTok"
              >
                <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#000000" />
                  <path
                    d="M24 11.23a4.87 4.87 0 0 1-3.18-1.2A5.15 5.15 0 0 1 19.34 7h-3.41v11.75c0 .64-.17 1.25-.49 1.77A3.28 3.28 0 0 1 14 21.64a3.17 3.17 0 0 1-3.66-.58 3.42 3.42 0 0 1-.9-2.31c0-1.07.49-2 1.26-2.6a3.12 3.12 0 0 1 1.93-.67c.36 0 .7.07 1 .21v-3.55a8.21 8.21 0 0 0-1-.06A6.67 6.67 0 0 0 8 18.75a6.76 6.76 0 0 0 6.67 6.75A6.6 6.6 0 0 0 21 20.33V13.8A8.34 8.34 0 0 0 24 15v-3.77z"
                    fill="#FFFFFF"
                  />
                </svg>
              </a>
              <a
                href="https://wa.me/9613183656"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition duration-300"
                title="WhatsApp"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-orange-100/10 mt-12 pt-6 text-center text-orange-100/50 text-sm">
          {t.copyright}
        </div>
      </footer>

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-5 right-6 text-white text-4xl z-[100000]"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
          >
            ×
          </button>

          {isVideo(fullscreenImage) ? (
            <video
              src={fullscreenImage}
              controls
              autoPlay
              className="max-w-full max-h-full"
            />
          ) : (
            <img
              src={fullscreenImage}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      )}
      {selectedCategory && showBackToTop && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={scrollToTop}
            className="w-16 h-16 rounded-full bg-[#fff9f6] border border-[#d9779b]/30 shadow-lg flex items-center justify-center hover:scale-105 transition"
          >
            <span className="text-[#d9779b] text-2xl">↑</span>
          </button>
        </div>
      )}
    </motion.div>
    </>
  );
}