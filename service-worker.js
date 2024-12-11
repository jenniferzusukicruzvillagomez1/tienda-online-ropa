const CACHE_NAME = 'Tienda_Online_Ropa';
const urlsToCache = [
    '/',
    '/assets/html/agregar_producto.html',
    '/assets/html/bienvenido.html',
    '/assets/html/checkout.html',
    '/assets/html/details.html',
    '/assets/html/index.html',
    '/assets/html/pago.html',
    '/assets/css/estilos.css',
    '/assets/css/estilo-menu.css',
    './manifest.json',
    '/assets/images/fondo1.jpg',
    '/assets/images/fondo1.png',
    '/assets/images/no-photo.jpg',
    '/assets/images/productos/1/1.jpg',
    '/assets/images/tendedero.png',
    '/assets/js/script.js',
    '/assets/bootstrap/css/bootstrap.min.css',
    '/assets/bootstrap/js/bootstrap.min.js',
    'script.js',
    '/assets/bootstrap/js/bootstrap.bundle.min.js'
];

// Evento de instalación: Almacenar archivos en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(error => console.error('Error al abrir o agregar archivos al caché:', error))
    );
});

// Evento de activación: Limpiar cachés antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento de fetch: Proveer respuesta desde caché o red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Si el recurso está en caché, úsalo
                    return cachedResponse;
                }

                // Si no está en caché, intenta obtenerlo de la red
                return fetch(event.request).then(networkResponse => {
                    // Verifica que la respuesta sea válida antes de almacenarla
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                });
            })
            .catch(() => {
                // Si todo falla, muestra un mensaje de error o una página offline genérica
                return caches.match('/assets/html/bienvenido.html');
            })
    );
});