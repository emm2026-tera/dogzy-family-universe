/* Intro animée des mini-jeux Dogzy + personnages en fond de jeu.
   MJIntro.play({titre, onDone}) : 4 joueurs, VS, titre, 3-2-1 GO. Touche l'écran pour passer.
   MJIntro.play({media:'fichier.mp4' ou .webm/.gif/.png, duree:ms, onDone}) : joue une animation fournie
   (vidéo plein écran, ou image animée pendant "duree") à la place de l'intro standard. Si le fichier
   ne charge pas, l'intro standard est jouée.
   MJIntro.decor() : personnages décoratifs discrets derrière le plateau. */
const MJIntro = (() => {
  const P = [
    {id:1, nm:'Toi', img:'../assets/portraits/pyromaniac.jpg', c:'#e0302a'},
    {id:2, nm:'Jouzy', img:'../assets/portraits/jouzy.jpg', c:'#e040b0'},
    {id:3, nm:'Kelzy', img:'../assets/portraits/kelzy.jpg', c:'#2f7cf0'},
    {id:4, nm:'Waltzy', img:'../assets/portraits/waltzy.jpg', c:'#e8b420'}
  ];
  const css = `
.mjI{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2vh;overflow:hidden;
 background:radial-gradient(ellipse at center,rgba(60,36,100,.96),rgba(5,4,3,.98) 72%);font-family:Georgia,"Times New Roman",serif;color:#f3e7c1;cursor:pointer;user-select:none;transition:opacity .35s}
.mjI.out{opacity:0;pointer-events:none}
.mjI .rays{position:absolute;inset:-50%;background:repeating-conic-gradient(rgba(212,175,55,.10) 0 8deg,transparent 8deg 22deg);animation:mjSpin 14s linear infinite;pointer-events:none}
@keyframes mjSpin{to{transform:rotate(360deg)}}
.mjI .cards{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,150px));gap:14px 18px;z-index:1}
.mjI .cd{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 8px 8px;border-radius:16px;border:3px solid var(--c);background:linear-gradient(rgba(25,18,10,.95),rgba(8,6,4,.95));
 box-shadow:0 0 22px color-mix(in srgb,var(--c) 60%,transparent);opacity:0;transform:translateX(var(--fx)) scale(.4)}
.mjI .cd.in{animation:mjIn .5s cubic-bezier(.2,1.4,.4,1) forwards}
@keyframes mjIn{to{opacity:1;transform:none}}
.mjI .cd img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--c)}
.mjI .cd b{font:bold 12px sans-serif;background:var(--c);color:#fff;border-radius:7px;padding:2px 8px;text-shadow:0 1px 1px #000}
.mjI .cd span{font-size:16px;color:#f6dd8a;letter-spacing:.04em}
.mjI .vs{position:absolute;left:50%;top:50%;z-index:3;font:900 clamp(70px,20vw,150px)/1 "Arial Black",Arial,sans-serif;color:#fff1b8;
 text-shadow:0 0 20px #ff9a2a,0 0 50px #ff4a2a,0 6px 0 #7a3a00;transform:translate(-50%,-50%) scale(0);opacity:0;pointer-events:none}
.mjI .vs.on{animation:mjVs .9s ease-out forwards}
@keyframes mjVs{0%{opacity:0;transform:translate(-50%,-50%) scale(3) rotate(-12deg)}25%{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-6deg)}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(.8) rotate(-6deg)}}
.mjI .tt{position:relative;z-index:1;text-align:center;opacity:0;transform:scale(.6)}
.mjI .tt.on{animation:mjIn .5s cubic-bezier(.2,1.4,.4,1) forwards}
.mjI .tt h2{margin:0;font-size:clamp(28px,8vw,52px);letter-spacing:.06em;background:linear-gradient(90deg,#a87d1c,#fff3b8,#d4af37,#fff3b8,#a87d1c);background-size:200% 100%;
 -webkit-background-clip:text;background-clip:text;color:transparent;animation:mjShine 1.6s linear infinite;filter:drop-shadow(0 3px 0 #4a2e00)}
@keyframes mjShine{to{background-position:-200% 0}}
.mjI .tt small{display:block;font-size:13px;letter-spacing:.3em;color:#bfa55c;margin-top:4px}
.mjI .sp{position:absolute;width:10px;height:10px;background:#fff3b8;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:mjTw 1.2s ease-in-out infinite;pointer-events:none}
@keyframes mjTw{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.4) rotate(45deg)}}
.mjI .cnt{position:absolute;left:50%;top:50%;z-index:4;font:900 clamp(110px,34vw,220px)/1 "Arial Black",Arial,sans-serif;color:#ffd23a;
 text-shadow:0 0 30px rgba(255,180,40,.8),0 8px 0 #8a4a00;transform:translate(-50%,-50%);pointer-events:none}
.mjI .cnt.pop{animation:mjCnt .6s ease-out forwards}
.mjI .cnt.go{color:#6af07a;text-shadow:0 0 30px rgba(80,255,120,.8),0 8px 0 #0a5a1a}
@keyframes mjCnt{0%{opacity:0;transform:translate(-50%,-50%) scale(2.4)}25%{opacity:1;transform:translate(-50%,-50%) scale(1)}80%{opacity:1;transform:translate(-50%,-50%) scale(.95)}100%{opacity:0;transform:translate(-50%,-50%) scale(.7)}}
.mjI.cd-phase .cards,.mjI.cd-phase .tt{opacity:.25!important;transition:opacity .3s}
.mjI .skip{position:absolute;bottom:calc(14px + env(safe-area-inset-bottom));left:0;right:0;text-align:center;font-size:12px;color:#bfa55c;letter-spacing:.1em;z-index:5}
@media (min-width:760px){.mjI .cards{grid-template-columns:repeat(4,minmax(0,170px))}.mjI .cd img{width:120px;height:120px}}
/* fond de jeu : personnages décoratifs */
.mjBg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.mjBg i{position:absolute;width:var(--s);height:var(--s);border-radius:50%;background:var(--img) center/cover;opacity:var(--o,.2);filter:saturate(.8) blur(.5px);
 -webkit-mask:radial-gradient(circle,#000 45%,transparent 70%);mask:radial-gradient(circle,#000 45%,transparent 70%);animation:mjFloat 7s ease-in-out infinite alternate}
.mjBg i:nth-child(2n){animation-duration:9s}
@keyframes mjFloat{to{transform:translateY(-14px)}}
.mjBg::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(5,4,3,.55),transparent 75%)}
body.mjDecor>*:not(.mjBg):not(.mjI):not(.ov){position:relative;z-index:1}
`;
  let st = null;
  function addCss(){ if (!st){ st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); } }

  function decor(){
    addCss(); if (document.querySelector('.mjBg')) return;
    const wide = window.innerWidth >= 860, d = document.createElement('div'); d.className = 'mjBg'; d.setAttribute('aria-hidden','true');
    // positions : côtés du plateau (bureau) ou coins bas/haut (mobile)
    const spots = wide
      ? [['2%','10%','300px',.22],['78%','8%','300px',.22],['4%','56%','280px',.2],['76%','56%','280px',.2]]
      : [['-18%','58%','230px',.16],['62%','62%','230px',.16],['-20%','16%','190px',.12],['66%','20%','190px',.12]];
    d.innerHTML = P.map((p,i) => { const [l,t,s,o] = spots[i]; return `<i style="left:${l};top:${t};--s:${s};--o:${o};--img:url('${p.img}')"></i>`; }).join('');
    document.body.prepend(d); document.body.classList.add('mjDecor');
  }

  function playMedia(opts){
    const done = opts.onDone || (()=>{}), src = opts.media, isVid = /\.(mp4|webm|mov)(\?|$)/i.test(src);
    const el = document.createElement('div'); el.className = 'mjI'; el.style.background = '#000';
    el.innerHTML = (isVid ? `<video src="${src}" autoplay muted playsinline style="max-width:100%;max-height:100%"></video>`
                          : `<img src="${src}" alt="" style="max-width:100%;max-height:100%">`) + `<div class="skip">Touche l'écran pour passer</div>`;
    document.body.appendChild(el);
    let finished = false, tm;
    function finish(){ if (finished) return; finished = true; clearTimeout(tm); api.playing = false; el.classList.add('out'); setTimeout(()=>el.remove(),380); done(); }
    const m = el.firstElementChild;
    m.addEventListener('error', () => { if (finished) return; finished = true; clearTimeout(tm); el.remove(); api.playing = false; play(Object.assign({}, opts, {media:null})); });
    if (isVid) m.addEventListener('ended', finish);
    tm = setTimeout(finish, opts.duree || (isVid ? 15000 : 5000));
    el.addEventListener('pointerup', finish);
    api.playing = true; api.phase = 'media';
  }
  function play(opts){
    addCss();
    if (opts.media) return playMedia(opts);
    const titre = opts.titre || 'MINI-JEU', done = opts.onDone || (()=>{});
    const el = document.createElement('div'); el.className = 'mjI'; el.setAttribute('role','dialog'); el.setAttribute('aria-label','Présentation des joueurs');
    el.innerHTML = `<div class="rays"></div>
      <div class="cards">${P.map((p,i)=>`<div class="cd" style="--c:${p.c};--fx:${i%2?'60vw':'-60vw'}"><b>P${p.id}</b><img src="${p.img}" alt="${p.nm}"><span>${p.nm}</span></div>`).join('')}</div>
      <div class="tt"><h2>🐾 ${titre} 🐾</h2><small>DOGZY FAMILY UNIVERSE</small></div>
      <div class="vs">VS</div><div class="cnt"></div><div class="skip">Touche l'écran pour passer</div>`;
    document.body.appendChild(el);
    const timers = [], at = (ms, f) => timers.push(setTimeout(f, ms));
    let finished = false;
    function finish(){
      if (finished) return; finished = true; timers.forEach(clearTimeout);
      api.playing = false; el.classList.add('out'); setTimeout(() => el.remove(), 380); done();
    }
    el.querySelectorAll('.cd').forEach((c,i) => at(150 + i*330, () => c.classList.add('in')));
    at(1550, () => el.querySelector('.vs').classList.add('on'));
    at(2150, () => {
      const tt = el.querySelector('.tt'); tt.classList.add('on'); api.phase = 'titre';
      for (let i=0;i<10;i++){ const s=document.createElement('span'); s.className='sp';
        s.style.left = (5+Math.random()*90)+'%'; s.style.top = (Math.random()*100)+'%'; s.style.animationDelay = (Math.random()*1.2)+'s'; tt.appendChild(s); }
    });
    const cnt = el.querySelector('.cnt');
    ['3','2','1','GO !'].forEach((t,i) => at(3000 + i*600, () => {
      el.classList.add('cd-phase'); api.phase = 'compte';
      cnt.textContent = t; cnt.className = 'cnt'; void cnt.offsetWidth; cnt.classList.add('pop'); if (i===3) cnt.classList.add('go');
    }));
    at(5350, finish);
    el.addEventListener('pointerup', finish);
    api.playing = true; api.phase = 'joueurs';
  }
  const api = { play, decor, playing:false, phase:'' };
  return api;
})();
