Dogzy Family Universe — jeu de table style Monopoly (v3, en français)
(Jeu distinct de « The Adoles-chiant of Dogzy Town », qui est le jeu web3.)

Lancer en local :  cd /workspace/dzg-pub && python3 -m http.server 8765  puis ouvrir http://localhost:8765/
(ou ouvrir index.html directement). Mobile (portrait) et ordinateur. Sauvegarde dans le navigateur (localStorage).

Règles v3
- Deux roues : GRANDE ROUE (1 à 8 cases). Sur une case spéciale (commerce, fouille, quiz, pièces, pénalité),
  la ROUE BONUS : VISITE 1/2/3 commerces, VOLE 50/100/150 pièces, x2, x3, CHANCE, CARRIÈRE.
- 4 niveaux : Cuisinier de base → Chef cuisinier (1 commerce + 1400 de fortune) → Gérant (3 commerces + 2200)
  → Propriétaire/Maire (5 commerces, ou Hôtel de ville + 3). Avantages : +10 % de loyer par niveau, +50 au DÉPART par niveau,
  le Maire touche 25 pièces de taxe sur chaque loyer payé par les autres. La carte Chance « Promotion ! » monte d'un niveau.
- Menu : contre les bots (1-3), joueurs sur le même appareil (2-4, chacun son tour, + 0-3 bots), En ligne = bientôt.
- Commerces achetables (200-400), améliorables 0-5 ; chaque carte affiche son MÉTIER ASSOCIÉ
  (Bistro = Serveur/Barmaid, Hôtel & Bar = Barmaid, Restaurant = Cuisinier/Serveur…). Métier assorti = +50 % loyer, −25 % amélioration.
- Cartes Chance (16) et Chance Carrière (10) en noir et or, textes en français.
- Bots : Facile, Normal, Difficile, Expert. Difficile/Expert : achats agressifs avec coussin de survie (pire loyer adverse),
  vol de la cible la plus payante (sans bouclier ni gold), achats en boutique avec leur surplus seulement.
- VICTOIRE (v4, comme au Monopoly) : le dernier joueur en lice gagne. Plus de but 2500 ni de mode 10/20 tours.
  Paiement impossible -> vente automatique des commerces à la banque à 50 % (prix + améliorations), du moins cher au plus cher ;
  toujours insuffisant -> FAILLITE : éliminé, le créancier reçoit ce qui reste, les commerces retournent à la banque.
  Sécurité : à 150 tours, la plus grosse fortune gagne. Loyers : 25 % du prix x [1; 2,5; 4; 6; 8; 11] selon les améliorations,
  x(1 + 15 % par tour) d'inflation pour que la partie finisse. Argent de départ : 1200 pièces. Passage au DÉPART : 300 pièces.
- Jetons Dogzy (monnaie premium SIMULÉE, aucune vraie crypto) : achetés avec des pièces dans la Boutique (🛍).
  Taux : 100 pièces = 1 Dogzy, +2 pièces tous les 5 Dogzy émis par tous les joueurs (max 200). Pas de revente.
  Constantes dans game.js : DOGZY_RATE_BASE / STEP / EVERY / MAX.
- Boutique d'accessoires (prix en Dogzy seulement) : 5 Dogzy chacun : Bouclier royal, Baskets de course (tour bonus),
  Collier de diamants (+75 au DÉPART), Gants de pickpocket (+50 par vol), Lunettes VIP (+20 % loyers reçus), Casque de chantier (−25 % loyers payés).
- Accessoires GOLD (20 Dogzy chacun, 5 modèles) : 1 utilisation ; annulent automatiquement un paiement de 50 pièces ou plus
  (loyer, taxe du maire, vol, pénalité Chance), puis sont consommés. Compteur ✦ dans la barre du haut.
  Avec 3 accessoires gold ou plus non utilisés : le DÉPART rapporte 600 pièces au lieu de 300 (+ bonus de niveau et collier).
- Niveaux : conditions par nombre de commerces seulement (1 / 3 / 5 ou Hôtel de ville + 3).
- Monnaie : la monnaie de jeu s'appelle « pièces » (icône pièce d'or). Le nom « Dogzy » (jetons Dogzy) est réservé
  au jeton premium (constante DOGZY_NAME dans game.js) ; ce jeu de table n'a pas encore de jeton premium.
- Personnages (v5) : seuls les 12 personnages adultes de Dogzy Town sont jouables (joueurs et bots : Bankzy, Lawzy, Securzy, Magiczy…).
  Les ados (The Pyromaniac, Jouzy, Waltzy, Kelzy) appartiennent à The Adoles-chiant of Dogzy Town : ils ne sont plus jouables ici.
- Boutique > NFT (cartes VIP 1000 jetons Dogzy, personnages gold 50, objets de collection SIMULÉS, aucune blockchain, aucun avantage en jeu) :
  * Cartes NFT VIP : les 4 ados — nom, image, badge « NFT VIP », cadre or, loupe, prix : 1000 jetons Dogzy. En tête de section :
    « Possède à l'avance ton personnage pour l'univers The Adoles-chiant of Dogzy Town. »
  * Personnages gold (50 jetons Dogzy) : version dorée de chacun des 12 personnages, mention « NFT — à venir sur Avalanche » et 1 avantage affiché :
    « 15 % de rabais sur l'achat de ce même personnage dans The Adoles-chiant of Dogzy Town, à son lancement. »
    Le propriétaire peut afficher le portrait gold comme avatar/pion (Ma collection > UTILISER COMME AVATAR ; équipé d'office s'il le possède).
  * Ma collection (Boutique ou SAC) ; la propriété est gardée dans le navigateur d'une partie à l'autre (clé localStorage dogzy-family-universe-nft).
  * Les bots n'achètent pas de NFT.
- Loupe : toucher une image de personnage (🔍 dans le menu de départ, image dans la boutique et Ma collection) l'agrandit ;
  × ou toucher à côté pour fermer. Le choix / l'achat se fait seulement avec les boutons.
  Note : 1000 Dogzy (carte VIP) dépassent largement ce qu'on peut gagner en une partie (taux plafonné à 200 pièces : ~187 000 pièces).
  Note : 50 Dogzy (personnage gold) coûtent environ 5 450 pièces au taux croissant.

- Version anglaise : dossier en/ (servie à /en/). en/index.html utilise <base href="../"> : les images, style.css, data.js et chars.js
  sont partagés avec la version française. Textes anglais : en/strings-en.js (cartes, commerces, métiers, carrière Cook) et en/game.js.
  Lien FR / EN en haut à droite dans les deux versions. Partie sauvegardée séparément en anglais (clé dogzy-family-universe-v3-en) ;
  la collection NFT est commune aux deux langues.
