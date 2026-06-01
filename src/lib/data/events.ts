export type LabEvent = {
	title: string;
	speaker: string;
	date: string;
	startTime: string;
	endTime: string;
	location: string;
	type: 'Seminar' | 'Workshop' | 'Poster Session' | 'Final Exam' | 'Information Session' | 'Colloquium';
	sourceUrl: string;
	abstract?: string;
};

// Event source of truth for the site.
//
// To add an event, append one object with ISO date, 24-hour times, location,
// speaker, type, and the UW Math source URL. Use the exact UW abstract when
// one is published; omit abstract rather than summarizing unpublished text.
export const labEvents = ([
	{
		title: 'Lean: Machine-Checked Mathematics and AI Collaboration',
		speaker: 'Leonardo de Moura, Senior Principal Applied Scientist in the Automated Reasoning Group at AW and creator of Lean FRO',
		date: '2026-05-08',
		startTime: '15:30',
		endTime: '16:30',
		location: 'ECE 105',
		type: 'Colloquium',
		sourceUrl: 'https://math.washington.edu/events/2026-05-08/lean-machine-checked-mathematics-and-ai-collaboration',
		abstract:
			'Lean is a proof assistant and programming language designed to make formal verification practical. In this talk, I will describe how Lean works, what it can do today, and where it is going.\nThe core idea is simple: every mathematical claim and every program can be checked by a machine. This changes what collaboration looks like: between mathematicians, between engineers, and increasingly between humans and AI systems. When a proof is machine-checked, you do not need to trust the author. You just check it.\nI will discuss recent work on proof automation and AI-assisted formalization, including experiments where multi-agent AI systems work autonomously on Lean tasks. I will also describe the Lean FRO, a nonprofit building Lean as long-term open infrastructure for mathematics and verified software.'
	},
	{
		title: 'Neural Methods for Plasma Simulation and Mathematical Formalization',
		speaker: 'Vasily Ilin',
		date: '2026-06-05',
		startTime: '14:00',
		endTime: '16:00',
		location: 'SMI 307',
		type: 'Final Exam',
		sourceUrl: 'https://math.washington.edu/events/2026-06-05/neural-methods-plasma-simulation-and-mathematical-formalization',
		abstract:
			"Vasily Ilin's PhD defense.\n\nI will summarize my PhD research, concentrating on two areas: machine learning for plasma simulation, and AI for formalizing mathematics in Lean."
	},
	{
		title: 'Math AI Lab poster session',
		speaker: 'Math AI Lab',
		date: '2026-03-16',
		startTime: '16:00',
		endTime: '18:00',
		location: 'ODE 136 & 141',
		type: 'Poster Session',
		sourceUrl: 'https://math.washington.edu/events/2026-03-16/math-ai-lab-poster-session',
		abstract:
			"Lean Projects\n\nGeometric Measure Theory\nCommutative Algebra\nAlgebraic Geometry\nCategory Theory\nFormalization: zero-knowledge proofs\nProvable Computation in Lean\n\nAI Projects\n\nLean error correction with LLMs\nMathematician's copilot: Semantic Theorem Search\nMathematician's copilot: Math2Vec\nCayleyPy: search on massive combinatorial graphs\nReinforcement Learning for Polynomials\nAI for Quantum Code Compilation\nDeep learning for number theory"
	},
	{
		title: 'Recent advances in LLMs for Mathematics',
		speaker: 'Sébastien Bubeck, OpenAI',
		date: '2026-02-06',
		startTime: '15:30',
		endTime: '16:30',
		location: 'PCAR 192',
		type: 'Colloquium',
		sourceUrl: 'https://math.washington.edu/events/2026-02-06/recent-advances-llms-mathematics',
		abstract:
			"I will review the progress of large language models for mathematics over the last 3 years, from barely solving high school level mathematics to solving some minor open problems in convex optimization, combinatorics and probability theory. The emphasis will be on trying to identify the shape of the current frontier capabilities, as it stands today, finding out both where it's helpful and where it's still falling short as a research assistant."
	},
	{
		title: 'Lean Together',
		speaker: 'Vasily Ilin, Dhruv Bhatia',
		date: '2026-02-13',
		startTime: '15:30',
		endTime: '17:00',
		location: 'CMU B-006',
		type: 'Workshop',
		sourceUrl: 'https://math.washington.edu/events/2026-02-13/lean-together',
		abstract:
			'A weekly meeting for people interested in Lean. We do hands-on exercises and small demos. Topics include:\n\ntheorem proving in Lean\nmeta-programming in Lean\ngeneral-purpose programming in Lean'
	},
	{
		title: 'Lean Together',
		speaker: 'Vasily Ilin, Dhruv Bhatia',
		date: '2026-02-20',
		startTime: '15:30',
		endTime: '17:30',
		location: 'CMU B-006',
		type: 'Workshop',
		sourceUrl: 'https://math.washington.edu/events/2026-02-13/lean-together',
		abstract:
			'A weekly meeting for people interested in Lean. We do hands-on exercises and small demos. Topics include:\n\ntheorem proving in Lean\nmeta-programming in Lean\ngeneral-purpose programming in Lean'
	},
	{
		title: 'Lean Together',
		speaker: 'Vasily Ilin, Dhruv Bhatia',
		date: '2026-02-27',
		startTime: '15:30',
		endTime: '17:30',
		location: 'CMU B-006',
		type: 'Workshop',
		sourceUrl: 'https://math.washington.edu/events/2026-02-13/lean-together',
		abstract:
			'A weekly meeting for people interested in Lean. We do hands-on exercises and small demos. Topics include:\n\ntheorem proving in Lean\nmeta-programming in Lean\ngeneral-purpose programming in Lean'
	},
	{
		title: 'Lean Together',
		speaker: 'Vasily Ilin, Dhruv Bhatia',
		date: '2026-03-06',
		startTime: '15:30',
		endTime: '17:30',
		location: 'CMU B-006',
		type: 'Workshop',
		sourceUrl: 'https://math.washington.edu/events/2026-02-13/lean-together',
		abstract:
			'A weekly meeting for people interested in Lean. We do hands-on exercises and small demos. Topics include:\n\ntheorem proving in Lean\nmeta-programming in Lean\ngeneral-purpose programming in Lean'
	},
	{
		title: 'Verifiable PDE Reasoning and Modeling with Neurosymbolics',
		speaker: 'Wuyang Chen, Simon Fraser University, Assistant Professor',
		date: '2026-01-23',
		startTime: '15:30',
		endTime: '16:30',
		location: 'CMU B-006',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2026-01-23/verifiable-pde-reasoning-and-modeling-neurosymbolics',
		abstract:
			'Recent progress in LLMs has transformed text and code generation, yet models still falter on PDEs (partial differential equation) where correctness, constraints, and physical consequences are critical. This talk explores how formal LLM reasoning can advance symbolic PDE modeling. First, our PDE-Controller formalizes informal PDEs, synthesizes solver-ready code, and plans subgoals to tackle nonconvex control via interactions with external solvers.\n\nSecond, our Lean Finder accelerates PDE formalization with a semantics-aware search engine for Lean/Mathlib that retrieves relevant theorems, outperforming GPT models and earning strong reception in the AI-for-math community. Together, these efforts aim to close the loop between automated reasoning and human heuristics across diverse, verifiable scientific tasks.'
	},
	{
		title: 'Lean Together',
		speaker: 'Vasily Ilin, Dhruv Bhatia',
		date: '2026-01-09',
		startTime: '15:30',
		endTime: '17:30',
		location: 'CMU B-006',
		type: 'Workshop',
		sourceUrl: 'https://math.washington.edu/events/2026-01-09/lean-together',
		abstract: 'Weekly event to learn Lean in a collaborative way. There are no prerequisites to participate.'
	},
	{
		title: 'Lean Together',
		speaker: 'Vasily Ilin, Dhruv Bhatia',
		date: '2026-01-16',
		startTime: '15:30',
		endTime: '17:30',
		location: 'CMU B-006',
		type: 'Workshop',
		sourceUrl: 'https://math.washington.edu/events/2026-01-09/lean-together',
		abstract: 'Weekly event to learn Lean in a collaborative way. There are no prerequisites to participate.'
	},
	{
		title: 'Lean Together',
		speaker: 'Vasily Ilin, Dhruv Bhatia',
		date: '2026-01-23',
		startTime: '16:30',
		endTime: '18:30',
		location: 'CMU B-006',
		type: 'Workshop',
		sourceUrl: 'https://math.washington.edu/events/2026-01-09/lean-together',
		abstract: 'Weekly event to learn Lean in a collaborative way. There are no prerequisites to participate.'
	},
	{
		title: 'Math AI Lab Poster Presentations',
		speaker: 'Math AI Lab',
		date: '2025-12-10',
		startTime: '16:00',
		endTime: '17:30',
		location: 'OUG 136 & 141',
		type: 'Poster Session',
		sourceUrl: 'https://math.washington.edu/events/2025-12-10/math-ai-lab-poster-presentations',
		abstract:
			"Please join us to hear about all the exciting work the Math AI Lab has been up to this quarter. This quarter's projects have been:\n\nAI for Quantum Code Compilation\nDeep learning of number theory\nFormalizing Geometric Measure Theory\nFormalizing Stacks\nHow good are language models at Lean?\nLean error correction with language models\nMathematician's copilot: reliable theorem search\nMonogenic extensions of regular local rings\nProvable Computation in Lean\nReinforcement Learning for Polynomials\nTeaching a computer to knot"
	},
	{
		title: 'Geometry and Expressivity of Neuromanifolds: Where Algebraic Geometry Meets Neural Networks',
		speaker: 'Maksym Zubkov',
		date: '2025-12-05',
		startTime: '12:30',
		endTime: '13:30',
		location: 'PDL C-38',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-12-05/geometry-and-expressivity-neuromanifolds-where-algebraic-geometry-meets-neural',
		abstract:
			'In this talk, I will give an overview of neuroalgebraic geometry, a new field, analogous to algebraic statistics, that uses algebraic geometry to understand different neural network architectures. Our main object of study will be a neuromanifold and its expressivity.\n\nA neuromanifold is defined as an embedding of the parameter space of a fixed neural network into a fixed ambient space of functions, while expressivity is defined as the capability of a neural network to approximate an element in the ambient space arbitrarily well. We will consider two types of activation functions: polynomial and rational.\n\nFor each of these activation functions, we will construct the Zariski closure of a neuromanifold, called a neurovariety, and show that understanding the geometry of a neuromanifold or neurovariety is equivalent to understanding long-standing and beautiful objects of classical algebraic geometry such as secant varieties, Chow varieties, and others.\n\nFinally, we will briefly discuss analogues of neuromanifolds over finite fields and show how simple point-counting can reveal further insights into the expressivity of neural networks and the geometry of a neuromanifold over the complex or real numbers.'
	},
	{
		title: 'Machine Learning for Accelerating Mathematical Discovery in Algebraic Combinatorics',
		speaker: 'Henry Kvinge, PNNL & UW',
		date: '2025-11-21',
		startTime: '12:30',
		endTime: '13:30',
		location: 'C-038',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-11-21/machine-learning-accelerating-mathematical-discovery-algebraic-combinatorics-nbsp',
		abstract:
			'Examples play a critical role in the mathematician’s workflow, enabling us to explore unfamiliar mathematical landscapes, building intuition and generating conjectures along the way. Of course, there are many settings where a far greater number of examples can be generated than could be manually examined by any one person. On the other hand, recent progress in AI has resulted in pattern recognition capabilities that can capture nuanced structural features in data at huge scales.\n\nIn this talk we discuss the use of AI for conjecture generation in algebraic combinatorics. We will start by describing what we have learned about the process of putting together a ‘math dataset’ aimed at machine learning. We then describe our Algebraic Combinatorics Dataset Repository where we translated open problems and foundational results into a machine learning friendly format.\n\nWe then discuss a specific example where we used graph neural networks and mechanistic interpretability to re-discover several theorems which characterize mutation equivalence classes of quivers.'
	},
	{
		title: 'Proving and Improving: Language Models for Theorem Proving and Proof Shortening in Lean',
		speaker: 'Alex Gu',
		date: '2025-10-31',
		startTime: '12:30',
		endTime: '13:30',
		location: 'PDL C-038',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-10-31/proving-and-improving-language-models-theorem-proving-and-proof-shortening-lean',
		abstract:
			'Large language models (LLMs) have made steady progress in formal mathematics, achieving near-International Mathematical Olympiad (IMO) performance. This talk presents two complementary advances toward more capable and interpretable formal proving systems. First, we introduce LeanDojo, a foundational open-source toolkit bridging ML and Lean, enabling large-scale data extraction, interactive training, and the development of ReProver, a retrieval-augmented Lean prover.\n\nNext, we turn to a critical challenge: proofs produced by LLMs are often unnecessarily long, redundant, and opaque. To mitigate this, we introduce ProofOptimizer, a system that automatically simplifies Lean proofs while preserving correctness. It combines symbolic linting, a fine-tuned 7B model, and iterative refinement, reducing proof length by up to 87% on MiniF2F and 57% on PutnamBench, even halving some IMO-level proofs.\n\nTogether, these systems demonstrate how AI can make automated proofs not only possible, but also increasingly comprehensible.'
	},
	{
		title: 'Lean Together',
		speaker: 'Vasily Ilin',
		date: '2025-10-24',
		startTime: '13:30',
		endTime: '15:30',
		location: 'CMU 243',
		type: 'Workshop',
		sourceUrl: 'https://math.washington.edu/events/2025-10-24/lean-together',
		abstract:
			'If you have been curious about Lean -- the programming language to teach math to a computer -- but did not know how to get started, come Lean with us! The Math AI Lab is organizing this event to bring Lean beginners together, including level 0, to quote Panda Po. This is also a good way to engage with the UW Math AI Lab in order to participate in future research projects.\n\nI will give a small demo that you will follow on your laptop right in the browser. We will probably start with the Natural Number Game and proceed to Glimpse of Lean.'
	},
	{
		title: 'CayleyPy - Artificial intelligence methods for group and graph theories',
		speaker: 'Alexander Chervov, Institut Curie',
		date: '2025-10-24',
		startTime: '12:30',
		endTime: '13:30',
		location: 'PDL-C38 and Zoom',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-10-24/cayleypy-artificial-intelligence-methods-group-and-graph-theories',
		abstract:
			'We will present an AI-based open source Python library "CayleyPy" which can handle googol-size Cayley graphs and significantly outperforms classical computer algebra systems GAP/SAGE for several tasks. Hundreds conjectures and several results were obtained with its help. Classical group theory tasks e.g. decomposition of the group elements, can be rephrased as standard reinforcement learning tasks, and approached in a similar manner as Google Deepmind\'s AlphaGo/Zero.\n\nWe will also give an overview of various recent achievements in "AI for math" emerging field of research. The talk will be based on: arXiv:2509.19162, arXiv:2502.18663, arXiv:2502.13266.'
	},
	{
		title: 'Seed-Prover: Deep and Broad Reasoning for Automated Theorem Proving',
		speaker: 'Vasily Ilin',
		date: '2025-10-17',
		startTime: '12:30',
		endTime: '13:30',
		location: 'PDL-C38 and Zoom',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-10-17/seed-prover-deep-and-broad-reasoning-automated-theorem-proving',
		abstract:
			'Seed-Prover is the current best Lean model, achieving 100% on minif2f, 50% on PutnamBench and gold-level performance on the 2025 IMO. I will briefly survey the history of formal theorem proving and talk about the Seed-Prover paper. You do not need to know Lean to understand the talk.'
	},
	{
		title: 'AI Meets Mathematics: A Survey of Recent Breakthroughs and Emerging Directions',
		speaker: 'Carina Hong (Stanford Math / Stanford Law / Axiom AI)',
		date: '2025-05-30',
		startTime: '15:30',
		endTime: '16:30',
		location: 'PDL C-38',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-05-30/ai-meets-mathematics-survey-recent-breakthroughs-and-emerging-directions',
		abstract:
			'Abstract:\n\nThe field of AI for Mathematics has moved its focus from solving benchmark problems with numerical solutions to generating formal proofs to research-level mathematical questions. In this survey talk we will cover recent developments and future directions in AI4Math, including the following three topics:\n\n1. Formalization and auto-formalization, where natural language math contents (with LaTeX formulas) is converted into Lean, Isabelle, and Coq programs.\n\n2. Automated theorem proving using LLMs, where transformer-based models now guide symbolic search of formal proofs and achieve competitive performances on benchmarks such as Mini-F2F and PutnamBench.\n3. Conjecturing, where programming language helps with new knowledge generation in Euclidean Geometry and pairing conjecturer and prover gives advances in performance.'
	},
	{
		title: 'Formalizing Engineering Mathematics with Lean',
		speaker: 'Eric Klavins, Proffessor at ECE, UW',
		date: '2025-04-17',
		startTime: '15:00',
		endTime: '16:00',
		location: 'PDL C-38',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-04-17/formalizing-engineering-mathematics-lean',
		abstract:
			"I will describe our recent efforts to formalize, in Lean, fundamental concepts from engineering mathematics including signal processing, control theory, and formal verification. I'll start with an overview of the relationship between programming languages and formal logic, which provides an astounding avenue for programmers and engineers to learn and hopefully contribute to mathematics. I will give several examples of projects engineering students have explored.\n\nI will then discuss various challenges, mainly to do with rigorous software engineering, that must be overcome before this kind of framework can be widely adopted in engineering."
	},
	{
		title: 'Lower bounds on neural networks and slicing the hypercube',
		speaker: 'Gal Yehuda, Yale University',
		date: '2025-03-18',
		startTime: '14:30',
		endTime: '15:30',
		location: 'PDL C-38',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-03-18/lower-bounds-neural-networks-and-slicing-hypercube',
		abstract:
			'Abstract:\n\nWhat is the size of the smallest neural network that computes the parity function? How many hyperplanes are needed to slice the Boolean hypercube? In this talk we will discuss the connection between the problems as well as lower bounds, using methods from convex geometry, probability and combinatorics.'
	},
	{
		title: 'Math AI Lab Winter 2025 Projects',
		speaker: 'Math AI Lab',
		date: '2025-03-14',
		startTime: '14:30',
		endTime: '16:00',
		location: 'CMU B-006',
		type: 'Poster Session',
		sourceUrl: 'https://math.washington.edu/events/2025-03-14/math-ai-lab-winter-2025-projects',
		abstract:
			'Come see what the Math AI Lab (aka eXperimental Lean Lab) has been up to this quarter. Undergraduates will present their work on the following projects:\n\nWhat mathematical functions can neural networks learn?\nReinforcement Learning for polynomials\nAuto-formalization with Language Models\nMetaprogramming in Lean\nFormalizing Polyhedral Geometry in Lean\nCounterexamples in Commutative Algebra in Lean\nFormalizing Zariski Spaces in Lean'
	},
	{
		title: 'Diffusion Generative Modeling: Making Pictures from Noise with Math',
		speaker: 'Vasily Ilin',
		date: '2025-01-30',
		startTime: '12:30',
		endTime: '13:30',
		location: 'PDL C-401',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2025-01-30/diffusion-generative-modeling-making-pictures-noise-math',
		abstract:
			"How does ChatGPT make pictures? Turns out it's a lot of SDEs, probability and a bit of optimization. I will introduce the basic building blocks of the algorithm, such as reversing the OU process, and will show some examples using the MNIST dataset of handwritten digits."
	},
	{
		title: 'Formalizing mathematics in the eXperimental Lean Lab',
		speaker: 'Experimental Lean Lab',
		date: '2024-12-03',
		startTime: '16:30',
		endTime: '17:30',
		location: 'CMU B-006',
		type: 'Information Session',
		sourceUrl: 'https://math.washington.edu/events/2024-12-03/formalizing-mathematics-experimental-lean-lab',
		abstract:
			'The eXperimental Lean Lab will showcase using Lean to formalize real mathematics. We have five groups formalizing 1) generating functions, 2) central limit theorem, 3) topology for algebraic geometry, 4) examples in commutative algebra, and 5) metaprogramming in Lean.\n\nIf you have been curious about using computers for proof assistance and verification, this talk is for you!'
	},
	{
		title: 'Generating Functions in Lean',
		speaker: 'Herman Chau, University of Washington',
		date: '2024-05-20',
		startTime: '13:00',
		endTime: '14:20',
		location: 'Denny Hall (DEN), 113',
		type: 'Seminar',
		sourceUrl: 'https://math.washington.edu/events/2024-05-20/generating-functions-lean',
		abstract:
			'In this talk, we will walk through how to formalize some examples from Herbert Wilf\'s "generatingfunctionology". We\'ll see how to define and work with power series in Lean, and work our way towards proving the closed form formula for the Fibonacci numbers. Along the way, we will discuss ways to structure Lean code to be readable from a mathematician\'s point of view.'
	}
] satisfies LabEvent[]).sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime));

export function eventDate(event: LabEvent) {
	return new Date(`${event.date}T${event.startTime}:00`);
}
