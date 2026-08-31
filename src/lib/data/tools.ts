export type ToolStat = { value: string; label: string };
export type ToolLink = { label: string; url: string };

export type LabTool = {
	id: string;
	name: string;
	/** The project's own description, quoted from its published page. */
	description: string;
	url: string;
	poster: string;
	posterAlt: string;
	stats: ToolStat[];
	links: ToolLink[];
	credit: string;
};

export const labTools: LabTool[] = [
	{
		id: 'open-problems-map',
		name: 'The Growing Map of Open Problems',
		description:
			'15,458 unsolved problems, placed by meaning, appearing in the year they were posed. Gold: already stated in formal Lean. Click any problem for its statement.',
		url: 'https://open-problems-map.pages.dev/',
		poster: '/tools/open-problems-map.jpg',
		posterAlt: 'The Growing Map of Open Problems, showing 15,034 open problems grouped by field',
		stats: [
			{ value: '15,458', label: 'open problems' },
			{ value: '17', label: 'fields' },
			{ value: '77', label: 'stated in Lean' },
			{ value: '1742–2026', label: 'years' }
		],
		links: [
			{ label: 'UnsolvedMath dataset', url: 'https://huggingface.co/datasets/ulamai/UnsolvedMath' },
			{ label: 'Formalization frontier', url: 'https://open-problems-map.pages.dev/frontier.html' }
		],
		credit: 'Built by Simon Kurgan on TheoremGraph. Problem data from ulamai/UnsolvedMath, CC BY 4.0.'
	},
	{
		id: 'theoremsearch',
		name: 'TheoremSearch',
		description:
			'Describe a result in natural language, and TheoremSearch finds it across arXiv, the Stacks Project, and more. 70% more accurate than LLM search.',
		url: 'https://www.theoremsearch.com/',
		poster: '/tools/theoremsearch.jpg',
		posterAlt: 'TheoremSearch home page: Search 9 million+ mathematical theorems',
		stats: [
			{ value: '9,269,041', label: 'theorems' },
			{ value: '8', label: 'sources' },
			{ value: '388,105', label: 'Lean declarations' },
			{ value: '11.3M', label: 'graph edges' }
		],
		links: [
			{ label: 'TheoremSearch paper', url: 'https://arxiv.org/abs/2602.05216' },
			{ label: 'TheoremGraph paper', url: 'https://arxiv.org/abs/2606.25363' },
			{ label: 'API', url: 'https://api.theoremsearch.com/openapi.json' },
			{ label: 'Dataset', url: 'https://huggingface.co/datasets/uw-math-ai/theorem-search-dataset' }
		],
		credit:
			'Luke Alexander, Eric Leonen, Sophie Szeto, Artemii Remizov, Ignacio Tejeda, Jarod Alper, Giovanni Inchiostro, Vasily Ilin.'
	}
];
