import {CID} from 'ipfs-core/types/test/utils/mock-preload-node-utils';
import {ITileDatabase} from './ITileDatabase';

export class DatabaseService implements ITileDatabase {
  //https://javascript.info/indexeddb
  constructor(private name: string, private version = 1) {
  }

  start() {
    return new Promise<void>(((resolve, reject) => {
      let openRequest = indexedDB.open(this.name, this.version);

      openRequest.onsuccess = () => {
        let db = openRequest.result;

        db.onversionchange = function () {
          db.close();
          alert('Database is outdated, please reload the page.');
        };

        this.db = db;
        resolve();
      };

      openRequest.onupgradeneeded = () => {
        let db = openRequest.result;
        if (!db.objectStoreNames.contains('tiles')) {
          db.createObjectStore('tiles', {keyPath: 'id'});
        }
      };

      openRequest.onerror = (e) => reject(e);
      openRequest.onblocked = () => {
        // this event shouldn't trigger if we handle onversionchange correctly

        // it means that there's another open connection to the same database
        // and it wasn't closed after db.onversionchange triggered for it
        reject('db is blocked');
      };
    }));
  }

  insertTile(cid: CID, x: number, y: number, z: number) {
    const newTile: StoredTile = {
      x, y, z,
      cid: cid.toV0().toString(),
      id: this.getId(x, y, z),
      updated: Date.now()
    };
    return new Promise<void>(((resolve, reject) => {
      if (!this.db) return Promise.reject('db is not running');
      const transaction = this.db.transaction('tiles', 'readwrite');
      const tiles = transaction.objectStore('tiles');

      const tile = tiles.put(newTile);

      tile.onerror = () => reject(tile.error);
      tile.onsuccess = () => resolve();
    }));
  }

  findTile(x: number, y: number, z: number): Promise<StoredTile> {
    return new Promise(((resolve, reject) => {
      if (!this.db) return Promise.reject('db is not running');
      const transaction = this.db.transaction('tiles');
      const tiles = transaction.objectStore('tiles');

      const tile = tiles.get(this.getId(x, y, z));

      tile.onerror = () => reject(tile.error);
      tile.onsuccess = () => tile.result ? resolve(tile.result) : reject('notfound');
    }));
  }

  private getId(x: number, y: number, z: number): string {
    return '{z}-{x}-{y}'
      .replaceAll('{x}', x.toString())
      .replaceAll('{y}', y.toString())
      .replaceAll('{z}', z.toString());
  }

  private db?: IDBDatabase;
}

export type StoredTile = {
  id: string,
  x?: number,
  y?: number,
  z?: number,
  updated: number,
  cid: string,
}