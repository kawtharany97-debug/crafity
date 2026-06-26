import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
const bucketUrl =
  "https://difogkabffvfdmwyykcc.supabase.co/storage/v1/object/public";

export default function ProductPage({ allProducts }) {
  const navigate = useNavigate();
  const { productId } = useParams();

  const getProductImage = (item) => {
    const image = item?.image || item?.image_url || "";
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${bucketUrl}${image.replace("/images/", "/")}`;
  };

  const product = allProducts.find(
    (item) => String(item.id) === String(productId)
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f0eb] text-[#4b3d39] px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex px-5 py-2 text-xs font-semibold tracking-wide rounded-full border border-orange-100 text-stone-600 bg-white hover:bg-orange-50/50 transition"
        >
          ← Back
        </button>
        
        <h1 className="mt-8 text-3xl font-semibold">Product not found</h1>
      </div>
    );
  }

  const productName = product.name || "Crafity Product";
  const productDescription =
    product.description ||
    "Handmade product crafted with care by Crafity Lebanon.";
  const productImage = getProductImage(product);
  const productPrice = Number(product.price) || 0;

  const relatedProducts = allProducts
    .filter(
      (item) =>
        item.category === product.category &&
        String(item.id) !== String(product.id)
    )
    .slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: productImage,
    description: productDescription,
    brand: {
      "@type": "Brand",
      name: "Crafity Lebanon",
    },
    category: product.category || "Handmade Crafts",
    offers: {
      "@type": "Offer",
      price: productPrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://www.crafity-lb.com/product/${product.id}`,
    },
  };

  const sendOrderToWhatsApp = () => {
    const message =
      `Hello Crafity! I would like to order this item:\n\n` +
      `📦 Product: ${productName}\n` +
      `💰 Price: ${productPrice} $`;

    window.open(
      `https://wa.me/9613183656?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <Helmet>
        <title>{productName} | Crafity Lebanon</title>
        <meta name="description" content={`${productDescription.slice(0, 150)}`} />
      </Helmet>

      <main className="min-h-screen bg-[#f7f0eb] text-[#4b3d39] px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex px-5 py-2 text-xs font-semibold tracking-wide rounded-full border border-orange-100 text-stone-600 bg-white hover:bg-orange-50/50 transition"
        >
          ← Back
        </button>

        <section className="grid md:grid-cols-2 gap-10 mt-10 items-start">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-orange-50">
            <img
              src={productImage}
              alt={`${productName} handmade product by Crafity Lebanon`}
              className="w-full aspect-square object-cover rounded-2xl"
            />
          </div>

          <div className="bg-white/70 rounded-3xl p-6 border border-orange-50 shadow-sm">
            <p className="text-xs font-bold text-[#d9779b] uppercase tracking-wider mb-3">
              {product.category || "Handmade Product"}
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {productName}
            </h1>

            <p className="mt-4 text-2xl font-bold text-[#d9779b]">{productPrice} $</p>

            <p className="mt-5 text-sm leading-7 text-stone-600">{productDescription}</p>

            <button
              onClick={sendOrderToWhatsApp}
              className="mt-6 w-full md:w-auto px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm shadow-sm transition"
            >
              Order via WhatsApp 💬
            </button>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold mb-6">Related Products</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="bg-white rounded-2xl p-3 border border-orange-50 shadow-sm"
                >
                  <img
                    src={getProductImage(item)}
                    alt={`${item.name} handmade product by Crafity Lebanon`}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <p className="mt-3 text-xs font-medium text-stone-600">{item.name}</p>
                  <p className="text-sm font-bold text-[#d9779b]">{item.price} $</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}