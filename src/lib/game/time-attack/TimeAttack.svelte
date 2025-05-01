<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { allKanjiCollection, collectionMap } from '$lib/collection.svelte';
  import KanjiMeanings from '$lib/components/KanjiMeanings.svelte';
  import { settings, stateData } from '$lib/settings.svelte';
  import { Button, ButtonGroup, Input, Progressbar } from 'flowbite-svelte';
  import { onDestroy, onMount } from 'svelte';
  import * as wanakana from 'wanakana';
  import type { Kanji } from '../../../kanji-data/types';
  import { defaultTimeAttackState } from './TimeAttackSettings';

  type Props = {
    kanjis: Kanji[];
  };

  const { kanjis }: Props = $props();

  const gameSettings = $derived(settings.settings.gameModeSettings.timeAttack);
  const gameState = $derived(stateData.state.gameModeState.timeAttack);

  const collection = $derived(collectionMap.get(gameSettings.collection) ?? allKanjiCollection);

  const filteredKanjis = $derived.by(() => {
    const filtered = kanjis.filter((kanji) => collection.contains(kanji));
    return gameSettings.mode === 'onyomi'
      ? filtered.filter((kanji) => kanji.o.length > 0)
      : filtered;
  });

  const currentKanji: Kanji | undefined = $derived(filteredKanjis[gameState.currentIndex]);

  const fontClass = $derived(settings.settings.font);

  let inputVal = $state('');
  let solution = $state(false);
  let lastTime = performance.now();
  // svelte-ignore state_referenced_locally
  let timePlayed = $state(gameState.timePlayed);

  const doFocus = (timeout?: number) => {
    const doFocusInner = () => {
      const inputField = document.getElementById('input') as HTMLInputElement;
      if (inputField) {
        inputField.focus();
      }
    };
    if (timeout) {
      setTimeout(doFocusInner, timeout);
    } else {
      doFocusInner();
    }
  };

  const onNext = () => {
    if (gameState.done) return;
    gameState.currentIndex = Math.floor(Math.random() * filteredKanjis.length);
    inputVal = '';
    solution = false;
    doFocus(1);
  };

  const onSkip = () => {
    if (gameState.done) return;
    if (currentKanji !== undefined) {
      gameState.kanjis.push({ kanji: currentKanji.l, solved: false });
    }
    inputVal = '';
    solution = true;
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  $effect(() => {
    if (gameState.done) return;
    if (solution || gameState.currentIndex === -1 || !currentKanji) {
      return;
    }
    if (gameSettings.mode === 'onyomi') {
      inputVal = wanakana.toHiragana(inputVal, { IMEMode: true });

      if (currentKanji.o.some((reading) => wanakana.toHiragana(reading) === inputVal)) {
        gameState.score += 1;
        gameState.kanjis.push({ kanji: currentKanji.l, solved: true });
        onNext();
      }
    } else if (gameSettings.mode === 'meaning') {
      if (currentKanji.m.some((meaning) => meaning.toLowerCase() === inputVal.toLowerCase())) {
        gameState.score += 1;
        gameState.kanjis.push({ kanji: currentKanji.l, solved: true });
        onNext();
      }
    }

    if (inputVal === 'qqqq') {
      onEnd();
    }
  });

  $effect(() => {
    if (gameState.done) return;
    if (gameState.currentIndex === -1 || !currentKanji) {
      onNext();
    }
  });

  const onEnd = () => {
    gameState.done = true;
  };

  const onFinish = (tryAgain: boolean) => {
    if (!tryAgain) {
      stateData.state.gameMode = 'none';
      goto(`${base}/play`);
    } else {
      stateData.state.gameModeState.timeAttack = defaultTimeAttackState;
      timePlayed = gameState.timePlayed;
      startGame();
      onNext();
    }
  };

  let tickId: number | null = $state(null);

  const onTick = () => {
    tickId = null;
    if (gameState.done) return;
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;
    if (delta < 1000) {
      timePlayed += delta / 1000;
    }
    if (timePlayed >= gameSettings.time) {
      onEnd();
    } else {
      tickId = requestAnimationFrame(onTick);
    }
  };

  const startGame = () => {
    if (tickId === null) {
      tickId = requestAnimationFrame(onTick);
    }
    doFocus(1);
  };

  onMount(() => {
    startGame();
  });

  onDestroy(() => {
    gameState.timePlayed = timePlayed;
    if (tickId !== null) {
      cancelAnimationFrame(tickId);
    }
  });

  $effect(() => {
    if (gameState.done) return;
    const timeDiff = Math.abs(gameState.timePlayed - timePlayed);
    if (timeDiff > 2) {
      gameState.timePlayed = timePlayed;
    }
  });

  const timeLeft = $derived(Math.max(Math.ceil(gameSettings.time - timePlayed), 0));
  const timeString = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const timeLeftString = $derived(timeString(timeLeft));
</script>

<div class="flex flex-col items-center gap-4">
  {#if filteredKanjis.length === 0}
    <p class="text-2xl text-center">No kanjis to play.</p>
  {:else if currentKanji !== undefined && !gameState.done}
    <div class="w-full flex items-center gap-2">
      <Progressbar progress={(timePlayed * 100) / gameSettings.time} />
      <p>{timeLeftString}</p>
    </div>
    <p class="text-8xl {fontClass}">
      {currentKanji.l}
    </p>
    <div class="w-full max-w-48">
      <Input type="text" bind:value={inputVal} id="input" autocomplete="off" disabled={solution} />
    </div>
    <Button onclick={onSkip}>Skip</Button>
    {#if solution}
      {#if gameSettings.mode === 'onyomi'}
        <p class="text-2xl text-center">Onyomi: {currentKanji.o.join(', ')}</p>
      {:else if gameSettings.mode === 'meaning'}
        <KanjiMeanings kanji={currentKanji} />
      {/if}
    {/if}
  {:else if gameState.done}
    <div class="flex flex-col gap-4 items-center w-full">
      <p class="text-2xl text-center">Time's up!</p>
      <p class="text-xl text-center">
        Score: <span class="font-bold">{gameState.score}</span>
      </p>
      <p class="text-xl text-center">
        Time: <span class="font-bold">{timeString(gameSettings.time)}</span>
      </p>
      <ButtonGroup class="flex w-fit">
        <Button class="min-w-32" onclick={() => onFinish(true)}>Try Again</Button>
        <Button class="min-w-32" onclick={() => onFinish(false)}>Leave</Button>
      </ButtonGroup>
      <p class="text-xl text-center">Answered Kanjis</p>
      <div class="grid grid-cols-4 gap-2">
        {#each gameState.kanjis as kanji}
          <a
            href={`${base}/reference/${kanji.kanji}`}
            class="text-2xl flex justify-center items-center rounded-lg outline outline-gray-300 dark:outline-gray-700 w-12 h-12 {kanji.solved
              ? ''
              : 'text-primary-700 dark:text-primary-600'} hover:outline-blue-400 active:bg-blue-100 dark:active:bg-blue-900"
          >
            <p class="">{kanji.kanji}</p>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>
