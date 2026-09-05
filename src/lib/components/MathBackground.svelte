<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { atlasUrl, symbols } from 'virtual:math-symbols';
	import { createSymbolPicker, symbolSize, type AmbientSymbol } from '$lib/ambient-symbols';

	type Particle = {
		x: number;
		y: number;
		symbol: AmbientSymbol;
		width: number;
		height: number;
		alpha: number;
		vx: number;
		vy: number;
		phase: number;
	};

	let canvas: HTMLCanvasElement;
	let quiet = $state(false);

	// Re-runs on navigation so the field is never left dimmed after leaving a
	// page that asked for quiet.
	$effect(() => {
		const pathname = $page.url.pathname;
		if (!browser) return;
		void pathname;

		let observer: IntersectionObserver | null = null;
		let raf = 0;
		let attempts = 0;

		const attach = () => {
			const target = document.querySelector('[data-ambient-quiet]');
			if (!target) {
				quiet = false;
				// The page may still be mounting; give it a few frames, then stop.
				if (attempts++ < 20) raf = requestAnimationFrame(attach);
				return;
			}
			observer = new IntersectionObserver(
				([entry]) => (quiet = entry.intersectionRatio > 0.2),
				{ threshold: [0, 0.2, 0.5, 1] }
			);
			observer.observe(target);
		};
		attach();

		return () => {
			observer?.disconnect();
			cancelAnimationFrame(raf);
			quiet = false;
		};
	});

	$effect(() => {
		if (!browser || !canvas) return;

		const maybeContext = canvas.getContext('2d');
		if (!maybeContext) return;
		const context = maybeContext;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const atlas = new Image();
		const tintedAtlas = document.createElement('canvas');
		const tint = tintedAtlas.getContext('2d');
		if (!tint) return;
		const pickSymbol = createSymbolPicker(symbols);
		let disposed = false;
		let ready = false;
		let frame = 0;
		let previousTime = 0;
		let haloColor = '';
		let particles: Particle[] = [];

		function color(name: string, fallback: string) {
			return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
		}

		function resize() {
			const scale = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.floor(window.innerWidth * scale);
			canvas.height = Math.floor(window.innerHeight * scale);
			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;
			context.setTransform(scale, 0, 0, scale, 0, 0);
		}

		function makeParticle(kind: AmbientSymbol['kind'], fromBottom = false): Particle {
			const mobile = window.innerWidth < 700;
			const maxWidth = Math.min(mobile ? 220 : 340, window.innerWidth * 0.7);
			const symbol = pickSymbol(kind, maxWidth, new Set(particles.map((particle) => particle.symbol.id)));
			const fontSize = kind === 'formula' ? 17 + Math.random() * 3 : (mobile ? 20 : 23) + Math.random() * 7;
			const size = symbolSize(symbol, fontSize, maxWidth);
			const particle = {
				x: 0,
				y: fromBottom ? window.innerHeight + 24 : 0,
				symbol,
				...size,
				alpha: kind === 'formula' ? 0.045 + Math.random() * 0.025 : 0.04 + Math.random() * 0.065,
				vx: (Math.random() - 0.5) * 0.18,
				vy: -0.08 - Math.random() * 0.18,
				phase: Math.random() * Math.PI * 2
			};
			// Longer labels need room at spawn; don't lay a full formula over another object.
			for (let attempt = 0; attempt < 30; attempt++) {
				particle.x = 12 + Math.random() * Math.max(0, window.innerWidth - size.width - 24);
				if (!fromBottom) particle.y = 12 + Math.random() * Math.max(0, window.innerHeight - size.height - 24);
				if (!particles.some((other) => particle.x < other.x + other.width + 12 && particle.x + size.width + 12 > other.x
					&& particle.y < other.y + other.height + 12 && particle.y + size.height + 12 > other.y)) break;
			}
			return particle;
		}

		function resetParticles() {
			// Fewer particles than the single-glyph version; equations occupy roughly one in fourteen slots.
			const count = window.innerWidth < 700 ? 20 : 34;
			particles = [];
			for (let i = 0; i < count; i++) particles.push(makeParticle(i % 14 === 0 ? 'formula' : i % 5 === 0 ? 'symbol' : 'object'));
		}

		function draw(time = performance.now()) {
			const delta = previousTime ? Math.min((time - previousTime) / (1000 / 60), 2) : 0;
			previousTime = time;
			context.clearRect(0, 0, window.innerWidth, window.innerHeight);

			for (let index = 0; index < particles.length; index += 1) {
				const particle = particles[index];
				context.save();
				context.globalAlpha = particle.alpha;
				context.shadowColor = haloColor;
				context.shadowBlur = 6;
				context.drawImage(
					tintedAtlas,
					particle.symbol.x, particle.symbol.y, particle.symbol.width, particle.symbol.height,
					particle.x + Math.sin(particle.phase) * 5,
					particle.y, particle.width, particle.height
				);
				context.restore();

				if (!reducedMotion.matches) {
					particle.x += particle.vx * delta;
					particle.y += particle.vy * delta;
					particle.phase += 0.006 * delta;
				}

				if (particle.y + particle.height < -24 || particle.x + particle.width < -24 || particle.x > window.innerWidth + 24) {
					particles[index] = makeParticle(particle.symbol.kind, true);
				}
			}

			if (!reducedMotion.matches && !document.hidden && !disposed) {
				frame = requestAnimationFrame(draw);
			}
		}

		function start() {
			cancelAnimationFrame(frame);
			if (!ready || disposed) return;
			resize();
			resetParticles();
			previousTime = 0;
			draw();
		}

		function updateTheme() {
			if (!ready || disposed || !tint) return;
			tint.clearRect(0, 0, tintedAtlas.width, tintedAtlas.height);
			tint.drawImage(atlas, 0, 0);
			tint.globalCompositeOperation = 'source-in';
			tint.fillStyle = color('--ambient-symbol', color('--gold', '#d6a900'));
			tint.fillRect(0, 0, tintedAtlas.width, tintedAtlas.height);
			tint.globalCompositeOperation = 'source-over';
			haloColor = color('--ambient-halo', color('--purple', '#32006e'));
			cancelAnimationFrame(frame);
			previousTime = 0;
			draw();
		}

		function resume() {
			cancelAnimationFrame(frame);
			previousTime = 0;
			if (ready && !document.hidden) draw();
		}

		const themeObserver = new MutationObserver(updateTheme);
		themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		atlas.onload = () => {
			if (disposed) return;
			tintedAtlas.width = atlas.naturalWidth;
			tintedAtlas.height = atlas.naturalHeight;
			ready = true;
			updateTheme();
			start();
		};
		// If the decorative image fails, leave the existing gradient background intact.
		atlas.src = atlasUrl;

		window.addEventListener('resize', start);
		reducedMotion.addEventListener('change', start);
		document.addEventListener('visibilitychange', resume);

		return () => {
			disposed = true;
			atlas.onload = null;
			cancelAnimationFrame(frame);
			themeObserver.disconnect();
			window.removeEventListener('resize', start);
			reducedMotion.removeEventListener('change', start);
			document.removeEventListener('visibilitychange', resume);
		};
	});
</script>

<div class="ambient-field" class:quiet aria-hidden="true"></div>
<canvas bind:this={canvas} class="math-canvas" class:quiet aria-hidden="true"></canvas>
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
		transition: opacity 700ms ease;
	}

	.ambient-field {
		transition: opacity 700ms ease;
	}

	/* Held back while a page's own visual is on screen. */
	.math-canvas.quiet,
	.ambient-field.quiet {
		opacity: 0.05;
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

	:root[data-theme='dark'] .math-canvas.quiet,
	:root[data-theme='dark'] .ambient-field.quiet {
		opacity: 0.06;
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
