import sys, json
from playwright.sync_api import sync_playwright
GAMES = sys.argv[1:] or ['memoire','objets-caches','bubbles','corde','match3','hexa-puzzle','tetris','tile-match','2048-hex']
out = {}
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/usr/bin/google-chrome')
    for g in GAMES:
        pg = b.new_page(viewport={'width':1100,'height':800}); errs = []
        pg.on('console', lambda m: m.type == 'error' and errs.append(m.text)); pg.on('console', lambda m: m.text.startswith('pr') and print(m.text)); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.clock.install()
        pg.goto(f'http://localhost:8811/minijeux/{g}.html?duel=1&j=1&vs=3'); pg.clock.run_for(500)
        for sel in ['#go', '#start', 'button:has-text("JOUER")', 'button:has-text("COMMENCER")']:
            l = pg.locator(sel)
            if l.count() and l.first.is_visible(): l.first.click(); break
        for k in range(12): pg.clock.run_for(600)
        # quelques coups
        box = pg.viewport_size
        for k in range(0 if g=='memoire' else 8):
            pg.mouse.click(300 + k*60, 350 + (k%3)*60); pg.clock.run_for(300)
        pg.keyboard.press('ArrowLeft'); pg.keyboard.press('ArrowDown'); pg.keyboard.press('ArrowRight')
        if g == 'objets-caches':
            n = pg.evaluate("document.querySelectorAll('.zone').length")
            for k in range(min(n,3)): pg.locator('.zone:not(.found)').first.click(force=True)
        if g == 'memoire':
            pg.evaluate('''(()=>{const cs=[...document.querySelectorAll('.c')];const by={};cs.forEach(c=>(by[c.dataset.n]=by[c.dataset.n]||[]).push(c));window._pairs=Object.values(by)})()''')
            for k in range(12):
                pg.evaluate(f'window._pairs[{k}][0].click();window._pairs[{k}][1].click();console.log("pr",document.getElementById("pr").textContent)'); pg.clock.run_for(800)
        pg.screenshot(path=f'/workspace/dzg-shots/demo-jeu-{g}.png')
        for k in range(200):
            pg.clock.run_for(1000)
            if pg.evaluate('!!window.MJ_RESULT'): break
        r = pg.evaluate('window.MJ_RESULT')
        out[g] = {'result': r and {k:r[k] for k in r if k in ('won','game','tie','instant')}, 'errors': errs[:3]}
        print(g, json.dumps(out[g], ensure_ascii=False), flush=True); pg.close()
    b.close()
