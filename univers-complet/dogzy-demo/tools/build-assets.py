# Builds web-size assets + JSON from Sania's source files.
import os,re,json,glob,ast
from PIL import Image
R='/workspace/dogzy-demo'; A=R+'/assets'
for d in ['characters','businesses','branding']: os.makedirs(f'{A}/{d}',exist_ok=True)
for f in glob.glob(A+'/*/*'): 
  if not f.endswith('.svg'): os.remove(f)
# table of levels
lv={}
for l in open('/workspace/dogzy-webador-embeds/commerces-en.txt'):
  p=[x.strip() for x in l.split('|')]
  if len(p)==4 and re.fullmatch(r'\d\w',p[0]): lv[p[0]]=p[1:]
chars=[]
for f in sorted(glob.glob('/workspace/dogzy-metiers/en/*.*')):
  b=os.path.splitext(os.path.basename(f))[0]; num,rest=b.split('-',1)
  key={'00a':'0a','00c':'0c'}.get(num,num)
  breeds=['german-shepherd','golden-retriever','saint-bernard','border-collie','french-bulldog','afghan-hound','jack-russell','australian-shepherd','shih-tzu']
  breed=next((x for x in breeds if rest.endswith(x)),rest.split('-')[-1])
  job=rest[:-len(breed)-1].replace('-',' ').title().replace('Construction','Construction Worker')
  im=Image.open(f).convert('RGB'); w,h=im.size
  im2=im.copy(); im2.thumbnail((1200,1200)); im2.save(f'{A}/characters/{b}-card.jpg',quality=78,optimize=True)
  pr=im.crop((int(w*.018),int(h*.20),int(w*.192),int(h*.52)))
  pr=pr.resize((360,int(360*pr.size[1]/pr.size[0])),Image.LANCZOS); pr.save(f'{A}/characters/{b}.jpg',quality=86,optimize=True)
  L=lv.get(key)
  chars.append(dict(id=b,name=f"The {breed.replace('-',' ').title()} {job}",job=job,breed=breed.replace('-',' ').title(),
    image=f'assets/characters/{b}.jpg',card=f'assets/characters/{b}-card.jpg',
    level4=L[1] if L else None,level5=L[2] if L else None,
    description=f"Starts as a level-1 {job.lower()} and climbs five career levels"+(f" up to {L[2].lower()}." if L else ".")))
src=open('/workspace/commerces-36/build.py').read()
D=ast.literal_eval(re.search(r'D=(\[.*?\])\nF=',src,re.S).group(1))
big=Image.open('/workspace/commerces-36/commerces-36-long.png').convert('RGB')
g=10;CW=(2000-3*g)//2;CH=372;bus=[]
for i in range(36):
  n,cat,unl,desc,ups=D[i]; r,c=divmod(i,2); x=g+c*(CW+g); y=g+r*(CH+g)
  card=big.crop((x,y,x+CW,y+CH)); card.thumbnail((800,800)); slug=re.sub(r'\W+','-',n.lower()).strip('-')
  card.save(f'{A}/businesses/{i+1:02d}-{slug}.jpg',quality=84,optimize=True)
  iw=int(CW*0.45)-12; ph=big.crop((x+14,y+14,x+12+iw-2,y+CH-14))
  ph.save(f'{A}/businesses/{i+1:02d}-{slug}-photo.jpg',quality=84)
  bus.append(dict(id=slug,name=n.title().replace('/ ','/ '),category=cat.title(),unlocks=unl.title(),
    description=f"The {n.lower()} {desc}",image=f'assets/businesses/{i+1:02d}-{slug}-photo.jpg',card=f'assets/businesses/{i+1:02d}-{slug}.jpg',
    items=[dict(id=f'{slug}-u{k}',name=u,price=10+5*k) for k,u in enumerate(ups)]))
json.dump({'characters':chars},open(R+'/data/characters.json','w'),indent=1,ensure_ascii=False)
json.dump({'note':'Businesses: level 5 of every job. First player to complete it owns it; next players can buy a franchise. Upgrade prices are in-game tokens.','businesses':bus},open(R+'/data/businesses.json','w'),indent=1,ensure_ascii=False)
print(len(chars),len(bus)); [print(c['name'],'|',c['level5']) for c in chars]
