/* Scroll reveal: once per element, 15% visible. Skipped with reduced motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = !reduce && "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
      }, { threshold: 0.15 })
    : null;
  ICT.reveal = function (root) {
    (root || document).querySelectorAll(".reveal:not(.is-visible)").forEach(function (n) {
      if (io) io.observe(n);
      else n.classList.add("is-visible");
    });
  };
  ICT.reveal();
})();
