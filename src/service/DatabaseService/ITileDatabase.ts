import {CID} from 'ipfs-core/types/test/utils/mock-preload-node-utils';
import {StoredTile} from './DatabaseService';

export interface ITileDatabase {
  insertTile(cid: CID, x: number, y: number, z: number): Promise<void>;

  findTile(x: number, y: number, z: number): Promise<StoredTile>;
}