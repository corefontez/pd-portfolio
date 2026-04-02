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

// Nav starts hidden — animates in after loader
gsap.set('#nav', { y: -24, opacity: 0 });

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
   NAV — entrance animation
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
document.querySelectorAll('a, button, .bento-card, .work-item').forEach(el => {
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
   NAV — scroll: compact pill + name→email crossfade
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
   SPLIT TEXT — scroll-triggered word reveal
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
        entry.target.querySelectorAll('.split-inner').forEach((inner, i) => {
          inner.style.transitionDelay = `${i * 0.06}s`;
          inner.classList.add('visible');
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    io.observe(el);
  });
}

initSplitText('.section-title');

// Contact title already has manual split structure with <em> — reveal via observer
const contactTitleObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.split-inner').forEach((inner, i) => {
      inner.style.transitionDelay = `${i * 0.12 + 0.3}s`;
      inner.classList.add('visible');
    });
    contactTitleObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });

const contactTitle = document.querySelector('.contact-title');
if (contactTitle) contactTitleObs.observe(contactTitle);

/* ============================================================
   WORK ITEMS — staggered scroll reveal
   Items start invisible (opacity: 0, translateY) via CSS,
   and transition to visible on scroll in.
   ============================================================ */

const workItems = document.querySelectorAll('.work-item');

const workObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    workItems.forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 110);
    });
    workObs.disconnect();
  });
}, { threshold: 0.08 });

if (workItems.length) workObs.observe(workItems[0]);

/* ============================================================
   TEXT SCRAMBLE — hover effect on work item titles
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

document.querySelectorAll('.work-item-title').forEach(el => {
  const scramble = new TextScramble(el);
  const item = el.closest('.work-item');
  if (item) {
    item.addEventListener('mouseenter', () => scramble.run());
    item.addEventListener('mouseleave', () => scramble.reset());
  }
});

/* ============================================================
   BENTO GRID — staggered scroll reveal
   Each card reveals with a cascading delay based on position.
   ============================================================ */

const bentoCards = document.querySelectorAll('.bento-card');

// Set initial state
bentoCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(22px)';
  card.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, background 0.35s ease';
});

const bentoObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    bentoCards.forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 75);
    });
    bentoObs.disconnect();
  });
}, { threshold: 0.06 });

if (bentoCards.length) bentoObs.observe(bentoCards[0]);

/* ============================================================
   STAT COUNTER — animates on scroll into view
   ============================================================ */

const counters = document.querySelectorAll('.bento-stat-num[data-count]');

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const target = parseInt(entry.target.dataset.count, 10);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
   CONTACT SECTION — split text reveal on scroll
   ============================================================ */

const contactObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const eyebrow = entry.target.querySelector('.contact-eyebrow');
    const cta     = entry.target.querySelector('.contact-cta');
    const emailCta = entry.target.querySelector('.contact-email-cta');

    if (eyebrow) {
      gsap.fromTo(eyebrow,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );
    }
    if (emailCta) {
      gsap.fromTo(emailCta,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.55 }
      );
    }
    if (cta) {
      gsap.fromTo(cta,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.7 }
      );
    }

    contactObs.disconnect();
  });
}, { threshold: 0.15 });

const contactSection = document.getElementById('contact');
if (contactSection) contactObs.observe(contactSection);

// Initial hidden state for contact elements
const contactEls = document.querySelectorAll('.contact-eyebrow, .contact-email-cta, .contact-cta');
contactEls.forEach(el => {
  el.style.opacity = '0';
});

/* ============================================================
   PARALLAX — subtle scroll movement on hero orbs
   ============================================================ */

const orb1 = document.querySelector('.hero-orb-1');
const orb2 = document.querySelector('.hero-orb-2');

window.addEventListener('scroll', () => {
  if (!orb1 && !orb2) return;
  const scrollY = window.scrollY;
  const factor = Math.min(scrollY / window.innerHeight, 1);

  if (orb1) {
    orb1.style.transform = `translate(${factor * -2}%, ${factor * 8}%) scale(${1 + factor * 0.05})`;
  }
  if (orb2) {
    orb2.style.transform = `translate(${factor * 3}%, ${factor * -5}%) scale(${1 + factor * 0.03})`;
  }
}, { passive: true });

/* ============================================================
   REDUCED MOTION — disable animations if user prefers
   ============================================================ */

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.split-inner').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('visible');
  });
  document.querySelectorAll('.work-item').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('visible');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  bentoCards.forEach(card => {
    card.style.transition = 'none';
    card.style.opacity = '1';
    card.style.transform = 'none';
  });
  if (loader) {
    loader.style.display = 'none';
    heroReveal();
  }
}
