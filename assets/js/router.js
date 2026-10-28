/* Reads the slug from ?slug= (development) or /services/<slug> (clean URLs). */
(function () {
  "use strict";
  ICT.slug = function (kind) {
    var q = new URLSearchParams(location.search).get("slug");
    if (q) return q.toLowerCase();
    var m = location.pathname.match(new RegExp("^/" + kind + "/([^/]+)/?$"));
    return m ? decodeURIComponent(m[1]).toLowerCase() : "";
  };
  ICT.entry = function (kind, list) {
    var s = ICT.slug(kind);
    return list.filter(function (x) { return x.slug === s; })[0] || null;
  };
  ICT.toNotFound = function () { location.replace(ICT.url("404")); };
})();
