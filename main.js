/* ================================================================
   UW Math AI Lab — shared page effects
   ================================================================ */

(function () {
  'use strict';

  /* ── 1. Floating math-symbol canvas ── */
  var canvas = document.getElementById('math-canvas');
  if (canvas) {
    var ctx    = canvas.getContext('2d');
    var SYMS   = ['∑','∫','∇','∂','∈','ℝ','ℂ','π','λ','φ',
                  'α','β','γ','Δ','Ω','ε','δ','∀','∃','√',
                  '∞','⊂','≡','⊗','⟨','⟩','θ','μ','σ','ρ'];
    var particles = [];

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function mkParticle(fromBottom) {
      return {
        x:      Math.random() * (canvas.width  || window.innerWidth),
        y:      fromBottom ? (canvas.height || window.innerHeight) + 20
                           : Math.random() * (canvas.height || window.innerHeight),
        sym:    SYMS[Math.floor(Math.random() * SYMS.length)],
        size:   11 + Math.random() * 17,
        alpha:  0.04 + Math.random() * 0.09,
        vx:     (Math.random() - 0.5) * 0.13,
        vy:     -0.08 - Math.random() * 0.18,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: 45 }, function () { return mkParticle(false); });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p, i) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = '#fbbf24';
        ctx.font        = p.size + 'px "Space Mono", monospace';
        ctx.fillText(p.sym, p.x, p.y);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -30 || p.x < -40 || p.x > canvas.width + 40) {
          particles[i] = mkParticle(true);
        }
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    draw();
  }

  /* ── 2. Scroll-reveal ── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObs.observe(el);
  });

  /* ── 3. Stat-counter animation (index.html only) ── */
  function animateCount(el) {
    var target   = parseInt(el.dataset.target, 10);
    var duration = 1500;
    var start    = performance.now();
    function step(now) {
      var t    = Math.min((now - start) / duration, 1);
      var ease = 1 - Math.pow(1 - t, 3);          /* cubic ease-out */
      el.textContent = Math.round(ease * target);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCount);
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.stat-grid').forEach(function (el) {
    statObs.observe(el);
  });

})();
