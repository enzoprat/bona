/* ==========================================================================
   BONA — Multilingue (fr, en, es, de, it)

   Le HTML est écrit en français : c'est la version servie aux moteurs de
   recherche et affichée si le JavaScript ne s'exécute pas. Les autres langues
   sont appliquées ici, sur les éléments porteurs d'un attribut :

     data-i18n="cle"            remplace le texte
     data-i18n-html="cle"       remplace le contenu HTML (texte avec <br>, <strong>…)
     data-i18n-attr="attr:cle"  remplace un attribut (placeholder, aria-label, content…)

   Les traductions sont rangées par clé, dans l'ordre : fr, en, es, de, it.
   ========================================================================== */

window.BonaI18n = (function () {
  'use strict';

  var LANGUES = ['fr', 'en', 'es', 'de', 'it'];
  var DEFAUT = 'fr';
  var STOCKAGE = 'bona-langue';

  var T = {

    /* ---------- Navigation, en-tête, pied de page ---------- */
    'nav.histoire':   ['Histoire', 'Story', 'Historia', 'Geschichte', 'Storia'],
    'nav.carte':      ['La carte', 'Menu', 'La carta', 'Speisekarte', 'Il menù'],
    'nav.galerie':    ['Galerie', 'Gallery', 'Galería', 'Galerie', 'Galleria'],
    'nav.reserver':   ['Réserver', 'Book', 'Reservar', 'Reservieren', 'Prenota'],
    'nav.trouver':    ['Nous trouver', 'Find us', 'Cómo llegar', 'Anfahrt', 'Dove siamo'],
    'brand.tag':      ['Brasserie', 'Brasserie', 'Brasserie', 'Brasserie', 'Brasserie'],
    'a11y.menu':      ['Ouvrir le menu', 'Open menu', 'Abrir el menú', 'Menü öffnen', 'Apri il menu'],
    'a11y.langue':    ['Choisir la langue', 'Choose language', 'Elegir idioma', 'Sprache wählen', 'Scegli la lingua'],

    'footer.desc': [
      'Brasserie bordelaise. Une cuisine exclusivement faite maison, halal, à partir de produits frais rigoureusement sélectionnés.',
      'A brasserie in Bordeaux. Everything is made in-house and halal, from carefully selected fresh produce.',
      'Brasserie bordelesa. Una cocina exclusivamente casera y halal, con productos frescos rigurosamente seleccionados.',
      'Brasserie in Bordeaux. Eine Küche, die alles selbst zubereitet, halal, aus sorgfältig ausgewählten frischen Produkten.',
      'Brasserie bordolese. Una cucina interamente fatta in casa e halal, con prodotti freschi rigorosamente selezionati.'
    ],
    'footer.adresse':    ['Adresse', 'Address', 'Dirección', 'Adresse', 'Indirizzo'],
    'footer.navigation': ['Navigation', 'Navigation', 'Navegación', 'Navigation', 'Navigazione'],
    'footer.maps':       ['Ouvrir dans Google Maps', 'Open in Google Maps', 'Abrir en Google Maps', 'In Google Maps öffnen', 'Apri in Google Maps'],
    'footer.histoire':   ['Notre histoire', 'Our story', 'Nuestra historia', 'Unsere Geschichte', 'La nostra storia'],
    'footer.allergenes': ['Allergènes', 'Allergens', 'Alérgenos', 'Allergene', 'Allergeni'],
    'footer.horaires':   ['Horaires & accès', 'Hours & directions', 'Horarios y acceso', 'Öffnungszeiten & Anfahrt', 'Orari e come arrivare'],
    'footer.droits': [
      'Bona Brasserie — Bordeaux. Tous droits réservés.',
      'Bona Brasserie — Bordeaux. All rights reserved.',
      'Bona Brasserie — Burdeos. Todos los derechos reservados.',
      'Bona Brasserie — Bordeaux. Alle Rechte vorbehalten.',
      'Bona Brasserie — Bordeaux. Tutti i diritti riservati.'
    ],

    /* ---------- Accueil : hero ---------- */
    'home.hero.sub':  ['Brasserie · Bordeaux', 'Brasserie · Bordeaux', 'Brasserie · Burdeos', 'Brasserie · Bordeaux', 'Brasserie · Bordeaux'],
    'home.hero.line': [
      'Une cuisine brute et sincère',
      'Honest, unadorned cooking',
      'Una cocina pura y sincera',
      'Eine ehrliche, unverfälschte Küche',
      'Una cucina schietta e sincera'
    ],
    'home.hero.m1': ['100% fait maison', '100% homemade', '100% casero', '100% hausgemacht', '100% fatto in casa'],
    'home.hero.m2': ['Halal', 'Halal', 'Halal', 'Halal', 'Halal'],
    'home.hero.m3': ['Produits frais', 'Fresh produce', 'Productos frescos', 'Frische Produkte', 'Prodotti freschi'],
    'home.hero.cta1': ['Réserver une table', 'Book a table', 'Reservar mesa', 'Tisch reservieren', 'Prenota un tavolo'],
    'home.hero.cta2': ['Découvrir la carte', 'See the menu', 'Ver la carta', 'Zur Speisekarte', 'Scopri il menù'],
    'home.scroll':    ['Défiler', 'Scroll', 'Desplazar', 'Scrollen', 'Scorri'],
    'home.hero.alt': [
      'Entrecôte grillée accompagnée de pommes grenailles',
      'Grilled rib steak served with baby potatoes',
      'Entrecot a la parrilla con patatas pequeñas',
      'Gegrilltes Entrecôte mit Drillingskartoffeln',
      'Entrecôte alla griglia con patate novelle'
    ],

    /* ---------- Accueil : valeurs ---------- */
    'home.val1.t': ['Fait maison', 'Homemade', 'Casero', 'Hausgemacht', 'Fatto in casa'],
    'home.val1.d': [
      'Tout est confectionné sur place, chaque jour, sans raccourci.',
      'Everything is made here, every day, with no shortcuts.',
      'Todo se elabora aquí, cada día, sin atajos.',
      'Alles wird hier zubereitet, jeden Tag, ohne Abkürzungen.',
      'Tutto è preparato qui, ogni giorno, senza scorciatoie.'
    ],
    'home.val2.t': ['Halal', 'Halal', 'Halal', 'Halal', 'Halal'],
    'home.val2.d': [
      'Une carte intégralement halal, du premier plat au dernier.',
      'The entire menu is halal, from the first dish to the last.',
      'Una carta íntegramente halal, del primer plato al último.',
      'Die gesamte Karte ist halal, vom ersten bis zum letzten Gericht.',
      'Un menù interamente halal, dal primo all’ultimo piatto.'
    ],
    'home.val3.t': ['Produits frais', 'Fresh produce', 'Productos frescos', 'Frische Produkte', 'Prodotti freschi'],
    'home.val3.d': [
      'Des matières premières brutes, rigoureusement sélectionnées.',
      'Raw ingredients, rigorously selected.',
      'Materias primas puras, rigurosamente seleccionadas.',
      'Rohe Zutaten, sorgfältig ausgewählt.',
      'Materie prime pure, rigorosamente selezionate.'
    ],

    /* ---------- Accueil : histoire ---------- */
    'home.story.eyebrow': ['Histoire de Bona', 'The Bona story', 'La historia de Bona', 'Die Geschichte von Bona', 'La storia di Bona'],
    'home.story.title':   ['Le Silence des Mains', 'The Silence of Hands', 'El Silencio de las Manos', 'Das Schweigen der Hände', 'Il Silenzio delle Mani'],
    'home.story.fig':     ['Le chef · En cuisine', 'The chef · In the kitchen', 'El chef · En la cocina', 'Der Küchenchef · In der Küche', 'Lo chef · In cucina'],
    'home.story.intro': [
      'C’est l’histoire d’un héritage,<br>le souffle d’une transmission.',
      'This is the story of an inheritance,<br>the breath of something passed down.',
      'Es la historia de una herencia,<br>el aliento de una transmisión.',
      'Dies ist die Geschichte eines Erbes,<br>der Atem einer Weitergabe.',
      'È la storia di un’eredità,<br>il respiro di una trasmissione.'
    ],
    'home.story.p1': [
      'À l’âge de quatre ans, mon père a levé la main sur moi avec seulement deux doigts. Ce fut la première et la dernière fois qu’il posa sa main sur moi. Ce geste fut le plus bel acte d’amour qu’il m’ait offert.',
      'When I was four years old, my father raised his hand to me with only two fingers. It was the first and the last time he laid a hand on me. That gesture was the most beautiful act of love he ever gave me.',
      'A los cuatro años, mi padre levantó la mano sobre mí con solo dos dedos. Fue la primera y la última vez que me puso la mano encima. Ese gesto fue el acto de amor más hermoso que me ofreció.',
      'Als ich vier Jahre alt war, hob mein Vater die Hand gegen mich — mit nur zwei Fingern. Es war das erste und das letzte Mal, dass er Hand an mich legte. Diese Geste war der schönste Liebesbeweis, den er mir je geschenkt hat.',
      'A quattro anni, mio padre alzò la mano su di me con due sole dita. Fu la prima e l’ultima volta che mi mise le mani addosso. Quel gesto fu il più bell’atto d’amore che mi abbia mai offerto.'
    ],
    'home.story.p2': [
      'Depuis ce jour, j’avance droit, guidé par le respect. En effleurant ma peau, il venait de graver en moi une valeur absolue : <em>la rigueur</em>. Aujourd’hui, à 27 ans, je sens encore la présence de ces deux doigts sur ma joue.',
      'Since that day I have walked straight, guided by respect. In brushing my skin, he had engraved in me one absolute value: <em>rigour</em>. Today, at 27, I still feel those two fingers on my cheek.',
      'Desde ese día avanzo recto, guiado por el respeto. Al rozar mi piel, acababa de grabar en mí un valor absoluto: <em>el rigor</em>. Hoy, a los 27 años, aún siento esos dos dedos en mi mejilla.',
      'Seit jenem Tag gehe ich aufrecht, geleitet von Respekt. Mit dieser Berührung hatte er mir einen absoluten Wert eingeprägt: <em>Strenge</em>. Heute, mit 27, spüre ich diese zwei Finger noch immer auf meiner Wange.',
      'Da quel giorno cammino dritto, guidato dal rispetto. Sfiorando la mia pelle, aveva inciso in me un valore assoluto: <em>il rigore</em>. Oggi, a 27 anni, sento ancora quelle due dita sulla mia guancia.'
    ],
    'home.story.p3': [
      'Ce sont eux qui me dictent le geste juste, ce sont eux qui me permettent de vous servir une cuisine brute et sincère, à l’image de cette empreinte sacrée.',
      'They are what guide my hand to the right gesture; they are what let me serve you cooking that is raw and sincere, in the image of that sacred mark.',
      'Son ellos los que me dictan el gesto justo, los que me permiten servirles una cocina pura y sincera, a imagen de esa huella sagrada.',
      'Sie sind es, die mir die richtige Bewegung vorgeben; sie erlauben mir, Ihnen eine unverfälschte, ehrliche Küche zu servieren, nach dem Bild dieses heiligen Abdrucks.',
      'Sono loro a dettarmi il gesto giusto, sono loro a permettermi di servirvi una cucina schietta e sincera, a immagine di quell’impronta sacra.'
    ],
    'home.story.p4': [
      'Derrière chaque assiette, nos intentions sont pures. Un dialogue silencieux s’instaure, entre la matière vivante et le savoir hérité. Ici, nous explorons une gastronomie radicale, où le temps se suspend et où l’affinage devient le luxe ultime.',
      'Behind every plate our intentions are pure. A silent dialogue begins, between living matter and inherited knowledge. Here we explore a radical gastronomy, where time is suspended and ageing becomes the ultimate luxury.',
      'Detrás de cada plato, nuestras intenciones son puras. Se establece un diálogo silencioso entre la materia viva y el saber heredado. Aquí exploramos una gastronomía radical, donde el tiempo se detiene y la maduración se vuelve el lujo supremo.',
      'Hinter jedem Teller stehen reine Absichten. Ein stiller Dialog entsteht zwischen lebendiger Materie und ererbtem Wissen. Hier erkunden wir eine radikale Gastronomie, in der die Zeit stillsteht und die Reifung zum höchsten Luxus wird.',
      'Dietro ogni piatto, le nostre intenzioni sono pure. Si instaura un dialogo silenzioso tra la materia viva e il sapere ereditato. Qui esploriamo una gastronomia radicale, dove il tempo si sospende e la stagionatura diventa il lusso supremo.'
    ],
    'home.story.p5': [
      'Dans ce refuge urbain, les mains orchestrent un ballet invisible. Elles apprivoisent le produit, unissent la Terre et la Mer, pour n’en révéler que la vérité la plus pure — la plus nue, à l’image des doigts de mon père sur ma joue.',
      'In this urban refuge, hands conduct an invisible ballet. They tame the produce, join land and sea, to reveal only its purest truth — its barest, like my father’s fingers on my cheek.',
      'En este refugio urbano, las manos orquestan un ballet invisible. Domestican el producto, unen la Tierra y el Mar, para revelar solo su verdad más pura — la más desnuda, como los dedos de mi padre en mi mejilla.',
      'In diesem städtischen Refugium führen die Hände ein unsichtbares Ballett auf. Sie zähmen das Produkt, vereinen Land und Meer, um nur seine reinste Wahrheit freizulegen — die nackteste, wie die Finger meines Vaters auf meiner Wange.',
      'In questo rifugio urbano, le mani orchestrano un balletto invisibile. Addomesticano il prodotto, uniscono la Terra e il Mare, per rivelarne solo la verità più pura — la più nuda, come le dita di mio padre sulla mia guancia.'
    ],
    'home.story.sign': ['Le chef · Bona', 'The chef · Bona', 'El chef · Bona', 'Der Küchenchef · Bona', 'Lo chef · Bona'],

    /* ---------- Accueil : signatures, aperçu, galerie ---------- */
    'home.sig.eyebrow': ['Nos incontournables', 'Our essentials', 'Nuestros imprescindibles', 'Unsere Klassiker', 'I nostri immancabili'],
    'home.sig.title':   ['Les signatures', 'Signature dishes', 'Los platos estrella', 'Die Signature-Gerichte', 'I piatti firma'],
    'home.sig.sub': [
      'Une sélection de la maison, servie du vendredi au dimanche soir.',
      'A selection from the house, served Friday to Sunday evening.',
      'Una selección de la casa, servida de viernes a domingo por la noche.',
      'Eine Auswahl des Hauses, serviert von Freitag- bis Sonntagabend.',
      'Una selezione della casa, servita dal venerdì alla domenica sera.'
    ],
    'home.sig.cta': ['Voir toute la carte', 'See the full menu', 'Ver la carta completa', 'Ganze Karte ansehen', 'Vedi tutto il menù'],
    'home.prev.eyebrow': ['Un aperçu', 'A glimpse', 'Un adelanto', 'Ein Vorgeschmack', 'Un assaggio'],
    'home.prev.title':   ['La carte', 'The menu', 'La carta', 'Die Karte', 'Il menù'],
    'home.prev.sub': [
      'Tous nos plats sont servis avec une salade et un accompagnement au choix.',
      'Every main course comes with a salad and a side of your choice.',
      'Todos nuestros platos se sirven con ensalada y una guarnición a elegir.',
      'Alle Hauptgerichte werden mit Salat und einer Beilage nach Wahl serviert.',
      'Tutti i piatti sono serviti con insalata e un contorno a scelta.'
    ],
    'home.gal.eyebrow': ['En images', 'In pictures', 'En imágenes', 'In Bildern', 'In immagini'],
    'home.gal.title':   ['La galerie', 'Gallery', 'La galería', 'Galerie', 'La galleria'],

    /* ---------- Accueil : infos ---------- */
    'home.infos.eyebrow': ['Informations', 'Information', 'Información', 'Informationen', 'Informazioni'],
    'home.infos.title':   ['Nous trouver', 'Find us', 'Cómo llegar', 'Anfahrt', 'Dove siamo'],
    'hours.title': ['Horaires', 'Opening hours', 'Horarios', 'Öffnungszeiten', 'Orari'],
    'hours.note':  ['Ouverture estivale', 'Summer hours', 'Horario de verano', 'Sommeröffnungszeiten', 'Orario estivo'],
    'day.lun': ['Lundi', 'Monday', 'Lunes', 'Montag', 'Lunedì'],
    'day.mar': ['Mardi', 'Tuesday', 'Martes', 'Dienstag', 'Martedì'],
    'day.mer': ['Mercredi', 'Wednesday', 'Miércoles', 'Mittwoch', 'Mercoledì'],
    'day.jeu': ['Jeudi', 'Thursday', 'Jueves', 'Donnerstag', 'Giovedì'],
    'day.ven': ['Vendredi', 'Friday', 'Viernes', 'Freitag', 'Venerdì'],
    'day.sam': ['Samedi', 'Saturday', 'Sábado', 'Samstag', 'Sabato'],
    'day.dim': ['Dimanche', 'Sunday', 'Domingo', 'Sonntag', 'Domenica'],
    'hours.ferme': ['Fermé', 'Closed', 'Cerrado', 'Geschlossen', 'Chiuso'],
    'hours.foot': [
      'Les horaires peuvent évoluer selon la saison : retrouvez l’actualité de la maison sur notre Instagram.',
      'Hours may change with the season — follow us on Instagram for the latest.',
      'Los horarios pueden variar según la temporada: síguenos en Instagram para estar al día.',
      'Die Öffnungszeiten können je nach Saison variieren — Aktuelles finden Sie auf unserem Instagram.',
      'Gli orari possono variare secondo la stagione: seguici su Instagram per gli aggiornamenti.'
    ],
    'place.marker': ['Bona · 20 rue Sanche de Pomiers', 'Bona · 20 rue Sanche de Pomiers', 'Bona · 20 rue Sanche de Pomiers', 'Bona · 20 rue Sanche de Pomiers', 'Bona · 20 rue Sanche de Pomiers'],
    'place.credit': ['Fond de plan ©', 'Map data ©', 'Cartografía ©', 'Kartendaten ©', 'Dati mappa ©'],
    'btn.itineraire': ['Itinéraire', 'Directions', 'Cómo llegar', 'Route', 'Indicazioni'],
    'btn.ecrire':     ['Nous écrire', 'Message us', 'Escríbenos', 'Schreiben Sie uns', 'Scrivici'],
    'home.social.eyebrow': ['Suivez-nous', 'Follow us', 'Síguenos', 'Folgen Sie uns', 'Seguici'],
    'home.social.title':   ['Les réseaux', 'Social', 'Redes sociales', 'Social Media', 'I social'],
    'home.social.sub': [
      'Nouveautés, plats du moment et coulisses de la brasserie.',
      'New arrivals, dishes of the moment and behind the scenes.',
      'Novedades, platos del momento y entre bastidores.',
      'Neuigkeiten, Gerichte des Augenblicks und Blicke hinter die Kulissen.',
      'Novità, piatti del momento e dietro le quinte.'
    ],
    'social.avis':     ['Avis', 'Reviews', 'Opiniones', 'Bewertungen', 'Recensioni'],
    'social.avis.sub': ['Laissez-nous un avis', 'Leave us a review', 'Déjanos tu opinión', 'Bewerten Sie uns', 'Lasciaci una recensione'],

    'carte.eyebrow': ['Bona · Brasserie', 'Bona · Brasserie', 'Bona · Brasserie', 'Bona · Brasserie', 'Bona · Brasserie'],
    'resa.jours': ['Vendredi, samedi et dimanche', 'Friday, Saturday and Sunday', 'Viernes, sábado y domingo', 'Freitag, Samstag und Sonntag', 'Venerdì, sabato e domenica'],
    'home.sig.n3': ['Entrecôte grillée', 'Grilled rib steak', 'Entrecot a la parrilla', 'Gegrilltes Entrecôte', 'Entrecôte alla griglia'],
    'home.sig.d1': [
      'Pain toasteur, cœur de burrata fumé, bœuf effiloché',
      'Toasted bread, smoked burrata heart, pulled beef',
      'Pan tostado, corazón de burrata ahumada, ternera deshilachada',
      'Getoastetes Brot, geräuchertes Burrata-Herz, geschmortes Rindfleisch',
      'Pane tostato, cuore di burrata affumicata, manzo sfilacciato'
    ],
    'home.sig.d2': [
      'Légume, bœuf effiloché, saumon fumé',
      'Vegetables, pulled beef, smoked salmon',
      'Verduras, ternera deshilachada, salmón ahumado',
      'Gemüse, geschmortes Rindfleisch, Räucherlachs',
      'Verdure, manzo sfilacciato, salmone affumicato'
    ],
    'home.sig.d3': [
      'Grillée à la braise, thym et ail',
      'Grilled over embers, thyme and garlic',
      'A la brasa, tomillo y ajo',
      'Über Glut gegrillt, Thymian und Knoblauch',
      'Grigliata alla brace, timo e aglio'
    ],
    'home.sig.d4': [
      '3 pièces marinées, secret du chef',
      'Three chops, marinated to the chef’s recipe',
      '3 piezas marinadas, secreto del chef',
      'Drei Stück, mariniert nach Chefgeheimnis',
      '3 pezzi marinati, segreto dello chef'
    ],

    /* ---------- Carte : structure ---------- */
    'carte.h1':  ['La carte', 'Menu', 'La carta', 'Speisekarte', 'Il menù'],
    'carte.sub': [
      'Une cuisine exclusivement faite maison, halal, à partir de produits frais rigoureusement sélectionnés.',
      'Everything made in-house and halal, from carefully selected fresh produce.',
      'Una cocina exclusivamente casera y halal, con productos frescos rigurosamente seleccionados.',
      'Eine Küche, die alles selbst zubereitet, halal, aus sorgfältig ausgewählten frischen Produkten.',
      'Una cucina interamente fatta in casa e halal, con prodotti freschi rigorosamente selezionati.'
    ],
    'carte.nav.entrees':   ['Entrées', 'Starters', 'Entrantes', 'Vorspeisen', 'Antipasti'],
    'carte.nav.plats':     ['Plats', 'Mains', 'Principales', 'Hauptgerichte', 'Secondi'],
    'carte.nav.accomp':    ['Accompagnements', 'Sides', 'Guarniciones', 'Beilagen', 'Contorni'],
    'carte.nav.sauces':    ['Sauces', 'Sauces', 'Salsas', 'Saucen', 'Salse'],
    'carte.nav.desserts':  ['Desserts', 'Desserts', 'Postres', 'Desserts', 'Dolci'],
    'carte.nav.boissons':  ['Boissons', 'Drinks', 'Bebidas', 'Getränke', 'Bevande'],
    'carte.nav.allerg':    ['Allergènes', 'Allergens', 'Alérgenos', 'Allergene', 'Allergeni'],

    'carte.entrees.title': ['Entrées', 'Starters', 'Entrantes', 'Vorspeisen', 'Antipasti'],
    'carte.entrees.note':  ['À partager ou pour soi', 'To share, or not', 'Para compartir o no', 'Zum Teilen oder für sich', 'Da condividere o no'],
    'carte.plats.title':   ['Plats', 'Main courses', 'Platos principales', 'Hauptgerichte', 'Secondi'],
    'carte.plats.note':    ['Le cœur de la maison', 'The heart of the house', 'El corazón de la casa', 'Das Herz des Hauses', 'Il cuore della casa'],
    'carte.accomp.title':  ['Accompagnements', 'Sides', 'Guarniciones', 'Beilagen', 'Contorni'],
    'carte.accomp.note':   ['Un accompagnement inclus par plat', 'One side included per main', 'Una guarnición incluida por plato', 'Eine Beilage pro Hauptgericht inbegriffen', 'Un contorno incluso per piatto'],
    'carte.sauces.title':  ['Sauces de viande', 'Meat sauces', 'Salsas para carne', 'Saucen zum Fleisch', 'Salse per la carne'],
    'carte.sauces.note':   ['À volonté', 'Unlimited', 'A discreción', 'Unbegrenzt', 'A volontà'],
    'carte.desserts.title':['Desserts', 'Desserts', 'Postres', 'Desserts', 'Dolci'],
    'carte.desserts.note': ['Selon l’arrivage', 'Depending on the day', 'Según disponibilidad', 'Je nach Angebot', 'Secondo disponibilità'],
    'carte.boissons.title':['Boissons', 'Drinks', 'Bebidas', 'Getränke', 'Bevande'],
    'carte.boissons.note': ['Sans alcool · Maison', 'Alcohol-free · Homemade', 'Sin alcohol · Caseras', 'Alkoholfrei · Hausgemacht', 'Analcoliche · Della casa'],
    'carte.allerg.title':  ['Allergènes', 'Allergens', 'Alérgenos', 'Allergene', 'Allergeni'],

    'carte.formule.title': ['Salade et accompagnement inclus', 'Salad and side included', 'Ensalada y guarnición incluidas', 'Salat und Beilage inbegriffen', 'Insalata e contorno inclusi'],
    'carte.formule.text': [
      'Chaque plat est accompagné d’une <strong>salade</strong> et d’un <strong>accompagnement au choix</strong>. Accompagnement supplémentaire : <strong>+ 3 €</strong>.',
      'Every main comes with a <strong>salad</strong> and <strong>one side of your choice</strong>. Extra side: <strong>+ €3</strong>.',
      'Cada plato se sirve con una <strong>ensalada</strong> y una <strong>guarnición a elegir</strong>. Guarnición adicional: <strong>+ 3 €</strong>.',
      'Zu jedem Hauptgericht gehören ein <strong>Salat</strong> und eine <strong>Beilage nach Wahl</strong>. Zusätzliche Beilage: <strong>+ 3 €</strong>.',
      'Ogni piatto è servito con <strong>insalata</strong> e un <strong>contorno a scelta</strong>. Contorno supplementare: <strong>+ 3 €</strong>.'
    ],
    'carte.accomp.extra': [
      'Accompagnement supplémentaire : + 3 €',
      'Extra side: + €3',
      'Guarnición adicional: + 3 €',
      'Zusätzliche Beilage: + 3 €',
      'Contorno supplementare: + 3 €'
    ],
    'carte.cta': ['Horaires & accès', 'Hours & directions', 'Horarios y acceso', 'Öffnungszeiten & Anfahrt', 'Orari e come arrivare'],

    /* ---------- Prix et étiquettes ---------- */
    'prix.inclus':    ['Inclus', 'Included', 'Incluido', 'Inbegriffen', 'Incluso'],
    'prix.consulter': ['Nous consulter', 'Ask us', 'Consúltanos', 'Auf Anfrage', 'Chiedete a noi'],
    'tag.gluten':     ['Gluten', 'Gluten', 'Gluten', 'Gluten', 'Glutine'],
    'tag.lait':       ['Lait', 'Dairy', 'Lácteos', 'Milch', 'Latte'],
    'tag.oeufs':      ['Œufs', 'Eggs', 'Huevo', 'Eier', 'Uova'],
    'tag.poisson':    ['Poisson', 'Fish', 'Pescado', 'Fisch', 'Pesce'],
    'tag.noix':       ['Fruits à coque', 'Nuts', 'Frutos secos', 'Schalenfrüchte', 'Frutta a guscio'],
    'tag.aucun':      ['Sans allergène', 'No allergens', 'Sin alérgenos', 'Ohne Allergene', 'Senza allergeni'],
    'tag.vegetarien': ['Végétarien', 'Vegetarian', 'Vegetariano', 'Vegetarisch', 'Vegetariano'],

    /* ---------- Carte : entrées ---------- */
    'd.tartines.n': ['Tartines', 'Open sandwiches', 'Tostas', 'Tartines', 'Tartine'],
    'd.tartines.d': [
      'Pain toasteur (Boulangerie Cérès), cœur de burrata fumé, sauce persillée, parmesan, bœuf effiloché cuit 7 h.',
      'Toasted bread (Boulangerie Cérès), smoked burrata heart, parsley sauce, parmesan, beef pulled after 7 hours of cooking.',
      'Pan tostado (Boulangerie Cérès), corazón de burrata ahumada, salsa de perejil, parmesano y ternera deshilachada cocinada 7 h.',
      'Getoastetes Brot (Boulangerie Cérès), geräuchertes Burrata-Herz, Petersiliensauce, Parmesan, 7 Stunden geschmortes Rindfleisch.',
      'Pane tostato (Boulangerie Cérès), cuore di burrata affumicata, salsa al prezzemolo, parmigiano, manzo sfilacciato cotto 7 ore.'
    ],
    'd.bouchees.n': ['Bouchées Bona × 3', 'Bona bites × 3', 'Bocados Bona × 3', 'Bona-Häppchen × 3', 'Bocconcini Bona × 3'],
    'd.bouchees.d': [
      'Cœur de burrata sur tartines : une au légume, une au bœuf effiloché, une au saumon fumé.',
      'Burrata heart on toast: one with vegetables, one with pulled beef, one with smoked salmon.',
      'Corazón de burrata sobre tostas: una de verduras, una de ternera deshilachada y una de salmón ahumado.',
      'Burrata-Herz auf Brot: eines mit Gemüse, eines mit geschmortem Rindfleisch, eines mit Räucherlachs.',
      'Cuore di burrata su crostini: uno alle verdure, uno al manzo sfilacciato, uno al salmone affumicato.'
    ],
    'd.saladeburrata.n': ['Salade de burrata', 'Burrata salad', 'Ensalada de burrata', 'Burrata-Salat', 'Insalata di burrata'],
    'd.saladeburrata.d': [
      'Burrata 100 g, salade, tomates cerises, croûton, parmesan, sauce persillée et vinaigrette maison.',
      'Burrata 100 g, salad leaves, cherry tomatoes, crouton, parmesan, parsley sauce and house vinaigrette.',
      'Burrata 100 g, ensalada, tomates cherry, picatoste, parmesano, salsa de perejil y vinagreta de la casa.',
      'Burrata 100 g, Blattsalat, Kirschtomaten, Crouton, Parmesan, Petersiliensauce und Hausdressing.',
      'Burrata 100 g, insalata, pomodorini, crostino, parmigiano, salsa al prezzemolo e vinaigrette della casa.'
    ],
    'd.brochettes.n': ['Brochettes de viande', 'Meat skewers', 'Brochetas de carne', 'Fleischspieße', 'Spiedini di carne'],
    'd.brochettes.d': ['3 × poulet mariné.', '3 × marinated chicken.', '3 × pollo marinado.', '3 × mariniertes Hähnchen.', '3 × pollo marinato.'],

    /* ---------- Carte : plats ---------- */
    'd.ailes.n': ['Ailes de poulet', 'Chicken wings', 'Alitas de pollo', 'Hähnchenflügel', 'Alette di pollo'],
    'd.ailes.d': ['4 pièces marinées persillées.', 'Four wings, marinated with parsley.', '4 piezas marinadas al perejil.', 'Vier Stück, mariniert mit Petersilie.', '4 pezzi marinati al prezzemolo.'],
    'd.burratplat.n': ['Salade de burrata', 'Burrata salad', 'Ensalada de burrata', 'Burrata-Salat', 'Insalata di burrata'],
    'd.burratplat.d': [
      'Burrata 250 g, accompagnée de légumes ou de saumon fumé. Végétarien avec les légumes.',
      'Burrata 250 g, served with vegetables or smoked salmon. Vegetarian with the vegetables.',
      'Burrata 250 g, con verduras o salmón ahumado. Vegetariano en la versión con verduras.',
      'Burrata 250 g, mit Gemüse oder Räucherlachs. Vegetarisch in der Gemüse-Variante.',
      'Burrata 250 g, con verdure o salmone affumicato. Vegetariano nella versione con verdure.'
    ],
    'd.saumon.n': ['Pavé de saumon', 'Salmon fillet', 'Lomo de salmón', 'Lachsfilet', 'Trancio di salmone'],
    'd.saumon.d': [
      '200 g snacké à la plancha, accompagné de sauce chien, arrosé de jus de citron, ail et thym frais, fleur de sel.',
      '200 g seared on the plancha, with sauce chien, lemon juice, garlic and fresh thyme, fleur de sel.',
      '200 g a la plancha, con salsa chien, zumo de limón, ajo y tomillo fresco, flor de sal.',
      '200 g von der Plancha, mit Sauce chien, Zitronensaft, Knoblauch und frischem Thymian, Fleur de Sel.',
      '200 g scottato alla piastra, con salsa chien, succo di limone, aglio e timo fresco, fiore di sale.'
    ],
    'd.fauxfilet.n': ['Faux-filet 300 g', 'Sirloin steak 300 g', 'Entrecot fino 300 g', 'Roastbeef 300 g', 'Controfiletto 300 g'],
    'd.fauxfilet.d': [
      'Parfumé au thym et à l’ail, sublimé de fleur de sel et poivre noir.',
      'Scented with thyme and garlic, finished with fleur de sel and black pepper.',
      'Aromatizado con tomillo y ajo, realzado con flor de sal y pimienta negra.',
      'Mit Thymian und Knoblauch aromatisiert, veredelt mit Fleur de Sel und schwarzem Pfeffer.',
      'Profumato al timo e all’aglio, esaltato da fiore di sale e pepe nero.'
    ],
    'd.entrecote.n': ['Entrecôte grillée 400 g', 'Grilled rib steak 400 g', 'Entrecot a la parrilla 400 g', 'Gegrilltes Entrecôte 400 g', 'Entrecôte alla griglia 400 g'],
    'd.entrecote.d': [
      'Grillée à la braise, thym et ail, fleur de sel et poivre noir moulu.',
      'Grilled over embers with thyme and garlic, fleur de sel and cracked black pepper.',
      'A la brasa con tomillo y ajo, flor de sal y pimienta negra molida.',
      'Über Glut gegrillt mit Thymian und Knoblauch, Fleur de Sel und gemahlenem schwarzem Pfeffer.',
      'Grigliata alla brace con timo e aglio, fiore di sale e pepe nero macinato.'
    ],
    'd.magret.n': ['Magret entier', 'Whole duck breast', 'Magret entero', 'Ganze Entenbrust', 'Petto d’anatra intero'],
    'd.magret.d': [
      '400 g – 500 g cuit à la plancha, laqué au miel & thym frais, fleur de sel et poivre noir moulu.',
      '400 g – 500 g cooked on the plancha, glazed with honey and fresh thyme, fleur de sel and cracked black pepper.',
      '400 g – 500 g a la plancha, lacado con miel y tomillo fresco, flor de sal y pimienta negra molida.',
      '400 g – 500 g von der Plancha, mit Honig und frischem Thymian glasiert, Fleur de Sel und schwarzer Pfeffer.',
      '400 g – 500 g cotto alla piastra, laccato al miele e timo fresco, fiore di sale e pepe nero macinato.'
    ],
    'd.cotelettes.n': ['Côtelettes d’agneau', 'Lamb chops', 'Chuletas de cordero', 'Lammkoteletts', 'Costolette d’agnello'],
    'd.cotelettes.d': ['3 pièces marinées, secret du chef.', 'Three chops, marinated to the chef’s own recipe.', '3 piezas marinadas, secreto del chef.', 'Drei Stück, mariniert nach dem Geheimnis des Küchenchefs.', '3 pezzi marinati, segreto dello chef.'],
    'd.cotebœuf.n': ['Côte de bœuf à partager 1 kg', 'Côte de bœuf to share 1 kg', 'Chuletón para compartir 1 kg', 'Rinderkotelett zum Teilen 1 kg', 'Costata da condividere 1 kg'],
    'd.cotebœuf.d': [
      'Pour deux, grillée à la braise, thym et ail, fleur de sel et poivre noir.',
      'For two, grilled over embers with thyme and garlic, fleur de sel and black pepper.',
      'Para dos, a la brasa con tomillo y ajo, flor de sal y pimienta negra.',
      'Für zwei, über Glut gegrillt mit Thymian und Knoblauch, Fleur de Sel und schwarzem Pfeffer.',
      'Per due, grigliata alla brace con timo e aglio, fiore di sale e pepe nero.'
    ],

    /* ---------- Carte : accompagnements ---------- */
    'd.riz.n': ['Riz sauce forestière', 'Rice with forest mushroom sauce', 'Arroz con salsa de setas', 'Reis mit Waldpilzsauce', 'Riso alla salsa di funghi'],
    'd.riz.d': [
      'Riz parfumé à la crème de thym et poêlée de champignons bruns à l’ail.',
      'Rice scented with thyme cream and pan-fried brown mushrooms with garlic.',
      'Arroz aromatizado con crema de tomillo y salteado de champiñones al ajo.',
      'Reis mit Thymianrahm und in Knoblauch geschwenkten braunen Champignons.',
      'Riso profumato alla crema di timo e funghi champignon saltati all’aglio.'
    ],
    'd.haricots.n': ['Haricots rouges', 'Red beans', 'Alubias rojas', 'Rote Bohnen', 'Fagioli rossi'],
    'd.haricots.d': [
      'Cassonade de haricots rouges confits à la tomate et aux oignons.',
      'Red beans slow-cooked with tomato and onion.',
      'Alubias rojas confitadas con tomate y cebolla.',
      'Rote Bohnen, langsam mit Tomate und Zwiebeln geschmort.',
      'Fagioli rossi confit al pomodoro e cipolla.'
    ],
    'd.legumes.n': ['Poêlée de légumes', 'Pan-fried vegetables', 'Salteado de verduras', 'Gemüsepfanne', 'Verdure saltate'],
    'd.legumes.d': [
      'Déclinaison de légumes croquants : poivrons, oignons rouges, brocolis, choux et poireaux.',
      'Crisp vegetables: peppers, red onion, broccoli, cabbage and leek.',
      'Verduras crujientes: pimientos, cebolla roja, brócoli, col y puerro.',
      'Knackiges Gemüse: Paprika, rote Zwiebeln, Brokkoli, Kohl und Lauch.',
      'Verdure croccanti: peperoni, cipolla rossa, broccoli, cavolo e porro.'
    ],
    'd.grenailles.n': ['Pommes de terre grenailles', 'Baby potatoes', 'Patatas pequeñas', 'Drillingskartoffeln', 'Patate novelle'],
    'd.grenailles.d': [
      'Rôties au four, relevées d’une persillade maison à la fleur de sel.',
      'Oven-roasted, lifted with a house parsley-and-garlic dressing and fleur de sel.',
      'Asadas al horno, realzadas con persillade casera y flor de sal.',
      'Im Ofen geröstet, verfeinert mit hausgemachter Petersilien-Knoblauch-Mischung und Fleur de Sel.',
      'Arrostite al forno, insaporite con persillade della casa e fiore di sale.'
    ],
    'd.pates.n': ['Pâtes fraîches', 'Fresh pasta', 'Pasta fresca', 'Frische Pasta', 'Pasta fresca'],
    'd.pates.d': [
      'Pâtes fraîches de tradition, sublimées par notre sauce du moment selon l’arrivage du jour.',
      'Traditional fresh pasta, with our sauce of the moment depending on the day’s delivery.',
      'Pasta fresca tradicional, con nuestra salsa del momento según el producto del día.',
      'Traditionelle frische Pasta mit unserer Sauce des Augenblicks, je nach Tagesangebot.',
      'Pasta fresca tradizionale, con la nostra salsa del momento secondo l’arrivo del giorno.'
    ],

    /* ---------- Carte : sauces ---------- */
    'd.sverte.n':  ['Sauce verte', 'Green sauce', 'Salsa verde', 'Grüne Sauce', 'Salsa verde'],
    'd.spoivre.n': ['Sauce poivre', 'Pepper sauce', 'Salsa de pimienta', 'Pfeffersauce', 'Salsa al pepe'],
    'd.schien.n':  ['Sauce chien', 'Sauce chien', 'Salsa chien', 'Sauce chien', 'Salsa chien'],

    /* ---------- Carte : desserts ---------- */
    'd.tartelette.n': ['Tartelette', 'Tartlet', 'Tartaleta', 'Törtchen', 'Crostatina'],
    'd.tartelette.d': ['Selon arrivage.', 'Depending on the day.', 'Según disponibilidad.', 'Je nach Angebot.', 'Secondo disponibilità.'],
    'd.dessertmoment.n': ['Dessert du moment', 'Dessert of the moment', 'Postre del momento', 'Dessert des Augenblicks', 'Dolce del momento'],
    'd.dessertmoment.d': [
      'Demandez au serveur : la création change au fil des arrivages.',
      'Ask your waiter — the creation changes with what arrives.',
      'Pregunte al camarero: la creación cambia según el producto.',
      'Fragen Sie das Personal — die Kreation wechselt je nach Angebot.',
      'Chiedete al cameriere: la creazione cambia secondo gli arrivi.'
    ],

    /* ---------- Carte : boissons ---------- */
    'd.gingembre.n': ['Gingembre', 'Ginger', 'Jengibre', 'Ingwer', 'Zenzero'],
    'd.gingembre.d': [
      'Boisson intense et tonifiante au pur jus de gingembre frais, relevée d’une note de citron vert.',
      'Intense and invigorating, pure fresh ginger juice lifted with a note of lime.',
      'Bebida intensa y tonificante de zumo puro de jengibre fresco, con un toque de lima.',
      'Intensiv und belebend, purer frischer Ingwersaft mit einer Note Limette.',
      'Bevanda intensa e tonificante al puro succo di zenzero fresco, con una nota di lime.'
    ],
    'd.bonba.n': ['Bonba', 'Bonba', 'Bonba', 'Bonba', 'Bonba'],
    'd.bonba.d': [
      'Sans alcool : mélange original de pêche, de fruits rouges et d’une pointe de citron.',
      'Alcohol-free: an original blend of peach, red berries and a touch of lemon.',
      'Sin alcohol: mezcla original de melocotón, frutos rojos y un toque de limón.',
      'Alkoholfrei: eine originelle Mischung aus Pfirsich, roten Beeren und einem Hauch Zitrone.',
      'Analcolica: miscela originale di pesca, frutti rossi e un tocco di limone.'
    ],
    'd.bibite.n': ['Bibite Bona', 'Bibite Bona', 'Bibite Bona', 'Bibite Bona', 'Bibite Bona'],
    'd.bibite.d': [
      'Mandarinata : mandarine verte et lime · Arancia rossa : jus d’orange sanguine · Lemon bitter : jus de citron.',
      'Mandarinata: green mandarin and lime · Arancia rossa: blood orange juice · Lemon bitter: lemon juice.',
      'Mandarinata: mandarina verde y lima · Arancia rossa: zumo de naranja sanguina · Lemon bitter: zumo de limón.',
      'Mandarinata: grüne Mandarine und Limette · Arancia rossa: Blutorangensaft · Lemon bitter: Zitronensaft.',
      'Mandarinata: mandarino verde e lime · Arancia rossa: succo di arancia rossa · Lemon bitter: succo di limone.'
    ],
    'd.pinacolada.n': ['Virgin piña colada', 'Virgin piña colada', 'Piña colada sin alcohol', 'Virgin Piña Colada', 'Virgin piña colada'],
    'd.pinacolada.d': [
      'Un classique exotique et crémeux mariant la douceur de la noix de coco et la fraîcheur de l’ananas.',
      'A creamy tropical classic pairing the sweetness of coconut with the freshness of pineapple.',
      'Un clásico exótico y cremoso que une la dulzura del coco y el frescor de la piña.',
      'Ein cremiger tropischer Klassiker: die Süße der Kokosnuss trifft die Frische der Ananas.',
      'Un classico esotico e cremoso che unisce la dolcezza del cocco alla freschezza dell’ananas.'
    ],
    'd.fraiseananas.n': ['Virgin cocktail fraise ananas', 'Strawberry & pineapple virgin cocktail', 'Cóctel sin alcohol fresa y piña', 'Virgin Cocktail Erdbeere & Ananas', 'Virgin cocktail fragola e ananas'],
    'd.fraiseananas.d': [
      'Fraise et ananas, sans alcool, frais et acidulé.',
      'Strawberry and pineapple, alcohol-free, fresh and tangy.',
      'Fresa y piña, sin alcohol, fresco y ácido.',
      'Erdbeere und Ananas, alkoholfrei, frisch und säuerlich.',
      'Fragola e ananas, analcolico, fresco e acidulo.'
    ],
    'd.tropical.n': ['Virgin cocktail tropical', 'Tropical virgin cocktail', 'Cóctel tropical sin alcohol', 'Virgin Cocktail Tropical', 'Virgin cocktail tropicale'],
    'd.tropical.d': [
      'Mangue, fruit de la passion et citron, sans alcool.',
      'Mango, passion fruit and lemon, alcohol-free.',
      'Mango, maracuyá y limón, sin alcohol.',
      'Mango, Passionsfrucht und Zitrone, alkoholfrei.',
      'Mango, frutto della passione e limone, analcolico.'
    ],
    'd.softs.n': ['Softs', 'Soft drinks', 'Refrescos', 'Softdrinks', 'Bibite'],
    'd.softs.d': ['Coca, Fanta.', 'Coke, Fanta.', 'Coca-Cola, Fanta.', 'Cola, Fanta.', 'Coca-Cola, Fanta.'],

    /* ---------- Carte : allergènes ---------- */
    'allerg.caption': [
      'Liste des allergènes présents dans nos préparations.',
      'Allergens present in our preparations.',
      'Alérgenos presentes en nuestras elaboraciones.',
      'Allergene in unseren Zubereitungen.',
      'Allergeni presenti nelle nostre preparazioni.'
    ],
    'allerg.plat':   ['Plat', 'Dish', 'Plato', 'Gericht', 'Piatto'],
    'allerg.liste':  ['Allergènes', 'Allergens', 'Alérgenos', 'Allergene', 'Allergeni'],
    'allerg.aucun':  ['Aucun', 'None', 'Ninguno', 'Keine', 'Nessuno'],
    'allerg.selon':  ['Selon arrivage', 'Depending on the day', 'Según disponibilidad', 'Je nach Angebot', 'Secondo disponibilità'],
    'allerg.burrataE': ['Salade de burrata (entrée)', 'Burrata salad (starter)', 'Ensalada de burrata (entrante)', 'Burrata-Salat (Vorspeise)', 'Insalata di burrata (antipasto)'],
    'allerg.burrataP': ['Salade de burrata (plat)', 'Burrata salad (main)', 'Ensalada de burrata (principal)', 'Burrata-Salat (Hauptgericht)', 'Insalata di burrata (secondo)'],
    'allerg.tiramisu': ['Tiramisu cuillère', 'Spoon tiramisu', 'Tiramisú en cuchara', 'Tiramisu im Löffel', 'Tiramisù al cucchiaio'],
    'allerg.notice': [
      'Nos créations étant confectionnées à partir de produits frais et bruts, notre cuisine manipule quotidiennement du gluten et des produits laitiers. Pour toute allergie sévère, merci d’en informer notre équipe avant votre commande.',
      'As our dishes are handmade from fresh, raw ingredients, our kitchen handles gluten and dairy every day. If you have a severe allergy, please tell our team before ordering.',
      'Como nuestros platos se elaboran con productos frescos y crudos, nuestra cocina manipula gluten y lácteos a diario. En caso de alergia grave, informe a nuestro equipo antes de pedir.',
      'Da unsere Gerichte aus frischen, rohen Zutaten von Hand zubereitet werden, verarbeitet unsere Küche täglich Gluten und Milchprodukte. Bei schweren Allergien informieren Sie bitte unser Team vor der Bestellung.',
      'Poiché i nostri piatti sono preparati a mano con prodotti freschi e crudi, la nostra cucina lavora ogni giorno glutine e latticini. In caso di allergie gravi, informate il nostro personale prima di ordinare.'
    ],

    /* ---------- Réservation ---------- */
    'resa.h1':  ['Réserver', 'Book a table', 'Reservar', 'Reservieren', 'Prenota'],
    'resa.sub': [
      'Un seul groupe par quart d’heure, de 19h00 à 01h30. Service du vendredi au dimanche.',
      'One group per quarter hour, from 7:00 pm to 1:30 am. Open Friday to Sunday.',
      'Un solo grupo cada cuarto de hora, de 19:00 a 01:30. Servicio de viernes a domingo.',
      'Nur eine Gruppe pro Viertelstunde, von 19:00 bis 01:30 Uhr. Freitag bis Sonntag geöffnet.',
      'Un solo gruppo ogni quarto d’ora, dalle 19:00 all’01:30. Servizio dal venerdì alla domenica.'
    ],
    'resa.demande':      ['Votre demande', 'Your request', 'Su solicitud', 'Ihre Anfrage', 'La tua richiesta'],
    'resa.reserver':     ['Réserver une table', 'Book a table', 'Reservar mesa', 'Tisch reservieren', 'Prenota un tavolo'],
    'resa.privatisation':['Privatisation', 'Private hire', 'Privatización', 'Exklusivmiete', 'Privatizzazione'],
    'resa.aide.priv': [
      'La privatisation concerne l’ensemble de la salle, sur devis. Indiquez la date souhaitée, nous vous rappelons pour en définir les détails.',
      'Private hire covers the whole room, quoted individually. Give us the date you have in mind and we will call you back to work out the details.',
      'La privatización cubre toda la sala, con presupuesto a medida. Indíquenos la fecha deseada y le llamamos para concretar los detalles.',
      'Die Exklusivmiete umfasst den gesamten Saal, Preis auf Anfrage. Nennen Sie uns das gewünschte Datum, wir rufen Sie für die Details zurück.',
      'La privatizzazione riguarda l’intera sala, su preventivo. Indicate la data desiderata, vi richiamiamo per definire i dettagli.'
    ],
    'resa.soir':      ['Quel soir ?', 'Which evening?', '¿Qué noche?', 'Welcher Abend?', 'Quale sera?'],
    'resa.soir.aide': [
      'Nous ouvrons le vendredi, le samedi et le dimanche.',
      'We are open on Friday, Saturday and Sunday.',
      'Abrimos viernes, sábado y domingo.',
      'Wir haben freitags, samstags und sonntags geöffnet.',
      'Siamo aperti venerdì, sabato e domenica.'
    ],
    'resa.datesouhaitee': ['Date souhaitée', 'Preferred date', 'Fecha deseada', 'Wunschdatum', 'Data desiderata'],
    'resa.heure':      ['À quelle heure ?', 'What time?', '¿A qué hora?', 'Um welche Uhrzeit?', 'A che ora?'],
    'resa.heure.aide': [
      'Les créneaux déjà pris n’apparaissent pas comme sélectionnables.',
      'Slots already taken are shown as unavailable.',
      'Las franjas ya reservadas aparecen como no disponibles.',
      'Bereits vergebene Zeiten sind nicht auswählbar.',
      'Le fasce già prenotate non sono selezionabili.'
    ],
    'resa.personnes':      ['Nombre de personnes', 'Number of guests', 'Número de personas', 'Anzahl der Gäste', 'Numero di persone'],
    'resa.personnes.priv': ['Nombre de personnes attendues', 'Expected number of guests', 'Número de personas previstas', 'Erwartete Gästezahl', 'Numero di persone previste'],
    'resa.personne':  ['personne', 'guest', 'persona', 'Gast', 'persona'],
    'resa.personnes.pl': ['personnes', 'guests', 'personas', 'Gäste', 'persone'],
    'resa.plus6':     ['Nous sommes plus de 6', 'We are more than 6', 'Somos más de 6', 'Wir sind mehr als 6', 'Siamo più di 6'],
    'resa.combien':   ['Combien serez-vous ?', 'How many of you?', '¿Cuántos serán?', 'Wie viele werden Sie sein?', 'In quanti sarete?'],
    'resa.combien.aide': [
      'Nous vous rappelons pour organiser l’accueil du groupe.',
      'We will call you back to organise the group’s welcome.',
      'Le llamamos para organizar la acogida del grupo.',
      'Wir rufen Sie zurück, um den Empfang der Gruppe zu organisieren.',
      'Vi richiamiamo per organizzare l’accoglienza del gruppo.'
    ],
    'resa.nom':      ['Nom', 'Name', 'Nombre', 'Name', 'Nome'],
    'resa.tel':      ['Téléphone', 'Phone', 'Teléfono', 'Telefon', 'Telefono'],
    'resa.email':    ['E-mail', 'Email', 'Correo electrónico', 'E-Mail', 'E-mail'],
    'resa.facultatif': ['facultatif', 'optional', 'opcional', 'optional', 'facoltativo'],
    'resa.message':  ['Un mot pour nous', 'A word for us', 'Un mensaje para nosotros', 'Eine Nachricht für uns', 'Un messaggio per noi'],
    'resa.message.ph': [
      'Allergie, anniversaire, poussette, une envie particulière…',
      'Allergy, birthday, pushchair, a special request…',
      'Alergia, cumpleaños, carrito, una petición especial…',
      'Allergie, Geburtstag, Kinderwagen, ein besonderer Wunsch…',
      'Allergia, compleanno, passeggino, un desiderio particolare…'
    ],
    'resa.envoyer':  ['Envoyer la demande', 'Send request', 'Enviar solicitud', 'Anfrage senden', 'Invia la richiesta'],
    'resa.mentions': [
      'Votre table est confirmée dès l’envoi. En cas d’annulation, appelez-nous au 07 59 31 07 35. Vos coordonnées servent uniquement à traiter cette réservation.',
      'Your table is confirmed as soon as you send the form. To cancel, call us on +33 7 59 31 07 35. Your details are used only to process this booking.',
      'Su mesa queda confirmada al enviar el formulario. Para anular, llámenos al +33 7 59 31 07 35. Sus datos solo se usan para gestionar esta reserva.',
      'Ihr Tisch ist mit dem Absenden bestätigt. Zum Stornieren rufen Sie uns unter +33 7 59 31 07 35 an. Ihre Daten dienen nur der Bearbeitung dieser Reservierung.',
      'Il vostro tavolo è confermato all’invio. Per annullare, chiamateci al +33 7 59 31 07 35. I vostri dati servono solo a gestire questa prenotazione.'
    ],
    'resa.question': ['Une question ?', 'A question?', '¿Alguna duda?', 'Eine Frage?', 'Una domanda?'],
    'resa.instagram':['Écrivez-nous sur Instagram', 'Message us on Instagram', 'Escríbenos por Instagram', 'Schreiben Sie uns auf Instagram', 'Scrivici su Instagram'],
    'resa.retour':   ['Retour à l’accueil', 'Back to home', 'Volver al inicio', 'Zur Startseite', 'Torna alla home'],
    'resa.merci':    ['Merci', 'Thank you', 'Gracias', 'Danke', 'Grazie'],

    'resa.chargement': ['Recherche des créneaux disponibles…', 'Looking for available slots…', 'Buscando franjas disponibles…', 'Verfügbare Zeiten werden gesucht…', 'Ricerca delle fasce disponibili…'],
    'resa.envoi':      ['Envoi en cours…', 'Sending…', 'Enviando…', 'Wird gesendet…', 'Invio in corso…'],
    'resa.ok.resa': [
      'Votre table est réservée.',
      'Your table is booked.',
      'Su mesa está reservada.',
      'Ihr Tisch ist reserviert.',
      'Il vostro tavolo è prenotato.'
    ],
    'resa.modal.titre': [
      'Confirmation validée',
      'Booking confirmed',
      'Confirmación validada',
      'Bestätigt',
      'Prenotazione confermata'
    ],
    'resa.modal.titrePriv': [
      'Demande envoyée',
      'Request sent',
      'Solicitud enviada',
      'Anfrage gesendet',
      'Richiesta inviata'
    ],
    'resa.modal.annulation': [
      'En cas d’annulation, appelez-nous au',
      'To cancel, please call us on',
      'Para anular, llámenos al',
      'Zum Stornieren rufen Sie uns an',
      'Per annullare, chiamateci al'
    ],
    'resa.modal.fermer': ['Fermer', 'Close', 'Cerrar', 'Schließen', 'Chiudi'],
    'resa.recap.personnes': ['pour', 'for', 'para', 'für', 'per'],
    'resa.ok.priv': [
      'Demande de privatisation envoyée. Nous vous rappelons pour en discuter.',
      'Private hire request sent. We will call you back to discuss it.',
      'Solicitud de privatización enviada. Le llamamos para hablarlo.',
      'Anfrage zur Exklusivmiete gesendet. Wir rufen Sie zurück.',
      'Richiesta di privatizzazione inviata. Vi richiamiamo per parlarne.'
    ],
    'err.date':     ['Choisissez une date.', 'Please choose a date.', 'Elija una fecha.', 'Bitte wählen Sie ein Datum.', 'Scegliete una data.'],
    'err.creneau':  ['Choisissez un créneau.', 'Please choose a time.', 'Elija una franja horaria.', 'Bitte wählen Sie eine Uhrzeit.', 'Scegliete un orario.'],
    'err.personnes':['Indiquez le nombre de personnes.', 'Please give the number of guests.', 'Indique el número de personas.', 'Bitte geben Sie die Gästezahl an.', 'Indicate il numero di persone.'],
    'err.plus6':    ['Au-delà de 6 personnes, cochez « Nous sommes plus de 6 ».', 'For more than 6 guests, tick “We are more than 6”.', 'Para más de 6 personas, marque «Somos más de 6».', 'Ab 7 Gästen bitte „Wir sind mehr als 6“ ankreuzen.', 'Oltre 6 persone, spuntate « Siamo più di 6 ».'],
    'err.nom':      ['Indiquez votre nom.', 'Please give your name.', 'Indique su nombre.', 'Bitte geben Sie Ihren Namen an.', 'Indicate il vostro nome.'],
    'err.tel':      ['Indiquez un numéro de téléphone valide.', 'Please give a valid phone number.', 'Indique un teléfono válido.', 'Bitte geben Sie eine gültige Telefonnummer an.', 'Indicate un numero di telefono valido.'],
    'err.endpoint': [
      'Le formulaire n’est pas encore relié : renseignez ENDPOINT dans assets/js/reservation.js.',
      'The form is not connected yet: set ENDPOINT in assets/js/reservation.js.',
      'El formulario aún no está conectado: configure ENDPOINT en assets/js/reservation.js.',
      'Das Formular ist noch nicht verbunden: ENDPOINT in assets/js/reservation.js eintragen.',
      'Il modulo non è ancora collegato: impostate ENDPOINT in assets/js/reservation.js.'
    ],
    'err.envoi': [
      'Envoi impossible. Réessayez ou écrivez-nous sur Instagram.',
      'Could not send. Please try again or message us on Instagram.',
      'No se pudo enviar. Inténtelo de nuevo o escríbanos por Instagram.',
      'Senden fehlgeschlagen. Bitte erneut versuchen oder auf Instagram schreiben.',
      'Invio non riuscito. Riprovate o scriveteci su Instagram.'
    ],
    'err.complet': [
      'Ce soir-là est complet. Choisissez une autre date ou écrivez-nous sur Instagram.',
      'That evening is fully booked. Please pick another date or message us on Instagram.',
      'Esa noche está completa. Elija otra fecha o escríbanos por Instagram.',
      'Dieser Abend ist ausgebucht. Bitte wählen Sie ein anderes Datum oder schreiben Sie uns auf Instagram.',
      'Quella sera è al completo. Scegliete un’altra data o scriveteci su Instagram.'
    ]
  };

  /* ---------- Moteur ---------- */

  var index = 0;
  var langue = DEFAUT;

  function normaliser(l) {
    l = String(l || '').toLowerCase().slice(0, 2);
    return LANGUES.indexOf(l) !== -1 ? l : null;
  }

  function langueInitiale() {
    var params = new URLSearchParams(location.search);
    var demandee = normaliser(params.get('lang'));
    if (demandee) return demandee;

    try {
      var memorisee = normaliser(localStorage.getItem(STOCKAGE));
      if (memorisee) return memorisee;
    } catch (e) { /* navigation privée */ }

    var nav = navigator.languages || [navigator.language];
    for (var i = 0; i < nav.length; i++) {
      var l = normaliser(nav[i]);
      if (l) return l;
    }
    return DEFAUT;
  }

  function t(cle) {
    var v = T[cle];
    if (!v) return '';
    return v[index] || v[0];
  }

  function appliquer(l) {
    langue = normaliser(l) || DEFAUT;
    index = LANGUES.indexOf(langue);

    document.documentElement.lang = langue;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v) el.textContent = v;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (v) el.innerHTML = v;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split('|').forEach(function (paire) {
        var p = paire.split(':');
        var v = t(p[1]);
        if (v) el.setAttribute(p[0], v);
      });
    });

    document.querySelectorAll('[data-langue]').forEach(function (b) {
      var actif = b.getAttribute('data-langue') === langue;
      b.classList.toggle('is-active', actif);
      b.setAttribute('aria-current', actif ? 'true' : 'false');
    });

    try { localStorage.setItem(STOCKAGE, langue); } catch (e) { /* ignore */ }

    document.dispatchEvent(new CustomEvent('bona:langue', { detail: { langue: langue } }));
  }

  function brancherSelecteurs() {
    document.querySelectorAll('[data-langue]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        appliquer(b.getAttribute('data-langue'));
      });
    });
  }

  function demarrer() {
    brancherSelecteurs();
    appliquer(langueInitiale());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }

  return {
    langues: LANGUES,
    t: t,
    courante: function () { return langue; },
    appliquer: appliquer
  };
})();
