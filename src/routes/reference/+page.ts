import { base } from '$app/paths';
import type { Kanji } from '../../kanji-data/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const kanjis = await fetch(`${base}/kanji.json`);
  const json: Kanji[] = await kanjis.json();
  return { kanjis: json };
};
