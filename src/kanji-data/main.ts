import { parseKanjis } from './kanjidic2-parser';
import { addRtkInfo } from './rtk1-parser';

const kanjidicFile = await Bun.file('src/kanji-data/kanjidic2.xml').text();
const rtkFile = await Bun.file('src/kanji-data/rtk1.csv').text();
const kanjis = parseKanjis(kanjidicFile);
const rktKanjis = addRtkInfo(rtkFile, kanjis);
const json = JSON.stringify(rktKanjis);
await Bun.write('static/kanji.json', json);
