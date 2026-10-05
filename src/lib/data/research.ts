import content from '../../content/research.yaml';
import type { ResearchSection } from '$lib/content/schema';
export type { ResearchEntry, ResearchSection } from '$lib/content/schema';

export const researchSections = content as ResearchSection[];
const featuredItems = researchSections.flatMap((section) => section.items).filter((item) => item.featured);
const pinned = (item: (typeof featuredItems)[number]) => (typeof item.featured === 'number' ? item.featured : Infinity);
// Numbered entries come first in numeric order; the rest keep their order in research.yaml (sort is stable).
export const featuredResearch = featuredItems.toSorted((a, b) => pinned(a) - pinned(b));
export const totalPaperCount = researchSections.filter((section) => section.countsAsPaper).reduce((total, section) => total + section.items.length, 0);

function normalizeSearch(value: string): string {
	return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
		.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[‐‑–—]/g, '-');
}

/** Search every field on the card (not the section's title or description), with all query words required in any order. */
export function searchResearch(query: string): ResearchSection[] {
	const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
	if (!terms.length) return researchSections;

	return researchSections
		.map((section) => ({
			...section,
			items: section.items.filter((item) => {
				const haystack = normalizeSearch([
					...item.venues.flatMap((venue) => [venue.name, venue.badge ?? '']),
					item.title, item.authors, item.abstract, item.linkLabel, item.url
				].join(' '));
				return terms.every((term) => haystack.includes(term));
			})
		}))
		.filter((section) => section.items.length);
}
