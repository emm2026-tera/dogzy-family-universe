# CHANGES.md — Dogzie site v2 vs ancien site Webador

Refonte statique noire/or, français québécois/canadien cohérent. Ville : **Dogzie Town** partout. Signature publique : **Valkyrie**.

## 1. Navigation française cohérente
- Menus anglais / libellés longs remplacés par : Accueil, Univers, Collections (Jet Set / Criminels / Outcasts), Personnages (VIP / Base), Dogzie Town, Galerie Valkyrie, Comment ça marche, Roadmap, Tokenomics, Contrats, Partenaires, Communauté, **Métiers**.
- Groupes en menus déroulants ; hamburger sur mobile.

## 2. Mise en page serrée
- Contenu max ~1160px, grilles CSS pour cartes/galeries, moins de vides sombres.

## 3. Collections Jet Set, Criminels, Outcasts
- Descriptions françaises (ambiance, qui, rôle dans Dogzie Town) + galeries d’images CDN téléchargées.

## 4. Nouvelles sections
- **Contrats** : Avalanche C-Chain envisagé ; adresses « à publier au déploiement ».
- **Vision / Whitepaper** : résumé français écosystème.
- **Tokenomics** : vision (accessoires en Dogzy ; export si perso dans les deux univers) — non déployé / non audité.
- **Roadmap** : Phase 1 art/NFT ; Phase 2 levée ~500–550k CAD ; console ; galerie/extensions — plan non promis.
- **Communauté** : « Liens à venir » (pas de Discord inventé).
- **Métiers Dogzie Universe** : 20 fiches (liste ci-dessous).

## 5. Sécurité reformulée
- Suppression du « 9.3/10 internal pre-audit ».
- Texte : revue interne / architecture en préparation / audit tiers à venir avant déploiement.

## 6. Ville = Dogzie Town uniquement
- Plus de Dogstown / Dogzy Town dans l’UI.

## 7. Formulaire partenaires
- Libellés : Nom complet, Fonds / entreprise, Courriel professionnel, Profil LinkedIn, Site web, Message, bouton **Envoyer**.
- `mailto:partenaires@thedogzyfamilyuniverse.ca`.

## 8. Affiche bande-annonce
- `assets/trailer-poster.jpg` avant lecture Vimeo.

## 9. Black/gold premium conservé

## 10. Trailer Vimeo `1207441244` en bas de l’accueil

---

## Métiers ajoutés (20 fiches)

Progression : base → ~10 accessoires (exemples de design) → propriétaire ; sinon franchise.

- **Chefzy** (Cuisinier / Boulanger) → Restaurant / Boulangerie Dogzie — Cuisinier / Boulanger → Chef cuisinier / Maître boulanger → Propriétaire du restaurant / de la boulangerie
- **Doczy** (Médecin) → Clinique Dogzie — Médecin → Médecin-chef → Propriétaire de la clinique
- **Salonzy** (Coiffeur / Coiffeuse) → Salon de coiffure Dogzie — Coiffeur → Maître styliste → Propriétaire du salon
- **Beautzy** (Esthéticienne) → Institut de beauté Dogzie — Esthéticienne → Experte beauté → Propriétaire de l’institut
- **Mechzy** (Mécanicien) → Garage Dogzie — Mécanicien → Maître du garage → Propriétaire du garage
- **Hostzy** (Hôtelier / Concierge) → Hôtel Dogzie Palace — Concierge → Directeur d’hôtel → Propriétaire de l’hôtel
- **Shopzy** (Conseiller mode / Boutique) → Boutique mode Dogzie — Vendeur boutique → Directeur boutique → Propriétaire de la boutique
- **Bankzy** (Banquier) → Banque Dogzie — Banquier → Directeur financier → Propriétaire de la banque (franchise réseau)
- **Lawzy** (Avocat) → Cabinet d’avocats Dogzie — Avocat → Avocat en chef → Propriétaire du cabinet
- **Securzy** (Agent de sécurité) → Agence de sécurité Dogzie — Agent de sécurité → Commandant sécurité → Propriétaire de l’agence
- **Buildzy** (Ouvrier / Constructeur) → Entreprise de construction Dogzie — Ouvrier → Maître bâtisseur → Propriétaire de l’entreprise
- **Electrozy** (Électricien) → Entreprise électrique Dogzie — Électricien → Maître de l’énergie → Propriétaire de l’entreprise
- **Plumbzy** (Plombier) → Entreprise de plomberie Dogzie — Plombier → Chef des systèmes d’eau → Propriétaire de l’entreprise
- **Waitzy** (Serveur / Serveuse) → Café Dogzie — Serveur → Gérant de restaurant → Propriétaire du café
- **Barzy** (Barman / Barmaid) → Bar Dogzie Lounge — Barman → Maître mixologue → Propriétaire du bar
- **Sportzy** (Entraîneur sportif) → Club sportif Dogzie — Entraîneur → Coach champion → Propriétaire du club
- **Magiczy** (Magicien / Animateur) → Théâtre / Salle de spectacle Dogzie — Animateur → Maître de la magie → Propriétaire du théâtre
- **Wheelzy** (Plaidoyer communautaire) → Centre d’inclusion Dogzie — Advocate communautaire → Leader inspiration → Directeur du centre d’inclusion
- **Gentlezy** (Gentleman / Étiquette) → Académie d’élégance Dogzie — Gentleman → Maître de l’élégance → Propriétaire de l’académie
- **Cashzy** (Caissier / Caissière) → Épicerie Dogzie — Caissier → Superviseur magasin → Propriétaire de l’épicerie

---

## Pied de page
Avis PI en français (Valkyrie), © 2026. Skip link + titres sémantiques.

---

## 8 octobre 2026 — Deux volets : Dogzie Town (jeu) et Dogzy Family Universe (blockchain)

- **metiers/index.html** devient la page **Dogzy Family Universe** : 25 affiches métiers complètes (5 niveaux sur chaque affiche), copiées dans `assets/metiers/` (01–23 en français, 24 Teacher et 25 Sound Tech en anglais seulement). Textes tirés de `roster.csv` uniquement (métier, race, sexe, personnalité, 5 niveaux). Cuisinier, Serveuse et Barmaid : fiche à venir.
- Même page : commerces (niveau 5 de chaque métier), accessoires, banque-échange (à venir, pas ouverte), expansions, bateau de croisière, marina, aéroport (à venir), galerie d’art (lien vers la Galerie Valkyrie). Frappe d’une évolution à la fois : avec le jeu, pas encore offerte. Aucun prix, aucune adresse, aucun bouton de mint.
- L’ancienne liste de 20 métiers à noms provisoires (Chefzy, Doczy, etc.) n’est plus liée depuis l’index; les fichiers `metiers/*.html` sont conservés.
- **dogzie-town.html** : liste des 9 collections du jeu (Jet Set, Criminels, Vedettes, Extravertis, Marginaux, Geeks, Mondes d’adrénaline, Justiciers, Adolescents). Pages existantes : Jet Set, Criminels, Marginaux (page Outcasts); les six autres : à venir.
- Navigation (toutes les pages) : « Dogzy Family Universe (métiers) », « Marginaux (Outcasts) », « Les 9 collections ». Accueil : 9 collections, 25 affiches métiers. Fil d’Ariane des collections rattaché à Dogzie Town.
- 8 octobre 2026 (suite) : dogzie-town.html renvoie les commerces et métiers vers Dogzy Family Universe; comment-ca-marche.html remplace « ~10 accessoires » par les cinq niveaux; univers.html précise que les accessoires sont prévus, pas encore en vente.
- 8 octobre 2026 (onglets) : metiers/index.html réorganisé en 8 onglets Dogzy Family Universe (Personnages métiers 25 affiches sur 40, Accessoires nécessaires, Commerce, Événements, Clés de la ville, Galerie d’art, Banque-échange, Pitch et tokenomics), contenus à venir non inventés.
- 8 octobre 2026 (volets) : deux volets. Volet 1 · Jeu console = Dogzie Town (onglets : 9 collections, Missions, Univers / clans : les gentils, les méchants; à venir sauf Jet Set, Criminels, Marginaux). Volet 2 · Blockchain = Dogzy Family Universe (Pitch et Tokenomics en onglets séparés, 9 onglets).
- 8 octobre 2026 (bande-annonce) : accueil, la bande-annonce Vimeo 1207441244 passe en haut de page, suivie du bloc « Le concept total »; dogzie-town.html ajoute les onglets Export de tokens (règle citée de tokenomics.html, pas encore ouvert) et Pitch pour les investisseurs (à venir).

---

## 10 octobre 2026 — Refonte pro / vendeuse (APERÇU LOCAL SEULEMENT)

**Statut : local seulement, non déployé, non publié.** Ce dossier est un aperçu de la refonte de la page Webador thedogzyfamilyuniverse.ca. Rien n'a été envoyé à Webador, Netlify ni ailleurs. Sauvegarde avant modifications : `/workspace/dogzie-site-v2.backup-20261010/`.

- **Toutes les pages** : bandeau « Aperçu local de la refonte de thedogzyfamilyuniverse.ca · non publié »; logo « Dogzy Family Universe »; navigation resserrée en deux volets (Dogzie Town · Jeu / Family Universe · Blockchain) + Galerie, L'artiste, Communauté, bouton Partenaires; nouveau pied de page (domaine thedogzyfamilyuniverse.ca en évidence, Instagram, TikTok, YouTube musique, site de l'artiste peintre).
- **styles.css** : polish noir/or (soulignés dorés, cartes animées, statistiques, badges, ruban d'aperçu, encadrés « en développement », pastilles « à venir », frise des expositions).
- **index.html** : bande-annonce toujours en premier, puis concept total avec deux grandes cartes (Dogzie Town / Dogzy Family Universe, bouton « Découvrir Dogzy Family Universe »), héros, chiffres, **bloc crédibilité de l'artiste**, collections, métiers, sécurité, appel aux partenaires.
- **artiste.html (nouveau)** : Valkyrie (Sania Labbé) — vérifiée Singulart; 23 expositions (bilan de l'artiste) avec sélection documentée, présentations Artboxy sur écran numérique indiquées comme telles; 14 curations (Artboxy 2026, Singulart : Hamza Djelassi ×4, Susana Navarro, FS Karachiwala; Gallea Signature : Émotion chaotique); entrevue Artistcloseup avril 2026; top 10 % / ~41 000 vues en 4 mois présenté « selon l'artiste »; liens sociaux et site peintre.
- **galerie-valkyrie.html** : encadré « Galerie NFT — vente pas encore ouverte » + liens parcours / site peintre.
- **communaute.html** : vrais liens Instagram, TikTok, YouTube et site peintre; Discord reste « à venir » (aucun lien inventé).
- **dogzie-town.html** et **metiers/index.html** : « à venir » remplacés par des encadrés honnêtes « En développement » ou des pastilles; banque-échange clairement « pas encore ouverte ». Aucun prix, adresse, bouton mint, partenaire ou fiche inventés.
- Pas de « fondation Projet Valkyrie » inventée. The Valkyrians (IP jeunesse sœur) ajoutée le 10 octobre 2026 en aperçu local — voir section suivante.
- Captures : `previews/2026-10-10-index.png`, `previews/2026-10-10-artiste.png`.

---

## 10 octobre 2026 (suite) — The Valkyrians comme deuxième univers (LOCAL SEULEMENT)

**Statut : local seulement, non déployé, non publié** sur Webador / thedogzyfamilyuniverse.ca.

- **valkyrian.html (nouveau)** : page The Valkyrians — IP sœur de Sania Labbé / Valkyrie (univers jeunesse, 18 protecteurs, modes course / party / histoire + jeu éducatif). Cadre clair : distinct de Dogzy, pas de tokenomics Dogzy, pas de partenariat Sony, pas de vente Dogzy de cette IP. Documents d’acquisition liés en local (`assets/valkyrian/docs/`) : présentation 6 pages, offres FR/EN, pitch FR, courriels d’approche FR/EN. Trois visuels compressés dans `assets/valkyrian/`.
- **Navigation** : lien « Valkyrian » ajouté sur toutes les pages (après L’artiste).
- **index.html** : carte « Aussi par la même créatrice — The Valkyrians » sous le concept des deux volets Dogzy, CTA vers `valkyrian.html`.
- **artiste.html** : courte mention + lien vers The Valkyrians.
- Bandeau « Aperçu local … non publié » conservé.
