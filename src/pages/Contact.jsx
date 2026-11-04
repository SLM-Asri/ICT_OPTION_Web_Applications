import { useEffect, useState } from "react";
import site from "../content/site.json";
import svc from "../content/services.json";
import { T } from "../lib.jsx";
import { Consent, Field, Row, Wizard } from "../components/forms.jsx";

const tiles = [["web-development", "Web"], ["mobile-apps", "Mobile App"], ["ai-automation", "AI"], ["digital-marketing", "Marketing"], ["cybersecurity", "Security"], ["it-consulting", "Consulting"], ["optivision", "OptiVision"], ["erp", "ERP"], ["partnership", "Partnership"], ["other", "Something else"]];
export function EnquiryForm({ short }) {
  const [svcPick, setSvc] = useState("");
  useEffect(() => {
    const q = (new URLSearchParams(location.search).get("service") || "").toLowerCase(); if (!q) return;
    const hit = tiles.find((t) => t[0] === q || t[1].toLowerCase() === q) || tiles.find((t) => svc.some((s) => s.name.toLowerCase() === q && s.slug === t[0])) || (/optivision|imaging|photo/.test(q) ? tiles.find((t) => t[0] === "optivision") : /erp/.test(q) ? tiles.find((t) => t[0] === "erp") : null);
    if (hit) setSvc(hit[0]);
  }, []);
  const ex = (k, node) => <div className="extra" hidden={svcPick !== k}>{node}</div>;
  if (short) return <Wizard source="home-contact" sendLabel="Send Message" steps={[{ node: <>
    <Field id="name" label="Name" required /><Field id="phone" label="Phone/WhatsApp" type="tel" required placeholder="+94 7X XXX XXXX" /><Field id="email" label="Email" type="email" required />
    <Field id="service" label="Service">{svc.map((s) => <option key={s.slug}>{s.name}</option>)}<option>OptiVision</option><option>ERP Solutions</option></Field>
    <Field id="message" label="Message" required area /><Consent id="cs" /></> }]} />;
  return <Wizard source="contact-page" stepper sendLabel="Send My Enquiry" steps={[
    { legend: "Step 1 · What can we help you with?", node: <>
      <div className="tiles">{tiles.map((x) => <label className="tile" key={x[0]}><input type="radio" name="service" value={x[0]} checked={svcPick === x[0]} onChange={() => setSvc(x[0])} /><span>{x[1]}</span></label>)}</div>
      {ex("web-development", <><Field id="hasSite" label="Do you have a website already?"><option>No</option><option>Yes</option></Field><Field id="webType" label="Type"><option>Business</option><option>Online Store</option><option>Custom System</option></Field></>)}
      {ex("mobile-apps", <Field id="platform" label="Platform"><option>Android</option><option>iOS</option><option>Both</option></Field>)}
      {ex("digital-marketing", <div className="chips">{["Facebook", "Instagram", "TikTok", "Google"].map((x) => <label className="consent" key={x}><input type="checkbox" name="platforms" value={x} /> {x}</label>)}</div>)}
      {ex("optivision", <><Field id="eventType" label="Event type" /><Field id="eventDate" label="Event date" type="date" /><Field id="eventLoc" label="Location" /></>)}
      {ex("erp", <><Field id="bizType" label="Business type" /><Field id="staff" label="Number of staff" type="number" min="1" /></>)}</> },
    { legend: "Step 2 · Your details", node: <>
      <Row><Field id="name" label="Full Name" required /><Field id="phone" label="Phone/WhatsApp" type="tel" required placeholder="+94 7X XXX XXXX" /><Field id="email" label="Email" type="email" required /><Field id="company" label="Company (optional)" /></Row>
      <Field id="budget" label="Budget range (optional, LKR)">{["Not sure", "Under 50K", "50K–150K", "150K–500K", "500K+"].map((x) => <option key={x}>{x}</option>)}</Field>
      <Field id="message" label="Message" required area /><Field id="preferred" label="Preferred contact" required><option>WhatsApp</option><option>Call</option><option>Email</option></Field><Consent id="cc" /></> }]} />;
}
export function LiveBadge() {
  const [on, setOn] = useState(null);
  useEffect(() => {
    const n = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
    setOn(site.hours.some((h) => h.days.includes(n.getDay()) && n.getHours() >= h.open && n.getHours() < h.close));
  }, []);
  if (on === null) return null;
  return <span className={`badge${on ? "" : " off"}`}>{on ? "We're online now · usually reply within 1 hour" : "☾ We're offline · we'll reply first thing tomorrow"}</span>;
}
