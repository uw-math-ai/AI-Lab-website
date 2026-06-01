export type LeanSnippet = {
	code: string;
	sourceLabel: string;
	sourceUrl: string;
};

const spring2022Acc = `theorem ACC_iff_all_ideals_fg (R) [comm_ring R] : ACC R ↔ all_ideals_fg R :=
begin
  constructor,
  { intros h I,
    by_contra h',
    have asc := ascending_chain_of_generators_in_not_fg_ideal I h',
    have := h (ascending_chain_of_ideals_in_not_fg_ideal I h') _,
    { cases this with N H,
      specialize H (N + 1) (by linarith),
      dsimp [ascending_chain_of_ideals_in_not_fg_ideal] at H,`;

const cltSnippet = `theorem mgf_of_iid
{Y : ℕ → Ω → ℝ}
{Z : ℕ → Ω → ℝ}
(h_meas : ∀ (i : ℕ), Measurable (Y i))
(h_indep : ProbabilityTheory.iIndepFun (fun (i : ℕ) => inferInstance) Y μ)
(hident : ∀ (i j : ℕ), ProbabilityTheory.IdentDistrib (Y i) (Y j) μ μ)
(Z_def : ∀ n : ℕ, Z n = (Real.sqrt n)⁻¹ • (∑ i ∈ Finset.range n, Y i)) :
  ∀ n : ℕ, n > 0 →
    ∀ t : ℝ, mgf (Z n) μ t = (mgf (Y 0) μ ((√n)⁻¹ * t)) ^ n := by
  intro n hn t
  rw [Z_def]
  rw [ProbabilityTheory.mgf_smul_left]`;

const luSnippet = `theorem Matrix.luFactorization_reconstruct
    (M : Matrix (Fin a) (Fin b) R) :
    let lu := Matrix.luFactorization M
    lu.P * lu.L * lu.U = M := by
  simpa [Matrix.luFactorization] using
    LUFactorizationInternal.rawFactorization_reconstruct (R := R) (M := M)

theorem Matrix.luFactorization_upper_isEchelonForm
    (M : Matrix (Fin a) (Fin b) R) :
    IsEchelonForm (M := (Matrix.luFactorization M).U) := by`;

const cltSource = {
	sourceLabel: 'uw-math-ai/central_limit_theorem, CentralLimitTheorem/main.lean',
	sourceUrl: 'https://github.com/uw-math-ai/central_limit_theorem/blob/master/CentralLimitTheorem/main.lean#L102-L122'
};

const provableComputationSource = {
	sourceLabel: 'uw-math-ai/provable_computation, LU/Correctness.lean',
	sourceUrl:
		'https://github.com/uw-math-ai/provable_computation/blob/main/ProvableComputation/LinearAlgebra/LU/Correctness.lean#L1198-L1216'
};

export const firstProjectLeanSnippet: LeanSnippet = {
	code: spring2022Acc,
	sourceLabel: 'leomayer1/WXML_Sp2022, src/alex_Noetherian.lean',
	sourceUrl: 'https://github.com/leomayer1/WXML_Sp2022/blob/master/src/alex_Noetherian.lean#L84-L99'
};

export const projectIndexLeanSnippet: LeanSnippet = {
	code: spring2022Acc,
	sourceLabel: 'leomayer1/WXML_Sp2022, src/alex_Noetherian.lean',
	sourceUrl: 'https://github.com/leomayer1/WXML_Sp2022/blob/master/src/alex_Noetherian.lean#L84-L99'
};

export const eventsLeanSnippet: LeanSnippet = {
	code: cltSnippet,
	...cltSource
};

export const resourcesLeanSnippet: LeanSnippet = {
	code: luSnippet,
	...provableComputationSource
};

export function leanSnippetForQuarter(slug: string) {
	if (slug === 'spring-2026') {
		return {
			code: cltSnippet,
			...cltSource
		};
	}
	if (slug === 'winter-2026') {
		return {
			code: cltSnippet,
			...cltSource
		};
	}
	return {
		code: cltSnippet,
		...cltSource
	};
}
