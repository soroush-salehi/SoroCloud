"use strict";
const $ = selector => document.querySelector(selector);
const DB_NAME = "sorocloud-local";
const STORE = "files";
let database;
let records = [];
const id = () => crypto.randomUUID?.() || String(Date.now() + Math.random());
function openDatabase() {
  return new Promise((resolve,reject) => {
    const request = indexedDB.open(DB_NAME,1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE,{keyPath:"id"});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function transact(mode, action) {
  return new Promise((resolve,reject) => {
    const tx = database.transaction(STORE,mode), store = tx.objectStore(STORE);
    const request = action(store);
    if (request) { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }
    else { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); }
  });
}
function safeName(name) { return String(name).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
function readableSize(bytes) { return bytes < 1024 ? bytes+" B" : bytes < 1048576 ? (bytes/1024).toFixed(1)+" KB" : (bytes/1048576).toFixed(1)+" MB"; }
function render() {
  const query = $("#search").value.trim().toLowerCase();
  const visible = records.filter(file => file.name.toLowerCase().includes(query));
  $("#count").textContent = records.length + " files · " + readableSize(records.reduce((sum,file)=>sum+file.size,0));
  const host = $("#items"); host.replaceChildren();
  if (!visible.length) { const empty=document.createElement("p"); empty.className="empty"; empty.textContent=query?"No matching files.":"No files yet. Choose files to add them to this browser."; host.append(empty); return; }
  visible.forEach(file => {
    const item=document.createElement("article"); item.className="file";
    const icon=document.createElement("div"); icon.className="fileicon"; icon.textContent="▧";
    const details=document.createElement("div"); const name=document.createElement("b"); name.textContent=file.name;
    const meta=document.createElement("small"); meta.textContent=(file.type||"Unknown type")+" · "+readableSize(file.size);
    details.append(name,meta);
    const preview=document.createElement("button"); preview.type="button"; preview.textContent="Preview"; preview.dataset.preview=file.id;
    const download=document.createElement("button"); download.type="button"; download.textContent="Download"; download.dataset.download=file.id;
    const remove=document.createElement("button"); remove.type="button"; remove.textContent="Remove"; remove.dataset.remove=file.id;
    item.append(icon,details,preview,download,remove); host.append(item);
  });
}
async function refresh() { records = await transact("readonly",store=>store.getAll()); records.sort((a,b)=>b.addedAt-a.addedAt); render(); }
$("#files").addEventListener("change", async event => {
  const chosen=[...event.target.files];
  try {
    for (const file of chosen) await transact("readwrite",store=>store.put({id:id(),name:file.name,type:file.type,size:file.size,blob:file,addedAt:Date.now()}));
    await refresh();
  } catch(error) { alert("Could not save these files in browser storage: "+error.message); }
  event.target.value="";
});
$("#search").addEventListener("input",render);
$("#items").addEventListener("click",async event=>{
  const button=event.target.closest("button"); if(!button)return;
  const file=records.find(item=>item.id===button.dataset.preview||item.id===button.dataset.download||item.id===button.dataset.remove);
  if(!file)return;
  if(button.dataset.remove) { await transact("readwrite",store=>store.delete(file.id)); await refresh(); return; }
  const url=URL.createObjectURL(file.blob);
  if(button.dataset.download) { const link=document.createElement("a");link.href=url;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return; }
  const modal=document.createElement("dialog");modal.className="cloud-preview";
  const heading=document.createElement("h3");heading.textContent=file.name;
  const close=document.createElement("button");close.textContent="Close";close.addEventListener("click",()=>{modal.close();modal.remove();URL.revokeObjectURL(url);});
  modal.append(heading,close);
  if(file.type.startsWith("image/")) { const image=document.createElement("img");image.src=url;image.alt=file.name;image.style.maxWidth="min(80vw,900px)";image.style.maxHeight="65vh";modal.append(image); }
  else { const note=document.createElement("p");note.textContent="Preview is available for image files. Download this file to open it with a suitable application.";modal.append(note); }
  document.body.append(modal);modal.showModal();
});
(async()=>{try{database=await openDatabase();await refresh();}catch(error){$("#count").textContent="Browser storage is unavailable: "+error.message;}})();