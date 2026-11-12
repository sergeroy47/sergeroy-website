#!/usr/bin/env python3
"""Ajoute à chaque page (sauf index, admin et la redirection galerie-roches)
le lien canonique et les balises d'aperçu de partage (Open Graph / Twitter).
Sans effet sur une page qui les a déjà. À lancer depuis le dossier du site."""
import re, os, glob, json, posixpath
from urllib.parse import quote, unquote
BASE = 'https://sergeroy.ca/'
DEFAUT = 'og-image.jpg'
src = open('galeries-contenu.js', encoding='utf-8').read()
couv = {}
for m in re.finditer(r'"fichier":\s*"(galerie-[^"]+\.html)"', src):
    bloc = src[max(0, m.start() - 1500): m.end() + 1500]
    avant = src[:m.start()].rfind('{'); 
    # la vignette de la galerie est déclarée dans le même objet, avant "photos"
    fin = src.find('"photos"', m.end())
    obj = src[avant: fin if fin != -1 else m.end() + 800]
    v = re.search(r'"vignette":\s*"([^"]+)"', obj)
    if v: couv[m.group(1)] = v.group(1) if '/' in v.group(1) else 'photos/' + v.group(1)
pages = [p for p in sorted(glob.glob('*.html') + glob.glob('textes/*.html'))
         if p not in ('index.html', 'admin.html', 'galerie-roches.html')]
n = 0
for p in pages:
    s = open(p, encoding='utf-8', newline='').read()
    if 'property="og:title"' in s: continue
    t = re.search(r'<title>(.*?)</title>', s, re.S)
    d = re.search(r'^([ \t]*)<meta name="description" content="([^"]*)"\s*/?>[ \t]*\r?\n', s, re.M)
    if not t or not d: print('ignorée (titre ou description absents) :', p); continue
    titre = ' '.join(t.group(1).split()).replace('"', '&quot;')
    desc, ind = d.group(2), d.group(1)
    img = None
    if p in couv: img = couv[p]
    elif p.startswith('textes/') and p != 'textes/recueil.html':
        i = re.search(r'<img[^>]*\ssrc="([^"${]+)"', s)
        if i and not i.group(1).startswith(('http', 'data:')):
            img = posixpath.normpath(posixpath.join('textes', unquote(i.group(1))))
    if not img or not os.path.exists(img):
        if img: print('image introuvable, image par défaut utilisée :', p, img)
        img = DEFAUT
    url = BASE + quote(p); iurl = BASE + quote(img)
    nl = '\r\n' if d.group(0).endswith('\r\n') else '\n'
    lignes = [
        '<link rel="canonical" href="%s">' % url,
        '<meta property="og:type" content="%s">' % ('article' if p.startswith('textes/') and p != 'textes/recueil.html' else 'website'),
        '<meta property="og:url" content="%s">' % url,
        '<meta property="og:title" content="%s">' % titre,
        '<meta property="og:description" content="%s">' % desc,
        '<meta property="og:image" content="%s">' % iurl,
        '<meta property="og:site_name" content="Serge Roy">',
        '<meta property="og:locale" content="%s">' % ('en_CA' if p.endswith('_EN.html') else 'fr_CA'),
        '<meta name="twitter:card" content="summary_large_image">',
    ]
    if re.search(r'<link rel="canonical"', s): lignes = lignes[1:]
    ajout = ''.join(ind + l + nl for l in lignes)
    s = s[:d.end()] + ajout + s[d.end():]
    open(p, 'w', encoding='utf-8', newline='').write(s); n += 1
    print('%-62s %s' % (p, img))
print(n, 'page(s) mise(s) à jour sur', len(pages))
