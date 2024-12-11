if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('sync-datos');
    }).catch(error => {
        console.error('Error al registrar la sincronización:', error);
    });
}