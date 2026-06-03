<script lang="ts">
	let open = $state(false);
	const themeOptions = [
		{ label: 'Auto', value: 'auto' },
		{ label: 'Light', value: 'light' },
		{ label: 'Dark', value: 'dark' }
	];

	function setTheme(value: string) {
		window.dispatchEvent(new CustomEvent('math-ai-theme', { detail: value }));
		open = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<footer class="site-footer">
	<div>
		<strong>Math AI Lab</strong>
		<span>Department of Mathematics, University of Washington © 2026</span>
		<small>Report a bug to zengrf at uw dot edu</small>
	</div>
	<div class="footer-links">
		<a href="https://github.com/uw-math-ai" target="_blank" rel="noreferrer">GitHub</a>
		<a href="https://huggingface.co/uw-math-ai" target="_blank" rel="noreferrer">HuggingFace</a>
		<button type="button" aria-expanded={open} aria-label="Open site settings" onclick={() => (open = !open)}>⚙</button>
	</div>

	<button class="drawer-backdrop" class:open={open} type="button" aria-label="Close site settings" onclick={() => (open = false)}></button>
	<div class="settings-drawer" class:open>
		<div>
			<div class="drawer-title">
				<h2>Site settings</h2>
				<button type="button" aria-label="Close site settings" onclick={() => (open = false)}>Close</button>
			</div>
			<p>Theme defaults to light from 7am to 6:59pm and dark from 7pm to 6:59am.</p>
		</div>
		<div class="theme-buttons" role="group" aria-label="Theme mode">
			{#each themeOptions as option}
				<button type="button" onclick={() => setTheme(option.value)}>{option.label}</button>
			{/each}
		</div>
	</div>
</footer>

<style>
	.site-footer {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 2rem max(1rem, calc((100vw - 1180px) / 2));
		background: var(--purple);
		color: white;
		overflow: hidden;
	}

	.site-footer::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(168deg, transparent 0 72%, color-mix(in srgb, white 12%, transparent) 72% 100%),
			var(--footer-texture);
		pointer-events: none;
	}

	.site-footer > * {
		position: relative;
		z-index: 1;
	}

	.site-footer div:first-child {
		display: grid;
		gap: 0.25rem;
	}

	.site-footer span {
		color: color-mix(in srgb, white 72%, transparent);
	}

	.site-footer small {
		color: color-mix(in srgb, white 64%, transparent);
		font-size: 0.78rem;
	}

	.footer-links {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.footer-links a,
	.footer-links button,
	.theme-buttons button {
		border: 1px solid color-mix(in srgb, white 25%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, white 10%, transparent);
		color: white;
		text-decoration: none;
		padding: 0.55rem 0.78rem;
		font: inherit;
		cursor: pointer;
	}

	.footer-links button {
		width: 2.4rem;
		height: 2.4rem;
		padding: 0;
	}

	.settings-drawer {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 81;
		width: min(24rem, calc(100vw - 2rem));
		display: grid;
		gap: 1rem;
		padding: 1.1rem;
		background: var(--surface-strong);
		color: var(--text);
		border: 1px solid var(--line);
		border-radius: 1rem;
		box-shadow: var(--shadow);
		opacity: 0;
		pointer-events: none;
		transform: translateY(1rem);
		transition: all 180ms ease;
	}

	.settings-drawer.open {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
	}

	.drawer-backdrop {
		position: fixed;
		inset: 0;
		z-index: 80;
		border: 0;
		background: transparent;
		opacity: 0;
		pointer-events: none;
	}

	.drawer-backdrop.open {
		pointer-events: auto;
	}

	.drawer-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.settings-drawer h2 {
		margin: 0 0 0.25rem;
		font-size: 1rem;
	}

	.drawer-title button {
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--soft);
		color: var(--text);
		padding: 0.35rem 0.6rem;
		font-size: 0.8rem;
		font-weight: 800;
		cursor: pointer;
	}

	.settings-drawer p {
		margin: 0;
		color: var(--muted);
		font-size: 0.92rem;
	}

	.theme-buttons {
		display: flex;
		gap: 0.55rem;
		flex-wrap: wrap;
	}

	.theme-buttons button {
		background: var(--soft);
		color: var(--text);
		border-color: var(--line);
	}

	@media (max-width: 760px) {
		.site-footer {
			align-items: flex-start;
			flex-direction: column;
		}

		.footer-links {
			justify-content: flex-start;
		}
	}
</style>
