from helpers import *
def dist_page(doc,idx,L,num,foot):
    p=new_page_base(doc,idx)
    put(p,L['title'],'Times-Bold',24,GOLD,54,80.39)
    put(p,L['intro'],'Helvetica',11,CREAM,54,121.9)
    y=160
    for i,(h,b) in enumerate(L['steps']):
        lines=wrap(b,'Helvetica',9,437)
        hgt=64+12*max(0,len(lines)-2)
        card(p,(54,y,558,y+hgt))
        put(p,str(i+1),'Times-Bold',26,GOLD,72,y+35.76+6*max(0,len(lines)-2))
        put(p,h,'Helvetica-Bold',11.5,GOLD,106,y+16.26)
        for j,l in enumerate(lines): put(p,l,'Helvetica',9,CREAM,106,y+32.46+12*j)
        y+=hgt+10
    para(p,L['note'],'Helvetica-Oblique',9.5,GREY,54,y-10+3.82,13,490,maxlines=3)
    footer(p,num,foot)
    return p
FR=dict(title='Mécanique de distribution',
 intro="Le DOGZY entre en circulation par l'engagement, et non par une vente publique de jetons.",
 steps=[("Inclusion NFT","Chaque NFT Jetset VIP est livré avec 1 000 DOGZY. La première collection à elle seule (58 personnages x 20 éditions) achemine 1 160 000 DOGZY directement aux collectionneurs. Les personnages NFT Or du Dogzy Family Universe (Monopoly) incluent aussi 1 000 DOGZY chacun, livrés au lancement de The Adoles-chiant of Dogzy Town, et donnent 15 % de rabais sur l'achat du même personnage dans The Adoles-chiant of Dogzy Town."),
  ("Jouer et progresser","Les personnages gagnent des DOGZY en travaillant, en progressant et en possédant des entreprises dans les trois jeux - Dogzy Family Universe (Monopoly), Dogzy Town (console) et The Adoles-chiant of Dogzy Town (web3) - une récompense de la participation active."),
  ("Staker et gouverner","Les collectionneurs mettent leurs gains en staking pour le rendement et le pouvoir de vote, ce qui réduit l'offre en circulation tout en approfondissant l'engagement."),
  ("Dépenser et faire circuler","Le DOGZY revient dans le circuit par le commerce de la ville, les enchères et le marché - les redevances alimentant la trésorerie pour la pérennité.")],
 note="Note de conformité : le modèle de récompense au lancement utilise des récompenses garanties en jetons plutôt que des tirages au hasard. Un mécanisme de tirage sous licence distinct pourra suivre après le lancement.")
EN=dict(title='Distribution mechanics',
 intro="DOGZY enters circulation through engagement, not through a public token sale.",
 steps=[("NFT inclusion","Every Jetset VIP NFT comes with 1,000 DOGZY. The first collection alone (58 characters x 20 editions) routes 1,160,000 DOGZY directly to collectors. Gold NFT characters from Dogzy Family Universe (Monopoly) also include 1,000 DOGZY each, delivered at the launch of The Adoles-chiant of Dogzy Town, and give 15% off the purchase of the same character in The Adoles-chiant of Dogzy Town."),
  ("Play and progress","Characters earn DOGZY by working, progressing and owning businesses in all three games - Dogzy Family Universe (Monopoly), Dogzy Town (console) and The Adoles-chiant of Dogzy Town (web3) - a reward for active participation."),
  ("Stake and govern","Collectors stake their earnings for yield and voting power, reducing circulating supply while deepening engagement."),
  ("Spend and circulate","DOGZY flows back into the loop through city commerce, auctions and the marketplace - with royalties feeding the treasury for long-term sustainability.")],
 note="Compliance note: the launch reward model uses guaranteed token rewards rather than random draws. A separate licensed draw mechanism may follow after launch.")
