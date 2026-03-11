// ── HERO ANIMATIONS ──
const heroEls = [
  { sel: '.hero-eyebrow',  delay: 150 },
  { sel: '.hero-logo-wrap', delay: 300 },
  { sel: '.hero-title',    delay: 300 },
  { sel: '.hero-sub',      delay: 450 },
  { sel: '.hero-cta',      delay: 600 },
  { sel: '.hero-stats',    delay: 750 },
];
heroEls.forEach(({ sel, delay }) => {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }));
});

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── HAMBURGER ──
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    })
  );
}

// ── SCROLL REVEAL ──
document.querySelectorAll('.reveal').forEach(el => el.classList.add('will-animate'));
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

const ticker = document.querySelector('.ticker');
if (ticker) ticker.innerHTML += ticker.innerHTML;

// ── CONTACT FORM (Formspree) ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'SENDING...';

    // ⬇  Replace YOUR_FORM_ID with your Formspree form ID
    const FORMSPREE_ID = 'YOUR_FORM_ID';

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST', body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        status.textContent = '✓ Message sent! We\'ll get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else throw new Error();
    } catch {
      status.textContent = '✗ Something went wrong. Try emailing us directly.';
      status.className = 'form-status error';
    }
    btn.disabled = false;
    btn.textContent = 'SEND MESSAGE';
  });
}
