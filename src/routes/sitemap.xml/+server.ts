import { projectQuarters } from '$lib/data/projects';
import { canonicalUrl } from '$lib/seo';

export const prerender = true;

const staticRoutes = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/projects/', priority: '0.9', changefreq: 'weekly' },
	{ path: '/research/', priority: '0.9', changefreq: 'monthly' },
	{ path: '/people/', priority: '0.8', changefreq: 'monthly' },
	{ path: '/events/', priority: '0.8', changefreq: 'weekly' },
	{ path: '/resources/', priority: '0.7', changefreq: 'monthly' }
];

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function GET() {
	const projectRoutes = projectQuarters.map((quarter, index) => ({
		path: `/projects/${quarter.slug}/`,
		priority: index === 0 ? '0.8' : '0.6',
		changefreq: quarter.status === 'current' ? 'weekly' : 'yearly'
	}));

	const urls = [...staticRoutes, ...projectRoutes]
		.map(
			(route) => `  <url>
    <loc>${escapeXml(canonicalUrl(route.path))}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
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
