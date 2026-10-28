/* Core helpers (window.ICT) and the shared header and footer. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var FILES = { home: "index.html", services: "services.html", products: "products.html", about: "about.html", portfolio: "portfolio.html", blog: "blog.html", contact: "contact.html", quote: "quote.html", privacy: "privacy.html", terms: "terms.html", "404": "404.html" };
  var cache = {};
  var site = null;
  var ICT = (window.ICT = {});

  ICT.json = function (name) {
    if (!cache[name]) {
      cache[name] = fetch("./content/" + name + ".json").then(function (r) {
        if (!r.ok) throw new Error(name + ".json");
        return r.json();
      });
    }
    return cache[name];
  };
  ICT.url = function (route) {
    if (route === "home") return "./";
    return site && site.cleanUrls ? "./" + route : "./" + FILES[route];
  };
  ICT.detailUrl = function (kind, slug) {
    if (site && site.cleanUrls) return "./" + kind + "/" + slug;
    var f = { services: "service-detail.html", products: "product-detail.html", blog: "blog-post.html" }[kind];
    return "./" + f + "?slug=" + slug;
  };
  ICT.el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "text") n.textContent = v;
      else n.setAttribute(k, v === true ? "" : v);
    });
    (kids || []).forEach(function (c) {
      if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  };
  ICT.icon = function (name, cls) {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("class", "i" + (cls ? " " + cls : ""));
    s.setAttribute("aria-hidden", "true");
    var u = document.createElementNS(NS, "use");
    u.setAttribute("href", "./assets/img/icons.svg#" + name);
    s.appendChild(u);
    return s;
  };
  ICT.notice = function (target, msg) {
    if (target) target.appendChild(ICT.el("p", { class: "notice", role: "status", text: msg }));
  };
  ICT.links = function (root) {
    (root || document).querySelectorAll("a[data-route]").forEach(function (a) {
      a.setAttribute("href", ICT.url(a.dataset.route));
    });
  };

  function logo(light) {
    return ICT.el("a", { class: "logo" + (light ? " light" : ""), href: ICT.url("home") }, [
      ICT.el("img", { class: "mark", src: "./assets/img/logo-full.png", alt: "" }),
      ICT.el("span", { class: "lt" }, [ICT.el("b", { text: "ICT OPTION" }), ICT.el("small", { text: (site && site.descriptor) || "IT & Digital Solutions" })])
    ]);
  }
  function routeLink(item) {
    return ICT.el("a", { href: ICT.url(item.route), "data-route": item.route, text: item.label });
  }

  function buildHeader(s) {
    var host = document.getElementById("site-header");
    if (!host) return;
    var menu = ICT.el("nav", { class: "menu", id: "menu", "aria-label": "Main" }, s.nav.map(routeLink));
    var search = ICT.el("button", { class: "icon-btn", id: "searchBtn", type: "button", "aria-label": "Search", "aria-expanded": "false", "aria-controls": "searchbar" }, [ICT.icon("search")]);
    var q = ICT.el("a", { class: "btn btn-dark quote", href: ICT.url(s.quote.route), "data-route": s.quote.route }, [s.quote.label + " ", ICT.icon("arrow")]);
    var burger = ICT.el("button", { class: "burger", id: "burger", type: "button", "aria-label": "Menu", "aria-expanded": "false", "aria-controls": "menu" }, [ICT.el("span"), ICT.el("span"), ICT.el("span")]);
    var bar = ICT.el("form", { class: "searchbar", id: "searchbar", role: "search" }, [ICT.el("input", { type: "search", placeholder: "Search...", "aria-label": "Search" })]);
    host.replaceWith(ICT.el("header", { class: "header", id: "site-header" }, [ICT.el("div", { class: "wrap nav" }, [logo(), menu, search, q, burger]), bar]));
  }

  function col(title, items) {
    return ICT.el("div", { class: "f-col" }, [
      ICT.el("h2", { text: title }),
      ICT.el("ul", {}, items.map(function (it) {
        return ICT.el("li", {}, [ICT.el("a", { href: it.href, "data-route": it.route }, [ICT.icon("chev"), it.label])]);
      }))
    ]);
  }
  function contactRow(icon, lines) {
    return ICT.el("div", {}, [ICT.icon(icon), ICT.el("p", {}, lines.reduce(function (acc, n, i) { if (i) acc.push(ICT.el("br")); acc.push(n); return acc; }, []))]);
  }
  function tel(n) { return ICT.el("a", { href: "tel:" + n.replace(/[^+\d]/g, ""), text: n }); }
  function mail(n) { return ICT.el("a", { href: "mailto:" + n, text: n }); }
  function buildFooter(s, svc) {
    var host = document.getElementById("site-footer");
    if (!host) return;
    var social = ICT.el("div", { class: "social" }, [
      ICT.el("a", { href: "#", "aria-label": "Facebook" }, [ICT.el("b", { text: "f" })]),
      ICT.el("a", { href: "#", "aria-label": "Instagram" }, [ICT.icon("insta")]),
      ICT.el("a", { href: "#", "aria-label": "LinkedIn" }, [ICT.el("b", { text: "in" })]),
      ICT.el("a", { href: "#", "aria-label": "YouTube" }, [ICT.icon("yt")]),
      ICT.el("a", { href: "#", "aria-label": "X" }, [ICT.el("b", { text: "\uD835\uDD4F" })])
    ]);
    var brand = ICT.el("div", { class: "f-brand" }, [logo(true), ICT.el("p", { text: s.tagline }), social]);
    var quick = s.quickLinks.map(function (l) { return { label: l.label, route: l.route, href: ICT.url(l.route) }; });
    var services = svc.map(function (x) { return { label: x.name, href: ICT.detailUrl("services", x.slug) }; });
    var contact = ICT.el("div", { class: "f-col f-contact" }, [
      ICT.el("h2", { text: "Contact Us" }),
      contactRow("pin", [document.createTextNode(s.address)]),
      contactRow("call", [tel(s.phone), tel(s.phone2)]),
      contactRow("mail", [mail(s.email), mail(s.email2)])
    ]);
    var legal = s.legal.map(function (l) { return ICT.el("a", { href: ICT.url(l.route), "data-route": l.route, text: l.label }); });
    var left = ICT.el("span", {}, ["\u00A9 " + new Date().getFullYear() + " ICT Option. All Rights Reserved. ", legal[0], " \u00B7 ", legal[1]]);
    var tag = ICT.el("span", { class: "tag" }, s.tag.reduce(function (acc, t, i) { if (i) acc.push(ICT.el("i", { text: "/" })); acc.push(t + " "); return acc; }, []));
    host.replaceWith(ICT.el("footer", { class: "footer", id: "site-footer" }, [
      ICT.el("div", { class: "wrap foot-grid" }, [brand, col("Quick Links", quick), col("Our Services", services), contact]),
      ICT.el("div", { class: "copy" }, [ICT.el("div", { class: "wrap copy-in" }, [left, tag])])
    ]));
  }

  function bindSite(s) {
    document.querySelectorAll("[data-site]").forEach(function (n) {
      var key = n.dataset.site, v = s[key];
      if (!v) return;
      n.textContent = v;
      if (key === "email") n.setAttribute("href", "mailto:" + v);
      if (key === "phone" || key === "phone2") n.setAttribute("href", "tel:" + v.replace(/[^+\d]/g, ""));
    });
  }

  document.documentElement.classList.add("js");

  ICT.ready = ICT.json("site").then(function (s) { site = s; ICT.site = s; return s; });
  ICT.layout = ICT.ready
    .then(function (s) {
      return Promise.all([ICT.json("services").catch(function () { return []; }), ICT.json("products").catch(function () { return []; })]).then(function (r) {
        buildHeader(s);
        buildFooter(s, r[0]);
        ICT.links(document);
        bindSite(s);
      });
    })
    .catch(function () {
      var h = document.getElementById("site-header");
      if (h) ICT.notice(h, "The menu could not be loaded. Go to the home page: /");
    });
})();
