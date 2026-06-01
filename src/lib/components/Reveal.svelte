<script lang="ts">
	import { browser } from '$app/environment';

	let { children, class: className = '' } = $props();
	let element: HTMLElement;
	let enhanced = $state(false);
	let visible = $state(true);

	$effect(() => {
		if (!browser || !element) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			visible = true;
			return;
		}

		enhanced = true;
		visible = false;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0 }
		);

		observer.observe(element);
		return () => observer.disconnect();
	});
</script>

<div bind:this={element} class={`reveal ${className}`} class:enhanced class:visible>
	{@render children()}
</div>

<style>
	.reveal {
		opacity: 1;
		transform: none;
	}

	.reveal.enhanced {
		opacity: 0;
		transform: translateY(18px);
		transition:
			opacity 520ms ease,
			transform 520ms ease;
	}

	.reveal.enhanced.visible {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
