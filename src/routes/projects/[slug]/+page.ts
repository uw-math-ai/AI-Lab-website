import { error } from '@sveltejs/kit';
import { getProjectQuarter, projectQuarters } from '$lib/data/projects';

export const entries = () => projectQuarters.map((quarter) => ({ slug: quarter.slug }));

export function load({ params }) {
	const quarter = getProjectQuarter(params.slug);
	if (!quarter) error(404, 'Project quarter not found');
	return { quarter };
}
