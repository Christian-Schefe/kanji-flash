import { base } from '$app/paths';
import type { Kanji } from '../kanji-data/types';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
  const data = await fetch(`${base}/kanji.json`);
  const kanjis: Kanji[] = await data.json();
  return { kanjis };
};
