import { allKanjiCollection } from '$lib/collection.svelte';

export type FlashSettings = {
  collection: string;
};

export const defaultFlashSettings: FlashSettings = {
  collection: allKanjiCollection.id
};
