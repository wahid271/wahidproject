/* ============================================================
   ARKAN.TRADE — TERMINAL SCRIPT
   GSAP · Lenis · Canvas equity · Lightweight Charts
   Data source: data/portfolio.js (const PORTFOLIO)
   ============================================================ */

'use strict';

const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const HAS_GSAP = typeof gsap !== 'undefined';
const HAS_ST   = typeof ScrollTrigger !== 'undefined';

/* ── Loader (fails safe if CDNs are blocked) ── */
const loader      = document.getElementById('loader');
const loaderFill  = document.querySelector('.loader-progress-fill');
const loaderCount = document.querySelector('.loader-counter');

let progress = 0;
const tick = setInterval(() => {
  progress += Math.random() * 14;
  if (progress >= 100) { progress = 100; clearInterval(tick); }
  if (loaderFill)  loaderFill.style.width = progress + '%';
  if (loaderCount) loaderCount.textContent = Math.floor(progress) + '%';
  if (progress === 100) setTimeout(hideLoader, 300);
}, 90);

function hideLoader() {
  const finish = () => {
    loader.style.display = 'none';
    initPage();
  };
  if (typeof gsap !== 'undefined') {
    gsap.to('#loader', {
      opacity: 0, duration: 0.8, ease: 'power2.inOut', onComplete: finish
    });
  } else {
    finish();
  }
}

/* ── Lenis smooth scroll (single RAF loop) ── */
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  if (HAS_ST) lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── Custom cursor (pointer devices only) ── */
function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
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

/* ── Navbar (plain scroll listener) ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link, .mob-cta').forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── Reduced motion + canvas visibility helper ── */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function runWhenVisible(el, fn) {
  if (REDUCED) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => fn(en.isIntersecting));
  }, { threshold: 0.02 });
  io.observe(el);
}

function runWhenVisibleOnce(el, fn) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { fn(); io.disconnect(); }
    });
  }, { threshold: 0.2 });
  io.observe(el);
}

/* ── Hero background grid (teal, pauses off-screen) ── */
function initGrid() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas || REDUCED) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  let offset = 0, visible = true;
  runWhenVisible(canvas, v => { visible = v; });

  function draw() {
    if (visible && !document.hidden) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sz = 60;
      ctx.strokeStyle = 'rgba(14,203,129,0.07)';
      ctx.lineWidth = 0.8;
      for (let x = (offset * 0.3) % sz; x < canvas.width; x += sz) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = (offset * 0.2) % sz; y < canvas.height; y += sz) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      offset += 0.4;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Hero particles (green/red, pauses off-screen) ── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || REDUCED) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const isMobile = window.innerWidth < 768;
  const N = isMobile ? 25 : 55;
  const particles = Array.from({ length: N }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    green: Math.random() > 0.5,
    opacity: Math.random() * 0.35 + 0.08
  }));

  let visible = true;
  runWhenVisible(canvas, v => { visible = v; });

  function draw() {
    if (visible && !document.hidden) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.green
          ? `rgba(14,203,129,${p.opacity})`
          : `rgba(246,70,93,${p.opacity * 0.8})`;
        ctx.fill();
      });
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Hero equity canvas (draw-on animation) ── */
function initHeroEquity() {
  const canvas = document.getElementById('equityCanvas');
  const elNet = document.getElementById('heroNetLiq');
  const elPeak = document.getElementById('heroPeak');
  const elDD = document.getElementById('heroMaxDD');
  if (!canvas || !window.PORTFOLIO) return;
  const points = PORTFOLIO.equityCurve.filter(p => p.v !== null && p.v !== undefined);
  const ctx = canvas.getContext('2d');

  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;
  const PAD = 10;
  const vals = points.map(p => p.v);
  const min = Math.min(...vals), max = Math.max(...vals);

  function xy(i) {
    const x = PAD + (i / (points.length - 1)) * (W() - PAD * 2);
    const y = H() - PAD - ((points[i].v - min) / (max - min)) * (H() - PAD * 2);
    return { x, y };
  }

  let reveal = 0, visible = true, last = 0;
  runWhenVisible(canvas, v => { visible = v; });

  function draw(ts) {
    requestAnimationFrame(draw);
    if (!visible || document.hidden) return;
    if (REDUCED) reveal = 1;
    if (reveal < 1 && ts - last > 16) {
      reveal = Math.min(1, reveal + 0.008);
      last = ts;
    }

    const w = W(), h = H();
    if (canvas.width !== w * (window.devicePixelRatio || 1)) {
      canvas.width = w * (window.devicePixelRatio || 1);
      canvas.height = h * (window.devicePixelRatio || 1);
    }
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // horizontal gridlines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let g = 1; g < 4; g++) {
      const gy = (h / 4) * g;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    const lastIdx = Math.max(1, Math.floor(reveal * (points.length - 1)));

    // area fill under revealed curve
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(14,203,129,0.22)');
    grad.addColorStop(1, 'rgba(14,203,129,0)');
    ctx.beginPath();
    ctx.moveTo(xy(0).x, h);
    for (let i = 0; i <= lastIdx; i++) {
      const p = xy(i);
      const pPrev = xy(Math.max(0, i - 1));
      const cx = (pPrev.x + p.x) / 2;
      if (i === 0) ctx.lineTo(p.x, p.y);
      else ctx.quadraticCurveTo(pPrev.x, pPrev.y, cx, (pPrev.y + p.y) / 2);
    }
    const endP = xy(lastIdx);
    ctx.lineTo(endP.x, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.moveTo(xy(0).x, xy(0).y);
    for (let i = 1; i <= lastIdx; i++) {
      const p = xy(i), pPrev = xy(i - 1);
      const cx = (pPrev.x + p.x) / 2;
      ctx.quadraticCurveTo(pPrev.x, pPrev.y, cx, (pPrev.y + p.y) / 2);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y);
    }
    ctx.strokeStyle = '#0ecb81';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // head dot + pulse
    if (reveal >= 1) {
      ctx.beginPath();
      ctx.arc(endP.x, endP.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0ecb81';
      ctx.fill();
      const pulse = (Date.now() % 1800) / 1800;
      ctx.beginPath();
      ctx.arc(endP.x, endP.y, 3.5 + pulse * 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(14,203,129,${(1 - pulse) * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  requestAnimationFrame(draw);

  if (elNet)  elNet.textContent  = '$' + fmt.format(Math.round(vals[vals.length - 1]));
  if (elPeak) elPeak.textContent = '$' + fmt.format(Math.round(max));
  if (elDD)   elDD.textContent   = PORTFOLIO.kpis.maxDrawdownPct.toFixed(1) + '%';
}

/* ── Fill text placeholders from PORTFOLIO ── */
function fillText() {
  const m = PORTFOLIO.meta, k = PORTFOLIO.kpis;
  document.querySelectorAll('[data-fill]').forEach(el => {
    const key = el.dataset.fill;
    const val = { ...m, ...k }[key];
    if (val !== undefined && val !== null) el.textContent = val;
  });
  document.querySelectorAll('[data-social]').forEach(a => {
    const url = m.socials[a.dataset.social];
    if (url) a.href = url;
  });
  const mail = document.querySelector('[data-mailto]');
  if (mail) mail.href = 'mailto:' + m.contactEmail;

  const upd = document.getElementById('dataUpdated');
  if (upd) {
    const last = [...PORTFOLIO.trades].sort((a, b) => b.date.localeCompare(a.date))[0];
    upd.textContent = 'Data through ' + last.date + ' · Sample data';
  }
  document.title = m.name + ' — Futures Trader · Public Track Record';
}

/* ── Hero stat counters ── */
function initCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const dec = parseInt(el.dataset.decimals || '0');
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const group = el.dataset.group === '1';

    const render = v => {
      let s = v.toFixed(dec);
      if (group) s = fmt.format(Math.round(v));
      el.textContent = prefix + s + suffix;
    };

    if (REDUCED || !HAS_GSAP) { render(target); return; }

    const obj = { v: 0 };
    const tween = {
      v: target, duration: 2, delay: 1.6, ease: 'power2.out',
      onUpdate: () => render(obj.v)
    };
    if (HAS_ST) tween.scrollTrigger = { trigger: el, start: 'top 95%' };
    gsap.to(obj, tween);
  });
}

/* ── Scroll reveal batches ── */
function initReveals() {
  if (!HAS_GSAP) return;
  if (HAS_ST) gsap.registerPlugin(ScrollTrigger);

  gsap.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
  gsap.to('.title-line', { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, delay: 0.5, ease: 'power3.out' });
  gsap.to('.hero-sub', { opacity: 1, y: 0, duration: 0.9, delay: 1.0, ease: 'power3.out' });
  gsap.to('.hero-actions', { opacity: 1, y: 0, duration: 0.9, delay: 1.15, ease: 'power3.out' });
  gsap.to('.hero-stats', { opacity: 1, y: 0, duration: 0.9, delay: 1.3, ease: 'power3.out' });

  if (REDUCED || !HAS_ST) {
    ['.hero-badge', '.title-line', '.hero-sub', '.hero-actions', '.hero-stats',
     '.service-card', '.principle-item', '.faq-item', '.perf-card', '.table-card']
      .forEach(sel => gsap.set(sel, { opacity: 1, y: 0 }));
    if (!HAS_ST) return;
  }

  ScrollTrigger.batch('.service-card', {
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' }),
    start: 'top 80%'
  });
  ScrollTrigger.batch('.principle-item', {
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' }),
    start: 'top 80%'
  });
  ScrollTrigger.batch('.faq-item', {
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' }),
    start: 'top 85%'
  });
  ScrollTrigger.batch('.perf-card', {
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' }),
    start: 'top 80%'
  });
  ScrollTrigger.batch('.table-card', {
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }),
    start: 'top 80%'
  });

  if (!REDUCED) {
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }
}

/* ── Ticker marquee ── */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track || !window.PORTFOLIO) return;

  const symbols = [
    { s: 'NQ',  p: 21585.00, c: +0.84 },
    { s: 'ES',  p: 6012.25,  c: +0.32 },
    { s: 'GC',  p: 2384.60,  c: -0.21 },
    { s: 'CL',  p: 73.02,    c: +1.47 },
    { s: '6E',  p: 1.1587,   c: -0.09 },
    { s: 'BTC', p: 97240,    c: +2.13 },
    { s: 'VIX', p: 14.62,    c: -3.85 },
    { s: 'DXY', p: 103.41,   c: +0.11 }
  ];

  const fmtP = p => p >= 1000 ? fmt.format(p) : p.toFixed(p < 10 ? 4 : 2);
  const chunk = symbols.map(x =>
    `<span class="tick-item"><span class="tick-sym">${x.s}</span>` +
    `<span class="tick-price">${fmtP(x.p)}</span>` +
    `<span class="tick-chg ${x.c >= 0 ? 'up' : 'down'}">${x.c >= 0 ? '▲' : '▼'} ${Math.abs(x.c).toFixed(2)}%</span></span>` +
    `<span class="sep">│</span>`
  ).join('');

  // duplicate twice for a seamless -50% loop
  track.innerHTML = chunk + chunk;
}

/* ── Lightweight Charts: equity + drawdown ── */
function initCharts() {
  if (typeof LightweightCharts === 'undefined' || !window.PORTFOLIO) return;

  const chartColor = '#0ecb81';
  const ddColor = '#f6465d';
  const grid = 'rgba(255,255,255,0.05)';
  const tickText = '#5c6470';

  const baseOpts = {
    layout: { background: { type: 'solid', color: 'transparent' }, textColor: tickText, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 },
    grid: { vertLines: { color: grid }, horzLines: { color: grid } },
    rightPriceScale: { borderVisible: false },
    timeScale: { borderVisible: false, timeVisible: false },
    handleScale: false,
    handleScroll: false
  };

  const eqEl = document.getElementById('equityChart');
  if (eqEl) {
    const chart = LightweightCharts.createChart(eqEl, {
      ...baseOpts, height: 340
    });
    const series = chart.addAreaSeries({
      lineColor: chartColor, topColor: 'rgba(14,203,129,0.25)', bottomColor: 'rgba(14,203,129,0)',
      lineWidth: 2, priceFormat: { type: 'price', precision: 0, minMove: 1 }
    });
    series.setData(
      PORTFOLIO.equityCurve
        .filter(p => p.v !== null)
        .map(p => ({ time: p.t + '-01', value: p.v }))
    );
    chart.timeScale().fitContent();
    new ResizeObserver(() => chart.applyOptions({ width: eqEl.clientWidth })).observe(eqEl);
  }

  const ddEl = document.getElementById('drawdownChart');
  if (ddEl) {
    const chart = LightweightCharts.createChart(ddEl, {
      ...baseOpts, height: 220
    });
    const series = chart.addAreaSeries({
      lineColor: ddColor, topColor: 'rgba(246,70,93,0.02)', bottomColor: 'rgba(246,70,93,0.28)',
      lineWidth: 1, priceFormat: { type: 'price', precision: 1, minMove: 0.1 }
    });

    // running drawdown from peak, %
    let peak = -Infinity;
    const ddData = PORTFOLIO.equityCurve
      .filter(p => p.v !== null)
      .map(p => {
        peak = Math.max(peak, p.v);
        return { time: p.t + '-01', value: +(((p.v - peak) / peak) * 100).toFixed(2) };
      });
    series.setData(ddData);
    chart.timeScale().fitContent();
    new ResizeObserver(() => chart.applyOptions({ width: ddEl.clientWidth })).observe(ddEl);
  }
}

/* ── Monthly returns heatmap ── */
function initHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  const summary = document.getElementById('heatmapSummary');
  if (!grid || !window.PORTFOLIO) return;

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const yrs = PORTFOLIO.monthlyReturns.years;
  const data = PORTFOLIO.monthlyReturns.data;
  const MAXC = 10;

  let html = '<div class="heatmap-corner mono">YR</div>';
  html += MONTHS.map(m => `<div class="heatmap-head mono">${m}</div>`).join('');

  let allPos = [], allNeg = [], ytdByYear = [];

  yrs.forEach((yr, r) => {
    html += `<div class="heatmap-year mono">${yr}</div>`;
    let ytd = null;
    data[r].forEach(v => {
      if (v === null) { html += '<div class="hm-cell hm-empty mono">·</div>'; return; }
      ytd = (ytd === null ? 1 : 1 + ytd / 100) * (1 + v / 100) - 1;
      (v >= 0 ? allPos : allNeg).push(v);
      const intensity = Math.min(Math.abs(v) / MAXC, 1);
      const alpha = 0.12 + intensity * 0.55;
      const bg = v >= 0 ? `rgba(14,203,129,${alpha})` : `rgba(246,70,93,${alpha})`;
      html += `<div class="hm-cell mono" style="background:${bg}">${v > 0 ? '+' : ''}${v.toFixed(1)}</div>`;
    });
    if (ytd !== null) ytdByYear.push({ yr, ytd: ytd * 100 });
  });

  grid.innerHTML = html;
  grid.style.gridTemplateColumns = `42px repeat(12, 1fr)`;

  if (summary) {
    const all = [...allPos, ...allNeg];
    const posRate = (allPos.length / all.length) * 100;
    const avg = all.reduce((a, b) => a + b, 0) / all.length;
    const best = Math.max(...all), worst = Math.min(...all);
    summary.innerHTML =
      `<span><span class="hs-label">POSITIVE MONTHS</span><span class="hs-val up">${Math.round(posRate)}%</span></span>` +
      `<span><span class="hs-label">AVG MONTH</span><span class="hs-val ${avg >= 0 ? 'up' : 'down'}">${avg >= 0 ? '+' : ''}${avg.toFixed(1)}%</span></span>` +
      `<span><span class="hs-label">BEST</span><span class="hs-val up">+${best.toFixed(1)}%</span></span>` +
      `<span><span class="hs-label">WORST</span><span class="hs-val down">${worst.toFixed(1)}%</span></span>` +
      ytdByYear.map(y =>
        `<span><span class="hs-label">${y.yr} YTD</span><span class="hs-val ${y.ytd >= 0 ? 'up' : 'down'}">${y.ytd >= 0 ? '+' : ''}${y.ytd.toFixed(1)}%</span></span>`
      ).join('');
  }
}

/* ── Instrument horizontal bars ── */
function initInstruments() {
  const wrap = document.getElementById('instrumentBars');
  if (!wrap || !window.PORTFOLIO) return;

  const maxPnl = Math.max(...PORTFOLIO.instruments.map(i => i.pnl));
  wrap.innerHTML = PORTFOLIO.instruments.map(i => `
    <div class="instrument-row">
      <span class="instrument-sym mono">${i.symbol}</span>
      <div class="instrument-bar-track">
        <div class="instrument-bar" style="width:${(i.pnl / maxPnl) * 100}%"></div>
      </div>
      <span class="instrument-pnl mono up">+$${fmt.format(i.pnl)}</span>
    </div>
    <div class="instrument-sub">${i.label} · ${i.share}% of volume</div>
  `).join('');
}

/* ── Track record table ── */
function renderTrades(filter = 'ALL') {
  const body = document.getElementById('tradeTableBody');
  const note = document.getElementById('tableNote');
  if (!body || !window.PORTFOLIO) return;

  const trades = PORTFOLIO.trades.filter(t =>
    filter === 'ALL' ? true : filter === 'WIN' ? t.rMultiple > 0 : t.rMultiple < 0
  );

  body.innerHTML = trades.map(t => {
    const win = t.rMultiple > 0;
    const d = new Date(t.date + 'T00:00:00');
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
    return `<tr>
      <td class="mono td-dim">${dateStr}</td>
      <td class="mono td-sym">${t.symbol}</td>
      <td><span class="side-pill ${t.side === 'LONG' ? 'side-long' : 'side-short'}">${t.side}</span></td>
      <td class="mono ta-r">${t.entry.toFixed(2)}</td>
      <td class="mono ta-r">${t.exit.toFixed(2)}</td>
      <td class="mono ta-r ${win ? 'up' : 'down'}">${win ? '+' : ''}${t.rMultiple.toFixed(1)}R</td>
      <td class="mono ta-r ${win ? 'up' : 'down'}">${win ? '+' : '-'}$${fmt.format(Math.abs(t.pnl))}</td>
    </tr>`;
  }).join('');

  if (note) {
    const wins = PORTFOLIO.trades.filter(t => t.rMultiple > 0).length;
    const total = PORTFOLIO.trades.length;
    const netPnl = PORTFOLIO.trades.reduce((a, t) => a + t.pnl, 0);
    note.innerHTML =
      `Showing ${trades.length}/${total} · Sample window ` +
      `<span class="up">${wins}W</span>/<span class="down">${total - wins}L</span> · ` +
      `Net <span class="${netPnl >= 0 ? 'up' : 'down'}">${netPnl >= 0 ? '+' : '-'}$${fmt.format(Math.abs(netPnl))}</span>`;
  }
}

function initTradeTable() {
  renderTrades();
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTrades(btn.dataset.filter);
    });
  });
}

/* ── Strategy cards ── */
function initStrategies() {
  if (!window.PORTFOLIO) return;
  PORTFOLIO.strategies.forEach((s, i) => {
    const meta = document.getElementById('strat-meta-' + i);
    if (meta) meta.textContent = s.market + ' · ' + s.timeframe;
    document.querySelectorAll(`[data-strat="${i}"]`).forEach(el => {
      if (el.classList.contains('strat-name')) el.textContent = s.name;
      if (el.classList.contains('strat-desc')) el.textContent = s.desc;
    });
    const stats = document.querySelector(`[data-strat-stats="${i}"]`);
    if (stats) {
      stats.innerHTML = Object.entries(s.stats).map(([k2, v]) =>
        `<div class="stat-item"><span class="stat-key">${k2}</span><span class="stat-val mono">${v}</span></div>`
      ).join('');
    }
  });
}

/* ── Principles ── */
function initPrinciples() {
  if (!window.PORTFOLIO) return;
  document.querySelectorAll('[data-principle]').forEach((el, i) => {
    const p = PORTFOLIO.principles[i];
    if (!p) return;
    el.querySelector('h3').textContent = p.title;
    el.querySelector('p').textContent = p.text;
  });
}

/* ── FAQ accordion ── */
function initFaq() {
  const list = document.getElementById('faqList');
  if (!list || !window.PORTFOLIO) return;

  list.innerHTML = PORTFOLIO.faq.map((f, i) => `
    <div class="faq-item" data-faq="${i}">
      <button class="faq-q" aria-expanded="false">
        <span>${f.q}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `).join('');

  list.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      // close others
      list.querySelectorAll('.faq-item.open').forEach(o => {
        if (o !== item) {
          o.classList.remove('open');
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
}

/* ── Copy email ── */
function initCopyEmail() {
  const btn = document.getElementById('copyEmail');
  if (!btn || !window.PORTFOLIO) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO.meta.contactEmail);
      btn.textContent = '✓ Copied';
    } catch {
      btn.textContent = PORTFOLIO.meta.contactEmail;
    }
    setTimeout(() => { btn.textContent = 'Copy email address'; }, 2000);
  });
}

/* ── Smooth nav links ── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') { e.preventDefault(); return; }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      else target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });
}

/* ── 3D tilt on perf/table cards ── */
function initTilt() {
  if (REDUCED) return;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 10, rotateX: -y * 6,
        transformPerspective: 800, duration: 0.4, ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.7)' });
    });
  });
}

/* ── Hero profile photo upload (right of the Spline robot) ── */
function initProfilePhoto() {
  const input   = document.getElementById('profileInput');
  const btn     = document.getElementById('profileUploadBtn');
  const card    = document.getElementById('profileCard');
  const img     = document.getElementById('profileImg');
  const empty   = document.getElementById('profileEmpty');
  const errEl   = document.getElementById('profileError');
  if (!input || !btn || !card || !img || !empty) return;

  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_MB  = 10;

  function showError(msg) {
    if (!errEl) return;
    errEl.textContent = msg;
    errEl.hidden = false;
  }
  function clearError() { if (errEl) errEl.hidden = true; }

  function applyPhoto(file) {
    clearError();
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      showError('Unsupported file. Use JPG, JPEG, PNG or WebP.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      showError('Image too large. Maximum ' + MAX_MB + ' MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      img.hidden = false;
      empty.hidden = true;
      card.classList.add('has-photo');
    };
    reader.onerror = () => showError('Could not read that file. Try again.');
    reader.readAsDataURL(file);
  }

  // Button + card click both open the picker
  btn.addEventListener('click', () => input.click());
  card.addEventListener('click', () => input.click());
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });

  // Selecting a new file replaces the existing photo
  input.addEventListener('change', () => {
    applyPhoto(input.files && input.files[0]);
    input.value = ''; // allow re-selecting the same file to replace
  });

  // Drag & drop onto the photo card
  ['dragenter', 'dragover'].forEach(ev =>
    card.addEventListener(ev, e => { e.preventDefault(); card.classList.add('dragover'); })
  );
  ['dragleave', 'drop'].forEach(ev =>
    card.addEventListener(ev, e => { e.preventDefault(); card.classList.remove('dragover'); })
  );
  card.addEventListener('drop', e => {
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) applyPhoto(file);
  });
}

/* ── Init All ── */
function initPage() {
  if (HAS_GSAP && HAS_ST) {
    gsap.registerPlugin(ScrollTrigger);
  }

  fillText();
  initLenis();
  initCursor();
  initNavbar();
  initTicker();
  initStrategies();
  initPrinciples();
  initFaq();
  initInstruments();
  initHeatmap();
  initTradeTable();
  initCopyEmail();
  initSmoothLinks();
  initCharts();
  initHeroEquity();
  initProfilePhoto();
  initCounters();
  initReveals();
  initTilt();

  if (HAS_ST) ScrollTrigger.refresh();
}
