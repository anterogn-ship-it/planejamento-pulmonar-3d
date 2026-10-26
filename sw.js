const CACHE='pulmao3d-pwa-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const LIBS=[
'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js',
'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/controls/OrbitControls.js',
'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js',
'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/utils/BufferGeometryUtils.js'
];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(SHELL);await Promise.allSettled(LIBS.map(url=>cache.add(url)));await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('pulmao3d-pwa-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);const isShell=url.origin===self.location.origin;const isLibrary=url.hostname==='cdn.jsdelivr.net'&&url.pathname.startsWith('/npm/three@0.165.0/');if(!isShell&&!isLibrary)return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req);if(cached)return cached;try{const response=await fetch(req);if(response.ok)await cache.put(req,response.clone());return response;}catch(err){if(req.mode==='navigate'){const fallback=await cache.match('./index.html');if(fallback)return fallback;}throw err;}})());});
