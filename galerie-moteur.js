/* ============================================================
   MOTEUR DE GALERIE — lit les données depuis galeries-contenu.js
   Ne pas modifier ce fichier.
   ============================================================ */
(function() {

  // Identifier la galerie courante par le nom du fichier HTML
  const pageCourante = location.pathname.split('/').pop() || 'index.html';
  function migrerGaleries(liste) {
    // Ajouter "photos/" uniquement si le fichier n'a pas déjà un sous-dossier
    const prefixer = (f) => (!f || f.includes('/')) ? f : 'photos/' + f;
    return liste.map(g => Object.assign({}, g, {
      vignette: prefixer(g.vignette),
      photos: (g.photos || []).map(p => Object.assign({}, p, { fichier: prefixer(p.fichier) }))
    }));
  }
  function getGaleries() {
    try {
      const s = localStorage.getItem('serge-roy-galeries');
      if (!s) return typeof GALERIES !== 'undefined' ? GALERIES : [];
      const local = JSON.parse(s);
      // Fusionner les photos depuis galeries-contenu.js si une galerie locale est vide
      if (typeof GALERIES !== 'undefined') {
        GALERIES.forEach(ref => {
          const loc = local.find(g => g.id === ref.id);
          if (loc && ref.photos && ref.photos.length > 0) {
            if (!loc.photos) loc.photos = [];
            // Remplacer complètement par les photos du fichier source (plus fiable)
            loc.photos = ref.photos;
            loc.vignette = loc.vignette || ref.vignette;
            loc.sousTitre = loc.sousTitre || ref.sousTitre;
            loc.intro = loc.intro || ref.intro;
            loc.etiquette = loc.etiquette || ref.etiquette;
          }
        });
      }
      return migrerGaleries(local);
    } catch(e) { return typeof GALERIES !== 'undefined' ? GALERIES : []; }
  }
  const GALERIE = getGaleries().find(g => g.fichier === pageCourante)
    || (typeof window.GALERIE_LOCALE !== 'undefined' ? window.GALERIE_LOCALE : null);

  if (!GALERIE) {
    document.body.innerHTML = '<p style="padding:4rem;text-align:center;font-family:Georgia,serif;">Galerie introuvable.</p>';
    return;
  }

  const photos = (GALERIE.photos || []).filter(p => p.fichier);

  // ── Construire la page ──────────────────────────────────────
  document.body.innerHTML = `
    <nav>
      <a href="galeries.html" class="nav-retour">← Toutes les galeries</a>
      <span class="nav-titre">${GALERIE.etiquette || 'Photographies'}</span>
    </nav>

    <div class="entete apparaitre">
      <div class="entete-ornement"></div>
      <span class="entete-etiquette">${GALERIE.etiquette || ''}</span>
      <h1><em>${GALERIE.titre}</em></h1>
      <div class="separateur"></div>
      <p class="entete-sous">${GALERIE.sousTitre || ''}</p>
      <p class="entete-intro">${GALERIE.intro || ''}</p>
      ${photos.length > 0 ? `<span class="entete-compte">${photos.length} photographie${photos.length > 1 ? 's' : ''}</span>` : ''}
    </div>

    <div class="galerie-conteneur">
      ${photos.length === 0
        ? `<div class="galerie-vide">Cette galerie est en préparation.<br>Revenez bientôt.</div>`
        : `<div class="mosaique" id="mosaique"></div>`
      }
    </div>

    <footer>
      <div class="footer-marque">SERGE ROY</div>
      <div class="footer-sous">Espace de mémoire, de création et de contemplation.</div>
      <a href="index.html" class="footer-lien">← Retour au site</a>
    </footer>

    <div class="desc-modal" id="desc-modal">
      <div class="desc-modal-corps">
        <button class="desc-modal-fermer" id="desc-fermer">✕ Fermer</button>
        <div class="desc-modal-titre" id="desc-titre"></div>
        <div class="desc-modal-sep"></div>
        <div class="desc-modal-texte" id="desc-texte"></div>
      </div>
    </div>

    <div class="lightbox" id="lightbox">
      <button class="lightbox-fermer" id="lb-fermer">✕ Fermer</button>
      <button class="lightbox-nav lightbox-prev" id="lb-prev">&#8249;</button>
      <img class="lightbox-img" id="lb-img" src="" alt="">
      <div class="lightbox-legende" id="lb-legende"></div>
      <button class="lightbox-nav lightbox-next" id="lb-next">&#8250;</button>
    </div>
  `;

  // ── Remplir la mosaïque ─────────────────────────────────────
  if (photos.length > 0) {
    const mosaique = document.getElementById('mosaique');
    photos.forEach((p, i) => {
      const bloc = document.createElement('div');
      bloc.className = 'photo-bloc apparaitre' + (p.description ? ' avec-desc' : '');
      const indice = p.description
        ? '<div class="photo-legende-indice">🔍 Cliquez pour agrandir &nbsp;·&nbsp; Cliquez sur la légende pour lire</div>'
        : '<div class="photo-legende-indice">🔍 Cliquez pour agrandir</div>';
      bloc.innerHTML = `
        <img src="${p.fichier}" alt="${p.legende || ''}" loading="lazy">
        <div class="photo-legende-voile">
          <div class="photo-legende-texte">${p.legende || ''}</div>
          ${indice}
        </div>`;
      bloc.querySelector('img').addEventListener('click', e => { e.stopPropagation(); ouvrirLightbox(i); });
      if (p.description) {
        const leg = bloc.querySelector('.photo-legende-texte');
        leg.style.cursor = 'pointer';
        leg.addEventListener('click', e => { e.stopPropagation(); ouvrirDescription(p.legende, p.description); });
      }
      mosaique.appendChild(bloc);
    });
  }

  // ── Lightbox ────────────────────────────────────────────────
  let idx = 0;
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbLeg = document.getElementById('lb-legende');

  function ouvrirLightbox(i) {
    idx = i; lbImg.src = photos[i].fichier; lbImg.alt = photos[i].legende || '';
    lbLeg.textContent = photos[i].legende || ''; lightbox.classList.add('actif');
    document.body.style.overflow = 'hidden';
  }
  function naviguer(dir) {
    idx = (idx + dir + photos.length) % photos.length;
    lbImg.src = photos[idx].fichier; lbImg.alt = photos[idx].legende || '';
    lbLeg.textContent = photos[idx].legende || '';
  }
  function fermerLB() { lightbox.classList.remove('actif'); lbImg.src = ''; document.body.style.overflow = ''; }

  document.getElementById('lb-fermer').addEventListener('click', fermerLB);
  document.getElementById('lb-prev').addEventListener('click', () => naviguer(-1));
  document.getElementById('lb-next').addEventListener('click', () => naviguer(1));
  lbImg.addEventListener('click', fermerLB);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) fermerLB(); });

  // ── Modal description ───────────────────────────────────────
  const descModal = document.getElementById('desc-modal');
  function ouvrirDescription(titre, texte) {
    document.getElementById('desc-titre').textContent = titre;
    document.getElementById('desc-texte').textContent = texte;
    descModal.classList.add('actif'); document.body.style.overflow = 'hidden';
  }
  function fermerDesc() { descModal.classList.remove('actif'); document.body.style.overflow = ''; }
  document.getElementById('desc-fermer').addEventListener('click', fermerDesc);
  descModal.addEventListener('click', e => { if (e.target === descModal) fermerDesc(); });

  // ── Clavier ─────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (lightbox.classList.contains('actif')) {
      if (e.key === 'ArrowRight') naviguer(1);
      else if (e.key === 'ArrowLeft') naviguer(-1);
      else if (e.key === 'Escape') fermerLB();
    } else if (descModal.classList.contains('actif') && e.key === 'Escape') fermerDesc();
  });

  // ── Animation ───────────────────────────────────────────────
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 60); obs.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.apparaitre').forEach(el => obs.observe(el));

})();
