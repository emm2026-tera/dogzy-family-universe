# Dogzy Universe — modèle de projections (illustratif). Source unique pour PDF et XLSX.
import math
def rnd(x): return math.floor(x+0.5)
SC = ["Prudent", "Normal", "Optimiste"]
YEARS = 5
# key: (label, unit, [P, N, O], group, note)
P = {}
def add(k, label, unit, vals, group, note=""):
    if not isinstance(vals, list): vals = [vals]*3
    P[k] = dict(label=label, unit=unit, vals=vals, group=group, note=note)

G1="1. Joueurs (Dogzie Town, console)"
add("new1","Nouveaux joueurs (achats du jeu) — An 1","joueurs",[3000,15000,60000],G1,"Copies vendues dans l'année")
add("new2","Nouveaux joueurs — An 2","joueurs",[4000,22000,110000],G1)
add("new3","Nouveaux joueurs — An 3","joueurs",[5000,30000,160000],G1)
add("new4","Nouveaux joueurs — An 4","joueurs",[5000,35000,200000],G1)
add("new5","Nouveaux joueurs — An 5","joueurs",[6000,40000,230000],G1)
add("ret","Rétention annuelle des joueurs actifs","%",[0.35,0.45,0.55],G1,"Part des joueurs d'une année qui restent actifs l'année suivante")
G2="2. Prix (identiques dans les 3 scénarios, $ CA)"
add("p_game","Prix moyen réalisé du jeu (après soldes)","$",24.99,G2,"Prix affiché visé ~29,99 $; soldes incluses")
add("p_dlc","Prix d'une extension (DLC)","$",9.99,G2,"5 extensions prévues : 1 par année")
add("n_dlc","Extensions lancées par année","nb",1,G2)
add("p_pass","Passe compétitive multijoueur (par année)","$",7.99,G2,"Duel 2 joueurs, camps toujours opposés")
add("p_acc","Dépense annuelle moyenne en accessoires (payée en Dogzy)","$",30,G2,"Valeur en $ CA au moment de l'achat")
add("p_nft","Prix moyen d'un NFT personnage","$",75,G2,"143 personnages; éditions à définir")
add("p_bldg","Prix moyen d'un lot NFT bâtiment / carte","$",350,G2,"46 bâtiments x 5 éditions = 230 lots de base")
add("p_valk","Prix moyen d'une édition NFT Valkyrie (collection mensuelle)","$",100,G2)
add("p_canvas","Prix moyen d'une toile physique","$",1500,G2,"À confirmer avec l'historique de ventes réel")
add("p_merch","Panier moyen marchandise","$",40,G2)
add("p_venue","Passe NFT d'un lieu thématique (par lieu, par année)","$",12,G2,"Croisière, événements sportifs, casino-lieu (sans jeu d'argent)")
G3="3. Conversions et volumes (ce qui change d'un scénario à l'autre)"
add("c_dlc","Joueurs actifs qui achètent l'extension de l'année","%",[0.15,0.25,0.35],G3)
add("c_pass","Joueurs actifs qui achètent la passe compétitive","%",[0.03,0.06,0.10],G3)
add("c_acc","Joueurs actifs qui achètent des accessoires en Dogzy","%",[0.03,0.06,0.10],G3,"Exige un portefeuille : conversion volontairement basse")
add("c_nft","Joueurs actifs qui achètent un NFT personnage dans l'année","%",[0.01,0.02,0.03],G3)
add("nft_native","Acheteurs NFT venant du milieu crypto (hors joueurs) / an","nb",[150,300,600],G3)
add("bldg_lots","Lots NFT bâtiments / carte vendus par année","nb",[10,25,45],G3,"Max 5 ans : 225 lots ≤ 230 de base")
add("valk_ed","Éditions Valkyrie vendues par collection mensuelle — An 1","nb",[10,25,60],G3,"12 collections par année")
add("valk_g","Croissance annuelle des éditions Valkyrie","%",[0.10,0.20,0.30],G3)
add("canvas","Toiles physiques vendues — An 1","nb",[10,18,30],G3,"Repère fondatrice : 37 toiles dans le monde à ce jour")
add("canvas_g","Croissance annuelle des ventes de toiles","%",[0.10,0.15,0.25],G3)
add("c_merch","Joueurs actifs qui achètent de la marchandise","%",[0.01,0.02,0.03],G3)
add("c_venue","Joueurs actifs qui achètent la passe d'un lieu thématique","%",[0.02,0.04,0.06],G3)
add("sponsor","Commandites par lieu thématique actif / an","$",[0,10000,40000],G3)
add("turnover","Revente secondaire annuelle (% de la valeur NFT primaire cumulée)","%",[0.25,0.40,0.60],G3)
add("c_export","Détenteurs (perso. dans Universe ET Town) qui exportent des jetons","%",[0.30,0.40,0.50],G3)
G4="4. Taux, frais et déductions"
add("royalty","Redevance sur reventes NFT secondaires","%",0.05,G4)
add("v_export","Valeur moyenne exportée par détenteur / an","$",20,G4,"Ex. 500 000 jetons de jeu ↔ 5 Dogzy, selon la valeur")
add("f_export","Frais de plateforme sur l'export de jetons","%",0.02,G4)
add("resale","Revente pair-à-pair d'accessoires (% des ventes d'accessoires)","%",0.20,G4)
add("f_resale","Frais de plateforme sur revente d'accessoires","%",0.025,G4)
add("sony","Part PlayStation sur ventes numériques (jeu, DLC, passe)","%",0.30,G4)
add("gallery","Commission moyenne galeries / plateformes sur toiles","%",0.30,G4,"Mélange ventes directes et plateformes (ex. Singulart)")
add("merch_cost","Coût de production de la marchandise","%",0.55,G4,"Impression sur demande")
add("infl","Redevances influenceurs (5 x 1 % à vie)","%",0.05,G4,"Appliquées au revenu BRUT total (hypothèse prudente)")
VENUES = [0,0,1,2,3]  # lieux thématiques actifs : croisière An3, sports An4, casino-lieu An5

STREAMS = [("A","Console — Dogzie Town"),("B","Blockchain — Dogzy Universe"),("C","Art physique — Galerie Valkyrie"),("D","Marchandise / marque"),("E","Lieux thématiques (expansions)")]

def compute(s):
    v = {k: P[k]["vals"][s] for k in P}
    r = {k: [0.0]*YEARS for k in ["new","active","A1","A2","A3","A4","B1m","B1","B2","B3e","B3","B4","B5","Cn","C","D","E",
         "A","B","gross","d_sony","d_gal","d_merch","d_infl","ded","net","holders"]}
    cumprim = 0; holders = 0; act = 0
    for t in range(YEARS):
        new = v[f"new{t+1}"]; act = act*v["ret"] + new
        r["new"][t]=new; r["active"][t]=act
        r["A1"][t]=new*v["p_game"]
        r["A2"][t]=act*v["c_dlc"]*v["p_dlc"]*v["n_dlc"]
        r["A3"][t]=act*v["c_pass"]*v["p_pass"]
        r["A4"][t]=act*v["c_acc"]*v["p_acc"]
        m = act*v["c_nft"]+v["nft_native"]; r["B1m"][t]=m; r["B1"][t]=m*v["p_nft"]
        holders += m; r["holders"][t]=holders
        r["B2"][t]=v["bldg_lots"]*v["p_bldg"]
        e = rnd(v["valk_ed"]*(1+v["valk_g"])**t); r["B3e"][t]=e; r["B3"][t]=12*e*v["p_valk"]
        cumprim += r["B1"][t]+r["B2"][t]+r["B3"][t]
        r["B4"][t]=cumprim*v["turnover"]*v["royalty"]
        r["B5"][t]=holders*v["c_export"]*v["v_export"]*v["f_export"] + r["A4"][t]*v["resale"]*v["f_resale"]
        n = rnd(v["canvas"]*(1+v["canvas_g"])**t); r["Cn"][t]=n; r["C"][t]=n*v["p_canvas"]
        r["D"][t]=act*v["c_merch"]*v["p_merch"]
        r["E"][t]=VENUES[t]*(act*v["c_venue"]*v["p_venue"]+v["sponsor"])
        r["A"][t]=r["A1"][t]+r["A2"][t]+r["A3"][t]+r["A4"][t]
        r["B"][t]=r["B1"][t]+r["B2"][t]+r["B3"][t]+r["B4"][t]+r["B5"][t]
        r["gross"][t]=r["A"][t]+r["B"][t]+r["C"][t]+r["D"][t]+r["E"][t]
        r["d_sony"][t]=(r["A1"][t]+r["A2"][t]+r["A3"][t])*v["sony"]
        r["d_gal"][t]=r["C"][t]*v["gallery"]
        r["d_merch"][t]=r["D"][t]*v["merch_cost"]
        r["d_infl"][t]=r["gross"][t]*v["infl"]
        r["ded"][t]=r["d_sony"][t]+r["d_gal"][t]+r["d_merch"][t]+r["d_infl"][t]
        r["net"][t]=r["gross"][t]-r["ded"][t]
    return r
R = [compute(s) for s in range(3)]
import math
def cum(x,n): return sum(x[:n])
if __name__=="__main__":
    for s in range(3):
        r=R[s]; print(SC[s])
        for k in ["active","A","B","C","D","E","gross","ded","net"]:
            print(f"  {k:6}", [round(x) for x in r[k]], "cum3",round(cum(r[k],3)),"cum5",round(cum(r[k],5)))
