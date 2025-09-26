const CACHE_NAME = 'cropguard-ai-v1';
const urlsToCache = [
  '/',
  '/App.tsx',
  '/components/DiseaseDetector.tsx',
  '/components/WeatherAlert.tsx',
  '/components/CommunityForum.tsx',
  '/components/PreventionCalendar.tsx',
  '/components/GovernmentSchemes.tsx',
  '/components/UserProfile.tsx',
  '/utils/translations.js',
  '/utils/diseaseDatabase.js',
  '/styles/globals.css'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline disease detection results
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync-disease-results') {
    event.waitUntil(syncDiseaseResults());
  }
});

async function syncDiseaseResults() {
  try {
    // Get stored offline results
    const offlineResults = JSON.parse(localStorage.getItem('offline_disease_results') || '[]');
    
    if (offlineResults.length > 0) {
      // Sync with server when online
      for (const result of offlineResults) {
        await fetch('/api/sync-disease-result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result)
        });
      }
      
      // Clear offline storage after successful sync
      localStorage.removeItem('offline_disease_results');
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Push notifications for weather alerts
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Weather alert for your crops',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CropGuard AI Alert', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app to weather section
    event.waitUntil(
      clients.openWindow('/?tab=weather')
    );
  }
});