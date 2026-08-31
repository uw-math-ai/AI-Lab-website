<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import { initials, labPhotos, leadership, members, projectLeaders } from '$lib/data/people';
	import { sitePath } from '$lib/paths';
	import { canonicalUrl } from '$lib/seo';

	function sortKey(name: string) {
		const parts = name.trim().split(/\s+/);
		const last = parts.at(-1) ?? name;
		const first = parts.slice(0, -1).join(' ');
		return `${last} ${first}`;
	}

	const byName = (a: { name: string }, b: { name: string }) =>
		sortKey(a.name).localeCompare(sortKey(b.name));
	const alphabeticalProjectLeaders = [...projectLeaders].sort(byName);
	const alphabeticalMembers = [...members].sort(byName);
</script>

<svelte:head>
	<title>People | Math AI Lab</title>
	<meta
		name="description"
		content="People of the University of Washington Math AI Lab through Summer 2026."
	/>
	<link rel="canonical" href={canonicalUrl('/people/')} />
	<meta property="og:title" content="People | Math AI Lab" />
	<meta property="og:url" content={canonicalUrl('/people/')} />
</svelte:head>

<section class="page-shell presenters-section">
	<span class="eyebrow">People</span>
	<h1 class="page-title">Math AI Lab People</h1>
	<p class="people-intro lead">
		The people of the UW Math AI Lab through Summer 2026. For the projects themselves, see the quarterly pages under
		<a href={sitePath('/projects/summer-2026')}>Projects</a>.
	</p>
</section>

<section class="page-shell section people-section" id="leadership">
	<Reveal>
		<div class="section-header">
			<h2>Leadership</h2>
		</div>
		<div class="presenters-grid leadership-grid">
			{#each leadership as person, index}
				<a
					class="presenter-card linkable interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 5) * 45}ms`}
					href={person.url}
					target="_blank"
					rel="noreferrer"
				>
					<img class="presenter-photo" src={sitePath(person.image)} alt={person.name} loading="lazy" decoding="async" />
					<span class="presenter-name">{person.name}</span>
					<span class="presenter-role">{person.role}</span>
				</a>
			{/each}
		</div>
	</Reveal>
</section>

<section class="page-shell section people-section" id="project-leaders">
	<Reveal>
		<div class="section-header">
			<h2>Project Leaders</h2>
		</div>
		<div class="presenters-grid">
			{#each alphabeticalProjectLeaders as person, index}
				<a
					class="presenter-card linkable interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 6) * 40}ms`}
					href={person.url}
					target="_blank"
					rel="noreferrer"
				>
					{#if person.image}
						<img class="presenter-photo" src={sitePath(person.image)} alt={person.name} loading="lazy" decoding="async" />
					{:else}
						<div class="presenter-avatar" aria-hidden="true">{initials(person.name)}</div>
					{/if}
					<span class="presenter-name">{person.name}</span>
					<span class="presenter-role">{person.role}</span>
				</a>
			{/each}
		</div>
	</Reveal>
</section>

<section class="page-shell section people-section" id="members">
	<Reveal>
		<div class="section-header">
			<h2>Members</h2>
			<p class="section-note">Undergraduate and graduate researchers, with the project(s) they contribute to.</p>
		</div>
		<div class="presenters-grid member-grid">
			{#each alphabeticalMembers as person, index}
				<div
					class="presenter-card member-card interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 6) * 40}ms`}
				>
					<span class="presenter-name">{person.name}</span>
					<span class="presenter-role">{person.role}</span>
				</div>
			{/each}
		</div>
	</Reveal>
</section>

<section class="page-shell section people-section" id="lab-photos">
	<Reveal>
		<div class="section-header">
			<span class="eyebrow">Community</span>
			<h2>Lab Photos</h2>
		</div>
		<div class="lab-photos">
			{#each labPhotos as photo, index}
				<figure
					class:lab-photo-featured={index === 0 || index === 5}
					class="lab-photo interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 2) * 65}ms`}
				>
					<img
						src={sitePath(photo.src)}
						alt={photo.alt}
						width={photo.width}
						height={photo.height}
						loading="lazy"
						decoding="async"
					/>
					<figcaption>{photo.caption}</figcaption>
				</figure>
			{/each}
		</div>
	</Reveal>
</section>

<style>
	.presenters-section {
		padding-top: clamp(2rem, 5vw, 3.5rem);
	}

	.presenters-section .page-title {
		margin: 0.8rem 0 1rem;
	}

	.people-intro {
		max-width: var(--measure);
	}

	.people-intro a {
		color: var(--text);
	}

	.people-section {
		scroll-margin-top: 6rem;
	}

	.section-note {
		grid-column: 1;
		max-width: var(--measure);
		margin: 0.35rem 0 0;
		color: var(--muted);
		font-size: 1rem;
	}

	.presenters-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 1.5rem 1.25rem;
	}

	.leadership-grid {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}

	.presenter-card {
		display: block;
		min-width: 0;
		color: var(--text);
		text-decoration: none;
	}

	.presenter-photo {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		margin: 0 0 0.6rem;
		border: 1px solid var(--line);
		object-fit: cover;
		background: var(--soft);
		filter: none;
	}

	.presenter-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		aspect-ratio: 1 / 1;
		margin: 0 0 0.6rem;
		border: 1px solid var(--line);
		background: var(--soft);
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 1.3rem;
	}

	.presenter-name {
		display: block;
		color: var(--heading);
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.2;
		margin-bottom: 0.15rem;
	}

	a.presenter-card:hover .presenter-name {
		text-decoration: underline;
	}

	.presenter-role {
		display: block;
		color: var(--muted);
		font-family: var(--font-sans);
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.member-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0;
		border-top: 1px solid var(--line-strong);
	}

	.member-card {
		padding: 0.75rem 1rem 0.75rem 0;
		border-bottom: 1px solid var(--line);
	}

	.lab-photos {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem 1.25rem;
	}

	.lab-photo {
		margin: 0;
		min-width: 0;
	}

	.lab-photo img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}

	.lab-photo-featured {
		grid-column: 1 / -1;
	}

	.lab-photo figcaption {
		margin-top: 0.55rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		line-height: 1.45;
		color: var(--muted);
	}

	@media (max-width: 900px) {
		.presenters-grid,
		.leadership-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.member-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 560px) {
		.presenters-grid,
		.leadership-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1.25rem 0.75rem;
		}

		.member-grid,
		.lab-photos {
			grid-template-columns: 1fr;
		}

		.lab-photo-featured {
			grid-column: auto;
		}
	}
</style>
