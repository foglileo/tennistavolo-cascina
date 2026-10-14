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

  /* ---- rose delle squadre, stagione 2026/27 ----
     Fonte: documento "Squadre stagione 2026/2027" del Centro Giorgio Gradi.
     Per aggiornare una rosa basta modificare le righe qui sotto. */
  var SQUADRE = {
    B1: { titolo: 'Serie B1', sotto: 'Campionato nazionale', squadre: [
      { nome: 'B1A', girone: 'Girone C', capitano: 'Nicola Di Fiore',
        giocatori: ['Nita Petrica', 'Riccardo Grulliero', 'Rafael Taboada Valverde'] },
      { nome: 'B1B', girone: 'Girone C', capitano: 'Emanuele Vasta',
        giocatori: ['Tommaso Simi', 'Lorenzo Tavoletiti'] }
    ] },
    B2: { titolo: 'Serie B2', sotto: 'Campionato nazionale', squadre: [] },
    C1: { titolo: 'Serie C1', sotto: 'Campionato nazionale', squadre: [
      { nome: 'C1A', girone: 'Girone I', capitano: 'Lorenzo Frosini',
        giocatori: ['Enrico Gabriele Nita', 'Jan Smdrkal', 'Niccolò Tozzini'] },
      { nome: 'C1B', girone: 'Girone I', capitano: 'Lorenzo Balderi',
        giocatori: ['Filippo Paolicchi', 'Massimo Scuotto', 'Alice Borsani'] },
      { nome: 'C1C', girone: 'Girone H', capitano: 'Matteo Di Ponzio',
        giocatori: ['Alessandro Citi', 'Pietro Marioni', 'Rocco Bini'] },
      { nome: 'C1D', girone: 'Girone H', capitano: 'Fausto Mazzocco',
        giocatori: ['Lorenzo Catani', 'Davide Lucchesi', 'Marco Ficini'] }
    ] },
    C2: { titolo: 'Serie C2', sotto: 'Campionato regionale', squadre: [
      { nome: 'C2A', girone: 'Girone A', capitano: 'Christian Bacci',
        giocatori: ['Niccolò Vaiani', 'Valerio Donzella', 'Matteo Petralli'] },
      { nome: 'C2B', girone: 'Girone A', capitano: 'Marco Del Guasta',
        giocatori: ['Mattia Mori', 'Davide Ceragioli', 'Dante Ercolini'] },
      { nome: 'C2C', girone: 'Girone B', capitano: 'Eugenio Quartieri',
        giocatori: ['Alessio Bersezio', 'Edoardo Pachetti', 'Mattia Gradi', 'Federico Lomoro', 'Aurora Paoli'] },
      { nome: 'C2D', girone: 'Girone B', capitano: 'Francesco Mostacci',
        giocatori: ['Davide Raveggi', 'Stefano Lischi', 'Gabriele Scuotto', 'Massimiliano Paolicchi'] },
      { nome: 'C2E', girone: 'Girone C', capitano: 'Denis Gradi',
        giocatori: ['Luca Mainardi', 'Simone Lubrano', 'Maurizio Stefanelli', 'Leonardo Fogli'] }
    ] },
    D1: { titolo: 'Serie D1', sotto: 'Campionato regionale', squadre: [
      { nome: 'D1A', girone: 'Girone A', capitano: 'Mario Vitali',
        giocatori: ['Mariano Ercolini', 'Lorenzo Ulivi', 'Luca Radici'] },
      { nome: 'D1B', girone: 'Girone A', capitano: 'Daniele Menichetti',
        giocatori: ['Massimo Tonacchera', 'Alberto Massignani', 'Manuel Ruggeri', 'Alberto Angelo Guidi'] },
      { nome: 'D1C', girone: 'Girone B', capitano: 'Paolo Giovacchini',
        giocatori: ['Sergio Casagli', 'Emilio Ricci', 'Chiara Quartieri', 'Diego Pizzolante'] },
      { nome: 'D1D', girone: 'Girone B', capitano: 'Mario La Pira',
        giocatori: ['Alberto Bottai', 'Luca Cervasio', 'Claudio Donnarumma', 'Giacomo Sarti'] }
    ] },
    D2: { titolo: 'Serie D2', sotto: 'Campionato regionale', squadre: [
      { nome: 'D2A', girone: 'Girone B', capitano: 'Simone Franchi',
        giocatori: ['Christian Franchi', 'Claudia Callegari', 'Davide Grazian', 'Nicola Campanile', 'Alessandro Brucalassi'] },
      { nome: 'D2B', girone: 'Girone C', capitano: 'Enrico Ghignoli',
        giocatori: ['Simone Avallone', 'Mattia Pizzolante', 'Ginevra Ruggeri', 'Luisa Giuricin'] }
    ] },
    D3: { titolo: 'Serie D3', sotto: 'Campionato regionale', squadre: [
      { nome: 'D3 Cascina', girone: '', capitano: 'Daniele Caciagli',
        giocatori: ['Giuliano Acconci', 'Giuliano Giorgetti', 'Francesca Bedeschi', 'Sara Tagliamenti',
          'Paolo Zaccagnini', 'Maria Binetti', 'Valentino Pratelli'] }
    ] }
  };

  var overlay = document.getElementById('rose-overlay');
  var pannello = overlay ? overlay.querySelector('.rose-panel') : null;
  var corpoRose = document.getElementById('rose-body');
  var titoloRose = document.getElementById('rose-titolo');
  var kickerRose = document.getElementById('rose-kicker');
  var chiudiBtn = document.getElementById('rose-close');
  var ultimaSerie = null;

  function creaScheda(sq) {
    var art = document.createElement('article');
    art.className = 'rosa';

    var h = document.createElement('h3');
    h.textContent = sq.nome;
    art.appendChild(h);

    if (sq.girone) {
      var g = document.createElement('p');
      g.className = 'rosa-girone';
      g.textContent = sq.girone;
      art.appendChild(g);
    }

    var ul = document.createElement('ul');
    var cap = document.createElement('li');
    cap.className = 'capitano';
    var ruolo = document.createElement('span');
    ruolo.className = 'ruolo';
    ruolo.textContent = 'Capitano';
    cap.appendChild(ruolo);
    cap.appendChild(document.createTextNode(sq.capitano));
    ul.appendChild(cap);

    sq.giocatori.forEach(function (nome) {
      var li = document.createElement('li');
      li.textContent = nome;
      ul.appendChild(li);
    });

    art.appendChild(ul);
    return art;
  }

  function apriRose(serie) {
    var dati = SQUADRE[serie];
    if (!dati) return;

    titoloRose.textContent = dati.titolo;
    kickerRose.textContent = dati.sotto + ' · stagione 2026/27';
    corpoRose.innerHTML = '';

    if (!dati.squadre.length) {
      var vuoto = document.createElement('p');
      vuoto.className = 'rose-vuoto';
      vuoto.textContent = 'Rosa in aggiornamento.';
      corpoRose.appendChild(vuoto);
    } else {
      dati.squadre.forEach(function (sq) { corpoRose.appendChild(creaScheda(sq)); });
    }

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { overlay.classList.add('aperto'); });
    chiudiBtn.focus();
  }

  function chiudiRose() {
    overlay.classList.remove('aperto');
    document.body.style.overflow = '';
    setTimeout(function () { overlay.hidden = true; }, 200);
    if (ultimaSerie) ultimaSerie.focus();
  }

  if (overlay) {
    document.querySelectorAll('.serie[data-serie]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ultimaSerie = btn;
        apriRose(btn.dataset.serie);
      });
    });
    chiudiBtn.addEventListener('click', chiudiRose);
    overlay.addEventListener('click', function (e) {
      if (!pannello.contains(e.target)) chiudiRose();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) chiudiRose();
    });
  }

  /* ---- anno nel footer ---- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
