# Brancher le formulaire de réservation

Le formulaire est en place et fonctionne déjà en local, mais il n'envoie encore rien :
il lui manque l'adresse du script Google. Compte ~20 minutes, une seule fois.

Tu obtiens à la fin :

- **toutes les réservations dans un seul fil WhatsApp** sur le `+33 7 49 99 09 24` ;
- un **Google Sheet** qui garde l'historique ;
- les **créneaux déjà pris qui disparaissent** automatiquement du formulaire.

---

## 1. Obtenir la clé CallMeBot

Depuis le WhatsApp du **+33 7 49 99 09 24** (le numéro qui recevra les réservations) :

1. Ajoute **+34 644 51 95 23** dans tes contacts (nom au choix, « CallMeBot » par exemple).
2. Envoie-lui exactement ce message :

   ```
   I allow callmebot to send me messages
   ```

3. Le bot répond en quelques secondes avec une clé du type `123456`. **Garde-la.**

C'est ce fil de conversation qui recevra ensuite toutes les réservations.

---

## 2. Créer le classeur et le script

1. Va sur [sheets.new](https://sheets.new) — un nouveau Google Sheet s'ouvre. Nomme-le
   « Bona — Réservations ».
2. Menu **Extensions → Apps Script**.
3. Supprime le code d'exemple, colle **tout le contenu de `Code.gs`**. Enregistre (⌘S).
4. Menu de gauche → **Paramètres du projet** (roue dentée) → section **Propriétés du script**
   → **Ajouter une propriété** :

   | Propriété | Valeur |
   |---|---|
   | `CLE_CALLMEBOT` | la clé reçue à l'étape 1 |

   ⚠️ **Ne mets jamais la clé dans `Code.gs`** : ce fichier est versionné sur GitHub, donc public.
   N'importe qui pourrait alors envoyer des messages WhatsApp sur ton numéro.

---

## 3. Vérifier que WhatsApp répond

1. Dans le sélecteur de fonction en haut, choisis **`testerWhatsApp`**, puis **Exécuter**.
2. Google demande une autorisation la première fois : **Examiner les autorisations →
   ton compte → Paramètres avancés → Accéder à … (non sécurisé) → Autoriser.**
   C'est ton propre script, cet écran est normal.
3. Tu dois recevoir sur WhatsApp : *« ✅ Test Bona — le formulaire de réservation est bien relié. »*

Si rien n'arrive, ouvre **Exécutions** dans le menu de gauche : le journal indique le motif
(le plus souvent une clé erronée).

---

## 4. Publier le script

1. Bouton **Déployer → Nouveau déploiement**.
2. Roue dentée → **Application web**.
3. Renseigne :
   - **Exécuter en tant que** : *Moi*
   - **Qui a accès** : **Tout le monde**  ← indispensable, sinon le site ne peut pas écrire
4. **Déployer**, puis copie l'**URL de l'application web**. Elle ressemble à :

   ```
   https://script.google.com/macros/s/AKfycbx…/exec
   ```

---

## 5. Relier le site

Ouvre `assets/js/reservation.js`, ligne 9, et colle l'URL :

```js
var ENDPOINT = 'https://script.google.com/macros/s/AKfycbx…/exec';
```

C'est tout. Recharge la page de réservation et envoie une demande de test :
elle doit arriver sur WhatsApp **et** apparaître dans le Google Sheet.

---

## Au quotidien

- Le classeur se remplit tout seul, un onglet **Réservations**, une ligne par demande.
- La colonne **WhatsApp** indique `OK` si la notification est partie. Si elle affiche autre
  chose, la demande est quand même enregistrée — rien n'est jamais perdu.
- Pour **bloquer un créneau à la main** (soirée privatisée, table déjà prise par téléphone),
  ajoute simplement une ligne avec la date au format `AAAA-MM-JJ` en colonne C et l'heure en
  colonne D. Le créneau disparaît aussitôt du formulaire. Peu importe que Sheets affiche
  « 04/09/2026 » plutôt que « 2026-09-04 » : le script sait lire les deux.
- Pour **libérer un créneau**, supprime la ligne.

## Modifier les règles

Tout est en haut de `Code.gs`, dans `CONFIG` :

| Réglage | Valeur actuelle |
|---|---|
| `PREMIER_CRENEAU` / `DERNIER_CRENEAU` | `19:00` → `01:30` |
| `PAS_MINUTES` | `15` (27 créneaux par soir) |
| `JOURS_OUVERTS` | `[5, 6, 0]` = vendredi, samedi, dimanche |
| `MAX_SANS_COCHER` | `6` personnes |
| `JOURS_A_L_AVANCE` | `90` jours |

⚠️ Les mêmes valeurs sont répétées en haut de `assets/js/reservation.js` pour l'affichage.
**Modifie toujours les deux**, sinon le formulaire proposera des créneaux que le script refusera.

Après toute modification du script : **Déployer → Gérer les déploiements → crayon →
Version : Nouvelle version → Déployer.** L'URL ne change pas.

---

## Si CallMeBot tombe un jour

CallMeBot est un service gratuit et non officiel. Si un jour il ne répond plus, seule la
fonction `envoyerWhatsApp_()` est à remplacer (par l'API WhatsApp Cloud de Meta, ou par un
simple `MailApp.sendEmail()`). Le formulaire, le classeur et la gestion des créneaux
continuent de fonctionner sans rien changer — les réservations ne sont jamais perdues.
