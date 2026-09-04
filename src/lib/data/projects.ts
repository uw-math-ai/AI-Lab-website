import type { ProjectQuarter } from '$lib/content/schema';
export type { ProjectQuarter } from '$lib/content/schema';

const quarterFiles = import.meta.glob<ProjectQuarter>('../../content/projects/*.yaml', {
	eager: true,
	import: 'default'
});
const termOrder = { Winter: 0, Spring: 1, Summer: 2, Fall: 3 };

export const projectQuarters = Object.values(quarterFiles).sort(
	(a, b) => b.year - a.year || termOrder[b.term] - termOrder[a.term]
);

// Count newly launched projects only; continuing teams are not counted twice.
const projectCountThroughSpring2026 = 59;
export const totalProjectCount = projectQuarters.reduce(
	(total, quarter) => total + (quarter.projectsLaunched ?? 0),
	projectCountThroughSpring2026
);

export function getProjectQuarter(slug: string) {
	return projectQuarters.find((quarter) => quarter.slug === slug);
}
