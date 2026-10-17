/* The Adoles-chiant of Dogzy Town — prototype (vanilla JS, offline) */
(function(){
'use strict';
const D = window.DZ_DATA;
const WP = D.board.waypoints;
const SAVE_KEY = 'dogzy-adoleschiant-v1';
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const params = new URLSearchParams(location.search);

/* ---------- state ---------- */
const DEFAULT = {tokens:500, accessories:[], shield:false, level:1, levelKeys:0, pos:0, pendingMult:1,
  skipTurn:false, upgrades:{}, turn:0, rival:{name:'The Pyromaniac', tokens:800}, extraSpin:false};
let S = load();
function load(){ try{ const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if(s) return Object.assign({}, DEFAULT, s); }catch(e){} return JSON.parse(JSON.stringify(DEFAULT)); }
function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }

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
  {label:'CHANCE', k:'chance'}, {label:'STEAL 100', k:'steal', v:100}, {label:'x3', k:'mult', v:3}, {label:'VISIT 3', k:'visit', v:3}];
const SPECIAL = new Set(['building','search','quiz','coin','penalty']);

/* debug hooks (used by tests): window.DZ.force = {w1: index, w2: index, chance: n} */
const force = {};
window.DZ = {state:()=>S, force, data:D, reset:()=>{localStorage.removeItem(SAVE_KEY); location.reload();}};

/* ---------- HUD ---------- */
function hud(){
  $('#hTokens').textContent = S.tokens;
  $('#hAcc').textContent = S.accessories.length;
  $('#hShield').textContent = S.shield ? 'ON' : 'OFF';
  $('#hShield').style.color = S.shield ? '#9ff58a' : '';
  $('#hLevel').textContent = S.level;
  $('#hMult').textContent = S.pendingMult > 1 ? `Next reward x${S.pendingMult}` : '';
  $('#hRival').textContent = `Rival ${S.rival.name}: ${S.rival.tokens}`;
  $('#hTurn').textContent = `Turn ${S.turn}`;
  save();
}
function log(t){ $('#log').textContent = t; }
let toastT;
function toast(t){ const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(()=>el.classList.remove('show'), 1900); }
function addTokens(n, why){
  S.tokens = Math.max(0, S.tokens + n); hud();
  toast(`${n >= 0 ? '+' : ''}${n} tokens${why ? ' · ' + why : ''}`);
}
function reward(base, mult, why){ // applies wheel multiplier + pending chance multiplier
  let m = (mult || 1) * S.pendingMult; S.pendingMult = 1;
  addTokens(base * m, why + (m > 1 ? ` (x${m})` : ''));
  return base * m;
}
function giveAccessory(){ const free = ACCESSORIES.filter(x => !S.accessories.includes(x)); const a = pick(free.length ? free : ACCESSORIES); S.accessories.push(a); hud(); return a; }

/* ---------- board layout ---------- */
const board = $('#board'), wrap = $('#boardWrap'), pawn = $('#pawn');
function layout(){
  const W = wrap.clientWidth, H = wrap.clientHeight;
  let scale = Math.min(W / D.board.w, H / D.board.h);
  if (W < H) scale = H / D.board.h * 0.98; // portrait phone: fill height, pan horizontally
  board.style.width = Math.round(D.board.w * scale) + 'px';
  board.style.height = Math.round(D.board.h * scale) + 'px';
  board.style.marginTop = Math.max(0, (H - D.board.h * scale) / 2) + 'px';
  placePawn(S.pos, true);
}
function placePawn(i, instant){
  const p = WP[i];
  pawn.style.transition = instant ? 'none' : '';
  pawn.style.left = (p.x / D.board.w * 100) + '%';
  pawn.style.top = (p.y / D.board.h * 100) + '%';
  if (instant) { void pawn.offsetWidth; pawn.style.transition = ''; }
  follow(i, instant);
}
function follow(i, instant){
  const p = WP[i], bw = board.clientWidth;
  const target = p.x / D.board.w * bw - wrap.clientWidth / 2;
  wrap.style.scrollBehavior = instant ? 'auto' : 'smooth';
  wrap.scrollLeft = target;
}
if (params.has('debug')) {
  const L = $('#wpLayer'); L.classList.add('debug');
  WP.forEach((p, i) => { const d = document.createElement('div'); d.className = 'wp'; d.style.left = p.x / D.board.w * 100 + '%'; d.style.top = p.y / D.board.h * 100 + '%'; d.innerHTML = `<span>${i}${p.type[0]}</span>`; L.appendChild(d); });
}
async function moveSteps(n){
  const dir = n < 0 ? -1 : 1;
  for (let s = 0; s < Math.abs(n); s++) {
    S.pos = (S.pos + dir + WP.length) % WP.length;
    pawn.classList.remove('hop'); void pawn.offsetWidth; pawn.classList.add('hop');
    placePawn(S.pos);
    if (dir > 0 && S.pos === 0 && s < Math.abs(n) - 1) addTokens(100, 'Passed START');
    await sleep(200);
  }
  if (dir > 0 && S.pos === 0) addTokens(100, 'Landed on START');
  hud();
}
async function moveTo(i){ const n = (i - S.pos + WP.length) % WP.length; await moveSteps(n); }
function nextOfType(t){ for (let k = 1; k <= WP.length; k++) { const j = (S.pos + k) % WP.length; if (WP[j].type === t) return j; } return S.pos; }

/* ---------- modal helpers ---------- */
const modal = $('#modal'), sheet = $('#sheet');
function open(html, wide){ sheet.className = 'sheet' + (wide ? ' wide' : ''); sheet.innerHTML = html; modal.classList.remove('hidden'); sheet.scrollTop = 0; }
function close(){ modal.classList.add('hidden'); sheet.innerHTML = ''; }
function waitClick(sel){ return new Promise(r => sheet.querySelector(sel).addEventListener('click', r, {once:true})); }
async function info(title, body, btn){
  open(`<h2>${title}</h2>${body}<button class="btn primary" id="ok">${btn || 'CONTINUE'}</button>`);
  await waitClick('#ok'); close();
}

/* ---------- wheels ---------- */
function wheelSVG(labels, opts){
  const n = labels.length, a = 360 / n, c = 150, r = 140;
  const pt = (deg, rad) => [c + rad * Math.sin(deg * Math.PI / 180), c - rad * Math.cos(deg * Math.PI / 180)];
  let segs = '', txt = '', studs = '';
  labels.forEach((l, i) => {
    const [x1, y1] = pt(i * a, r), [x2, y2] = pt((i + 1) * a, r);
    const fill = i % 2 ? 'url(#gGold)' : '#0d0a05';
    segs += `<path d="M${c},${c} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Z" fill="${fill}" stroke="#f6dd8a" stroke-width="2"/>`;
    const m = i * a + a / 2, [tx, ty] = pt(m, r * (opts.small ? 0.66 : 0.68));
    txt += `<text x="${tx}" y="${ty}" transform="rotate(${m} ${tx} ${ty})" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,serif" font-weight="bold" font-size="${opts.small ? 15 : 34}" fill="${i % 2 ? '#1a1204' : '#f6dd8a'}">${l}</text>`;
  });
  for (let k = 0; k < 24; k++) { const [x, y] = pt(k * 15, 146); studs += `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff1b8"/>`; }
  return `<svg class="wheel" viewBox="0 0 300 300"><defs><linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe9a6"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#8a6a12"/></linearGradient></defs>
  <circle cx="150" cy="150" r="149" fill="#d4af37"/>${segs}${txt}${studs}
  <circle cx="150" cy="150" r="34" fill="#0d0a05" stroke="url(#gGold)" stroke-width="5"/>
  <g fill="#d4af37" transform="translate(150 150) scale(.9) translate(-32 -30)"><ellipse cx="32" cy="40" rx="11" ry="9"/><ellipse cx="19" cy="27" rx="5" ry="6.5"/><ellipse cx="27" cy="19" rx="5" ry="6.5"/><ellipse cx="37" cy="19" rx="5" ry="6.5"/><ellipse cx="45" cy="27" rx="5" ry="6.5"/></g></svg>`;
}
async function spinWheel(title, sub, labels, idx, small){
  open(`<h2>${title}</h2><p>${sub}</p><div class="wheelBox"><div class="pointer"></div>${wheelSVG(labels, {small})}</div><div class="result" id="wres">&nbsp;</div><button class="btn primary" id="go">SPIN</button>`);
  await waitClick('#go');
  const b = sheet.querySelector('#go'); b.disabled = true; b.textContent = 'SPINNING…';
  const a = 360 / labels.length, jitter = (Math.random() - .5) * a * 0.6;
  const rot = 360 * 6 - (idx * a + a / 2) + jitter;
  const w = sheet.querySelector('svg.wheel');
  requestAnimationFrame(() => { w.style.transform = `rotate(${rot}deg)`; });
  await sleep(3800);
  sheet.querySelector('#wres').textContent = labels[idx];
  b.disabled = false; b.textContent = 'OK';
  await waitClick('#go'); close();
}

/* ---------- turn ---------- */
let busy = false;
async function turn(){
  if (busy) return; busy = true; $('#btnSpin').disabled = true;
  try {
    S.turn++; hud();
    if (S.skipTurn) { S.skipTurn = false; hud(); await info('Emergency Room', '<p>You are still recovering at the Hospital. This turn is skipped.</p>'); return; }
    do {
      S.extraSpin = false;
      const i1 = force.w1 != null ? force.w1 : rnd(6); delete force.w1;
      await spinWheel('OUTER WHEEL', 'Spin to see how many spaces you move.', W1, i1);
      const steps = i1 + 1; log(`Moving ${steps} space${steps > 1 ? 's' : ''}…`);
      await moveSteps(steps);
      await sleep(900);
      await resolveSpace();
      await rivalMove();
    } while (S.extraSpin);
  } finally { busy = false; $('#btnSpin').disabled = false; hud(); }
}

async function resolveSpace(){
  const sp = WP[S.pos], t = sp.type;
  log(`Space ${S.pos}: ${t.toUpperCase()}`);
  if (!SPECIAL.has(t)) { if (t === 'empty') log('Empty space — move along.'); return; }
  const i2 = force.w2 != null ? force.w2 : rnd(W2.length); delete force.w2;
  await spinWheel('BONUS WHEEL', `You landed on a <b>${t.toUpperCase()}</b> space. Spin the bonus wheel!`, W2.map(s => s.label), i2, true);
  const eff = W2[i2], mult = eff.k === 'mult' ? eff.v : 1;
  // main space effect
  if (t === 'building') await buildingVisit(mult);
  else if (t === 'search') await hiddenObject(mult);
  else if (t === 'quiz') await quiz(mult);
  else if (t === 'coin') { const g = reward(100, mult, 'Coin space'); await info('COIN SPACE', `<p>You collect <b>${g}</b> tokens.</p>`); }
  else if (t === 'penalty') {
    addTokens(-50, 'Penalty');
    if (mult > 1) { S.pendingMult = Math.max(S.pendingMult, mult); hud(); }
    await info('PENALTY', `<p>You lose <b>50</b> tokens.</p>${mult > 1 ? `<p>Lucky break: your x${mult} is saved for your next reward.</p>` : ''}`);
  }
  // bonus-wheel extras
  if (eff.k === 'visit') { for (let k = 0; k < eff.v; k++) await buildingVisit(1, `City tour ${k + 1}/${eff.v}`); }
  else if (eff.k === 'steal') await steal(eff.v);
  else if (eff.k === 'chance') await drawChance();
}

async function steal(n, label){
  const got = Math.min(n, S.rival.tokens); S.rival.tokens -= got; addTokens(got, 'Stolen');
  await info(label || 'RAID!', `<p>You raid <b>${S.rival.name}</b>'s village and steal <b>${got}</b> tokens.</p>`);
}
async function rivalMove(){
  if (S.turn % 5 !== 0) return;
  if (S.shield) { S.shield = false; hud(); await info('RIVAL RAID BLOCKED', `<p>${S.rival.name} tried to raid your village, but your shield blocked it. The shield is used up.</p>`); return; }
  const n = Math.min(75, S.tokens); S.tokens -= n; S.rival.tokens += n; hud();
  await info('RIVAL RAID', `<p>${S.rival.name} raided your village and stole <b>${n}</b> tokens. A shield would have blocked it.</p>`);
}

/* ---------- building ---------- */
async function buildingVisit(mult, label){
  const b = pick(D.buildings), lvl = S.upgrades[b.file] || 0, task = pick(TASKS);
  const bars = n => Array.from({length:5}, (_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('');
  open(`<span class="tag">${label || 'BUILDING VISIT'}</span><h2>${b.name.toUpperCase()}</h2><img class="cardImg" src="${b.file}" alt="${b.name}">
    <p>Task: <b>${task}</b></p><div class="progress">${bars(lvl)}</div><p>Upgrades ${lvl}/5</p>
    <button class="btn primary" id="ok">TASK DONE ✓</button>`);
  await waitClick('#ok');
  const nl = Math.min(5, lvl + 1); S.upgrades[b.file] = nl;
  const g = reward(50, mult, b.name);
  let extra = '';
  if (nl === 5 && lvl < 5) { addTokens(250, 'Fully upgraded'); extra = '<p><b>Fully upgraded! +250 bonus</b></p>'; }
  sheet.querySelector('.progress').innerHTML = bars(nl);
  sheet.querySelectorAll('p')[1].innerHTML = `Upgrades ${nl}/5 · +${g} tokens`;
  const btn = sheet.querySelector('#ok'); btn.insertAdjacentHTML('beforebegin', extra); btn.textContent = 'CONTINUE';
  await waitClick('#ok'); close();
}

/* ---------- quiz (placeholder) ---------- */
async function quiz(mult){
  const qs = [...QUIZ].sort(() => Math.random() - .5).slice(0, 3); let score = 0;
  for (let k = 0; k < qs.length; k++) {
    const q0 = qs[k], ord = [0,1,2].sort(() => Math.random() - .5), q = {q:q0.q, o:ord.map(i => q0.o[i]), a:ord.indexOf(q0.a)};
    open(`<span class="tag warn">PLACEHOLDER QUIZ · ${k + 1}/3</span><h2>QUIZ</h2><p style="font-size:17px">${q.q}</p>
      <div class="opts">${q.o.map((o, i) => `<button class="btn" data-i="${i}">${o}</button>`).join('')}</div>`);
    const i = await new Promise(r => sheet.querySelectorAll('.opts .btn').forEach(b => b.addEventListener('click', () => r(+b.dataset.i), {once:true})));
    const bs = sheet.querySelectorAll('.opts .btn'); bs[q.a].classList.add('ok'); if (i !== q.a) bs[i].classList.add('bad'); else score++;
    await sleep(900);
  }
  close();
  if (score >= 2) { const a = giveAccessory(); const g = reward(75, mult, 'Quiz'); await info('QUIZ PASSED', `<p>${score}/3 correct.</p><p>You win the accessory <b>${a}</b> and ${g} tokens.</p>`); }
  else await info('QUIZ FAILED', `<p>${score}/3 correct. You need 2 to win an accessory.</p>`);
}

/* ---------- chance ---------- */
async function drawChance(){
  const c = force.chance != null ? D.chance.find(x => x.n === force.chance) : pick(D.chance); delete force.chance;
  open(`<span class="tag">CHANCE · ${c.category}</span><img class="cardImg" src="${c.file}" alt="${c.title}: ${c.text}"><button class="btn primary" id="ok">APPLY: ${c.badge}</button>`);
  await waitClick('#ok'); close();
  switch (c.n) {
    case 1: S.extraSpin = true; toast('Spin again!'); break;
    case 2: reward(200, 1, 'Golden Paw'); break;
    case 3: S.pendingMult = 2; hud(); toast('Next reward x2'); break;
    case 4: S.pendingMult = 3; hud(); toast('Next reward x3'); break;
    case 5: S.shield = true; hud(); toast('Royal Shield is up'); break;
    case 6: await steal(pick([50, 100, 150]), 'SURPRISE RAID'); break;
    case 7: await steal(100, 'PICKPOCKET PUP'); break;
    case 8: { const n = 1 + rnd(3); for (let k = 0; k < n; k++) await buildingVisit(1, `City tour ${k + 1}/${n}`); break; }
    case 9: await moveTo(nextOfType('building')); reward(100, 1, 'Bank interest'); break;
    case 10: S.skipTurn = true; hud(); toast('You lose your next turn'); break;
    case 11: addTokens(-50, 'Parking ticket'); break;
    case 12: await moveSteps(-3); toast('Moved back 3'); break;
    case 13: { const a = giveAccessory(); toast('Free accessory: ' + a); break; }
    case 14:
      if (S.shield) { S.shield = false; hud(); toast('Shield blocked the Pyromaniac!'); }
      else if (S.accessories.length) { const a = S.accessories.splice(rnd(S.accessories.length), 1)[0]; hud(); toast('Burned: ' + a); }
      else toast('Nothing to burn… lucky you'); break;
    case 15: levelUp(); break;
    case 16: await moveTo(nextOfType('search')); await hiddenObject(1); break;
  }
}
function levelUp(){
  S.levelKeys = Math.max(S.levelKeys, Math.min(3, S.level));
  hud(); toast('Level 2 unlocked! Board coming soon');
}

/* ---------- hidden object ---------- */
async function hiddenObject(mult){
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
  if (win) { const a = giveAccessory(); const g = reward(100, mult, 'Search'); await info('ALL FOUND!', `<p>You found all ${tot} items with ${left}s left.</p><p>You win the accessory <b>${a}</b> and ${g} tokens.</p>`); }
  else await info('TIME\'S UP', `<p>You found ${n}/${tot} items. Find them all within 90 seconds to win an accessory.</p>`);
}

/* ---------- screens ---------- */
$('#btnLevels').onclick = () => {
  const L = [['1','Basic Cook','Night board: Police, Bank, Hospital, Art Gallery, Grocery, Gas Station, School, Park', true],
    ['2','Head Chef','Premium restaurants, mall, marina', S.levelKeys >= 1],['3','Manager','Business center, hotel, casino, art gallery', S.levelKeys >= 2],['4','Owner & Mayor','Luxury towers, arena, international port', S.levelKeys >= 3]];
  open(`<h2>LEVELS</h2><img class="cardImg" src="assets/levels.png" alt="Levels overview">
    <div class="lvList">${L.map(([n, t, d, u]) => `<div class="${u ? '' : 'locked'}"><span><b>Level ${n} · ${t}</b><br><small>${d}</small></span><span>${n === '1' ? 'PLAYING' : u ? 'UNLOCKED · SOON' : '🔒 LOCKED'}</span></div>`).join('')}</div>
    <button class="btn primary" id="ok">BACK</button>`, true);
  waitClick('#ok').then(close);
};
$('#btnBag').onclick = () => {
  const ups = Object.entries(S.upgrades).map(([f, n]) => `<span>${(D.buildings.find(b => b.file === f) || {name:f}).name} ${n}/5</span>`).join('') || '<span>None yet</span>';
  open(`<h2>YOUR BAG</h2><p>Tokens <b>${S.tokens}</b> · Shield <b>${S.shield ? 'ON' : 'OFF'}</b> · Level <b>${S.level}</b></p>
    <span class="tag">ACCESSORIES</span><div class="bagGrid">${S.accessories.map(a => `<span>${a}</span>`).join('') || '<span>None yet</span>'}</div>
    <span class="tag">BUILDING UPGRADES</span><div class="bagGrid">${ups}</div>
    <button class="btn primary" id="ok">BACK</button><button class="btn" id="rs" style="margin-top:10px;width:100%">RESET PROGRESS</button>`);
  waitClick('#ok').then(close);
  sheet.querySelector('#rs').onclick = () => { if (confirm('Reset all progress?')) window.DZ.reset(); };
};
$('#btnSpin').onclick = turn;
window.DZ.turn = turn; window.DZ.hidden = () => hiddenObject(1); window.DZ.chance = drawChance;

window.addEventListener('resize', layout);
document.getElementById('boardImg').addEventListener('load', layout);
hud(); layout(); log('Tap SPIN to roll the outer wheel.');
})();
