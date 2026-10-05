<script lang="ts">
	/**
	 * A framed, lazily-loaded live embed of one of the lab's web tools.
	 * Shows a poster until the visitor asks for the live page, so the home page
	 * stays light and third-party frames only load on demand.
	 */
	import { sitePath } from '$lib/paths';

	let {
		src,
		title,
		poster,
		posterAlt = '',
		ratio = '16 / 10',
		loadLabel = 'Load the live page'
	} = $props<{
		src: string;
		title: string;
		poster: string;
		posterAlt?: string;
		ratio?: string;
		loadLabel?: string;
	}>();

	let live = $state(false);
	let loaded = $state(false);
	let host = $derived(new URL(src).host);
</script>

<figure class="embed" style={`--ratio: ${ratio}`}>
	<div class="chrome">
		<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
		<span class="url">{host}</span>
		<a class="open" href={src} target="_blank" rel="noreferrer">Open<span class="sr-only"> {title} in a new tab</span> <span aria-hidden="true">↗</span></a>
	</div>
	<div class="viewport">
		{#if live}
			<iframe
				{src}
				{title}
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				allow="fullscreen"
				onload={() => (loaded = true)}
				class:loaded
			></iframe>
		{/if}
		{#if !loaded}
			<img src={sitePath(poster)} alt={posterAlt} loading="lazy" decoding="async" />
			{#if !live}
				<button type="button" class="load" onclick={() => (live = true)}>
					<span class="play" aria-hidden="true">▶</span>
					{loadLabel}
				</button>
			{:else}
				<span class="loading" role="status">Loading {host}…</span>
			{/if}
		{/if}
	</div>
</figure>

<style>
	.embed {
		margin: 0;
		border: 1px solid var(--line-strong);
		border-radius: var(--radius-lg);
		background: var(--surface);
		overflow: hidden;
	}

	.chrome {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		height: 2.2rem;
		padding: 0 0.8rem;
		border-bottom: 1px solid var(--line);
		background: var(--soft);
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--muted);
	}

	.dots {
		display: inline-flex;
		gap: 5px;
	}

	.dots i {
		width: 9px;
		height: 9px;
		border-radius: 0;
		background: var(--line-strong);
	}

	.url {
		flex: 1;
		font-family: var(--font-sans);
		text-align: center;
	}

	.open {
		color: var(--purple);
		text-decoration: none;
		font-weight: 600;
	}

	.open:hover {
		text-decoration: underline;
	}

	.viewport {
		position: relative;
		aspect-ratio: var(--ratio);
		background: #fdfdfb;
	}

	iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		opacity: 0;
		transition: opacity 400ms ease;
	}

	iframe.loaded {
		opacity: 1;
	}

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
	}

	.load {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		border: 1px solid #1b1e23;
		border-radius: var(--radius);
		background: #fff;
		color: #1b1e23;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		padding: 0.75rem 1.3rem 0.75rem 1rem;
		cursor: pointer;
	}

	.load:hover {
		background: #1b1e23;
		color: #fff;
	}

	.play {
		font-size: var(--text-xs);
	}

	.loading {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: #1b1e23;
		background: rgba(255, 255, 255, 0.9);
		padding: 0.4rem 0.8rem;
		border-radius: 0;
	}

	@media (max-width: 700px) {
		.viewport {
			aspect-ratio: 4 / 3;
		}

		.load {
			width: max-content;
			max-width: calc(100% - 2rem);
			font-size: var(--text-sm);
			padding: 0.6rem 1rem 0.6rem 0.85rem;
			white-space: nowrap;
		}

		.chrome {
			font-size: var(--text-xs);
			gap: 0.5rem;
		}

		.url {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
