import content from '../../content/research.yaml';
import type { ResearchSection } from '$lib/content/schema';
export type { ResearchEntry, ResearchSection } from '$lib/content/schema';

export const researchSections = content as ResearchSection[];
export const featuredResearch = researchSections.flatMap((section) => section.items).filter((item) => item.featured);
export const totalPaperCount = researchSections.filter((section) => section.countsAsPaper).reduce((total, section) => total + section.items.length, 0);
