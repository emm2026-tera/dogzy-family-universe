from PIL import Image, ImageDraw, ImageFont
import math, json
G=(212,175,55);AC=(0,200,210);BG=(10,10,10);C=220
F=lambda s:ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",s)
POLY={'square':[(-1,-1),(1,-1),(1,1),(-1,1)],'triangle':[(0,-1),(1,.8),(-1,.8)],
'diamond':[(-1,-.35),(-.5,-.9),(.5,-.9),(1,-.35),(0,1)],
'crown':[(-1,.7),(-1,-.6),(-.5,0),(0,-.9),(.5,0),(1,-.6),(1,.7)],
'arrow':[(-1,-.3),(.2,-.3),(.2,-.8),(1,0),(.2,.8),(.2,.3),(-1,.3)],
'L':[(-.8,-1),(-.2,-1),(-.2,.4),(.6,.4),(.6,1),(-.8,1)],'G':[(-1,-1),(1,-1),(1,0),(-.3,0),(-.3,1),(-1,1)]}
def E(s,x=.5,y=.5,r=.3,rot=0,fill=None,mx=False):return dict(s=s,x=x,y=y,r=r,rot=rot,fill=fill,mx=mx)
def tr(px,py,e,ox,oy):
    a=math.radians(e['rot']);X=px*math.cos(a)-py*math.sin(a);Y=px*math.sin(a)+py*math.cos(a)
    if e['mx']:X=-X
    R=e['r']*C/2;return(ox+e['x']*C+X*R,oy+e['y']*C+Y*R)
def col(f):return {None:None,'g':G,'a':AC}[f]
def draw_el(d,e,ox,oy):
    f=col(e['fill']);R=e['r']*C/2;cx,cy=ox+e['x']*C,oy+e['y']*C
    if e['s'] in POLY: d.polygon([tr(p,q,e,ox,oy) for p,q in POLY[e['s']]],fill=f,outline=G,width=4)
    elif e['s']=='circle': d.ellipse([cx-R,cy-R,cx+R,cy+R],fill=f,outline=G,width=4)
    elif e['s']=='paw':
        for (p,q,s) in [(0,.3,.5),(-.75,-.35,.24),(-.27,-.75,.24),(.27,-.75,.24),(.75,-.35,.24)]:
            X,Y=tr(p,q,e,ox,oy);rr=s*R;d.ellipse([X-rr,Y-rr,X+rr,Y+rr],fill=f,outline=G,width=3)
def cell(d,x,y,els,label=None):
    d.rectangle([x,y,x+C,y+C],outline=G,width=4)
    for e in els: draw_el(d,e,x,y)
    if label: d.text((x+C/2,y+C+28),label,fill=G,font=F(30),anchor="mm")
def q(s,y=.5,**k):return E(s,y=y,**k)
def row(s,n,r,**k):
    xs=[(i+1)/(n+1) for i in range(n)];return [E(s,x=x,r=r,**k) for x in xs]
Qs=[
# 1 fill
([E('circle')],[E('circle',fill='g')],[E('square',r=.25)],
 [[E('square',r=.25)],[E('circle',fill='g')],[E('square',r=.25,fill='g')],[E('triangle',fill='g')],[E('square',r=.12,fill='g')]],3,
 "Remplissage : la forme vide devient pleine (or)."),
# 2 rotation
([E('crown')],[E('crown',rot=90)],[E('triangle')],
 [[E('triangle',rot=-90)],[E('triangle',rot=180)],[E('triangle')],[E('triangle',rot=90,fill='g')],[E('triangle',rot=90)]],5,
 "Rotation de 90° dans le sens horaire."),
# 3 size
([E('diamond',r=.36)],[E('diamond',r=.15)],[E('paw',r=.36)],
 [[E('paw',r=.36)],[E('paw',r=.15)],[E('paw',r=.15,rot=180)],[E('crown',r=.15)],[E('paw',r=.36,fill='g')]],2,
 "Taille : la forme devient beaucoup plus petite."),
# 4 opposite corner
([E('circle',x=.22,y=.22,r=.25,fill='a')],[E('circle',x=.78,y=.78,r=.25,fill='a')],[E('diamond',x=.78,y=.22,r=.25,fill='a')],
 [[E('diamond',x=.22,y=.22,r=.25,fill='a')],[E('diamond',x=.78,y=.78,r=.25,fill='a')],[E('diamond',x=.22,y=.78,r=.25,fill='a')],[E('diamond',x=.78,y=.22,r=.25,fill='a')],[E('circle',x=.22,y=.78,r=.25,fill='a')]],3,
 "Déplacement vers le coin opposé (diagonale)."),
# 5 count+1
(row('circle',2,.22,fill='g'),row('circle',3,.2,fill='g'),row('diamond',3,.2),
 [row('diamond',3,.2),row('diamond',5,.15),row('diamond',4,.17),row('circle',4,.17,fill='g'),row('diamond',2,.2)],3,
 "Nombre : on ajoute un élément (+1)."),
# 6 mirror
([E('triangle',rot=0,s2=0)] if False else [E('G')],[E('G',mx=True)],[E('L')],
 [[E('L',rot=-90)],[E('L')],[E('L',rot=180)],[E('L',mx=True,fill='a')],[E('L',mx=True)]],5,
 "Miroir gauche-droite (symétrie verticale)."),
# 7 color swap
([E('square',r=.6,fill='g'),E('circle',r=.3,fill='a')],[E('square',r=.6,fill='a'),E('circle',r=.3,fill='g')],[E('circle',r=.6,fill='g'),E('diamond',r=.32,fill='a')],
 [[E('circle',r=.6,fill='g'),E('diamond',r=.32,fill='a')],[E('circle',r=.6,fill='a'),E('diamond',r=.32,fill='g')],[E('circle',r=.6,fill='g'),E('diamond',r=.32,fill='g')],[E('circle',r=.6,fill='a'),E('diamond',r=.32,fill='a')],[E('circle',r=.6,fill='a'),E('triangle',r=.32,fill='g')]],2,
 "Échange des couleurs : l'extérieur prend la couleur de l'intérieur et inversement."),
# 8 rot180+fill
([E('crown')],[E('crown',rot=180,fill='g')],[E('arrow')],
 [[E('arrow',rot=180)],[E('arrow',fill='g')],[E('arrow',rot=-90,fill='g')],[E('arrow',rot=180,fill='g')],[E('arrow',rot=90,fill='g')]],4,
 "Deux règles : rotation de 180° + la forme se remplit."),
# 9 +1 and smaller
([E('paw',r=.5)],row('paw',2,.22),row('diamond',2,.36),
 [row('diamond',3,.36),row('diamond',2,.18),row('diamond',4,.15),row('circle',3,.18),row('diamond',3,.18)],5,
 "Deux règles : +1 élément et les éléments deviennent plus petits."),
# 10 corner+rot90+color
([E('crown',x=.25,y=.25,r=.3,fill='g')],[E('crown',x=.75,y=.75,r=.3,rot=90,fill='a')],[E('triangle',x=.75,y=.25,r=.3,fill='g')],
 [[E('triangle',x=.25,y=.25,r=.3,rot=90,fill='a')],[E('triangle',x=.25,y=.75,r=.3,rot=90,fill='g')],[E('triangle',x=.25,y=.75,r=.3,fill='a')],[E('triangle',x=.25,y=.75,r=.3,rot=90,fill='a')],[E('triangle',x=.25,y=.75,r=.3,rot=-90,fill='a')]],4,
 "Trois règles : coin opposé + rotation 90° horaire + l'or devient turquoise."),
]
P=30;Wd=5*C+6*P;H=110+C+70+C+90
key={};sheet=[]
for n,(a,b,c,opts,ans,rule) in enumerate(Qs,1):
  for mark in (False,True):
    im=Image.new("RGB",(Wd,H),BG);d=ImageDraw.Draw(im)
    d.text((P,55),f"Question {n}/10: Visual Analogy",fill=G,font=F(46),anchor="lm")
    x0=(Wd-4*C)/2
    for i,(els,l) in enumerate(zip([a,b,c,[]],"ABCD")):
        cell(d,x0+i*C,110,els,l)
    d.text((x0+3.5*C,110+C/2),"?",fill=AC,font=F(130),anchor="mm")
    y=110+C+80
    for i,o in enumerate(opts):
        x=P+i*(C+P);cell(d,x,y,o,str(i+1))
        if mark and i+1==ans: d.rectangle([x-8,y-8,x+C+8,y+C+8],outline=(60,230,90),width=7)
    if mark: sheet.append(im)
    else: im.save(f"q{n}.png")
  key[f"q{n}"]={"correct_option":ans,"rule_fr":rule}
json.dump(key,open("answers.json","w"),ensure_ascii=False,indent=2)
s=.5;w,h=int(Wd*s),int(H*s);cs=Image.new("RGB",(2*w,5*h),BG)
for i,im in enumerate(sheet):cs.paste(im.resize((w,h)),((i%2)*w,(i//2)*h))
cs.save("contact_sheet_answers.png")
