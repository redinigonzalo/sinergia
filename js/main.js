/* ═══════════════════════════════════════════
   SinergIA — JavaScript principal
═══════════════════════════════════════════ */

// ── Navbar: activa el link de la sección actual al hacer scroll ──
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a');
var navbar   = document.querySelector('nav');

window.addEventListener('scroll', function () {
  var current = '';
  sections.forEach(function (s) {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(function (a) {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--blue-glow)' : '';
  });
  navbar.style.background = window.scrollY > 20
    ? 'rgba(8,12,20,0.97)' : 'rgba(8,12,20,0.85)';
});

// ── Formulario de contacto ──
function handleSubmit(e) {
  e.preventDefault();
  var btn = e.target.querySelector('.btn-form');
  var checks = e.target.querySelectorAll('input[name="servicios"]:checked');
  var servicios = Array.from(checks).map(function(c){ return c.value; });
  var msg = servicios.length
    ? '✅ ¡Consulta enviada! Te contactamos pronto.'
    : '✅ ¡Consulta enviada! Te contactamos pronto.';
  btn.textContent = msg;
  btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
  btn.disabled = true;
}

// ═══════════════════════════════════════════
// ANIMACIONES
// ═══════════════════════════════════════════

// ── 1. Partículas flotantes en el hero ──
(function createParticles() {
  var hero = document.getElementById('inicio');
  if (!hero) return;
  for (var i = 0; i < 9; i++) {
    var p    = document.createElement('span');
    p.className = 'hero-particle';
    var size  = Math.random() * 3   + 1.5;          // 1.5 – 4.5 px
    var left  = Math.random() * 88  + 6;             // 6 – 94 %
    var bot   = Math.random() * 40;                  // 0 – 40 %
    var dur   = Math.random() * 10  + 12;            // 12 – 22 s
    var delay = -(Math.random() * 20);               // stagger negativo
    var drift = (Math.random() - 0.5) * 80;          // ±40 px
    var op    = (Math.random() * 0.18 + 0.07).toFixed(2); // .07 – .25
    p.style.cssText = [
      'width:'  + size  + 'px',
      'height:' + size  + 'px',
      'left:'   + left  + '%',
      'bottom:' + bot   + '%',
      '--p-op:' + op,
      '--p-dx:' + drift + 'px',
      'animation-duration:'+ dur   + 's',
      'animation-delay:'   + delay + 's'
    ].join(';');
    hero.appendChild(p);
  }
})();

// ── 2. Contador animado (stats del hero) ──
function animateCounter(el, target, suffix, duration) {
  duration = duration || 1300;
  var neg   = target < 0;
  var abs   = Math.abs(target);
  var start = performance.now();
  (function tick(now) {
    var t    = Math.min((now - start) / duration, 1);
    var ease = 1 - Math.pow(1 - t, 3);           // ease-out cúbica
    el.textContent = (neg ? '-' : '') + Math.round(abs * ease) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}

// Inicia los contadores una vez finaliza la animación de entrada del hero
setTimeout(function () {
  document.querySelectorAll('.stat-num').forEach(function (el) {
    var txt = el.textContent.trim();
    if (txt === '3x')   animateCounter(el, 3,  'x',  1100);
    if (txt === '-60%') animateCounter(el, 60, '%',  1500);
  });
}, 1350);

// ── 3. Observers ──

// Observer genérico para bloques de texto (reveal-up)
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.20 });

// Observer para tarjetas con stagger
var cardObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    var el    = entry.target;
    var delay = parseInt(el.dataset.stagger || 0);
    setTimeout(function () {
      el.classList.add('visible');
      // Limpia el delay una vez terminada la transición (evita que hover herede el retraso)
      setTimeout(function () { el.style.transitionDelay = '0ms'; }, delay + 700);
    }, delay);
    cardObs.unobserve(el);
  });
}, { threshold: 0.12 });

// ── Servicios: cards entran escalonadas ──
document.querySelectorAll('.service-card').forEach(function (el, i) {
  el.classList.add('animate-card');
  el.dataset.stagger = i * 135;
  cardObs.observe(el);
});

// ── Nosotros: value-items entran en cascada ──
document.querySelectorAll('.value-item').forEach(function (el, i) {
  el.classList.add('animate-card');
  el.dataset.stagger = i * 115;
  cardObs.observe(el);
});

// ── Encabezados de sección (servicios + nosotros) ──
document.querySelectorAll(
  '#servicios .section-header, #nosotros .about-text'
).forEach(function (el) {
  el.classList.add('reveal-up');
  revealObs.observe(el);
});

// ── Footer: elementos en cascada ──
document.querySelectorAll(
  'footer .footer-logo, footer .footer-tagline, footer .footer-links, footer .footer-copy'
).forEach(function (el, i) {
  el.classList.add('reveal-up');
  el.style.transitionDelay = (i * 90) + 'ms';
  revealObs.observe(el);
});
