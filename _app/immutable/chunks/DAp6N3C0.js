import{a as u,f as h}from"./CO4MkgjQ.js";import{aL as b,b9 as d,aI as f,b1 as g,W as a,aQ as r}from"./pvBJVa5d.js";import{s as _}from"./CZMTnMqI.js";import{s as L}from"./CwUe3nIn.js";var M=h('<div class="code-panel"><pre><code> </code></pre> <a class="snippet-source" target="_blank" rel="noreferrer"> </a></div>');function w(e,t){b(t,!0);var o=M(),s=a(o),l=a(s),m=a(l,!0);r(l),r(s);var c=g(s,2),p=a(c);r(c),r(o),d(()=>{_(m,t.snippet.code),L(c,"href",t.snippet.sourceUrl),_(p,`Source: ${t.snippet.sourceLabel??""}`)}),u(e,o),f()}const v=`theorem ACC_iff_all_ideals_fg (R) [comm_ring R] : ACC R ↔ all_ideals_fg R :=
begin
  constructor,
  { intros h I,
    by_contra h',
    have asc := ascending_chain_of_generators_in_not_fg_ideal I h',
    have := h (ascending_chain_of_ideals_in_not_fg_ideal I h') _,
    { cases this with N H,
      specialize H (N + 1) (by linarith),
      dsimp [ascending_chain_of_ideals_in_not_fg_ideal] at H,`,i=`theorem mgf_of_iid
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
  rw [ProbabilityTheory.mgf_smul_left]`,F=`theorem Matrix.luFactorization_reconstruct
    (M : Matrix (Fin a) (Fin b) R) :
    let lu := Matrix.luFactorization M
    lu.P * lu.L * lu.U = M := by
  simpa [Matrix.luFactorization] using
    LUFactorizationInternal.rawFactorization_reconstruct (R := R) (M := M)

theorem Matrix.luFactorization_upper_isEchelonForm
    (M : Matrix (Fin a) (Fin b) R) :
    IsEchelonForm (M := (Matrix.luFactorization M).U) := by`,n={sourceLabel:"uw-math-ai/central_limit_theorem, CentralLimitTheorem/main.lean",sourceUrl:"https://github.com/uw-math-ai/central_limit_theorem/blob/master/CentralLimitTheorem/main.lean#L102-L122"},x={sourceLabel:"uw-math-ai/provable_computation, LU/Correctness.lean",sourceUrl:"https://github.com/uw-math-ai/provable_computation/blob/main/ProvableComputation/LinearAlgebra/LU/Correctness.lean#L1198-L1216"},R={code:v,sourceLabel:"leomayer1/WXML_Sp2022, src/alex_Noetherian.lean",sourceUrl:"https://github.com/leomayer1/WXML_Sp2022/blob/master/src/alex_Noetherian.lean#L84-L99"},U={code:i,...n},z={code:F,...x};function Y(e){return e==="spring-2026"?{code:i,...n}:e==="winter-2026"?{code:i,...n}:{code:i,...n}}export{w as C,U as e,Y as l,R as p,z as r};
