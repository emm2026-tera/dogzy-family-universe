// Player state persisted in localStorage (demo only).
const STORE_KEY = "dogzy-demo-v2";
const DEFAULT_STATE = { balance: 100, inventory: {}, equipped: {}, character: null, nonce: 0, exports: [], owned: {}, gear: {}, level: {}, biz: {}, access: {}, mapsWon: {} };

// Price table from data/prices.json (configurable); applied to characters and equipment at load.
const PRICES = {
  levels: [],
  apply(D) {
    const P = D.prices || {}; this.levels = P.levels || [];
    if (P.startingBalance) DEFAULT_STATE.balance = P.startingBalance;
    // Demo shows only the characters flagged demo:true (others stay in the data).
    D.characters.all = D.characters.characters; const demo = D.characters.all.filter((c) => c.demo); if (demo.length) D.characters.characters = demo;
    const l1 = this.levels[0]; if (l1) D.characters.characters.forEach((c) => { c.price = l1.fee; });
    Object.values((D.equipment || {}).equipment || {}).forEach((LV) => LV.forEach((L) => { const p = this.levels[L.level - 1]; if (p) L.items.forEach((it) => { it.price = it.gold ? p.gold : p.item; }); L.fee = p ? p.fee : 0; }));
  },
  business() { return (App.data && App.data.prices && App.data.prices.business) || 50; },
  fee(level) { const p = this.levels[level - 1]; return p ? p.fee : 0; },
};
const State = {
  data: null,
  load() {
    try { this.data = Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(STORE_KEY) || "{}")); ["owned", "gear", "level", "biz", "access", "mapsWon"].forEach((k) => { if (!this.data[k]) this.data[k] = {}; }); }
    catch (e) { this.data = Object.assign({}, DEFAULT_STATE); }
  },
  save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch (e) { /* storage unavailable */ }
    const b = document.getElementById("balance");
    if (b) b.textContent = this.data.balance;
  },
  reset() { this.data = Object.assign({}, DEFAULT_STATE, { inventory: {}, equipped: {}, exports: [], owned: {}, gear: {}, level: {}, biz: {}, access: {}, mapsWon: {} }); this.save(); },
};
