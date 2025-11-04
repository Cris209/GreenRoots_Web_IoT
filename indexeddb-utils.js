// Nombre de la base de datos y versión
const DB_NAME = 'GreenRootsDB';
const DB_VERSION = 1; 

// Nombres de los almacenes de objetos (tablas)
export const STORE_EVENTOS = 'eventos';
export const STORE_USUARIOS = 'usuarios'; 

let db;

/**
 * Abre la base de datos de IndexedDB. 
 * Crea los Object Stores (tablas) si no existen o si la versión ha cambiado.
 */
export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject("Error al abrir la base de datos");
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        // Este evento se dispara si se crea la DB o si se cambia la versión
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Crea el Object Store para 'eventos' si no existe
            if (!db.objectStoreNames.contains(STORE_EVENTOS)) {
                db.createObjectStore(STORE_EVENTOS, { keyPath: 'id', autoIncrement: true });
            }
            
            // Crea el Object Store para 'usuarios' si no existe
            if (!db.objectStoreNames.contains(STORE_USUARIOS)) {
                // Asume que el campo 'email' será único y un buen índice
                const userStore = db.createObjectStore(STORE_USUARIOS, { keyPath: 'email' });
                userStore.createIndex('by_rol', 'rol', { unique: false });
            }
        };
    });
}

/**
 * Agrega o actualiza un objeto en un Object Store.
 * @param {string} storeName - Nombre del Object Store.
 * @param {object} item - Objeto a guardar.
 */
export function putItem(storeName, item) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("La base de datos no está abierta.");
            return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item); // 'put' para agregar o actualizar

        request.onsuccess = () => {
            resolve(request.result); // Retorna la key del elemento
        };

        request.onerror = (event) => {
            console.error("Error al guardar item:", event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Obtiene todos los objetos de un Object Store.
 * @param {string} storeName - Nombre del Object Store.
 */
export function getAllItems(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("La base de datos no está abierta.");
            return;
        }

        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            console.error("Error al obtener items:", event.target.error);
            reject(event.target.error);
        };
    });
}