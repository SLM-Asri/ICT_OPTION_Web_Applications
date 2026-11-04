import { Link } from "react-router-dom";
import blog from "../content/blog.json";
import { Btn, Btns, Closing, Hero, Sec } from "../lib.jsx";

export const Post = ({ slug }) => {
  const p = blog.find((x) => x.slug === slug);
  return (<>
    <Hero cls="hero--short" eyebrow={`${p.category} · ${p.readTime}`} h1={p.title} sub={p.excerpt} />
    <Sec><article className="legal">{p.body.map((x, i) => <p key={i}>{x}</p>)}</article></Sec>
    <Closing text="Need help with this?"><Btn to="/contact">Talk to us</Btn></Closing>
  </>);
};
export const NotFound = () => (
  <section className="nf"><div className="container"><span className="eyebrow">Error 404</span><h1>Lost in <em>Cyberspace?</em></h1><p className="sub">This page doesn't exist, but your next project could.</p>
    <Btns style={{ justifyContent: "center" }}><Btn to="/">Take Me Home</Btn><Btn to="/contact" variant="secondary">Contact Us</Btn></Btns></div></section>
);
export const ThankYou = () => <section className="nf"><div className="container"><h1>Thank you!</h1><p className="sub">We'll reply within 24 hours.</p><Btn to="/">Back to Home</Btn></div></section>;
