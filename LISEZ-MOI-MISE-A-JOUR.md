# Mise à jour du site — 4 juillet 2026

## Ce qui a été amélioré

1. **Partage corrigé** — L'aperçu du site (image + titre) s'affichera
   maintenant correctement quand vous partagez le lien par courriel,
   iMessage ou sur les réseaux sociaux.

2. **Site 3 fois plus léger** — Toutes les images ont été optimisées
   pour le web (51 Mo → 18 Mo). Le site se chargera beaucoup plus vite,
   surtout sur téléphone. La qualité visuelle reste identique à l'écran.
   (Vos originaux pleine résolution restent intacts sur votre Mac.)

3. **Animations allégées** — Les animations « Résonance » se mettent
   en pause quand elles ne sont pas visibles. Votre Mac et les
   téléphones des visiteurs chaufferont moins.

4. **Visibilité Google** — Ajout de robots.txt et sitemap.xml pour que
   les moteurs de recherche trouvent vos pages (et ignorent la page Admin).

## Comment publier cette mise à jour (3 étapes)

1. Ouvrez ce dossier et sélectionnez TOUT son contenu
   (index.html, robots.txt, sitemap.xml et les dossiers d'images).

2. Copiez le tout dans votre dossier de site :
   ~/Desktop/sergeroy-website
   → Répondez « Remplacer » quand le Mac le demande.

3. Ouvrez le Terminal et collez vos 3 lignes habituelles :

   cd ~/Desktop/sergeroy-website
   git add .
   git commit -m "Optimisation images, partage et performance"
   git push

Le site sera à jour en 2 à 5 minutes.
