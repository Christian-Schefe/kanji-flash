<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import { Card } from 'flowbite-svelte';
  import type { PageProps } from './$types';
  import { base } from '$app/paths';
  import { settings } from '$lib/settings.svelte';
  import KanjiMeanings from '$lib/components/KanjiMeanings.svelte';
  import { page } from '$app/state';

  const { data }: PageProps = $props();

  const kanji = $derived(data.kanjis.find((k) => k.l === page.params.slug));

  const jlpt = $derived(['N0', 'N1', 'N2 - N3', 'N4', 'N5'][kanji?.j ?? 0]);
  const grade = $derived(
    [
      'Ungraded',
      'Kyouiku',
      'Kyouiku',
      'Kyouiku',
      'Kyouiku',
      'Jouyou',
      'Jouyou',
      'Jouyou',
      'Jouyou',
      'Jinmeiyou',
      'Jinmeiyou',
      'Jinmeiyou'
    ][kanji?.g ?? 0]
  );

  let svgString: string | null = $state(null);

  const processSvg = (svg: string) => {
    const startIndex = svg.indexOf('<svg');
    return svg
      .slice(startIndex)
      .replace(/<g id="kvg:StrokePaths[^>]+>/g, (match) => {
        return match.replace('>', "class='stroke-current'>");
      })
      .replace(/<g id="kvg:StrokeNumbers[^>]+>/g, (match) => {
        return match.replace('>', "class='fill-current'>");
      })
      .replace(/<g id="kvg:StrokePaths[^>]+>/g, (match) => {
        return match.replace(/stroke:[^;"]+;*/, '');
      })
      .replace(/<g id="kvg:StrokeNumbers[^>]+>/g, (match) => {
        return match.replace(/fill:[^"]+;*/, '');
      });
  };

  const checkSvgExists = async () => {
    if (!settings.settings.showStrokeOrder) {
      svgString = null;
      return;
    }
    try {
      const res = await fetch(svgUrl);
      svgString = res.ok ? processSvg(await res.text()) : null;
    } catch {
      return false;
    }
  };

  const fontClass = $derived(settings.settings.font);

  const kanjiCodepoint = $derived(
    kanji?.l.codePointAt(0)?.toString(16).toLowerCase().padStart(5, '0') ?? '00000'
  );
  const svgUrl = $derived(
    `https://raw.githubusercontent.com/KanjiVG/kanjivg/84a317ec30c3c799aa92064bc00a29011b8d14a7/kanji/${kanjiCodepoint}.svg`
  );

  $effect(() => {
    checkSvgExists();
  });
</script>

{#if kanji != null}
  <PageBody title="Kanji" backHref="{base}/reference">
    <div class="flex flex-col items-center">
      <Card size="md">
        <div class="grid" style="grid-template-columns: min-content 1fr;">
          <div class="flex flex-col gap-2 items-center mb-4 mr-4">
            <p class="text-8xl {fontClass}">
              {kanji.l}
            </p>
            <p>{kanji.s} strokes</p>
          </div>
          <div>
            <KanjiMeanings {kanji} pClass="text-2xl mb-2" />
            <p>Grade: <span class="font-bold">{grade}</span></p>
            <p>JLPT Level: <span class="font-bold">{jlpt}</span></p>
            <p>Frequency: <span class="font-bold">{kanji.f ?? 'Unknown'}</span></p>
          </div>
          <div class="grid col-span-2" style="grid-template-columns: min-content 1fr;">
            <p class="mr-2 font-bold">On:</p>
            <div class="flex flex-wrap">
              {#each kanji.o as reading, index}
                {#if index > 0}
                  <p class="mr-2">,</p>
                {/if}
                <p class={fontClass}>{reading}</p>
              {/each}
            </div>
            <p class="mr-2 font-bold">Kun:</p>
            <div class="flex flex-wrap">
              {#each kanji.k as reading, index}
                {#if index > 0}
                  <p class="mr-2">,</p>
                {/if}
                <p class={fontClass}>{reading}</p>
              {/each}
            </div>
          </div>
        </div>
        {#if svgString !== null}
          <div class="flex flex-col w-full items-center mt-4">
            <p class="text-xl font-bold">Stroke Order</p>
            <svg class="max-w-64" viewBox="0 0 109 109" xmlns="http://www.w3.org/2000/svg">
              {@html svgString}
            </svg>
          </div>
        {/if}
      </Card>
    </div>
  </PageBody>
{:else}
  <PageBody title="404" />
{/if}
