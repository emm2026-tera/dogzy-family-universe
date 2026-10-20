from PIL import Image, ImageDraw, ImageFont
B='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
F=lambda p,s: ImageFont.truetype(p,s)
cols=[("The Doge Pound","the-doge-pound","0,0141 ETH","Ethereum · 9 998 NFT"),
("Bored Ape Kennel Club","bored-ape-kennel-club","0,1289 ETH","Ethereum · 9 602 NFT"),
("Degen Dogs on Base","degen-dogs-club","0,004 ETH","Base · 718 NFT"),
("Cool Dogs Official","cooldogsofficial","0,00038 ETH","Ethereum · 4 988 NFT")]
W=2000; T=170; tile=440; pad=24; rowh=tile+2*pad; lw=W-3*tile-5*pad
H=T+len(cols)*rowh+90
im=Image.new('RGB',(W,H),(18,18,28)); d=ImageDraw.Draw(im)
d.text((W//2,60),"Collections NFT de chiens — comparaison (19 oct. 2026)",font=F(B,54),fill='white',anchor='mm')
d.text((W//2,125),"Prix plancher (floor) en ETH relevés sur OpenSea le 19 oct. 2026, vers 8 h (heure de Toronto)",font=F(R,28),fill=(190,190,210),anchor='mm')
for i,(n,s,fl,meta) in enumerate(cols):
    y=T+i*rowh
    d.rounded_rectangle((pad,y+pad//2,W-pad,y+rowh-pad//2),18,fill=(32,32,48))
    x=pad*2
    d.text((x,y+pad+60),n,font=F(B,40),fill='white')
    d.text((x,y+pad+150),"Prix plancher",font=F(R,30),fill=(170,170,190))
    d.text((x,y+pad+195),fl,font=F(B,64),fill=(255,200,60))
    d.text((x,y+pad+300),meta,font=F(R,28),fill=(170,170,190))
    d.text((x,y+pad+345),"opensea.io/collection/"+s,font=F(R,22),fill=(120,160,230))
    for j in range(3):
        t=Image.open(f"{s}-{j+1}.img").convert('RGB').resize((tile,tile),Image.LANCZOS)
        im.paste(t,(lw+pad+j*(tile+pad),y+pad))
d.text((W//2,H-45),"Images : exemples réels de chaque collection (OpenSea). © de chaque image à son créateur respectif. Aucun visuel Dogzy.",font=F(R,24),fill=(150,150,170),anchor='mm')
im.save('/workspace/nft-anim/comparaison-chiens-nft.png'); print(im.size)
