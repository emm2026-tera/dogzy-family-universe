/* The Adoles-chiant of Dogzy Town — prototype v2: bots, businesses, careers (vanilla JS, offline) */
(function(){
'use strict';
const D = window.DZ_DATA, CH = window.DZ_CHARS;
const WP = D.board.waypoints;
const SAVE_KEY = 'dogzy-adoleschiant-v2', PREF_KEY = 'dogzy-adoleschiant-prefs';
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const chance = p => Math.random() < p;
const params = new URLSearchParams(location.search);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- static tables ---------- */
const ACCESSORIES = ['Gold Chain','Diamond Collar','VIP Sunglasses','Golden Crown','Graffiti Spray Can','Lab Goggles',
  'Rolex Watch','Leather Jacket','Pearl Bracelet','Gold Sneakers','Ring Light','Dogzy Cap','Mic Pendant','Silk Bandana'];
const TASKS = ['Serve 3 customers','Restock the shelves','Sweep the floor','Take a phone order','Count the cash register',
  'Fix the neon sign','Greet the VIP guest','Deliver a package','Clean the windows','Prepare the daily special'];
const QUIZ = [
  {q:'Paw is to Dog as Hand is to …', o:['Human','Glove','Cat'], a:0},
  {q:'□ becomes ■. Then ○ becomes …', o:['◇','●','○'], a:1},
  {q:'2, 4, 8, 16, …', o:['24','32','20'], a:1},
  {q:'Night is to Moon as Day is to …', o:['Star','Sun','Cloud'], a:1},
  {q:'▲▼▲▼ … what comes next?', o:['▼','▲','■'], a:1},
  {q:'Chef is to Kitchen as Pilot is to …', o:['Airport','Cockpit','Sky'], a:1},
  {q:'Which one does not belong? Bank, Hospital, Banana, School', o:['Bank','Banana','School'], a:1},
  {q:'A, C, E, G, …', o:['H','I','J'], a:1},
];
const W1 = ['1','2','3','4','5','6'];
const W2 = [
  {label:'VISIT 1', k:'visit', v:1}, {label:'STEAL 50', k:'steal', v:50}, {label:'x2', k:'mult', v:2}, {label:'VISIT 2', k:'visit', v:2},
  {label:'CHANCE', k:'chance'}, {label:'STEAL 100', k:'steal', v:100}, {label:'x3', k:'mult', v:3}, {label:'VISIT 3', k:'visit', v:3},
  {label:'CAREER', k:'career'}];
const SPECIAL = new Set(['building','search','quiz','coin','penalty']);
const COLORS = ['#f2c230','#ff5a3c','#ff4fc3','#9d6bff'];
const PRICE = {'City Hall':400,'Bank':350,'Hotel':350,'Courthouse':300,'Hospital':300,'Law Office':300,'Engineering Firm':300,'Car Dealership':300,
  'Police Station':250,'Fire Station':250,'School':250,'Supermarket':250,'Restaurant':250,'Sushi Restaurant':250,'Construction Company':250};
const BLD_JOBS = {'Restaurant':['Cook','Server','Barmaid'],'Pizzeria':['Cook','Server'],'Sushi Restaurant':['Cook','Server'],'Bakery':['Cook'],
  'Coffee Shop':['Server','Barmaid'],'Hotel':['Barmaid','Server','Gentleman','Entertainer'],'Hospital':['Doctor'],'Bank':['Banker'],
  'Courthouse':['Lawyer'],'Law Office':['Lawyer'],'Police Station':['Security Guard'],'Construction Company':['Construction Worker'],
  'Hardware Store':['Construction Worker'],'Supermarket':['Cashier'],'School':['Tennis Coach'],'Clothing Store':['Gentleman']};
const price = b => PRICE[b.name] || 200;
const jobsOf = b => BLD_JOBS[b.name] || [];
const DIFF = {
  easy:  {buy:.45, upgrade:.3,  shield:.15, smart:.3, ho:.35, quiz:.45, reserve:300},
  normal:{buy:.7,  upgrade:.55, shield:.4,  smart:.7, ho:.55, quiz:.62, reserve:200},
  hard:  {buy:.95, upgrade:.85, shield:.75, smart:1,  ho:.78, quiz:.82, reserve:120}};
const PERSONA = {
  aggressive:{label:'Aggressive · raids the leader, buys a lot', buy:+.25, upgrade:-.1, shield:-.15, reserveX:.4, target:'leader'},
  risky:     {label:'Unpredictable · risky bets', buy:0, upgrade:0, shield:-.05, reserveX:.6, target:'random', wild:true},
  strategist:{label:'Strategist · saves, upgrades, buys shields', buy:-.1, upgrade:+.3, shield:+.35, reserveX:1.5, target:'smart'},
  balanced:  {label:'Balanced · plays it steady', buy:0, upgrade:0, shield:0, reserveX:1, target:'smart'}};
const SHIELD_COST = 150, START_TOKENS = 1000, START_BONUS = 200;
const charById = id => CH.all.find(c => c.id === id);

/* ---------- state ---------- */
let S = load();
const prefs = (() => { try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {speed:1}; } catch(e) { return {speed:1}; } })();
function load(){ try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.players) return s; } catch(e) {} return null; }
function save(){ try { if (S) localStorage.setItem(SAVE_KEY, JSON.stringify(S)); localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch(e) {} }
const me = () => S.players[0];
const idxOf = p => S.players.indexOf(p);
const NEW_PLAYER = (c, i, bot, persona) => ({name:c.name, char:c.id, color:COLORS[i], bot, persona:persona || null, tokens:START_TOKENS, pos:0, shield:false,
  acc:[], career:{lvl:1, items:[]}, skip:false, mult:1, extra:false});
function newGame(cfg){
  const mine = charById(cfg.charId) || CH.basic[0];
  const order = ['pyromaniac','jouzy','waltzy','kelzy'].filter(id => id !== mine.id).slice(0, cfg.bots);
  const players = [NEW_PLAYER(mine, 0, false)];
  order.forEach((id, k) => { const c = charById(id); players.push(NEW_PLAYER(c, k + 1, true, c.persona)); });
  S = {v:2, cfg, players, owners:{}, round:1, cur:0, over:false, levelKeys:(S && S.levelKeys) || 0, stats:{rent:0}};
  save(); renderPawns(); hud(); layout(); log(`Round 1 · your turn. Tap SPIN.`);
}

/* debug hooks (used by tests): DZ.force = {w1, w2, chance, career, building, ho, quiz} */
const force = {};
window.DZ = {state:()=>S, force, data:D, chars:CH, newGame:cfg => { newGame(cfg); },
  reset:()=>{ localStorage.removeItem(SAVE_KEY); location.reload(); }, prefs};

/* ---------- careers ---------- */
function careerOf(p){ const c = charById(p.char); return c && c.career ? CH.careers[c.career] : null; }
function profOf(p){ const c = charById(p.char); return c ? c.prof || null : null; }
function careerMax(p){ const c = charById(p.char); if (!c) return false; if (c.career) return p.career.lvl >= 5; if (c.cardItems) return p.career.lvl >= 2; return false; }
function careerTitle(p){
  const c = charById(p.char), car = careerOf(p);
  if (car) { const L = car.levels[p.career.lvl - 1]; return `${car.title} · Level ${p.career.lvl}: ${L.name}`; }
  if (c && c.cardItems) return p.career.lvl >= 2 ? c.boss : `Basic ${c.job}`;
  return 'Profession TBD';
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
  if (promo) say(p, `${p.bot ? p.name + ' is' : 'You are'} promoted: ${promo}!`, true);
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
  let r = base * (1 + o.lvl);
  if (profMatch(owner, b)) r = Math.round(r * (careerMax(owner) ? 2 : 1.5));
  return r;
}
const baseRent = b => Math.round(price(b) * 0.1 / 5) * 5;
function upgradeCost(p, b){ return Math.round(price(b) / 2 * (profMatch(p, b) ? 0.75 : 1)); }
function drawBuilding(){
  if (force.building) { const b = D.buildings.find(x => x.file === force.building || x.name === force.building); delete force.building; if (b) return b; }
  const w = D.buildings.map(b => S.owners[b.file] ? 4 : 1), tot = w.reduce((a, b) => a + b, 0);
  let r = Math.random() * tot; for (let i = 0; i < w.length; i++) { r -= w[i]; if (r < 0) return D.buildings[i]; }
  return D.buildings[0];
}
function netWorth(p){ return p.tokens + owned(p).reduce((s, [f, o]) => { const b = D.buildings.find(x => x.file === f); return s + price(b) + o.lvl * price(b) / 2; }, 0); }

/* ---------- HUD + leaderboard ---------- */
function hud(){
  if (!S) return;
  const p = me();
  $('#hTokens').textContent = p.tokens;
  $('#hAcc').textContent = p.acc.length;
  $('#hShield').textContent = p.shield ? 'ON' : 'OFF';
  $('#hShield').style.color = p.shield ? '#9ff58a' : '';
  $('#hLevel').textContent = S.levelKeys + 1;
  $('#hMult').textContent = p.mult > 1 ? `Next reward x${p.mult}` : careerTitle(p);
  $('#hGoal').textContent = S.cfg.goalType === 'tokens' ? `Goal: first to ${S.cfg.goal}` : `Goal: most tokens after ${S.cfg.goal} rounds`;
  $('#hTurn').textContent = `Round ${S.round}${S.cfg.goalType === 'rounds' ? '/' + S.cfg.goal : ''}`;
  const rank = ranking();
  $('#leader').innerHTML = S.players.map((q, i) => {
    const c = charById(q.char), pos = rank.indexOf(q) + 1;
    return `<div class="lb${i === S.cur && !S.over ? ' cur' : ''}" style="--pc:${q.color}" data-i="${i}"><b class="rk">${pos}</b><img src="${c.portrait}" alt=""><span class="nm">${esc(i ? q.name : 'You')}</span><span class="tk">${q.tokens}</span>${q.shield ? '<i class="ico shield" title="Shield"></i>' : ''}<span class="bz" title="Businesses">🏢${owned(q).length}</span></div>`;
  }).join('');
  save();
}
function ranking(){ return [...S.players].sort((a, b) => b.tokens - a.tokens || netWorth(b) - netWorth(a)); }
function log(t){ $('#log').textContent = t; }
let toastT;
function toast(t, p){
  const el = $('#toast'); el.innerHTML = (p ? `<img src="${charById(p.char).portrait}" alt="">` : '') + `<span>${esc(t)}</span>`;
  el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), p && p.bot ? Math.max(900, 1700 / speedF()) : 1900);
}
function say(p, t, important){
  if (p.bot) { $('#bpMsg').textContent = t; log(`${p.name}: ${t}`); if (important || prefs.speed !== 'skip') toast(t, p); }
  else toast(t);
}
function addTokens(p, n, why){
  p.tokens = Math.max(0, p.tokens + n); hud();
  say(p, `${n >= 0 ? '+' : ''}${n} tokens${why ? ' · ' + why : ''}`);
}
function reward(p, base, mult, why){ const m = (mult || 1) * p.mult; p.mult = 1; addTokens(p, base * m, why + (m > 1 ? ` (x${m})` : '')); return base * m; }

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
  pawnsEl.innerHTML = S.players.map((p, i) => `<div class="pawn" id="pawn${i}" style="--pc:${p.color}">${PAW(p.color)}<span class="plabel"><img src="${charById(p.char).portrait}" alt="">${esc(i ? p.name.replace('The ', '') : 'You')}</span></div>`).join('');
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
    if (dir > 0 && p.pos === 0 && s < Math.abs(n) - 1) addTokens(p, START_BONUS, 'Passed START');
    await pause(p, p.bot ? 150 : 200);
  }
  if (dir > 0 && p.pos === 0) addTokens(p, START_BONUS, 'Landed on START');
  hud();
}
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
    txt += `<text x="${tx}" y="${ty}" transform="rotate(${m} ${tx} ${ty})" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,serif" font-weight="bold" font-size="${opts.small ? 14 : 34}" fill="${l === 'CAREER' ? '#f6dd8a' : i % 2 ? '#1a1204' : '#f6dd8a'}">${l}</text>`;
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
  if (busy || !S || S.over || S.cur !== 0) return;
  busy = true; $('#btnSpin').disabled = true;
  try { await playTurn(me()); await endTurn(); await runBots(); }
  catch (e) { console.error(e); }
  finally { busy = false; $('#btnSpin').disabled = !!(S && S.over); hud(); }
}
async function playTurn(p){
  if (p.skip) { p.skip = false; hud(); await tell(p, 'Emergency Room', `<p>You are still recovering at the Hospital. This turn is skipped.</p>`, 'skips this turn (Emergency Room)'); return; }
  if (p.bot) botPreTurn(p);
  let guard = 0;
  do {
    p.extra = false;
    const i1 = wIdx('w1', 6);
    if (p.bot) await botWheel(p, W1, i1, 'Outer wheel');
    else await spinWheel('OUTER WHEEL', 'Spin to see how many spaces you move.', W1, i1);
    const steps = i1 + 1; if (!p.bot) log(`Moving ${steps} space${steps > 1 ? 's' : ''}…`);
    await moveSteps(p, steps);
    await pause(p, p.bot ? 400 : 900);
    await resolveSpace(p);
    if (S.over) return;
  } while (p.extra && ++guard < 4);
}
async function endTurn(){
  if (checkWin()) return;
  S.cur++;
  if (S.cur >= S.players.length) { S.cur = 0; S.round++; if (S.cfg.goalType === 'rounds' && S.round > S.cfg.goal) { S.round = S.cfg.goal; finish(); return; } }
  hud(); renderLeaderCur();
}
function renderLeaderCur(){ S.players.forEach((p, i) => placePawn(i, true)); }
async function runBots(){
  while (S && !S.over && S.cur !== 0) {
    const p = S.players[S.cur];
    showBotPanel(p);
    await playTurn(p);
    await pause(p, 500);
    await endTurn();
  }
  skipNow = false; hideBotPanel();
  if (S && !S.over) { follow(me().pos); log(`Round ${S.round} · your turn. Tap SPIN.`); }
}
function showBotPanel(p){ const c = charById(p.char); $('#botPanel').classList.remove('hidden'); document.body.classList.add('botTurn'); $('#botPanel').style.setProperty('--pc', p.color); $('#bpImg').src = c.portrait; $('#bpName').textContent = `${p.name}'s turn`; $('#bpMsg').textContent = PERSONA[p.persona].label; $('#bpWheel').innerHTML = ''; hud(); }
function hideBotPanel(){ $('#botPanel').classList.add('hidden'); document.body.classList.remove('botTurn'); }
function checkWin(){
  if (S.cfg.goalType === 'tokens' && S.players.some(p => p.tokens >= S.cfg.goal)) { finish(); return true; }
  return false;
}
function finish(){
  S.over = true; hud(); hideBotPanel(); $('#btnSpin').disabled = true;
  const r = ranking(), place = r.indexOf(me()) + 1;
  open(`<span class="tag">GAME OVER · ROUND ${S.round}</span><h2>${place === 1 ? '🏆 YOU WIN!' : `YOU FINISHED #${place}`}</h2>
    <p>${S.cfg.goalType === 'tokens' ? `First to ${S.cfg.goal} tokens` : `Most tokens after ${S.cfg.goal} rounds`} · ${S.cfg.diff.toUpperCase()}</p>
    <div class="rankList">${r.map((p, k) => `<div class="${p === me() ? 'me' : ''}" style="--pc:${p.color}"><b>${k + 1}</b><img src="${charById(p.char).portrait}" alt=""><span>${esc(p === me() ? 'You (' + p.name + ')' : p.name)}<small>${owned(p).length} businesses · ${p.acc.length} accessories · ${esc(careerTitle(p))}</small></span><em>${p.tokens}</em></div>`).join('')}</div>
    <button class="btn primary" id="again">PLAY AGAIN</button><button class="btn" id="view" style="margin-top:8px;width:100%">VIEW BOARD</button>`);
  sheet.querySelector('#again').onclick = () => setupScreen();
  sheet.querySelector('#view').onclick = close;
  log('Game over. Tap BAG > NEW GAME to play again.');
}

/* ---------- bot brain ---------- */
function bp(p){ const d = DIFF[S.cfg.diff], m = PERSONA[p.persona];
  return {buy:Math.min(1, d.buy + m.buy), upgrade:Math.min(1, d.upgrade + m.upgrade), shield:Math.max(0, d.shield + m.shield), smart:d.smart, ho:d.ho, quiz:d.quiz, reserve:d.reserve * m.reserveX, target:m.target, wild:m.wild}; }
function botPreTurn(p){
  const b = bp(p);
  const leader = ranking()[0];
  const threatened = S.players.some(q => q !== p && q.persona === 'aggressive') || leader === p;
  if (!p.shield && p.tokens >= SHIELD_COST + b.reserve && chance(b.shield * (threatened ? 1 : .6))) {
    p.tokens -= SHIELD_COST; p.shield = true; hud(); say(p, `buys a shield (-${SHIELD_COST})`);
  }
}
function pickTarget(p){
  const others = S.players.filter(q => q !== p && q.tokens > 0);
  if (!others.length) return null;
  const b = p.bot ? bp(p) : null;
  if (!b || b.target === 'random' || !chance(b.smart)) return pick(others);
  if (b.target === 'leader') return others.sort((x, y) => y.tokens - x.tokens)[0];
  const open_ = others.filter(q => !q.shield); return (open_.length ? open_ : others).sort((x, y) => y.tokens - x.tokens)[0];
}

/* ---------- spaces ---------- */
async function resolveSpace(p){
  const t = WP[p.pos].type;
  if (!p.bot) log(`Space ${p.pos}: ${t.toUpperCase()}`);
  if (!SPECIAL.has(t)) { if (t === 'empty' && !p.bot) log('Empty space — move along.'); return; }
  const i2 = wIdx('w2', W2.length);
  if (p.bot) await botWheel(p, W2.map(s => s.label), i2, 'Bonus wheel');
  else await spinWheel('BONUS WHEEL', `You landed on a <b>${t.toUpperCase()}</b> space. Spin the bonus wheel!`, W2.map(s => s.label), i2, true);
  const eff = W2[i2], mult = eff.k === 'mult' ? eff.v : 1;
  if (t === 'building') await buildingVisit(p, mult);
  else if (t === 'search') await hiddenObject(p, mult);
  else if (t === 'quiz') await quiz(p, mult);
  else if (t === 'coin') { const g = reward(p, 150, mult, 'Coin space'); await tell(p, 'COIN SPACE', `<p>You collect <b>${g}</b> tokens.</p>`, `collects ${g} tokens`); }
  else if (t === 'penalty') {
    addTokens(p, -50, 'Penalty');
    if (mult > 1) { p.mult = Math.max(p.mult, mult); hud(); }
    await tell(p, 'PENALTY', `<p>You lose <b>50</b> tokens.</p>${mult > 1 ? `<p>Lucky break: your x${mult} is saved for your next reward.</p>` : ''}`, 'pays a 50-token penalty');
  }
  if (S.over) return;
  if (eff.k === 'visit') { for (let k = 0; k < eff.v; k++) await buildingVisit(p, 1, `City tour ${k + 1}/${eff.v}`); }
  else if (eff.k === 'steal') await steal(p, eff.v);
  else if (eff.k === 'chance') await drawChance(p);
  else if (eff.k === 'career') await drawCareer(p);
}

async function steal(p, n, label){
  let target;
  const others = S.players.filter(q => q !== p);
  if (!p.bot) {
    open(`<span class="tag">${label || 'RAID'}</span><h2>CHOOSE YOUR TARGET</h2><p>Steal up to <b>${n}</b> tokens. A shield blocks the raid.</p>
      <div class="opts">${others.map(q => `<button class="btn tgt" data-v="${idxOf(q)}" style="--pc:${q.color}"><img src="${charById(q.char).portrait}" alt="">${esc(q.name)} · ${q.tokens} ${q.shield ? '🛡️' : ''}</button>`).join('')}</div>`);
    target = S.players[+(await choose('.tgt'))]; close();
  } else target = pickTarget(p);
  if (!target) return;
  if (target.shield) {
    target.shield = false; hud();
    if (!p.bot) await info('RAID BLOCKED', `<p>${esc(target.name)}'s shield blocked your raid. The shield is used up.</p>`);
    else { say(p, `raid on ${target === me() ? 'you' : target.name} BLOCKED by a shield`, true); await pause(p, 900); }
    return;
  }
  const got = Math.min(n, target.tokens); target.tokens -= got; p.tokens += got; hud();
  if (!p.bot) await info(label || 'RAID!', `<p>You raid <b>${esc(target.name)}</b>'s village and steal <b>${got}</b> tokens.</p>`);
  else { say(p, `raids ${target === me() ? 'YOU' : target.name} and steals ${got} tokens`, true); await pause(p, 1000); }
}

/* ---------- buildings / businesses ---------- */
const bars = n => Array.from({length:5}, (_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('');
function bizLabel(b, o){
  const jobs = jobsOf(b), own = o ? S.players[o.p] : null;
  return `<div class="bizInfo"><div><small>PRICE</small><b>${price(b)}</b></div><div><small>RENT</small><b>${o ? rentOf(b, o) : baseRent(b)}</b></div>
    <div><small>OWNER</small><b style="color:${own ? own.color : ''}">${own ? esc(own === me() ? 'You' : own.name) : 'For sale'}</b></div>
    <div class="jobs"><small>LINKED PROFESSION</small><b>${jobs.length ? jobs.join(' · ') : 'Any'}</b></div></div>`;
}
async function buildingVisit(p, mult, label){
  const b = drawBuilding(), o = S.owners[b.file], i = idxOf(p), task = pick(TASKS);
  if (o && o.p !== i) { // pay rent
    const owner = S.players[o.p], rent = rentOf(b, o), paid = Math.min(rent, p.tokens);
    p.tokens -= paid; owner.tokens += paid; S.stats.rent += paid; hud();
    if (!p.bot) {
      open(`<span class="tag warn">${label || 'BUILDING'} · RENT</span><h2>${b.name.toUpperCase()}</h2><div class="cardRow"><img class="cardImg" src="${b.file}" alt="${b.name}">${bizLabel(b, o)}</div>
        <div class="progress">${bars(o.lvl)}</div><p>Owned by <b style="color:${owner.color}">${esc(owner.name)}</b> · upgrades ${o.lvl}/5</p><p class="big">You pay <b>${paid}</b> tokens rent.</p><button class="btn primary" id="ok">PAY RENT</button>`);
      await waitClick('#ok'); close();
    } else { say(p, `pays ${paid} rent to ${owner === me() ? 'YOU' : owner.name} at ${b.name}`, true); await pause(p, 1000); }
    return;
  }
  if (o && o.p === i) { // own business: collect + upgrade
    const g = reward(p, 50, mult, b.name);
    const cost = upgradeCost(p, b), can = o.lvl < 5 && p.tokens >= cost;
    if (!p.bot) {
      open(`<span class="tag">${label || 'YOUR BUSINESS'}</span><h2>${b.name.toUpperCase()}</h2><div class="cardRow"><img class="cardImg" src="${b.file}" alt="${b.name}">${bizLabel(b, o)}</div>
        <div class="progress">${bars(o.lvl)}</div><p>Your business pays you <b>${g}</b> tokens. Upgrades ${o.lvl}/5${profMatch(p, b) ? ' · <b>profession bonus</b>' : ''}</p>
        ${o.lvl < 5 ? `<button class="btn primary" id="up" ${can ? '' : 'disabled'}>UPGRADE · ${cost} tokens (rent ${rentOf(b, {p:i, lvl:o.lvl + 1})})</button>` : '<p><b>Fully upgraded</b></p>'}
        <button class="btn" id="no" style="margin-top:8px;width:100%">CONTINUE</button>`);
      const v = await new Promise(r => { const u = sheet.querySelector('#up'); if (u) u.onclick = () => r('up'); sheet.querySelector('#no').onclick = () => r('no'); });
      if (v === 'up' && can) { p.tokens -= cost; o.lvl++; hud(); toast(`${b.name} upgraded to ${o.lvl}/5`); }
      close();
    } else {
      const bb = bp(p);
      if (can && p.tokens - cost >= bb.reserve && chance(bb.upgrade)) { p.tokens -= cost; o.lvl++; hud(); say(p, `upgrades ${b.name} to ${o.lvl}/5 (-${cost})`, true); await pause(p, 900); }
      else await pause(p, 500);
    }
    return;
  }
  // unowned: do the task, then maybe buy
  const g = reward(p, 75, mult, b.name);
  const item = chance(0.35) ? giveAccessory(p) : null;
  const pr = price(b);
  if (!p.bot) {
    open(`<span class="tag">${label || 'BUILDING VISIT'}</span><h2>${b.name.toUpperCase()}</h2><div class="cardRow"><img class="cardImg" src="${b.file}" alt="${b.name}">${bizLabel(b, null)}</div>
      <p>Task done: <b>${task}</b> · +${g} tokens${item ? ` · accessory <b>${esc(item)}</b>` : ''}</p>
      ${profMatch(p, b) ? '<p class="good">Matches your profession: +50% rent and −25% upgrades if you own it.</p>' : ''}
      <button class="btn primary" id="buy" ${p.tokens >= pr ? '' : 'disabled'}>BUY THIS BUSINESS · ${pr} tokens</button>
      <button class="btn" id="no" style="margin-top:8px;width:100%">NOT NOW</button>`);
    const v = await new Promise(r => { sheet.querySelector('#buy').onclick = () => r('buy'); sheet.querySelector('#no').onclick = () => r('no'); });
    if (v === 'buy' && p.tokens >= pr) { p.tokens -= pr; S.owners[b.file] = {p:i, lvl:0}; hud(); toast(`You now own ${b.name}!`); }
    close();
  } else {
    const bb = bp(p);
    const wants = (p.tokens - pr >= bb.reserve || (bb.wild && p.tokens >= pr && chance(.4))) && chance(bb.buy + (profMatch(p, b) ? .15 : 0));
    if (wants) { p.tokens -= pr; S.owners[b.file] = {p:i, lvl:0}; hud(); say(p, `buys ${b.name} for ${pr}`, true); await pause(p, 1000); }
    else { say(p, `visits ${b.name} (+${g})`); await pause(p, 500); }
  }
}

/* ---------- quiz (placeholder) ---------- */
async function quiz(p, mult, careerOnly){
  let pass;
  if (p.bot) {
    pass = force.quiz != null ? force.quiz : chance(bp(p).quiz); delete force.quiz;
    say(p, pass ? 'passes the quiz' : 'fails the quiz'); await pause(p, 600);
  } else {
    const qs = [...QUIZ].sort(() => Math.random() - .5).slice(0, 3); let score = 0;
    for (let k = 0; k < qs.length; k++) {
      const q0 = qs[k], ord = [0,1,2].sort(() => Math.random() - .5), q = {q:q0.q, o:ord.map(i => q0.o[i]), a:ord.indexOf(q0.a)};
      open(`<span class="tag warn">PLACEHOLDER QUIZ · ${k + 1}/3</span><h2>${careerOnly ? 'JOB INTERVIEW' : 'QUIZ'}</h2><p style="font-size:17px">${q.q}</p>
        <div class="opts">${q.o.map((o, i) => `<button class="btn" data-i="${i}">${o}</button>`).join('')}</div>`);
      const i = await new Promise(r => sheet.querySelectorAll('.opts .btn').forEach(b => b.addEventListener('click', () => r(+b.dataset.i), {once:true})));
      const bs = sheet.querySelectorAll('.opts .btn'); bs[q.a].classList.add('ok'); if (i !== q.a) bs[i].classList.add('bad'); else score++;
      await sleep(900);
    }
    close(); pass = score >= 2;
    if (!pass) { await info('QUIZ FAILED', `<p>${score}/3 correct. You need 2 to win an accessory.</p>`); return; }
    const a = giveAccessory(p); const g = careerOnly ? 0 : reward(p, 75, mult, 'Quiz');
    await info('QUIZ PASSED', `<p>${score}/3 correct.</p><p>You win the accessory <b>${esc(a)}</b>${g ? ` and ${g} tokens` : ''}.</p>`);
    return;
  }
  if (pass) { const a = giveAccessory(p); if (!careerOnly) reward(p, 75, mult, 'Quiz'); say(p, `wins accessory: ${a}`); await pause(p, 600); }
}

/* ---------- chance decks ---------- */
async function showCard(p, img, tag, alt, btn){
  if (p.bot) { if (speedF() < 50) { $('#bpWheel').innerHTML = `<img class="miniCard" src="${img}" alt="">`; } say(p, `draws ${tag}: ${alt}`, true); await pause(p, 1100); return; }
  open(`<span class="tag">${tag}</span><img class="cardImg" src="${img}" alt="${esc(alt)}"><button class="btn primary" id="ok">APPLY: ${btn}</button>`);
  await waitClick('#ok'); close();
}
async function drawChance(p){
  const c = force.chance != null ? D.chance.find(x => x.n === force.chance) : pick(D.chance); delete force.chance;
  await showCard(p, c.file, `CHANCE · ${c.category}`, `${c.title}: ${c.text}`, c.badge);
  switch (c.n) {
    case 1: p.extra = true; say(p, 'Spin again!'); break;
    case 2: reward(p, 200, 1, 'Golden Paw'); break;
    case 3: p.mult = 2; hud(); say(p, 'Next reward x2'); break;
    case 4: p.mult = 3; hud(); say(p, 'Next reward x3'); break;
    case 5: p.shield = true; hud(); say(p, 'Royal Shield is up'); break;
    case 6: await steal(p, pick([50, 100, 150]), 'SURPRISE RAID'); break;
    case 7: await steal(p, 100, 'PICKPOCKET PUP'); break;
    case 8: { const n = 1 + rnd(3); for (let k = 0; k < n; k++) await buildingVisit(p, 1, `City tour ${k + 1}/${n}`); break; }
    case 9: await moveTo(p, nextOfType(p, 'building')); reward(p, 100, 1, 'Bank interest'); break;
    case 10: p.skip = true; hud(); say(p, 'loses the next turn'); break;
    case 11: addTokens(p, -50, 'Parking ticket'); break;
    case 12: await moveSteps(p, -3); say(p, 'Moved back 3'); break;
    case 13: { const a = giveAccessory(p); say(p, 'Free accessory: ' + a); break; }
    case 14:
      if (p.shield) { p.shield = false; hud(); say(p, 'Shield blocked the Pyromaniac!'); }
      else if (p.acc.length) { const a = p.acc.splice(rnd(p.acc.length), 1)[0]; const k = p.career.items.indexOf(a); if (k >= 0) p.career.items.splice(k, 1); hud(); say(p, 'Burned: ' + a); }
      else say(p, 'Nothing to burn… lucky'); break;
    case 15: if (!p.bot) levelUp(); else { const pr = promote(p); if (pr) say(p, 'promoted: ' + pr, true); else reward(p, 150, 1, 'Level up'); } break;
    case 16: await moveTo(p, nextOfType(p, 'search')); await hiddenObject(p, 1); break;
  }
  await pause(p, 300);
}
async function drawCareer(p){
  const c = force.career != null ? CH.careerChance.find(x => x.n === force.career) : pick(CH.careerChance); delete force.career;
  await showCard(p, c.file, 'CAREER CHANCE', c.title, c.badge);
  const nb = owned(p).length;
  switch (c.n) {
    case 1: { const pr = promote(p); if (pr) { hud(); say(p, `Promoted: ${pr}!`, true); } else reward(p, 150, 1, 'Already at the top'); break; }
    case 2: case 9: {
      if (c.n === 9) { const poor = S.players.filter(q => q !== p).sort((a, b) => a.tokens - b.tokens)[0]; if (poor) { const g = Math.min(50, p.tokens); p.tokens -= g; poor.tokens += g; say(p, `gives ${g} tokens to ${poor === me() ? 'you' : poor.name}`); } }
      const a = giveAccessory(p); say(p, 'Career accessory: ' + a); break; }
    case 3: if (p.shield) { p.shield = false; say(p, 'Shield saved your uniform'); } else { const it = loseCareerItem(p); say(p, it ? 'Lost: ' + it : 'No uniform piece to lose'); } hud(); break;
    case 4: reward(p, 150, 1, 'Training Day'); break;
    case 5: reward(p, 100, 1, 'Big Tip'); break;
    case 6: await quiz(p, 1, true); break;
    case 7: addTokens(p, -75, 'Late for work'); break;
    case 8: addTokens(p, 50 * nb, `Franchise deal (${nb} businesses)`); break;
    case 10: addTokens(p, -25 * nb, `Health inspection (${nb} businesses)`); break;
  }
  await pause(p, 300);
}
function levelUp(){ S.levelKeys = Math.max(S.levelKeys, Math.min(3, S.levelKeys + 1)); hud(); toast(`Level ${S.levelKeys + 1} unlocked! Board coming soon`); }

/* ---------- hidden object ---------- */
async function hiddenObject(p, mult){
  if (p.bot) {
    const win = force.ho != null ? force.ho : chance(bp(p).ho); delete force.ho;
    if (win) { const a = giveAccessory(p); const g = reward(p, 100, mult, 'Search'); say(p, `finds all hidden objects: ${a} +${g}`, true); }
    else say(p, 'runs out of time on the hidden-object hunt');
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
    <p style="font-size:12px;color:#bfa55c;margin:0 0 6px">Swipe the picture to explore · use − / + to zoom · wrong taps cost 2s</p><div class="hoList" id="hl"></div><button class="btn primary" id="quit">GIVE UP</button>`, true);
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
  if (win) { const a = giveAccessory(p); const g = reward(p, 100, mult, 'Search'); await info('ALL FOUND!', `<p>You found all ${tot} items with ${left}s left.</p><p>You win the accessory <b>${esc(a)}</b> and ${g} tokens.</p>`); }
  else await info('TIME\'S UP', `<p>You found ${n}/${tot} items. Find them all within 90 seconds to win an accessory.</p>`);
}

/* ---------- setup screen ---------- */
function setupScreen(){
  const last = (S && S.cfg) || {charId:'chefzy', bots:3, diff:'normal', goalType:'tokens', goal:2500};
  const cfg = Object.assign({}, last);
  const tile = c => `<button class="charTile${c.id === cfg.charId ? ' sel' : ''}" data-v="${c.id}"><img src="${c.portrait}" alt="${esc(c.name)}"><b>${esc(c.name)}</b><small>${esc(c.career ? CH.careers[c.career].title : c.job)}</small></button>`;
  const goalOpts = [['tokens',2500,'First to 2500 tokens'],['rounds',10,'Most tokens · 10 rounds'],['rounds',20,'Most tokens · 20 rounds']];
  open(`<h2>NEW GAME</h2><span class="tag">1 · CHOOSE YOUR CHARACTER</span>
    <p class="sm">Dogzy Town basics</p><div class="charGrid" id="cg">${CH.basic.map(tile).join('')}</div>
    <p class="sm">Adoles-chiant teens</p><div class="charGrid" id="cg2">${CH.teens.map(tile).join('')}</div>
    <p id="charInfo" class="sm"></p>
    <span class="tag">2 · BOT OPPONENTS</span><div class="seg" id="sBots">${[1,2,3].map(n => `<button class="btn${n === cfg.bots ? ' on' : ''}" data-v="${n}">${n}</button>`).join('')}</div>
    <p class="sm" id="botNames"></p>
    <span class="tag">3 · DIFFICULTY</span><div class="seg" id="sDiff">${['easy','normal','hard'].map(d => `<button class="btn${d === cfg.diff ? ' on' : ''}" data-v="${d}">${d.toUpperCase()}</button>`).join('')}</div>
    <span class="tag">4 · WIN GOAL</span><div class="seg col" id="sGoal">${goalOpts.map(([t, v, l]) => `<button class="btn${t === cfg.goalType && v === cfg.goal ? ' on' : ''}" data-v="${t}:${v}">${l}</button>`).join('')}</div>
    <button class="btn primary" id="start">START GAME</button>`, true);
  const refresh = () => {
    sheet.querySelectorAll('.charTile').forEach(b => b.classList.toggle('sel', b.dataset.v === cfg.charId));
    const c = charById(cfg.charId);
    sheet.querySelector('#charInfo').innerHTML = `<b>${esc(c.name)}</b> · ${esc(c.job)} · ${c.career ? 'Career: ' + CH.careers[c.career].title + ' (5 levels)' : c.cardItems ? 'Career: Basic → ' + esc(c.boss) + ' (5-level sheet TBD)' : 'Profession TBD'}`;
    const bots = ['pyromaniac','jouzy','waltzy','kelzy'].filter(id => id !== cfg.charId).slice(0, cfg.bots).map(id => { const b = charById(id); return `${b.name} (${PERSONA[b.persona].label.split(' ·')[0]})`; });
    sheet.querySelector('#botNames').textContent = 'Opponents: ' + bots.join(', ');
  };
  sheet.querySelectorAll('.charTile').forEach(b => b.onclick = () => { cfg.charId = b.dataset.v; refresh(); });
  const seg = (id, fn) => sheet.querySelectorAll(`#${id} .btn`).forEach(b => b.onclick = () => { sheet.querySelectorAll(`#${id} .btn`).forEach(x => x.classList.remove('on')); b.classList.add('on'); fn(b.dataset.v); refresh(); });
  seg('sBots', v => cfg.bots = +v); seg('sDiff', v => cfg.diff = v); seg('sGoal', v => { const [t, n] = v.split(':'); cfg.goalType = t; cfg.goal = +n; });
  refresh();
  sheet.querySelector('#start').onclick = () => { close(); newGame(cfg); $('#btnSpin').disabled = false; };
}

/* ---------- other screens ---------- */
$('#btnLevels').onclick = () => {
  const K = S ? S.levelKeys : 0;
  const L = [['1','Basic Cook','Night board: Police, Bank, Hospital, Art Gallery, Grocery, Gas Station, School, Park', true],
    ['2','Head Chef','Premium restaurants, mall, marina', K >= 1],['3','Manager','Business center, hotel, casino, art gallery', K >= 2],['4','Owner & Mayor','Luxury towers, arena, international port', K >= 3]];
  open(`<h2>LEVELS</h2><img class="cardImg" src="assets/levels.png" alt="Levels overview">
    <div class="lvList">${L.map(([n, t, d, u]) => `<div class="${u ? '' : 'locked'}"><span><b>Level ${n} · ${t}</b><br><small>${d}</small></span><span>${n === '1' ? 'PLAYING' : u ? 'UNLOCKED · SOON' : '🔒 LOCKED'}</span></div>`).join('')}</div>
    <button class="btn primary" id="ok">BACK</button>`, true);
  waitClick('#ok').then(close);
};
function careerHTML(p){
  const c = charById(p.char), car = careerOf(p);
  if (car) {
    return `<span class="tag">CAREER · ${esc(car.title.toUpperCase())}</span><p><i>${esc(car.motto)}</i></p><img class="cardImg sheetImg" src="${car.sheet}" alt="${esc(car.title)} profession evolution sheet">
      <div class="career">${car.levels.map((L, k) => { const lv = k + 1, st = lv < p.career.lvl ? 'done' : lv === p.career.lvl ? 'cur' : '';
        return `<div class="${st}"><b>Level ${lv} · ${esc(L.name)}</b> <small>${esc(L.sub)} · ${esc(L.env)}</small><ul>${L.items.map(it => `<li class="${lv < p.career.lvl || (lv === p.career.lvl && p.career.items.includes(it)) ? 'got' : ''}">${esc(it)}</li>`).join('')}</ul></div>`; }).join('')}</div>`;
  }
  if (c.cardItems) {
    return `<span class="tag">CAREER · ${esc(c.job.toUpperCase())}</span><img class="cardImg" src="${c.card}" alt="${esc(c.name)} character card">
      <div class="career"><div class="${p.career.lvl >= 2 ? 'done' : 'cur'}"><b>Basic ${esc(c.job)} → ${esc(c.boss)}</b><ul>${c.cardItems.map(it => `<li class="${p.career.lvl >= 2 || p.career.items.includes(it) ? 'got' : ''}">${esc(it)}</li>`).join('')}</ul></div>
      <div><b>Full 5-level profession sheet</b> <small>TBD</small></div></div>`;
  }
  return `<span class="tag">CAREER</span><p>Profession TBD (no career sheet yet).</p>`;
}
$('#btnBag').onclick = () => {
  if (!S) { setupScreen(); return; }
  const p = me(), c = charById(p.char);
  const biz = owned(p).map(([f, o]) => { const b = D.buildings.find(x => x.file === f); return `<span>${b.name} ${o.lvl}/5 · rent ${rentOf(b, o)}${profMatch(p, b) ? ' ★' : ''}</span>`; }).join('') || '<span>None yet</span>';
  open(`<div class="prof"><img src="${c.portrait}" alt=""><div><h2>${esc(c.name)}</h2><p>${esc(careerTitle(p))}</p></div></div>
    <p>Tokens <b>${p.tokens}</b> · Shield <b>${p.shield ? 'ON' : 'OFF'}</b> · Board level <b>${S.levelKeys + 1}</b></p>
    <button class="btn" id="shield" ${p.shield || p.tokens < SHIELD_COST || S.cur !== 0 || busy ? 'disabled' : ''} style="width:100%">BUY SHIELD · ${SHIELD_COST} tokens</button>
    ${careerHTML(p)}
    <span class="tag">ALL ACCESSORIES</span><div class="bagGrid">${p.acc.map(a => `<span>${esc(a)}</span>`).join('') || '<span>None yet</span>'}</div>
    <span class="tag">YOUR BUSINESSES (★ profession bonus)</span><div class="bagGrid">${biz}</div>
    <button class="btn primary" id="ok">BACK</button><button class="btn" id="ng" style="margin-top:10px;width:100%">NEW GAME</button><button class="btn" id="rs" style="margin-top:10px;width:100%">RESET PROGRESS</button>`, true);
  waitClick('#ok').then(close);
  sheet.querySelector('#shield').onclick = () => { if (!p.shield && p.tokens >= SHIELD_COST) { p.tokens -= SHIELD_COST; p.shield = true; hud(); close(); toast('Shield is up'); } };
  sheet.querySelector('#ng').onclick = () => { if (!busy) setupScreen(); };
  sheet.querySelector('#rs').onclick = () => { if (confirm('Reset all progress?')) window.DZ.reset(); };
};
$('#btnSpin').onclick = humanTurn;
window.DZ.turn = humanTurn;
window.DZ.hidden = () => hiddenObject(me(), 1);
window.DZ.chance = () => drawChance(me());
window.DZ.setup = setupScreen;
// balance/test helper: lets a bot brain play the human seat for N turns at skip speed
window.DZ.sim = async (n) => { const p = me(), old = prefs.speed; prefs.speed = 'skip'; p.bot = true; p.persona = 'balanced';
  try { for (let k = 0; k < n && !S.over; k++) { await playTurn(p); await endTurn(); await runBots(); } } finally { p.bot = false; p.persona = null; prefs.speed = old; close(); hud(); } return S; };

window.addEventListener('resize', layout);
document.getElementById('boardImg').addEventListener('load', layout);
speedLabel();
if (S) { renderPawns(); hud(); layout();
  if (S.over) { finish(); }
  else if (S.cur !== 0) { busy = true; $('#btnSpin').disabled = true; runBots().finally(() => { busy = false; $('#btnSpin').disabled = !!S.over; hud(); }); }
  else log(`Round ${S.round} · your turn. Tap SPIN.`);
} else { layout(); setupScreen(); }
})();
