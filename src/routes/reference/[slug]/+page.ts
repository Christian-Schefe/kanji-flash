import type { Kanji } from '../../../kanjidic2/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const kanjis = await fetch('/kanji.json');
  const json: Kanji[] = await kanjis.json();
  const kanji = json.find((k) => k.literal === params.slug);

  return {
    kanji: kanji
  };
};
