/* English career texts (chars.js is shared with the French version; only the French-language entries are replaced here). */
(function(){
  const C = window.DZ_CHARS.careers;
  C.server.title = 'Server';
  C.cuisinier = Object.assign({}, C.cuisinier, {title:'Cook', motto:'From a passion for cooking… to your own restaurant!',
    levels:[
      {name:'Cook', sub:'Apprentice', env:'Basic kitchen', items:['Cook\u2019s hat','Basic apron','Wooden spoon','Cutting board','Chef\u2019s knife']},
      {name:'Chef', sub:'Specialized', env:'Equipped kitchen', items:['Chef\u2019s jacket (specialized)','Professional pan','Knife set','Cooking thermometer','Specialized utensils']},
      {name:'Master Host', sub:'Executive Chef', env:'Fine-dining kitchen', items:['Master\u2019s toque','Medal / badge','Honor tabard','Recipe book','Signature plate']},
      {name:'Owner', sub:'Restaurateur', env:'Dining room', items:['Owner\u2019s outfit','Management tablet','Restaurant key','Business contract','Staff team']},
      {name:'Business', sub:'Chain / Franchise', env:'Restaurant chain', items:['Logo & sign','Delivery truck','Franchise (new location)','Marketing campaign','International expansion']}]});
})();
