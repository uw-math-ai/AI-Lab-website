<script lang="ts">
	import { browser } from '$app/environment';

	const symbols = [
		'∑',
		'∫',
		'∇',
		'∂',
		'∈',
		'ℝ',
		'ℂ',
		'π',
		'λ',
		'φ',
		'α',
		'β',
		'γ',
		'Δ',
		'Ω',
		'ε',
		'δ',
		'∀',
		'∃',
		'√',
		'∞',
		'⊂',
		'≡',
		'⊗',
		'⟨',
		'⟩',
		'θ',
		'μ',
		'σ',
		'ρ'
	];

	type Particle = {
		x: number;
		y: number;
		symbol: string;
		size: number;
		alpha: number;
		vx: number;
		vy: number;
		phase: number;
	};

	let canvas: HTMLCanvasElement;

	$effect(() => {
		if (!browser || !canvas) return;

		const maybeContext = canvas.getContext('2d');
		if (!maybeContext) return;
		const context = maybeContext;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let frame = 0;
		let particles: Particle[] = [];

		function color(name: string, fallback: string) {
			return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
		}

		function resize() {
			const scale = window.devicePixelRatio || 1;
			canvas.width = Math.floor(window.innerWidth * scale);
			canvas.height = Math.floor(window.innerHeight * scale);
			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;
			context.setTransform(scale, 0, 0, scale, 0, 0);
		}

		function makeParticle(fromBottom = false): Particle {
			return {
				x: Math.random() * window.innerWidth,
				y: fromBottom ? window.innerHeight + 28 : Math.random() * window.innerHeight,
				symbol: symbols[Math.floor(Math.random() * symbols.length)],
				size: 12 + Math.random() * 18,
				alpha: 0.035 + Math.random() * 0.085,
				vx: (Math.random() - 0.5) * 0.18,
				vy: -0.08 - Math.random() * 0.18,
				phase: Math.random() * Math.PI * 2
			};
		}

		function resetParticles() {
			const count = window.innerWidth < 700 ? 26 : 46;
			particles = Array.from({ length: count }, () => makeParticle(false));
		}

		function draw() {
			context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			const symbolColor = color('--ambient-symbol', color('--gold', '#d6a900'));
			const haloColor = color('--ambient-halo', color('--purple', '#32006e'));

			for (let index = 0; index < particles.length; index += 1) {
				const particle = particles[index];
				context.save();
				context.globalAlpha = particle.alpha;
				context.fillStyle = symbolColor;
				context.shadowColor = haloColor;
				context.shadowBlur = 10;
				context.font = `${particle.size}px "Space Grotesk", "Inter", sans-serif`;
				context.fillText(
					particle.symbol,
					particle.x + Math.sin(particle.phase) * 5,
					particle.y
				);
				context.restore();

				if (!reducedMotion.matches) {
					particle.x += particle.vx;
					particle.y += particle.vy;
					particle.phase += 0.006;
				}

				if (particle.y < -36 || particle.x < -52 || particle.x > window.innerWidth + 52) {
					particles[index] = makeParticle(true);
				}
			}

			if (!reducedMotion.matches) {
				frame = requestAnimationFrame(draw);
			}
		}

		function start() {
			cancelAnimationFrame(frame);
			resize();
			resetParticles();
			draw();
		}

		window.addEventListener('resize', start);
		reducedMotion.addEventListener('change', start);
		start();

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', start);
			reducedMotion.removeEventListener('change', start);
		};
	});
</script>

<div class="ambient-field" aria-hidden="true"></div>
<canvas bind:this={canvas} class="math-canvas" aria-hidden="true"></canvas>
<div class="grain" aria-hidden="true"></div>

<style>
	.ambient-field,
	.math-canvas,
	.grain {
		position: fixed;
		inset: 0;
		pointer-events: none;
	}

	.ambient-field {
		z-index: 0;
		background:
			radial-gradient(
				ellipse 58% 46% at 8% 42%,
				color-mix(in srgb, var(--gold) 13%, transparent) 0%,
				transparent 66%
			),
			radial-gradient(
				ellipse 46% 40% at 86% 12%,
				color-mix(in srgb, var(--cyan) 10%, transparent) 0%,
				transparent 60%
			),
			radial-gradient(
				ellipse 42% 54% at 58% 96%,
				color-mix(in srgb, var(--purple) 10%, transparent) 0%,
				transparent 64%
			);
		animation: mesh-drift 24s ease-in-out infinite alternate;
	}

	.math-canvas {
		z-index: 0;
		width: 100%;
		height: 100%;
		opacity: 0.78;
	}

	.grain {
		z-index: 3;
		opacity: 0.026;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-size: 256px 256px;
		mix-blend-mode: multiply;
	}

	:root[data-theme='dark'] .ambient-field {
		background:
			radial-gradient(ellipse 55% 44% at 10% 42%, rgba(196, 154, 255, 0.13) 0%, transparent 66%),
			radial-gradient(ellipse 46% 40% at 86% 12%, rgba(95, 244, 255, 0.12) 0%, transparent 60%),
			radial-gradient(ellipse 42% 54% at 58% 96%, rgba(255, 215, 90, 0.09) 0%, transparent 64%);
	}

	:root[data-theme='dark'] .math-canvas {
		opacity: 0.92;
	}

	:root[data-theme='dark'] .grain {
		opacity: 0.04;
		mix-blend-mode: screen;
	}

	@keyframes mesh-drift {
		0% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.035) rotate(0.7deg);
		}
		100% {
			transform: scale(1) rotate(-0.7deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ambient-field {
			animation: none;
		}
	}
</style>
