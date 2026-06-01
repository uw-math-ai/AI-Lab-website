<script lang="ts">
	import type { LeanSnippet } from '$lib/data/leanSnippets';

	let { snippet } = $props<{ snippet: LeanSnippet }>();
</script>

<div class="code-panel">
	<pre><code>{snippet.code}</code></pre>
	<a class="snippet-source" href={snippet.sourceUrl} target="_blank" rel="noreferrer">
		Source: {snippet.sourceLabel}
	</a>
</div>
