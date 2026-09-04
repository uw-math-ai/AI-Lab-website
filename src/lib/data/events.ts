import content from '../../content/events.yaml';
import type { LabEvent } from '$lib/content/schema';
export type { LabEvent } from '$lib/content/schema';

// YAML is validated at build time. Keep sorting and date behavior shared across pages.
export const labEvents = (content as LabEvent[]).toSorted(
	(a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime)
);

export function eventDate(event: LabEvent) {
	return new Date(`${event.date}T${event.startTime}:00${event.utcOffset ?? ''}`);
}
