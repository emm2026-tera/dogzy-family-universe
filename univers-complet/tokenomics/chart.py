from PIL import Image, ImageDraw, ImageFont
import numpy as np
im=Image.open('chart_rgba.png').convert('RGBA')
a=np.array(im)
FP='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
gold=(212,175,55,255)
def render(txt,size,canvas):
    f=ImageFont.truetype(FP,size)
    d=ImageDraw.Draw(canvas)
    # anchor 'ms' = middle baseline
    return f
orig_mask=(np.abs(a[380:520,380:600,:3].astype(int)-[11,11,13]).sum(2)>60)
best=None
for size in [93,94,95,96]:
  for bx in np.arange(489,494,0.5):
    for by in np.arange(490,496,0.5):
      t=Image.new('L',(980,980));f=ImageFont.truetype(FP,size)
      ImageDraw.Draw(t).text((bx,by),'1B',font=f,fill=255,anchor='ms')
      m=np.array(t)[380:520,380:600]>128
      s=(m^orig_mask).sum()
      if best is None or s<best[0]: best=(s,size,bx,by)
print(best)
s,size,bx,by=best
# erase old text: fill disc interior region with bg (only within dark hole)
out=im.copy();d=ImageDraw.Draw(out)
d.rectangle((400,405,580,505),fill=(11,11,13,255))
f=ImageFont.truetype(FP,size)
w=f.getlength('100B')
# check fits within hole: find hole radius
row=a[490,:,:3].astype(int);dark=np.where(np.abs(row-[11,11,13]).sum(1)<10)[0]
print('hole row dark span',dark[(dark>200)&(dark<800)].min(),dark[(dark>200)&(dark<800)].max(),'text w',w)
d.text((bx,by),'100B',font=f,fill=gold,anchor='ms')
out.save('chart_new.png')
out.crop((290,290,690,690)).save('center_new.png')
