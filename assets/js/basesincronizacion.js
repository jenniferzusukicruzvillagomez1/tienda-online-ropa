window.reload = function () {
  const request = indexedDB.open("Sincronizacion", 4);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("datosPendientes")) {
      const objectStore = db.createObjectStore("datosPendientes", {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex("data", "data", { unique: false });
    }
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    console.log("Almacenes disponibles:", db.objectStoreNames);
  };
  const transaction = db.transaction(['datosPendientes'], 'readwrite');
const store = transaction.objectStore('datosPendientes');

const addRequest = store.add({ data: 'Ejemplo de dato pendiente' });

addRequest.onsuccess = function () {
    console.log('Dato agregado con éxito.');
};

addRequest.onerror = function (event) {
    console.error('Error al agregar dato:', event.target.error);
};

};
