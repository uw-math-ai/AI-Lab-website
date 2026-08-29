<script lang="ts">
	import '../app.css';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import ThemeController from '$lib/components/ThemeController.svelte';

	let { children } = $props();
</script>

<ThemeController />
<SiteHeader />
<main>
	{@render children()}
</main>
<SiteFooter />
