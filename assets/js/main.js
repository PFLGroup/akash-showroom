/* ============================================================
   AKASH — showroom  |  main.js v2
   i18n · nav · dynamiczny kolor galerii · spotlight · tilt 3D ·
   parallax · pasek postępu · protect()
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  /* ---------- 1. i18n (PL domyślny, EN przełączany) ---------- */
  var EN = {
    proto: 'PROTOTYPE / concept — a PFL Group visualization. Photos and covers pulled from the web as placeholders to be replaced (rights: akash.pl / DA Records / authors).',
    nav_manifest: 'Manifesto', nav_disco: 'Discography', nav_listen: 'Listen', nav_contact: 'Contact',
    hero_kicker: 'formerly AK-47 · AKASH since 2022',
    hero_tagline: '“Light is sound”',
    hero_lead: 'Akash — the Sanskrit sky, ether, the carrier of sound. Six albums. One path: from street darkness toward the light. Enter the gallery and walk it backwards — from today to the beginning.',
    hero_cta1: 'Enter the showroom', hero_cta2: 'Listen on Spotify',
    man_eye: 'Narrative', man_title: 'From armour to ether',
    man_intro: 'AKASH’s work is one story told in chapters — a descent into darkness, the purgatory of guilt, a return to the Source and a dissolution into the sky. Every album is a different question. Every question, a different light.',
    j13: 'autopsy of the soul', j15: 'seven sins', j16: 'the weight of guilt',
    j20: 'return to light', j22: 'a breath after the road', j25: 'geometry of light',
    show_eye: 'Showroom', show_title: 'Six exhibits',
    show_intro: 'From newest to oldest. Each exhibit floods the gallery with its own colour — keep scrolling and the light changes hue.',
    m_szescian: '“Six walls, one light.” A hermetic cinematic musical — geometry, illusion and the road to awakening.',
    m_melancholie: '“What remains when you return from the Source?” A free breath after the spiritual journey — reflection instead of struggle.',
    m_zrodlo: '“Where does the road end and the beginning start?” Slavic-Eastern mysticism, white and red — the turning point.',
    m_czysciec: '“How much does guilt weigh before you set it down?” A 2×CD release with a book — reckoning and cleansing.',
    m_pieklo: '“Seven sins. The first day.” The descent — the darkest chapter of the road.',
    m_autopsja: '“An autopsy of one’s own soul.” The debut — the start of the road and the first hardcore blow.',
    buy: 'Buy album', first_akash: 'first album as AKASH', last_ak47: 'last album as AK-47',
    career_max: 'career peak', trilogy_end: 'closing the trilogy',
    listen_eye: 'Listen', listen_title: 'Everywhere there is sound', store: 'Store · records',
    soc_eye: 'Contact', soc_title: 'Stay in the ether', soc_intro: 'Follow AKASH on social media.',
    soc_followers: '~70k monthly listeners',
    foot_note: 'Music showroom — concept prototype.',
    foot_disc: 'Illustrative material. Photos, covers and trademarks belong to their owners (akash.pl / DA Records / photographers). This site is not a shop — “Buy album” links lead to external sellers.',
    rights: 'All rights reserved.'
  };
  var nodes = document.querySelectorAll('[data-i18n]');
  var PL = {};
  nodes.forEach(function (n) { PL[n.getAttribute('data-i18n')] = n.innerHTML; });
  function setLang(lang) {
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n');
      n.innerHTML = (lang === 'en' && EN[k]) ? EN[k] : PL[k];
    });
    root.setAttribute('lang', lang);
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem('akash-lang', lang); } catch (e) {}
  }
  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try { if (localStorage.getItem('akash-lang') === 'en') setLang('en'); } catch (e) {}

  /* ---------- 2. nav + topbar (sticky, on-dark, pasek postępu) ---------- */
  var topbar = document.querySelector('.topbar');
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var showroom = document.querySelector('.showroom');

  function onScroll() {
    var sy = window.pageYOffset;
    topbar.classList.toggle('is-scrolled', sy > 12);
    if (showroom) topbar.classList.toggle('on-dark', sy + 64 >= showroom.offsetTop);
    var max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--p', max > 0 ? Math.min(1, sy / max) : 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open'); toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. reveal ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); } });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---------- 4. dynamiczny kolor galerii (kolor płynie per płyta) ---------- */
  var halls = document.querySelectorAll('.hall');
  if ('IntersectionObserver' in window && halls.length) {
    var hallObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = en.target.dataset;
        if (d.accent) root.style.setProperty('--accent', d.accent);
        if (d.accent2) root.style.setProperty('--accent2', d.accent2);
        if (d.bg && showroom) showroom.style.setProperty('--sr-bg', d.bg);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    halls.forEach(function (h) { hallObs.observe(h); });
  }

  /* ---------- 5. spotlight za kursorem (tylko w galerii) ---------- */
  var spot = document.querySelector('.spotlight');
  if (showroom && spot && !touch) {
    var galObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) { document.body.classList.toggle('in-gallery', en.isIntersecting); });
    }, { threshold: 0, rootMargin: '-8% 0px -8% 0px' });
    galObs.observe(showroom);
    window.addEventListener('mousemove', function (e) {
      if (!document.body.classList.contains('in-gallery')) return;
      spot.style.setProperty('--mx', (e.clientX / window.innerWidth * 100) + '%');
      spot.style.setProperty('--my', (e.clientY / window.innerHeight * 100) + '%');
    }, { passive: true });
  }

  /* ---------- 6. tilt 3D (portret + okładki) ---------- */
  if (!reduce && !touch) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', (px * 11).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-py * 11).toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- 7. parallax okładek ---------- */
  var paras = document.querySelectorAll('[data-parallax]');
  if (!reduce && paras.length) {
    var ticking = false;
    function parallax() {
      var vh = window.innerHeight;
      paras.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var off = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty('--py', (Math.max(-1, Math.min(1, off)) * -26).toFixed(1) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(parallax); }
    }, { passive: true });
    parallax();
  }

  /* ---------- 8. rok w stopce ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- 9. protect(): anti-copy + anti-rehost (PFL) ---------- */
  (function protect() {
    var ALLOW = ['pflgroup.github.io', 'akash.pl', 'www.akash.pl', 'localhost', '127.0.0.1', ''];
    if (ALLOW.indexOf(location.hostname) === -1) {
      try { document.documentElement.innerHTML = ''; } catch (e) {}
      location.replace('https://www.pflgroup.pl'); return;
    }
    function inField(t) { return t && t.closest && t.closest('input,textarea,[contenteditable]'); }
    document.addEventListener('contextmenu', function (e) { if (!inField(e.target)) e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { if (e.target && e.target.tagName === 'IMG') e.preventDefault(); });
    ['copy', 'cut'].forEach(function (ev) { document.addEventListener(ev, function (e) { if (!inField(e.target)) e.preventDefault(); }); });
    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      if (e.key === 'F12') { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && (k === 'u' || k === 's') && !inField(e.target)) { e.preventDefault(); }
    });
  })();

})();
