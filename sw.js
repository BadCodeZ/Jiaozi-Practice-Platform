// 综合教资备考工作台 · Service Worker（离线缓存）
// 仅缓存单文件应用壳，使「添加到主屏幕」后在无网络时仍可打开。
const CACHE = 'artwb-v23';
const ASSETS = ['./', './app.html', './manifest.webmanifest', './icon.svg'];
const FALLBACK = './app.html';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(ASSETS).catch(function () { /* 任一资源失败也不阻塞安装 */ });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  var isDoc = url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/');
  if (isDoc) {
    // 文档（app.html）网络优先：保证每次在线都拿到最新版本，避免旧缓存挡住更新
    e.respondWith(
      fetch(e.request).then(function (res) {
        if (res && res.ok && url.origin === self.location.origin) {
          var cp = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, cp); });
        }
        return res;
      }).catch(function () {
        return caches.match(e.request).then(function (c) { return c || caches.match(FALLBACK); });
      })
    );
  } else {
    // 静态资源（图标 / manifest）缓存优先，离线可用
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        if (cached) return cached;
        return fetch(e.request).then(function (res) {
          if (res && res.ok && url.origin === self.location.origin) {
            var cp = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, cp); });
          }
          return res;
        }).catch(function () { return caches.match(FALLBACK); });
      })
    );
  }
});
