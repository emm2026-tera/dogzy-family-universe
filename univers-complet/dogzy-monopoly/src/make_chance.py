import math, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter
G='/usr/share/fonts/truetype/sand-box/google/'
S=2; W,H=750*S,1050*S
def font(path,size,wght=None):
    f=ImageFont.truetype(G+path,size*S)
    if wght:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f
F_HEAD=lambda s:font('Cinzel Decorative/CinzelDecorative-Black.ttf',s)
F_TITLE=lambda s:font('Cinzel/Cinzel-VariableFont_wght.ttf',s,800)
F_BODY=lambda s:font('Montserrat/Montserrat-VariableFont_wght.ttf',s,500)
F_BADGE=lambda s:font('Montserrat/Montserrat-VariableFont_wght.ttf',s,800)
F_SMALL=lambda s:font('Cinzel/Cinzel-VariableFont_wght.ttf',s,700)

CARDS=[
 ("BONUS","Lucky Spin","SPIN AGAIN","The stars of Dogzy Town shine on you. Spin the outer wheel again and move forward."),
 ("BONUS","Golden Paw Bonus","+200 TOKENS","The Dogzy Bank pays a loyalty bonus. Collect 200 tokens."),
 ("BONUS","Double Trouble","x2","Your next token reward is doubled. Twice the shine, twice the swagger."),
 ("BONUS","Triple Jackpot","x3","Big night in Dogzy Town! Your next token reward is multiplied by 3."),
 ("PROTECTION","Royal Shield","SHIELD","Raise the golden shield. It blocks the next raid or attack on your village."),
 ("ATTACK","Surprise Raid","RAID","Raid another player's village. Spin the second wheel to see how many tokens you steal."),
 ("ATTACK","Pickpocket Pup","STEAL 100","Quick paws! Steal 100 tokens from the player of your choice. A shield blocks it."),
 ("ACTION","City Tour","VISIT","Spin the second wheel. Visit that many buildings and complete their tasks."),
 ("ACTION","Call from the Bank","GO TO BANK","Move directly to the Bank and collect 100 tokens in interest."),
 ("PENALTY","Emergency Room","LOSE 1 TURN","Too much adventure! Go to the Hospital and lose your next turn."),
 ("PENALTY","Parking Ticket","-50 TOKENS","You parked your limo on a fire lane. Pay 50 tokens to the Police Station."),
 ("PENALTY","Lost in Dogzy Town","BACK 3","Wrong turn at the Marina. Move back 3 spaces."),
 ("BONUS","Shopping Spree","FREE ACCESSORY","The boutiques love you. Pick one free accessory from any shop."),
 ("PENALTY","The Pyromaniac Strikes","-1 ACCESSORY","The Pyromaniac set fire to your stuff! Lose one accessory unless you have a shield."),
 ("BONUS","Level Up!","LEVEL UP","Your hard work pays off. Move up to the next level of Dogzy Town."),
 ("ACTION","Treasure Hunt","SEARCH","Go to the nearest Search space and play a hidden-object card. Find them all to win an accessory."),
]

def gold_grad(w,h,dark=False):
    g=Image.new('RGB',(w,h))
    stops=[(0,(255,236,160)),(0.35,(232,183,62)),(0.55,(176,122,24)),(0.75,(240,198,90)),(1,(150,98,18))]
    if dark: stops=[(0,(214,170,70)),(1,(120,80,15))]
    px=g.load()
    col=[]
    for y in range(h):
        t=y/max(1,h-1)
        for (a,ca),(b,cb) in zip(stops,stops[1:]):
            if a<=t<=b:
                u=(t-a)/(b-a); col.append(tuple(int(ca[i]+(cb[i]-ca[i])*u) for i in range(3))); break
    d=ImageDraw.Draw(g)
    for y,c in enumerate(col): d.line([(0,y),(w,y)],fill=c)
    return g

def paste_gold(img,mask,box=None):
    bb=mask.getbbox()
    if not bb: return
    x0,y0,x1,y1=bb
    gr=gold_grad(x1-x0,y1-y0)
    img.paste(gr,(x0,y0),mask.crop(bb))

def text_mask(txt,f,cx,cy,anchor='mm',stroke=0):
    m=Image.new('L',(W,H),0); ImageDraw.Draw(m).text((cx,cy),txt,font=f,fill=255,anchor=anchor,stroke_width=stroke,stroke_fill=255); return m

def paw(d,cx,cy,r,fill=255):
    d.ellipse([cx-r,cy-r*0.55,cx+r,cy+r*1.05],fill=fill)
    for dx,dy,rr in [(-1.05,-1.0,0.38),(-0.38,-1.55,0.4),(0.38,-1.55,0.4),(1.05,-1.0,0.38)]:
        x,y=cx+dx*r,cy+dy*r; d.ellipse([x-rr*r,y-rr*r*1.2,x+rr*r,y+rr*r*1.2],fill=fill)

def crown(d,cx,cy,w,fill=255):
    h=w*0.62; x0=cx-w/2; y1=cy+h/2; y0=cy-h/2
    pts=[(x0,y1),(x0,y0+h*0.25),(x0+w*0.25,y0+h*0.6),(cx,y0),(x0+w*0.75,y0+h*0.6),(x0+w,y0+h*0.25),(x0+w,y1)]
    d.polygon(pts,fill=fill)
    for x,y in [(x0,y0+h*0.25),(cx,y0),(x0+w,y0+h*0.25)]:
        rr=w*0.07; d.ellipse([x-rr,y-rr,x+rr,y+rr],fill=fill)
    d.rectangle([x0,y1+w*0.06,x0+w,y1+w*0.16],fill=fill)

def wrap(txt,f,maxw,d):
    words=txt.split(); lines=[]; cur=''
    for w_ in words:
        t=(cur+' '+w_).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=w_
    if cur: lines.append(cur)
    return lines

CAT_COL={'BONUS':(120,200,120),'PROTECTION':(120,170,230),'ATTACK':(230,110,90),'ACTION':(230,190,90),'PENALTY':(220,90,90)}

def card(n,cat,title,badge,body):
    img=Image.new('RGB',(W,H),(0,0,0))
    # radial charcoal glow
    glow=Image.new('L',(W,H),0); gd=ImageDraw.Draw(glow)
    gd.ellipse([W*0.05,H*0.12,W*0.95,H*0.62],fill=70)
    glow=glow.filter(ImageFilter.GaussianBlur(120*S))
    img.paste(Image.new('RGB',(W,H),(70,52,20)),(0,0),glow)
    m=Image.new('L',(W,H),0); d=ImageDraw.Draw(m)
    # borders
    d.rounded_rectangle([14*S,14*S,W-14*S,H-14*S],radius=36*S,outline=255,width=12*S)
    d.rounded_rectangle([34*S,34*S,W-34*S,H-34*S],radius=24*S,outline=255,width=3*S)
    d.rounded_rectangle([44*S,44*S,W-44*S,H-44*S],radius=18*S,outline=255,width=1*S)
    # corner paws
    for x,y in [(80,82),(W/S-80,82),(80,H/S-78),(W/S-80,H/S-78)]:
        paw(d,x*S,y*S,13*S)
    # crown + header
    crown(d,W/2,92*S,70*S)
    paste_gold(img,m)
    hm=text_mask('CHANCE',F_HEAD(92),W/2,190*S)
    sh=hm.filter(ImageFilter.GaussianBlur(6*S)); img.paste((0,0,0),(4*S,6*S),sh)
    paste_gold(img,hm)
    # number
    m2=Image.new('L',(W,H),0); d2=ImageDraw.Draw(m2)
    d2.text((W/2,258*S),f'No. {n:02d}  /  16',font=F_SMALL(24),fill=255,anchor='mm')
    # divider
    for sx in (-1,1):
        d2.line([(W/2+sx*105*S,258*S),(W/2+sx*240*S,258*S)],fill=255,width=2*S)
        dx=W/2+sx*248*S; d2.polygon([(dx-7*S,258*S),(dx,251*S),(dx+7*S,258*S),(dx,265*S)],fill=255)
    # emblem ring
    cx,cy,R=W/2,392*S,108*S
    d2.ellipse([cx-R,cy-R,cx+R,cy+R],outline=255,width=10*S)
    d2.ellipse([cx-R+22*S,cy-R+22*S,cx+R-22*S,cy+R-22*S],outline=255,width=3*S)
    for k in range(24):
        a=k*math.pi/12; r1=R+14*S; r2=R+26*S if k%2==0 else R+20*S
        d2.line([(cx+r1*math.cos(a),cy+r1*math.sin(a)),(cx+r2*math.cos(a),cy+r2*math.sin(a))],fill=255,width=3*S)
    paste_gold(img,m2)
    # filled inner disc dark
    ImageDraw.Draw(img).ellipse([cx-R+26*S,cy-R+26*S,cx+R-26*S,cy+R-26*S],fill=(12,10,6))
    qm=text_mask('?',F_HEAD(158),cx,cy-6*S); paste_gold(img,qm)
    pm=Image.new('L',(W,H),0); paw(ImageDraw.Draw(pm),cx,cy+72*S,7*S); paste_gold(img,pm)
    # title
    dd=ImageDraw.Draw(img)
    tf=F_TITLE(50); lines=wrap(title.upper(),tf,600*S,dd)
    if len(lines)>1: tf=F_TITLE(44); lines=wrap(title.upper(),tf,600*S,dd)
    y=568*S
    tm=Image.new('L',(W,H),0); td=ImageDraw.Draw(tm)
    for ln in lines:
        td.text((W/2,y),ln,font=tf,fill=255,anchor='mm'); y+=56*S
    paste_gold(img,tm)
    # category tag
    y+= -10*S
    cf=F_SMALL(20); dd.text((W/2,y),cat,font=cf,fill=CAT_COL[cat],anchor='mm'); tw=dd.textlength(cat,font=cf)/2+20*S
    for sx in (-1,1):
        dx=W/2+sx*tw; dd.polygon([(dx-6*S,y),(dx,y-6*S),(dx+6*S,y),(dx,y+6*S)],fill=CAT_COL[cat])
    y+=50*S
    # badge pill
    bf=F_BADGE(34); bw=dd.textlength(badge,font=bf)+70*S; bh=66*S
    bm=Image.new('L',(W,H),0); ImageDraw.Draw(bm).rounded_rectangle([W/2-bw/2,y-bh/2,W/2+bw/2,y+bh/2],radius=bh/2,fill=255)
    paste_gold(img,bm)
    dd.rounded_rectangle([W/2-bw/2+5*S,y-bh/2+5*S,W/2+bw/2-5*S,y+bh/2-5*S],radius=bh/2,outline=(90,60,10),width=2*S)
    dd.text((W/2,y+1*S),badge,font=bf,fill=(20,14,4),anchor='mm')
    y+=bh/2+48*S
    # body
    bf2=F_BODY(29); bl=wrap(body,bf2,560*S,dd)
    for ln in bl:
        dd.text((W/2,y),ln,font=bf2,fill=(245,232,205),anchor='mm'); y+=42*S
    assert y-42*S < H-140*S, (n,y/S)
    # footer
    fm=Image.new('L',(W,H),0); fd=ImageDraw.Draw(fm)
    fd.text((W/2,H-92*S),'DOGZY TOWN',font=F_SMALL(24),fill=255,anchor='mm')
    for sx in (-1,1):
        fd.line([(W/2+sx*110*S,H-92*S),(W/2+sx*200*S,H-92*S)],fill=255,width=2*S)
        paw(fd,W/2+sx*225*S,H-90*S,7*S)
    paste_gold(img,fm)
    return img.resize((750,1050),Image.LANCZOS)

out=[]
for i,(cat,title,badge,body) in enumerate(CARDS,1):
    slug=''.join(c if c.isalnum() else '-' for c in title.lower()).strip('-').replace('--','-')
    p=f'/workspace/dogzy-monopoly/chance/chance-{i:02d}-{slug}.png'
    card(i,cat,title,badge,body).save(p); out.append(dict(n=i,category=cat,title=title,badge=badge,text=body,file=p))
json.dump(out,open('/workspace/dogzy-monopoly/chance/chance-cards.json','w'),indent=2,ensure_ascii=False)
with open('/workspace/dogzy-monopoly/chance/chance-cards.txt','w') as f:
    for c in out: f.write(f"{c['n']:02d}. [{c['category']}] {c['title']} ({c['badge']}): {c['text']}\n")
print('ok',len(out))
