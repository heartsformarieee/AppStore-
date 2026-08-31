(()=>{
'use strict';
const apps=Array.isArray(window.APP_STORE_REGISTRY)?window.APP_STORE_REGISTRY:[];
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const els={
 list:$('#appList'),overlay:$('#detailOverlay'),about:$('#aboutOverlay'),icon:$('#detailIcon'),title:$('#detailTitle'),tag:$('#detailTagline'),version:$('#detailVersion'),category:$('#detailCategory'),status:$('#detailStatus'),desc:$('#detailDescription'),open:$('#openAppBtn'),toast:$('#toast'),search:$('#searchInput'),filter:$('#categoryFilter'),featuredTitle:$('#featuredTitle'),featuredText:$('#featuredText'),featuredOpen:$('#featuredOpen'),featuredStack:$('#featuredStack')
};
let current=null,lastFocus=null;
const validUrl=u=>{try{const x=new URL(u);return ['https:','http:'].includes(x.protocol)?x:null}catch{return null}};
function toast(msg){if(!els.toast)return;els.toast.textContent=msg;els.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove('show'),1900)}
function saveScroll(){try{sessionStorage.setItem('appstore-scroll',String(scrollY))}catch{}}
function restoreScroll(){try{const y=Number(sessionStorage.getItem('appstore-scroll'));if(Number.isFinite(y)&&y>0)requestAnimationFrame(()=>scrollTo(0,y))}catch{}}
function categories(){return [...new Set(apps.map(a=>a.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b))}
function renderFilters(){if(!els.filter)return;els.filter.innerHTML='<option value="">All categories</option>'+categories().map(c=>`<option value="${c.replace(/"/g,'&quot;')}">${c}</option>`).join('')}
function filteredApps(){const q=(els.search?.value||'').trim().toLowerCase(),cat=els.filter?.value||'';return apps.filter(a=>(!cat||a.category===cat)&&(!q||[a.title,a.tagline,a.category,a.description,a.status,a.version].join(' ').toLowerCase().includes(q)))}
function appRow(a){return `<article class="app-row"><button class="app-main" type="button" data-view="${a.id}"><img src="${a.icon}" alt="${a.title} icon" width="64" height="64" loading="lazy" onerror="this.classList.add('img-failed')"><span class="app-copy"><strong>${a.title}</strong><span>${a.tagline}</span><small>${a.status} · v${a.version}</small></span></button><button class="view-btn" data-view="${a.id}" type="button" aria-label="View ${a.title}">VIEW</button></article>`}
function render(){const list=filteredApps();els.list.innerHTML=list.length?list.map(appRow).join(''):'<div class="empty-state"><b>No apps found.</b><span>Try another search or category.</span></div>';$('#appCount').textContent=`${list.length} of ${apps.length} apps`;$('#totalApps').textContent=apps.length;$$('[data-view]',els.list).forEach(b=>b.onclick=()=>openDetail(b.dataset.view))}
function featuredForToday(){if(!apps.length)return null;const d=new Date(),seed=Number(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`);return apps[seed%apps.length]}
function renderFeatured(){const a=featuredForToday();if(!a)return;els.featuredTitle.textContent=a.title;els.featuredText.textContent=`${a.tagline} ${a.description}`;els.featuredOpen.textContent='View app';els.featuredOpen.onclick=()=>openDetail(a.id);const ids=[apps.indexOf(a),apps.indexOf(a)+1,apps.indexOf(a)+2].map(i=>apps[(i+apps.length)%apps.length]);els.featuredStack.innerHTML=ids.map(x=>`<img src="${x.icon}" alt="" width="108" height="108">`).join('')}
function openDetail(id,{fromHash=false}={}){const a=apps.find(x=>x.id===id);if(!a)return;current=a;lastFocus=document.activeElement;els.icon.src=a.icon;els.icon.alt=`${a.title} icon`;els.title.textContent=a.title;els.tag.textContent=a.tagline;els.version.textContent=a.version;els.category.textContent=a.category;if(els.status)els.status.textContent=a.status;els.desc.textContent=a.description;els.overlay.classList.remove('hidden');els.overlay.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');if(!fromHash&&location.hash!==`#app=${a.id}`)history.pushState({app:a.id},'',`#app=${a.id}`);setTimeout(()=>$('#closeDetail')?.focus(),0)}
function closeDetail({historyBack=true}={}){if(els.overlay.classList.contains('hidden'))return;els.overlay.classList.add('hidden');els.overlay.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');current=null;lastFocus?.focus?.();if(historyBack&&location.hash.startsWith('#app='))history.back()}
function openAbout(){lastFocus=document.activeElement;els.about.classList.remove('hidden');els.about.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>$('#closeAbout')?.focus(),0)}
function closeAbout(){els.about.classList.add('hidden');els.about.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');lastFocus?.focus?.()}
function trap(e,root){if(e.key!=='Tab')return;const f=$$('button,input,select,a[href],[tabindex]:not([tabindex="-1"])',root).filter(x=>!x.disabled);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
function syncFromHash(){const m=location.hash.match(/^#app=([\w-]+)$/);if(m){if(els.overlay.classList.contains('hidden'))openDetail(m[1],{fromHash:true})}else if(!els.overlay.classList.contains('hidden'))closeDetail({historyBack:false})}
$('#closeDetail').onclick=()=>closeDetail();els.overlay.onclick=e=>{if(e.target===els.overlay)closeDetail()};$('#profileBtn').onclick=openAbout;$('#closeAbout').onclick=closeAbout;els.about.onclick=e=>{if(e.target===els.about)closeAbout()};
els.open.onclick=()=>{if(!current)return;const u=validUrl(current.url);if(!u)return toast('This app link is invalid.');saveScroll();location.href=u.href};
els.search?.addEventListener('input',render);els.filter?.addEventListener('change',render);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!els.about.classList.contains('hidden'))closeAbout();else if(!els.overlay.classList.contains('hidden'))closeDetail()}if(!els.about.classList.contains('hidden'))trap(e,els.about);else if(!els.overlay.classList.contains('hidden'))trap(e,els.overlay)});
window.addEventListener('popstate',syncFromHash);window.addEventListener('hashchange',syncFromHash);
renderFilters();renderFeatured();render();restoreScroll();syncFromHash();
})();
