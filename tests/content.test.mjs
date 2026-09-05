import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { gzipSync } from 'node:zlib';

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null } });
after(() => server.close());
const { parseContent } = await server.ssrLoadModule('/scripts/yaml-content.ts');
const { projectQuarters, getProjectQuarter, totalProjectCount } = await server.ssrLoadModule('/src/lib/data/projects.ts');
const { labEvents, eventDate } = await server.ssrLoadModule('/src/lib/data/events.ts');
const { labNews } = await server.ssrLoadModule('/src/lib/data/news.ts');
const { researchSections, totalPaperCount, searchResearch } = await server.ssrLoadModule('/src/lib/data/research.ts');
const { renderMarkdown, renderInline } = await server.ssrLoadModule('/src/lib/content/markdown.ts');
const { compileMathSymbols } = await server.ssrLoadModule('/scripts/math-symbols.ts');
const { createSymbolPicker, symbolSize } = await server.ssrLoadModule('/src/lib/ambient-symbols.ts');
const mathSource = parseContent(await readFile('src/content/math-symbols.yaml', 'utf8'), 'src/content/math-symbols.yaml');
const mathAtlas = await compileMathSymbols(mathSource);

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

test('historical mathlib entries retain named credits, dates, and distinct PR status', () => {
	const artifacts = researchSections.find((section) => section.id === 'research-artifacts');
	assert.equal(artifacts.countsAsPaper, false);
	assert.equal(totalPaperCount, researchSections.filter((section) => section.countsAsPaper).reduce((sum, section) => sum + section.items.length, 0));
	const expected = [
		[37527, 2026, 'Bryan Boehnke, George Peykanu, Bianca Viray, Grant Yang'],
		[36421, 2026, 'Grant Yang, George Peykanu, Bryan Boehnke, Bianca Viray'],
		[32851, 2026, 'Theodore Meek'],
		[32824, 2025, 'Vasily Ilin, Leo Mayer'],
		[29574, 2025, 'Jarod Alper, Brian Nugent'],
		[19886, 2025, 'Vasily Ilin, Siyuan Ge'],
		[19896, 2025, 'Vasily Ilin, Siyuan Ge'],
		[19798, 2024, 'Vasily Ilin, Siyuan Ge'],
		[4593, 2023, 'Anne Baanen, Sam v. Gool, Leo Mayer, Brendan S. Murphy']
	];
	for (const [id, year, authors] of expected) {
		const matches = artifacts.items.filter((item) => item.url === `https://github.com/leanprover-community/mathlib4/pull/${id}`);
		assert.equal(matches.length, 1);
		assert.equal(matches[0].authors, authors);
		assert.equal(matches[0].venue, `Mathlib ${id === 29574 ? 'Pull Request' : 'Contribution'}, ${year}`);
		assert.equal(matches[0].badge, id === 29574 ? 'Open PR' : 'Merged');
	}
	assert.equal(new Set(artifacts.items.map((item) => item.url)).size, artifacts.items.length);
	for (const item of artifacts.items) assert.doesNotMatch(item.authors, /UW Math AI Lab|group/i);
	for (const year of [2022, 2023, 2024, 2025]) {
		assert.ok(artifacts.items.some((item) => item.linkLabel === 'Code' && item.venue.includes(String(year))));
	}
});

test('research search covers every section and card field, including links and badges', () => {
	for (const section of researchSections) {
		for (const query of [section.title, section.description]) {
			assert.deepEqual(searchResearch(query).find((result) => result.id === section.id)?.items, section.items, query);
		}
		for (const item of section.items) {
			for (const field of ['title', 'authors', 'abstract', 'venue', 'badge', 'linkLabel', 'url']) {
				if (!item[field]) continue;
				assert.ok(searchResearch(item[field]).flatMap((result) => result.items).includes(item), `${item.title}: ${field}`);
			}
		}
	}
	assert.equal(searchResearch('37527').flatMap((section) => section.items)[0].url, 'https://github.com/leanprover-community/mathlib4/pull/37527');
});

test('research search handles word order, whitespace, accents, clearing, and no matches', () => {
	const matches = (query) => searchResearch(query).flatMap((section) => section.items);
	// Includes the numerical-analysis paper: Siyuan is an author and its abstract mentions Mathlib.
	assert.equal(matches('  SIYUAN   mathlib  ').length, 4);
	assert.deepEqual(matches('mathlib Siyuan'), matches('Siyuan mathlib'));
	assert.ok(matches('etale').some((item) => item.url.endsWith('/37527')));
	assert.ok(matches('Hilbert’s Basis').some((item) => item.url.endsWith('/WXML_Sp2022')));
	assert.deepEqual(searchResearch(' \n\t '), researchSections);
	assert.deepEqual(searchResearch('no-such-research-xyz'), []);
	assert.deepEqual(searchResearch(''), researchSections);
});

test('all curated notation compiles to a compact, self-contained vector atlas', () => {
	const items = mathSource.flatMap((group) => group.items);
	assert.equal(mathAtlas.symbols.length, items.length);
	assert.ok(mathSource.length >= 12);
	assert.ok(items.length >= 100);
	assert.match(mathAtlas.svg, /<path /);
	assert.doesNotMatch(mathAtlas.svg, /<(?:text|image|foreignObject|script)\b|(?:href|url\()|merror|data-mjx-error/i);
	assert.ok(gzipSync(mathAtlas.svg).length < 100_000, 'compressed atlas stays under 100 KB');
	const width = Number(mathAtlas.svg.match(/width="(\d+)"/)[1]);
	const height = Number(mathAtlas.svg.match(/height="(\d+)"/)[1]);
	for (const symbol of mathAtlas.symbols) {
		assert.ok(symbol.width > 0 && symbol.height > 0);
		assert.ok(symbol.x >= 0 && symbol.y >= 0 && symbol.x + symbol.width <= width && symbol.y + symbol.height <= height);
		for (const other of mathAtlas.symbols) {
			if (other === symbol) continue;
			assert.ok(symbol.x + symbol.width <= other.x || other.x + other.width <= symbol.x
				|| symbol.y + symbol.height <= other.y || other.y + other.height <= symbol.y, 'atlas cells do not overlap');
		}
	}
	assert.ok(items.some((item) => item.id === 'serre-spectral-sequence' && item.note.includes('simply connected')));
	for (const id of ['pointed-curves', 'motivic-k-theory', 'chromatic-sphere', 'bundles', 'boltzmann-equation', 'wrapped-fukaya', 'o-minimal-structure', 'kakeya-dimension']) {
		assert.ok(items.some((item) => item.id === id), id);
	}
	assert.ok(!items.some((item) => ['(A,I)', '\\varphi', 'X^\\flat', '\\mathcal R'].includes(item.tex)), 'omit context-free fragments');
});

test('equations retain both sides and operators in a single atlas cell', async () => {
	const compile = (tex) => compileMathSymbols([{ id: 'test', title: 'Test', items: [{ id: 'equation', name: 'Equation', tex }] }]);
	const [left, equation] = await Promise.all([compile('A'), compile('A=B+C')]);
	assert.ok(equation.symbols[0].width > left.symbols[0].width * 4);
	assert.equal((equation.svg.match(/<path\b/g) ?? []).length, 5, 'A, equals, B, plus, and C are all present');
});

test('notation validation rejects duplicate entries and invalid TeX with the entry ID', async () => {
	const sample = [{ id: 'test-field', title: 'Test', items: [{ id: 'test-expression', name: 'Test expression', tex: '\\frac{' }] }];
	await assert.rejects(compileMathSymbols(sample), /test-field\.test-expression/);
	sample[0].items[0].tex = '\\NotARealMathCommand';
	await assert.rejects(compileMathSymbols(sample), /test-field\.test-expression/);
	sample[0].items[0].tex = '\\mathbb S';
	sample[0].items.push({ ...sample[0].items[0] });
	assert.throws(() => parseContent(JSON.stringify(sample), 'src/content/math-symbols.yaml'), /Duplicate math symbol ID/);
	sample[0].items[1].id = 'another-expression';
	assert.throws(() => parseContent(JSON.stringify(sample), 'src/content/math-symbols.yaml'), /Duplicate math notation/);
});

test('notation selection balances fields, avoids repeats, and preserves readable mobile dimensions', () => {
	const pick = createSymbolPicker(mathAtlas.symbols, () => 0.4);
	const fields = new Set(mathAtlas.symbols.filter((symbol) => symbol.kind === 'object' && symbol.width / 64 * 14 <= 220).map((symbol) => symbol.field));
	const seen = new Set();
	const used = new Set();
	for (let i = 0; i < fields.size; i++) {
		const symbol = pick('object', 220, used);
		assert.ok(!seen.has(symbol.field));
		assert.ok(!used.has(symbol.id));
		seen.add(symbol.field);
		used.add(symbol.id);
	}
	for (const kind of ['symbol', 'object', 'formula']) {
		for (let i = 0; i < 100; i++) {
			const symbol = pick(kind, 220);
			const size = symbolSize(symbol, 24, 220);
			assert.equal(symbol.kind, kind);
			assert.ok(size.width <= 220 + 0.001 && size.height > 0);
			assert.ok(size.width / symbol.width * 64 >= 14 - 0.001, 'never shrink below 14px type');
			assert.ok(Math.abs(size.width / size.height - symbol.width / symbol.height) < 0.001);
		}
	}
});
