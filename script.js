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

// ── Three.js Robot ────────────────────────────
function initRobot() {
  const canvas = document.getElementById('robotCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.parentElement.offsetWidth;
  const H = canvas.parentElement.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 1.2, 5.5);
  camera.lookAt(0, 1, 0);

  // ── Helpers ──
  function makeGeo(type, ...args) { return new THREE[type + 'Geometry'](...args); }
  function makeMat(color, opts = {}) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.8, ...opts });
  }

  const PURPLE = 0x7c3aed;
  const CYAN   = 0x06b6d4;
  const DARK   = 0x0d0d18;
  const LIGHT  = 0xc4b5fd;
  const WHITE  = 0xffffff;

  // ── Robot Group ──
  const robot = new THREE.Group();
  scene.add(robot);

  // Body
  const bodyGeo = makeGeo('Box', 1.4, 1.8, 0.9);
  const bodyMat = makeMat(DARK, { roughness: 0.15, metalness: 0.9 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0;
  body.castShadow = true;
  robot.add(body);

  // Body accent lines
  const accentMat = new THREE.MeshBasicMaterial({ color: PURPLE });
  const accentGeo = makeGeo('Box', 1.42, 0.04, 0.02);
  [-0.4, 0, 0.4].forEach(y => {
    const line = new THREE.Mesh(accentGeo, accentMat);
    line.position.set(0, y, 0.46);
    body.add(line);
  });

  // Chest crystal
  const crystalGeo = makeGeo('Octahedron', 0.18);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: CYAN, emissive: CYAN, emissiveIntensity: 1.5,
    roughness: 0, metalness: 0.3, transparent: true, opacity: 0.9
  });
  const crystal = new THREE.Mesh(crystalGeo, crystalMat);
  crystal.position.set(0, 0.2, 0.48);
  body.add(crystal);

  // ── HEAD ──
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.3;
  robot.add(headGroup);

  const headGeo = makeGeo('Box', 1.05, 1.0, 0.85);
  const headMat = makeMat(DARK, { roughness: 0.12, metalness: 0.95 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.castShadow = true;
  headGroup.add(head);

  // Forehead strip
  const fhGeo = makeGeo('Box', 0.9, 0.06, 0.02);
  const fhMesh = new THREE.Mesh(fhGeo, accentMat);
  fhMesh.position.set(0, 0.3, 0.435);
  headGroup.add(fhMesh);

  // ── EYES ──
  function makeEye(xPos) {
    const g = new THREE.Group();
    g.position.set(xPos, 0.05, 0.435);

    // Eye socket
    const socketGeo = makeGeo('Box', 0.26, 0.15, 0.03);
    const socketMat = new THREE.MeshStandardMaterial({ color: 0x0a0a14, roughness: 0.8 });
    const socket = new THREE.Mesh(socketGeo, socketMat);
    g.add(socket);

    // Eye glow
    const eyeGeo = makeGeo('Box', 0.22, 0.11, 0.02);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: CYAN, emissive: CYAN, emissiveIntensity: 3, roughness: 0, metalness: 0
    });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.z = 0.025;
    g.add(eye);

    // Point light for eye glow
    const eyeLight = new THREE.PointLight(CYAN, 1.2, 0.8);
    eyeLight.position.set(0, 0, 0.1);
    g.add(eyeLight);

    headGroup.add(g);
    return { g, eye, eyeMat, eyeLight };
  }
  const eyeL = makeEye(-0.2);
  const eyeR = makeEye( 0.2);

  // ── ANTENNA ──
  const antGeo = makeGeo('Cylinder', 0.025, 0.025, 0.3, 8);
  const antMesh = new THREE.Mesh(antGeo, accentMat);
  antMesh.position.set(0, 0.65, 0);
  headGroup.add(antMesh);
  const antTopGeo = makeGeo('Sphere', 0.045, 8, 8);
  const antTopMat = new THREE.MeshStandardMaterial({
    color: PURPLE, emissive: PURPLE, emissiveIntensity: 2, roughness: 0
  });
  const antTop = new THREE.Mesh(antTopGeo, antTopMat);
  antTop.position.set(0, 0.81, 0);
  headGroup.add(antTop);

  // ── NECK ──
  const neckGeo = makeGeo('Cylinder', 0.18, 0.22, 0.22, 16);
  const neck = new THREE.Mesh(neckGeo, headMat);
  neck.position.y = 0.88;
  robot.add(neck);

  // ── SHOULDERS ──
  function makeShoulder(side) {
    const g = new THREE.Group();
    const s = side * 0.9;
    g.position.set(s, 0.75, 0);

    const geo = makeGeo('Box', 0.45, 0.35, 0.5);
    const mesh = new THREE.Mesh(geo, bodyMat);
    g.add(mesh);

    // shoulder dot
    const dotGeo = makeGeo('Sphere', 0.06, 8, 8);
    const dotMat = new THREE.MeshStandardMaterial({
      color: PURPLE, emissive: PURPLE, emissiveIntensity: 1.5
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(side * 0.14, 0, 0.26);
    g.add(dot);
    robot.add(g);
    return g;
  }
  makeShoulder(-1);
  makeShoulder(1);

  // ── ARMS ──
  function makeArm(side) {
    const armGroup = new THREE.Group();
    armGroup.position.set(side * 0.92, 0.52, 0);

    // Upper arm
    const uaGeo = makeGeo('Box', 0.32, 0.82, 0.32);
    const ua = new THREE.Mesh(uaGeo, bodyMat);
    ua.position.y = -0.41;
    armGroup.add(ua);

    // Elbow joint
    const ejGeo = makeGeo('Sphere', 0.18, 12, 12);
    const ej = new THREE.Mesh(ejGeo, makeMat(DARK, { roughness: 0.2 }));
    ej.position.y = -0.85;
    armGroup.add(ej);

    // Forearm
    const faGeo = makeGeo('Box', 0.28, 0.75, 0.28);
    const fa = new THREE.Mesh(faGeo, bodyMat);
    fa.position.y = -1.28;
    armGroup.add(fa);

    // Hand
    const hGeo = makeGeo('Box', 0.34, 0.28, 0.22);
    const hand = new THREE.Mesh(hGeo, makeMat(0x1a1a2e, { roughness: 0.3 }));
    hand.position.y = -1.70;
    armGroup.add(hand);

    // Forearm stripe
    const stripeGeo = makeGeo('Box', 0.3, 0.04, 0.3);
    const stripe = new THREE.Mesh(stripeGeo, accentMat);
    stripe.position.y = -1.1;
    armGroup.add(stripe);

    robot.add(armGroup);
    return armGroup;
  }
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // ── WAIST & HIPS ──
  const waistGeo = makeGeo('Box', 1.0, 0.22, 0.75);
  const waist = new THREE.Mesh(waistGeo, makeMat(0x0a0a12, { roughness: 0.3 }));
  waist.position.y = -1.02;
  robot.add(waist);

  const hipGeo = makeGeo('Box', 1.3, 0.25, 0.8);
  const hip = new THREE.Mesh(hipGeo, bodyMat);
  hip.position.y = -1.24;
  robot.add(hip);

  // ── LEGS ──
  function makeLeg(side) {
    const g = new THREE.Group();
    g.position.set(side * 0.38, -1.36, 0);

    const ulGeo = makeGeo('Box', 0.38, 0.75, 0.38);
    const ul = new THREE.Mesh(ulGeo, bodyMat);
    ul.position.y = -0.375;
    g.add(ul);

    const kGeo = makeGeo('Sphere', 0.22, 12, 12);
    const k = new THREE.Mesh(kGeo, makeMat(DARK, { roughness: 0.2 }));
    k.position.y = -0.78;
    g.add(k);

    const llGeo = makeGeo('Box', 0.34, 0.68, 0.36);
    const ll = new THREE.Mesh(llGeo, bodyMat);
    ll.position.y = -1.22;
    g.add(ll);

    const footGeo = makeGeo('Box', 0.42, 0.18, 0.5);
    const foot = new THREE.Mesh(footGeo, makeMat(0x0a0a12, { roughness: 0.4 }));
    foot.position.set(0, -1.62, 0.08);
    g.add(foot);

    robot.add(g);
    return g;
  }
  makeLeg(-1);
  makeLeg(1);

  // ── Lighting ──
  const ambient = new THREE.AmbientLight(0x1a1a2e, 0.6);
  scene.add(ambient);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(3, 5, 4);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x7c3aed, 0.8);
  fillLight.position.set(-3, 2, -2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x06b6d4, 0.6);
  rimLight.position.set(0, -2, -3);
  scene.add(rimLight);

  const purplePoint = new THREE.PointLight(PURPLE, 2, 6);
  purplePoint.position.set(0, 3, 2);
  scene.add(purplePoint);

  // ── Mouse tracking ──
  let mouseNorm = { x: 0, y: 0 };
  let targetNorm = { x: 0, y: 0 };
  let isMoving = false;
  let moveTimer;

  window.addEventListener('mousemove', e => {
    mouseNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
    isMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => { isMoving = false; }, 2000);
  });

  // ── Animation Loop ──
  let t = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    t += dt;

    // Lerp toward mouse
    const lerpSpeed = 0.04;
    targetNorm.x += (mouseNorm.x - targetNorm.x) * lerpSpeed;
    targetNorm.y += (mouseNorm.y - targetNorm.y) * lerpSpeed;

    // Idle return
    if (!isMoving) {
      targetNorm.x += (0 - targetNorm.x) * 0.02;
      targetNorm.y += (0 - targetNorm.y) * 0.02;
    }

    // Head follows cursor
    headGroup.rotation.y = targetNorm.x * 0.4;
    headGroup.rotation.x = -targetNorm.y * 0.25;

    // Arm sway following cursor
    armL.rotation.z =  targetNorm.x * 0.18;
    armR.rotation.z = -targetNorm.x * 0.18;
    armL.rotation.x = targetNorm.y * 0.12;
    armR.rotation.x = targetNorm.y * 0.12;

    // Idle breathing
    const breath = Math.sin(t * 1.2) * 0.012;
    body.scale.y = 1 + breath;
    robot.position.y = Math.sin(t * 0.8) * 0.04;

    // Crystal pulsate
    crystal.scale.setScalar(1 + Math.sin(t * 2.5) * 0.12);
    crystalMat.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.8;

    // Eye glow pulse
    [eyeL, eyeR].forEach(e => {
      e.eyeMat.emissiveIntensity = 2.5 + Math.sin(t * 4) * 0.7;
      e.eyeLight.intensity = 1 + Math.sin(t * 3.5) * 0.5;
    });

    // Antenna blink
    antTopMat.emissiveIntensity = 1.5 + Math.sin(t * 6) * 1.0;

    // Arms gentle idle sway
    armL.rotation.z += Math.sin(t * 0.9) * 0.008;
    armR.rotation.z -= Math.sin(t * 0.9 + 0.5) * 0.008;

    // Arm forearm droop
    armL.children[2].rotation.x = 0.1 + targetNorm.y * 0.08;
    armR.children[2].rotation.x = 0.1 + targetNorm.y * 0.08;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    const W2 = canvas.parentElement.offsetWidth;
    const H2 = canvas.parentElement.offsetHeight;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
  });
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
  initRobot();
  initAnimations();
  initTilt();
  initForm();
  initSmoothLinks();
}
