/* The Adoles-chiant of Dogzy Town — démo niveau 1. © 2026 Sania Labbé (Valkyrie) */
(() => {
const D = window.DEMO_DATA, Q = new URLSearchParams(location.search), FAST = Q.get('fast') === '1';
const MAX_TURNS = +Q.get('tours') || 8, START_TOKENS = 1500, PASS_START = 200, DUEL_STAKE = 100;
const $ = s => document.querySelector(s), sleep = ms => new Promise(r => setTimeout(r, FAST ? Math.min(ms, 60) : ms));
const rnd = a => a[Math.floor(Math.random() * a.length)];
const CHARS = ['chefzy','waitzy','barzy','doczy','bankzy','buildzy','cashzy','gentlezy','lawzy','magiczy','securzy','sportzy'];
const NM = c => c[0].toUpperCase() + c.slice(1), IMG = c => `../assets/charcards/${c}.jpg`;
const COLORS = ['#ffd23a','#3ab0ff','#5af05a','#ff7ad0'];
const COM = [['Resto Chefzy',180],['Café Waitzy',150],['Bar Barzy',200],['Clinique Doczy',260],['Chantier Buildzy',220],['Gym Sportzy',170],['Cabinet Lawzy',280],['Magie Magiczy',240],['Sécurité Securzy',300],['Banque Bankzy',320],['Boutique Cashzy',190]];
/* ordre et types = plateau officiel Niveau 1 (image plateau-niveau1.jpg), départ en bas, sens horaire */
const T = ['start','commerce','chance','commerce','duel','commerce','penalite','commerce','chance','commerce','quiz','commerce','penalite','commerce','commerce','commerce','duel','commerce','quiz','commerce','chance','penalite'];
const XY = [[230,380],[185,340],[120,305],[80,260],[65,205],[85,135],[160,105],[225,85],[290,65],[355,60],[415,58],[475,62],[538,72],[595,88],[652,112],[712,138],[758,205],[770,265],[740,310],[695,350],[628,365],[540,385]].map(([x,y]) => [x / 8.19, y / 5.46]);
let ci = 0; const CASES = T.map((t, i) => ({i, t, ...(t === 'commerce' ? {nm:COM[ci][0], price:COM[ci][1], rent:Math.round(COM[ci++][1] * .3), owner:null} : {})}));
const ICON = {start:'🏁', commerce:'🏪', chance:'🍀', quiz:'❓', penalite:'⚠️', duel:'🐶⚔️'}, LBL = {start:'DÉPART', chance:'CHANCE', quiz:'QUIZ', penalite:'PÉNALITÉ', duel:'DUEL'};
const GAMES = [
  {id:'memoire', nm:'Mémoire NFT', th:'🃏', img:'../minijeux/img/nft/01-philzy.jpg'},
  {id:'objets-caches', nm:'Objets cachés', th:'🔍', img:'../assets/scene-diamond-heist.png'},
  {id:'bubbles', nm:'Bubble Shooter', th:'🫧'},
  {id:'corde', nm:'La Corde', th:'🪢'},
  {id:'match3', nm:'Match 3 Sugar Rush', th:'🍬'},
  {id:'hexa-puzzle', nm:'Hexa Puzzle', th:'⬢'},
  {id:'tetris', nm:'Tetris Dogzy', th:'🧱'},
  {id:'tile-match', nm:'Tile Match', th:'🀄', img:'../minijeux/img/tile-vignette.jpg'},
  {id:'2048-hex', nm:'2048 Hex', th:'🔢', img:'../minijeux/img/2048-vignette.jpg'},
  {id:'win', nm:'Gagnant tout de suite', th:'🏆', cls:'win'},
  {id:'lose', nm:'Perdant tout de suite', th:'💀', cls:'lose'}];
const force = window.DEMO = {force:{}, state:null, GAMES, CASES};
let P = [], cur = 0, turn = 1, over = false, decks = {};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const draw = k => { if (!decks[k] || !decks[k].length) decks[k] = shuffle(D[k]); return decks[k].pop(); };
function log(m){ const d = document.createElement('div'); d.innerHTML = m; $('#log').prepend(d); }
function open(h, wide){ $('#sheet').className = wide ? 'wide' : ''; $('#sheet').innerHTML = h; $('#modal').classList.remove('hidden'); }
function close(){ if (over) return; $('#modal').classList.add('hidden'); $('#sheet').innerHTML = ''; }
const click = (sel, botMs) => new Promise(r => { const b = $(sel); if (!b) return; b.onclick = () => r(b); if (P[cur] && P[cur].bot && botMs != null) setTimeout(() => b.isConnected && r(b), FAST ? 40 : botMs); });
function add(p, n, why){ p.tokens += n; log(`<b style="color:${p.color}">${p.name}</b> ${n >= 0 ? '+' : ''}${n} tokens (${why})`); render(); }

/* ---------- rendu ---------- */
const POS = []; for (let c = 0; c < 7; c++) POS.push([0, c]); for (let r = 1; r < 6; r++) POS.push([r, 6]); for (let c = 5; c >= 0; c--) POS.push([5, c]); for (let r = 4; r >= 1; r--) POS.push([r, 0]);
function render(){
  const act = P[cur] ? P[cur].pos : -1;
  $('#board').innerHTML = `<img class="bimg" src="plateau-niveau1.jpg" alt="Plateau Dogzy Town Niveau 1">` + CASES.map((c, i) => `<div class="cell t-${c.t}${i === act ? ' active' : ''}" data-i="${i}" title="${c.nm || LBL[c.t]}" style="left:${XY[i][0]}%;top:${XY[i][1]}%">${c.price ? `<span class="pr">${c.price}</span>` : ''}${c.owner != null ? `<span class="own" style="background:${P[c.owner].color}"></span>` : ''}<div class="pawns">${P.filter(p => p.pos === i).map(p => `<span class="pawn" style="background:${p.color}" title="${p.name}"></span>`).join('')}</div></div>`).join('')
    + `<div id="bank"><div class="b3">Tour ${Math.min(turn, MAX_TURNS)} / ${MAX_TURNS}</div></div>`;
  $('#players').innerHTML = P.map((p, i) => `<div class="pl ${i === cur ? 'cur' : ''}" id="pl${i + 1}"><img src="${IMG(p.char)}" alt=""><span>P${i + 1} ${p.name}${p.bot ? ' (bot)' : ' (toi)'}</span><b>${p.tokens}</b></div>`).join('');
  force.state = {P, cur, turn, over, CASES};
}

/* ---------- choix du personnage ---------- */
function setup(){
  open(`<h2>Choisis ton personnage</h2><div class="chars">${CHARS.map(c => `<button data-c="${c}"><img src="${IMG(c)}" alt="${NM(c)}">${NM(c)}</button>`).join('')}</div><button class="btn primary" id="go" disabled>COMMENCER</button><p style="font-size:12px">Toi contre 3 bots · ${MAX_TURNS} tours · départ ${START_TOKENS} tokens</p>`);
  let pick = null;
  document.querySelectorAll('.chars button').forEach(b => b.onclick = () => { document.querySelectorAll('.chars button').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); pick = b.dataset.c; $('#go').disabled = false; });
  $('#go').onclick = () => { const others = shuffle(CHARS.filter(c => c !== pick)).slice(0, 3);
    P = [pick, ...others].map((c, i) => ({char:c, name:NM(c), bot:i > 0, color:COLORS[i], tokens:START_TOKENS, pos:0, skip:0}));
    close(); render(); log('La partie commence !'); nextTurn(); };
}

/* ---------- dé ---------- */
async function rollDie(el, faces, forced){
  el.classList.add('roll'); let v = 1;
  for (let k = 0; k < 12; k++){ v = 1 + Math.floor(Math.random() * faces); el.textContent = v; await sleep(70); }
  if (forced != null) v = forced; el.textContent = v; el.classList.remove('roll'); return v;
}
async function nextTurn(){
  try { await turnBody(); } catch (err){ console.warn('tour récupéré après erreur', err); if (over) return; close(); render(); endTurn(); }
}
async function turnBody(){
  if (over) return; render(); const p = P[cur];
  $('#turnInfo').innerHTML = `Tour ${turn} — <b style="color:${p.color}">${p.name}</b>`;
  if (p.skip > 0){ p.skip--; log(`${p.name} passe son tour.`); await sleep(600); return endTurn(); }
  $('#btnRoll').disabled = p.bot; await click('#btnRoll', 500); $('#btnRoll').disabled = true;
  const fd = !p.bot && force.force.die && force.force.die.length ? force.force.die.shift() : null;
  const n = await rollDie($('#dieBig'), 6, fd); log(`${p.name} lance le dé : <b>${n}</b>`);
  await move(p, n); await resolve(p);
  if (p.extra && !over){ p.extra = 0; log(`${p.name} rejoue !`); return nextTurn(); }
  endTurn();
}
async function move(p, n){
  const dir = n < 0 ? -1 : 1;
  for (let k = 0; k < Math.abs(n); k++){ p.pos = (p.pos + dir + CASES.length) % CASES.length; if (dir > 0 && p.pos === 0) add(p, PASS_START, 'passage au Départ'); render(); await sleep(220); }
}
function endTurn(){
  if (over) return; cur = (cur + 1) % P.length; if (cur === 0) turn++;
  if (turn > MAX_TURNS) return endGame(); nextTurn();
}
function endGame(){
  if (over) return; over = true; render(); $('#btnRoll').disabled = true;
  const score = p => p.tokens + CASES.filter(c => c.owner === P.indexOf(p)).reduce((s, c) => s + c.price, 0);
  const r = P.slice().sort((a, b) => score(b) - score(a));
  open(`<h2>🏆 Fin de partie</h2><ol style="text-align:left">${r.map(p => `<li><b style="color:${p.color}">${p.name}</b> : ${p.tokens} tokens + commerces = <b>${score(p)}</b></li>`).join('')}</ol><p><b>${r[0].name}</b> gagne The Adoles-chiant of Dogzy Town !</p><button class="btn primary" id="again">REJOUER</button><p style="font-size:10px">© 2026 Sania Labbé (Valkyrie)</p>`);
  $('#again').onclick = () => location.reload(); log('Partie terminée.');
}

/* ---------- cases ---------- */
async function resolve(p){
  const c = CASES[p.pos], me = P.indexOf(p);
  if (c.t === 'commerce'){
    if (c.owner == null){
      if (p.tokens < c.price){ log(`${p.name} n'a pas assez de tokens pour ${c.nm}.`); return; }
      open(`<h2>🏪 ${c.nm}</h2><p>Prix : <b>${c.price}</b> tokens · revenu à chaque visite : <b>${c.rent}</b> tokens</p><button class="btn primary" id="buy">ACHETER</button><button class="btn" id="pass">PASSER</button>`);
      const b = await new Promise(r => { $('#buy').onclick = () => r('buy'); $('#pass').onclick = () => r('pass'); if (p.bot) setTimeout(() => $('#buy') && $('#buy').click(), FAST ? 40 : 700); });
      close(); if (b === 'buy'){ c.owner = me; add(p, -c.price, `achat ${c.nm}`); }
    } else if (c.owner !== me){ add(p, -c.rent, `loyer ${c.nm}`); add(P[c.owner], c.rent, `revenu ${c.nm}`); }
    else log(`${p.name} est chez lui (${c.nm}).`);
  } else if (c.t === 'chance' || c.t === 'penalite') await cardFlow(p, c.t);
  else if (c.t === 'quiz') await quizFlow(p);
  else if (c.t === 'duel') await duelFlow(p);
}
const PACK = {chance:['g','CHANCE','🍀'], penalite:['r','PÉNALITÉ','⚠️'], quiz:['b','QUIZ','❓']};
function cardHTML(k, front){ const [cl, nm, ic] = PACK[k];
  return `<div class="deckZone ${cl}"><div class="card" id="card"><div class="face back"><span class="lg">${ic}</span>${nm}<small>The Adoles-chiant of Dogzy Town · © Sania Labbé (Valkyrie)</small></div><div class="face front">${front}<span class="cp">© 2026 Sania Labbé (Valkyrie)</span></div></div></div>`; }
async function flip(p){ await new Promise(r => { if (!$('#card')) return; $('#card').onclick = r; $('#flip').onclick = r; if (p.bot) setTimeout(r, FAST ? 40 : 800); }); if (over || !$('#card')) return new Promise(() => {}); $('#card').classList.add('flipped'); $('#flip') && $('#flip').remove(); await sleep(950); }
async function cardFlow(p, k){
  const ch = force.force.card ? D[k].find(x => x.id === force.force.card) : null; delete force.force.card;
  const card = ch || draw(k), who = rnd(CHARS);
  open(`<h2>Paquet ${PACK[k][1]}</h2>${cardHTML(k, `<h3>${card.id} · ${card.titre}</h3><img src="${IMG(who)}" alt="${NM(who)}"><p>${card.texte}</p>`)}<button class="btn primary" id="flip">RETOURNER LA CARTE</button><div id="after"></div>`);
  await flip(p);
  const e = card.effet || {}; let msg = []; const me = P.indexOf(p), others = P.filter(x => x !== p);
  const left = P[(me + 1) % P.length], pay = (from, to, n, why) => { add(from, -n, why); add(to, n, why); };
  let go = null, extra = null;
  if (typeof e.coins === 'number' && !e.pay_player && !e.duration_turns){ add(p, e.coins, card.titre); msg.push(`${e.coins >= 0 ? '+' : ''}${e.coins} tokens`); }
  if (e.pay_player){ pay(p, left, Math.abs(e.coins || 0), card.titre); msg.push(`paie ${Math.abs(e.coins || 0)} tokens à ${left.name}`); }
  if (typeof e.lose_coins === 'number'){ add(p, -Math.abs(e.lose_coins), card.titre); msg.push(`-${Math.abs(e.lose_coins)} tokens`); }
  if (e.all_coins){ others.forEach(x => add(x, e.all_coins, card.titre)); msg.push(`les autres +${e.all_coins}`); }
  if (e.steal || e.steal_richest){ const n = e.steal || e.steal_richest, v = others.slice().sort((x, y) => y.tokens - x.tokens)[0]; pay(v, p, n, card.titre); msg.push(`vole ${n} tokens à ${v.name}`); }
  if (e.steal_each || e.collect_each){ const n = e.steal_each || e.collect_each; others.forEach(x => pay(x, p, n, card.titre)); msg.push(`reçoit ${n} tokens de chaque joueur`); }
  if (e.pay_each){ others.forEach(x => pay(p, x, e.pay_each, card.titre)); msg.push(`paie ${e.pay_each} tokens à chaque joueur`); }
  if (e.give_poorest){ const v = others.slice().sort((x, y) => x.tokens - y.tokens)[0]; pay(p, v, e.give_poorest, card.titre); msg.push(`donne ${e.give_poorest} tokens à ${v.name}`); }
  if (e.pay_percent){ const n = Math.round(p.tokens * e.pay_percent); add(p, -n, card.titre); msg.push(`-${n} tokens`); }
  if (e.lose_half_coins){ const n = Math.min(Math.floor(p.tokens / 2), e.max || 1e9); add(p, -n, card.titre); msg.push(`-${n} tokens`); }
  if (e.pay_per_building){ const n = e.pay_per_building * CASES.filter(c => c.owner === me).length; add(p, -n, card.titre); msg.push(`-${n} tokens (commerces)`); }
  if (e.skip_turn || e.no_move_next){ p.skip = 1; msg.push('passe son prochain tour'); }
  if (e.extra_turn || e.double_roll){ extra = true; msg.push('rejoue tout de suite'); }
  if (e.swap_position || e.swap_with){ const v = e.swap_with ? others.slice().sort((x, y) => x.tokens - y.tokens)[0] : rnd(others); [p.pos, v.pos] = [v.pos, p.pos]; render(); msg.push(`échange sa place avec ${v.name}`); }
  if (e.goto){ const t = {banque:'start', depart:'start', duel:'duel', commerce:'commerce'}[e.goto] || 'start';
    let k = 1; while (k <= CASES.length && CASES[(p.pos + k) % CASES.length].t !== t) k++; go = k % CASES.length; msg.push(`va à la case ${LBL[t] || 'Commerce'}`); }
  if (typeof e.move === 'number'){ msg.push(`déplacement ${e.move}`); }
  if (!msg.length) msg.push('effet affiché (règle complète à venir dans le jeu final)');
  $('#after').innerHTML = `<p><b>${p.name}</b> : ${msg.join(', ')}</p><button class="btn primary" id="ok">CONTINUER</button>`;
  await click('#ok', 600); close();
  const steps = typeof e.move === 'number' ? e.move : go;
  if (steps){ if (e.no_bonus || e.goto === 'depart'){ p.pos = (p.pos + steps) % CASES.length; render(); } else await move(p, steps);
    if (!['chance','penalite','start'].includes(CASES[p.pos].t)) await resolve(p); }
  if (extra && !over){ p.extra = 1; }
}
async function quizFlow(p){
  const q = force.force.quiz ? D.quiz.find(x => x.id === force.force.quiz) : draw('quiz'); delete force.force.quiz;
  open(`<h2>Paquet QUIZ</h2>${cardHTML('quiz', `<h3>${q.id} · Quiz niveau 1</h3><img src="${IMG(rnd(CHARS))}" alt=""><p>Réponds à la question pour gagner ${q.reward} tokens.</p>`)}<button class="btn primary" id="flip">RETOURNER LA CARTE</button><div id="after"></div>`);
  await flip(p);
  if (q.memo){ $('#after').innerHTML = `<div class="qz" style="font-size:40px;letter-spacing:.3em" id="memo">${q.memo.show}</div>`; await sleep(q.memo.seconds * 1000); }
  $('#after').innerHTML = `<div class="qz">${q.q}</div><div class="opts">${q.o.map((o, i) => `<button data-i="${i}">${o}</button>`).join('')}</div><div id="res"></div>`;
  const pick = await new Promise(r => { document.querySelectorAll('.opts button').forEach(b => b.onclick = () => r(+b.dataset.i)); if (p.bot) setTimeout(() => r(Math.random() < .6 ? q.a : (q.a + 1) % q.o.length), FAST ? 40 : 900); });
  const ok = pick === q.a, bs = document.querySelectorAll('.opts button'); bs.forEach(b => b.disabled = true); bs[q.a].classList.add('ok'); if (!ok) bs[pick].classList.add('ko');
  $('#res').innerHTML = `<h3 id="quizRes">${ok ? '✅ Bonne réponse !' : '❌ Mauvaise réponse'}</h3><button class="btn primary" id="ok">CONTINUER</button>`;
  if (ok) add(p, q.reward, 'Quiz réussi'); else log(`${p.name} rate le quiz.`);
  await click('#ok', 600); close();
}

/* ---------- Duel : dé 1-4 + carrousel ---------- */
async function duelFlow(p){
  const me = P.indexOf(p);
  open(`<h2>⚔️ DUEL !</h2><p>Mise : <b>${DUEL_STAKE}</b> tokens. Lance le dé pour savoir qui t'affronte.</p><div class="die" id="dDie">?</div><div id="dOpp"></div><button class="btn primary" id="dRoll">LANCER LE DÉ</button><div id="dCar"></div>`, true);
  await click('#dRoll', 500); $('#dRoll').remove();
  let o; do { o = await rollDie($('#dDie'), 4, force.force.opp != null && force.force.opp !== me + 1 ? force.force.opp : null) - 1; } while (o === me);
  delete force.force.opp; const q = P[o];
  $('#dOpp').innerHTML = `<p>Adversaire : <b style="color:${q.color}">P${o + 1} ${q.name}</b></p>`; log(`${p.name} affronte ${q.name} en duel.`);
  await sleep(700);
  const items = []; for (let k = 0; k < 6; k++) items.push(...shuffle(GAMES));
  let target = 4 * GAMES.length + Math.floor(Math.random() * GAMES.length);
  if (force.force.duelGame){ for (let k = 4 * GAMES.length; k < items.length; k++) if (items[k].id === force.force.duelGame){ target = k; break; } delete force.force.duelGame; }
  $('#dCar').innerHTML = `<div class="carWrap" id="carWrap"><div class="strip" id="strip">${items.map(g => `<div class="it ${g.cls || ''}"><div class="th" ${g.img ? `style="background-image:url('${g.img}')"` : ''}>${g.img ? '' : g.th}</div>${g.nm}</div>`).join('')}</div></div>`;
  const W = 142, cw = $('#carWrap').clientWidth, x = target * W + 71 - cw / 2 + 6, st = $('#strip');
  st.style.transition = `transform ${FAST ? 0.4 : 4.5}s cubic-bezier(.12,.75,.15,1)`; await sleep(30); st.style.transform = `translateX(${-x}px)`;
  await new Promise(r => setTimeout(r, FAST ? 450 : 4600));
  st.children[target].classList.add('hl'); const g = items[target]; window.DEMO.lastGame = g.id; log(`Carrousel : <b>${g.nm}</b>`);
  await sleep(900);
  let won;
  if (g.id === 'win' || g.id === 'lose') won = g.id === 'win';
  else if (p.bot && q.bot) { won = Math.random() < .5; log('(duel entre bots simulé)'); }
  else won = await playGame(g, p.bot ? o : me, p.bot ? me : o) === (p.bot ? false : true) ;
  const W1 = won ? p : q, L1 = won ? q : p;
  add(L1, -DUEL_STAKE, 'duel perdu'); add(W1, DUEL_STAKE, 'duel gagné');
  open(`<h2>⚔️ Résultat du duel</h2><p id="duelRes"><b>${W1.name}</b> gagne contre ${L1.name} (${g.nm}) : +${DUEL_STAKE} / -${DUEL_STAKE} tokens</p><button class="btn primary" id="ok">RETOUR AU PLATEAU</button>`);
  await click('#ok', 600); close();
}
/* human = index du joueur humain (toujours P1), retourne true si l'humain gagne */
function playGame(g, human, opp){
  return new Promise(res => {
    open(`<h2>⚔️ ${g.nm}</h2><iframe class="game" id="gframe" src="../minijeux/${g.id}.html?duel=1&j=${human + 1}&vs=${opp + 1}"></iframe><div><span id="gStat">Partie en cours…</span> <button class="btn" id="gQuit">ABANDONNER</button> <button class="btn primary" id="gBack" disabled>RETOUR AU PLATEAU</button></div>`, true);
    let result = null;
    const iv = setInterval(() => { try { const r = $('#gframe') && $('#gframe').contentWindow.MJ_RESULT; if (r && !result){ result = r; $('#gStat').textContent = r.won ? 'Tu as gagné !' : (r.tie ? 'Égalité (compte comme perdu)' : 'Tu as perdu.'); $('#gBack').disabled = false; } } catch (e) {} }, 400);
    $('#gQuit').onclick = () => { clearInterval(iv); res(false); };
    $('#gBack').onclick = () => { clearInterval(iv); res(!!(result && result.won)); };
  });
}
$('#btnEnd').onclick = () => { if (P.length) endGame(); };
setup();
})();
