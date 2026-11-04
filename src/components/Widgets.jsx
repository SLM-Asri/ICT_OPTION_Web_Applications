import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Btn, Btns, Icon } from "../lib.jsx";

export const photo = (n) => (n ? (n.includes("/") ? n : `/assets/img/photos/${n}`) : "");

/* Security self-check: 5 yes/no questions, score bar and advice */
const QUIZ = ["Do you use a different password for email, banking and your website admin?", "Is two-factor authentication turned on for your important accounts?", "Do you have automatic backups that you have actually tested restoring?", "Could your staff spot a fake invoice or phishing email?", "Is your website and software updated at least once a month?"];
export function Quiz() {
  const [a, setA] = useState({});
  const done = Object.keys(a).length === QUIZ.length, s = Object.values(a).filter((v) => v === "yes").length;
  const note = !done ? `Answer all ${QUIZ.length} questions to see your score.` : s >= 4 ? "Strong basics. A professional audit will confirm the gaps." : s >= 2 ? "There are gaps an attacker could use. Book a free security check." : "High risk. Let us run a full security check before something happens.";
  return (
    <form className="form-panel quiz" onSubmit={(e) => e.preventDefault()}>
      {QUIZ.map((q, i) => (
        <div className="quiz__q" key={i}><fieldset><legend>{i + 1}. {q}</legend>
          <div className="quiz__opts">{["yes", "no"].map((v) => <label key={v}><input type="radio" name={"q" + i} value={v} checked={a[i] === v} onChange={() => setA({ ...a, [i]: v })} /><span>{v === "yes" ? "Yes" : "No"}</span></label>)}</div></fieldset></div>))}
      <div><div className="quiz__score"><span className="small">Your score</span><strong>{done ? `${s} / ${QUIZ.length}` : "—"}</strong></div>
        <div className="score-bar"><span style={{ width: done ? (s / QUIZ.length) * 100 + "%" : 0 }} /></div><p className="small" aria-live="polite">{note}</p>
        {done && <Btns style={{ marginTop: 16 }}><Btn to="/contact?service=Cybersecurity">Get a Free Security Check</Btn></Btns>}</div>
    </form>
  );
}
/* "Find your tech gap": two answers, one recommendation */
const RECS = {
  enquiries: ["Digital Marketing", "Start with Digital Marketing (+ a clean website)", "If people are not finding you, more posts alone will not fix it. We would look at your Google listing, your website message and a focused local campaign, then measure messages and calls, not likes."],
  paper: ["AI & Automation", "Start with AI & Automation", "Repeated typing, invoices and stock counts are the fastest hours to win back. We would automate one task first, prove the saving, then connect the rest to an ERP or dashboard."],
  website: ["Web Development", "Start with Web Development", "An old site quietly costs you customers every day. We would rebuild it mobile-first, make one clear action obvious, and keep the Google rankings you already have."],
  security: ["Cybersecurity", "Start with Cybersecurity", "Before adding anything new, close the doors you already have. A security audit will show what is urgent, what can wait, and what it costs to fix, in plain language."],
  confused: ["IT Consulting", "Start with IT Consulting", "Too many tools usually means no plan. We would map how your business runs, list what each tool actually does, and give you a short roadmap with costs, including what to stop paying for."],
};
export function TechGap() {
  const [type, setType] = useState(""), [prob, setProb] = useState(""), [rec, setRec] = useState(null);
  return (
    <div className="form-panel">
      <form className="form" onSubmit={(e) => { e.preventDefault(); if (type && prob) setRec(RECS[prob]); }}>
        <div><label htmlFor="tg-type">Your business type</label><select id="tg-type" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select one</option>{["Shop or retail", "Hotel, restaurant or café", "Clinic or school", "Service business", "Online business", "Something else"].map((x) => <option key={x}>{x}</option>)}</select></div>
        <div><label htmlFor="tg-problem">Your biggest problem right now</label><select id="tg-problem" value={prob} onChange={(e) => setProb(e.target.value)} required>
          <option value="">Select one</option><option value="enquiries">Not enough enquiries or customers</option><option value="paper">Too much paperwork and manual work</option><option value="website">Our website is old or doesn't bring business</option><option value="security">We're worried about security or data</option><option value="confused">Too many tools and no clear plan</option></select></div>
        <button className="btn btn-primary" type="submit">Show My Recommendation <Icon n="arrow" /></button>
      </form>
      {rec ? <div className="card" style={{ marginTop: 20 }} aria-live="polite"><span className="eyebrow">Your starting point</span><h3>{rec[1]}</h3><p>{rec[2]}</p><p style={{ marginTop: 16 }}><Btn to={`/contact?service=${encodeURIComponent(rec[0])}`} variant="secondary">Book a Free Call</Btn></p></div>
        : <p className="small" style={{ marginTop: 16 }}>Choose both answers and press the button.</p>}
    </div>
  );
}
export function Chat({ items, name }) {
  const [who, sub] = (name || "Opti ICT Option assistant · online").split(" ICT ");
  return (
    <div className="chat" aria-label="Example AI assistant conversation">
      <div className="chat__head"><span className="ic" style={{ width: 34, height: 34 }}><Icon n="chip" /></span><div><b>Opti</b><br /><span>ICT Option assistant · online</span></div><span className="dot" style={{ marginLeft: "auto" }} /></div>
      <div className="chat__body">{items.map((m, i) => <div key={i} className={`bubble bubble--${m[0]}`}>{m[1]}</div>)}</div>
      <div className="chat__input"><span>Type a message…</span></div>
    </div>
  );
}
export function Phones({ items }) {
  return (
    <div className="phone-strip" role="group" aria-label="Example app screens">
      {items.map((p, i) => (
        <div className="mock-phone" key={i} aria-hidden="true"><div className="screen"><div className="notch" />
          <div className="hero-tile" style={{ height: 120 }}><img src={photo(p.imgs[0][0])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div className="bar w70" /><div className="bar w50" />
          {p.imgs[1] && <div className="stack-row"><span><img src={photo(p.imgs[1][0])} alt="" /></span><span /></div>}
          <div className="caption">{p.cap}</div></div></div>))}
    </div>
  );
}
export function BA({ before, after }) {
  const [v, setV] = useState(50);
  return (
    <div className="ba" role="group" aria-label="Before and after comparison" style={{ "--pos": v + "%" }}>
      <div className="ba__after"><div className="ba__art"><Icon n="wand" /><b>{after[0]}</b><span>{after[1]}</span></div></div>
      <div className="ba__before" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}><div className="ba__art"><Icon n="image" /><b>{before[0]}</b><span>{before[1]}</span></div></div>
      <span className="ba__label ba__label--before">Before</span><span className="ba__label ba__label--after">After</span>
      <span className="ba__handle" style={{ left: v + "%" }} aria-hidden="true" />
      <input type="range" min="0" max="100" value={v} onChange={(e) => setV(+e.target.value)} aria-label="Drag to compare before and after" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "ew-resize" }} />
    </div>
  );
}
/* Filterable gallery with lightbox (keyboard: Esc, arrows) */
export function Gallery({ items, kind }) {
  const cats = ["all", ...new Set(items.map((i) => (i.cat || i.tag || "").toLowerCase()).filter(Boolean))];
  const [f, setF] = useState("all"), [open, setOpen] = useState(-1);
  const shown = items.filter((i) => f === "all" || (i.cat || i.tag || "").toLowerCase() === f);
  useEffect(() => {
    if (open < 0) return;
    const k = (e) => { if (e.key === "Escape") setOpen(-1); if (e.key === "ArrowRight") setOpen((o) => (o + 1) % shown.length); if (e.key === "ArrowLeft") setOpen((o) => (o - 1 + shown.length) % shown.length); };
    addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, shown.length]);
  return (
    <>
      {cats.length > 2 && <div className="filters" role="group" aria-label="Filter gallery">{cats.map((c) => <button key={c} type="button" className="filter" aria-pressed={f === c} onClick={() => setF(c)}>{c === "all" ? "All" : c[0].toUpperCase() + c.slice(1)}</button>)}</div>}
      <div className="gal-grid">{shown.map((g, i) => (
        <button type="button" key={g.img[0] + i} className={`${kind === "gallery" ? "gallery-ph" : "gal"}${i % 5 === 0 ? " gallery-ph--tall" : ""}`} onClick={() => setOpen(i)} style={g.accent?.[0] ? { "--ov-accent": g.accent[0], border: 0, padding: 0, textAlign: "left", font: "inherit" } : { border: 0, padding: 0, textAlign: "left", font: "inherit" }} aria-label={`Open photo: ${g.cap || g.img[1]}`}>
          <span className="tag">{g.tag}</span><div className="ph"><img src={photo(g.img[0])} alt={g.img[1]} loading="lazy" /></div>{g.cap && kind !== "gallery" && <span className="cap">{g.cap}</span>}</button>))}</div>
      {open >= 0 && shown[open] && (
        <div className="lightbox is-open" data-lenis-prevent role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setOpen(-1)}>
          <button className="lightbox__close" type="button" aria-label="Close" onClick={() => setOpen(-1)}>×</button>
          <img src={photo(shown[open].img[0])} alt={shown[open].img[1]} /><p style={{ color: "#fff", textAlign: "center" }}>{shown[open].cap}</p></div>)}
    </>
  );
}
