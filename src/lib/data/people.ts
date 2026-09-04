import content from '../../content/people.yaml';
import type { z } from 'zod';
import type { peopleSchema } from '$lib/content/schema';
export type { PersonCard, LabPhoto } from '$lib/content/schema';

const people = content as z.infer<typeof peopleSchema>;
export const { leadership, projectLeaders, members, photos: labPhotos } = people;
const roster = [...leadership, ...projectLeaders, ...members];

export const participantCounts = {
	undergraduate: people.participationBaseline.undergraduate +
		roster.filter((person) => person.counterStartQuarter && person.studentLevel === 'undergraduate').length,
	graduate: people.participationBaseline.graduate +
		roster.filter((person) => person.counterStartQuarter && person.studentLevel === 'graduate').length,
	professor: people.participationBaseline.professor
};

export function initials(name: string) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
}
