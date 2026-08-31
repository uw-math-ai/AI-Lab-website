<script lang="ts">
	/**
	 * The open-problems map rendered as braille text in Menlo: every dot is a
	 * problem. Grows chronologically once it scrolls into view. Ink only; the
	 * Lean-linked problems are the one gold exception.
	 */
	import { browser } from '$app/environment';
	import { sitePath } from '$lib/paths';

	let { cols = 56, rows = 30, caption = true } = $props<{ cols?: number; rows?: number; caption?: boolean }>();

	let el: HTMLElement;
	let html = $state('');
	let year = $state(1742);
	let count = $state(0);
	let total = $state(15458);

	const BITS = [
		[0x01, 0x08],
		[0x02, 0x10],
		[0x04, 0x20],
		[0x40, 0x80]
	];

	$effect(() => {
		if (!browser || !el) return;
		let raf = 0;
		let disposed = false;
		let started = false;
		let nodes: { gx: number; gy: number; yr: number; lean: boolean }[] = [];
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const hash = (i: number) => (((i * 2654435761) >>> 0) % 1000) / 1000;

		function yearAt(ms: number) {
			const s = ms / 1000;
			if (s < 0.4) return 1742 + (s / 0.4) * 158;
			if (s < 1.4) return 1900 + ((s - 0.4) / 1.0) * 90;
			if (s < 3.2) return 1990 + ((s - 1.4) / 1.8) * 36.9;
			return 2027;
		}

		function render(cur: number) {
			const W = cols * 2;
			const H = rows * 4;
			const cells = new Uint8Array(cols * rows);
			const gold = new Uint8Array(cols * rows);
			let c = 0;
			for (const n of nodes) {
				if (n.yr > cur) continue;
				c++;
				const x = Math.min(W - 1, Math.max(0, Math.floor(n.gx * W)));
				const y = Math.min(H - 1, Math.max(0, Math.floor(n.gy * H)));
				const ci = (y >> 2) * cols + (x >> 1);
				cells[ci] |= BITS[y & 3][x & 1];
				if (n.lean) gold[ci] = 1;
			}
			// Trim the empty margin so the <pre> box hugs the drawing and the
			// caption below lines up with it.
			let minRow = rows;
			let maxRow = -1;
			let minCol = cols;
			let maxCol = -1;
			for (let r = 0; r < rows; r++) {
				for (let k = 0; k < cols; k++) {
					if (!cells[r * cols + k]) continue;
					if (r < minRow) minRow = r;
					if (r > maxRow) maxRow = r;
					if (k < minCol) minCol = k;
					if (k > maxCol) maxCol = k;
				}
			}
			if (maxRow < 0) {
				html = '';
				count = 0;
				return;
			}

			let out = '';
			for (let r = minRow; r <= maxRow; r++) {
				let line = '';
				let inGold = false;
				for (let k = minCol; k <= maxCol; k++) {
					const i = r * cols + k;
					const ch = String.fromCharCode(0x2800 + cells[i]);
					if (gold[i] && !inGold) {
						line += '<b>';
						inGold = true;
					} else if (!gold[i] && inGold) {
						line += '</b>';
						inGold = false;
					}
					line += ch;
				}
				if (inGold) line += '</b>';
				out += line + '\n';
			}
			html = out;
			count = Math.round((c / nodes.length) * total);
		}

		let t0 = 0;
		function frame(now: number) {
			if (disposed) return;
			const cur = yearAt(now - t0);
			year = Math.min(2026, Math.floor(cur));
			render(cur);
			if (cur < 2027) raf = requestAnimationFrame(frame);
		}

		async function load() {
			const res = await fetch(sitePath('/data/open-problems-hero.json'));
			const data = await res.json();
			total = data.total ?? total;
			const raw = data.nodes as any[][];
			const xs = raw.map((n) => n[0]).sort((a, b) => a - b);
			const ys = raw.map((n) => n[1]).sort((a, b) => a - b);
			const q = (a: number[], p: number) => a[Math.floor((a.length - 1) * p)];
			const bx = [q(xs, 0.01), q(xs, 0.99)];
			const by = [q(ys, 0.004), q(ys, 0.996)];
			// Fit the (tall) map into the character grid, preserving aspect. A Menlo
			// braille cell is ~0.6em wide × 1em tall, so dots are ~0.3em × 0.25em.
			const dataW = bx[1] - bx[0];
			const dataH = by[1] - by[0];
			const gridW = cols * 2 * 0.3;
			const gridH = rows * 4 * 0.25;
			const s = Math.min(gridW / dataW, gridH / dataH);
			const ox = (gridW - dataW * s) / 2;
			const oy = (gridH - dataH * s) / 2;
			nodes = raw
				.filter((n) => n[0] >= bx[0] && n[0] <= bx[1] && n[1] >= by[0] && n[1] <= by[1])
				.map((n, i) => ({
					gx: (ox + (n[0] - bx[0]) * s) / gridW,
					gy: (oy + (n[1] - by[0]) * s) / gridH,
					yr: (n[2] > 0 ? n[2] : 1995 + hash(i) * 31) + hash(i * 7 + 3),
					lean: Boolean(n[6])
				}));
			if (reduced) {
				year = 2026;
				render(2027);
				return;
			}
			const io = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && !started) {
						started = true;
						t0 = performance.now();
						raf = requestAnimationFrame(frame);
						io.disconnect();
					}
				},
				{ threshold: 0.2 }
			);
			io.observe(el);
			render(1742);
		}

		load().catch(() => {});
		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
		};
	});

	const fmt = (n: number) => n.toLocaleString('en-US');
</script>

<figure class="ascii" bind:this={el}>
	<pre aria-hidden="true">{@html html}</pre>
	{#if caption}
		<figcaption>
			<span class="num">{year}</span>
			<span>{fmt(count)} open problems</span>
			<a href={sitePath('/#open-problems-map')}>The map</a>
		</figcaption>
	{/if}
</figure>

<style>
	.ascii {
		margin: 0;
		display: grid;
		gap: 0.5rem;
		/* The caption is wider than the drawing, so centre the drawing over it;
		   the block as a whole still sits against the page margin. */
		justify-items: center;
	}

	pre {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1;
		letter-spacing: 0;
		color: var(--text);
		opacity: 0.82;
		user-select: none;
	}

	pre :global(b) {
		font-weight: 400;
		color: var(--gold-ink);
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem 1rem;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}

	figcaption .num {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--heading);
		letter-spacing: -0.02em;
	}

	figcaption a {
		color: var(--muted);
	}

	@media (max-width: 900px) {
		pre {
			font-size: 0.58rem;
		}
	}
</style>
