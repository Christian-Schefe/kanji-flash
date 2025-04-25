import { convertKanjidicToJson } from './parser';

const file = await Bun.file('src/kanjidic2/kanjidic2.xml').text();
convertKanjidicToJson(file, 'static/kanji.json');
