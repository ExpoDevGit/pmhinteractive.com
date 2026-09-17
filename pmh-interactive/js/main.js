// ── HERO INTRO ──
const heroEls = [
  { sel: '.hero-logo-wrap', delay: 120 },
  { sel: '.hero-title',     delay: 120 },
  { sel: '.hero-sub',       delay: 300 },
  { sel: '.hero-cta',       delay: 460 },
];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  heroEls.forEach(({ sel, delay }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.8s ${delay}ms cubic-bezier(.22,1,.36,1), transform 0.8s ${delay}ms cubic-bezier(.22,1,.36,1)`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
}

// ── NAVBAR SCROLL STATE ──
const navbar = document.getElementById('navbar');
if (navbar) {
  const setScrolled = () => navbar.classList.toggle('scrolled', window.scrollY > 32);
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });
}

// ── MOBILE MENU ──
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  const toggle = () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  };
  const close = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  };

  hamburger.addEventListener('click', toggle);
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
if (!reducedMotion && 'IntersectionObserver' in window) {
  revealEls.forEach(el => el.classList.add('will-animate'));
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      ro.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealEls.forEach(el => ro.observe(el));
}

// ── MARK CURRENT NAV LINK ──
(() => {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes('#') && !href.includes('.html')) return;
    if (href.split('/').pop().split('#')[0] === here) a.classList.add('current');
  });
})();
