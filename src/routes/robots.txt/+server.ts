import { canonicalUrl } from '$lib/seo';

export const prerender = true;

export function GET() {
	const body = [
		'User-agent: *',
		'Allow: /',
		`Sitemap: ${canonicalUrl('/sitemap.xml')}`,
		''
	].join('\n');

	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8'
		}
	});
}
