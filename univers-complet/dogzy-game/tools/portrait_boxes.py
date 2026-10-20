A='/home/box/agent-data/agents/26426c55-a805-42ac-a891-44a5a67c3661/attachments/'
B='/workspace/dogzie-site-v2/assets/base/'
s=1.875
def tb(x0,y0,x1,y1): return tuple(int(v*s) for v in (x0,y0,x1,y1))
cols=[0,177,353]; 
BOX={}
r1=[0,412]
for n,(c,r) in {'doczy':(0,0),'gentlezy':(1,0),'chefzy':(2,0),'sportzy':(0,1),'wheelzy':(1,1),'magiczy':(2,1)}.items():
    x=cols[c]; y=r1[r]; BOX[n]=(B+'base-01.png',tb(x+12,y+50,x+110,y+148))
r2=[0,283,562]
for n,(c,r) in {'bankzy':(0,0),'lawzy':(1,0),'securzy':(2,0),'salonzy':(0,1),'shopzy':(1,1),'buildzy':(2,1),'electrozy':(0,2),'plumbzy':(1,2),'mechzy':(2,2)}.items():
    x=cols[c]; y=r2[r]; BOX[n]=(B+'base-02.png',tb(x+14,y+38,x+108,y+132))
r3=[0,285,560]
for n,(c,r) in {'waitzy':(0,0),'shopzy-boutique':(1,0),'beautzy':(2,0),'cashzy':(0,1),'barzy':(1,1),'modelzy':(2,1)}.items():
    x=cols[c]; y=r3[r]; BOX[n]=(B+'base-03.png',tb(x+14,y+32,x+108,y+126))
BOX['actzy']=(B+'base-03.png',tb(177+14,560+32,177+108,560+126))
s2=1254/800
BOX['jouzy']=(A+'ef85a2873b641b2781dbeb8a4439f61ce7a2e9c74b3bc02b7a24659bce376617.png',tuple(int(v*s2) for v in (15,475,115,595)))
BOX['waltzy']=(A+'6519794481da40cbd303981ca598c4263c70711e81d4443f9c9a4d0a7fffd1a0.png',tuple(int(v*s2) for v in (15,475,115,595)))
p=2075/800
BOX['pyromaniac']=(A+'79c7e3cc516d8d136bc40c114efce5d1aefa43aca7f50cab29131a310f458ea3.jpg',tuple(int(v*p) for v in (8,470,55,515)))
k=1672/800
BOX['kelzy']=(A+'8db2e343a9889c2b7a9309b05fcfa2784273a74288e433ddb24ce281119e28b1.png',tuple(int(v*k) for v in (630,35,750,155)))
