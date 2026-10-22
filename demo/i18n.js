/* Dogzy Family Universe — FR/EN. © 2026 Sania Labbé (Valkyrie)
   Français = comportement inchangé. Anglais : ?lang=en (mémorisé) ou bouton FR/EN. */
(() => {
const q = new URLSearchParams(location.search);
let L = q.get('lang'); if (L) { try { localStorage.setItem('dogzyLang', L); } catch (e) {} } else { try { L = localStorage.getItem('dogzyLang'); } catch (e) {} }
const EN = window.DOGZY_EN = L === 'en';
window.DOGZY_LANG = EN ? 'en' : 'fr';
window.dogzySetLang = l => { const u = new URL(location.href); u.searchParams.set('lang', l); try { localStorage.setItem('dogzyLang', l); } catch (e) {} location.href = u.href; };
if (!EN) return;
document.documentElement.lang = 'en';
const X = {
/* ---- plateau / interface ---- */
'Démo jouable · Niveau 1':'Playable demo · Level 1','LANCER LE DÉ':'ROLL THE DIE','TERMINER LA PARTIE':'END GAME','COMMENCER':'START','Choisis ton personnage':'Choose your character',
'DÉPART':'START','CHANCE':'CHANCE','QUIZ':'QUIZ','PÉNALITÉ':'PENALTY','DUEL':'DUEL','BANQUE':'BANK','ACHETER':'BUY','PASSER':'PASS','CONTINUER':'CONTINUE','RETOURNER LA CARTE':'FLIP THE CARD',
'RETOUR AU PLATEAU':'BACK TO BOARD','ABANDONNER':'GIVE UP','REJOUER':'PLAY AGAIN','Partie en cours…':'Game in progress…','Tu as gagné !':'You won!','Égalité (compte comme perdu)':'Tie (counts as a loss)','Tu as perdu.':'You lost.',
'La partie commence !':'The game begins!','Partie terminée.':'Game over.','🏆 Fin de partie':'🏆 Game over','⚔️ DUEL !':'⚔️ DUEL!','⚔️ Résultat du duel':'⚔️ Duel result','Le carrousel choisit le mini-jeu…':'The carousel is picking the mini-game…',
'Les deux bots jouent au mini-jeu…':'Both bots are playing the mini-game…','✅ Bonne réponse !':'✅ Correct answer!','❌ Mauvaise réponse':'❌ Wrong answer','Paquet CHANCE':'CHANCE deck','Paquet PÉNALITÉ':'PENALTY deck','Paquet QUIZ':'QUIZ deck',
'📱↻ Tourne ton téléphone pour un plus grand plateau':'📱↻ Turn your phone sideways for a bigger board','Plateau Dogzy Town Niveau 1':'Dogzy Town Level 1 board',
'© 2026 Sania Labbé (Valkyrie). Tous droits réservés. — Dogzy Family Universe':'© 2026 Sania Labbé (Valkyrie). All rights reserved. — Dogzy Family Universe',
'© 2026 Sania Labbé (Valkyrie). Tous droits réservés.':'© 2026 Sania Labbé (Valkyrie). All rights reserved.','effet affiché (règle complète à venir dans le jeu final)':'effect shown (full rule coming in the final game)',
'Mémoire NFT':'NFT Memory','Objets cachés':'Hidden Objects','La Corde':'The Rope','Gagnant tout de suite':'Instant win','Perdant tout de suite':'Instant loss',
'Resto Chefzy':'Chefzy Restaurant','Café Waitzy':'Waitzy Café','Bar Barzy':'Barzy Bar','Clinique Doczy':'Doczy Clinic','Chantier Buildzy':'Buildzy Construction Site','Gym Sportzy':'Sportzy Gym','Cabinet Lawzy':'Lawzy Law Firm','Magie Magiczy':'Magiczy Magic Shop','Sécurité Securzy':'Securzy Security','Banque Bankzy':'Bankzy Bank','Boutique Cashzy':'Cashzy Boutique',
/* ---- mini-jeux : communs ---- */
'← Mini-jeux':'← Mini-games','Démo':'Demo','JOUER':'PLAY','MINI-JEUX':'MINI-GAMES','MINI-JEU':'MINI-GAME','🐾 MINI-JEU 🐾':'🐾 MINI-GAME 🐾','Touche l\'écran pour passer':'Tap the screen to skip','Présentation des joueurs':'Meet the players','(humain)':'(human)','Toi':'You','Niveau':'Level','Score :':'Score:','Temps :':'Time:','Temps écoulé !':'Time\'s up!','Temps écoulé.':'Time\'s up.','🤝 Égalité !':'🤝 Tie!','gagne le duel !':'wins the duel!','Suivante':'Next','Lignes':'Lines','Gauche':'Left','Droite':'Right','Tourner':'Rotate','Descendre':'Down','Chute':'Drop',
/* mémoire */
'MÉMOIRE':'MEMORY','Essais :':'Tries:','Paires :':'Pairs:','Retourne deux cartes à la fois. Retiens où sont les personnages pour former les 12 paires !':'Flip two cards at a time. Remember where the characters are to make the 12 pairs!','🃏 Mémoire NFT':'🃏 NFT Memory',
'24 cartes NFT Dogzy sont':'24 Dogzy NFT cards are','face cachée':'face down',': 12 personnages, chacun en double.':': 12 characters, each one twice.','Retourne':'Flip','deux cartes':'two cards','. Si c\'est le même personnage, la paire reste visible. Sinon, elles se retournent.':'. If it\'s the same character, the pair stays visible. If not, they flip back.','Les personnages changent à chaque partie !':'The characters change every game!',
'En duel : chacun son tour. Une paire trouvée =':'In a duel: take turns. Find a pair =','tu rejoues':'you play again','. Le joueur avec le plus de paires gagne.':'. The player with the most pairs wins.','🏆 Bravo, 12 paires !':'🏆 Well done, 12 pairs!',
/* objets cachés */
'OBJETS CACHÉS':'HIDDEN OBJECTS','· Trouvés :':'· Found:','Tu gagnes la manche !':'You win the round!','Manche terminée':'Round over',
/* bubbles */
'Vise avec ton doigt ou ta souris, touche pour tirer.':'Aim with your finger or mouse, tap to shoot.','Aligne 3 bulles ou plus pour les éclater !':'Line up 3 or more bubbles to pop them!','BULLES RESTANTES':'BUBBLES LEFT','TIRS':'SHOTS','CHRONO':'TIMER','Éclate les grappes de 3+ bulles de la même couleur. Les bulles détachées tombent.':'Pop clusters of 3+ same-color bubbles. Detached bubbles fall.','PATTE':'PAW','COURONNE':'CROWN','ÉTOILE':'STAR','SUIVANTE':'NEXT','GAGNÉ !':'YOU WIN!','PARTIE TERMINÉE':'GAME OVER',
/* corde */
'LA':'THE','CORDE':'ROPE','Traits :':'Lines:','Réussis :':'Done:','↺ RECOMMENCER':'↺ RESTART','PASSER ⏭':'SKIP ⏭','Pose ton doigt sur un clou doré et glisse de clou en clou pour tendre la corde. Repasse sur chaque trait une seule fois, sans lever le doigt.':'Put your finger on a golden nail and slide from nail to nail to stretch the rope. Trace each line only once, without lifting your finger.',
'Retrace tout le dessin':'Trace the whole drawing','d\'un seul trait':'in one single stroke','avec la corde, en allant de clou en clou.':'with the rope, going from nail to nail.','Chaque trait ne peut être utilisé':'Each line can be used','qu\'une seule fois':'only once','. Si tu lèves le doigt avant la fin, le dessin recommence.':'. If you lift your finger before the end, the drawing restarts.','Astuce : s\'il y a des clous':'Tip: if there are','rouges':'red',', commence sur l\'un d\'eux.':'nails, start on one of them.',
'Réussis le plus de dessins possible en':'Complete as many drawings as you can in','90 secondes':'90 seconds','. Cœur, os, maison, étoile, couronne, patte, tête de chien, commerce : les dessins Dogzy deviennent de plus en plus compliqués.':'. Heart, bone, house, star, crown, paw, dog head, shop: the Dogzy drawings get harder and harder.',
'Maison Dogzy':'Dogzy House','Étoile':'Star','Couronne':'Crown','Patte':'Paw','Tête de chien':'Dog head','Commerce':'Shop','Cœur':'Heart','Os':'Bone','Maison':'House','trait répété':'line repeated','Bravo ! 🪢':'Well done! 🪢','Égalité… gagnée de justesse !':'Tie… won by a hair!','a réussi le plus de dessins.':'completed the most drawings.','LA CORDE':'THE ROPE',
/* match 3 / tile match */
'Glisse une tuile vers sa voisine, ou touche deux tuiles côte à côte pour les échanger. Aligne 3 icônes Dogzy pareilles ou plus : les chutes en cascade rapportent plus !':'Slide a tile toward its neighbor, or tap two side-by-side tiles to swap them. Line up 3 or more matching Dogzy icons: cascades score more!',
'Échange deux tuiles voisines pour aligner':'Swap two neighboring tiles to line up','3 tuiles pareilles ou plus':'3 or more matching tiles','(patte, os, couronne, cœur, étoile, maison).':'(paw, bone, crown, heart, star, house).','Un alignement de 4 ou plus crée une':'A line of 4 or more creates a','bulle arc-en-ciel 🌈':'rainbow bubble 🌈',': échange-la avec une tuile pour faire disparaître toutes les tuiles de cette couleur.':': swap it with a tile to clear every tile of that color.',
'Chaque tuile vaut':'Each tile is worth','10 points':'10 points',', multipliés par le combo des':', multiplied by the combo of','cascades':'cascades','. Premier à':'. First to','1500 points':'1500 points','gagne. Tu as':'wins. You have','60 secondes':'60 seconds','45 secondes':'45 seconds','2 minutes':'2 minutes','Si personne n\'atteint l\'objectif, le meilleur score gagne.':'If nobody reaches the goal, the best score wins.',
'Mélange !':'Shuffle!','Super arc-en-ciel !':'Super rainbow!','Arc-en-ciel !':'Rainbow!','objectif en premier.':'goal first.','est le plus avancé.':'is furthest ahead.','Objectif :':'Goal:','Glisse une tuile vers sa voisine, ou touche deux tuiles côte à côte pour les échanger. Aligne 3 tuiles pareilles ou plus.':'Slide a tile toward its neighbor, or tap two side-by-side tiles to swap them. Line up 3 or more matching tiles.',
'(patte, os, maison, étoile, cœur).':'(paw, bone, house, star, heart).','Premier joueur à faire disparaître':'First player to clear','80 tuiles':'80 tiles','Si personne n\'atteint l\'objectif, le joueur le plus avancé gagne.':'If nobody reaches the goal, the player furthest ahead wins.',
/* hexa */
'Glisse les pièces sur le plateau pour remplir toute la forme hexagonale. Touche une pièce posée pour la reprendre.':'Drag the pieces onto the board to fill the whole hexagonal shape. Tap a placed piece to take it back.','Glisse les':'Drag the','pièces hexagonales':'hexagonal pieces','du bas sur le plateau.':'from the bottom onto the board.','Remplis':'Fill','toutes les cases':'every cell','de la forme pour réussir le niveau. Les pièces ne tournent pas : trouve leur bonne place !':'of the shape to clear the level. Pieces don\'t rotate: find their right spot!',
'Touche une pièce déjà posée pour la reprendre.':'Tap a placed piece to take it back.','Réussis le plus de niveaux possible en':'Clear as many levels as you can in','. Les plateaux ont la forme d\'un cœur, d\'un os, d\'une patte, d\'une couronne et d\'une tête de chien Dogzy.':'. The boards are shaped like a heart, a bone, a paw, a crown and a Dogzy dog head.','Parfait ! ⬢':'Perfect! ⬢','a rempli le plus de plateaux.':'filled the most boards.','Cases :':'Cells:',
/* tetris */
'Clavier : ← → bouger, ↑ ou X tourner, ↓ descendre, Espace chute directe. Souris : clic gauche/droite sur la grille pour bouger, molette pour tourner.':'Keyboard: ← → move, ↑ or X rotate, ↓ down, Space hard drop. Mouse: left/right click on the grid to move, wheel to rotate.','Les 7 pièces Dogzy tombent :':'The 7 Dogzy pieces fall:','tourne-les':'rotate them','et place-les pour compléter des':'and place them to complete','lignes':'lines',
'Une ligne complète disparaît : 1 ligne = 100, 2 = 300, 3 = 500, 4 (Tetris !) = 800 points × level.':'A full line disappears: 1 line = 100, 2 = 300, 3 = 500, 4 (Tetris!) = 800 points × level.','Toutes les 10 lignes, le level monte et les pièces tombent plus vite.':'Every 10 lines, the level goes up and pieces fall faster.','Tu as':'You have',': le meilleur score gagne. Si ta pile touche le haut, c\'est fini !':': best score wins. If your stack reaches the top, it\'s over!','Pile au sommet !':'Stack at the top!','Ta pile a touché le haut.':'Your stack hit the top.',
/* 2048 */
'2048 en hexagones':'2048 in hexagons','Meilleure tuile :':'Best tile:','Glisse le doigt sur le plateau, touche les flèches, ou utilise le clavier : ↑ ↓ et Q E A D (ou W S).':'Swipe on the board, tap the arrows, or use the keyboard: ↑ ↓ and Q E A D (or W S).','Fais glisser toutes les tuiles dans une des 6 directions du plateau.':'Slide all the tiles in one of the board\'s 6 directions.','Deux tuiles pareilles qui se touchent fusionnent : 2+2 = 4, 4+4 = 8, 8+8 = 16…':'Two matching tiles that touch merge: 2+2 = 4, 4+4 = 8, 8+8 = 16…','Chaque fusion ajoute sa valeur à ton score.':'Each merge adds its value to your score.','. Le meilleur score des 4 joueurs gagne la manche.':'. The best score of the 4 players wins the round.','Plus aucun mouvement possible.':'No more moves possible.','Meilleur score des 4 joueurs.':'Best score of the 4 players.'
,'Toi (humain)':'You (human)','CŒUR':'HEART','OS':'BONE','PATTE':'PAW','ÉTOILE':'STAR','COURONNE':'CROWN','fais tomber les':'drop the','bulles avec':'bubbles with','tirs en':'shots in',
"s. Éclate les grappes de 3+ bulles de la même couleur ; les bulles détachées tombent. Les tirs ratés restent collés et s'ajoutent aux bulles restantes.":"s. Pop clusters of 3+ bubbles of the same color; detached bubbles fall. Missed shots stick and add to the remaining bubbles."
};
/* phrases avec variables */
const R = [
[/^⚔️ (.+)$/, (m, a) => `⚔️ ${tr(a)}`], [/^🏪 (.+)$/, (m, a) => `🏪 ${tr(a)}`],
[/^(.+) lance le dé :$/, '$1 rolls the die: '], [/^(\d+) \(départ (\d+)\)$/, '$1 (start $2)'],
[/^Objectif Level (\d+) \((.+)\) :$/, (m, a, b) => `Goal Level ${a} (${tr(b)}): `], [/^(\d+) : (.+)$/, (m, a, b) => `${a}: ${tr(b)}`],
[/^Tour (\d+) \/ (\d+)$/, 'Turn $1 / $2'], [/^Tour (\d+) —$/, 'Turn $1 — '], [/^Tour (\d+)$/, 'Turn $1'],
[/^P(\d) (.+) \(toi\)$/, 'P$1 $2 (you)'], [/^(.+) \(toi\)$/, '$1 (you)'],
[/^Toi contre 3 bots · (\d+) tours · départ (\d+) tokens$/, 'You vs 3 bots · $1 turns · start with $2 tokens'],
[/^(\d+) t · loyer (\d+)$/, '$1 t · rent $2'],
[/^Prix :$/, 'Price: '], [/^tokens · revenu à chaque visite :$/, 'tokens · income on each visit: '],
[/^Mise :$/, 'Stake: '], [/^tokens\. Lance le dé pour savoir qui t'affronte\.$/, 'tokens. Roll the die to find out who you face.'], [/^tokens\. Lance le dé pour savoir qui (.+) affronte\.$/, 'tokens. Roll the die to find out who $1 faces.'],
[/^— mise (\d+) tokens$/, '— stake $1 tokens'],
[/^gagne : \+(\d+) tokens$/, 'wins: +$1 tokens'], [/^perd : -(\d+) tokens$/, 'loses: -$1 tokens'],
[/^: (\d+) tokens \+ commerces =$/, ': $1 tokens + shops = '], [/^gagne Dogzy Family Universe !$/, 'wins Dogzy Family Universe!'],
[/^Réponds à la question pour gagner (\d+) tokens\.$/, 'Answer the question to win $1 tokens.'], [/^(QZ\d+) · Quiz niveau 1$/, '$1 · Level 1 quiz'],
[/^(\+|-)?(-?\d+) tokens \((.+)\)$/, (m, s, n, w) => ` ${s || ''}${n} tokens (${tr(w)})`],
[/^lance le dé :$/, 'rolls the die: '], [/^affronte (.+) en duel\.$/, 'faces $1 in a duel.'], [/^(.+) affronte (.+) en duel\.$/, '$1 faces $2 in a duel.'],
[/^(.+) passe son tour\.$/, '$1 skips this turn.'], [/^(.+) rejoue !$/, '$1 plays again!'], [/^(.+) rate le quiz\.$/, '$1 missed the quiz.'], [/^(.+) n'a pas assez de tokens pour (.+)\.$/, (m, a, b) => `${a} doesn't have enough tokens for ${tr(b)}.`],
[/^(.+) est chez lui \((.+)\)\.$/, (m, a, b) => `${a} is at home (${tr(b)}).`], [/^Carrousel :$/, 'Carousel: '], [/^\(duel entre bots : (.+)\)$/, (m, a) => `(bot duel: ${tr(a)})`], [/^\(duel entre bots simulé\)$/, '(simulated bot duel)'],
[/^passage au Départ$/, 'passed Start'], [/^achat (.+)$/, (m, a) => `bought ${tr(a)}`], [/^loyer (.+)$/, (m, a) => `rent ${tr(a)}`], [/^revenu (.+)$/, (m, a) => `income ${tr(a)}`],
[/^duel perdu$/, 'duel lost'], [/^duel gagné$/, 'duel won'], [/^Quiz réussi$/, 'Quiz passed'], [/^(.+) \(duel perdu\)$/, (m, a) => `${tr(a)} (duel lost)`],
[/^: (.+)$/, (m, a) => ': ' + a.split(', ').map(fx).join(', ')],
[/^(CH|PE)(\d+) · (.+)$/, (m, a, b, c) => `${a}${b} · ${tr(c)}`],
[/^(\d+) tours?$/, (m, n) => `${n} turn${n > 1 ? 's' : ''}`],
[/^Essais : (\d+)$/, 'Tries: $1'], [/^Paires : (.+)$/, 'Pairs: $1'], [/^Niveau (\d+)$/, 'Level $1'], [/^niveau (\d+)$/, 'level $1'], [/^(\d+) niveaux?$/, '$1 levels'], [/^(\d+) dessins?$/, '$1 drawings'], [/^(\d+) lignes?$/, '$1 lines'], [/^dessins?$/, 'drawings'], [/^lignes?$/, 'lines'], [/^niveau$/, 'level'],
[/^Temps écoulé : P(.*)$/, 'Time\'s up: P$1'], [/^(.*)a atteint l'objectif en premier\.$/, '$1reached the goal first.'], [/^(.*) est le plus avancé\.$/, '$1 is furthest ahead.'],
[/^tuiles ?$/, 'tiles'], [/^(\d+) tuiles$/, '$1 tiles'], [/^points  ?Combo :$/, 'points  Combo:'], [/^tuiles  ?Combo :$/, 'tiles  Combo:'],
];
const FX = [[/^([+-]?\d+) tokens$/, '$1 tokens'], [/^paie (\d+) tokens à (.+)$/, 'pays $1 tokens to $2'], [/^les autres \+(\d+)$/, 'others +$1'], [/^vole (\d+) tokens à (.+)$/, 'steals $1 tokens from $2'], [/^reçoit (\d+) tokens de chaque joueur$/, 'gets $1 tokens from each player'], [/^paie (\d+) tokens à chaque joueur$/, 'pays $1 tokens to each player'], [/^donne (\d+) tokens à (.+)$/, 'gives $1 tokens to $2'], [/^-(\d+) tokens \(commerces\)$/, '-$1 tokens (shops)'], [/^passe son prochain tour$/, 'skips next turn'], [/^rejoue tout de suite$/, 'plays again right away'], [/^échange sa place avec (.+)$/, 'swaps places with $1'], [/^va à la case (.+)$/, (m, a) => `goes to the ${tr(a)} space`], [/^déplacement (-?\d+)$/, 'moves $1']];
function fx(s){ for (const [re, to] of FX) if (re.test(s)) return s.replace(re, to); return tr(s); }
const C = window.DOGZY_EN_CARDS || {};
function tr(s){
  if (X[s] != null) return X[s]; if (C[s] != null) return C[s];
  for (const [re, to] of R) if (re.test(s)) return s.replace(re, to);
  return s;
}
window.dogzyT = tr;
function trNode(n){ const v = n.nodeValue, t = v.trim(); if (!t || n.__en === v) return; const o = tr(t); if (o !== t){ n.nodeValue = v.replace(t, o); } n.__en = n.nodeValue; }
function walk(root){
  if (root.nodeType === 3) return trNode(root);
  if (root.nodeType !== 1 || root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
  for (const a of ['title', 'alt', 'placeholder', 'aria-label']) if (root.hasAttribute && root.hasAttribute(a)){ const o = tr(root.getAttribute(a)); if (o !== root.getAttribute(a)) root.setAttribute(a, o); }
  for (const c of root.childNodes) walk(c);
}
const start = () => { document.title = tr(document.title.replace(' | Mini-jeux Dogzy', '')) + (/Mini-jeux/.test(document.title) ? ' | Dogzy Mini-games' : ''); walk(document.body);
  new MutationObserver(ms => { for (const m of ms){ if (m.type === 'characterData') trNode(m.target); else m.addedNodes.forEach(walk); if (m.type === 'attributes') walk(m.target); } })
    .observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['title','alt','placeholder','aria-label']}); };
if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
const al = window.alert; window.alert = m => al(tr(String(m)));
})();
