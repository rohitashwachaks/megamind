/**
 * IndexedDB wrapper for offline data storage (Phase 2)
 * Allows the app to work offline and sync when back online.
 */

const DB_NAME = "PocketSchoolDB";
const DB_VERSION = 1;
const STORES = {
  USER: "user",
  COURSES: "courses",
  PENDING_CHANGES: "pendingChanges",
};

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize the IndexedDB database.
 */
export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.USER)) {
        db.createObjectStore(STORES.USER, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORES.COURSES)) {
        const coursesStore = db.createObjectStore(STORES.COURSES, { keyPath: "id" });
        coursesStore.createIndex("status", "status", { unique: false });
        coursesStore.createIndex("updatedAt", "updatedAt", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PENDING_CHANGES)) {
        const changesStore = db.createObjectStore(STORES.PENDING_CHANGES, {
          keyPath: "id",
          autoIncrement: true,
        });
        changesStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

/**
 * Save user data to IndexedDB.
 */
export async function saveUser(userData: any): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.USER], "readwrite");
    const store = transaction.objectStore(STORES.USER);
    const request = store.put(userData);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get user data from IndexedDB.
 */
export async function getUser(userId: string): Promise<any | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.USER], "readonly");
    const store = transaction.objectStore(STORES.USER);
    const request = store.get(userId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save courses to IndexedDB.
 */
export async function saveCourses(courses: any[]): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.COURSES], "readwrite");
    const store = transaction.objectStore(STORES.COURSES);

    // Clear existing courses and add new ones
    store.clear();
    courses.forEach((course) => store.put(course));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Get all courses from IndexedDB.
 */
export async function getCourses(): Promise<any[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.COURSES], "readonly");
    const store = transaction.objectStore(STORES.COURSES);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a single course to IndexedDB.
 */
export async function saveCourse(course: any): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.COURSES], "readwrite");
    const store = transaction.objectStore(STORES.COURSES);
    const request = store.put(course);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a course from IndexedDB.
 */
export async function deleteCourse(courseId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.COURSES], "readwrite");
    const store = transaction.objectStore(STORES.COURSES);
    const request = store.delete(courseId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Queue a pending change to sync later.
 */
export async function queuePendingChange(change: {
  type: "CREATE" | "UPDATE" | "DELETE";
  entity: "course" | "lecture" | "assignment";
  data: any;
}): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PENDING_CHANGES], "readwrite");
    const store = transaction.objectStore(STORES.PENDING_CHANGES);
    const request = store.add({
      ...change,
      timestamp: Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all pending changes.
 */
export async function getPendingChanges(): Promise<any[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PENDING_CHANGES], "readonly");
    const store = transaction.objectStore(STORES.PENDING_CHANGES);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all pending changes (after successful sync).
 */
export async function clearPendingChanges(): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PENDING_CHANGES], "readwrite");
    const store = transaction.objectStore(STORES.PENDING_CHANGES);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all data (for logout).
 */
export async function clearAllData(): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [STORES.USER, STORES.COURSES, STORES.PENDING_CHANGES],
      "readwrite"
    );

    transaction.objectStore(STORES.USER).clear();
    transaction.objectStore(STORES.COURSES).clear();
    transaction.objectStore(STORES.PENDING_CHANGES).clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Check if we're online.
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events.
 */
export function setupConnectivityListener(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}
