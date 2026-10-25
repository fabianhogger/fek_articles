import { defineConfig } from 'astro/config';

// Set SITE_URL in the Cloudflare Pages build settings once the domain exists.
export default defineConfig({
  site: process.env.SITE_URL || 'https://fek-site.pages.dev',
  output: 'static',
  trailingSlash: 'ignore',
});
