const defaultBeats=[
{id:1,title:"Midnight Drive",genre:"Afrobeats",bpm:108,price:29.99,tag:"NEW"},
{id:2,title:"After Hours",genre:"R&B",bpm:92,price:39.99,tag:""},
{id:3,title:"Gold Dust",genre:"Afro Fusion",bpm:112,price:49.99,tag:"HOT"},
{id:4,title:"Velvet",genre:"R&B",bpm:88,price:29.99,tag:""},
{id:5,title:"No Signal",genre:"Afrobeats",bpm:105,price:39.99,tag:""},
{id:6,title:"Foreign",genre:"Afro Fusion",bpm:118,price:59.99,tag:""},
{id:7,title:"Late Night",genre:"R&B",bpm:94,price:29.99,tag:""},
{id:8,title:"Palm Trees",genre:"Afrobeats",bpm:110,price:39.99,tag:""}];
let beats=JSON.parse(localStorage.getItem("saintyves_beats")||"null")||defaultBeats;
let cart=JSON.parse(localStorage.getItem("saintyves_cart")||"[]");
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const money=n=>"$"+Number(n).toFixed(2);
function save(){localStorage.setItem("saintyves_beats",JSON.stringify(beats));localStorage.setItem("saintyves_cart",JSON.stringify(cart))}
function toast(t){let e=$("#toast");if(!e)return;e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2200)}
function renderCard(b){return `<article class="beat-card"><a href="beat.html?id=${b.id}"><div class="art"><span class="art-no">${String(b.id).padStart(2,"0")} / SAINTYVES</span>${b.tag?`<span class="eyebrow" style="position:absolute;right:15px;bottom:12px">${b.tag}</span>`:""}</div></a><button class="play" onclick="event.preventDefault();toast('Preview player ready — connect your audio file here.')">▶</button><div class="beat-info"><a href="beat.html?id=${b.id}" class="beat-title">${b.title}</a><div class="beat-meta"><span>${b.genre} · ${b.bpm} BPM</span><span>${money(b.price)}</span></div></div></article>`}
function renderBeats(list,el){if(el)el.innerHTML=list.map(renderCard).join("")}
renderBeats(beats.slice(0,6),$("#featuredBeats"));
function filtered(){let q=($("#catalogSearch")?.value||"").toLowerCase(),g=$("#genreFilter")?.value||"all",s=$("#sortFilter")?.value||"featured";let x=beats.filter(b=>(b.title+" "+b.genre).toLowerCase().includes(q)&&(g==="all"||b.genre===g));if(s==="low")x.sort((a,b)=>a.price-b.price);if(s==="high")x.sort((a,b)=>b.price-a.price);return x}
renderBeats(filtered(),$("#allBeats"));
["catalogSearch","genreFilter","sortFilter"].forEach(id=>$("#"+id)?.addEventListener("input",()=>renderBeats(filtered(),$("#allBeats"))));
function updateCart(){let count=$("#cartCount");if(count)count.textContent=cart.length;let list=$("#cartItems"),total=$("#cartTotal");if(list)list.innerHTML=cart.length?cart.map((b,i)=>`<div class="cart-row"><div><b>${b.title}</b><small>${b.license} License</small></div><div><b>${money(b.price)}</b><br><button class="remove" onclick="removeCart(${i})">Remove</button></div></div>`).join(""):`<p style="color:#777;padding:30px 0">Your cart is empty.</p>`;if(total)total.textContent=money(cart.reduce((a,b)=>a+b.price,0))}
function openCart(){updateCart();$("#cartDrawer")?.classList.add("open")}
function removeCart(i){cart.splice(i,1);save();updateCart()}
window.removeCart=removeCart;
$("#openCart")?.addEventListener("click",openCart);
$$("[data-close]").forEach(x=>x.addEventListener("click",()=>x.closest(".drawer,.search-modal,.modal")?.classList.remove("open")));
$("#checkout")?.addEventListener("click",()=>{if(!cart.length)return toast("Add a beat first.");toast("Checkout is ready to connect to Paystack / Stripe.");});
function openSearch(){let m=$("#searchModal");if(!m)return;m.classList.add("open");setTimeout(()=>$("#searchInput")?.focus(),100)}
$("#openSearch")?.addEventListener("click",openSearch);
$("#searchInput")?.addEventListener("input",e=>{let q=e.target.value.toLowerCase();let r=beats.filter(b=>b.title.toLowerCase().includes(q)||b.genre.toLowerCase().includes(q)).slice(0,6);$("#searchResults").innerHTML=r.map(b=>`<a class="search-result" href="beat.html?id=${b.id}"><b>${b.title}</b><span>${b.genre} · ${money(b.price)}</span></a>`).join("")});
const params=new URLSearchParams(location.search), id=Number(params.get("id")), selected=beats.find(b=>b.id===id)||beats[0];
if($("#beatDetail"))$("#beatDetail").innerHTML=`<div class="detail-layout"><div class="detail-art"><div>SY</div></div><div class="detail-copy"><span class="eyebrow">${selected.genre} / ${selected.bpm} BPM</span><h1>${selected.title.toUpperCase()}</h1><p style="color:#888;line-height:1.7">A premium SAINTYVES production built for artists looking for space, movement and character.</p><div class="license-grid"><div class="license selected" data-price="${selected.price}" data-license="Basic"><div><strong>Basic</strong><small>MP3 · 2,500 streams</small></div><b>${money(selected.price)}</b></div><div class="license" data-price="${selected.price+30}" data-license="Premium"><div><strong>Premium</strong><small>WAV + MP3 · 25,000 streams</small></div><b>${money(selected.price+30)}</b></div><div class="license" data-price="199" data-license="Exclusive"><div><strong>Exclusive</strong><small>WAV + stems · Full ownership</small></div><b>$199.00</b></div></div><div class="detail-actions"><button class="button button-light" id="addToCart">Add to cart ↗</button><button class="button button-dark" id="preview">Preview ▶</button></div></div></div>`;
$$(".license").forEach(x=>x.addEventListener("click",()=>{$$(".license").forEach(y=>y.classList.remove("selected"));x.classList.add("selected")}));
$("#addToCart")?.addEventListener("click",()=>{let l=$(".license.selected");cart.push({...selected,price:Number(l.dataset.price),license:l.dataset.license});save();updateCart();toast(selected.title+" added to cart.");openCart()});
$("#preview")?.addEventListener("click",()=>toast("Preview player ready — replace the demo action with your MP3 URL."));
updateCart();
function adminRender(){let el=$("#adminBeats");if(!el)return;el.innerHTML=beats.map(b=>`<div class="admin-beat"><span>${b.title}</span><span>${money(b.price)}</span></div>`).join("");$("#adminBeatCount").textContent=beats.length}
adminRender();
$("#addBeatBtn")?.addEventListener("click",()=>$("#beatModal").classList.add("open"));
$("#saveBeat")?.addEventListener("click",()=>{let title=$("#newTitle").value.trim()||"Untitled";let genre=$("#newGenre").value;let price=Number($("#newPrice").value)||29.99;beats.push({id:Date.now(),title,genre,bpm:110,price,tag:"NEW"});save();adminRender();$("#beatModal").classList.remove("open");$("#newTitle").value="";toast("Beat published to catalog.");});
