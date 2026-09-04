import assert from 'node:assert/strict';
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

test('dated news and its links render on both the homepage and Events page', async () => {
	const news = parseYaml(await readFile('src/content/news.yaml', 'utf8'));
	for (const route of ['', 'events']) {
		const page = parseHtml(await readFile(`build/${route}/index.html`, 'utf8'));
		for (const item of news) {
			const cards = all(page, (node) => attr(node, 'id') === item.id);
			assert.equal(cards.length, 1);
			assert.ok(text(cards[0]).includes(item.title));
			assert.ok(text(cards[0]).includes(item.summary));
			assert.equal(attr(all(cards[0], (node) => node.tagName === 'time')[0], 'datetime'), item.date);
			for (const link of item.links) {
				assert.ok(all(cards[0], (node) => attr(node, 'href') === link.url).length === 1);
			}
		}
	}
});

test('StabilizerBench moves to conference papers without duplication', async () => {
	const sections = parseYaml(await readFile('src/content/research.yaml', 'utf8'));
	const papers = sections.flatMap((section) => section.items);
	const matches = papers.filter((paper) => paper.url === 'https://arxiv.org/abs/2604.21287');
	assert.equal(matches.length, 1);
	assert.equal(matches[0].badge, 'Accepted');
	assert.equal(matches[0].venue, 'IEEE QCE 2026, QSYS track');
	assert.ok(sections.find((section) => section.id === 'conference-workshop-papers').items.includes(matches[0]));
	const page = parseHtml(await readFile('build/research/index.html', 'utf8'));
	assert.equal(all(page, (node) => node.tagName === 'h3' && text(node) === matches[0].title).length, 1);
});

test('conference structured data uses local offsets and external organizers', async () => {
	const html = parseHtml(await readFile('build/events/index.html', 'utf8'));
	const script = all(html, (node) => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')[0];
	const graph = JSON.parse(script.childNodes.map((node) => node.value ?? '').join(''))['@graph'];
	const events = graph.find((item) => item['@type'] === 'ItemList').itemListElement.map((entry) => entry.item);
	const ieee = events.find((event) => event.name === 'StabilizerBench at IEEE QCE 2026');
	assert.equal(ieee.startDate, '2026-09-13T13:00:00-04:00');
	assert.equal(ieee.endDate, '2026-09-13T14:30:00-04:00');
	assert.equal(ieee.organizer.name, 'IEEE Quantum Week');
	const tag = events.find((event) => event.name.startsWith('TAG-DS spotlight:'));
	assert.equal(tag.startDate, '2026-08-19T10:20:00-04:00');
	assert.equal(tag.organizer.name, 'TAG-DS');
});
