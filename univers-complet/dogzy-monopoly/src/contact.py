import glob
from PIL import Image, ImageDraw, ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/sand-box/google/Montserrat/Montserrat-VariableFont_wght.ttf',18)
def sheet(files,cols,tw,th,out,title):
    pad=16; rows=(len(files)+cols-1)//cols
    S=Image.new('RGB',(cols*(tw+pad)+pad,rows*(th+pad+26)+pad+50),(12,10,8)); d=ImageDraw.Draw(S)
    d.text((pad,14),title,fill=(232,190,80),font=ImageFont.truetype('/usr/share/fonts/truetype/sand-box/google/Cinzel/Cinzel-VariableFont_wght.ttf',28))
    for i,f in enumerate(files):
        im=Image.open(f).convert('RGB'); im.thumbnail((tw,th),Image.LANCZOS)
        x=pad+(i%cols)*(tw+pad); y=60+(i//cols)*(th+pad+26)
        S.paste(im,(x+(tw-im.width)//2,y+(th-im.height)//2))
        d.text((x,y+th+3),f.split('/')[-1][:-4],fill=(220,210,190),font=F)
    S.save(out); print(out,S.size)
sheet(sorted(glob.glob('chance/*.png')),4,300,420,'preview-chance.png','Dogzy Town - Chance cards (16)')
sheet(sorted(glob.glob('batiments/*.png')),6,300,190,'preview-batiments.png','Dogzy Town - Building cards (36)')
