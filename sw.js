const CACHE='nuna-quiz-v3-80q-20261023-photo10-release2';
const CORE=['./','./index.html','./game-data.js','./manifest.webmanifest','./icon.png','./icon-512.png'];
const PHOTOS=Array.from({length:10},(_,i)=>'./photos/memory'+String(i+1).padStart(2,'0')+'.jpg');
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(CORE);await Promise.allSettled(PHOTOS.map(url=>cache.add(url)));await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('nuna-quiz-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('message',event=>{if(event.data!=='CACHE_PHOTOS')return;event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.allSettled(PHOTOS.map(async url=>{const response=await fetch(url,{cache:'no-store'});if(response.ok)await cache.put(url,response)}))})())});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
if(url.pathname.includes('/photos/')){event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(event.request);if(response.ok){await cache.put(event.request,response.clone());return response}}catch(e){}return (await cache.match(event.request))||Response.error()})());return}
event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)))});
