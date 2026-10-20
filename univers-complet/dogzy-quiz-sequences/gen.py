from PIL import Image, ImageDraw, ImageFont
import math
G=(212,175,55);BG=(14,12,10);W=300
def font(s):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]:
        try: return ImageFont.truetype(p,s)
        except: pass
    return ImageFont.load_default()
def tile():
    im=Image.new("RGB",(W,W),BG);d=ImageDraw.Draw(im)
    d.rectangle([6,6,W-7,W-7],outline=G,width=4);d.rectangle([14,14,W-15,W-15],outline=(120,95,30),width=1);return im,d
def paw(d,cx,cy,r,col=BG):
    d.ellipse([cx-r*.45,cy-r*.1,cx+r*.45,cy+r*.55],fill=col)
    for dx,dy in[(-.5,-.3),(-.18,-.55),(.18,-.55),(.5,-.3)]:
        d.ellipse([cx+dx*r-r*.15,cy+dy*r-r*.17,cx+dx*r+r*.15,cy+dy*r+r*.17],fill=col)
def coins(n):
    im,d=tile()
    for i in range(n):
        y=240-i*38;d.ellipse([90,y-18,210,y+18],fill=G,outline=(90,70,20),width=3);paw(d,150,y-2,22)
    return im
def crown(k): # rotate 90 deg per step
    im,d=tile();c=Image.new("RGBA",(W,W));cd=ImageDraw.Draw(c)
    cd.polygon([(80,200),(80,110),(115,150),(150,90),(185,150),(220,110),(220,200)],fill=G)
    cd.rectangle([80,200,220,225],fill=G);cd.ellipse([140,80,160,100],fill=(240,240,255))
    c=c.rotate(-90*k,center=(150,150));im.paste(c,(0,0),c);return im
COLS=[("Rouge",(220,40,60)),("Bleu",(50,120,240)),("Vert",(40,190,90))]
def diamond(ci):
    im,d=tile();col=COLS[ci%3][1]
    d.polygon([(90,120),(120,80),(180,80),(210,120),(150,230)],fill=col,outline=G)
    d.line([(90,120),(210,120)],fill=G,width=3);d.line([(120,80),(150,120),(180,80)],fill=G,width=2)
    d.line([(150,120),(150,230)],fill=G,width=2);return im
def clock(h): # hand advances 3h each step
    im,d=tile();d.ellipse([50,50,250,250],outline=G,width=6)
    for i in range(12):
        a=math.radians(i*30);d.line([(150+85*math.sin(a),150-85*math.cos(a)),(150+95*math.sin(a),150-95*math.cos(a))],fill=G,width=4)
    a=math.radians(h*30);d.line([(150,150),(150+75*math.sin(a),150-75*math.cos(a))],fill=G,width=8)
    paw(d,150,150,22,G);d.ellipse([140,140,160,160],fill=G);return im
def qtile():
    im,d=tile();d.text((150,150),"?",fill=G,font=font(160),anchor="mm");return im
S=[("pieces","Pile de pièces-patte : +1 pièce à chaque image",coins,[1,2,3,4],[5,4,6],"A"),
   ("couronne","Couronne : rotation de 90° horaire à chaque image",crown,[0,1,2,3],[2,0,1],"B"),
   ("diamant","Diamant : couleur en cycle Rouge→Bleu→Vert",diamond,[0,1,2,0],[2,0,1],"C"),
   ("horloge","Horloge : l'aiguille avance de 3 heures à chaque image (12,3,6,9)",clock,[0,3,6,9],[12,10,3],"A")]
for i,(n,rule,f,fr,opts,ans) in enumerate(S,1):
    frames=[f(x) for x in fr];o=[f(x) for x in opts]
    for j,im in enumerate(frames,1): im.save(f"s{i}_{n}_frame{j}.png")
    for L,im in zip("ABC",o): im.save(f"s{i}_{n}_option{L}.png")
    P=20;Wd=5*W+6*P;H=80+W+70+W+80
    st=Image.new("RGB",(Wd,H),BG);d=ImageDraw.Draw(st)
    d.text((Wd//2,40),f"DOGZY TOWN – QUIZ QI #{i} : Quelle est la suite ?",fill=G,font=font(40),anchor="mm")
    for j,im in enumerate(frames+[qtile()]):
        x=P+j*(W+P);st.paste(im,(x,80));d.text((x+W//2,80+W+25),str(j+1) if j<4 else "?",fill=G,font=font(30),anchor="mm")
    y=80+W+70
    for k,(L,im) in enumerate(zip("ABC",o)):
        x=P+(k+1)*(W+P);st.paste(im,(x,y))
        lab=L+(" ✓ BONNE RÉPONSE" if L==ans else "")
        if L==ans: d.rectangle([x-6,y-6,x+W+5,y+W+5],outline=(60,220,90),width=6)
        d.text((x+W//2,y+W+30),lab,fill=(60,220,90) if L==ans else G,font=font(30),anchor="mm")
    d.text((P+W//2,y+W//2),"Réponses :",fill=G,font=font(36),anchor="mm")
    st.save(f"sequence{i}_{n}_strip.png");print(i,rule,ans)
