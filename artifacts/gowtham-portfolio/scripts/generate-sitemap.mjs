import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

try {
  process.loadEnvFile(new URL('../.env', import.meta.url));
} catch {}

const configuredSiteUrl = process.env.VITE_SITE_URL?.trim();

if (!configuredSiteUrl) {
  console.info(
    '[sitemap] Skipped: set VITE_SITE_URL to the published site origin after it is available.',
  );
  process.exit(0);
}

let siteOrigin;
try {
  const siteUrl = new URL(configuredSiteUrl);
  if (!['https:', 'http:'].includes(siteUrl.protocol)) {
    throw new Error('VITE_SITE_URL must use HTTP or HTTPS.');
  }
  siteOrigin = siteUrl.origin;
} catch (error) {
  console.error(
    `[sitemap] Invalid VITE_SITE_URL: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}

const routes = [
  '/',
  '/projects/flight-safety-risk-analysis',
  '/projects/llm-powered-code-reviewer',
  '/projects/career-guidance-chatbot',
];

const entries = routes
  .map((route) => `  <url><loc>${new URL(route, `${siteOrigin}/`).href}</loc></url>`)
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
const outputPath = fileURLToPath(
  new URL('../dist/public/sitemap.xml', import.meta.url),
);
const robotsPath = fileURLToPath(
  new URL('../dist/public/robots.txt', import.meta.url),
);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, sitemap, 'utf8');
await writeFile(
  robotsPath,
  `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', `${siteOrigin}/`).href}\n`,
  'utf8',
);
console.info(`[sitemap] Wrote ${routes.length} routes to ${outputPath}`);
