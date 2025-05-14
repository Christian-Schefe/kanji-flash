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

export const rtkKanjiCollection: KanjiCollection = {
  id: 'rtk_kanji',
  name: 'RTK Kanji',
  description: 'The kanji from the RTK book.',
  contains: (kanji: Kanji) => {
    return kanji.r !== null;
  }
};

export const kyouikuKanjiCollection: KanjiCollection = {
  id: 'kyouiku_kanji',
  name: 'Kyouiku Kanji',
  description: 'The 1026 kyouiku kanji.',
  contains: (kanji: Kanji) => {
    return kanji.g !== null && kanji.g > 0 && kanji.g <= 6;
  }
};

export const jouyouKanjiCollection: KanjiCollection = {
  id: 'jouyou_kanji',
  name: 'Jouyou Kanji',
  description: 'The 2136 kyouiku and jouyou kanji.',
  contains: (kanji: Kanji) => {
    return kanji.g !== null && kanji.g <= 8;
  }
};

export const jinmeiyouKanjiCollection: KanjiCollection = {
  id: 'jinmeiyou_kanji',
  name: 'Jinmeiyou Kanji',
  description: 'The 2999 kyouiku, jouyou and jinmeiyou kanji.',
  contains: (kanji: Kanji) => {
    return kanji.g !== null && kanji.g <= 10;
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

export const gradeCollections = [
  kyouikuKanjiCollection,
  jouyouKanjiCollection,
  jinmeiyouKanjiCollection
];

export const jlptCollections = [
  jlptCollection(4, 'N5'),
  jlptCollection(3, 'N4'),
  jlptCollection(2, 'N2 - N3', 'N2_N3'),
  jlptCollection(1, 'N1')
];

export const otherCollections = [allKanjiCollection, properKanjiCollection, rtkKanjiCollection];

export const collections: KanjiCollection[] = [
  ...otherCollections,
  ...gradeCollections,
  ...jlptCollections
];

export const collectionMap: Map<string, KanjiCollection> = new Map(
  collections.map((collection) => [collection.id, collection])
);
