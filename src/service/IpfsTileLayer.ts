import L from 'leaflet'

export const IpfsTileLayer = L.GridLayer.extend({
  createTile: function (coords: any) {
    const tile = document.createElement('div');
    tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
    tile.style.outline = '1px solid red';
    return tile;
  }
});
