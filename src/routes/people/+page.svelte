<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { initials, labPhotos, leadership, members, projectLeaders } from '$lib/data/people';
	import { pages } from '$lib/data/pages';
	import { sitePath } from '$lib/paths';
	import { collectionPage, graph, organizationId } from '$lib/structuredData';

	const { title, description } = pages.people;
	const roster = [...leadership, ...projectLeaders, ...members].filter(
		(person, index, people) => people.findIndex((candidate) => candidate.name === person.name) === index
	);
	const peopleJsonLd = graph(
		collectionPage(title, '/people/', description),
		{
			'@type': 'ItemList',
			name: 'UW Math AI Lab people',
			itemListElement: roster.map((person, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'Person',
					name: person.name,
					jobTitle: person.role,
					...(person.url ? { url: person.url } : {}),
					affiliation: { '@id': organizationId }
				}
			}))
		}
	);

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

<Seo {title} {description} path="/people/" jsonLd={peopleJsonLd} />

<section class="page-shell presenters-section">
	<h1 class="page-title">People</h1>
	<p class="people-intro lead">
		The directory below covers the UW Math AI Lab through Summer 2026. For the current teams, see the
		<a href={sitePath('/projects/fall-2026')}>Fall 2026 team rosters</a>.
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
			<p class="section-note">Graduate and undergraduate researchers.</p>
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
			<h2>Lab Photos</h2>
		</div>
		<div class="lab-photos">
			{#each labPhotos as photo, index}
				<figure
					class="lab-photo interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 2) * 65}ms; --ar: ${(photo.width ?? 16) / (photo.height ?? 9)}`}
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
	/* Intro block: same top and bottom space as .hero on the other pages. */
	.presenters-section {
		padding: var(--intro-padding);
	}

	.people-intro {
		max-width: var(--measure);
	}

	.people-section {
		scroll-margin-top: 6rem;
	}

	/* The first list sits close under the page title. */
	#leadership {
		padding-top: 1.5rem;
	}

	.section-note {
		grid-column: 1;
		max-width: var(--measure);
		margin: 0.35rem 0 0;
		color: var(--muted);
		font-size: var(--text-base);
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
		font-family: var(--font-serif);
		font-size: var(--text-lg);
	}

	.presenter-name {
		display: block;
		color: var(--heading);
		font-family: var(--font-serif);
		font-size: var(--text-base);
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
		font-size: var(--text-xs);
		line-height: 1.4;
	}

	.member-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0;
	}

	.member-card {
		padding: 0.75rem 1rem 0.75rem 0;
		border-bottom: 1px solid var(--line);
	}

	/* Justified rows: each photo's width is proportional to its aspect ratio (--ar), so every
	   photo in a row has the same height, edges line up, and nothing is cropped. The ::after
	   filler keeps a short last row at its natural size instead of stretching it. */
	.lab-photos {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem 1.25rem;
	}

	.lab-photos::after {
		content: '';
		flex-grow: 999;
	}

	.lab-photo {
		flex: var(--ar) 1 calc(var(--ar) * 13rem);
		margin: 0;
		min-width: 0;
	}

	.lab-photo img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}

	.lab-photo figcaption {
		margin-top: 0.55rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
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

		.member-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
