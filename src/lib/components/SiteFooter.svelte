<script lang="ts">
	import { sitePath } from '$lib/paths';

	let theme = $state('auto');
	const themeOptions = [
		{ label: 'Auto', value: 'auto' },
		{ label: 'Light', value: 'light' },
		{ label: 'Dark', value: 'dark' }
	];

	$effect(() => {
		try {
			theme = localStorage.getItem('math-ai-theme') ?? 'auto';
		} catch {
			theme = 'auto';
		}
	});

	function setTheme(value: string) {
		theme = value;
		window.dispatchEvent(new CustomEvent('math-ai-theme', { detail: value }));
	}
</script>

<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<span class="wordmark">Math AI Lab</span>
			<p>Department of Mathematics<br />University of Washington</p>
			<small>© 2026 · Report a bug to zengrf at uw dot edu</small>
		</div>

		<div class="footer-col">
			<span class="label">Site</span>
			<a href={sitePath('/projects')}>Projects</a>
			<a href={sitePath('/research')}>Research</a>
			<a href={sitePath('/people')}>People</a>
			<a href={sitePath('/events')}>Events</a>
			<a href={sitePath('/resources')}>Resources</a>
		</div>

		<div class="footer-col">
			<span class="label">Tools</span>
			<a href="https://www.theoremsearch.com" target="_blank" rel="noreferrer">TheoremSearch</a>
			<a href="https://open-problems-map.pages.dev" target="_blank" rel="noreferrer">Map of Open Problems</a>
			<a href="https://api.theoremsearch.com/openapi.json" target="_blank" rel="noreferrer">API</a>
			<a href="https://uw2026leanhackathon.github.io/" target="_blank" rel="noreferrer">Lean Hackathon 2026</a>
		</div>

		<div class="footer-col">
			<span class="label">Elsewhere</span>
			<a href="https://github.com/uw-math-ai" target="_blank" rel="noreferrer">GitHub</a>
			<a href="https://huggingface.co/uw-math-ai" target="_blank" rel="noreferrer">Hugging Face</a>
			<a href="https://math.washington.edu" target="_blank" rel="noreferrer">UW Mathematics</a>
			<div class="theme" role="group" aria-label="Theme">
				<span class="label">Theme</span>
				{#each themeOptions as option}
					<button type="button" class:on={theme === option.value} onclick={() => setTheme(option.value)}>{option.label}</button>
				{/each}
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		margin-top: clamp(3rem, 8vw, 6rem);
		border-top: 1px solid var(--line-strong);
		background: var(--bg);
		color: var(--text);
	}

	.footer-inner {
		display: grid;
		grid-template-columns: 1.6fr 1fr 1fr 1fr;
		gap: 2rem;
		width: min(var(--shell), calc(100vw - 3rem));
		margin: 0 auto;
		padding: 3rem 0 3.5rem;
	}

	.wordmark {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 1.2rem;
	}

	.footer-brand p {
		margin: 0.6rem 0 0;
		color: var(--muted);
		font-size: 0.95rem;
		line-height: 1.45;
	}

	.footer-brand small {
		display: block;
		margin-top: 1rem;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--faint);
	}

	.footer-col {
		display: grid;
		align-content: start;
		gap: 0.45rem;
	}

	.footer-col .label {
		margin-bottom: 0.3rem;
	}

	.footer-col a {
		font-family: var(--font-sans);
		font-size: 0.88rem;
		color: var(--text);
		text-decoration: none;
		width: fit-content;
	}

	.footer-col a:hover {
		color: var(--purple);
		text-decoration: underline;
	}

	.theme {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		margin-top: 0.8rem;
	}

	.theme .label {
		width: 100%;
	}

	.theme button {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: transparent;
		color: var(--muted);
		font-family: var(--font-sans);
		font-size: 0.74rem;
		font-weight: 600;
		padding: 0.25rem 0.65rem;
		cursor: pointer;
	}

	.theme button.on {
		border-color: var(--text);
		color: var(--text);
	}

	@media (max-width: 800px) {
		.footer-inner {
			grid-template-columns: 1fr 1fr;
		}

		.footer-brand {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 600px) {
		.footer-inner {
			width: min(100% - 2rem, var(--shell));
		}
	}
</style>
