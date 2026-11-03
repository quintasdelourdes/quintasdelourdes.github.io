// Service worker del portal de Quintas de Lourdes (v2.6) · solo para los avisos (Web Push). No guarda páginas en caché.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  const title = d.title || 'Quintas de Lourdes';
  const opts = {
    body: d.body || '',
    icon: d.icon || './icon-192.png',
    badge: d.badge || './icon-192.png',
    tag: d.tag || 'ql-aviso',
    renotify: true,
    data: { url: d.url || './' }
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const destino = new URL((e.notification.data && e.notification.data.url) || './', self.location.href).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
    for (const c of lista) { if ('focus' in c) { c.navigate && c.navigate(destino); return c.focus(); } }
    return self.clients.openWindow(destino);
  }));
});
