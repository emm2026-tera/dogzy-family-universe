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
  x(1 + 15 % par tour) d'inflation pour que la partie finisse. Départ : 1200 pièces.
- Jetons Dogzy (monnaie premium SIMULÉE, aucune vraie crypto) : achetés avec des pièces dans la Boutique (🛍).
  Taux : 100 pièces = 1 Dogzy, +2 pièces tous les 5 Dogzy émis par tous les joueurs (max 200). Pas de revente.
  Constantes dans game.js : DOGZY_RATE_BASE / STEP / EVERY / MAX.
- Boutique d'accessoires (prix en Dogzy seulement) : Bouclier royal 2, Baskets de course (tour bonus) 3, Collier de diamants
  (+75 au DÉPART) 4, Gants de pickpocket (+50 par vol) 4, Lunettes VIP (+20 % loyers reçus) 6, Casque de chantier (−25 % loyers payés) 6.
- Accessoires GOLD (8 Dogzy chacun, 5 modèles) : 1 utilisation ; annulent automatiquement un paiement de 50 pièces ou plus
  (loyer, taxe du maire, vol, pénalité Chance), puis sont consommés. Compteur ✦ dans la barre du haut.
  Avec 3 accessoires gold ou plus non utilisés : le DÉPART rapporte 600 pièces au lieu de 200 (+ bonus de niveau et collier).
- Niveaux : conditions par nombre de commerces seulement (1 / 3 / 5 ou Hôtel de ville + 3).
- Monnaie : la monnaie de jeu s'appelle « pièces » (icône pièce d'or). Le nom « Dogzy » (jetons Dogzy) est réservé
  au jeton premium (constante DOGZY_NAME dans game.js) ; ce jeu de table n'a pas encore de jeton premium.
