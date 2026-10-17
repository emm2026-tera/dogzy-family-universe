/* Characters, careers and Career Chance deck.
   Portraits are display-only crops of the original art (assets/portraits, assets/charcards).
   Career level names + accessories transcribed from the artist's profession sheets (assets/careers). */
window.DZ_CHARS = (function(){
const careers = {
  barmaid: {title:'Barmaid', sheet:'assets/careers/barmaid.png', motto:'From first drink to your own bar empire.',
    levels:[
      {name:'Barmaid', sub:'Apprentice', env:'Casual Bar · Nightlife', items:['Basic uniform (shirt + apron)','Cocktail shaker','Jigger','Bar towel','Non-slip shoes']},
      {name:'Specialized Barmaid', sub:'Cocktails & Mixology', env:'Cocktail Bar · Mixology Lounge', items:['Specialized uniform (vest)','Professional shaker set','Mixology tools','Garnish kit','Cocktail recipe book']},
      {name:'Head Barmaid', sub:'Supervisor', env:'Premium Bar · VIP Lounge', items:['Supervisor jacket','Tablet (inventory)','Earpiece / communication','Staff schedule','Key to bar']},
      {name:'Bar Manager', sub:'Operations', env:'Bar Operations · Staff & Management', items:['Manager suit','Management tablet','Keys (bar & stock)','Staff handbook','Budget planner']},
      {name:'Bar Owner', sub:'Bar Chain / Franchise', env:'Bar Chain · Franchise', items:['Logo & branding','Delivery truck','New bar location','Marketing campaign','Franchise contract']}]},
  server: {title:'Server', sheet:'assets/careers/server.png', motto:'From first table to your own restaurant.',
    levels:[
      {name:'Server', sub:'Apprentice', env:'Casual Restaurant', items:['Basic uniform (shirt + apron)','Tray','Order pad','Pen','Non-slip shoes']},
      {name:'Specialized Server', sub:'Bar & Drinks', env:'Bar / Lounge', items:['Vest (specialized uniform)','Bar tools (shaker, jigger)','Cocktail glasses set','Wine opener','Drink menu']},
      {name:'Head Server', sub:'Supervisor', env:'Fine Dining', items:['Supervisor jacket','Tablet (reservations)','Earpiece / communication','Reserved signs','Staff schedule']},
      {name:'Restaurant Manager', sub:'Operations', env:'Restaurant Operations', items:['Manager suit','Management tablet','Keys (restaurant)','Staff handbook','Budget planner']},
      {name:'Business Owner', sub:'Restaurant Chain / Franchise', env:'Restaurant Chain', items:['Logo & branding','Delivery truck','New location (building)','Marketing campaign','Franchise contract']}]},
  cuisinier: {title:'Cuisinier', sheet:'assets/careers/cuisinier.png', motto:'De la passion en cuisine… à ton propre restaurant !',
    levels:[
      {name:'Cuisinier', sub:'Apprenti', env:'Cuisine de base', items:['Toque de cuisinier','Tablier de base','Cuillère en bois','Planche à découper','Couteau de chef']},
      {name:'Chef cuisinier', sub:'Spécialisé', env:'Cuisine équipée', items:['Veste de chef (spécialisée)','Poêle professionnelle','Ensemble de couteaux','Thermomètre de cuisson','Ustensiles spécialisés']},
      {name:'Maître hôte', sub:'Chef exécutif', env:'Cuisine gastronomique', items:['Toque de maître','Médaille/insigne','Tabard d\u2019honneur','Livre de recettes','Assiette signature']},
      {name:'Propriétaire', sub:'Restaurateur', env:'Salle à manger', items:['Tenue de propriétaire','Tablette de gestion','Clé du restaurant','Contrat d\u2019affaires','Équipe de staff']},
      {name:'Commerce', sub:'Chaîne / Franchise', env:'Chaîne de restaurants', items:['Logo & enseigne','Camion de livraison','Franchise (nouvel emplacement)','Campagne marketing','Expansion internationale']}]},
};
// Basic characters: name, job and the 5 "accessories required for upgrade" + Boss title, transcribed from their character cards.
const C = (id, name, job, group, extra) => Object.assign({id, name, job, group, portrait:`assets/portraits/${id}.jpg`}, extra || {});
const basic = [
  C('chefzy','Chefzy','Baker','basic',{career:'cuisinier', prof:'Cook', card:'assets/charcards/chefzy.jpg', cardItems:['Mixing Bowl','Rolling Pin','Oven Mitt','Recipe Book','Commercial Oven'], boss:'Boss Chefzy – Master Baker'}),
  C('waitzy','Waitzy','Waitress','basic',{career:'server', prof:'Server', card:'assets/charcards/waitzy.jpg', cardItems:['Serving Tray','Order Pad','Apron','Coffee Pot','Cash Terminal'], boss:'Boss Waitzy – Restaurant Manager'}),
  C('barzy','Barzy','Bartender','basic',{career:'barmaid', prof:'Barmaid', card:'assets/charcards/barzy.jpg', cardItems:['Cocktail Shaker','Bar Spoon','Ice Bucket','Recipe Book','Premium Glass Set'], boss:'Boss Barzy – Master Mixologist'}),
  C('doczy','Doczy','Doctor','basic',{card:'assets/charcards/doczy.jpg', cardItems:['Stethoscope','Medical Bag','Prescription Pad','X-Ray Scanner','Ambulance'], boss:'Boss Doczy – Chief Medical Officer'}),
  C('gentlezy','Gentlezy','Gentleman','basic',{card:'assets/charcards/gentlezy.jpg', cardItems:['Bowler Hat','Cane','Pocket Watch','Luxury Suit','Vintage Car'], boss:'Boss Gentlezy – Master of Elegance'}),
  C('sportzy','Sportzy','Tennis Coach','basic',{card:'assets/charcards/sportzy.jpg', cardItems:['Tennis Racket','Sports Bag','Training Cones','Water Bottle','Trophy'], boss:'Boss Sportzy – Champion Coach'}),
  C('magiczy','Magiczy','Entertainer','basic',{card:'assets/charcards/magiczy.jpg', cardItems:['Magic Wand','Top Hat','Playing Cards','Magic Box','Cape'], boss:'Boss Magiczy – Master of Magic'}),
  C('bankzy','Bankzy','Banker','basic',{card:'assets/charcards/bankzy.jpg', cardItems:['Vault Key','Calculator','Credit Card','Investment File','Laptop'], boss:'Boss Bankzy – Financial Director'}),
  C('lawzy','Lawzy','Lawyer','basic',{card:'assets/charcards/lawzy.jpg', cardItems:['Law Book','Briefcase','Gavel','Contract','Court Badge'], boss:'Boss Lawzy – Chief Attorney'}),
  C('securzy','Securzy','Security Guard','basic',{card:'assets/charcards/securzy.jpg', cardItems:['Radio','Flashlight','Security Badge','Camera','Patrol Vehicle'], boss:'Boss Securzy – Security Commander'}),
  C('buildzy','Buildzy','Construction Worker','basic',{card:'assets/charcards/buildzy.jpg', cardItems:['Hammer','Safety Helmet','Toolbox','Cement Mixer','Blueprint'], boss:'Boss Buildzy – Master Builder'}),
  C('cashzy','Cashzy','Cashier','basic',{card:'assets/charcards/cashzy.jpg', cardItems:['Cash Register','Barcode Scanner','Receipt Printer','Coin Tray','POS Terminal'], boss:'Boss Cashzy – Store Supervisor'}),
];
const teens = [
  C('pyromaniac','The Pyromaniac','VIP antagonist','teen',{persona:'aggressive'}),
  C('jouzy','Jouzy','Graffiti artist','teen',{persona:'risky'}),
  C('waltzy','Waltzy','Young scientist','teen',{persona:'strategist'}),
  C('kelzy','Kelzy','Teen cheerleader','teen',{persona:'balanced'}),
];
const careerChance = [
  {n:1,title:'Promotion!',badge:'NEXT LEVEL'},{n:2,title:'Employee of the Month',badge:'+1 CAREER ITEM'},
  {n:3,title:'Torn Uniform',badge:'-1 UNIFORM PIECE'},{n:4,title:'Training Day',badge:'+150 TOKENS'},
  {n:5,title:'Big Tip',badge:'+100 TOKENS'},{n:6,title:'Job Interview',badge:'QUIZ'},
  {n:7,title:'Late for Work',badge:'-75 TOKENS'},{n:8,title:'Franchise Deal',badge:'+50 PER BUSINESS'},
  {n:9,title:'Mentor a Rookie',badge:'+1 CAREER ITEM'},{n:10,title:'Health Inspection',badge:'-25 PER BUSINESS'}];
const files = ['promotion','employee-of-the-month','torn-uniform','training-day','big-tip','job-interview','late-for-work','franchise-deal','mentor-a-rookie','health-inspection'];
careerChance.forEach((c,i) => c.file = `assets/career-chance/career-${String(i+1).padStart(2,'0')}-${files[i]}.png`);
all_fix();
function all_fix(){ [...basic].forEach(c => { if (!c.prof) c.prof = c.job; }); }
return {careers, basic, teens, all:[...basic, ...teens], careerChance};
})();
