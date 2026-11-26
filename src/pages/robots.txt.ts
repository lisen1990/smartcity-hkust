import type { APIRoute } from 'astro';
import { sitePath } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const preview = import.meta.env.PUBLIC_NOINDEX === '1';
  const sitemap = site && !preview ? `Sitemap: ${new URL(sitePath('sitemap.xml'), site)}\n` : '';
  return new Response(`User-agent: *\n${preview ? 'Disallow: /' : 'Allow: /'}\n${sitemap}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
