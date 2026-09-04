import MarkdownIt from 'markdown-it';
import { sitePath } from '$lib/paths';

const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false });

// Resolve local links in both custom-domain and GitHub subpath builds.
markdown.core.ruler.after('inline', 'site-paths', (state) => {
	for (const block of state.tokens) {
		for (const token of block.children ?? []) {
			const attribute = token.type === 'link_open' ? 'href' : token.type === 'image' ? 'src' : null;
			if (!attribute) continue;
			const value = String(token.attrGet(attribute) ?? '');
			if (value.startsWith('/') && !value.startsWith('//')) token.attrSet(attribute, sitePath(value));
			if (token.type === 'link_open' && /^https?:\/\//.test(value ?? '')) {
				token.attrSet('target', '_blank');
				token.attrSet('rel', 'noreferrer');
			}
		}
	}
});

export function renderMarkdown(content: string) {
	return markdown.render(content);
}

export function renderInline(content: string) {
	return markdown.renderInline(content);
}

export function renderDetail(content: string) {
	// Keep a label and its first paragraph together, while preserving nested lists.
	return renderMarkdown(content).replace(/^<p>(.*?)<\/p>/s, '$1');
}
