/* ============================================================
   KONTEMPORARY KONSULTING — main.js
   Handles: preloader, nav, mobile menu, scroll reveals,
            counter animations, news filter (news-room page),
            contact form (Formspree), lite-youtube facade
   ============================================================ */

(function () {
  'use strict';

  /* ── PRELOADER ─────────────────────────────────────────── */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hideAfter = 1400;
    setTimeout(() => {
      preloader.classList.add('done');
      preloader.addEventListener('transitionend', () => {
        preloader.remove();
      }, { once: true });
    }, hideAfter);
  }

  /* ── NAVIGATION SCROLL BEHAVIOUR ───────────────────────── */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── ACTIVE NAV LINK ────────────────────────────────────── */
  function setActiveNav() {
    const links = document.querySelectorAll('.nav-link, .mobile-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
      const href  = link.getAttribute('href') || '';
      const page  = href.split('/').pop();
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
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function openMenu() {
      burger.classList.add('open');
      menu.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Move focus into menu for keyboard users
      const firstLink = menu.querySelector('.mobile-link');
      if (firstLink) firstLink.focus();
    }

    burger.addEventListener('click', () => {
      burger.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close on link click
    menu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
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
    const target   = parseInt(el.dataset.target || el.textContent, 10);
    const suffix   = el.dataset.suffix  || '';
    const prefix   = el.dataset.prefix  || '';
    const duration = 1800;
    const start    = performance.now();

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
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const cat = btn.dataset.filter;
        cards.forEach(card => {
          const visible = cat === 'all' || card.dataset.cat === cat;
          card.style.display = visible ? 'flex' : 'none';
          card.setAttribute('aria-hidden', String(!visible));
        });
      });
    });
  }

  /* ── CONTACT FORM (Web3Forms) ────────────────────────────────
   * SETUP — 2 minutes, no account needed:
   * 1. Visit https://web3forms.com/create
   * 2. Enter info@kontemporary.net.ng → "Create Access Key"
   * 3. Confirm via email → copy the key
   * 4. In contact.html replace YOUR_WEB3FORMS_KEY in the hidden input
   * Free tier: unlimited submissions, built-in spam filter.
   * Until key is set, form falls back to a pre-filled mailto.
   * ─────────────────────────────────────────────────────────── */
  function initContactForm() {
    const form   = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    function setStatus(type, msg) {
      if (!status) return;
      status.className   = 'form-status-msg ' + type;
      status.textContent = msg;
    }
    function clearStatus() {
      if (!status) return;
      status.className   = 'form-status-msg';
      status.textContent = '';
    }
    function validate(data) {
      if (!data.get('first_name')?.trim())
        return 'Please enter your first name.';
      const email = data.get('email')?.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return 'Please enter a valid email address.';
      if (!data.get('message')?.trim() || data.get('message').trim().length < 10)
        return 'Please enter a message (at least 10 characters).';
      return null;
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      clearStatus();

      const data = new FormData(form);
      const err  = validate(data);
      if (err) { setStatus('error', err); return; }

      const btn      = form.querySelector('[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML  = 'Sending\u2026';
      btn.disabled   = true;
      btn.setAttribute('aria-busy', 'true');

      const keyInput    = form.querySelector('[name="access_key"]');
      const isConfigured = keyInput &&
                           keyInput.value.trim() &&
                           keyInput.value !== 'YOUR_WEB3FORMS_KEY';

      /* ── Fallback: mailto until key is configured ── */
      if (!isConfigured) {
        const name    = (data.get('first_name') || '') + ' ' + (data.get('last_name') || '');
        const subject = encodeURIComponent('Website Enquiry from ' + name.trim());
        const body    = encodeURIComponent(
          'Name: '         + name.trim()                          + '\n' +
          'Email: '        + (data.get('email')        || '')     + '\n' +
          'Organisation: ' + (data.get('organisation') || 'N/A') + '\n' +
          'Phone: '        + (data.get('phone')        || 'N/A') + '\n' +
          'Service: '      + (data.get('service')      || 'General Enquiry') + '\n\n' +
          'Message:\n'    + (data.get('message')      || '')
        );
        window.location.href =
          'mailto:info@kontemporary.net.ng?subject=' + subject + '&body=' + body;
        btn.innerHTML = original;
        btn.disabled  = false;
        btn.removeAttribute('aria-busy');
        setStatus('success',
          '\u2713 Your mail client has opened with a pre-filled message. ' +
          'Please send it to complete your enquiry.');
        return;
      }

      /* ── Real Web3Forms submission ── */
      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', body: data, headers: { Accept: 'application/json' }
        });
        const json = await res.json();
        if (json.success) {
          btn.innerHTML     = '\u2713 Message Sent';
          btn.style.cssText = 'background:#166534;border-color:#166534;';
          setStatus('success',
            '\u2713 Your message has been received. ' +
            'We will respond within one business day.');
          form.reset();
          setTimeout(() => {
            btn.innerHTML     = original;
            btn.style.cssText = '';
            btn.disabled      = false;
            btn.removeAttribute('aria-busy');
            clearStatus();
          }, 6000);
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      } catch {
        setStatus('error',
          'Could not send message. Please email info@kontemporary.net.ng directly.');
        btn.innerHTML = original;
        btn.disabled  = false;
        btn.removeAttribute('aria-busy');
      }
    });
  }


  /* ── LITE YOUTUBE FACADE ────────────────────────────────── */
  function initLiteYoutube() {
    document.querySelectorAll('.lite-yt').forEach(el => {
      const videoId = el.dataset.videoid;
      if (!videoId) return;

      // Preconnect to YouTube on hover for faster play
      el.addEventListener('pointerover', () => {
        ['https://www.youtube.com', 'https://www.google.com'].forEach(origin => {
          if (!document.querySelector(`link[href="${origin}"]`)) {
            const link = document.createElement('link');
            link.rel  = 'preconnect';
            link.href = origin;
            document.head.appendChild(link);
          }
        });
      }, { once: true });

      function activate() {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src',
          `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
        iframe.setAttribute('title', el.getAttribute('aria-label') || 'YouTube video');
        iframe.setAttribute('allow',
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;';
        el.innerHTML = '';
        el.appendChild(iframe);
        el.classList.add('activated');
      }

      el.addEventListener('click', activate);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  /* ── HERO TICKER DUPLICATE (seamless loop) ──────────────── */
  function initTicker() {
    const inner = document.querySelector('.ticker-inner');
    if (!inner) return;
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
    initLiteYoutube();
    initTicker();
    initSmoothAnchors();
    initScrollToTop();
  });

})();
