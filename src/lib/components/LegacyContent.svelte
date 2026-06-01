<script lang="ts">
	import { headingsFromHtml, legacyMainContent } from '$lib/utils/legacy';

	let { html, compact = false, flat = false, projectSlug } = $props<{
		html: string;
		compact?: boolean;
		flat?: boolean;
		projectSlug?: string;
	}>();
	let content = $derived(legacyMainContent(html, { projectSlug }));
	let headings = $derived(headingsFromHtml(content));
	let tocHeadings = $derived(
		projectSlug
			? headings.filter(
					(heading) =>
						heading.level === 2 &&
						/^(autoformalization|machine learning for math|formalization) projects$/i.test(heading.text)
				)
			: headings
	);
	let showToc = $derived(!flat && tocHeadings.length > 1);
	let article: HTMLElement;
</script>

<div class="content-layout" class:compact class:flat class:project-mode={!!projectSlug} class:with-toc={showToc}>
	{#if showToc}
		<aside class="toc" aria-label="Page sections">
			<span>On this page</span>
			{#each tocHeadings as heading}
				<a class:h3={heading.level === 3} href={`#${heading.id}`}>{heading.text}</a>
			{/each}
		</aside>
	{/if}
	<article class="legacy-content" bind:this={article}>
		{@html content}
	</article>
</div>

<style>
	.content-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 2rem;
		align-items: start;
	}

	.content-layout.with-toc {
		grid-template-columns: 16rem minmax(0, 1fr);
	}

	.content-layout.compact {
		grid-template-columns: minmax(0, 1fr);
	}

	.content-layout.flat {
		display: block;
	}

	.content-layout.compact .legacy-content :global(h1),
	.content-layout.flat .legacy-content :global(h1) {
		display: none;
	}

	.toc {
		position: sticky;
		top: 6rem;
		order: 0;
		display: grid;
		gap: 0.35rem;
		max-height: calc(100vh - 7.5rem);
		overflow-y: auto;
		padding: 1rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
	}

	.toc span {
		font-size: 0.75rem;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--muted);
		letter-spacing: 0.08em;
	}

	.toc a {
		color: var(--text);
		text-decoration: none;
		font-size: 0.9rem;
		line-height: 1.25;
		padding: 0.35rem 0;
	}

	.toc a:hover {
		color: var(--purple);
	}

	.toc a.h3 {
		padding-left: 0.75rem;
		border-left: 2px solid var(--line);
		font-size: 0.84rem;
		color: var(--muted);
	}

	.legacy-content {
		order: 1;
		min-width: 0;
		font-size: 1rem;
		line-height: 1.72;
	}

	.legacy-content :global(section),
	.legacy-content :global(.resources-content),
	.legacy-content :global(.seminar-content),
	.legacy-content :global(.page-content),
	.legacy-content :global(.spring2025) {
		max-width: none;
		padding: 0;
	}

	.legacy-content :global(.title-quote) {
		display: grid;
		grid-template-columns: minmax(14rem, 0.85fr) minmax(22rem, 1.15fr);
		gap: clamp(1.25rem, 3vw, 2.5rem);
		align-items: start;
		margin-bottom: 2rem;
	}

	.legacy-content :global(h1) {
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 4.6rem);
		line-height: 0.98;
		margin: 0 0 1rem;
		color: var(--heading);
	}

	.legacy-content :global(h2) {
		font-family: var(--font-display);
		font-size: clamp(1.55rem, 3vw, 2.5rem);
		margin: 3rem 0 1rem;
		color: var(--heading);
		border-bottom: 1px solid var(--line);
		padding-bottom: 0.7rem;
	}

	.legacy-content :global(h3) {
		margin: 1.8rem 0 0.75rem;
		font-size: 1.18rem;
		line-height: 1.25;
		color: var(--heading);
	}

	.legacy-content :global(p) {
		margin: 0 0 1rem;
	}

	.legacy-content :global(a) {
		color: var(--purple);
		font-weight: 650;
		text-decoration-thickness: 0.09em;
		text-underline-offset: 0.18em;
	}

	.legacy-content :global(ul),
	.legacy-content :global(ol) {
		padding-left: 1.2rem;
		margin: 0.75rem 0 1.25rem;
	}

	.legacy-content :global(li) {
		margin: 0.45rem 0;
	}

	.legacy-content :global(h2 + p),
	.legacy-content :global(h1 + p) {
		max-width: 78ch;
		color: var(--muted);
		font-size: 1.08rem;
	}

	.content-layout:not(.project-mode) .legacy-content :global(h3 + ul),
	.content-layout:not(.project-mode) .legacy-content :global(section > ul > li),
	.content-layout:not(.project-mode) .legacy-content :global(.project-detail) {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
		padding: 1rem 1rem 1rem 1.35rem;
	}

	.content-layout:not(.project-mode) .legacy-content :global(section > ul > li) {
		list-style: none;
		margin: 0 0 1rem;
	}

	.content-layout:not(.project-mode) .legacy-content :global(section > ul) {
		padding-left: 0;
	}

	.content-layout:not(.project-mode) .legacy-content :global(section > ul > li > ul) {
		box-shadow: none;
		background: transparent;
		border: 0;
		padding: 0 0 0 1.1rem;
		margin-top: 0.8rem;
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail) {
		margin: 1rem 0;
		transition:
			box-shadow 180ms ease,
			transform 180ms ease;
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail:hover) {
		box-shadow: var(--shadow);
		transform: translateY(-1px);
	}

	.content-layout.flat .legacy-content :global(section > ul),
	.content-layout.flat .legacy-content :global(.seminar-content > ul),
	.content-layout.flat .legacy-content :global(.page-content > ul) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		padding-left: 0;
		list-style: none;
	}

	.content-layout.flat .legacy-content :global(section > ul > li),
	.content-layout.flat .legacy-content :global(.seminar-content > ul > li),
	.content-layout.flat .legacy-content :global(.page-content > ul > li) {
		margin: 0;
		padding: 0.85rem 0;
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--line);
		border-radius: 0;
		box-shadow: none;
		list-style: none;
		transition:
			color 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}

	.content-layout.flat .legacy-content :global(section > ul > li:hover),
	.content-layout.flat .legacy-content :global(.seminar-content > ul > li:hover),
	.content-layout.flat .legacy-content :global(.page-content > ul > li:hover) {
		border-color: color-mix(in srgb, var(--purple) 45%, var(--line));
		background: color-mix(in srgb, var(--soft) 38%, transparent);
	}

	.content-layout.flat .legacy-content :global(h3 + ul) {
		background: transparent;
		border: 0;
		border-top: 1px solid var(--line);
		border-radius: 0;
		box-shadow: none;
		padding: 0.85rem 0 0;
	}

	.content-layout.flat .legacy-content :global(.title-quote) {
		grid-template-columns: minmax(0, 42rem);
	}

	.content-layout.flat .legacy-content :global(.epigraph) {
		justify-self: start;
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail summary) {
		cursor: pointer;
		color: var(--heading);
		font-family: var(--font-display);
		font-size: 1.18rem;
		font-weight: 800;
		line-height: 1.2;
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail summary::marker) {
		color: var(--purple);
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail > ul),
	.content-layout:not(.project-mode) .legacy-content :global(.project-detail > ol) {
		margin-top: 0.85rem;
	}

	.content-layout.project-mode {
		grid-template-columns: minmax(0, 1fr);
	}

	.content-layout.project-mode.with-toc {
		grid-template-columns: minmax(12rem, 14rem) minmax(0, 1fr);
		gap: clamp(1rem, 2vw, 1.5rem);
	}

	.content-layout.project-mode .legacy-content {
		max-width: 100%;
	}

	.content-layout.project-mode .legacy-content :global(section) {
		width: 100%;
		box-sizing: border-box;
	}

	.content-layout.project-mode .legacy-content :global(h2) {
		margin-top: 2.4rem;
	}

	.content-layout.project-mode .legacy-content :global(h3) {
		margin: 1.3rem 0 0;
		padding: 1rem 1.15rem 0.8rem;
		background:
			linear-gradient(118deg, color-mix(in srgb, var(--purple) 8%, transparent), transparent 48%),
			var(--surface-strong);
		border: 1px solid var(--line);
		border-bottom: 0;
		border-radius: var(--radius) var(--radius) 0 0;
		font-family: var(--font-display);
		font-size: clamp(1.08rem, 1.6vw, 1.28rem);
		box-shadow: var(--shadow-soft);
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul) {
		box-sizing: border-box;
		width: 100%;
		margin: 0 0 1.35rem;
		padding: 0.95rem 1.15rem 1.05rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 0 0 var(--radius) var(--radius);
		box-shadow: var(--shadow-soft);
		list-style: none;
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul > li) {
		margin: 0;
		padding: 0.52rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
		list-style: none;
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul > li:last-child) {
		border-bottom: 0;
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul ul),
	.content-layout.project-mode .legacy-content :global(h3 + ul ol) {
		margin: 0.65rem 0 0.2rem;
		padding-left: 1.35rem;
		background: transparent;
		border: 0;
		box-shadow: none;
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul ul > li) {
		list-style: disc;
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul ol > li) {
		list-style: decimal;
	}

	.content-layout.project-mode .legacy-content :global(section > ul) {
		width: 100%;
		box-sizing: border-box;
		padding-left: 1.15rem;
	}

	.content-layout.project-mode .legacy-content :global(section > ul > li:has(> ul)) {
		box-sizing: border-box;
		margin: 1rem 0;
		padding: 1rem 1.1rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-soft);
		list-style: none;
	}

	.content-layout.project-mode .legacy-content :global(section > ul > li:has(> ul) > ul) {
		margin: 0.7rem 0 0;
		padding-left: 1.2rem;
		background: transparent;
		border: 0;
		box-shadow: none;
	}

	.legacy-content :global(.epigraph) {
		float: none;
		max-width: 42rem;
		justify-self: end;
		padding: clamp(1rem, 2.2vw, 1.45rem) clamp(1.1rem, 2.5vw, 1.65rem);
		background:
			linear-gradient(118deg, color-mix(in srgb, var(--gold) 12%, transparent), transparent 38%),
			var(--soft);
		color: var(--heading);
		border-left: 4px solid var(--gold);
		border-radius: var(--radius);
		font-style: italic;
		font-family: var(--font-serif);
		font-size: clamp(1.15rem, 1.7vw, 1.48rem);
		line-height: 1.36;
		box-shadow: var(--shadow-soft);
	}

	.legacy-content :global(.epigraph blockquote) {
		margin: 0;
	}

	.legacy-content :global(.quote-attribution) {
		display: block;
		margin-top: 0.75rem;
		font-family: var(--font-serif);
		font-size: 0.9rem;
		font-style: normal;
		font-weight: 600;
		line-height: 1.25;
		text-align: right;
		color: var(--muted);
	}

	.legacy-content :global(.epigraph footer),
	.legacy-content :global(.epigraph cite) {
		font-family: var(--font-serif);
		font-size: 0.92rem;
		font-style: normal;
		color: var(--muted);
	}

	.legacy-content :global(figure),
	.legacy-content :global(.image-container) {
		margin: 2rem 0 0;
	}

	.legacy-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	@media (max-width: 980px) {
		.content-layout {
			grid-template-columns: minmax(0, 1fr);
		}

		.toc {
			position: static;
			order: 0;
			display: flex;
			overflow-x: auto;
			gap: 0.8rem;
		}

		.toc a {
			white-space: nowrap;
		}
	}

	@media (max-width: 720px) {
		.legacy-content :global(.title-quote) {
			grid-template-columns: 1fr;
		}

		.content-layout:not(.project-mode) .legacy-content :global(h3 + ul),
		.content-layout:not(.project-mode) .legacy-content :global(section > ul > li) {
			padding: 0.9rem;
		}

		.content-layout.project-mode .legacy-content :global(h3),
		.content-layout.project-mode .legacy-content :global(h3 + ul),
		.content-layout.project-mode .legacy-content :global(section > ul > li:has(> ul)) {
			padding-left: 0.95rem;
			padding-right: 0.95rem;
		}

		.content-layout.flat .legacy-content :global(section > ul),
		.content-layout.flat .legacy-content :global(.seminar-content > ul),
		.content-layout.flat .legacy-content :global(.page-content > ul) {
			grid-template-columns: 1fr;
		}
	}
</style>
