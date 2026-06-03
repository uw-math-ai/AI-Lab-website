import spring2026 from '$lib/legacy-html/spring2026.html?raw';
import winter2026 from '$lib/legacy-html/winter2026.html?raw';
import fall2025 from '$lib/legacy-html/fall2025.html?raw';
import spring2025 from '$lib/legacy-html/spring2025.html?raw';
import winter2025 from '$lib/legacy-html/winter2025.html?raw';
import fall2024 from '$lib/legacy-html/fall2024.html?raw';
import winter2024 from '$lib/legacy-html/winter2024.html?raw';
import fall2023 from '$lib/legacy-html/fall2023.html?raw';
import spring2023 from '$lib/legacy-html/spring2023.html?raw';
import winter2023 from '$lib/legacy-html/winter2023.html?raw';
import fall2022 from '$lib/legacy-html/fall2022.html?raw';
import spring2022 from '$lib/legacy-html/spring2022.html?raw';

export type ProjectQuarter = {
	slug: string;
	legacyFile: string;
	label: string;
	term: string;
	year: number;
	status: 'current' | 'recent' | 'archive';
	venue?: string;
	summary: string;
	html: string;
};

export const totalProjectCount = 59;

export const projectQuarters: ProjectQuarter[] = [
	{
		slug: 'spring-2026',
		legacyFile: 'spring2026.html',
		label: 'Spring 2026',
		term: 'Spring',
		year: 2026,
		status: 'current',
		venue: 'Odegaard 136',
		summary: 'Current Math AI Lab projects, including autoformalization, Lean infrastructure, and AI for mathematics.',
		html: spring2026
	},
	{
		slug: 'winter-2026',
		legacyFile: 'winter2026.html',
		label: 'Winter 2026',
		term: 'Winter',
		year: 2026,
		status: 'recent',
		venue: 'Denny Hall 303 / CMU B-006',
		summary: 'Formalization projects, AI projects, and Lean Together meetings from Winter 2026.',
		html: winter2026
	},
	{
		slug: 'fall-2025',
		legacyFile: 'fall2025.html',
		label: 'Fall 2025',
		term: 'Fall',
		year: 2025,
		status: 'recent',
		venue: 'OUG 136',
		summary: 'Fall 2025 project teams across Lean formalization, theorem search, number theory, quantum compilation, and more.',
		html: fall2025
	},
	{
		slug: 'spring-2025',
		legacyFile: 'spring2025.html',
		label: 'Spring 2025',
		term: 'Spring',
		year: 2025,
		status: 'archive',
		summary: 'Undergraduate research projects, Math 480 final projects, and algebraic geometry formalization work.',
		html: spring2025
	},
	{
		slug: 'winter-2025',
		legacyFile: 'winter2025.html',
		label: 'Winter 2025',
		term: 'Winter',
		year: 2025,
		status: 'archive',
		summary: 'Winter 2025 formalization, metaprogramming, reinforcement learning, and neural theorem proving projects.',
		html: winter2025
	},
	{
		slug: 'fall-2024',
		legacyFile: 'fall2024.html',
		label: 'Fall 2024',
		term: 'Fall',
		year: 2024,
		status: 'archive',
		summary: 'Formalizing examples, tactics, generating functions, CLT, and topology for algebraic geometry.',
		html: fall2024
	},
	{
		slug: 'winter-2024',
		legacyFile: 'winter2024.html',
		label: 'Winter 2024',
		term: 'Winter',
		year: 2024,
		status: 'archive',
		summary: 'FRACTRAN, continued fractions, cancellation theorems, and Math 300 formalization work.',
		html: winter2024
	},
	{
		slug: 'fall-2023',
		legacyFile: 'fall2023.html',
		label: 'Fall 2023',
		term: 'Fall',
		year: 2023,
		status: 'archive',
		summary: 'Continued fractions, Witt cancellation, random graphs, and Math 300 projects.',
		html: fall2023
	},
	{
		slug: 'spring-2023',
		legacyFile: 'spring2023.html',
		label: 'Spring 2023',
		term: 'Spring',
		year: 2023,
		status: 'archive',
		summary: 'Spring 2023 Lean formalization projects and student participants.',
		html: spring2023
	},
	{
		slug: 'winter-2023',
		legacyFile: 'winter2023.html',
		label: 'Winter 2023',
		term: 'Winter',
		year: 2023,
		status: 'archive',
		summary: 'Fibonacci identities, group theory, topology, and commutative algebra projects.',
		html: winter2023
	},
	{
		slug: 'fall-2022',
		legacyFile: 'fall2022.html',
		label: 'Fall 2022',
		term: 'Fall',
		year: 2022,
		status: 'archive',
		summary: 'Fall 2022 undergraduate research projects run through WXML.',
		html: fall2022
	},
	{
		slug: 'spring-2022',
		legacyFile: 'spring2022.html',
		label: 'Spring 2022',
		term: 'Spring',
		year: 2022,
		status: 'archive',
		summary: 'The early XLL-era project archive.',
		html: spring2022
	}
];

export const projectRedirects = new Map(projectQuarters.map((quarter) => [quarter.legacyFile, `/projects/${quarter.slug}`]));

export function getProjectQuarter(slug: string) {
	return projectQuarters.find((quarter) => quarter.slug === slug);
}
