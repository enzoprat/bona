# BONA — Kit Instagram Story

Mini-kit de communication décliné **à l'identique de la charte du site** (`bonabordeaux.fr`).
Format : **1080 × 1920 px**, ratio 9:16, zones de sécurité Instagram respectées
(210 px en haut, 300 px en bas — réservés à l'interface et au sticker « lien »).

```
stories/
├── png/          ← les visuels prêts à publier (c'est ce qu'on poste)
├── html/         ← les sources, un fichier par visuel
├── kit.css       ← le système graphique (couleurs, typos, composants)
├── fonts.css     ← Tangerine + Sarabun embarquées (aucune connexion requise)
├── fonts/
├── index.html    ← planche de contact : tous les visuels sur une page
└── build.mjs     ← ré-export des PNG après modification
```

---

## 1. La charte, reprise du site

| | |
|---|---|
| Bleu nuit (fond) | `#03203d` — variantes `#021627` / `#0a2c4e` |
| Crème (texte, boutons pleins) | `#f7f7f4` |
| Doré (accent, deux stories seulement) | `#c9a86a` |
| Filets / bordures | `rgba(247,247,244,.22)` — 1 px sur le site, 2 px ici (mise à l'échelle ×2,7) |
| Titres | **Tangerine** 400, interlignage 0.92 |
| Textes, surtitres, boutons | **Sarabun** 300 / 500 |
| Surtitre (eyebrow) | 25 px, capitales, interlettrage 0.42em |
| Boutons | angles vifs (aucun arrondi), capitales, interlettrage 0.24em, flèche du site |
| Photos | `saturate(.9) contrast(1.02) brightness(1.12)` + voile bleu nuit |
| Ornement | le filet à losange du site (`.rule`) |
| Logo | wordmark crème centré en haut ; monogramme pour les stories les plus silencieuses |

Aucun arrondi, aucune ombre, aucun dégradé décoratif : le site n'en a pas.

## 2. Les 4 structures

Tout le kit repose sur **quatre compositions**, pas quatorze designs.

- **TYPE A — immersive** : bandeau photo + surtitre + titre Tangerine + filet + phrase.
  `nous-sommes-ouverts`, `debut-service`, `ce-soir`, `faim`
- **TYPE B — information** : fond bleu nuit, sans photo, liste ou cadre double.
  `horaires`, `fin-service`, `information`
- **TYPE C — conversion** : photo + titre + bouton crème plein + mention.
  `reservation`, `reservation-ce-soir`, `dernieres-tables`, `weekend`, `avis-google`
- **TYPE D — carte / produit** : listes de la carte, plat à l'honneur, teaser.
  `carte-01…05`, `plat`, `decouvrez-carte`

> Les photos du restaurant sont en 3:2 (assiette centrée sur bois sombre). Un plein cadre 9:16
> couperait l'assiette : le kit utilise donc un **bandeau** qui se fond dans le bleu nuit,
> exactement comme le hero du site. Ne pas remplacer un bandeau par un plein cadre
> sans vérifier le cadrage.

## 3. Modifier un visuel

Ouvrir le fichier correspondant dans `html/` — tout est en clair, en haut du fichier.

- **Changer une photo** → le `src="../../img/xxx.jpg"` (photos du site, dossier `assets/img/`)
- **Changer un texte** → les balises `eyebrow` (surtitre), `display` (titre), `lead` (phrase), `note` (mention basse)
- **Changer les horaires** → `story-horaires.html`, une ligne `<li>` par jour ; jour fermé = classe `is-closed`
- **Changer un plat** → `story-plat.html` : photo, nom, description, prix (4 lignes commentées)
- **Annonce ponctuelle** → `story-information.html` : fermeture, changement d'horaire, événement, nouveauté

Taille des titres : `d-xl` › `d-lg` › `d-md` › `d-sm`. Si un titre dépasse, descendre d'un cran
ou couper la ligne avec un `<br>`.

## 4. Ré-exporter les PNG

Une seule fois :

```bash
cd stories
npm install playwright
npx playwright install chromium
```

Puis, à chaque modification :

```bash
node build.mjs                 # tout ré-exporter
node build.mjs story-horaires  # un seul visuel
```

Les PNG sont écrits dans `png/`.

## 5. Publier

- Poster le PNG tel quel, sans recadrer.
- Sur les stories de conversion, poser le **sticker « lien »** juste sous le bouton crème
  (l'espace bas est réservé pour ça) — le bouton n'est pas cliquable, c'est le sticker qui l'est.
- `story-carte-01 → 05` se publient **à la suite**, dans l'ordre : couverture, entrées,
  plats, accompagnements, boissons.
- Le doré n'apparaît que deux fois : le surtitre de `dernieres-tables` et les étoiles de
  `avis-google`. Ne pas l'étendre aux autres visuels — c'est ce qui lui donne son caractère
  d'exception.

## 6. Avis Google

`story-avis-google` (bouton crème avec le G quadrichrome) et `story-avis-google-b`
(carte crème, reprise de la carte « réseaux » du site). Lien à mettre dans le sticker :

```
https://g.page/r/CTl2bNih9Pk8EAE/review
```

Le logo Google reste **toujours en quadrichromie sur fond crème**, jamais posé sur le bleu nuit :
c'est ce que demandent les règles de marque de Google, et c'est aussi ce qui le rend lisible.
Les étoiles sont une invitation à laisser un avis, pas une note affichée.
