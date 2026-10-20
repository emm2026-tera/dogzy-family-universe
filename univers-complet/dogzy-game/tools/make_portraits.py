# Crops display-only portraits/cards from the original art (no edits besides crop + downscale).
import sys; sys.path.insert(0,'/workspace/dogzy-game/tools')
from portrait_boxes import BOX, B, A
from PIL import Image
s=1.875
fix={'waitzy':(0,10),'shopzy-boutique':(0,10),'beautzy':(0,10),'cashzy':(0,22),'barzy':(0,22),'modelzy':(0,22),'actzy':(0,35)}
for n,(f,bx) in BOX.items():
    dx,dy=fix.get(n,(0,0)); dy=int(dy*s)
    bx=(bx[0],bx[1]+dy,bx[2],bx[3]+dy)
    im=Image.open(f).convert('RGB').crop(bx).resize((192,192),Image.LANCZOS)
    im.save(f'/workspace/dogzy-game/assets/portraits/{n}.jpg',quality=88)
# whole character cards (crop only)
cols=[0,177,353,546]
grids={'base-01.png':([0,412,819],{'doczy':(0,0),'gentlezy':(1,0),'chefzy':(2,0),'sportzy':(0,1),'wheelzy':(1,1),'magiczy':(2,1)}),
 'base-02.png':([0,283,562,819],{'bankzy':(0,0),'lawzy':(1,0),'securzy':(2,0),'buildzy':(2,1)}),
 'base-03.png':([0,307,307,604],{'waitzy':(0,0),'cashzy':(0,1),'barzy':(1,1)})}
for g,(rows,m) in grids.items():
    im=Image.open(B+g).convert('RGB')
    for n,(c,r) in m.items():
        top,bot=((rows[2*r],rows[2*r+1]) if g=='base-03.png' else (rows[r],rows[r+1]))
        bx=tuple(int(v*s) for v in (cols[c],top,cols[c+1],bot))
        bx=(bx[0],bx[1],min(bx[2],im.width),min(bx[3],im.height))
        cr=im.crop(bx); cr.thumbnail((520,800),Image.LANCZOS); cr.save(f'/workspace/dogzy-game/assets/charcards/{n}.jpg',quality=88)
print('ok')
