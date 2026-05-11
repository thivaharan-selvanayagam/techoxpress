/* Techo Xpress — main.js */

// ── Nav scroll effect ──
const siteNav = document.getElementById('siteNav');
if (siteNav) {
  window.addEventListener('scroll', () => {
    siteNav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ── Mobile menu ──
const burger  = document.getElementById('navBurger');
const drawer  = document.getElementById('navDrawer');
const overlay = document.getElementById('navOverlay');
const closer  = document.getElementById('navClose');

function openMenu() {
  drawer.classList.add('open');
  overlay.classList.add('open');
}
function closeMenu() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
}

if (burger)  burger.addEventListener('click', openMenu);
if (closer)  closer.addEventListener('click', closeMenu);
if (overlay) overlay.addEventListener('click', closeMenu);
if (drawer)  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => ro.observe(el));
}

// ── Animated counters ──
document.querySelectorAll('[data-count]').forEach(el => {
  const target  = parseFloat(el.dataset.count);
  const suffix  = el.dataset.suffix || '';
  const isFloat = el.dataset.float === 'true';
  let started = false;

  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || started) return;
    started = true;
    obs.disconnect();
    const dur = 1800;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
    }
    requestAnimationFrame(step);
  }, { threshold: 0.5 });
  obs.observe(el);
});