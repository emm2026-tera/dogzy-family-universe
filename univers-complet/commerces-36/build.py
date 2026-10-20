from PIL import Image,ImageDraw,ImageFont,ImageFilter
D=[("CITY HALL","ADMINISTRATION","CITY ADMINISTRATION","runs the city and coordinates every service in Dogzy Town.",["City Services","Mayor's Office","Event Plaza","Records Office","Council Chamber"]),
("POLICE STATION","PUBLIC SAFETY","POLICE HQ","maintains law and order and keeps Dogzy Town safe.",["K9 Unit","Dispatch Center","Investigation Lab","Patrol Fleet","Police Helicopter"]),
("FIRE STATION","EMERGENCY SERVICES","FIRE HQ","protects citizens and responds quickly to every emergency.",["Additional Trucks","Rescue Unit","Training Center","Water Tower","Alarm Network"]),
("HOSPITAL","HEALTHCARE","CITY HOSPITAL","cares for the health of every citizen in Dogzy Town.",["Emergency Ward","Surgery Wing","Helicopter Pad","Pharmacy","Research Lab"]),
("SCHOOL","EDUCATION","SCHOOL CAMPUS","teaches young citizens and prepares the future of the city.",["Classrooms","Sports Field","Student Programs","Science Lab","Library Corner"]),
("LIBRARY","KNOWLEDGE","GRAND LIBRARY","preserves knowledge and inspires minds across generations.",["Digital Archives","Learning Center","Event Hall","Rare Books","Reading Garden"]),
("COURTHOUSE","JUSTICE","JUSTICE CENTER","delivers fair justice for all citizens of Dogzy Town.",["Courtrooms","Legal Services","Records Archive","Mediation Room","Security Wing"]),
("BANK","FINANCIAL SERVICES","MAIN BANK","keeps savings safe and fuels the city economy.",["Vault","Investment Office","Premium Services","ATM Network","Loan Desk"]),
("POST OFFICE","MAIL SERVICES","CENTRAL HUB","connects all citizens through fast and reliable mail services.",["Sorting Center","Delivery Fleet","Package Hub","Postal Banking","Digital Services"]),
("SUPERMARKET","FOOD & ESSENTIALS","MEGA MARKET","supplies fresh food and daily essentials to the city.",["Larger Stock","Delivery Service","Organic Section","Bakery Corner","Express Checkout"]),
("BAKERY","FOOD & BEVERAGE","ARTISAN BAKERY","bakes fresh bread and treats every morning.",["Pastry Workshop","Coffee Corner","Custom Orders","Bigger Ovens","Delivery Service"]),
("RESTAURANT","FOOD & BEVERAGE","FINE DINING","serves delicious meals to hungry citizens.",["Gourmet Menu","Rooftop Terrace","Chef's Table","Wine Cellar","Private Room"]),
("PIZZERIA","FOOD & BEVERAGE","PIZZERIA","serves hot pizza to the whole neighborhood.",["Delivery Service","Expanded Kitchen","Private Room","Wood Oven","Patio Seating"]),
("SUSHI RESTAURANT","FOOD & BEVERAGE","SUSHI HOUSE","prepares fresh sushi for citizens who love fine flavors.",["Sushi Bar","Premium Menu","VIP Room","Takeout Counter","Chef's Counter"]),
("COFFEE SHOP","FOOD & BEVERAGE","COFFEE CHAIN","keeps Dogzy Town energized one cup at a time.",["Drive-Thru","Lounge Area","Specialty Drinks","Pastry Display","Roastery"]),
("HOTEL","ACCOMMODATION","LUXURY HOTEL","welcomes visitors with comfort and style.",["More Rooms","Spa & Pool","Conference Center","Rooftop Bar","Concierge"]),
("CLOTHING STORE","RETAIL","FASHION HUB","dresses citizens in the latest styles.",["New Collections","VIP Fitting","Custom Design","Shoe Section","Online Store"]),
("BEAUTY SALON","SERVICES","BEAUTY CENTER","helps citizens look and feel their best.",["Hair & Makeup","Esthetics","Spa Section","Nail Studio","Product Shop"]),
("PET STORE","PET SUPPLIES","PET PARADISE","provides everything pets need to be happy and healthy.",["Grooming Services","Veterinary Corner","Exotic Pets","Pet Food Aisle","Play Area"]),
("FLOWER SHOP","RETAIL","FLORAL GARDEN","brightens the city with fresh flowers and bouquets.",["Rare Flowers","Event Decorations","Delivery Service","Greenhouse","Gift Section"]),
("HARDWARE STORE","RETAIL","MEGA HARDWARE","supplies tools and materials for every project.",["Tools & Materials","Pro Equipment","Construction Supplies","Garden Center","Rental Service"]),
("CONSTRUCTION COMPANY","BUSINESS SERVICES","CONSTRUCTION HQ","builds and expands the neighborhoods of Dogzy Town.",["Heavy Equipment","Project Management","Materials Supply","Crane Fleet","Design Office"]),
("PLUMBING COMPANY","BUSINESS SERVICES","PLUMBING HQ","keeps water flowing in every home and business.",["Maintenance Service","Emergency Repairs","Equipment Storage","Service Vans","Training Room"]),
("ELECTRICIAN COMPANY","BUSINESS SERVICES","ELECTRIC HQ","powers the city with safe and reliable electrical work.",["Electrical Services","Emergency Unit","Smart Home Systems","Solar Panels","Service Vans"]),
("CAR DEALERSHIP","AUTOMOTIVE","PREMIUM DEALERSHIP","sells new and used vehicles to citizens.",["New Vehicles","Luxury Section","Service Center","Test Track","Finance Office"]),
("CAR REPAIR GARAGE","AUTOMOTIVE","CUSTOM GARAGE","keeps every vehicle in Dogzy Town running smoothly.",["Expert Repair","Customization","Performance Tuning","Paint Shop","Tow Truck"]),
("GAS STATION","AUTOMOTIVE","FULL SERVICE","keeps vehicles fueled and travelers on the move.",["Convenience Store","Car Wash","Charging Station","Snack Bar","Extra Pumps"]),
("GYM / FITNESS CENTER","HEALTH & FITNESS","FITNESS HUB","keeps citizens strong, fit and healthy.",["Training Area","Personal Coaching","Spa & Sauna","Pool","Group Classes"]),
("SHOPPING CENTER","RETAIL","MEGA MALL","provides the best shopping experience in Dogzy Town.",["New Retail Wing","Payment Network","Logistics Center","Food Court","Luxury Section"]),
("CINEMA","ENTERTAINMENT","MULTIPLEX","brings the latest movies to the big screen.",["More Screens","VIP Theater","Arcade Zone","Snack Bar","3D Projection"]),
("ARCADE","ENTERTAINMENT","GAME CENTER","offers games and fun for players of all ages.",["New Games","VR Zone","Tournament Area","Prize Counter","Snack Bar"]),
("NIGHTCLUB","ENTERTAINMENT","NIGHTLIFE HUB","brings music and nightlife to Dogzy Town.",["VIP Lounge","Live DJ","Rooftop Club","Light Show","Dance Floor"]),
("SPORTS ARENA","ENTERTAINMENT","STADIUM","hosts big games and events for the whole city.",["Major Events","Overtime Seating","VIP Suites","Giant Screen","Training Field"]),
("MEDIA STUDIO","MEDIA & CONTENT","MEDIA NETWORK","creates shows, music and news for Dogzy Town.",["Recording Studio","Broadcast Room","Production Center","Editing Suite","Live Stage"]),
("RECYCLING CENTER","CITY SERVICES","ECO CENTER","keeps the city clean and green.",["Sorting Facility","Waste Processing","Green Energy","Collection Trucks","Compost Site"]),
("AIRPORT","TRANSPORTATION","INTERNATIONAL AIRPORT","connects Dogzy Town to the rest of the world.",["More Flights","VIP Lounge","International Terminal","Cargo Hub","Control Tower"])]
F='/usr/share/fonts/truetype/dejavu/DejaVuSans'
f=lambda s,b=True:ImageFont.truetype(F+('-Bold' if b else '')+'.ttf',s)
GOLD=(232,184,72);W=2000;g=10;CW=(W-3*g)//2;CH=372
def card(i):
 n,cat,unl,desc,ups=D[i];c=Image.open(f'cards/{i+1:02d}.png').convert('RGB')
 w,h=c.size;iw=int(CW*0.45)-12;ih=CH-24
 ph=c.crop((5,int(h*0.17),w-5,int(h*0.66)));pw,phh=ph.size;tw=int(phh*iw/ih)
 if tw<pw: ph=ph.crop(((pw-tw)//2,0,(pw-tw)//2+tw,phh))
 ph=ph.resize((iw,ih),Image.LANCZOS).filter(ImageFilter.UnsharpMask(2,80,2))
 im=Image.new('RGB',(CW,CH),'black');im.paste(ph,(12,12));d=ImageDraw.Draw(im)
 d.rounded_rectangle((2,2,CW-3,CH-3),16,outline=GOLD,width=5);d.line((iw+14,10,iw+14,CH-10),fill=GOLD,width=3)
 x=iw+30;R=CW-20;y=16;s=34
 while f(s).getlength(n)>R-x and s>20:s-=1
 d.text((x,y),n,font=f(s),fill=GOLD);y+=s+6
 d.text((x,y),cat+" BUILDING",font=f(17),fill=GOLD);y+=26
 words=(n.title()+' '+desc).split();line=''
 for wd in words:
  t=(line+' '+wd).strip()
  if f(18,False).getlength(t)>R-x: d.text((x,y),line,font=f(18,False),fill='white');y+=23;line=wd
  else: line=t
 d.text((x,y),line,font=f(18,False),fill='white');y+=30
 bh=5*22+34;d.rounded_rectangle((x,y,R,y+bh),8,outline=GOLD,width=2)
 d.text((x+12,y+6),"UPGRADES REQUIRED (0/5)",font=f(16),fill=GOLD)
 for k,u in enumerate(ups):
  yy=y+30+k*22;d.ellipse((x+14,yy+3,x+26,yy+15),fill=GOLD);d.text((x+34,yy),u,font=f(15,False),fill='white')
 y+=bh+10
 d.text((x,y),"PROGRESS",font=f(15),fill='white');d.rounded_rectangle((x+100,y+2,R-60,y+16),6,outline=(150,150,150),width=2);d.text((R-50,y-2),"0/5",font=f(18),fill='white')
 y=CH-48;d.rounded_rectangle((x,y,R,CH-14),10,fill=GOLD)
 t="UNLOCKS "+unl;s=20
 while f(s).getlength(t)>R-x-20:s-=1
 d.text(((x+R)//2,(y+CH-14)//2),t,font=f(s),fill='black',anchor='mm')
 return im
H=g+18*(CH+g);out=Image.new('RGB',(W,H),'black')
for i in range(36):
 r,c=divmod(i,2);out.paste(card(i),(g+c*(CW+g),g+r*(CH+g)))
out.save('commerces-36-long.png');out.resize((900,H*900//W),Image.LANCZOS).save('preview.jpg',quality=88)
out.crop((0,0,W,2*(CH+g)+g)).save('closeup.png');out.crop((0,H-2*(CH+g)-g,W,H)).save('closeup_end.png');print(out.size)
