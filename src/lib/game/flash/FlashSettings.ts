import { jouyouKanjiCollection } from '$lib/collection.svelte';

export type FlashSettings = {
  collection: string;
  mode: 'kanji' | 'meaning' | 'kanjiAndMeaning';
  review: boolean;
};

export type FlashState = {
  currentIndex: number;
  currentFace: 'kanji' | 'meaning' | 'info';
};

export const defaultFlashSettings: () => FlashSettings = () => ({
  collection: jouyouKanjiCollection.id,
  mode: 'kanjiAndMeaning',
  review: false
});

export const defaultFlashState: () => FlashState = () => ({
  currentIndex: -1,
  currentFace: 'kanji'
});
