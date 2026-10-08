import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { parse as parseYaml } from 'yaml';
import { parse as parseHtml } from 'parse5';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({ html: false });
function all(node, predicate) {
	return [...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap((child) => all(child, predicate))];
}
function text(node) {
	if (['script', 'style'].includes(node.tagName)) return '';
	return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
}
const attr = (node, name) => node.attrs?.find((item) => item.name === name)?.value;
const compact = (value) => value.replace(/\s/g, '');
const markdownText = (value) => compact(text(parseHtml(markdown.render(value))));

test('Fall 2026 retains the approved titles and abstracts in four groups', async () => {
	// Hashes track the supplied lineup and subsequent user-approved revisions,
	// including the submitted probability and Lean Refactor descriptions.
	const approved = JSON.parse(await readFile('tests/fixtures/fall-2026-approved.json', 'utf8'));
	const quarter = parseYaml(await readFile('src/content/projects/fall-2026.yaml', 'utf8'));
	const projects = quarter.blocks.filter((block) => block.type === 'project');
	assert.equal(projects.length, 14);
	assert.equal(approved.length, 14);
	const page = parseHtml(await readFile('build/projects/fall-2026/index.html', 'utf8'));
	for (const original of approved) {
		const project = projects.find((item) => item.id === original.id);
		assert.ok(project, original.title);
		assert.equal(project.title, original.title);
		const abstract = project.details.find((detail) => detail.label.startsWith('Abstract')).content;
		assert.equal(createHash('sha256').update(abstract).digest('hex'), original.abstractSha256, `${original.title}: unchanged abstract`);
		const heading = all(page, (node) => attr(node, 'id') === original.id)[0];
		assert.equal(text(heading), original.title);
		const labels = all(page, (node) => node.tagName === 'b' && text(node).startsWith('Abstract'));
		assert.ok(labels.some((label) => compact(text(label.parentNode).slice(text(label).length)) === markdownText(abstract)), `${original.title}: rendered abstract is verbatim`);
	}
	const expected = [
		['Autoresearch', [2, 12, 3, 4, 11, 9]],
		['Formalization & Autoformalization', [0, 1, 5, 8]],
		['Mathematical Machine Learning', [10, 13]],
		['Math Education', [6, 7]]
	];
	let group = -1;
	const actual = [];
	for (const block of quarter.blocks) {
		if (block.type === 'heading') { group++; actual.push([block.title, []]); }
		if (block.type === 'project') actual[group][1].push(block.id);
	}
	assert.deepEqual(actual, expected.map(([title, indices]) => [title, indices.map((index) => approved[index].id)]));
	const toc = all(page, (node) => attr(node, 'aria-label') === 'Page sections')[0];
	assert.ok(toc);
	assert.deepEqual(all(toc, (node) => node.tagName === 'a').map(text), expected.map(([title]) => title));
	assert.doesNotMatch(text(page), /ABSTRACT NEEDED|Proposed New Projects|Possibly Returning|Applications for Fall 2026 project leaders are open/);
});

test('Fall 2026 Math2Vec retains its description with the expired deadline removed', async () => {
	const spring = parseYaml(await readFile('src/content/projects/spring-2026.yaml', 'utf8'));
	const fall = parseYaml(await readFile('src/content/projects/fall-2026.yaml', 'utf8'));
	const previous = spring.blocks.find((block) => block.id === 'mathematician-s-copilot-math2vec');
	const restored = fall.blocks.find((block) => block.id === previous.id);
	assert.equal(restored.title, "Mathematician's Copilot: Math2Vec");
	assert.equal(restored.details.find((detail) => detail.label === 'Abstract:').content,
		previous.details.find((detail) => detail.label === 'Description:').content.replace(' Goal: submit to EMNLP 2026 in May.', ''));
	assert.equal(restored.details.find((detail) => detail.label === 'Project Leader:').content, 'Henry Kvinge');
	assert.match(restored.details.find((detail) => detail.label === 'Start here:').content, /2606\.23959/);
});

test('Fall 2026 labels its dates and meetings and credits both co-mentorships', async () => {
	const quarter = parseYaml(await readFile('src/content/projects/fall-2026.yaml', 'utf8'));
	const page = parseHtml(await readFile('build/projects/fall-2026/index.html', 'utf8'));
	const meeting = all(page, (node) => node.tagName === 'p' && text(node).startsWith('Project meetings:'))[0];
	assert.ok(meeting);
	assert.equal(text(meeting), 'Project meetings: Mondays & Wednesdays, 4:00 - 5:30 pm, OUG 136. Teams may use different meeting times, but must meet in person at least once a week. Project-specific schedules are listed below.');
	assert.deepEqual(all(meeting, (node) => node.tagName === 'strong').map(text), ['Project meetings:']);
	assert.doesNotMatch(text(page), /Applications closed/);
	for (const id of ['mathematical-taste-recognizing-progress-beyond-generation', 'formalizing-the-kls-conjecture-and-stochastic-localization']) {
		const project = quarter.blocks.find((block) => block.id === id);
		assert.equal(project.details.find((detail) => detail.label === 'Co-mentor:').content, 'Will Dudarov');
	}
	const mentors = all(page, (node) => node.tagName === 'b' && text(node) === 'Co-mentor:');
	assert.equal(mentors.filter((label) => text(label.parentNode).includes('Will Dudarov')).length, 2);
});

test('Fall rosters include all 60 students and distinguish student placements from other roles', async () => {
	const roster = JSON.parse(await readFile('tests/fixtures/fall-2026-rosters.json', 'utf8'));
	const quarter = parseYaml(await readFile('src/content/projects/fall-2026.yaml', 'utf8'));
	const page = parseHtml(await readFile('build/projects/fall-2026/index.html', 'utf8'));
	const students = roster.projects.flatMap((project) => project.students);
	assert.equal(students.length, 61);
	assert.equal(new Set(students).size, 60);
	assert.deepEqual([...new Set(students.filter((name, i) => students.indexOf(name) !== i))], ['David Javnozon']);
	for (const expected of roster.projects) {
		const project = quarter.blocks.find((block) => block.id === expected.id);
		assert.ok(project, expected.title);
		const members = project.details.find((detail) => detail.label === (expected.roster_label ?? 'Student members:'));
		assert.equal(members?.content, expected.roster_label ? expected.continuing_members.join(', ') : expected.students.length ? expected.students.join(', ') : 'No student members.');
		const names = (content) => content.replace(/<[^>]+>/g, '').split(',').map((name) => name.trim());
		assert.deepEqual(names(project.details.find((detail) => /^Project Leaders?:$/.test(detail.label)).content), expected.leads);
		if (expected.graduate_mentors) assert.deepEqual(names(project.details.find((detail) => detail.label === 'Graduate mentors:').content), expected.graduate_mentors);
		for (const name of [...expected.leads, ...expected.students, ...(expected.co_mentors ?? []), ...(expected.graduate_mentors ?? []), ...(expected.continuing_members ?? [])]) {
			assert.ok(text(page).includes(name), `${expected.title}: ${name} is visible`);
		}
	}
	const benchmarks = quarter.blocks.find((block) => block.id === 'autoformalizing-mathematical-benchmarks');
	assert.equal(benchmarks.details.find((detail) => detail.label === 'Continuing members:').content, 'Michael R. Zeng, Pei Li, Simon Kurgan');
	assert.doesNotMatch(text(page), /ProofMem|Naomi Morato|Donovan Falls|Ben Eng|Ruoke Zhang|Junye Ji|not confirmed|rejection email/i);
});

test('Fall meeting slides are linked from the home announcement and the Fall page, and dates match the saved deck', async () => {
	const home = parseHtml(await readFile('build/index.html', 'utf8'));
	const fall = parseHtml(await readFile('build/projects/fall-2026/index.html', 'utf8'));
	const buttons = (page) => all(page, (node) => node.tagName === 'a' && attr(node, 'class')?.split(' ').includes('button') && attr(node, 'href')?.endsWith('/slides/fall-2026/'));
	// The home hero no longer carries a slides button; the announcement section does.
	assert.equal(buttons(home).length, 1);
	assert.equal(buttons(fall).length, 1);
	assert.match(text(fall), /Social event: Wednesday, November 4/);
	assert.match(text(fall), /Final presentations: Wednesday, December 9/);
	assert.doesNotMatch(text(fall), /Final presentations: Thursday, December 10/);
	assert.match(text(fall), /must meet in person at least once a week/);
	const audience = parseHtml(await readFile('build/slides/fall-2026/index.html', 'utf8'));
	const data = JSON.parse(all(audience, (node) => attr(node, 'id') === 'audience-data')[0].childNodes[0].value);
	assert.equal(data.slides.length, 24);
	assert.equal(data.slides.at(-1).id, 'slide-1791162535932');
	assert.ok(!all(audience, (node) => attr(node, 'id') === 'editor').length);
});

test('research totals and the section index share number-and-label counters', async () => {
	const sections = parseYaml(await readFile('src/content/research.yaml', 'utf8'));
	const page = parseHtml(await readFile('build/research/index.html', 'utf8'));
	const nav = all(page, (node) => node.tagName === 'nav' && attr(node, 'aria-label') === 'Research sections')[0];
	const assertCounter = (node, count, label) => {
		const counter = all(node, (child) => attr(child, 'class')?.split(' ').includes('research-stat'))[0];
		assert.ok(counter, 'uses the shared counter treatment');
		assert.equal(text(all(counter, (child) => child.tagName === 'strong')[0]), String(count));
		assert.equal(text(all(counter, (child) => attr(child, 'class')?.split(' ').includes('research-stat-label'))[0]), label);
		assert.doesNotMatch(text(counter), /\(\d+\)/);
	};
	assertCounter(nav, sections.reduce((total, section) => total + section.items.length, 0), 'listed works');
	for (const section of sections) {
		const renderedSection = all(page, (node) => attr(node, 'id') === section.id)[0];
		const heading = all(renderedSection, (node) => node.tagName === 'h2')[0];
		const link = all(nav, (node) => attr(node, 'href') === `#${section.id}`)[0];
		assert.equal(text(heading).trim(), section.title);
		assertCounter(link, section.items.length, section.title);
		assert.equal(all(renderedSection, (node) => node.tagName === 'article').length, section.items.length);
	}
});

test('all YAML blocks survive prerendering with their text, links, and bookmarks intact', async () => {
	const quarters = (await readdir('src/content/projects')).filter((filename) => filename.endsWith('.yaml'));
	const sources = quarters.map((filename) => ({ filename: `src/content/projects/${filename}`, route: `projects/${filename.replace('.yaml', '')}`, index: 0 }));
	sources.push(...['seminars', 'courses', 'resources'].map((name, index) => ({ filename: `src/content/resources/${name}.yaml`, route: 'resources', index })));

	for (const source of sources) {
		const { blocks } = parseYaml(await readFile(source.filename, 'utf8'));
		const html = parseHtml(await readFile(`build/${source.route}/index.html`, 'utf8'));
		const article = all(html, (node) => node.tagName === 'article' && attr(node, 'class')?.includes('legacy-content'))[source.index];
		assert.ok(article, `${source.filename} is rendered`);
		const actualText = compact(text(article));
		const actualIds = new Set(all(article, (node) => !!attr(node, 'id')).map((node) => attr(node, 'id')));
		const routeUrl = `https://ai.math.uw.edu/${source.route}/`;
		const normalize = (url) => decodeURI(new URL(url, routeUrl).href).replace('/AI-Lab-website/', '/');
		const actualLinks = new Set(all(article, (node) => !!attr(node, 'href')).map((node) => normalize(attr(node, 'href'))));
		for (const block of blocks) {
			if (block.id) assert.ok(actualIds.has(block.id), `${source.filename}: #${block.id} exists`);
			for (const detail of block.details ?? []) {
				if (!detail.label || !detail.content) continue;
				const labels = all(article, (node) => node.tagName === 'b' && text(node) === detail.label);
				assert.ok(labels.some((node) => text(node.parentNode).startsWith(`${detail.label} `)), `${source.filename}: space after ${detail.label}`);
			}
			const fields = [block.title, block.intro, block.content, block.attribution, ...(block.details ?? []).flatMap((detail) => [detail.label, detail.content])].filter(Boolean);
			for (const field of fields) {
				assert.ok(actualText.includes(markdownText(field)), `${source.filename}: content retained: ${field.slice(0, 80)}`);
				const expected = parseHtml(markdown.render(field));
				for (const link of all(expected, (node) => !!attr(node, 'href'))) {
					assert.ok(actualLinks.has(normalize(attr(link, 'href'))), `${source.filename}: link retained: ${attr(link, 'href')}`);
				}
			}
			if (block.type === 'image') {
				assert.ok(all(article, (node) => node.tagName === 'img').some((node) => normalize(attr(node, 'src')) === normalize(block.src) && attr(node, 'alt') === block.alt));
			}
		}
	}
});

test('resource redirects preserve the hosting prefix and section fragment', async () => {
	for (const name of ['courses', 'seminars']) {
		const html = parseHtml(await readFile(`build/${name}/index.html`, 'utf8'));
		const target = attr(all(html, (node) => node.tagName === 'a')[0], 'href');
		for (const base of ['', '/AI-Lab-website']) {
			assert.equal(new URL(target, `https://example.com${base}/${name}/`).pathname, `${base}/resources/`);
			assert.equal(new URL(target, `https://example.com${base}/${name}/`).hash, `#${name}`);
		}
	}
});

test('dated news and its links render on the News page', async () => {
	const news = parseYaml(await readFile('src/content/news.yaml', 'utf8'));
	const page = parseHtml(await readFile('build/news/index.html', 'utf8'));
	for (const item of news) {
		const cards = all(page, (node) => attr(node, 'id') === item.id);
		assert.equal(cards.length, 1);
		assert.ok(text(cards[0]).includes(item.title));
		assert.ok(text(cards[0]).includes(item.summary));
		assert.equal(attr(all(cards[0], (node) => node.tagName === 'time')[0], 'datetime'), item.date);
		for (const link of item.links) {
			// Site-internal links are rewritten relative to the page by sitePath().
			const matches = all(cards[0], (node) => {
				const href = attr(node, 'href');
				return href === link.url || (link.url.startsWith('/') && href?.endsWith(link.url.slice(1)));
			});
			assert.equal(matches.length, 1);
		}
	}
});

test('StabilizerBench moves to conference papers without duplication', async () => {
	const sections = parseYaml(await readFile('src/content/research.yaml', 'utf8'));
	const papers = sections.flatMap((section) => section.items);
	const matches = papers.filter((paper) => paper.url === 'https://arxiv.org/abs/2604.21287');
	assert.equal(matches.length, 1);
	assert.equal(matches[0].venues[0].badge, 'Poster');
	assert.equal(matches[0].venues[0].name, 'IEEE QCE 2026, QSYS track');
	assert.ok(sections.find((section) => section.id === 'conference-workshop-papers').items.includes(matches[0]));
	const page = parseHtml(await readFile('build/research/index.html', 'utf8'));
	assert.equal(all(page, (node) => node.tagName === 'h3' && text(node) === matches[0].title).length, 1);
});

test('event structured data lists the calendar, including the hackathon, with full timestamps', async () => {
	const html = parseHtml(await readFile('build/events/index.html', 'utf8'));
	const script = all(html, (node) => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')[0];
	const graph = JSON.parse(script.childNodes.map((node) => node.value ?? '').join(''))['@graph'];
	const events = graph.find((item) => item['@type'] === 'ItemList').itemListElement.map((entry) => entry.item);
	assert.ok(events.some((event) => event.name.startsWith('UW 2026 Lean Hackathon')));
	for (const event of events) assert.match(event.startDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00/);
	assert.ok(!events.some((event) => /ICML 2026|IEEE QCE|TAG-DS spotlight/.test(event.name)));
});

test('research artifacts render their credits and links without being marked as papers', async () => {
	const sections = parseYaml(await readFile('src/content/research.yaml', 'utf8'));
	const artifacts = sections.find((section) => section.id === 'research-artifacts');
	const page = parseHtml(await readFile('build/research/index.html', 'utf8'));
	const section = all(page, (node) => attr(node, 'id') === artifacts.id)[0];
	const cards = all(section, (node) => node.tagName === 'article');
	assert.equal(cards.length, artifacts.items.length);
	for (const item of artifacts.items) {
		const matches = cards.filter((card) => all(card, (node) => node.tagName === 'h3' && text(node) === item.title).length);
		assert.equal(matches.length, 1);
		assert.ok(text(matches[0]).includes(item.authors));
		assert.ok(text(matches[0]).includes(item.abstract));
		for (const venue of item.venues) {
			assert.ok(text(matches[0]).includes(venue.name));
			if (venue.badge) assert.ok(text(matches[0]).includes(venue.badge));
		}
		assert.equal(all(matches[0], (node) => attr(node, 'href') === item.url).length, 1);
		assert.doesNotMatch(text(matches[0]), /Show full (abstract|description)/);
	}
	const script = all(page, (node) => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')[0];
	const graph = JSON.parse(script.childNodes.map((node) => node.value ?? '').join(''))['@graph'];
	const works = graph.find((item) => item['@type'] === 'ItemList').itemListElement.map((entry) => entry.item);
	for (const source of sections) {
		for (const item of source.items) {
			const work = works.find((entry) => entry.url === item.url);
			assert.equal(work['@type'], source.countsAsPaper ? 'ScholarlyArticle' : 'CreativeWork');
		}
	}
});
