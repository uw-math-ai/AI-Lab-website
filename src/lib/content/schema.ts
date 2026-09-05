import { z } from 'zod';

const text = z.string().min(1);
const id = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphen-separated ID');
const date = z.iso.date();
const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:mm');
const url = text.refine(
	(value) => /^https?:\/\//.test(value) || (value.startsWith('/') && !value.startsWith('//')) || value.startsWith('#'),
	'Use an http(s) URL, a site path starting with /, or a #fragment'
);
const link = z.strictObject({ label: text, url });
const photo = z.strictObject({
	src: url,
	alt: text,
	caption: text,
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional()
});

export const contentBlockSchema = z.discriminatedUnion('type', [
	z.strictObject({ type: z.literal('text'), content: text }),
	z.strictObject({ type: z.literal('heading'), title: text, id, level: z.union([z.literal(2), z.literal(3)]) }),
	z.strictObject({
		type: z.literal('project'),
		title: text,
		id,
		style: z.enum(['heading', 'list']).default('heading'),
		intro: text.optional(),
		details: z.array(z.strictObject({ label: text.optional(), content: z.string() })).optional(),
		content: text.optional()
	}),
	z.strictObject({ type: z.literal('quote'), content: text, attribution: text.optional() }),
	z.strictObject({ type: z.literal('image'), src: url, alt: text, width: z.number().int().positive().optional() })
]);

const blocks = z.array(contentBlockSchema).min(1).superRefine((items, ctx) => {
	const ids = new Set<string>();
	for (const [index, item] of items.entries()) {
		if (!('id' in item)) continue;
		if (ids.has(item.id)) ctx.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate anchor: ${item.id}` });
		ids.add(item.id);
	}
});

export const projectQuarterSchema = z.strictObject({
	slug: id,
	legacyFile: text.regex(/^[a-z]+\d{4}\.html$/),
	label: text,
	term: z.enum(['Spring', 'Summer', 'Fall', 'Winter']),
	year: z.number().int().min(2022),
	status: z.enum(['current', 'recent', 'archive']),
	lastmod: date,
	venue: text.optional(),
	projectsLaunched: z.number().int().nonnegative().optional(),
	summary: text,
	blocks
});
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type ProjectQuarter = z.infer<typeof projectQuarterSchema>;

export const resourceSchema = z.strictObject({ blocks });

export const eventSchema = z.strictObject({
	title: text,
	speaker: text,
	date,
	startTime: time,
	endTime: time,
	utcOffset: z.string().regex(/^[+-](?:0\d|1[0-4]):[0-5]\d$/).optional(),
	timeZoneLabel: text.optional(),
	organizer: z.strictObject({ name: text, url }).optional(),
	location: text,
	type: z.enum(['Seminar', 'Workshop', 'Conference', 'Poster Session', 'Final Exam', 'Information Session', 'Colloquium', 'Social', 'Announcement']),
	sourceUrl: url.optional(),
	sourceLabel: text.optional(),
	links: z.array(link).optional(),
	abstract: text.optional(),
	details: z.array(text).optional(),
	papers: z.array(z.strictObject({ title: text, url, badge: z.enum(['Oral presentation', 'Spotlight']).optional() })).optional(),
	photos: z.array(photo).optional()
});
export type LabEvent = z.infer<typeof eventSchema>;

export const newsSchema = z.array(z.strictObject({
	id,
	date,
	title: text,
	summary: text,
	links: z.array(link).min(1)
})).superRefine((items, ctx) => {
	const ids = new Set<string>();
	for (const [index, item] of items.entries()) {
		if (ids.has(item.id)) ctx.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate news ID: ${item.id}` });
		ids.add(item.id);
	}
});
export type NewsItem = z.infer<typeof newsSchema>[number];

const person = z.strictObject({
	name: text,
	role: text,
	image: url.optional(),
	url: url.optional(),
	studentLevel: z.enum(['undergraduate', 'graduate']).optional(),
	counterStartQuarter: id.optional()
});
export const peopleSchema = z.strictObject({
	participationBaseline: z.strictObject({ undergraduate: z.number().int().nonnegative(), graduate: z.number().int().nonnegative(), professor: z.number().int().nonnegative() }),
	leadership: z.array(person).min(1),
	projectLeaders: z.array(person),
	members: z.array(person),
	photos: z.array(photo)
});
export type PersonCard = z.infer<typeof person>;
export type LabPhoto = z.infer<typeof photo>;

const researchEntry = z.strictObject({
	venue: text,
	title: text,
	authors: text,
	abstract: text,
	url,
	linkLabel: text,
	badge: text.optional(),
	featured: z.boolean().optional()
});
const researchSection = z.strictObject({ id, title: text, description: text, countsAsPaper: z.boolean(), items: z.array(researchEntry).min(1) });
export type ResearchEntry = z.infer<typeof researchEntry>;
export type ResearchSection = z.infer<typeof researchSection>;

const tool = z.strictObject({
	id,
	name: text,
	description: text,
	url,
	poster: url,
	posterAlt: text,
	stats: z.array(z.strictObject({ value: text, label: text })),
	links: z.array(link),
	credit: text
});
export type LabTool = z.infer<typeof tool>;

const page = z.strictObject({ title: text, description: text, path: url, lastmod: date });
export const pagesSchema = z.strictObject({ home: page, projects: page, research: page, people: page, events: page, resources: page });

export const mathSymbolsSchema = z.array(z.strictObject({
	id,
	title: text,
	items: z.array(z.strictObject({
		id,
		name: text,
		tex: text,
		kind: z.enum(['symbol', 'object', 'formula']).default('object'),
		note: text.optional(),
		source: z.url().optional()
	})).min(1)
})).min(1).superRefine((groups, ctx) => {
	const ids = new Set<string>();
	const formulas = new Set<string>();
	for (const [g, group] of groups.entries()) {
		if (ids.has(group.id)) ctx.addIssue({ code: 'custom', path: [g, 'id'], message: 'Duplicate math group ID' });
		ids.add(group.id);
		for (const [i, item] of group.items.entries()) {
			if (ids.has(item.id)) ctx.addIssue({ code: 'custom', path: [g, 'items', i, 'id'], message: 'Duplicate math symbol ID' });
			if (formulas.has(item.tex)) ctx.addIssue({ code: 'custom', path: [g, 'items', i, 'tex'], message: 'Duplicate math notation' });
			ids.add(item.id);
			formulas.add(item.tex);
		}
	}
});
export type MathSymbolGroups = z.infer<typeof mathSymbolsSchema>;

export function schemaForContentFile(filename: string) {
	if (/\/projects\/[^/]+\.yaml$/.test(filename)) return projectQuarterSchema;
	if (/\/resources\/[^/]+\.yaml$/.test(filename)) return resourceSchema;
	if (filename.endsWith('/events.yaml')) return z.array(eventSchema).min(1);
	if (filename.endsWith('/news.yaml')) return newsSchema;
	if (filename.endsWith('/people.yaml')) return peopleSchema;
	if (filename.endsWith('/research.yaml')) return z.array(researchSection).min(1);
	if (filename.endsWith('/tools.yaml')) return z.array(tool).min(1);
	if (filename.endsWith('/pages.yaml')) return pagesSchema;
	if (filename.endsWith('/math-symbols.yaml')) return mathSymbolsSchema;
	throw new Error(`No content schema registered for ${filename}`);
}
