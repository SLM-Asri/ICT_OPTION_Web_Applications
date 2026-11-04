import { useEffect, useRef } from "react";
import site from "../content/site.json";
import "../styles/landing.css";
import LandingForm from "./LandingForm.jsx";

/* Motion landing page (single-page style). All animation runs in ./motion.js after the page has loaded;
   the HTML below is complete on its own, so search engines and no-JS visitors still get the content. */
export default function Landing() {
  const root = useRef(null);
  useEffect(() => {
    let stop = () => {}, gone = false;
    import("./motion.js").then((m) => { if (!gone && root.current) stop = m.initLanding(root.current); });
    return () => { gone = true; stop(); };
  }, []);
  return (
    <div className="ld" ref={root}>

<a className="skip" href="#main">Skip to content</a>

<div className="loader" id="loader" aria-hidden="true"><img className="ld-logo" src="/assets/landing/images/ict-option-logo.png" alt="" width="150" height="129" /><div className="ld-num"><span id="ldNum">0</span><small>%</small></div><div className="ld-bar"><i id="ldBar"></i></div><p>ICT OPTION</p></div>
<div className="progress" id="progress" aria-hidden="true"></div>
<div className="cursor" id="cDot" aria-hidden="true"></div><div className="cursor ld-ring" id="cRing" aria-hidden="true"><span id="cLabel"></span></div>
<div className="peek" id="peek" aria-hidden="true"></div>

<header className="site-header" id="header">
  <a className="brand" href="#home" aria-label="ICT OPTION home"><img src="/assets/landing/images/ict-option-logo.png" alt="ICT OPTION" width="52" height="45" /></a>
  <div className="hd-right"><a className="ld-btn ld-btn-primary mag" href="#contact">Let's Talk</a>
  <button className="menu-btn mag" id="menuBtn" aria-expanded="false" aria-controls="overlay"><span id="menuTxt">Menu</span><i></i></button></div>
</header>

<nav className="overlay" id="overlay" aria-label="Primary" aria-hidden="true">
  <ul>
    <li><a href="#home"><span>Home</span></a></li><li><a href="#about"><span>About Us</span></a></li><li><a href="#services"><span>Services</span></a></li>
    <li><a href="#products"><span>Products</span></a></li><li><a href="#projects"><span>Projects</span></a></li><li><a href="#contact"><span>Contact</span></a></li>
  </ul>
  <div className="ov-info"><p>{site.email}</p><p>{site.phone}</p><p>{site.address}</p></div>
</nav>

<main id="main">

<section className="ld-hero" id="home" data-spot>
  <video className="vbg hero-video" id="heroVideo" muted={true} loop={true} playsInline preload="metadata" poster="/assets/landing/images/hero-poster.webp" aria-hidden="true" tabIndex="-1"><source src="/assets/landing/videos/hero-technology.webm" type="video/webm" /><source src="/assets/landing/videos/hero-technology.mp4" type="video/mp4" /></video>
  <div className="hero-shade" aria-hidden="true"></div>
  <canvas id="bg3d" aria-hidden="true"></canvas>
  <div className="ld-chips" aria-hidden="true"><span className="ld-chip" data-depth="30">Web Development</span><span className="ld-chip" data-depth="55">AI &amp; Machine Learning</span><span className="ld-chip" data-depth="40">Cybersecurity</span><span className="ld-chip" data-depth="65">Cloud Solutions</span><span className="ld-chip" data-depth="25">Mobile Applications</span></div>
  <div className="hero-in">
    <p className="ld-eyebrow" data-hero>YOUR TRUSTED TECHNOLOGY PARTNER</p>
    <h1 className="hero-h"><span className="ln"><span>Your</span></span><span className="ln"><span className="grad">Innovation</span></span><span className="ln"><span>Partner</span></span></h1>
    <p className="ld-lead" data-hero>We transform ideas into powerful digital experiences through intelligent technology, innovative software, and solutions built for your business.</p>
    <p className="rotator" data-hero>We build <b suppressHydrationWarning id="rot" aria-live="off">websites</b><i className="caret" aria-hidden="true"></i></p>
    <div className="btn-row" data-hero><a className="ld-btn ld-btn-primary mag" href="#services">Explore Our Services</a><a className="ld-btn btn-ghost mag" href="#contact">Let's Discuss Your Project</a></div>
    <p className="tagline" data-hero>Innovate. Develop. Transform.</p>
  </div>
  <a href="#statement" className="explore" aria-label="Scroll to explore"><span>scroll to explore</span><i></i></a>
</section>


<section className="ld-section" id="statement"><div className="ld-wrap">
  <h2 suppressHydrationWarning className="scrub">We turn ideas into digital reality. Practical technology, built around your business, delivered with care and designed to grow with you.</h2>
</div></section>

<div className="ld-marquee" aria-hidden="true"><div className="mq"><span>Web Development</span><span>Mobile Apps</span><span>AI &amp; Machine Learning</span><span>Cybersecurity</span><span>Cloud</span><span>Digital Marketing</span><span>Web Development</span><span>Mobile Apps</span><span>AI &amp; Machine Learning</span><span>Cybersecurity</span><span>Cloud</span><span>Digital Marketing</span></div></div>


<section className="ld-section" id="about"><div className="aurora" aria-hidden="true"><i></i><i></i><i></i></div><div className="ld-wrap two">
  <div className="about-media" data-up><div className="blob"></div><img src="/assets/img/photos/teamwork.jpg" width="640" height="480" loading="lazy" alt="ICT OPTION team at work" /></div>
  <div>
    <p className="ld-eyebrow">ABOUT ICT OPTION</p>
    <h2 suppressHydrationWarning data-split>Turning Ideas Into Digital Reality</h2>
    <p data-up>ICT Option provides innovative IT solutions, services, and products for businesses from Piliyandala, Sri Lanka. We focus on practical technology that is reliable and helps your business grow.</p>
    <ul className="ld-values"><li data-up><b>Innovation That Matters</b> Ideas shaped into useful tools.</li><li data-up><b>Solutions Built Around You</b> Designed for your goals.</li><li data-up><b>Technology You Can Trust</b> Dependable delivery and support.</li></ul>
    <a className="ld-btn ld-btn-primary mag" href="https://www.ictoption.com/" target="_blank" rel="noopener">Discover Our Company</a>
  </div>
</div></section>


<section className="ld-reel" id="reel" aria-label="Technology reel"><div className="reel-box">
  <video className="vbg" data-src="/assets/landing/videos/hero-technology.mp4" muted={true} loop={true} playsInline preload="none" poster="/assets/landing/images/hero-poster.webp" aria-hidden="true" tabIndex="-1"></video>
  <div className="reel-txt"><p className="ld-eyebrow">INNOVATE. DEVELOP. TRANSFORM.</p><h2>Technology, in motion.</h2></div>
</div></section>


<section className="ld-stats" aria-label="Company highlights"><div className="ld-wrap stat-grid">
  <div><b suppressHydrationWarning className="count" data-to="0">0</b><span>Happy Clients</span></div><div><b suppressHydrationWarning className="count" data-to="0">0</b><span>Projects Completed</span></div>
  <div><b suppressHydrationWarning className="count" data-to="0">0</b><span>Years of Experience</span></div><div><b suppressHydrationWarning className="count" data-to="0">0</b><span>Solutions Delivered</span></div>
</div><p className="ld-wrap note">Placeholder figures – set verified numbers in the data-to attributes.</p></section>


<section className="hs" id="services">
  <div className="ld-wrap head"><h2 suppressHydrationWarning data-split>Technology Solutions for a Smarter Future</h2><p data-up>From digital experiences to intelligent systems, we help businesses solve real problems and unlock new opportunities through technology.</p></div>
  <div className="hs-track">
    <article className="pn" data-tilt><span suppressHydrationWarning className="ico" data-i="code"></span><h3>Web Development</h3><p>Responsive websites, custom web applications, e-commerce platforms, and scalable digital experiences.</p><a href="#contact" className="more">Explore Service <i>→</i></a></article>
    <article className="pn" data-tilt><span suppressHydrationWarning className="ico" data-i="phone"></span><h3>Mobile App Development</h3><p>Modern mobile experiences designed to help businesses connect with customers wherever they are.</p><a href="#contact" className="more">Explore Service <i>→</i></a></article>
    <article className="pn" data-tilt><span suppressHydrationWarning className="ico" data-i="ai"></span><h3>AI &amp; Machine Learning</h3><p>Intelligent applications, workflow automation, predictive insights, and practical AI integrations.</p><a href="#contact" className="more">Explore Service <i>→</i></a></article>
    <article className="pn" data-tilt><span suppressHydrationWarning className="ico" data-i="shield"></span><h3>Cybersecurity</h3><p>Security assessments, vulnerability management, risk reduction, and solutions that help protect digital assets.</p><a href="#contact" className="more">Explore Service <i>→</i></a></article>
    <article className="pn" data-tilt><span suppressHydrationWarning className="ico" data-i="cloud"></span><h3>Cloud Solutions</h3><p>Cloud infrastructure, connected systems, scalable deployment, and modern digital operations.</p><a href="#contact" className="more">Explore Service <i>→</i></a></article>
    <article className="pn" data-tilt><span suppressHydrationWarning className="ico" data-i="bulb"></span><h3>IT Consulting &amp; Digital Transformation</h3><p>Practical technology guidance and digital solutions aligned with business objectives.</p><a href="#contact" className="more">Explore Service <i>→</i></a></article>
    <article className="pn" data-tilt><span suppressHydrationWarning className="ico" data-i="trend"></span><h3>Digital Marketing</h3><p>Digital strategies, brand visibility, online engagement, and measurable marketing improvements.</p><a href="#contact" className="more">Explore Service <i>→</i></a></article>
    <article className="pn" data-tilt><span suppressHydrationWarning className="ico" data-i="layers"></span><h3>Business Software &amp; Automation</h3><p>Custom business applications, workflow automation, integrations, and solutions that improve operational efficiency.</p><a href="#contact" className="more">Explore Service <i>→</i></a></article>
  </div>
</section>


<section className="ld-section" id="products"><div className="aurora" aria-hidden="true"><i></i><i></i><i></i></div><div className="ld-wrap">
  <div className="head"><h2 suppressHydrationWarning data-split>Smart Products. Real Business Impact.</h2><p data-up>Placeholders – replace with the official ICT Option product list.</p></div>
  <div className="rows">
    <a className="ld-row" href="#contact" data-a="#00D7F2" data-b="#087BFF" data-cursor="View"><span className="rn">Product Name 1</span><span className="rt">Category</span><i>→</i></a>
    <a className="ld-row" href="#contact" data-a="#087BFF" data-b="#075BFF" data-cursor="View"><span className="rn">Product Name 2</span><span className="rt">Category</span><i>→</i></a>
    <a className="ld-row" href="#contact" data-a="#00D7F2" data-b="#075BFF" data-cursor="View"><span className="rn">Product Name 3</span><span className="rt">Category</span><i>→</i></a>
  </div>
</div></section>


<section className="ld-section alt" id="projects"><div className="ld-wrap">
  <div className="head"><h2 suppressHydrationWarning data-split>Built With Purpose. Designed for Impact.</h2><p data-up>Placeholders – add real project names and images (data-img on each row).</p></div>
  <div className="rows">
    <a className="ld-row" href="#contact" data-a="#00D7F2" data-b="#087BFF" data-cursor="View"><span className="rn">Project Name 1</span><span className="rt">web • design • development</span><i>→</i></a>
    <a className="ld-row" href="#contact" data-a="#087BFF" data-b="#061329" data-cursor="View"><span className="rn">Project Name 2</span><span className="rt">mobile • development</span><i>→</i></a>
    <a className="ld-row" href="#contact" data-a="#075BFF" data-b="#00D7F2" data-cursor="View"><span className="rn">Project Name 3</span><span className="rt">ai • automation</span><i>→</i></a>
    <a className="ld-row" href="#contact" data-a="#061329" data-b="#087BFF" data-cursor="View"><span className="rn">Project Name 4</span><span className="rt">security • cloud</span><i>→</i></a>
  </div>
</div></section>


<section className="showcase" id="showcase" data-spot>
  <canvas id="flow" aria-hidden="true"></canvas>
  <video className="vbg" data-src="/assets/landing/videos/technology-showcase.mp4" muted={true} loop={true} playsInline preload="none" poster="/assets/landing/images/showcase-poster.webp" aria-hidden="true" tabIndex="-1"></video>
  <div className="ld-wrap show-in">
    <h2 suppressHydrationWarning data-split>Technology That Moves Business Forward</h2>
    <p data-up>Intelligent, connected, and scalable solutions that grow with your organisation.</p>
    <ul className="caps" data-up><li>Innovation</li><li>Integration</li><li>Growth</li></ul>
    <a className="ld-btn ld-btn-primary mag" href="#contact">Start a Conversation</a>
  </div>
</section>


<section className="ld-section" id="why"><div className="aurora" aria-hidden="true"><i></i><i></i><i></i></div><div className="ld-wrap why">
  <div className="why-l"><h2 suppressHydrationWarning data-split>More Than Technology. A Partner in Progress.</h2><p data-up>We value collaboration, quality, practical innovation, transparent communication, and long-term support.</p></div>
  <ol className="why-list" id="steps"><div className="line"><i id="lineFill"></i></div>
    <li data-up><b>Client-Focused Solutions</b><span>We start with your goals, not our tools.</span></li>
    <li data-up><b>Modern Technology</b><span>Current, maintainable tech choices.</span></li>
    <li data-up><b>Quality and Reliability</b><span>Tested, refined, dependable delivery.</span></li>
    <li data-up><b>Ongoing Support</b><span>Help available after launch, as agreed.</span></li>
  </ol>
</div></section>

<section className="ld-section alt" id="process"><div className="ld-wrap">
  <div className="head"><h2 suppressHydrationWarning data-split>From First Conversation to Real Results</h2></div>
  <ol className="ld-steps">
    <li data-up><em>01</em><h3>Discover</h3><p>Understand the business, its goals, and its challenges.</p></li>
    <li data-up><em>02</em><h3>Plan</h3><p>Define requirements, priorities, and the solution approach.</p></li>
    <li data-up><em>03</em><h3>Develop</h3><p>Design, build, test, and refine the solution.</p></li>
    <li data-up><em>04</em><h3>Deliver &amp; Support</h3><p>Launch the solution and provide agreed ongoing support.</p></li>
  </ol>
</div></section>



<section className="ld-section" id="faq"><div className="ld-wrap narrow">
  <div className="head"><h2 suppressHydrationWarning data-split>Frequently Asked Questions</h2></div>
  <div className="acc" id="acc">
    <div className="acc-item"><h3><button aria-expanded="false" aria-controls="a1" id="q1">What services does ICT OPTION provide?</button></h3><div className="panel" id="a1" role="region" aria-labelledby="q1"><p>Web development, mobile apps, cybersecurity, AI, digital marketing, consulting and related IT solutions and products.</p></div></div>
    <div className="acc-item"><h3><button aria-expanded="false" aria-controls="a2" id="q2">How do I start a project?</button></h3><div className="panel" id="a2" role="region" aria-labelledby="q2"><p>Send us a message through the contact form or call us. We will discuss your goals and requirements first.</p></div></div>
    <div className="acc-item"><h3><button aria-expanded="false" aria-controls="a3" id="q3">Can solutions be customised for my business?</button></h3><div className="panel" id="a3" role="region" aria-labelledby="q3"><p>Yes. We assess your requirements and shape the solution around them.</p></div></div>
    <div className="acc-item"><h3><button aria-expanded="false" aria-controls="a4" id="q4">How long does a typical project take?</button></h3><div className="panel" id="a4" role="region" aria-labelledby="q4"><p>It depends on scope. After assessing your requirements we can provide a timeline.</p></div></div>
    <div className="acc-item"><h3><button aria-expanded="false" aria-controls="a5" id="q5">Do you provide ongoing maintenance and support?</button></h3><div className="panel" id="a5" role="region" aria-labelledby="q5"><p>Support after launch can be agreed as part of the project. Contact us to discuss options.</p></div></div>
    <div className="acc-item"><h3><button aria-expanded="false" aria-controls="a6" id="q6">How can I request a quotation?</button></h3><div className="panel" id="a6" role="region" aria-labelledby="q6"><p>Use the contact form below, describing your needs. We will review them and respond with a quotation.</p></div></div>
  </div>
</div></section>


<section className="cta" id="cta" data-spot><video className="vbg" data-src="/assets/landing/videos/technology-showcase.mp4" muted={true} loop={true} playsInline preload="none" poster="/assets/landing/images/showcase-poster.webp" aria-hidden="true" tabIndex="-1"></video><div className="glow" aria-hidden="true"></div>
  <p className="ld-eyebrow">READY TO TURN YOUR IDEA INTO REALITY?</p>
  <h2 className="cta-h" suppressHydrationWarning data-split>Let's work together!</h2>
  <p className="cta-p" data-up>Let's discuss your goals and explore how the right technology can help your business move forward.</p>
  <div className="btn-row ld-center"><a className="ld-btn ld-btn-primary mag" href="#contact">Let's Talk</a><a className="ld-btn btn-light mag" href="#services">Explore Our Services</a></div>
  <div className="ld-marquee dark" aria-hidden="true"><div className="mq rev"><span>Let's work together</span><span>Let's work together</span><span>Let's work together</span><span>Let's work together</span><span>Let's work together</span><span>Let's work together</span></div></div>
</section>


<section className="ld-section" id="contact"><div className="ld-wrap two ld-top">
  <div>
    <h2 suppressHydrationWarning data-split>Let's Build Something Great Together</h2><p data-up>Tell us about your project and we will get back to you.</p>
    <ul className="contact-list" data-up><li><b>Email</b><a href={`mailto:${site.email}`}>{site.email}</a></li><li><b>Phone</b><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li><li><b>Address</b>{site.address}</li></ul>
  </div>
  <LandingForm />
</div></section>
</main>

<footer className="ld-footer"><video className="vbg" data-src="/assets/landing/videos/technology-showcase.mp4" muted={true} loop={true} playsInline preload="none" poster="/assets/landing/images/showcase-poster.webp" aria-hidden="true" tabIndex="-1"></video>
  <div className="ld-wrap ld-foot-grid">
    <div><img className="foot-logo" src="/assets/landing/images/ict-option-logo.png" alt="ICT OPTION" width="110" height="94" loading="lazy" /><p>Innovative IT solutions, services, and products for your business needs.</p></div>
    <div><h4>Quick Links</h4><ul><li><a href="#home">Home</a></li><li><a href="#about">About Us</a></li><li><a href="#projects">Projects</a></li><li><a href="#contact">Contact</a></li></ul></div>
    <div><h4>Services</h4><ul><li><a href="#services">Web &amp; Mobile</a></li><li><a href="#services">AI &amp; Cybersecurity</a></li><li><a href="#services">Cloud &amp; Consulting</a></li><li><a href="#services">Digital Marketing</a></li></ul></div>
    <div><h4>Contact</h4><ul><li><a href={`mailto:${site.email}`}>{site.email}</a></li><li><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li><li><a href="https://www.facebook.com/p/ICT-OPTION-100063470621936/" target="_blank" rel="noopener">Facebook</a></li><li><a href="https://www.linkedin.com/company/ictoption" target="_blank" rel="noopener">LinkedIn</a></li></ul></div>
  </div>
  <p className="ld-copy">© <span id="year" suppressHydrationWarning>2026</span> ICT OPTION (Pvt) Ltd. All rights reserved.</p>
</footer>
<button className="motion-btn" id="motionBtn" aria-pressed="true"><span className="dot"></span><span id="motionTxt">Motion on</span></button>
<div className="motion-note" id="motionNote" role="status" hidden>Your device is set to reduce motion, so animations and videos are paused. <button id="motionOn" className="ld-btn ld-btn-primary">Turn on animations</button><button id="motionX" aria-label="Dismiss">×</button></div>
<button className="totop" id="toTop" aria-label="Back to top">↑</button>


    </div>
  );
}
