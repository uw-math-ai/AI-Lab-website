const i=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring 2026 Projects</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>

<body>
  <header>
    <img src="logo2.jpg" alt="AI UW Logo" class="header-logo" />
  </header>

  <nav>
    <ul>
      <li><a href="http://ai.math.uw.edu/">Home</a></li>
      <li class="dropdown">
        <a class="dropbtn">Projects</a>
        <div class="dropdown-content">
          <a href="spring2026.html">Spring 2026</a>
          <a href="winter2026.html">Winter 2026</a>
          <a href="fall2025.html">Fall 2025</a>
          <a href="spring2025.html">Spring 2025</a>
          <a href="winter2025.html">Winter 2025</a>
          <a href="fall2024.html">Fall 2024</a>
          <a href="winter2024.html">Winter 2024</a>
          <a href="fall2023.html">Fall 2023</a>
          <a href="spring2023.html">Spring 2023</a>
          <a href="winter2023.html">Winter 2023</a>
          <a href="fall2022.html">Fall 2022</a>
          <a href="spring2022.html">Spring 2022</a>
        </div>
      </li>
      <li><a href="resources.html">Resources</a></li>
      <li><a href="courses.html">Courses</a></li>
      <li><a href="seminars.html">Seminars</a></li>
      <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
      <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
              class="support-btn" target="_blank">Support Us</a></li>
    </ul>
  </nav>

  <section>
    <h1>Spring 2026 Math AI Lab Projects</h1>

    <p>
      Project teams meet Mondays and Wednesdays from 4–5:30 pm in Odegaard 136.
    </p>

    <p>
      The goal of projects is a <b>publication</b> or a <b>significant open-source contribution</b>, e.g. to
      <a href="https://github.com/leanprover-community/mathlib4">mathlib4</a>.
      Students are expected to commit at least 5 hours per week to their project outside of meeting times.
    </p>

    <h2>Autoformalization Projects</h2>

    <p>
      The goal of autoformalization projects is to use Lean-specific AI assistants such as Harmonic’s
      <a href="https://aristotle.harmonic.fun/">Aristotle</a>
      to formalize large chunks of mathematics, and contribute to
      <a href="https://github.com/leanprover-community/mathlib4">mathlib4</a>.
    </p>

    <h3>OpenMath: autoformalizing undergraduate textbooks</h3>
    <ul>
      <li><b>Project Leader:</b> Vasily Ilin</li>
      <li>
        <b>Description:</b>
        Most undergraduate mathematics is present in
        <a href="https://leanprover-community.github.io/mathlib4_docs/">mathlib</a>, but several big gaps remain:
        differential geometry, partial differential equations, numerical analysis. We will autoformalize undergraduate
        textbooks on numerical analysis of differential equations, starting with Iserles’s
        <em>A First Course in the Numerical Analysis of Differential Equations</em> and Butcher’s
        <em>Numerical Methods for Ordinary Differential Equations</em>. Since manual formalization is time-consuming,
        we will build a semi-autonomous AI agent along the way, automating more of the process as the project
        progresses. <b>Goal:</b> workshop paper at the
        <a href="https://ai4math2026.github.io/">AI for Math workshop</a> at ICML 2026 (deadline May 25).
      </li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/OpenMath">GitHub repo</a></li>
      <li><b>Members:</b> Vasily Ilin, Theo Meek, Siyuan Ge, Saumi Joshi, Di Qiu Xiang</li>
      <li><b>Prerequisites:</b> Lean, undergraduate analysis</li>
    </ul>

    <h3>Geometric Invariant Theory (GIT)</h3>
    <ul>
      <li><b>Project Leaders:</b> Arkamouli Debnath, Giovanni Inchiostro, Leo Mayer</li>
      <li>
        <b>Description:</b>
        Geometric Invariant Theory (GIT) is the theory of taking quotients in algebraic geometry. At present,
        there is almost no formalization of GIT in Lean on mathlib, and this presents the unique opportunity to
        contribute in two different directions as follows:
        <ol>
          <li>
            <b>Commutative algebra:</b> Our main goal is to formalize the definition of a linearly reductive
            group and prove the theorem: "If a linearly reductive group <em>G</em> acts locally finitely on a
            finitely generated <em>k</em>-algebra <em>R</em>, then the invariant ring <em>R<sup>G</sup></em> is
            a finitely generated <em>k</em>-algebra." The fact that a finite group is linearly reductive
            (Maschke's theorem) is already in mathlib, and that proof uses the existence of a "Reynolds
            operator". As part of this formalization project, we define a Reynolds operator and prove its
            existence (in Lean) for any linearly reductive group.
          </li>
          <li>
            <b>Geometry:</b> The main content of GIT is to define a "good quotient". We aim to formalize the
            definition.
          </li>
        </ol>
      </li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/Formalizing-geometric-invariant-theory-GIT-">GitHub repo</a></li>
      <li><b>Members:</b> Xuanyu Yang, Emily Meng, Bohan Zhao, Jacob Boyce</li>
      <li><b>Prerequisites:</b> Lean, commutative algebra or algebraic geometry</li>
    </ul>

    <h3>JAX in Lean</h3>
    <ul>
      <li><b>Project Leader:</b> Samuel Ainsworth</li>
      <li>
        <b>Description:</b>
        The goal is to build a verified API for JAX in Lean.
      </li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/porcupine-hangover">GitHub repo</a></li>
      <li><b>Members:</b> Jeremy Ma</li>
      <li><b>Prerequisites:</b> Lean, JAX or similar autodiff framework</li>
    </ul>

    <h3>Geometric Measure Theory</h3>
    <ul>
      <li><b>Project Leader:</b> Ignacio Tejeda</li>
      <li><b>Formalization target:</b> Theorem 4.2 in Falconer’s <em>Geometry of Fractal Sets</em>.</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/FormalizingGMT">GitHub repo</a></li>
      <li>
        <b>Mathlib PRs:</b>
        <a href="https://github.com/leanprover-community/mathlib4/pull/32824">1</a>,
        <a href="https://github.com/leanprover-community/mathlib4/pull/32851">2</a>
      </li>
      <li><b>Members:</b> Theo Meek, Nathan Pao, Annie Cao, Josh</li>
      <li><b>Prerequisites:</b> Lean</li>
    </ul>

    <h3>Commutative Algebra: Auslander–Buchsbaum</h3>
    <ul>
      <li><b>Project Leaders:</b> Haoming Ning and Leo Mayer</li>
      <li>
        <b>Formalization target:</b>
        The theorem that a regular local ring is a UFD, referred by some as the Auslander–Buchsbaum theorem.
        See Stacks Project <a href="https://stacks.math.columbia.edu/tag/0AG0">0AG0</a>.
      </li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/auslander-buchsbaum">GitHub repo</a></li>
      <li><b>Members:</b> Nailin Guan, Dora Kassabova</li>
      <li><b>Prerequisites:</b> Lean</li>
    </ul>

    <h3>Algebraic Geometry</h3>
    <ul>
      <li><b>Project Leaders:</b> Bianca Viray and Bryan Boehnke</li>
      <li>
        <b>Formalization target:</b>
        Monogenic extensions of regular local rings following
        <a href="https://arxiv.org/abs/2503.07846">arXiv:2503.07846</a>, lemmas 3.1 and 3.2.
      </li>
      <li><b>Members:</b> George Peykanu, Grant Yang</li>
      <li><b>Prerequisites:</b> Lean</li>
    </ul>

    <h3>Formalization: zero-knowledge proofs</h3>
    <ul>
      <li><b>Project Leaders:</b> Eric Klavins and Alexandra Aiello</li>
      <li>
        <b>Description:</b>
        We would outline a framework for verifying mathematical theorems while keeping the respective proofs secret by
        leveraging dependent combinatory logic as a host language for Zero-Knowledge (ZK) proof circuits. Specifically,
        we would interpret the axioms of the dependent SK combinator calculus as a universal ZK circuit capable of
        checking mathematical proofs encodeable in the calculus. We would target ZK-STARKs as our ideal ZK scheme,
        enabling quantum resistance of the proofs without trusted setup [Ben+18]. This would be a first-of-its kind
        result, with wide applications. <b>Goal:</b> publication
      </li>
      <li><b>Prerequisites:</b> Lean, type theory</li>
    </ul>

    <h3>Metaprogramming: Provable Computation in Lean</h3>
    <ul>
      <li><b>Project Leader:</b> Dhruv Bhatia</li>
      <li>
        <b>Description:</b>
        While Lean has seen extensive use as a theorem-proving assistant, its capabilities as a computational programming
        language have been underutilized. The goal of this project is to begin filling that gap. Along the way, we will
        learn the basics of functional programming, monads, and Lean’s metaprogramming framework to implement algorithms
        that can both be run efficiently and be reasoned about. Our main goal is to implement basic algorithms with
        applications to linear algebra while also proving (in Lean) correctness of said algorithms.
      </li>
      <li><b>Members:</b> Joseph Qian, Junye Ji, Veer Shukla, Alan Chang</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/provable_computation">GitHub repo</a></li>
    </ul>

    <h2>AI Projects</h2>

    <p>
      The goal of AI projects is to use AI and ML to advance mathematical research. For example, by helping
      mathematicians find relevant theorems, or by training models to learn mathematical functions or by creating
      math-specific datasets or models. AI projects are expected to result in a publication in a submission to a major
      ML conference such as ICML, ICLR, EMNLP or Neurips.
    </p>

    <h3>LeanGCD: stabilizing Lean generation</h3>
    <ul>
      <li><b>Project Leaders:</b> Dean Light and Michael Theologitis</li>
      <li>
        <b>Description:</b>
        LeanGCD aims to improve Lean proof generation by frontier large language models using inference-time
        stabilization methods rather than retraining. The project adapts
        <a href="https://arxiv.org/abs/2305.13971">grammar-constrained decoding techniques</a> with Lean’s
        <a href="https://lean-lang.org/doc/reference/latest/Notations-and-Macros/Defining-New-Syntax/">syntax extensions</a>.
        Planned contributions: a Lean-specific GCD implementation that plugs into HuggingFace/vLLM inference pipelines,
        and empirical evaluation on MiniF2F, ProverBench, and PutnamBench.
        <b>Goal:</b> ICML 2026 (October) or 2027 (January).
      </li>
      <li><b>Code:</b> <a href="https://github.com/DeanLight/LeanGCD">GitHub repo</a></li>
      <li><b>Members:</b> Evan Wang, Ben Bioren, Naren Prabhu, Nhan Pham</li>
      <li><b>Prerequisites:</b> Python, ML / LLM inference experience</li>
    </ul>

    <h3>Mathematician's copilot: Semantic Theorem Search</h3>
    <ul>
      <li><b>Project Leaders:</b> Giovanni Inchiostro and Vasily Ilin</li>
      <li>
        <b>Description:</b>
        We help research mathematicians find relevant theorems quickly. We collected the dataset of all theorems on
        ArXiv, Stacks Project and other sources, and built vectorized search over it. Goal: submit to ICML 2026 in
        January.
      </li>
      <li><b>Demo:</b> <a href="https://huggingface.co/spaces/uw-math-ai/theorem-search">HF link</a></li>
      <li><b>Members:</b> Eric Leonen, Sophie Szeto, Artemii Remizov, Luke Alexander</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/TheoremSearch">GitHub repo</a></li>
    </ul>

    <h3>Mathematician's copilot: Math2Vec</h3>
    <ul>
      <li><b>Project Leader:</b> Henry Kvinge (PNNL)</li>
      <li><b>Members:</b> Saharsh Bhargava, Michael Cecilia, Jiahe Lu, Kedar Chintalapati, Rachit Jaiswal, Samarth Rao, Jared Darlington, Leo Carlin</li>
      <li>
        <b>Description:</b>
        Train a text embedder that understands math, LaTeX and Lean. This will improve search over Lean, and natural
        language theorem search. It can be used for RAG as well. Use arXiv, MathOverflow, mathlib, Lean Reservoir, and
        possibly other sources. Create an evaluation benchmark as well. Goal: submit to EMNLP 2026 in May.
      </li>
    </ul>

    <h3>CayleyPy: search on massive combinatorial graphs</h3>
    <ul>
      <li><b>Project Leaders:</b> Michael R. Zeng, Junaid Hasan, Vasily Ilin</li>
      <li>
        <b>Description:</b>
        Optimize <a href="https://github.com/cayleypy/cayleypy">CayleyPy</a>, make a CLI, and use it on various combinatorial problems, such as estimating diameters of symmetric groups. Goal: submission to ICLR 2027 in September. See <a href="https://docs.google.com/document/d/1CkM2QaZUbJAflKCdj3qvHQaeTi0mSsUuhzZNSp17k08/edit?usp=sharing">project proposal document</a>.
      </li>
      <li><b>Continuation:</b> Continued through Spring 2026.</li>
      <li><b>Members:</b> Merav Frank, Sambhu Ganesan,Gaurang Pendharkar, Rithikesh Muddana, Danny Zhang </li>
      <li><b>Prerequisites:</b> solid Python, some group theory or combinatorics.</li>
    </ul>

    <h3>Mechanistic Interpretability beyond Groups</h3>
    <ul>
      <li><b>Project Leader:</b> Junaid Hasan </li>
      <li>
        <b>Description:</b>
        Transformers can learn modular arithmetic, but prior mechanistic work focused on invertible operations like
        cyclic addition and group composition: cases with clean, global algebraic structure. Modular multiplication over
        composite moduli (a monoid) breaks this: zero-divisors make the operation non-invertible, and no single global
        representation space suffices. The authors show that transformers handle this by partitioning inputs into local
        hierarchical regions where group-like structure is preserved, enabling localized Fourier mechanisms.
      </li>
      <li><b>Members:</b> Andrew (Zitong) Chen, Akhil Srinivasan, Hemkesh Bandi</li>
      <li><b>Paper:</b> <a href="https://junaidhasan.com/assets/interpreting-monoids.pdf">Draft PDF</a></li>
    </ul>

    <h3>Reinforcement Learning for Polynomials</h3>
    <ul>
      <li><b>Project Leader:</b> Michael R. Zeng, Jarod Alper</li>
      <li><b>Description:</b> Use RL to find efficient arithmetic circuits for polynomials.</li>
      <li><b>Continuation:</b> Continued through Spring 2026.</li>
      <li><b>Paper:</b> <a href="https://arxiv.org/abs/2603.17075">CircuitBuilder: From Polynomials to Circuits via Reinforcement Learning</a></li>
      <li><b>Members:</b> Kyle Zhang, Rohan Pandey, Kaijie Jin, Naomi Morato, Archit Ganapule, Bhaumik Mehta</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/PolyArithmeticCircuitsRL">GitHub repo</a></li>
    </ul>

    <h3>AI for Quantum Code Compilation</h3>
    <ul>
      <li><b>Project Leader:</b> Andres Paz</li>
      <li>
        <b>Description:</b>
        Quantum error correction (QEC) codes are traditionally described using stabilizers, which define the subspace
        preserved by the code. However, implementing these codes requires translating stabilizers into fault-tolerant
        quantum circuits—an inherently nontrivial task that depends on the constraints and capabilities of the
        underlying hardware architecture.
        <br /><br />
        This project aims to develop an AI agent capable of synthesizing such circuits in a way that:
        <ol>
          <li>
            In the ideal (noiseless) setting, the resulting circuits implement the intended stabilizer structure of the
            code on the target architecture.
          </li>
          <li>
            In the noisy setting, the agent searches over circuit variations to optimize fidelity, taking into account
            realistic noise models and architectural constraints.
          </li>
        </ol>
        The outcome would be a toolchain bridging the gap between abstract QEC code design and concrete, high-performance
        circuit implementations, enabling better exploration of architecture-specific tradeoffs in fault-tolerant quantum
        computing.
      </li>
      <li><b>Members:</b> Christian Tarta, Sylvie Lausier, Mayee Sun, Sarju Patel</li>
    </ul>

    <h3>How good are LLMs at Lean?</h3>
    <ul>
      <li><b>Project Leader:</b> Tyson Klingner</li>
      <li>
        <b>Description:</b>
        Design an evaluation procedure for various Lean tasks such as next step generation or entire proof generation.
        Run our algorithms on frontier models to see which LLMs perform the best, providing guidance to the Lean
        community on which LLMs to use. Use a scalable architecture so that our algorithms can be rerun when new models
        are released.
      </li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/LLMsLean">GitHub repo</a></li>
      <li><b>Members:</b> Escher Crawford, Drew Bladek</li>
    </ul>
  </section>

  <footer>
    <p>Department of Mathematics, University of Washington ©2026</p>
  </footer>
</body>
</html>
`,t=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Winter 2026 Projects</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>

<body>
  <header>
    <img src="logo2.jpg" alt="AI UW Logo" class="header-logo" />
  </header>

  <nav>
    <ul>
      <li><a href="http://ai.math.uw.edu/">Home</a></li>
      <li class="dropdown">
        <a class="dropbtn">Projects</a>
        <div class="dropdown-content">
          <a href="spring2026.html">Spring 2026</a>
          <a href="winter2026.html">Winter 2026</a>
          <a href="fall2025.html">Fall 2025</a>
          <a href="spring2025.html">Spring 2025</a>
          <a href="winter2025.html">Winter 2025</a>
          <a href="fall2024.html">Fall 2024</a>
          <a href="winter2024.html">Winter 2024</a>
          <a href="fall2023.html">Fall 2023</a>
          <a href="spring2023.html">Spring 2023</a>
          <a href="winter2023.html">Winter 2023</a>
          <a href="fall2022.html">Fall 2022</a>
          <a href="spring2022.html">Spring 2022</a>
        </div>
      </li>
      <li><a href="resources.html">Resources</a></li>
      <li><a href="courses.html">Courses</a></li>
      <li><a href="seminars.html">Seminars</a></li>
      <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
      <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
              class="support-btn" target="_blank">Support Us</a></li>
    </ul>
  </nav>

  <section>
    <h1>Winter 2026 Math AI Lab Projects</h1>

    <p>
      Project teams meet Mondays and Wednesdays from 4–5:30 pm in Denny Hall 303.<br />
      Lean Together meets Fridays 3:30–6 pm in CMU B-006.
    </p>

    <p>
      The goal of projects is a <b>publication</b> or a <b>significant open-source contribution</b>, e.g. to
      <a href="https://github.com/leanprover-community/mathlib4">mathlib4</a>.
      Students are expected to commit at least 5 hours per week to their project outside of meeting times.
    </p>

    <h2>Autoformalization Projects</h2>

    <p>
      The goal of autoformalization projects is to use Lean-specific AI assistants such as Harmonic’s
      <a href="https://aristotle.harmonic.fun/">Aristotle</a>
      to formalize large chunks of mathematics, and contribute to
      <a href="https://github.com/leanprover-community/mathlib4">mathlib4</a>.
    </p>

    <h3>Geometric Measure Theory</h3>
    <ul>
      <li><b>Project Leader:</b> Ignacio Tejeda</li>
      <li><b>Formalization target:</b> Theorem 4.2 in Falconer’s <em>Geometry of Fractal Sets</em>.</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/FormalizingGMT">GitHub repo</a></li>
      <li>
        <b>Mathlib PRs:</b>
        <a href="https://github.com/leanprover-community/mathlib4/pull/32824">1</a>,
        <a href="https://github.com/leanprover-community/mathlib4/pull/32851">2</a>
      </li>
      <li><b>Members:</b> Theo Meek, Nathan Pao, Annie Cao, Josh</li>
      <li><b>Prerequisites:</b> Lean</li>
    </ul>

    <h3>Commutative Algebra</h3>
    <ul>
      <li><b>Project Leaders:</b> Haoming Ning and Leo Mayer</li>
      <li>
        <b>Formalization target:</b>
        The theorem that a regular local ring is a UFD, referred by some as the Auslander-Buchsbaum theorem.
        See Stacks Project <a href="https://stacks.math.columbia.edu/tag/0AG0">0AG0</a>.
      </li>
      <li><b>Members:</b> Nailin Guan, Dora Kassabova</li>
      <li><b>Prerequisites:</b> Lean</li>
    </ul>

    <h3>Algebraic Geometry</h3>
    <ul>
      <li><b>Project Leaders:</b> Bianca Viray and Bryan Boehnke</li>
      <li>
        <b>Formalization target:</b>
        Monogenic extensions of regular local rings following
        <a href="https://arxiv.org/abs/2503.07846">arXiv:2503.07846</a>, lemmas 3.1 and 3.2.
      </li>
      <li><b>Members:</b> George Peykanu, Grant Yang</li>
      <li><b>Prerequisites:</b> Lean</li>
    </ul>

    <h3>Category Theory</h3>
    <ul>
      <li><b>Project Leader:</b> Nelson Niu</li>
      <li><b>Formalization target:</b> Nelson Niu &amp; David Spivak’s Polynomial Functors <a href="https://toposinstitute.github.io/poly/poly-book.pdf">textbook</a>.</li>
      <li><b>Members:</b> Sukhman Singh</li>
      <li><b>Prerequisites:</b> Lean</li>
    </ul>

    <h3>Formalization: zero-knowledge proofs</h3>
    <ul>
      <li><b>Project Leaders:</b> Eric Klavins and Alexandra Aiello</li>
      <li>
        <b>Description:</b>
        We would outline a framework for verifying mathematical theorems while keeping the respective proofs secret by
        leveraging dependent combinatory logic as a host language for Zero-Knowledge (ZK) proof circuits. Specifically,
        we would interpret the axioms of the dependent SK combinator calculus as a universal ZK circuit capable of
        checking mathematical proofs encodeable in the calculus. We would target ZK-STARKs as our ideal ZK scheme,
        enabling quantum resistance of the proofs without trusted setup [Ben+18]. This would be a first-of-its kind
        result, with wide applications. <b>Goal:</b> publication
      </li>
      <li><b>Prerequisites:</b> Lean, type theory</li>
    </ul>

    <h3>Metaprogramming: Provable Computation in Lean</h3>
    <ul>
      <li><b>Project Leader:</b> Dhruv Bhatia</li>
      <li>
        <b>Description:</b>
        While Lean has seen extensive use as a theorem-proving assistant, its capabilities as a computational programming
        language have been underutilized. The goal of this project is to begin filling that gap. Along the way, we will
        learn the basics of functional programming, monads, and Lean’s metaprogramming framework to implement algorithms
        that can both be run efficiently and be reasoned about. Our main goal is to implement basic algorithms with
        applications to linear algebra while also proving (in Lean) correctness of said algorithms.
      </li>
      <li><b>Members:</b> Joseph Qian, Junye Ji, Veer Shukla, Alan Chang</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/provable_computation">GitHub repo</a></li>
    </ul>

    <h2>AI Projects</h2>

    <p>
      The goal of AI projects is to use AI and ML to advance mathematical research. For example, by helping
      mathematicians find relevant theorems, or by training models to learn mathematical functions or by creating
      math-specific datasets or models. AI projects are expected to result in a publication in a submission to a major
      ML conference such as ICML, ICLR, EMNLP or Neurips.
    </p>

    <h3>Lean error correction with LLMs</h3>
    <ul>
      <li><b>Project Leader:</b> Vasily Ilin</li>
      <li>
        <b>Description:</b>
        Fine-tune LLMs to correct Lean errors, using compiler feedback. Create a diverse dataset of errors and train on
        it. Submit to ICML 2026 in January.
      </li>
      <li><b>Members:</b> Evan Wang, Simon Chess, Daniel Lee, Siyuan Ge, Ajit Mallavarapu</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/lean-error-correction">GitHub repo</a></li>
    </ul>

    <h3>Mathematician's copilot: Semantic Theorem Search</h3>
    <ul>
      <li><b>Project Leaders:</b> Giovanni Inchiostro and Vasily Ilin</li>
      <li>
        <b>Description:</b>
        We help research mathematicians find relevant theorems quickly. We collected the dataset of all theorems on
        ArXiv, Stacks Project and other sources, and built vectorized search over it. Goal: submit to ICML 2026 in
        January.
      </li>
      <li><b>Demo:</b> <a href="https://huggingface.co/spaces/uw-math-ai/theorem-search">HF link</a></li>
      <li><b>Members:</b> Eric Leonen, Sophie Szeto, Artemii Remizov, Luke Alexander</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/TheoremSearch">GitHub repo</a></li>
    </ul>

    <h3>Mathematician's copilot: Math2Vec</h3>
    <ul>
      <li><b>Project Leader:</b> Henry Kvinge (PNNL)</li>
      <li><b>Members:</b> Saharsh Bhargava, Cecilia, Jiahe Lu, Michael, Kedar Chintalapati, Rachit Jaiswal, Samarth Rao, Jared Darlington, Leo Carlin</li>
      <li>
        <b>Description:</b>
        Train a text embedder that understands math, LaTeX and Lean. This will improve search over Lean, and natural
        language theorem search. It can be used for RAG as well. Use arXiv, MathOverflow, mathlib, Lean Reservoir, and
        possibly other sources. Create an evaluation benchmark as well. Goal: submit to EMNLP 2026 in May.
      </li>
    </ul>

    <h3>CayleyPy: search on massive combinatorial graphs</h3>
    <ul>
      <li><b>Project Leaders:</b> TBD</li>
      <li>
        <b>Description:</b>
        Optimize <a href="https://github.com/cayleypy/cayleypy">CayleyPy</a>, make a CLI, and use it on various combinatorial problems, such as estimating diameters of symmetric groups. Goal: submission to ICLR 2027 in September. See <a href="https://docs.google.com/document/d/1CkM2QaZUbJAflKCdj3qvHQaeTi0mSsUuhzZNSp17k08/edit?usp=sharing">project proposal document</a>.
      </li>
      <li><b>Members:</b> Danny Zhang, Gaurang Pendharkar, Merav Frank, Sambhu Ganesan, Xiaoxing Zhang</li>
      <li><b>Prerequisites:</b> solid Python, some group theory or combinatorics.</li>
    </ul>

    <h3>Reinforcement Learning for Polynomials</h3>
    <ul>
      <li><b>Project Leader:</b> Michael R. Zeng</li>
      <li><b>Description:</b> Use RL to find efficient arithmetic circuits for polynomials.</li>
      <li><b>Members:</b> Kyle Zhang, Rohan Pandey, Naomi Morato</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/PolyArithmeticCircuitsRL">GitHub repo</a></li>
    </ul>

    <h3>AI for Quantum Code Compilation</h3>
    <ul>
      <li><b>Project Leader:</b> Andres Paz</li>
      <li>
        <b>Description:</b>
        Quantum error correction (QEC) codes are traditionally described using stabilizers, which define the subspace
        preserved by the code. However, implementing these codes requires translating stabilizers into fault-tolerant
        quantum circuits—an inherently nontrivial task that depends on the constraints and capabilities of the
        underlying hardware architecture.
        <br /><br />
        This project aims to develop an AI agent capable of synthesizing such circuits in a way that:
        <ol>
          <li>
            In the ideal (noiseless) setting, the resulting circuits implement the intended stabilizer structure of the
            code on the target architecture.
          </li>
          <li>
            In the noisy setting, the agent searches over circuit variations to optimize fidelity, taking into account
            realistic noise models and architectural constraints.
          </li>
        </ol>
        The outcome would be a toolchain bridging the gap between abstract QEC code design and concrete, high-performance
        circuit implementations, enabling better exploration of architecture-specific tradeoffs in fault-tolerant quantum
        computing.
      </li>
      <li><b>Members:</b> Christian Tarta, Sylvie Lausier, Mayee Sun, Sarju Patel</li>
    </ul>

    <h3>How good are LLMs at Lean?</h3>
    <ul>
      <li><b>Project Leader:</b> Tyson Klingner</li>
      <li>
        <b>Description:</b>
        Design an evaluation procedure for various Lean tasks such as next step generation or entire proof generation.
        Run our algorithms on frontier models to see which LLMs perform the best, providing guidance to the Lean
        community on which LLMs to use. Use a scalable architecture so that our algorithms can be rerun when new models
        are released.
      </li>
      <li><b>Members:</b> Escher Crawford, Drew Bladek</li>
    </ul>

    <h3>Deep learning for number theory</h3>
    <ul>
      <li><b>Project Leader:</b> Junaid Hasan</li>
      <li>
        <b>Description:</b>
        The goal is to explore to what extent modern machine learning algorithms (e.g., feedforward neural networks,
        transformers, LLMs) can learn number-theoretic functions such as modular arithmetic, the Möbius function, or gcd.
        We can first attempt to replicate results from the literature
        (<a href="https://arxiv.org/pdf/2502.10335">arXiv:2502.10335</a>,
        <a href="https://arxiv.org/abs/2308.15594">arXiv:2308.15594</a>)
        and then explore our own functions and algorithms. We aim to submit to one of the major ML conferences such as
        ICML or ICLR.
      </li>
      <li><b>Prerequisites:</b> Python (must have), ML experience (desired)</li>
      <li><b>Members:</b> Hemkesh Bandi, Akhil Srinivasan, Andrew Chen, Nina Tharamal, Claire Xu</li>
      <li><b>Code:</b> <a href="https://github.com/uw-math-ai/dl-nt">GitHub repo</a></li>
    </ul>
  </section>

  <footer>
    <p>Department of Mathematics, University of Washington ©2026</p>
  </footer>
</body>
</html>
`,r=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fall 2025 Projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
                

        <h1>Math AI Lab Fall 2025 projects</h1>
        We meet Mondays and Wednesdays from 4-5:30 pm in OUG 136.
        <ul>
            <li><b><font size="4">AI for Quantum Code Compilation </font></b>
                <ul>
                    <li><b>Lead mentor:</b> Andres Paz </li>
                    <li><b>Members:</b> Eric Hur, Mayee Sun, Sylvie Lausier, Christian Tarta</li>
                    <li><b>Description:</b> Quantum error correction (QEC) codes are traditionally described using stabilizers, which define the subspace preserved by the code. However, implementing these codes requires translating stabilizers into fault-tolerant quantum circuits—an inherently nontrivial task that is highly dependent on the constraints and capabilities of the underlying hardware architecture. <br><br>

                    This project aims to develop an AI agent capable of synthesizing such circuits in a way that: <br>
                        1.	In the ideal (noiseless) setting, the resulting circuits implement the intended stabilizer structure of the code on the target architecture.<br>
                        2.	In the noisy setting, the agent searches over circuit variations to optimize fidelity, taking into account realistic noise models and architectural constraints.
                    <br><br>
                    The outcome would be a toolchain that bridges the gap between abstract QEC code design and concrete, high-performance circuit implementations, enabling better exploration of architecture-specific tradeoffs in fault-tolerant quantum computing.
                        
                    </li>
                    <li><b>Prerequisites: <b> linear algebra (must have), ML experience (recommended)</li>
                </ul>
            </li>   
            <li><b><font size="4">Deep learning of number theory</font></b>
                <ul>
                    <li><b>Lead mentors:</b> Jarod Alper and Junaid Hasan</li>
                    <li><b>Members:</b> Andrew Chen, Claire Xu, Ivonne Zhang, Akhil Srinivasan, Nina Tharamal, Hemkesh Bandi</li>
                    <li><b>Description:</b> 
                        The goal is to explore to what extent modern machine learning algorithms (e.g., feedforward neural network, transformers, llms) can learn number-theoretic functions such as modular arithmetic, the Mobius function, or gcd. We can first attempt to replicate results from the literature (e.g., https://arxiv.org/pdf/2502.10335,  https://arxiv.org/abs/2308.15594) and then explore our own functions and algorithms. 
                        We aim to submit to one of the major ML conferences such as ICML or ICLR. 
                    </li>
                    <li><b>Prerequisites: <b> Python (must have), ML experience (desired)</li>
                </ul>
            </li>  
            <li><b><font size="4">Formalizing Geometric Measure Theory </font></b>
                <ul>
                    <li><b>Lead mentor:</b>  Ignacio Tejeda </li>
                    <li><b>Members:</b> Annie Cao, Nathan Pao, Theodore Meek</li>
                    <li><b>Description:</b> The goal is to formalizing the following theorem in geometric analysis: If E is a set of Hausdorff dimension 0 < s < 1, the density D^s(E,x) fails to exist
                        at almost every point x of E. This is Theorem 4.2 in Falconer's book <em>Geometry of Fractal Sets</em>.  To get exposure with Lean and specifically with analysis in Lean, this project will begin by following Terence Tao's <a href="https://github.com/teorth/analysis">Lean Companion</a> to his Analysis I textbook.
                    </li>
                    <li><b>Prerequisites: <b> Lean (recommended), analysis (recommended)</li>
                </ul>
            </li>   
            <li><b><font size="4">Formalizing Stacks</font></b>
                <ul>
                    <li><b>Lead mentors:</b> Eric Klavins and Max Lieblich </li>
                    <li><b>Additional mentor:</b> Leopold Mayer</li>
                    <li><b>Members:</b> Dowland Aiello, James Martin</li>
                    <li><b>Description:</b> This project seeks to give formal definitions in Lean of the mathematical objects of sites, sheaves, and stacks.  While these are sophisticated mathematical objects, their definitions are not hard to internalize axiomatically, assuming a basic understanding of category theory.  Building off mathlib's definiton of a category, the first aim is to define a site 
                    following the Stacks Project <a href="https://stacks.math.columbia.edu/tag/00VG">Tag 00VG</a> rather than using mathlib's <a href="https://leanprover-community.github.io/mathlib4_docs/Mathlib/CategoryTheory/Sites/Grothendieck.html#CategoryTheory.GrothendieckTopology">current definition</a>.  The focus here is only formalizing these key definitions, rather than building out a larger mathematical library with lemmas and theorems.     
                    </li>
                    <li><b>Prerequisites: <b> Lean (recommended), category theory (recommended)</li>
                </ul>
            </li>  
            <li><b><font size="4">How good are language models at Lean?  </font></b>
                <ul>
                    <li><b>Lead mentors:</b> Tyson Klingner and Patrick O'Melveny</li>
                    <li><b>Members:</b> Kaira Nair, Drew Bladek, Xinyue Fu, Bohao Chen</li>
                    <li><b>Description:</b>  In an effort to understand the ability of frontier general-purpose large language models at generating Lean code, we will design an evaluation procedure for various Lean tasks such as next step generation or entire proof generation.  We will run our algorithms on the existing frontier models to see which LLMs perform the best, providing valuable guidance to the Lean community on which LLMs to use for certain use cases.  We will use a scalable architecture so that our algorithms can be rerun when new models or versions are released. 
                    </li>
                    <li><b>Prerequisites: <b> ML experience (must have), Lean (recommended)</li>
                </ul>
            </li>
            <li><b><font size="4">Lean error correction with language models</font></b>
                <ul>
                    <li><b>Lead mentor:</b> Vasily Ilin</li>
                    <li><b>Members:</b> Ajit Mallavarapu, Evan Wang, Simon Chess, Daniel Lee, Siyuan Ge</li>
                    <li><b>Description:</b>
                        With the goal of making Lean easier to use and specifically making errors easier to debug, we will curate a Lean error dataset and train models to correct errors.  There are currently large data sets of error-free code, e.g., Mathlib and github repositories, but no existing data sets of common human-made errors.
                        This makes it hard to train LLMs to understand the compiler feedback and fix the errors. We will assemble a dataset of erroneous proofs, the compiler feedback, and the error corrections. We fine-tune Qwen 4B on this dataset. We aim to submit to one of the major ML conferences such as ICML or ICLR.   
                    </li>
                    <li><b>Prerequisites: <b> Python (must-have), Lean (must-have), an ML course (useful)</li>
                    <li><b>Time Commitment: </b> at least 10 hours a week for a quarter</li>
                </ul>
            </li>
            <li><b><font size="4">Mathematician's copilot: reliable theorem search</font></b>
                <ul>
                    <li><b>Lead mentors:</b> Vasily Ilin and Giovanni Inchiostro</li>
                    <li><b>Members:</b> Sophie Szeto, Eric Leonen, Ted Guan, Artemii Remizov</li>
                    <li><b>Description:</b> 
                        The broad vision is to apply modern machine learning techniques to facilitate mathematical research. As a first step in this direction, this project seeks to design search algorithms for locating theorem statements. Mathematics is unique in academia of having precise, self-contained statements of knowledge, which we refer to as theorems, but as of yet, there is no reliable tool to find existing theorems.  Currently frontier language model like ChatGPT might guess at the correct reference but will hallucinate the specific reference numbering. We will develop a search tool by scraping the arxiv or other mathematical documents (e.g., the Stacks Project), extracting theorem statements, and finally computing embeddings of the text. At inference time, we will compare the cosine similarity of the user query to the theorems in our database (which is similar to the technology powering LeanSearch).  We aim to submit to one of the major ML conferences such as ICML or ICLR.  
                    </li>
                    <li><b>Prerequisites: <b> Python (must-have) and an ML course (useful)</li>
                    <li><b>Time Commitment: </b> at least 5 hours a week for a quarter</li>
                </ul>
            </li>
            <li><b><font size="4">Monogenic extensions of regular local rings</font></b>
                <ul>
                    <li><b>Meeting time</b>: 8:30-10:30 am on Tuesdays</li>
                    <li><b>Lead mentors:</b> John Leo and Bianca Viray</li>
                    <li><b>Additional mentor:</b>Bryan Boehnke and Haocheng Cai</li>
                    <li><b>Members:</b> George Peykanu, Sathvik Kurapati, Tianshuo Wang, Xinyi Zhi</li>
                    <li><b>Description:</b> The goal is to add to Lean two lemmas from a recent paper (https://arxiv.org/abs/2503.07846). The first lemma is well known and says that an etale extension of regular local rings is monogenic, i.e., generated by a single element. The second lemma says that an extension of regular local rings that fails to be etale at a unique codimension 1 point is also monogenic. 
                    </li>
                    <li><b>Prerequisites: <b> Lean (recommended), commutative algebra (recommended)</li>
                </ul>
            </li>
            <li><b><font size="4">Provable Computation in Lean</font></b>
                <ul>
                    <li><b>Lead mentor:</b> Dhruv Bhatia </li>
                    <li><b>Members:</b> Annis Wu, Ruslana Korolov, Zeyin Feng, Alan Chang</li>
                    <li><b>Description:</b> While lean has seen extensive use as a theorem proving assistant, its capabilities as a computational programming language have been left underutilized. The goal of this project will be to start filling this gap. Along the way, we will learn the basics of functional programming, monads, and Lean’s meta-programming framework to begin implementing algorithms that can both be run efficiently and be reasoned about. Our main goal will be to implement basic algorithms with applications to linear algebra while also proving (in Lean) correctness of said algorithms.   
                    </li>
                    <li><b>Prerequisites: <b> Lean (recommended), metaprogramming in Lean (recommended)</li>
                </ul>
            </li>     
            <li><b><font size="4">Reinforcement Learning for Polynomials.</font></b>
                <ul>
                    <li><b>Lead mentor:</b> Jarod Alper and Michael R. Zeng</li>
                    <li><b>Members:</b> Bhaumik Mehta, Kyle Zhang, Rohan Pandey, Trey Adams, Naomi Morato, Evan Porter, Kaijie Jin</li>
                    <li><b>Description:</b> 
                        We will use reinforcement learning to train computers to search for efficient arithmetic circuits computing specific polynomials. This is in some sense a simplified version of proof generation, where computers are trained to search for proofs of theorems, except that in this case the search space is considerably smaller.  At the same time, this project may shed some light on some explicit questions in algebraic complexity theory, and specifically the algebraic analogue of P vs NP.  Our inspiration is the AlphaZero algorithm for two-player games, which we will adapt to a single-player game. The problem we will attack is to find efficient ways to compute a polynomial f(x_1, ..., x_n) using an arithmetic circuit consisting of + and x gates together with scalar multiplication. Our strategy is to use Monte Carlo Tree Search to train a deep neural network to learn an effective evaluation function (giving a score of how close the current state is from computing the polynomial) and a policy (a probability distribution over the next moves, with higher probability given to moves that simplify the expression). The computer is rewarded when it finds efficient arithmetic circuits. 
                        We aim to submit to one of the major ML conferences such as ICML or ICLR. 
                    </li>
                    <li><b>Prerequisites: <b> Python (must have), ML experience (must have)</li>
                </ul>
            </li>
            <li><b><font size="4">Teaching a computer to knot </font></b>
                <ul>
                    <li><b>Lead mentors:</b> Allison Henrich (Seattle U) and Andrew Tawfeek </li>
                    <li><b>Members:</b> Sean Kawano, Abel Mesfin, Nicole Ham, Solden Stoll</li>
                    <li><b>Description:</b> Mosaic diagrams were developed in 2008 by Lomanoco and Kauffman to build quantum knot systems. Since then, the structure of mosaics has been widely studied by many others due to their convenient way of encoding a knot in three-dimensional space as a matrix. In 2014, it was shown by Kuriya and Shehab that mosaics are a complete invariant for tame knots, which are the concrete knots we can make with string in everyday life. <br><br>

                    In this project, we will utilize this convenient matrix-encoding of knots to help build and train an AI model to recognize knots through their mosaic representation. To be precise, since knots are fundamentally topological objects with connectivity patterns, we will construct together an appropriate graph neural network and train it together, developing the proper milestones to gauge its progress (e.g. first recognizing connectedness, then number of links, etc.) along the way.
                        
                    </li>
                    <li><b>Prerequisites: <b> python experience (must have)</li>
                </ul>
            </li>   

              
        </ul>
    </section>

    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>
</html>`,o=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spring 2025 Projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section class="spring2025">
        <h2>Spring 2025 Undergraduate Research Projects</h2>
        <li><b><font size="4">Formalizing Polyhedral Geometry</font></b>
            <ul>
                <li><b>Mentors:</b> Caelan Ritter and Freda Zheng, Mathematics</li>
                <li><b>Students: Seven Lewis and George Peykanu</b></li> 
                <li><b>Description:</b> 
                    In this project, the goal is to formalize the basic results in polyhedral geometry, up to the equivalence of definitions of a polyhedron in terms of halfspaces and convex hulls.
                    A polyhedron is a generalization of a polygon to n dimensions.  We can define it either as an intersection of finitely many half-spaces (i.e., the closure of one “side” of a hyperplane) or, if it is bounded, as the “convex hull” of finitely many points.  An explicit goal of this project is to formalize enough of the basic definitions and results in polyhedral geometry so that we can write down the equivalence of the two definitions above.  We will follow the proof outline in chapter 1 of Gaku Liu's 
                    <a href="https://drive.google.com/file/d/1TRg7iQ0RpIRteF2IUiKIe3E-YagVnkH0/view?usp=sharing">notes</a>.    
                </li>
                <li>Github repo: <a href="https://github.com/uw-math-ai/lean-polyhedral-geometry">here</a></li> 
            </ul>
        </li>
        <li><b><font size="4">Reinforcement Learning for Efficient Arithmetic Circuit Generation of Polynomials</font></b>
            <ul>
                <li><b>Students:</b> Alexandre Borentain, Hansel Lee, Claire Xu, and Weikun Zhang</li>
                <li><b>Mentors:</b> Prof. Jarod Alper, Mathematics</li>
                <li><b>Description:</b> We will attempt to use reinforcement learning to train computers to search for efficient arithmetic circuits computing specific polynomials.  In some sense, this is a simplified version of proof generation, where computers are trained to search for proofs of theorems, except that in this case the search space is smaller.  Our inspiration is the AlphaZero algorithm for two-players games, which we will adapt to a one-player game. The problem we will attack is to find efficient ways to compute a polynomial f(x_1, ..., x_n) using an arithmetic circuit consisting of + and x gates together with scalar multiplication. Our strategy is to use Monte Carlo Tree Search to train a deep neural network to learn an effective evaluation function (giving a score of how close the current state is from computing the polynomial) and a policy (a probability distribution over the next moves, with higher probability given to moves that simplify the expression).  The computer is rewarded when it finds efficient arithmetic circuits. </li>
                <li>Github repo: <a href="https://github.com/uw-math-ai/PolyArithmeticCircuitsRL">here</a></li> 
            </ul>
        </li>
        <li><b><font size="4">Metaprogramming and Writing New Tactics</font></b></li>
            <ul>
                <li><b>Mentors:</b> Dhruv Bhatia, Mathematics</li>
                <li><b>Students:</b> Dowland Aiello, Joseph Qian, Veer Shukla, Annis Wu, </li>
                <li><b>Description:</b> 
                    Teaching a person a proof is one thing, but explaining it to a computer is another beast. The computer demands explicit precision, down to the tiniest of details. Thus, any good theorem prover needs tools, or "tactics", that make theorem proving less tedious, and more akin to the way people reason. Lean comes with a built-in "metaprogramming" framework that allows users to build custom tools for automatic proof generation of specific goals. In this project, students learn about functional programming and monads before tackling the basics of metaprogramming. At the end, they write their own tactics. The current task at hand is to write a tactic that can, given a set of hypotheses of the form "a < b" where a and b come from a partially ordered type, automatically prove a goal of the same form by chaining together relevant hypotheses. We use the book <a href="https://leanprover-community.github.io/lean4-metaprogramming-book/">Metaprogramming in Lean 4</a> as a reference.
                </li>
                <li>Github repo: <a href="https://github.com/dhruvashok/partial_order_tactic.git">here</a></li>
            </ul>
        </li>
        <li><b><font size="4">Neural Theorem Proving</font></b></li>
            <ul>
                <li><b>Mentors:</b> Vasily Ilin, Mathematics</li>
                <li><b>Students:</b>  Henry Adams, Siyuan Ge, Attila Jamilov, Elizabeth Wang.
                <li><b>Description:</b>Formalization is the process of translating human-written mathematical proofs into a form that can be verified by a computer. A popular tool for this is Lean, a proof assistant that represents proofs as code. However, the process of formalizing proofs in Lean can be slow and time-consuming. Our research explores neural theorem proving strategies, which aim to automate the generation of Lean proofs.

                    We propose a tree-based search framework to formalize mathematical theorems in Lean using Language Models. This approach explores potential proof steps as branches in a tree, using AI models to suggest "tactics" at each node. This has the benefit of avoiding hallucinations by rigorously checking that AI suggestions represent valid Lean code. We employ both Large Language Models such as Claude Sonnet 3.5 and specialized fine-tuned Small Language Models such as Lean-Dojo. We use Pantograph to interact with Lean, leveraging its native support of Monte Carlo tree search. We assemble a small set of simple and medium-difficulty mathematical theorems to benchmark against, called nanoF2F. Additionally, we benchmark our system on the well-established miniF2F benchmark created by OpenAI.
                </li>
                <li>Github repo: <a href="https://github.com/uw-math-ai/autoformalization-with-llms">here</a></li>
            </ul>
        </li>
        <li><b><font size="4">Matrix Manipulation and Linear Algebra in Lean</font></b>
            <ul>
                <li><b>Mentors:</b> Prof. Eric Klavins, Electrical and Computer Engineering and Haoming Ning</li>
                <li><b>Students:</b> David Bataresh and Hemkesh Bandi</li>
                <li><b>Description:</b>
                    Lean is a proof assistant that can be used to encode and check mathematical results in machine readable code and could one day be used to assist in the development of complex engineering systems. First, however, we need to teach it the foundations of engineering mathematics. In this project, students will contribute to a Lean library of basic results and tactics involving matrices and linear algebra. The overall goal is to support reasoning about a variety of engineering areas that depend on linear algebra, including control systems, quantum computing, and machine learning. Thus, sub-projects will begin with a result in one of these areas and work backwards to the basic results needed to support that result. 
                </li>
                <li>Github repo: <a href="https://github.com/HemkeshB/relations-linAlg-SP25-LEAN">here</a></li>
            </ul>
        </li>

        <h2>Final projects for Math 480: Introduction to Mathematical Formalization</h2>


        <li><b><font size="4">Proving Strong Normalization of the Calculus of Constructions</font></b>
            <ul>
                <li><b>Student:</b> Dowland Aiello</li>
                <li><b>Mentors:</b> Jarod Alper and Vasily Ilin</li>
                <li><b>Description:</b>
                    Proofs of strong normalization of the simply-typed lambda calculus have been exhaustively enumerated in the literature. A common strategy invented by W. W. Tait known as "Tait's method," (Robert Harper, 2022) interprets types as sets of "well-behaving" terms which are known to be strongly normalizing and composed of expressions in some such set. Strong normalization of the typed SK combinator calculus has been comparatively under-studied. Herein, I demonstrate that the typical proof of strong normalization using Tait's method holds for the typed SK combinator calculus. I also show that decomposition of the STLC into SK combinator expressions simplifies the typical proof of strong normalization.
                </li>
                <li>Github repo: <a href="https://github.com/dowlandaiello/coc-lean">here</a></li> 
                <li>Book: <a href="https://dowlandaiello.com/sk-lean/">here</a></li>
            </ul>
        </li>
        <li><b><font size="4">Formalizing Vizing’s Theorem in Lean</font></b>
            <ul>
                <li><b>Students:</b> Zayna Aarbi, Helinda He, and Manish Gatti</li>
                <li><b>Mentors:</b> Jarod Alper and Vasily Ilin</li>
                <li><b>Description:</b>
                    The goal is to formalize Vizing’s Theorem: every simple, undirected graph may be properly edge colored using a number of colors that is at most one larger than the maximum degree of the graph.
                </li>
                <li>Github repo: <a href="https://github.com/ManishSaiGatti/Math480GroupProject"> here</a></li>
                <li>Slides: <a href="https://docs.google.com/presentation/d/1N_uLORDeTjfh0iEFjjXzPVdvG6R7htz3ZhWcDOgj9-A/edit?usp=sharing">here</a></li>
            </ul>
        </li>
        <li><b><font size="4">The six-color theorem</font></b>
            <ul>
                <li><b>Students:</b> Sravani Panuganti, Jeb Song, and Taylor Woodward</li>
                <li><b>Mentors:</b> Jarod Alper and Vasily Ilin</li>
                <li><b>Description:</b>
                    Every simple planar graph can be properly colored with six colors.  The motivation is that this a stepping stone to the more general "fiver-color theorem", which in turn is a stepping stone to the "four-color theorem".  
                </li>
                <li>Github repo: <a href="https://github.com/SravaniPanu/25sp-6color">here</a></li>
                <li>Slides: <a href="https://docs.google.com/presentation/d/1iIT73WHGqPq3Ekz5saI8R2yKzsFDOWWNuSBbs1ZqcqU">here</a></li>
            </ul>
        </li>
        <li><b><font size="4">Formalizing using LLMs</font></b>
            <ul>
                <li><b>Students:</b> Drew Bladek, Simon Chess, and Evan Wang </li>
                <li><b>Mentors:</b> Jarod Alper and Vasily Ilin</li>
                <li><b>Description:</b>
                    Large language models (LLMs) have demonstrated fairly impressive results in mathematical reasoning and proof generation. 
                    However, when applied to the LEAN proof assistant, these models tend to generate code with subtle syntax errors, limiting their practical utility in auto formalization without human intervention. In this work, we will focus on improving the syntactic fluency of LLMs when generating Lean code, without targeting the correctness of mathematical content itself. We curate a small but diverse dataset of Lean code snippets and fine-tune an open-source LLM, and evaluate the syntactic validity of the model's outputs using automated Lean parsers. 
                </li>
                <li>Github repo: <a href="https://github.com/aurasoph/lean-dataset">here</a></li>
            </ul>
        </li>
    </ul>

    <h2>AG Group Formalization Project</h2>
    <ul>
        <li><b><font size="4">Regular Local Rings</font></b>
            <ul>
                <li><b>Contributors:</b> Jarod Alper and Brian Nugent</li>
                <li><b>Description:</b>
                    We have formalized the definition and some of the first properties of regular local rings.  Specifically, we have proved that regular local rings are domains and that one dimensonal regular local rings are PIDs.  We hope to further formalize (1) relationships between regular local rings and regular sequences, (2) Koszul complex, (3) regular local rings are Cohen-Macaulay, (5) characterization of regularity in terms of projective dimension (Auslander-Buchsbaum-Serre), and (6) regular local rings are UFDs (Auslander-Buchsbaum).
                </li>
                <li>Github repo: <a href="https://github.com/JarodUW/RegularLocalRings">here</a></li>
            </ul>
        </li>
    </ul>
    </section>

    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>
</html>
`,l=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Winter 2025 Projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
        <h2>Winter 2025 Undergraduate Research Projects</h2>
            <ul>

                <li><b>Formalizing Central Limit Theorem</b></li>
                    <ul>
                        <li><b>Mentors:</b> Vasily Ilin (lead)</li>
                        <li><b>Students:</b> Siyuan Ge</li>
                        <li><b>Description:</b>Formalize the Central Limit Theorem in Lean 4.</li>
                        <li><b>Code:</b><a href="https://github.com/uw-math-ai/central_limit_theorem">github</a></li>
                    </ul>
                <li><b>Examples and Counterexamples in Commutative Algebra</b></li>
                    <ul>
                        <li><b>Mentors:</b> Jarod Alper (lead), Arkamouli Debnath</li>
                        <li><b>Students:</b> Kaira N</li>
                        <li><b>Description:</b> Construct various examples of commutative rings in Lean. To start, construct an example of a ring that is not an integral domain. (Tricky question: is the zero ring an integral domain and can you formalize it?) How about a ring that is not a PID or not a UFD? Or a non-noetherian ring? Or a noetherian local ring that is not regular. Once we construct together a few basic examples, we will pursue further examples depending on the interests of the students.
                        </li>
                        <li><b>Presentation:</b><a href="slides/winter2025/Examples in commutative algebra.pdf">slides</a></li>
                    </ul>
                <li><b>Formalizing Polyhedral Geometry</b></li>
                    <ul>
                        <li><b>Mentors:</b> Caelan Ritter (lead),  Freda Zhang</li>
                        <li><b>Students:</b> Seven Lewis</li>
                        <li><b>Description:</b> A polyhedron is a generalization of a polygon to n dimensions. We can define it either as an intersection of finitely many half-spaces (i.e., the closure of one "side" of a hyperplane) or, if it is bounded, as the "convex hull" of finitely many points. The goal of this project is to formalize enough of the basic definitions and results in polyhedral geometry so that we can write down the equivalence of the two definitions above. We will follow the proof outline in chapter 1 of Gaku Liu's notes.</li>
                        <li><b>Code:</b><a href="https://github.com/uw-math-ai/lean-polyhedral-geometry">github</a></li>
                        <li><b>Presentation:</b><a href="slides/winter2025/Formalizing Polyhedral Geometry.pdf">slides</a></li>
                    </ul>
                </li>
                <li><b>Metaprogramming and Writing New Tactics</b></li>
                    <ul>
                        <li><b>Mentors:</b> Dhruv Bhatia (lead)</li>
                        <li><b>Students:</b> Dhruv Ashok and Joseph Qian </li>
                        <li><b>Description:</b> Learn Lean's metaprogramming framework for tactic writing. Use this to write new tactics. The current task at hand is to write a tactic that can, given a set of hypotheses of the form a < b where a and b come from a partially ordered type, prove a goal of the same form by chaining together relevant hypotheses. If we are able to finish this project, we will move on to other tactics/help with the metaprogramming groundwork for Vas's Auto-formalization project.</li>
                    </ul>
                </li>
                <li><b>Reinforcement Learning for Efficiently Compute Polynomials Generation</b>
                    <ul>
                        <li><b>Mentors:</b> Jarod Alper (lead), William Dudarov</li>
                        <li><b>Students:</b> Hansel Lee, Hanson Mo, Weikun (Kyle) Zhang, Junbo (Niko) Huang 
                        <li><b>Description:</b> We will attempt to use reinforcement learning to train computers to search for efficient arithmetic circuits computing specific polynomials.  In some sense, this is a simplified version of proof generation, where computers are trained to search for proofs of theorems, except that in this case the search space is smaller.  Our inspiration is the AlphaZero algorithm for two-players games, which we will adapt to a one-player game. The problem we will attack is to find efficient ways to compute a polynomial f(x_1, ..., x_n) using an arithmetic circuit consisting of + and x gates together with scalar multiplication. Our strategy is to use Monte Carlo Tree Search to train a deep neural network to learn an effective evaluation function (giving a score of how close the current state is from computing the polynomial) and a policy (a probability distribution over the next moves, with higher probability given to moves that simplify the expression).  The computer is rewarded when it finds efficient arithmetic circuits.
                        </li>
                        <li><b>Code:</b><a href="https://github.com/kyleAlexandad/RL-group-6Ver-new">github</a></li>
                        <li><b>Presentation:</b><a href="slides/winter2025/WI 2025 Reinforcement Learning.pdf">slides</a></li>
                    </ul>
                </li>
                <li><b>Auto-formalization with LLMs</b></li>
                    <ul>
                        <li><b>Mentors:</b> Vasily Ilin (lead), Zihong Lin</li>
                        <li><b>Students:</b> Attila Jamilov , Henry Adams, Elizabeth Wang
                        <li><b>Description:</b>Formalization is the process of translating human-written mathematical proofs into a form that can be verified by a computer. A popular tool for this is Lean, a proof assistant that represents proofs as code. However, the process of formalizing proofs in Lean can be slow and time-consuming. Our research explores neural theorem proving strategies, which aim to automate the generation of Lean proofs.

                        We propose a tree-based search framework to formalize mathematical theorems in Lean using Language Models. This approach explores potential proof steps as branches in a tree, using AI models to suggest "tactics" at each node. This has the benefit of avoiding hallucinations by rigorously checking that AI suggestions represent valid Lean code. We employ both Large Language Models such as Claude Sonnet 3.5 and specialized fine-tuned Small Language Models such as Lean-Dojo. We use Pantograph to interact with Lean, leveraging its native support of Monte Carlo tree search. We assemble a small set of simple and medium-difficulty mathematical theorems to benchmark against, called nanoF2F. Additionally, we benchmark our system on the well-established miniF2F benchmark created by OpenAI.
                        </li>
                        <li><b>Code:</b><a href="https://github.com/uw-math-ai/autoformalization-with-llms">github</a></li>
                        <li><b>Presentation:</b><a href="slides/winter2025/Auto-formalisations with LLMs - Math AI Lab.pdf">slides</a></li>
                    </ul>
                <li><b>What Mathematical Functions Can Neural Networks Learn?</b></li>
                    <ul>
                        <li><b>Mentors:</b> Jarod Alper (lead), Michael R. Zeng</li>
                        <li><b>Students:</b> Claire Xu, Srishti Bakshi, Chileil Chen Yiqiao (Jeremy) Peng, Hilal Mufti
                        <li><b>Description:</b> We will investigate to what extent certain mathematical functions can be efficiently learned by multilayered neural networks. Can a neural network be trained to compute modular arithmetic? Modular arithmetic is important in cryptography, and some cryptosystems use the fact that linear regression (i.e., given an integer N and pairs (x_i,y_i), find m and b such that y = mx+b (mod N) closely approximates (x_i, y_i)). Can certain number theoretic functions be computed such as the Mobius function \\mu(n)? Can transformers be trained to make linear algebra computations?
                        </li>
                        <li><b>Code:</b><a href="https://github.com/hilalmufti/what-functions-can-nns-learn">github</a></li>
                        <li><b>Presentation:</b><a href="slides/winter2025/Functions NN's Can Learn.pdf">slides</a></li>
                    </ul>
                </li>
                <li><b>Formalizing Zariski Spaces</b></li>
                <ul>
                    <li><b>Mentors:</b> Leo Mayer (lead)</li>
                    <li><b>Students:</b> Maria Berova (mberova@uw.edu)</li>
                    <li><b>Description:</b>The goal is to formalize solutions Exercises II.3.18-19 from Robin Hartshorne's "Algebraic Geometry"</li>
                    <li><b>Code:</b><a href="https://github.com/leomayer1/zariski_spaces">github</a></li>
                    <li><b>Presentation:</b><a href="slides/winter2025/Topology for Algebraic Geometry in Lean.pdf">slides</a></li>
                </ul>
            </li>
            </ul>


    </section>
    <figure class="image-container">
        <img src="photos/winter2025.jpg" alt="Winter 2025 Math AI Lab" width="500">
        <figcaption>Winter 2025 Math AI Lab Group Photo</figcaption>
    </figure>
    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>
</html>
`,s=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fall 2024 Projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
        <h1>Math AI Lab at UW</h1>


   
        <h2>Fall 2024</h2>
        <ul>
            <li><b>Formalizing examples and counterexamples in commutative algebra</b> (Jarod Alper)</li>
                <p>While most of undergraduate mathematics has been formalized, there has been relatively little focus on formalizing examples and counterexamples. We will address this and learn Lean in the process. We will start with simple examples, such as providing rings that are not integral domains or noetherian, then move onto more complicated examples like rings of integers that are not PIDs/UFDs. Students will be free to choose the exact examples based on their interests.</p>
            <li><b>Metaprogramming and Tactics in Lean</b> (Dhruv Bhatia)</li>
                <p>Lean is great because it can check our proofs for us. But wouldn't it be greater if it could also automate parts of the proof writing process itself? Tactics are tools built into Lean that do exactly this. In this project, we will learn about metaprogramming - the process of writing code in Lean to change its own functionality. Along the way, we'll encounter type theory, monads, and other concepts from functional programming, while diving deep into how lean actually works under the hood. Finally, we'll use these tools to write our own tactic for anyone in the lean community to use! Students are encouraged to propose their own potential tactics.</p>
            <li><b>Generating Functions</b> (Herman Chau)</li><br>
            <li><b>Central Limit Theorem</b> (Vasily Ilin)</li>
                <p>CLT is a central (pun intended) result in probability and statistics, and yet it is not in mathlib. Let's fix it!</p>
            <li><b>Topology for Algebraic Geometry</b> (Leopold Mayer)</li>
        </ul>
    </section>

    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>
</html>`,h=`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Winter 2024 Projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
        <h1>Math AI Lab at UW</h1>



        <h2>Winter 2024</h2>
        <ul>
            <li><b>Faculty mentors</b>: Jarod Alper, Andy Heald</li>
            <li><b>Graduate student mentors</b>: Herman Chau, Vasily Ilin, Leopold Mayer</li>
            <li><b>Student participants</b>: Dale Dai, Yujia Dai, Siyuan Ge, Tess Gerrard, Kenneth Gong, Daniel Hughes,
                Mitchell Levy, Benjamin Li, Xinyan Li, Nathan Louie, Rina Reimer, Alexander Sanchez, Qiguang Yan,
                Christie Yang, Steven Zhong</li>
        </ul>
        <h3>Projects:</h3>
        <ul>
            <li><b>FRACTRAN</b>
                <ul>
                    <li>Implement the programming language <a
                            href="https://en.wikipedia.org/wiki/FRACTRAN">FRACTRAN</a> in Lean and write the adder in
                        FRACTRAN.</li>
                    <li>Members: Vasilly Ilin, Alex Sanchez, Mitchell Levy</li>
                    <li><a href="https://github.com/sanchace/FRACTRAN">GitHub code</a></li>
                </ul>
            </li>
            <br>
            <li><b>Continued Fraction Expansion for e</b> (continued from Fall 2023)
                <ul>
                    <li>The continued fraction expansion of e is [1, 0, 1, 1, 2, 1, 1, 4, 1, 1, 6, 1, 1, 8, 1, 1, 10, …]
                    </li>
                    <li>Members: Xinyan Li, Leopold Mayer, Christie Yang</li>
                    <li><a href="https://github.com/leomayer1/cont_frac">GitHub code</a></li>
                </ul>
            </li>
            <br>
            <li><b>Witt's Cancellation Theorem</b> (continuation from Fall 2023)
                <ul>
                    <li>Thm: Let ⟨-,-⟩ be a symmetric bilinear form (i.e. ⟨x,y⟩ = ⟨y,x⟩ for all x,y ∈ V). Suppose that
                        there is form-preserving map g: U → U' where U, U' ⊂ V are subspaces. Then there is a
                        form-preserving map f: V → V extending g.</li>
                    <li>Cor: U ⊕ V ≅ W ⊕ V ⟹ U ≅ W.</li>
                    <li>Members: Andy Heald, Nathan Louie, Sarah Mathison, Qiguang Yan</li>
                </ul>
            </li>
            <br>
            <li><b>Formalizing Math 300</b> (continuation from Fall 2023)
                <ul>
                    <li>Goal: Formalize the exercises (and possibly results) in the Math 300 textbook by Conroy--Taggart:
                        <i>An Introduction to Mathematical Reasoning</i>.</li>
                    <li>Write a Lean guide for students taking Math 300</li>
                    <li>Members: Chengyu (Kenneth) Gong, Rina Reimer, Tess Gerrard, Anthony Xing, Yanzhe (Steven) Zhong</li>
                    <li><a href="https://github.com/StevennZZZ/FormalizingMATH300/">GitHub code</a></li>
                </ul>

            </li>
        </ul>
    </section>

    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>

</html>
`,c=`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fall 2023 Projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
        <h1>Math AI Lab at UW</h1>



        <h2>Fall 2023</h2>
        <ul>
            <li><b>Falculty Mentors:</b> Jarod Alper, Andy Heald, James Morrow</li>
            <li><b>Graduate student mentors:</b> Herman Chau, Vasily Ilin, Leopold Mayer</li>
            <li><b>Undergraduate TA:</b> Zilu (Luca) Li</li>
            <li><b>Student participants:</b> Anthony Xing, Benjamin Li, Chengyu Gong, Christie Yang, George King, Nathan
                Louie, Qiguang Yan, Sarah Mathison, Xinyan Li, Yanzhe (Steven) Zhong, Yu He Zhang, Zhongrui An</li>
        </ul>

        <h3>Projects:</h3>

        <ul>
            <li><b>Continued Fraction Expansion for e</b>
                <ul>
                    <li>The continued fraction expansion of e is [1, 0, 1, 1, 2, 1, 1, 4, 1, 1, 6, 1, 1, 8, 1, 1, 10, …].
                    </li>
                    <li><b>Members:</b> Xinyan Li, Leopold Mayer, Christie Yang</li>
                    <li><a href="https://github.com/leomayer1/cont_frac">GitHub code</a></li>
                </ul>
            </li>
            <br>
            <li><b>Witt's Cancellation Theorem</b>
                <ul>
                    <li>
                        <b>Thm:</b> Let ⟨-,-⟩ be a symmetric bilinear form (i.e. ⟨x,y⟩ = ⟨y,x⟩ for all x,y ∈ V). Suppose
                        that there is form-preserving map g: U → U' where U, U' ⊂ V are subspaces. Then there is a
                        form-preserving map f: V → V extending g.
                    </li>
                    <li>
                        <b>Cor:</b> U ⊕ V ≅ W ⊕ V ⟹ U ≅ W.
                    </li>
                    <li><b>Members:</b> Andy Heald, Nathan Louie, Sarah Mathison, Qiguang Yan</li>
                </ul>
            </li>
            <br>
            <li><b>Random Graphs</b>
                <ul>
                    <li>
                        <b>Goal: </b>Build a random graph G(n,p) with n = # of nodes with p = probability of an edge. Show that the
                        expected number E(# edges in G(n,p)) of edges in a random graph G(n,p) is (n choose 2)p.
                    </li>
                    <li>
                        <b>Related goals:</b> compute other expected numbers, e.g. number of triangles in a random graph.
                    </li>
                    <li>
                        <b>Members:</b> Zhongrui An, Hermann Chau, Vasily Ilin, George King, Benjamin Li, Yu He Zhang
                    </li>
                    <li>
                        <a href="https://github.com/Vilin97/random_graphs">GitHub code</a>
                    </li>

                </ul>
            </li>
            <br>
            <li><b>Formalizing Math 300</b>
                <ul>
                    <li>
                        <b>Goals:</b> 
                        <ul>
                            <li>Formalize the exercises (and possibly results) in the Math 300 textbook by Conroy--Taggart: An
                        Introduction to Mathematical Reasoning.</li>
                            <li>Write a Lean guide for students taking Math 300</li>
                        </ul>
                    </li>
                    <li>
                        <b>Members:</b> Yanzhe (Steven) Zhong, Anthony Xing, Luca Li, Chengyu (Kenneth) Gong
                    </li>
                    <li>
                        <a href="https://github.com/StevennZZZ/FormalizingMATH300/">GitHub code</a>
                    </li>
                </ul>
            </li>
        </ul>
    </section>

    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>

</html>`,m=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spring 2023 projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
        <h1>Math AI Lab at UW</h1>
   
        <h2>Spring 2023</h2>
        <ul>
            <li><b>Faculty mentor:</b> Jarod Alper</li>
            <li><b>Graduate student mentors:</b> Vasily Ilin, Leopold Mayer</li>
            <li><b>Student participants:</b> Dhruv Ashok, Gregory Baimetov, Zachary Banken, Dianna E., Luca Li, Lawrence Lin, Rico Qi, Timothy Tran, Alfie Xu, Edward Yu</li>
            <li> <a href="https://github.com/Vilin97/LLL">Github repository</a></li>
        </ul>

        <h3>Projects:</h3>
        <ul>
            <li><b>Lagrange's Theorem</b> (Dhruv Ashok): <br>
                <ul>
                    <li>If G is a finite group and H ⊆ G is a subgroup, then the order of H divides the order of G.</li>
                </ul>
            </li>
            <br>
            <li><b>Abstract term rewriting</b> (Gregory Baimetov):
                <ul>
                    <li>The confluence and the Church-Rosser property are equivalent (see <a href="https://en.m.wikipedia.org/wiki/Confluence_(abstract_rewriting)">Wikepidia</a>).</li>
                    <li>Formalize the principle of well-founded induction (see <a href="https://en.m.wikipedia.org/wiki/Well-founded_relation">Wikepidia</a>).</li>
                </ul>
            </li>
            <br>
            <li>
                <b>Simplicial homology / tactics</b> (Zachary Banken):
                <ul>
                    <li>Formalize simplicial homology including definitions of simplicial complexes, faces, and the chain group as well that the square of the boundary operator is zero.</li>
                    <li>Functional programming and writing simple tactics in Lean.</li>
                </ul>
            </li>
            <br>
            <li>
                <b>Linear algebra</b> (Dianna E.):
                <ul>
                    <li>If V is a vector space and S, T: V → V are linear transformations such that the range of S is contained in the nullspace of T, then (ST)² = 0.</li>
                </ul>
            </li>
            <br>
            <li>
                <b>Compactness</b> (Luca Li):
                <ul>
                    <li>If X is a compact space, then every closed subset is also compact.</li>
                    <li>If (X,d) is a metric space and every infinite subset of X has a cluster point, then X is sequentially compact.</li>
                </ul>
            </li>
            <br>        
            <li>
                <b>Banach Fixed Point Theorem</b> (Lawrence Lin):
                <ul>
                    <li>If (X,d) is a non-empty complete metric space and T: X → X is a contraction mapping, then T has a unique fixed point.</li>
                </ul>
            </li>
            <br>
            <li>
                <b>Euclidean Geometry</b> (Rico Qi and Edward Yu):
                <ul>
                    <li>Formalize Euclidean Geometry based on Hilbert's Axioms by defining points, lines, angles, and the notion of distance.</li>
                    <li>Formalize a solution to <a href="https://artofproblemsolving.com/wiki/index.php/2023_USAMO_Problems/Problem_1">Problem 1</a> on USAMO 2023.</li>
                </ul>
            </li>
            <br>
            <li>
                <b>Graph theory</b> (Timothy Tran):
                <ul>
                    <li>Every tree on n vertices has n-1 edges.</li>
                </ul>
            </li>
            <br>
            <li>
                <b>Mean Value Theorem</b> (Alfie Xu):
                <ul>
                    <li>Formalize the Mean Value Theorem (currently relying on Rolle's Theorem).</li>
                </ul>
            </li>
        </ul>
    </section>


    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>
</html>`,u=`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Winter 2023 projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
        <h1>Math AI Lab at UW</h1>



        <h2>Winter 2023</h2>
        <ul>
            <li><b>Faculty mentor:</b> Jarod Alper</li>
            <li><b>Graduate student mentors:</b> Vasily Ilin, Leopold Mayer</li>
            <li><b>Student participants:</b> Gregory Baimetov, Zachary Banken, William Dudarov, Griffin Golias, Raymond
                Guo, Eva Hu, Luca Li, Lawrence Lin, Alex Sanchez</li>
            <li> <a href="https://github.com/Vilin97/LLL">Github repository</a></li>
        </ul>

        <h3>Projects:</h3>
        <ul>
            <li><b>Identities of the Fibonacci sequence Fₙ</b> (Lawrence Lin): <br>
                <ul>
                    <li>F₍ₙ₎F₍ₙ₊₂₎-F₍ₙ₊₁₎² = (-1)^(n+1)</li>
                    <li>F₍ₙ₎F₍ₘ₊ₙ₎ = F₍ₙ₊₁₎F₍ₘ₎ + F₍ₙ₎F₍ₘ₋₁₎</li>
                    <li>m | n ⟹ F₍ₘ₎ | F₍ₙ₎</li>
                    <li>Binet's Formula: F₍ₙ₎ = (1/√5)((1+√5)/2)^n - ((1-√5)/2)^n</li>
                </ul>
            </li>
            <br>
            <li><b>Group theory exercises from Herstein <em>Abstract Algebra</em></b> (Alex Sanchez):
                <ul>
                    <li>Let G be an abelian group, and let h₁, h₂ ∈ G be elements. Prove that there exists an element h
                        ∈ G whose order is the least common multiple of the orders of h₁ and h₂.</li>
                    <li>Let G be an abelian group, and let H₁, and H₂ be subgroups. Prove that there exists a subgroup
                        of G whose order is the least common multiple of the orders of H₁ and H₂.</li>
                </ul>
            </li>
            <br>
            <li><b>Topology</b> (Zilu Li):
                <ul>
                    <li>If f : X → Y is a quotient map, then for each y ∈ Y the set f⁻¹({y}) is connected. If Y is
                        connected, then so is X.</li>
                    <li>If a set is connected, then so is its closure.</li>
                    <li>In a metric space (X,d), the following are equivalent: (a) X is compact, (b) Every infinite
                        subset of X has a cluster point, (c) Every sequence in X has a convergent subsequence, (d) X is
                        complete and totally bounded, (e) X is totally bounded and has the Lebesgue property.
                    </li>
                </ul>
            </li>
            <br>
            <li><b>Commutative algebra</b> (Raymond Guo):
                <ul>
                    <li>An integral domain is a PID if and only if every prime ideal is principal.</li>
                </ul>
            </li>
            <br>
            <li>
                <b>Sequences</b> (Zachary Banken, Gregory Baimetov):
                <ul>
                    <li>Beatty's Theorem (aka Rayleigh's Theorem): see <a
                            href="https://en.wikipedia.org/wiki/Beatty_sequence">wikipedia</a>.</li>
                    <li>Uspensky's Theorem: it is not possible to partition the natural numbers using 3 or more Beatty
                        sequences.</li>
                </ul>
            </li>
        </ul>
    </section>
    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>
</html>`,p=`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fall 2022 projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
        <h2>Fall 2022 Undergraduate Research Projects run through WXML</h2>
        <ul>
            <li><b>Faculty mentor:</b> Jarod Alper</li>
            <li><b>Graduate student mentors:</b> Vasily Ilin, Leopold Mayer</li>
            <li><b>Student participants:</b> Zachary Banken, Griffin Golias, Raymond Guo, Eva Hu, Hastin Kapoor, Luca
                Li,
                Lawrence Lin, Alex Sanchez</li>
            <li> Github repositories:
                <ul>
                    <li>
                        <a href="https://github.com/raymondpg/XLL">raymondpg</a>
                    </li>
                    <li>
                        <a href="https://github.com/Vilin97/LLL">vilin97</a>
                    </li>
                </ul>
            </li>
        </ul>

        <h3>Project</h3>
        Formalizing solutions to exercises from undergraduate math textbooks such as:
        <ul>
            <li>
                Axler's book <a href="https://linear.axler.net/">Algebra
                    Done Right</a>
            </li>
            <li>
                Mukres's book <a href="https://www.maths.ed.ac.uk/~v1ranick/papers/munkres.pdf">Topology a first
                    course</a>
            </li>
            <li>
                Silverman's book <a href="https://www.math.brown.edu/~jhs/frint.html">A Friendly Introduction to
                    Number Theory</a>
            </li>
            <li>
                Silverman and Tate's book, Rational Points on Elliptic Curves
            </li>
            <li>
                Folland's book <a
                    href="https://www.math.umn.edu/~garrett/m/fun/notes_2013-14/02a_folland_real.pdf">Advanced
                    Calculus</a>
            </li>
            <li>
                Rudin's book <a href="https://www.math.ucdavis.edu/~hunter/intro_analysis_pdf/rudin.pdf">Principles of
                    Mathematical Analysis</a>
            </li>
            <li>
                Hungerford's book <a href="https://www.math.ucla.edu/~rchua/math259/hungerford.pdf">Abstract Algebra: An
                    Introduction</a>
            </li>
        </ul>
    </section>
    <footer>
        <p>© 2025</p>
    </footer>
</body>
</html>`,b=`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spring 2022 projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <img src="logo2.jpg" alt="AI UW Logo" class="header-logo">
    </header>

    <nav>
        <ul>
            <li><a href="http://ai.math.uw.edu/">Home</a></li>
            <li class="dropdown">
                <a class="dropbtn">Projects</a>
                <div class="dropdown-content">
                    <a href="spring2026.html">Spring 2026</a>
                    <a href="winter2026.html">Winter 2026</a>
                    <a href="fall2025.html">Fall 2025</a>
                    <a href="spring2025.html">Spring 2025</a>
                    <a href="winter2025.html">Winter 2025</a>
                    <a href="fall2024.html">Fall 2024</a>
                    <a href="winter2024.html">Winter 2024</a>
                    <a href="fall2023.html">Fall 2023</a>
                    <a href="spring2023.html">Spring 2023</a>
                    <a href="winter2023.html">Winter 2023</a>
                    <a href="fall2022.html">Fall 2022</a>
                    <a href="spring2022.html">Spring 2022</a>
                </div>
            </li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="seminars.html">Seminars</a></li>
            <li><a href="https://uw2026leanhackathon.github.io/" class="hackathon-btn" target="_blank">Lean Hackathon 2026</a></li>
            <li><a href="https://www.washington.edu/giving/make-a-gift/?source_typ=3&source=DSC-152346&code=DSC-152346&fastForward=yes&page=make"
                    class="support-btn" target="_blank">Support Us</a></li>
        </ul>
    </nav>

    <section>
        <h1>Math AI Lab at UW</h1>



        <h2>Spring 2022</h2>
        <ul>
            <li><b>Faculty mentor:</b> Jarod Alper</li>
            <li><b>Graduate student mentors:</b> Vasily Ilin, Leopold Mayer</li>
            <li><b>Student participants and contributors:</b> Griffin Golias, Kevin Kuei, Brendan Murphy, Alex
                Scheffelin, Runchi Tan</li>
            <li>  <a href="https://github.com/leomayer1/WXML_Sp2022">GitHub repository</a></li>
        </ul>

        <h3>Project</h3>
        Developed our own library for ideals of commutative rings and formalized Hilbert's 1890 proof that ideals
        in polynomial rings are finitely generated.
    </section>
    <footer>
        <p>Department of Mathematics, University of Washington ©2026</p>
    </footer>
</body>
</html>
`,g=59,n=[{slug:"spring-2026",legacyFile:"spring2026.html",label:"Spring 2026",term:"Spring",year:2026,status:"current",venue:"Odegaard 136",summary:"Current Math AI Lab projects, including autoformalization, Lean infrastructure, and AI for mathematics.",html:i},{slug:"winter-2026",legacyFile:"winter2026.html",label:"Winter 2026",term:"Winter",year:2026,status:"recent",venue:"Denny Hall 303 / CMU B-006",summary:"Formalization projects, AI projects, and Lean Together meetings from Winter 2026.",html:t},{slug:"fall-2025",legacyFile:"fall2025.html",label:"Fall 2025",term:"Fall",year:2025,status:"recent",venue:"OUG 136",summary:"Fall 2025 project teams across Lean formalization, theorem search, number theory, quantum compilation, and more.",html:r},{slug:"spring-2025",legacyFile:"spring2025.html",label:"Spring 2025",term:"Spring",year:2025,status:"archive",summary:"Undergraduate research projects, Math 480 final projects, and algebraic geometry formalization work.",html:o},{slug:"winter-2025",legacyFile:"winter2025.html",label:"Winter 2025",term:"Winter",year:2025,status:"archive",summary:"Winter 2025 formalization, metaprogramming, reinforcement learning, and neural theorem proving projects.",html:l},{slug:"fall-2024",legacyFile:"fall2024.html",label:"Fall 2024",term:"Fall",year:2024,status:"archive",summary:"Formalizing examples, tactics, generating functions, CLT, and topology for algebraic geometry.",html:s},{slug:"winter-2024",legacyFile:"winter2024.html",label:"Winter 2024",term:"Winter",year:2024,status:"archive",summary:"FRACTRAN, continued fractions, cancellation theorems, and Math 300 formalization work.",html:h},{slug:"fall-2023",legacyFile:"fall2023.html",label:"Fall 2023",term:"Fall",year:2023,status:"archive",summary:"Continued fractions, Witt cancellation, random graphs, and Math 300 projects.",html:c},{slug:"spring-2023",legacyFile:"spring2023.html",label:"Spring 2023",term:"Spring",year:2023,status:"archive",summary:"Spring 2023 Lean formalization projects and student participants.",html:m},{slug:"winter-2023",legacyFile:"winter2023.html",label:"Winter 2023",term:"Winter",year:2023,status:"archive",summary:"Fibonacci identities, group theory, topology, and commutative algebra projects.",html:u},{slug:"fall-2022",legacyFile:"fall2022.html",label:"Fall 2022",term:"Fall",year:2022,status:"archive",summary:"Fall 2022 undergraduate research projects run through WXML.",html:p},{slug:"spring-2022",legacyFile:"spring2022.html",label:"Spring 2022",term:"Spring",year:2022,status:"archive",summary:"The early XLL-era project archive.",html:b}],d=new Map(n.map(e=>[e.legacyFile,`/projects/${e.slug}`]));function f(e){return n.find(a=>a.slug===e)}export{d as a,f as g,n as p,g as t};
