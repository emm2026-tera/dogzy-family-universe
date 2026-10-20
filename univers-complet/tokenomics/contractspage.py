from helpers import *
def contracts_page(doc,idx,L,num,foot):
    p=new_page_base(doc,idx)
    put(p,L['title'],'Times-Bold',24,GOLD,54,80.39)
    n=para(p,L['intro'],'Helvetica',10.5,CREAM,54,121.54,15,504,maxlines=3)
    top=189-15*(3-n)
    for k,(a,b) in enumerate(L['cards']):
        x=54 if k%2==0 else 314; y0=top+52*(k//2)
        card(p,(x,y0,x+244,y0+44))
        put(p,a,'Helvetica-Bold',11,GOLD,x+13,y0+15.9); para(p,b,'Helvetica',8.5,GREY,x+13,y0+30.1,10,218,maxlines=2)
    para(p,L['note'],'Helvetica-Oblique',9.5,GREY,54,top+200+9.82,13,L['notew'],maxlines=2)
    footer(p,num,foot)
FR=dict(title='Architecture des contrats intelligents',
 intro="Huit contrats interconnectés forment une économie on-chain complète, avec trois protections critiques : verrou temporel de gouvernance DAO, vérification des approbations du marché et oracle de staking renforcé.",
 cards=[('DogzyToken','Jeton utilitaire ERC-20 - offre fixe de 100 G'),('DogzyNFT','Collections de personnages - 6 sous-collections, éditions par paliers'),
  ('DogzyMarketplace',"Plateforme d'échange native avec application des redevances"),('DogzyTreasury',"Réserve de l'écosystème gouvernée par la DAO"),
  ('DogzyStaking','Staking de rendement et de privilèges avec flux de prix sécurisés'),('DogzyGovernance','Vote communautaire protégé par verrou temporel'),
  ('DogzyVesting','Acquisition linéaire pour la fondatrice et les partenaires'),('DogzyRewards','Moteur de distribution de récompenses garanties')],
 note="Réseau : Avalanche C-Chain (mainnet 43114 / testnet Fuji 43113), EVM « paris ». Déploiement géré avec un partenaire professionnel à Québec.",notew=504)
EN=dict(title='Smart contract architecture',
 intro="Eight interconnected contracts form a complete on-chain economy with three critical protections: DAO governance timelock, marketplace approval verification and a hardened staking oracle.",
 cards=[('DogzyToken','ERC-20 utility token - fixed supply of 100B'),('DogzyNFT','Character collections - 6 sub-collections, tiered editions'),
 ('DogzyMarketplace','Native trading platform with royalty enforcement'),('DogzyTreasury','DAO-governed ecosystem reserve'),
 ('DogzyStaking','Yield and privilege staking with secured price feeds'),('DogzyGovernance','Timelock-protected community voting'),
 ('DogzyVesting','Linear vesting for the founder and partners'),('DogzyRewards','Guaranteed reward distribution engine')],
 note="Network: Avalanche C-Chain (mainnet 43114 / Fuji testnet 43113), EVM “paris”. Deployment managed with a professional partner in Québec.",notew=460)
