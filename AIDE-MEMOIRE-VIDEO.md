# Aide-mémoire — Ajouter une vidéo ou une photo au site

## Le plus simple

Avant d'ajouter une nouvelle vidéo ou une photo lourde (plus de 20-30 Mo) au site,
demandez à Claude de la préparer d'abord. Ça évite les 3 problèmes qui ont causé
des vidéos cassées sur le site en juillet 2026 :

1. Fichier trop lourd (GitHub refuse au-delà de 100 Mo)
2. Index vidéo mal placé (rend la vidéo illisible dans le navigateur)
3. Nom de fichier avec espaces ou accents (peut créer un lien brisé)

## Après chaque `git push`

Les navigateurs gardent les vidéos en mémoire (cache) plus longtemps que le reste
d'une page. Si une vidéo semble ne pas fonctionner juste après une mise à jour :

1. Attendez 2-5 minutes (le temps que GitHub Pages reconstruise le site)
2. Testez dans une **fenêtre privée** (Cmd+Maj+N) plutôt que votre navigateur habituel
3. Si ça fonctionne en privé mais pas en navigation normale, c'est juste le cache —
   pas un vrai problème

## Si vous voulez le faire vous-même (optionnel)

Il faut avoir `ffmpeg` installé (`brew install ffmpeg` dans le Terminal, une seule fois).
Ensuite, pour préparer une vidéo avant de l'ajouter :

```bash
cd ~/Desktop/sergeroy-website/videos
ffmpeg -i "mon_nouveau_fichier.mp4" -vf "scale=1280:-2" -c:v libx264 -preset veryfast -crf 24 -maxrate 1500k -bufsize 3000k -c:a aac -b:a 128k -movflags +faststart nom_simple_sans_accents.mp4
```

Remplacez `mon_nouveau_fichier.mp4` par votre fichier et `nom_simple_sans_accents.mp4`
par un nom sans espaces ni accents (utilisez des underscores `_` à la place des espaces).
