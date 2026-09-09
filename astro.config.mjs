// @ts-check
import { defineConfig } from 'astro/config';

// `base` lets the same build serve from a GitHub Pages project path
// (/belman-lab-demo) or from a domain root. Defaults to root for local dev.
const base = process.env.SITE_BASE ?? '/';
const site = process.env.SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
