<script lang="ts">
	import { page } from '$app/stores';
	import { routePath, sitePath } from '$lib/paths';

	let menuOpen = $state(false);
	let pathname = $derived(routePath($page.url.pathname));

	const navItems = [
		{ href: '/people', label: 'People' },
		{ href: '/research', label: 'Research' },
		{ href: '/events', label: 'Events' },
		{ href: '/resources', label: 'Resources' }
	];

	function closeMenus() {
		menuOpen = false;
	}
</script>

<header class="site-header">
	<a class="brand" href={sitePath('/')} onclick={closeMenus} aria-label="Math AI Lab home">
		<img src={sitePath('/logos/math-ai-mark.svg')} alt="" />
		<span>
			<strong>Math AI Lab</strong>
			<small>University of Washington</small>
		</span>
	</a>

	<button class="menu-button" type="button" aria-expanded={menuOpen} onclick={() => (menuOpen = !menuOpen)}>
		<span></span>
		<span></span>
		<span></span>
		Mobile navigation
	</button>

	<nav class:open={menuOpen} aria-label="Primary navigation">
		<a class:active={pathname === '/'} href={sitePath('/')} onclick={closeMenus}>Home</a>
		<a class:active={pathname.startsWith('/projects')} href={sitePath('/projects')} onclick={closeMenus}>Projects</a>
		{#each navItems as item}
			<a class:active={pathname === item.href} href={sitePath(item.href)} onclick={closeMenus}>{item.label}</a>
		{/each}
		<a class="accent" href="https://uw2026leanhackathon.github.io/" target="_blank" rel="noreferrer">Lean Hackathon</a>
		<a
			class="support"
			href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
			target="_blank"
			rel="noreferrer"
		>
			Support us
		</a>
	</nav>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem max(1rem, calc((100vw - 1180px) / 2));
		background: color-mix(in srgb, var(--surface) 88%, transparent);
		border-bottom: 1px solid var(--line);
		backdrop-filter: blur(18px);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--text);
		text-decoration: none;
		min-width: max-content;
	}

	.brand img {
		width: 2.6rem;
		height: 2.6rem;
		object-fit: contain;
	}

	.brand span {
		display: grid;
		line-height: 1.05;
	}

	.brand strong {
		font-family: var(--font-display);
		font-size: 1.05rem;
	}

	.brand small {
		color: var(--muted);
		font-size: 0.73rem;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	nav a {
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--text);
		font: inherit;
		font-size: 0.88rem;
		font-weight: 650;
		text-decoration: none;
		padding: 0.58rem 0.72rem;
		cursor: pointer;
		transition:
			background 180ms ease,
			color 180ms ease,
			transform 180ms ease;
	}

	nav a:hover,
	nav .active {
		background: var(--soft);
		color: var(--purple);
	}

	nav a:hover {
		transform: translateY(-1px);
	}

	.accent {
		color: var(--purple) !important;
		border: 1px solid color-mix(in srgb, var(--purple) 25%, transparent);
	}

	.support {
		background: var(--purple) !important;
		color: white !important;
		box-shadow: var(--glow-small);
	}

	.menu-button {
		display: none;
		position: relative;
		width: 2.65rem;
		height: 2.65rem;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--surface-strong);
		color: transparent;
	}

	.menu-button span {
		position: absolute;
		left: 0.7rem;
		width: 1.2rem;
		height: 2px;
		background: var(--text);
	}

	.menu-button span:nth-child(1) {
		top: 0.82rem;
	}

	.menu-button span:nth-child(2) {
		top: 1.28rem;
	}

	.menu-button span:nth-child(3) {
		top: 1.74rem;
	}

	@media (max-width: 1080px) {
		.site-header {
			padding-inline: 1rem;
		}

		.menu-button {
			display: inline-block;
		}

		nav {
			position: fixed;
			top: 4.7rem;
			right: 1rem;
			left: 1rem;
			display: grid;
			align-items: stretch;
			max-height: calc(100vh - 6rem);
			overflow-y: auto;
			padding: 0.75rem;
			background: var(--surface-strong);
			border: 1px solid var(--line);
			border-radius: 1rem;
			box-shadow: var(--shadow);
			opacity: 0;
			pointer-events: none;
			transform: translateY(-0.5rem);
			transition: all 180ms ease;
		}

		nav.open {
			opacity: 1;
			pointer-events: auto;
			transform: translateY(0);
		}
	}
</style>
