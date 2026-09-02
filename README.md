# Bona — Brasserie · Bordeaux

Site vitrine statique (HTML/CSS/JS, aucun build, aucune dépendance).

```
index.html          Accueil : hero, valeurs, histoire, signatures, aperçu carte, galerie, infos, réseaux
carte.html          Carte complète + tableau des allergènes
reservation.html    Formulaire de réservation et de privatisation
robots.txt
sitemap.xml
apps-script/        Backend des réservations (Google Apps Script) + sa notice
assets/css/style.css
assets/js/main.js
assets/js/reservation.js
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

Le site est 100% statique : déposer le contenu du dossier à la racine de l'hébergement
(OVH, Netlify, Vercel, GitHub Pages…). Aucune base de données, aucun serveur applicatif.
Le domaine `bonabordeaux.fr` est déjà renseigné dans les balises canoniques, Open Graph
et le sitemap.

## Réservations

Le formulaire de `reservation.html` propose **un groupe par créneau de 15 minutes,
de 19h00 à 01h30** (27 créneaux), uniquement les vendredis, samedis et dimanches.
Au-delà de 6 personnes, le client coche « Nous sommes plus de 6 » et saisit l'effectif.
Un second mode, **Privatisation**, demande une date libre plutôt qu'un créneau.

Les demandes partent dans **un seul fil WhatsApp** (via CallMeBot) et s'enregistrent dans un
Google Sheet, qui sert aussi à masquer les créneaux déjà pris.

👉 **Le formulaire n'enverra rien tant que l'étape de branchement n'est pas faite :
voir [`apps-script/README.md`](apps-script/README.md)** (~20 min, une seule fois).

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
