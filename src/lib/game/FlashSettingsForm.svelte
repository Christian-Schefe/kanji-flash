<script lang="ts">
  import { allKanjiCollection, collections } from '$lib/collection.svelte';
  import type { GameModeState } from '$lib/gameMode.svelte';
  import type { LocalStore } from '$lib/localStorage.svelte';
  import { Label, Select, Toggle } from 'flowbite-svelte';

  type Props = {
    gameModeStore: LocalStore<GameModeState>;
    applySettings: () => void;
  };

  let { gameModeStore, applySettings = $bindable() }: Props = $props();

  const collectionItems = collections.map((collection) => ({
    value: collection.id,
    name: collection.name
  }));

  let collection = $state(
    gameModeStore?.value?.settings?.flash?.collection ?? allKanjiCollection.id
  );

  let isReview = $state(gameModeStore?.value?.settings?.flash?.review ?? false);

  applySettings = () => {
    gameModeStore.value.settings.flash.collection = collection;
    gameModeStore.value.settings.flash.review = isReview;
  };
</script>

<div class="flex flex-col gap-4 p-4">
  <Select bind:value={collection} items={collectionItems} />
  <div class="flex gap-2">
    <Toggle bind:checked={isReview} /><Label>Review</Label>
  </div>
</div>
