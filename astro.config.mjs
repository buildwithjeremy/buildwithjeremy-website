// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://buildwithjeremy.com',
  output: 'static',
  adapter: vercel(),
  redirects: {
    '/jeremy': '/about',
  },
  integrations: [
    react(),
    keystatic(),
    // Required for the blog: the collection globs **/*.mdx and Keystatic authors
    // blog content with fields.mdx(). Without this the collection cannot load at all.
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/checkout/'),
      serialize(item) {
        // Boost AI employee pages for faster crawl discovery
        if (item.url.includes('/ai-employee/')) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        } else if (item.url === 'https://buildwithjeremy.com/') {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        } else {
          item.changefreq = 'monthly';
          item.priority = 0.7;
        }
        item.lastmod = new Date().toISOString().split('T')[0];
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
