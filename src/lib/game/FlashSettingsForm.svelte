<script lang="ts">
  import { allKanjiCollection, collections } from '$lib/collection.svelte';
  import { type GameModeState } from '$lib/gameMode.svelte';
  import type { LocalStore } from '$lib/localStorage.svelte';
  import { Select } from 'flowbite-svelte';

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

  applySettings = () => {
    gameModeStore.value.settings.flash.collection = collection;
  };
</script>

<div>
  <Select bind:value={collection} items={collectionItems} />
</div>
