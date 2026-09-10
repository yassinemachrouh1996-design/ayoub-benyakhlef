// القائمة للهاتف
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if(menuBtn) menuBtn.onclick = () => navLinks.classList.toggle('show');
document.querySelectorAll('#navLinks a').forEach(a => a.onclick = () => navLinks.classList.remove('show'));

// صورة بديلة إذا الملف غير موجود
function imgFallback(img){
  img.onerror = null;
  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#eef3f0"/><text x="50%" y="45%" font-size="60" text-anchor="middle">📷</text><text x="50%" y="62%" font-size="22" text-anchor="middle" font-family="sans-serif" fill="#0b3d5f">الصورة غير موجودة بعد</text><text x="50%" y="74%" font-size="16" text-anchor="middle" font-family="sans-serif" fill="#666">أضفها بالزر أعلاه</text></svg>`);
}

// فلترة المعرض
document.querySelectorAll('.filter-btns button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.filter-btns button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.g-item').forEach(item => {
      item.style.display = (f === 'all' || item.dataset.cat === f) ? 'block' : 'none';
    });
  };
});

// Lightbox
const items = Array.from(document.querySelectorAll('.g-item'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbCap = document.getElementById('lightboxCap');
let idx = 0;

function visibleItems(){ return items.filter(i => i.style.display !== 'none'); }
function openLB(i){
  const vis = visibleItems();
  idx = vis.indexOf(i);
  if(idx<0) idx=0;
  showLB(vis);
}
function showLB(vis){
  vis = vis || visibleItems();
  const el = vis[idx];
  if(!el) return;
  lbImg.src = el.querySelector('img').src;
  lbCap.textContent = el.querySelector('.g-cap').textContent;
  lightbox.classList.add('show');
}
items.forEach(el => el.onclick = () => openLB(el));
// Lightbox للشواهد في قسم إنجازاتي
document.querySelectorAll('.cert-card').forEach(card => {
  card.onclick = () => {
    const img = card.querySelector('img');
    if(img){ lbImg.src = img.src; lbCap.textContent = card.dataset.cap || card.querySelector('.cert-cap b')?.textContent || ''; lightbox.classList.add('show'); }
  };
});
const closeBtn = document.querySelector('.close');
if(closeBtn) closeBtn.onclick = () => lightbox.classList.remove('show');
if(lightbox) lightbox.onclick = (e) => { if(e.target===lightbox) lightbox.classList.remove('show'); };
const nextBtn = document.querySelector('.lb-next');
const prevBtn = document.querySelector('.lb-prev');
if(nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); const v=visibleItems(); idx=(idx+1)%v.length; showLB(v); };
if(prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); const v=visibleItems(); idx=(idx-1+v.length)%v.length; showLB(v); };
document.onkeydown = (e) => { if(e.key==='Escape' && lightbox) lightbox.classList.remove('show'); };

// ===== رفع الصور وحفظها في المتصفح (الحل السريع) =====
const uploadInput = document.getElementById('photoUpload');
const IDS = ['img1','img2','img3','img4','img5','img6','img7','img8','img9','img10','img11','img12','imgAbout','imgSchool','imgHeroSchool','imgHeroMinistry','imgMinistryTop'];

// استرجاع الصور المحفوظة عند فتح الموقع
function restorePhotos(){
  try{
    const saved = JSON.parse(localStorage.getItem('teacherPhotos') || '{}');
    Object.keys(saved).forEach(id => {
      const el = document.getElementById(id);
      if(el && saved[id]){ el.onerror = null; el.src = saved[id]; }
    });
    // صور قسم طلابي تتبع نفس صور المعرض
    document.querySelectorAll('.s-card img').forEach((el,i)=>{
      const key = ['img10','img5','img12'][i];
      if(key && saved[key]){ el.onerror=null; el.src = saved[key]; }
    });
    // استرجاع شواهد قسم إنجازاتي
    const savedCerts = JSON.parse(localStorage.getItem('teacherCerts') || '[]');
    if(savedCerts.length){
      document.querySelectorAll('.cert-card img').forEach((img,i)=>{
        if(savedCerts[i]){ img.onerror=null; img.src = savedCerts[i]; }
      });
    }
  }catch(e){}
}
restorePhotos();

function resizeImage(file, maxSize, quality){
  return new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = (ev)=>{
      const img = new Image();
      img.onload = ()=>{
        let {width, height} = img;
        const scale = Math.min(1, maxSize / Math.max(width, height));
        width = Math.round(width*scale); height = Math.round(height*scale);
        const c = document.createElement('canvas');
        c.width = width; c.height = height;
        c.getContext('2d').drawImage(img,0,0,width,height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

if(uploadInput){
  uploadInput.onchange = async (e)=>{
    const files = Array.from(e.target.files || []);
    if(!files.length) return;
    const saved = JSON.parse(localStorage.getItem('teacherPhotos') || '{}');
    const galleryFiles = files.slice(0,12);
    for(let i=0;i<galleryFiles.length;i++){
      const dataUrl = await resizeImage(galleryFiles[i], 1000, 0.82);
      const id = 'img'+(i+1);
      const el = document.getElementById(id);
      if(el){ el.onerror=null; el.src = dataUrl; }
      saved[id] = dataUrl;
    }
    // انسخ للصور الأخرى
    if(saved['img5']){ const a=document.getElementById('imgAbout'); if(a){a.onerror=null;a.src=saved['img5'];} saved['imgAbout']=saved['img5']; }
    if(saved['img1']){ const s=document.getElementById('imgSchool'); if(s){s.onerror=null;s.src=saved['img1'];} saved['imgSchool']=saved['img1'];
      const h=document.getElementById('imgHeroSchool'); if(h){h.onerror=null;h.src=saved['img1'];} saved['imgHeroSchool']=saved['img1']; }
    // إذا رفع المستخدم صورة 13 (شعار الوزارة) استعملها للشعار
    if(files.length > 12){
      const logoUrl = await resizeImage(files[12], 600, 0.9);
      ['imgHeroMinistry','imgMinistryTop'].forEach(id=>{
        const el = document.getElementById(id);
        if(el){ el.onerror=null; el.src = logoUrl; }
        saved[id] = logoUrl;
      });
    }
    try{ localStorage.setItem('teacherPhotos', JSON.stringify(saved)); }catch(err){ alert('الصور كبيرة جداً على التخزين، اختر صور أصغر أو عدد أقل.'); }
    alert('تمت إضافة '+galleryFiles.length+' صور بنجاح! ستظهر الآن وتبقى محفوظة.');
    document.getElementById('galleryGrid').scrollIntoView({behavior:'smooth'});
  };
}

const resetBtn = document.getElementById('resetPhotos');
if(resetBtn) resetBtn.onclick = ()=>{
  if(confirm('حذف كل الصور المحفوظة؟')){
    localStorage.removeItem('teacherPhotos');
    localStorage.removeItem('teacherCerts');
    location.reload();
  }
};

// ===== رفع شواهد قسم إنجازاتي =====
const certUpload = document.getElementById('certUpload');
if(certUpload){
  certUpload.onchange = async (e)=>{
    const files = Array.from(e.target.files || []);
    if(!files.length) return;
    const imgs = Array.from(document.querySelectorAll('.cert-card img'));
    const saved = [];
    try{ const old = JSON.parse(localStorage.getItem('teacherCerts') || '[]'); old.forEach(u=>saved.push(u)); }catch(err){}
    const n = Math.min(files.length, imgs.length);
    for(let i=0;i<n;i++){
      const url = await resizeImage(files[i], 1000, 0.82);
      imgs[i].onerror = null; imgs[i].src = url;
      saved[i] = url;
    }
    try{ localStorage.setItem('teacherCerts', JSON.stringify(saved)); }catch(err){ alert('الصور كبيرة جداً على التخزين، اختر صور أصغر أو عدد أقل.'); }
    alert('تزادو '+n+' ديال الشواهد بنجاح!');
  };
}
// Lightbox لشواهد قسم من أنا
document.querySelectorAll('.about-cert-card').forEach(card => {
  card.onclick = () => {
    const img = card.querySelector('img');
    if(img){ lbImg.src = img.src; lbCap.textContent = card.dataset.cap || ''; lightbox.classList.add('show'); }
  };
});
// الضغط على شهادة واحدة لتبديلها (دوبل كليك)
document.querySelectorAll('.cert-card').forEach((card, i)=>{
  card.ondblclick = (ev)=>{
    ev.stopPropagation();
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = async ()=>{
      if(!inp.files.length) return;
      const url = await resizeImage(inp.files[0], 1000, 0.85);
      const img = card.querySelector('img');
      if(img){ img.onerror=null; img.src = url; }
      try{
        const saved = JSON.parse(localStorage.getItem('teacherCerts') || '[]');
        saved[i] = url;
        localStorage.setItem('teacherCerts', JSON.stringify(saved));
      }catch(err){}
    };
    inp.click();
  };
});

// زر الصعود
const topBtn = document.getElementById('topBtn');
window.onscroll = () => { if(topBtn) topBtn.style.display = window.scrollY > 400 ? 'block' : 'none'; };
if(topBtn) topBtn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});

// نموذج الاتصال
function sendMsg(e){
  e.preventDefault();
  const n = document.getElementById('name').value;
  alert('شكراً ' + n + ' ! تم استلام رسالتك بنجاح، سيتواصل معك الأستاذ قريباً.');
  e.target.reset();
}
