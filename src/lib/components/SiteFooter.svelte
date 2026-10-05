<script lang="ts">
	import { sitePath } from '$lib/paths';
</script>

<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<span class="wordmark">Math AI Lab</span>
			<p>Department of Mathematics<br />University of Washington</p>
			<small>© 2026</small>
			<small>Report a bug to zengrf at uw dot edu</small>
		</div>

		<div class="footer-col">
			<span class="label">Site</span>
			<a href={sitePath('/projects')}>Projects</a>
			<a href={sitePath('/research')}>Research</a>
			<a href={sitePath('/people')}>People</a>
			<a href={sitePath('/events')}>Events</a>
			<a href={sitePath('/news')}>News</a>
			<a href={sitePath('/resources')}>Resources</a>
		</div>

		<div class="footer-col">
			<span class="label">Tools</span>
			<a href="https://www.theoremsearch.com" target="_blank" rel="noreferrer">TheoremSearch<span class="sr-only"> (opens in new tab)</span></a>
			<a href="https://open-problems-map.pages.dev" target="_blank" rel="noreferrer">Map of Open Problems<span class="sr-only"> (opens in new tab)</span></a>
		</div>

		<div class="footer-col">
			<span class="label">Elsewhere</span>
			<a href="https://github.com/uw-math-ai" target="_blank" rel="noreferrer">GitHub<span class="sr-only"> (opens in new tab)</span></a>
			<a href="https://huggingface.co/uw-math-ai" target="_blank" rel="noreferrer">Hugging Face<span class="sr-only"> (opens in new tab)</span></a>
			<a href="https://uw2026leanhackathon.github.io/" target="_blank" rel="noreferrer">Lean Hackathon 2026<span class="sr-only"> (opens in new tab)</span></a>
			<a href="https://math.washington.edu" target="_blank" rel="noreferrer">UW Mathematics<span class="sr-only"> (opens in new tab)</span></a>
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
		grid-template-columns: minmax(0, 1.6fr) repeat(3, minmax(0, 1fr));
		column-gap: clamp(1.5rem, 4vw, 3rem);
		row-gap: 2.5rem;
		width: min(var(--shell), calc(100vw - 3rem));
		margin: 0 auto;
		padding: 3rem 0 3.5rem;
	}

	.wordmark {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: var(--text-lg);
	}

	.footer-brand small:first-of-type {
		margin-top: 1rem;
	}

	.footer-brand p {
		margin: 0.6rem 0 0;
		color: var(--muted);
		font-size: var(--text-base);
		line-height: 1.45;
	}

	.footer-brand small {
		display: block;
		margin-top: 0.35rem;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--muted);
	}

	.footer-col {
		display: grid;
		align-content: start;
		gap: 0.45rem;
	}

	.footer-col .label {
		margin-bottom: 0.3rem;
		color: var(--muted);
	}

	.footer-col a {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--text);
		text-decoration: none;
		width: fit-content;
	}

	.footer-col a:hover {
		color: var(--purple);
		text-decoration: underline;
	}

	@media (max-width: 960px) {
		.footer-inner {
			grid-template-columns: repeat(2, minmax(0, 1fr));
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
