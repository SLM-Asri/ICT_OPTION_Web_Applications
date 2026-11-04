import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import data from "../content/imported.json";
import site from "../content/site.json";
import { Btn, Btns, Faqs, Head, Icon, RouteCtx, Sec } from "../lib.jsx";
import { LeaderCard } from "./LeaderCard.jsx";
import { BA, Chat, Gallery, Phones, Quiz, TechGap, photo } from "./Widgets.jsx";

const SAMPLE = new Set(["project", "review", "price", "partner", "job", "result", "resulttile", "ministat", "stat", "timeline", "carousel", "marquee"]);
const grad = (s) => String(s || "").split(/(\{\{.+?\}\})/g).map((p, i) => (/^\{\{.+\}\}$/.test(p) ? <em key={i}>{p.slice(2, -2)}</em> : p));
const ic = (n) => (n ? <Icon n={n} /> : null);
const cols = (n) => (n === 2 || n === 4 ? `grid--${n}` : "grid--3");
export const Sample = () => (site.markSamples ? <span className="pill sample" title="Placeholder content from the design draft. Replace with real content before launch.">Sample content</span> : null);

function A({ href, children, className, ...r }) {
  return /^(https?:|tel:|mailto:)/.test(href) ? <a className={className} href={href} {...r}>{children}</a> : <Link className={className} to={href || "/"} {...r}>{children}</Link>;
}
const Stars = ({ n }) => <span className="stars stars--sm" aria-label={`${n} of 5 stars`}>{Array.from({ length: n }, (_, i) => <Icon key={i} n="star" />)}</span>;

function Projects({ items }) {
  const tags = [...new Set(items.map((p) => p.tag).filter(Boolean))], [f, setF] = useState("all"), [more, setMore] = useState(6);
  const list = items.filter((p) => f === "all" || p.tag === f);
  return (
    <>
      {items.length > 6 && tags.length > 1 && <div className="filters" role="group" aria-label="Filter projects">{["all", ...tags].map((t) => <button key={t} type="button" className="filter" aria-pressed={f === t} onClick={() => { setF(t); setMore(6); }}>{t === "all" ? "All" : t}</button>)}</div>}
      <div className="grid grid--3">{list.slice(0, items.length > 6 ? more : 99).map((p, i) => (
        <article className="card project-card reveal" key={p.h + i}><div className="project-card__media"><span className="project-card__tag">{p.tag}</span>{p.img && <img className="project-card__img" src={photo(p.img[0])} alt={p.img[1]} loading="lazy" />}</div>
          <div className="project-card__body"><h3>{p.h}</h3><div className="project-card__meta">{p.meta}</div><p>{p.p}</p>{p.result && <div className="project-card__result">{p.result}</div>}
            {/hotel/i.test(p.h) && <div className="card__foot"><Link className="card__arrow" to="/our-work/hotel-booking-website">View Case Study <Icon n="arrow" /></Link></div>}</div></article>))}</div>
      {items.length > 6 && more < list.length && <Btns style={{ marginTop: 32, justifyContent: "center" }}><button className="btn btn-secondary" type="button" onClick={() => setMore(more + 6)}>Load More</button></Btns>}
    </>
  );
}
function Reviews({ items, grid }) {
  const [i, setI] = useState(0);
  const list = grid ? items : [...items.slice(i), ...items.slice(0, i)];
  return (
    <>
      <div className={grid ? "grid grid--3" : "car"}>{list.map((r, k) => (
        <article className="card review" key={r.name + k}><span className="review__src">{r.src}</span><Stars n={r.stars || 5} /><p className="review__text">“{r.text}”</p>
          <div className="review__person"><span className="avatar">{r.initials}</span><div><div className="review__name">{r.name}</div><div className="review__role">{r.role}</div></div></div>{r.tag && <span className="review__tag">{r.tag}</span>}</article>))}</div>
      {!grid && items.length > 3 && <Btns style={{ marginTop: 20, justifyContent: "center" }}><button className="btn btn-secondary" type="button" onClick={() => setI((i + items.length - 1) % items.length)} aria-label="Previous review">←</button><button className="btn btn-secondary" type="button" onClick={() => setI((i + 1) % items.length)} aria-label="Next review">→</button></Btns>}
    </>
  );
}
function Partners({ items }) {
  const cats = [...new Set(items.map((p) => p.cat).filter(Boolean))], [f, setF] = useState("all");
  return (
    <>
      {cats.length > 1 && <div className="filters" role="group" aria-label="Filter partners">{["all", ...cats].map((c) => <button key={c} className="filter" type="button" aria-pressed={f === c} onClick={() => setF(c)}>{c === "all" ? "All" : c[0].toUpperCase() + c.slice(1)}</button>)}</div>}
      <div className="grid grid--3">{items.filter((p) => f === "all" || p.cat === f).map((p) => (
        <article className="card partner reveal" key={p.h}><div className="logo-box"><span className="logo-box__mark">{ic(p.icon || "code")}</span></div><h3>{p.h}</h3><div className="partner__ty">{p.type}</div><p className="small">{p.p}</p></article>))}</div>
    </>
  );
}
function Block({ b, forms, nav }) {
  const n = b.items?.length || 0;
  switch (b.t) {
    case "rich": return <div className="rich" dangerouslySetInnerHTML={{ __html: b.html }} />;
    case "btns": return <Btns>{b.items.map((x, i) => {
      const label = String(x[0] || "");
      const icon = /facebook/i.test(label) ? "facebook" : /instagram/i.test(label) ? "instagram" : /linkedin/i.test(label) ? "linkedin" : /tiktok/i.test(label) ? "tiktok" : /youtube/i.test(label) ? "youtube" : /whatsapp/i.test(label) ? "wa" : null;
      return <Btn key={i} to={x[1] || "/"} variant={icon ? "secondary" : i ? "secondary" : "primary"}>{icon ? <><Icon n={icon} /> <span>{label}</span></> : label}</Btn>;
    })}</Btns>;
    case "chips": return <ul className="chips">{b.items.map((c, i) => <li className="chip" key={i}>{c}</li>)}</ul>;
    case "faq": return <Faqs items={b.items} id={"i" + Math.abs(b.items[0]?.[0].length || 0)} />;
    case "card": case "feature": case "value": case "ovcard": case "ovtile": case "step": case "timeline": case "job": case "result": case "resulttile": case "ministat": case "stat": case "price": case "gal": case "gallery": case "partner": case "project": case "review": case "flip": break;
    default: break;
  }
  switch (b.t) {
    case "card": return <div className={`grid ${cols(n)}`}>{b.items.map((c, i) => {
      const body = <>{c.icon ? <span className="ic">{ic(c.icon)}</span> : c.img ? <img src={photo(c.img[0])} alt={c.img[1]} loading="lazy" style={{ borderRadius: 12, marginBottom: 16 }} /> : null}<h3>{c.h}</h3>{(c.p || []).map((p, k) => <p key={k}>{p}</p>)}{c.cta && <span className="card__link">{c.cta} <Icon n="arrow" /></span>}</>;
      return c.href ? <A key={i} className="card reveal" href={c.href}>{body}</A> : <div key={i} className="card reveal">{body}</div>; })}</div>;
    case "feature": return <div className="grid grid--2">{b.items.map((c, i) => <div className="feature reveal" key={i}><span className="ic">{ic(c.icon)}</span><div><h4>{c.h}</h4><p>{c.p}</p></div></div>)}</div>;
    case "value": return <div className="values" role="list">{b.items.map((c, i) => <div className="card" role="listitem" key={i}><b className="l">{c.letter}</b><h3>{c.h}</h3><p>{c.p}</p></div>)}</div>;
    case "step": return <ol className="steps">{b.items.map((c, i) => <li className="step reveal" key={i}><h3>{c.h}</h3><p>{c.p}</p></li>)}</ol>;
    case "timeline": return <div className="timeline">{b.items.map((c, i) => <div className="timeline__item reveal" key={i}><span className="timeline__year">{c.year}</span><h3>{c.h}</h3><p>{c.p}</p></div>)}</div>;
    case "job": return <div className="jobs">{b.items.map((j, i) => <article className="job reveal" key={i}><div><h3>{j.h}</h3><p className="small">{j.p}</p><div className="job__meta">{j.meta.map((m, k) => <Fragment key={k}>{k > 0 && <span>·</span>}<span>{m}</span></Fragment>)}</div></div><Link className="btn btn-secondary" to="/contact">Apply</Link></article>)}</div>;
    case "result": return <div className={`grid ${cols(n)}`}>{b.items.map((r, i) => <div className="card result-card reveal" key={i}><strong data-count={r.num} data-suffix={r.suffix} suppressHydrationWarning>{r.num + r.suffix}</strong><span>{r.label}</span>{r.sub && <p className="small">{r.sub}</p>}</div>)}</div>;
    case "resulttile": case "ministat": return <div className={b.t === "ministat" ? "mini-stats" : "result-tiles"}>{b.items.map((r, i) => <div className={b.t === "ministat" ? "mini-stat" : "result-tile"} key={i}><strong>{r.num}</strong><span>{r.label}</span></div>)}</div>;
    case "stat": return <div className="stats">{b.items.map((r, i) => <div className="stat" key={i}><b {...(/^\d+$/.test(r.count || "") ? { "data-count": r.count, suppressHydrationWarning: true } : {})}>{r.num}</b><span>{r.label}</span></div>)}</div>;
    case "price": return <div className={`grid ${cols(n)}`}>{b.items.map((p, i) => <article className={`card price-card reveal${p.featured ? " is-featured" : ""}`} key={i}>{p.badge && <span className="badge">{p.badge}</span>}<h3>{p.h}</h3><p className="small">{p.p}</p><div className="amount">{p.amount}</div><ul>{p.list.map((l, k) => <li key={k}><Icon n="check" /> {l}</li>)}</ul>{p.cta[0] && <Btn to={p.cta[0][1] || "/contact"} variant="secondary">{p.cta[0][0]}</Btn>}</article>)}</div>;
    case "ovcard": return <div className={`grid grid--${n === 4 ? 4 : 3}`}>{b.items.map((c, i) => <Link key={i} className="ov-card reveal" to={c.href} style={c.accent[0] ? { "--ov-accent": c.accent[0] } : undefined}><span className="ov-card__sub">{c.sub}</span><span className="ov-card__name">{c.h}</span><p>{c.p}</p><span className="card__arrow">{c.cta} <Icon n="arrow" /></span></Link>)}</div>;
    case "ovtile": return <div className="grid grid--4">{b.items.map((c, i) => <Link key={i} className="ov-tile reveal" to={c.href} style={c.accent[0] ? { "--ov-accent": c.accent[0] } : undefined}><div className="ph"><img src={photo(c.img?.[0])} alt={c.img?.[1] || ""} loading="lazy" /></div><div className="ov-tile__body"><span className="sub">{c.sub}</span><span className="name">{c.h}</span><p>{c.p}</p><span className="card__arrow">{c.cta} <Icon n="arrow" /></span></div></Link>)}</div>;
    case "gal": case "gallery": return <Gallery items={b.items} kind={b.t} />;
    case "partner": return <Partners items={b.items} />;
    case "project": return <Projects items={b.items} />;
    case "review": return <Reviews items={b.items} grid />;
    case "carousel": return <Reviews items={b.items} />;
    case "flip": return <div className="team">{b.items.map((l, i) => <LeaderCard key={i} ceo={i === 0 && b.items.length > 3} l={{ name: l.h, role: l.role, bio: l.p, power: l.power, quote: l.quote }} />)}</div>;
    case "ceo": return <div className="card" style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(0,200px) 1fr", alignItems: "center" }}>{b.img && <img src={photo(b.img[0])} alt={b.img[1]} style={{ borderRadius: 16 }} loading="lazy" />}<div><h3>{b.h}</h3><p className="small">{b.role}</p><blockquote>“{b.quote}”</blockquote></div></div>;
    case "photos": return <div className="photo-strip">{b.items.map((p, i) => <figure className="stock" key={i}><img src={photo(p[0])} alt={p[1]} loading="lazy" /><figcaption>{p[2]}</figcaption></figure>)}</div>;
    case "chat": return <Chat items={b.items} name={b.name} />;
    case "phones": return <Phones items={b.items} />;
    case "ba": return <BA before={b.before} after={b.after} />;
    case "quiz": return <Quiz />;
    case "marquee": return <div className="marquee" aria-label="Partners"><div>{[...(b.logos?.length ? b.logos : b.items.map((x) => ({ name: x }))), ...(b.logos?.length ? b.logos : b.items.map((x) => ({ name: x })))].map((l, i) => <span className="marquee__item" key={i}>{l.name}</span>)}</div></div>;
    case "callout": return <div className="band reveal"><div>{b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}<h2>{b.h}</h2>{b.p && <p>{b.p}</p>}</div><Btns>{b.btns.map((x, i) => <Btn key={i} to={x[1] || "/"} variant={i ? "secondary" : "primary"}>{x[0]}</Btn>)}</Btns></div>;
    case "intern": return <div className="band reveal"><div><h2>{b.h}</h2><p>{b.p}</p></div><Btns>{b.btns.map((x, i) => <Btn key={i} to={x[1] || "/careers"} variant="secondary">{x[0]}</Btn>)}</Btns></div>;
    case "toc": return <nav className="toc card" aria-label="On this page"><ol>{b.items.map((x, i) => <li key={i}><a href={x[1]}>{x[0]}</a></li>)}</ol></nav>;
    case "form": return b.kind === "techgap" ? <TechGap /> : forms?.[b.kind] || forms?.default || null;
    default: return null;
  }
}
export function ImpHero({ page, cls = "", home, extra, forms }) {
  const hs = data[page].sections.find((s) => s.hero), h = hs?.hero, heroBlocks = (hs?.blocks || []).filter((b) => !["rich", "btns", "chips"].includes(b.t)); const { crumbs } = (page && RouteCtxUse()) || {};
  if (!h) return null;
  const theme = h.theme?.[0];
  return (
    <section className={`hero ${home ? "hero--home" : h.art ? "" : "hero--short"} ${cls}`} style={theme ? { "--theme": theme } : undefined}>
      {home && <div className="hero__bg" aria-hidden="true"><video autoPlay muted loop playsInline poster="/assets/img/photos/server-room.webp" preload="none"><source src="/assets/video/home-hero.mp4" type="video/mp4" /></video><img src="/assets/img/photos/server-room.webp" alt="" width="1400" height="933" fetchpriority="high" /></div>}
      <div className="container">
        <div>{crumbs && <nav className="crumbs" aria-label="Breadcrumb"><ol>{crumbs.map((c, i) => <li key={i}>{c[1] ? <Link to={c[1]}>{c[0]}</Link> : <span aria-current="page">{c[0]}</span>}</li>)}</ol></nav>}
          <span className="eyebrow">{h.eyebrow}</span><h1>{grad(h.h1)}</h1><p className="sub">{h.lead}</p>
          {h.btns?.length > 0 && <Btns>{h.btns.map((x, i) => <Btn key={i} to={x[1] || "/"} variant={i ? "secondary" : "primary"}>{x[0]}</Btn>)}</Btns>}
          {h.tags?.length > 0 && <ul className="tools" style={{ marginTop: 20 }}>{h.tags.map((t) => <li className="tool" key={t}>{t}</li>)}</ul>}{extra}</div>
        {!h.art && heroBlocks.length > 0 && <div className="hero-visual">{heroBlocks.map((b, k) => <Block key={k} b={b} />)}</div>}
        {h.art && <div className="hero-visual"><div className="service-art"><img className="service-art__img" src={photo(h.art[0])} alt={h.art[1]} width="640" height="460" />{h.label && <span className="label">{h.label}</span>}</div></div>}
      </div>
    </section>
  );
}
import { useContext } from "react";
const RouteCtxUse = () => useContext(RouteCtx);
export default function Imported({ page, forms, skip = [], extra }) {
  const nav = useNavigate();
  const secs = data[page].sections.filter((s, i) => !s.hero && !skip.includes(s.id) && !skip.includes(i));
  const onClick = (e) => { const a = e.target.closest(".rich a"); const h = a?.getAttribute("href"); if (h && h.startsWith("/")) { e.preventDefault(); nav(h); } };
  return (
    <div onClick={onClick}>
      {secs.map((s, i) => {
        const bl = s.blocks.filter((b) => !(s.hero && b.t === "chips")), sample = bl.some((b) => SAMPLE.has(b.t));
        if (!s.head && !bl.length) return null;
        return (
          <Sec key={i} id={s.id} alt={s.navy}>
            {s.head && <Head eyebrow={s.head.eyebrow} title={grad(s.head.title)} sub={s.head.lead} center={s.head.center} />}
            {sample && <p><Sample /></p>}
            <div className="imp-blocks">{bl.map((b, k) => <Block key={k} b={b} forms={forms} />)}</div>
          </Sec>
        );
      })}
      {extra}
    </div>
  );
}
