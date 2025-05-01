import type { Kanji } from '../kanji-data/types';

export interface KanjiCollection {
  id: string;
  name: string;
  description: string;
  contains: (kanji: Kanji) => boolean;
}

export const allKanjiCollection: KanjiCollection = {
  id: 'all_kanji',
  name: 'All Kanji',
  description: 'All kanji in the database.',
  contains: () => true
};

export const properKanjiCollection: KanjiCollection = {
  id: 'proper_kanji',
  name: 'Proper Kanji',
  description: 'All kanji in the database that have an assigned meaning and at least one reading.',
  contains: (kanji: Kanji) => {
    return kanji.m.length > 0 && (kanji.k.length > 0 || kanji.o.length > 0);
  }
};

export const jouyouKanjiCollection: KanjiCollection = {
  id: 'jouyou_kanji',
  name: 'Jouyou Kanji',
  description: 'The 2136 jouyou kanji, as defined by the Japanese government.',
  contains: (kanji: Kanji) => {
    return kanji.g !== null && kanji.g <= 6;
  }
};

const jlptCollection = (grade: number, name: string, id?: string) => ({
  id: `jlpt_${id ?? name}`,
  name: `JLPT ${name}`,
  description: `The kanji from the JLPT ${name} level.`,
  contains: (kanji: Kanji) => {
    return kanji.j === grade;
  }
});

export const collections: KanjiCollection[] = [
  allKanjiCollection,
  properKanjiCollection,
  jouyouKanjiCollection,
  jlptCollection(1, 'N1'),
  jlptCollection(2, 'N2 - N3', 'N2_N3'),
  jlptCollection(3, 'N4'),
  jlptCollection(4, 'N5')
];

export const collectionMap: Map<string, KanjiCollection> = new Map(
  collections.map((collection) => [collection.id, collection])
);
