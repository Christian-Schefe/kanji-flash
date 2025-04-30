<script lang="ts">
  import { allKanjiCollection, collectionMap } from '$lib/collection.svelte';
  import { Button, ButtonGroup } from 'flowbite-svelte';
  import type { Kanji } from '../../kanji-data/types';
  import type { FlashSettings } from './FlashSettings';
  import { LocalStore, localStore } from '$lib/localStorage.svelte';
  import { settings, stateData } from '$lib/settings.svelte';
  import KanjiMeanings from '$lib/components/KanjiMeanings.svelte';

  type Props = {
    kanjis: Kanji[];
  };

  const { kanjis }: Props = $props();

  const gameSettings = $derived(settings.settings.gameModeSettings.flash);
  const collection = $derived(collectionMap.get(gameSettings.collection) ?? allKanjiCollection);

  const filteredKanjis = $derived.by(() => {
    const collectionKanji = kanjis.filter((kanji) => collection.contains(kanji));
    return gameSettings.review
      ? collectionKanji.filter((kanji) => stateData.state.badKanjis[kanji.literal] !== undefined)
      : collectionKanji;
  });

  const currentIndex = localStore('flash-currentIndex', -1);
  const currentFace: LocalStore<'kanji' | 'meaning' | 'info'> = localStore(
    'flash-currentFace',
    'kanji'
  );
  const currentKanji: Kanji | undefined = $derived(filteredKanjis[currentIndex.value]);

  const onReveal = () => {
    currentFace.value = 'info';
  };

  const onNext = (isBad: boolean) => {
    if (isBad && currentKanji) {
      if (stateData.state.badKanjis[currentKanji.literal] !== undefined) {
        stateData.state.badKanjis[currentKanji.literal] -= 1;
      } else {
        stateData.state.badKanjis[currentKanji.literal] = -2;
      }
    } else if (currentKanji) {
      if (stateData.state.badKanjis[currentKanji.literal] !== undefined) {
        stateData.state.badKanjis[currentKanji.literal] += 1;
        if (stateData.state.badKanjis[currentKanji.literal] >= 0) {
          delete stateData.state.badKanjis[currentKanji.literal];
        }
      }
    }

    currentIndex.value = Math.floor(Math.random() * filteredKanjis.length);
    currentFace.value =
      gameSettings.mode === 'kanjiAndMeaning'
        ? Math.random() < 0.5
          ? 'kanji'
          : 'meaning'
        : gameSettings.mode;
  };

  $effect(() => {
    if (currentIndex.value === -1 || !currentKanji) {
      onNext(false);
    } else if (
      (currentFace.value === 'kanji' && gameSettings.mode === 'meaning') ||
      (currentFace.value === 'meaning' && gameSettings.mode === 'kanji')
    ) {
      currentFace.value = gameSettings.mode;
    }
  });

  const fontClass = $derived(settings.settings.font);
</script>

<div class="flex flex-col items-center gap-4">
  {#if filteredKanjis.length === 0}
    <p class="text-2xl text-center">No kanjis to play.</p>
  {:else if currentKanji === undefined}
    <p class="text-2xl text-center">Invalid kanji.</p>
  {/if}
  {#if currentKanji !== undefined}
    {#if currentFace.value === 'kanji'}
      <p class="text-8xl {fontClass}">
        {currentKanji.literal}
      </p>
      <div class="absolute bottom-5 left-5 right-5 flex justify-center">
        <Button onclick={onReveal} class="grow">Reveal</Button>
      </div>
    {:else if currentFace.value === 'meaning'}
      <KanjiMeanings kanji={currentKanji} />
      <div class="grow"></div>
      <div class="absolute bottom-5 left-5 right-5 flex justify-center">
        <Button onclick={onReveal} class="grow">Reveal</Button>
      </div>
    {:else if currentFace.value === 'info'}
      <p class="text-8xl {fontClass}">
        {currentKanji.literal}
      </p>
      <div class="grow"></div>
      <p class="text-xl text-center">
        <KanjiMeanings kanji={currentKanji} />
      </p>
      <div class="grid" style="grid-template-columns: min-content 1fr;">
        <p class="text-xl mr-2">On:</p>
        <p class="text-xl {fontClass}">{currentKanji.onReadings.join(', ')}</p>
        <p class="text-xl mr-2">Kun:</p>
        <p class="text-xl {fontClass}">{currentKanji.kunReadings.join(', ')}</p>
      </div>
      <div class="absolute bottom-5 left-5 right-5 flex justify-center">
        <ButtonGroup class="grow">
          <Button size="md" color="red" onclick={() => onNext(true)} class="grow">Bad</Button>
          <Button size="md" color="green" onclick={() => onNext(false)} class="grow">Good</Button>
        </ButtonGroup>
      </div>
    {/if}
  {/if}
</div>
