import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function renderedPage(route) {
	return readFile(new URL(`../build/${route}/index.html`, import.meta.url), 'utf8');
}

test('the ICML feature precedes the hackathon and exposes animated paper and photo items', async () => {
	const events = await renderedPage('events');
	const icmlPosition = events.indexOf('id="icml-2026"');
	const hackathonPosition = events.indexOf('id="hackathon-heading"');

	assert.ok(icmlPosition >= 0, 'ICML feature is rendered');
	assert.ok(hackathonPosition >= 0, 'hackathon feature is rendered');
	assert.ok(icmlPosition < hackathonPosition, 'ICML feature comes before the hackathon');
	assert.match(events, /class="icml-photo[^>]*data-reveal-item/);
	assert.match(events, /data-reveal-item[^>]*class="[^"]*honored/);
});

test('the homepage congratulates ICML authors, links once to the feature, and shows three lab moments', async () => {
	const home = await renderedPage('');
	const featureLinks = home.match(/href="[^"]*events#icml-2026"/g) ?? [];

	assert.equal(featureLinks.length, 1, 'one homepage link points to the ICML feature');
	assert.match(home, /We presented 8 papers at ICML 2026/);
	assert.match(home, /Congratulations to our authors!/);
	assert.match(home, /photos\/fall2025\.jpg/);
	assert.match(home, /photos\/icml-2026-coex-1\.webp/);
	assert.match(home, /photos\/lean-hackathon\.jpg/);
	assert.match(home, /class="home-photo-card[^>]*data-reveal-item/);
});

test('the July 20 mid-summer social is present in the rendered event calendar', async () => {
	const events = await renderedPage('events');

	assert.match(events, /Mid-summer social event/);
	assert.match(events, /OUG 136/);
	assert.match(events, /4:00 PM-5:30 PM/);
	assert.match(
		events,
		/Come join us on Monday July 20th in OUG 136 to chat with your colleagues about their exciting research! Food and board games provided/
	);
});

test('repeated research and people cards opt into the shared reveal-item motion', async () => {
	const [research, people] = await Promise.all([renderedPage('research'), renderedPage('people')]);

	assert.match(research, /class="research-card[^>]*data-reveal-item/);
	assert.match(people, /class="presenter-card[^>]*data-reveal-item/);
	assert.match(people, /class="lab-photo[^>]*data-reveal-item/);
});
