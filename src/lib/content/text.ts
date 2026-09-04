import type { ContentBlock } from './schema';

export function searchableContent(blocks: ContentBlock[]) {
	return blocks.map((block) => {
		if (block.type === 'project') return `${block.title} ${block.intro ?? ''} ${block.content ?? ''} ${(block.details ?? []).map((detail) => `${detail.label ?? ''} ${detail.content}`).join(' ')}`;
		if (block.type === 'heading') return block.title;
		if (block.type === 'image') return block.alt;
		return block.content;
	}).join(' ');
}
