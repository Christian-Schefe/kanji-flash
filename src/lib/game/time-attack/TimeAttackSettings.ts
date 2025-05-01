import { jouyouKanjiCollection } from '$lib/collection.svelte';

export type TimeAttackSettings = {
  collection: string;
  mode: 'meaning' | 'onyomi';
  time: number;
};

export type TimeAttackState = {
  currentIndex: number;
  done: boolean;
  timePlayed: number;
  kanjis: { kanji: string; solved: boolean }[];
  score: number;
};

export const defaultTimeAttackSettings: TimeAttackSettings = {
  collection: jouyouKanjiCollection.id,
  mode: 'meaning',
  time: 60
};

export const defaultTimeAttackState: TimeAttackState = {
  currentIndex: -1,
  done: false,
  timePlayed: 0,
  kanjis: [],
  score: 0
};
