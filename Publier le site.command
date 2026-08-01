#!/bin/bash
# ============================================================
#  PUBLIER LE SITE — Serge Roy
#  Double-cliquez cette icône après un Export depuis l'Admin.
#  Elle récupère les fichiers exportés dans Téléchargements,
#  les met en place, puis publie le site en ligne.
# ============================================================

SITE="$HOME/Desktop/sergeroy-website"
DL="$HOME/Downloads"

cd "$SITE" || { echo "Dossier du site introuvable."; read -n 1; exit 1; }

echo ""
echo "═══════════════════════════════════════════"
echo "   PUBLICATION DU SITE DE SERGE ROY"
echo "═══════════════════════════════════════════"
echo ""

# ── 1. Récupérer les fichiers exportés depuis Téléchargements ──
recuperes=""
for f in contenu.js galeries-contenu.js; do
  # Prend la version la plus récente si plusieurs copies (contenu-2.js, etc.)
  recent=$(ls -t "$DL/$f" "$DL/${f%.js}"-*.js "$DL/${f%.js}"\ *.js 2>/dev/null | head -1)
  if [ -n "$recent" ] && [ -f "$recent" ]; then
    cp "$recent" "$SITE/$f"
    rm -f "$recent"
    echo "  ✓ $f récupéré depuis Téléchargements"
    recuperes="$recuperes $f"
  fi
done

if [ -z "$recuperes" ]; then
  echo "  · Aucun fichier exporté trouvé dans Téléchargements."
  echo "    (Ce n'est pas un problème : je publie les autres changements.)"
fi
echo ""

# ── 2. Vérifier qu'il y a bien quelque chose à publier ──
if [ -z "$(git status --porcelain)" ]; then
  echo "  Rien de nouveau à publier — le site est déjà à jour."
  echo ""
  echo "Appuyez sur une touche pour fermer."
  read -n 1
  exit 0
fi

echo "  Changements à publier :"
git status --short | sed 's/^/     /'
echo ""

# ── 3. Publier ──
echo "  Publication en cours…"
git add -A
git commit -m "Mise à jour du site $(date '+%d %B %Y à %H:%M')" > /dev/null 2>&1

if git push > /dev/null 2>&1; then
  echo ""
  echo "  ✓ C'est publié !"
  echo ""
  echo "  Le site sera en ligne dans 2 à 5 minutes :"
  echo "  https://sergeroy47.github.io/sergeroy-website"
else
  echo ""
  echo "  ⚠ La publication a échoué."
  echo "    Vérifiez votre connexion Internet, puis réessayez."
  echo "    Si le problème persiste, demandez à Claude."
fi

echo ""
echo "Appuyez sur une touche pour fermer."
read -n 1
