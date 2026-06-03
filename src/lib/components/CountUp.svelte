<script lang="ts">
	import { browser } from '$app/environment';

	let { value, suffix = '' }: { value: number; suffix?: string } = $props();
	let element: HTMLElement;
	let current = $state(0);
	let animating = $state(false);

	$effect(() => {
		if (!browser || !element) {
			current = value;
			return;
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			current = value;
			return;
		}

		animating = true;
		current = 0;

		let frame = 0;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;
				const start = performance.now();
				const duration = 1350;

				function step(now: number) {
					const progress = Math.min((now - start) / duration, 1);
					const eased = 1 - Math.pow(1 - progress, 3);
					current = Math.round(eased * value);
					if (progress < 1) frame = requestAnimationFrame(step);
				}

				frame = requestAnimationFrame(step);
				observer.disconnect();
			},
			{ threshold: 0.3 }
		);

		observer.observe(element);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	});
</script>

<span bind:this={element}>{animating ? current : value}{suffix}</span>
