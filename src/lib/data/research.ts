export type ResearchEntry = {
	venue: string;
	title: string;
	authors: string;
	abstract: string;
	url: string;
	linkLabel: string;
	badge?: string;
};

export type ResearchSection = {
	id: string;
	title: string;
	description: string;
	items: ResearchEntry[];
};

export const researchSections: ResearchSection[] = [
	{
		id: 'conference-workshop-papers',
		title: 'Conference & Workshop Papers',
		description:
			'Peer-reviewed and workshop papers by Math AI Lab members across machine learning, theorem proving, plasma physics, and mathematical search.',
		items: [
			{
				venue: 'ICML 2026',
				badge: 'Spotlight',
				title: 'DiScoFormer: Plug-In Density and Score Estimation with Transformers',
				authors: 'Vasily Ilin, Peter Sushko',
				abstract:
					'Estimating probability density and its score from samples remains a core problem in generative modeling, Bayesian inference, and kinetic theory. DiScoFormer bridges classical kernel methods and neural score models with a plug-in transformer-based estimator.',
				url: 'https://openreview.net/forum?id=ZuqbPd7xTy',
				linkLabel: 'OpenReview'
			},
			{
				venue: 'ICLR 2026, Logical Reasoning of LLMs Workshop',
				title: 'Semantic Search over 9 Million Mathematical Theorems',
				authors:
					'Luke Alexander, Eric Leonen, Sophie Szeto, Artemii Remizov, Ignacio Tejeda, Jarod Alper, Giovanni Inchiostro, Vasily Ilin',
				abstract:
					'Searching for mathematical results remains difficult because most tools retrieve entire papers, while mathematicians and theorem-proving agents often seek a specific theorem. This work introduces semantic theorem retrieval across a unified corpus of 9.2 million theorem statements.',
				url: 'https://openreview.net/forum?id=4dyJvwEyaT',
				linkLabel: 'OpenReview'
			},
			{
				venue: 'ICLR 2026, VerifAI Workshop',
				title: 'Learning to Repair Lean Proofs from Compiler Feedback',
				authors:
					'Evan Wang, Simon Chess, Daniel Lee, Siyuan Ge, Ajit Mallavarapu, Jarod Alper, Vasily Ilin',
				abstract:
					'As neural theorem provers become increasingly agentic, the ability to interpret and act on compiler feedback is critical. This work studies a fine-tuned repair model trained on erroneous Lean proofs paired with compiler diagnostics and corrections.',
				url: 'https://openreview.net/forum?id=fF46jVTjS8',
				linkLabel: 'OpenReview'
			},
			{
				venue: 'ICLR 2026, AI with Recursive Self-Improvement Workshop',
				title: 'CircuitBuilder: From Polynomials to Circuits via Reinforcement Learning',
				authors:
					'Weikun K. Zhang, Rohan Pandey, Bhaumik Mehta, Kaijie Jin, Naomi Morato, Archit Ganapule, Michael Ruofan Zeng, Jarod Alper',
				abstract:
					"Motivated by auto-proof generation and Valiant's VP vs. VNP conjecture, this project formulates arithmetic circuit discovery as a single-player game where a reinforcement learning agent builds a circuit within a fixed number of operations.",
				url: 'https://openreview.net/forum?id=JNsTWIukjQ',
				linkLabel: 'OpenReview'
			},
			{
				venue: 'ICLR 2026, AI & PDE Workshop',
				title: 'A Neural Score-Based Particle Method for the Vlasov-Maxwell-Landau System',
				authors: 'Vasily Ilin, Jingwei Hu',
				abstract:
					'Plasma modeling is central to the design of nuclear fusion reactors, but simulating collisional plasma kinetics from first principles remains computationally challenging. This work introduces a neural score-based approach for the Vlasov-Maxwell-Landau system.',
				url: 'https://openreview.net/forum?id=0wp8jxxxGT',
				linkLabel: 'OpenReview'
			},
			{
				venue: 'AIPV 2026, AI, Proof & Verification Workshop',
				title: 'Semi-Autonomous Formalization of the Vlasov-Maxwell-Landau Equilibrium',
				authors: 'Vasily Ilin',
				abstract:
					'A semi-autonomous formalization effort targeting the equilibrium theory of the Vlasov-Maxwell-Landau system in Lean 4, combining human-guided proof structure with AI-assisted tactic search.',
				url: 'https://arxiv.org/abs/2603.15929',
				linkLabel: 'arXiv'
			}
		]
	},
	{
		id: 'preprints',
		title: 'Preprints',
		description: 'Current preprints and project papers from the lab.',
		items: [
			{
				venue: 'arXiv Preprint',
				title:
					'StabilizerBench: A Benchmark for AI-Assisted Quantum Error Correction Circuit Synthesis',
				authors:
					'Andres Paz, Christian Tarta, Cordelia Yuqiao Li, Mayee Sun, Sarju Patel, Sylvie Lausier',
				abstract:
					'A benchmark suite for evaluating AI systems on synthesizing quantum error-correcting stabilizer circuits, with systematic coverage of code families and circuit constraints relevant to near-term quantum hardware.',
				url: 'https://arxiv.org/abs/2604.21287',
				linkLabel: 'arXiv'
			}
		]
	},
	{
		id: 'other-publications',
		title: 'Other Publications',
		description: 'Essays and public-facing research perspectives connected to the lab.',
		items: [
			{
				venue: 'Bulletin of the American Mathematical Society, 2025',
				title:
					"Embracing AI and Formalization: Experimenting with Tomorrow's Mathematical Tools",
				authors: 'Jarod Alper',
				abstract:
					'A perspective piece on integrating large language models and formal proof assistants into mathematical practice, drawing on experiences from the UW Math AI Lab.',
				url: 'https://ww2.ams.org/journals/bull/2026-63-02/S0273-0979-2025-01879-0/viewer/?t=1780254358590',
				linkLabel: 'AMS'
			}
		]
	}
];

export const featuredResearch = researchSections.flatMap((section) => section.items).slice(0, 4);
