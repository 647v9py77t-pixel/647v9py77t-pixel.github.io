// Service worker do Transpositor: internet primeiro (sempre a versão nova); cópia guardada só sem rede.
const CACHE = 'transpositor';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  const chave = u.origin + u.pathname;   // ignora ?v=… para a cópia offline
  e.respondWith(
    fetch(r.url, { cache: 'no-store' })
      .then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(chave, c)); } return res; })
      .catch(() => caches.match(chave).then(c => c || caches.match(u.origin + '/transpositor.html')))
  );
});
