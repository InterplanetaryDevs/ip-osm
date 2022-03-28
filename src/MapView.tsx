import {FC, useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {DebugTileLayer} from './service/DebugTileLayer';
import {useIpfs} from './service/IpfsContext';
import {IpfsTileService} from './service/IpfsTileService';

export const MapView: FC = (props) => {
  const [map, setMap] = useState<any>();

  const mapRef = useRef<HTMLDivElement>(null);
  const ipfs = useIpfs();

  useEffect(() => {
    if (mapRef.current !== null && map === undefined) {
      const map = new L.Map(mapRef.current, {
        center: [51.505, -0.09],
        zoom: 13
      });

      // new IpfsTileLayer().addTo(map);

      new IpfsTileService(ipfs).createLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png').then(layer => layer.addTo(map));
      // new DebugTileLayer().addTo(map);
      setMap(map);
    }
  }, [ipfs, map, mapRef]);

  return <div ref={mapRef} style={{
    height: 600
  }}/>;
};