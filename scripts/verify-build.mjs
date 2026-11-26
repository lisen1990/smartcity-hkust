import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const base = (process.env.SITE_BASE ?? '').replace(/^\/+|\/+$/g, '');
const prefix = base ? '/' + base : '';
const origin = 'https://build-verification.invalid';
const source = (name) => JSON.parse(readFileSync(new URL('../src/data/' + name + '.json', import.meta.url), 'utf8'));
const failures = [];
const tracked = new Set();
const files = readdirSync(root, { recursive: true }).filter((path) => statSync(join(root, path)).isFile());
const html = new Map(files.filter((path) => path.endsWith('.html')).map((path) => [path, readFileSync(join(root, path), 'utf8')]));
const papers = source('publications');
const news = source('news');
const research = source('research');
const people = source('people');

function checkLink(raw, from, requiredLocal = false) {
  if (!raw || raw.startsWith('data:')) return;
  const href = raw.replaceAll('&amp;', '&');
  const fromPage = from.replace(/index\.html$/, '');
  const url = new URL(href, origin + prefix + '/' + fromPage);
  if (url.origin !== origin) {
    if (requiredLocal) failures.push(from + ': third-party resource ' + href);
    if (!['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol)) failures.push(from + ': unsupported link ' + href);
    return;
  }
  if (!url.pathname.startsWith(prefix + '/')) {
    failures.push(from + ': path is outside the configured base: ' + href);
    return;
  }
  const pathname = decodeURIComponent(url.pathname.slice(prefix.length + 1));
  const candidates = [pathname, (pathname ? pathname.replace(/\/?$/, '/') : '') + 'index.html'];
  const destination = candidates.find((file) => files.includes(file));
  if (!destination) {
    failures.push(from + ': missing ' + href);
  } else if (url.hash && html.has(destination) && !html.get(destination).includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"')) {
    failures.push(from + ': missing anchor ' + href);
  }
  if (destination) tracked.add(destination);
}

for (const [path, markup] of html) {
  assert.match(markup, /<html lang="en"/, path + ' document language');
  for (const [, tag, attributes] of markup.matchAll(/<(a|img|script|link|source)\b([^>]*)>/gi)) {
    const isAsset = tag !== 'a' && !/\brel="canonical"/.test(attributes);
    for (const [, attribute, value] of attributes.matchAll(/\b(href|src|srcset)="([^"]*)"/gi)) {
      if (attribute === 'srcset') {
        for (const candidate of value.split(',')) checkLink(candidate.trim().split(/\s+/)[0], path, true);
      } else {
        checkLink(value, path, isAsset);
      }
    }
    if (tag === 'img') assert.match(attributes, /\balt="[^"]*"/, path + ' missing image alternative');
  }
}

for (const path of files.filter((path) => path.endsWith('.css'))) {
  const css = readFileSync(join(root, path), 'utf8');
  for (const [, url] of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) checkLink(url, path, true);
}

const required = ['index.html', 'research/index.html', 'people/index.html', 'publications/index.html', 'join-us/index.html', 'news/index.html', 'profile/index.html', 'teaching/index.html', '404.html'];
for (const path of required) {
  assert.ok(html.has(path), 'Missing page ' + path);
  assert.equal((html.get(path).match(/<h1[ >]/g) ?? []).length, 1, path + ' must have one main heading');
}

const redirects = {
  'projects-3': 'research/',
  'team-4': 'people/',
  'contact-me': 'join-us/',
};
const study = research.projects.find((project) => project.detail?.source.endsWith('/single-project'));
assert.ok(study, 'Missing migrated Hong Kong safety study');
redirects['single-project'] = 'research/' + study.slug + '/';
for (const [slug, path] of Object.entries(redirects)) {
  const markup = html.get(slug + '/index.html');
  assert.ok(markup?.includes('http-equiv="refresh"') && markup.includes('href="' + prefix + '/' + path + '"'), 'Invalid legacy redirect ' + slug);
}

assert.equal(new Set(papers.map(({ id }) => id)).size, papers.length, 'Every publication must have a unique ID');
for (const record of papers) {
  assert.match(record.id, /^[a-z0-9_-]+$/i, 'Unsafe publication ID');
  assert.ok(record.title && record.authors && Number.isInteger(record.year) && record.venue && ['journal', 'conference', 'patent'].includes(record.type), 'Incomplete publication ' + record.id);
  const recordPage = record.type === 'patent' ? 'profile/index.html' : 'publications/index.html';
  assert.ok(html.get(recordPage).includes('id="' + record.id + '"'), 'Unrendered publication ' + record.id);
}
assert.equal((html.get('news/index.html').match(/<time datetime=/g) ?? []).length, news.length);
assert.equal((html.get('people/index.html').match(/<article class="person-card"/g) ?? []).length, people.sections.flatMap((group) => group.people).length);

if (process.env.SITE_URL && process.env.PUBLIC_NOINDEX !== '1') {
  const canonicalHome = new URL(prefix + '/', process.env.SITE_URL).href;
  assert.ok(html.get('index.html').includes('rel="canonical" href="' + canonicalHome + '"'), 'Homepage canonical URL');
  assert.ok(readFileSync(join(root, 'sitemap.xml'), 'utf8').includes('<loc>' + canonicalHome + '</loc>'), 'Homepage sitemap entry');
}

assert.ok(existsSync(join(root, 'robots.txt')), 'Missing robots.txt');
assert.deepEqual(failures, [], 'Broken links or external page resources:\n' + failures.join('\n'));
console.log('Verified ' + html.size + ' HTML pages, ' + tracked.size + ' local destinations, ' + papers.length + ' publications and ' + news.length + ' news items at ' + (prefix || '/') + '.');
