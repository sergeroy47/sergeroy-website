#!/usr/bin/env python3
"""Crée les vignettes légères des galeries (dossier vignettes/).
À lancer depuis le dossier du site : python3 creer-vignettes.py
Nécessite Pillow. Les photos d'origine ne sont pas modifiées.
Règle de nommage (identique à cheminVignette() dans galerie-moteur.js) :
  vie/Été 2020.jpeg -> vignettes/vie/Ete_2020.jpg  (640 px de large, JPEG qualité 72)
"""
import re, os, unicodedata
from PIL import Image, ImageOps
src = open('galeries-contenu.js', encoding='utf-8').read()
fichiers = sorted(set(m for m in re.findall(r'"fichier":\s*"([^"]+)"', src) if not m.endswith('.html')))
def vignette(f):
    a = unicodedata.normalize('NFD', f)
    a = ''.join(c for c in a if not unicodedata.combining(c))
    a = re.sub(r'[^A-Za-z0-9._/-]', '_', a)
    a = re.sub(r'\.[A-Za-z0-9]+$', '', a)
    return 'vignettes/' + a + '.jpg'
n = 0
for f in fichiers:
    p = f if '/' in f else 'photos/' + f
    v = vignette(p)
    if not os.path.exists(p):
        print('introuvable :', p); continue
    if os.path.exists(v) and os.path.getmtime(v) >= os.path.getmtime(p):
        continue
    os.makedirs(os.path.dirname(v), exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(p)).convert('RGB')
    if im.width > 640:
        im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
    im.save(v, 'JPEG', quality=72, optimize=True, progressive=True)
    n += 1
print(n, 'vignette(s) créée(s) sur', len(fichiers), 'photos')
