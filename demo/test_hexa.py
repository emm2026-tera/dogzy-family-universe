# Hexa Puzzle : glisser (souris + vrai tactile), rotation, reprise, niveaux, fin, retour au plateau. FR + EN. © 2026 Sania Labbé (Valkyrie)
from playwright.sync_api import sync_playwright
B = 'http://localhost:8811'; R = []
def ok(n, c): R.append(bool(c)); print('OK  ' if c else 'FAIL', n, flush=True)
GET = """(()=>{const H=__mjHexa,p=H.pieces.filter(p=>!p.at)[0]; if(!p) return null; const box=document.querySelector('.pz[data-pid="'+p.id+'"]'); box.scrollIntoView({block:'nearest'}); const h=box.children[0].getBoundingClientRect(); const rc=H.bd.getBoundingClientRect(); const [x,y]=H.px(p.sol[0],p.sol[1]); return {id:p.id, sx:h.left+h.width/2, sy:h.top+h.height/2, tx:rc.left+H.ox+x, ty:rc.top+H.oy+y+H.S*1.6}})()"""
def run(b, W, H, lang, touch):
    ctx = b.new_context(viewport={'width':W,'height':H}, has_touch=touch, is_mobile=touch); pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); cdp = ctx.new_cdp_session(pg)
    def drag(sx, sy, tx, ty):
        if touch:
            cdp.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':sx,'y':sy}]})
            for i in range(1, 11): cdp.send('Input.dispatchTouchEvent', {'type':'touchMove','touchPoints':[{'x':sx+(tx-sx)*i/10,'y':sy+(ty-sy)*i/10}]})
            cdp.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
        else: pg.mouse.move(sx, sy); pg.mouse.down(); pg.mouse.move(tx, ty, steps=10); pg.mouse.up()
    def tap(x, y):
        if touch: cdp.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':x,'y':y}]}); cdp.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
        else: pg.mouse.click(x, y)
    pg.goto(f'{B}/minijeux/hexa-puzzle.html?duel=1&j=1&vs=3&lang={lang}'); pg.wait_for_timeout(500); pg.click('#go')
    for _ in range(40):
        if pg.evaluate('__mjHexa.playing'): break
        pg.mouse.click(5, 5); pg.wait_for_timeout(300)
    tag = f'{W}px {lang} {"tactile" if touch else "souris"}'
    i = pg.evaluate(GET); c0 = pg.evaluate(f"JSON.stringify(__mjHexa.pieces.find(p=>p.id=={i['id']}).cells)")
    tap(i['sx'], i['sy']); pg.wait_for_timeout(100)
    rot = pg.evaluate(f"JSON.stringify(__mjHexa.pieces.find(p=>p.id=={i['id']}).cells)") != c0 or len(c0) < 3
    for _ in range(5): i2 = pg.evaluate(GET); tap(i2['sx'], i2['sy']); pg.wait_for_timeout(60)   # 6 toucher = tour complet
    ok(f'{tag} : toucher = rotation, 6 rotations = retour', rot and pg.evaluate(f"JSON.stringify(__mjHexa.pieces.find(p=>p.id=={i['id']}).cells)") == c0)
    i = pg.evaluate(GET); drag(i['sx'], i['sy'], i['tx'], i['ty']); pg.wait_for_timeout(80)
    placed = pg.evaluate(f"!!__mjHexa.pieces.find(p=>p.id=={i['id']}).at")
    # reprendre la pièce posée d'un toucher
    q = pg.evaluate(f"(()=>{{const e=document.querySelector('#bd .pc[data-pid=\"{i['id']}\"]').getBoundingClientRect();return [e.left+e.width/2,e.top+e.height/2]}})()")
    tap(*q); pg.wait_for_timeout(80); back = pg.evaluate(f"!__mjHexa.pieces.find(p=>p.id=={i['id']}).at")
    ok(f'{tag} : glisser pose la pièce, toucher la reprend', placed and back)
    for lv in range(2):
        for _ in range(20):
            i = pg.evaluate(GET)
            if not i: break
            drag(i['sx'], i['sy'], i['tx'], i['ty']); pg.wait_for_timeout(50)
        pg.wait_for_timeout(900)
    ok(f'{tag} : 2 plateaux complétés au glisser (réussis={pg.evaluate("__mjHexa.won")}), page pas défilée', pg.evaluate('__mjHexa.won') == 2 and pg.evaluate('scrollX') == 0)
    pg.evaluate("window.__mjHexa"); pg.clock.install() if False else None
    ok(f'{tag} : aucune erreur', not errs); ctx.close()
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/usr/bin/google-chrome')
    for W, H, lang, t in [(390, 700, 'fr', True), (390, 600, 'en', True), (533, 650, 'fr', True), (1100, 800, 'fr', False), (1100, 800, 'en', False)]: run(b, W, H, lang, t)
    # duel depuis le plateau : Hexa se lance, se termine (chrono) et revient au plateau
    pg = b.new_page(viewport={'width':390,'height':844}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(); pg.goto(B + '/demo/index.html?fast=1&lang=fr'); pg.clock.run_for(300)
    pg.click('.chars button[data-c="chefzy"]'); pg.click('#go'); pg.clock.run_for(300)
    pg.evaluate("DEMO.force.die=[4]; DEMO.force.opp=3; DEMO.force.duelGame='hexa-puzzle'"); pg.click('#btnRoll')
    for _ in range(100):
        if pg.locator('#dRoll').count(): break
        pg.clock.run_for(200)
    pg.click('#dRoll')
    for _ in range(100):
        if pg.locator('#gframe').count(): break
        pg.clock.run_for(200)
    pg.clock.run_for(1500); f = [x for x in pg.frames if 'hexa-puzzle' in x.url][0]
    if f.locator('#go').is_visible(): f.locator('#go').click()
    for _ in range(200):
        pg.clock.run_for(1000)
        if not pg.evaluate("document.querySelector('#gBack').disabled"): break
    res = not pg.evaluate("document.querySelector('#gBack').disabled")
    if res: pg.click('#gBack')
    for _ in range(50):
        if pg.locator('#duelRes').count(): break
        pg.clock.run_for(200)
    ok('duel Hexa depuis le plateau : fin au chrono, résultat, retour au plateau', res and pg.locator('#duelRes').count() == 1 and not errs)
    b.close()
print('RÉSULTAT', sum(R), '/', len(R))
