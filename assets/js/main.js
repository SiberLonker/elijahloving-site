/* elijahloving.com interim site: header, menus, scroll animations, gallery lightbox. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var header = document.querySelector('.site-header');
  var desktop = window.matchMedia('(min-width: 1280px)');

  /* Sticky header: like Creativo, the header turns black and sticks once the page scrolls past it */
  function onScroll() {
    if (!header) return;
    var stick = desktop.matches && window.scrollY > 260;
    header.classList.toggle('is-sticky', stick);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Dropdowns (Portfolio submenu, Follow): hover on desktop, tap or keyboard also works */
  document.querySelectorAll('[data-dropdown]').forEach(function (wrap) {
    var btn = wrap.querySelector('[data-dropdown-toggle]');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      if (btn.tagName === 'A' && !('ontouchstart' in window)) return; /* mouse users follow the link */
      if (btn.tagName === 'A' && wrap.classList.contains('open')) return;
      e.preventDefault();
      var open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('[data-dropdown].open').forEach(function (w) {
      if (!w.contains(e.target)) { w.classList.remove('open'); var b = w.querySelector('[data-dropdown-toggle]'); if (b) b.setAttribute('aria-expanded', 'false'); }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('[data-dropdown].open').forEach(function (w) { w.classList.remove('open'); });
  });

  /* WPBakery-style entrance animations when an element is almost visible */
  var anim = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    anim.forEach(function (el) { io.observe(el); });
  } else {
    anim.forEach(function (el) { el.classList.add('in'); });
  }

  /* Lightbox for the portfolio grids (same behavior as lightbox2 on the original site) */
  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
  if (!links.length) return;
  var chevron = function (d) { return '<svg viewBox="0 0 30 45" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML =
    '<div class="lb-overlay"></div>' +
    '<div class="lb-box"><div class="lb-frame"><img alt=""><div class="lb-nav">' +
    '<button class="lb-prev" type="button" aria-label="Previous image">' + chevron('M22 4 L6 22.5 L22 41') + '</button>' +
    '<button class="lb-next" type="button" aria-label="Next image">' + chevron('M8 4 L24 22.5 L8 41') + '</button>' +
    '</div></div>' +
    '<div class="lb-data"><span class="lb-number" aria-live="polite"></span>' +
    '<button class="lb-close" type="button" aria-label="Close"><svg viewBox="0 0 30 30" aria-hidden="true"><path d="M7 7 L23 23 M23 7 L7 23" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></button></div></div>';
  document.body.appendChild(lb);
  var img = lb.querySelector('img'), num = lb.querySelector('.lb-number'), data = lb.querySelector('.lb-data');
  var frame = lb.querySelector('.lb-frame');
  var idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + links.length) % links.length;
    var a = links[idx];
    var th = a.querySelector('img');
    img.style.opacity = '0';
    img.onload = function () { img.style.opacity = '1'; data.style.width = frame.offsetWidth + 'px'; };
    img.src = a.getAttribute('href');
    img.alt = th ? th.alt : '';
    num.textContent = 'Image ' + (idx + 1) + ' of ' + links.length;
    lb.querySelector('.lb-prev').style.display = links.length > 1 ? '' : 'none';
    lb.querySelector('.lb-next').style.display = links.length > 1 ? '' : 'none';
    /* preload neighbours */
    [idx + 1, idx - 1].forEach(function (n) { var p = new Image(); p.src = links[(n + links.length) % links.length].getAttribute('href'); });
  }
  function open(i) {
    lastFocus = document.activeElement;
    lb.classList.add('open');
    document.body.classList.add('lb-lock');
    show(i);
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.classList.remove('open');
    document.body.classList.remove('lb-lock');
    img.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
  });
  lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-overlay').addEventListener('click', close);
  lb.querySelector('.lb-box').addEventListener('click', function (e) { if (e.target === e.currentTarget) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
  /* swipe on touch screens */
  var sx = null;
  frame.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  frame.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
  });
})();
