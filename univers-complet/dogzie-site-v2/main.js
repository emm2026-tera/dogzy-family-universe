(function(){
  const toggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.nav');
  if(toggle&&nav){
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open?'true':'false');
    });
  }
  document.querySelectorAll('.has-sub > .sub-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const li=btn.parentElement;
      const open=li.classList.toggle('open');
      btn.setAttribute('aria-expanded', open?'true':'false');
    });
  });
  const trailer=document.querySelector('[data-trailer]');
  if(trailer){
    const btn=trailer.querySelector('.trailer-play');
    btn&&btn.addEventListener('click',()=>{
      const id=trailer.getAttribute('data-trailer');
      const iframe=document.createElement('iframe');
      iframe.src=`https://player.vimeo.com/video/${id}?autoplay=1`;
      iframe.allow='autoplay; fullscreen; picture-in-picture';
      iframe.title='Bande-annonce Dogzie Universe';
      trailer.appendChild(iframe);
      trailer.classList.add('is-playing');
    });
  }
  const form=document.getElementById('form-partenaires');
  if(form){
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd=new FormData(form);
      const subject=encodeURIComponent('Demande partenaires / deck — Dogzie Universe');
      const body=encodeURIComponent(
        `Nom complet: ${fd.get('nom')}\nFonds / entreprise: ${fd.get('fonds')}\nCourriel professionnel: ${fd.get('courriel')}\nProfil LinkedIn: ${fd.get('linkedin')}\nSite web: ${fd.get('site')}\n\nMessage:\n${fd.get('message')}`
      );
      window.location.href=`mailto:partenaires@thedogzyfamilyuniverse.ca?subject=${subject}&body=${body}`;
      const conf=document.getElementById('form-confirmation');
      if(conf){conf.hidden=false;}
    });
  }
})();
