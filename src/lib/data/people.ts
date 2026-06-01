export type PersonCard = {
	name: string;
	role: string;
	image?: string;
	url?: string;
};

export type LabPhoto = {
	src: string;
	alt: string;
	caption: string;
};

export const leadership: PersonCard[] = [
	{
		name: 'Vasily Ilin',
		role: 'Co-Director',
		image: '/photos/people/vasily-ilin.jpg',
		url: 'https://vilin97.github.io/'
	},
	{
		name: 'Jarod Alper',
		role: 'Co-Director',
		image: '/photos/people/jarod-alper.jpg',
		url: 'https://sites.math.washington.edu/~jarod/'
	}
];

export const projectLeaders: PersonCard[] = [
	{ name: 'Allison Henrich', role: 'Teaching a Computer to Knot', image: '/photos/people/allison-henrich.jpg', url: 'https://www.allisonhenrich.com/' },
	{ name: 'Andres Paz', role: 'AI for Quantum Code Compilation', image: '/photos/people/andres-paz.jpg', url: 'https://apaz.info/' },
	{ name: 'Andrew Tawfeek', role: 'Teaching a Computer to Knot', image: '/photos/people/andrew-tawfeek.jpg', url: 'https://atawfeek.com/' },
	{ name: 'Arkamouli Debnath', role: 'Geometric Invariant Theory', image: '/photos/people/arkamouli-debnath.jpg', url: 'https://sites.google.com/view/arkamouli/home' },
	{ name: 'Bianca Viray', role: 'Algebraic Geometry', image: '/photos/people/bianca-viray.jpg', url: 'https://sites.math.washington.edu/~bviray/' },
	{ name: 'Bryan Boehnke', role: 'Algebraic Geometry', image: '/photos/people/bryan-boehnke.jpg', url: 'https://sites.google.com/view/bryanboehnke/' },
	{ name: 'Dean Light', role: 'LeanGCD', image: '/photos/people/dean-light.jpg', url: 'https://github.com/DeanLight' },
	{ name: 'Dhruv Bhatia', role: 'Provable Computation in Lean', image: '/photos/people/dhruv-bhatia.jpg', url: 'https://math.washington.edu/people/dhruv-bhatia' },
	{ name: 'Eric Klavins', role: 'Zero-Knowledge Proofs, Formalizing Stacks', image: '/photos/people/eric-klavins.jpg', url: 'https://klavinslab.org/' },
	{ name: 'Giovanni Inchiostro', role: 'Semantic Theorem Search, GIT', image: '/photos/people/giovanni-inchiostro.jpg', url: 'https://sites.math.washington.edu/~ginchios/' },
	{ name: 'Haocheng Cai', role: 'Monogenic Extensions', image: '/photos/people/haocheng-cai.jpg', url: 'https://math.washington.edu/people/haocheng-cai' },
	{ name: 'Haoming Ning', role: 'Commutative Algebra', image: '/photos/people/haoming-ning.jpg', url: 'https://sites.google.com/uw.edu/haomingning' },
	{ name: 'Henry Kvinge', role: 'Math2Vec', image: '/photos/people/henry-kvinge.jpg', url: 'https://hkvinge.github.io/' },
	{ name: 'Ignacio Tejeda', role: 'Geometric Measure Theory', image: '/photos/people/ignacio-tejeda.jpg', url: 'https://math.washington.edu/people/ignacio-tejeda' },
	{ name: 'John Leo', role: 'Monogenic Extensions', image: '/photos/people/john-leo.jpg', url: 'https://github.com/halfaya' },
	{ name: 'Junaid Hasan', role: 'Deep Learning for Number Theory', image: '/photos/people/junaid-hasan.jpg', url: 'https://junaidhasan.com/' },
	{ name: 'Leo Mayer', role: 'Geometric Invariant Theory, Commutative Algebra', image: '/photos/people/leo-mayer.jpg', url: 'https://math.washington.edu/people/leopold-mayer' },
	{ name: 'Michael Theologitis', role: 'LeanGCD', image: '/photos/people/michael-theologitis.jpg', url: 'https://scholar.google.com/citations?user=zXsulEcAAAAJ&hl=en' },
	{ name: 'Michael R. Zeng', role: 'Reinforcement Learning for Polynomials, CayleyPy', image: '/photos/people/michael-zeng.jpg', url: 'https://zengrf.github.io/' },
	{ name: 'Nelson Niu', role: 'Category Theory', image: '/photos/people/nelson-niu.jpg', url: 'https://nelsonniu.com/' },
	{ name: 'Samuel Ainsworth', role: 'JAX in Lean', image: '/photos/people/samuel-ainsworth.jpg', url: 'https://samlikes.pizza/' },
	{ name: 'Tyson Klingner', role: 'How Good Are LLMs at Lean?', image: '/photos/people/tyson-klingner.jpg', url: 'https://math.washington.edu/people/tyson-klingner' }
];

export const members: PersonCard[] = [
	{ name: 'Abel Mesfin', role: 'Teaching a Computer to Knot' },
	{ name: 'Ajit Mallavarapu', role: 'Lean Error Correction' },
	{ name: 'Akhil Srinivasan', role: 'Deep Learning for Number Theory' },
	{ name: 'Alan Chang', role: 'Provable Computation' },
	{ name: 'Alexandra Aiello', role: 'Zero-Knowledge Proofs' },
	{ name: 'Alexandre Borentain', role: 'RL for Polynomials' },
	{ name: 'Andrew Chen', role: 'Deep Learning for Number Theory' },
	{ name: 'Annie Cao', role: 'Geometric Measure Theory' },
	{ name: 'Annis Wu', role: 'Provable Computation' },
	{ name: 'Artemii Remizov', role: 'Semantic Theorem Search' },
	{ name: 'Ben Bioren', role: 'LeanGCD' },
	{ name: 'Bhaumik Mehta', role: 'RL for Polynomials' },
	{ name: 'Bohan Zhao', role: 'Geometric Invariant Theory' },
	{ name: 'Bohao Chen', role: 'LLMs at Lean' },
	{ name: 'Cecilia', role: 'Math2Vec' },
	{ name: 'Christian Tarta', role: 'Quantum Code Compilation' },
	{ name: 'Claire Xu', role: 'RL for Polynomials, Deep Learning for Number Theory' },
	{ name: 'Cordelia Li', role: 'Quantum Code Compilation' },
	{ name: 'Daniel Lee', role: 'Lean Error Correction' },
	{ name: 'Danny Zhang', role: 'CayleyPy' },
	{ name: 'Di Qiu Xiang', role: 'OpenMath' },
	{ name: 'Dora Kassabova', role: 'Commutative Algebra' },
	{ name: 'Dowland Aiello', role: 'Formalizing Stacks' },
	{ name: 'Drew Bladek', role: 'LLMs at Lean' },
	{ name: 'Emily Meng', role: 'Geometric Invariant Theory' },
	{ name: 'Eric Hur', role: 'Quantum Code Compilation' },
	{ name: 'Eric Leonen', role: 'Semantic Theorem Search' },
	{ name: 'Escher Crawford', role: 'LLMs at Lean' },
	{ name: 'Evan Porter', role: 'RL for Polynomials' },
	{ name: 'Evan Wang', role: 'LeanGCD, Lean Error Correction' },
	{ name: 'Gaurang Pendharkar', role: 'CayleyPy' },
	{ name: 'George Peykanu', role: 'Algebraic Geometry' },
	{ name: 'Grant Yang', role: 'Algebraic Geometry' },
	{ name: 'Hansel Lee', role: 'RL for Polynomials' },
	{ name: 'Hemkesh Bandi', role: 'Deep Learning for Number Theory' },
	{ name: 'Ivonne Zhang', role: 'Deep Learning for Number Theory' },
	{ name: 'Jacob Boyce', role: 'Geometric Invariant Theory' },
	{ name: 'James Martin', role: 'Formalizing Stacks' },
	{ name: 'Jared Darlington', role: 'Math2Vec' },
	{ name: 'Jeremy Ma', role: 'JAX in Lean' },
	{ name: 'Jiahe Lu', role: 'Math2Vec' },
	{ name: 'Joseph Qian', role: 'Provable Computation' },
	{ name: 'Josh', role: 'Geometric Measure Theory' },
	{ name: 'Junye Ji', role: 'Provable Computation' },
	{ name: 'Kaijie Jin', role: 'RL for Polynomials' },
	{ name: 'Kaira Nair', role: 'LLMs at Lean' },
	{ name: 'Kedar Chintalapati', role: 'Math2Vec' },
	{ name: 'Kyle Zhang', role: 'RL for Polynomials' },
	{ name: 'Leo Carlin', role: 'Math2Vec' },
	{ name: 'Luke Alexander', role: 'Semantic Theorem Search' },
	{ name: 'Mayee Sun', role: 'Quantum Code Compilation' },
	{ name: 'Merav Frank', role: 'CayleyPy' },
	{ name: 'Michael', role: 'Math2Vec' },
	{ name: 'Nailin Guan', role: 'Commutative Algebra' },
	{ name: 'Naomi Morato', role: 'RL for Polynomials' },
	{ name: 'Naren Prabhu', role: 'LeanGCD' },
	{ name: 'Nathan Pao', role: 'Geometric Measure Theory' },
	{ name: 'Nhan Pham', role: 'LeanGCD' },
	{ name: 'Nicole Ham', role: 'Teaching a Computer to Knot' },
	{ name: 'Nina Tharamal', role: 'Deep Learning for Number Theory' },
	{ name: 'Rachit Jaiswal', role: 'Math2Vec' },
	{ name: 'Rithikesh Muddana', role: 'CayleyPy' },
	{ name: 'Rohan Pandey', role: 'RL for Polynomials' },
	{ name: 'Ruslana Korolov', role: 'Provable Computation' },
	{ name: 'Saharsh Bhargava', role: 'Math2Vec' },
	{ name: 'Samarth Rao', role: 'Math2Vec' },
	{ name: 'Sambhu Ganesan', role: 'CayleyPy' },
	{ name: 'Sarju Patel', role: 'Quantum Code Compilation' },
	{ name: 'Sathvik Kurapati', role: 'Algebraic Geometry' },
	{ name: 'Saumi Joshi', role: 'OpenMath' },
	{ name: 'Sean Kawano', role: 'Teaching a Computer to Knot' },
	{ name: 'Simon Chess', role: 'Lean Error Correction' },
	{ name: 'Simon Kurgan', role: 'Semantic Theorem Search' },
	{ name: 'Siyuan Ge', role: 'OpenMath, Lean Error Correction' },
	{ name: 'Solden Stoll', role: 'Teaching a Computer to Knot' },
	{ name: 'Sophie Szeto', role: 'Semantic Theorem Search' },
	{ name: 'Sukhman Singh', role: 'Category Theory' },
	{ name: 'Sylvie Lausier', role: 'Quantum Code Compilation' },
	{ name: 'Ted Guan', role: 'Semantic Theorem Search' },
	{ name: 'Theo Meek', role: 'OpenMath, Geometric Measure Theory' },
	{ name: 'Tianshuo Wang', role: 'Algebraic Geometry' },
	{ name: 'Trey Adams', role: 'RL for Polynomials' },
	{ name: 'Veer Shukla', role: 'Provable Computation' },
	{ name: 'Xiaoxing Zhang', role: 'CayleyPy' },
	{ name: 'Xinyi Zhi', role: 'Algebraic Geometry' },
	{ name: 'Xinyue Fu', role: 'LLMs at Lean' },
	{ name: 'Xuanyu Yang', role: 'Geometric Invariant Theory' },
	{ name: 'Yiran Wang', role: 'Lean Error Correction, Semantic Theorem Search' },
	{ name: 'Zeyin Feng', role: 'Provable Computation' }
];

export const labPhotos: LabPhoto[] = [
	{ src: '/photos/fall2025.jpg', alt: 'Fall 2025 Math AI Lab', caption: 'Fall 2025 Math AI Lab' },
	{ src: '/photos/winter2025.jpg', alt: 'Winter 2025 Math AI Lab', caption: 'Winter 2025 Math AI Lab' },
	{ src: '/photos/lean-hackathon.jpg', alt: 'UW Lean Hackathon', caption: 'UW Lean Hackathon' },
	{ src: '/photos/iclr-2026.jpg', alt: 'ICLR 2026, Rio de Janeiro', caption: 'ICLR 2026, Rio de Janeiro' },
	{ src: '/photos/lean-hackathon-team.jpg', alt: 'UW Lean Hackathon team', caption: 'UW Lean Hackathon' }
];

export function initials(name: string) {
	const parts = name.split(/\s+/).filter(Boolean);
	return parts
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
}
