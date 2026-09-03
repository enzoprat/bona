/* ==========================================================================
   BONA — Réservations
   Google Apps Script : stocke les demandes dans un Google Sheet
   et les pousse dans un seul fil WhatsApp via CallMeBot.

   Mise en place : voir apps-script/README.md
   ========================================================================== */

const CONFIG = {
  // Numéro qui reçoit toutes les réservations, au format attendu par CallMeBot :
  // indicatif pays sans le « + » ni espaces, comme dans l'URL d'activation du bot.
  NUMERO_WHATSAPP: '33749990924',

  // La clé CallMeBot se renseigne dans Paramètres du projet → Propriétés du script
  // (propriété « CLE_CALLMEBOT »), et surtout PAS ici : ce fichier est versionné.

  // Onglet du classeur qui reçoit les lignes (créé automatiquement s'il n'existe pas)
  NOM_FEUILLE: 'Réservations',

  // Service : un groupe tous les quarts d'heure, de 19h00 à 01h30
  PREMIER_CRENEAU: '19:00',
  DERNIER_CRENEAU: '01:30',
  PAS_MINUTES: 15,

  // Jours d'ouverture (0 = dimanche … 6 = samedi) : vendredi, samedi, dimanche
  JOURS_OUVERTS: [5, 6, 0],

  // Au-delà, le client doit cocher « groupe de plus de 6 » et préciser l'effectif
  MAX_SANS_COCHER: 6,

  // Garde-fous
  MAX_PERSONNES: 60,
  JOURS_A_L_AVANCE: 90
};

const ENTETES = [
  'Reçue le', 'Type', 'Date du service', 'Créneau', 'Personnes',
  'Grand groupe', 'Nom', 'Téléphone', 'E-mail', 'Message', 'WhatsApp'
];

/* --------------------------------------------------------------------------
   Créneaux
   -------------------------------------------------------------------------- */

/** Minutes écoulées depuis minuit pour une étiquette "HH:MM". */
function versMinutes_(hhmm) {
  const p = String(hhmm).split(':');
  return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
}

/** Étiquette "HH:MM" pour un nombre de minutes, ramené sur 24 h. */
function versEtiquette_(minutes) {
  const m = ((minutes % 1440) + 1440) % 1440;
  return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
}

/**
 * Liste ordonnée des créneaux du service. Le dernier créneau étant après
 * minuit, on lui ajoute 24 h pour que la boucle reste croissante.
 */
function creneaux_() {
  const debut = versMinutes_(CONFIG.PREMIER_CRENEAU);
  let fin = versMinutes_(CONFIG.DERNIER_CRENEAU);
  if (fin <= debut) fin += 1440;

  const out = [];
  for (let m = debut; m <= fin; m += CONFIG.PAS_MINUTES) out.push(versEtiquette_(m));
  return out;
}

/* --------------------------------------------------------------------------
   Feuille
   -------------------------------------------------------------------------- */

function feuille_() {
  const classeur = SpreadsheetApp.getActiveSpreadsheet();
  let f = classeur.getSheetByName(CONFIG.NOM_FEUILLE);

  if (!f) {
    f = classeur.insertSheet(CONFIG.NOM_FEUILLE);
    f.appendRow(ENTETES);
    f.getRange(1, 1, 1, ENTETES.length).setFontWeight('bold');
    f.setFrozenRows(1);
    // Sans cela, Sheets convertit « 2026-09-04 » en date et « 23:45 » en heure.
    f.getRange('C:D').setNumberFormat('@');
  }
  return f;
}

/**
 * Ramène une cellule à "AAAA-MM-JJ", que Sheets l'ait gardée en texte
 * ou convertie en date.
 */
function normaliserDate_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, fuseau_(), 'yyyy-MM-dd');
  }
  return String(v == null ? '' : v).trim().slice(0, 10);
}

/** Idem pour un créneau : "HH:MM", que Sheets l'ait converti en heure ou non. */
function normaliserCreneau_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, fuseau_(), 'HH:mm');
  }
  return String(v == null ? '' : v).trim();
}

function fuseau_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || 'Europe/Paris';
}

/** Créneaux déjà attribués pour une date de service donnée. */
function creneauxPris_(dateService) {
  const f = feuille_();
  const dernier = f.getLastRow();
  if (dernier < 2) return [];

  const lignes = f.getRange(2, 3, dernier - 1, 2).getValues(); // Date du service, Créneau
  const pris = [];

  for (let i = 0; i < lignes.length; i++) {
    const jour = normaliserDate_(lignes[i][0]);
    const creneau = normaliserCreneau_(lignes[i][1]);
    if (jour === dateService && creneau) pris.push(creneau);
  }
  return pris;
}

/* --------------------------------------------------------------------------
   Validation
   -------------------------------------------------------------------------- */

function estDateValide_(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T12:00:00').getTime());
}

function estJourOuvert_(s) {
  return CONFIG.JOURS_OUVERTS.indexOf(new Date(s + 'T12:00:00').getDay()) !== -1;
}

function propre_(v, max) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max || 300);
}

/**
 * Contrôle la demande et renvoie soit { erreur: '…' }, soit l'objet normalisé.
 * Les mêmes règles sont appliquées côté navigateur, mais on ne fait jamais
 * confiance à ce qui arrive du réseau.
 */
function valider_(d) {
  const type = d.type === 'privatisation' ? 'privatisation' : 'reservation';

  if (!estDateValide_(d.date)) return { erreur: 'Date invalide.' };

  const jour = new Date(d.date + 'T12:00:00');
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);

  if (jour < aujourdhui) return { erreur: 'Cette date est déjà passée.' };

  const limite = new Date(aujourdhui.getTime() + CONFIG.JOURS_A_L_AVANCE * 86400000);
  if (jour > limite) return { erreur: 'Réservation possible jusqu’à ' + CONFIG.JOURS_A_L_AVANCE + ' jours à l’avance.' };

  let creneau = '';
  if (type === 'reservation') {
    if (!estJourOuvert_(d.date)) return { erreur: 'Nous ouvrons le vendredi, le samedi et le dimanche.' };
    creneau = propre_(d.creneau, 5);
    if (creneaux_().indexOf(creneau) === -1) return { erreur: 'Créneau invalide.' };
  }

  const personnes = parseInt(d.personnes, 10);
  if (!(personnes >= 1)) return { erreur: 'Nombre de personnes invalide.' };
  if (personnes > CONFIG.MAX_PERSONNES) return { erreur: 'Pour un groupe de cette taille, contactez-nous directement.' };

  const grandGroupe = personnes > CONFIG.MAX_SANS_COCHER;
  if (grandGroupe && !d.grandGroupe) {
    return { erreur: 'Au-delà de ' + CONFIG.MAX_SANS_COCHER + ' personnes, cochez « groupe de plus de ' + CONFIG.MAX_SANS_COCHER + ' ».' };
  }
  const nom = propre_(d.nom, 80);
  if (nom.length < 2) return { erreur: 'Merci d’indiquer votre nom.' };

  const telephone = propre_(d.telephone, 30);
  if (telephone.replace(/\D/g, '').length < 9) return { erreur: 'Numéro de téléphone invalide.' };

  const email = propre_(d.email, 120);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return { erreur: 'Adresse e-mail invalide.' };

  return {
    type: type,
    date: d.date,
    creneau: creneau,
    personnes: personnes,
    grandGroupe: grandGroupe,
    nom: nom,
    telephone: telephone,
    email: email,
    message: propre_(d.message, 500)
  };
}

/* --------------------------------------------------------------------------
   WhatsApp (CallMeBot)
   -------------------------------------------------------------------------- */

function dateEnFrancais_(s) {
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const d = new Date(s + 'T12:00:00');
  return jours[d.getDay()] + ' ' + d.getDate() + ' ' + mois[d.getMonth()] + ' ' + d.getFullYear();
}

function messageWhatsApp_(r) {
  const l = [];

  if (r.type === 'privatisation') {
    l.push('🥂 DEMANDE DE PRIVATISATION');
    l.push('Date souhaitée : ' + dateEnFrancais_(r.date));
  } else {
    l.push('🍽️ NOUVELLE RÉSERVATION');
    l.push(dateEnFrancais_(r.date) + ' à ' + r.creneau);
  }

  l.push(r.personnes + (r.personnes > 1 ? ' personnes' : ' personne') + (r.grandGroupe ? ' (grand groupe)' : ''));
  l.push('');
  l.push(r.nom);
  l.push(r.telephone);
  if (r.email) l.push(r.email);
  if (r.message) {
    l.push('');
    l.push('« ' + r.message + ' »');
  }

  return l.join('\n');
}

/** Renvoie 'OK' ou le motif de l'échec — un envoi raté ne doit jamais perdre la demande. */
function envoyerWhatsApp_(texte) {
  const cle = PropertiesService.getScriptProperties().getProperty('CLE_CALLMEBOT');
  if (!cle) return 'clé CallMeBot absente';

  const url = 'https://api.callmebot.com/whatsapp.php'
    + '?phone=' + encodeURIComponent(CONFIG.NUMERO_WHATSAPP)
    + '&apikey=' + encodeURIComponent(cle)
    + '&text=' + encodeURIComponent(texte);

  try {
    const rep = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    const code = rep.getResponseCode();
    return (code >= 200 && code < 300) ? 'OK' : ('HTTP ' + code);
  } catch (e) {
    return 'erreur : ' + e.message;
  }
}

/* --------------------------------------------------------------------------
   Points d'entrée HTTP
   -------------------------------------------------------------------------- */

function json_(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet))
    .setMimeType(ContentService.MimeType.JSON);
}

/** GET ?date=YYYY-MM-DD → créneaux du service et créneaux déjà pris. */
function doGet(e) {
  const date = (e && e.parameter && e.parameter.date) || '';

  if (!estDateValide_(date)) {
    return json_({ ok: true, creneaux: creneaux_(), pris: [], joursOuverts: CONFIG.JOURS_OUVERTS });
  }

  return json_({
    ok: true,
    date: date,
    creneaux: creneaux_(),
    pris: creneauxPris_(date),
    joursOuverts: CONFIG.JOURS_OUVERTS
  });
}

/**
 * POST (corps JSON en text/plain, pour éviter le pré-vol CORS que
 * Apps Script ne sait pas traiter) → enregistre puis notifie.
 */
function doPost(e) {
  let brut;
  try {
    brut = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, erreur: 'Requête illisible.' });
  }

  // Pot de miel : rempli uniquement par un robot.
  if (propre_(brut.site, 50)) return json_({ ok: true });

  const r = valider_(brut);
  if (r.erreur) return json_({ ok: false, erreur: r.erreur });

  // Un seul groupe par créneau : on sérialise les écritures.
  const verrou = LockService.getScriptLock();
  try {
    verrou.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, erreur: 'Service occupé, merci de réessayer.' });
  }

  try {
    if (r.type === 'reservation' && creneauxPris_(r.date).indexOf(r.creneau) !== -1) {
      return json_({ ok: false, erreur: 'Ce créneau vient d’être réservé.', creneauPris: true });
    }

    const etat = envoyerWhatsApp_(messageWhatsApp_(r));

    feuille_().appendRow([
      new Date(),
      r.type === 'privatisation' ? 'Privatisation' : 'Réservation',
      r.date,
      r.creneau,
      r.personnes,
      r.grandGroupe ? 'oui' : '',
      r.nom,
      r.telephone,
      r.email,
      r.message,
      etat
    ]);

    return json_({ ok: true });
  } finally {
    verrou.releaseLock();
  }
}

/* --------------------------------------------------------------------------
   Test manuel : exécuter cette fonction une fois depuis l'éditeur pour
   vérifier la clé CallMeBot et l'arrivée du message sur le téléphone.
   -------------------------------------------------------------------------- */

function testerWhatsApp() {
  const etat = envoyerWhatsApp_('✅ Test Bona — le formulaire de réservation est bien relié.');
  Logger.log(etat);
}
