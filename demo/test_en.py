# Version anglaise : aucun texte français visible (plateau, cartes, quiz, duel, 9 mini-jeux). © 2026 Sania Labbé (Valkyrie)
import re, json
from playwright.sync_api import sync_playwright
B = 'http://localhost:8811'
FR = re.compile(r"[éèêàçùûôœ]|\b(le|la|les|des|du|tu|ton|ta|tes|joueur|joueurs|carte|paie|gagne|recule|avance|tour|tours|toi|pour|avec|sans|une|est|sur|dans|chaque|partie|PASSER|ACHETER|LANCER|RETOUR|JOUER|Niveau|Trouvés|Essais|Paires)\b", re.I)
OKW = re.compile(r"Tax tour|Sania Labbé|Adoles-chiant|Valkyrie|Café|Securzy|Doczy|é{0}$")
R = []; bad = {}
def ok(n, c): R.append(bool(c)); print('OK  ' if c else 'FAIL', n, flush=True)
def scan(where, txt):
    for line in txt.split('\n'):
        l = OKW.sub('', line.strip())
        if l and FR.search(l): bad.setdefault(where, set()).add(line.strip()[:90])
def texts(fr): return fr.evaluate("document.body.innerText + '\\n' + [...document.querySelectorAll('[title],[alt]')].map(e=>e.title||e.alt).join('\\n')")
# couverture statique des cartes et du quiz
import subprocess
cov = subprocess.run(['node','-e',"global.window={};const fs=require('fs');eval(fs.readFileSync('data-niveau1.js','utf8'));eval(fs.readFileSync('data-en.js','utf8'));const D=window.DEMO_DATA,E=window.DOGZY_EN_CARDS;const m=[];for(const c of [...D.chance,...D.penalite]){if(!E[c.titre])m.push(c.id+' titre');if(!E[c.texte])m.push(c.id+' texte')}for(const q of D.quiz){const t=q.q.replace(/<[^>]+>/g,'\\n').split('\\n').map(s=>s.trim()).filter(s=>/[a-zà-ü]{3}/i.test(s));t.forEach(s=>{if(!E[s])m.push(q.id+' '+s)})}console.log(JSON.stringify(m))"], capture_output=True, text=True).stdout
ok(f'97 cartes + 10 quiz traduits (manquants: {cov.strip()})', cov.strip() == '[]')
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/usr/bin/google-chrome')
    for vp in [{'width':1280,'height':900}, {'width':390,'height':844}]:
        pg = b.new_page(viewport=vp); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.clock.install(); pg.goto(B + '/demo/index.html?fast=1&tours=6&lang=en'); pg.clock.run_for(400)
        scan('choix', texts(pg)); pg.click('.chars button[data-c="chefzy"]'); pg.click('#go'); pg.clock.run_for(300)
        # forcer chaque type de case au moins une fois
        seq = ["DEMO.force.die=[1]","DEMO.force.die=[1]","DEMO.force.die=[2]","DEMO.force.die=[6]","DEMO.force.die=[2]"]
        for step in range(1500):
            if pg.evaluate('DEMO.state.over'): break
            if seq and pg.evaluate("!document.querySelector('#btnRoll').disabled"): pg.evaluate(seq.pop(0))
            scan('jeu', texts(pg))
            for f in pg.frames[1:]:
                try:
                    if f.evaluate('document.readyState') == 'complete': scan('mini-jeu ' + f.url.split('/')[-1][:30], texts(f))
                except Exception: pass
            for sel in ['#btnRoll:not([disabled])','#buy','#flip','#ok','.opts button:not([disabled])','#dRoll','#gQuit']:
                l = pg.locator(sel)
                if l.count() and l.first.is_visible():
                    try: l.first.click(timeout=500)
                    except Exception: pass
                    break
            pg.clock.run_for(250)
        scan('fin', texts(pg))
        ok(f"partie complète en anglais {vp['width']}px, 0 erreur", pg.evaluate('DEMO.state.over') and not errs and 'Game over' in texts(pg))
        pg.close()
    for g in ['memoire','objets-caches','bubbles','corde','match3','hexa-puzzle','tetris','tile-match','2048-hex']:
        pg = b.new_page(viewport={'width':1100,'height':800}); pg.goto(f'{B}/minijeux/{g}.html?duel=1&j=1&vs=3&lang=en'); pg.wait_for_timeout(1500)
        scan('mini-jeu ' + g, texts(pg)); pg.close()
    # français inchangé
    pg = b.new_page(); pg.goto(B + '/demo/index.html?lang=fr'); pg.wait_for_timeout(500)
    ok('français inchangé', 'Choisis ton personnage' in texts(pg) and 'Tous droits réservés' in texts(pg)); pg.close()
    b.close()
for k, v in bad.items(): print('  FR restant —', k, ':', sorted(v)[:12])
ok('aucun texte français restant en mode anglais', not bad)
print('RÉSULTAT', sum(R), '/', len(R))
