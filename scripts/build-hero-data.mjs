/**
 * Rebuilds static/data/open-problems-hero.json — the point set behind the home
 * page hero and the braille maps on subpage heroes.
 *
 * Source of truth is the Growing Map of Open Problems, which lives outside this
 * repo:
 *   TheoremSearch/experiments/unsolved_math_pilot/galaxy_data.json
 *
 * That file is ~1.9 MB of 15,458 problems. Shipping all of it would dominate
 * the page weight, so this takes a ~190 KB subset: every problem linked to a
 * Lean declaration and every titled problem are kept, and the rest are sampled
 * with a fixed seed so the map looks the same on every build.
 *
 * Usage:
 *   node scripts/build-hero-data.mjs <path-to-galaxy_data.json>
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET_NODES = 6500;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../static/data/open-problems-hero.json');

const source = process.argv[2];
if (!source) {
	console.error('Usage: node scripts/build-hero-data.mjs <path-to-galaxy_data.json>');
	process.exit(1);
}

const data = JSON.parse(readFileSync(source, 'utf8'));
const { nodes, edges, cats } = data;

// Deterministic shuffle (mulberry32) so a rebuild never reshuffles the map.
let seed = 7;
const random = () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// [x, y, year, category, title, size, leanFlag, declName]
const keep = new Set();
nodes.forEach((n, i) => {
	if (n[6] || n[5] > 0) keep.add(i);
});
const rest = nodes.map((_, i) => i).filter((i) => !keep.has(i));
for (let i = rest.length - 1; i > 0; i--) {
	const j = Math.floor(random() * (i + 1));
	[rest[i], rest[j]] = [rest[j], rest[i]];
}
for (const i of rest.slice(0, Math.max(0, TARGET_NODES - keep.size))) keep.add(i);

const kept = [...keep].sort((a, b) => a - b);
const index = new Map(kept.map((old, next) => [old, next]));

const outNodes = kept.map((old) => {
	const [x, y, year, cat, title, size, lean, decl] = nodes[old];
	const record = [
		Number(x.toFixed(4)),
		Number(y.toFixed(4)),
		Math.trunc(year),
		cats.indexOf(cat),
		Number(size.toFixed(1))
	];
	if (lean || size > 0) record.push(title);
	if (lean) record.push(decl);
	return record;
});

const counts = cats.map((c) => nodes.filter((n) => n[3] === c).length);

writeFileSync(
	OUT,
	JSON.stringify({
		cats,
		counts,
		total: nodes.length,
		lean: nodes.filter((n) => n[6]).length,
		nodes: outNodes,
		edges: edges
			.map(([a, b]) => [index.get(a), index.get(b)])
			.filter(([a, b]) => a !== undefined && b !== undefined)
	})
);

console.log(
	`Wrote ${OUT}\n  ${outNodes.length} of ${nodes.length} problems, ${nodes.filter((n) => n[6]).length} Lean-linked`
);
