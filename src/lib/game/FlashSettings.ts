import { allKanjiCollection } from "$lib/collection.svelte";

export type FlashSettings = {
	collection: string;
	review: boolean;
};

export const defaultFlashSettings: FlashSettings = {
	collection: allKanjiCollection.id,
	review: false,
};
