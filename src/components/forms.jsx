import { createContext, useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import site from "../content/site.json";
import { wa, T } from "../lib.jsx";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, PHONE = /^\+?[0-9\s().-]{7,20}$/;
const Ctx = createContext({});

export function Field({ id, label, type = "text", required, area, children, ...rest }) {
  const { errors } = useContext(Ctx), e = errors[id];
  const common = { id, name: id, required, "aria-invalid": e ? true : undefined, "aria-describedby": e ? id + "-e" : undefined, className: e ? "is-invalid" : "", "data-label": label.toLowerCase(), ...rest };
  return (
    <div><label htmlFor={id}>{label}{required && " *"}</label>
      {area ? <textarea rows={4} {...common} /> : children ? <select {...common}>{children}</select> : <input type={type} {...common} />}
      {e && <p className="field-error" id={id + "-e"} role="alert">{e}</p>}</div>
  );
}
export function Consent({ id }) {
  const { errors } = useContext(Ctx);
  return (
    <div><label className="consent" htmlFor={id}><input type="checkbox" id={id} name="consent" required data-label="consent" />
      <span>I agree to ICT Option using my details to reply to this enquiry, as described in the <Link className="link" to="/privacy">Privacy Policy</Link>.</span></label>
      {errors[id] && <p className="field-error" role="alert">{errors[id]}</p>}</div>
  );
}
const msg = (el) => {
  if (el.closest("[hidden]")) return "";
  const v = el.value.trim(), l = el.dataset.label || "this field";
  if (el.type === "checkbox") return el.required && !el.checked ? "Please tick the box to continue." : "";
  if (el.type === "radio") return "";
  if (el.required && !v) return `Please enter your ${l}.`;
  if (v && el.type === "email" && !EMAIL.test(v)) return "Please enter a valid email address.";
  if (v && el.type === "tel" && !PHONE.test(v)) return "Please enter a valid phone number (+94 format).";
  return "";
};

/* Generic multi-step form. `steps` = [{legend, node}] (one step = plain form). Posts JSON to site.formEndpoint when set. */
export function Wizard({ source, steps, sendLabel = "Send", stepper, children }) {
  const ref = useRef(null);
  const [cur, setCur] = useState(0), [errors, setErrors] = useState({}), [sent, setSent] = useState(null), [fail, setFail] = useState(false);
  const last = cur === steps.length - 1;
  const check = (scope) => {
    const out = {}; let first;
    scope.querySelectorAll("input,select,textarea").forEach((el) => {
      const m = msg(el); if (m) { out[el.id || el.name] = m; first = first || el; }
    });
    setErrors(out); if (first) first.focus(); return !first;
  };
  const stepEls = () => [...ref.current.querySelectorAll("[data-step]")];
  const next = () => { if (check(stepEls()[cur] || ref.current)) setCur(cur + 1); };
  async function submit(e) {
    e.preventDefault();
    if (!last) return next();
    const fd = new FormData(ref.current);
    if (fd.get("website")) return;
    if (!check(ref.current)) return;
    const data = Object.fromEntries(fd); data.source = source; data.page = location.pathname; data.utm = location.search;
    try {
      if (site.formEndpoint) await fetch(site.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setSent(String(data.name || "").split(" ")[0]);
    } catch { setFail(true); }
  }
  if (sent !== null) return (
    <div className="success" tabIndex={-1} ref={(n) => n && n.focus()}><h2>Thank You{sent ? `, ${sent}` : ""}!</h2>
      <p>{source.includes("booking") ? "We've received your booking request. We'll confirm availability within 24 hours." : "Your enquiry is in. Our team will contact you within 24 hours."}</p>
      <p><a className="btn btn-secondary" href={wa()}>Chat with us on WhatsApp now</a></p></div>
  );
  return (
    <Ctx.Provider value={{ errors }}>
      {stepper && <ol className="stepper" aria-hidden="true">{steps.map((_, i) => <li key={i} className={i <= cur ? "done" : ""} />)}</ol>}
      <form className="form" noValidate ref={ref} onSubmit={submit}>
        <div className="hp" aria-hidden="true"><label>Leave empty <input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        {steps.map((s, i) => (
          <fieldset key={i} data-step hidden={i !== cur}>{s.legend && <legend className="eyebrow">{s.legend}</legend>}{s.node}</fieldset>
        ))}
        {children}
        <div className="btns">
          {cur > 0 && <button className="btn btn-secondary" type="button" onClick={() => setCur(cur - 1)}>Back</button>}
          {!last && <button className="btn btn-primary" type="button" onClick={next}>Next</button>}
          {last && <button className="btn btn-primary" type="submit">{sendLabel}</button>}
        </div>
        {fail && <p className="field-error" role="alert">Sorry, that did not send. Please WhatsApp us instead.</p>}
        <p className="small">Your details are safe with us. We never share your information. <Link className="link" to="/privacy">Privacy Policy</Link></p>
      </form>
    </Ctx.Provider>
  );
}
export const Row = ({ children }) => <div className="row">{children}</div>;
