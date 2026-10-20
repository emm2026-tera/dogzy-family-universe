from helpers import *
from newpage import principles_page, EN as PEN
from contractspage import contracts_page, EN as CEN
from distpage import dist_page, EN as DEN
d=fitz.open('orig.pdf')
FOOT='© 2026 The Dogzy Family Universe  |  DOGZY Tokenomics  |  All rights reserved - Confidential document'
for i in (0,1,2,3,6): redact(d[i],[d[i].rect])
# cover
p=d[0]
put(p,'DOGZY TOKENOMICS','Times-Bold',40,GOLD,306,542.32,align='center')
put(p,'The token economy powering Dogzy Town','Helvetica-Oblique',13,CREAM,306,587.33,align='center')
put(p,'The Dogzy Family Universe  |  Avalanche C-Chain  |  July 2026','Helvetica',10,GREY,306,672.18,align='center')
put(p,'thedogzyfamilyuniverse.ca','Helvetica',10,GREY,306,688.18,align='center')
put(p,'© 2026 The Dogzy Family Universe. All rights reserved.','Helvetica',9,GREY,306,718.46,align='center')
put(p,'Confidential document — reproduction or distribution prohibited without written permission.','Helvetica',9,GREY,306,732.46,align='center')
# overview
p=d[1]
put(p,'Token overview','Times-Bold',24,GOLD,54,80.39); footer(p,2,FOOT)
para(p,"$DOGZY is the native utility token of the Dogzy Family Universe, deployed on Avalanche C-Chain. It is the shared currency of the three games that use it - Dogzy Family Universe (Monopoly), Dogzy Town (console) and The Adoles-chiant of Dogzy Town (web3): every purchase, reward, staking position and governance vote runs on DOGZY.",'Helvetica',11,CREAM,54,121.9,16,504,maxlines=4)
rows=[('Token name','DOGZY'),('Type','Utility token (ERC-20 standard)'),('Network','Avalanche C-Chain (chainId 43114)'),('Total supply','100,000,000,000 DOGZY (fixed, no inflation)'),('Distribution start',None),('Contract suite','8 smart contracts')]
for k,(a,b) in enumerate(rows):
    y=207.18+34*k
    put(p,a,'Helvetica-Bold',10,GOLD,68,y)
    if b: put(p,b,'Helvetica',10,CREAM,224,y)
    else:
        put(p,'Included with every Jetset VIP NFT - 1,000 DOGZY per NFT','Helvetica',9.5,CREAM,224,y-5.28)
        put(p,'+ Gold NFT characters (Dogzy Family Universe): 1,000 DOGZY each','Helvetica',9.5,CREAM,224,y+5.72)
para(p,"Design principle: DOGZY is earned and spent inside a living entertainment ecosystem. Its value proposition rests on utility and engagement - not on speculative issuance.",'Helvetica-Oblique',10.5,GREY,54,403.54,15,504,maxlines=2)
# allocation
p=d[2]
put(p,'Token allocation','Times-Bold',24,GOLD,54,80.39); footer(p,3,FOOT)
leg=[('Community & NFT rewards','30%'),('Staking rewards','20%'),('Ecosystem treasury','20%'),('Founder (36-month vesting)','15%'),('Strategic partners (24-month vesting)','10%'),('Liquidity & listings','5%')]
for k,(a,b) in enumerate(leg):
    y=132.18+24*k
    put(p,a,'Helvetica',10,CREAM,327,y,fit=200); put(p,b,'Helvetica-Bold',10,GOLD,558,y,align='right')
for x,t in ((54,'ALLOCATION'),(229,'TOKENS'),(339,'PURPOSE')): put(p,t,'Helvetica-Bold',9.5,GOLD,x,388.82)
tab=[('Community & NFT rewards','30,000,000,000','Distributed via NFT inclusion, gameplay and city rewards'),
 ('Staking rewards','20,000,000,000','Distributed via DogzyStaking over multi-year emissions'),
 ('Ecosystem treasury','20,000,000,000','DAO-governed reserve: growth, partnerships, operations'),
 ('Founder','15,000,000,000','Linear vesting over 36 months via DogzyVesting'),
 ('Strategic partners','10,000,000,000','Linear vesting over 24 months via DogzyVesting'),
 ('Liquidity & listings','5,000,000,000','DEX liquidity and exchange listings')]
for k,(a,b,c) in enumerate(tab):
    y=417.46+22*k
    put(p,a,'Helvetica-Bold',9,CREAM,54,y); put(p,b,'Helvetica',9,GOLD,229,y); put(p,c,'Helvetica',8.5,GREY,339,y,fit=219)
p.replace_image(9,filename='chart_new.png')
# utility
p=d[3]
put(p,'Token utility','Times-Bold',24,GOLD,54,80.39); footer(p,4,FOOT)
para(p,"DOGZY is designed to circulate constantly across Dogzy Family Universe, Dogzy Town and The Adoles-chiant of Dogzy Town. Six core utilities drive demand:",'Helvetica',11,CREAM,54,121.9,16,504,maxlines=2)
ut=[('In-city commerce',"Buy accessories, buildings and services in Dogzy Town. A character's entire progression - from employee to business owner - runs on DOGZY."),
 ('Staking','Lock DOGZY in the DogzyStaking contract to earn rewards and unlock premium privileges in the city.'),
 ('Governance','Vote on city decisions via DogzyGovernance, protected by an on-chain timelock. Councillor and mayor roles amplify voting weight.'),
 ('Marketplace','The native currency of the DogzyMarketplace for trading characters, accessories and buildings - with perpetual royalties for creators.'),
 ('Weekly Gold auctions','Gold-tier cards are auctioned every week; DOGZY is the bidding currency, creating recurring demand cycles.'),
 ('Rewards engine','DogzyRewards distributes guaranteed token rewards to collectors - a fully compliant mechanism (no draws, no lottery).')]
for k,(a,b) in enumerate(ut):
    y0=156+58*k
    put(p,a,'Helvetica-Bold',11,GOLD,68,y0+15.9); para(p,b,'Helvetica',9,CREAM,68,y0+31.46,12,476,maxlines=2)
# sustainability
p=d[6]
put(p,'Sustainability and safeguards','Times-Bold',24,GOLD,54,80.39); footer(p,8,FOOT)
su=[('Fixed supply, no inflation','Hard cap of 100B. New circulation comes only from allocated reserves - never from new issuance.'),
 ('Vesting alignment','Founder (36 months) and partner (24 months) tokens vest linearly on-chain via DogzyVesting - no cliff unlocks, verifiable by anyone.'),
 ('Governed treasury','Ecosystem funds move only through timelock-protected DAO votes.'),
 ('Royalty flywheel','Perpetual marketplace royalties continuously replenish the treasury, funding rewards and development without new issuance.'),
 ('Compliance-first design','Guaranteed-reward launch mechanics.')]
for k,(a,b) in enumerate(su):
    y0=132+62*k
    put(p,a,'Helvetica-Bold',11,GOLD,68,y0+14.9); para(p,b,'Helvetica',9,CREAM,68,y0+31.46,12,476,maxlines=2)
para(p,"Disclaimer: DOGZY is a utility token intended for use within the Dogzy Family Universe. This document is provided for information purposes only and does not constitute financial advice or an offer of securities. Figures reflect the token model at the time of writing and will be finalised at mainnet deployment.",'Helvetica-Oblique',8.5,GREY,54,440.1,12,504,maxlines=3)
put(p,"The sky is not the limit. It's where Dogzy Town begins.",'Times-Bold',13,GOLD,306,707.88,align='center')
flush(d)
dist_page(d,4,DEN,5,FOOT); flush(d); d.delete_page(5)
contracts_page(d,5,CEN,6,FOOT); flush(d); d.delete_page(6)
principles_page(d,6,PEN,7,FOOT); flush(d)
d.save('DOGZY-Tokenomics-100G-EN.pdf',garbage=3,deflate=True); print(d.page_count)
