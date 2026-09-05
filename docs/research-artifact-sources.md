# Research artifact sources

Checked September 4, 2026. Edit cards in `src/content/research.yaml`.

The inventory comes from the [lab's GitHub profile](https://github.com/uw-math-ai/.github/blob/main/profile/README.md),
the [XLL archive](https://sites.math.washington.edu/~jarod/xll.html), the quarter YAML files,
and repository history. Linked repositories were checked for source files and READMEs.
These are project records, not a claim that every development is complete or builds today.

## Mathlib

Credit the PR author and explicit human coauthors, not the entire quarter roster.
For #4593, use the new file's `Authors` header, including collaborators outside UW.
Public GitHub profiles identify `ROTARTSI82` as Grant Yang and `tdwag123` as Theodore Meek.
The winter/spring 2026 algebraic-geometry rosters independently confirm Boehnke, Peykanu,
Viray, and Yang. Aristotle's contribution to #32824 and #32851 is credited in the descriptions;
#36421 also discloses Claude Code and Aristotle assistance in its PR body.

| PR | Human credits | Status/date |
| --- | --- | --- |
| [37527](https://github.com/leanprover-community/mathlib4/pull/37527) | Bryan Boehnke, George Peykanu, Bianca Viray, Grant Yang | Merged May 18, 2026 |
| [36421](https://github.com/leanprover-community/mathlib4/pull/36421) | Grant Yang, George Peykanu, Bryan Boehnke, Bianca Viray | Merged April 15, 2026 |
| [32851](https://github.com/leanprover-community/mathlib4/pull/32851) | Theodore Meek | Merged January 29, 2026 |
| [32824](https://github.com/leanprover-community/mathlib4/pull/32824) | Vasily Ilin, Leo Mayer | Merged December 24, 2025 |
| [29574](https://github.com/leanprover-community/mathlib4/pull/29574) | Jarod Alper, Brian Nugent | Open; submitted September 12, 2025 |
| [19886](https://github.com/leanprover-community/mathlib4/pull/19886) | Vasily Ilin, Siyuan Ge | Merged January 4, 2025 |
| [19896](https://github.com/leanprover-community/mathlib4/pull/19896) | Vasily Ilin, Siyuan Ge | Merged January 2, 2025 |
| [19798](https://github.com/leanprover-community/mathlib4/pull/19798) | Vasily Ilin, Siyuan Ge | Merged December 10, 2024 |
| [4593](https://github.com/leanprover-community/mathlib4/pull/4593) | Anne Baanen, Sam v. Gool, Leo Mayer, Brendan S. Murphy | Merged October 21, 2023 |

Merged entries use the Bors merge/closure year, not the submission year. Bors merges can
leave GitHub's native `merged_at` empty; the PRs are explicitly titled `[Merged by Bors]`.
Keep #29574 labeled **Open PR** unless upstream status changes.

## Archived projects

Project cards credit documented members and mentors; they are not paper author lists.
Dates identify the archived project period, not a release or completion date.

| Repository | Attribution/date evidence |
| --- | --- |
| [lean-polyhedral-geometry](https://github.com/uw-math-ai/lean-polyhedral-geometry) | Spring 2025 roster: Caelan Ritter, Freda Zhang, Seven Lewis, George Peykanu. The [UW department profile](https://math.washington.edu/people/freda-zhang) resolves the spring archive's Zheng typo. |
| [zariski_spaces](https://github.com/leomayer1/zariski_spaces) | README dates the project to Fall 2024; Winter 2025 names Leo Mayer and Maria Berova. |
| [LatexInLean](https://github.com/kcaze/LatexInLean) | README describes the widget; sole repository contributor `kcaze` is Herman Chau; repository created in 2024. |
| [generating-functions](https://github.com/kcaze/generating-functions) | Fall 2024 roster and sole repository contributor Herman Chau; source modules cover Fibonacci, Catalan, and powers of two. |
| [FRACTRAN](https://github.com/sanchace/FRACTRAN) | Winter 2024 roster: Vasily Ilin, Alexander Sanchez, Mitchell Levy; README distinguishes implementation from research goals. |
| [cont_frac](https://github.com/leomayer1/cont_frac) | Fall 2023 and Winter 2024 rosters: Xinyan Li, Leopold/Leo Mayer, Christie Yang. |
| [FormalizingMATH300](https://github.com/StevennZZZ/FormalizingMATH300) | Union of Fall 2023 and Winter 2024 project rosters; Zilu (Luca) Li's full name appears in the Fall 2023 quarter roster. |
| [random_graphs](https://github.com/uw-math-ai/random_graphs) | Fall 2023 project roster; redirected from `Vilin97/random_graphs`. Herman Chau's public profile resolves the archive's Hermann spelling. |
| [linear-algebra-done-right](https://github.com/Vilin97/linear-algebra-done-right) | Repository created in 2022; contributors Vasily Ilin and Leo Mayer; README specifies Axler's third edition. |
| [Hopf](https://github.com/leomayer1/Hopf) | Repository created in 2022; contributors Leo Mayer and Vasily Ilin; source tree includes Hopf algebras, comodules, and affine group schemes. |
| [WXML_Sp2022](https://github.com/leomayer1/WXML_Sp2022) | Spring 2022 record explicitly reports the Hilbert proof and names five students, faculty mentor Jarod Alper, and graduate mentors Vasily Ilin and Leopold Mayer. |

Do not infer completed theorems from quarter goals. Do not count artifacts as papers.
The CLT, GMT, and regular-local-ring repositories are represented by their upstream PRs
instead of duplicate cards. The mixed LLL archive and other profile links are not an
exhaustive publication list; add further cards only with a specific artifact and supported credits.
