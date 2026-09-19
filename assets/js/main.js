/* BONA — interactions du site */
(function () {
  'use strict';

  /* Header compact au défilement */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Menu mobile */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    var setOpen = function (open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    burger.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('menu-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* Apparition progressive des blocs */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 90, 270) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* Sommaire de la carte : lien actif au défilement */
  var menuLinks = document.querySelectorAll('.menu-nav a[href^="#"]');
  if (menuLinks.length) {
    var courses = [].map.call(menuLinks, function (a) {
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        menuLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-136px 0px -66% 0px', threshold: 0 });
    courses.forEach(function (c) { spy.observe(c); });
  }

  /* Bouton de réservation fixe : on l'affiche une fois le hero dépassé, pour ne
     pas doubler son bouton. Sur les pages sans hero, dès le premier défilement. */
  var ctaFixe = document.getElementById('cta-fixe');
  if (ctaFixe) {
    var repere = document.querySelector('.hero__cta');

    if (repere && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        ctaFixe.classList.toggle('is-visible', !entries[0].isIntersecting);
      }, { threshold: 0 }).observe(repere);
    } else {
      var seuil = function () {
        ctaFixe.classList.toggle('is-visible', window.scrollY > 300);
      };
      seuil();
      window.addEventListener('scroll', seuil, { passive: true });
    }
  }

  /* Année du copyright */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
