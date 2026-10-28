/* Accordion: one delegated listener, keeps aria-expanded in sync. */
(function () {
  "use strict";
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".faq-q");
    if (!b) return;
    var open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!open));
    var panel = document.getElementById(b.getAttribute("aria-controls"));
    if (panel) panel.hidden = open;
  });
})();
