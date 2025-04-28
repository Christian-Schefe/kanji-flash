import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';

export class LocalStore<T> {
  value = $state<T>() as T;
  defaultValue: T;
  key = '';
  checkQuery: 'none' | 'read' | 'sync' = 'none';
  isMounted = false;

  constructor(key: string, value: T, checkQuery: 'none' | 'read' | 'sync', mount = true) {
    this.key = key;
    this.value = value;
    this.defaultValue = value;
    this.checkQuery = checkQuery;

    let hasQueryValue = false;
    if (this.checkQuery !== 'none' && page.url.searchParams.has(this.key)) {
      const queryItem = page.url.searchParams.get(this.key);
      const deserializedValue = queryItem !== null ? this.tryDeserializeFromURL(queryItem) : null;
      if (deserializedValue !== null) {
        this.value = deserializedValue;
        hasQueryValue = true;
      }
    }

    if (browser && !hasQueryValue) {
      const item = localStorage.getItem(this.key);
      if (item) {
        const deserializedValue = this.tryDeserialize(item);
        if (deserializedValue) {
          this.value = deserializedValue;
        }
      }
    }

    if (mount) {
      this.mount();
    }
  }

  mount() {
    if (this.isMounted) return;
    this.isMounted = true;

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

  reset() {
    this.value = this.defaultValue;
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
