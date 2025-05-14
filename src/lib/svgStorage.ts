import { deleteDB, openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface SVGData {
  version: string;
  [key: string]: string;
}

const DB_NAME = 'svgStorage';
const DB_VERSION = 4;
const SVG_VERSION = '1.0';

export const noDataSymbol = Symbol('noData');

interface MyDB extends DBSchema {
  svg: {
    key: string;
    value: string;
  };
  meta: {
    value: string;
    key: string;
  };
}

async function upgradeDB(db: IDBPDatabase<MyDB>) {
  if (!db.objectStoreNames.contains('svg')) {
    db.createObjectStore('svg');
  }
  if (!db.objectStoreNames.contains('meta')) {
    db.createObjectStore('meta');
  }
}

async function openMyDB() {
  const db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      upgradeDB(db);
    }
  });
  return db;
}

export async function storeSVGData(jsonData: SVGData): Promise<void> {
  try {
    const db = await openMyDB();

    const batchSize = 100;
    const keys = Object.keys(jsonData).filter((key) => key !== 'version');
    const totalKeys = keys.length;
    let currentIndex = 0;
    while (currentIndex < totalKeys) {
      const batchKeys = keys.slice(currentIndex, currentIndex + batchSize);
      currentIndex += batchSize;

      const tx = db.transaction('svg', 'readwrite');
      const store = tx.objectStore('svg');

      for (const key of batchKeys) {
        if (key === 'version') continue;
        await store.put(jsonData[key], key);
      }

      await tx.done;
    }

    await db.put('meta', jsonData.version, 'version');
  } catch (error) {
    console.error('Error fetching or storing JSON:', error);
  }
}

export async function clearSVGData(): Promise<void> {
  try {
    await deleteDB(DB_NAME);
  } catch (error) {
    console.error('Error clearing SVG data in IndexedDB:', error);
  }
}

export async function hasSVGData(): Promise<boolean> {
  try {
    const db = await openMyDB();
    const tx = db.transaction('meta', 'readonly');
    const store = tx.objectStore('meta');
    const presentVersion = await store.get('version');
    await tx.done;
    return presentVersion === SVG_VERSION;
  } catch (error) {
    console.error('Error checking data in IndexedDB:', error);
    return false;
  }
}

export async function getSVG(key: string): Promise<string | null | typeof noDataSymbol> {
  try {
    const db = await openMyDB();
    const tx = db.transaction(['svg', 'meta'], 'readonly');
    const store = tx.objectStore('svg');
    const metaStore = tx.objectStore('meta');
    const presentVersion = await metaStore.get('version');
    const svgData = (await store.get(key)) ?? null;
    await tx.done;
    return presentVersion === SVG_VERSION ? svgData : noDataSymbol;
  } catch (error) {
    console.error('Error retrieving SVG from IndexedDB:', error);
    return noDataSymbol;
  }
}
