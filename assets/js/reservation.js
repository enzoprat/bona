/* ==========================================================================
   BONA — Formulaire de réservation
   Un groupe par créneau de 15 min, de 19h00 à 01h30, du vendredi au dimanche.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- À renseigner après le déploiement du script Google (voir apps-script/README.md) ---- */
  var ENDPOINT = 'A_REMPLIR';

  var PREMIER_CRENEAU = '19:00';
  var DERNIER_CRENEAU = '01:30';
  var PAS_MINUTES = 15;
  var JOURS_OUVERTS = [5, 6, 0];       // vendredi, samedi, dimanche
  var MAX_SANS_COCHER = 6;
  var NB_DATES_PROPOSEES = 8;

  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
              'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  var form = document.getElementById('reservation');
  if (!form) return;

  var $ = function (sel) { return form.querySelector(sel); };

  var champsDate = document.getElementById('dates');
  var champsCreneau = document.getElementById('creneaux');
  var blocCreneaux = document.getElementById('bloc-creneaux');
  var blocDatesOuvertes = document.getElementById('bloc-dates');
  var blocDateLibre = document.getElementById('bloc-date-libre');
  var dateLibre = $('#date-libre');
  var personnes = $('#personnes');
  var grandGroupe = $('#grand-groupe');
  var blocEffectif = document.getElementById('bloc-effectif');
  var effectif = $('#effectif');
  var etat = document.getElementById('etat');
  var bouton = $('button[type="submit"]');
  var modes = form.querySelectorAll('input[name="type"]');

  var dateChoisie = '';
  var creneauChoisi = '';
  var envoiEnCours = false;

  /* ---------- Utilitaires ---------- */

  function versMinutes(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function versEtiquette(minutes) {
    var m = ((minutes % 1440) + 1440) % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  }

  function listeCreneaux() {
    var debut = versMinutes(PREMIER_CRENEAU);
    var fin = versMinutes(DERNIER_CRENEAU);
    if (fin <= debut) fin += 1440;

    var out = [];
    for (var m = debut; m <= fin; m += PAS_MINUTES) out.push(versEtiquette(m));
    return out;
  }

  function cleISO(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function mode() {
    var coche = form.querySelector('input[name="type"]:checked');
    return coche ? coche.value : 'reservation';
  }

  function annoncer(texte, type) {
    etat.textContent = texte || '';
    etat.className = 'form__etat' + (type ? ' is-' + type : '');
  }

  /* ---------- Dates d'ouverture ---------- */

  function prochainesDates() {
    var out = [];
    var d = new Date();
    d.setHours(0, 0, 0, 0);

    for (var i = 0; out.length < NB_DATES_PROPOSEES && i < 120; i++) {
      var j = new Date(d.getTime() + i * 86400000);
      if (JOURS_OUVERTS.indexOf(j.getDay()) !== -1) out.push(j);
    }
    return out;
  }

  function construireDates() {
    prochainesDates().forEach(function (d, i) {
      var iso = cleISO(d);
      var id = 'date-' + iso;

      var label = document.createElement('label');
      label.className = 'chip';
      label.setAttribute('for', id);
      label.innerHTML =
        '<input type="radio" name="date" id="' + id + '" value="' + iso + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<span class="chip__jour">' + JOURS[d.getDay()] + '</span>' +
        '<span class="chip__date">' + d.getDate() + ' ' + MOIS[d.getMonth()] + '</span>';

      champsDate.appendChild(label);
    });

    champsDate.addEventListener('change', function (e) {
      if (e.target.name !== 'date') return;
      dateChoisie = e.target.value;
      chargerCreneaux(dateChoisie);
    });

    var premier = champsDate.querySelector('input[name="date"]:checked');
    if (premier) dateChoisie = premier.value;
  }

  /* ---------- Créneaux ---------- */

  function afficherCreneaux(creneaux, pris) {
    champsCreneau.innerHTML = '';
    creneauChoisi = '';

    var libres = 0;

    creneaux.forEach(function (c) {
      var estPris = pris.indexOf(c) !== -1;
      var id = 'creneau-' + c.replace(':', '');

      var label = document.createElement('label');
      label.className = 'slot' + (estPris ? ' is-pris' : '');
      label.setAttribute('for', id);
      label.innerHTML =
        '<input type="radio" name="creneau" id="' + id + '" value="' + c + '"' + (estPris ? ' disabled' : '') + '>' +
        '<span>' + c + '</span>';

      champsCreneau.appendChild(label);
      if (!estPris) libres++;
    });

    if (!libres) {
      annoncer('Ce soir-là est complet. Choisissez une autre date ou écrivez-nous sur Instagram.', 'erreur');
    } else {
      annoncer('');
    }
  }

  function chargerCreneaux(date) {
    var tous = listeCreneaux();

    if (ENDPOINT === 'A_REMPLIR') {
      afficherCreneaux(tous, []);
      return;
    }

    champsCreneau.innerHTML = '<p class="form__chargement">Recherche des créneaux disponibles…</p>';

    fetch(ENDPOINT + '?date=' + encodeURIComponent(date))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        afficherCreneaux(data.creneaux || tous, data.pris || []);
      })
      .catch(function () {
        // Le service ne répond pas : on affiche tout, la demande sera confirmée à la main.
        afficherCreneaux(tous, []);
      });
  }

  /* ---------- Bascule réservation / privatisation ---------- */

  function appliquerMode() {
    var priv = mode() === 'privatisation';

    blocDatesOuvertes.hidden = priv;
    blocCreneaux.hidden = priv;
    blocDateLibre.hidden = !priv;

    form.classList.toggle('is-privatisation', priv);

    if (priv) {
      if (!dateLibre.value) {
        var d = new Date(Date.now() + 14 * 86400000);
        dateLibre.min = cleISO(new Date());
        dateLibre.value = cleISO(d);
      }
      $('#personnes-libelle').textContent = 'Nombre de personnes attendues';
    } else {
      $('#personnes-libelle').textContent = 'Nombre de personnes';
      if (dateChoisie) chargerCreneaux(dateChoisie);
    }
    annoncer('');
  }

  /* ---------- Effectif ---------- */

  function appliquerEffectif() {
    var grand = grandGroupe.checked;

    blocEffectif.hidden = !grand;
    personnes.disabled = grand;
    effectif.required = grand;

    if (grand && !effectif.value) effectif.value = MAX_SANS_COCHER + 1;
  }

  function nombrePersonnes() {
    return grandGroupe.checked ? parseInt(effectif.value, 10) : parseInt(personnes.value, 10);
  }

  /* ---------- Envoi ---------- */

  function donnees() {
    var priv = mode() === 'privatisation';
    var creneau = form.querySelector('input[name="creneau"]:checked');

    return {
      type: priv ? 'privatisation' : 'reservation',
      date: priv ? dateLibre.value : dateChoisie,
      creneau: priv ? '' : (creneau ? creneau.value : ''),
      personnes: nombrePersonnes(),
      grandGroupe: grandGroupe.checked,
      nom: $('#nom').value,
      telephone: $('#telephone').value,
      email: $('#email').value,
      message: $('#message').value,
      site: $('#site').value            // pot de miel
    };
  }

  function verifier(d) {
    if (!d.date) return 'Choisissez une date.';
    if (d.type === 'reservation' && !d.creneau) return 'Choisissez un créneau.';
    if (!(d.personnes >= 1)) return 'Indiquez le nombre de personnes.';
    if (d.personnes > MAX_SANS_COCHER && !d.grandGroupe) {
      return 'Au-delà de ' + MAX_SANS_COCHER + ' personnes, cochez « groupe de plus de ' + MAX_SANS_COCHER + ' ».';
    }
    if (d.nom.trim().length < 2) return 'Indiquez votre nom.';
    if (d.telephone.replace(/\D/g, '').length < 9) return 'Indiquez un numéro de téléphone valide.';
    return '';
  }

  function reussite(d) {
    var texte = d.type === 'privatisation'
      ? 'Demande de privatisation envoyée. Nous vous rappelons pour en discuter.'
      : 'Demande envoyée pour le ' + d.date + ' à ' + d.creneau + '. Nous vous confirmons par téléphone.';

    form.innerHTML =
      '<div class="form__merci">' +
        '<p class="display">Merci ' + d.nom.split(' ')[0].replace(/[<>&]/g, '') + '</p>' +
        '<p>' + texte + '</p>' +
        '<a class="btn" href="index.html">Retour à l’accueil</a>' +
      '</div>';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (envoiEnCours) return;

    var d = donnees();
    var probleme = verifier(d);

    if (probleme) {
      annoncer(probleme, 'erreur');
      return;
    }

    if (ENDPOINT === 'A_REMPLIR') {
      annoncer('Le formulaire n’est pas encore relié : renseignez ENDPOINT dans assets/js/reservation.js.', 'erreur');
      return;
    }

    envoiEnCours = true;
    bouton.disabled = true;
    annoncer('Envoi en cours…', 'attente');

    fetch(ENDPOINT, {
      method: 'POST',
      // text/plain évite le pré-vol CORS, qu'Apps Script ne sait pas traiter
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(d)
    })
      .then(function (r) { return r.json(); })
      .then(function (rep) {
        if (rep && rep.ok) {
          reussite(d);
          return;
        }
        annoncer((rep && rep.erreur) || 'Envoi impossible. Réessayez ou écrivez-nous sur Instagram.', 'erreur');
        if (rep && rep.creneauPris) chargerCreneaux(d.date);
      })
      .catch(function () {
        annoncer('Envoi impossible. Vérifiez votre connexion ou écrivez-nous sur Instagram.', 'erreur');
      })
      .then(function () {
        envoiEnCours = false;
        bouton.disabled = false;
      });
  });

  /* ---------- Démarrage ---------- */

  construireDates();
  appliquerMode();
  appliquerEffectif();
  if (dateChoisie) chargerCreneaux(dateChoisie);

  for (var i = 0; i < modes.length; i++) modes[i].addEventListener('change', appliquerMode);
  grandGroupe.addEventListener('change', appliquerEffectif);
})();
