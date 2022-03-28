import L from 'leaflet';
import {IPFS} from 'ipfs-core';
import {IpfsTileStorage} from './IpfsTileStorage';
import {DatabaseService} from './DatabaseService/DatabaseService';

export class IpfsTileService {
  constructor(private ipfs: IPFS) {
  }

  createLayer(url: string) {
    const db = new DatabaseService(url);
    return db.start()
      .then(() => {
        const tileStore = new IpfsTileStorage(db, this.ipfs, url);

        const layer = L.GridLayer.extend({
          createTile: function (coords: any, done: any) {
            const tile = document.createElement('div');
            const coordString = [coords.x, coords.y, coords.z].join(', ');
            tile.innerHTML = coordString + ' fetching';
            tile.style.outline = '1px solid lime';

            tileStore.fetch(coords.x, coords.y, coords.z)
              .then(blob => new Promise<string>((resolve) => {
                const a = new FileReader();
                a.onload = function (e) { // @ts-ignore
                  resolve(e.target!.result);
                };
                a.readAsDataURL(blob);
              }))
              .then(dataUrl => {
                tile.style.backgroundImage = 'url(\'' + dataUrl + '\')';
                tile.innerHTML = '';
                tile.style.outline = '';
                done(null, tile);
              })
              .catch(e => {
                console.error(e);
                done(e, tile);
              });

            return tile;
          }
        });
        return new layer();
      });
  }
}