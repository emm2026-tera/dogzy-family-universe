#!/usr/bin/env python3
# Génère les embeds Webador Dogzy à partir des sources locales uniquement.
import csv, json, os, html
from pathlib import Path
W = Path('/workspace'); OUT = W/'dogzy-webador-embeds'
E = html.escape
CONTACT = 'lavalkirieartistepeintre@hotmail.com'

CSS = """<style>
.dz{background:#0A0A0A;color:#e9e4d4;font-family:Georgia,'Times New Roman',serif;line-height:1.55;padding:28px 18px;border-radius:10px;max-width:1160px;margin:0 auto;box-sizing:border-box}
.dz *{box-sizing:border-box}
.dz h2{color:#D4AF37;font-size:1.9em;margin:0 0 .3em;letter-spacing:.02em}
.dz h3{color:#D4AF37;font-size:1.2em;margin:0 0 .4em}
.dz h4{color:#D4AF37;margin:.8em 0 .3em;font-size:1em}
.dz p{margin:.4em 0}
.dz .lead{color:#cfc8b3;font-size:1.05em;max-width:820px}
.dz .kick{color:#D4AF37;text-transform:uppercase;letter-spacing:.15em;font-size:.75em;margin-bottom:.4em}
.dz .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin:18px 0}
.dz .card{border:1px solid rgba(212,175,55,.35);border-radius:10px;padding:16px;background:#111}
.dz .card .no{color:#D4AF37;font-size:.75em;letter-spacing:.12em;text-transform:uppercase}
.dz .meta{color:#a9a28c;font-size:.9em}
.dz ol,.dz ul{margin:.4em 0 .4em 1.2em;padding:0}
.dz li{margin:.15em 0}
.dz .badge{display:inline-block;border:1px solid #D4AF37;color:#D4AF37;border-radius:999px;padding:1px 9px;font-size:.72em;margin:2px 4px 2px 0;vertical-align:middle}
.dz .badge.soon{border-color:#6b6656;color:#a9a28c}
.dz .note{border-left:3px solid #D4AF37;background:#141210;padding:10px 14px;margin:16px 0;color:#cfc8b3;font-size:.92em}
.dz a{color:#D4AF37}
.dz .btn{display:inline-block;background:#D4AF37;color:#0A0A0A;text-decoration:none;font-weight:bold;padding:7px 14px;border-radius:6px;margin-top:8px;font-size:.9em}
.dz details{border-top:1px solid rgba(212,175,55,.25);margin-top:10px;padding-top:8px}
.dz summary{cursor:pointer;color:#D4AF37}
.dz table{width:100%;border-collapse:collapse;margin:10px 0;font-size:.92em}
.dz th,.dz td{border-bottom:1px solid rgba(212,175,55,.2);padding:7px 6px;text-align:left;vertical-align:top}
.dz th{color:#D4AF37;font-weight:normal;text-transform:uppercase;font-size:.75em;letter-spacing:.1em}
.dz .foot{margin-top:24px;color:#7d7766;font-size:.78em;border-top:1px solid rgba(212,175,55,.2);padding-top:10px}
</style>"""
FOOT = ('<p class="foot">Vision et plan — pas de promesses. Aucune vente ouverte. '
        'Propriété intellectuelle exclusive de l’artiste Valkyrie (Sania Labbé). © 2026 Dogzy Family Universe · thedogzyfamilyuniverse.ca</p>')

def page(name, cls, body):
    s = f'<!-- Dogzy Webador Code Embed : {name} — généré depuis les fichiers locaux, coller tel quel dans un bloc « Code / Embed » -->\n'
    s += f'<div class="dz {cls}">\n{CSS}\n{body}\n{FOOT}\n</div>\n'
    (OUT/name).write_text(s, encoding='utf-8'); return len(s)

def ask(label):
    from urllib.parse import quote
    return f'<a class="btn" href="mailto:{CONTACT}?subject={quote("Demande de document : "+label)}">Demander le document</a>'

# ---------- données ----------
roster = list(csv.DictReader(open(W/'dogzy-metiers/roster.csv', encoding='utf-8')))
data = json.load(open(W/'dogzy-metiers/donnees-metiers.json', encoding='utf-8'))
orig = {p['no']: p for p in data['personnages'] if not p['source_titres_accessoires'].startswith('Nouvelle fiche')}
posters_fr = sorted(f for f in os.listdir(W/'dogzy-metiers') if f.endswith('.jpg'))
posters_en = sorted(os.listdir(W/'dogzy-metiers/en'))
poster_by_no = {f[:2]: f for f in posters_fr}
extra_en = [f for f in posters_en if f[:2] not in {r['no'] for r in roster}]  # 24, 25
guides = sorted(f for f in os.listdir(W/'dogzy-metiers/guides') if f.endswith('.pdf'))
guide_by_no = {f[:2]: f for f in guides}
SEXE = {'M': 'Mâle', 'F': 'Femelle'}
cap = lambda s: s[:1].upper()+s[1:]
counts = {}

# ---------- 1. fiches métiers ----------
cards = []
for r in roster:
    no = r['no']; lv = [r[f'niveau{i}'] for i in range(1, 6)]
    b = []
    if no in poster_by_no: b.append('<span class="badge">Affiche prête</span>')
    else: b.append('<span class="badge soon">Affiche à venir</span>')
    if no in guide_by_no: b.append('<span class="badge">Guide du joueur PDF</span>')
    if no in orig: b.append('<span class="badge">Fiche originale de Sania</span>')
    c = (f'<div class="card"><div class="no">Métier {E(no)}</div><h3>{E(r["metier"])}</h3>{"".join(b)}'
         f'<p class="meta">Race : {E(r["race"])} · Sexe : {SEXE.get(r["sexe"], r["sexe"])}<br>Personnalité : {E(cap(r["personnalite"]))}</p>'
         '<ol>' + ''.join(f'<li><b>Niveau {i}</b> — {E(t)}</li>' for i, t in enumerate(lv, 1)) + '</ol>')
    if no in orig:
        c += '<details><summary>Accessoires et environnements (fiche originale)</summary><table><tr><th>Niv.</th><th>Environnement</th><th>5 accessoires</th></tr>'
        for n in orig[no]['niveaux']:
            c += f'<tr><td>{n["niveau"]}</td><td>{E(n["environnement"])}</td><td>{E(" · ".join(a["nom"] for a in n["accessoires"]))}</td></tr>'
        c += '</table></details>'
    cards.append(c + '</div>')
for f in extra_en:
    no, rest = f[:2], f[3:-4]
    parts = rest.split('-'); 
    known = {'24': ('Teacher', 'Bernese'), '25': ('Sound Tech', 'Corgi')}
    t, race = known.get(no, (rest, ''))
    cards.append(f'<div class="card"><div class="no">Métier {no} · affiche en anglais</div><h3>{E(t)}</h3><span class="badge">Affiche prête</span>'
                 f'<p class="meta">Race (selon le nom du fichier) : {E(race)}</p><p>Pas encore au registre : titre français, sexe, personnalité et niveaux à confirmer. Les cinq niveaux sont visibles sur l’affiche.</p></div>')
n_fiches = len(roster) + len(extra_en)
body = (f'<div class="kick">Dogzy Family Universe · Volet blockchain</div><h2>Fiches métiers</h2>'
        f'<p class="lead">Chaque métier évolue en cinq niveaux, de l’apprenti jusqu’au propriétaire. '
        f'{len(roster)} métiers au registre, {len(posters_fr)+len(posters_en)-len([x for x in posters_en if x[:2] in poster_by_no])} affiches prêtes. '
        'L’ensemble complet prévu compte 40 personnages métiers; les autres ne sont pas encore dessinés.</p>'
        '<div class="note">' + ''.join(f'<p>• {E(x)}</p>' for x in data['regles_generales']) + '</div>'
        '<div class="grid">' + ''.join(cards) + '</div>'
        '<p class="note">Les noms de personnages ne sont pas affichés : ils sont encore à valider par Valkyrie. Les accessoires des autres métiers seront publiés avec les fiches validées.</p>')
counts['fiches-metiers.html'] = page('fiches-metiers.html', 'dz-metiers', body)

# ---------- 2. commerces ----------
rows = ''.join(f'<tr><td>{E(r["no"])}</td><td>{E(r["metier"])}</td><td>{E(r["niveau4"])}</td><td><b>{E(r["niveau5"])}</b></td></tr>' for r in roster)
body = ('<div class="kick">Dogzy Family Universe · Du métier au commerce</div><h2>Commerces</h2>'
        '<p class="lead">Le commerce, c’est le niveau 5 de chaque métier. Le premier joueur à compléter possède le commerce; les suivants peuvent acheter une franchise.</p>'
        f'<table><tr><th>No</th><th>Métier</th><th>Niveau 4</th><th>Niveau 5 · Commerce</th></tr>{rows}</table>'
        '<h3>Lieux et événements prévus</h3><div class="grid">'
        '<div class="card"><h3>Bateau de croisière</h3><span class="badge soon">À venir</span></div>'
        '<div class="card"><h3>Marina</h3><span class="badge soon">À venir</span></div>'
        '<div class="card"><h3>Aéroport</h3><span class="badge soon">À venir</span><p>C’est aussi le niveau 5 du métier Pilote.</p></div>'
        '<div class="card"><h3>Banque-échange</h3><span class="badge soon">Pas encore ouverte</span><p>Le portefeuille du joueur se trouvera à l’intérieur de la banque-échange. Aucun portefeuille ni adresse publiés.</p></div>'
        '<div class="card"><h3>Galerie d’art</h3><p>Liée à la Galerie Valkyrie. Les toiles sont prévues en NFT; la vente n’est pas encore ouverte.</p></div>'
        '</div>')
counts['commerces.html'] = page('commerces.html', 'dz-commerces', body)

# ---------- collections (texte des pages v2) ----------
COLL = [
 ('Jet Set', 'Luxe, prestige et soirées mondaines — la façade brillante de Dogzie Town.',
  'Le Jet Set incarne le « bon côté » : vedettes, protecteurs du luxe, figures de la haute société. Ils évoluent entre yachts, jets privés et événements chic.',
  'Dans les missions, ils protègent colis précieux, diamants et réputation de la ville. Ils s’opposent souvent aux Criminels, tout en croisant Justiciers et autres factions selon le scénario.', 11),
 ('Criminels', 'L’ombre de Dogzie Town — audace, poursuites et coups risqués (fiction de jeu).',
  'Les Criminels forment le camp du « mauvais côté ». Braqueurs, voleurs élégants ou opportunistes, ils apportent tension et adrénaline aux missions.',
  'Ils tentent des coups sur bijoux, banques ou soirées mondaines. Face au Jet Set et aux Justiciers, ils font vivre le conflit narratif qui anime Dogzie Town — sans jamais glorifier le crime hors du cadre fictionnel du jeu.', 8),
 ('Vedettes', None, None, None, 0), ('Extravertis', None, None, None, 0),
 ('Marginaux (Outcasts)', 'Marginaux, excentriques et rebelles — ceux qui refusent les cases.',
  'Les Outcasts (marginaux / excentriques) peuplent les zones grises de Dogzie Town : adoléchiens dramatiques, mordus d’adrénaline, figures hors-norme.',
  'Ils apportent chaos créatif, humour et missions décalées. Parfois alliés, parfois en travers des plans des autres camps — ils rendent la ville imprévisible et vivante.', 8),
 ('Geeks', None, None, None, 0), ('Mondes d’adrénaline', None, None, None, 0), ('Justiciers', None, None, None, 0), ('Adolescents', None, None, None, 0)]

# ---------- 3. missions ----------
body = ('<div class="kick">Dogzie Town · Jeu console</div><h2>Missions</h2>'
        '<div class="note">En développement. Les missions de Dogzie Town sont en conception. Le détail sera publié dès qu’il sera validé par Valkyrie.</div>'
        '<h3>Gameplay envisagé (console)</h3><ul><li>Monde ouvert (exploration, magasinage, condo, véhicules)</li><li>Courses et poursuites</li>'
        '<li>Missions de braquage / luxe (fiction de jeu)</li><li>Deux camps (bon / mauvais côté) — en multijoueur, les joueurs s’affrontent</li></ul>'
        '<h3>Rôle des collections dans les missions</h3><div class="grid">'
        + ''.join(f'<div class="card"><h3>{E(c[0])}</h3><p>{E(c[3])}</p></div>' for c in COLL if c[3]) +
        '</div><h3>Missions et progression des métiers</h3><ul>' + ''.join(f'<li>{E(x)}</li>' for x in data['regles_generales']) + '</ul>'
        '<h3>Univers / clans</h3><p><span class="badge soon">Les gentils · à venir</span> <span class="badge soon">Les méchants · à venir</span></p>')
counts['missions.html'] = page('missions.html', 'dz-missions', body)

# ---------- 4. collections index ----------
cc = ''
for i, (t, tag, who, role, nimg) in enumerate(COLL, 1):
    if tag:
        cc += (f'<div class="card"><div class="no">Collection {i}</div><h3>{E(t)}</h3><span class="badge">{nimg} visuels</span>'
               f'<p><i>{E(tag)}</i></p><h4>Qui sont-ils ?</h4><p>{E(who)}</p><h4>Rôle dans Dogzie Town</h4><p>{E(role)}</p></div>')
    else:
        cc += f'<div class="card"><div class="no">Collection {i}</div><h3>{E(t)}</h3><span class="badge soon">À venir</span></div>'
body = ('<div class="kick">Dogzie Town · Jeu console</div><h2>Les 9 collections</h2>'
        '<p class="lead">Ville sous construction — le cœur jouable de Dogzie Universe. Ambiance luxe inspirée de Dubaï et Saint-Martin. '
        'Chaque personnage a une histoire, un métier, une personnalité et un rôle.</p>'
        f'<div class="grid">{cc}</div><p class="note">Plan, pas promesse. Dogzie Town sur console est en phase de préparation / financement.</p>')
counts['collections-index.html'] = page('collections-index.html', 'dz-collections', body)

# ---------- 5. documents ----------
DOCS = [
 ('Pitch deck investisseurs', 'pitch-deck/pitch-deck-investisseurs.pdf', 'PDF'),
 ('Pitch deck avec projections', 'pitch-deck/pitch-deck-investisseurs-avec-projections.pdf', 'PDF'),
 ('Dossier investisseurs noir et or', 'pitch-deck/Dogzy-investisseurs-noir-or.pdf', 'PDF'),
 ('Projections de revenus', 'pitch-deck/projections-revenus.pdf', 'PDF'),
 ('Projections de revenus (tableur)', 'pitch-deck/projections-revenus.xlsx', 'XLSX'),
 ('Tokenomics', 'tokenomics/tokenomics.pdf', 'PDF'),
 ('Présentation — les deux univers ensemble', 'presentation/presentation-vision-ensemble.pdf', 'PDF'),
 ('Dogzie Town — présentation console (anglais). Matériel de présentation, pas un partenariat Sony.', 'presentation/presentation-PlayStation-anglais.pdf', 'PDF'),
 ('Dossier Dogzie Town seul', 'dossiers-separes/Dogzie-Town-dossier-seul.pdf', 'PDF'),
 ('Dossier Dogzy Family Universe seul', 'dossiers-separes/Dogzy-Family-Universe-dossier-seul.pdf', 'PDF')]
docs_ok = [d for d in DOCS if (W/'Dogzy/Acquisition'/d[1]).exists()]
gd = [(f'Guide du joueur — {f[3:-4].capitalize()}', 'dogzy-metiers/guides/'+f, 'PDF') for f in guides]
def doccard(t, p, k):
    return f'<div class="card"><span class="badge">{k}</span><h3>{E(t)}</h3><p class="meta">{E(os.path.basename(p))}</p>{ask(t)}</div>'
body = ('<div class="kick">Partenaires et investisseurs</div><h2>Documents</h2>'
        '<p class="lead">Dossiers de présentation de Dogzy Family Universe et Dogzie Town. Envoyés sur demande.</p>'
        '<h3>Dossier d’acquisition Dogzy</h3><div class="grid">' + ''.join(doccard(*d) for d in docs_ok) + '</div>'
        '<h3>Guides du joueur par métier</h3><div class="grid">' + ''.join(doccard(*d) for d in gd) + '</div>'
        '<p class="note">Vision et plan — pas de promesses de rendement. Contrats non déployés, non audités. Aucune offre de titres.</p>')
counts['documents-index.html'] = page('documents-index.html', 'dz-documents', body)

# ---------- 6. Valkyrians ----------
VA = W/'Valkyrian/Acquisition'; VS = W/'valkyrians-site'
vis = sorted(os.listdir(VA/'visuels'))
tk = sorted(os.listdir(VA/'videos-animees'))
ouv = sorted(f for f in os.listdir(VS/'media') if f.startswith('ouverture'))
origv = sorted(os.listdir(VS/'media/originaux'))
chars = [('Valkyrian', 'Lénaire', 'Description à venir.'), ('Valkyrian', 'Chris', 'Description à venir.'),
         ('Héroïne', 'Super Heratzy', 'Le cœur de l’espoir.'), ('Vilain', 'Osuryx', 'Il mange tout… et il tire sur tout.')]
vdocs = [('Présentation de vente — 6 pages', 'presentation/presentation-6-pages.pdf', 'PDF'),
         ('Offre de vente (FR)', 'dossier/offre-de-vente-FR.pdf', 'PDF'), ('Offer for sale (EN)', 'dossier/offre-de-vente-EN.pdf', 'PDF'),
         ('Pitch français', 'courriels/pitch-FR.txt', 'Texte')]
vdocs = [d for d in vdocs if (VA/d[1]).exists()]
nice = lambda f: f[3:-4].replace('-', ' ').capitalize()
body = ('<div class="kick">Deuxième univers · Sania Labbé / Valkyrie</div><h2>The Valkyrians</h2>'
        '<p class="lead">Univers jeunesse original, déjà créé par la même artiste que Dogzy Family Universe : maquette, visuels, page Facebook, animation 3D, vidéo d’animation et thème musical officiel <i>L’Ivalkyrienne à la rescousse de la planète</i>. Il reste la production.</p>'
        '<div class="note">IP sœur, distincte de Dogzy. Aucune tokenomics Dogzy n’est associée à The Valkyrians. Aucun partenariat Sony n’est revendiqué.</div>'
        '<h3>La mission</h3><p>Les Valkyrians sont les protecteurs de 10 métavers. Ils forment une équipe de 18. Leur prochaine mission, c’est la Terre : des vilains vont l’envahir, prendre tout l’oxygène et faire des humains leurs esclaves. Les Valkyrians doivent les en empêcher.</p>'
        '<h3>Fiches personnages</h3><div class="grid">' + ''.join(f'<div class="card"><div class="no">{E(r)}</div><h3>{E(n)}</h3><p>{E(d)}</p></div>' for r, n, d in chars) +
        '</div><p class="meta">Les 14 autres personnages des 18 ne sont pas encore présentés.</p>'
        '<h3>Jeux</h3><div class="grid"><div class="card"><h3>Mode course</h3><p>Dans l’esprit de Sonic : des boucles, des scènes le long de l’anneau et des objets à lancer.</p></div>'
        '<div class="card"><h3>Mode party</h3><p>Dans l’esprit d’un jeu de plateau, avec des mini-jeux.</p></div>'
        '<div class="card"><h3>Mode histoire</h3><p>Les 18 protecteurs arrivent sur Terre pour empêcher les super-vilains de voler l’oxygène.</p></div>'
        '<div class="card"><h3>Jeu éducatif</h3><p>Dans l’esprit de Lapin Malin : écrire, compter, les lettres, les chiffres, les formes et les couleurs.</p></div></div>'
        '<p class="meta">The Valkyrians n’est affilié ni à Sonic ni à Lapin Malin.</p>'
        f'<h3>Vidéos animées</h3><p>{len(ouv)} scènes d’ouverture (le vaisseau en route vers la Terre), {len(origv)} clips originaux et {len(tk)} extraits TikTok.</p>'
        '<a class="btn" href="https://www.tiktok.com/@valkyrie.artists" target="_blank" rel="noopener">Voir sur TikTok @valkyrie.artists</a>'
        f'<h3>Visuels clés ({len(vis)} planches)</h3><ul>' + ''.join(f'<li>{E(nice(v))}</li>' for v in vis) + '</ul>'
        '<h3>Produits dérivés</h3><p>Peluches, vêtements, papeterie… Ce sont des possibilités seulement. Rien n’est décidé ni en production. Chaque métavers peut devenir une nouvelle aventure.</p>'
        '<h3>Acquisition</h3><p><b>350 000 $ US</b> pour le film, la série, le jeu vidéo et le jeu éducatif, ensemble. Trois choix de paiement. Les noms « The Valkyrians » et « Valkyrie » restent à Sania Labbé.</p>'
        '<h3>Documents</h3><div class="grid">' + ''.join(doccard(*d) for d in vdocs) + '</div>'
        f'<p>Contact : <a href="mailto:{CONTACT}">{CONTACT}</a> · 1 367 330-5678 · <a href="https://lavalkirieartistepeintre.ca" target="_blank" rel="noopener">lavalkirieartistepeintre.ca</a></p>')
counts['valkyrians-hub.html'] = page('valkyrians-hub.html', 'dz-valkyrians', body)

stats = dict(roster=len(roster), extra_en=len(extra_en), fiches=n_fiches, orig=len(orig), posters_fr=len(posters_fr), posters_en=len(posters_en),
             guides=len(guides), commerces=len(roster), collections=9, coll_ready=3, docs=len(docs_ok), vdocs=len(vdocs),
             vis=len(vis), tiktok=len(tk), ouv=len(ouv), origv=len(origv), chars=len(chars))
json.dump({'sizes': counts, 'stats': stats}, open(OUT/'_stats.json', 'w'), indent=1, ensure_ascii=False)
print(json.dumps({'sizes': counts, 'stats': stats}, indent=1, ensure_ascii=False))
