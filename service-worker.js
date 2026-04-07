//✅ 功能說明：
//第一次開啟時 → 把檔案存到手機
//之後沒網路 → 自動用快取

const CACHE_NAME = "it-english-v1";
const FILES_TO_CACHE = [
  "./vocab_mobile.html",
  "./manifest.json"
];

// 安裝時把檔案存進快取
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 啟用時清理舊快取
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 攔截請求：沒網路就用快取
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});