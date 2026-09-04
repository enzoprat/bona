# Brancher le formulaire de réservation

Le formulaire est en place et fonctionne déjà en local, mais il n'envoie encore rien :
il lui manque l'adresse du script Google. Compte ~20 minutes, une seule fois.

Tu obtiens à la fin :

- un **e-mail immédiat** à chaque réservation, sur `bonabordeaux@gmail.com` ;
- la même notification **sur WhatsApp**, en complément ;
- un **Google Sheet** qui garde l'historique ;
- les **créneaux déjà pris qui disparaissent** automatiquement du formulaire.

> **Sur les délais WhatsApp.** CallMeBot est gratuit et non officiel : il met sa file
> d'attente à son rythme, parfois une demi-heure. C'est pour cette raison que l'e-mail
> est le canal principal — il part par Google et arrive en quelques secondes.
> Pour ne garder que l'e-mail, mets `WHATSAPP_ACTIF: false` dans `CONFIG`.

---

## 1. Obtenir la clé CallMeBot

Depuis le WhatsApp du **+33 7 49 99 09 24** (le numéro qui recevra les réservations) :

1. Ajoute **+34 644 33 66 63** dans tes contacts (nom au choix, « CallMeBot » par exemple).
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
- La dernière colonne indique ce qu'ont donné les deux envois, par exemple
  `e-mail OK · WhatsApp OK`. Un échec de notification n'empêche jamais l'écriture de
  la ligne — une réservation n'est jamais perdue.
- L'e-mail part sur `EMAIL_NOTIFICATION` (`bonabordeaux@gmail.com`), depuis le compte
  Google propriétaire du script. Change l'adresse pour la rediriger ailleurs ;
  `false` désactive l'e-mail, `WHATSAPP_ACTIF: false` désactive WhatsApp.
- Google limite l'envoi à **100 e-mails par jour** sur un compte gratuit. Largement
  au-dessus des 27 créneaux d'un service, mais c'est bon à savoir.
- Pour **bloquer un créneau à la main** (soirée privatisée, table déjà prise par téléphone),
  ajoute simplement une ligne avec la date au format `AAAA-MM-JJ` en colonne C et l'heure en
  colonne D. Le créneau disparaît aussitôt du formulaire. Peu importe que Sheets affiche
  « 04/09/2026 » plutôt que « 2026-09-04 » : le script sait lire les deux.
- Pour **libérer un créneau**, supprime la ligne.

## Retrouver le bon classeur

Le script écrit **dans le classeur auquel il est rattaché**, pas dans celui que vous avez
sous les yeux. Si le tableau semble vide alors que des réservations arrivent, c'est
qu'il y a plusieurs classeurs.

Pour lever le doute : lancez **`diagnostic`** depuis l'éditeur et lisez le
**Journal d'exécution**. Il affiche le nom du classeur, la liste de ses onglets, et
surtout **son URL** — cliquez dessus, vous tombez au bon endroit.

Le même renseignement est aussi renvoyé par l'application web, dans le champ `classeur`.

## Effacer les réservations de test

Lancez **`viderLesReservations`** depuis l'éditeur : toutes les lignes partent, les
en-têtes restent, et les créneaux redeviennent libres. Irréversible.

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

## Mettre les notifications en pause

Envoie `Stop` au bot (**+34 644 33 66 63**) pour suspendre les messages, `Resume`
pour les réactiver. Les réservations continuent d'être enregistrées dans le classeur
pendant la pause : seule la notification WhatsApp s'arrête.

## Si CallMeBot tombe un jour

CallMeBot est un service gratuit et non officiel. Si un jour il ne répond plus, seule la
fonction `envoyerWhatsApp_()` est à remplacer (par l'API WhatsApp Cloud de Meta, ou par un
simple `MailApp.sendEmail()`). Le formulaire, le classeur et la gestion des créneaux
continuent de fonctionner sans rien changer — les réservations ne sont jamais perdues.
