#!/bin/bash
# ============================================================
#  PUBLIER LE SITE — Serge Roy
#  Double-cliquez cette icône après un Export depuis l'Admin.
#  Elle récupère les fichiers exportés RÉCENTS dans Téléchargements,
#  demande confirmation, puis publie le site en ligne.
# ============================================================

SITE="$HOME/Desktop/sergeroy-website"
DL="$HOME/Downloads"

cd "$SITE" || { echo "Dossier du site introuvable."; read -n 1; exit 1; }

echo ""
echo "═══════════════════════════════════════════"
echo "   PUBLICATION DU SITE DE SERGE ROY"
echo "═══════════════════════════════════════════"
echo ""

# ── 1. Chercher les exports RÉCENTS (moins de 2 heures) ──
#    Un vieil export oublié dans Téléchargements pourrait écraser
#    des modifications plus récentes : on ne prend que le neuf.
for f in contenu.js galeries-contenu.js; do
  base="${f%.js}"
  recent=$(find "$DL" -maxdepth 1 -mmin -120 \
             \( -name "$f" -o -name "$base ([0-9]).js" -o -name "$base-[0-9].js" -o -name "$base([0-9]).js" \) \
             2>/dev/null | xargs -I{} ls -t {} 2>/dev/null | head -1)

  if [ -n "$recent" ] && [ -f "$recent" ]; then
    echo "  Export trouvé : $(basename "$recent")"
    echo "     modifié le $(date -r "$recent" '+%d %B %Y à %H:%M')"
    echo ""
    printf "     Remplacer %s par ce fichier ? (o/n) " "$f"
    read -n 1 rep
    echo ""
    if [ "$rep" = "o" ] || [ "$rep" = "O" ]; then
      cp "$recent" "$SITE/$f"
      rm -f "$recent"
      echo "     ✓ $f mis à jour"
    else
      echo "     · ignoré"
    fi
    echo ""
  fi
done

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

# ── 3. Alerte si un fichier de contenu RÉTRÉCIT beaucoup ──
#    (signe qu'une vieille version écrase des ajouts récents)
alerte=""
for f in contenu.js galeries-contenu.js; do
  if git ls-files --error-unmatch "$f" > /dev/null 2>&1; then
    avant=$(git show HEAD:"$f" 2>/dev/null | wc -c | tr -d ' ')
    apres=$(wc -c < "$f" | tr -d ' ')
    if [ "$avant" -gt 0 ] && [ "$apres" -lt $((avant * 70 / 100)) ]; then
      alerte="oui"
      echo "  ⚠ ATTENTION : $f a perdu beaucoup de contenu"
      echo "     (avant : $avant caractères — maintenant : $apres)"
    fi
  fi
done

if [ -n "$alerte" ]; then
  echo ""
  echo "     Cela arrive quand un vieil export remplace une version plus récente."
  printf "     Publier quand même ? (o/n) "
  read -n 1 rep
  echo ""
  if [ "$rep" != "o" ] && [ "$rep" != "O" ]; then
    echo ""
    echo "  Publication annulée. Rien n'a été envoyé en ligne."
    echo "  Demandez à Claude de vérifier avant de réessayer."
    echo ""
    echo "Appuyez sur une touche pour fermer."
    read -n 1
    exit 0
  fi
  echo ""
fi

# ── 4. Publier ──
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
