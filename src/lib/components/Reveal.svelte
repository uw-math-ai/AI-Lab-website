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
		const itemObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add('is-revealed');
					itemObserver.unobserve(entry.target);
				}
			},
			{ rootMargin: '0px 0px -6% 0px', threshold: 0.04 }
		);
		const observeItems = () => {
			element
				.querySelectorAll('[data-reveal-item]:not(.is-revealed)')
				.forEach((item) => itemObserver.observe(item));
		};
		const mutationObserver = new MutationObserver(observeItems);

		observer.observe(element);
		observeItems();
		mutationObserver.observe(element, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
			itemObserver.disconnect();
			mutationObserver.disconnect();
		};
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

	.reveal.enhanced :global([data-reveal-item]) {
		opacity: 0;
		translate: 0 14px;
		transition:
			opacity 440ms ease var(--reveal-delay, 0ms),
			translate 440ms ease var(--reveal-delay, 0ms),
			border-color 180ms ease,
			box-shadow 180ms ease,
			background 180ms ease;
	}

	.reveal.enhanced :global([data-reveal-item].is-revealed) {
		opacity: 1;
		translate: 0 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}

		.reveal :global([data-reveal-item]) {
			opacity: 1;
			translate: none;
			transition: none;
		}
	}
</style>
