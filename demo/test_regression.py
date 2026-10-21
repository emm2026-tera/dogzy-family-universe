# Régressions : plateau figé (crash) + effets de cartes + mobile. © 2026 Sania Labbé (Valkyrie)
from playwright.sync_api import sync_playwright
URL = 'http://localhost:8811/demo/index.html?fast=1&tours=%d'
R = []
def ok(n, c): R.append(bool(c)); print('OK  ' if c else 'FAIL', n, flush=True)
def until(pg, js, n=300):
    for _ in range(n):
        if pg.evaluate(js): return True
        pg.clock.run_for(200)
    return False
def ready(pg):
    for _ in range(400):
        if pg.evaluate(READY): return True
        for s in ['#gBack:not([disabled])','#gQuit']:
            l = pg.locator(s)
            if l.count() and l.first.is_visible(): l.first.click(); break
        pg.clock.run_for(200)
    print('   bloqué sur:', pg.evaluate("document.querySelector('#sheet').innerText.slice(0,150)")); return False
READY = "!document.querySelector('#btnRoll').disabled && DEMO.state.cur===0 && document.querySelector('#modal').classList.contains('hidden')"
def new(b, vp=None, tours=8):
    pg = b.new_page(viewport=vp or {'width':1280,'height':900}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.clock.install(); pg.goto(URL % tours); pg.clock.run_for(300)
    pg.click('.chars button[data-c="chefzy"]'); pg.click('#go'); pg.clock.run_for(200); return pg, errs
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/usr/bin/google-chrome')
    # 1. TERMINER pendant une carte : l'écran de fin reste, aucune erreur
    pg, errs = new(b); pg.evaluate("DEMO.force.die=[2]; DEMO.force.card='CH01'"); pg.click('#btnRoll')
    until(pg, "!!document.querySelector('#flip')"); pg.evaluate("document.querySelector('#btnEnd').click()"); pg.clock.run_for(5000)
    ok('Terminer pendant une carte : fin de partie stable, 0 erreur', pg.locator('#again').is_visible() and not errs); pg.close()
    # 2. erreur pendant un tour : le jeu se rétablit au lieu de figer
    pg, errs = new(b); pg.evaluate("DEMO.force.die=[2]; DEMO.force.card='XXXX'; window.DEMO_DATA.chance.push({id:'XXXX',titre:'t',texte:'t',effet:null}); DEMO.force.card='XXXX'")
    pg.evaluate("const o=Element.prototype.remove; window._once=1; Element.prototype.remove=function(){ if(this.id==='flip'&&window._once--) throw new Error('boom'); return o.call(this) }; 0")
    pg.click('#btnRoll'); until(pg, "!!document.querySelector('#flip')"); pg.click('#flip')
    ok('erreur dans un tour : la partie continue (P1 rejoue ensuite)', until(pg, READY)); pg.close()
    # 3. effets de cartes
    pg, errs = new(b); pg.evaluate("DEMO.force.die=[6]; DEMO.force.card='PE33'"); t = pg.evaluate("DEMO.state.P.map(p=>p.tokens)"); pg.click('#btnRoll')
    until(pg, "!!document.querySelector('#flip')"); pg.click('#flip'); pg.clock.run_for(1200); t2 = pg.evaluate("DEMO.state.P.map(p=>p.tokens)")
    ok('PE33 : P1 paie 50 à son voisin (avant : +50 par erreur)', t2[0] == t[0]-50 and t2[1] == t[1]+50); pg.click('#ok'); pg.close()
    pg, errs = new(b); pg.evaluate("DEMO.force.die=[2]; DEMO.force.card='CH25'"); pg.click('#btnRoll')
    until(pg, "!!document.querySelector('#flip')"); pg.click('#flip'); pg.clock.run_for(1200); pg.click('#ok')
    ok('CH25 : pion envoyé sur la case Duel', until(pg, "!!document.querySelector('#dRoll')") and pg.evaluate("DEMO.state.CASES[DEMO.state.P[0].pos].t") == 'duel'); pg.close()
    pg, errs = new(b); pg.evaluate("DEMO.force.die=[2]; DEMO.force.card='CH12'"); t = pg.evaluate("DEMO.state.P.map(p=>p.tokens)"); pg.click('#btnRoll')
    until(pg, "!!document.querySelector('#flip')"); pg.click('#flip'); pg.clock.run_for(1200)
    ok('CH12 : +50 de chaque joueur', pg.evaluate("DEMO.state.P[0].tokens") == t[0]+150); pg.close()
    # 4. double-clic sur le dé + mobile 533px : parties complètes sans blocage ni erreur
    for vp in [{'width':1280,'height':900}, {'width':533,'height':900}, {'width':390,'height':844}]:
        pg, errs = new(b, vp, 4)
        for _ in range(1500):
            if pg.evaluate('DEMO.state.over'): break
            for sel in ['#btnRoll:not([disabled])','#buy','#flip','#ok','.opts button:not([disabled])','#dRoll','#gQuit']:
                l = pg.locator(sel)
                if l.count() and l.first.is_visible():
                    try: l.first.dblclick(timeout=500)
                    except Exception: pass
                    break
            pg.clock.run_for(250)
        ok(f"partie complète {vp['width']}px (double-clics) sans blocage ni erreur", pg.evaluate('DEMO.state.over') and not errs and pg.locator('#again').is_visible())
        if errs: print('  ', errs[:3])
        pg.close()
    # 5. Duels : scénario exact (dé 4 -> Duel, adversaire P4) -> toujours un mini-jeu, la partie continue à 4
    for vp in [{'width':390,'height':844}, {'width':533,'height':900}, {'width':1280,'height':900}]:
        pg, errs = new(b, vp); pg.evaluate("DEMO.force.die=[4]; DEMO.force.opp=4"); pg.click('#btnRoll')
        until(pg, "!!document.querySelector('#dRoll')"); pg.click('#dRoll')
        car = until(pg, "!!document.querySelector('#strip')") and pg.evaluate("[...document.querySelectorAll('#strip .it')].every(e=>!/tout de suite/.test(e.textContent))")
        ifr = until(pg, "!!document.querySelector('#gframe')")
        vs = 'Chefzy' in pg.inner_text('.vs') and pg.evaluate("DEMO.state.P[3].name") in pg.inner_text('.vs')
        pg.clock.run_for(1500); f = [x for x in pg.frames if 'duel=1' in x.url][0]
        links = f.evaluate("document.querySelectorAll('a[href]').length")
        pg.click('#gQuit'); until(pg, "!!document.querySelector('#duelRes')"); pg.click('#ok')
        cont = ready(pg) and not pg.evaluate('DEMO.state.over') and len(pg.evaluate('DEMO.state.P')) == 4
        ok(f"duel {vp['width']}px : carrousel sans victoire auto={car}, mini-jeu lancé={ifr}, joueurs affichés={vs}, liens de sortie neutralisés={links==0}, partie continue à 4={cont}", car and ifr and vs and links == 0 and cont and not errs)
        if errs: print('  ', errs[:3])
        pg.close()
    pg, errs = new(b); pg.evaluate("DEMO.state.P; window.__d=[]"); bad = 0
    for k in range(4):
        pg.evaluate(f"DEMO.force.die=[4]; DEMO.force.opp=1"); ready(pg); pg.click('#btnRoll')
        until(pg, "!!document.querySelector('#dRoll')"); pg.click('#dRoll'); until(pg, "!!document.querySelector('.vs')")
        if pg.inner_text('#dOpp .vs').count('Chefzy') != 1: bad += 1
        until(pg, "!!document.querySelector('#gframe')"); pg.click('#gQuit'); until(pg, "!!document.querySelector('#ok')"); pg.click('#ok')
        pg.evaluate("DEMO.state.P[0].pos=0")
    ok('dé du duel : ne choisit jamais le joueur lui-même', bad == 0); pg.close()
    b.close()
print('RÉSULTAT', sum(R), '/', len(R))
