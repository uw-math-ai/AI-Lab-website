export type Paper = {
	title: string;
	arxivId: string;
	url: string;
	summary: string;
};

export const arxivPapers: Paper[] = [
	{
		title: 'Semantic Search over 9 Million Mathematical Theorems',
		arxivId: '2602.05216',
		url: 'https://arxiv.org/abs/2602.05216',
		summary: 'Theorem-level semantic retrieval over a large corpus of research mathematics.'
	},
	{
		title: 'Learning to Repair Lean Proofs from Compiler Feedback',
		arxivId: '2602.02990',
		url: 'https://arxiv.org/abs/2602.02990',
		summary: 'APRIL, a dataset and model direction for repairing Lean proofs from diagnostics.'
	},
	{
		title: 'Semi-Autonomous Formalization of the Vlasov-Maxwell-Landau Equilibrium',
		arxivId: '2603.15929',
		url: 'https://arxiv.org/abs/2603.15929',
		summary: 'A complete Lean formalization produced through an AI-assisted research loop.'
	},
	{
		title: 'CircuitBuilder: From Polynomials to Circuits via Reinforcement Learning',
		arxivId: '2603.17075',
		url: 'https://arxiv.org/abs/2603.17075',
		summary: 'Reinforcement learning methods for discovering arithmetic circuits for polynomials.'
	}
];
