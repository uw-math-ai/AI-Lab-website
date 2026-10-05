<script lang="ts">
	import { page } from '$app/stores';
	import { routePath, sitePath } from '$lib/paths';

	import { browser } from '$app/environment';

	let menuOpen = $state(false);
	let theme = $state('light');
	let pathname = $derived(routePath($page.url.pathname));

	// ThemeController owns the theme; the header mirrors it and asks for changes
	// through the same event, so the footer's Auto/Light/Dark stays in sync.
	$effect(() => {
		if (!browser) return;
		const read = () => (theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
		read();
		const observer = new MutationObserver(read);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	});

	function toggleTheme() {
		window.dispatchEvent(
			new CustomEvent('math-ai-theme', { detail: theme === 'dark' ? 'light' : 'dark' })
		);
	}

	const navItems = [
		{ href: '/projects', label: 'Projects', match: (p: string) => p.startsWith('/projects') },
		{ href: '/research', label: 'Research', match: (p: string) => p === '/research' },
		{ href: '/people', label: 'People', match: (p: string) => p === '/people' },
		{ href: '/events', label: 'Events', match: (p: string) => p === '/events' },
		{ href: '/news', label: 'News', match: (p: string) => p === '/news' },
		{ href: '/resources', label: 'Resources', match: (p: string) => p === '/resources' }
	];

	function closeMenus() {
		menuOpen = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) {
			menuOpen = false;
			document.querySelector<HTMLElement>('.menu-button')?.focus();
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<header class="site-header">
	<div class="header-inner">
		<a class="brand" href={sitePath('/')} onclick={closeMenus} aria-label="Math AI Lab home">
			<img src={sitePath('/logos/math-ai-mark.svg')} alt="" />
			<span class="wordmark">Math AI Lab</span>
			<span class="institution">University of Washington</span>
		</a>

		<div class="header-right">
			<nav id="primary-navigation" class:open={menuOpen} aria-label="Primary navigation">
			{#each navItems as item}
				<a class:active={item.match(pathname)} href={sitePath(item.href)} onclick={closeMenus}>{item.label}</a>
			{/each}
			<a
				class="support"
				href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
				target="_blank"
				rel="noreferrer"
			>
				Support the lab<span class="sr-only"> (opens in new tab)</span>
			</a>
			</nav>

			<button
				class="theme-toggle"
				type="button"
				onclick={toggleTheme}
				title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
			>
				<svg viewBox="0 0 16 16" aria-hidden="true">
					<circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.2" />
					<path d="M8 1.6a6.4 6.4 0 0 1 0 12.8z" fill="currentColor" />
				</svg>
			</button>

			<button
				class="menu-button"
				type="button"
				aria-expanded={menuOpen}
				aria-controls="primary-navigation"
				onclick={() => (menuOpen = !menuOpen)}
			>
				<span class="bars" aria-hidden="true"><i></i><i></i></span>
				<span class="menu-label">Menu</span>
			</button>
		</div>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 40;
		background: color-mix(in srgb, var(--bg) 84%, transparent);
		border-bottom: 1px solid var(--line);
		backdrop-filter: saturate(140%) blur(14px);
		-webkit-backdrop-filter: saturate(140%) blur(14px);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: min(var(--shell), calc(100vw - 3rem));
		margin: 0 auto;
		height: 3.6rem;
	}

	.brand {
		display: inline-flex;
		align-items: baseline;
		gap: 0.6rem;
		color: var(--text);
		text-decoration: none;
		min-width: 0;
	}

	.brand img {
		width: 1.35rem;
		height: 1.35rem;
		align-self: center;
		object-fit: contain;
	}

	.wordmark {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: var(--text-md);
		letter-spacing: -0.01em;
		white-space: nowrap;
	}

	.institution {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		padding-left: 0.6rem;
		border-left: 1px solid var(--line-strong);
		white-space: nowrap;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 0.15rem;
	}

	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		/* Matches the vertical box of the nav links beside it. */
		width: 2.1rem;
		height: 2.1rem;
		padding: 0;
		border: 1px solid var(--line-strong);
		border-radius: var(--radius);
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		transition:
			color var(--motion-fast),
			border-color var(--motion-fast);
	}

	.theme-toggle svg {
		width: 0.9rem;
		height: 0.9rem;
		display: block;
	}

	.theme-toggle:hover {
		color: var(--text);
		border-color: var(--text);
	}

	nav a {
		position: relative;
		border-radius: var(--radius);
		color: var(--muted);
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
		padding: 0.45rem 0.7rem;
		transition:
			color var(--motion-fast),
			background var(--motion-fast);
	}

	nav a:hover {
		color: var(--text);
		background: var(--soft);
	}

	nav a.active {
		color: var(--text);
	}

	nav a.active::after {
		content: '';
		position: absolute;
		left: 0.7rem;
		right: 0.7rem;
		bottom: 0.18rem;
		height: 2px;
		background: var(--text);
		border-radius: 0;
	}

	nav .support {
		display: inline-flex;
		align-items: center;
		height: 2.1rem;
		margin-left: 0.5rem;
		border: 1px solid var(--line-strong);
		color: var(--text);
	}

	nav .support:hover {
		border-color: var(--text);
	}

	.menu-button {
		display: none;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid var(--line-strong);
		border-radius: var(--radius);
		background: transparent;
		color: var(--text);
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		padding: 0.45rem 0.8rem;
		cursor: pointer;
	}

	.bars {
		display: inline-grid;
		gap: 4px;
		width: 14px;
	}

	.bars i {
		display: block;
		height: 1.5px;
		background: currentColor;
	}

	/* The institution line only fits when the header has room to spare. */
	@media (max-width: 1100px) {
		.institution {
			display: none;
		}
	}

	@media (max-width: 960px) {
		.institution {
			display: none;
		}

		.menu-button {
			display: inline-flex;
			min-height: 2.75rem;
		}

		.theme-toggle {
			width: 2.75rem;
			height: 2.75rem;
		}

		nav {
			position: fixed;
			top: 4.3rem;
			right: 1rem;
			left: 1rem;
			display: grid;
			align-items: stretch;
			max-height: calc(100vh - 6rem);
			max-height: calc(100dvh - 6rem);
			overflow-y: auto;
			padding: 0.5rem;
			background: var(--surface-strong);
			border: 1px solid var(--line);
			border-radius: var(--radius-lg);
			box-shadow: var(--shadow);
			/* Closed menu must leave the tab order and the accessibility tree. */
			visibility: hidden;
			opacity: 0;
			pointer-events: none;
			transform: translateY(-0.4rem);
			transition:
				opacity var(--motion-fast),
				transform var(--motion-fast),
				visibility 0s linear 180ms;
		}

		nav.open {
			visibility: visible;
			opacity: 1;
			pointer-events: auto;
			transform: translateY(0);
			transition-delay: 0s;
		}

		nav a {
			padding: 0.85rem 0.9rem;
			font-size: var(--text-base);
			border-radius: var(--radius);
		}

		nav a.active::after {
			display: none;
		}

		nav a.active {
			background: var(--soft);
		}

		nav .support {
			margin: 0.25rem 0 0;
			text-align: center;
		}
	}

	@media (max-width: 600px) {
		.header-inner {
			width: min(100% - 2rem, var(--shell));
		}

		nav {
			top: 4rem;
		}
	}
</style>
