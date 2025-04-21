/**
 * Service Worker متقدم لتحسين أداء الموقع
 * المهام:
 * - تخزين الموارد الأساسية عند التثبيت
 * - تقديم الموارد المخزنة عند الطلب
 * - تحديث الذاكرة المؤقتة عند تغيير الملفات
 * - تقديم صفحة بديلة عند عدم الاتصال بالإنترنت
 */

// إصدار الذاكرة المؤقتة (يجب تغييره عند تحديث الملفات)
const CACHE_VERSION = 'v2.3';
const CACHE_NAME = `${CACHE_VERSION}-site-cache`;
const OFFLINE_PAGE = '/offline.html';

// الموارد التي يجب تخزينها عند التثبيت
const PRE_CACHE_ASSETS = [
  '/',
  'المطور.jpg',
  OFFLINE_PAGE,
  '/css/main.min.css',
  'index.html',
  'exams.json',
  'style.css',
  'script.js'
];

// استراتيجيات التخزين المؤقت
const CACHE_STRATEGIES = {
  // الموارد التي يجب أن تأتي من الشبكة أولا مع السقوط للذاكرة المؤقتة
  NETWORK_FIRST: [
    '/api/',
    '/dynamic-content/'
  ],
  
  // الموارد التي يجب أن تأتي من الذاكرة المؤقتة أولا مع السقوط للشبكة
  CACHE_FIRST: [
    '/css/',
    '/js/',
    '/images/',
    '/fonts/'
  ],
  
  // الموارد التي يجب أن تأتي من الذاكرة المؤقتة فقط
  CACHE_ONLY: [
    OFFLINE_PAGE,
    '/static-assets/'
  ],
  
  // الموارد التي يجب أن تأتي من الشبكة فقط
  NETWORK_ONLY: [
    '/admin/',
    '/real-time/'
  ]
};

// ===== مرحلة التثبيت =====
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  // تأخير event.waitUntil حتى اكتمال التخزين المؤقت
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching essential assets');
        return cache.addAll(PRE_CACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting to activate');
        return self.skipWaiting();
      })
  );
});

// ===== مرحلة التنشيط =====
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // حذف الذواكر المؤقتة القديمة
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// ===== مرحلة الاستجابة للطلبات =====
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // تجاهل الطلبات غير HTTP/HTTPS (مثل chrome-extension:)
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // تحديد الاستراتيجية بناء على مسار الطلب
  let strategy = 'NETWORK_FIRST'; // الاستراتيجية الافتراضية
  
  for (const [strategyType, paths] of Object.entries(CACHE_STRATEGIES)) {
    if (paths.some(path => url.pathname.startsWith(path))) {
      strategy = strategyType;
      break;
    }
  }
  
  console.log(`[Service Worker] Fetching: ${url.pathname} with ${strategy} strategy`);
  
  // تطبيق الاستراتيجية المحددة
  switch (strategy) {
    case 'NETWORK_FIRST':
      event.respondWith(networkFirstStrategy(request));
      break;
      
    case 'CACHE_FIRST':
      event.respondWith(cacheFirstStrategy(request));
      break;
      
    case 'CACHE_ONLY':
      event.respondWith(cacheOnlyStrategy(request));
      break;
      
    case 'NETWORK_ONLY':
      event.respondWith(networkOnlyStrategy(request));
      break;
      
    default:
      event.respondWith(fetch(request));
  }
});

// ===== استراتيجيات التخزين المؤقت =====

// 1. الشبكة أولا مع السقوط للذاكرة المؤقتة
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // تحديث الذاكرة المؤقتة بالاستجابة الجديدة
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // السقوط للذاكرة المؤقتة عند فشل الشبكة
    const cachedResponse = await caches.match(request);
    return cachedResponse || fallbackResponse(request);
  }
}

// 2. الذاكرة المؤقتة أولا مع السقوط للشبكة
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // تحديث الذاكرة المؤقتة في الخلفية
    fetchAndCache(request);
    return cachedResponse;
  }
  
  // جلب من الشبكة عند عدم وجود في الذاكرة
  try {
    return await fetchAndCache(request);
  } catch (error) {
    return fallbackResponse(request);
  }
}

// 3. الذاكرة المؤقتة فقط
async function cacheOnlyStrategy(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fallbackResponse(request);
}

// 4. الشبكة فقط
async function networkOnlyStrategy(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return fallbackResponse(request);
  }
}

// ===== دوال مساعدة =====

// جلب من الشبكة وتخزين في الذاكرة المؤقتة
async function fetchAndCache(request) {
  const networkResponse = await fetch(request);
  
  // لا نخزن الاستجابات غير الناجحة أو الاستجابات غير الأساسية
  if (networkResponse.ok && networkResponse.type === 'basic') {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// استجابة بديلة عند الفشل
async function fallbackResponse(request) {
  // إذا كان طلب صفحة HTML، عرض صفحة عدم الاتصال
  if (request.headers.get('accept').includes('text/html')) {
    const cachedOfflinePage = await caches.match(OFFLINE_PAGE);
    return cachedOfflinePage || Response.redirect(OFFLINE_PAGE);
  }
  
  // استجابة بديلة للطلبات الأخرى
  return new Response('Offline content not available', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({ 'Content-Type': 'text/plain' })
  });
}

// ===== تحديثات الخلفية =====
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ===== مزامنة الخلفية =====
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[Service Worker] Background sync');
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // هنا يمكنك تنفيذ مهام المزامنة
}