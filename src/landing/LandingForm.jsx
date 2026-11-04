import { useState } from "react";
import site from "../content/site.json";

const OPTIONS = ["Web Development", "Mobile App Development", "AI & Machine Learning", "Cybersecurity", "Cloud Solutions", "IT Consulting", "Digital Marketing", "Business Software & Automation"];
const RULES = {
  name: (v) => v.trim().length >= 2 || "Enter your full name.",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Enter a valid email address, like name@example.com.",
  service: (v) => !!v || "Choose a service.",
  subject: (v) => v.trim().length >= 3 || "Enter a subject.",
  message: (v) => v.trim().length >= 10 || "Enter a message of at least 10 characters.",
  consent: (v) => v === "on" || "Please tick the box so we can reply to you.",
};
function Field({ id, label, type = "text", area, optional, err, check, children }) {
  const common = { id, name: id, "aria-describedby": id + "-err", "aria-invalid": !!err[id], onBlur: (e) => RULES[id] && check(id, e.target.value) };
  return (
    <div className="ld-f"><label htmlFor={id}>{label}{optional ? "" : " *"}</label>
      {area ? <textarea rows={5} {...common} /> : children ? <select {...common}>{children}</select> : <input type={type} {...common} />}
      <small className="err" id={id + "-err"} role="alert">{err[id]}</small></div>
  );
}
/* Posts to site.formEndpoint (src/content/site.json). Until it is set, the form validates and says sending is not configured. */
export default function LandingForm() {
  const [err, setErr] = useState({}), [status, setStatus] = useState(null), [busy, setBusy] = useState(false);
  const check = (name, value) => { const r = RULES[name]?.(value); const ok = r === true || r === undefined; setErr((e) => ({ ...e, [name]: ok ? "" : r })); return ok; };
  async function submit(e) {
    e.preventDefault(); if (busy) return;
    const f = e.currentTarget, data = Object.fromEntries(new FormData(f));
    if (data.website) return; // honeypot
    const ok = Object.keys(RULES).map((n) => check(n, data[n] || "")).every(Boolean);
    if (!ok) return setStatus({ ok: false, msg: "Please fix the highlighted fields." });
    if (!site.formEndpoint) return setStatus({ ok: false, msg: "Sending is not set up yet. Please email or call us." });
    setBusy(true);
    try {
      const res = await fetch(site.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...data, source: "landing", page: location.pathname }) });
      if (!res.ok) throw new Error();
      f.reset(); setStatus({ ok: true, msg: "Thank you! Your message has been sent. We will reply soon." });
    } catch { setStatus({ ok: false, msg: "Sorry, that did not send. Please email or call us." }); }
    setBusy(false);
  }
  const p = { err, check };
  return (
    <form className="ld-form" id="contactForm" noValidate onSubmit={submit}>
      <div style={{ position: "absolute", left: -9999 }} aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
      <Field id="name" label="Full Name" {...p} /><Field id="email" label="Email Address" type="email" {...p} /><Field id="company" label="Company Name (optional)" optional {...p} />
      <Field id="service" label="Service Interest" {...p}><option value="">Select a service</option>{OPTIONS.map((o) => <option key={o}>{o}</option>)}</Field>
      <Field id="subject" label="Subject" {...p} /><Field id="message" label="Message" area {...p} />
      <div className="ld-f"><label htmlFor="consent" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><input id="consent" type="checkbox" name="consent" style={{ width: 18, height: 18, marginTop: 4 }} onChange={(e) => check("consent", e.target.checked ? "on" : "")} />
        <span>I agree to ICT Option using my details to reply to this message (see the <a href="/privacy" style={{ textDecoration: "underline" }}>Privacy Policy</a>).</span></label>
        <small className="err" role="alert">{err.consent}</small></div>
      <button className="ld-btn ld-btn-primary" id="submitBtn" type="submit" disabled={busy}>{busy ? "Sending…" : "Send Message"}</button>
      <p className={"status" + (status ? (status.ok ? " ok" : " bad") : "")} id="formStatus" role="status" aria-live="polite">{status && status.msg}</p>
    </form>
  );
}
