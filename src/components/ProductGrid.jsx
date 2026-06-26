import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const bucketUrl =
  "https://difogkabffvfdmwyykcc.supabase.co/storage/v1/object/public";

export default function ProductGrid({
  items,
  lang = "English",
  translations,
}) {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});

  const t =
    translations ||
    {
      orderWhatsapp: "Order via WhatsApp 💬",
      quickView: "Quick view",
      detailsView: "Details",
      inStock: "In stock",
      close: "Close",
    };

  const getProductImage = (item) => {
    const image = item?.image || item?.image_url || "";
    if (!image) return "";

    if (image.startsWith("http")) return image;

    return `${bucketUrl}${image.replace("/images/", "/")}`;
  };

  const isVideo = (url) => {
    if (!url) return false;

    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  const toggleDetails = (itemId) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const sendOrderToWhatsApp = (item) => {
    const phoneNumber = "9613183656";

    const productName =
      lang === "Arabic" ? item.name_ar || item.name : item.name;

    const price =
      item.price && String(item.price).includes("$")
        ? item.price
        : `${item.price || "0.00"} $`;

    const message =
      lang === "Arabic"
        ? `مرحباً كرافيتي! أود طلب المنتج التالي:\n\n📦 *المنتج:* ${productName}\n💰 *السعر:* ${price}`
        : `Hello Crafity! I would like to order this item:\n\n📦 *Product:* ${productName}\n💰 *Price:* ${price}`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => {
          const formattedPrice =
            item.price && String(item.price).includes("$")
              ? item.price
              : `${item.price || "0.00"} $`;

          const isExpanded = !!expandedDetails[item.id];

          return (
            <Link
              to={`/product/${item.id}`}
              state={{ from: window.location.pathname }}
              key={item.id}
              className="group bg-white rounded-2xl p-4 border border-orange-50/70 shadow-sm flex flex-col justify-between relative"
            >
              <div className="relative aspect-square w-full rounded-xl bg-[#fffaf9] overflow-hidden flex flex-col items-center justify-center border border-orange-50/30">
                {item.image_url ? (
                  <img
                    src={getProductImage(item)}
                    alt={`${item.name} handmade craft by Crafity Lebanon`}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400?text=Image+Not+Found";
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFullscreenImage(getProductImage(item));
                    }}
                  />
                ) : null}
              </div>

              <div className="pt-4 space-y-1">
                <div className="text-sm font-bold text-[#4b3d39]">
                  {formattedPrice}
                </div>

                <div className="text-xs text-stone-500 font-medium">
                  {lang === "Arabic" ? item.name_ar || item.name : item.name}
                </div>
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
                      {lang === "Arabic"
                        ? item.description_ar ||
                          "صنع يدويا بكل حب وعناية فائقة بالتفاصيل."
                        : item.description ||
                          "Crafted delicately by hand with supreme attention to detail."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    sendOrderToWhatsApp(item);
                }}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  {t.orderWhatsapp}
                </button>
              </div>

              <div className="flex justify-between items-center pt-3 mt-2 border-t border-orange-50/50 text-[10px]">
                <div className="flex items-center gap-2">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setQuickViewItem({
                        id: item.id,
                        name: lang === "Arabic" ? item.name_ar || item.name : item.name,
                        price: item.price,
                        image: item.image_url,
                        image_url: item.image_url,
                        inStock: true,
                        description: lang === "Arabic" ? item.description_ar : item.description,
                   });
                 }}
                    className="text-stone-400 hover:text-[#d9779b] font-medium cursor-pointer uppercase tracking-wider"
                  >
                    {t.quickView}
                  </span>

                  <span className="text-stone-300">|</span>

                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDetails(item.id);
                    }}
    
                    className={`font-medium cursor-pointer uppercase tracking-wider transition ${
                      isExpanded
                        ? "text-[#d9779b]"
                        : "text-stone-400 hover:text-[#d9779b]"
                    }`}
                  >
                    {t.detailsView}
                  </span>
                </div>

                <span className="font-bold text-emerald-600">
                  {t.inStock}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

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
                    className="w-full h-full object-cover cursor-zoom-in"
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
                  {quickViewItem.price &&
                  String(quickViewItem.price).includes("$")
                    ? quickViewItem.price
                    : `${quickViewItem.price || "0.00"} $`}
                </p>

                <p className="text-xs text-stone-500 pt-1 leading-relaxed">
                  {quickViewItem.description ||
                    (lang === "Arabic"
                      ? "صنع يدويا بكل حب وعناية فائقة بالتفاصيل."
                      : "Crafted delicately by hand with supreme attention to detail.")}
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
    </>
  );
}