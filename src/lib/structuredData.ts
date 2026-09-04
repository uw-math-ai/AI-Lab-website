import { canonicalOrigin, canonicalUrl } from '$lib/seo';

export const organizationId = `${canonicalOrigin}/#organization`;
export const websiteId = `${canonicalOrigin}/#website`;

export const organization = {
	'@type': 'ResearchOrganization',
	'@id': organizationId,
	name: 'University of Washington Math AI Lab',
	alternateName: ['UW Math AI Lab', 'Math AI Lab', 'UW Mathematics AI Lab'],
	url: `${canonicalOrigin}/`,
	logo: {
		'@type': 'ImageObject',
		url: `${canonicalOrigin}/logos/math-ai-lab-logo.png`
	},
	description:
		'A research and education organization at the University of Washington focused on using AI for mathematics, including Lean formalization and automated theorem proving.',
	parentOrganization: {
		'@type': 'CollegeOrUniversity',
		name: 'University of Washington',
		url: 'https://www.washington.edu/',
		department: {
			'@type': 'Organization',
			name: 'Department of Mathematics',
			url: 'https://math.washington.edu/'
		}
	},
	founder: [
		{ '@type': 'Person', name: 'Jarod Alper' },
		{ '@type': 'Person', name: 'Vasily Ilin' }
	],
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Seattle',
		addressRegion: 'WA',
		addressCountry: 'US'
	},
	sameAs: [
		'https://github.com/uw-math-ai',
		'https://huggingface.co/uw-math-ai',
		'https://math.washington.edu/events/series/math-ai-seminar'
	]
};

export const website = {
	'@type': 'WebSite',
	'@id': websiteId,
	url: `${canonicalOrigin}/`,
	name: 'UW Math AI Lab',
	publisher: { '@id': organizationId },
	inLanguage: 'en-US'
};

export function graph(...nodes: unknown[]) {
	return { '@context': 'https://schema.org', '@graph': nodes };
}

export function breadcrumbs(trail: Array<{ name: string; path: string }>) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: trail.map((entry, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: entry.name,
			item: canonicalUrl(entry.path)
		}))
	};
}

export function collectionPage(name: string, path: string, description: string) {
	return {
		'@type': 'CollectionPage',
		'@id': `${canonicalUrl(path)}#page`,
		name,
		url: canonicalUrl(path),
		description,
		isPartOf: { '@id': websiteId },
		about: { '@id': organizationId },
		inLanguage: 'en-US'
	};
}
