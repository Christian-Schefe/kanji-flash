import { jouyouKanjiCollection } from '$lib/collection.svelte';

export type FlashSettings = {
  collection: string;
  mode: 'kanji' | 'meaning' | 'kanjiAndMeaning';
  review: boolean;
};

export type FlashState = {
  game: {
    currentIndex: number;
    currentFace: 'kanji' | 'meaning' | 'info';
  };
  persistent: {
    badKanjis: {
      [kanji: string]: number;
    };
  };
};

export const defaultFlashSettings: () => FlashSettings = () => ({
  collection: jouyouKanjiCollection.id,
  mode: 'kanjiAndMeaning',
  review: false
});

export const defaultFlashState: () => FlashState = () => ({
  game: {
    currentIndex: -1,
    currentFace: 'kanji'
  },
  persistent: {
    badKanjis: {}
  }
});
