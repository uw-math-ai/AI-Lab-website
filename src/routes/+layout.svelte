<script lang="ts">
	import '../app.css';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import MathBackground from '$lib/components/MathBackground.svelte';
	import ThemeController from '$lib/components/ThemeController.svelte';
	import Analytics from '$lib/components/Analytics.svelte';

	let { children } = $props();
</script>

<a class="skip-link" href="#main">Skip to main content</a>
<ThemeController />
<Analytics />
<MathBackground />
<SiteHeader />
<main id="main" tabindex="-1">
	{@render children()}
</main>
<SiteFooter />
