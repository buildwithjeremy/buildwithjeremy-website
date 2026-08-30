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
  // One URL form only. The sitemap and every canonical tag already declare the
  // trailing-slash form, but with trailingSlash unset Astro defaults to 'ignore' and
  // Vercel answered BOTH forms with a 200 — so Google indexed /contact and /contact/
  // as separate pages and split the ranking signal (GSC 2026-08-29: /contact at
  // position 3.0 alongside /contact/ at 2.1; /ai-employee at 3.0 alongside
  // /ai-employee/ at 15.6). 'always' matches the form Google already settled on, so
  // the bare form now 308-redirects instead of duplicating.
  // BMS solves the same bug with 'never'; the two sites differ on purpose — see the
  // work item. Switching BWJ to 'never' would re-open every URL Google has indexed.
  trailingSlash: 'always',
  adapter: vercel(),
  // NOTE: /jeremy -> /about/ lives in vercel.json, not here. Astro normalises a
  // redirect key back to the bare form, so the route it emits ('^/jeremy$') is
  // ordered AFTER the trailingSlash 308 and never matches — /jeremy would 308 to
  // /jeremy/ and then 404. vercel.json redirects run before framework routes.

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
