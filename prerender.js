/* Renders every route to static HTML after `vite build`, so crawlers and link previews see full content (blueprint Ch.16). */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { render, meta } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);
const { routes, notFound, site } = meta, BASE = site.baseUrl, OUT = "dist";
const tpl = fs.readFileSync(`${OUT}/index.html`, "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const ld = (r) => [...(r.schema || []).filter((x) => !(x["@type"] === "FAQPage" && !x.mainEntity.length)),
  ...(r.crumbs ? [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: r.crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], ...(c[1] ? { item: BASE + c[1] } : {}) })) }] : [])];
function head(r, url) {
  const img = BASE + (r.img ? r.img.replace("./", "/") : "/assets/img/og-image.png");
  return [`<title>${esc(r.title)}</title>`, `<meta name="description" content="${esc(r.desc)}">`,
    r.noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website"><meta property="og:site_name" content="ICT Option"><meta property="og:title" content="${esc(r.title)}"><meta property="og:description" content="${esc(r.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${img}"><meta name="twitter:card" content="summary_large_image">`,
    ...ld(r).map((x) => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, "\\u003c")}</script>`)].join("");
}
function write(file, r, route, url) {
  const html = tpl.replace(/<meta name="ssr-head"[^>]*>/, head(r, url)).replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html);
}
for (const r of routes) write(r.path === "/" ? `${OUT}/index.html` : `${OUT}/${r.path.slice(1)}/index.html`, r, r.path, BASE + (r.path === "/" ? "/" : r.path));
write(`${OUT}/404.html`, notFound, "/__not-found__", BASE + "/404");
fs.writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter((r) => !r.noindex).map((r) => `<url><loc>${BASE}${r.path === "/" ? "/" : r.path}</loc></url>`).join("")}</urlset>`);
fs.writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${BASE}/sitemap.xml\n`);
const old = [["optivity", "optivision"], ["portfolio", "our-work"], ["blog", "insights"], ["quote", "contact"], ["services/mobile-app-development", "services/mobile-apps"], ["services/ai-machine-learning", "services/ai-automation"]];
fs.writeFileSync(`${OUT}/_redirects`, old.flatMap(([a, b]) => [`/${a}  /${b}  301`, `/${a}.html  /${b}  301`]).join("\n") + "\n/blog/*  /insights/:splat  301\n/*  /404.html  404\n");
fs.rmSync("dist-ssr", { recursive: true, force: true });
console.log(`Prerendered ${routes.length + 1} pages → ${OUT}/`);
