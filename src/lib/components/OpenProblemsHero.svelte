<script lang="ts">
	/**
	 * Live, growing map of 15,458 open problems (UMAP of Qwen3-8B embeddings),
	 * drawn from a 6,500-node subset of the Growing Map of Open Problems data.
	 * Problems appear chronologically on load; hover to read titles; gold
	 * beacons mark problems already stated in Lean.
	 */
	import { browser } from '$app/environment';
	import { sitePath } from '$lib/paths';

	type Node = {
		x: number;
		y: number;
		yr: number;
		cat: number;
		size: number;
		title?: string;
		decl?: string;
		born: number;
		sx: number;
		sy: number;
		shown: boolean;
	};

	let {
		total = 15458,
		lean = 77,
		bleed = false,
		caption = '',
		work = '',
		author = '',
		href = ''
	} = $props<{
		total?: number;
		lean?: number;
		bleed?: boolean;
		caption?: string;
		/** Figure credit: the piece, who made it, and where it lives. */
		work?: string;
		author?: string;
		href?: string;
	}>();

	let canvas: HTMLCanvasElement;
	let wrap: HTMLDivElement;
	let year = $state(1742);
	let shown = $state(0);
	let tip = $state<{ x: number; y: number; title: string; meta: string; lean?: string } | null>(null);
	let ready = $state(false);
	let spectrum = $state<{ name: string; count: number; color: string }[]>([]);

	// Category hues, matching the published map.
	const HUES: Record<string, [number, number, number]> = {
		algebra: [212, 72, 44],
		analysis: [145, 65, 36],
		geometry: [358, 70, 46],
		number_theory: [28, 85, 44],
		topology: [268, 60, 50],
		combinatorics: [45, 90, 40],
		algebraic_geometry: [16, 75, 48],
		graph_theory: [178, 65, 34],
		group_theory: [232, 60, 52],
		probability: [196, 75, 40],
		logic: [316, 60, 44],
		pde: [82, 60, 36],
		computer_science: [258, 65, 52],
		dynamical_systems: [190, 60, 46],
		physics: [332, 70, 48],
		set_theory: [242, 55, 42]
	};

	$effect(() => {
		if (!browser || !canvas) return;
		let raf = 0;
		let disposed = false;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const context = canvas.getContext('2d');
		if (!context) return;
		const ctx: CanvasRenderingContext2D = context;

		let W = 0;
		let H = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let nodes: Node[] = [];
		let edges: [number, number][] = [];
		let cats: string[] = [];
		let colors: string[] = [];
		let dark = document.documentElement.dataset.theme === 'dark';
		let t0 = 0;
		let done = false;
		let hovered: Node | null = null;
		let pointer = { x: -1, y: -1 };

		// Data bbox → canvas mapping. The map is taller than wide, so fit by height.
		let bbox = { minx: 0, maxx: 1, miny: 0, maxy: 1 };
		function layout() {
			const rect = wrap.getBoundingClientRect();
			W = rect.width;
			H = rect.height;
			canvas.width = Math.round(W * dpr);
			canvas.height = Math.round(H * dpr);
			canvas.style.width = `${W}px`;
			canvas.style.height = `${H}px`;
			// Below the stacking breakpoint the bleed variant behaves like the
			// framed one: no overscale, no right bias, no mask.
			const wide = W >= 900;
			const bled = bleed && wide;
			const pad = bled ? 0 : 16;
			const sx = (W - pad * 2) / (bbox.maxx - bbox.minx);
			const sy = (H - pad * 2) / (bbox.maxy - bbox.miny);
			// Bleed: overscale so the field fills the hero and crops, and push its
			// centre right so the copy column keeps clear paper.
			const s = Math.min(sx, sy) * (bled ? 1.5 : 1);
			const dataW = (bbox.maxx - bbox.minx) * s;
			const dataH = (bbox.maxy - bbox.miny) * s;
			const ox = (bled ? W * 0.66 : W / 2) - dataW / 2;
			const oy = (H - dataH) / 2;
			for (const n of nodes) {
				n.sx = ox + (n.x - bbox.minx) * s;
				n.sy = oy + (n.y - bbox.miny) * s;
			}

			copyFade = bled ? W : 0;
			clearings = [];
			const box = (el: Element | null) => {
				if (!el) return;
				const r = el.getBoundingClientRect();
				const w = wrap.getBoundingClientRect();
				clearings.push({
					x: r.left - w.left + r.width / 2,
					y: r.top - w.top + r.height / 2,
					rx: r.width / 2 + 22,
					ry: r.height / 2 + 16
				});
			};
			box(wrap.querySelector('.counter'));
			box(wrap.querySelector('.key'));
			applyVisibility();
		}

		const hash = (i: number) => (((i * 2654435761) >>> 0) % 1000) / 1000;

		// Where type sits, thin the field out rather than painting over it: each
		// point is dropped with a probability that rises smoothly inside the
		// clearing, so the edge dithers away instead of showing a hard hole.
		type Clearing = { x: number; y: number; rx: number; ry: number };
		let clearings: Clearing[] = [];
		let copyFade = 0;

		function visibility(x: number, y: number) {
			let v = 1;
			if (copyFade > 0) {
				const t = (x - copyFade * 0.3) / (copyFade * 0.26);
				v = Math.min(v, Math.max(0, Math.min(1, t)));
			}
			for (const c of clearings) {
				const dx = Math.abs(x - c.x) / c.rx;
				const dy = Math.abs(y - c.y) / c.ry;
				const d = Math.max(dx, dy);
				if (d < 1.3) v = Math.min(v, Math.max(0, (d - 0.78) / 0.52));
			}
			return v;
		}

		function applyVisibility() {
			for (let i = 0; i < nodes.length; i++) {
				const n = nodes[i];
				n.shown = hash(i * 31 + 11) < visibility(n.sx, n.sy);
			}
		}

		async function load() {
			const res = await fetch(sitePath('/data/open-problems-hero.json'));
			const data = await res.json();
			cats = data.cats;
			colors = cats.map((c) => {
				const [h, s, l] = HUES[c] ?? [220, 10, 46];
				return `hsl(${h} ${s}% ${dark ? Math.min(l + 18, 72) : l}%)`;
			});
			const counts: number[] = data.counts ?? [];
			spectrum = cats
				.map((c, i) => ({ name: c.replace(/_/g, ' '), count: counts[i] ?? 0, color: colors[i] }))
				.sort((a, b) => b.count - a.count);
			const allNodes: Node[] = data.nodes.map((n: any[], i: number) => {
				const yr = n[2] > 0 ? n[2] : 1995 + hash(i) * 31;
				return {
					x: n[0],
					y: n[1],
					yr: yr + hash(i * 7 + 3),
					cat: n[3],
					size: n[4],
					title: n[5],
					decl: n[6],
					born: -1,
					sx: 0,
					sy: 0,
					shown: true
				};
			});
			nodes = allNodes;
			const rawEdges: [number, number][] = data.edges;
			// Trim outliers so the main body fills the frame.
			const xs = nodes.map((n) => n.x).sort((a, b) => a - b);
			const ys = nodes.map((n) => n.y).sort((a, b) => a - b);
			const q = (arr: number[], p: number) => arr[Math.floor((arr.length - 1) * p)];
			bbox = { minx: q(xs, 0.01), maxx: q(xs, 0.99), miny: q(ys, 0.004), maxy: q(ys, 0.996) };
			nodes = nodes.filter((n) => n.x >= bbox.minx && n.x <= bbox.maxx && n.y >= bbox.miny && n.y <= bbox.maxy);
			const index = new Map(nodes.map((n, i) => [n, i]));
			const all: Node[] = allNodes;
			edges = rawEdges
				.map(([a, b]) => [index.get(all[a]), index.get(all[b])] as [number | undefined, number | undefined])
				.filter((e): e is [number, number] => e[0] !== undefined && e[1] !== undefined);
			layout();
			ready = true;
			t0 = performance.now();
			if (reduced) {
				done = true;
				year = 2026;
				shown = total;
			}
			raf = requestAnimationFrame(frame);
		}

		// Timeline: 1742→1900 fast, 1900→1990 medium, 1990→2026 slow. ~4.5s total.
		function yearAt(ms: number) {
			const s = ms / 1000;
			if (s < 0.5) return 1742 + (s / 0.5) * 158; // → 1900
			if (s < 1.8) return 1900 + ((s - 0.5) / 1.3) * 90; // → 1990
			if (s < 4.4) return 1990 + ((s - 1.8) / 2.6) * 36.9; // → 2026.9
			return 2027;
		}

		function frame(now: number) {
			if (disposed) return;
			const elapsed = now - t0;
			const cur = done ? 2027 : yearAt(elapsed);
			if (!done) {
				year = Math.min(2026, Math.floor(cur));
				if (cur >= 2027) {
					done = true;
					// The counter is at its widest now; re-cut the clearing to fit.
					requestAnimationFrame(() => layout());
				}
			}

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, W, H);

			let count = 0;
			// Edges: faint, only between born nodes.
			ctx.lineWidth = 0.6;
			ctx.strokeStyle = dark ? 'rgba(223,223,214,0.10)' : 'rgba(27,30,35,0.09)';
			ctx.beginPath();
			for (const [a, b] of edges) {
				const na = nodes[a];
				const nb = nodes[b];
				if (na.yr > cur || nb.yr > cur || !na.shown || !nb.shown) continue;
				ctx.moveTo(na.sx, na.sy);
				ctx.lineTo(nb.sx, nb.sy);
			}
			ctx.stroke();

			// Nodes, batched by category color.
			const byCat: Node[][] = colors.map(() => []);
			for (const n of nodes) {
				if (n.yr > cur) continue;
				count++;
				if (!n.shown) continue;
				if (n.born < 0) n.born = now;
				(byCat[n.cat] ?? (byCat[n.cat] = [])).push(n);
			}
			for (let c = 0; c < byCat.length; c++) {
				const list = byCat[c];
				if (!list.length) continue;
				ctx.fillStyle = colors[c] ?? (dark ? 'hsl(220 10% 60%)' : 'hsl(220 10% 46%)');
				ctx.beginPath();
				for (const n of list) {
					const age = reduced ? 1 : Math.min(1, (now - n.born) / 650);
					const ease = 1 - Math.pow(1 - age, 3);
					const r = (1.15 + Math.sqrt(n.size) * 0.22) * (0.4 + 0.6 * ease) + (1 - ease) * 3;
					ctx.moveTo(n.sx + r, n.sy);
					ctx.arc(n.sx, n.sy, r, 0, Math.PI * 2);
				}
				ctx.globalAlpha = dark ? 0.9 : 0.82;
				ctx.fill();
				ctx.globalAlpha = 1;
			}

			// Gold beacons on Lean-linked problems.
			const pulse = 0.5 + 0.5 * Math.sin(now / 900);
			for (const n of nodes) {
				if (!n.decl || n.yr > cur || !n.shown) continue;
				ctx.beginPath();
				ctx.arc(n.sx, n.sy, 4.5 + pulse * 2.5, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(201,162,39,${0.55 - pulse * 0.25})`;
				ctx.lineWidth = 1;
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(n.sx, n.sy, 2.2, 0, Math.PI * 2);
				ctx.fillStyle = '#c9a227';
				ctx.fill();
			}

			// Hover ring.
			if (hovered && hovered.yr <= cur) {
				ctx.beginPath();
				ctx.arc(hovered.sx, hovered.sy, 7, 0, Math.PI * 2);
				ctx.strokeStyle = dark ? '#f2f2ea' : '#1b1e23';
				ctx.lineWidth = 1.2;
				ctx.stroke();
			}

			shown = done ? total : Math.round((count / nodes.length) * total);

			// Keep animating while growing, while a beacon pulses in view, or while hovering.
			raf = requestAnimationFrame(frame);
		}

		function nearest(px: number, py: number) {
			let best: Node | null = null;
			let bd = 14 * 14;
			for (const n of nodes) {
				if (n.born < 0 || !n.shown) continue;
				const dx = n.sx - px;
				const dy = n.sy - py;
				const d = dx * dx + dy * dy;
				// Prefer titled nodes slightly so famous problems are easy to hit.
				const w = n.title ? d * 0.6 : d;
				if (w < bd) {
					bd = w;
					best = n;
				}
			}
			return best;
		}

		function onMove(e: PointerEvent) {
			const rect = canvas.getBoundingClientRect();
			pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
			const n = nearest(pointer.x, pointer.y);
			hovered = n;
			if (n) {
				const catName = (cats[n.cat] ?? 'miscellaneous').replace(/_/g, ' ');
				const yrLabel = Math.floor(n.yr) > 0 ? String(Math.floor(n.yr)) : 'undated';
				tip = {
					x: pointer.x,
					y: pointer.y,
					title: n.title ?? `An open problem in ${catName}`,
					meta: yrLabel === 'undated' ? catName : `${catName}, ${yrLabel}`,
					lean: n.decl || undefined
				};
			} else {
				tip = null;
			}
		}

		function onLeave() {
			hovered = null;
			tip = null;
		}

		const ro = new ResizeObserver(() => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			if (nodes.length) layout();
		});
		ro.observe(wrap);

		const themeObserver = new MutationObserver(() => {
			dark = document.documentElement.dataset.theme === 'dark';
			colors = cats.map((c) => {
				const [h, s, l] = HUES[c] ?? [220, 10, 46];
				return `hsl(${h} ${s}% ${dark ? Math.min(l + 18, 72) : l}%)`;
			});
		});
		themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

		canvas.addEventListener('pointermove', onMove);
		canvas.addEventListener('pointerleave', onLeave);
		load().catch(() => {
			ready = false;
		});

		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			ro.disconnect();
			themeObserver.disconnect();
			canvas.removeEventListener('pointermove', onMove);
			canvas.removeEventListener('pointerleave', onLeave);
		};
	});

	const fmt = (n: number) => n.toLocaleString('en-US');
</script>

<div class="frame" class:bleed>
<div class="map" bind:this={wrap} class:ready>
	<canvas bind:this={canvas} aria-label="A growing map of open mathematical problems, one point per problem, colored by field"></canvas>

	<div class="counter" aria-live="off">
		<span class="year num">{year}</span>
		<span class="count">{fmt(shown)} open problems</span>
	</div>

	{#if tip}
		<div class="tip" style={`left:${tip.x}px; top:${tip.y}px`} role="status">
			<strong>{tip.title}</strong>
			<span>{tip.meta}</span>
			{#if tip.lean}<em>Stated in Lean<b>{tip.lean}</b></em>{/if}
		</div>
	{/if}

	<div class="key">
		<span><i style="background:#c9a227"></i>{lean} problems already stated in Lean</span>
		{#if caption}<span class="caption">{caption}</span>{/if}
		{#if work}
			<span class="figure-credit">
				<a href={href} target="_blank" rel="noreferrer">{work}</a>
				{#if author}<b>{author}</b>{/if}
			</span>
		{/if}
	</div>
</div>
{#if spectrum.length}
	<div class="spectrum" role="img" aria-label="Share of open problems by field">
		{#each spectrum as f}
			<span style={`flex:${f.count}; background:${f.color}`} title={`${f.name}, ${fmt(f.count)} open problems`}></span>
		{/each}
	</div>
{/if}
</div>

<style>
	.frame {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		height: 100%;
		border: 1px solid var(--line-strong);
	}

	/* Full-bleed variant: the map is the hero's ground. The mask clears the
	   left column so the wordmark and copy sit on plain paper. */
	.frame.bleed {
		border: 0;
	}

	.frame.bleed .map {
		padding: 0;
	}

	.frame.bleed .counter {
		top: clamp(1rem, 3vw, 2rem);
		right: max(1.5rem, calc((100vw - var(--shell)) / 2));
		padding: 0;
		background: none;
	}

	.frame.bleed .key {
		left: auto;
		right: max(1.5rem, calc((100vw - var(--shell)) / 2));
		bottom: 1.1rem;
		display: grid;
		justify-items: end;
		gap: 0.3rem;
		padding: 0;
		background: none;
		text-align: right;
	}

	.frame.bleed .spectrum {
		border-top: 0;
	}

	.map {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 24rem;
		overflow: hidden;
		opacity: 0;
		transition: opacity 600ms ease;
		padding: 1rem;
	}

	.spectrum {
		display: flex;
		height: 4px;
		border-top: 1px solid var(--line-strong);
	}

	.spectrum span {
		display: block;
		min-width: 1px;
	}

	.map.ready {
		opacity: 1;
	}

	canvas {
		position: absolute;
		inset: 0;
		display: block;
		cursor: crosshair;
		touch-action: pan-y;
	}

	.counter {
		position: absolute;
		top: 1rem;
		right: 1rem;
		display: grid;
		justify-items: end;
		gap: 0.25rem;
		padding: 0.35rem 0.15rem 0.5rem 2.5rem;
		background: radial-gradient(120% 140% at 85% 40%, var(--bg) 55%, transparent 100%);
		pointer-events: none;
	}

	.year {
		font-size: clamp(2.4rem, 5vw, 3.6rem);
		font-weight: 600;
		line-height: 1;
		color: var(--heading);
	}

	.count {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.key {
		position: absolute;
		left: 1rem;
		bottom: 0.9rem;
		padding: 0.3rem 0.6rem 0.3rem 0;
		background: linear-gradient(90deg, var(--bg) 82%, transparent);
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--muted);
		pointer-events: none;
	}

	.key span {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	.key .caption {
		color: var(--muted);
	}

	.figure-credit {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-top: 0.35rem;
		padding-top: 0.35rem;
		border-top: 1px solid var(--line);
	}

	.figure-credit a {
		color: var(--muted);
		text-decoration: none;
		border-bottom: 1px solid var(--line-strong);
	}

	.figure-credit a:hover {
		color: var(--text);
		border-bottom-color: var(--text);
	}

	.figure-credit b {
		font-weight: 600;
		color: var(--text);
	}

	.key i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.25);
	}

	.tip {
		position: absolute;
		z-index: 3;
		transform: translate(14px, -50%);
		display: grid;
		gap: 0.3rem;
		max-width: 18rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 0.5rem 0.7rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		line-height: 1.35;
		pointer-events: none;
	}

	.tip strong {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 0.95rem;
		line-height: 1.25;
		color: var(--heading);
	}

	.tip span {
		color: var(--muted);
		text-transform: capitalize;
	}

	.tip em {
		display: grid;
		gap: 0.15rem;
		margin-top: 0.15rem;
		padding-top: 0.35rem;
		border-top: 1px solid var(--line);
		font-style: normal;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--gold-ink);
	}

	.tip em b {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 400;
		letter-spacing: 0;
		text-transform: none;
	}

	@media (max-width: 900px) {
		.map {
			min-height: 20rem;
		}
	}
</style>
