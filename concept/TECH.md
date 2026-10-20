# The Adoles-chiant of Dogzy Town – Structure technique

Document pour un développeur ou une IA qui reprend le projet.

## Structure actuelle du dépôt
- `index.html`, `game.js`, `data.js`, `chars.js`, `fr.js`, `style.css` : démo web du board (cases, levels, personnages, textes français).
- `en/` : version anglaise.
- `assets/` : images (personnages, boards, cartes).
- `minijeux/` : mini-jeux HTML5 autonomes (`2048-hex.html`, `tile-match.html`, `bubbles.html`), code partagé `mj.js`, styles `mj.css`, intro animée des joueurs `intro.js` (VS, titre, 3-2-1 GO), médias dans `img/`.
- `concept/` : dossier de concept (`README.md`, PDF).

## Scripts à construire
1. **Board** : moteur de tour (roue, déplacement, effets de case), levels 1 à 5.
2. **Case Duel** : dé 1-4 pour choisir l'adversaire, puis roue/machine à sous qui choisit un mini-jeu ou « Gagnant / Perdant tout de suite ».
3. **Carte Attaque** : catapulte, bouclier, démolition d'un bâtiment ou vol d'argent.
4. **Mini-jeux** : chaque mini-jeu = une page HTML5 qui reçoit les joueurs et renvoie le gagnant au board (API commune dans `mj.js`).
5. **Économie** : pièces, réparations, boucliers, évolutions, accessoires NFT.
6. **Multijoueur en ligne** : serveur temps réel (ex. WebSocket) pour 4 joueurs, cellulaire et ordinateur.
7. **Comptes et paiements** : abonnements, achats dans le jeu, emplacements publicitaires.

## Animation des personnages
Images en sprites ou animations (Spine, Lottie ou vidéo courte), intégrées en HTML5 Canvas ou dans un moteur comme Phaser.

© 2026 Sania Labbé (Valkyrie). Tous droits réservés.
