import { Link } from "react-router-dom";
import ov from "../content/optivision.json";
import site from "../content/site.json";
import Imported, { ImpHero } from "../components/Imported.jsx";
import { Consent, Field, Row, Wizard } from "../components/forms.jsx";
import { EnquiryForm, LiveBadge } from "./Contact.jsx";
import { Btn, Btns } from "../lib.jsx";

const Page = ({ page, forms, home, skip, heroExtra }) => (<><ImpHero page={page} home={home} extra={heroExtra} /><Imported page={page} forms={forms} skip={skip} /></>);

const BookForm = () => (
  <Wizard source="optivision-booking" stepper sendLabel="Send Booking Request" steps={[
    { legend: "1 · Category", node: <div className="tiles">{ov.categories.map((c, i) => <label className="tile" key={c.slug}><input type="radio" name="category" value={c.name} defaultChecked={i === 0} /><span>{c.name}<br /><small>{c.what}</small></span></label>)}</div> },
    { legend: "2 · Event type and date", node: <><Field id="eventType" label="Event type" required /><Field id="eventDate" label="Event date" type="date" required /></> },
    { legend: "3 · Location and guests", node: <><Field id="location" label="Location" required /><Field id="guests" label="Guest count" type="number" /></> },
    { legend: "4 · Package and add-ons", node: <><div className="chips">{["Drone", "Live stream", "360° booth", "QR guest gallery", "AI album"].map((x) => <label className="consent" key={x}><input type="checkbox" name="addons" value={x} /> {x}</label>)}</div><Field id="package" label="Preferred package (optional)" /></> },
    { legend: "5 · Contact details", node: <><Row><Field id="name" label="Full Name" required /><Field id="phone" label="Phone/WhatsApp" type="tel" required /><Field id="email" label="Email" type="email" required /></Row><Consent id="cb" /></> }]} />
);
const ErpForm = () => (
  <Wizard source="erp-demo" sendLabel="Book My Demo" steps={[{ node: <><Row><Field id="name" label="Name" required /><Field id="business" label="Business name" required /><Field id="phone" label="Phone/WhatsApp" type="tel" required /><Field id="email" label="Email" type="email" required /><Field id="staff" label="Number of staff" type="number" /></Row><Consent id="ce" /></> }]} />
);
const PartnerForm = () => (
  <Wizard source="Partnership" sendLabel="Send" steps={[{ node: <><Row><Field id="org" label="Organisation" required /><Field id="type" label="Type" /><Field id="name" label="Contact person" required /><Field id="phone" label="Phone" type="tel" required /><Field id="email" label="Email" type="email" required /></Row><Field id="message" label="Message" area /><Consent id="cp" /></> }]} />
);
const short = <EnquiryForm short />, full = <EnquiryForm />;

export const Home = () => <Page page="index" home forms={{ default: short }} heroExtra={<p className="trust">{site.stats.years} Years Experience · {site.stats.projects} Projects Delivered · {site.stats.clients} Happy Clients · {site.stats.team}-Member Dev Team</p>} />;
export const ServicesIndex = () => <Page page="services" forms={{ default: short }} />;
export const ServicePage = ({ slug }) => <Page page={`services/${slug}`} forms={{ default: short }} />;
export const OptivisionHome = () => <Page page="optivision" forms={{ default: short }} />;
export const OptivisionCategory = ({ slug }) => <Page page={`optivision/${slug}`} forms={{ default: short }} />;
export const Gallery = () => <Page page="optivision/gallery" />;
export const Book = () => <Page page="optivision/book" forms={{ default: <BookForm /> }} />;
export const Erp = () => <Page page="erp" forms={{ default: <ErpForm /> }} />;
export const Work = () => <Page page="our-work" />;
export const CaseStudy = () => <Page page="our-work/case-study" />;
export const About = () => <Page page="about" />;
export const Partners = () => <Page page="partners" forms={{ default: <PartnerForm /> }} />;
export const Reviews = () => <Page page="reviews" />;
export const Careers = () => <Page page="careers" forms={{ default: short }} />;
export const Insights = () => <Page page="insights" forms={{ default: short }} />;
export const Contact = () => <Page page="contact" forms={{ default: full }} heroExtra={site.hoursConfirmed ? <LiveBadge /> : null} />;
export const Legal = ({ slug }) => <Page page={slug} />;
