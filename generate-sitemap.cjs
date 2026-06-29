const fs = require("fs");

const SITE_URL = "https://crafity-lb.com";

const categories = [
  "macrame",
  "resin",
  "candles",
  "soap",
  "crochet",
  "gypsum",
  "beads",
  "giftbox",
  "supplies",
];

const labels = ["best-seller", "new-arrival"];

async function generateSitemap() {
  const productsResponse = await fetch(
    "https://difogkabffvfdmwyykcc.supabase.co/rest/v1/products?select=id",
    {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZm9na2FiZmZ2ZmRtd3l5a2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NDYwNzgsImV4cCI6MjA5NjQyMjA3OH0.bJ8H04xK1__hQKd8pNj7p7b38HeFjObMjWzPgW0rHXQ",
      },
    }
  );

  const products = await productsResponse.json();

  const urls = [
    `${SITE_URL}/`,
    ...categories.map((cat) => `${SITE_URL}/category/${cat}`),
    ...labels.map((label) => `${SITE_URL}/label/${label}`),
    ...products.map((product) => `${SITE_URL}/product/${product.id}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === `${SITE_URL}/` ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);

  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
}

generateSitemap();