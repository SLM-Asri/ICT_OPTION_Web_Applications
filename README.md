# ICT Option website (React + Vite, JavaScript/JSX, no TypeScript)

```bash
npm install
npm run dev       # development server
npm run build     # production build + prerender every page to dist/
npm run preview   # preview dist/
```

`npm run build` runs Vite twice (client + server bundle), then `prerender.js` writes complete HTML for every route
(plus `404.html`, `sitemap.xml`, `robots.txt`, `_redirects`). Pages are crawlable and share previews work.

## Structure
- `src/routes.jsx`: every page with its SEO title, description, breadcrumbs and schema.
- `src/pages/Pages.jsx`: one wrapper per page (hero + content + the forms for that page).
- `src/components/Imported.jsx`: renders page content from `src/content/imported.json` (cards, steps, projects, reviews,
  pricing, partners, jobs, timeline, gallery, FAQ…). `Widgets.jsx`: security quiz, tech-gap tool, AI chat demo, app phone
  previews, before/after slider, gallery lightbox. `forms.jsx`: validated multi-step forms. `Layout.jsx`: header, footer, cookie banner.
- `src/content/imported.json`: all page text from the design draft (edit it to change copy). Other `src/content/*.json`
  drive navigation, footer, forms and SEO.
- `src/styles/`: `tokens.css`, `base.css`, `site.css`, `imported.css` (ported components and animations).
- `public/assets/img/photos/` (89 photos), `public/assets/video/home-hero.mp4` (home hero background loop).

## Sample content (replace before launch)
The text, numbers, names, reviews, partners, projects, packages and prices from the design draft are **sample content**.
Sections that contain it show a "Sample content" tag while `markSamples` is `true` in `src/content/site.json`.
Blueprint rule: only real projects, real numbers and real reviews, with client permission. Review in particular:
60+ projects / 45+ clients / 4.9 rating, the three client reviews, partner names, team names and bios, ERP and OptiVision prices, job openings and salaries, office hours.

## Settings (`src/content/site.json`)
`formEndpoint` (forms only send when set), `hours` (live status badge), `erpState`, `social`, `baseUrl`, `markSamples`.
Not included: admin panel/CMS, Sinhala version, Phase 2/3 features.

## Motion landing page (`/landing`)
A single-page motion landing (loader, 3D particle hero, smooth scrolling, pinned horizontal services, video reel, flow-field showcase,
custom cursor, FAQ, contact form). Files: `src/landing/Landing.jsx` (markup), `LandingForm.jsx`, `motion.js` (GSAP, Lenis and Three.js,
loaded only on this page), `src/styles/landing.css` (scoped under `.ld`, so it cannot affect the rest of the site),
`public/assets/landing/` (videos and posters).
- Set `"landingAsHome": true` in `src/content/site.json` to serve it at `/` instead of the main home page.
- Its contact form posts to `formEndpoint` (same setting as the other forms).
- Motion respects "reduce motion"; visitors get a "Motion on/off" switch. The hero videos are generated placeholder loops: replace with real footage (keep WebM + MP4).
- Its stats, product and project rows are placeholders: edit them in `Landing.jsx`.

## Site-wide motion (all pages)
`src/motion/site.js` (GSAP, ScrollTrigger, Lenis) + `src/styles/motion.css`. Loaded after the page appears; content is complete without it.
- Text: hero eyebrow scramble, headline and section headings reveal word by word, gradient words shimmer.
- Components: cards, steps, chips, stats, timeline, forms and more rise in with a stagger; call-to-action bands open up on scroll; cards have a cursor spotlight.
- Scroll: smooth scrolling, a progress bar, hero and image parallax, header that tucks away while scrolling down, marquee that leans with scroll speed.
- Buttons: magnetic pull, shine sweep, press ripple. Menus, FAQ and footer links animate too. Route changes fade in.
- Everything is off for visitors who prefer reduced motion. To tune, edit `RISE` and the timings in `site.js`.
