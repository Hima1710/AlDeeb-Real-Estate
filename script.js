
// Shared script for index and project pages
const API_URL = "https://script.google.com/macros/s/AKfycbwT8JIUtKCyAfVXwJtrKwK8MAkI-ZHycBJVBaiCneR7izsXxw2fPLpWG3kcikZa8EorAg/exec";

// PWA Install Prompt
let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');
const closeBtn = document.getElementById('close-banner');

if (installBanner && installBtn && closeBtn) {
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installBanner.style.display = 'none';
  } else {
    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBanner.classList.add('show');
    });

    // Install button click
    installBtn.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
          installBanner.classList.remove('show');
        });
      }
    });

    // Close button click
    closeBtn.addEventListener('click', () => {
      installBanner.classList.remove('show');
    });
  }
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

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
    aboutTitle:document.getElementById('about-title'),
    aboutDesc:document.getElementById('about-desc'),
    goalsTitle:document.getElementById('goals-title'),
    goalsDesc:document.getElementById('goals-desc'),
    developmentTitle:document.getElementById('development-title'),
    developmentDesc:document.getElementById('development-desc'),
    workTitle:document.getElementById('work-title'),
    workDesc:document.getElementById('work-desc'),
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
    if (el.btnAr) el.btnAr.classList.toggle('gold', l==='ar');
    if (el.btnEn) el.btnEn.classList.toggle('gold', l==='en');
    updateAboutContent();
    load(); // ✅ التعديل هنا
  }

  function updateAboutContent(){
    if(lang === 'ar'){
      el.aboutTitle.textContent = 'نبذة عن الشركة';
      el.aboutDesc.textContent = 'مجموعة الديب العقارية هي شركة رائدة في مجال التطوير العقاري، مقرها في مدينة السادات بمحافظة المنوفية. نحن متخصصون في بناء مشاريع سكنية وتجارية عالية الجودة، مع التركيز على الابتكار والاستدامة. منذ تأسيسنا، ساهمنا في تطوير العديد من المشاريع التي غيرت وجه المنطقة، ونسعى دائمًا لتحقيق رضا عملائنا من خلال تقديم حلول عقارية متكاملة وموثوقة.';
      el.goalsTitle.textContent = 'أهدافنا';
      el.goalsDesc.textContent = 'نسعى لأن نكون الشركة الرائدة في السوق العقاري من خلال تقديم مشاريع مبتكرة ومستدامة، وبناء مجتمعات حديثة تساهم في تحسين جودة الحياة لسكانها. نهدف إلى توسيع نطاق عملياتنا وتعزيز الثقة مع عملائنا من خلال الشفافية والجودة العالية.';
      el.developmentTitle.textContent = 'تطورنا';
      el.developmentDesc.textContent = 'بدأت رحلتنا منذ سنوات قليلة، وسرعان ما أصبحنا واحدة من الشركات البارزة في المنطقة. من خلال الاستثمار في التكنولوجيا والموارد البشرية، نجحنا في إكمال العديد من المشاريع الناجحة، مما سمح لنا بتوسيع أعمالنا وتعزيز سمعتنا كشركة موثوقة ومحترفة.';
      el.workTitle.textContent = 'عملنا';
      el.workDesc.textContent = 'نقوم بتطوير مشاريع متنوعة تشمل الوحدات السكنية، المجمعات التجارية، والمنشآت الترفيهية. كل مشروع يتم تصميمه بعناية ليلبي احتياجات العملاء، مع الالتزام بأعلى معايير الجودة والسلامة. نحن نؤمن بأن العقار ليس مجرد استثمار، بل هو بناء للمستقبل.';
    } else {
      el.aboutTitle.textContent = 'About the Company';
      el.aboutDesc.textContent = 'Al-Deeb Real Estate Group is a leading company in real estate development, headquartered in Sadat City, Menoufia Governorate. We specialize in building high-quality residential and commercial projects, with a focus on innovation and sustainability. Since our establishment, we have contributed to the development of many projects that have changed the face of the region, and we always strive to achieve customer satisfaction by providing integrated and reliable real estate solutions.';
      el.goalsTitle.textContent = 'Our Goals';
      el.goalsDesc.textContent = 'We strive to be the leading company in the real estate market by offering innovative and sustainable projects, and building modern communities that contribute to improving the quality of life for their residents. We aim to expand our operations and enhance trust with our customers through transparency and high quality.';
      el.developmentTitle.textContent = 'Our Development';
      el.developmentDesc.textContent = 'Our journey began a few years ago, and we quickly became one of the prominent companies in the region. Through investment in technology and human resources, we have successfully completed many successful projects, allowing us to expand our business and enhance our reputation as a reliable and professional company.';
      el.workTitle.textContent = 'Our Work';
      el.workDesc.textContent = 'We develop diverse projects including residential units, commercial complexes, and recreational facilities. Each project is carefully designed to meet customer needs, with a commitment to the highest standards of quality and safety. We believe that real estate is not just an investment, but building for the future.';
    }
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

    // If cached data exists, render immediately
    if (projects) {
      el.container.innerHTML = '';
      projects.forEach(function(p) {
        el.container.appendChild(renderCard(p, lang));
      });
    } else {
      // Show loading if no cache
      el.container.innerHTML = '<div class="spinner"></div><div class="empty">جاري تحميل البيانات...</div>';
    }

    // Fetch new data in background
    try {
      var res = await fetch(API_URL);
      if (!res.ok) throw new Error('API');
      var data = await res.json();
      var newProjects = Array.isArray(data) ? data : (data.data || []);

      // Cache the new data
      localStorage.setItem(cacheKey, JSON.stringify({ data: newProjects, timestamp: Date.now() }));

      // Cache individual project details
      newProjects.forEach(function(p) {
        localStorage.setItem('project_' + p.id, JSON.stringify({ data: p, timestamp: Date.now() }));
      });

      // Re-render if data changed or no cache was used
      if (!projects || JSON.stringify(projects) !== JSON.stringify(newProjects)) {
        el.container.innerHTML = '';
        newProjects.forEach(function(p) {
          el.container.appendChild(renderCard(p, lang));
        });
      }
    } catch (err) {
      console.error(err);
      if (!projects) {
        el.container.innerHTML = '<div class="empty">حدث خطأ أثناء جلب البيانات.</div>';
      }
    }
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
      ? '<div class="carousel-container"><div class="carousel-inner">' + imgs.map(src => '<img src="' + src + '" alt="' + escapeHtml(title) + '">').join('') + '</div></div>'
      : '<div style="padding:18px;color:var(--muted)">'+(langLocal==='ar'?'لا توجد صور':'No images')+'</div>';
    var dotsHtml = imgs.length > 1 ? '<div class="media-dots">' + imgs.map((_, i) => '<span class="media-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"></span>').join('') + '</div>' : '';
    card.innerHTML = `
      <div class="media" data-id="${p.id}">
        ${mediaHtml}
        ${dotsHtml}
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
          <button class="whatsapp" onclick="window.open('https://wa.me/201146605498','_blank')">${langLocal==='ar'?'واتساب 01146605498':'WhatsApp 01146605498'}</button>
          <button class="details" data-id="${p.id}">${langLocal==='ar'?'المزيد':'Details'}</button>
        </div>
      </div>`;

    var media = card.querySelector('.media');
    var carouselInner = media.querySelector('.carousel-inner');
    var dotsContainer = media.querySelector('.media-dots');
    var current = 0;
    var isSwiping = false;
    var dragged = false;
    var startX = 0;
    var startY = 0;
    var currentTranslate = 0;
    var prevTranslate = 0;
    var animationID = 0;

    function updateDots() {
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.media-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === current);
        });
      }
    }

    function setPositionByIndex() {
      currentTranslate = current * -100;
      prevTranslate = currentTranslate;
      setSliderPosition();
    }

    function setSliderPosition() {
      if (carouselInner) {
        carouselInner.style.transform = `translateX(${currentTranslate}%)`;
      }
    }

    function animation() {
      setSliderPosition();
      if (isSwiping) requestAnimationFrame(animation);
    }

    if (carouselInner && imgs.length > 1) {
      // Add click events to dots
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.media-dot').forEach((dot, i) => {
          dot.addEventListener('click', function() {
            current = i;
            setPositionByIndex();
            updateDots();
          });
        });
      }

      // Touch events
      media.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
        animationID = requestAnimationFrame(animation);
      });

      media.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        let currentX = e.touches[0].clientX;
        let currentY = e.touches[0].clientY;
        let diffX = currentX - startX;
        let diffY = Math.abs(currentY - startY);

        if (diffY > Math.abs(diffX)) return; // Vertical scroll

        e.preventDefault();
        currentTranslate = prevTranslate + (diffX / media.offsetWidth) * 100;
      });

      media.addEventListener('touchend', function(e) {
        isSwiping = false;
        cancelAnimationFrame(animationID);

        let endX = e.changedTouches[0].clientX;
        let diffX = startX - endX;
        let diffY = Math.abs(e.changedTouches[0].clientY - startY);

        if (Math.abs(diffX) > 50 && diffX > diffY) { // Swipe threshold
          if (diffX > 0) { // Swipe left - next
            current = Math.min(current + 1, imgs.length - 1);
          } else { // Swipe right - prev
            current = Math.max(current - 1, 0);
          }
        } else {
          // Snap back to current
        }
        setPositionByIndex();
        updateDots();
      });

      // Mouse events
      let mouseStartX = 0;
      let mouseStartY = 0;
      let isDragging = false;

      media.addEventListener('mousedown', function(e) {
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        isDragging = true;
        isSwiping = true;
        animationID = requestAnimationFrame(animation);
        dragged = false;
      });

      media.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        let currentX = e.clientX;
        let currentY = e.clientY;
        let diffX = currentX - mouseStartX;
        let diffY = Math.abs(currentY - mouseStartY);

        if (diffY > Math.abs(diffX)) return; // Vertical drag

        e.preventDefault();
        currentTranslate = prevTranslate + (diffX / media.offsetWidth) * 100;
        dragged = true;
      });

      media.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        isSwiping = false;
        cancelAnimationFrame(animationID);

        let endX = e.clientX;
        let diffX = mouseStartX - endX;
        let diffY = Math.abs(e.clientY - mouseStartY);

        if (Math.abs(diffX) > 50 && diffX > diffY) { // Drag threshold
          if (diffX > 0) { // Drag left - next
            current = Math.min(current + 1, imgs.length - 1);
          } else { // Drag right - prev
            current = Math.max(current - 1, 0);
          }
        }
        setPositionByIndex();
        updateDots();
      });

      media.addEventListener('mouseleave', function(e) {
        if (isDragging) {
          isDragging = false;
          isSwiping = false;
          cancelAnimationFrame(animationID);
          setPositionByIndex();
          updateDots();
        }
      });
    }

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
  updateAboutContent();
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
    if (el.btnAr) el.btnAr.classList.toggle('gold', l==='ar'); 
    if (el.btnEn) el.btnEn.classList.toggle('gold', l==='en'); 
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

    const cacheKey = 'project_' + id;
    const cacheExpiry = 60 * 60 * 1000; // 1 hour
    let item = null;

    // Check cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cacheData = JSON.parse(cached);
        if (Date.now() - cacheData.timestamp < cacheExpiry) {
          item = cacheData.data;
        }
      } catch (e) {
        console.warn('Invalid project cache data, ignoring');
      }
    }

    // If cached, populate immediately
    if (item) {
      populate(item);
    } else {
      el.galleryMain.innerHTML = '<div class="spinner"></div><div class="empty">جاري تحميل المشروع...</div>';
    }

    // Fetch new data in background
    try{
      var res = await fetch(API_URL + '?id=' + encodeURIComponent(id));
      if(!res.ok) throw new Error('API');
      var data = await res.json();
      var newItem = Array.isArray(data)?data[0]:data;
      if(!newItem){
        el.galleryMain.innerHTML = '<div class="empty">المشروع غير موجود</div>';
        return;
      }

      // Cache the new data
      localStorage.setItem(cacheKey, JSON.stringify({ data: newItem, timestamp: Date.now() }));

      // Re-populate if data changed or no cache was used
      if (!item || JSON.stringify(item) !== JSON.stringify(newItem)) {
        populate(newItem);
      }
    }catch(err){
      console.error(err);
      if (!item) {
        el.galleryMain.innerHTML = '<div class="empty">حدث خطأ أثناء جلب المشروع.</div>';
      }
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
