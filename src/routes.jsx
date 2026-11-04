import site from "./content/site.json";
import svc from "./content/services.json";
import ov from "./content/optivision.json";
import blog from "./content/blog.json";
import faq from "./content/faq.json";
import { faqLd } from "./lib.jsx";
import { Home, ServicesIndex, ServicePage, OptivisionHome, OptivisionCategory, Gallery, Book, Erp, Work, CaseStudy, About, Partners, Reviews, Careers, Insights, Contact, Legal } from "./pages/Pages.jsx";
import { Post, NotFound, ThankYou } from "./pages/Misc.jsx";

const R = [];
const add = (path, seo, el) => R.push({ path, ...seo, el });
const legal = (path, title) => add(path, { title: `${title} | ICT Option`, desc: `${title} for ictoption.com.`, crumbs: [["Home", "/"], [title]] }, <Legal slug={path.slice(1)} />);

add("/", { bare: false, title: "ICT Option | Web, Apps, AI, Marketing, Security & OptiVision Imaging | Piliyandala, Sri Lanka", desc: "ICT Option builds websites, mobile apps, AI automation, digital marketing and cybersecurity for Sri Lankan businesses, plus OptiVision professional imaging.",
  schema: [{ "@context": "https://schema.org", "@type": "LocalBusiness", name: "ICT Option (Pvt) Ltd", url: site.baseUrl, telephone: site.phone, email: site.email, image: site.baseUrl + "/assets/img/og-image.png", address: { "@type": "PostalAddress", streetAddress: "59/E, Horana Road, Kesbewa", addressLocality: "Piliyandala", addressCountry: "LK" }, sameAs: site.social.map((s) => s.url).filter(Boolean) }] }, <Home />);
add("/services", { title: "IT Services in Sri Lanka | Web, Apps, AI, Marketing, Security | ICT Option", desc: "Six ways ICT Option powers your business: web development, mobile apps, AI & automation, digital marketing, cybersecurity and IT consulting.", crumbs: [["Home", "/"], ["Services"]] }, <ServicesIndex />);
svc.forEach((s) => add(`/services/${s.slug}`, { title: `${s.name} in Sri Lanka | ICT Option`, desc: `${s.hero}. ${s.lead}`.slice(0, 155), img: s.image, wa: `Hi ICT Option! I'm interested in ${s.name}.`, crumbs: [["Home", "/"], ["Services", "/services"], [s.name]],
  schema: [{ "@context": "https://schema.org", "@type": "Service", name: s.name, provider: { "@type": "LocalBusiness", name: "ICT Option (Pvt) Ltd" }, areaServed: "LK", description: s.lead }] }, <ServicePage slug={s.slug} />));
add("/optivision", { title: "OptiVision | Professional Photography, Video & Drone in Sri Lanka | ICT Option", desc: "OptiVision by ICT Option: wedding and event films, product and corporate photography, drone shots and AI editing. Smart imaging, sharper stories.", cls: "ov", wa: "Hi ICT Option! I'd like to know about OptiVision.", crumbs: [["Home", "/"], ["OptiVision"]] }, <OptivisionHome />);
ov.categories.forEach((c) => add(`/optivision/${c.slug}`, { title: `OptiVision ${c.name}: ${c.what} | ICT Option`, desc: `${c.hero}. ${c.cover}`.slice(0, 155), img: c.image, cls: `ov ov-${c.slug}`, wa: `Hi ICT Option! I'm interested in OptiVision ${c.name}.`, crumbs: [["Home", "/"], ["OptiVision", "/optivision"], [c.name]] }, <OptivisionCategory slug={c.slug} />));
add("/optivision/gallery", { title: "OptiVision Gallery | Weddings, Product, Aerial & Edits | ICT Option", desc: "Browse OptiVision photography and video: weddings, corporate, drone and AI editing.", cls: "ov", crumbs: [["Home", "/"], ["OptiVision", "/optivision"], ["Gallery"]] }, <Gallery />);
add("/optivision/book", { title: "Book an OptiVision Shoot | ICT Option", desc: "Request a booking for wedding, corporate, drone or editing services. We confirm availability within 24 hours.", cls: "ov", crumbs: [["Home", "/"], ["OptiVision", "/optivision"], ["Book a Shoot"]] }, <Book />);
add("/erp", { title: "ERP Solutions for Sri Lankan Businesses | ICT Option", desc: "One system for sales, stock, staff and accounts, built for how Sri Lankan businesses really work.", wa: "Hi ICT Option! I'm interested in the ERP system.", crumbs: [["Home", "/"], ["ERP Solutions"]] }, <Erp />);
add("/our-work", { title: "Our Work | Real Projects, Real Results | ICT Option", desc: "Projects ICT Option has delivered for Sri Lankan businesses: websites, apps, AI, marketing, security and OptiVision.", crumbs: [["Home", "/"], ["Our Work"]] }, <Work />);
add("/our-work/hotel-booking-website", { title: "Hotel Booking Website | Case Study | ICT Option", desc: "How ICT Option built a direct-booking hotel website with WhatsApp enquiries, live in 14 days.", img: "/assets/img/photos/hotel.webp", crumbs: [["Home", "/"], ["Our Work", "/our-work"], ["Hotel Booking Website"]] }, <CaseStudy />);
add("/about", { title: "About ICT Option | Sri Lankan IT Company, Piliyandala", desc: "Our story, mission, values and leadership. ICT Option helps Sri Lankan businesses grow with smart technology and trains the next generation of tech talent.", crumbs: [["Home", "/"], ["About"]] }, <About />);
add("/partners", { title: "Our Partners | ICT Option", desc: "The organisations ICT Option collaborates with to deliver better solutions for Sri Lankan businesses.", crumbs: [["Home", "/"], ["Partners"]] }, <Partners />);
add("/reviews", { title: "Client Reviews | ICT Option", desc: "What businesses we've worked with say about ICT Option.", crumbs: [["Home", "/"], ["Reviews"]] }, <Reviews />);
add("/contact", { title: "Contact ICT Option | Piliyandala, Sri Lanka", desc: "WhatsApp, call, email or visit ICT Option in Piliyandala. Tell us what you need and we reply within 24 hours.", noPre: true, crumbs: [["Home", "/"], ["Contact"]], schema: [faqLd(faq.contact)] }, <Contact />);
add("/careers", { title: "Careers & Internships | ICT Option", desc: "Join a growing Sri Lankan tech team. Open roles and the Anuradhapura internship programme.", crumbs: [["Home", "/"], ["Careers"]] }, <Careers />);
add("/insights", { title: "Insights | Tech Tips for Sri Lankan Businesses | ICT Option", desc: "Practical tips on websites, apps, marketing and cybersecurity for Sri Lankan business owners.", crumbs: [["Home", "/"], ["Insights"]] }, <Insights />);
blog.forEach((p) => add(`/insights/${p.slug}`, { title: `${p.title} | ICT Option`, desc: p.excerpt, img: p.image, crumbs: [["Home", "/"], ["Insights", "/insights"], [p.title]], schema: [{ "@context": "https://schema.org", "@type": "Article", headline: p.title, datePublished: p.date, author: { "@type": "Organization", name: "ICT Option" } }] }, <Post slug={p.slug} />));
legal("/privacy", "Privacy Policy");
legal("/terms", "Terms of Service");
legal("/cookies", "Cookie Policy");
add("/thank-you", { title: "Thank You | ICT Option", desc: "We received your message.", noindex: true }, <ThankYou />);

export const routes = R;
export const notFound = { path: "*", title: "Page Not Found | ICT Option", desc: "This page does not exist.", noindex: true, el: <NotFound /> };
