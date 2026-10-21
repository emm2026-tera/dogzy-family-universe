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
    b.close()
print('RÉSULTAT', sum(R), '/', len(R))
