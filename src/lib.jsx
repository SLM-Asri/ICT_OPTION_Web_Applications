import { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";
import site from "./content/site.json";

export const RouteCtx = createContext({ crumbs: null, cls: "" });
export const wa = (m) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(m || site.whatsappMessage)}`;
export const tel = "tel:" + site.phone.replace(/\s/g, "");

/* [[text]] renders as an amber placeholder for content management will supply */
export function T({ children }) {
  return String(children).split(/(\[\[.+?\]\])/g).map((p, i) =>
    /^\[\[.+\]\]$/.test(p) ? <span key={i} className="ph">[{p.slice(2, -2)}]</span> : p);
}
export const Icon = ({ n }) => <svg className="i" aria-hidden="true"><use href={`/assets/img/icons.svg#${n}`} /></svg>;

export function Btn({ to, variant = "primary", children, ...rest }) {
  const cls = `btn btn-${variant}`;
  const inner = <>{children}{variant === "primary" && <> <Icon n="arrow" /></>}</>;
  return /^(https?:|tel:|mailto:)/.test(to)
    ? <a className={cls} href={to} {...rest}>{inner}</a>
    : <Link className={cls} to={to} {...rest}>{inner}</Link>;
}
export const Btns = ({ children, style }) => <div className="btns" style={style}>{children}</div>;

export const Sec = ({ id, alt, children }) => (
  <section className={`section${alt ? " section--alt" : ""}`} id={id}><div className="container">{children}</div></section>
);
export const Head = ({ eyebrow, title, sub, center }) => (
  <div className={`section-head reveal${center ? " center" : ""}`}>
    <span className="eyebrow"><T>{eyebrow}</T></span><h2>{title}</h2>{sub && <p className="sub"><T>{sub}</T></p>}
  </div>
);
export function Crumbs({ items }) {
  if (!items) return null;
  return (
    <nav className="crumbs" aria-label="Breadcrumb"><ol>
      {items.map((c, i) => <li key={i}>{c[1] ? <Link to={c[1]}>{c[0]}</Link> : <span aria-current="page">{c[0]}</span>}</li>)}
    </ol></nav>
  );
}
export function Hero({ cls = "", eyebrow, h1, sub, btns, extra, visual, badge }) {
  const { crumbs } = useContext(RouteCtx);
  return (
    <section className={`hero ${cls}`}><div className="container">
      <div><Crumbs items={crumbs} />{badge}<span className="eyebrow"><T>{eyebrow}</T></span><h1>{h1}</h1>
        <p className="sub"><T>{sub}</T></p>{btns && <Btns>{btns}</Btns>}{extra}</div>
      {visual && <div className="hero-visual">{visual}</div>}
    </div></section>
  );
}
export const Closing = ({ text, children }) => (
  <Sec><div className="band reveal"><h2><T>{text}</T></h2><Btns>{children}</Btns></div></Sec>
);
export function Faqs({ items, id }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">{items.map((q, i) => (
      <div className="faq-item" key={i}>
        <h3><button className="faq-q" type="button" id={`${id}${i}q`} aria-expanded={open === i} aria-controls={`${id}${i}a`} onClick={() => setOpen(open === i ? -1 : i)}>
          <T>{q[0]}</T><Icon n="down" /></button></h3>
        <div className="faq-a" id={`${id}${i}a`} role="region" aria-labelledby={`${id}${i}q`} hidden={open !== i}><p><T>{q[1]}</T></p></div>
      </div>))}
    </div>
  );
}
export const faqLd = (l) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: l.filter((q) => !/\[\[/.test(q[1])).map((q) => ({ "@type": "Question", name: q[0], acceptedAnswer: { "@type": "Answer", text: q[1] } })) });
export function Filters({ items, value, onChange, label }) {
  return (
    <div className="filters" role="group" aria-label={label}>
      {items.map(([k, l]) => <button key={k} className="filter" type="button" aria-pressed={value === k} onClick={() => onChange(k)}>{l}</button>)}
    </div>
  );
}
export const Stats = ({ items }) => (
  <div className="stats">{items.map(([n, l, s], i) => (
    <div className="stat" key={i}><b {...(/^\d+$/.test(n) ? { "data-count": n, "data-suffix": s || "", suppressHydrationWarning: true } : {})}>
      {/^\d+$/.test(n) ? n + (s || "") : <T>{n}</T>}</b><span>{l}</span></div>))}
  </div>
);
