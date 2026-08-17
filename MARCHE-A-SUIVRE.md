# Ajouter les nouvelles images à sergeroy-website

## Ce qu'il y a dans ce dossier

- **`arbres/`** — 5 images renommées (noms sans accents ni espaces, comme le reste du site)
- **`Famille/`** — le portrait d'Yvonne aux lumières de Noël
- **`galeries-contenu.js`** — votre fichier de contenu, avec « Arbres & roches » et « La famille » enrichies

## Les 6 images et leur nouveau nom

| Fichier d'origine | Nouveau nom | Légende |
|---|---|---|
| Arbre.jpeg | `arbres/arbre-dessin.jpg` | Le réseau des branches |
| ArbreVie.jpg | `arbres/arbre-vie.jpg` | L'arbre de vie |
| ArbrePrairies.jpg | `arbres/arbre-prairies.jpg` | L'arbre de la rivière des Prairies |
| ArbreNeige1.jpg | `arbres/arbre-neige.jpg` | Après la neige |
| DeerLongueuil.jpg | `arbres/chevreuils-longueuil.jpg` | Chevreuils — boisé de Longueuil |
| MèreNoel.jpeg | `Famille/YvonneNoel.jpg` | Yvonne — portrait aux lumières de Noël |

## Marche à suivre

1. Copiez le dossier **`arbres/`** à la racine de votre dossier `sergeroy-website`,
   au même niveau que `photos/`, `roches/` et `vie/`.

2. Copiez **`YvonneNoel.jpg`** dans votre dossier **`Famille/`** existant
   (ne remplacez pas le dossier, ajoutez seulement le fichier dedans).

3. Remplacez votre **`galeries-contenu.js`** par celui-ci.

4. Publiez avec votre fichier **`Publier le site.command`** (ou vos commandes git habituelles).

5. Videz le cache du navigateur, ou ajoutez `?v=2` à la fin de l'adresse pour voir le résultat.

## Vérification

- « Arbres & roches » passe de **2 à 7 photos**
- « La famille » passe de **24 à 25 photos** — le portrait d'Yvonne se place
  juste après « Noël — Yvonne, la mère Noël »

Les 6 autres galeries ne sont pas touchées (jardin 7, amis 2, album70 41,
école 13, vie 46, roches 9).

## À relire

Les textes qui accompagnent les images sont des **brouillons** — j'ai écrit dans
l'esprit de vos autres légendes, mais ce sont vos images et vos souvenirs.
Vous pouvez les modifier directement dans `galeries-contenu.js` (champ
`description`), ou par votre panneau **admin.html**.

Deux points à confirmer :

- **L'arbre de la rivière des Prairies** — j'ai déduit le lieu du nom du fichier.
  Si le pont est ailleurs, la légende est à corriger.
- **Le réseau des branches** — la description fait un clin d'œil à votre texte
  « Des réseaux dans des réseaux ». À enlever si le lien vous semble forcé.
