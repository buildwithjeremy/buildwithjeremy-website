// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://buildwithjeremy.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
