import { projectRedirects } from '$lib/data/projects';
import { sitePath } from '$lib/paths';

const staticAssetPrefixes = ['photos/', 'slides/', 'papers/', 'logos/'];

export function titleFromLegacyHtml(html: string) {
	return html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? 'Math AI Lab';
}

export function headingsFromHtml(html: string) {
	const headings = [...html.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)];
	return headings.map((match) => {
		const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
		return {
			text,
			id: slugify(text),
			level: Number(match[1])
		};
	});
}

export function legacyMainContent(html: string, options: { projectSlug?: string } = {}) {
	const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
	const withoutChrome = body
		.replace(/<header[\s\S]*?<\/header>/gi, '')
		.replace(/<nav[\s\S]*?<\/nav>/gi, '')
		.replace(/<footer[\s\S]*?<\/footer>/gi, '');

	let normalized = withoutChrome
		.replace(/<font[^>]*>/gi, '')
		.replace(/<\/font>/gi, '')
		.replace(/<b>\s*Prerequisites:\s*<b>/gi, '<b>Prerequisites:</b>')
		.replace(/<b>\s*Prerequisites:\s*<\/b>/gi, '<b>Prerequisites:</b>')
		.replace(/<b>\s*Students:\s*([^<]+)<\/b>/gi, '<b>Students:</b> $1')
		.replace(/Autoformalization Projects/g, 'Autoformalization projects')
		.replace(/AI Projects/g, 'Machine learning for math projects')
		.replace(/<br\s*\/?>\s*(?:&mdash;|—|--)\s*([^<\n]+)\s*<\/p>/gi, '<br><span class="quote-attribution">-- $1</span></p>')
		.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level, attrs, content) => {
			const clean = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
			return `<h${level}${attrs} id="${slugify(clean)}">${content}</h${level}>`;
		});

	if (options.projectSlug) {
		normalized = stripProjectPageTitle(normalized, options.projectSlug);
	}

	if (options.projectSlug === 'spring-2026') {
		normalized = reorderProjectSections(normalized, {
			autoformalization: [
				'openmath-autoformalizing-undergraduate-textbooks',
				'leangcd-stabilizing-lean-generation',
				'mathematician-s-copilot-semantic-theorem-search',
				'mathematician-s-copilot-math2vec',
				'how-good-are-llms-at-lean'
			],
			machineLearning: [
				'cayleypy-search-on-massive-combinatorial-graphs',
				'mechanistic-interpretability-beyond-groups',
				'reinforcement-learning-for-polynomials',
				'ai-for-quantum-code-compilation'
			],
			formalization: [
				'geometric-invariant-theory-git',
				'jax-in-lean',
				'geometric-measure-theory',
				'commutative-algebra-auslander-buchsbaum',
				'algebraic-geometry',
				'formalization-zero-knowledge-proofs',
				'metaprogramming-provable-computation-in-lean'
			]
		});
	}

	if (options.projectSlug === 'winter-2026') {
		normalized = reorderProjectSections(normalized, {
			autoformalization: [
				'lean-error-correction-with-llms',
				'mathematician-s-copilot-semantic-theorem-search',
				'mathematician-s-copilot-math2vec',
				'how-good-are-llms-at-lean'
			],
			machineLearning: [
				'cayleypy-search-on-massive-combinatorial-graphs',
				'reinforcement-learning-for-polynomials',
				'ai-for-quantum-code-compilation',
				'deep-learning-for-number-theory'
			],
			formalization: [
				'geometric-measure-theory',
				'commutative-algebra',
				'algebraic-geometry',
				'category-theory',
				'formalization-zero-knowledge-proofs',
				'metaprogramming-provable-computation-in-lean'
			]
		});
	}

	return rewriteLinks(normalized);
}

function stripProjectPageTitle(html: string, projectSlug: string) {
	const quarterLabel = projectSlug
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');

	let output = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
	const firstH2 = output.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
	if (!firstH2 || firstH2.index === undefined) return output;

	const firstH3Index = output.search(/<h3[^>]*>/i);
	const h2BeforeProjects = firstH3Index < 0 || firstH2.index < firstH3Index;
	const h2Text = firstH2[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

	if (h2BeforeProjects && h2Text.toLowerCase().includes(quarterLabel.toLowerCase())) {
		output = output.slice(0, firstH2.index) + output.slice(firstH2.index + firstH2[0].length);
	}

	return output;
}

type ProjectBuckets = {
	autoformalization: string[];
	machineLearning: string[];
	formalization: string[];
};

function reorderProjectSections(html: string, buckets: ProjectBuckets) {
	const firstSection = html.search(/<h2[^>]*id="(?:autoformalization|machine-learning)-projects"/);
	if (firstSection < 0) return html;

	const prefix = html.slice(0, firstSection);
	const projectArea = html.slice(firstSection);
	const blockMatches = [
		...projectArea.matchAll(/<h3[^>]*id="([^"]+)"[^>]*>[\s\S]*?(?=<h3[^>]*id=|<h2[^>]*id=|<\/section>)/gi)
	];
	if (!blockMatches.length) return html;

	const firstBlockIndex = blockMatches[0].index ?? 0;
	const lastMatch = blockMatches[blockMatches.length - 1];
	const lastBlockEnd = (lastMatch.index ?? 0) + lastMatch[0].length;
	const suffix = projectArea.slice(lastBlockEnd);

	const introArea = projectArea.slice(0, firstBlockIndex);
	const originalAutoIntro =
		introArea.match(/<h2[^>]*id="autoformalization-projects"[^>]*>[\s\S]*?(?=<h2[^>]*id=|$)/i)?.[0] ??
		'<h2 id="autoformalization-projects">Autoformalization projects</h2>';
	const autoIntro =
		buckets.autoformalization[0] === 'lean-error-correction-with-llms'
			? '<h2 id="autoformalization-projects">Autoformalization projects</h2>'
			: originalAutoIntro;
	const mlIntro =
		projectArea.match(/<h2[^>]*id="machine-learning-for-math-projects"[^>]*>[\s\S]*?(?=<h3[^>]*id=|$)/i)?.[0] ??
		'<h2 id="machine-learning-for-math-projects">Machine learning for math projects</h2>';
	const formalIntro =
		'<h2 id="formalization-projects">Formalization projects</h2>' +
		(buckets.autoformalization[0] === 'lean-error-correction-with-llms'
			? originalAutoIntro.replace(/<h2[\s\S]*?<\/h2>/i, '')
			: '');

	const blocks = new Map(blockMatches.map((match) => [match[1], match[0]]));
	const renderBlocks = (ids: string[]) => ids.map((id) => blocks.get(id)).filter(Boolean).join('\n\n');
	const used = new Set([...buckets.autoformalization, ...buckets.machineLearning, ...buckets.formalization]);
	const leftover = blockMatches.filter((match) => !used.has(match[1])).map((match) => match[0]).join('\n\n');

	return [
		prefix,
		autoIntro,
		renderBlocks(buckets.autoformalization),
		mlIntro,
		renderBlocks(buckets.machineLearning),
		formalIntro,
		renderBlocks(buckets.formalization),
		leftover,
		suffix
	]
		.filter(Boolean)
		.join('\n\n');
}

function rewriteLinks(html: string) {
	let output = html;

	for (const [legacyFile, route] of projectRedirects.entries()) {
		output = output.replaceAll(`href="${legacyFile}"`, `href="${sitePath(route)}"`);
	}

	output = output
		.replaceAll('href="resources.html"', `href="${sitePath('/resources')}"`)
		.replaceAll('href="courses.html"', `href="${sitePath('/resources#courses')}"`)
		.replaceAll('href="seminars.html"', `href="${sitePath('/resources#seminars')}"`)
		.replaceAll('href="people.html"', `href="${sitePath('/people')}"`)
		.replaceAll('href="research.html"', `href="${sitePath('/research')}"`)
		.replaceAll('href="http://ai.math.uw.edu/"', `href="${sitePath('/')}"`)
		.replaceAll('href="http://ai.math.uw.edu"', `href="${sitePath('/')}"`);

	for (const prefix of staticAssetPrefixes) {
		output = output.replaceAll(`src="${prefix}`, `src="${sitePath(`/${prefix}`)}`);
		output = output.replaceAll(`href="${prefix}`, `href="${sitePath(`/${prefix}`)}`);
	}

	return output;
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.replace(/&amp;/g, 'and')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
