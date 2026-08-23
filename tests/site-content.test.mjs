import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function renderedPage(route) {
	return readFile(new URL(`../build/${route}/index.html`, import.meta.url), 'utf8');
}

async function sourceFile(path) {
	return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('the ICML feature precedes the hackathon and exposes animated paper and photo items', async () => {
	const events = await renderedPage('events');
	const icmlPosition = events.indexOf('id="icml-2026"');
	const hackathonPosition = events.indexOf('id="hackathon-heading"');

	assert.ok(icmlPosition >= 0, 'ICML feature is rendered');
	assert.ok(hackathonPosition >= 0, 'hackathon feature is rendered');
	assert.ok(icmlPosition < hackathonPosition, 'ICML feature comes before the hackathon');
	assert.match(events, /class="icml-card interactive-surface/);
	assert.match(events, /class="icml-copy[^>]*data-reveal-item/);
	assert.match(events, /class="icml-photo interactive-surface[^>]*data-reveal-item/);
	assert.match(events, /class="[^"]*interactive-surface[^"]*honored"[^>]*data-reveal-item/);
	assert.doesNotMatch(events, /welcome gathering|welcome display/i);
});

test('the homepage congratulates ICML authors, links once to the feature, and shows three lab moments', async () => {
	const home = await renderedPage('');
	const featureLinks = home.match(/href="[^"]*events#icml-2026"/g) ?? [];

	assert.equal(featureLinks.length, 1, 'one homepage link points to the ICML feature');
	assert.match(home, /We presented 8 papers at ICML 2026/);
	assert.match(home, /Congratulations to our authors!/);
	assert.match(home, /photos\/fall2025\.jpg/);
	assert.match(home, /photos\/icml-2026-coex-2\.webp/);
	assert.match(home, /ICML 2026 group photo/);
	assert.doesNotMatch(home, /welcome gathering/i);
	assert.match(home, /photos\/lean-hackathon\.jpg/);
	assert.match(home, /class="home-photo-card[^>]*data-reveal-item/);
});

test('the July 20 mid-summer social remains in the event calendar data', async () => {
	const events = await sourceFile('src/lib/data/events.ts');

	assert.match(events, /Mid-summer social event/);
	assert.match(events, /OUG 136/);
	assert.match(events, /startTime: '16:00'/);
	assert.match(events, /endTime: '17:30'/);
	assert.match(
		events,
		/Come join us on Monday July 20th in OUG 136 to chat with your colleagues about their exciting research! Food and board games provided/
	);
});

test('the Fall 2026 project leader announcement is upcoming and prominent on the homepage', async () => {
	const [home, events] = await Promise.all([renderedPage(''), renderedPage('events')]);

	assert.match(events, /Fall 2026 project leader applications open/);
	assert.match(events, /Sep 7, 2026/);
	assert.match(events, /Project Lead application form/);
	assert.match(events, /Proposed Fall 2026 projects/);
	assert.match(events, /docs\.google\.com\/forms\/d\/1Bl1wNdIGdc8jHBaaXI-REYfBaGwLFUDu4n3dRab2t40\/viewform/);

	assert.match(home, /class="home-announcement interactive-surface[^"\n]*"/);
	assert.match(home, /Lead a Math AI Lab project this fall/);
	assert.match(home, /Apply by Monday, September 7 at 11:59 pm/);
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
	assert.match(styles, /:root body \.interactive-surface:hover/);
	assert.match(styles, /\.interactive-surface:has\(\.interactive-surface:hover\)/);
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

	assert.match(home, /class="stats"[\s\S]*?class="interactive-surface"/);
	for (const block of ['paper-card', 'event-card', 'project-card', 'home-photo-card']) {
		assert.match(home, new RegExp(`${block}[^"\\n]*interactive-surface|interactive-surface[^"\\n]*${block}`));
	}
	for (const block of ['icml-card', 'icml-photo', 'hackathon-card', 'date-block', 'event-body']) {
		assert.match(events, new RegExp(`${block}[^"\\n]*interactive-surface`));
	}
	assert.match(events, /class="interactive-surface"[\s\S]*?class:honored/);
	assert.match(people, /presenter-card[^"\n]*interactive-surface/);
	assert.match(people, /lab-photo interactive-surface/);
	assert.match(research, /research-index interactive-surface/);
	assert.match(research, /research-card interactive-surface/);
	assert.match(projects, /project-total interactive-surface/);
	assert.match(projects, /quarter-card interactive-surface/);
	assert.match(resources, /featured-resource-card interactive-surface/);
	assert.match(codePanel, /code-panel interactive-surface/);
});
