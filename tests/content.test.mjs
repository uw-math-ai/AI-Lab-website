import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null } });
after(() => server.close());
const { parseContent } = await server.ssrLoadModule('/scripts/yaml-content.ts');
const { projectQuarters, getProjectQuarter, totalProjectCount } = await server.ssrLoadModule('/src/lib/data/projects.ts');
const { labEvents, eventDate } = await server.ssrLoadModule('/src/lib/data/events.ts');
const { labNews } = await server.ssrLoadModule('/src/lib/data/news.ts');
const { renderMarkdown, renderInline } = await server.ssrLoadModule('/src/lib/content/markdown.ts');

test('every editable YAML file validates through the production content loader', async () => {
	async function visit(directory) {
		for (const entry of await readdir(directory, { withFileTypes: true })) {
			const filename = `${directory}/${entry.name}`;
			if (entry.isDirectory()) await visit(filename);
			else if (filename.endsWith('.yaml')) assert.ok(parseContent(await readFile(filename, 'utf8'), filename));
		}
	}
	await visit('src/content');
});

test('YAML quarters retain chronological routing and cumulative project counts', async () => {
	const files = (await readdir('src/content/projects')).filter((file) => file.endsWith('.yaml'));
	assert.equal(projectQuarters.length, files.length);
	const order = { Winter: 0, Spring: 1, Summer: 2, Fall: 3 };
	const dates = projectQuarters.map((quarter) => quarter.year * 4 + order[quarter.term]);
	assert.deepEqual(dates, dates.toSorted((a, b) => b - a));
	assert.equal(new Set(projectQuarters.map((quarter) => quarter.slug)).size, projectQuarters.length);
	assert.equal(totalProjectCount, 59 + projectQuarters.reduce((total, quarter) => total + (quarter.projectsLaunched ?? 0), 0));
	for (const quarter of projectQuarters) assert.equal(getProjectQuarter(quarter.slug), quarter);
	assert.equal(getProjectQuarter('missing-quarter'), undefined);
});

test('invalid YAML edits fail with the filename and field, before rendering', () => {
	const filename = 'src/content/projects/fall-2026.yaml';
	const source = `slug: fall-2026
legacyFile: fall2026.html
label: Fall 2026
term: Fall
year: 2026
status: current
lastmod: 2026-08-23
summary: A test quarter
blocks:
  - type: heading
    title: Continuing Projects
    id: continuing-projects
    level: 2
  - type: project
    title: Infrastructure
    id: infrastructure
`;
	assert.ok(parseContent(source, filename));
	assert.throws(() => parseContent(source.replace('year: 2026', 'year: twenty-six'), filename), /fall-2026\.yaml:[\s\S]*year/);
	assert.throws(() => parseContent(`${source}\nslug: duplicate\n`, filename), /fall-2026\.yaml:[\s\S]*unique/);
	assert.throws(() => parseContent(source.replace('2026-08-23', '2026-02-30'), filename), /lastmod/);
	assert.throws(() => parseContent(source.replace('summary:', 'summmary:'), filename), /summmary/);
	assert.throws(() => parseContent(source.replace('slug: fall-2026', 'slug: fall-2027'), filename), /slug must match/);
	assert.throws(() => parseContent(source.replace('id: infrastructure', 'id: continuing-projects'), filename), /Duplicate anchor/);
});

test('event dates and times stay strings and preserve descending calendar order', () => {
	for (const event of labEvents) {
		assert.equal(typeof event.date, 'string');
		assert.equal(typeof event.startTime, 'string');
		assert.ok(Number.isFinite(new Date(`${event.date}T${event.startTime}:00`).getTime()));
	}
	assert.deepEqual(labEvents.map((event) => event.date), labEvents.map((event) => event.date).toSorted().reverse());
});

test('Markdown preserves math, nested lists, links, and blocks executable HTML', () => {
	assert.match(renderInline('0 < s < 1 and `a < b`'), /0 &lt; s &lt; 1 and <code>a &lt; b<\/code>/);
	assert.match(renderMarkdown('- Topic\n  - [Lean](https://lean-lang.org/)'), /<ul>[\s\S]*<ul>[\s\S]*href="https:\/\/lean-lang.org\/"/);
	assert.doesNotMatch(renderMarkdown('<script>alert(1)</script>\n\n[bad](javascript:alert(1))'), /<script>|href="javascript:/);
	assert.match(renderInline('[Slides](/slides/test.pdf)'), /href="\/slides\/test.pdf"/);
});

test('conference events retain verified dates, venue time zones, and source links', () => {
	const tag = labEvents.find((event) => event.speaker === 'Samarth Rao');
	assert.ok(tag);
	assert.equal(tag.date, '2026-08-19');
	assert.equal(tag.startTime, '10:20');
	assert.equal(tag.endTime, '10:40');
	assert.equal(eventDate(tag).toISOString(), '2026-08-19T14:20:00.000Z');
	assert.ok(tag.links.some((link) => link.url === 'https://openreview.net/forum?id=kwzRA4f5zB'));
	assert.ok(tag.links.some((link) => link.url.includes('13TMYcYC61R5DncvyIFGe_LLyjlJx0WloeLjd73mmaws')));
	const ieee = labEvents.find((event) => event.title === 'StabilizerBench at IEEE QCE 2026');
	assert.ok(ieee);
	assert.equal(eventDate(ieee).toISOString(), '2026-09-13T17:00:00.000Z');
	assert.equal(ieee.endTime, '14:30');
	assert.match(ieee.abstract, /full session/);
	assert.equal(ieee.timeZoneLabel, 'EDT');
	assert.equal(ieee.organizer.name, 'IEEE Quantum Week');
});

test('news has independent historical dates, chronological ordering, and unique IDs', () => {
	assert.deepEqual(labNews.map((item) => item.date), labNews.map((item) => item.date).toSorted().reverse());
	assert.equal(labNews.find((item) => item.id === 'samarth-rao-tag-ds-2026').date, '2026-08-19');
	assert.equal(labNews.find((item) => item.id === 'stabilizerbench-ieee-qce-2026').date, '2026-07-06');
	const item = JSON.stringify({ id: 'news-fixture', date: '2026-08-19', title: 'News', summary: 'Summary', links: [{ label: 'Source', url: 'https://example.com/' }] });
	assert.throws(() => parseContent(`[${item},${item}]`, 'src/content/news.yaml'), /Duplicate news ID/);
	assert.throws(() => parseContent(`[${item.replace('2026-08-19', '2026-02-30')}]`, 'src/content/news.yaml'), /date/);
});
