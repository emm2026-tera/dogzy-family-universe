from helpers import *
def arrow(p,x0,x1,y):
    g=(0.831373,0.686275,0.215686)
    p.draw_line((x0,y),(x1-4,y),color=g,width=1)
    p.draw_polyline([(x1-5,y-3.5),(x1,y),(x1-5,y+3.5)],color=g,fill=g,closePath=True,width=0.5)
def principles_page(doc,idx,L,num,foot):
    p=new_page_base(doc,idx)
    put(p,L['title'],'Times-Bold',24,GOLD,54,80.39)
    n=para(p,L['intro'],'Helvetica',11,CREAM,54,121.9,16,504,maxlines=3)
    y=121.9+16*(n-1)+18
    for h,b in L['cards']:
        card(p,(54,y,558,y+52))
        put(p,h,'Helvetica-Bold',11,GOLD,68,y+14.9)
        para(p,b,'Helvetica',9,CREAM,68,y+31.46,12,476,maxlines=2)
        y+=62
    # PontDogzy card
    H=128; card(p,(54,y,558,y+H))
    put(p,L['pont_h'],'Helvetica-Bold',11,GOLD,68,y+14.9)
    para(p,L['pont_b'],'Helvetica',9,CREAM,68,y+31.46,12,476,maxlines=1)
    bw,gap=140,28; by=y+44; bh=46
    for i,s in enumerate(L['steps']):
        bx=68+i*(bw+gap)
        p.draw_rect(fitz.Rect(bx,by,bx+bw,by+bh),color=(0.164706,0.164706,0.188235),fill=(0.043137,0.043137,0.05098),width=0.75)
        put(p,str(i+1),'Times-Bold',18,GOLD,bx+10,by+29)
        lines=wrap(s,'Helvetica',8.5,bw-36)
        assert len(lines)<=3,s
        y0=by+bh/2-(len(lines)-1)*10.5/2+3
        for j,l in enumerate(lines): put(p,l,'Helvetica',8.5,CREAM,bx+30,y0+j*10.5)
        if i<2: arrow(p,bx+bw+5,bx+bw+gap-5,by+bh/2)
    para(p,L['pont_f'],'Helvetica',9,GREY,68,by+bh+16,12,476,maxlines=2)
    y+=H+10
    p.draw_rect(fitz.Rect(54,y,558,y+46),color=(0.831373,0.686275,0.215686),fill=(0.09,0.09,0.11),width=0.75)
    put(p,L['stat_h'],'Helvetica-Bold',11,GOLD,68,y+14.9)
    put(p,L['stat_b'],'Helvetica-Bold',10,CREAM,68,y+32)
    footer(p,num,foot)
    return p
FR=dict(title='Principes et PontDogzy',
 intro="Trois principes encadrent l'utilisation du DOGZY et le passage des jetons de jeu vers la blockchain. Ils s'appliquent aux trois jeux qui partagent le jeton : Dogzy Family Universe (Monopoly), Dogzy Town (console) et The Adoles-chiant of Dogzy Town (web3).",
 cards=[("Accessoires en DOGZY","L'achat d'accessoires se fait obligatoirement en DOGZY, dans chacun des trois jeux."),
  ("Export des jetons de jeu","Les jetons gagnés en jeu peuvent être exportés vers un portefeuille, puis échangés contre des DOGZY. Le taux d'échange n'est pas encore fixé."),
  ("Un personnage des deux côtés","Pour exporter des jetons, le joueur doit posséder un personnage des deux côtés : dans le jeu et sur la blockchain.")],
 pont_h='PontDogzy',pont_b="PontDogzy relie les jeux à la blockchain Avalanche. Chaque export suit trois étapes :",
 steps=["Un code à usage unique s'affiche dans le jeu","Le serveur valide le code","Les DOGZY sont créés (mint) sur Avalanche"],
 pont_f="PontDogzy et l'export des jetons s'appliquent aux trois jeux : Dogzy Family Universe, Dogzy Town et The Adoles-chiant of Dogzy Town.",
 stat_h='Statut du déploiement',stat_b="Le jeton n'est pas encore déployé sur Avalanche.")
EN=dict(title='Principles and PontDogzy',
 intro="Three principles govern how DOGZY is used and how in-game tokens move to the blockchain. They apply to all three games that share the token: Dogzy Family Universe (Monopoly), Dogzy Town (console) and The Adoles-chiant of Dogzy Town (web3).",
 cards=[("Accessories in DOGZY","Accessories must be purchased with DOGZY in each of the three games."),
  ("In-game token export","Tokens earned in-game can be exported to a wallet and then exchanged for DOGZY. The exchange rate has not yet been set."),
  ("A character on both sides","To export tokens, a player must own a character on both sides: in the game and on the blockchain.")],
 pont_h='PontDogzy',pont_b="PontDogzy connects the games to the Avalanche blockchain. Each export follows three steps:",
 steps=["A one-time code is displayed in the game","The server validates the code","DOGZY is minted on Avalanche"],
 pont_f="PontDogzy and token export apply to all three games: Dogzy Family Universe, Dogzy Town and The Adoles-chiant of Dogzy Town.",
 stat_h='Deployment status',stat_b="The token is not yet deployed on Avalanche.")
