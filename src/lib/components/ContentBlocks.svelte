<script lang="ts">
	import type { ContentBlock } from '$lib/content/schema';
	import { renderMarkdown, renderInline, renderDetail } from '$lib/content/markdown';
	import { sitePath } from '$lib/paths';

	let { blocks, compact = false, flat = false, projectSlug } = $props<{
		blocks: ContentBlock[];
		compact?: boolean;
		flat?: boolean;
		projectSlug?: string;
	}>();
	let headings = $derived(blocks.flatMap((block: ContentBlock) =>
		block.type === 'heading' ? [{ id: block.id, text: block.title, level: block.level }]
			: block.type === 'project' && block.style === 'heading' ? [{ id: block.id, text: block.title, level: 3 }] : []
	));
	let tocHeadings = $derived(
		projectSlug
			? headings.filter(
					(heading: { level: number; text: string }) =>
						heading.level === 2 &&
						/^(autoformalization|machine learning for math|formalization|new|returning) projects$/i.test(heading.text)
				)
			: headings
	);
	let showToc = $derived(!flat && tocHeadings.length > 1);
</script>

{#snippet projectDetails(block: Extract<ContentBlock, { type: 'project' }>)}
	{#if block.intro}{' '}{@html renderDetail(block.intro)}{/if}
	{#if block.details?.length}
		<ul>
			{#each block.details as detail}
				<li>{#if detail.label}<b>{detail.label}</b>{' '}{/if}{@html renderDetail(detail.content)}</li>
			{/each}
		</ul>
	{/if}
	{#if block.content}{@html renderMarkdown(block.content)}{/if}
{/snippet}

<div class="content-layout" class:compact class:flat class:project-mode={!!projectSlug} class:with-toc={showToc}>
	{#if showToc}
		<aside class="toc interactive-surface" aria-label="Page sections">
			<span>On this page</span>
			{#each tocHeadings as heading}
				<a class:h3={heading.level === 3} href={`#${heading.id}`}>{heading.text}</a>
			{/each}
		</aside>
	{/if}
	<article class="legacy-content">
		<section>
			{#each blocks as block}
				{#if block.type === 'heading'}
					{#if block.level === 2}<h2 id={block.id}>{@html renderInline(block.title)}</h2>
					{:else}<h3 id={block.id}>{@html renderInline(block.title)}</h3>{/if}
				{:else if block.type === 'project'}
					{#if block.style === 'list'}
						<ul class="archived-project-list"><li><b id={block.id}>{@html renderInline(block.title)}</b>
							{@render projectDetails(block)}
						</li></ul>
					{:else}
						<h3 id={block.id}>{@html renderInline(block.title)}</h3>
						{@render projectDetails(block)}
					{/if}
				{:else if block.type === 'quote'}
					<div class="title-quote"><div class="epigraph"><blockquote>
						<p>{@html renderInline(block.content)}{#if block.attribution}<br /><span class="quote-attribution">{block.attribution}</span>{/if}</p>
					</blockquote></div></div>
				{:else if block.type === 'image'}
					<img src={sitePath(block.src)} alt={block.alt} width={block.width} loading="lazy" />
				{:else}
					{@html renderMarkdown(block.content)}
				{/if}
			{/each}
		</section>
	</article>
</div>

<style>
	.archived-project-list { margin-block: 0; }
	.content-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 2rem;
		align-items: start;
	}

	.content-layout.with-toc {
		grid-template-columns: 14rem minmax(0, 1fr);
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
		top: 5rem;
		order: 0;
		display: grid;
		gap: 0.3rem;
		max-height: calc(100vh - 6.5rem);
		overflow-y: auto;
		padding: 0.25rem 0 0;
	}

	.toc span {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		padding-bottom: 0.5rem;
		margin-bottom: 0.25rem;
		border-bottom: 1px solid var(--line-strong);
	}

	.toc a {
		font-family: var(--font-sans);
		font-size: 0.86rem;
		line-height: 1.3;
		color: var(--text);
		text-decoration: none;
		padding: 0.25rem 0;
	}

	.toc a:hover {
		text-decoration: underline;
	}

	.toc a.h3 {
		padding-left: 0.75rem;
		border-left: 1px solid var(--line);
		font-size: 0.8rem;
		color: var(--muted);
	}

	.legacy-content {
		order: 1;
		min-width: 0;
		font-size: 1rem;
		line-height: 1.6;
		overflow-wrap: break-word;
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
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1.05;
		margin: 0 0 1rem;
		color: var(--heading);
	}

	.legacy-content :global(h2) {
		font-size: clamp(1.5rem, 2.6vw, 2rem);
		line-height: 1.15;
		margin: 3rem 0 1.25rem;
		padding-bottom: 0.6rem;
		color: var(--heading);
		border-bottom: 1px solid var(--line-strong);
	}

	.legacy-content :global(h3) {
		margin: 1.6rem 0 0.5rem;
		font-size: 1.2rem;
		line-height: 1.3;
		font-weight: 500;
		color: var(--heading);
	}

	.legacy-content :global(p) {
		margin: 0 0 1rem;
		max-width: 72ch;
	}

	.legacy-content :global(a) {
		color: var(--text);
		overflow-wrap: anywhere;
	}

	.legacy-content :global(ul),
	.legacy-content :global(ol) {
		padding-left: 1.2rem;
		margin: 0.5rem 0 1.25rem;
	}

	.legacy-content :global(li) {
		margin: 0.35rem 0;
	}

	.legacy-content :global(h2 + p),
	.legacy-content :global(h1 + p) {
		max-width: 72ch;
		color: var(--muted);
		font-size: 1.05rem;
	}

	/* Non-project legacy pages: entries separated by rules, no boxes. */
	.content-layout:not(.project-mode) .legacy-content :global(section > ul) {
		padding-left: 0;
		list-style: none;
	}

	.content-layout:not(.project-mode) .legacy-content :global(section > ul > li) {
		list-style: none;
		margin: 0;
		padding: 0.85rem 0;
		border-bottom: 1px solid var(--line);
	}

	.content-layout:not(.project-mode) .legacy-content :global(section > ul > li > ul) {
		padding: 0 0 0 1.1rem;
		margin: 0.5rem 0 0;
	}

	.content-layout:not(.project-mode) .legacy-content :global(h3 + ul) {
		border-top: 1px solid var(--line-strong);
		padding-top: 0.25rem;
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail) {
		margin: 0;
		padding: 0.85rem 0;
		border-bottom: 1px solid var(--line);
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail summary) {
		cursor: pointer;
		color: var(--heading);
		font-size: 1.12rem;
		font-weight: 500;
		line-height: 1.3;
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail summary:hover) {
		text-decoration: underline;
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail summary::marker) {
		color: var(--muted);
	}

	.content-layout:not(.project-mode) .legacy-content :global(.project-detail > ul),
	.content-layout:not(.project-mode) .legacy-content :global(.project-detail > ol) {
		margin-top: 0.6rem;
	}

	.content-layout.flat .legacy-content :global(section > ul),
	.content-layout.flat .legacy-content :global(.seminar-content > ul),
	.content-layout.flat .legacy-content :global(.page-content > ul) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 2.5rem;
		padding-left: 0;
		list-style: none;
		border-top: 1px solid var(--line-strong);
	}

	.content-layout.flat .legacy-content :global(section > ul > li),
	.content-layout.flat .legacy-content :global(.seminar-content > ul > li),
	.content-layout.flat .legacy-content :global(.page-content > ul > li) {
		margin: 0;
		padding: 0.8rem 0;
		border-bottom: 1px solid var(--line);
		list-style: none;
	}

	.content-layout.flat .legacy-content :global(h3 + ul) {
		border-top: 1px solid var(--line-strong);
		padding: 0;
	}

	.content-layout.flat .legacy-content :global(.title-quote) {
		grid-template-columns: minmax(0, 42rem);
	}

	.content-layout.flat .legacy-content :global(.epigraph) {
		justify-self: start;
	}

	/* Project pages: one entry per project, separated by rules. */
	.content-layout.project-mode {
		grid-template-columns: minmax(0, 1fr);
	}

	.content-layout.project-mode.with-toc {
		grid-template-columns: minmax(12rem, 14rem) minmax(0, 1fr);
		gap: clamp(1.5rem, 3vw, 3rem);
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
		margin: 1.5rem 0 0.4rem;
		font-size: 1.22rem;
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul) {
		box-sizing: border-box;
		width: 100%;
		margin: 0 0 0.5rem;
		padding: 0 0 1.2rem;
		border-bottom: 1px solid var(--line);
		list-style: none;
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul > li) {
		margin: 0;
		padding: 0.3rem 0;
		list-style: none;
		max-width: 76ch;
	}

	.content-layout.project-mode .legacy-content :global(h3 + ul ul),
	.content-layout.project-mode .legacy-content :global(h3 + ul ol) {
		margin: 0.4rem 0 0.2rem;
		padding-left: 1.35rem;
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
		margin: 0;
		padding: 0.9rem 0;
		border-bottom: 1px solid var(--line);
		list-style: none;
	}

	.content-layout.project-mode .legacy-content :global(section > ul > li:has(> ul) > ul) {
		margin: 0.5rem 0 0;
		padding-left: 1.2rem;
	}

	.legacy-content :global(.epigraph) {
		float: none;
		max-width: 42rem;
		justify-self: end;
		padding: 0 0 0 1.25rem;
		color: var(--heading);
		border-left: 1px solid var(--line-strong);
		font-style: italic;
		font-family: var(--font-serif);
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.4;
	}

	.legacy-content :global(.epigraph blockquote) {
		margin: 0;
	}

	.legacy-content :global(.quote-attribution) {
		display: block;
		margin-top: 0.6rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-style: normal;
		line-height: 1.3;
		text-align: right;
		color: var(--muted);
	}

	.legacy-content :global(.epigraph footer),
	.legacy-content :global(.epigraph cite) {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-style: normal;
		color: var(--muted);
	}

	.legacy-content :global(figure),
	.legacy-content :global(.image-container) {
		margin: 2rem 0 0;
	}

	.legacy-content :global(pre),
	.legacy-content :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
	}

	.legacy-content :global(pre),
	.legacy-content :global(code),
	.legacy-content :global(table) {
		max-width: 100%;
	}

	.legacy-content :global(pre),
	.legacy-content :global(table) {
		overflow-x: auto;
	}

	.legacy-content :global(img) {
		max-width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}

	@media (max-width: 980px) {
		.content-layout,
		.content-layout.with-toc,
		.content-layout.project-mode.with-toc {
			grid-template-columns: minmax(0, 1fr);
		}

		.toc {
			position: static;
			order: 0;
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			max-height: none;
			gap: 0.4rem 1.2rem;
			padding: 0 0 0.75rem;
			border-bottom: 1px solid var(--line);
		}

		.toc span {
			flex: 0 0 100%;
			border-bottom: 0;
			padding-bottom: 0;
			margin-bottom: 0;
		}

		.toc a.h3 {
			padding-left: 0;
			border-left: 0;
		}
	}

	@media (max-width: 720px) {
		.legacy-content {
			font-size: 0.96rem;
			line-height: 1.6;
		}

		.legacy-content :global(.title-quote) {
			grid-template-columns: 1fr;
		}

		.legacy-content :global(h2) {
			margin-top: 2rem;
		}

		.content-layout.project-mode .legacy-content :global(section > ul) {
			padding-left: 0;
		}

		.content-layout.flat .legacy-content :global(section > ul),
		.content-layout.flat .legacy-content :global(.seminar-content > ul),
		.content-layout.flat .legacy-content :global(.page-content > ul) {
			grid-template-columns: 1fr;
		}
	}

	/* Outbound links carry a small mark for what they lead to — a repository, a
	   paper, a dataset, a talk. Drawn as masks so they take the text colour and
	   work in both themes. */
	.legacy-content :global(a[href*='github.com'])::after,
	.legacy-content :global(a[href*='arxiv.org'])::after,
	.legacy-content :global(a[href*='ams.org'])::after,
	.legacy-content :global(a[href*='doi.org'])::after,
	.legacy-content :global(a[href*='huggingface.co'])::after,
	.legacy-content :global(a[href*='youtube.com'])::after,
	.legacy-content :global(a[href*='youtu.be'])::after {
		content: '';
		display: inline-block;
		width: 0.72em;
		height: 0.72em;
		margin-left: 0.3em;
		vertical-align: -0.02em;
		background-color: currentColor;
		opacity: 0.55;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		-webkit-mask-size: contain;
		mask-size: contain;
	}

	/* repository */
	.legacy-content :global(a[href*='github.com'])::after {
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 4.5 2.5 8 6 11.5M10 4.5 13.5 8 10 11.5'/%3E%3C/svg%3E");
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 4.5 2.5 8 6 11.5M10 4.5 13.5 8 10 11.5'/%3E%3C/svg%3E");
	}

	/* paper */
	.legacy-content :global(a[href*='arxiv.org'])::after,
	.legacy-content :global(a[href*='ams.org'])::after,
	.legacy-content :global(a[href*='doi.org'])::after {
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.4' stroke-linejoin='round'%3E%3Cpath d='M4 1.8h5l3 3v9.4H4z'/%3E%3Cpath d='M9 1.8v3.2h3'/%3E%3Cpath d='M6 8.6h4M6 11h4' stroke-linecap='round'/%3E%3C/svg%3E");
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.4' stroke-linejoin='round'%3E%3Cpath d='M4 1.8h5l3 3v9.4H4z'/%3E%3Cpath d='M9 1.8v3.2h3'/%3E%3Cpath d='M6 8.6h4M6 11h4' stroke-linecap='round'/%3E%3C/svg%3E");
	}

	/* dataset */
	.legacy-content :global(a[href*='huggingface.co'])::after {
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.4'%3E%3Cellipse cx='8' cy='3.8' rx='5' ry='2'/%3E%3Cpath d='M3 3.8v8.4c0 1.1 2.2 2 5 2s5-.9 5-2V3.8'/%3E%3Cpath d='M3 8c0 1.1 2.2 2 5 2s5-.9 5-2'/%3E%3C/svg%3E");
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.4'%3E%3Cellipse cx='8' cy='3.8' rx='5' ry='2'/%3E%3Cpath d='M3 3.8v8.4c0 1.1 2.2 2 5 2s5-.9 5-2V3.8'/%3E%3Cpath d='M3 8c0 1.1 2.2 2 5 2s5-.9 5-2'/%3E%3C/svg%3E");
	}

	/* talk */
	.legacy-content :global(a[href*='youtube.com'])::after,
	.legacy-content :global(a[href*='youtu.be'])::after {
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.4' stroke-linejoin='round'%3E%3Crect x='1.5' y='3' width='13' height='10' rx='2.5'/%3E%3Cpath d='M6.6 6.2 10.4 8l-3.8 1.8z' fill='black'/%3E%3C/svg%3E");
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.4' stroke-linejoin='round'%3E%3Crect x='1.5' y='3' width='13' height='10' rx='2.5'/%3E%3Cpath d='M6.6 6.2 10.4 8l-3.8 1.8z' fill='black'/%3E%3C/svg%3E");
	}
</style>
