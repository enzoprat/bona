# Bona — Brasserie · Bordeaux

Site vitrine statique (HTML/CSS/JS, aucun build, aucune dépendance).

```
index.html          Accueil : hero, valeurs, histoire, signatures, aperçu carte, galerie, infos, réseaux
carte.html          Carte complète + tableau des allergènes
robots.txt
sitemap.xml
apps-script/        Ancien moteur de réservation (hors service, conservé au cas où)
vercel.json         Redirection de l'ancienne page de réservation vers TheFork
assets/css/style.css
assets/js/main.js
assets/js/i18n.js       Traductions (fr, en, es, de, it) + moteur
assets/js/carte.js      Disponibilités du soir (plat épuisé, description remplacée)
assets/img/         Photos (issues des visuels fournis)
assets/img/map/     9 tuiles OpenStreetMap servies en local (plan statique, sans iframe)
assets/logo/        Logotype, monogramme, favicon (SVG)
```

## Prévisualiser en local

```bash
cd /Users/pratenzo/Documents/Sites/bona && python3 .claude/serve.py
```

Puis http://127.0.0.1:4321 — ou ouvrir `index.html` directement dans le navigateur.

## Mise en ligne

Le site est 100% statique : aucune base de données, aucun serveur applicatif.

- **bonabordeaux.fr** — servi par **Vercel**, branché sur ce dépôt : chaque `git push`
  sur `main` redéploie. C'est l'adresse publique, celle des balises canoniques.
- **enzoprat.github.io/bona** — GitHub Pages, alimenté par le même dépôt. Utile pour
  vérifier une mise en ligne, redondant par ailleurs.

## Réservations

Les réservations passent par **TheFork** : le bouton « Réserver » et la navigation
pointent vers [la fiche du restaurant](https://www.thefork.fr/restaurant/bona-r868023).
Le site ne prend plus aucune réservation lui-même.

Un **bouton fixe** « Réserver sur TheFork » suit le défilement : pastille en bas à droite
sur grand écran, barre pleine largeur sur mobile. Il n'apparaît qu'une fois le hero
dépassé, pour ne pas doubler son bouton, et reste absent sur la carte tant qu'on n'a pas
commencé à lire.

La pastille est la marque officielle TheFork (`assets/logo/thefork.png`), détourée depuis
l'avatar de leur chaîne Giphy et servie en local — jamais en lien direct vers leur serveur.

L'ancienne adresse `bonabordeaux.fr/reservation.html` est redirigée en 301 vers TheFork
(`vercel.json`) : les liens déjà partagés continuent de fonctionner.

Le formulaire maison — créneaux de 15 minutes, Google Sheet, notifications — a été retiré.
Son moteur reste dans `apps-script/` si l'on souhaitait un jour y revenir ; `git log`
conserve la page et son JavaScript.

## Disponibilités du soir

La carte ne bouge pas ; ce qui bouge, c'est ce qu'il reste en cuisine. Une soirée se
déclare dans `assets/js/carte.js`, datée :

```js
'2026-09-25': {
  epuises: ['brochettes'],                  // barré, « Indisponible ce soir »
  descriptions: {                           // texte valable ce soir seulement
    brochettes: { fr: '3 × agneau mariné…', en: '…', es: '…', de: '…', it: '…' }
  }
}
```

Les identifiants sont ceux de l'attribut `data-plat` dans `carte.html`. Une date passée
n'a plus aucun effet : rien à défaire le lendemain.

La soirée est datée du jour de **l'ouverture**, pas de l'heure qu'il est : le service
allant jusqu'à 2 h du matin, la journée bascule à **5 h** (`BASCULE_HEURE`) et non à
minuit. Un plat barré le vendredi soir le reste jusqu'à la fermeture. Ne pas confondre avec `DATES_FERMEES`,
qui ferme une **soirée entière** à la réservation.

## Langues

Le site est en **français, anglais, espagnol, allemand et italien**. Le sélecteur est dans
l'en-tête (dans le menu burger sur mobile).

Le HTML est écrit en français : c'est ce que voient les moteurs de recherche et ce qui
s'affiche si le JavaScript ne s'exécute pas. Les autres langues sont appliquées par
`assets/js/i18n.js` sur les éléments marqués :

| Attribut | Effet |
|---|---|
| `data-i18n="cle"` | remplace le texte |
| `data-i18n-html="cle"` | remplace le contenu HTML (`<br>`, `<em>`, `<strong>`) |
| `data-i18n-attr="placeholder:cle"` | remplace un attribut |

La langue est choisie dans cet ordre : paramètre `?lang=en`, puis dernier choix mémorisé,
puis langue du navigateur, sinon français. Les jours et les dates du formulaire sont
formatés par `Intl`, donc traduits automatiquement.

**Pour modifier un texte**, cherchez sa clé dans `assets/js/i18n.js` : les cinq traductions
sont sur la même ligne, dans l'ordre `fr, en, es, de, it`. Pensez à corriger aussi le
texte français dans le HTML, qui sert de repli.

## Charte

| | |
|---|---|
| Bleu nuit | `#03203d` |
| Crème | `#f7f7f4` |
| Titres | Tangerine (Google Fonts) |
| Textes | Sarabun (Google Fonts) |

Toutes les couleurs sont des variables CSS en haut de `assets/css/style.css`.

## Contenu

Infos reprises de la carte, de l'identité visuelle et des visuels fournis :

- Adresse : 20 rue Sanche de Pomiers, 33000 Bordeaux
- Horaires estivaux : vendredi, samedi, dimanche · 19:00 – 02:00
- Réseaux : Instagram `@bonabordeaux`, TikTok `@bona.bordeaux`, Snapchat, avis Google
- Cuisine 100% faite maison et halal

### Points à confirmer

- **Téléphone / e-mail** : aucun numéro dans les documents fournis. Le bouton « Nous écrire »
  pointe pour l'instant vers Instagram. Pour ajouter un téléphone, remplacer ce bouton dans
  `index.html` (section `#infos`) par `<a class="btn" href="tel:+33...">Appeler</a>` et ajouter
  `"telephone"` dans le bloc JSON-LD en haut du fichier.
- **« Meule de parmesan »** : le dépliant écrit « Mûle de parmesan », corrigé en « Meule » sur
  le site. À valider.
- **Tiramisu cuillère** : présent dans le tableau des allergènes du dépliant mais absent de la
  page desserts (et sans prix). Il apparaît donc uniquement dans le tableau des allergènes.
- **Horaires** : affichés comme « ouverture estivale ». À mettre à jour hors saison dans
  `index.html` (section `#infos`) et dans le bloc `openingHoursSpecification`.

## Notes techniques

- Le plan est composé de tuiles OpenStreetMap téléchargées une fois et servies en local :
  pas d'iframe, pas de WebGL, pas de traceur tiers. L'attribution OSM est affichée, elle doit
  être conservée. Pour recentrer le plan, retélécharger les tuiles autour des nouvelles
  coordonnées et ajuster `transform: translate(...)` sur `.place__tiles`.
- Les animations d'apparition sont conditionnées à la classe `js` sur `<html>` : sans
  JavaScript, tout le contenu reste visible.
- Le logotype est repris tel quel du SVG fourni (`LOGO 6.svg`), en `currentColor`.
