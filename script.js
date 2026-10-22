(function(){
  var root=document.documentElement, body=document.body;
  var home=document.getElementById('page-home'), prods=document.getElementById('page-products');
  var homeTargets={bids:'bids',futures:'futures',weather:'weather',news:'news',alerts:'alerts',contact:'contact'};

  /* Template style */
  var selects=document.querySelectorAll('.style-select');
  function setStyle(v){
    if(v==='heartland') root.removeAttribute('data-style'); else root.setAttribute('data-style',v);
    selects.forEach(function(s){s.value=v;});
    try{localStorage.setItem('jc-style',v);}catch(e){}
  }
  var saved=null; try{saved=localStorage.getItem('jc-style');}catch(e){}
  setStyle(saved||'heartland');
  selects.forEach(function(s){s.addEventListener('change',function(){setStyle(s.value);});});

  /* Drawer */
  var btn=document.getElementById('menuBtn');
  function openDrawer(o){body.classList.toggle('drawer-open',o);btn.setAttribute('aria-expanded',o);}
  btn.addEventListener('click',function(){openDrawer(true);});
  document.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',function(){openDrawer(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')openDrawer(false);});

  /* Router */
  function route(){
    openDrawer(false);
    var h=(location.hash||'#/').replace(/^#\/?/,'');
    var parts=h.split('/');
    var main=document.querySelectorAll('.main-nav a');
    main.forEach(function(a){a.removeAttribute('aria-current');});
    if(parts[0]==='products'){
      home.hidden=true; prods.hidden=false;
      var sub=parts[1];
      document.querySelectorAll('.subnav a').forEach(function(a){a.classList.toggle('on',a.dataset.sub===sub);});
      mark('#/products');
      if(sub&&document.getElementById('p-'+sub)) document.getElementById('p-'+sub).scrollIntoView();
      else window.scrollTo(0,0);
    } else {
      prods.hidden=true; home.hidden=false;
      var t=homeTargets[parts[0]];
      mark(t?'#/'+parts[0]:'#/');
      if(t) document.getElementById(t).scrollIntoView(); else window.scrollTo(0,0);
    }
  }
  function mark(href){document.querySelectorAll('.main-nav a[href="'+href+'"]').forEach(function(a){a.setAttribute('aria-current','page');});}
  window.addEventListener('hashchange',route);
  /* re-clicking the same link should still scroll */
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#/"]');
    if(a&&a.getAttribute('href')===location.hash){e.preventDefault();route();}
  });
  route();

  /* Text alerts form */
  var form=document.getElementById('alertForm'), msg=document.getElementById('formMsg');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=form.name.value.trim(), phone=form.phone.value.replace(/\D/g,'');
    var topics=[].slice.call(form.querySelectorAll('input[name=topics]:checked'));
    var consent=document.getElementById('aConsent').checked;
    form.phone.setAttribute('aria-invalid','false'); form.name.setAttribute('aria-invalid','false');
    var err='';
    if(!name){err='Enter your name.';form.name.setAttribute('aria-invalid','true');}
    else if(phone.length<10){err='Enter a 10-digit mobile number.';form.phone.setAttribute('aria-invalid','true');}
    else if(!topics.length){err='Choose at least one alert type.';}
    else if(!consent){err='Check the consent box to receive text messages.';}
    msg.className='form-msg '+(err?'err':'ok');
    msg.textContent=err||('Signed up. Alerts will go to '+phone.replace(/(\d{3})(\d{3})(\d{4}).*/,'$1-$2-$3')+'.');
    if(!err) form.reset();
  });
})();
