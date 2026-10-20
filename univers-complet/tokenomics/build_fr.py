from helpers import *
from newpage import principles_page, FR
from contractspage import contracts_page, FR as CFR
from distpage import dist_page, FR as DFR
d=fitz.open('orig.pdf')
FOOT='© 2026 The Dogzy Family Universe  |  DOGZY Tokenomics  |  Tous droits réservés - Document confidentiel'
def line_rect(x0,y0,x1,y1): return (x0-0.5,y0+1.2,x1+0.5,y1-1.2)
# page 2 (idx1): Aperçu paragraph + total supply
p=d[1]
redact(p,[line_rect(54,110.1,557,125.2),line_rect(54,126.1,557,141.2),line_rect(54,142.1,188,157.2),line_rect(224,298.4,416,312.2),line_rect(224,332.4,493,346.2),line_rect(224,366.4,469,380.2)])
put(p,'8 contrats intelligents','Helvetica',10,CREAM,224,377.18)
put(p,'Inclus avec chaque NFT Jetset VIP - 1 000 DOGZY par NFT','Helvetica',9.5,CREAM,224,337.9)
put(p,'+ personnages NFT Or (Dogzy Family Universe) : 1 000 DOGZY chacun','Helvetica',9.5,CREAM,224,348.9)
para(p,"$DOGZY est le jeton utilitaire natif du Dogzy Family Universe, déployé sur Avalanche C-Chain. C'est la monnaie commune des trois jeux qui le partagent - Dogzy Family Universe (Monopoly), Dogzy Town (console) et The Adoles-chiant of Dogzy Town (web3) : chaque achat, récompense, mise en staking et vote de gouvernance y fonctionne au DOGZY.",'Helvetica',11,CREAM,54,121.9,16,504,maxlines=4)
put(p,'100 000 000 000 DOGZY (fixe, sans inflation)','Helvetica',10,CREAM,224,309.18)
# page 3: table + chart
p=d[2]
nums=[(417.46,'30 000 000 000'),(439.46,'20 000 000 000'),(461.46,'20 000 000 000'),(483.46,'15 000 000 000'),(505.46,'10 000 000 000'),(527.46,'5 000 000 000')]
redact(p,[(228.5,y-8.5,280,y+1.5) for y,_ in nums])
for y,t in nums: put(p,t,'Helvetica',9,GOLD,229,y)
p.replace_image(9,filename='chart_new.png')
# page 4: Utilité intro
p=d[3]
redact(p,[line_rect(54,110.1,539,125.2),line_rect(54,126.1,172,141.2)])
para(p,"Le DOGZY est conçu pour circuler constamment dans Dogzy Family Universe, Dogzy Town et The Adoles-chiant of Dogzy Town. Six utilités principales alimentent la demande :",'Helvetica',11,CREAM,54,121.9,16,504,maxlines=2)
# page 7: plafond + page number
p=d[6]
redact(p,[line_rect(68,153.8,512,166.2),(553,754,559,763.5),line_rect(68,401.8,513,414.2),line_rect(68,413.8,318,426.2)])
put(p,'Mécaniques de lancement à récompenses garanties.','Helvetica',9,CREAM,68,411.46)
put(p,"Plafond strict de 100 G. La nouvelle circulation provient uniquement des réserves allouées - jamais d'une nouvelle",'Helvetica',9,CREAM,68,163.46)
put(p,'8','Helvetica',8,GREY,558,761.74,align='right')
flush(d)
dist_page(d,4,DFR,5,FOOT)
flush(d)
d.delete_page(5)
contracts_page(d,5,CFR,6,FOOT)
flush(d)
d.delete_page(6)
principles_page(d,6,FR,7,FOOT)
flush(d)
d.save('DOGZY-Tokenomics-100G.pdf',garbage=3,deflate=True)
print(d.page_count)
