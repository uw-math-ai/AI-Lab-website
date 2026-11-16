<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { routePath } from '$lib/paths';

	const mapUrl = 'https://mapmyvisitors.com/map.png?d=6SSp3_GeMPxRz4wZjZmUf89idl07sEJkylComjed7hw&w=420&t=n&cl=83719d&co=ffffff&cmo=4b2e83&cmn=c79820';
	let lastPath = '';
	let imageUrl = $state('');

	afterNavigate(({ to }) => {
		if (to?.url.hostname !== 'ai.math.uw.edu' || navigator.doNotTrack === '1') return;
		const path = routePath(to.url.pathname);
		if (path === lastPath) return;
		lastPath = path;
		// A fresh image request records each page visit, including repeat visits via Back.
		imageUrl = mapUrl + '&v=' + Date.now();
	});
</script>

<a class="visitor-map" href="https://mapmyvisitors.com/web/1c9ia">
	{#if imageUrl}
		<img src={imageUrl} alt="World map of approximate visitor locations" width="420" height="206" referrerpolicy="origin" />
	{/if}
	<span>Visitor statistics</span>
</a>

<style>
	.visitor-map {
		display: grid;
		align-self: start;
		justify-self: end;
		justify-items: center;
		width: 12rem;
		max-width: 100%;
		color: var(--purple-ink);
		font-family: var(--font-serif);
		font-size: var(--text-base);
		text-decoration: none;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		mix-blend-mode: multiply;
	}

	:global(html[data-theme='dark']) img {
		filter: invert(1) hue-rotate(180deg);
		mix-blend-mode: screen;
	}

	span {
		padding-top: 0.35rem;
		border-top: 1px solid var(--line);
		width: 100%;
		text-align: center;
	}

	.visitor-map:hover span, .visitor-map:focus-visible span { text-decoration: underline; }

	@media (max-width: 960px) {
		.visitor-map { justify-self: start; }
	}
</style>
