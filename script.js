// Shared script for index and project pages
const API_URL = "https://script.google.com/macros/s/AKfycbwT8JIUtKCyAfVXwJtrKwK8MAkI-ZHycBJVBaiCneR7izsXxw2fPLpWG3kcikZa8EorAg/exec";

function getParam(name){ 
  const url = new URL(window.location.href); 
  return url.searchParams.get(name); 
}

function escapeHtml(s){ 
  if(s===undefined||s===null) return ''; 
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;'); 
}

function formatPrice(p, lang){ 
  if(p===undefined||p===null||p==='') return '-'; 
  const num = Number(p); 
  if(isNaN(num)) return p; 
  return lang==='ar'? num.toLocaleString('ar-EG') + ' جنيه' : num.toLocaleString('en-US') + ' EGP'; 
}

function getImages(item){ 
  if(!item) return []; 
  if(Array.isArray(item.images)) return item.images.filter(Boolean); 
  const imgs=[]; 
  for(var i=1;i<=10;i++){ 
    if(item['image'+i]) imgs.push(item['image'+i]); 
  } 
  return imgs; 
}

// INDEX PAGE
if(document.getElementById('projects-container')){
  var lang='ar';
  var el = { 
    container:document.getElementById('projects-container'), 
    title:document.getElementById('page-title'), 
    btnAr:document.getElementById('btn-ar'), 
    btnEn:document.getElementById('btn-en'), 
    year:document.getElementById('year') 
  };

  el.year.textContent = new Date().getFullYear();

  // Set year for developer banner if exists
  var devBanner = document.getElementById('developer-banner');
  if (devBanner) {
    // No need to set year here, it's static text
  }

  function setLang(l){ 
    lang=l; 
    document.documentElement.lang = l==='ar'?'ar':'en'; 
    document.documentElement.dir = l==='ar'?'rtl':'ltr'; 
    el.btnAr.classList.toggle('gold', l==='ar'); 
    el.btnEn.classList.toggle('gold', l==='en'); 
    load(); // ✅ التعديل هنا
  }

  el.btnAr.addEventListener('click', function(){ setLang('ar'); }); 
  el.btnEn.addEventListener('click', function(){ setLang('en'); });

  async function load(){
    const cacheKey = 'projectsCache';
    const cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds
    let projects = null;

    // Check cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cacheData = JSON.parse(cached);
        if (Date.now() - cacheData.timestamp < cacheExpiry) {
          projects = cacheData.data;
        }
      } catch (e) {
        console.warn('Invalid cache data, ignoring');
      }
    }

    if (!projects) {
      // Fetch from API
      el.container.innerHTML = '<div class="spinner"></div><div class="empty">جاري تحميل البيانات...</div>';
      try {
        var res = await fetch(API_URL);
        if (!res.ok) throw new Error('API');
        var data = await res.json();
        projects = Array.isArray(data) ? data : (data.data || []);
        // Cache the data
        localStorage.setItem(cacheKey, JSON.stringify({ data: projects, timestamp: Date.now() }));
      } catch (err) {
        console.error(err);
        el.container.innerHTML = '<div class="empty">حدث خطأ أثناء جلب البيانات.</div>';
        return;
      }
    } else {
      // Use cached data, show loading briefly
      el.container.innerHTML = '<div class="spinner"></div><div class="empty">جاري تحميل البيانات...</div>';
    }

    // Render projects
    if (projects.length === 0) {
      el.container.innerHTML = '<div class="empty">' + (lang === 'ar' ? 'لا توجد مشاريع حالياً' : 'No projects found') + '</div>';
      return;
    }
    el.container.innerHTML = '';
    projects.forEach(function(p) {
      el.container.appendChild(renderCard(p, lang));
    });
  }

  function renderCard(p, langLocal){
    var imgs = getImages(p);
    var title = langLocal==='ar'? (p.title_ar||p.title_en||'—') : (p.title_en||p.title_ar||'—');
    var desc = langLocal==='ar'? (p.description_ar||'') : (p.description_en||'');
    var location = langLocal==='ar'? (p.location_ar||'') : (p.location_en||'');
    var price = formatPrice(p.price, langLocal);
    var card = document.createElement('div'); 
    card.className='card';
    var mediaHtml = imgs.length 
      ? '<img src="'+imgs[0]+'" alt="'+escapeHtml(title)+'">' 
      : '<div style="padding:18px;color:var(--muted)">'+(langLocal==='ar'?'لا توجد صور':'No images')+'</div>';
    card.innerHTML = `
      <div class="media" data-id="${p.id}">
        <div class="nav"><button class="prev">‹</button><button class="next">›</button></div>
        ${mediaHtml}
      </div>
      <div class="content">
        <h3 class="title">${escapeHtml(title)}</h3>
        <p class="desc">${escapeHtml(desc.substring(0,160))}</p>
        <div class="meta">
          <div class="location">${escapeHtml(location)}</div>
          <div class="price">${escapeHtml(price)}</div>
        </div>
        <div class="actions">
          <button class="watch" data-video="${escapeHtml(p.video||'')}">${langLocal==='ar'?'شاهد الفيديو':'Watch Video'}</button>
          <button class="details" data-id="${p.id}">${langLocal==='ar'?'المزيد':'Details'}</button>
        </div>
      </div>`;

    var media = card.querySelector('.media'); 
    var imgEl = media.querySelector('img'); 
    var prev = media.querySelector('.prev'); 
    var next = media.querySelector('.next');
    var current = 0;

    prev.addEventListener('click', function(e){ 
      e.stopPropagation(); 
      if(!imgs.length) return; 
      current=(current-1+imgs.length)%imgs.length; 
      if(imgEl) imgEl.src = imgs[current]; 
    });

    next.addEventListener('click', function(e){ 
      e.stopPropagation(); 
      if(!imgs.length) return; 
      current=(current+1)%imgs.length; 
      if(imgEl) imgEl.src = imgs[current]; 
    });

    media.addEventListener('click', function(){ 
      window.location.href = 'project.html?id='+encodeURIComponent(p.id); 
    });

    card.querySelector('.details').addEventListener('click', function(){ 
      window.location.href = 'project.html?id='+encodeURIComponent(p.id); 
    });

    card.querySelector('.watch').addEventListener('click', function(e){ 
      e.stopPropagation(); 
      var v = e.currentTarget.dataset.video; 
      if(v) window.open(v,'_blank'); 
      else alert(langLocal==='ar'?'لا يوجد فيديو لهذا المشروع':'No video for this project'); 
    });

    return card;
  }

  setLang('ar'); 
  load();
}

// PROJECT PAGE
if(document.getElementById('project-hero')){
  var lang='ar'; 
  var id = getParam('id');
  var el = {
    galleryMain:document.getElementById('gallery-main'),
    galleryThumbs:document.getElementById('gallery-thumbs'),
    title:document.getElementById('project-title'),
    desc:document.getElementById('project-desc'),
    location:document.getElementById('project-location'),
    price:document.getElementById('project-price'),
    watchBtn:document.getElementById('watch-video'),
    whatsapp1:document.getElementById('whatsapp1'),
    whatsapp2:document.getElementById('whatsapp2'),
    backBtn:document.getElementById('back-to-list'),
    btnAr:document.getElementById('btn-ar-detail'),
    btnEn:document.getElementById('btn-en-detail'),
    yearProject:document.getElementById('year-project')
  };

  if (el.yearProject) {
    el.yearProject.textContent = new Date().getFullYear();
  }

  el.btnAr.addEventListener('click', function(){ setLang('ar'); }); 
  el.btnEn.addEventListener('click', function(){ setLang('en'); });

  function setLang(l){ 
    lang=l; 
    document.documentElement.lang = l==='ar'?'ar':'en'; 
    document.documentElement.dir = l==='ar'?'rtl':'ltr'; 
    el.btnAr.classList.toggle('gold', l==='ar'); 
    el.btnEn.classList.toggle('gold', l==='en'); 
    renderLang(); 
  }

  function renderLang(){ 
    el.watchBtn.textContent = (lang==='ar'?'شاهد الفيديو':'Watch Video'); 
    el.backBtn.textContent = (lang==='ar'?'عودة للمشاريع':'Back to projects'); 
    el.whatsapp1.textContent = (lang==='ar'?'واتساب 01146605498':'WhatsApp 01146605498'); 
    el.whatsapp2.textContent = (lang==='ar'?'واتساب 01032146197':'WhatsApp 01032146197'); 
  }

  async function load(){
    if(!id){
      el.galleryMain.innerHTML = '<div class="empty">لم يتم تحديد المشروع</div>';
      return;
    }
    try{
      el.galleryMain.innerHTML = '<div class="spinner"></div><div class="empty">جاري تحميل المشروع...</div>';
      var res = await fetch(API_URL + '?id=' + encodeURIComponent(id));
      if(!res.ok) throw new Error('API');
      var data = await res.json();
      var item = Array.isArray(data)?data[0]:data;
      if(!item){
        el.galleryMain.innerHTML = '<div class="empty">المشروع غير موجود</div>';
        return;
      }
      populate(item);
    }catch(err){
      console.error(err);
      el.galleryMain.innerHTML = '<div class="empty">حدث خطأ أثناء جلب المشروع.</div>';
    }
  }

  function populate(p){ 
    var imgs = getImages(p); 
    el.galleryMain.innerHTML = imgs.length 
      ? '<img src="'+imgs[0]+'" alt="'+escapeHtml(p.title_ar||p.title_en||'')+'" id="main-image">' 
      : '<div class="empty">لا توجد صور للمشروع</div>'; 
    el.galleryThumbs.innerHTML='';
    imgs.forEach(function(src,i){ 
      var im = document.createElement('img'); 
      im.src = src; 
      if(i===0) im.classList.add('active'); 
      im.addEventListener('click', function(){ 
        document.getElementById('main-image').src = src; 
        document.querySelectorAll('.gallery-thumbs img').forEach(function(x){ x.classList.remove('active'); }); 
        im.classList.add('active'); 
      }); 
      el.galleryThumbs.appendChild(im); 
    }); 

    el.title.textContent = lang==='ar' ? (p.title_ar||p.title_en) : (p.title_en||p.title_ar); 
    el.desc.textContent = lang==='ar' ? (p.description_ar||p.description_en) : (p.description_en||p.description_ar); 
    el.location.textContent = lang==='ar' ? (p.location_ar||p.location_en||'') : (p.location_en||p.location_ar||''); 
    el.price.textContent = formatPrice(p.price, lang); 

    el.watchBtn.onclick = function(){ 
      if(p.video) window.open(p.video,'_blank'); 
      else alert(lang==='ar'?'لا يوجد فيديو لهذا المشروع':'No video for this project'); 
    }; 

    el.whatsapp1.onclick = function(){ window.open('https://wa.me/201146605498','_blank'); }; 
    el.whatsapp2.onclick = function(){ window.open('https://wa.me/201032146197','_blank'); }; 
    el.backBtn.onclick = function(){ window.location.href = 'index.html'; }; 
  }

  setLang('ar'); 
  load();
}
