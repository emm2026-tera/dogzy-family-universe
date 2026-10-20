import glob, os, html
B='/workspace/build'
CAST=[]
for f in sorted(glob.glob(B+'/img/[0-2][0-9]-*.jpg')):
    b=os.path.basename(f)[3:-4]
    # split job / breed using known breeds
    breeds=['german-shepherd','beagle','saint-bernard','collie','bulldog','poodle','yorkshire','rottweiler','border-collie','french-bulldog','afghan-hound','husky','doberman','dachshund','labrador','shih-tzu','jack-russell','boxer','whippet','australian-shepherd','shiba','pomeranian','weimaraner','bernese','corgi']
    br=max([x for x in breeds if b.endswith(x)],key=len)
    job=b[:-len(br)-1].replace('-',' ').title().replace('Tech','Tech')
    brn=br.replace('-',' ').title().replace('Shih Tzu','Shih Tzu')
    if brn=='Yorkshire': brn='Yorkshire Terrier'
    if brn=='Bernese': brn='Bernese Mountain Dog'
    if brn=='Jack Russell': brn='Jack Russell Terrier'
    if brn=='Shiba': brn='Shiba Inu'
    if job=='Construction': job='Construction Worker'
    CAST.append((os.path.basename(f),job,brn))

TESTS=[
("Valid claim pays out correctly","A correctly signed voucher pays the right player the right amount."),
("Replay of the same voucher is rejected","Each voucher works once only."),
("Voucher used by another address is rejected","An intercepted voucher is useless to anyone but its owner (front-running)."),
("Voucher signed by a non-authorized key is rejected","Only the official game-server key can issue vouchers."),
("Tampered amount is rejected","Changing the amount invalidates the signature."),
("Expired voucher is rejected","Every voucher has a deadline."),
("Zero amount and malformed signatures are rejected","Invalid or empty requests are refused."),
("Per-claim cap is enforced","A single claim can never exceed the configured maximum."),
("Payout can never exceed the reserve","The bridge pays only from DOGZY actually deposited."),
("Admin functions are owner-only","Rate, signer key, caps and reserve can be changed by the owner only."),
("Pause blocks claims","Claims can be frozen immediately in an emergency."),
("No signature replay across contract instances","A voucher issued for one contract does not work on another."),
]

def page(body, cls='', footer=True, label='Investor Kit'):
    f=f'<div class="foot"><span>Dogzy Family Universe · {label}</span><span>thedogzyfamilyuniverse.ca</span><span class="pn"></span></div>' if footer else ''
    return f'<section class="page {cls}">{body}{f}</section>'

def head(kicker,title,lead=''):
    l=f'<p class="lead">{lead}</p>' if lead else ''
    return f'<div class="kicker">{kicker}</div><h1>{title}</h1><div class="rule"></div>{l}'

CSS=open(B+'/style.css').read()

def doc(pages):
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(pages)}</body></html>'

# ---------- pages ----------
cover=page(f'''
<div class="cv-top"><div class="brand">DOGZY <span>FAMILY UNIVERSE</span></div><div class="cv-tag">Investor Kit · October 2026</div></div>
<div class="cv-title">
<h1>Dogzy Family Universe</h1>
<p class="cv-sub">A world of working dogs, from the <em>Dogzie Town</em> VR game to real on-chain ownership.</p></div>
<div class="cv-hero"><img src="img/00a-chef-golden-retriever.jpg"></div>
<div class="cv-quote">“Art you can play. A world you can own.”</div>
<div class="cv-bottom"><div><b>Sania Labbé</b><br>Artist <i>Valkyrie</i> · Québec, Canada</div><div class="r">thedogzyfamilyuniverse.ca</div></div>
''','cover',footer=False)

def pitch(label):
    return page(f'''
<div class="kicker">One-page pitch</div><h1>Play it. Earn it. Own it.</h1><div class="rule"></div>
<p class="lead">Dogzy Family Universe is an original illustrated world of dog characters, each with a profession, created by the Québec artist Valkyrie (Sania Labbé). It comes to life in <em>Dogzie Town</em>, a PlayStation VR game in development, and connects to a real digital token, DOGZY, on Avalanche.</p>
<div class="g2">
 <div class="card"><h3>The universe</h3><p>25+ dog characters with professions: Chef (Golden Retriever), Barmaid (Cavalier), Police Officer (German Shepherd), Firefighter (Saint Bernard), Veterinarian (Labrador), Pilot (Weimaraner) and many more.</p></div>
 <div class="card"><h3>The progression</h3><p>Players level up in each job. <b>Level 5 of every job is a business</b>: restaurant chain, bank, clinic, gallery, studio, airport. The first player to reach it owns it; later players buy a franchise. Characters wear equippable accessories.</p></div>
 <div class="card"><h3>The game</h3><p>In <em>Dogzie Town</em> (PlayStation VR, in development), players earn in-game Dogzy tokens by working, building businesses and taking part in events.</p></div>
 <div class="card"><h3>The token</h3><p><b>DOGZY</b> is a standard ERC-20 token on <b>Avalanche C-Chain</b>: EVM-compatible, fast and low-fee. The <b>DogzyBridge</b> contract lets players move earned tokens out of the game into a wallet they control.</p></div>
</div>
<div class="band"><div class="bstep"><span>1</span>Server debits the in-game balance</div><div class="barrow">→</div><div class="bstep"><span>2</span>Server signs a single-use, expiring voucher</div><div class="barrow">→</div><div class="bstep"><span>3</span>Player claims DOGZY from the funded reserve</div></div>
<div class="g2 tight">
 <div><h3>Honest status</h3><ul class="checks">
  <li class="ok">Smart contracts and deployment script written</li>
  <li class="ok">Compiles; <b>12/12</b> automated security tests pass (commit 7cc6717)</li>
  <li class="todo">Not yet deployed. Next: Avalanche Fuji testnet</li>
  <li class="todo">Game-side signing service to be built</li>
  <li class="todo">Independent security audit before any mainnet launch</li>
  <li class="todo">Interactive investor demo in development</li></ul></div>
 <div><h3>The ask</h3><table class="kv">
  <tr><th>Investment sought</th><td><span class="tbd">[TBD]</span></td></tr>
  <tr><th>Use of funds</th><td><span class="tbd">[TBD]</span></td></tr>
  <tr><th>Terms</th><td><span class="tbd">[TBD]</span></td></tr>
  <tr><th>Team</th><td><span class="tbd">[TBD]</span></td></tr>
  <tr><th>Contact</th><td>Sania Labbé<br>thedogzyfamilyuniverse.ca</td></tr></table></div>
</div>
<div class="strip"><img src="img/01-police-officer-german-shepherd.jpg"><img src="img/03-firefighter-saint-bernard.jpg"><img src="img/15-veterinarian-labrador.jpg"><img src="img/23-pilot-weimaraner.jpg"></div>
<p class="fine">Vision and plan, not a promise of returns. No token sale is open. All intellectual property belongs exclusively to the artist Valkyrie (Sania Labbé).</p>
''',label=label)

bridge=page(f'''
{head('How it works','The DogzyBridge, in three steps','Players earn tokens inside the game. The bridge lets them turn those in-game tokens into real DOGZY tokens that they own, in their own wallet, outside the game.')}
<div class="flow">
 <div class="node"><div class="ico"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="5.5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="11.5" r=".9"/><circle cx="18" cy="13.5" r=".9"/></svg></div><h4>Dogzie Town</h4><p>Player asks to export in-game tokens</p></div>
 <div class="arr"><span>1</span><i>debit</i></div>
 <div class="node"><div class="ico"><svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/><path d="M8 6.5h.01M8 16.5h.01M12 6.5h5M12 16.5h5"/></svg></div><h4>Game server</h4><p>Debits the in-game balance and signs a voucher</p></div>
 <div class="arr"><span>2</span><i>voucher</i></div>
 <div class="node"><div class="ico"><svg viewBox="0 0 24 24"><path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7z"/><path d="M4 7l11-3v3"/><path d="M15 13.5h5"/><circle cx="16.5" cy="13.5" r=".6"/></svg></div><h4>Player wallet</h4><p>Presents the voucher on-chain</p></div>
 <div class="arr"><span>3</span><i>claim</i></div>
 <div class="node chain"><div class="ico"><svg viewBox="0 0 24 24"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z"/><path d="M12 11l8-4.5M12 11L4 6.5M12 11v9"/></svg></div><h4>DogzyBridge</h4><p>Verifies, then pays DOGZY from the reserve</p></div>
</div>
<div class="voucher"><div class="vt">What a voucher contains</div>
<div class="vg"><div><b>Player address</b><span>only this wallet can claim</span></div><div><b>Amount</b><span>signed, cannot be altered</span></div><div><b>Unique number</b><span>usable once only</span></div><div><b>Expiry date</b><span>void after the deadline</span></div></div></div>
<h2>Two smart contracts</h2>
<div class="g2">
 <div class="card"><h3>DogzyToken</h3><p>The DOGZY token, built on the ERC-20 standard, the most widely used standard for digital tokens. Total supply and exchange rate are set at deployment; final tokenomics are <span class="tbd">[TBD]</span>.</p></div>
 <div class="card"><h3>DogzyBridge</h3><p>Checks every voucher and pays the player from a DOGZY reserve funded by the project. Every exchange leaves a public, verifiable record on the blockchain.</p></div>
</div>
<h2>Why Avalanche C-Chain</h2>
<div class="g3">
 <div class="pill"><b>EVM-compatible</b><span>Works with standard Ethereum tools and wallets (Core, MetaMask).</span></div>
 <div class="pill"><b>Fast, low fees</b><span>Suited to frequent, small in-game exports.</span></div>
 <div class="pill"><b>Free testnet</b><span>Fuji allows full validation before any real launch.</span></div>
</div>
<h2>Owner safeguards</h2>
<div class="ctl"><div>Pause claims</div><div>Set the exchange rate</div><div>Replace the signing key</div><div>Cap each claim</div><div>Fund or withdraw the reserve</div></div>
<p class="note">These settings can be changed only by the owner. The bridge can never pay out more DOGZY than the reserve holds.</p>
''')

chars=page(f'''
{head('The universe','Every dog has a job. Every job has a story.','Each character follows a five-level career. Levels 1 to 4 unlock new skills, equipment and environments; <b>level 5 is a business</b> the player can own.')}
<figure class="hero"><img src="img/00a-chef-golden-retriever.jpg"><figcaption><b>Chef · Golden Retriever.</b> From apprentice cook to restaurant-chain owner. Level 5 is the Dogzy restaurant franchise.</figcaption></figure>
<figure class="hero"><img src="img/00c-barmaid-cavalier.jpg"><figcaption><b>Barmaid · Cavalier.</b> From first cocktail to bar-chain owner. Level 5 is the Dogzy Bars franchise.</figcaption></figure>
<div class="g3 rules">
 <div><b>First to level 5 owns the business</b><span>The first player to complete a job's career becomes the owner.</span></div>
 <div><b>Later players franchise</b><span>Players who arrive afterwards can buy a franchise.</span></div>
 <div><b>Equippable accessories</b><span>Characters can be customized with accessories they equip.</span></div>
</div>
''')

grid=''.join(f'<div class="ct"><img src="img/{f}"><div><b>{j}</b><span>{b}</span></div></div>' for f,j,b in CAST)
cast=page(f'''
{head('The cast','27 illustrated careers','Original artwork by Valkyrie. Alongside the Chef and the Barmaid, 25 more career cards each show the full five-level path, from first job to owned business.')}
<div class="castg">{grid}</div>
<div class="stats"><div><b>27</b><span>illustrated careers</span></div><div><b>5</b><span>levels per career</span></div><div><b>36</b><span>town businesses</span></div><div><b>100%</b><span>IP held by the artist</span></div></div>
''')

biz=page(f'''
{head('Dogzie Town','36 shops. One living town.','Dogzie Town is built around 36 businesses and civic buildings. Each one has five upgrades to unlock before it reaches its top form.')}
<figure class="bizf"><img src="img/biz-grid.jpg"></figure>
<div class="band own"><div class="bstep"><span>1</span>A player completes level 5 of a job</div><div class="barrow">→</div><div class="bstep"><span>2</span>The first to arrive owns the business</div><div class="barrow">→</div><div class="bstep"><span>3</span>Later players can buy a franchise</div></div>
<div class="g3 rules">
 <div><b>Public services</b><span>City Hall, Police, Fire, Hospital, School, Library, Courthouse, Post Office, Recycling</span></div>
 <div><b>Commerce</b><span>Bank, Supermarket, Bakery, Restaurant, Pizzeria, Sushi, Coffee, Hotel, Fashion, Beauty, Pet Store, Flowers, Hardware, Mall</span></div>
 <div><b>Trades, auto and leisure</b><span>Construction, Plumbing, Electric, Car Dealership, Garage, Gas Station, Gym, Cinema, Arcade, Nightclub, Arena, Media Studio, Airport</span></div>
</div>
''')

rows=''.join(f'<tr><td class="n">{i+1:02d}</td><td><b>{t}</b><br><span>{d}</span></td><td class="pass">PASS</td></tr>' for i,(t,d) in enumerate(TESTS))
sec=page(f'''
{head('Security and technical status','12 of 12 security tests pass','Automated test suite <code>DogzyBridge.security.js</code>, run with Hardhat on 13 October 2026, commit <code>7cc6717</code>. Compilation succeeded; 12 passing, 0 failing.')}
<table class="tests"><thead><tr><th>#</th><th>Test and what it proves</th><th>Result</th></tr></thead><tbody>{rows}</tbody></table>
<div class="g2 tight">
 <div class="card"><h3>Built-in protections</h3><p>Single-use vouchers bound to one player, expiry dates, verified signatures, per-claim cap, reserve limit, emergency pause, owner-only settings, re-entrancy protection. Built on the widely used, audited OpenZeppelin libraries.</p></div>
 <div class="card warn"><h3>Main risk: the server signing key</h3><p>Whoever holds it could issue vouchers. It must stay on the server only, never shared. If it ever leaked, the cap, the reserve limit and the pause limit the damage, and the owner can replace the key.</p></div>
</div>
<div class="statusbar"><div class="ok">Prototype written</div><div class="ok">Compiles</div><div class="ok">12/12 tests</div><div class="todo">Not deployed</div><div class="todo">Signing service to build</div><div class="todo">Not yet audited</div></div>
<p class="fine">Automated tests do not replace a professional audit. An independent audit is required before any mainnet launch or real value is involved.</p>
''')

road=page(f'''
{head('Roadmap','From prototype to launch, one safe step at a time','Each phase starts only when the previous one is complete. Dates depend on funding and are <span class="tbd">[TBD]</span>.')}
<div class="tl">
 <div class="ph done"><div class="dot">✓</div><div><div class="pt">Done · October 2026</div><h3>Smart-contract prototype</h3><p>DogzyToken and DogzyBridge written with a deployment script. Compiles; 12/12 security tests pass.</p></div></div>
 <div class="ph now"><div class="dot">1</div><div><div class="pt">Next</div><h3>Avalanche Fuji testnet</h3><p>Deploy both contracts and run complete end-to-end tests at no real cost.</p></div></div>
 <div class="ph"><div class="dot">2</div><div><h3>Game integration</h3><p>Build the server signing service and connect it to <em>Dogzie Town</em> and the in-game wallet (Exchange Bank).</p></div></div>
 <div class="ph"><div class="dot">3</div><div><h3>Independent security audit</h3><p>Review by a specialized firm. Auditor and budget <span class="tbd">[TBD]</span>.</p></div></div>
 <div class="ph"><div class="dot">4</div><div><h3>Mainnet launch on Avalanche C-Chain</h3><p>Only after the audit, with a conservative initial reserve and caps, adjusted to real usage.</p></div></div>
 <div class="ph"><div class="dot">5</div><div><h3>NFT artworks · Valkyrie Gallery</h3><p>Original artworks offered as NFTs. Planned; sales are not open.</p></div></div>
</div>
<div class="g2 tight">
 <div class="card"><h3>In parallel</h3><p><b>Interactive investor demo</b> in development. <em>Dogzie Town</em> for PlayStation VR in development; release date <span class="tbd">[TBD]</span>.</p></div>
 <div class="card"><h3>Still to define</h3><p>Tokenomics (supply, rate, reserve) <span class="tbd">[TBD]</span> · Legal review for any future distribution <span class="tbd">[TBD]</span>.</p></div>
</div>
''')

QA=[
("Why a token?","So players can take value they earned in the game out to a wallet they control, as real DOGZY tokens."),
("Why Avalanche?","It works with Ethereum tools (EVM), transactions are fast, fees are low, and the free Fuji testnet allows full validation first."),
("Can someone cheat or steal a voucher?","The 12 automated tests confirm that reused, stolen, forged, altered and expired vouchers are rejected, along with claims above the cap or the reserve and admin actions by anyone but the owner (page 7)."),
("What is the biggest risk?","The server signing key. It must stay on the server only. Caps, the reserve limit and the emergency pause limit the damage if it ever leaks."),
("Is it live? Has it been audited?","Not yet. It is a working prototype: it compiles and all tests pass. Next is the Fuji testnet, then an independent audit before mainnet. Auditor and budget: <span class='tbd'>[TBD]</span>."),
("What are the total supply and exchange rate?","Both are configurable at deployment. Final tokenomics: <span class='tbd'>[TBD]</span>."),
("Is the token for sale?","No. No token sale is open. Any future distribution would follow legal review: <span class='tbd'>[TBD]</span>."),
("What is the state of the game?","<em>Dogzie Town</em> is in development for PlayStation VR. Status, platform agreements and release date: <span class='tbd'>[TBD]</span>."),
("Is there a demo?","An interactive investor demo is in development and will be shared when ready."),
("How do the businesses work?","Level 5 of each job is a business. The first player to reach it owns it; later players buy franchises."),
("What about NFTs?","Valkyrie Gallery artworks are planned as NFTs. Sales are not open."),
("Who owns the intellectual property?","The artist Valkyrie (Sania Labbé), exclusively."),
("How much are you raising, and for what?","Amount <span class='tbd'>[TBD]</span> · Use of funds <span class='tbd'>[TBD]</span> · Team <span class='tbd'>[TBD]</span>."),
]
qa=page(head('Questions and answers','Investor Q&amp;A')+'<div class="qa">'+''.join(f'<div class="q"><h4><span>{i+1:02d}</span>{q}</h4><p>{a}</p></div>' for i,(q,a) in enumerate(QA))+'</div>')

SL=[ # category, top(en,fr), alternates [(en,fr)]
("DOGZY Token",("DOGZY: in-game effort, on-chain ownership.","DOGZY : l'effort en jeu, la propriété sur la chaîne."),[
 ("Play it. Earn it. Own it.","Joue. Gagne. Garde-le pour de vrai."),("The token that leaves the game with you.","Le jeton qui sort du jeu avec toi."),("From the dog park to the blockchain.","Du parc à chiens jusqu'à la blockchain."),("Your rewards, verifiable on Avalanche.","Tes récompenses, vérifiables sur Avalanche.")]),
("Job Characters",("Every dog has a job. Every job has a story.","Chaque chien a un métier. Chaque métier, une histoire."),[
 ("Find your dog. Find your calling.","Trouve ton chien. Trouve ta vocation."),("Work hard, wag harder.","On bosse fort, on remue la queue plus fort."),("Original art. Original characters. Original IP.","Art original. Personnages originaux. Univers original."),("A cast built for games, merch and screens.","Une distribution faite pour le jeu, les produits dérivés et l'écran.")]),
("Businesses",("36 shops. One living town.","36 commerces. Une ville bien vivante."),[
 ("Run the bakery. Own the block.","Tiens la boulangerie. Règne sur le quartier."),("Open the doors to Dogzie Town.","Pousse la porte de Dogzie Town."),("Where the economy has four legs.","Ici, l'économie marche à quatre pattes."),("Business is barking.","Les affaires, ça jappe.")]),
("Accessories",("Equip it. Show it. Keep it.","Équipe-le. Montre-le. Garde-le."),[
 ("Dress the part. Play the part.","Le look du métier, le jeu du métier."),("Gear up, good dog.","Équipe-toi, bon chien."),("Small items, big personality.","Petits objets, grande personnalité."),("The wardrobe of Dogzie Town.","La garde-robe de Dogzie Town.")]),
("VR to Avalanche",("Earned in VR. Secured on Avalanche.","Gagné en VR. Sécurisé sur Avalanche."),[
 ("From VR headset to Avalanche wallet.","Du casque VR au portefeuille Avalanche."),("The game ends. Your tokens don't.","La partie finit. Tes jetons, non."),("Signed, verified, exported.","Signé, vérifié, exporté."),("Step out of VR with something real.","Sors de la VR avec quelque chose de réel.")]),
("The Universe",("Art you can play. A world you can own.","De l'art qui se joue. Un monde qui t'appartient."),[
 ("One family. One town. Endless stories.","Une famille. Une ville. Des histoires sans fin."),("From canvas to VR to blockchain.","De la toile à la VR jusqu'à la blockchain."),("Created by Valkyrie. Shared by everyone.","Créé par Valkyrie. Partagé par tous."),("Big hearts, four paws, one universe.","Grand cœur, quatre pattes, un seul univers.")]),
]
cards=''.join(f'<div class="sl"><div class="cat">{c}</div><div class="top">“{t[0]}”</div><ul>'+''.join(f'<li>{e}</li>' for e,_ in alts)+'</ul></div>' for c,t,alts in SL)
slog=page(head('Taglines','Signature lines','By Valkyrie (Sania Labbé). The highlighted line in each category is the recommended pick for investor materials; alternates follow. French equivalents are in the appendix.')+f'<div class="slg">{cards}</div><p class="fine">DOGZY is an in-game utility token. These lines do not promise financial returns and do not present the token as an investment.</p>')

arows=''
for c,t,alts in SL:
    arows+=f'<tr class="cath"><td colspan="2">{c}</td></tr><tr class="star"><td>★ {t[0]}</td><td>★ {t[1]}</td></tr>'+''.join(f'<tr><td>{e}</td><td>{f}</td></tr>' for e,f in alts)
app=page(head('Appendix','Taglines: English and French')+f'<table class="bil"><thead><tr><th>English</th><th>Français</th></tr></thead><tbody>{arows}</tbody></table>')

disc=page(f'''
<div class="kicker gold">Contact</div><h1>Let’s build Dogzie Town together</h1><div class="rule"></div>
<div class="contact"><div><div class="lbl">Founder and artist</div><div class="big">Sania Labbé</div><div>Artist <i>Valkyrie</i> · Québec, Canada</div></div>
<div><div class="lbl">Website</div><div class="big">thedogzyfamilyuniverse.ca</div><div>Email <span class="tbd">[TBD]</span></div></div></div>
<div class="tagbig">“Art you can play. A world you can own.”</div><div class="bstrip"><img src="img/biz-12.jpg"><img src="img/biz-8.jpg"><img src="img/biz-36.jpg"></div>
<div class="disc"><h3>Important notice</h3>
<p>This document describes a vision and a technology prototype. It is provided for information only and does not constitute an offer to sell, a solicitation to buy, or a recommendation regarding any token, security or other financial product. No token sale is open.</p>
<p>DOGZY is designed as an in-game utility token. Nothing in this document is a promise or forecast of financial returns, token value or profit. Any future distribution would be subject to legal review.</p>
<p>The smart contracts are an unaudited prototype and are not deployed on any network. Features, timelines and parameters may change. Items marked [TBD] are not yet determined.</p>
<p>Dogzy Family Universe, Dogzie Town, the characters and all artwork are the exclusive intellectual property of the artist Valkyrie (Sania Labbé). © 2026 Sania Labbé. All rights reserved.</p></div>
''','back',footer=False)

open(B+'/kit.html','w').write(doc([cover,pitch('Investor Kit'),bridge,chars,cast,biz,sec,road,qa,slog,app,disc]))
open(B+'/pitch.html','w').write(doc([pitch('Investor Pitch')]))
print(len(CAST))
