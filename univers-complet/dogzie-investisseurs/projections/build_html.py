from model import *
css=open('base.css').read(); defs=open('defs.svg').read()
NB="\u00a0"
def grp(n): 
    s=f"{abs(round(n)):,}".replace(",",NB); return ("−" if n<0 else "")+s
def k(n): return grp(n/1000)+NB+"k$"
def m(n):
    if abs(n)>=1e6: return f"{n/1e6:.2f}".replace(".",",")+NB+"M$"
    return grp(n/1000)+NB+"k$"
def pct(x): return (f"{x*100:.1f}".rstrip("0").rstrip(".")).replace(".",",")+NB+"%"
def V(key,s): return P[key]["vals"][s]
def cum(x,n): return sum(x[:n])
SCL=["Prudent","Normal","Si ça pogne vraiment"]
extra="""
.tbl{width:100%;border-collapse:collapse;font-size:8.6pt;margin:3mm 0 4mm}
.tbl th{font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;color:#0a0a0a;background:linear-gradient(180deg,#f3d77a,#c9a22f);padding:2mm 1.6mm;text-align:right;font-weight:700}
.tbl th:first-child,.tbl td:first-child{text-align:left}
.tbl td{padding:1.15mm 1.6mm;border-bottom:.5px solid rgba(212,175,55,.22);text-align:right;color:#e6dcc0;white-space:nowrap}
.tbl td:first-child{white-space:normal}
.tbl tr.sub td{color:#a89e84;font-size:7.8pt}
.tbl tr.tot td{color:#f1e3b3;font-weight:600;border-top:1px solid rgba(212,175,55,.5)}
.tbl tr.big td{color:#f3d77a;font-weight:700;background:rgba(212,175,55,.10);font-size:9.2pt}
.tbl tr.ded td{color:#c9b98e}
.tbl th.grp{text-align:center;background:none;color:#e2bf57;border-bottom:1px solid #d4af37;font-size:7pt}
.tbl td.sep,.tbl th.sep{border-left:1px solid rgba(212,175,55,.35)}
.nine{display:grid;grid-template-columns:30mm repeat(3,1fr);gap:2.5mm;margin:4mm 0 6mm}
.nine .h{font-size:7pt;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);text-align:center;align-self:end;padding-bottom:1mm}
.nine .r{font-family:'Cinzel','Cormorant SC',serif;font-size:10.5pt;color:#f1e3b3;align-self:center;line-height:1.2}
.nine .r small{display:block;font-family:Montserrat;font-size:6.6pt;letter-spacing:.12em;color:#9d937a;text-transform:uppercase}
.nine .c{border:1px solid rgba(212,175,55,.4);border-radius:2mm;background:linear-gradient(160deg,rgba(212,175,55,.10),rgba(0,0,0,.25));text-align:center;padding:3.5mm 2mm}
.nine .c b{display:block;font-family:'Cinzel','Cormorant SC',serif;font-size:19pt;color:#e9c862;text-shadow:0 0 14px rgba(212,175,55,.3)}
.nine .c span{font-size:7.6pt;color:#b8ad90}
.read{border:1px solid var(--gold);border-radius:3mm;padding:5mm 6mm;background:rgba(212,175,55,.06)}
.read h3{font-size:12.5pt;color:#e2bf57;margin-bottom:2mm}
.read li{font-size:9.2pt;margin-bottom:1.3mm}
.illu{position:absolute;top:12mm;right:16mm;font-size:6.5pt;letter-spacing:.25em;text-transform:uppercase;color:#0a0a0a;background:#d4af37;padding:1mm 3mm;border-radius:1mm}
.small li{font-size:9pt;line-height:1.45;margin-bottom:1.4mm}
.small p{font-size:9.6pt;line-height:1.55}
.cols3{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.cols3 .card{padding:5mm}
.cols3 .card h3{font-size:12pt}
.kv{font-size:8.8pt;line-height:1.5}
.kv div{display:flex;justify-content:space-between;border-bottom:.5px dotted rgba(212,175,55,.3);padding:.8mm 0}
.kv div b{color:#f1e3b3;font-weight:600;white-space:nowrap;padding-left:2mm}
.legend{display:flex;gap:4mm;flex-wrap:wrap;font-size:7.5pt;margin:1mm 0 3mm}
.legend i{display:inline-block;width:3mm;height:3mm;margin-right:1.2mm;vertical-align:-.4mm}
h2{font-size:23pt}
.hyp td{padding:.9mm 1.6mm!important;font-size:8.1pt}
.hyp td:first-child{width:52%}
.kv{font-size:8.2pt;line-height:1.35}
"""
COL=["#f3d77a","#c9a22f","#8f6d17","#e8e0c8","#5a4a1a"]
def page(n,kicker,title,body):
    return f"""<section class="page"><div class="frame"></div><div class="illu">Illustratif · non audité · pas une garantie</div>
<div class="kicker">Projections · {kicker}</div><h2 class="gold">{title}</h2><div class="rule" style="margin:3mm 0 6mm"></div>
{body}
<div class="foot"><span>Dogzy Universe · Projections de revenus ($ CA)</span><span>P{n}</span></div></section>"""
pages=[]
# ---- P1
cells=""
rowsdef=[("An 1","12 premiers mois",lambda r:(r["gross"][0],r["net"][0])),
         ("Cumul 3 ans","An 1 à An 3",lambda r:(cum(r["gross"],3),cum(r["net"],3))),
         ("Cumul 5 ans","An 1 à An 5",lambda r:(cum(r["gross"],5),cum(r["net"],5)))]
cells+='<div></div>'+"".join(f'<div class="h">{x}</div>' for x in ["Prudent","Normal","Si ça pogne vraiment"])
for lab,sub,f in rowsdef:
    cells+=f'<div class="r">{lab}<small>{sub}</small></div>'
    for s in range(3):
        g,n=f(R[s]); cells+=f'<div class="c"><b>{m(g)}</b><span>brut · net {m(n)}</span></div>'
p1=f"""
<p class="small" style="font-size:10.2pt">Un seul univers, cinq sources de revenus : la console <strong>Dogzie Town</strong>, la couche blockchain <strong>Dogzy Universe</strong> (avec le jeton <strong>Dogzy</strong>), l'art physique de la <strong>Galerie Valkyrie</strong>, la marchandise et les lieux thématiques ajoutés avec le temps. On les calcule un par un, puis on les additionne. Tout est en <strong>dollars canadiens</strong>.</p>
<div class="nine">{cells}</div>
<p class="note" style="margin:-3mm 0 5mm">Brut = total des ventes. Net = après la part PlayStation (30 %), les commissions de galeries, le coût de la marchandise et les redevances des influenceurs (5 %). Le net est calculé <u>avant</u> les salaires, le développement, les serveurs et les impôts : ce n'est pas un profit.</p>
<div class="read"><h3>Comment lire ces chiffres</h3><ul>
<li><strong>Scénarios illustratifs</strong>, préparés pour la discussion avec des investisseurs. Ce n'est ni une prévision, ni une promesse, ni un audit.</li>
<li>Les trois scénarios diffèrent par le <strong>nombre de joueurs</strong> et les <strong>taux de conversion</strong>. Les prix restent les mêmes partout : pas de multiplicateur magique.</li>
<li>Les contrats intelligents sont <strong>rédigés, mais pas déployés ni audités</strong>. Le jeton Dogzy <strong>n'est inscrit sur aucune plateforme d'échange</strong>. Aucune valeur de jeton n'est projetée.</li>
<li>Les volets blockchain exigent un déploiement, un audit de sécurité indépendant, une validation juridique (AMF / ACVM) et l'accord des règles de Sony.</li>
<li>Les <strong>500 000 $ à 550 000 $</strong> recherchés pour la Phase 2 sont un <strong>investissement</strong>, pas un revenu. Ils ne figurent dans aucun total.</li>
<li>An 1 = les 12 premiers mois après le lancement commercial de Dogzie Town.</li></ul></div>"""
pages.append(page(1,"Vue d'ensemble","Dogzy Universe : ce que l'univers pourrait rapporter",p1))
# ---- P2 hypotheses
def r3(key,fmt): return "".join(f"<td>{fmt(V(key,s))}</td>" for s in range(3))
def act(s,t): return grp(R[s]["active"][t])
rows=f"""
<tr><td>Nouveaux joueurs (copies vendues) — An 1</td>{r3('new1',grp)}</tr>
<tr><td>Nouveaux joueurs — An 3</td>{r3('new3',grp)}</tr>
<tr><td>Nouveaux joueurs — An 5</td>{r3('new5',grp)}</tr>
<tr class="sub"><td>Copies vendues cumulées sur 5 ans</td>{"".join(f"<td>{grp(cum(R[s]['new'],5))}</td>" for s in range(3))}</tr>
<tr><td>Rétention : joueurs qui restent actifs l'année suivante</td>{r3('ret',pct)}</tr>
<tr class="tot"><td>Joueurs actifs — An 1 / An 3 / An 5</td>{"".join(f"<td>{act(s,0)} / {act(s,2)} / {act(s,4)}</td>" for s in range(3))}</tr>
<tr><td>Achètent l'extension (DLC) de l'année</td>{r3('c_dlc',pct)}</tr>
<tr><td>Achètent la passe compétitive multijoueur</td>{r3('c_pass',pct)}</tr>
<tr><td>Achètent des accessoires en Dogzy (portefeuille requis)</td>{r3('c_acc',pct)}</tr>
<tr><td>Achètent un NFT personnage dans l'année</td>{r3('c_nft',pct)}</tr>
<tr><td>Acheteurs NFT venus du milieu crypto (hors joueurs) / an</td>{r3('nft_native',grp)}</tr>
<tr><td>Lots NFT bâtiments / carte vendus par année</td>{r3('bldg_lots',grp)}</tr>
<tr><td>Éditions Valkyrie vendues par collection mensuelle (An 1) · croissance</td>{"".join(f"<td>{V('valk_ed',s)} · +{pct(V('valk_g',s))}/an</td>" for s in range(3))}</tr>
<tr><td>Toiles physiques vendues (An 1) · croissance</td>{"".join(f"<td>{V('canvas',s)} · +{pct(V('canvas_g',s))}/an</td>" for s in range(3))}</tr>
<tr><td>Achètent de la marchandise</td>{r3('c_merch',pct)}</tr>
<tr><td>Achètent la passe d'un lieu thématique · commandites par lieu</td>{"".join(f"<td>{pct(V('c_venue',s))} · {k(V('sponsor',s)) if V('sponsor',s) else '0 $'}</td>" for s in range(3))}</tr>
<tr><td>Revente NFT secondaire / an (% valeur primaire cumulée)</td>{r3('turnover',pct)}</tr>
<tr><td>Détenteurs qui exportent des jetons vers leur portefeuille</td>{r3('c_export',pct)}</tr>"""
def pr(x): return (f"{x:,.2f}".replace(",",NB).replace(".",",") if x%1 else grp(x))+NB+"$"
p2=f"""<p class="small">Ce qui change d'un scénario à l'autre : <strong>combien de joueurs</strong> arrivent, <strong>combien restent</strong> et <strong>quelle part achète</strong>. Chaque chiffre est modifiable dans le fichier Excel (onglet « Hypothèses »).</p>
<table class="tbl hyp"><tr><th>Hypothèse</th><th>Prudent</th><th>Normal</th><th>Si ça pogne vraiment</th></tr>{rows}</table>
<div class="band"><p style="font-size:9.4pt;margin:0"><strong>Pourquoi ces écarts ?</strong> Prudent = un jeu indépendant qui trouve un petit public fidèle. Normal = un succès indépendant solide, porté par les 5 influenceurs. « Si ça pogne vraiment » = l'univers devient viral : beaucoup plus de joueurs, qui restent plus longtemps et achètent plus souvent. Les prix ne changent pas.</p></div>"""
pages.append(page(2,"Méthode","Les hypothèses, en clair",p2))
# ---- P3 annual table
LINES=[("A","A. Console — Dogzie Town","tot"),("A1","Ventes du jeu","sub"),("A2","Extensions (DLC)","sub"),("A3","Passe compétitive multijoueur","sub"),("A4","Accessoires (payés en Dogzy)","sub"),
("B","B. Blockchain — Dogzy Universe","tot"),("B1","NFT personnages","sub"),("B2","NFT bâtiments / carte","sub"),("B3","Collections NFT mensuelles Valkyrie","sub"),("B4","Redevances reventes secondaires (5 %)","sub"),("B5","Frais export de jetons + revente","sub"),
("C","C. Art physique — toiles Valkyrie","tot"),("D","D. Marchandise / marque","tot"),("E","E. Lieux thématiques","tot"),
("gross","Revenu brut total","big"),("d_sony","− Part PlayStation (30 %)","ded"),("d_gal","− Commissions galeries (toiles)","ded"),("d_merch","− Coût marchandise","ded"),("d_infl","− Influenceurs (5 % du brut)","ded"),("net","Revenu net pour l'entreprise*","big")]
def table(cols,heads):
    h='<tr><th></th>'+"".join(f'<th class="grp{" sep" if i else ""}" colspan="3">{g}</th>' for i,g in enumerate(heads))+'</tr>'
    h+='<tr><th>$ CA (milliers)</th>'+"".join(f'<th class="{"sep" if j%3==0 else ""}">{x}</th>' for j,x in enumerate(["Prud.","Norm.","Pogne"]*len(heads)))+'</tr>'
    b=""
    for key,lab,cls in LINES:
        b+=f'<tr class="{cls}"><td>{lab}</td>'
        for j,(fn) in enumerate(cols):
            for s in range(3):
                val=fn(R[s][key]); 
                if key.startswith("d_"): val=-val
                b+=f'<td class="{"sep" if s==0 else ""}">{grp(val/1000)}</td>'
        b+='</tr>'
    return f'<table class="tbl">{h}{b}</table>'
p3=f"""<p class="small">Chaque volet est calculé séparément, année par année. Le tableau montre l'<strong>An 1</strong>, puis les années <strong>3</strong> et <strong>5</strong> prises seules (pas cumulées), pour voir la vitesse de croisière.</p>
{table([lambda x:x[0],lambda x:x[2],lambda x:x[4]],["An 1","An 3 (annuel)","An 5 (annuel)"])}
<p class="note">Montants en milliers de $ CA (ex. 571 = 571 000 $). « Pogne » = scénario « si le concept pogne vraiment ». * Net = avant salaires, développement, serveurs, marketing payé et impôts. Les accessoires sont payés en Dogzy et comptés à leur valeur en $ CA au moment de l'achat; on suppose qu'ils sont vendus dans Dogzy Universe (site / portefeuille), donc sans part PlayStation. Si Sony exige qu'ils passent par le PlayStation Store, une part de 30 % s'appliquerait aussi.</p>
<div class="band" style="margin:3mm 0 0;padding:3mm 0 3mm 5mm"><p style="font-size:9pt;margin:0">Dans les trois scénarios, <strong>la console porte l'essentiel des revenus</strong> (environ {pct(R[1]['A'][0]/R[1]['gross'][0])} du brut en An 1, scénario Normal). La blockchain ajoute de la valeur et de la fidélité, sans que le plan dépende d'une hausse du prix du jeton.</p></div>"""
p2b=f"""<p class="small">Les prix sont les mêmes dans les trois scénarios. Seuls les volumes changent. Voici la méthode, en quatre étapes.</p><div class="flow" style="grid-template-columns:repeat(4,1fr)">
<div class="step" style="min-height:34mm"><em>Étape 1</em><b>Joueurs</b>Copies vendues chaque année, puis joueurs actifs (rétention).</div>
<div class="step" style="min-height:34mm"><em>Étape 2</em><b>Achats</b>Joueurs actifs × taux de conversion × prix, volet par volet.</div>
<div class="step" style="min-height:34mm"><em>Étape 3</em><b>Total brut</b>Somme des volets A à E, en $ CA.</div>
<div class="step" style="min-height:34mm"><em>Étape 4</em><b>Net</b>Moins PlayStation, galeries, coût marchandise et influenceurs.</div></div><div class="grid2" style="gap:5mm">
<div class="card" style="padding:5mm"><div class="tag">Prix · identiques dans les 3 scénarios</div><div class="kv">
<div>Jeu (prix moyen réalisé, soldes incluses; affiché ~29,99 $)<b>{pr(V('p_game',0))}</b></div>
<div>Extension (5 prévues, 1 par année)<b>{pr(V('p_dlc',0))}</b></div>
<div>Passe compétitive (duel 2 joueurs, camps opposés)<b>{pr(V('p_pass',0))}</b></div>
<div>Accessoires : dépense annuelle par acheteur (en Dogzy)<b>{pr(V('p_acc',0))}</b></div>
<div>NFT personnage (143 personnages)<b>{pr(V('p_nft',0))}</b></div>
<div>Lot NFT bâtiment (46 bâtiments × 5 éd. = 230)<b>{pr(V('p_bldg',0))}</b></div>
<div>Édition NFT Valkyrie (12 collections / an)<b>{pr(V('p_valk',0))}</b></div>
<div>Toile physique (moyenne, à confirmer)<b>{pr(V('p_canvas',0))}</b></div>
<div>Panier marchandise · passe de lieu<b>{pr(V('p_merch',0))} · {pr(V('p_venue',0))}</b></div></div></div>
<div class="card" style="padding:5mm"><div class="tag">Taux et déductions</div><div class="kv">
<div>Part PlayStation (jeu, DLC, passe en numérique)<b>30 %</b></div>
<div>Redevances influenceurs (5 × 1 % à vie, sur le brut total)<b>5 %</b></div>
<div>Commission galeries / plateformes sur toiles<b>30 %</b></div>
<div>Coût de production marchandise<b>55 %</b></div>
<div>Redevance sur reventes NFT secondaires<b>5 %</b></div>
<div>Frais sur export de jetons (valeur moy. 20 $ / an)<b>2 %</b></div>
<div>Frais sur revente d'accessoires (20 % des ventes)<b>2,5 %</b></div>
<div>Lieux thématiques actifs (An 3 / 4 / 5)<b>1 / 2 / 3</b></div></div>
<p class="note" style="margin-top:3mm">Lieux : croisière (An 3), événements calqués sur le sport (An 4), casino comme <u>lieu NFT</u> (An 5) — spectacles et cosmétiques, <strong>aucun jeu d'argent</strong>.</p></div></div><div class="band" style="margin:5mm 0 3mm"><p style="font-size:9.4pt;margin:0"><strong>Volatilité crypto :</strong> la valeur en $ CA d'un montant payé en Dogzy, en BNB ou en AVAX peut varier fortement entre l'achat et la conversion. Les montants crypto ne sont pas garantis en $ CA. C'est pourquoi le modèle ne compte que la valeur au moment de la vente et de petits frais de plateforme, jamais une hausse du jeton.</p></div>
<div class="band"><p style="font-size:9.4pt;margin:0"><strong>Ce que le modèle ne compte pas :</strong> le capital Phase 2, toute vente de jetons Dogzy par l'entreprise, toute hausse de valeur du jeton, les revenus publicitaires et les ventes de copies physiques en magasin.</p></div>"""
pages.append(page(3,"Méthode","Prix, taux et déductions",p2b))
pages.append(page(4,"Annuel","Revenus par volet, année par année",p3))
# ---- P4 cumulative + chart
def bar(s):
    tot=cum(R[s]["gross"],5); x=0; segs=""
    for i,(key,lab) in enumerate(STREAMS):
        w=cum(R[s][key],5)/tot*100
        segs+=f'<rect x="{x}%" y="0" width="{w}%" height="100%" fill="{COL[i]}"/>'; x+=w
    return f'<div style="display:grid;grid-template-columns:42mm 1fr 26mm;align-items:center;gap:3mm;margin:2mm 0"><span style="font-size:8.5pt;color:#f1e3b3">{SCL[s]}</span><svg width="100%" height="7mm" preserveAspectRatio="none">{segs}</svg><span style="font-size:8.5pt;text-align:right;color:#e9c862">{m(tot)}</span></div>'
leg="".join(f'<span><i style="background:{COL[i]}"></i>{kk}. {lab}</span>' for i,(kk,lab) in enumerate(STREAMS))
mix="".join(f"<li><strong>{SCL[s]}</strong> : console {pct(cum(R[s]['A'],5)/cum(R[s]['gross'],5))} · blockchain {pct(cum(R[s]['B'],5)/cum(R[s]['gross'],5))} · art {pct(cum(R[s]['C'],5)/cum(R[s]['gross'],5))} · marchandise {pct(cum(R[s]['D'],5)/cum(R[s]['gross'],5))} · lieux {pct(cum(R[s]['E'],5)/cum(R[s]['gross'],5))}</li>" for s in range(3))
p4=f"""<p class="small">Les mêmes volets, additionnés sur <strong>3 ans</strong> et sur <strong>5 ans</strong>.</p>
{table([lambda x:cum(x,3),lambda x:cum(x,5)],["Cumul 3 ans (An 1 à 3)","Cumul 5 ans (An 1 à 5)"])}
<div class="kicker" style="margin-top:2mm">Répartition du revenu brut cumulatif sur 5 ans</div>
<div class="legend">{leg}</div>{bar(0)}{bar(1)}{bar(2)}
<ul class="small" style="margin-top:3mm">{mix}</ul>"""
pages.append(page(5,"Cumulatif","Ce que ça donne sur 3 ans et sur 5 ans",p4))
# ---- P5 economy & deductions
n=R[1]
p5=f"""<div class="grid2" style="gap:5mm">
<div class="card" style="padding:5.5mm"><div class="tag">Comment Dogzy entre dans les chiffres</div><ul class="small">
<li>Les <strong>accessoires</strong> s'achètent <strong>uniquement en Dogzy</strong>. On compte leur valeur en $ CA au moment de l'achat, rien de plus.</li>
<li>Les <strong>jetons de mission</strong> gagnés sur console peuvent être exportés vers le portefeuille (ex. 500 000 jetons de jeu ↔ 5 Dogzy, selon la valeur du moment).</li>
<li>L'export exige que le personnage existe dans <strong>Dogzy Universe ET Dogzie Town</strong>. On ne compte donc que les détenteurs de NFT personnage.</li>
<li>Sur l'export et la revente, l'entreprise touche seulement de <strong>petits frais</strong> (2 % et 2,5 %). Aucun revenu ne vient d'une hausse du prix du jeton.</li>
<li>Certains autres achats pourront se faire en BNB ou autre crypto; ils sont comptés en $ CA comme le reste.</li></ul></div>
<div class="card" style="padding:5.5mm"><div class="tag">Ce qui est retiré du brut</div><ul class="small">
<li><strong>PlayStation ~30 %</strong> sur les ventes numériques du jeu, des extensions et de la passe compétitive.</li>
<li><strong>Influenceurs 5 %</strong> : 5 partenaires à 1 % de redevances à vie chacun. Par prudence, on l'applique au revenu <u>brut total</u>. La base exacte doit être écrite au contrat.</li>
<li><strong>Galeries 30 %</strong> en moyenne sur les toiles (mélange ventes directes et plateformes comme Singulart).</li>
<li><strong>Marchandise 55 %</strong> de coût de production (impression sur demande).</li></ul></div></div>
<div class="kicker" style="margin-top:6mm">Exemple · scénario Normal, An 1</div>
<table class="tbl"><tr><th>Étape</th><th>Montant</th><th>Explication</th></tr>
<tr class="tot"><td>Revenu brut total</td><td>{grp(n['gross'][0])} $</td><td style="text-align:left;white-space:normal">{grp(n['new'][0])} copies + extensions, passe, accessoires, NFT, toiles, marchandise</td></tr>
<tr class="ded"><td>− Part PlayStation</td><td>−{grp(n['d_sony'][0])} $</td><td style="text-align:left">30 % du jeu, du DLC et de la passe</td></tr>
<tr class="ded"><td>− Influenceurs</td><td>−{grp(n['d_infl'][0])} $</td><td style="text-align:left">5 % du brut</td></tr>
<tr class="ded"><td>− Galeries + coût marchandise</td><td>−{grp(n['d_gal'][0]+n['d_merch'][0])} $</td><td style="text-align:left">Toiles et produits dérivés</td></tr>
<tr class="big"><td>Revenu net pour l'entreprise</td><td>{grp(n['net'][0])} $</td><td style="text-align:left">Avant salaires, serveurs, développement et impôts</td></tr></table>
<div class="band"><p style="font-size:10pt;margin:0"><strong>Capital Phase 2 : 500 000 $ à 550 000 $ CA.</strong> C'est un investissement pour finir et lancer l'univers. Il n'est compté dans aucun revenu. La Phase 1 a été bâtie avec environ <strong>500 $</strong> d'abonnements, plus le temps investi par la fondatrice.</p></div>
"""
pages.append(page(6,"Économie","Dogzy, les déductions et ce qui n'est pas un revenu",p5))
# ---- P6 conditions
p6=f"""<div class="cols3">
<div class="card"><div class="tag">Blockchain</div><h3>Pas encore en ligne</h3><ul class="small">
<li>Contrats (DogzyToken, PontDogzy) <strong>rédigés, non déployés, non audités</strong>.</li>
<li>Jeton Dogzy <strong>non inscrit</strong> sur une plateforme d'échange.</li>
<li>Avant tout revenu B : réseau de test, audit indépendant, puis réseau principal.</li></ul></div>
<div class="card"><div class="tag">Règles et lois</div><h3>À valider</h3><ul class="small">
<li>Règles de <strong>Sony PlayStation</strong> sur les cryptos et NFT : les achats en Dogzy pourraient devoir se faire hors console.</li>
<li>Avis juridique sur le jeton (<strong>AMF / ACVM</strong>) et la fiscalité.</li>
<li>Casino = <strong>lieu NFT</strong> seulement : aucune mise, aucun gain en argent.</li></ul></div>
<div class="card"><div class="tag">Données de départ</div><h3>À confirmer</h3><ul class="small">
<li>Prix moyen des toiles et partage des revenus avec l'artiste à confirmer par entente.</li>
<li>Les repères de la galerie sont des <strong>affirmations de la fondatrice</strong>, non vérifiées ici.</li>
<li>Ventes de jeu à valider avec un éditeur / Sony.</li></ul></div></div>
<div class="kicker" style="margin-top:7mm">Les bases de l'univers (fournies par la fondatrice)</div>
<div class="stats" style="grid-template-columns:repeat(5,1fr);margin:3mm 0 5mm">
<div class="stat"><b class="gold" style="font-size:24pt">143</b><span>personnages</span></div>
<div class="stat"><b class="gold" style="font-size:24pt">46</b><span>bâtiments</span></div>
<div class="stat"><b class="gold" style="font-size:24pt">5</b><span>extensions</span></div>
<div class="stat"><b class="gold" style="font-size:24pt">7</b><span>collections jouables</span></div>
<div class="stat"><b class="gold" style="font-size:24pt">9</b><span>factions</span></div></div>
<p class="small" style="font-size:9.4pt">Ambiance de luxe Dubaï / Saint-Martin · duels à 2 joueurs, toujours dans des camps opposés · <strong>Galerie Valkyrie</strong> : une collection NFT par mois et des toiles physiques, 23 expositions internationales, 14 curations, top 10 % sur Singulart (41 000 vues en environ 4 mois) et, selon la fondatrice, 37 toiles dans le monde.</p>
<div class="read" style="margin-top:6mm"><h3>En résumé</h3><ul>
<li>Le scénario <strong>Prudent</strong> montre un univers qui vit modestement ({m(cum(R[0]['gross'],5))} brut sur 5 ans). Le <strong>Normal</strong> montre un succès indépendant solide ({m(cum(R[1]['gross'],5))}). « <strong>Si ça pogne vraiment</strong> » montre le potentiel d'un succès viral ({m(cum(R[2]['gross'],5))}).</li>
<li>Les chiffres reposent sur les joueurs et sur ce qu'ils achètent, pas sur la valeur future d'un jeton.</li>
<li>Ce sont des chiffres illustratifs, non audités, sans garantie. On les ajuste au fur et à mesure que les vraies données arrivent.</li></ul></div>
<p class="note" style="margin-top:4mm">Dogzy Universe (anciennement Family Universe) · Document préparé en octobre 2026 · Ce document n'est ni une offre de valeurs mobilières, ni une offre de cryptomonnaie, ni un conseil financier.</p>"""
pages.append(page(7,"Conditions","Ce qui doit arriver pour que ces chiffres tiennent",p6))
html=f'<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Dogzy Universe — Projections de revenus</title><style>{css}{extra}</style></head><body>{defs}{"".join(pages)}</body></html>'
open('projections.html','w').write(html); print("ok")
