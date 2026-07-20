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

<section class="presenters-section">
	<h1>Math AI Lab People</h1>
	<p class="people-intro">
		The people of the UW Math AI Lab through Summer 2026. For the projects themselves, see the quarterly pages under
		<a href={sitePath('/projects/summer-2026')}>Projects</a>.
	</p>
</section>

<section class="presenters-section people-section" id="leadership">
	<Reveal>
		<h2>Leadership</h2>
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

<section class="presenters-section people-section" id="project-leaders">
	<Reveal>
		<h2>Project Leaders</h2>
		<div class="presenters-grid">
			{#each alphabeticalProjectLeaders as person, index}
				<a
					class="presenter-card linkable interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 5) * 45}ms`}
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

<section class="presenters-section people-section" id="members">
	<Reveal>
		<h2>Members</h2>
		<p class="section-note">
			Undergraduate and graduate researchers, with the project(s) they contribute to.
		</p>
		<div class="presenters-grid">
			{#each alphabeticalMembers as person, index}
				<div
					class="presenter-card member-card interactive-surface"
					data-reveal-item
					style={`--reveal-delay: ${(index % 5) * 45}ms`}
				>
					<div class="presenter-avatar">{initials(person.name)}</div>
					<span class="presenter-name">{person.name}</span>
					<span class="presenter-role">{person.role}</span>
				</div>
			{/each}
		</div>
	</Reveal>
</section>

<section class="presenters-section people-section" id="lab-photos">
	<Reveal>
		<h2>Lab Photos</h2>
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
					<figcaption>// {photo.caption}</figcaption>
				</figure>
			{/each}
		</div>
	</Reveal>
</section>

<style>
	.presenters-section {
		width: min(1120px, calc(100vw - 2rem));
		margin: 0 auto;
		padding: 0 0 clamp(3rem, 6vw, 5rem);
	}

	.presenters-section:first-of-type {
		padding-top: clamp(3rem, 8vw, 5rem);
		padding-bottom: 1.5rem;
		text-align: center;
	}

	.presenters-section h1 {
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 7vw, 5.8rem);
		line-height: 0.92;
		margin: 0 0 1rem;
	}

	.people-intro,
	.section-note {
		max-width: 680px;
		margin: 0 auto 1.5rem;
		color: var(--muted);
		text-align: center;
		font-size: 1.02rem;
	}

	.people-intro a {
		color: var(--purple);
		font-weight: 800;
	}

	.presenters-section h2 {
		margin: 0 0 2.5rem;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 3.1rem);
		line-height: 1;
		text-align: center;
	}

	.people-section {
		scroll-margin-top: 6rem;
	}

	.presenters-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		gap: 18px;
	}

	.leadership-grid {
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		max-width: 1040px;
		margin: 0 auto;
	}

	.leadership-grid .presenter-card {
		padding-block: 34px;
	}

	.leadership-grid .presenter-role {
		display: inline-flex;
		justify-content: center;
		max-width: 100%;
		margin-top: 0.2rem;
		padding: 0.32rem 0.65rem;
		border: 1px solid color-mix(in srgb, var(--purple) 22%, var(--line));
		border-radius: 999px;
		background: color-mix(in srgb, var(--soft) 72%, var(--surface));
		color: var(--purple);
		font-size: 0.78rem;
		line-height: 1.2;
	}

	:root[data-theme='dark'] .leadership-grid .presenter-role {
		border-color: color-mix(in srgb, var(--gold) 34%, var(--purple));
		color: var(--gold);
	}

	.presenter-card {
		display: block;
		min-width: 0;
		min-height: 0;
		padding: 30px 20px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--surface-shadow-rest);
		color: var(--text);
		text-decoration: none;
		text-align: center;
	}

	.presenter-photo {
		display: block;
		width: 84px;
		height: 84px;
		margin: 0 auto 1rem;
		border: 2px solid color-mix(in srgb, var(--gold) 42%, var(--line));
		border-radius: 50%;
		box-shadow: var(--glow-small);
		object-fit: cover;
		background: var(--soft);
	}

	.presenter-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 68px;
		height: 68px;
		margin: 0 auto 1rem;
		border: 2px solid color-mix(in srgb, var(--gold) 42%, var(--line));
		border-radius: 50%;
		background: linear-gradient(135deg, var(--purple) 0%, var(--cyan) 100%);
		box-shadow: var(--glow-small);
		color: white;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 800;
	}

	.presenter-name {
		display: block;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 800;
		line-height: 1.15;
		margin-bottom: 0.28rem;
	}

	.presenter-role {
		display: block;
		color: var(--muted);
		font-family: var(--font-body);
		font-size: 0.76rem;
		font-weight: 750;
		letter-spacing: 0.02em;
		line-height: 1.42;
	}

	.lab-photos {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
		max-width: 980px;
		margin: 1.5rem auto 0;
	}

	.lab-photo {
		margin: 0;
		overflow: hidden;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--surface-shadow-rest);
	}

	.lab-photo img {
		display: block;
		width: 100%;
		height: auto;
		transition: transform var(--motion-fast);
	}

	.lab-photo:hover img {
		transform: scale(1.012);
	}

	.lab-photo-featured {
		grid-column: 1 / -1;
	}

	.lab-photo figcaption {
		margin: 0;
		padding: 0.65rem 0.8rem 0.8rem;
		color: var(--purple);
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 600;
		text-align: right;
	}

	@media (max-width: 800px) {
		.lab-photos {
			grid-template-columns: 1fr;
		}

		.lab-photo-featured {
			grid-column: auto;
		}
	}

	@media (max-width: 520px) {
		.presenters-section {
			width: min(100% - 1rem, 1120px);
		}

		.presenters-grid {
			grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
			gap: 0.75rem;
		}

		.presenter-card {
			padding: 1.15rem 0.75rem;
		}

		.presenter-photo {
			width: 72px;
			height: 72px;
		}

		.presenter-avatar {
			width: 58px;
			height: 58px;
			font-size: 1.05rem;
		}
	}
</style>
