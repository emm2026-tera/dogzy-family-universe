from PIL import Image,ImageFilter;import numpy as np,glob,shutil
S={'6243':['poker-pro','hockey-pro','footballeur-pro','acteur-serie-tele'],
 '39d2':['drag-queen','punk-flashy','reine-du-cabaret','pom-punk-girl'],
 '6779':['magicien','super-heros','super-vilain','artiste-des-circuits']}
n=1;O='/workspace/dogzy-vip/cards/'
for k,names in S.items():
  im=Image.open(glob.glob(k+'*.png')[0]).convert('RGB');a=np.asarray(im.convert('L'),float)
  c=a[100:1000].mean(0);r=a[:,40:1360].mean(1)
  def dark(e,w=14,v=c): return int(e-w+np.argmin(v[e-w:e+w]))
  f=1402/819
  B=[(2,0,207,606),(205,0,410,606),(408,0,614,606),(612,0,817,606)] if k=='6243' else [(5,68,211,616),(208,68,410,616),(407,68,611,616),(606,68,812,616)]
  for i in range(4):
    cr=im.crop(tuple(int(v*f) for v in B[i]))
    cr=cr.resize((cr.width*2,cr.height*2),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.5,60,2))
    cr.save(f'{O}vip-{n:02d}-{names[i]}.png');n+=1
for k,nm in [('3214','adrenaline-collection'),('c0ea','tapis-rouge-1'),('dc54','tapis-rouge-2')]:
  shutil.copy(glob.glob(k+'*.png')[0],f'{O}vip-{n:02d}-{nm}.png');n+=1
