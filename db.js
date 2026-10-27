const DB_NAME = "Polestar4DB";
const STORE_NAME = "charges";

function openDB() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = function (event) {

            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {

                db.createObjectStore(
                    STORE_NAME,
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };

    });
}
