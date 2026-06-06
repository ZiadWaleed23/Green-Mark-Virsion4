/* =============================================
   GREEN MARK — Premium JavaScript
   ============================================= */

'use strict';

/* ─────────────────────────────────────────────
   PRELOADER
───────────────────────────────────────────── */
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('hidden');
    // After fade-out, remove from layout
    setTimeout(() => { preloader.style.display = 'none'; }, 650);
  }, 1900); // matches fill animation (1.8s) + small buffer
});


/* ─────────────────────────────────────────────
   HEADER — scroll state + mobile nav
───────────────────────────────────────────── */
const header     = document.getElementById('header');
const hamburger  = document.getElementById('hamburger');

// Create mobile nav from existing navbar links
function buildMobileNav() {
  let nav = document.querySelector('.mobile-nav');
  if (nav) return; // already built

  nav = document.createElement('div');
  nav.className = 'mobile-nav';

  const links = document.querySelectorAll('.navbar .nav-link');
  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    a.addEventListener('click', closeMobileNav);
    nav.appendChild(a);
  });

  // WhatsApp link
  const wa = document.createElement('a');
  wa.href  = 'https://wa.me/+971509007659';
  wa.textContent = 'WhatsApp Us';
  wa.target = '_blank';
  nav.appendChild(wa);

  document.body.appendChild(nav);
}

buildMobileNav();

const mobileNav = document.querySelector('.mobile-nav');

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('active');
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
});

// Close on outside click
document.addEventListener('click', e => {
  if (
    mobileNav.classList.contains('open') &&
    !mobileNav.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobileNav();
  }
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileNav();
});

// Header scroll state
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = y;
}, { passive: true });


/* ─────────────────────────────────────────────
   HERO SWIPER
───────────────────────────────────────────── */
const heroSwiper = new Swiper('.home-slid', {
  loop: true,
  speed: 900,
  autoplay: {
    delay: 5500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  effect: 'fade',
  fadeEffect: { crossFade: true },
});


/* ─────────────────────────────────────────────
   SERVICES CUSTOM SLIDER
───────────────────────────────────────────── */
(function initServicesSlider() {
  const track   = document.getElementById('servicesTrack');
  const outer   = document.querySelector('.services-track-outer');
  const prev    = document.getElementById('servicesPrev');
  const next    = document.getElementById('servicesNext');
  const dotsEl  = document.getElementById('servicesDots');
  const dots    = dotsEl ? dotsEl.querySelectorAll('.services-dot') : [];

  if (!track || !outer) return;

  const cards        = Array.from(track.children);
  const gap          = 24; // 1.5rem in px
  let currentIndex   = 0;

  // Determine visible count from card flex-basis
  function getVisible() {
    const outerW = outer.offsetWidth;
    const cardW  = cards[0].offsetWidth;
    return Math.max(1, Math.round(outerW / (cardW + gap)));
  }

  function totalGroups() {
    return Math.ceil(cards.length / getVisible());
  }

  function getOffset(index) {
    const visible = getVisible();
    const cardW   = cards[0].offsetWidth;
    return index * visible * (cardW + gap);
  }

  function goTo(index) {
    const groups = totalGroups();
    currentIndex = Math.max(0, Math.min(index, groups - 1));

    track.style.transform = `translateX(-${getOffset(currentIndex)}px)`;

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));

    // Update arrows
    if (prev) prev.disabled = currentIndex === 0;
    if (next) next.disabled = currentIndex >= groups - 1;
  }

  if (prev) prev.addEventListener('click', () => goTo(currentIndex - 1));
  if (next) next.addEventListener('click', () => goTo(currentIndex + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
  });

  // Touch / swipe
  let startX = 0;
  outer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  outer.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  });

  // Recalc on resize
  window.addEventListener('resize', () => goTo(0), { passive: true });

  // Init
  goTo(0);
})();


/* ─────────────────────────────────────────────
   SCROLL TO TOP
───────────────────────────────────────────── */
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (scrollBtn) {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }
}, { passive: true });

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Expose globally (called via onclick in HTML)
window.scrollToTop = scrollToTop;


/* ─────────────────────────────────────────────
   REVEAL ON SCROLL (Intersection Observer)
───────────────────────────────────────────── */
function initReveal() {
  // Auto-add reveal class to key sections
  const targets = [
    ...document.querySelectorAll('.stat-item'),
    ...document.querySelectorAll('.about-image-wrap'),
    ...document.querySelectorAll('.about-content > *'),
    ...document.querySelectorAll('.contact-card'),
    ...document.querySelectorAll('.service-card'),
    ...document.querySelectorAll('.section-header'),
  ];

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings
    if (el.parentElement) {
      const siblings = Array.from(el.parentElement.children);
      const pos = siblings.indexOf(el);
      if (pos > 0 && pos <= 4) el.classList.add(`reveal-delay-${pos}`);
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Run after preloader so animations aren't skipped
window.addEventListener('load', () => {
  setTimeout(initReveal, 200);
});


/* ─────────────────────────────────────────────
   ACTIVE NAV LINK (Scroll Spy)
───────────────────────────────────────────── */
(function scrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ─────────────────────────────────────────────
   SMOOTH ANCHOR SCROLL (offset for fixed header)
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h')
    ) || 82;

    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
    closeMobileNav();
  });
});


/* ─────────────────────────────────────────────
   STAT COUNTER ANIMATION
───────────────────────────────────────────── */
function animateCounter(el) {
  const raw    = el.textContent.trim();
  const suffix = raw.replace(/[\d.]/g, ''); // "+", "%", letters
  const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return;

  const duration = 1800;
  const start    = performance.now();
  const isFloat  = raw.includes('.');

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = num * ease;
    el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-num');
        if (numEl && !numEl.dataset.counted) {
          numEl.dataset.counted = 'true';
          animateCounter(numEl);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));


/* ─────────────────────────────────────────────
   ACTIVE NAV LINK STYLE (CSS helper)
───────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  .nav-link.active { color: var(--green-accent) !important; }
  .nav-link.active::after { width: 100%; }
`;
document.head.appendChild(style);


/* ─────────────────────────────────────────────
   CURSOR GLOW (subtle, desktop only)
───────────────────────────────────────────── */
(function cursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
})();






/* ─────────────────────────────────────────────
   LEARN MORE — Navigate to Service Page
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const learnMoreBtns = document.querySelectorAll('.learn-more-btn');

  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.service-card');
      const serviceId = card ? card.dataset.serviceId : null;

      if (serviceId) {
        // Navigate to the dedicated service page
        window.location.href = `service.html?id=${serviceId}`;
      } else {
        // Fallback: expand in-card (original behaviour)
        if (card) card.classList.toggle('show-details');
      }
    });
  });
});
