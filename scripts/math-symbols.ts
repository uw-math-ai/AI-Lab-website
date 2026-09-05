import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { mathjax } from '@mathjax/src/js/mathjax.js';
import { TeX } from '@mathjax/src/js/input/tex.js';
import { SVG } from '@mathjax/src/js/output/svg.js';
import { liteAdaptor } from '@mathjax/src/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js';
import '@mathjax/src/js/util/asyncLoad/esm.js';
import '@mathjax/src/js/input/tex/base/BaseConfiguration.js';
import '@mathjax/src/js/input/tex/ams/AmsConfiguration.js';
import type { Plugin } from 'vite';
import { mathSymbolsSchema } from '../src/lib/content/schema';
import { atlasEm, type AmbientSymbol } from '../src/lib/ambient-symbols';
import { parseContent } from './yaml-content';

const moduleId = 'virtual:math-symbols';
const resolvedId = `\0${moduleId}`;

/** Generate one self-contained, monochrome SVG atlas. No runtime MathJax or web fonts. */
export async function compileMathSymbols(input: unknown) {
	const groups = mathSymbolsSchema.parse(input);
	const adaptor = liteAdaptor();
	const handler = RegisterHTMLHandler(adaptor);
	const document = mathjax.document('', {
		InputJax: new TeX({ packages: ['base', 'ams'], formatError(_jax: unknown, error: unknown) { throw error; } }),
		// MathJax 4 otherwise splits inline equations into separate SVGs at operators.
		OutputJax: new SVG({ fontCache: 'none', linebreaks: { inline: false } })
	});
	const width = 2048;
	const padding = 8;
	let x = 0, y = 0, rowHeight = 0;
	const symbols: AmbientSymbol[] = [];
	const fragments: string[] = [];
	try {
		for (const group of groups) {
			for (const item of group.items) {
				try {
					const node = await document.convertPromise(item.tex, { display: false });
					const images = adaptor.tags(node, 'svg').filter((child) => adaptor.parent(child) === node);
					if (images.length !== 1) throw new Error('Expression must render as one complete SVG');
					const svg = images[0];
					const viewBox = adaptor.getAttribute(svg, 'viewBox').split(/\s+/).map(Number);
					const [left, top, w, h] = viewBox;
					const naturalWidth = Math.ceil(w / 1000 * atlasEm) + padding * 2;
					const naturalHeight = Math.ceil(h / 1000 * atlasEm) + padding * 2;
					if (!viewBox.every(Number.isFinite) || w <= 0 || h <= 0 || naturalWidth > width) {
						throw new Error('Expression is empty or too wide for the background');
					}
					if (x + naturalWidth > width) { x = 0; y += rowHeight; rowHeight = 0; }
					const content = adaptor.innerHTML(svg)
						.replace(/\sdata-[\w-]+="[^"]*"/g, '');
					// All glyphs must be vector paths; missing-font text would vary by visitor platform.
					if (/<(?:text|foreignObject|image)\b|data-mjx-error|<merror/i.test(content)) {
						throw new Error('Expression contains an unsupported glyph or TeX error');
					}
					const unitPadding = padding / atlasEm * 1000;
					fragments.push(`<svg x="${x}" y="${y}" width="${naturalWidth}" height="${naturalHeight}" viewBox="${left - unitPadding} ${top - unitPadding} ${naturalWidth / atlasEm * 1000} ${naturalHeight / atlasEm * 1000}">${content}</svg>`);
					symbols.push({ id: item.id, field: group.id, kind: item.kind, x, y, width: naturalWidth, height: naturalHeight });
					x += naturalWidth;
					rowHeight = Math.max(rowHeight, naturalHeight);
				} catch (error) {
					throw new Error(`math-symbols.yaml: ${group.id}.${item.id}: ${error instanceof Error ? error.message : error}`);
				}
			}
		}
	} finally {
		mathjax.handlers.unregister(handler);
	}
	const height = y + rowHeight;
	return {
		symbols,
		svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" color="black">${fragments.join('')}</svg>`
	};
}

export function mathSymbols(): Plugin {
	let filename: string;
	let build = false;
	let cached: { source: string; result: ReturnType<typeof compileMathSymbols> } | undefined;
	return {
		name: 'math-symbol-atlas',
		configResolved(config) {
			filename = resolve(config.root, 'src/content/math-symbols.yaml');
			build = config.command === 'build';
		},
		resolveId(id) { if (id === moduleId) return resolvedId; },
		async load(id) {
			if (id !== resolvedId) return;
			this.addWatchFile(filename);
			const source = await readFile(filename, 'utf8');
			if (cached?.source !== source) cached = { source, result: compileMathSymbols(parseContent(source, filename)) };
			const atlas = await cached.result;
			const url = build
				? `import.meta.ROLLUP_FILE_URL_${this.emitFile({ type: 'asset', name: 'math-symbols.svg', source: atlas.svg })}`
				: JSON.stringify(`data:image/svg+xml;base64,${Buffer.from(atlas.svg).toString('base64')}`);
			return `export const atlasUrl = ${url}; export const symbols = ${JSON.stringify(atlas.symbols)};`;
		},
		handleHotUpdate({ file, server }) {
			if (file !== filename) return;
			cached = undefined;
			const module = server.moduleGraph.getModuleById(resolvedId);
			if (module) server.moduleGraph.invalidateModule(module);
			server.ws.send({ type: 'full-reload' });
			return [];
		}
	};
}
