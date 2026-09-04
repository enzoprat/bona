/* ==========================================================================
   BONA — Formulaire de réservation
   Un groupe par créneau de 15 min, de 19h00 à 01h30, du vendredi au dimanche.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- À renseigner après le déploiement du script Google (voir apps-script/README.md) ---- */
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyT1bU71gzKyOVkJQy1Y9dMJ2VgcTJJb2PtO73ilvBdaSLz_u_E9FcMJW3cQdlaPVi6/exec';

  /* ---- Web3Forms : envoi de la notification par e-mail ----
     Cette clé est publique par conception : elle vit dans le JavaScript du site.
     Elle n'ouvre l'accès à rien — elle permet seulement d'envoyer un message
     vers l'adresse qui lui est associée. Régénérable sur web3forms.com. */
  var WEB3FORMS_CLE = '0fce4ac9-eb59-4bdb-a765-49c45e6410a9';

  var PREMIER_CRENEAU = '19:00';
  var DERNIER_CRENEAU = '01:30';
  var PAS_MINUTES = 15;
  var JOURS_OUVERTS = [5, 6, 0];       // vendredi, samedi, dimanche
  var MAX_SANS_COCHER = 6;
  var NB_DATES_PROPOSEES = 8;

  var form = document.getElementById('reservation');
  if (!form) return;

  /* Traduction : retombe sur le français si i18n.js n'est pas chargé. */
  function T(cle, secours) {
    var v = window.BonaI18n && window.BonaI18n.t(cle);
    return v || secours;
  }
  function langue() {
    return (window.BonaI18n && window.BonaI18n.courante()) || 'fr';
  }

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
    var l = langue();
    var nomJour = new Intl.DateTimeFormat(l, { weekday: 'long' });
    var nomDate = new Intl.DateTimeFormat(l, { day: 'numeric', month: 'long' });

    champsDate.innerHTML = '';

    prochainesDates().forEach(function (d, i) {
      var iso = cleISO(d);
      var id = 'date-' + iso;
      var coche = dateChoisie ? (iso === dateChoisie) : (i === 0);

      var label = document.createElement('label');
      label.className = 'chip';
      label.setAttribute('for', id);
      label.innerHTML =
        '<input type="radio" name="date" id="' + id + '" value="' + iso + '"' + (coche ? ' checked' : '') + '>' +
        '<span class="chip__jour">' + nomJour.format(d) + '</span>' +
        '<span class="chip__date">' + nomDate.format(d) + '</span>';

      champsDate.appendChild(label);
    });

    var premier = champsDate.querySelector('input[name="date"]:checked');
    if (premier) dateChoisie = premier.value;
  }

  /** Options « 1 personne … 6 personnes », dans la langue courante. */
  function construirePersonnes() {
    var valeur = personnes.value || '2';
    var un = T('resa.personne', 'personne');
    var pl = T('resa.personnes.pl', 'personnes');

    personnes.innerHTML = '';
    for (var n = 1; n <= MAX_SANS_COCHER; n++) {
      var o = document.createElement('option');
      o.value = String(n);
      o.textContent = n + ' ' + (n > 1 ? pl : un);
      personnes.appendChild(o);
    }
    personnes.value = valeur;
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
      annoncer(T('err.complet', 'Ce soir-là est complet. Choisissez une autre date.'), 'erreur');
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

    champsCreneau.innerHTML = '<p class="form__chargement"></p>';
    champsCreneau.firstChild.textContent = T('resa.chargement', 'Recherche des créneaux disponibles…');

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
      $('#personnes-libelle').textContent = T('resa.personnes.priv', 'Nombre de personnes attendues');
    } else {
      $('#personnes-libelle').textContent = T('resa.personnes', 'Nombre de personnes');
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
    if (!d.date) return T('err.date', 'Choisissez une date.');
    if (d.type === 'reservation' && !d.creneau) return T('err.creneau', 'Choisissez un créneau.');
    if (!(d.personnes >= 1)) return T('err.personnes', 'Indiquez le nombre de personnes.');
    if (d.personnes > MAX_SANS_COCHER && !d.grandGroupe) {
      return T('err.plus6', 'Au-delà de 6 personnes, cochez « Nous sommes plus de 6 ».');
    }
    if (d.nom.trim().length < 2) return T('err.nom', 'Indiquez votre nom.');
    if (d.telephone.replace(/\D/g, '').length < 9) return T('err.tel', 'Indiquez un numéro de téléphone valide.');
    return '';
  }

  var TEL_ANNULATION = '+33759310735';

  /**
   * Notifie la brasserie par e-mail via Web3Forms.
   * Volontairement isolé : si ce service tombe, la réservation reste enregistrée
   * côté Google Sheet et le client voit quand même sa confirmation.
   */
  function notifier(d) {
    if (!WEB3FORMS_CLE) return Promise.resolve('clé absente');

    var priv = d.type === 'privatisation';
    var jour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(d.date + 'T12:00:00'));

    var charge = {
      access_key: WEB3FORMS_CLE,
      from_name: 'Réservations Bona',
      subject: (priv ? 'Privatisation' : 'Réservation') + ' — ' + jour
             + (d.creneau ? ' à ' + d.creneau : '') + ' — ' + d.nom,
      'Type': priv ? 'Demande de privatisation' : 'Réservation',
      'Date': jour,
      'Créneau': d.creneau || '—',
      'Personnes': d.personnes + (d.grandGroupe ? ' (grand groupe)' : ''),
      'Nom': d.nom,
      'Téléphone': d.telephone,
      'E-mail': d.email || '—',
      'Message': d.message || '—',
      botcheck: ''
    };

    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(charge)
    })
      .then(function (r) { return r.json(); })
      .then(function (rep) { return rep && rep.success ? 'OK' : 'refusé'; })
      .catch(function () { return 'injoignable'; });
  }

  /** Récapitulatif lisible : « samedi 5 septembre à 20:30, pour 3 personnes ». */
  function recapitulatif(d) {
    var jour = new Intl.DateTimeFormat(langue(), { weekday: 'long', day: 'numeric', month: 'long' })
      .format(new Date(d.date + 'T12:00:00'));

    var texte = jour;
    if (d.creneau) texte += ' — ' + d.creneau;

    var mot = d.personnes > 1 ? T('resa.personnes.pl', 'personnes') : T('resa.personne', 'personne');
    return texte + ', ' + T('resa.recap.personnes', 'pour') + ' ' + d.personnes + ' ' + mot + '.';
  }

  /** Pop-up de confirmation. Retombe sur le bloc en ligne si <dialog> manque. */
  function ouvrirConfirmation(d) {
    var modale = document.getElementById('confirmation');
    if (!modale || typeof modale.showModal !== 'function') return false;

    var priv = d.type === 'privatisation';
    modale.querySelector('#confirmation-titre').textContent =
      priv ? T('resa.modal.titrePriv', 'Demande envoyée') : T('resa.modal.titre', 'Confirmation validée');
    modale.querySelector('#confirmation-recap').textContent = recapitulatif(d);

    // Numéro cliquable : un appui suffit depuis un téléphone.
    modale.querySelector('#confirmation-annulation').href = 'tel:' + TEL_ANNULATION;

    modale.querySelector('#confirmation-fermer').onclick = function () { modale.close(); };
    modale.showModal();
    return true;
  }

  function reussite(d) {
    var texte = d.type === 'privatisation'
      ? T('resa.ok.priv', 'Demande de privatisation envoyée.')
      : T('resa.ok.resa', 'Demande envoyée.');

    var bloc = document.createElement('div');
    bloc.className = 'form__merci';

    var titre = document.createElement('p');
    titre.className = 'display';
    titre.textContent = T('resa.merci', 'Merci') + ' ' + d.nom.split(' ')[0];

    var corps = document.createElement('p');
    if (d.type === 'reservation') {
      var j = new Intl.DateTimeFormat(langue(), { weekday: 'long', day: 'numeric', month: 'long' });
      texte += ' — ' + j.format(new Date(d.date + 'T12:00:00')) + ', ' + d.creneau + '.';
    }
    corps.textContent = texte;

    var retour = document.createElement('a');
    retour.className = 'btn';
    retour.href = 'index.html';
    retour.textContent = T('resa.retour', 'Retour à l’accueil');

    bloc.appendChild(titre);
    bloc.appendChild(corps);
    bloc.appendChild(retour);
    form.innerHTML = '';
    form.appendChild(bloc);

    ouvrirConfirmation(d);
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
      annoncer(T('err.endpoint', 'Le formulaire n’est pas encore relié.'), 'erreur');
      return;
    }

    envoiEnCours = true;
    bouton.disabled = true;
    annoncer(T('resa.envoi', 'Envoi en cours…'), 'attente');

    fetch(ENDPOINT, {
      method: 'POST',
      // text/plain évite le pré-vol CORS, qu'Apps Script ne sait pas traiter
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(d)
    })
      .then(function (r) { return r.json(); })
      .then(function (rep) {
        if (rep && rep.ok) {
          // Le créneau est acquis : on prévient la brasserie, puis on confirme au client.
          notifier(d);
          reussite(d);
          return;
        }
        annoncer((rep && rep.erreur) || T('err.envoi', 'Envoi impossible.'), 'erreur');
        if (rep && rep.creneauPris) chargerCreneaux(d.date);
      })
      .catch(function () {
        annoncer(T('err.envoi', 'Envoi impossible.'), 'erreur');
      })
      .then(function () {
        envoiEnCours = false;
        bouton.disabled = false;
      });
  });

  /* ---------- Démarrage ---------- */

  construireDates();
  construirePersonnes();
  appliquerMode();
  appliquerEffectif();
  if (dateChoisie) chargerCreneaux(dateChoisie);

  champsDate.addEventListener('change', function (e) {
    if (e.target.name !== 'date') return;
    dateChoisie = e.target.value;
    chargerCreneaux(dateChoisie);
  });

  for (var i = 0; i < modes.length; i++) modes[i].addEventListener('change', appliquerMode);
  grandGroupe.addEventListener('change', appliquerEffectif);

  /* Changement de langue : les libellés générés en JS sont refaits. */
  document.addEventListener('bona:langue', function () {
    construireDates();
    construirePersonnes();
    $('#personnes-libelle').textContent = mode() === 'privatisation'
      ? T('resa.personnes.priv', 'Nombre de personnes attendues')
      : T('resa.personnes', 'Nombre de personnes');
  });
})();
