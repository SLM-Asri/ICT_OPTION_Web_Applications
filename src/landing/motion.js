/* ICT OPTION landing page motion: ported from the supplied landing page (main, effects, animations, scene).
   initLanding(root) starts everything and returns a cleanup function, so it can run inside a React route. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

export function initLanding(ROOT) {
  const ac = new AbortController(), timers = [], obs = [];
  let alive = true;
  const opt = (o) => ({ ...(o && typeof o === "object" ? o : { capture: !!o }), signal: ac.signal });
  const addEventListener = (t, f, o) => window.addEventListener(t, f, opt(o));
  const docListen = (t, f, o) => document.addEventListener(t, f, opt(o));
  const requestAnimationFrame = (f) => (alive ? window.requestAnimationFrame(f) : 0);
  const setT = (f, ms) => { const id = window.setTimeout(f, ms); timers.push(id); return id; };
  const setI = (f, ms) => { const id = window.setInterval(f, ms); timers.push(id); return id; };
  const IO = class extends IntersectionObserver { constructor(...a) { super(...a); obs.push(this); } };
  const RO = class extends ResizeObserver { constructor(...a) { super(...a); obs.push(this); } };

  /* Motion mode: on by default; if the OS asks for reduced motion it starts off and a banner offers to turn it on. */
  let pref = null; try { pref = localStorage.getItem("ict-motion"); } catch (e) {}
  const os = matchMedia("(prefers-reduced-motion: reduce)").matches, reduceNow = pref === "off" || (pref !== "on" && os);
  window.ICT = { reduce: reduceNow, os, pref };
  if (reduceNow) ROOT.classList.add("rm");
  window.gsap = gsap; window.ScrollTrigger = ScrollTrigger; window.Lenis = Lenis; window.THREE = THREE;
  ROOT.classList.remove("ld-ready");

/* ---- main.js ---- */

(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.ICT ? window.ICT.reduce : false;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  $('#year').textContent = new Date().getFullYear();

  // Motion switch (choice remembered; reloads to apply)
  const mBtn = $('#motionBtn'), note = $('#motionNote'), setPref = v => { try { localStorage.setItem('ict-motion', v); } catch (e) {} location.reload(); };
  const on = !reduce;
  mBtn.setAttribute('aria-pressed', on); $('#motionTxt').textContent = on ? 'Motion on' : 'Motion off';
  mBtn.addEventListener('click', () => setPref(on ? 'off' : 'on'));
  if (reduce && window.ICT && window.ICT.os && !window.ICT.pref) note.hidden = false;
  $('#motionOn').addEventListener('click', () => setPref('on'));
  $('#motionX').addEventListener('click', () => { note.hidden = true; });

  // Typing rotator under the hero copy
  const rot = $('#rot'), words = ['websites', 'mobile apps', 'AI solutions', 'secure systems', 'cloud platforms', 'digital growth'];
  if (rot && !reduce) {
    let w = 0, c = words[0].length, del = true, hold = 20;
    setI(() => {
      if (hold > 0) { hold--; return; }
      if (del) { c--; if (c <= 0) { del = false; w = (w + 1) % words.length; c = 0; } }
      else { c++; if (c >= words[w].length) { del = true; hold = 16; } }
      rot.textContent = words[w].slice(0, c) || '\u200b';
    }, 95);
  }

  // Inline line icons
  const P = {
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    ai: '<rect x="4" y="6" width="16" height="12" rx="3"/><path d="M12 2v4M9 11v2M15 11v2"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    cloud: '<path d="M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18z"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z"/>',
    trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    layers: '<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>'
  };
  $$('.ico[data-i]').forEach(el => el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${P[el.dataset.i] || ''}</svg>`);

  // Loader: short counter, never blocks long (hard failsafe at 3s)
  const loader = $('#loader');
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    ROOT.classList.add('ready');
    const hide = () => { loader.classList.add('done'); window.ictIntro && window.ictIntro(); };
    if (window.gsap && !reduce) gsap.to(loader, { yPercent: -100, duration: .9, ease: 'expo.inOut', onComplete: hide });
    else hide();
  };
  if (reduce) finish();
  else {
    const num = $('#ldNum'), bar = $('#ldBar'), t0 = performance.now(), dur = 1300;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(e * 100); bar.style.transform = `scaleX(${e})`;
      p < 1 ? requestAnimationFrame(step) : finish();
    };
    requestAnimationFrame(step); setT(finish, 3000);
  }

  // Header, progress, back-to-top
  const header = $('#header'), bar = $('#progress'), toTop = $('#toTop');
  let tick = false;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    const past = y > innerHeight * .85 - 80;
    header.classList.toggle('scrolled', past);
    header.classList.toggle('on-dark', !past || ROOT.classList.contains('lock'));
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    toTop.classList.toggle('show', y > 800); tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  const goTo = (target, opts = {}) => {
    if (window.lenis) window.lenis.scrollTo(target, { offset: -(parseInt(getComputedStyle(ROOT).getPropertyValue('--head')) || 76) + 1, duration: 1.4, ...opts });
    else (typeof target === 'number' ? scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' }) : target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
  };
  toTop.addEventListener('click', () => goTo(0, { offset: 0 }));

  // Full-screen menu
  const btn = $('#menuBtn'), ov = $('#overlay'), txt = $('#menuTxt');
  const setMenu = open => {
    ov.classList.toggle('open', open); ov.setAttribute('aria-hidden', !open);
    btn.setAttribute('aria-expanded', open); txt.textContent = open ? 'Close' : 'Menu';
    ROOT.classList.toggle('lock', open); document.body.style.overflow = open ? 'hidden' : '';
    onScroll();
    window.lenis && (open ? window.lenis.stop() : window.lenis.start());
    if (open) setT(() => $('a', ov).focus(), 300);
  };
  btn.addEventListener('click', () => setMenu(!ov.classList.contains('open')));
  docListen('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('open')) { setMenu(false); btn.focus(); } });

  // Anchor links (smooth, closes menu)
  docListen('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault();
    const wasOpen = ov.classList.contains('open');
    if (wasOpen) setMenu(false);
    setT(() => goTo(t), wasOpen ? 450 : 0);
    history.replaceState(null, '', id);
  });

  // FAQ
  const btns = $$('#acc button');
  btns.forEach((b, i) => {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') === 'true';
      btns.forEach(x => { x.setAttribute('aria-expanded', 'false'); $('#' + x.getAttribute('aria-controls')).classList.remove('open'); });
      if (!open) { b.setAttribute('aria-expanded', 'true'); $('#' + b.getAttribute('aria-controls')).classList.add('open'); }
      setT(() => window.ScrollTrigger && ScrollTrigger.refresh(), 450);
    });
    b.addEventListener('keydown', e => {
      const k = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: btns.length - 1 }[e.key];
      if (k !== undefined) { e.preventDefault(); btns[(k + btns.length) % btns.length].focus(); }
    });
  });

  // Custom cursor, project preview and magnetic buttons (fine pointers only)
  if (fine && !reduce) {
    ROOT.classList.add('has-cursor');
    const dot = $('#cDot'), ring = $('#cRing'), label = $('#cLabel'), peek = $('#peek');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, px = mx, py = my, peekOn = false;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
    const loop = () => {
      rx += (mx - rx) * .18; ry += (my - ry) * .18; px += (mx - px) * .1; py += (my - py) * .1;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      if (peekOn) peek.style.transform = `translate(${px}px,${py}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('a,button,input,select,textarea,summary').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
    $$('.ld-row').forEach(row => {
      row.addEventListener('mouseenter', () => {
        ring.classList.add('ld-label'); label.textContent = row.dataset.cursor || 'View';
        peek.style.background = row.dataset.img ? `url(${row.dataset.img}) center/cover` : `linear-gradient(135deg,${row.dataset.a},${row.dataset.b})`;
        peekOn = true; peek.style.opacity = 1;
      });
      row.addEventListener('mouseleave', () => { ring.classList.remove('ld-label'); label.textContent = ''; peekOn = false; peek.style.opacity = 0; });
    });
    // Magnetic pull
    $$('.mag').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)'; el.style.transform = ''; setT(() => el.style.transition = '', 500); });
    });
  }
})();


/* ---- effects.js ---- */

(() => {
  'use strict';
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.ICT ? window.ICT.reduce : false;
  const saveData = navigator.connection && navigator.connection.saveData;

  // Videos: WebM or MP4 chosen by browser support; poster remains if nothing plays
  const canWebm = !!document.createElement('video').canPlayType('video/webm; codecs="vp9"');
  $$('video.vbg').forEach(v => {
    const host = v.parentElement;
    const fail = () => { host.classList.add('no-video'); v.style.display = 'none'; };
    const srcs = v.querySelectorAll('source');
    if (srcs.length) srcs[srcs.length - 1].addEventListener('error', fail); else v.addEventListener('error', fail);
    v.addEventListener('playing', () => { host.classList.add('has-video'); host.classList.remove('no-video'); }, { once: true });
    if (reduce || saveData) return; // poster stays as a static backdrop
    new IO(es => es.forEach(en => {
      if (en.isIntersecting) {
        if (v.dataset.src && !v.getAttribute('src')) {
          const base = v.dataset.src.replace(/\.mp4$/, '');
          v.src = base + (canWebm ? '.webm' : '.mp4'); v.load();
        }
        const p = v.play(); p && p.catch(() => {});
      } else v.pause();
    }), { threshold: .1 }).observe(host);
  });

  // Spotlight that follows the pointer inside marked sections
  if (!reduce) $$('[data-spot]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });

  // 3D tilt on service panels (mouse only)
  if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transition = 'transform .1s';
      el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)'; el.style.transform = ''; });
  });
})();


/* ---- animations.js ---- */

(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.ICT ? window.ICT.reduce : false;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scrolling (Lenis) synced to ScrollTrigger
  if (window.Lenis && !reduce) {
    const lenis = new Lenis({ lerp: .09, smoothWheel: true });
    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const words = el => {
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w" aria-hidden="true"><span class="wi">${w}</span></span>`).join(' ');
    return $$('.wi', el);
  };

  // Text scramble (hero eyebrow)
  const scramble = el => {
    if (!el) return; const txt = el.textContent, ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', o = { p: 0 };
    gsap.to(o, { p: 1, duration: 1.4, ease: 'none', onUpdate: () => {
      const n = Math.floor(o.p * txt.length);
      el.textContent = txt.slice(0, n) + txt.slice(n).replace(/[^ ]/g, () => ch[Math.floor(Math.random() * 26)]);
    }, onComplete: () => el.textContent = txt });
  };

  // Hero entrance, called by the loader when it finishes
  let played = false;
  window.ictIntro = () => {
    if (played) return; played = true;
    if (reduce) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    scramble($('.ld-hero .ld-eyebrow'));
    tl.from('.hero-h .ln > span', { yPercent: 115, duration: 1.3, stagger: .12 })
      .from('.hero-video', { scale: 1.2, duration: 2.4, ease: 'power3.out' }, 0)
      .from('[data-hero]', { y: 28, opacity: 0, duration: 1, stagger: .1 }, '-=.9')
      .from('#bg3d', { opacity: 0, duration: 1.6 }, 0)
      .from('.site-header', { yPercent: -100, duration: .9 }, .3);
  };
  if (ROOT.classList.contains('ready')) window.ictIntro();

  if (reduce) return;

  // Headline word reveals
  $$('[data-split]').forEach(el => {
    gsap.from(words(el), { yPercent: 110, duration: 1, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  // Fade-up elements
  $$('[data-up]').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

  // Statement: words light up with scroll
  const st = $('.scrub');
  if (st) {
    st.setAttribute('aria-label', st.textContent.trim());
    st.innerHTML = st.textContent.trim().split(/\s+/).map(w => `<span class="sw" aria-hidden="true">${w}</span>`).join(' ');
    gsap.fromTo($$('.sw', st), { opacity: .15 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  }

  // Marquee speeds up with scroll velocity
  $$('.mq').forEach(m => { m.style.animationPlayState = 'running'; });
  ScrollTrigger.create({ onUpdate: s => { const v = Math.min(Math.abs(s.getVelocity()) / 400, 6); $$('.mq').forEach(m => m.getAnimations().forEach(a => a.updatePlaybackRate(1 + v))); } });

  // Counters
  $$('.count').forEach(el => {
    const to = +el.dataset.to, o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) }) });
  });

  // About image: parallax + reveal
  const img = $('.about-media img');
  if (img) {
    gsap.from(img, { clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: img, start: 'top 85%', once: true } });
    gsap.fromTo(img, { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: img, scrub: true } });
  }

  // Services: pinned horizontal scroll on desktop
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const sec = $('.hs'), track = $('.hs-track');
    sec.classList.add('hs-on');
    const dist = () => Math.max(track.scrollWidth - innerWidth, 0);
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, pin: true, scrub: 1, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true } });
    return () => sec.classList.remove('hs-on');
  });
  mm.add('(max-width: 899px)', () => {
    gsap.from('.pn', { y: 50, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.hs-track', start: 'top 85%', once: true } });
  });

  // Work rows & steps stagger
  gsap.from('.ld-row', { y: 50, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.rows', start: 'top 85%', once: true } });

  // Why-list progress line
  gsap.to('#lineFill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 70%', end: 'bottom 60%', scrub: true } });

  // Showcase text drifts against the background; CTA headline scales in
  gsap.fromTo('.show-in', { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '#showcase', scrub: true } });
  gsap.from('.cta-h', { scale: .85, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 85%', end: 'top 25%', scrub: true } });

  // Hero fades and drifts while the video parallaxes
  gsap.to('.hero-in', { opacity: 0, y: -80, ease: 'none', scrollTrigger: { trigger: '.ld-hero', start: 'top top', end: '70% top', scrub: true } });
  gsap.to('.hero-video', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.ld-hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Reel: card expands to full bleed, video eases out of a zoom
  gsap.fromTo('.reel-box', { clipPath: 'inset(10% 14% round 32px)' }, { clipPath: 'inset(0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '.ld-reel', start: 'top 90%', end: 'top 10%', scrub: true } });
  gsap.fromTo('.ld-reel .vbg', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.ld-reel', start: 'top 90%', end: 'bottom 30%', scrub: true } });
  gsap.from('.reel-txt', { y: 60, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: '.ld-reel', start: 'top 40%', end: 'top 10%', scrub: true } });

  // Process: stacked cards shrink as the next one slides over
  mm.add('(min-width: 900px)', () => {
    $$('.ld-steps li').slice(0, -1).forEach((li, i, all) => {
      gsap.to(li, { scale: .92, opacity: .55, ease: 'none', scrollTrigger: { trigger: $$('.ld-steps li')[i + 1], start: 'top 75%', end: 'top 25%', scrub: true } });
    });
  });

  // Dark sections open up like the reel
  ['.showcase', '.cta'].forEach(sel => gsap.fromTo(sel, { clipPath: 'inset(6% 4% round 40px)' }, { clipPath: 'inset(0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: sel, start: 'top 95%', end: 'top 35%', scrub: true } }));
  // Aurora blobs parallax
  $$('.aurora i').forEach((b, i) => gsap.to(b, { yPercent: (i % 2 ? -40 : 40), ease: 'none', scrollTrigger: { trigger: b.closest('section'), scrub: true } }));

  // Chips float and follow the mouse at different depths
  if (matchMedia('(hover:hover)').matches) {
    const chips = $$('.ld-chip');
    chips.forEach((c, i) => gsap.to(c, { y: i % 2 ? -12 : 12, duration: 3 + i * .4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    const qx = chips.map(c => gsap.quickTo(c, 'x', { duration: 1.2, ease: 'power3' }));
    addEventListener('mousemove', e => { const nx = e.clientX / innerWidth - .5; chips.forEach((c, i) => qx[i](-nx * (+c.dataset.depth))); }, { passive: true });
  }
  // Marquee skews with scroll velocity
  const skew = gsap.quickTo('.ld-marquee .mq', 'skewX', { duration: .5, ease: 'power3' });
  ScrollTrigger.create({ onUpdate: s => skew(gsap.utils.clamp(-12, 12, s.getVelocity() / -120)) });
  ScrollTrigger.addEventListener('scrollEnd', () => skew(0));
  // CTA headline splits into letters for the hover wave
  $$('.cta-h .wi').forEach(w => { w.innerHTML = [...w.textContent].map(c => `<span class="ch">${c}</span>`).join(''); });
  // Section headings drift slightly against scroll
  $$('.head h2, .why-l h2').forEach(h => gsap.fromTo(h, { y: 30 }, { y: -30, ease: 'none', scrollTrigger: { trigger: h, scrub: true } }));
  // Showcase capability pills pop in one by one
  gsap.from('.caps li', { scale: .6, opacity: 0, stagger: .12, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: '.caps', start: 'top 90%', once: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();


/* ---- scene.js ---- */

(() => {
  'use strict';
  const reduce = window.ICT ? window.ICT.reduce : false;
  const mobile = innerWidth < 700;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ---------- Hero: morphing particle sphere → torus with connecting lines ---------- */
  (function hero() {
    const canvas = document.getElementById('bg3d');
    if (!canvas) return;
    if (!window.THREE) { canvas.remove(); return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true }); } catch (e) { canvas.remove(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, .1, 100);
    cam.position.z = 8;

    const N = mobile ? 650 : 1500, A = new Float32Array(N * 3), B = new Float32Array(N * 3), pos = new Float32Array(N * 3);
    const R = 2.4, G = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = G * i;
      A.set([Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R], i * 3);
      const u = ((i * .6180339) % 1) * Math.PI * 2, v = ((i * .7548776) % 1) * Math.PI * 2, tr = 3 + .9 * Math.cos(v);
      B.set([tr * Math.cos(u) * .9, .9 * Math.sin(v) * 1.2, tr * Math.sin(u) * .9], i * 3);
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const points = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x39D8FF, size: mobile ? .045 : .035, transparent: true, opacity: .85 }));

    // Connection lines between nearby nodes (subset of points)
    const M = mobile ? 90 : 170, idx = [], pairs = [];
    for (let k = 0; k < M; k++) idx.push(Math.floor(((k * 0.6180339 + .13) % 1) * N));
    for (let a = 0; a < M; a++) for (let b = a + 1; b < M; b++) {
      const i = idx[a] * 3, j = idx[b] * 3;
      if (Math.hypot(A[i] - A[j], A[i + 1] - A[j + 1], A[i + 2] - A[j + 2]) < 1.35) pairs.push([idx[a], idx[b]]);
    }
    const lp = new Float32Array(pairs.length * 6), lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(lp, 3));
    const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x087BFF, transparent: true, opacity: .75 }));
    const group = new THREE.Group(); group.add(points, lines); scene.add(group);

    let w = 1, h = 1, tx = 0, ty = 0, visible = true, raf = 0;
    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect(); w = r.width; h = r.height;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); draw(performance.now());
    };
    let rip = -1;
    canvas.parentElement.addEventListener('pointerdown', () => { rip = performance.now(); });
    addEventListener('mousemove', e => { tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); }, { passive: true });

    function draw(t) {
      const p = clamp(scrollY / (innerHeight * .9), 0, 1), e = p * p * (3 - 2 * p), s = t * .001;
      for (let i = 0; i < N * 3; i += 3) {
        const wave = reduce ? 0 : Math.sin(s * .8 + A[i] * 1.5 + A[i + 2]) * .045;
        let k = 0;
        if (rip > 0) { const rt = (t - rip) * .004, rr = Math.hypot(A[i], A[i + 1], A[i + 2]), d = rr - rt * 3.2; k = Math.exp(-d * d * 2) * .5 * Math.max(0, 1 - rt / 2); if (rt > 2) rip = -1; }
        pos[i] = A[i] * (1 + k) + (B[i] - A[i]) * e + wave; pos[i + 1] = A[i + 1] * (1 + k) + (B[i + 1] - A[i + 1]) * e + wave; pos[i + 2] = A[i + 2] * (1 + k) + (B[i + 2] - A[i + 2]) * e;
      }
      pg.attributes.position.needsUpdate = true;
      pairs.forEach(([a, b], k) => { lp.set([pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2], pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]], k * 6); });
      lg.attributes.position.needsUpdate = true;
      const side = w > 900 ? (1 - e) * 2.3 : 0;
      group.position.set(side, w > 900 ? 0 : -2.1 + e * 2.1, 0);
      group.rotation.y = reduce ? .6 : s * .12 + tx * .8 + p * 2.2;
      group.rotation.x = ty * .5 + p * .5;
      group.scale.setScalar(w > 900 ? .88 : .62);
      renderer.render(scene, cam);
    }
    const loop = t => { if (visible) draw(t); raf = requestAnimationFrame(loop); };
    new IO(es => { visible = es[0].isIntersecting; }).observe(canvas.parentElement);
    new RO(resize).observe(canvas.parentElement);
    resize();
    if (!reduce) raf = requestAnimationFrame(loop);
    else addEventListener('scroll', () => draw(0), { passive: true });
    addEventListener('pagehide', () => { cancelAnimationFrame(raf); renderer.dispose(); });
  })();

  /* ---------- Showcase: flow-field "video" background + optional real video ---------- */
  (function showcase() {
    const sec = document.getElementById('showcase'), c = document.getElementById('flow');
    if (!sec || !c) return;
    const ctx = c.getContext('2d'), n = mobile ? 90 : 240, ps = [];
    let W = 0, H = 0, visible = false, t = 0;
    const size = () => { W = c.width = sec.clientWidth; H = c.height = sec.clientHeight; ctx.fillStyle = '#061329'; ctx.fillRect(0, 0, W, H); };
    size(); addEventListener('resize', size);
    for (let i = 0; i < n; i++) ps.push({ x: Math.random() * 1600, y: Math.random() * 900, h: Math.random() });
    const frame = () => {
      ctx.fillStyle = 'rgba(6,19,41,.07)'; ctx.fillRect(0, 0, W, H);
      for (const p of ps) {
        const a = Math.sin(p.x * .003 + t) * Math.cos(p.y * .0035 - t * .7) * Math.PI * 2;
        p.x += Math.cos(a) * 1.6; p.y += Math.sin(a) * 1.6;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) { p.x = Math.random() * W; p.y = Math.random() * H; }
        ctx.fillStyle = p.h > .5 ? 'rgba(0,215,242,.9)' : 'rgba(8,123,255,.9)'; ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }
      t += .004;
    };
    if (reduce) { for (let i = 0; i < 260; i++) frame(); }
    else {
      const loop = () => { if (visible) frame(); requestAnimationFrame(loop); };
      new IO(es => { visible = es[0].isIntersecting; }).observe(sec); loop();
    }
  })();
})();


  return () => {
    alive = false; ac.abort(); timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); obs.forEach((o) => o.disconnect());
    ScrollTrigger.getAll().forEach((t) => t.kill(true)); gsap.globalTimeline.clear();
    if (window.lenis) { window.lenis.destroy(); window.lenis = null; }
    ROOT.classList.remove("rm", "ready", "lock", "has-cursor"); document.body.style.overflow = "";
    document.querySelectorAll("html.lenis,html.lenis-smooth").forEach((h) => h.classList.remove("lenis", "lenis-smooth", "lenis-stopped"));
  };
}
