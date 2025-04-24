import { convertKanjidicToJson } from './parser';
import kanjidic2Path from './kanjidic2.xml?raw';

const file = await Bun.file(kanjidic2Path).text();
convertKanjidicToJson(file, 'static/kanji.json');
