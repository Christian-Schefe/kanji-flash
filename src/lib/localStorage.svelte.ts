import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';

export class LocalStore<T> {
  value = $state<T>() as T;
  key = '';
  checkQuery: 'none' | 'read' | 'sync' = 'none';

  constructor(key: string, value: T, checkQuery: 'none' | 'read' | 'sync') {
    this.key = key;
    this.value = value;
    this.checkQuery = checkQuery;

    let queryItem = checkQuery != 'none' ? page.url.searchParams.get(this.key) : null;
    if (queryItem) {
      const deserializedValue = this.tryDeserializeFromURL(queryItem);
      if (deserializedValue) this.value = deserializedValue;
    }

    if (browser && !queryItem) {
      const item = localStorage.getItem(key);
      if (item) {
        const deserializedValue = this.tryDeserialize(item);
        if (deserializedValue) {
          this.value = deserializedValue;
        }
      }
    }

    $effect(() => {
      localStorage.setItem(this.key, this.serialize(this.value));
      if (this.checkQuery === 'sync') {
        this.syncURL();
      }
    });
  }

  serialize(value: T): string {
    return JSON.stringify(value);
  }

  syncURL() {
    if (this.checkQuery !== 'none') {
      const prev = page.url.searchParams.get(this.key);
      const cur = this.serializeToURL(this.value);
      if (prev === cur) return;
      page.url.searchParams.set(this.key, cur);
      goto(page.url);
    }
  }

  tryDeserialize(item: string): T | null {
    try {
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  }

  serializeToURL(value: T): string {
    if (typeof value === 'string') {
      return encodeURIComponent(value);
    }
    return encodeURIComponent(JSON.stringify(value));
  }

  tryDeserializeFromURL(item: string): T | null {
    try {
      const decoded = decodeURIComponent(item);
      if (typeof this.value === 'string') {
        return decoded as T;
      }
      const val = JSON.parse(decoded);
      if (typeof val !== typeof this.value) {
        return null;
      }
      return val;
    } catch (e) {
      return null;
    }
  }
}

export function localStore<T>(
  key: string,
  value: T,
  checkQuery: 'none' | 'read' | 'sync' = 'none'
) {
  return new LocalStore(key, value, checkQuery);
}
