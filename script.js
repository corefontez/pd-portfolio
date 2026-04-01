/* ============================================================
   Portfolio — Animations & Interactions
   Izabel Fontes
   ============================================================ */

'use strict';

/* ============================================================
   LOADER
   ============================================================ */

const loader = document.getElementById('loader');
const loaderBar = document.querySelector('.loader-bar');

// Nav starts hidden — will animate in after loader
gsap.set('#nav', { y: -24, opacity: 0 });

// Animate bar fill, then reveal page
gsap.to(loaderBar, {
  width: '100%',
  duration: 1.1,
  ease: 'power2.inOut',
  onComplete: () => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      delay: 0.15,
      onComplete: () => {
        loader.style.display = 'none';
        navReveal();
        heroReveal();
      }
    });
  }
});

/* ============================================================
   NAV — entrance animation (top → down, smooth + premium)
   ============================================================ */

function navReveal() {
  gsap.to('#nav', {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'power3.out',
    delay: 0.05
  });
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */

const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mX = 0, mY = 0, fX = 0, fY = 0;

document.addEventListener('mousemove', e => {
  mX = e.clientX;
  mY = e.clientY;
  gsap.to(cursor, { x: mX, y: mY, duration: 0 });
});

(function animateFollower() {
  fX += (mX - fX) * 0.09;
  fY += (mY - fY) * 0.09;
  gsap.set(follower, { x: fX, y: fY });
  requestAnimationFrame(animateFollower);
})();

// Hover states
document.querySelectorAll('a, button, .service-card, .work-row').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovering');
    follower.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovering');
    follower.classList.remove('hovering');
  });
});

/* ============================================================
   NAV — scroll behavior
   ============================================================ */

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ============================================================
   HERO — staggered word reveal after loader
   ============================================================ */

function heroReveal() {
  const inners = document.querySelectorAll('#hero .split-inner');
  inners.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1 + 0.05}s`;
    el.classList.add('visible');
  });

  // Fade in hero meta and desc
  gsap.fromTo('#hero .hero-meta, #hero .hero-foot', {
    opacity: 0,
    y: 16
  }, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay: 0.6,
    stagger: 0.15,
    ease: 'power3.out'
  });
}

/* ============================================================
   SPLIT TEXT — generic scroll-triggered word reveal
   Splits any element with [data-split] into word spans
   ============================================================ */

function initSplitText(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const words = el.textContent.trim().split(/\s+/);

    el.innerHTML = words.map(w =>
      `<span class="split-line"><span class="split-inner">${w}</span></span>`
    ).join(' ');

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const inners = entry.target.querySelectorAll('.split-inner');
        inners.forEach((inner, i) => {
          inner.style.transitionDelay = `${i * 0.06}s`;
          inner.classList.add('visible');
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    io.observe(el);
  });
}

// Apply to section titles and about body
initSplitText('.section-title');
initSplitText('.about-body');

/* ============================================================
   WORK ROWS — staggered reveal
   ============================================================ */

const workRows = document.querySelectorAll('.work-row');

const workObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    workRows.forEach((row, i) => {
      setTimeout(() => row.classList.add('visible'), i * 90);
    });
    workObs.disconnect();
  });
}, { threshold: 0.1 });

if (workRows.length) workObs.observe(workRows[0]);

/* ============================================================
   SERVICE CARDS — staggered reveal
   ============================================================ */

const serviceCards = document.querySelectorAll('.service-card');

const serviceObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    serviceCards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 120);
    });
    serviceObs.disconnect();
  });
}, { threshold: 0.1 });

if (serviceCards.length) serviceObs.observe(serviceCards[0]);

/* ============================================================
   TEXT SCRAMBLE — hover effect on project titles
   ============================================================ */

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    this.original = el.textContent;
    this.running = false;
    this.frame = null;
  }

  run() {
    if (this.running) return;
    this.running = true;
    let iter = 0;
    const original = this.original;

    const tick = () => {
      this.el.textContent = original
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < iter) return original[i];
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');

      iter += 0.45;

      if (iter < original.length) {
        this.frame = requestAnimationFrame(tick);
      } else {
        this.el.textContent = original;
        this.running = false;
      }
    };

    this.frame = requestAnimationFrame(tick);
  }

  reset() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.el.textContent = this.original;
    this.running = false;
  }
}

document.querySelectorAll('.work-title').forEach(el => {
  const scramble = new TextScramble(el);
  const row = el.closest('.work-row');
  if (row) {
    row.addEventListener('mouseenter', () => scramble.run());
    row.addEventListener('mouseleave', () => scramble.reset());
  }
});

/* ============================================================
   COUNTER ANIMATION — stats in about section
   ============================================================ */

const counters = document.querySelectorAll('.stat-num[data-count]');

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const target = parseInt(entry.target.dataset.count, 10);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      entry.target.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        entry.target.textContent = target;
      }
    };

    requestAnimationFrame(tick);
    counterObs.unobserve(entry.target);
  });
}, { threshold: 0.6 });

counters.forEach(c => counterObs.observe(c));

/* ============================================================
   GENERIC FADE-UP REVEAL — for any .reveal element
   ============================================================ */

const revealEls = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
  revealObs.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  revealEls.forEach(el => {
    revealObs.observe(el);
  });
});

// Patch: add .visible transition state
const style = document.createElement('style');
style.textContent = `.reveal.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

/* ============================================================
   REDUCED MOTION — disable animations if user prefers
   ============================================================ */

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.split-inner').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('visible');
  });
  document.querySelectorAll('.work-row, .service-card').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('visible');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  if (loader) {
    loader.style.display = 'none';
    heroReveal();
  }
}
