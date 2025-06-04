import type { Kanji } from '../kanji-data/types';
import { jinmeiyouKanjiCollection } from './collection.svelte';
import { stateData } from './settings.svelte';
class RandomGenerator {
  private seed: number;

  constructor(date: Date) {
    this.seed = this.dateToSeed(date);
  }

  public getSeed(): number {
    return this.seed;
  }

  private dateToSeed(date: Date): number {
    // Use only the date components to generate a seed
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();

    // Combine year, month, and day into a single number
    return year * 10000 + month * 100 + day;
  }

  private random(): number {
    // Simple linear congruential generator (LCG)
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  public randomInt(min: number, max: number): number {
    // Generate a random integer between min and max
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  public shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export type KanjisOfTheDay = {
  seed: number;
  kanjis: string[];
};

const kanjisOfTheDayCache: Map<number, KanjisOfTheDay> = new Map();

export function getKanjisOfTheDay(kanjis: Kanji[]): KanjisOfTheDay {
  const today = new Date();
  const generator = new RandomGenerator(today);
  const cachedVal = kanjisOfTheDayCache.get(generator.getSeed());
  if (cachedVal) {
    return cachedVal;
  }
  const val = computeKanjisOfTheDay(kanjis);
  kanjisOfTheDayCache.set(generator.getSeed(), val);
  return val;
}

export function computeKanjisOfTheDay(kanjis: Kanji[]): KanjisOfTheDay {
  const count = 10;
  const today = new Date();
  const generator = new RandomGenerator(today);
  const selectedKanjis = [];
  const usedIndices = new Set<number>();
  let attempts = 0;
  const jinmeiyouKanji = kanjis.filter((kanji) => jinmeiyouKanjiCollection.contains(kanjis, kanji));
  while (selectedKanjis.length < count) {
    const index = generator.randomInt(0, jinmeiyouKanji.length - 1);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      selectedKanjis.push(jinmeiyouKanji[index].l);
    }
    attempts++;
    if (attempts > 1000) {
      break;
    }
  }
  return {
    seed: generator.getSeed(),
    kanjis: selectedKanjis
  };
}
