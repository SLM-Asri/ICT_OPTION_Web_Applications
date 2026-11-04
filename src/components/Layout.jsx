import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import site from "../content/site.json";
import svc from "../content/services.json";
import ov from "../content/optivision.json";
import { Btn, Btns, Icon, T, wa, tel } from "../lib.jsx";

const aboutLinks = [["About Us", "/about"], ["Partners", "/partners"], ["Reviews", "/reviews"], ["Careers", "/careers"], ["Giving Back", "/about#giving-back"]];
const socialIcon = (label) => ({
  facebook: "facebook",
  linkedin: "linkedin",
  instagram: "instagram",
  tiktok: "tiktok",
  youtube: "youtube"
}[label.toLowerCase()] || "globe");

function Drop({ id, label, children, wide }) {
  const [open, setOpen] = useState(false);
  return (
    <li onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{label} <Icon n="down" /></button>
      <div className={wide ? "mega" : "drop"} id={id} hidden={!open}>{children}</div>
    </li>
  );
}
function Header({ wa: waMsg }) {
  const [scrolled, setScrolled] = useState(false), [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { const f = () => setScrolled(scrollY > 40); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  useEffect(() => { setMenu(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; const k = (e) => e.key === "Escape" && setMenu(false); addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [menu]);
  const A = ({ to, children }) => <li><NavLink to={to} end={to === "/"}>{children}</NavLink></li>;
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`header${scrolled ? " scrolled" : ""}`}><div className="container nav">
        <Link className="logo" to="/"><img src="/assets/img/logo-full.png" alt="ICT Option home" width="120" height="44" /></Link>
        <ul className="menu" aria-label="Main">
          <A to="/">Home</A>
          <Drop id="mega" label="Services" wide>
            <div className="mega-tiles">{svc.map((s) => <Link key={s.slug} to={`/services/${s.slug}`}><span style={{ color: "var(--cyan)" }}><Icon n={s.icon} /></span><b>{s.name}</b><small>{s.card.split(",")[0].replace(/\.$/, "")}</small></Link>)}</div>
            <div className="mega-hl"><b>New: OptiVision. Smart Imaging. Sharper Stories.</b><Btn to="/optivision" variant="secondary">Explore OptiVision</Btn></div>
            <p className="mega-foot">Not sure what you need? <Link className="link" to="/contact">Find your tech gap →</Link></p>
          </Drop>
          <A to="/optivision">OptiVision</A><A to="/erp">ERP</A><A to="/our-work">Our Work</A>
          <Drop id="about-d" label="About">{aboutLinks.map((l) => <Link key={l[1]} to={l[1]}>{l[0]}</Link>)}</Drop>
        </ul>
        <div className="nav-actions"><a className="icon-btn" href={wa(waMsg)} aria-label="Chat on WhatsApp"><Icon n="wa" /></a><Btn to="/contact">Contact Us</Btn></div>
        <button className="burger" type="button" aria-label="Open menu" aria-expanded={menu} aria-controls="mobile" onClick={() => setMenu(true)}><Icon n="menu" /></button>
      </div></header>
      <AnimatePresence>
        {menu && (
          <>
            <motion.button
              type="button"
              className="mobile-backdrop"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenu(false)}
            />
            <motion.nav
              className="mobile open"
              id="mobile"
              aria-label="Mobile"
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            >
              <button className="mobile-close" type="button" aria-label="Close menu" onClick={() => setMenu(false)}>×</button>
              <div className="mobile-brand">
                <img src="/assets/img/logo-full.png" alt="ICT Option" width="120" height="44" />
              </div>
              <Link to="/">Home</Link>
              <details><summary>Services</summary>{svc.map((s) => <Link key={s.slug} to={`/services/${s.slug}`}>{s.name}</Link>)}</details>
              <Link to="/optivision">OptiVision</Link><Link to="/erp">ERP</Link><Link to="/our-work">Our Work</Link>
              <details><summary>About</summary>{aboutLinks.map((l) => <Link key={l[1]} to={l[1]}>{l[0]}</Link>)}</details>
              <div className="mobile-cta"><Btn to={wa()}>WhatsApp Us</Btn><Btn to={tel} variant="secondary">Call</Btn><Btn to="/contact" variant="secondary">Get a Quote</Btn></div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container foot-grid">
        <div><img src="/assets/img/logo-full.png" alt="ICT Option" width="140" height="52" loading="lazy" /><p>{site.tagline}</p>
          <div className="social">{site.social.filter((s) => s.url).map((s) => <a key={s.label} href={s.url} aria-label={s.label} target="_blank" rel="noopener noreferrer"><Icon n={socialIcon(s.label)} /></a>)}<a href={wa()} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><Icon n="wa" /></a></div></div>
        <div><h2>Services</h2><ul>{svc.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.name}</Link></li>)}</ul></div>
        <div><h2>OptiVision</h2><ul>{[...ov.categories.map((c) => [c.name, c.slug]), ["Gallery", "gallery"], ["Book a Shoot", "book"]].map((x) => <li key={x[1]}><Link to={`/optivision/${x[1]}`}>{x[0]}</Link></li>)}</ul></div>
        <div><h2>Company</h2><ul>{site.quickLinks.map((l) => <li key={l.route}><Link to={`/${l.route}`}>{l.label}</Link></li>)}</ul></div>
        <div><h2>Contact</h2><ul><li><a href={tel}>{site.phone}</a></li><li><a href={`mailto:${site.email}`}>{site.email}</a></li><li>{site.address}</li><li><T>{site.hoursText}</T></li></ul></div>
      </div>
      <div className="container copy"><span>© {new Date().getFullYear()} ICT Option (Pvt) Ltd · {site.legal.map((l, i) => <span key={l.route}>{i > 0 && " · "}<Link to={`/${l.route}`}>{l.label}</Link></span>)}</span><span>{site.tag[0]}</span></div>
    </footer>
  );
}
function Cookie() {
  const [show, setShow] = useState(false), ref = useRef(null);
  useEffect(() => { try { if (!localStorage.getItem("ict-consent")) setShow(true); } catch { setShow(true); } }, []);
  useEffect(() => { document.body.style.setProperty("--cb", show && ref.current ? ref.current.offsetHeight + "px" : "0px"); document.body.classList.toggle("has-cookie", show); }, [show]);
  const pick = (v) => { try { localStorage.setItem("ict-consent", v); } catch {} setShow(false); if (v === "all") document.dispatchEvent(new Event("ict:analytics")); };
  if (!show) return null;
  return (
    <div className="cookie" data-lenis-prevent ref={ref} role="region" aria-label="Cookie consent"><span>We use cookies to improve your experience. <Link className="link" to="/cookies">Cookie Policy</Link></span>
      <Btns><button className="btn btn-primary" type="button" onClick={() => pick("all")}>Accept</button><button className="btn btn-secondary" type="button" onClick={() => pick("necessary")}>Only necessary</button></Btns></div>
  );
}
/* reveal-on-scroll, counters, OPTION letters: once, skipped for reduced motion */
/* counters and OPTION letters (once); reveal/scroll motion lives in src/motion/site.js */
function useEnhance(key) {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = [...document.querySelectorAll("[data-count],.values")];
    if (reduce || !("IntersectionObserver" in window)) { document.querySelectorAll(".values .card").forEach((c) => c.classList.add("on")); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; const t = e.target; io.unobserve(t);
      if (t.dataset.count) { const end = +t.dataset.count, s = performance.now(); const f = (n) => { const k = Math.min(1, (n - s) / 1500); t.textContent = Math.round(end * k) + (t.dataset.suffix || ""); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }
      else if (t.classList.contains("values")) t.querySelectorAll(".card").forEach((c, i) => setTimeout(() => c.classList.add("on"), i * 350));
    }), { threshold: 0.15 });
    els.forEach((n) => { if (n.dataset.count) n.textContent = "0"; io.observe(n); });
    return () => io.disconnect();
  }, [key]);
}
function useMotion(pathname) {
  const m = useRef(null), prev = useRef(pathname), [ready, setReady] = useState(false);
  useEffect(() => { let dead = false; import("../motion/site.js").then((mod) => { if (!dead) { m.current = mod.createMotion(); setReady(true); } }); return () => { dead = true; m.current?.destroy(); m.current = null; }; }, []);
  useEffect(() => { if (!ready || !m.current) return; if (prev.current !== pathname) { m.current.scrollTop?.(); prev.current = pathname; } return m.current.page(); }, [pathname, ready]);
}
export default function Layout({ route, children }) {
  const { pathname, hash } = useLocation();
  const [top, setTop] = useState(false);
  useEnhance(pathname);
  useMotion(pathname);
  useEffect(() => { const f = () => setTop(scrollY > innerHeight); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else scrollTo(0, 0); }, [pathname, hash]);
  return (
    <div className={route.cls || ""}>
      <div className="scroll-progress" aria-hidden="true" />
      <Header wa={route.wa} />
      <main id="main">{children}</main>
      {!route.noPre && <aside className="prefooter"><div className="container"><h2>Have a project in mind?</h2><Btns><Btn to="/contact">Get a Free Quote</Btn><Btn to={wa()} variant="secondary">WhatsApp Us</Btn></Btns></div></aside>}
      <Footer />
      <a className="float wa" href={wa(route.wa)} aria-label="Chat with us on WhatsApp"><Icon n="wa" /></a>
      <button className={`float top${top ? " show" : ""}`} type="button" aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}><Icon n="up" /></button>
      <Cookie />
    </div>
  );
}
