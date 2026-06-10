# Aide-mémoire Git — Serge Roy

## Publier une modification sur le site

```bash
cd ~/Desktop/sergeroy-website
git add .
git commit -m "Description de ce que j'ai changé"
git push
```

Le site se met à jour sur https://sergeroy47.github.io/sergeroy-website en 2-5 minutes.

---

## Commandes utiles

| Commande | Ce qu'elle fait |
|---|---|
| `git status` | Voir quels fichiers ont été modifiés |
| `git add .` | Préparer tous les fichiers modifiés |
| `git commit -m "message"` | Enregistrer les changements avec un commentaire |
| `git push` | Envoyer les changements sur GitHub |
| `git log --oneline` | Voir l'historique des modifications |

---

## Flux de travail typique

1. Modifier le contenu via **admin.html** → cliquer **Export** → remplacer `contenu.js`
2. Ouvrir le terminal
3. Copier-coller ces 3 lignes :

```bash
cd ~/Desktop/sergeroy-website
git add .
git commit -m "Mise à jour du contenu"
git push
```

---

## Liens importants

- Site en ligne : https://sergeroy47.github.io/sergeroy-website
- Dépôt GitHub : https://github.com/sergeroy47/sergeroy-website
- Administration : https://sergeroy47.github.io/sergeroy-website/admin.html
