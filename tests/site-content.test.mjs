import assert from 'node:assert/strict';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';
import { parse } from 'yaml';

async function renderedPage(route) {
	return readFile(new URL(`../build/${route}/index.html`, import.meta.url), 'utf8');
}

async function sourceFile(path) {
	return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

function countMatches(content, pattern) {
	return content.match(pattern)?.length ?? 0;
}

test('floating notation ships as one local vector atlas and stays decorative', async () => {
	const assets = await readdir(new URL('../build/_app/immutable/assets/', import.meta.url));
	const atlases = assets.filter((name) => /^math-symbols\..+\.svg$/.test(name));
	assert.equal(atlases.length, 1);
	const atlas = await readFile(new URL(`../build/_app/immutable/assets/${atlases[0]}`, import.meta.url), 'utf8');
	assert.match(atlas, /<path\b/);
	assert.doesNotMatch(atlas, /<(?:script|text|image|foreignObject)\b|(?:href|src)="https?:/i);
	const page = await renderedPage('research');
	assert.match(page, /<canvas[^>]*class="math-canvas[^>]*aria-hidden="true"/);
	assert.doesNotMatch(page, /<script[^>]*src="[^"]*mathjax/i);
});

test('prerendered canonical pages expose complete, unique search metadata', async () => {
	const projectEntries = await readdir(new URL('../build/projects/', import.meta.url), {
		withFileTypes: true
	});
	const routes = [
		'',
		'events',
		'people',
		'projects',
		'research',
		'resources',
		'news/icml-2026',
		...projectEntries.filter((entry) => entry.isDirectory()).map((entry) => `projects/${entry.name}`)
	];
	const descriptions = [];

	for (const route of routes) {
		const page = await renderedPage(route);
		const trackers = page.match(/<script\b[^>]*src="https:\/\/cloud\.umami\.is\/script\.js"[^>]*><\/script>/g) ?? [];
		assert.equal(trackers.length, 1, `${route || '/'} has exactly one Umami tracker`);
		assert.match(page.slice(0, page.indexOf('</head>')), /src="https:\/\/cloud\.umami\.is\/script\.js"/);
		for (const setting of [
			'defer',
			'data-website-id="84390274-89b9-440f-aa94-e7194281b4cf"',
			'data-domains="ai.math.uw.edu"',
			'data-auto-track="false"',
			'data-do-not-track="true"',
			'data-exclude-search="true"',
			'data-exclude-hash="true"'
		]) assert.ok(trackers[0].includes(setting), `${route || '/'} retains ${setting}`);
		assert.equal(countMatches(page, /<meta name="description"/g), 1, `${route || '/'} has one description`);
		assert.equal(countMatches(page, /<link rel="canonical"/g), 1, `${route || '/'} has one canonical`);
		assert.equal(countMatches(page, /<meta property="og:image"/g), 1, `${route || '/'} has one Open Graph image`);
		assert.equal(countMatches(page, /<meta name="twitter:card"/g), 1, `${route || '/'} has one Twitter card`);
		assert.equal(countMatches(page, /<script type="application\/ld\+json">/g), 1, `${route || '/'} has JSON-LD`);
		assert.equal(countMatches(page, /<h1(?:\s|>)/g), 1, `${route || '/'} has one h1`);
		const jsonLd = page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
		assert.ok(jsonLd, `${route || '/'} has non-empty JSON-LD`);
		assert.equal(JSON.parse(jsonLd)['@context'], 'https://schema.org');

		const description = page.match(/<meta name="description" content="([^"]+)"/)?.[1];
		assert.ok(description, `${route || '/'} has a non-empty description`);
		descriptions.push(description);
	}

	assert.equal(new Set(descriptions).size, descriptions.length, 'all canonical page descriptions are unique');
});

test('crawl surface excludes duplicate archives and uses lightweight noindex redirects', async () => {
	await assert.rejects(access(new URL('../build/archive/old-site/', import.meta.url)), /ENOENT/);

	for (const route of ['courses', 'seminars']) {
		const pageUrl = new URL(`../build/${route}/index.html`, import.meta.url);
		const [page, details] = await Promise.all([readFile(pageUrl, 'utf8'), stat(pageUrl)]);
		assert.ok(details.size < 1024, `${route} redirect is under 1 KB`);
		assert.match(page, /<meta name="robots" content="noindex, follow">/);
		assert.match(page, /<link rel="canonical" href="https:\/\/ai\.math\.uw\.edu\/resources\/">/);
	}
});

test('sitemap uses trustworthy last-modified dates only', async () => {
	const sitemap = await readFile(new URL('../build/sitemap.xml', import.meta.url), 'utf8');
	const urlCount = countMatches(sitemap, /<url>/g);

	assert.ok(urlCount > 0, 'sitemap contains URLs');
	assert.equal(countMatches(sitemap, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g), urlCount);
	assert.doesNotMatch(sitemap, /<changefreq>|<priority>/);
});

test('the default social image is a 1200 by 630 PNG', async () => {
	const image = await readFile(new URL('../build/og/default.png', import.meta.url));
	assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
	assert.equal(image.readUInt32BE(16), 1200);
	assert.equal(image.readUInt32BE(20), 630);
});

test('the ICML write-up is its own News page, linked from News, and no longer on Events', async () => {
	const [icml, news, events] = await Promise.all([renderedPage('news/icml-2026'), renderedPage('news'), renderedPage('events')]);

	assert.match(icml, /Congratulations to our ICML authors/);
	assert.match(icml, /class="icml-photo interactive-surface[^>]*data-reveal-item/);
	assert.match(icml, /class="[^"]*interactive-surface[^"]*honored"[^>]*data-reveal-item/);
	assert.match(news, /href="[^"]*news\/icml-2026"/);
	assert.doesNotMatch(events, /icml-card|icml-photo|Congratulations to our ICML authors/);
	assert.doesNotMatch(icml, /welcome gathering|welcome display/i);
});

test('Events lists upcoming and past events separately, each cut short with a way to view all', async () => {
	const events = await renderedPage('events');

	assert.ok(events.indexOf('id="upcoming-heading"') >= 0 && events.indexOf('id="past-heading"') > events.indexOf('id="upcoming-heading"'));
	assert.match(events, /type="search"/);
	assert.match(events, /View all \d+ past events/);
	assert.doesNotMatch(events, /class="segmented"/);
});

test('the July 20 mid-summer social remains in the event calendar data', async () => {
	const events = parse(await sourceFile('src/content/events.yaml'));
	const event = events.find((item) => item.title === 'Mid-summer social event');
	assert.ok(event);
	assert.equal(event.location, 'OUG 136');
	assert.equal(event.startTime, '16:00');
	assert.equal(event.endTime, '17:30');
	assert.equal(event.abstract, 'Come join us on Monday July 20th in OUG 136 to chat with your colleagues about their exciting research! Food and board games provided');
});

test('Fall rosters replace the closed member application while the lead announcement stays archived', async () => {
	const [home, events] = await Promise.all([renderedPage(''), renderedPage('events')]);

	assert.match(events, /Fall 2026 project leader applications open/);
	const announcement = parse(await sourceFile('src/content/events.yaml')).find((event) => event.title === 'Fall 2026 project leader applications open');
	assert.equal(announcement.date, '2026-09-07');
	assert.ok(announcement.links.some((link) => link.label === 'Project Lead application form'));
	assert.ok(announcement.links.some((link) => link.url === '/projects/fall-2026'));

	assert.match(home, /class="home-announcement interactive-surface[^"\n]*"/);
	assert.match(home, /We are excited to run 14 projects involving 61 students!/);
	const fall = await renderedPage('projects/fall-2026');
	// The home page no longer carries an application button at all.
	assert.doesNotMatch(home, /Applications closed<\/button>/);
	for (const page of [home, fall]) {
		assert.doesNotMatch(page, /forms\.gle\/dRoo1jHayR95JHzm8|Tuesday, September 22, 2026|Project member application coming soon/);
	}
	assert.doesNotMatch(fall, /forms\.gle/);
	assert.doesNotMatch(home, /Lead a Math AI Lab project this fall|Apply by Monday, September 7|1Bl1wNdIGdc8jHBaaXI/);
	assert.match(home, /Fall 2026 Projects/);
	assert.match(home, /projects\/fall-2026/);
});

test('repeated research and people cards opt into the shared reveal-item motion', async () => {
	const [research, people] = await Promise.all([renderedPage('research'), renderedPage('people')]);

	assert.match(research, /class="research-card interactive-surface[^>]*data-reveal-item/);
	assert.match(people, /class="presenter-card[^>]*interactive-surface[^>]*data-reveal-item/);
	assert.match(people, /class="lab-photo interactive-surface[^>]*data-reveal-item/);
	assert.doesNotMatch(people, /welcome gathering|welcome display/i);
});

test('one shared motion and glow system governs interactive surfaces', async () => {
	const [styles, reveal] = await Promise.all([
		sourceFile('src/app.css'),
		sourceFile('src/lib/components/Reveal.svelte')
	]);

	assert.match(styles, /--surface-shadow-hover:/);
	assert.match(styles, /--surface-border-hover:/);
	assert.match(styles, /--motion-fast:/);
	assert.match(styles, /--motion-reveal:/);
	// Cards no longer lift or change border on hover; only the shared tokens and reveal remain.
	assert.match(reveal, /opacity var\(--motion-reveal\)/);
	assert.match(reveal, /transform var\(--motion-fast\)/);
});

test('all primary block families opt into the shared interactive surface', async () => {
	const [home, events, people, research, projects, resources, codePanel] = await Promise.all([
		sourceFile('src/routes/+page.svelte'),
		sourceFile('src/routes/events/+page.svelte'),
		sourceFile('src/routes/people/+page.svelte'),
		sourceFile('src/routes/research/+page.svelte'),
		sourceFile('src/routes/projects/+page.svelte'),
		sourceFile('src/routes/resources/+page.svelte'),
		sourceFile('src/lib/components/CodePanel.svelte')
	]);

	assert.match(home, /class="stats"/);
	for (const block of ['paper-card', 'home-photo-card']) {
		assert.match(home, new RegExp(`${block}[^"\\n]*interactive-surface|interactive-surface[^"\\n]*${block}`));
	}
	for (const block of ['date-block', 'event-body']) {
		assert.match(events, new RegExp(`${block}[^"\\n]*interactive-surface`));
	}
	assert.match(people, /presenter-card[^"\n]*interactive-surface/);
	assert.match(people, /lab-photo interactive-surface/);
	assert.match(research, /research-index interactive-surface/);
	assert.match(research, /research-card interactive-surface/);
	assert.match(projects, /quarter-card interactive-surface/);
	assert.match(resources, /class="tool"[^>]*data-reveal-item/);
	assert.match(codePanel, /code-panel interactive-surface/);
});
