
const CACHE_NAME = 'Tienda_Online-v2';
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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }

            return fetch(event.request, { redirect: 'follow' })
                .then(response => {
                    // Asegúrate de que la respuesta sea válida antes de almacenarla
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clona y almacena en caché
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                })
                .catch(error => {
                    console.error('Error al manejar la solicitud:', error);
                    return new Response('Error de red o recurso no disponible.', {
                        status: 500,
                        statusText: 'Fetch error'
                    });
                });
        })
    );
});

// Manejar operaciones de IndexedDB
self.addEventListener('sync', event => {
    if (event.tag === 'sync-datos') {
        event.waitUntil(syncDatos());
    }
});

function syncDatos() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('miBaseDeDatos', 1);

        request.onsuccess = event => {
            const db = event.target.result;
            const transaction = db.transaction(['datosPendientes'], 'readwrite');
            const store = transaction.objectStore('datosPendientes');

            store.getAll().onsuccess = event => {
                const datosPendientes = event.target.result;

                datosPendientes.forEach(dato => {
                    fetch('/api/endpoint', {
                        method: 'POST',
                        body: JSON.stringify(dato),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        if (response.ok) {
                            store.delete(dato.id);
                        }
                    }).catch(error => {
                        console.error('Error al sincronizar datos:', error);
                    });
                });

                resolve();
            };

            store.getAll().onerror = event => {
                reject(event.target.error);
            };
        };

        request.onerror = event => {
            reject(event.target.error);
        };
    });
}
