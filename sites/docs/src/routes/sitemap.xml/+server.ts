import { docs } from '../../../.velite';
import type { RequestHandler } from './$types';

const SITE_URL = 'https://svelte-reactive-table.vercel.app';

export const prerender = true;

export const GET: RequestHandler = () => {
	const pages = docs.map((doc) => ({
		url: `${SITE_URL}${doc.path}`,
		lastmod: new Date().toISOString().split('T')[0]
	}));

	// Add home page
	pages.unshift({
		url: SITE_URL,
		lastmod: new Date().toISOString().split('T')[0]
	});

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
