import glob
from PIL import Image
A='/home/box/agent-data/agents/26426c55-a805-42ac-a891-44a5a67c3661/attachments/'
G={'6ea9':(1,[(6,557),(567,1054),(1064,1530)],[(8,333),(344,675),(684,1016)]),
   '45d4':(10,[(7,557),(566,1051),(1061,1530)],[(6,338),(348,676),(686,1015)]),
   'a879':(19,[(7,557),(567,1051),(1061,1530)],[(7,337),(349,677),(687,1015)]),
   '3673':(28,[(5,601),(610,1093),(1101,1531)],[(3,336),(344,673),(681,1016)])}
names="city-hall police-station fire-station hospital school library courthouse bank post-office supermarket bakery restaurant pizzeria sushi-restaurant coffee-shop hotel clothing-store beauty-salon pet-store flower-shop hardware-store construction-company plumbing-company electrician-company car-dealership car-repair-garage gas-station construction-company-fr school-fr hospital-fr plumbing-company-fr electrician-company-fr engineering-firm law-office post-office-fr car-dealership-fr".split()
M=2
for k,(s,cols,rows) in G.items():
    img=Image.open(glob.glob(A+k+'*')[0]).convert('RGB'); W,H=img.size
    for i,(t,b) in enumerate(rows):
        for j,(l,r) in enumerate(cols):
            n=s+i*3+j
            box=(max(0,l-M),max(0,t-M),min(W,r+1+M),min(H,b+1+M))
            c=img.crop(box); p=f'batiments/{n:02d}-{names[n-1]}.png'; c.save(p); print(p,c.size)
