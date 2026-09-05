export type AmbientSymbol = {
	id: string;
	field: string;
	kind: 'symbol' | 'object' | 'formula';
	x: number;
	y: number;
	width: number;
	height: number;
};

export const atlasEm = 64;

/** Cycle through fields so a large category cannot dominate the background. */
export function createSymbolPicker(symbols: AmbientSymbol[], random = Math.random) {
	const bags = new Map<string, string[]>();
	return (kind: AmbientSymbol['kind'], maxWidth: number, used = new Set<string>()) => {
		const candidates = symbols.filter((symbol) => symbol.kind === kind && symbol.width / atlasEm * 14 <= maxWidth);
		const available = candidates.filter((symbol) => !used.has(symbol.id));
		const pool = available.length ? available : candidates;
		if (!pool.length) throw new Error(`No ambient ${kind} fits within ${maxWidth}px`);
		const fields = [...new Set(pool.map((symbol) => symbol.field))];
		let bag = (bags.get(kind) ?? []).filter((field) => fields.includes(field));
		if (!bag.length) {
			bag = [...fields];
			for (let i = bag.length - 1; i > 0; i--) {
				const j = Math.floor(random() * (i + 1));
				[bag[i], bag[j]] = [bag[j], bag[i]];
			}
		}
		const field = bag.pop();
		bags.set(kind, bag);
		const choices = pool.filter((symbol) => symbol.field === field);
		return choices[Math.floor(random() * choices.length)];
	};
}

export function symbolSize(symbol: AmbientSymbol, fontSize: number, maxWidth: number) {
	const scale = Math.min(fontSize / atlasEm, maxWidth / symbol.width);
	return { width: symbol.width * scale, height: symbol.height * scale };
}
