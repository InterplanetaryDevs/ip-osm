import {IValueStore} from './IValueStore';

export class LocalValueStore implements IValueStore {
  constructor(private prefix = '') {
  }

  get(key: string): string | null {
    return localStorage.getItem(this.prefix + key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(this.prefix + key, value)
  }
}