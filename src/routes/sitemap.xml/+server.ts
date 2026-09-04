import { projectQuarters } from '$lib/data/projects';
import { canonicalUrl } from '$lib/seo';
import { pages } from '$lib/data/pages';

export const prerender = true;

const staticRoutes = Object.values(pages);

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function GET() {
	const projectRoutes = projectQuarters.map((quarter) => ({
		path: `/projects/${quarter.slug}/`,
		lastmod: quarter.lastmod
	}));

	const urls = [...staticRoutes, ...projectRoutes]
		.map(
			(route) => `  <url>
    <loc>${escapeXml(canonicalUrl(route.path))}</loc>
    <lastmod>${route.lastmod}</lastmod>
  </url>`
		)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8'
		}
	});
}
