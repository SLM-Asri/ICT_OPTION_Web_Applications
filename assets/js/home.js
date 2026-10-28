(function () {
  'use strict';
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var searchBtn = document.getElementById('searchBtn');
  var searchbar = document.getElementById('searchbar');
  var links = menu.querySelectorAll('a');

  // Mobile navigation
  function closeMenu() {
    menu.classList.remove('open');
    burger.classList.remove('open');
  }
  burger.addEventListener('click', function () {
    menu.classList.toggle('open');
    burger.classList.toggle('open');
    searchbar.classList.remove('open');
  });

  // Search toggle
  searchBtn.addEventListener('click', function () {
    searchbar.classList.toggle('open');
    closeMenu();
    if (searchbar.classList.contains('open')) searchbar.querySelector('input').focus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { searchbar.classList.remove('open'); closeMenu(); }
  });

  // Active link + smooth scroll (CSS handles smooth behaviour, JS as fallback)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) { e.preventDefault(); return; }
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.pageYOffset - (id === '#home' ? 0 : 72);
      window.scrollTo({ top: y, behavior: 'smooth' });
      closeMenu();
      links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === id); });
    });
  });

  // Highlight nav item on scroll
  var map = { home: '#home', about: '#about', services: '#services', reasons: '#reasons', contact: '#contact' };
  window.addEventListener('scroll', function () {
    var pos = window.pageYOffset + 140, cur = '#home';
    Object.keys(map).forEach(function (k) {
      var el = document.getElementById(k);
      if (el && el.offsetTop <= pos) cur = map[k];
    });
    links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === cur); });
  }, { passive: true });

  // Stat counters
  var stats = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = +el.dataset.count, n = 0, step = Math.max(1, Math.ceil(end / 40));
        var t = setInterval(function () {
          n = Math.min(end, n + step);
          el.textContent = n + '+';
          if (n >= end) clearInterval(t);
        }, 30);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    stats.forEach(function (s) { io.observe(s); });
  }
})();
