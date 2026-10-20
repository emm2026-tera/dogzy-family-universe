import sys, json
from playwright.sync_api import sync_playwright
URL = 'http://localhost:8811/demo/index.html?fast=1&tours=%d'
SH = '/workspace/dzg-shots/'
errs = []; report = []
def ok(name, cond): report.append((name, bool(cond))); print(('OK  ' if cond else 'FAIL'), name, flush=True)
def until(pg, js, n=400, step=200):
    for _ in range(n):
        if pg.evaluate(js): return True
        pg.clock.run_for(step)
    return False
def new(b, tours=6):
    pg = b.new_page(viewport={'width':1280,'height':900})
    pg.on('console', lambda m: m.type == 'error' and errs.append(m.text)); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(); pg.goto(URL % tours); pg.clock.run_for(300); return pg
def pick(pg, shot=False):
    pg.click('.chars button[data-c="chefzy"]')
    if shot: pg.screenshot(path=SH+'demo-01-choix-personnage.png')
    pg.click('#go'); pg.clock.run_for(200)
def human_turn(pg):
    for _ in range(300):
        if pg.evaluate("!document.querySelector('#btnRoll').disabled && DEMO.state.cur===0 && document.querySelector('#modal').classList.contains('hidden')"): return True
        if pg.locator('#gQuit').count() and pg.locator('#gQuit').is_visible(): print('   (un bot défie le joueur humain : abandon pour avancer le test)'); pg.click('#gQuit')
        elif pg.locator('#ok').count() and pg.locator('#ok').is_visible() and pg.evaluate('DEMO.state.cur')!=0: pass
        pg.clock.run_for(200)
    return False
    return until(pg, "!document.querySelector('#btnRoll').disabled && DEMO.state.cur===0 && document.querySelector('#modal').classList.contains('hidden')")
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg = new(b, 15)
    ok('écran choix personnage (12 persos)', pg.locator('.chars button').count() == 12)
    pick(pg, True)
    ok('plateau : 22 cases (Départ + 21)', pg.locator('.cell').count() == 22)
    ok('exactement 2 cases Duel', pg.locator('.t-duel').count() == 2)
    ok('Banque au centre', pg.locator('#bank').is_visible())
    pg.screenshot(path=SH+'demo-02-plateau.png')
    pg.evaluate("DEMO.force.die=[1]"); human_turn(pg); pg.click('#btnRoll')
    ok('dé + pion avancé vers Commerce', until(pg, "!!document.querySelector('#buy')") and pg.evaluate('DEMO.state.P[0].pos') == 1)
    pg.screenshot(path=SH+'demo-03-achat-commerce.png'); t0 = pg.evaluate('DEMO.state.P[0].tokens'); pg.click('#buy'); pg.clock.run_for(200)
    ok('achat commerce (propriétaire + tokens)', pg.evaluate('DEMO.state.CASES[1].owner') == 0 and pg.evaluate('DEMO.state.P[0].tokens') == t0 - 180)
    ok('tour suivant : bots jouent puis retour à P1', human_turn(pg))
    pg.evaluate("DEMO.force.die=[1]; DEMO.force.card='CH45'"); pg.click('#btnRoll')
    ok('paquet Chance (vert) face cachée', until(pg, "!!document.querySelector('.g #card:not(.flipped)')"))
    pg.screenshot(path=SH+'demo-04-chance-face-cachee.png'); t0 = pg.evaluate('DEMO.state.P[0].tokens')
    pg.click('#card'); pg.clock.run_for(1000)
    ok('carte Chance retournée (flip, texte, perso entier, ©)', pg.locator('#card.flipped').count() == 1 and '©' in pg.inner_text('.front') and pg.locator('.front img').count() == 1)
    pg.wait_for_timeout(1300); pg.screenshot(path=SH+'demo-05-chance-face-visible.png')
    ok('effet CH45 +500 tokens', pg.evaluate('DEMO.state.P[0].tokens') == t0 + 500); pg.click('#ok')
    human_turn(pg)
    pg.evaluate("DEMO.force.die=[2]; DEMO.force.quiz='QZ05'"); pg.click('#btnRoll')
    ok('paquet Quiz (bleu) face cachée', until(pg, "!!document.querySelector('.b #card:not(.flipped)')"))
    pg.screenshot(path=SH+'demo-06-quiz-face-cachee.png'); pg.click('#flip'); pg.clock.run_for(1200)
    pg.wait_for_timeout(1300); pg.screenshot(path=SH+'demo-07-quiz-question.png'); t0 = pg.evaluate('DEMO.state.P[0].tokens')
    pg.click('.opts button[data-i="2"]'); pg.clock.run_for(200)
    ok('réponse quiz juste : résultat + 50 tokens', 'Bonne' in pg.inner_text('#quizRes') and pg.evaluate('DEMO.state.P[0].tokens') == t0 + 50)
    pg.screenshot(path=SH+'demo-08-quiz-resultat.png'); pg.click('#ok'); human_turn(pg)
    pg.evaluate("DEMO.force.die=[2]; DEMO.force.card='PE46'"); pg.click('#btnRoll')
    ok('paquet Pénalité (rouge) face cachée', until(pg, "!!document.querySelector('.r #card:not(.flipped)')"))
    pg.screenshot(path=SH+'demo-09-penalite-face-cachee.png'); t0 = pg.evaluate('DEMO.state.P[0].tokens'); pg.click('#flip'); pg.clock.run_for(1200)
    pg.wait_for_timeout(1300); pg.screenshot(path=SH+'demo-10-penalite-face-visible.png')
    ok('carte Pénalité retournée, PE46 -500', pg.locator('#card.flipped').count() == 1 and pg.evaluate('DEMO.state.P[0].tokens') == t0 - 500); pg.click('#ok'); human_turn(pg)
    pg.evaluate("DEMO.force.die=[2]; DEMO.force.opp=2; DEMO.force.duelGame='win'"); pg.click('#btnRoll')
    ok('Duel : écran du dé', until(pg, "!!document.querySelector('#dRoll')"))
    t0 = pg.evaluate('DEMO.state.P[0].tokens')
    pg.click('#dRoll'); pg.clock.run_for(400); pg.screenshot(path=SH+'demo-11-duel-de.png')
    until(pg, "!!document.querySelector('#strip')", 50); pg.clock.run_for(250); pg.screenshot(path=SH+'demo-12-duel-carrousel.png')
    ok('carrousel -> Gagnant tout de suite (+100)', until(pg, "!!document.querySelector('#duelRes')") and pg.evaluate('DEMO.state.P[0].tokens') == t0 + 100)
    pg.screenshot(path=SH+'demo-12b-duel-resultat.png'); pg.click('#ok'); human_turn(pg)
    pg.evaluate("DEMO.force.die=[4]; DEMO.force.quiz='QZ10'"); pg.click('#btnRoll')
    until(pg, "!!document.querySelector('#flip')"); pg.click('#flip'); pg.clock.run_for(1200); pg.click('.opts button[data-i="0"]'); pg.clock.run_for(100)
    ok('réponse quiz fausse : résultat affiché', 'Mauvaise' in pg.inner_text('#quizRes')); pg.click('#ok'); h = human_turn(pg)
    if not h: print('   DEBUG', pg.evaluate("document.querySelector('#sheet').innerText.slice(0,200)+' | cur='+DEMO.state.cur+' over='+DEMO.state.over"))
    pg.click('#btnEnd')
    ok('bouton Terminer : fin de partie (classement)', until(pg, "!!document.querySelector('#again')"))
    pg.screenshot(path=SH+'demo-13-fin-partie.png'); pg.close()
    pg = new(b, 3); pick(pg)
    for _ in range(300):
        if pg.locator('#again').count(): break
        if pg.locator('#btnRoll').is_enabled() and pg.evaluate("document.querySelector('#modal').classList.contains('hidden')"):
            try: pg.click('#btnRoll', timeout=2000)
            except Exception: pass
        for sel in ['#buy','#flip','.opts button','#ok','#dRoll','#gQuit']:
            l = pg.locator(sel)
            try:
                if l.count() and l.first.is_visible() and l.first.is_enabled(): l.first.click(timeout=2000); break
            except Exception: pass
        pg.clock.run_for(800)
    ok("partie de 3 tours jouée jusqu'à la fin naturelle", pg.locator('#again').count() == 1); pg.close()
    for g in ['memoire','objets-caches','bubbles','corde','match3','hexa-puzzle','tetris','tile-match','2048-hex','lose']:
        pg = new(b, 6); pick(pg)
        pg.evaluate(f"DEMO.force.die=[8]; DEMO.force.opp=3; DEMO.force.duelGame='{g}'"); human_turn(pg); pg.click('#btnRoll')
        until(pg, "!!document.querySelector('#dRoll')"); t0 = pg.evaluate('DEMO.state.P[0].tokens'); pg.click('#dRoll')
        if g == 'lose':
            ok('carrousel -> Perdant tout de suite (-100)', until(pg, "!!document.querySelector('#duelRes')") and pg.evaluate('DEMO.state.P[0].tokens') == t0 - 100); pg.close(); continue
        lo = until(pg, "!!document.querySelector('#gframe')") and pg.evaluate('DEMO.lastGame') == g
        pg.clock.run_for(800)
        f = [x for x in pg.frames if g + '.html' in x.url][0]
        for s in ['#go','#ovBtn']:
            if f.locator(s).count() and f.locator(s).is_visible(): f.locator(s).click()
        for k in range(10): pg.clock.run_for(600)
        if g == 'memoire':
            f.evaluate('''(()=>{const by={};document.querySelectorAll('.c').forEach(c=>(by[c.dataset.n]=by[c.dataset.n]||[]).push(c));window._p=Object.values(by)})()''')
            for k in range(12): f.evaluate(f'_p[{k}][0].click();_p[{k}][1].click()'); pg.clock.run_for(800)
        elif g == 'objets-caches':
            for k in range(3): f.locator('.zone:not(.found)').first.click(force=True)
        else:
            gb = pg.locator('#gframe').bounding_box()
            for k in range(6): pg.mouse.click(gb['x'] + gb['width']*(.3+.07*k), gb['y'] + gb['height']*.55); pg.clock.run_for(300)
        pg.screenshot(path=SH+f'demo-duel-{g}.png')
        res = until(pg, "!document.querySelector('#gBack').disabled", 500, 400)
        if res: pg.click('#gBack')
        back = until(pg, "!!document.querySelector('#duelRes')", 50)
        moved = pg.evaluate('DEMO.state.P[0].tokens') != t0
        ok(f'duel {g} : chargé={lo}, MJ_RESULT={res}, retour plateau={back}, ±100 appliqué={moved}', lo and res and back and moved)
        if back: pg.click('#ok')
        pg.close()
    b.close()
print('CONSOLE ERRORS:', errs)
print('SUMMARY', sum(1 for _, c in report if c), '/', len(report))
