/* Site-wide motion (GSAP + ScrollTrigger + Lenis). Loaded after hydration; the HTML is complete without it.
   Everything is skipped when the visitor prefers reduced motion. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
const fine = () => matchMedia("(hover:hover) and (pointer:fine)").matches;
const q = (s, r = document) => gsap.utils.toArray(s, r);
/* elements that rise in as they enter the screen */
const RISE = ".card,.step,.chip,.stat,.feature,.timeline__item,.job,.price-card,.gal,.gallery-ph,.tile,.flip,.reveal,.faq-item,.values .card,.team .flip,.ov-card,.ov-tile,.mini-stat,.result-tile,.stock,.form>div,.extra";
const PAGE_ENTRY = "main > *, .section, .section-head, .imp-blocks > *, .rich, .chips, .btns, .band, .feature, .job, .review, .partner, .result-card, .mini-stat, .result-tile, .faq-item, .timeline__item, .stat, .values .card";

/* wrap every word in a mask so it can slide up; keeps <em> gradient words intact */
function words(el) {
  if (el.dataset.split) return q(".wi", el);
  el.dataset.split = "1"; el.setAttribute("aria-label", el.textContent.trim());
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((t) => {
        if (!t) return;
        if (/^\s+$/.test(t)) return f.appendChild(document.createTextNode(" "));
        const w = document.createElement("span"), i = document.createElement("span");
        w.className = "w"; w.setAttribute("aria-hidden", "true"); i.className = "wi"; i.textContent = t; w.appendChild(i); f.appendChild(w);
      });
      node.replaceChild(f, n);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(el); return q(".wi", el);
}
function scramble(el) {
  if (!el || el.dataset.scr) return; el.dataset.scr = "1";
  const txt = el.textContent, ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", o = { p: 0 };
  gsap.to(o, { p: 1, duration: 1.1, ease: "none", onUpdate: () => { const n = Math.floor(o.p * txt.length); el.textContent = txt.slice(0, n) + txt.slice(n).replace(/[^ ·]/g, () => ch[Math.floor(Math.random() * 26)]); }, onComplete: () => { el.textContent = txt; } });
}

export function createMotion() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis = null, tick = null, ctx = null, first = true; const off = [];
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true }); window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    tick = (t) => lenis.raf(t * 1000); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);

    /* buttons: magnetic pull (mouse) and press ripple */
    const on = (t, f) => { document.addEventListener(t, f, { passive: true }); off.push(() => document.removeEventListener(t, f)); };
    if (fine()) {
      on("pointermove", (e) => {
        const b = e.target.closest?.(".btn"); if (b) { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.32, duration: 0.3, ease: "power3.out", overwrite: "auto" }); }
        const c = e.target.closest?.(".card"); if (c) { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); }
      });
      on("pointerout", (e) => { const b = e.target.closest?.(".btn"); if (b && !b.contains(e.relatedTarget)) gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.45)", overwrite: "auto" }); });
    }
    on("pointerdown", (e) => {
      const b = e.target.closest?.(".btn"); if (!b) return;
      const r = b.getBoundingClientRect(), s = document.createElement("span"), d = Math.max(r.width, r.height) * 2;
      s.className = "ripple"; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      b.appendChild(s); setTimeout(() => s.remove(), 700);
    });
  }
  const refresh = () => ScrollTrigger.refresh();
  addEventListener("load", refresh); off.push(() => removeEventListener("load", refresh));

  return {
    page() {
      if (reduce) return () => {};
      document.documentElement.classList.add("motion-on");
      ctx?.revert();
      ctx = gsap.context(() => {
        const nav = !first; first = false;
        if (nav) gsap.from("main", { opacity: 0, y: 16, duration: 0.55, ease: "power2.out", clearProps: "opacity,transform" });

        /* scroll progress + header that tucks away while scrolling down */
        gsap.to(".scroll-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 } });
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { const h = document.querySelector(".header"); if (h) h.classList.toggle("hide", s.direction === 1 && s.scroll() > 260 && !document.body.style.overflow); } });

        /* hero: eyebrow scramble, headline words, copy and visual stagger, parallax */
        const hero = document.querySelector(".hero");
        if (hero) {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          scramble(hero.querySelector(".eyebrow"));
          const vis = q(".hero-visual", hero);
          const hw = hero.querySelector("h1") ? words(hero.querySelector("h1")) : [];
          gsap.set(hero.querySelectorAll("h1,.eyebrow,.sub,.btns,.trust,.tools,.badge,.crumbs,.hero-visual"), { opacity: 1 });
          if (hw.length) tl.from(hw, { yPercent: 115, duration: 1.1, stagger: 0.06 }, 0.1);
          const top = q(".crumbs,.badge,.eyebrow", hero), copy = q(".sub,.btns,.trust,.tools", hero);
          if (top.length) tl.from(top, { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0);
          if (copy.length) tl.from(copy, { y: 26, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: "opacity,transform" }, 0.5);
          if (vis.length) tl.from(vis, { opacity: 0, x: 40, scale: 0.96, duration: 1.2, clearProps: "opacity,transform" }, 0.4);
          const bg = q(".hero__bg img,.hero__bg video", hero), art = q(".service-art__img,.hero__bg img", hero);
          if (art.length) gsap.from(art, { scale: 1.12, duration: 2, ease: "power3.out" });
          if (bg.length) gsap.to(bg, { yPercent: 14, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
          if (vis.length) gsap.to(vis, { y: -50, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
        }

        /* section headings: words slide up, intro fades in, headline drifts slightly */
        q(".section-head").forEach((h) => {
          const h2 = h.querySelector("h2");
          if (h2) gsap.from(words(h2), { yPercent: 110, duration: 1, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%", once: true } });
          gsap.from(h.querySelectorAll(".eyebrow,.sub"), { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", clearProps: "opacity,transform", scrollTrigger: { trigger: h, start: "top 90%", once: true } });
          if (h2) gsap.fromTo(h2, { y: 20 }, { y: -20, ease: "none", scrollTrigger: { trigger: h, scrub: true } });
        });

        /* components rise in together, in order (cleared afterwards so hover effects still work) */
        const items = q(RISE).filter((el) => !el.closest(".hero,[hidden],.footer,.faq-a,.mobile,.lightbox"));
        gsap.set(items, { opacity: 0, y: 38 });
        ScrollTrigger.batch(items, { start: "top 92%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: "power3.out", clearProps: "opacity,transform" }) });

        /* imported content and page sections should animate consistently across the full project */
        const pageBlocks = q(PAGE_ENTRY).filter((el) => !el.closest(".hero,[hidden],.footer,.faq-a,.mobile,.lightbox") && !el.matches("main > *:first-child") && !el.matches("main > *:last-child"));
        if (pageBlocks.length) {
          gsap.set(pageBlocks, { opacity: 0, y: 26 });
          ScrollTrigger.batch(pageBlocks, { start: "top 94%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "power3.out", clearProps: "opacity,transform" }) });
        }

        /* call-to-action bands open up as they scroll in; lines and steps draw */
        q(".band").forEach((b) => gsap.fromTo(b, { clipPath: "inset(8% 5% round 36px)" }, { clipPath: "inset(0% 0% round 16px)", ease: "none", clearProps: "clipPath", scrollTrigger: { trigger: b, start: "top 95%", end: "top 45%", scrub: true } }));
        q(".steps").forEach((s) => gsap.fromTo(s, { "--line": 0 }, { "--line": 1, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: s, start: "top 80%", once: true } }));
        q(".stock img,.project-card__img,.ov-tile img").forEach((i) => gsap.fromTo(i, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: i, scrub: true } }));
        q(".marquee").forEach((m) => { const skew = gsap.quickTo(m, "skewX", { duration: 0.5, ease: "power3" }); ScrollTrigger.create({ onUpdate: (s) => skew(gsap.utils.clamp(-10, 10, s.getVelocity() / -150)) }); });
        gsap.from(".footer .foot-grid>div", { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", clearProps: "opacity,transform", scrollTrigger: { trigger: ".footer", start: "top 92%", once: true } });
      });
      const late = setTimeout(() => ScrollTrigger.refresh(), 900);
      return () => { clearTimeout(late); ctx?.revert(); ctx = null; };
    },
    scrollTop() { lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0); },
    destroy() {
      off.forEach((f) => f()); ctx?.revert(); ScrollTrigger.getAll().forEach((t) => t.kill(true));
      if (tick) gsap.ticker.remove(tick); lenis?.destroy(); window.__lenis = null;
      document.querySelectorAll("html.lenis").forEach((h) => h.classList.remove("lenis", "lenis-smooth", "lenis-stopped"));
    },
  };
}
