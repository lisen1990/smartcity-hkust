import type { APIRoute } from 'astro';
import { navigation, sitePath } from '../lib/site';
import research from '../data/research.json';

export const GET: APIRoute = ({ site }) => {
  const paths = [
    ...navigation.map(({ path }) => path),
    'profile/',
    'news/',
    ...research.projects.filter((project) => 'detail' in project).map((project) => `research/${project.slug}/`),
  ];
  const canIndex = site && import.meta.env.PUBLIC_NOINDEX !== '1';
  const entries = canIndex ? paths.map((path) => `  <url><loc>${new URL(sitePath(path), site).href}</loc></url>`) : [];
  const body = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...entries, '</urlset>'].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
