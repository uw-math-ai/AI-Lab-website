import { parseDocument } from 'yaml';
import { schemaForContentFile } from '../src/lib/content/schema';
import type { Plugin } from 'vite';

// Validate at build/dev time and emit ordinary JS. YAML and Zod stay out of the browser bundle.
export function parseContent(source: string, filename: string) {
	const document = parseDocument(source, { uniqueKeys: true });
	if (document.errors.length) throw new Error(`${filename}: ${document.errors.map((error) => error.message).join('\n')}`);
	const result = schemaForContentFile(filename).safeParse(document.toJS({ maxAliasCount: 50 }));
	if (!result.success) {
		throw new Error(`${filename}:\n${result.error.issues.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`).join('\n')}`);
	}
	if ('slug' in result.data && !filename.endsWith(`/${result.data.slug}.yaml`)) {
		throw new Error(`${filename}: slug must match the YAML filename`);
	}
	return result.data;
}

export function yamlContent(): Plugin {
	return {
		name: 'validated-yaml-content',
		enforce: 'pre',
		transform(source, filename) {
			if (!filename.endsWith('.yaml') || !filename.includes('/src/content/')) return;
			return { code: `export default ${JSON.stringify(parseContent(source, filename))};`, map: null };
		}
	};
}
