// ============================================================
//  OUTILS DE LECTURE — SERGE ROY
//  1. Taille du texte réglable (A− / A+), mémorisée d'une visite à l'autre
//  2. Bouton « Écouter ce texte » : apparaît automatiquement si un
//     enregistrement audio/<nom-de-la-page>.m4a (ou .mp3) existe.
//     Ex. : textes/ma-vie-numerique.html → audio/ma-vie-numerique.m4a
// ============================================================
(function () {
  'use strict';

  var EN = (document.documentElement.lang || '').indexOf('en') === 0;

  /* ── 1. TAILLE DU TEXTE ──────────────────────────────────── */
  var CLE = 'serge-roy-taille-texte';
  var MIN = 0.85, MAX = 1.6, PAS = 0.15;
  var base = parseFloat(getComputedStyle(document.body).fontSize) || 19;

  function facteurActuel() {
    var f = parseFloat(localStorage.getItem(CLE));
    return (f >= MIN && f <= MAX) ? f : 1;
  }
  function appliquer(f) {
    document.body.style.fontSize = (base * f) + 'px';
    try { localStorage.setItem(CLE, f); } catch (e) {}
  }

  function creerBoutonsTaille() {
    var boite = document.createElement('div');
    boite.setAttribute('role', 'group');
    boite.setAttribute('aria-label', EN ? 'Text size' : 'Taille du texte');
    boite.style.cssText =
      'position:fixed;bottom:1.2rem;right:1.2rem;z-index:200;display:flex;gap:2px;' +
      'background:rgba(250,246,238,0.95);border:1px solid rgba(107,92,69,0.3);' +
      'border-radius:999px;padding:4px 6px;box-shadow:0 2px 10px rgba(28,26,20,0.12);' +
      'font-family:\'EB Garamond\',Georgia,serif;';

    function bouton(texte, etiquette, delta) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = texte;
      b.setAttribute('aria-label', etiquette);
      b.title = etiquette;
      b.style.cssText =
        'border:none;background:none;cursor:pointer;color:#6b5c45;' +
        'font-family:inherit;line-height:1;padding:6px 10px;border-radius:999px;' +
        'font-size:' + (delta > 0 ? '19px' : '14px') + ';';
      b.addEventListener('mouseenter', function () { b.style.background = 'rgba(184,144,58,0.15)'; });
      b.addEventListener('mouseleave', function () { b.style.background = 'none'; });
      b.addEventListener('click', function () {
        var f = facteurActuel() + delta;
        f = Math.max(MIN, Math.min(MAX, Math.round(f * 100) / 100));
        appliquer(f);
      });
      return b;
    }

    boite.appendChild(bouton('A−', EN ? 'Decrease text size' : 'Réduire la taille du texte', -PAS));
    boite.appendChild(bouton('A+', EN ? 'Increase text size' : 'Agrandir la taille du texte', PAS));
    document.body.appendChild(boite);
  }

  if (facteurActuel() !== 1) appliquer(facteurActuel());

  /* ── 2. LECTEUR AUDIO ────────────────────────────────────── */
  function nomDePage() {
    var chemin = decodeURIComponent(location.pathname);
    var fichier = chemin.substring(chemin.lastIndexOf('/') + 1);
    return fichier.replace(/\.html?$/i, '');
  }

  function pointInsertion() {
    return document.querySelector('.article-meta') ||
           document.querySelector('.article-entete') ||
           document.querySelector('h1');
  }

  function insererLecteur(url) {
    var ancre = pointInsertion();
    if (!ancre) return;

    var bloc = document.createElement('div');
    bloc.style.cssText =
      'max-width:560px;margin:1.8rem auto 0;padding:1rem 1.4rem;' +
      'background:#f2ead8;border:1px solid rgba(184,144,58,0.35);border-radius:8px;' +
      'text-align:center;position:relative;z-index:1;';

    var etiquette = document.createElement('div');
    etiquette.textContent = EN
      ? "🎧 Listen to this text — in Serge's own voice"
      : '🎧 Écouter ce texte — dans la voix de Serge';
    etiquette.style.cssText =
      'font-family:\'Cinzel\',serif;font-size:0.7rem;letter-spacing:0.18em;' +
      'text-transform:uppercase;color:#b8903a;margin-bottom:0.7rem;';

    var lecteur = document.createElement('audio');
    lecteur.controls = true;
    lecteur.preload = 'none';
    lecteur.src = url;
    lecteur.style.cssText = 'width:100%;';

    bloc.appendChild(etiquette);
    bloc.appendChild(lecteur);
    ancre.insertAdjacentElement('afterend', bloc);
  }

  function chercherAudio() {
    if (location.protocol === 'file:') return; // aperçu local sans serveur
    var nom = nomDePage();
    if (!nom || nom === 'recueil') return;
    var candidats = ['../audio/' + nom + '.m4a', '../audio/' + nom + '.mp3'];
    (function essayer(i) {
      if (i >= candidats.length) return;
      fetch(candidats[i], { method: 'HEAD' })
        .then(function (r) {
          if (r.ok) insererLecteur(candidats[i]);
          else essayer(i + 1);
        })
        .catch(function () { essayer(i + 1); });
    })(0);
  }

  function demarrer() {
    creerBoutonsTaille();
    chercherAudio();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
