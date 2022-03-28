import {IPFS} from 'ipfs-core';
import {ITileDatabase} from './DatabaseService/ITileDatabase';
import {concat as uint8ArrayConcat} from 'uint8arrays/concat';

export class IpfsTileStorage {
  constructor(private store: ITileDatabase, private ipfs: IPFS, private upstreamUrl: string, private maxAge = 604800000) {
  }

  getFromCache(x: number, y: number, z: number): Promise<Blob> {
    return this.store.findTile(x, y, z)
      .then(async (tile) => {
        if (tile.updated + this.maxAge < Date.now()) return Promise.reject('outdated tile');

        const chunks = [];
        for await (const chunk of this.ipfs.cat(tile.cid)) {
          chunks.push(chunk);
        }

        return new Blob([uint8ArrayConcat(chunks)]);
      });
  }

  saveToCache(data: Blob, x: number, y: number, z: number): Promise<Blob> {
    return this.ipfs.add({
      content: data,
      mtime: new Date(Date.now())
    }, {
      pin: false, //TODO: is this what we want?
    })
      .then(res => this.store.insertTile(res.cid, x, y, z))
      .then(() => data);
  }

  loadFresh(x: number, y: number, z: number): Promise<Blob> {
    return fetch(this.upstreamUrl.replaceAll('{x}', x.toString())
      .replaceAll('{y}', y.toString())
      .replaceAll('{z}', z.toString()))
      .then(r => r.blob());
  }

  fetch(x: number, y: number, z: number) {
    return this.getFromCache(x, y, z)
      .catch((e) => {
        console.log('failed to get from cache:', e)
        return this.loadFresh(x, y, z)
          .then(r => this.saveToCache(r, x, y, z));
      });
  }
}