const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const sitemap = new SitemapStream({
  hostname: 'https://crafity-lb.com',
});

const writeStream = createWriteStream('./public/sitemap.xml');

sitemap.pipe(writeStream);

sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });

sitemap.end();

streamToPromise(sitemap)
  .then(() => console.log('Sitemap generated!'))
  .catch(console.error);