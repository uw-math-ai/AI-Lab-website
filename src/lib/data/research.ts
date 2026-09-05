import content from '../../content/research.yaml';
import type { ResearchSection } from '$lib/content/schema';
export type { ResearchEntry, ResearchSection } from '$lib/content/schema';

export const researchSections = content as ResearchSection[];
export const featuredResearch = researchSections.flatMap((section) => section.items).filter((item) => item.featured);
export const totalPaperCount = researchSections.filter((section) => section.countsAsPaper).reduce((total, section) => total + section.items.length, 0);

function normalizeSearch(value: string): string {
	return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
		.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[‐‑–—]/g, '-');
}

/** Search the complete card and its section, with all query words required in any order. */
export function searchResearch(query: string): ResearchSection[] {
	const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
	if (!terms.length) return researchSections;

	return researchSections
		.map((section) => ({
			...section,
			items: section.items.filter((item) => {
				const haystack = normalizeSearch([
					section.title, section.description, item.venue, item.title, item.authors,
					item.abstract, item.badge ?? '', item.linkLabel, item.url
				].join(' '));
				return terms.every((term) => haystack.includes(term));
			})
		}))
		.filter((section) => section.items.length);
}
