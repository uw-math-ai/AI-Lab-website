<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	type Tracker = { track: (payload: (defaults: Record<string, unknown>) => Record<string, unknown>) => void };
	let lastPage = '';

	function pageUrl(value: string) {
		if (!value) return '';
		const url = new URL(value, window.location.href);
		return url.origin + url.pathname;
	}

	function trackPage() {
		const tracker = (window as Window & { umami?: Tracker }).umami;
		const url = pageUrl(window.location.href);
		if (!tracker || url === lastPage) return;
		const referrer = lastPage || pageUrl(document.referrer);
		tracker.track((defaults) => ({ ...defaults, url, referrer, title: document.title }));
		lastPage = url;
	}

	// One owner for page views, including browser Back/Forward. Query and hash
	// changes are not new pages. The tracker still enforces domains and DNT.
	afterNavigate(trackPage);

	onMount(() => {
		const script = document.querySelector('script[data-website-id="84390274-89b9-440f-aa94-e7194281b4cf"]');
		script?.addEventListener('load', trackPage);
		trackPage(); // The deferred script may have loaded before hydration.
		return () => script?.removeEventListener('load', trackPage);
	});
</script>
