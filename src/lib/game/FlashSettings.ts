import { allKanjiCollection } from '$lib/collection.svelte';

export type FlashSettings = {
  collection: string;
  mode: 'kanji' | 'meaning' | 'kanjiAndMeaning';
  review: boolean;
};

export type FlashState = {
  currentIndex: number;
  currentState: 'kanji' | 'meaning' | 'info';
};

export const defaultFlashSettings: FlashSettings = {
  collection: allKanjiCollection.id,
  mode: 'kanjiAndMeaning',
  review: false
};

export const defaultFlashState: FlashState = {
  currentIndex: -1,
  currentState: 'kanji'
};
