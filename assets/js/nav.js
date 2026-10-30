/* Mobile menu and active navigation state. */
(function () {
  "use strict";
  ICT.layout.then(function () {
    var btn = document.querySelector(".burger");
    var menu = document.getElementById("menu");
    if (!btn || !menu) return;
    function set(open) {
      menu.classList.toggle("open", open);
      btn.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    }
    btn.addEventListener("click", function () { set(!menu.classList.contains("open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { set(false); btn.focus(); }
    });
    var sb = document.getElementById("searchbar"), sbtn = document.getElementById("searchBtn");
    function setSearch(open) { sb.classList.toggle("open", open); sbtn.setAttribute("aria-expanded", String(open)); if (open) sb.querySelector("input").focus(); }
    sbtn.addEventListener("click", function () { set(false); setSearch(!sb.classList.contains("open")); });
    btn.addEventListener("click", function () { setSearch(false); });
    sb.addEventListener("submit", function (e) { e.preventDefault(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setSearch(false); });
    window.matchMedia("(min-width: 1001px)").addEventListener("change", function () { set(false); });

    var p = location.pathname.replace(/\/+$/, "") || "/";
    var section = /^\/(services|service-detail)/.test(p) ? "services"
      : /^\/(optivity)/.test(p) ? "optivity"
      : /^\/about/.test(p) ? "about"
      : /^\/portfolio/.test(p) ? "portfolio"
      : /^\/(blog|blog-post)/.test(p) ? "blog"
      : /^\/contact/.test(p) ? "contact"
      : (p === "/" || /^\/index/.test(p)) ? "home" : "";
    menu.querySelectorAll("a[data-route]").forEach(function (a) {
      if (a.dataset.route === section) { a.setAttribute("aria-current", "page"); a.classList.add("active"); }
    });
  });
})();
