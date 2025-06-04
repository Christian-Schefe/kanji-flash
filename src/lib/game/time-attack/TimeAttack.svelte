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
  import KanjiIcon from '$lib/components/KanjiIcon.svelte';

  type Props = {
    kanjis: Kanji[];
  };

  const { kanjis }: Props = $props();

  const gameSettings = $derived(settings.settings.gameModeSettings.timeAttack);
  const gameState = $derived(stateData.state.gameModeState.timeAttack);

  const collection = $derived(collectionMap.get(gameSettings.collection) ?? allKanjiCollection);

  const filteredKanjis = $derived.by(() => {
    const filtered = kanjis.filter((kanji) => collection.contains(kanjis, kanji));
    if (gameSettings.mode === 'onyomi') {
      const hasOnyomi = filtered.filter((kanji) => kanji.o.length > 0);
      if (!gameSettings.onyomi.showKanji) {
        return hasOnyomi.filter((kanji) => kanji.m.length > 0);
      }
      return hasOnyomi;
    }
    return filtered.filter((kanji) => kanji.m.length > 0);
  });

  const currentKanji: Kanji | undefined = $derived(filteredKanjis[gameState.currentIndex]);

  const fontClass = $derived(settings.settings.font);

  let inputVal = $state('');
  let solution = $state(false);
  let lastTime = performance.now();
  // svelte-ignore state_referenced_locally
  let timePlayed = $state(gameState.timePlayed);
  let prevInputVal = '';

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
    setTimeout(() => {
      inputVal = '';
    }, 1);
    doFocus(1);
  };

  const onSkip = () => {
    if (gameState.done || solution) return;
    inputVal = '';
    solution = true;
    setTimeout(() => {
      if (gameState.done) return;
      if (currentKanji !== undefined) {
        gameState.kanjis.push({ kanji: currentKanji.l, solved: false });
      }
      onNext();
    }, 2000);
  };

  $effect(() => {
    if (gameState.done) return;
    if (solution || gameState.currentIndex === -1 || !currentKanji) {
      return;
    }

    if (inputVal.length < prevInputVal.length) {
      if (gameSettings.backspaceClear) {
        inputVal = '';
      }
    }
    prevInputVal = inputVal;

    if (gameSettings.mode === 'onyomi') {
      if (gameSettings.onyomi.autoHiragana) {
        inputVal = wanakana.toHiragana(inputVal, { IMEMode: true });
      }

      const inputValHiragana = wanakana.toHiragana(inputVal);
      if (currentKanji.o.some((reading) => wanakana.toHiragana(reading) === inputValHiragana)) {
        gameState.score += 1;
        gameState.kanjis.push({ kanji: currentKanji.l, solved: true });
        onNext();
      }
    } else if (gameSettings.mode === 'meaning') {
      const inputValLowercase = inputVal.toLowerCase();
      if (currentKanji.m.some((meaning) => meaning.toLowerCase() === inputValLowercase)) {
        gameState.score += 1;
        gameState.kanjis.push({ kanji: currentKanji.l, solved: true });
        onNext();
      }
    }
  });

  $effect(() => {
    if (gameState.done) return;
    if (gameState.currentIndex === -1 || !currentKanji) {
      onNext();
    }
  });

  const onEnd = () => {
    if (gameState.done) return;
    if (currentKanji !== undefined) {
      gameState.kanjis.push({ kanji: currentKanji.l, solved: false });
    }
    gameState.done = true;
  };

  const onFinish = (tryAgain: boolean) => {
    if (!tryAgain) {
      stateData.state.gameMode = 'none';
      goto(`${base}/play`);
    } else {
      stateData.state.gameModeState.timeAttack = defaultTimeAttackState();
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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputVal.toLowerCase() === 's') {
        onSkip();
      }
      if (inputVal.toLowerCase() === 'q') {
        onEnd();
      }
    }
  };

  const showMeaningInQuestion = $derived(
    gameSettings.mode === 'onyomi' && gameSettings.onyomi.showMeaning
  );

  const showKanjiInQuestion = $derived(
    gameSettings.mode !== 'onyomi' || gameSettings.onyomi.showKanji
  );

  const showOnyomiInQuestion = $derived(
    gameSettings.mode === 'meaning' && gameSettings.meaning.showOnyomi
  );
</script>

<div class="flex flex-col items-center gap-4">
  {#if filteredKanjis.length === 0}
    <p class="text-2xl text-center">No kanjis to play.</p>
  {:else if currentKanji !== undefined && !gameState.done}
    <div class="w-full flex items-center gap-2">
      <Progressbar progress={(timePlayed * 100) / gameSettings.time} />
      <p>{timeLeftString}</p>
    </div>
    {#if showMeaningInQuestion}
      <KanjiMeanings kanji={currentKanji} />
    {/if}
    {#if showKanjiInQuestion}
      <p class="text-8xl {fontClass}">
        {currentKanji.l}
      </p>
    {/if}
    {#if showOnyomiInQuestion}
      <p class="text-2xl text-center">On: {currentKanji.o.join(', ')}</p>
    {/if}
    <div class="w-full max-w-48">
      <Input
        type="text"
        bind:value={inputVal}
        id="input"
        autocomplete="off"
        disabled={solution}
        onkeydown={onKeyDown}
      />
    </div>
    <Button onclick={onSkip}>Skip</Button>
    {#if solution}
      {#if !showMeaningInQuestion}
        <KanjiMeanings kanji={currentKanji} />
      {/if}
      {#if !showKanjiInQuestion}
        <p class="text-8xl {fontClass}">
          {currentKanji.l}
        </p>
      {/if}
      {#if !showOnyomiInQuestion}
        <p class="text-2xl text-center">On: {currentKanji.o.join(', ')}</p>
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
      <div class="grid grid-cols-5">
        {#each gameState.kanjis as kanji}
          <KanjiIcon redText={!kanji.solved} literal={kanji.kanji} size={52} margin={8} />
        {/each}
      </div>
    </div>
  {/if}
</div>
