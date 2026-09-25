/* ==========================================================================
   BONA — Disponibilités du soir

   La carte imprimée ne bouge pas ; ce qui bouge, c'est ce qu'il reste en
   cuisine. Ce fichier ne sert qu'à ça : signaler qu'un plat n'est pas servi
   ce soir-là, ou qu'il l'est autrement.

   Pour déclarer une soirée, ajoutez une entrée datée ci-dessous :

     '2026-09-13': {
       epuises: ['cotebœuf'],                    // barré, « Indisponible ce soir »
       descriptions: {                           // texte remplacé pour ce soir
         brochettes: { fr: '…', en: '…', es: '…', de: '…', it: '…' }
       }
     }

   Les identifiants sont ceux de l'attribut data-plat dans carte.html.
   Une date passée n'a aucun effet : inutile de faire le ménage, mais les
   entrées anciennes peuvent être supprimées pour garder le fichier lisible.
   ========================================================================== */
(function () {
  'use strict';

  var DU_JOUR = {
    '2026-09-25': {
      epuises: ['brochettes']
    }
  };

  // Le service court jusqu'à 2 h du matin : à 0 h 30, on est encore « ce soir ».
  // La journée bascule donc à 5 h, pas à minuit, sinon le plat épuisé
  // réapparaîtrait sur la carte en plein service.
  var BASCULE_HEURE = 5;

  var plats = document.querySelectorAll('[data-plat]');
  if (!plats.length) return;

  function aujourdhui() {
    var d = new Date();
    d.setHours(d.getHours() - BASCULE_HEURE);
    return d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
      ('0' + d.getDate()).slice(-2);
  }

  function langue() {
    return (window.BonaI18n && window.BonaI18n.courante()) || 'fr';
  }

  function traduire(cle, secours) {
    var v = window.BonaI18n && window.BonaI18n.t(cle);
    return v || secours;
  }

  function appliquer() {
    var jour = DU_JOUR[aujourdhui()];

    plats.forEach(function (article) {
      var id = article.getAttribute('data-plat');
      var epuise = !!(jour && jour.epuises && jour.epuises.indexOf(id) !== -1);

      article.classList.toggle('is-epuise', epuise);

      // Badge « Indisponible ce soir »
      var badge = article.querySelector('.dish-row__epuise');
      if (epuise && !badge) {
        badge = document.createElement('span');
        badge.className = 'dish-row__epuise';
        article.insertBefore(badge, article.firstChild);
      }
      if (badge) {
        if (epuise) badge.textContent = traduire('carte.epuise', 'Indisponible ce soir');
        else badge.remove();
      }

      // Description remplacée pour ce soir
      var desc = article.querySelector('.desc');
      if (!desc) return;

      var remplacement = jour && jour.descriptions && jour.descriptions[id];
      if (remplacement) {
        // On neutralise la traduction générique, sinon elle écraserait le texte du soir.
        if (desc.dataset.i18nOriginal === undefined) {
          desc.dataset.i18nOriginal = desc.getAttribute('data-i18n') || '';
        }
        desc.removeAttribute('data-i18n');
        desc.textContent = remplacement[langue()] || remplacement.fr;
        desc.classList.add('desc--dujour');
      } else if (desc.dataset.i18nOriginal) {
        desc.setAttribute('data-i18n', desc.dataset.i18nOriginal);
        desc.classList.remove('desc--dujour');
      }
    });
  }

  appliquer();
  // i18n.js réécrit les textes à chaque changement de langue : on repasse après lui.
  document.addEventListener('bona:langue', appliquer);
})();
