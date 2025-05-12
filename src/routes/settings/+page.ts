import { hasSVGData } from '$lib/svgStorage';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const hasSVG = await hasSVGData();
  return {
    hasSVG
  };
};
