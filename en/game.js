/* Dogzy Family Universe — board game v3 (EN) : 2 wheels, 4 levels, businesses, expert bots, local multiplayer.
   English copy of ../game.js (served from /en/, assets shared through <base href="../">). */
(function(){
'use strict';
const D = window.DZ_DATA, CH = window.DZ_CHARS, FR = window.DZ_FR;
const bn = b => FR.bld[b.name] || b.name, jf = j => FR.job[j] || j;
const WP = D.board.waypoints;
/* Case Duel : 2 maximum par map (règle du board Level 1) */
const DUEL_SPACES = [13, 37]; DUEL_SPACES.forEach(i => { if (WP[i] && WP[i].type === 'empty') WP[i].type = 'duel'; });
const SAVE_KEY = 'dogzy-family-universe-v3-en', PREF_KEY = 'dogzy-family-universe-prefs';
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const chance = p => Math.random() < p;
const params = new URLSearchParams(location.search);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- static tables ---------- */
const ACCESSORIES = ['Gold chain','Diamond necklace','VIP shades','Golden crown','Graffiti spray can','Lab goggles',
  'Rolex watch','Leather jacket','Pearl bracelet','Golden sneakers','Glowing ring','Dogzy cap','Microphone pendant','Silk bandana'];
const TASKS = ['Serve 3 customers','Restock the shelves','Sweep the floor','Take a phone order','Count the register',
  'Fix the neon sign','Welcome the VIP guest','Deliver a package','Wash the windows','Prepare the daily special'];
const QUIZ = [
  {q:'Paw is to dog as hand is to…', o:['human','glove','cat'], a:0},
  {q:'□ becomes ■. So ○ becomes…', o:['◇','●','○'], a:1},
  {q:'2, 4, 8, 16, …', o:['24','32','20'], a:1},
  {q:'Night is to moon as day is to…', o:['star','sun','cloud'], a:1},
  {q:'▲▼▲▼ … what comes next?', o:['▼','▲','■'], a:1},
  {q:'Chef is to kitchen as pilot is to…', o:['airport','cockpit','sky'], a:1},
  {q:'Which one doesn\u2019t belong? Bank, Hospital, Banana, School', o:['Bank','Banana','School'], a:1},
  {q:'A, C, E, G, …', o:['H','I','J'], a:1},
];
const W1 = ['1','2','3','4','5','6','7','8'];
const W2 = [
  {label:'VISIT 1', k:'visit', v:1}, {label:'STEAL 50', k:'steal', v:50}, {label:'x2', k:'mult', v:2}, {label:'VISIT 2', k:'visit', v:2},
  {label:'CHANCE', k:'chance'}, {label:'STEAL 100', k:'steal', v:100}, {label:'x3', k:'mult', v:3}, {label:'VISIT 3', k:'visit', v:3},
  {label:'CAREER', k:'career'}, {label:'STEAL 150', k:'steal', v:150}];
/* 4 progression levels */
const RANKS = [
  {t:'Junior Cook', need:'Start', bonus:'—'},
  {t:'Head Chef', need:'1 business', bonus:'+10% rent, +50 at START'},
  {t:'Manager', need:'3 businesses', bonus:'+20% rent, +100 at START'},
  {t:'Owner / Mayor', need:'5 businesses, or City Hall + 3 businesses', bonus:'+30% rent, +150 at START, 25 tax on every visit'}];
function rankTarget(p){ const n = owned(p).length, w = Infinity;
  if (n >= 5 || (n >= 3 && owned(p).some(([f]) => (D.buildings.find(b => b.file === f) || {}).name === 'City Hall'))) return 3;
  if (n >= 3 && w >= 2200) return 2; if (n >= 1 && w >= 1400) return 1; return 0; }
function checkRank(p){ const t = rankTarget(p); if (t > (p.rank || 0)) { p.rank = t; say(p, `${p.bot ? p.name + ' becomes' : 'You become'} ${RANKS[t].t}!`, true); hud(); } }
function rankUp(p){ if ((p.rank || 0) < 3) { p.rank = (p.rank || 0) + 1; say(p, `Level ${p.rank + 1}: ${RANKS[p.rank].t}!`, true); hud(); return true; } return false; }
const SPECIAL = new Set(['building','search','quiz','coin','penalty']);
const COLORS = ['#f2c230','#ff5a3c','#ff4fc3','#9d6bff','#3fd0c9'];
const PRICE = {'City Hall':400,'Bank':350,'Hotel':350,'Courthouse':300,'Hospital':300,'Law Office':300,'Engineering Firm':300,'Car Dealership':300,
  'Police Station':250,'Fire Station':250,'School':250,'Supermarket':250,'Restaurant':250,'Sushi Restaurant':250,'Construction Company':250};
const BLD_JOBS = {'Restaurant':['Cook','Server'],'Pizzeria':['Cook','Server'],'Sushi Restaurant':['Cook','Server'],'Bakery':['Cook'],
  'Coffee Shop':['Server','Barmaid'],'Hotel':['Barmaid','Server','Gentleman','Entertainer'],'Pet Store':['Cashier'],'Flower Shop':['Cashier'],'Beauty Salon':['Gentleman'],
  'Car Dealership':['Gentleman'],'Gas Station':['Cashier'],'Engineering Firm':['Construction Worker'],'Plumbing Company':['Construction Worker'],'Electrician Company':['Construction Worker'],
  'Car Repair Garage':['Construction Worker'],'Post Office':['Cashier'],'Library':['Tennis Coach'],'Fire Station':['Security Guard'],'City Hall':['Lawyer','Banker'],'Hospital':['Doctor'],'Bank':['Banker'],
  'Courthouse':['Lawyer'],'Law Office':['Lawyer'],'Police Station':['Security Guard'],'Construction Company':['Construction Worker'],
  'Hardware Store':['Construction Worker'],'Supermarket':['Cashier'],'School':['Tennis Coach'],'Clothing Store':['Gentleman']};
const price = b => PRICE[b.name] || 200;
const jobsOf = b => BLD_JOBS[b.name] || [];
const DIFF = {
  easy:  {buy:.45, upgrade:.3,  shield:.15, smart:.3, ho:.35, quiz:.45, reserve:300},
  normal:{buy:.7,  upgrade:.55, shield:.4,  smart:.7, ho:.55, quiz:.62, reserve:200},
  hard:  {buy:.95, upgrade:.85, shield:.75, smart:1,  ho:.78, quiz:.82, reserve:120, expert:true},
  expert:{buy:1,   upgrade:1,   shield:.95, smart:1,  ho:.9,  quiz:.92, reserve:100, expert:true}};
const DIFF_FR = {easy:'EASY', normal:'NORMAL', hard:'HARD', expert:'EXPERT'};
const PERSONA = {
  aggressive:{label:'Aggressive · attacks the leader, buys a lot', buy:+.25, upgrade:-.1, shield:-.15, reserveX:.4, target:'leader'},
  risky:     {label:'Unpredictable · risky bets', buy:0, upgrade:0, shield:-.05, reserveX:.6, target:'random', wild:true},
  strategist:{label:'Strategist · saves, upgrades, protects itself', buy:-.1, upgrade:+.3, shield:+.35, reserveX:1.5, target:'smart'},
  balanced:  {label:'Balanced · plays steadily', buy:0, upgrade:0, shield:0, reserveX:1, target:'smart'}};
/* In-game money = "coins" (gold coin icon). "Dogzy" (Dogzy tokens) is reserved for the premium token (simulated, no real crypto). */
const COIN_NAME = 'coins', DOGZY_NAME = 'Dogzy';
const START_TOKENS = 1200, START_BONUS = 300, START_GOLD_BONUS = 600, GOLD_FOR_BONUS = 3;
/* ---------- Dogzy tokens (simulated premium currency, no real crypto) ---------- */
const DOGZY_RATE_BASE = 100, DOGZY_RATE_STEP = 2, DOGZY_RATE_EVERY = 5, DOGZY_RATE_MAX = 200; // 100 coins = 1 Dogzy, +2 every 5 Dogzy issued
const dogzyRate = () => Math.min(DOGZY_RATE_MAX, DOGZY_RATE_BASE + DOGZY_RATE_STEP * Math.floor(((S && S.minted) || 0) / DOGZY_RATE_EVERY));
function buyDogzy(p, n){ let cost = 0; for (let k = 0; k < n; k++) { const r = dogzyRate(); if (p.tokens - cost < r) break; cost += r; S.minted = (S.minted || 0) + 1; p.dogzy = (p.dogzy || 0) + 1; }
  p.tokens -= cost; hud(); return cost; }
const dogzyCostFor = n => { let c = 0, m = (S.minted || 0); for (let k = 0; k < n; k++, m++) c += Math.min(DOGZY_RATE_MAX, DOGZY_RATE_BASE + DOGZY_RATE_STEP * Math.floor(m / DOGZY_RATE_EVERY)); return c; };
/* Accessory shop: prices in Dogzy tokens ONLY */
const SHOP = [
  {id:'shield', name:'Royal Shield', d:5, desc:'Blocks the next steal against you (single use).', kind:'use'},
  {id:'spin', name:'Running Sneakers', d:5, desc:'Bonus turn: you spin the big wheel a second time on your next turn.', kind:'use'},
  {id:'collar', name:'Diamond Collar', d:5, desc:'+75 coins every time you pass START (permanent).', kind:'perm'},
  {id:'gloves', name:'Pickpocket Gloves', d:5, desc:'+50 coins on each of your steals (permanent).', kind:'perm'},
  {id:'vip', name:'VIP Shades', d:5, desc:'+20% on the rent you collect (permanent).', kind:'perm'},
  {id:'helmet', name:'Hard Hat', d:5, desc:'−25% on the rent you pay (permanent).', kind:'perm'},
  {id:'g_rolex', name:'Gold Rolex Watch', d:20, gold:true},
  {id:'g_crown', name:'Golden Crown', d:20, gold:true},
  {id:'g_chain', name:'Solid Gold Chain', d:20, gold:true},
  {id:'g_sneak', name:'Gold Sneakers', d:20, gold:true},
  {id:'g_pearl', name:'Gold Pearl Necklace', d:20, gold:true}];
const GOLD_DESC = 'GOLD ACCESSORY · cancels one payment (rent, tax, steal, Chance penalty), then it is used up. With 3 or more gold accessories, START pays 600 coins instead of 300.';
const golds = p => (p.gold || []).length;
const hasPerk = (p, id) => !!(p.perks && p.perks[id]);
/* ---------- Gold character NFTs (cosmetic, simulated, no blockchain) ---------- */
const NFT_KEY = 'dogzy-family-universe-nft', NFT_PRICE = 50, VIP_PRICE = 1000;
const NFT_LABEL = 'NFT — coming to Avalanche';
// NFT VIP cards: the 4 teens (The Adoles-chiant of Dogzy Town universe), collectible only, not playable here.
// img: portrait path (assets/vip/<id>.jpg when the art is supplied); otherwise a placeholder gold card.
const VIP_NFT = [
  {id:'vip-pyromaniac', name:'The Pyromaniac', img:'assets/portraits/pyromaniac.jpg'}, {id:'vip-jouzy', name:'Jouzy', img:'assets/portraits/jouzy.jpg'},
  {id:'vip-waltzy', name:'Waltzy', img:'assets/portraits/waltzy.jpg'}, {id:'vip-kelzy', name:'Kelzy', img:'assets/portraits/kelzy.jpg'}];
const vipImg = v => v.img || 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#8a6a12"/></linearGradient></defs><rect width="300" height="300" fill="#0b0905"/><rect x="8" y="8" width="284" height="284" rx="20" fill="none" stroke="url(#g)" stroke-width="6"/><g fill="url(#g)" transform="translate(150 120) scale(2.6) translate(-32 -30)"><ellipse cx="32" cy="40" rx="11" ry="9"/><ellipse cx="19" cy="27" rx="5" ry="6.5"/><ellipse cx="27" cy="19" rx="5" ry="6.5"/><ellipse cx="37" cy="19" rx="5" ry="6.5"/><ellipse cx="45" cy="27" rx="5" ry="6.5"/></g><text x="150" y="250" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="34" fill="url(#g)">${v.name.toUpperCase()}</text></svg>`);
function vipCard(v, canBuy){
  const own = nftOwned(v.id);
  return `<div class="nftCard vip${own ? ' own' : ''}"><div class="nftImg"><img class="zoomable" src="${vipImg(v)}" alt="${esc(v.name)}" data-cap="${esc(v.name)} · NFT VIP"><span class="vipBadge">NFT VIP</span></div>
    <b>${esc(v.name)}</b>${own ? '<span class="nftOwn">✓</span>' : `<button class="btn buyNft" data-v="${v.id}" ${canBuy ? '' : 'disabled'}><i class="ico dz"></i> ${VIP_PRICE}</button>`}</div>`;
}
const NFT_PERKS = ['15% off this same character in The Adoles-chiant of Dogzy Town, at its launch.'];
const nftColl = () => { try { return JSON.parse(localStorage.getItem(NFT_KEY)) || {owned:[]}; } catch(e) { return {owned:[]}; } };
const nftOwned = id => nftColl().owned.includes(id);
function nftAdd(id){ const c = nftColl(); if (!c.owned.includes(id)) c.owned.push(id); localStorage.setItem(NFT_KEY, JSON.stringify(c)); }
const isGold = p => !!(p && p.goldSkin && nftOwned(p.char));
// player portrait <img> (gold version if equipped)
const pimg = (p, cls) => `src="${charById(p.char).portrait}" class="${(cls || '') + (isGold(p) ? ' gsk' : '')}"`;
const charById = id => CH.all.find(c => c.id === id);
// The teens belong to The Adoles-chiant of Dogzy Town: this game only uses the adult characters (players AND bots)
const PLAYABLE = CH.basic;
const BOT_POOL = ['bankzy','lawzy','securzy','magiczy','gentlezy','doczy','buildzy','cashzy','sportzy','chefzy','waitzy','barzy'];
const BOT_PERSONA = ['aggressive','risky','strategist','balanced'];

/* ---------- state ---------- */
let S = load();
const prefs = (() => { try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {speed:1}; } catch(e) { return {speed:1}; } })();
function load(){ try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.players) return s; } catch(e) {} return null; }
function save(){ try { if (S) localStorage.setItem(SAVE_KEY, JSON.stringify(S)); localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch(e) {} }
const me = () => S.players[S.view || 0] || S.players[0];
const humans = () => S.players.filter(p => !p.bot).length;
const youName = p => p === me() && humans() < 2 ? 'You' : p.name;
const idxOf = p => S.players.indexOf(p);
const NEW_PLAYER = (c, i, bot, persona) => ({name:c.name, char:c.id, color:COLORS[i], bot, persona:persona || null, tokens:START_TOKENS, pos:0, shield:false,
  acc:[], career:{lvl:1, items:[]}, skip:false, mult:1, extra:false, rank:0, dogzy:0, gold:[], perks:{}, spins:0, out:false});
function newGame(cfg){
  const seats = (cfg.mode === 'local' ? (cfg.chars || []).slice(0, cfg.humans || 2) : [cfg.charId]).map(id => charById(id) || CH.basic[0]);
  const order = BOT_POOL.filter(id => !seats.some(c => c.id === id)).slice(0, cfg.bots);
  const players = seats.map((c, k) => NEW_PLAYER(c, k, false));
  players.forEach(p => { p.goldSkin = nftOwned(p.char); }); // gold avatar equipped if owned
  order.forEach((id, k) => { const c = charById(id); players.push(NEW_PLAYER(c, players.length, true, BOT_PERSONA[k % 4])); });
  S = {v:4, minted:0, outOrder:[], cfg, players, owners:{}, round:1, cur:0, view:0, over:false, levelKeys:0, stats:{rent:0}};
  save(); renderPawns(); hud(); layout(); log(`Round 1 · ${youName(me()) === 'You' ? 'your' : me().name + '\u2019s'} turn. Tap SPIN.`);
}

/* debug hooks (used by tests): DZ.force = {w1, w2, chance, career, building, ho, quiz} */
const force = {};
window.DZ = {state:()=>S, force, data:D, chars:CH, newGame:cfg => { newGame(cfg); }, space:i => { const p = S.players[S.cur]; p.pos = i; placePawn(S.cur, true); return resolveSpace(p); },
  reset:()=>{ localStorage.removeItem(SAVE_KEY); location.reload(); }, prefs};

/* ---------- careers ---------- */
function careerOf(p){ const c = charById(p.char); return c && c.career ? CH.careers[c.career] : null; }
function profOf(p){ const c = charById(p.char); return c ? c.prof || null : null; }
function careerMax(p){ const c = charById(p.char); if (!c) return false; if (c.career) return p.career.lvl >= 5; if (c.cardItems) return p.career.lvl >= 2; return false; }
function careerTitle(p){
  const c = charById(p.char), car = careerOf(p);
  if (car) { const L = car.levels[p.career.lvl - 1]; return `${car.title} · lvl ${p.career.lvl}: ${L.name}`; }
  if (c && c.cardItems) return p.career.lvl >= 2 ? c.boss : `Junior ${jf(c.job)}`;
  return 'Job to be defined';
}
function giveAccessory(p){
  const c = charById(p.char), car = careerOf(p);
  let item = null, promo = null;
  if (car && !(p.career.lvl === 5 && p.career.items.length >= 5)) {
    const L = car.levels[p.career.lvl - 1]; item = L.items.find(x => !p.career.items.includes(x));
    p.career.items.push(item);
    if (p.career.items.length >= 5 && p.career.lvl < 5) { p.career.lvl++; p.career.items = []; promo = car.levels[p.career.lvl - 1].name; }
  } else if (c && c.cardItems && p.career.lvl < 2) {
    item = c.cardItems.find(x => !p.career.items.includes(x)); p.career.items.push(item);
    if (p.career.items.length >= 5) { p.career.lvl = 2; p.career.items = []; promo = c.boss; }
  }
  if (!item) { const free = ACCESSORIES.filter(x => !p.acc.includes(x)); item = pick(free.length ? free : ACCESSORIES); }
  p.acc.push(item);
  if (promo) say(p, `${p.bot ? p.name + ' is promoted' : 'Promotion'}: ${promo}!`, true);
  hud(); return item;
}
function promote(p){
  const c = charById(p.char), car = careerOf(p);
  if (car && p.career.lvl < 5) { p.career.lvl++; p.career.items = []; return car.levels[p.career.lvl - 1].name; }
  if (c && c.cardItems && p.career.lvl < 2) { p.career.lvl = 2; p.career.items = []; return c.boss; }
  return null;
}
function loseCareerItem(p){
  if (!p.career.items.length) return null;
  const it = p.career.items.pop(); const k = p.acc.lastIndexOf(it); if (k >= 0) p.acc.splice(k, 1); return it;
}

/* ---------- businesses ---------- */
const owned = p => Object.entries(S.owners).filter(([, o]) => o.p === idxOf(p));
function profMatch(p, b){ const pr = profOf(p); return !!pr && jobsOf(b).includes(pr); }
function rentOf(b, o){
  const base = baseRent(b), owner = S.players[o.p];
  let r = base * RENT_LVL[o.lvl] * (1 + INFLATION * (S.round - 1));
  if (profMatch(owner, b)) r = Math.round(r * (careerMax(owner) ? 2 : 1.5));
  return Math.round(r * (1 + 0.1 * (owner.rank || 0)) * (hasPerk(owner, 'vip') ? 1.2 : 1));
}
const baseRent = b => Math.round(price(b) * RENT_PCT / 5) * 5;
const RENT_PCT = 0.25, RENT_LVL = [1, 2.5, 4, 6, 8, 11], INFLATION = 0.15; // rent x(1 + 15% per round): pressure builds until bankruptcy
function upgradeCost(p, b){ return Math.round(price(b) / 2 * (profMatch(p, b) ? 0.75 : 1)); }
function drawBuilding(){
  if (force.building) { const b = D.buildings.find(x => x.file === force.building || x.name === force.building); delete force.building; if (b) return b; }
  const w = D.buildings.map(b => S.owners[b.file] ? 6 : 1), tot = w.reduce((a, b) => a + b, 0);
  let r = Math.random() * tot; for (let i = 0; i < w.length; i++) { r -= w[i]; if (r < 0) return D.buildings[i]; }
  return D.buildings[0];
}
function netWorth(p){ return p.tokens + owned(p).reduce((s, [f, o]) => { const b = D.buildings.find(x => x.file === f); return s + price(b) + o.lvl * price(b) / 2; }, 0); }

/* ---------- HUD + leaderboard ---------- */
function hud(){
  if (!S) return;
  const p = me();
  $('#hTokens').textContent = p.tokens;
  $('#hDogzy').textContent = p.dogzy || 0;
  $('#hGold').textContent = golds(p);
  $('#hAcc').textContent = p.acc.length;
  $('#hShield').textContent = p.shield ? 'YES' : 'NO';
  $('#hShield').style.color = p.shield ? '#9ff58a' : '';
  $('#hLevel').textContent = (p.rank || 0) + 1;
  $('#hMult').textContent = (humans() > 1 ? p.name + ' · ' : '') + (p.mult > 1 ? `Next reward x${p.mult}` : RANKS[p.rank || 0].t);
  $('#hGoal').textContent = `Last one standing wins · ${S.players.filter(q => !q.out).length} left`;
  $('#hTurn').textContent = `Round ${S.round}`;
  const rank = ranking();
  $('#leader').innerHTML = S.players.map((q, i) => {
    const c = charById(q.char), pos = rank.indexOf(q) + 1;
    return `<div class="lb${i === S.cur && !S.over ? ' cur' : ''}${q.out ? ' out' : ''}" style="--pc:${q.color}" data-i="${i}"><b class="rk">${pos}</b><img ${pimg(q)} alt=""><span class="nm">${esc(youName(q))}</span><span class="tk">${q.out ? 'BANKRUPT' : q.tokens}</span>${golds(q) ? `<span class="gd" title="Gold accessories">✦${golds(q)}</span>` : ''}${q.shield ? '<i class="ico shield" title="Shield"></i>' : ''}<span class="bz" title="Businesses · level">🏢${owned(q).length} ★${(q.rank || 0) + 1}</span></div>`;
  }).join('');
  save();
}
function ranking(){ const oo = S.outOrder || []; return [...S.players].sort((a, b) => (a.out - b.out) || (a.out ? oo.indexOf(idxOf(b)) - oo.indexOf(idxOf(a)) : netWorth(b) - netWorth(a))); }
function log(t){ $('#log').textContent = t; }
let toastT;
function toast(t, p){
  const el = $('#toast'); el.innerHTML = (p ? `<img ${pimg(p)} alt="">` : '') + `<span>${esc(t)}</span>`;
  el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), p && p.bot ? Math.max(900, 1700 / speedF()) : 1900);
}
function say(p, t, important){
  if (p.bot) { $('#bpMsg').textContent = t; log(`${p.name}: ${t}`); if (important || prefs.speed !== 'skip') toast(t, p); }
  else toast(t);
}
function addTokens(p, n, why){
  if (n < 0) { charge(p, -n, why, null, 'penalty'); return; }
  p.tokens = p.tokens + n; hud();
  say(p, `${n >= 0 ? '+' : ''}${n} coins${why ? ' · ' + why : ''}`);
}
function reward(p, base, mult, why){ const m = (mult || 1) * p.mult; p.mult = 1; addTokens(p, base * m, why + (m > 1 ? ` (x${m})` : '')); return base * m; }

/* ---------- debts, bank sales, bankruptcy ---------- */
const sellValue = (b, o) => Math.round((price(b) + o.lvl * price(b) / 2) * 0.5);
function useGold(p, amount, why){
  if (!golds(p) || amount < 50) return false;
  const g = p.gold.pop(); hud();
  say(p, `✦ ${g} cancels the ${amount}-coin payment (${why || 'payment'})`, true);
  S.goldLog = (S.goldLog || 0) + 1; return true;
}
// pays `amount`: gold accessory first, else sell businesses at 50%, else bankruptcy
function charge(p, amount, why, creditor, kind){
  amount = Math.round(amount); if (amount <= 0 || p.out) return 0;
  if (useGold(p, amount, why)) return 0;
  if (p.tokens < amount) liquidate(p, amount);
  const paid = Math.min(amount, p.tokens);
  p.tokens -= paid; if (creditor) creditor.tokens += paid;
  if (paid < amount) bankrupt(p, creditor); else say(p, `−${paid} coins${why ? ' · ' + why : ''}`);
  hud(); return paid;
}
function liquidate(p, need){
  const mine = owned(p).map(([f, o]) => ({f, o, b:D.buildings.find(x => x.file === f)})).sort((x, y) => sellValue(x.b, x.o) - sellValue(y.b, y.o));
  const sold = [];
  for (const it of mine) { if (p.tokens >= need) break; const v = sellValue(it.b, it.o); p.tokens += v; delete S.owners[it.f]; sold.push(`${bn(it.b)} (+${v})`); }
  if (sold.length) { say(p, `sells to the bank: ${sold.join(', ')}`, true); (S.notices = S.notices || []).push({p:idxOf(p), t:'BANK SALE', m:`${p.name} had to sell back to the bank at 50%: ${sold.join(', ')}.`}); }
}
function bankrupt(p, creditor){
  p.out = true; p.tokens = 0; p.shield = false; p.gold = [];
  owned(p).forEach(([f]) => delete S.owners[f]);
  (S.outOrder = S.outOrder || []).push(idxOf(p));
  say(p, `BANKRUPT! ${p.name} is eliminated${creditor ? ' (creditor: ' + creditor.name + ')' : ''}. Their businesses go back to the bank.`, true);
  (S.notices = S.notices || []).push({p:idxOf(p), t:'BANKRUPT', m:`${p.name} can no longer pay and is eliminated. Their businesses go back to the bank.`, bk:true});
  hud();
}
async function showNotices(){
  const n = S.notices || []; S.notices = [];
  const hum = n.filter(x => !S.players[x.p].bot || x.bk);
  for (const x of hum) { const q = S.players[x.p];
    if (prefs.speed === 'skip' && q.bot && humans() && S.players.some(z => !z.bot && !z.out)) { toast(x.m, q); continue; }
    if (!S.players.some(z => !z.bot && !z.out) && q.bot) continue;
    await info(x.bk ? '💀 BANKRUPT' : '🏦 BANK SALE', `<img ${pimg(q, "passImg")} alt=""><p>${esc(x.m)}</p>`); }
}

/* ---------- bot speed ---------- */
const speedF = () => prefs.speed === 'skip' || skipNow ? 50 : prefs.speed;
let skipNow = false;
const pause = (p, ms) => p.bot ? (speedF() >= 50 ? Promise.resolve() : sleep(ms / speedF())) : sleep(ms);
function speedLabel(){ $('#btnSpeed').textContent = prefs.speed === 'skip' ? 'SKIP' : prefs.speed + 'x'; }
$('#btnSpeed').onclick = () => { prefs.speed = prefs.speed === 1 ? 3 : prefs.speed === 3 ? 'skip' : 1; speedLabel(); save(); toast('Bot speed: ' + $('#btnSpeed').textContent); };
$('#bpSkip').onclick = () => { skipNow = true; };

/* ---------- board layout + pawns ---------- */
const board = $('#board'), wrap = $('#boardWrap'), pawnsEl = $('#pawns');
const PAW = col => `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="${col}" stroke="#fff3c4" stroke-width="3"/><circle cx="24" cy="20" r="14" fill="rgba(255,255,255,.35)"/><g fill="#140e02"><ellipse cx="32" cy="40" rx="11" ry="9"/><ellipse cx="19" cy="27" rx="5" ry="6.5"/><ellipse cx="27" cy="19" rx="5" ry="6.5"/><ellipse cx="37" cy="19" rx="5" ry="6.5"/><ellipse cx="45" cy="27" rx="5" ry="6.5"/></g></svg>`;
function renderPawns(){
  if (!S) return;
  pawnsEl.innerHTML = S.players.map((p, i) => `<div class="pawn${isGold(p) ? ' goldPawn' : ''}" id="pawn${i}" style="--pc:${p.color}">${PAW(p.color)}<span class="plabel"><img ${pimg(p)} alt="">${esc(youName(p).replace('The ', ''))}</span></div>`).join('');
  S.players.forEach((p, i) => placePawn(i, true));
}
function layout(){
  const W = wrap.clientWidth, H = wrap.clientHeight;
  let scale = Math.min(W / D.board.w, H / D.board.h);
  if (W < H) scale = H / D.board.h * 0.98;
  board.style.width = Math.round(D.board.w * scale) + 'px';
  board.style.height = Math.round(D.board.h * scale) + 'px';
  board.style.marginTop = Math.max(0, (H - D.board.h * scale) / 2) + 'px';
  if (S) { S.players.forEach((p, i) => placePawn(i, true)); follow(S.players[S.cur].pos, true); }
}
function placePawn(i, instant){
  const p = S.players[i], el = document.getElementById('pawn' + i); if (!el) return;
  const same = S.players.map((q, k) => k).filter(k => S.players[k].pos === p.pos), k = same.indexOf(i), n = same.length;
  const off = n > 1 ? (k - (n - 1) / 2) * 1.9 : 0;
  const w = WP[p.pos];
  el.style.transition = instant ? 'none' : '';
  el.style.left = (w.x / D.board.w * 100 + off) + '%';
  el.style.top = (w.y / D.board.h * 100 - (n > 1 ? Math.abs(off) * 0.4 : 0)) + '%';
  el.style.zIndex = 5 + (i === S.cur ? 10 : 0);
  if (instant) { void el.offsetWidth; el.style.transition = ''; }
}
function follow(pos, instant){
  const bw = board.clientWidth, target = WP[pos].x / D.board.w * bw - wrap.clientWidth / 2;
  wrap.style.scrollBehavior = instant ? 'auto' : 'smooth'; wrap.scrollLeft = target;
}
WP.forEach(w => { if (w.type === 'duel') { const d = document.createElement('div'); d.className = 'duelMark'; d.textContent = '⚔️'; d.style.left = w.x / D.board.w * 100 + '%'; d.style.top = w.y / D.board.h * 100 + '%'; $('#wpLayer').appendChild(d); } });
if (params.has('debug')) {
  const L = $('#wpLayer'); L.classList.add('debug');
  WP.forEach((p, i) => { const d = document.createElement('div'); d.className = 'wp'; d.style.left = p.x / D.board.w * 100 + '%'; d.style.top = p.y / D.board.h * 100 + '%'; d.innerHTML = `<span>${i}${p.type[0]}</span>`; L.appendChild(d); });
}
async function moveSteps(p, n){
  const i = idxOf(p), dir = n < 0 ? -1 : 1, el = document.getElementById('pawn' + i);
  for (let s = 0; s < Math.abs(n); s++) {
    const from = p.pos; p.pos = (p.pos + dir + WP.length) % WP.length;
    if (el) { el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); }
    S.players.forEach((q, k) => { if (k === i || q.pos === from || q.pos === p.pos) placePawn(k); });
    follow(p.pos);
    if (dir > 0 && p.pos === 0 && s < Math.abs(n) - 1) addTokens(p, startBonus(p), 'Passed START');
    await pause(p, p.bot ? 150 : 200);
  }
  if (dir > 0 && p.pos === 0) addTokens(p, startBonus(p), 'Landed on START');
  hud();
}
function startBonus(p){ return (golds(p) >= GOLD_FOR_BONUS ? START_GOLD_BONUS : START_BONUS) + 50 * (p.rank || 0) + (hasPerk(p, 'collar') ? 75 : 0); }
async function moveTo(p, i){ await moveSteps(p, (i - p.pos + WP.length) % WP.length); }
function nextOfType(p, t){ for (let k = 1; k <= WP.length; k++) { const j = (p.pos + k) % WP.length; if (WP[j].type === t) return j; } return p.pos; }

/* ---------- modal helpers ---------- */
const modal = $('#modal'), sheet = $('#sheet');
function open(html, wide){ sheet.className = 'sheet' + (wide ? ' wide' : ''); sheet.innerHTML = html; modal.classList.remove('hidden'); sheet.scrollTop = 0; }
function close(){ modal.classList.add('hidden'); sheet.innerHTML = ''; }
function waitClick(sel){ return new Promise(r => sheet.querySelector(sel).addEventListener('click', r, {once:true})); }
function choose(sel){ return new Promise(r => sheet.querySelectorAll(sel).forEach(b => b.addEventListener('click', () => r(b.dataset.v), {once:true}))); }
async function info(title, body, btn){ open(`<h2>${title}</h2>${body}<button class="btn primary" id="ok">${btn || 'CONTINUE'}</button>`); await waitClick('#ok'); close(); }
// show a message: modal for the human, toast for a bot
async function tell(p, title, body, short){ if (p.bot) { say(p, short || title); await pause(p, 900); } else await info(title, body); }

/* ---------- wheels ---------- */
function wheelSVG(labels, opts){
  const n = labels.length, a = 360 / n, c = 150, r = 140;
  const pt = (deg, rad) => [c + rad * Math.sin(deg * Math.PI / 180), c - rad * Math.cos(deg * Math.PI / 180)];
  let segs = '', txt = '', studs = '';
  labels.forEach((l, i) => {
    const [x1, y1] = pt(i * a, r), [x2, y2] = pt((i + 1) * a, r);
    const fill = l === 'CAREER' ? '#5a2a8a' : i % 2 ? 'url(#gGold)' : '#0d0a05';
    segs += `<path d="M${c},${c} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Z" fill="${fill}" stroke="#f6dd8a" stroke-width="2"/>`;
    const m = i * a + a / 2, [tx, ty] = pt(m, r * (opts.small ? 0.66 : 0.68));
    txt += `<text x="${tx}" y="${ty}" transform="rotate(${m} ${tx} ${ty})" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,serif" font-weight="bold" font-size="${opts.small ? 12 : 30}" fill="${l === 'CAREER' ? '#f6dd8a' : i % 2 ? '#1a1204' : '#f6dd8a'}">${l}</text>`;
  });
  for (let k = 0; k < 24; k++) { const [x, y] = pt(k * 15, 146); studs += `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff1b8"/>`; }
  const id = 'g' + Math.random().toString(36).slice(2, 7);
  return `<svg class="wheel" viewBox="0 0 300 300"><defs><linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe9a6"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#8a6a12"/></linearGradient></defs>
  <circle cx="150" cy="150" r="149" fill="#d4af37"/>${segs}${txt}${studs}
  <circle cx="150" cy="150" r="34" fill="#0d0a05" stroke="#d4af37" stroke-width="5"/>
  <g fill="#d4af37" transform="translate(150 150) scale(.9) translate(-32 -30)"><ellipse cx="32" cy="40" rx="11" ry="9"/><ellipse cx="19" cy="27" rx="5" ry="6.5"/><ellipse cx="27" cy="19" rx="5" ry="6.5"/><ellipse cx="37" cy="19" rx="5" ry="6.5"/><ellipse cx="45" cy="27" rx="5" ry="6.5"/></g></svg>`;
}
async function spinWheel(title, sub, labels, idx, small){
  open(`<h2>${title}</h2><p>${sub}</p><div class="wheelBox"><div class="pointer"></div>${wheelSVG(labels, {small})}</div><div class="result" id="wres">&nbsp;</div><button class="btn primary" id="go">SPIN</button>`);
  await waitClick('#go');
  const b = sheet.querySelector('#go'); b.disabled = true; b.textContent = 'SPINNING…';
  const a = 360 / labels.length, jitter = (Math.random() - .5) * a * 0.6;
  const w = sheet.querySelector('svg.wheel');
  requestAnimationFrame(() => { w.style.transform = `rotate(${360 * 6 - (idx * a + a / 2) + jitter}deg)`; });
  await sleep(3800);
  sheet.querySelector('#wres').textContent = labels[idx];
  b.disabled = false; b.textContent = 'OK';
  await waitClick('#go'); close();
}
async function botWheel(p, labels, idx, what){
  const box = $('#bpWheel'), a = 360 / labels.length;
  if (speedF() >= 50) { say(p, `${what}: ${labels[idx]}`); return; }
  box.innerHTML = `<div class="pointer sm"></div>${wheelSVG(labels, {small: labels.length > 6})}`;
  const w = box.querySelector('svg'); const dur = 1100 / speedF();
  w.style.transition = `transform ${dur}ms cubic-bezier(.12,.75,.12,1)`;
  $('#bpMsg').textContent = `spins the ${what.toLowerCase()}…`;
  requestAnimationFrame(() => requestAnimationFrame(() => { w.style.transform = `rotate(${360 * 3 - (idx * a + a / 2)}deg)`; }));
  await sleep(dur + 60);
  say(p, `${what}: ${labels[idx]}`);
  await pause(p, 450);
}

/* ---------- turn engine ---------- */
let busy = false;
function wIdx(key, n){ if (force[key] != null) { const v = force[key]; delete force[key]; return v; } return rnd(n); }
async function humanTurn(){
  if (busy || !S || S.over || S.players[S.cur].bot) return;
  busy = true; $('#btnSpin').disabled = true; S.view = S.cur;
  try { await playTurn(me()); checkRank(me()); await showNotices(); await endTurn(); await runBots(); }
  catch (e) { console.error(e); }
  finally { busy = false; $('#btnSpin').disabled = !!(S && S.over); hud(); }
}
async function playTurn(p){
  if (p.skip) { p.skip = false; hud(); await tell(p, 'EMERGENCY ROOM', `<p>You\u2019re still resting at the hospital. You miss this turn.</p>`, 'misses a turn (Emergency Room)'); return; }
  if (p.bot) botPreTurn(p);
  let guard = 0;
  do {
    p.extra = false;
    const i1 = wIdx('w1', W1.length);
    if (p.bot) await botWheel(p, W1, i1, 'Big wheel');
    else await spinWheel('BIG WHEEL', 'Spin to see how many spaces you move.', W1, i1);
    const steps = i1 + 1; if (!p.bot) log(`You move ${steps} space${steps > 1 ? 's' : ''}…`);
    await moveSteps(p, steps);
    await pause(p, p.bot ? 400 : 900);
    await resolveSpace(p);
    if (S.over) return;
    if (!p.extra && p.spins > 0 && !p.out && !S.over) { p.spins--; p.extra = true; say(p, 'Running Sneakers: bonus turn!', true); }
  } while (p.extra && !p.out && ++guard < 4);
}
async function endTurn(){
  if (checkWin()) return;
  do { S.cur++; if (S.cur >= S.players.length) { S.cur = 0; S.round++; } } while (S.players[S.cur].out);
  if (S.round > ROUND_CAP) { finish(true); return; }
  // all humans out: the bots finish the game at high speed
  if (!S.players.some(p => !p.bot && !p.out)) skipNow = true;
  hud(); renderLeaderCur();
}
async function passDevice(){
  if (!S || S.over || humans() < 2) return;
  const p = S.players[S.cur]; if (p.bot || S.view === S.cur) return;
  S.view = S.cur; hud();
  open(`<span class="tag">LOCAL MULTIPLAYER</span><img ${pimg(p, "passImg")} alt=""><h2>${esc(p.name.toUpperCase())}\u2019S TURN</h2><p>Pass the device to <b style="color:${p.color}">${esc(p.name)}</b>.</p><button class="btn primary" id="ok">I\u2019M READY</button>`);
  await waitClick('#ok'); close(); follow(p.pos);
}
function renderLeaderCur(){ S.players.forEach((p, i) => placePawn(i, true)); }
async function runBots(){
  while (S && !S.over && S.players[S.cur].bot) {
    const p = S.players[S.cur];
    showBotPanel(p);
    await playTurn(p); checkRank(p); await showNotices();
    await pause(p, 500);
    await endTurn();
  }
  skipNow = false; hideBotPanel();
  if (S && !S.over) { await passDevice(); follow(me().pos); log(`Round ${S.round} · ${humans() > 1 ? me().name + '\u2019s' : 'your'} turn. Tap SPIN.`); }
}
function showBotPanel(p){ const c = charById(p.char); $('#botPanel').classList.remove('hidden'); document.body.classList.add('botTurn'); $('#botPanel').style.setProperty('--pc', p.color); $('#bpImg').src = c.portrait; $('#bpImg').classList.toggle('gsk', isGold(p)); $('#bpName').textContent = `${p.name}\u2019s turn`; $('#bpMsg').textContent = PERSONA[p.persona].label; $('#bpWheel').innerHTML = ''; hud(); }
function hideBotPanel(){ $('#botPanel').classList.add('hidden'); document.body.classList.remove('botTurn'); }
const ROUND_CAP = 150; // safety: past this, the biggest fortune wins
function checkWin(){
  if (S.players.filter(p => !p.out).length <= 1) { finish(); return true; }
  return false;
}
function finish(capped){
  S.over = true; skipNow = false; hud(); hideBotPanel(); $('#btnSpin').disabled = true;
  const r = ranking(), place = r.indexOf(me()) + 1, multi = humans() > 1, w = r[0];
  open(`<span class="tag">GAME OVER · ROUND ${S.round}</span><img ${pimg(w, "winImg")} alt=""><h2>${multi || w.bot ? `🏆 ${esc(w.name.toUpperCase())} WINS!` : '🏆 YOU WIN!'}</h2>
    <p>${capped ? `${ROUND_CAP}-round limit reached: the biggest fortune wins.` : 'Last player standing: everyone else went bankrupt.'} · ${DIFF_FR[S.cfg.diff] || ''}${!multi && w.bot ? ` · you finish #${place}` : ''}</p>
    <div class="rankList">${r.map((p, k) => `<div class="${!p.bot ? 'me' : ''}${p.out ? ' out' : ''}" style="--pc:${p.color}"><b>${k + 1}</b><img ${pimg(p)} alt=""><span>${esc(p.bot ? p.name : (multi ? p.name : 'You (' + p.name + ')'))}<small>${p.out ? `Bankrupt (#${k + 1})` : `${RANKS[p.rank || 0].t} · ${owned(p).length} businesses · ✦${golds(p)} gold · ${p.dogzy || 0} Dogzy`}</small></span><em>${p.out ? '💀' : p.tokens}</em></div>`).join('')}</div>
    <button class="btn primary" id="again">PLAY AGAIN</button><button class="btn" id="view" style="margin-top:8px;width:100%">VIEW THE BOARD</button>`);
  sheet.querySelector('#again').onclick = () => setupScreen();
  sheet.querySelector('#view').onclick = close;
  log('Game over. BAG > NEW GAME to play again.');
}

/* ---------- bot brain ---------- */
function bp(p){ const d = DIFF[p.diff || S.cfg.diff], m = PERSONA[p.persona];
  return {buy:Math.min(1, d.buy + m.buy), upgrade:Math.min(1, d.upgrade + m.upgrade), shield:Math.max(0, d.shield + m.shield), smart:d.smart, ho:d.ho, quiz:d.quiz, reserve:d.reserve * m.reserveX, target:m.target, wild:m.wild, expert:!!d.expert}; }
function roundsLeft(){ return 15; }
function danger(p){ return Math.max(60, ...S.players.filter(q => q !== p && !q.out).flatMap(q => owned(q).map(([f, o]) => rentOf(D.buildings.find(x => x.file === f), o) * (hasPerk(p, 'helmet') ? .75 : 1)))); }
function botPreTurn(p){
  const b = bp(p);
  const leader = ranking()[0];
  const threatened = S.players.some(q => q !== p && q.persona === 'aggressive') || leader === p;
  botShop(p, b, leader === p || threatened);
}
// bot shop purchases: only converts surplus coins above a survival reserve
function botShop(p, b, exposed){
  const dz = danger(p), keep = dz * 1.2 + b.reserve;
  const want = [];
  if (b.expert && dz >= 80 && golds(p) < 4) want.push('g_rolex');
  if (golds(p) >= 1 && golds(p) < GOLD_FOR_BONUS && b.expert && p.tokens > keep + 1600) want.push('g_crown');
  if (owned(p).length >= 3 && !hasPerk(p, 'vip')) want.push('vip');
  if (S.players.reduce((s, q) => s + (q !== p ? owned(q).length : 0), 0) >= 6 && !hasPerk(p, 'helmet')) want.push('helmet');
  if (!p.shield && exposed && chance(b.shield)) want.push('shield');
  if (S.round < 10 && !hasPerk(p, 'collar')) want.push('collar');
  if (!hasPerk(p, 'gloves') && b.target === 'leader') want.push('gloves');
  if (chance(.15 * b.smart)) want.push('spin');
  for (const id of want) {
    const it = SHOP.find(x => x.id === id); const missing = Math.max(0, it.d - p.dogzy);
    if (p.tokens - dogzyCostFor(missing) < keep) continue;
    if (!chance(b.smart * .9 + .1)) continue;
    if (missing) { const c = buyDogzy(p, missing); say(p, `trades ${c} coins for ${missing} Dogzy`); }
    if (p.dogzy >= it.d) applyShop(p, it);
  }
}
// expert: estimated value of a purchase (rent * expected visits over remaining rounds)
function buyValue(p, b){
  const rent = baseRent(b) * (profMatch(p, b) ? 1.5 : 1) * (1 + .1 * (p.rank || 0));
  const visits = roundsLeft() * (S.players.length - 1) * 0.35;
  const rankBoost = [1, 3, 5].includes(owned(p).length + 1) ? 80 : 0; // reaches a new level
  const mayor = b.name === 'City Hall' ? 150 : 0;
  return rent * visits + 50 * roundsLeft() * .3 + rankBoost + mayor + price(b) * .5; // resale value counted in net worth
}
function botWantsBuy(p, b){
  const bb = bp(p), pr = price(b);
  if (p.tokens < pr) return false;
  if (!bb.expert) return (p.tokens - pr >= bb.reserve || (bb.wild && chance(.4))) && chance(bb.buy + (profMatch(p, b) ? .15 : 0));
  // survival: keep enough to pay the worst opposing rent (businesses resell at 50% only)
  const cushion = golds(p) ? danger(p) * .3 : danger(p) * .6;
  if (p.tokens - pr < Math.max(bb.reserve, cushion)) return false;
  return true; // aggressive buyer: businesses are the only way to bankrupt opponents
}
function pickTarget(p){
  const others = S.players.filter(q => q !== p && !q.out && q.tokens > 0);
  if (!others.length) return null;
  const b = p.bot ? bp(p) : null;
  if (!b || b.target === 'random' || !chance(b.smart)) return pick(others);
  if (b.expert) { // targets the best catch: unshielded player, near the goal, with lots of coins
    const score = q => (q.shield ? -1000 : 0) + (golds(q) ? -600 : 0) + Math.min(150, q.tokens) + (q === ranking()[0] ? 120 : 0) + (!q.bot ? 40 : 0);
    return [...others].sort((x, y) => score(y) - score(x))[0]; }
  if (b.target === 'leader') return others.sort((x, y) => y.tokens - x.tokens)[0];
  const open_ = others.filter(q => !q.shield); return (open_.length ? open_ : others).sort((x, y) => y.tokens - x.tokens)[0];
}

/* ---------- case Duel : SEUL déclencheur des mini-jeux ---------- */
const DUEL_STAKE = 100; // jetons gagnés par le vainqueur / perdus par le perdant d'un duel
const DUEL_GAMES = ['2048-hex','tile-match','bubbles','memoire','corde','match3','hexa-puzzle','tetris'];
function duelApply(p, q, won){
  if (won === null || won === undefined || !q) return;
  const w = won ? p : q, l = won ? q : p;
  addTokens(l, -DUEL_STAKE, 'Duel lost'); addTokens(w, DUEL_STAKE, 'Duel won');
  say(w, `${w.name} wins the duel against ${l.name} (+${DUEL_STAKE})`, true);
}
async function duelSpace(p){
  const n = S.players.length, j = idxOf(p) + 1;
  if (p.bot || n < 2) {
    say(p, 'lands on a DUEL space!', true); await pause(p, 1100);
    if (n < 2) return;
    const others = S.players.filter(q => q !== p && !q.out); if (!others.length) return;
    duelApply(p, others[Math.floor(Math.random() * others.length)], Math.random() < 0.5); return;
  }
  const names = S.players.map(q => encodeURIComponent(q.name)).join('|');
  const force = window.DZ.duelForce != null ? `&force=${window.DZ.duelForce}` : '';
  open(`<h2>⚔️ DUEL!</h2><p>Roll the die to pick your opponent, then the casino reel picks the mini-game. Stake : <b>${DUEL_STAKE}</b> tokens.</p><iframe class="duelFrame" id="duelFrame" src="minijeux/duel.html?embed=1&me=${j}&n=${n}&names=${names}${force}" title="Duel"></iframe><button class="btn primary" id="ok">END DUEL</button>`, true);
  await waitClick('#ok');
  let res = null, vs = null;
  try {
    const w = $('#duelFrame').contentWindow, qs = new URLSearchParams(w.location.search);
    res = w.MJ_RESULT || null;
    vs = +(qs.get('vs') || (w.DUEL_PICK && w.DUEL_PICK.vs) || 0);
    window.DZ.lastDuel = { page: w.location.pathname.split('/').pop(), vs, result: res };
  } catch (e) { /* iframe illisible */ }
  close();
  const q = vs ? S.players[vs - 1] : null;
  if (res && q && q !== p && !res.tie) duelApply(p, q, !!res.won);
  else log('Duel cancelled: no result.');
  hud();
}

/* ---------- spaces ---------- */
async function resolveSpace(p){
  const t = WP[p.pos].type;
  const TFR = {building:'BUSINESS', search:'SEARCH', quiz:'QUIZ', coin:'COINS', penalty:'PENALTY', duel:'DUEL', start:'START', empty:'EMPTY'};
  if (!p.bot) log(`Space ${p.pos}: ${TFR[t] || t}`);
  if (t === 'duel') { await duelSpace(p); return; }
  if (!SPECIAL.has(t)) { if (t === 'empty' && !p.bot) log('Empty space — moving on.'); return; }
  const i2 = wIdx('w2', W2.length);
  if (p.bot) await botWheel(p, W2.map(s => s.label), i2, 'Bonus wheel');
  else await spinWheel('BONUS WHEEL', `You\u2019re on a <b>${TFR[t]}</b> space. Spin the second wheel: visits, coin steals, x2 or x3!`, W2.map(s => s.label), i2, true);
  const eff = W2[i2], mult = eff.k === 'mult' ? eff.v : 1;
  if (t === 'building') await buildingVisit(p, mult);
  else if (t === 'search') await hiddenObject(p, mult);
  else if (t === 'quiz') await quiz(p, mult);
  else if (t === 'coin') { const g = reward(p, 100, mult, 'Coin space'); await tell(p, 'COIN SPACE', `<p>You pick up <b>${g}</b> coins.</p>`, `picks up ${g} coins`); }
  else if (t === 'penalty') {
    addTokens(p, -50, 'Penalty');
    if (mult > 1) { p.mult = Math.max(p.mult, mult); hud(); }
    await tell(p, 'PENALTY', `<img class="packImg" src="assets/board-v2/carte-penalty.jpg" alt="Penalty"><p>You lose <b>50</b> coins.</p>${mult > 1 ? `<p>Lucky break: your x${mult} is saved for your next reward.</p>` : ''}`, 'pays a 50-coin penalty');
  }
  if (S.over || p.out) return;
  if (eff.k === 'visit') { for (let k = 0; k < eff.v && !p.out; k++) await buildingVisit(p, 1, `Visit ${k + 1}/${eff.v}`); }
  else if (eff.k === 'steal') await steal(p, eff.v);
  else if (eff.k === 'chance') await drawChance(p);
  else if (eff.k === 'career') await drawCareer(p);
}

async function steal(p, n, label){
  let target;
  const others = S.players.filter(q => q !== p && !q.out);
  if (hasPerk(p, 'gloves')) n += 50;
  if (!p.bot) {
    open(`<span class="tag">${label || 'STEAL'}</span><h2>PICK YOUR TARGET</h2><p>Steal up to <b>${n}</b> coins. A shield blocks the steal.</p>
      <div class="opts">${others.map(q => `<button class="btn tgt" data-v="${idxOf(q)}" style="--pc:${q.color}"><img ${pimg(q)} alt="">${esc(q.name)} · ${q.tokens} ${q.shield ? '🛡️' : ''}</button>`).join('')}</div>`);
    target = S.players[+(await choose('.tgt'))]; close();
  } else target = pickTarget(p);
  if (!target) return;
  if (target.shield) {
    target.shield = false; hud();
    if (!p.bot) await info('STEAL BLOCKED', `<p>${esc(target.name)}\u2019s shield blocked your steal. The shield is used up.</p>`);
    else { say(p, `steal on ${esc(youName(target))} BLOCKED by a shield`, true); await pause(p, 900); }
    return;
  }
  if (useGold(target, Math.min(n, target.tokens), 'steal by ' + p.name)) { if (!p.bot) await info('STEAL CANCELED', `<p>✦ A gold accessory of ${esc(target.name)}\u2019s canceled your steal.</p>`); else await pause(p, 900); return; }
  const got = Math.min(n, target.tokens); target.tokens -= got; p.tokens += got; hud();
  if (!p.bot) await info(label || 'STEAL!', `<p>You raid <b>${esc(target.name)}</b>\u2019s village and steal <b>${got}</b> coins.</p>`);
  else { say(p, `steals ${got} coins from ${youName(target)}`, true); await pause(p, 1000); }
}

/* ---------- buildings / businesses ---------- */
const bars = n => Array.from({length:5}, (_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('');
function bizLabel(b, o){
  const jobs = jobsOf(b), own = o ? S.players[o.p] : null;
  return `<div class="bizInfo"><div><small>PRICE</small><b>${price(b)}</b></div><div><small>RENT</small><b>${o ? rentOf(b, o) : baseRent(b)}</b></div>
    <div><small>OWNER</small><b style="color:${own ? own.color : ''}">${own ? esc(youName(own)) : 'For sale'}</b></div></div>`;
}
// black-and-gold business card: image + matching job clearly shown
function bizCard(b, o, tag){
  const jobs = jobsOf(b);
  return `<span class="tag">${tag}</span><div class="bizCard"><div class="bcHead">${esc(bn(b).toUpperCase())}</div>
    <div class="cardRow"><img class="cardImg" src="${b.file}" alt="${esc(bn(b))}">${bizLabel(b, o)}</div>
    <div class="bcJob"><small>MATCHING JOB</small><b>${jobs.length ? jobs.map(jf).join(' · ') : 'All jobs'}</b></div></div>`;
}
async function buildingVisit(p, mult, label){
  const b = drawBuilding(), o = S.owners[b.file], i = idxOf(p), task = pick(TASKS);
  if (o && o.p !== i) { // pay rent
    const owner = S.players[o.p], rent = Math.round(rentOf(b, o) * (hasPerk(p, 'helmet') ? .75 : 1));
    const goldBlock = golds(p) > 0 && rent >= 50;
    const paid = charge(p, rent, 'rent ' + bn(b), owner, 'rent'); S.stats.rent += paid;
    if (!p.bot) {
      open(`${bizCard(b, o, (label || 'BUSINESS') + ' · RENT')}
        <div class="progress">${bars(o.lvl)}</div><p>Owned by <b style="color:${owner.color}">${esc(owner.name)}</b> (${RANKS[owner.rank || 0].t}) · upgrades ${o.lvl}/5</p><p class="big">${goldBlock ? `✦ Your gold accessory cancels the <b>${rent}</b>-coin rent!` : p.out ? `You can\u2019t pay <b>${rent}</b> coins: BANKRUPT.` : `You pay <b>${paid}</b> coins in rent.`}</p><button class="btn primary" id="ok">${p.out ? 'CONTINUE' : goldBlock ? 'GREAT!' : 'PAY RENT'}</button>`);
      await waitClick('#ok'); close();
    } else { say(p, `pays ${paid} rent to ${youName(owner)} (${bn(b)})`, true); await pause(p, 1000); }
    // mayor's tax
    const mayor = S.players.find(q => q !== p && !q.out && (q.rank || 0) >= 3);
    if (mayor && !p.out && !mayor.out) charge(p, 25, 'mayor\u2019s tax', mayor, 'tax');
    return;
  }
  if (o && o.p === i) { // own business: collect + upgrade
    const g = reward(p, 50, mult, b.name);
    const cost = upgradeCost(p, b), can = o.lvl < 5 && p.tokens >= cost;
    if (!p.bot) {
      open(`${bizCard(b, o, label || 'YOUR BUSINESS')}
        <div class="progress">${bars(o.lvl)}</div><p>Your business earns you <b>${g}</b> coins. Upgrades ${o.lvl}/5${profMatch(p, b) ? ' · <b>job bonus</b>' : ''}</p>
        ${o.lvl < 5 ? `<button class="btn primary" id="up" ${can ? '' : 'disabled'}>UPGRADE · ${cost} coins (rent ${rentOf(b, {p:i, lvl:o.lvl + 1})})</button>` : '<p><b>Fully upgraded</b></p>'}
        <button class="btn" id="no" style="margin-top:8px;width:100%">CONTINUE</button>`);
      const v = await new Promise(r => { const u = sheet.querySelector('#up'); if (u) u.onclick = () => r('up'); sheet.querySelector('#no').onclick = () => r('no'); });
      if (v === 'up' && can) { p.tokens -= cost; o.lvl++; hud(); toast(`${bn(b)} upgraded to ${o.lvl}/5`); }
      close();
    } else {
      const bb = bp(p);
      const worth = !bb.expert || p.tokens - cost > danger(p) * .6;
      if (can && worth && p.tokens - cost >= bb.reserve && chance(bb.upgrade)) { p.tokens -= cost; o.lvl++; hud(); say(p, `upgrades ${bn(b)} to ${o.lvl}/5 (-${cost})`, true); await pause(p, 900); }
      else await pause(p, 500);
    }
    return;
  }
  // unowned: do the task, then maybe buy
  const g = reward(p, 25, mult, b.name);
  const item = chance(0.35) ? giveAccessory(p) : null;
  const pr = price(b);
  if (!p.bot) {
    open(`${bizCard(b, null, label || 'BUSINESS VISIT')}
      <p>Task done: <b>${task}</b> · +${g} coins${item ? ` · accessory <b>${esc(item)}</b>` : ''}</p>
      ${profMatch(p, b) ? '<p class="good">This is your job: +50% rent and −25% on upgrades if you buy it.</p>' : ''}
      <button class="btn primary" id="buy" ${p.tokens >= pr ? '' : 'disabled'}>BUY THIS BUSINESS · ${pr} coins</button>
      <button class="btn" id="no" style="margin-top:8px;width:100%">NOT NOW</button>`);
    const v = await new Promise(r => { sheet.querySelector('#buy').onclick = () => r('buy'); sheet.querySelector('#no').onclick = () => r('no'); });
    if (v === 'buy' && p.tokens >= pr) { p.tokens -= pr; S.owners[b.file] = {p:i, lvl:0}; hud(); toast(`${bn(b)} is yours now!`); checkRank(p); }
    close();
  } else {
    if (botWantsBuy(p, b)) { p.tokens -= pr; S.owners[b.file] = {p:i, lvl:0}; hud(); say(p, `buys ${bn(b)} for ${pr}`, true); checkRank(p); await pause(p, 1000); }
    else { say(p, `visits ${bn(b)} (+${g})`); await pause(p, 500); }
  }
}

/* ---------- quiz (placeholder) ---------- */
async function quiz(p, mult, careerOnly){
  let pass;
  if (p.bot) {
    pass = force.quiz != null ? force.quiz : chance(bp(p).quiz); delete force.quiz;
    say(p, pass ? 'passes the quiz' : 'fails the quiz'); await pause(p, 600);
  } else {
    const POOL = (window.DZ_QUIZ && DZ_QUIZ.length) ? (DZ_QUIZ.filter(x => x.level === (S.levelKeys >= 1 ? 2 : 1)).length ? DZ_QUIZ.filter(x => x.level === (S.levelKeys >= 1 ? 2 : 1)) : DZ_QUIZ) : QUIZ;
    const qs = [...POOL].sort(() => Math.random() - .5).slice(0, 3); let score = 0;
    for (let k = 0; k < qs.length; k++) {
      const q0 = qs[k];
      if (q0.memo) { open(`<span class="tag warn">QUIZ · ${k + 1}/3</span><h2>MÉMORISE !</h2><p style="font-size:34px;font-weight:bold;letter-spacing:4px">${q0.memo.show}</p>`); await sleep(q0.memo.seconds * 1000); }
      const ord = q0.o.map((_, i) => i).sort(() => Math.random() - .5), q = {q:q0.q, o:ord.map(i => q0.o[i]), a:ord.indexOf(q0.a)};
      open(`<span class="tag warn">QUIZ · ${k + 1}/3</span><h2>${careerOnly ? 'JOB INTERVIEW' : 'QUIZ'}</h2><p style="font-size:17px">${q.q}</p>
        <div class="opts">${q.o.map((o, i) => `<button class="btn" data-i="${i}">${o}</button>`).join('')}</div>`);
      const i = await new Promise(r => sheet.querySelectorAll('.opts .btn').forEach(b => b.addEventListener('click', () => r(+b.dataset.i), {once:true})));
      const bs = sheet.querySelectorAll('.opts .btn'); bs[q.a].classList.add('ok'); if (i !== q.a) bs[i].classList.add('bad'); else score++;
      await sleep(900);
    }
    close(); pass = score >= 2;
    if (!pass) { await info('QUIZ FAILED', `<p>${score}/3 correct answers. You need 2 to win an accessory.</p>`); return; }
    const a = giveAccessory(p); const g = careerOnly ? 0 : reward(p, 75, mult, 'Quiz');
    await info('QUIZ PASSED', `<p>${score}/3 correct answers.</p><p>You win the accessory <b>${esc(a)}</b>${g ? ` and ${g} coins` : ''}.</p>`);
    return;
  }
  if (pass) { const a = giveAccessory(p); if (!careerOnly) reward(p, 75, mult, 'Quiz'); say(p, `wins the accessory: ${a}`); await pause(p, 600); }
}

/* ---------- chance decks ---------- */
function cardHTML(deck, n, cat, title, badge, text, total){
  return `<div class="dzCard"><div class="dzPaw tl">🐾</div><div class="dzPaw tr">🐾</div><div class="dzCrown">♛</div>
    <div class="dzDeck">${deck}</div><div class="dzNo">N° ${String(n).padStart(2, '0')} / ${total}</div><div class="dzQ">?</div>
    <div class="dzTitle">${esc(title.toUpperCase())}</div>${cat ? `<div class="dzCat">◆ ${cat} ◆</div>` : ''}<div class="dzBadge">${esc(badge)}</div>
    <p class="dzText">${esc(text)}</p><div class="dzFoot">DOGZY FAMILY UNIVERSE</div></div>`;
}
async function showCard(p, html, tag, alt, btn){
  if (p.bot) { if (speedF() < 50) { $('#bpWheel').innerHTML = `<div class="miniCard dzMini">?</div>`; } say(p, `draws ${tag}: ${alt}`, true); await pause(p, 1100); return; }
  open(`${html}<button class="btn primary" id="ok">APPLY: ${esc(btn)}</button>`);
  await waitClick('#ok'); close();
}
async function drawChance(p){
  const c = force.chance != null ? D.chance.find(x => x.n === force.chance) : pick(D.chance); delete force.chance;
  const f = FR.chance[c.n];
  await showCard(p, '<img class="packImg" src="assets/board-v2/carte-chance.jpg" alt="Chance">' + cardHTML('CHANCE', c.n, f[0], f[1], f[2], f[3], 16), 'a CHANCE card', f[1], f[2]);
  switch (c.n) {
    case 1: p.extra = true; say(p, 'Spin again!'); break;
    case 2: reward(p, 200, 1, 'Golden Paw'); break;
    case 3: p.mult = 2; hud(); say(p, 'Next reward x2'); break;
    case 4: p.mult = 3; hud(); say(p, 'Next reward x3'); break;
    case 5: p.shield = true; hud(); say(p, 'Royal Shield raised'); break;
    case 6: await steal(p, pick([50, 100, 150]), 'SURPRISE RAID'); break;
    case 7: await steal(p, 100, 'PICKPOCKET PUP'); break;
    case 8: { const n = 1 + rnd(3); for (let k = 0; k < n; k++) await buildingVisit(p, 1, `Visit ${k + 1}/${n}`); break; }
    case 9: await moveTo(p, nextOfType(p, 'building')); reward(p, 100, 1, 'Bank interest'); break;
    case 10: p.skip = true; hud(); say(p, 'misses the next turn'); break;
    case 11: addTokens(p, -50, 'Parking ticket'); break;
    case 12: await moveSteps(p, -3); say(p, 'Back 3 spaces'); break;
    case 13: { const a = giveAccessory(p); say(p, 'Free accessory: ' + a); break; }
    case 14:
      if (p.shield) { p.shield = false; hud(); say(p, 'The shield blocked The Pyromaniac!'); }
      else if (p.acc.length) { const a = p.acc.splice(rnd(p.acc.length), 1)[0]; const k = p.career.items.indexOf(a); if (k >= 0) p.career.items.splice(k, 1); hud(); say(p, 'Burned: ' + a); }
      else say(p, 'Nothing to burn… lucky'); break;
    case 15: if (!rankUp(p)) reward(p, 150, 1, 'Already at the top'); break;
    case 16: await moveTo(p, nextOfType(p, 'search')); await hiddenObject(p, 1); break;
  }
  await pause(p, 300);
}
async function drawCareer(p){
  const c = force.career != null ? CH.careerChance.find(x => x.n === force.career) : pick(CH.careerChance); delete force.career;
  const f = FR.career[c.n];
  await showCard(p, cardHTML('CAREER CHANCE', c.n, '', f[0], f[1], f[2], 10), 'a CAREER CHANCE card', f[0], f[1]);
  const nb = owned(p).length;
  switch (c.n) {
    case 1: { const pr = promote(p); if (pr) { hud(); say(p, `Promotion: ${pr}!`, true); } else reward(p, 150, 1, 'Already at the top'); break; }
    case 2: case 9: {
      if (c.n === 9) { const poor = S.players.filter(q => q !== p && !q.out).sort((a, b) => a.tokens - b.tokens)[0]; if (poor) { const g = Math.min(50, p.tokens); p.tokens -= g; poor.tokens += g; say(p, `gives ${g} coins to ${youName(poor)}`); } }
      const a = giveAccessory(p); say(p, 'Career accessory: ' + a); break; }
    case 3: if (p.shield) { p.shield = false; say(p, 'The shield saves your uniform'); } else { const it = loseCareerItem(p); say(p, it ? 'Lost: ' + it : 'No piece to lose'); } hud(); break;
    case 4: reward(p, 150, 1, 'Training Day'); break;
    case 5: reward(p, 100, 1, 'Big Tip'); break;
    case 6: await quiz(p, 1, true); break;
    case 7: addTokens(p, -75, 'Late for work'); break;
    case 8: addTokens(p, 50 * nb, `Franchise (${nb} businesses)`); break;
    case 10: addTokens(p, -25 * nb, `Inspection (${nb} businesses)`); break;
  }
  await pause(p, 300);
}
function levelUp(){ S.levelKeys = Math.max(S.levelKeys, Math.min(3, S.levelKeys + 1)); hud(); toast(`Level ${S.levelKeys + 1} unlocked!`); }

/* ---------- hidden object ---------- */
async function hiddenObject(p, mult){
  if (p.bot) {
    const win = force.ho != null ? force.ho : chance(bp(p).ho); delete force.ho;
    if (win) { const a = giveAccessory(p); const g = reward(p, 100, mult, 'Search'); say(p, `finds all the hidden objects: ${a} +${g}`, true); }
    else say(p, 'runs out of time on the search');
    await pause(p, 900); return;
  }
  const H = D.hidden, TIME = 90;
  const objs = H.objects.map(o => ({name:o.name, total:o.zones.length, found:0}));
  let zones = '';
  H.objects.forEach((o, oi) => o.zones.forEach((z, zi) => {
    zones += `<div class="zone" data-o="${oi}" data-z="${zi}" style="left:${z[0] / H.w * 100}%;top:${z[1] / H.h * 100}%;width:${(z[2] - z[0]) / H.w * 100}%;height:${(z[3] - z[1]) / H.h * 100}%"></div>`;
  }));
  open(`<div class="hoTop"><span class="tag">SEARCH · HIDDEN OBJECTS</span><div class="timer" id="tm">1:30</div><div class="zoomBtns"><button class="btn" id="zo">−</button><button class="btn" id="zi">+</button></div></div>
    <h2 style="margin-top:6px">${H.title.toUpperCase()}</h2><p style="font-style:italic">${H.story}</p>
    <div class="hoScroll" id="hs"><div class="hoScene" id="sc"><img src="${H.img}" alt="${H.title}" draggable="false">${zones}</div></div>
    <p style="font-size:12px;color:#bfa55c;margin:0 0 6px">Drag the picture to explore · − / + to zoom · a wrong tap costs 2 s</p><div class="hoList" id="hl"></div><button class="btn primary" id="quit">GIVE UP</button>`, true);
  const sc = sheet.querySelector('#sc'), hs = sheet.querySelector('#hs');
  let zoom = 1;
  const base = () => Math.max(hs.clientWidth, Math.min(900, window.innerWidth * 2));
  const applyZoom = () => { sc.style.width = Math.round(base() * zoom) + 'px'; };
  applyZoom();
  sheet.querySelector('#zi').onclick = () => { zoom = Math.min(2.5, zoom * 1.3); applyZoom(); };
  sheet.querySelector('#zo').onclick = () => { zoom = Math.max(hs.clientWidth / base(), zoom / 1.3); applyZoom(); };
  const renderList = () => { sheet.querySelector('#hl').innerHTML = objs.map(o => `<div class="${o.found === o.total ? 'done' : ''}">${o.name}${o.total > 1 ? `<b>${o.found}/${o.total}</b>` : (o.found ? '<b>✓</b>' : '')}</div>`).join(''); };
  renderList();
  let left = TIME, finished = false, resolve;
  const done = new Promise(r => resolve = r);
  const tm = sheet.querySelector('#tm');
  const tick = () => { tm.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; tm.classList.toggle('low', left <= 15); };
  const iv = setInterval(() => { if (finished) return; left--; tick(); if (left <= 0) { finished = true; resolve(false); } }, 1000);
  window.DZ.hoTime = v => { left = v; tick(); };
  sc.addEventListener('click', e => {
    if (finished) return;
    const z = e.target.closest('.zone');
    if (z && !z.classList.contains('found')) {
      z.classList.add('found'); const o = objs[+z.dataset.o]; o.found++; renderList();
      if (objs.every(o => o.found === o.total)) { finished = true; resolve(true); }
      return;
    }
    if (!z) { const r = sc.getBoundingClientRect(); const m = document.createElement('div'); m.className = 'miss'; m.style.left = (e.clientX - r.left) + 'px'; m.style.top = (e.clientY - r.top) + 'px'; sc.appendChild(m); setTimeout(() => m.remove(), 650); left = Math.max(0, left - 2); tick(); }
  });
  sheet.querySelector('#quit').onclick = () => { if (!finished) { finished = true; resolve(false); } };
  const win = await done; clearInterval(iv);
  await sleep(500); close();
  const n = objs.reduce((s, o) => s + o.found, 0), tot = objs.reduce((s, o) => s + o.total, 0);
  if (win) { const a = giveAccessory(p); const g = reward(p, 100, mult, 'Search'); await info('ALL FOUND!', `<p>You found all ${tot} objects with ${left} s to spare.</p><p>You win the accessory <b>${esc(a)}</b> and ${g} coins.</p>`); }
  else await info('TIME\u2019S UP', `<p>You found ${n}/${tot} objects. Find them all within 90 seconds to win an accessory.</p>`);
}

/* ---------- start menu ---------- */
function setupScreen(){
  const last = (S && S.cfg) || {};
  const cfg = Object.assign({mode:'bots', charId:'chefzy', chars:['chefzy','waitzy','barzy','doczy'], humans:2, bots:3, diff:'hard'}, last); delete cfg.goalType; delete cfg.goal;
  if (!cfg.chars) cfg.chars = ['chefzy','waitzy','barzy','doczy'];
  let seat = 0;
  const tile = c => `<button class="charTile" data-v="${c.id}"><img src="${c.portrait}" alt="${esc(c.name)}"><span class="zoomBtn" data-zoom="${c.portrait}" data-cap="${esc(c.name)}" role="button" aria-label="Enlarge">🔍</span><b>${esc(c.name)}</b><small>${esc(c.career ? CH.careers[c.career].title : jf(c.job))}</small><i class="seatTag"></i></button>`;
  open(`<div class="logo">DOGZY <span>FAMILY</span> UNIVERSE</div><h2>NEW GAME</h2>
    <span class="tag">1 · GAME MODE</span><div class="seg col" id="sMode">
      <button class="btn" data-v="bots">🤖 AGAINST BOTS</button>
      <button class="btn" data-v="local">👥 PLAYERS ON THIS DEVICE (take turns)</button>
      <button class="btn" data-v="online" disabled>🌐 ONLINE · COMING SOON</button></div>
    <div id="localBox"><span class="tag">HUMAN PLAYERS</span><div class="seg" id="sHum">${[2,3,4].map(n => `<button class="btn" data-v="${n}">${n}</button>`).join('')}</div>
      <div class="seg" id="sSeat"></div></div>
    <span class="tag">2 · PICK YOUR CHARACTER</span>
    <p class="sm">Dogzy Town characters</p><div class="charGrid" id="cg">${PLAYABLE.map(tile).join('')}</div>
    <p id="charInfo" class="sm"></p>
    <span class="tag">3 · BOT OPPONENTS</span><div class="seg" id="sBots"></div>
    <p class="sm" id="botNames"></p>
    <span class="tag">4 · BOT DIFFICULTY</span><div class="seg" id="sDiff">${['easy','normal','hard','expert'].map(d => `<button class="btn" data-v="${d}">${DIFF_FR[d]}</button>`).join('')}</div>
    <span class="tag">5 · HOW TO WIN</span><p class="sm rules">Just like Monopoly: <b>the last player standing wins</b>. If you can\u2019t pay, you sell your businesses back to the bank at 50%; if that\u2019s not enough, you go <b>bankrupt</b> and you\u2019re out.</p>
    <button class="btn primary" id="start">START</button>`, true);
  const nH = () => cfg.mode === 'local' ? cfg.humans : 1;
  const mine = () => cfg.mode === 'local' ? cfg.chars.slice(0, cfg.humans) : [cfg.charId];
  const refresh = () => {
    const local = cfg.mode === 'local';
    { const mx = local ? Math.min(3, 5 - nH()) : 3, mn = local ? 0 : 1; cfg.bots = Math.max(mn, Math.min(mx, cfg.bots)); }
    sheet.querySelectorAll('#sMode .btn').forEach(b => b.classList.toggle('on', b.dataset.v === cfg.mode));
    sheet.querySelector('#localBox').style.display = local ? '' : 'none';
    sheet.querySelectorAll('#sHum .btn').forEach(b => b.classList.toggle('on', +b.dataset.v === cfg.humans));
    sheet.querySelector('#sSeat').innerHTML = local ? cfg.chars.slice(0, cfg.humans).map((id, k) => `<button class="btn${k === seat ? ' on' : ''}" data-v="${k}" style="border-left:4px solid ${COLORS[k]}">P${k + 1} · ${esc(charById(id).name)}</button>`).join('') : '';
    sheet.querySelectorAll('#sSeat .btn').forEach(b => b.onclick = () => { seat = +b.dataset.v; refresh(); });
    const sel = mine();
    sheet.querySelectorAll('.charTile').forEach(b => { const k = sel.indexOf(b.dataset.v); b.classList.toggle('sel', k >= 0); b.querySelector('.seatTag').textContent = local && k >= 0 ? 'P' + (k + 1) : ''; });
    const maxB = local ? Math.min(3, 5 - nH()) : 3, minB = local ? 0 : 1;
    sheet.querySelector('#sBots').innerHTML = Array.from({length: maxB - minB + 1}, (_, k) => k + minB).map(n => `<button class="btn${n === cfg.bots ? ' on' : ''}" data-v="${n}">${n}</button>`).join('');
    sheet.querySelectorAll('#sBots .btn').forEach(b => b.onclick = () => { cfg.bots = +b.dataset.v; refresh(); });
    sheet.querySelectorAll('#sDiff .btn').forEach(b => b.classList.toggle('on', b.dataset.v === cfg.diff));
    const c = charById(local ? cfg.chars[seat] : cfg.charId);
    sheet.querySelector('#charInfo').innerHTML = `<b>${esc(c.name)}</b> · ${esc(jf(c.job))} · ${c.career ? 'Career: ' + CH.careers[c.career].title + ' (5 levels)' : c.cardItems ? 'Career: ' + esc(jf(c.job)) + ' → ' + esc(c.boss) : 'Job to be defined'}`;
    const bots = BOT_POOL.filter(id => !sel.includes(id)).slice(0, cfg.bots).map((id, k) => `${charById(id).name} (${PERSONA[BOT_PERSONA[k % 4]].label.split(' ·')[0]})`);
    sheet.querySelector('#botNames').textContent = bots.length ? 'Opponents: ' + bots.join(', ') : 'No bots';
  };
  sheet.querySelectorAll('.charTile').forEach(b => b.onclick = () => {
    if (cfg.mode === 'local') { const id = b.dataset.v, other = cfg.chars.indexOf(id); if (other >= 0 && other !== seat) cfg.chars[other] = cfg.chars[seat]; cfg.chars[seat] = id; }
    else cfg.charId = b.dataset.v; refresh(); });
  sheet.querySelectorAll('#sMode .btn').forEach(b => b.onclick = () => { if (b.disabled) return; cfg.mode = b.dataset.v; if (cfg.mode === 'local' && cfg.bots === 3 && cfg.humans > 2) cfg.bots = 1; refresh(); });
  sheet.querySelectorAll('#sHum .btn').forEach(b => b.onclick = () => { cfg.humans = +b.dataset.v; seat = Math.min(seat, cfg.humans - 1); refresh(); });
  sheet.querySelectorAll('#sDiff .btn').forEach(b => b.onclick = () => { cfg.diff = b.dataset.v; refresh(); });
  refresh();
  sheet.querySelector('#start').onclick = () => { close(); newGame(cfg); $('#btnSpin').disabled = false; passDevice(); };
}

/* ---------- other screens ---------- */
$('#btnLevels').onclick = () => {
  const p = S ? me() : null, cur = p ? p.rank || 0 : 0;
  open(`<h2>THE 4 LEVELS</h2><img class="cardImg" src="assets/levels.png" alt="Levels overview">
    <div class="lvList">${RANKS.map((L, k) => `<div class="${k > cur ? 'locked' : ''}"><span><b>Level ${k + 1} · ${L.t}</b><br><small>Requirement: ${L.need}<br>Perk: ${L.bonus}</small></span><span>${k === cur ? 'YOUR LEVEL' : k < cur ? '✓' : '🔒'}</span></div>`).join('')}</div>
    <p class="sm">The "Promotion!" Chance card also moves you up one level.</p>
    <button class="btn primary" id="ok">BACK</button>`, true);
  waitClick('#ok').then(close);
};
function careerHTML(p){
  const c = charById(p.char), car = careerOf(p);
  if (car) {
    return `<span class="tag">CAREER · ${esc(car.title.toUpperCase())}</span><p><i>${esc(car.motto)}</i></p><img class="cardImg sheetImg" src="${car.sheet}" alt="${esc(car.title)}">
      <div class="career">${car.levels.map((L, k) => { const lv = k + 1, st = lv < p.career.lvl ? 'done' : lv === p.career.lvl ? 'cur' : '';
        return `<div class="${st}"><b>Level ${lv} · ${esc(L.name)}</b> <small>${esc(L.sub)} · ${esc(L.env)}</small><ul>${L.items.map(it => `<li class="${lv < p.career.lvl || (lv === p.career.lvl && p.career.items.includes(it)) ? 'got' : ''}">${esc(it)}</li>`).join('')}</ul></div>`; }).join('')}</div>`;
  }
  if (c.cardItems) {
    return `<span class="tag">CAREER · ${esc(jf(c.job).toUpperCase())}</span><img class="cardImg" src="${c.card}" alt="${esc(c.name)}">
      <div class="career"><div class="${p.career.lvl >= 2 ? 'done' : 'cur'}"><b>Junior ${esc(jf(c.job))} → ${esc(c.boss)}</b><ul>${c.cardItems.map(it => `<li class="${p.career.lvl >= 2 || p.career.items.includes(it) ? 'got' : ''}">${esc(it)}</li>`).join('')}</ul></div></div>`;
  }
  return `<span class="tag">CAREER</span><p>Job to be defined.</p>`;
}
$('#btnBag').onclick = () => {
  if (!S) { setupScreen(); return; }
  const p = me(), c = charById(p.char), myTurn = S.players[S.cur] === p;
  const biz = owned(p).map(([f, o]) => { const b = D.buildings.find(x => x.file === f); return `<span>${bn(b)} ${o.lvl}/5 · rent ${rentOf(b, o)}${profMatch(p, b) ? ' ★' : ''}</span>`; }).join('') || '<span>None yet</span>';
  open(`<div class="prof"><img ${pimg(p, "zoomable")} alt=""><div><h2>${esc(c.name)}</h2><p>Level ${(p.rank || 0) + 1} · ${RANKS[p.rank || 0].t}<br><small>${esc(careerTitle(p))}</small></p></div></div>
    <p>Coins <b>${p.tokens}</b> · Shield <b>${p.shield ? 'YES' : 'NO'}</b></p>
    <p>Dogzy tokens <b>${p.dogzy || 0}</b> · Gold accessories <b>✦${golds(p)}</b>${golds(p) ? ' (' + p.gold.map(esc).join(', ') + ')' : ''}</p>
    <p class="sm">Perks: ${Object.keys(p.perks || {}).map(k => SHOP.find(x => x.id === k).name).join(', ') || 'none'}${p.spins ? ` · bonus turns ${p.spins}` : ''}</p>
    <button class="btn" id="shield" style="width:100%">🛍 ACCESSORY SHOP</button><button class="btn" id="coll2" style="width:100%;margin-top:6px">🗂 MY GOLD NFT COLLECTION</button>
    ${careerHTML(p)}
    <span class="tag">ACCESSORIES</span><div class="bagGrid">${p.acc.map(a => `<span>${esc(a)}</span>`).join('') || '<span>None yet</span>'}</div>
    <span class="tag">YOUR BUSINESSES (★ job bonus)</span><div class="bagGrid">${biz}</div>
    <button class="btn primary" id="ok">BACK</button><button class="btn" id="ng" style="margin-top:10px;width:100%">NEW GAME</button><button class="btn" id="rs" style="margin-top:10px;width:100%">RESET PROGRESS</button>`, true);
  waitClick('#ok').then(close);
  sheet.querySelector('#shield').onclick = () => { close(); shopScreen(); };
  sheet.querySelector('#coll2').onclick = () => collectionScreen();
  sheet.querySelector('#ng').onclick = () => { if (!busy) setupScreen(); };
  sheet.querySelector('#rs').onclick = () => { if (confirm('Reset all progress?')) window.DZ.reset(); };
};
/* ---------- accessory shop ---------- */
function applyShop(p, it){
  if (p.dogzy < it.d) return false;
  if (it.kind === 'perm' && hasPerk(p, it.id)) return false;
  if (it.id === 'shield' && p.shield) return false;
  p.dogzy -= it.d;
  if (it.gold) p.gold.push(it.name);
  else if (it.id === 'shield') p.shield = true;
  else if (it.id === 'spin') p.spins = (p.spins || 0) + 1;
  else p.perks[it.id] = true;
  if (!p.acc.includes(it.name)) p.acc.push(it.name);
  say(p, `buys ${it.gold ? '✦ ' : ''}${it.name} (−${it.d} Dogzy)`, true); hud(); return true;
}
function shopScreen(){
  if (!S) return;
  const p = me(), can = !busy && !S.over && S.players[S.cur] === p && !p.out;
  const item = it => { const owned_ = (it.kind === 'perm' && hasPerk(p, it.id)) || (it.id === 'shield' && p.shield);
    return `<div class="shopItem${it.gold ? ' gold' : ''}"><div><b>${it.gold ? '✦ ' : ''}${esc(it.name)}</b><small>${esc(it.gold ? GOLD_DESC : it.desc)}</small></div>
      <button class="btn buyIt" data-v="${it.id}" ${!can || owned_ || p.dogzy < it.d ? 'disabled' : ''}>${owned_ ? 'OWNED' : `<i class="ico dz"></i> ${it.d}`}</button></div>`; };
  const ex = [1, 5, 10].map(n => `<button class="btn exch" data-v="${n}" ${!can || p.tokens < dogzyCostFor(n) ? 'disabled' : ''}>+${n} <i class="ico dz"></i><small>${dogzyCostFor(n)} coins</small></button>`).join('');
  open(`<span class="tag">ACCESSORY SHOP</span><h2>🛍 SHOP</h2>
    <div class="wallet"><span><i class="ico coin"></i> ${p.tokens} coins</span><span><i class="ico dz"></i> ${p.dogzy || 0} Dogzy</span><span class="gd">✦ ${golds(p)} gold</span></div>
    <div class="exchBox"><b>1 · EXCHANGE: COINS → DOGZY TOKENS</b><small>Current rate: 1 Dogzy = ${dogzyRate()} coins · the rate goes up by ${DOGZY_RATE_STEP} every ${DOGZY_RATE_EVERY} Dogzy bought by all players (max ${DOGZY_RATE_MAX}). Simulated tokens, no link to crypto. No resale.</small><div class="seg">${ex}</div></div>
    <span class="tag">2 · ACCESSORIES (priced in Dogzy tokens)</span><div class="shopList">${SHOP.filter(x => !x.gold).map(item).join('')}</div>
    <span class="tag gold">✦ GOLD ACCESSORIES · single use each</span><p class="sm">Automatically cancels a payment of 50 coins or more (rent, tax, steal, penalty), then disappears. ${GOLD_FOR_BONUS}+ gold accessories = START pays ${START_GOLD_BONUS} coins.</p>
    <div class="shopList">${SHOP.filter(x => x.gold).map(item).join('')}</div>
    <span class="tag nft">◆ NFT · ${NFT_LABEL}</span>
    <p class="sm">Simulated collectibles (no blockchain), purely cosmetic in this game: gold avatar and pawn. Kept from one game to the next. Tap a picture to enlarge it.</p>
    <button class="btn" id="coll" style="width:100%;margin-bottom:6px">🗂 MY COLLECTION (${nftColl().owned.filter(id => charById(id) ? PLAYABLE.includes(charById(id)) : VIP_NFT.some(v => v.id === id)).length})</button>
    <p class="vipHead">Own your character ahead of time for The Adoles-chiant of Dogzy Town universe.</p>
    <span class="tag nft">★ NFT VIP CARDS</span>
    <div class="nftGrid">${VIP_NFT.map(v => vipCard(v, can && !nftOwned(v.id) && p.dogzy >= VIP_PRICE)).join('')}</div>
    <span class="tag nft">◆ GOLD CHARACTERS</span>
    <div class="nftGrid">${PLAYABLE.map(c => nftCard(c, can && !nftOwned(c.id) && p.dogzy >= NFT_PRICE)).join('')}</div>
    ${can ? '' : '<p class="sm">The shop is only open during your turn, before you spin the wheel.</p>'}
    <button class="btn primary" id="ok">BACK</button>`, true);
  sheet.querySelectorAll('.exch').forEach(b => b.onclick = () => { const n = +b.dataset.v; const c = buyDogzy(p, n); toast(`+${n} Dogzy for ${c} coins`); shopScreen(); });
  sheet.querySelectorAll('.buyIt').forEach(b => b.onclick = () => { applyShop(p, SHOP.find(x => x.id === b.dataset.v)); shopScreen(); });
  sheet.querySelectorAll('.buyNft').forEach(b => b.onclick = () => { const pr = b.dataset.v.startsWith('vip-') ? VIP_PRICE : NFT_PRICE; if (p.dogzy < pr || nftOwned(b.dataset.v)) return; p.dogzy -= pr; nftAdd(b.dataset.v);
    if (b.dataset.v === p.char) { p.goldSkin = true; renderPawns(); } hud(); toast(`◆ ${(charById(b.dataset.v) || VIP_NFT.find(v => v.id === b.dataset.v)).name} added to your collection!`); shopScreen(); });
  sheet.querySelector('#coll').onclick = () => collectionScreen(shopScreen);
  sheet.querySelector('#ok').onclick = close;
}
function nftCard(c, canBuy){
  const own = nftOwned(c.id);
  return `<div class="nftCard${own ? ' own' : ''}"><div class="nftImg"><img class="gsk zoomable" src="${c.portrait}" alt="${esc(c.name)} gold" data-cap="${esc(c.name)} · gold NFT"><span class="nftBadge">GOLD</span></div>
    <b>${esc(c.name)}</b><small class="nftLbl">${NFT_LABEL}</small>
    <ul class="nftPerks">${NFT_PERKS.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    ${own ? '<span class="nftOwn">✓ IN YOUR COLLECTION</span>' : `<button class="btn buyNft" data-v="${c.id}" ${canBuy ? '' : 'disabled'}><i class="ico dz"></i> ${NFT_PRICE}</button>`}</div>`;
}
function collectionScreen(back){
  const owned = nftColl().owned.map(charById).filter(c => c && PLAYABLE.includes(c)), p = S ? me() : null;
  const vips = VIP_NFT.filter(v => nftOwned(v.id));
  open(`<span class="tag nft">MY COLLECTION · GOLD NFT CHARACTERS</span><h2>🗂 MY COLLECTION</h2><p class="sm">${NFT_LABEL} · simulated items, no in-game advantage.</p>
    ${vips.length ? `<span class="tag nft">★ NFT VIP CARDS</span><div class="nftGrid">${vips.map(v => vipCard(v, false)).join('')}</div>` : ''}
    ${owned.length || vips.length ? '' : '<p>No NFTs yet. Buy them in the Shop with Dogzy tokens.</p>'}
    ${owned.length ? `<span class="tag nft">◆ GOLD CHARACTERS</span><div class="nftGrid">${owned.map(c => `<div class="nftCard own"><div class="nftImg"><img class="gsk zoomable" src="${c.portrait}" alt="${esc(c.name)} gold" data-cap="${esc(c.name)} · gold NFT"><span class="nftBadge">GOLD</span></div><b>${esc(c.name)}</b>
      <ul class="nftPerks">${NFT_PERKS.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      ${p && p.char === c.id && !p.bot ? `<button class="btn skin" data-v="${c.id}">${p.goldSkin ? 'GOLD AVATAR: ON ✓' : 'USE AS AVATAR'}</button>` : ''}</div>`).join('')}</div>` : ''}
    <button class="btn primary" id="ok">BACK</button>`, true);
  sheet.querySelectorAll('.skin').forEach(b => b.onclick = () => { p.goldSkin = !p.goldSkin; renderPawns(); hud(); collectionScreen(back); });
  sheet.querySelector('#ok').onclick = () => back ? back() : close();
}
/* ---------- magnifier: enlarge a character picture ---------- */
const lb = document.createElement('div'); lb.id = 'lightbox'; lb.className = 'hidden';
lb.innerHTML = '<button class="lbClose" aria-label="Close">×</button><img alt=""><p></p>'; document.body.appendChild(lb);
function zoom(src, cap, gold){ const im = lb.querySelector('img'); im.src = src; im.className = gold ? 'gsk' : ''; lb.querySelector('p').textContent = cap || ''; lb.classList.remove('hidden'); }
lb.addEventListener('click', e => { if (e.target.tagName !== 'IMG') lb.classList.add('hidden'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.add('hidden'); });
// capture phase: the magnifier wins over selection / purchase
document.addEventListener('click', e => {
  const z = e.target.closest('.zoomBtn, img.zoomable'); if (!z) return;
  e.preventDefault(); e.stopPropagation();
  if (z.classList.contains('zoomBtn')) zoom(z.dataset.zoom, z.dataset.cap, false);
  else zoom(z.src, z.dataset.cap || z.alt, z.classList.contains('gsk'));
}, true);
window.DZ.zoom = zoom; window.DZ.collection = () => collectionScreen();
$('#btnShop').onclick = shopScreen;
window.DZ.shop = shopScreen;
window.DZ.endAndRun = async () => { await showNotices(); await endTurn(); await runBots(); };
window.DZ.visit = () => buildingVisit(me(), 1);
$('#btnSpin').onclick = humanTurn;
window.DZ.turn = humanTurn;
window.DZ.hidden = () => hiddenObject(me(), 1);
window.DZ.chance = () => drawChance(me());
window.DZ.career = () => drawCareer(me());
window.DZ.setup = setupScreen;
window.DZ.sim = async (n) => { const p = me(), old = prefs.speed; prefs.speed = 'skip'; p.bot = true; p.persona = 'balanced';
  try { for (let k = 0; k < n && !S.over; k++) { await playTurn(p); await endTurn(); await runBots(); } } finally { p.bot = false; p.persona = null; prefs.speed = old; close(); hud(); } return S; };
// all-bot simulation for balancing (tests)
window.DZ.botBattleStep = async () => { const p = S.players[S.cur]; await playTurn(p); checkRank(p); await endTurn(); };
window.DZ.botBattle = async (cfgs) => { prefs.speed = 'skip'; S.players.forEach((p, k) => { p.bot = true; p.persona = cfgs[k] || 'balanced'; });
  while (!S.over) { const p = S.players[S.cur]; await playTurn(p); checkRank(p); await endTurn(); } close(); return S; };

window.addEventListener('resize', layout);
document.getElementById('boardImg').addEventListener('load', layout);
speedLabel();
if (S && S.v === 4) { renderPawns(); hud(); layout();
  if (S.over) { finish(); }
  else if (S.players[S.cur].bot) { busy = true; $('#btnSpin').disabled = true; runBots().finally(() => { busy = false; $('#btnSpin').disabled = !!S.over; hud(); }); }
  else log(`Round ${S.round} · ${humans() > 1 ? me().name + '\u2019s' : 'your'} turn. Tap SPIN.`);
} else { S = null; layout(); setupScreen(); }
})();
