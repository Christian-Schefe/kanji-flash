import type { Kanji } from '../kanjidic2/types';

export interface KanjiCollection {
  id: string;
  name: string;
  contains: (kanji: Kanji) => boolean;
}

export const collections: KanjiCollection[] = [
  {
    id: 'all_kanji',
    name: 'All Kanji',
    contains: () => true
  },
  {
    id: 'jouyou_kanji',
    name: 'Jouyou Kanji',
    contains: (kanji: Kanji) => {
      return kanji.grade !== null && kanji.grade <= 6;
    }
  }
];

export const collectionMap: Record<string, KanjiCollection> = Object.fromEntries(
  collections.map((collection) => [collection.id, collection])
);
