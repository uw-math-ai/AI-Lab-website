<script lang="ts">
	import LegacyContent from '$lib/components/LegacyContent.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import CodePanel from '$lib/components/CodePanel.svelte';
	import { resourcesLeanSnippet } from '$lib/data/leanSnippets';
	import coursesHtml from '$lib/legacy-html/courses.html?raw';
	import resourcesHtml from '$lib/legacy-html/resources.html?raw';
	import seminarsHtml from '$lib/legacy-html/seminars.html?raw';
</script>

<svelte:head>
	<title>Resources | Math AI Lab</title>
</svelte:head>

<section class="page-shell hero compact-hero">
	<div>
		<span class="eyebrow">Resources</span>
		<h1>Seminars, Courses, and Resources</h1>
		<p>
			A guide to Math AI background material, UW courses, and related seminar series.
		</p>
	</div>
	<CodePanel snippet={resourcesLeanSnippet} />
</section>

<section class="page-shell featured-resource" aria-labelledby="featured-resource-title">
	<Reveal>
		<a
			class="featured-resource-card"
			href="https://ww2.ams.org/journals/bull/2026-63-02/S0273-0979-2025-01879-0/viewer/?t=1780254358590"
			target="_blank"
			rel="noreferrer"
		>
			<div>
				<span class="eyebrow">Featured AMS article</span>
				<h2 id="featured-resource-title">Embracing AI and Formalization</h2>
				<p>
					by Jarod Alper
				</p>
			</div>
			<span class="featured-link">Read at AMS</span>
		</a>
	</Reveal>
</section>

<nav class="page-shell resource-section-nav" aria-label="Resources page sections">
	<a href="#seminars">Seminars</a>
	<a href="#courses">Courses</a>
	<a href="#resources">Resources</a>
</nav>

<section class="page-shell section combined-resource-section" id="seminars">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Seminars</span>
			<h2>Related Seminars</h2>
			<p>Math AI-related colloquia and seminars at the University of Washington.</p>
		</div>
		<LegacyContent html={seminarsHtml} compact flat />
	</Reveal>
</section>

<section class="page-shell section combined-resource-section" id="courses">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">UW Courses</span>
			<h2>Related Courses</h2>
			<p>Formal methods, AI and machine learning, NLP, optimization, data science, and ethics courses.</p>
		</div>
		<LegacyContent html={coursesHtml} compact flat />
	</Reveal>
</section>

<section class="page-shell section combined-resource-section" id="resources">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Reading</span>
			<h2>Math AI Resources</h2>
			<p>Background material, Math AI reading, and Lean resources for getting started and getting serious.</p>
		</div>
		<LegacyContent html={resourcesHtml} compact flat />
	</Reveal>
</section>

<style>
	.compact-hero {
		min-height: 28rem;
	}

	.featured-resource {
		padding-top: clamp(1rem, 2vw, 1.4rem);
		padding-bottom: clamp(1rem, 2vw, 1.4rem);
	}

	.featured-resource-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 1rem;
		align-items: center;
		padding: clamp(1.1rem, 2.5vw, 1.55rem);
		background:
			linear-gradient(118deg, color-mix(in srgb, var(--gold) 14%, transparent), transparent 38%),
			linear-gradient(132deg, color-mix(in srgb, var(--purple) 10%, transparent), transparent 46%),
			var(--surface);
		border: 1px solid color-mix(in srgb, var(--purple) 30%, var(--line));
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
		color: var(--text);
		text-decoration: none;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.featured-resource-card:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--gold) 46%, var(--purple));
		box-shadow: var(--shadow);
	}

	.featured-resource-card h2 {
		margin: 0.2rem 0 0.4rem;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(1.55rem, 3vw, 2.45rem);
		line-height: 1;
	}

	.featured-resource-card p {
		max-width: 62rem;
		margin: 0;
		color: var(--muted);
		font-size: 1.02rem;
		line-height: 1.55;
	}

	.featured-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.4rem;
		padding: 0.5rem 0.9rem;
		background: var(--purple);
		border-radius: 999px;
		color: white;
		font-size: 0.88rem;
		font-weight: 850;
		white-space: nowrap;
	}

	.resource-section-nav {
		position: sticky;
		top: 4.6rem;
		z-index: 12;
		display: flex;
		gap: 0.55rem;
		align-items: center;
		margin-top: -1rem;
		padding-top: 0.7rem;
		padding-bottom: 0.7rem;
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--line);
	}

	.resource-section-nav a {
		display: inline-flex;
		align-items: center;
		min-height: 2.4rem;
		padding: 0.45rem 0.85rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--surface);
		color: var(--text);
		font-size: 0.9rem;
		font-weight: 750;
		text-decoration: none;
		box-shadow: var(--shadow-soft);
		transition:
			color 180ms ease,
			border-color 180ms ease,
			transform 180ms ease;
	}

	.resource-section-nav a:hover {
		color: var(--purple);
		border-color: color-mix(in srgb, var(--purple) 45%, var(--line));
		transform: translateY(-1px);
	}

	.combined-resource-section {
		scroll-margin-top: 6rem;
	}

	.combined-resource-section + .combined-resource-section {
		padding-top: 0;
	}

	@media (max-width: 720px) {
		.featured-resource-card {
			grid-template-columns: 1fr;
		}

		.featured-link {
			justify-self: start;
		}

		.resource-section-nav {
			top: 4.2rem;
			overflow-x: auto;
			padding-right: 1rem;
		}

		.resource-section-nav a {
			white-space: nowrap;
		}
	}
</style>
