import { defineConfig } from 'astro/config';

const base = (process.env.SITE_BASE ?? '/').replace(/^\/*|\/*$/g, '');
const site = process.env.SITE_URL;

export default defineConfig({
  output: 'static',
  site: site || undefined,
  base: base ? `/${base}` : '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
