# Génère les deux dossiers séparés (HTML). Aucun envoi.
import os
names = ["Policière","Commis","Pompier","Infirmière","Avocat","Dentiste","Fleuriste","Ouvrier de chantier",
 "Électricienne","Plombier","Décoratrice","Technicien","Architecte","Banquière","Vétérinaire","Coiffeur",
 "Journaliste","Acteur","Entraîneuse","Peintre","Chanteur","Actrice","Pilote"]
posters = sorted(f for f in os.listdir('img') if f.startswith('fam-'))

CSS = """
@page{size:1280px 720px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#0a0a0a}
body{font-family:"Inter",Arial,sans-serif;color:#e6d9a8;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:1280px;height:720px;position:relative;overflow:hidden;page-break-after:always;break-after:page;background:radial-gradient(ellipse at 85% 0%,#1b1607 0%,#0a0a0a 55%);padding:62px 64px 56px}
.page:last-child{page-break-after:auto;break-after:auto}
.page::before{content:"";position:absolute;inset:16px;border:1px solid rgba(212,175,55,.35);pointer-events:none;z-index:5}
.banner{position:absolute;top:24px;left:64px;right:64px;font-size:11.5px;letter-spacing:.08em;color:#d4af37;border-bottom:1px solid rgba(212,175,55,.25);padding-bottom:6px;display:flex;justify-content:space-between;z-index:6}
.foot{position:absolute;bottom:24px;left:64px;right:64px;font-size:11px;color:#9c8a55;display:flex;justify-content:space-between;z-index:6}
.sig{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:20px;color:#f1d27a}
h1,h2,h3,.cinzel{font-family:"Cinzel",Georgia,serif;font-weight:400;color:#f1d27a}
h1{font-size:58px;line-height:1.05}
h2{font-size:34px;line-height:1.1;margin-bottom:6px}
h3{font-size:18px;margin-bottom:6px;color:#f1d27a}
.kicker{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#d4af37;margin-bottom:8px;font-weight:600}
.rule{width:70px;height:2px;background:linear-gradient(90deg,#f7e3a1,#d4af37);margin:10px 0 16px}
p,li{font-size:15px;line-height:1.5;color:#e2d3a0}
.small{font-size:13px;line-height:1.45;color:#c9b67a}
.tiny{font-size:11.5px;line-height:1.4;color:#a8945c}
b{color:#f7e3a1;font-weight:600}
.serif{font-family:"Cormorant Garamond",Georgia,serif}
.card{border:1px solid rgba(212,175,55,.35);border-radius:6px;padding:14px 16px;background:rgba(20,16,6,.55)}
.tag{display:inline-block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;border:1px solid rgba(212,175,55,.5);border-radius:20px;color:#d4af37}
.tag.on{background:#d4af37;color:#0a0a0a;font-weight:700}
.grid{display:grid;gap:14px}
ul{padding-left:18px}
img{display:block}
"""

def page(inner, n, total, title):
    return f"""<section class="page">
<div class="banner"><span>Document de travail. Rien n'a été envoyé. Ce dossier se suffit à lui seul.</span><span>{title}</span></div>
{inner}
<div class="foot"><span>Dossier autonome — {title} · 8 octobre 2026</span><span><span class="sig">Valkyrie</span> &nbsp;·&nbsp; {n} / {total}</span></div>
</section>"""

def doc(title, pages):
    body = "\n".join(page(p, i+1, len(pages), title) for i, p in enumerate(pages))
    return f"""<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>{title} — dossier seul (document de travail)</title><style>{CSS}</style></head><body>{body}</body></html>"""

# ---------------- DOGZIE TOWN ----------------
cols = ["Jet-set","Criminels","Vedettes","Extravertis","Marginaux","Geeks","Mondes d'adrénaline","Justiciers","Adolescents"]
preview = {"Jet-set":"town-jet-set.jpg","Criminels":"town-criminels.jpg","Marginaux":"town-marginaux.jpg"}

t1 = """
<div style="display:grid;grid-template-columns:560px 1fr;gap:40px;height:100%;align-items:center">
 <div>
  <div class="kicker">Volet 1 · Le jeu vidéo console</div>
  <h1>Dogzie Town</h1>
  <div class="rule"></div>
  <p style="font-size:18px"><b>Dogzie Town est le jeu vidéo pour console.</b> Ce dossier présente ce volet seul, avec ses propres onglets. Il peut être montré sans aucun autre document.</p>
  <div style="margin-top:22px" class="card">
   <h3>Onglets de ce dossier</h3>
   <ul class="small" style="columns:2;column-gap:24px">
    <li><b>Les neuf collections</b></li>
    <li><b>Missions</b></li>
    <li><b>Clan des gentils</b></li>
    <li><b>Clan des méchants</b></li>
    <li><b>Présentation PlayStation</b></li>
    <li><b>Export de tokens</b></li>
    <li><b>Pitch pour les investisseurs</b></li>
   </ul>
  </div>
  <p class="tiny" style="margin-top:16px">Rien ici n'est inventé : les fiches, missions et personnages pas encore créés sont marqués « à venir ».</p>
 </div>
 <div><img src="img/town-hero.jpg" style="width:100%;border:1px solid rgba(212,175,55,.45);border-radius:6px"></div>
</div>"""

cards = ""
for i, c in enumerate(cols, 1):
    if c in preview:
        extra = '<div class="tiny" style="margin-top:4px">Page « Outcasts » sur le site</div>' if c == "Marginaux" else ""
        cards += f"""<div class="card" style="display:flex;gap:12px;align-items:center;padding:10px 12px">
<img src="img/{preview[c]}" style="width:78px;height:100px;object-fit:cover;object-position:top;border-radius:4px;border:1px solid rgba(212,175,55,.4)">
<div><div class="tiny">{i:02d}</div><h3 style="margin:2px 0 6px">{c}</h3><span class="tag on">Page d'aperçu sur le site</span>{extra}</div></div>"""
    else:
        cards += f"""<div class="card" style="display:flex;gap:12px;align-items:center;padding:10px 12px">
<div style="width:78px;height:100px;border:1px dashed rgba(212,175,55,.45);border-radius:4px;display:flex;align-items:center;justify-content:center" class="tiny">à venir</div>
<div><div class="tiny">{i:02d}</div><h3 style="margin:2px 0 6px">{c}</h3><span class="tag">Nom seulement · fiches à venir</span></div></div>"""
t2 = f"""
<div class="kicker">Onglet 1 · Collections</div>
<h2>Les neuf collections du jeu</h2>
<p class="small">Dans l'ordre : jet-set, criminels, vedettes, extravertis, marginaux, geeks, mondes d'adrénaline, justiciers, adolescents. Trois collections ont déjà une page d'aperçu sur le site local. Les six autres sont des noms seulement : leurs fiches sont à venir et aucun personnage n'est inventé ici.</p>
<div class="grid" style="grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px">{cards}</div>
"""

t3 = """
<div class="kicker">Onglets 2 à 4 · Missions et clans</div>
<h2>Missions · Les gentils · Les méchants</h2>
<div class="rule"></div>
<div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:6px">
 <div class="card" style="min-height:330px">
  <span class="tag">Onglet · à venir</span>
  <h3 style="margin-top:12px;font-size:24px">Missions</h3>
  <p class="small" style="margin-top:8px">Onglet réservé aux missions du jeu console.</p>
  <p class="small" style="margin-top:10px">Aucune mission n'est encore écrite dans ce dossier. Les missions seront ajoutées par Valkyrie ; rien n'est inventé ici.</p>
 </div>
 <div class="card" style="min-height:330px">
  <span class="tag">Clan · à venir</span>
  <h3 style="margin-top:12px;font-size:24px">Les gentils</h3>
  <p class="small" style="margin-top:8px">Premier des deux clans de Dogzie Town.</p>
  <p class="small" style="margin-top:10px">Les collections et personnages qui en font partie restent à confirmer par Valkyrie. Aucun nom de personnage n'est ajouté.</p>
 </div>
 <div class="card" style="min-height:330px">
  <span class="tag">Clan · à venir</span>
  <h3 style="margin-top:12px;font-size:24px">Les méchants</h3>
  <p class="small" style="margin-top:8px">Second clan de Dogzie Town.</p>
  <p class="small" style="margin-top:10px">Les collections et personnages qui en font partie restent à confirmer par Valkyrie. Aucun nom de personnage n'est ajouté.</p>
 </div>
</div>
<p class="tiny" style="margin-top:18px">Les trois onglets sont prêts à recevoir le contenu. La répartition des neuf collections entre les deux clans n'est pas décidée dans ce document.</p>
"""

t4 = """
<div style="display:grid;grid-template-columns:1fr 470px;gap:40px">
 <div>
  <div class="kicker">Onglet 5 · PlayStation</div>
  <h2>Présentation PlayStation</h2>
  <div class="rule"></div>
  <p>Une présentation côté PlayStation existe déjà en fichier local : <b>Dogzie-Town-Sony-pitch.pdf</b> (16 pages, en anglais). Ce matériel appartient à ce dossier Dogzie Town.</p>
  <p class="small" style="margin-top:10px">Ce dossier ne dit pas que Sony a accepté, refusé, ou qu'il est partenaire. Aucune réponse n'est mentionnée.</p>
 </div>
 <div><img src="img/town-tapis.jpg" style="width:100%;border:1px solid rgba(212,175,55,.45);border-radius:6px;margin-top:20px"></div>
</div>"""


t5 = """
<div class="kicker">Onglets 6 et 7</div>
<h2>Export de tokens · Pitch pour les investisseurs</h2>
<div class="rule"></div>
<div class="grid" style="grid-template-columns:1fr 1fr;gap:20px">
 <div class="card" style="min-height:270px"><span class="tag">Principe seulement · pas encore détaillé</span>
  <h3 style="margin-top:12px;font-size:24px">Export de tokens</h3>
  <p class="small" style="margin-top:8px">Le principe : les jetons gagnés dans les missions du jeu console pourront être exportés vers un portefeuille, quand le joueur le choisit.</p>
  <p class="small" style="margin-top:10px">Ce n'est pas encore détaillé. Aucun mécanisme, aucun taux et aucune adresse ne sont donnés ici. Rien n'est déployé.</p>
 </div>
 <div class="card" style="min-height:270px"><span class="tag">À préparer</span>
  <h3 style="margin-top:12px;font-size:24px">Pitch pour les investisseurs</h3>
  <p class="small" style="margin-top:8px">Le pitch pour les investisseurs propre à Dogzie Town, le jeu console. Il appartient à ce dossier.</p>
  <p class="small" style="margin-top:10px">Ce n'est pas un partenariat avec Sony, et ce n'est pas le deck Dogzy Family Universe. Aucun chiffre n'est repris ici.</p>
 </div>
</div>
<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:22px;gap:30px">
 <div class="card" style="flex:1">
  <h3>Ce dossier se présente seul</h3>
  <ul class="small">
   <li>Le jeu console Dogzie Town : neuf collections, missions, deux clans.</li>
   <li>La présentation PlayStation, l'export de tokens (principe) et le pitch pour les investisseurs.</li>
   <li>Aucun autre document n'est nécessaire pour le montrer.</li>
  </ul>
  <p class="small" style="margin-top:8px">L'autre univers, Dogzy Family Universe (volet 2), a son propre dossier.</p>
 </div>
 <p class="sig" style="font-size:34px">Valkyrie</p>
</div>"""

open('Dogzie-Town-dossier-seul.html','w').write(doc("Dogzie Town — Volet 1", [t1,t2,t3,t4,t5]))

# ---------------- DOGZY FAMILY UNIVERSE ----------------
mosaic = "".join(f'<img src="img/{p}" style="width:100%;border-radius:3px;border:1px solid rgba(212,175,55,.35)">' for p in posters[:12])
f1 = f"""
<div style="display:grid;grid-template-columns:560px 1fr;gap:36px;height:100%;align-items:center">
 <div>
  <div class="kicker">Volet 2 · Le volet blockchain</div>
  <h1>Dogzy Family Universe</h1>
  <div class="rule"></div>
  <p style="font-size:17px">Ce dossier présente le volet blockchain seul, avec ses propres onglets. Il peut être montré sans aucun autre document.</p>
  <div style="margin-top:18px" class="card">
   <h3>Onglets de ce dossier</h3>
   <ul class="small" style="columns:2;column-gap:24px">
    <li><b>Personnages métiers</b></li><li><b>Accessoires nécessaires</b></li><li><b>Commerce</b></li>
    <li><b>Événements</b></li><li><b>Clés de la ville</b> (maire)</li><li><b>Galerie d'art</b></li>
    <li><b>Banque-échange</b></li><li><b>Pitch</b></li><li><b>Tokenomics</b></li>
   </ul>
  </div>
  <p class="tiny" style="margin-top:14px">Rien n'est ouvert, en vente ou déployé. Les éléments pas encore créés sont marqués « à venir ».</p>
 </div>
 <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px">{mosaic}</div>
</div>"""

thumbs = ""
for i, p in enumerate(posters, 1):
    label = names[i-1] if i <= 23 else ("Teacher" if i == 24 else "Sound Tech")
    lang = "" if i <= 23 else " · anglais"
    thumbs += f'<div><img src="img/{p}" style="width:100%;border-radius:3px;border:1px solid rgba(212,175,55,.35)"><div class="tiny" style="margin-top:2px">{i:02d} · {label}{lang}</div></div>'
f2 = f"""
<div class="kicker">Onglet 1 · Personnages métiers</div>
<h2>40 fiches métiers — l'évolution totale</h2>
<div style="display:grid;grid-template-columns:300px 1fr;gap:24px;margin-top:8px">
 <div>
  <p class="small">Valkyrie compte <b>40 fiches métiers (27 plus 13)</b>. Chaque fiche montre <b>l'évolution totale</b> du personnage, ses cinq niveaux. Chaque fiche est une option d'acquisition pour le jeu Dogzy Family Universe.</p>
  <div class="card" style="margin-top:12px">
   <p class="small"><b>25 affiches existent déjà</b> en local : 01 à 23 en français, plus Teacher et Sound Tech (en anglais seulement).</p>
   <p class="small" style="margin-top:8px"><b>Les autres ne sont pas encore dessinées.</b> Cuisinier, Serveuse et Barmaid n'ont pas encore d'affiche.</p>
   <p class="small" style="margin-top:8px">Aucun nom manquant n'est inventé et aucun nouveau personnage n'est dessiné.</p>
  </div>
  <p class="tiny" style="margin-top:12px">La frappe, une évolution à la fois, viendra plus tard avec le jeu. Elle n'est pas offerte.</p>
 </div>
 <div class="grid" style="grid-template-columns:repeat(6,1fr);gap:5px 7px">{thumbs}</div>
</div>"""

f3 = """
<div class="kicker">Onglets 2 à 5</div>
<h2>Accessoires · Commerce · Événements · Clés de la ville</h2>
<div class="rule"></div>
<div class="grid" style="grid-template-columns:1fr 1fr;gap:18px">
 <div class="card"><span class="tag">À venir</span><h3 style="margin-top:10px">Accessoires nécessaires</h3>
  <p class="small">Les accessoires qui accompagnent les personnages métiers. La liste reste à venir ; aucun accessoire n'est inventé ici.</p></div>
 <div class="card"><span class="tag">À venir</span><h3 style="margin-top:10px">Commerce</h3>
  <p class="small">Les commerces de la ville. Sur les affiches déjà faites, le dernier niveau de chaque métier mène à un commerce. La liste complète reste à venir.</p></div>
 <div class="card"><span class="tag">À venir</span><h3 style="margin-top:10px">Événements</h3>
  <p class="small">Cet onglet remplace « expansions ». Il comprend le <b>bateau de croisière</b>, la <b>marina</b> et l'<b>aéroport</b>. Les détails sont à venir ; aucune liste n'est inventée.</p></div>
 <div class="card"><span class="tag">À venir</span><h3 style="margin-top:10px">Clés de la ville</h3>
  <p class="small">L'onglet du <b>maire</b>. Le maire n'a pas encore de nom et aucun nom n'est inventé. Le contenu est à venir.</p></div>
</div>"""

f4 = """
<div class="kicker">Onglets 6 à 9</div>
<h2>Galerie d'art · Banque-échange · Pitch · Tokenomics</h2>
<div class="rule"></div>
<div class="grid" style="grid-template-columns:1fr 1fr;gap:16px">
 <div class="card"><span class="tag">Vente pas ouverte</span><h3 style="margin-top:10px">Galerie d'art</h3>
  <p class="small">Des <b>toiles prévues en NFT</b>, que les gens pourront acheter. La vente n'est pas ouverte. La galerie déjà montée par Valkyrie reste comme elle est ; aucun titre de toile n'est inventé ici.</p></div>
 <div class="card"><span class="tag">Pas ouverte</span><h3 style="margin-top:10px">Banque-échange</h3>
  <p class="small">Pour faire un échange en crypto Dogzy, le joueur clique sur la banque. <b>Son portefeuille est dedans.</b> La banque-échange n'est pas ouverte. Aucune adresse ni phrase secrète n'est donnée.</p></div>
 <div class="card"><h3>Pitch</h3>
  <p class="small">Le pitch Dogzy Family Universe appartient à ce dossier. Le fichier existant est gardé à part et n'est pas recopié ici.</p></div>
 <div class="card"><h3>Tokenomics</h3>
  <p class="small">Les tokenomics Dogzy Family Universe appartiennent à ce dossier. Rien n'est déployé ni audité. Aucun chiffre n'est repris ici.</p></div>
</div>
<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:18px">
 <div><p class="small"><b>Ce dossier se présente seul.</b> L'autre univers, Dogzie Town (volet 1, le jeu console), a son propre dossier.</p></div>
 <p class="sig" style="font-size:30px">Valkyrie</p>
</div>"""

open('Dogzy-Family-Universe-dossier-seul.html','w').write(doc("Dogzy Family Universe — Volet 2", [f1,f2,f3,f4]))
print("ok")
