/* Contact form and the 3-step Quote wizard: options, validation, error and success states. No data is sent yet. */
(function () {
  "use strict";
  var el = ICT.el;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^\+?[0-9\s().-]{7,20}$/;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function check(f) {
    var v = f.value.trim(), rules = (f.dataset.validate || "").split(" "), label = f.dataset.label || "this field";
    if (rules.indexOf("required") > -1 && !v) return "Please enter your " + label + ".";
    if (v && rules.indexOf("email") > -1 && !EMAIL.test(v)) return "Please enter a valid email address.";
    if (v && rules.indexOf("phone") > -1 && !PHONE.test(v)) return "Please enter a valid phone number.";
    return "";
  }
  function showError(f, msg) {
    var id = f.id + "-error", old = document.getElementById(id);
    if (old) old.remove();
    f.classList.toggle("is-invalid", !!msg);
    if (!msg) { f.removeAttribute("aria-invalid"); f.removeAttribute("aria-describedby"); return; }
    f.setAttribute("aria-invalid", "true");
    f.setAttribute("aria-describedby", id);
    f.parentNode.appendChild(el("p", { class: "field-error", id: id, role: "alert", text: msg }));
  }

  function chip(type, name, value, label) {
    return el("label", { class: "chip" }, [el("input", { type: type, name: name, value: value }), el("span", { text: label })]);
  }
  function options(select, items) {
    items.forEach(function (t) { select.appendChild(el("option", { value: t, text: t })); });
  }
  function fillOptions(form) {
    return ICT.json("forms").then(function (d) {
      var sub = form.querySelector('[data-options="subjects"]');
      if (sub) options(sub, d.subjects);
      var tl = form.querySelector('[data-options="timelines"]');
      if (tl) options(tl, d.timelines);
      var bd = form.querySelector('[data-options="budgets"]');
      if (bd) d.budgets.forEach(function (b) { bd.appendChild(chip("radio", "budget", b, b)); });
    });
  }
  function fillServices(form) {
    var box = form.querySelector('[data-options="services"]');
    if (!box) return Promise.resolve();
    return Promise.all([ICT.json("services"), ICT.json("products")]).then(function (r) {
      box.appendChild(el("p", { class: "chips-label", text: "Services" }));
      r[0].forEach(function (s) { box.appendChild(chip("checkbox", "service", s.slug, s.name)); });
      box.appendChild(el("p", { class: "chips-label", text: "Products" }));
      r[1].forEach(function (p) { box.appendChild(chip("checkbox", "service", p.slug, p.name)); });
    });
  }

  function setup(form) {
    var summaryHost = form.querySelector(".form-summary-host");
    var success = document.getElementById(form.dataset.success);
    var wizard = form.classList.contains("wizard");
    var panels = wizard ? [].slice.call(form.querySelectorAll(".step-panel")) : [];
    var steps = wizard ? [].slice.call(document.querySelectorAll(".stepper li")) : [];
    var back = form.querySelector(".btn-back"), next = form.querySelector(".btn-next"), submit = form.querySelector(".btn-submit");
    var cur = 0;

    form.querySelectorAll("[data-validate]").forEach(function (f) {
      f.addEventListener("blur", function () { showError(f, check(f)); });
      f.addEventListener("input", function () { if (f.classList.contains("is-invalid")) showError(f, check(f)); });
    });

    /* validate the fields inside a scope; renders the summary; returns true when valid */
    function validate(scope) {
      var errors = [];
      scope.querySelectorAll("[data-validate]").forEach(function (f) {
        var msg = check(f);
        showError(f, msg);
        if (msg) errors.push({ f: f, msg: msg });
      });
      summaryHost.textContent = "";
      if (!errors.length) return true;
      var list = el("ul", {}, errors.map(function (x) { return el("li", {}, [el("a", { href: "#" + x.f.id, text: x.msg })]); }));
      var s = el("div", { class: "form-summary", role: "alert", tabindex: "-1" }, [el("strong", { text: "Please fix " + errors.length + (errors.length === 1 ? " field" : " fields") + " before continuing:" }), list]);
      summaryHost.appendChild(s);
      s.focus();
      return false;
    }

    function show(i, move) {
      cur = i;
      panels.forEach(function (p, n) { p.hidden = n !== i; });
      steps.forEach(function (s, n) {
        s.classList.toggle("is-current", n === i);
        s.classList.toggle("is-done", n < i);
        if (n === i) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
      });
      back.hidden = i === 0;
      next.hidden = i === panels.length - 1;
      submit.hidden = i !== panels.length - 1;
      summaryHost.textContent = "";
      if (move) {
        var h = panels[i].querySelector("h2");
        if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
        form.closest(".form-panel").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
    function goNext() { if (validate(panels[cur])) show(cur + 1, true); }

    if (wizard) {
      show(0, false);
      next.addEventListener("click", goNext);
      back.addEventListener("click", function () { show(cur - 1, true); });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (wizard && cur < panels.length - 1) { goNext(); return; }
      if (!validate(wizard ? panels[cur] : form)) return;
      form.hidden = true;
      steps.forEach(function (s) { s.classList.remove("is-current"); s.classList.add("is-done"); });
      if (success) {
        success.hidden = false;
        var h = success.querySelector("h2");
        if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
      }
    });

    summaryHost.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      e.preventDefault();
      var f = document.querySelector(a.getAttribute("href"));
      if (f) f.focus();
    });

    return Promise.all([fillOptions(form), fillServices(form)]).catch(function () {
      ICT.notice(summaryHost, "Some form options could not be loaded. You can still describe your needs in the message box.");
    });
  }

  document.querySelectorAll("form.form").forEach(setup);
})();
