<script lang="ts">
	import { browser } from '$app/environment';

	const storageKey = 'math-ai-theme';

	function automaticTheme() {
		const hour = new Date().getHours();
		return hour >= 19 || hour < 7 ? 'dark' : 'light';
	}

	function applyTheme(theme: string) {
		document.documentElement.dataset.theme = theme;
		document.documentElement.style.colorScheme = theme;
	}

	$effect(() => {
		if (!browser) return;

		const stored = localStorage.getItem(storageKey);
		applyTheme(stored ?? automaticTheme());

		const interval = window.setInterval(() => {
			if (!localStorage.getItem(storageKey)) applyTheme(automaticTheme());
		}, 60_000);

		const listener = (event: Event) => {
			const detail = (event as CustomEvent<string>).detail;
			if (detail === 'auto') {
				localStorage.removeItem(storageKey);
				applyTheme(automaticTheme());
			} else {
				localStorage.setItem(storageKey, detail);
				applyTheme(detail);
			}
		};

		window.addEventListener('math-ai-theme', listener);

		return () => {
			window.clearInterval(interval);
			window.removeEventListener('math-ai-theme', listener);
		};
	});
</script>
