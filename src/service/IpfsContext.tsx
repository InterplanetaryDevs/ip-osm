import {createContext, FC, useContext, useEffect, useState} from 'react';
import {create, IPFS} from 'ipfs-core';
import {CircularProgress} from '@mui/material';
import {useSnackbar} from 'notistack';

const IpfsContext = createContext({} as IPFS);

export const IpfsContextProvider: FC = (props) => {
  const [node, setNode] = useState<IPFS>();
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    (node ? node.stop() : Promise.resolve())
      .then(() =>
        create({
          /*libp2p: {
            modules: {
              transport: [
                WebSockets
              ],
              streamMuxer: [new Mplex()],
              connEncryption: [new Noise()],
              peerDiscovery: [WebRtcStar],
              dht: KadDHT,
              pubsub: GossipSub
            },
          },*/
          config: {
            Addresses: {
              Swarm: [
                '/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
                '/dns6/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star'
              ]
            },
          }
        }))
      .then((node) => setNode(node))
      .catch(e => {
        console.error(e);
        enqueueSnackbar('failed to start IPFS: ' + e.toString());
      });
  }, []);

  if (!node) {
    return <>
      <p>Loading</p>
      <CircularProgress/>
    </>;
  }

  return <IpfsContext.Provider
    value={node}
  >
    {props.children}
  </IpfsContext.Provider>;
};

export const useIpfs = () => useContext(IpfsContext);

//https://blog.ipfs.io/2021-06-10-guide-to-ipfs-connectivity-in-browsers/