/* Tennistavolo Cascina — interazioni base */
(function () {
  'use strict';

  /* ---- header compatto allo scroll ---- */
  var header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- menu mobile ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- reveal delle sezioni ---- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- contatori della fascia arancione ---- */
  var counters = document.querySelectorAll('.num[data-count]');
  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    var start = performance.now();
    var duration = 1200;
    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ---- form prova gratuita ----
     Nessun backend: per ora apre il client di posta con i dati compilati.
     Sostituire con l'endpoint del servizio scelto (Formspree, PHP, ecc.). */
  var form = document.getElementById('trial-form');
  var msg = document.getElementById('form-msg');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form-msg';
    msg.textContent = '';

    var fields = [
      document.getElementById('f-nome'),
      document.getElementById('f-email'),
      document.getElementById('f-tel'),
      document.getElementById('f-msg')
    ];
    var privacy = document.getElementById('f-privacy');
    var ok = true;

    fields.forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });

    if (!ok) {
      msg.className = 'form-msg err';
      msg.textContent = 'Controlla i campi evidenziati.';
      return;
    }
    if (!privacy.checked) {
      msg.className = 'form-msg err';
      msg.textContent = 'Devi accettare l’informativa privacy per continuare.';
      return;
    }

    var body = [
      'Nome: ' + document.getElementById('f-nome').value,
      'Email: ' + document.getElementById('f-email').value,
      'Telefono: ' + document.getElementById('f-tel').value,
      'Corso: ' + document.getElementById('f-corso').value,
      '',
      document.getElementById('f-msg').value
    ].join('\n');

    window.location.href = 'mailto:cascina-tt@katamail.com'
      + '?subject=' + encodeURIComponent('Richiesta lezione di prova')
      + '&body=' + encodeURIComponent(body);

    msg.className = 'form-msg ok';
    msg.textContent = 'Grazie! Si apre il tuo programma di posta con la richiesta già pronta.';
    form.reset();
  });

  /* ---- anno nel footer ---- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
