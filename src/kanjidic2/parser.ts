import { XMLParser } from 'fast-xml-parser';
import type { Kanji } from './types';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  preserveOrder: false,
  parseTagValue: false,
  parseAttributeValue: false,
  isArray: (_, jpath) => {
    return [
      'kanjidic2.character',
      'character.misc.stroke_count',
      'rmgroup.reading',
      'rmgroup.meaning'
    ].includes(jpath);
  }
});

// Type guard helpers
const asArray = <T>(x: T | T[] | undefined): T[] => {
  if (x === undefined) return [];
  return Array.isArray(x) ? x : [x];
};

const extractKanji = (char: any): Kanji => {
  const misc = char.misc || {};
  const readingMeaning = char.reading_meaning || {};
  const rmgroup = asArray(readingMeaning.rmgroup)[0] || {}; // Only first rmgroup usually matters
  const readings = asArray(rmgroup.reading);
  const meanings = asArray(rmgroup.meaning);

  return {
    literal: char.literal,
    strokes: parseInt(asArray(misc.stroke_count)[0]) || 0,
    frequency: misc.freq !== undefined ? parseInt(misc.freq) : null,
    jlpt: misc.jlpt !== undefined ? parseInt(misc.jlpt) : null,
    grade: misc.grade !== undefined ? parseInt(misc.grade) : null,
    meanings: meanings
      .filter((m: any) => !m.m_lang || m.m_lang === 'en')
      .map((m: any) => m['#text'] || m),
    kunReadings: readings
      .filter((r: any) => r.r_type === 'ja_kun')
      .map((r: any) => r['#text'] || r),
    onReadings: readings.filter((r: any) => r.r_type === 'ja_on').map((r: any) => r['#text'] || r)
  };
};

const parseKanjis = (xml: string): Kanji[] => {
  const jsonObj = parser.parse(xml);
  const characters = asArray(jsonObj.kanjidic2.character);
  return characters.map(extractKanji);
};

export const convertKanjidicToJson = (xml: string, filePath: string) => {
  const kanjis = parseKanjis(xml);
  const json = JSON.stringify(kanjis, null, 2);
  Bun.write(filePath, json);
};
