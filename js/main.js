/* ============================================================
   KONTEMPORARY KONSULTING — main.js
   Handles: preloader, nav, mobile menu, scroll reveals,
            counter animations, news filter (news-room page)
   ============================================================ */

(function () {
  'use strict';

  /* ── PRELOADER ─────────────────────────────────────────── */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Hide after K draws + small buffer
    const hideAfter = 1400;
    setTimeout(() => {
      preloader.classList.add('done');
      // Remove from DOM after transition
      preloader.addEventListener('transitionend', () => {
        preloader.remove();
      }, { once: true });
    }, hideAfter);
  }

  /* ── NAVIGATION SCROLL BEHAVIOUR ───────────────────────── */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let lastY = 0;

    function onScroll() {
      const y = window.scrollY;
      if (y > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastY = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── ACTIVE NAV LINK ────────────────────────────────────── */
  function setActiveNav() {
    const links = document.querySelectorAll('.nav-link, .mobile-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      const page = href.split('/').pop();
      if (page === currentPage ||
          (currentPage === '' && page === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ── MOBILE MENU ────────────────────────────────────────── */
  function initMobileMenu() {
    const burger = document.getElementById('burger');
    const menu   = document.getElementById('mobile-menu');
    if (!burger || !menu) return;

    function closeMenu() {
      burger.classList.remove('open');
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function openMenu() {
      burger.classList.add('open');
      menu.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    burger.addEventListener('click', () => {
      burger.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close on link click
    menu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click (tap anywhere outside)
    document.addEventListener('click', e => {
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) &&
          !burger.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on ESC + return focus to burger
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        burger.focus();
      }
    });
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(el => observer.observe(el));
  }

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  function animateCounter(el) {
    const target  = parseInt(el.dataset.target || el.textContent, 10);
    const suffix  = el.dataset.suffix  || '';
    const prefix  = el.dataset.prefix  || '';
    const duration = 1800;
    const start   = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── NEWS FILTER (news-room page) ───────────────────────── */
  function initNewsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.news-card[data-cat]');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        cards.forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── CONTACT FORM ───────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.textContent;

      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate send (replace with real endpoint)
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#2E7D32';
        form.reset();

        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 1600);
    });
  }

  /* ── HERO TICKER DUPLICATE (seamless loop) ──────────────── */
  function initTicker() {
    const inner = document.querySelector('.ticker-inner');
    if (!inner) return;
    // Clone content for seamless loop
    const clone = inner.cloneNode(true);
    inner.parentElement.appendChild(clone);
  }

  /* ── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── SCROLL TO TOP ──────────────────────────────────────── */
  function initScrollToTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── INIT ALL ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNav();
    setActiveNav();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initNewsFilter();
    initContactForm();
    initTicker();
    initSmoothAnchors();
    initScrollToTop();
  });

})();
