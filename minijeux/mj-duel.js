/* Mode duel partagé (corde, match3, hexa-puzzle) : ?duel=1&j=X&vs=Y.
   MJDuel.setup(playersEl) dessine le HUD et retourne {ids, human, duel} :
   ids = joueurs en jeu (4 en mode normal, 2 en duel), human = joueur contrôlé par l'humain. */
const MJDuel = (() => {
  const q = new URLSearchParams(location.search);
  const duel = q.get('duel') === '1';
  const clamp = v => Math.min(4, Math.max(1, v | 0));
  let j = clamp(+q.get('j') || 1), vs = clamp(+q.get('vs') || (j === 2 ? 1 : 2));
  if (vs === j) vs = j === 1 ? 2 : 1;
  function setup(el){
    MJ.renderPlayers(el);
    const ids = duel ? [j, vs] : [1,2,3,4], human = duel ? j : 1;
    MJ.PLAYERS.forEach(p => {
      const e = document.getElementById('pl'+p.id);
      e.classList.toggle('me', p.id === human);
      e.querySelector('.nm').textContent = p.nm + (p.id === human ? ' (humain)' : ' (bot)');
      if (!ids.includes(p.id)) e.style.display = 'none';
    });
    if (duel){ el.classList.add('duelMode'); const h = document.querySelector('h1.gt'); if (h) h.insertAdjacentHTML('beforeend', ' <small style="display:block;font-size:14px;letter-spacing:.2em;color:#ff7ad0">⚔️ DUEL</small>'); }
    return { ids, human, duel };
  }
  return { setup, duel };
})();
