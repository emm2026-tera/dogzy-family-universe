import asyncio, pathlib, json, random, sys
from playwright.async_api import async_playwright
ROOT=pathlib.Path('/workspace/dogzy-game'); SC=ROOT/'screens'; URL=(ROOT/'index.html').as_uri()
random.seed(7)

async def vis(pg, sel):
    el = await pg.query_selector('#modal:not(.hidden) ' + sel)
    return el if el and await el.is_visible() and await el.is_enabled() else None

async def safe(el):
    try: await el.click(timeout=3000); return True
    except Exception: return False

async def human_turn(pg, buy=True, shots=None):
    await pg.click('#btnSpin')
    for _ in range(4000):
        st = await pg.evaluate('(()=>{const s=DZ.state();return {over:s.over,cur:s.cur,modal:!document.querySelector("#modal").classList.contains("hidden"),spin:!document.querySelector("#btnSpin").disabled}})()')
        if st['over']: return 'over'
        if not st['modal']:
            if st['cur']==0 and st['spin']: return 'ok'
            await pg.wait_for_timeout(120); continue
        txt = await pg.inner_text('#sheet')
        if shots is not None and 'RENT' in txt and 'rent' not in shots:
            await pg.wait_for_timeout(300); await pg.screenshot(path=str(SC/shots.pop('rent_name','04-rent-paid.png'))); shots['rent']=1
        el = await vis(pg,'#quit')
        if el: await safe(el); continue
        el = await vis(pg,'.tgt')
        if el: await safe(el); continue
        el = await vis(pg,'#buy')
        if el and buy: await safe(el); continue
        el = await vis(pg,'#up')
        if el and buy: await safe(el); continue
        el = await vis(pg,'#go')
        if el:
            label = await el.inner_text(); await safe(el)
            await pg.wait_for_timeout(3950 if label=='SPIN' else 150)
            continue
        el = await vis(pg,'#ok')
        if el: await safe(el); continue
        el = await vis(pg,'.opts .btn:not(.ok):not(.bad)')
        if el: await safe(el); await pg.wait_for_timeout(1000); continue
        el = await vis(pg,'#no')
        if el: await safe(el); continue
        el = await vis(pg,'#view')
        if el: return 'over'
        await pg.wait_for_timeout(150)
    raise RuntimeError('stuck')

async def run(b, name, viewport, cfg, mobile, shotset):
    kw = dict(viewport=viewport)
    if mobile: kw.update(device_scale_factor=2, is_mobile=True, has_touch=True)
    ctx = await b.new_context(**kw); pg = await ctx.new_page(); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type=='error' and errs.append(m.text))
    await pg.goto(URL); await pg.evaluate('localStorage.clear()'); await pg.reload(); await pg.wait_for_timeout(900)
    # setup screen
    await pg.click(f'.charTile[data-v="{cfg["charId"]}"]')
    await pg.click(f'#sBots .btn[data-v="{cfg["bots"]}"]'); await pg.click(f'#sDiff .btn[data-v="{cfg["diff"]}"]')
    await pg.click(f'#sGoal .btn[data-v="{cfg["goalType"]}:{cfg["goal"]}"]')
    await pg.wait_for_timeout(500)
    if 'setup' in shotset:
        await pg.evaluate("document.querySelector('#sheet').scrollTop=0"); await pg.wait_for_timeout(200)
        await pg.screenshot(path=str(SC/shotset['setup']))
        if mobile:
            await pg.evaluate("document.querySelector('#sheet').scrollTop=1e5"); await pg.wait_for_timeout(200)
            await pg.screenshot(path=str(SC/shotset['setup'].replace('.png','-options.png')))
    await pg.click('#start'); await pg.wait_for_timeout(700)
    # set up a rent situation: bot 1 owns Restaurant at level 2; human lands on building square 4
    await pg.evaluate("""(()=>{const s=DZ.state(); s.owners['assets/buildings/12-restaurant.png']={p:1,lvl:2}; s.owners['assets/buildings/15-coffee-shop.png']={p:0,lvl:1};
      DZ.force.w1=3; DZ.force.w2=2; DZ.force.building='Restaurant'; DZ.prefs.speed=1;})()""")
    shots={'rent_name':shotset['rent']} if 'rent' in shotset else None
    turns=0; bot_shot=False
    res = await human_turn_with_bot_shot(pg, shots, shotset)
    turns+=1
    await pg.evaluate("DZ.prefs.speed='skip'")
    while res!='over' and turns<80:
        res = await human_turn(pg, buy=random.random()<.7)
        turns+=1
        if turns==3 and 'leader' in shotset:
            await pg.wait_for_timeout(400); await pg.screenshot(path=str(SC/shotset['leader']))
            await pg.click('#btnBag'); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=str(SC/shotset['bag']))
            await pg.evaluate("document.querySelector('#sheet').scrollTop=520"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=str(SC/shotset['bag'].replace('.png','-career.png')))
            await pg.click('#ok'); await pg.wait_for_timeout(300)
    await pg.wait_for_timeout(800)
    s = json.loads(await pg.evaluate('JSON.stringify(DZ.state())'))
    if 'end' in shotset: await pg.screenshot(path=str(SC/shotset['end']))
    # reload persistence check
    await pg.reload(); await pg.wait_for_timeout(800)
    s2 = json.loads(await pg.evaluate('JSON.stringify(DZ.state())'))
    summary = dict(name=name, human_turns=turns, round=s['round'], over=s['over'], rent_total=s['stats']['rent'],
        owners={k.split('/')[-1]:v for k,v in s['owners'].items()},
        players=[(p['name'],p['tokens'],p['shield'],len(p['acc']),p['career']) for p in s['players']],
        persisted=s2['over']==s['over'] and s2['round']==s['round'], errors=errs)
    print(json.dumps(summary, indent=1, ensure_ascii=False))
    await ctx.close(); return errs

async def human_turn_with_bot_shot(pg, shots, shotset):
    # first human turn (rent), then capture a bot mid-turn at 1x speed
    task = asyncio.create_task(human_turn(pg, buy=True, shots=shots))
    if 'bot' in shotset:
        await pg.wait_for_selector('#botPanel:not(.hidden)', timeout=60000)
        await pg.wait_for_timeout(1300)
        await pg.screenshot(path=str(SC/shotset['bot']))
    return await task

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        e1 = await run(b, 'mobile-390x844', {'width':390,'height':844}, dict(charId='chefzy',bots=3,diff='hard',goalType='rounds',goal=10), True,
            dict(setup='01-setup-mobile.png', rent='04-rent-paid-mobile.png', bot='02-bot-turn-mobile.png', leader='03-leaderboard-mobile.png', bag='11-bag-career-mobile.png', end='05-end-screen-mobile.png'))
        e2 = await run(b, 'desktop-1440x900', {'width':1440,'height':900}, dict(charId='barzy',bots=2,diff='normal',goalType='rounds',goal=10), False,
            dict(setup='06-setup-desktop.png', rent='09-rent-paid-desktop.png', bot='07-bot-turn-desktop.png', leader='08-leaderboard-desktop.png', bag='12-bag-career-desktop.png', end='10-end-screen-desktop.png'))
        await b.close()
        print('ALL ERRORS', e1+e2)
asyncio.run(main())
