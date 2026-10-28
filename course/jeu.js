// Dogzy Burnout — prototype de course arcade en pseudo-3D (canvas 2D, sans dépendance).
// Idées clés : vitesse, drift qui remplit le boost, frôlements du trafic, takedowns des rivaux.
(() => {
"use strict";
const C = CONFIG, SEG = C.segLongueur, ROUTE = C.largeurRoute;
const cv = document.getElementById("c"), ctx = cv.getContext("2d");
let W = 0, H = 0;
function redim() {
  const d = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.width = Math.floor(innerWidth * d); H = cv.height = Math.floor(innerHeight * d);
}
addEventListener("resize", redim); redim();

// ---------- Construction de la piste ----------
const segs = [];
C.trace.forEach(([n, courbe]) => {
  for (let i = 0; i < n; i++) {
    // Adoucit l'entrée et la sortie des virages
    const t = Math.min(i, n - 1 - i) / Math.min(8, n / 2);
    segs.push({ courbe: courbe * Math.min(1, t + 0.15) });
  }
});
const N = segs.length, LONG = N * SEG;
const mod = (a, m) => ((a % m) + m) % m;
const dist = (a, b) => { let d = mod(a - b, LONG); return d > LONG / 2 ? d - LONG : d; }; // distance signée a-b

// ---------- Entrées ----------
const touches = { g: false, d: false, b: false };
const clav = {};
addEventListener("keydown", e => { clav[e.code] = true; demarrerAudio(); if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault(); if (etat !== "course" && (e.code === "Enter" || e.code === "Space")) lancer(); });
addEventListener("keyup", e => { clav[e.code] = false; });
for (const id of ["g", "d", "b"]) {
  const el = document.getElementById(id);
  el.addEventListener("pointerdown", e => { touches[id] = true; el.classList.add("on"); demarrerAudio(); e.preventDefault(); });
  for (const ev of ["pointerup", "pointercancel", "pointerleave"]) el.addEventListener(ev, () => { touches[id] = false; el.classList.remove("on"); });
}
cv.addEventListener("pointerdown", () => { demarrerAudio(); if (etat !== "course") lancer(); });
const gauche = () => clav.ArrowLeft || clav.KeyA || clav.KeyQ || touches.g;
const droite = () => clav.ArrowRight || clav.KeyD || touches.d;
const veutBoost = () => clav.Space || clav.ShiftLeft || clav.ArrowUp || touches.b;

// ---------- Audio (moteur simple) ----------
let audio = null, osc = null, gain = null;
function demarrerAudio() {
  if (audio || !(window.AudioContext || window.webkitAudioContext)) return;
  try {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    osc = audio.createOscillator(); gain = audio.createGain();
    osc.type = "sawtooth"; gain.gain.value = 0.03;
    osc.connect(gain); gain.connect(audio.destination); osc.start();
  } catch (e) { audio = null; }
}
function bip(freq, duree = 0.15, vol = 0.08) {
  if (!audio) return;
  const o = audio.createOscillator(), g = audio.createGain();
  o.frequency.value = freq; g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duree);
  o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + duree);
}

// ---------- État du jeu ----------
let etat = "menu"; // menu | course | fin
let joueur, voitures = [], banniere, secousse = 0, temps = 0;
const COULEURS = ["#e8401c", "#2b7de9", "#f2c200", "#2fb86b", "#a23be0", "#ee6fb0", "#ffffff"];

function lancer() {
  joueur = { z: 0, x: 0, v: 0, boost: 0.3, drift: false, boosting: false, invinc: 0, score: 0, takedowns: 0, frolements: 0, tour: 1, total: 0, fin: false, angle: 0 };
  voitures = [];
  for (let i = 0; i < C.nbRivaux; i++)
    voitures.push({ type: "rival", z: 400 + (i >> 1) * 500, x: (i % 2 ? 0.45 : -0.45), voie: (i % 2 ? 0.45 : -0.45), v: 0, vMax: C.vitesseMax * (C.difficulte + (Math.random() - 0.5) * 0.08), couleur: COULEURS[i % COULEURS.length], etat: "ok", t: 0, total: 0 });
  for (let i = 0; i < C.nbTrafic; i++)
    voitures.push({ type: "trafic", z: 3000 + Math.random() * (LONG - 3500), x: [-0.55, -0.18, 0.18, 0.55][i % 4], v: C.vitesseMax * C.vitesseTrafic * (0.85 + Math.random() * 0.3), couleur: "#7a8794", etat: "ok", t: 0, passe: false });
  for (const c of voitures) c.total = c.z;
  banniere = { texte: "", t: 0 }; secousse = 0; temps = 0; etat = "course";
}
function annoncer(texte, couleur = "#fff") { banniere = { texte, couleur, t: 1.6 }; }

function rang() {
  let r = 1;
  for (const c of voitures) if (c.type === "rival" && c.total > joueur.total) r++;
  return r;
}

// ---------- Mise à jour ----------
function maj(dt) {
  temps += dt;
  const p = joueur, vmax = C.vitesseMax;
  const seg = segs[Math.floor(mod(p.z, LONG) / SEG)];
  const decompte = temps < 3;
  // Boost
  p.boosting = !decompte && !p.fin && veutBoost() && p.boost > C.boost.seuilActivation && p.invinc <= 0;
  if (p.boosting) p.boost = Math.max(0, p.boost - C.boost.drainParSeconde * dt);
  const cible = p.fin ? vmax * 0.3 : decompte ? 0 : vmax * (p.boosting ? C.multBoost : 1);
  const hors = Math.abs(p.x) > 1.05;
  const plafond = hors ? vmax * 0.4 : cible;
  if (p.v < plafond) p.v = Math.min(plafond, p.v + vmax * C.accel * (p.boosting ? 2.2 : 1) * dt);
  else p.v = Math.max(plafond, p.v - vmax * C.freinNaturel * 2 * dt);
  const pct = p.v / vmax;
  // Direction + force centrifuge
  const dir = (droite() ? 1 : 0) - (gauche() ? 1 : 0);
  p.x += dir * C.braquage * dt * Math.min(1, pct * 1.4);
  p.x -= seg.courbe * C.adherenceCourbe * pct * pct * dt * 0.18;
  p.x = Math.max(-2.6, Math.min(2.6, p.x));
  p.angle += ((dir * 0.35) - p.angle) * Math.min(1, dt * 8);
  // Drift : on braque fort à haute vitesse -> remplit le boost
  p.drift = dir !== 0 && pct > 0.6 && !hors;
  if (p.drift) {
    p.boost = Math.min(1, p.boost + C.boost.gainDrift * dt);
    p.score += C.points.driftParSeconde * dt;
  }
  p.invinc = Math.max(0, p.invinc - dt);
  p.z += p.v * dt; p.total += p.v * dt;
  if (p.total >= LONG * C.tours && !p.fin) { p.fin = true; annoncer("ARRIVÉE ! Position " + rang(), "#ffd400"); setTimeout(() => { etat = "fin"; }, 2500); }
  p.tour = Math.min(C.tours, Math.floor(p.total / LONG) + 1);
  secousse = Math.max(0, secousse - dt * 2.5) ;

  // Autres voitures
  for (const c of voitures) {
    if (c.etat === "crash") { c.t -= dt; c.x += c.dx * dt; c.z += c.v * dt; c.v *= 0.97; if (c.t <= 0) { c.etat = "ok"; c.v = 0; c.x = c.voie ?? c.x; c.z -= 800; c.t = 0; c.invisible = 0; } continue; }
    if (c.type === "trafic") { c.z += c.v * dt; if (c.z >= LONG) c.z -= LONG; }
    else {
      // IA du rival : vitesse + rattrapage discret, évite le trafic
      const ecart = dist(c.z, p.z);
      let vit = c.vMax * (ecart > 6000 ? 0.88 : ecart < -4000 ? 1.07 : 1);
      if (decompte) vit = 0;
      const sg = segs[Math.floor(mod(c.z, LONG) / SEG)];
      vit *= 1 - Math.min(0.15, Math.abs(sg.courbe) * 0.025);
      c.v += (vit - c.v) * Math.min(1, dt * 1.5);
      for (const o of voitures) {
        if (o === c || o.type !== "trafic") continue;
        const d = dist(o.z, c.z);
        if (d > 0 && d < 1400 && Math.abs(o.x - c.voie) < 0.3) { c.voie = c.voie > 0 ? -0.5 : 0.5; break; }
      }
      c.x += (c.voie - c.x) * Math.min(1, dt * 2);
      c.z += c.v * dt; c.total += c.v * dt; c.z = mod(c.z, LONG);
    }
    // Interactions avec le joueur
    if (c.etat !== "ok") continue;
    const dz = dist(c.z, p.z), dx = c.x - p.x;
    if (Math.abs(dz) < 260 && Math.abs(dx) < 0.28 && p.invinc <= 0) {
      if (c.type === "rival" && p.v > c.v * 1.02) takedown(c, dx);
      else if (c.type === "rival") { p.v *= 0.85; c.x += dx > 0 ? 0.05 : -0.05; p.x -= dx > 0 ? 0.05 : -0.05; }
      else crashJoueur();
    }
    if (c.type === "trafic") {
      // Frôlement : on dépasse un véhicule de très près sans le toucher
      if (c.passe && dz > 1200) c.passe = false;
      if (!c.passe && dz < 0 && dz > -600 && Math.abs(dx) < 0.5 && Math.abs(dx) > 0.2 && p.v > vmax * 0.5) {
        c.passe = true; p.frolements++; p.boost = Math.min(1, p.boost + C.boost.gainFrolement); p.score += C.points.frolement;
        annoncer("FRÔLEMENT !", "#7fe3ff"); bip(880, 0.1);
      }
    }
  }
  if (audio) { osc.frequency.value = 55 + pct * 170 + (p.boosting ? 60 : 0); gain.gain.value = etat === "course" ? 0.03 : 0; }
}

function takedown(c, dx) {
  const p = joueur;
  c.etat = "crash"; c.t = 2.2; c.dx = dx >= 0 ? 0.9 : -0.9; c.v = p.v * 0.9;
  p.takedowns++; p.score += C.points.takedown; p.boost = Math.min(1, p.boost + C.boost.gainTakedown);
  secousse = 1; annoncer("TAKEDOWN !", "#ff5030"); bip(140, 0.35, 0.15);
}
function crashJoueur() {
  const p = joueur;
  p.v *= 0.2; p.boost = 0; p.invinc = 1.5; secousse = 1.4;
  annoncer("CRASH !", "#ff2020"); bip(90, 0.5, 0.2);
}

// ---------- Rendu ----------
function quad(x1, y1, w1, x2, y2, w2, couleur) {
  ctx.fillStyle = couleur; ctx.beginPath();
  ctx.moveTo(x1 - w1, y1); ctx.lineTo(x2 - w2, y2); ctx.lineTo(x2 + w2, y2); ctx.lineTo(x1 + w1, y1); ctx.closePath(); ctx.fill();
}
function dessinerVoiture(sx, sy, larg, couleur, angle = 0, clignote = false, tourne = 0) {
  if (larg < 2) return;
  if (clignote && Math.floor(temps * 12) % 2) return;
  const h = larg * 0.55;
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(tourne);
  ctx.transform(1, 0, angle * 0.3, 1, 0, 0);
  ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(-larg / 2, -h * 0.05, larg, h * 0.12);   // ombre
  ctx.fillStyle = couleur; ctx.fillRect(-larg / 2, -h * 0.62, larg, h * 0.55);              // carrosserie
  ctx.fillStyle = "#1b2330"; ctx.fillRect(-larg * 0.36, -h, larg * 0.72, h * 0.42);        // lunette
  ctx.fillStyle = couleur; ctx.fillRect(-larg * 0.42, -h * 1.02, larg * 0.84, h * 0.1);   // toit
  ctx.fillStyle = "#ff2a2a"; ctx.fillRect(-larg * 0.48, -h * 0.5, larg * 0.16, h * 0.14); ctx.fillRect(larg * 0.32, -h * 0.5, larg * 0.16, h * 0.14); // feux
  ctx.fillStyle = "#111"; ctx.fillRect(-larg * 0.5, -h * 0.12, larg * 0.16, h * 0.12); ctx.fillRect(larg * 0.34, -h * 0.12, larg * 0.16, h * 0.12);   // roues
  ctx.restore();
}

function rendu() {
  const p = joueur || { z: 0, x: 0, v: 0, boost: 0, angle: 0, boosting: false, invinc: 0 };
  const pct = p.v / C.vitesseMax;
  const sh = secousse * 8 * (Math.random() - 0.5), sv = secousse * 6 * (Math.random() - 0.5);
  const horizon = H * 0.42 + sv;
  // Ciel
  const gr = ctx.createLinearGradient(0, 0, 0, horizon);
  gr.addColorStop(0, "#2a6fd6"); gr.addColorStop(1, "#ffb870");
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, horizon + 2);
  const base0 = Math.floor(mod(p.z, LONG) / SEG), segCourant = segs[base0];
  // Montagnes en parallaxe
  const decal = -(mod(p.z / 9000 + segCourant.courbe * 0.0, 1)) * W;
  ctx.fillStyle = "#4a5f8a";
  for (let k = -1; k < 3; k++) {
    ctx.beginPath(); ctx.moveTo(decal + k * W, horizon);
    for (let i = 0; i <= 8; i++) ctx.lineTo(decal + k * W + (i / 8) * W, horizon - H * (0.06 + 0.05 * Math.abs(Math.sin(i * 1.7 + 1))));
    ctx.lineTo(decal + (k + 1) * W, horizon); ctx.fill();
  }
  ctx.fillStyle = "#3b8c3b"; ctx.fillRect(0, horizon, W, H - horizon);

  // FOV dynamique : plus on va vite, plus le champ s'élargit
  const camProf = 1 / Math.tan(((80 + pct * 25 + (p.boosting ? 12 : 0)) * Math.PI / 180) / 2);
  const camH = 1100;
  const frac = mod(p.z, SEG) / SEG;
  const pts = [];
  let x = 0, dx = -segCourant.courbe * frac;
  for (let n = 0; n <= C.distanceAffichage; n++) {
    const s = segs[(base0 + n) % N];
    const z = Math.max(1, n * SEG - mod(p.z, SEG));
    const sc = camProf / (z / 1000);
    pts.push({ sx: W / 2 + sh + sc * (x - p.x * ROUTE) * W / 2 / 1000 * 1.0, sy: horizon + sc * camH * (H - horizon) / 1000 * 0.55, w: sc * ROUTE * W / 2 / 1000, sc });
    x += dx; dx += s.courbe * 12 * 1.0;
  }
  // Index des voitures par segment visible
  const parSeg = new Map();
  for (const c of voitures || []) {
    const d = mod(c.z - p.z, LONG), n = Math.floor((d + mod(p.z, SEG)) / SEG);
    if (n > 0 && n < C.distanceAffichage) { if (!parSeg.has(n)) parSeg.set(n, []); parSeg.get(n).push(c); }
  }
  for (let n = C.distanceAffichage - 1; n >= 1; n--) {
    const a = pts[n - 1], b = pts[n], pair = Math.floor((base0 + n) / 3) % 2 === 0;
    if (b.sy >= a.sy) continue;
    ctx.fillStyle = pair ? "#3b8c3b" : "#347f34"; ctx.fillRect(0, b.sy, W, a.sy - b.sy + 1);
    quad(a.sx, a.sy, a.w * 1.12, b.sx, b.sy, b.w * 1.12, pair ? "#e8e8e8" : "#d02020");   // bordures
    quad(a.sx, a.sy, a.w, b.sx, b.sy, b.w, pair ? "#5c5c66" : "#555560");                  // route
    if (pair) for (const l of [-0.33, 0.33]) quad(a.sx + a.w * l, a.sy, a.w * 0.012, b.sx + b.w * l, b.sy, b.w * 0.012, "#fff"); // marquage
    const liste = parSeg.get(n);
    if (liste) for (const c of liste) {
      const larg = b.w * 0.2, cx = b.sx + c.x * b.w;
      if (c.etat === "crash") {
        const lev = Math.sin(Math.min(1, (2.2 - c.t) * 1.2) * Math.PI) * larg * 1.2;
        dessinerVoiture(cx, b.sy - lev, larg, c.couleur, 0, false, (2.2 - c.t) * 7);
      } else dessinerVoiture(cx, b.sy, larg, c.couleur);
    }
  }
  // Voiture du joueur
  if (joueur) {
    const larg = W * 0.2, bondi = p.boosting ? Math.random() * 3 : 0;
    dessinerVoiture(W / 2 + sh + p.angle * W * 0.02, H * 0.86 + sv + bondi, larg, "#e8401c", p.angle * 1.5, p.invinc > 0);
    if (p.boosting) { // flammes
      ctx.fillStyle = "#ffb020"; ctx.beginPath(); ctx.moveTo(W / 2 - larg * 0.1, H * 0.86); ctx.lineTo(W / 2, H * 0.86 + larg * (0.3 + Math.random() * 0.3)); ctx.lineTo(W / 2 + larg * 0.1, H * 0.86); ctx.fill();
    }
  }
  // Lignes de vitesse
  if (pct > 0.7 || (p.boosting)) {
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2;
    const nb = 18;
    for (let i = 0; i < nb; i++) {
      const ang = Math.random() * Math.PI * 2, r1 = Math.min(W, H) * (0.35 + Math.random() * 0.2), r2 = r1 * (1.25 + Math.random() * 0.4);
      ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(ang) * r1, H / 2 + Math.sin(ang) * r1 * 0.8); ctx.lineTo(W / 2 + Math.cos(ang) * r2, H / 2 + Math.sin(ang) * r2 * 0.8); ctx.stroke();
    }
  }
  hud(p, pct);
}

function texte(t, x, y, taille, couleur = "#fff", align = "left") {
  ctx.font = `800 ${taille}px system-ui,sans-serif`; ctx.textAlign = align; ctx.lineWidth = taille / 8;
  ctx.strokeStyle = "#000"; ctx.strokeText(t, x, y); ctx.fillStyle = couleur; ctx.fillText(t, x, y);
}
function hud(p, pct) {
  const u = Math.min(W, H) / 20;
  if (etat === "menu") {
    texte("DOGZY BURNOUT", W / 2, H * 0.3, u * 1.8, "#ffd400", "center");
    texte("Drift • Frôle le trafic • Fais des takedowns", W / 2, H * 0.38, u * 0.7, "#fff", "center");
    texte("◀ ▶ / flèches : diriger   BOOST / Espace : turbo", W / 2, H * 0.44, u * 0.6, "#ddd", "center");
    texte("Touche l'écran ou Entrée pour démarrer", W / 2, H * 0.55, u * 0.9, "#fff", "center");
    return;
  }
  texte(Math.round(pct * 280 * (p.boosting ? 1 : 1)) + " km/h", W - u * 0.5, u * 1.6, u * 1.2, p.boosting ? "#ffb020" : "#fff", "right");
  texte("POS " + rang() + "/" + (C.nbRivaux + 1), u * 0.5, u * 1.4, u, "#ffd400");
  texte("Tour " + p.tour + "/" + C.tours, u * 0.5, u * 2.5, u * 0.7);
  texte("Score " + Math.round(p.score), u * 0.5, u * 3.4, u * 0.7);
  // Jauge de boost
  const bw = W * 0.5, bx = W / 2 - bw / 2, by = u * 0.6;
  ctx.fillStyle = "#0009"; ctx.fillRect(bx, by, bw, u * 0.6);
  ctx.fillStyle = p.boost > 0.999 ? "#ffe34d" : "#ff8a1c"; ctx.fillRect(bx, by, bw * p.boost, u * 0.6);
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, u * 0.6);
  if (banniere && banniere.t > 0) { texte(banniere.texte, W / 2, H * 0.3, u * 1.6, banniere.couleur, "center"); }
  if (temps < 3 && etat === "course") texte(String(3 - Math.floor(temps)), W / 2, H * 0.5, u * 4, "#fff", "center");
  if (etat === "fin") {
    ctx.fillStyle = "#000b"; ctx.fillRect(0, 0, W, H);
    texte("COURSE TERMINÉE", W / 2, H * 0.28, u * 1.6, "#ffd400", "center");
    texte("Position finale : " + rang() + "/" + (C.nbRivaux + 1), W / 2, H * 0.4, u, "#fff", "center");
    texte("Takedowns : " + p.takedowns + "   Frôlements : " + p.frolements, W / 2, H * 0.48, u * 0.8, "#fff", "center");
    texte("Score : " + Math.round(p.score), W / 2, H * 0.56, u, "#7fe3ff", "center");
    texte("Touche l'écran ou Entrée pour rejouer", W / 2, H * 0.7, u * 0.8, "#fff", "center");
  }
}

// ---------- Boucle principale ----------
let dernier = performance.now();
function boucle(t) {
  const dt = Math.min(0.05, (t - dernier) / 1000); dernier = t;
  if (etat === "course" || etat === "fin") { if (etat === "course") maj(dt); if (banniere) banniere.t -= dt; }
  rendu();
  requestAnimationFrame(boucle);
}
requestAnimationFrame(boucle);
// Accès pour les tests automatiques
window.__dogzy = { lancer, get etat() { return etat; }, get joueur() { return joueur; } };
})();
