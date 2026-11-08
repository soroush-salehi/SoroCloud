/* SoroCloud · application entry point */
"use strict";

(()=>{const nodes='section,.panel,.stat,.tasks,.file,.window,.person,.hero,canvas'.split(',').flatMap(s=>[...document.querySelectorAll(s)]);const unique=[...new Set(nodes)].filter(n=>!n.closest('.side'));if(!('IntersectionObserver'in window)){unique.forEach(n=>n.classList.add('visible'));return}const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});unique.forEach(n=>{n.classList.add('reveal');io.observe(n)});})();

/* Application module */

let files=[];const $=s=>document.querySelector(s);function size(n){return n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(1)+' MB'}function draw(){let q=$('#search').value.toLowerCase(),shown=files.filter(f=>f.name.toLowerCase().includes(q));$('#count').textContent=files.length+' files';$('#items').innerHTML=shown.length?shown.map(f=>'<article class="file"><div class="fileicon">▧</div><div><b>'+f.name.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</b><small>'+f.type+' · '+size(f.size)+'</small></div><button data-id="'+f.id+'">Remove</button></article>').join(''):'<p class="empty">No matching files.</p>'}$('#files').onchange=e=>{files.push(...[...e.target.files].map((f)=>({id:crypto.randomUUID(),name:f.name,type:f.type||'Unknown type',size:f.size})));draw();e.target.value=''};$('#search').oninput=draw;$('#items').onclick=e=>{if(e.target.dataset.id){files=files.filter(f=>f.id!==e.target.dataset.id);draw()}};draw();
