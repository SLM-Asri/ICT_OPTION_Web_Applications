/* Fetches JSON content and fills templates. Uses textContent for all JSON data. */
(function () {
  "use strict";
  var el = ICT.el;

  function fill(target, nodes) {
    target.textContent = "";
    nodes.forEach(function (n) { target.appendChild(typeof n === "string" ? document.createTextNode(n) : n); });
    ICT.reveal(target);
  }
  function setText(sel, text) {
    var n = document.querySelector(sel);
    if (n) n.textContent = text;
  }
  function meta(sel, attr, val, create) {
    var n = document.querySelector(sel);
    if (!n && create) { n = document.createElement(create.tag); n.setAttribute(create.key, create.val); document.head.appendChild(n); }
    if (n) n.setAttribute(attr, val);
  }
  function setMeta(title, desc, path) {
    var full = ICT.site.baseUrl + path;
    document.title = title;
    meta('meta[name="description"]', "content", desc);
    meta('link[rel="canonical"]', "href", full);
    meta('meta[property="og:title"]', "content", title);
    meta('meta[property="og:description"]', "content", desc);
    meta('meta[property="og:url"]', "content", full);
  }
  function crumbs(target, items) {
    var ol = el("ol", {}, items.map(function (it, i) {
      var last = i === items.length - 1;
      return el("li", {}, [last ? el("span", { "aria-current": "page", text: it[0] }) : el("a", { href: ICT.url(it[1]), text: it[0] })]);
    }));
    fill(target, [ol]);
  }

  /* cards */
  function serviceCard(s) {
    return el("article", { class: "card card--service reveal" }, [
      el("span", { class: "ic" }, [ICT.icon(s.icon)]),
      el("h3", { text: s.name }),
      el("p", { text: s.card }),
      el("a", { class: "card__link", href: ICT.detailUrl("services", s.slug) }, ["Explore Service ", ICT.icon("arrow"), el("span", { class: "visually-hidden", text: ": " + s.name })])
    ]);
  }
  function featureCard(f, mod) {
    return el("article", { class: "card card--" + mod + " reveal" }, [el("span", { class: "ic" }, [ICT.icon(f.icon)]), el("h3", { text: f.title }), f.text ? el("p", { text: f.text }) : null]);
  }
  function step(s) {
    return el("li", { class: "step reveal" }, [el("span", { class: "step__num", text: s.num }), el("h3", { text: s.title }), el("p", { text: s.text })]);
  }
  function faq(items, prefix, service) {
    var wrap = el("div", { class: "faq" });
    items.forEach(function (it, i) {
      var id = prefix + "-" + i, open = i === 0;
      wrap.appendChild(el("div", { class: "faq-item" }, [
        el("h3", {}, [el("button", { class: "faq-q", type: "button", id: id + "-q", "aria-expanded": String(open), "aria-controls": id + "-a" }, [it.q.replace("{service}", service || ""), ICT.icon("down")])]),
        el("div", { class: "faq-a", id: id + "-a", role: "region", "aria-labelledby": id + "-q", hidden: !open }, [el("p", { text: it.a })])
      ]));
    });
    return wrap;
  }

  function fdate(d) { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  function metaRow(p) {
    return el("div", { class: "post-meta" }, [
      el("span", {}, [ICT.icon("calendar"), fdate(p.date)]),
      el("span", {}, [ICT.icon("clock"), p.readTime])
    ]);
  }
  function postCard(p) {
    return el("article", { class: "card card--post reveal" }, [
      el("img", { src: p.image, alt: p.imageAlt, width: "480", height: "320", loading: "lazy" }),
      el("div", { class: "card__body" }, [
        el("div", { class: "meta" }, [el("span", { class: "pill", text: p.category })]),
        el("h3", { text: p.title }),
        metaRow(p),
        el("p", { text: p.excerpt }),
        el("a", { class: "card__link", href: ICT.detailUrl("blog", p.slug) }, ["Read More ", ICT.icon("arrow"), el("span", { class: "visually-hidden", text: ": " + p.title })])
      ])
    ]);
  }
  function projectCard(p) {
    var tags = p.tags.map(function (t) { return el("span", { class: "pill pill--line", text: t }); });
    var card = el("article", { class: "card card--project reveal", "data-cat": p.category }, [
      el("img", { src: p.image, alt: p.imageAlt, width: "480", height: "320", loading: "lazy" }),
      el("div", { class: "card__body" }, [
        el("div", { class: "meta" }, [el("span", { class: "pill", text: p.categoryLabel })]),
        el("h3", { text: p.title }),
        el("p", { text: p.text }),
        el("div", { class: "meta" }, tags)
      ])
    ]);
    return card;
  }

  /* data-render blocks (static pages) */
  var BLOCKS = {
    "service-cards": function (t) { return ICT.json("services").then(function (l) { fill(t, l.map(serviceCard)); }); },
    "portfolio": function (t) {
      return ICT.json("portfolio").then(function (d) {
        var grid = el("div", { class: "grid grid--3" }, d.items.map(projectCard));
        var bar = el("div", { class: "filters", role: "group", "aria-label": "Filter projects" }, d.filters.map(function (f, i) {
          return el("button", { class: "filter", type: "button", "data-filter": f.key, "aria-pressed": String(i === 0), text: f.label });
        }));
        bar.addEventListener("click", function (e) {
          var b = e.target.closest("button");
          if (!b) return;
          bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          grid.querySelectorAll(".card").forEach(function (c) { c.hidden = b.dataset.filter !== "all" && c.dataset.cat !== b.dataset.filter; });
        });
        fill(t, [bar, grid]);
      });
    },
    "blog-list": function (t) {
      return ICT.json("blog").then(function (list) {
        var f = list[0];
        var featured = el("article", { class: "featured reveal" }, [
          el("img", { src: f.image, alt: f.imageAlt, width: "480", height: "320" }),
          el("div", { class: "featured__body" }, [
            el("div", { class: "meta" }, [el("span", { class: "pill", text: "Featured \u00B7 " + f.category })]),
            el("h2", { text: f.title }),
            metaRow(f),
            el("p", { text: f.excerpt }),
            el("a", { class: "card__link", href: ICT.detailUrl("blog", f.slug) }, ["Read More ", ICT.icon("arrow"), el("span", { class: "visually-hidden", text: ": " + f.title })])
          ])
        ]);
        fill(t, [featured, el("div", { class: "grid grid--3" }, list.slice(1).map(postCard))]);
      });
    },
    "faq-contact": function (t) { return ICT.json("faq").then(function (d) { fill(t, [faq(d.contact, "cf")]); }); },
    "about-story": function (t) { return ICT.json("about").then(function (d) { fill(t, d.story.map(function (p) { return el("p", { text: p }); })); }); },
    "about-values": function (t) { return ICT.json("about").then(function (d) { fill(t, d.values.map(function (v) { return featureCard(v, "feature"); })); }); },
    "about-team": function (t) {
      return ICT.json("about").then(function (d) {
        fill(t, d.team.map(function (m) {
          return el("article", { class: "card team-card reveal" }, [el("img", { src: m.image, alt: "", width: "120", height: "120", loading: "lazy" }), el("h3", { text: m.name }), el("p", { text: m.role })]);
        }));
      });
    }
  };

  /* detail pages */
  function serviceDetail() {
    return Promise.all([ICT.json("services"), ICT.json("process"), ICT.json("faq")]).then(function (r) {
      var s = ICT.entry("services", r[0]);
      if (!s) return ICT.toNotFound();
      setMeta(s.name + " Services | ICT OPTION", s.lead, "/services/" + s.slug);
      setText("#sd-eyebrow", s.name);
      fill(document.getElementById("sd-title"), [el("b", { text: s.name }), " Built Around Your Goals"]);
      setText("#sd-lead", s.lead);
      var si = document.getElementById("sd-image");
      si.setAttribute("src", s.image);
      si.setAttribute("alt", s.imageAlt);
      crumbs(document.getElementById("crumb"), [["Home", "home"], ["Services", "services"], [s.name]]);
      fill(document.getElementById("sd-build"), s.build.map(function (b) { return featureCard({ title: b, icon: s.icon }, "build"); }));
      fill(document.getElementById("sd-process"), r[1].map(step));
      fill(document.getElementById("sd-faq"), [faq(r[2].service.slice(0, 3), "sf", s.name)]);
    });
  }
  function blogPost() {
    return ICT.json("blog").then(function (list) {
      var p = ICT.entry("blog", list);
      if (!p) return ICT.toNotFound();
      setMeta(p.title + " | ICT OPTION", p.excerpt, "/blog/" + p.slug);
      fill(document.getElementById("bp-cat"), [p.category]);
      setText("#bp-title", p.title);
      var m = document.getElementById("bp-meta");
      fill(m, [el("span", {}, [ICT.icon("user"), "ICT OPTION Team"]), el("span", {}, [ICT.icon("calendar"), fdate(p.date)]), el("span", {}, [ICT.icon("clock"), p.readTime])]);
      var img = document.getElementById("bp-image");
      img.setAttribute("src", p.image);
      img.setAttribute("alt", p.imageAlt);
      crumbs(document.getElementById("crumb"), [["Home", "home"], ["Blog", "blog"], [p.title]]);
      fill(document.getElementById("bp-body"), p.body.map(function (t) { return el("p", { text: t }); }));
      fill(document.getElementById("bp-more"), list.filter(function (x) { return x.slug !== p.slug; }).slice(0, 3).map(postCard));
    });
  }

  function legalToc() {
    var d = document.querySelector("details.toc");
    if (!d) return;
    var mq = window.matchMedia("(min-width: 1024px)");
    function sync() { d.open = mq.matches; }
    sync();
    mq.addEventListener("change", sync);
  }

  ICT.ready.then(function () {
    var jobs = [];
    document.querySelectorAll("[data-render]").forEach(function (t) {
      var fn = BLOCKS[t.dataset.render];
      if (fn) jobs.push(fn(t).catch(function () { ICT.notice(t, "This content could not be loaded. Please refresh the page."); }));
    });
    var page = document.body.dataset.page;
    var main = document.getElementById("main");
    if (page === "service-detail") jobs.push(serviceDetail().catch(function () { ICT.notice(main, "This page could not be loaded. Please refresh."); }));
    if (page === "blog-post") jobs.push(blogPost().catch(function () { ICT.notice(main, "This page could not be loaded. Please refresh."); }));
    ICT.links(document);
    legalToc();
    return Promise.all(jobs);
  }, function () { ICT.notice(document.getElementById("main"), "Some content could not be loaded. Please refresh the page."); });
})();
