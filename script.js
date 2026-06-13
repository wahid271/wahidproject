/* ============================================
   NEXASTUDIO — PREMIUM PORTFOLIO SCRIPT
   Three.js Robot · GSAP · Lenis · Particles
   ============================================ */

'use strict';

// ── Loader ────────────────────────────────────
const loader       = document.getElementById('loader');
const loaderFill   = document.querySelector('.loader-progress-fill');
const loaderCount  = document.querySelector('.loader-counter');

let progress = 0;
const tick = setInterval(() => {
  progress += Math.random() * 14;
  if (progress >= 100) { progress = 100; clearInterval(tick); }
  loaderFill.style.width = progress + '%';
  loaderCount.textContent = Math.floor(progress) + '%';
  if (progress === 100) setTimeout(hideLoader, 400);
}, 90);

function hideLoader() {
  gsap.to('#loader', {
    opacity: 0, duration: 0.8, ease: 'power2.inOut',
    onComplete: () => {
      loader.style.display = 'none';
      initPage();
    }
  });
}

// ── Lenis Smooth Scroll ───────────────────────
let lenis;
function initLenis() {
  lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ── Custom Cursor ─────────────────────────────
function initCursor() {
  const outer = document.getElementById('cursorOuter');
  const inner = document.getElementById('cursorInner');
  if (!outer || !inner) return;
  let mx = 0, my = 0, ox = 0, oy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(inner, { x: mx, y: my, duration: 0.05 });
  });

  (function loop() {
    ox += (mx - ox) * 0.1;
    oy += (my - oy) * 0.1;
    gsap.set(outer, { x: ox, y: oy });
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
    el.addEventListener('mouseenter', () => outer.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outer.classList.remove('hovered'));
  });
}

// ── Navbar ────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: self => nav.classList.toggle('scrolled', self.progress > 0)
  });

  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  toggle?.addEventListener('click', () => {
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link, .mob-cta').forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Grid Canvas Background ────────────────────
function initGrid() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  let offset = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sz = 60;
    ctx.strokeStyle = 'rgba(124,58,237,0.12)';
    ctx.lineWidth = 0.8;

    for (let x = (offset * 0.3) % sz; x < canvas.width; x += sz) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = (offset * 0.2) % sz; y < canvas.height; y += sz) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    offset += 0.4;
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Particle Canvas ───────────────────────────
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,85,247,${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── GSAP Animations ───────────────────────────
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero badge
  gsap.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });

  // Title lines stagger
  gsap.to('.title-line', {
    opacity: 1, y: 0, duration: 1.1, stagger: 0.12, delay: 0.5, ease: 'power3.out'
  });

  // Hero sub & actions
  gsap.to('.hero-sub', { opacity: 1, y: 0, duration: 0.9, delay: 1.0, ease: 'power3.out' });
  gsap.to('.hero-actions', { opacity: 1, y: 0, duration: 0.9, delay: 1.15, ease: 'power3.out' });
  gsap.to('.hero-stats', { opacity: 1, y: 0, duration: 0.9, delay: 1.3, ease: 'power3.out' });

  // Stats counter
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: target, duration: 2, delay: 1.8, ease: 'power2.out', snap: { innerText: 1 },
      onUpdate: function() { el.textContent = Math.floor(parseFloat(el.textContent)); }
    });
  });

  // Services cards
  ScrollTrigger.batch('.service-card', {
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' }),
    start: 'top 80%'
  });

  // Project cards
  ScrollTrigger.batch('.project-card', {
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.18, duration: 1, ease: 'power3.out' }),
    start: 'top 80%'
  });

  // Process items
  ScrollTrigger.batch('.process-item', {
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' }),
    start: 'top 80%'
  });

  // Section titles parallax
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
}

// ── 3D Tilt on Project Cards ──────────────────
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 12, rotateX: -y * 8,
        transformPerspective: 800, duration: 0.4, ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.7)' });
    });
  });
}

// ── Contact Form ──────────────────────────────
function initForm() {
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.form-input');
    let valid = true;
    inputs.forEach(i => {
      if (!i.value.trim()) {
        valid = false;
        gsap.fromTo(i, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(2,0.5)' });
        i.style.borderColor = 'rgba(236,72,153,0.6)';
        setTimeout(() => { i.style.borderColor = ''; }, 2000);
      }
    });
    if (!valid) return;

    gsap.to(btn, { opacity: 0.5, scale: 0.97, duration: 0.2 });
    setTimeout(() => {
      gsap.to(btn, { opacity: 1, scale: 1, duration: 0.3 });
      success.style.display = 'block';
      gsap.from(success, { opacity: 0, y: 10, duration: 0.4 });
      inputs.forEach(i => { i.value = ''; });
    }, 1200);
  });
}

// ── Smooth nav links ──────────────────────────
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target && lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    });
  });
}

// ── Init All ──────────────────────────────────
function initPage() {
  initLenis();
  initCursor();
  initNavbar();
  initGrid();
  initParticles();
  initAnimations();
  initTilt();
  initForm();
  initSmoothLinks();
}
