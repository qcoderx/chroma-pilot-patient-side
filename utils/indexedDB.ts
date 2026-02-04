// IndexedDB utility for persisting onboarding state
// Allows users to resume at the same question if browser is closed

const DB_NAME = 'chromapilot_db';
const DB_VERSION = 1;
const STORE_NAME = 'onboarding_state';

export interface OnboardingState {
  currentIndex: number;
  answers: Record<number, any>;
  xpEarned: number;
  lastUpdated: number;
  userId?: string;
}

// Initialize the database
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('lastUpdated', 'lastUpdated', { unique: false });
      }
    };
  });
};

// Save onboarding state
export const saveOnboardingState = async (state: OnboardingState): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const dataToSave = {
      id: 'current_session',
      ...state,
      lastUpdated: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(dataToSave);

      request.onsuccess = () => {
        console.log('✅ Onboarding state saved at question', state.currentIndex + 1);
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving state:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to save onboarding state:', error);
  }
};

// Load onboarding state
export const loadOnboardingState = async (): Promise<OnboardingState | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get('current_session');

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          console.log('📂 Loaded saved state at question', result.currentIndex + 1);
          resolve({
            currentIndex: result.currentIndex,
            answers: result.answers,
            xpEarned: result.xpEarned,
            lastUpdated: result.lastUpdated,
            userId: result.userId,
          });
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('Error loading state:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to load onboarding state:', error);
    return null;
  }
};

// Clear onboarding state (called when completing onboarding)
export const clearOnboardingState = async (): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete('current_session');

      request.onsuccess = () => {
        console.log('🗑️ Onboarding state cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('Error clearing state:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Failed to clear onboarding state:', error);
  }
};

// Check if there's a saved session
export const hasSavedSession = async (): Promise<boolean> => {
  const state = await loadOnboardingState();
  return state !== null && state.currentIndex > 0;
};

// Get session age in milliseconds
export const getSessionAge = async (): Promise<number | null> => {
  const state = await loadOnboardingState();
  if (state && state.lastUpdated) {
    return Date.now() - state.lastUpdated;
  }
  return null;
};
