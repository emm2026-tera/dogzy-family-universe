/* Outils partagés des mini-jeux Dogzy : joueurs, minuteur, bots simulés, fin de partie. */
const MJ = (() => {
  const PLAYERS = [
    {id:1, nm:'Toi', img:'../assets/portraits/pyromaniac.jpg', human:true},
    {id:2, nm:'Jouzy', img:'../assets/portraits/jouzy.jpg'},
    {id:3, nm:'Kelzy', img:'../assets/portraits/kelzy.jpg'},
    {id:4, nm:'Waltzy', img:'../assets/portraits/waltzy.jpg'}
  ];
  const $ = s => document.querySelector(s);
  function renderPlayers(el){
    el.innerHTML = PLAYERS.map(p => `<div class="pl p${p.id}${p.human?' me':''}" id="pl${p.id}">
      <span class="tag">P${p.id}</span><img src="${p.img}" alt="${p.nm}"><span class="nm">${p.nm}${p.human?' (humain)':' (bot)'}</span>
      <span class="bar"><i></i></span><span class="sc">0</span></div>`).join('');
  }
  function setPlayer(id, score, pct, label){
    const el = document.getElementById('pl'+id); if(!el) return;
    el.querySelector('.bar i').style.width = Math.max(0,Math.min(100,pct)) + '%';
    el.querySelector('.sc').textContent = label != null ? label : score;
  }
  function setLeader(id){ PLAYERS.forEach(p => document.getElementById('pl'+p.id).classList.toggle('lead', p.id===id)); }
  function fmt(s){ s=Math.max(0,Math.ceil(s)); return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
  function timer(el, seconds, onTick, onEnd){
    let left = seconds, last = performance.now(), raf, stopped=false;
    function step(now){
      if(stopped) return;
      left -= (now-last)/1000; last = now;
      el.textContent = fmt(left); el.classList.toggle('low', left<=10);
      onTick && onTick(seconds-left, left);
      if(left<=0){ stopped=true; onEnd && onEnd(); return; }
      raf = requestAnimationFrame(step);
    }
    el.textContent = fmt(left);
    raf = requestAnimationFrame(t => { last=t; step(t); });
    return { stop(){ stopped=true; cancelAnimationFrame(raf); }, get left(){ return left; } };
  }
  /* Bot simulé : progression irrégulière vers une cible, sur une durée donnée. */
  function bot(target, duration){
    let v = 0, nextAt = 0;
    return { get v(){ return v; }, target,
      tick(elapsed){
        if(elapsed < nextAt) return v;
        nextAt = elapsed + 0.6 + Math.random()*1.4;
        const ideal = target * Math.min(1, elapsed/duration);
        const jitter = (Math.random()-.35) * target*0.06;
        v = Math.max(v, Math.min(target, Math.round(ideal + jitter)));
        return v;
      }};
  }
  function showEnd(title, msg, ranking, onReplay){
    { // résultat lisible par le plateau (case Duel) : le joueur humain (j en duel, sinon P1) a-t-il gagné ?
      const q = new URLSearchParams(location.search), human = (q.get('duel') === '1' && typeof MJDuel !== 'undefined') ? (+q.get('j') || 1) : 1; // jeux sans mode duel : l'humain est P1
      const own = window.MJ_RESULT;
      if (!own || own._auto) window.MJ_RESULT = { _auto:true, game:location.pathname.split('/').pop().replace('.html',''), won: !!ranking[0] && ranking[0].id === human, player:human, ranking:ranking.map(r => ({id:r.id, score:r.v})) };
    }
    const ov = $('#ovEnd');
    ov.querySelector('h2').textContent = title;
    ov.querySelector('.msg').textContent = msg;
    ov.querySelector('.rank').innerHTML = ranking.map((r,i) => {
      const p = PLAYERS.find(x=>x.id===r.id);
      return `<li class="${i===0?'win':''}">${i===0?'🏆':(i+1)+'.'} <img src="${p.img}" alt=""> P${p.id} ${p.nm}<b>${r.label}</b></li>`;
    }).join('');
    ov.classList.remove('hidden');
    ov.querySelector('.replay').onclick = () => { ov.classList.add('hidden'); onReplay(); };
  }
  function toast(parent, text, color){
    const t = document.createElement('div'); t.className='toast'; t.textContent=text; if(color) t.style.color=color;
    parent.appendChild(t); setTimeout(()=>t.remove(), 950);
  }
  return { PLAYERS, renderPlayers, setPlayer, setLeader, timer, bot, showEnd, toast, fmt };
})();
