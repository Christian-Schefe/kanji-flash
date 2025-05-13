<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import { Card, Spinner } from 'flowbite-svelte';
  import type { PageProps } from './$types';
  import { base } from '$app/paths';
  import { settings } from '$lib/settings.svelte';
  import KanjiMeanings from '$lib/components/KanjiMeanings.svelte';
  import { page } from '$app/state';
  import { getSVG, noDataSymbol } from '$lib/svgStorage';

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

  const fontClass = $derived(settings.settings.font);

  const convertSVGData = (data: string | null | typeof noDataSymbol) => {
    if (data === noDataSymbol || data === null) {
      return data;
    }
    const [strokePart, textPart] = data.split('|');
    const strokeParts = strokePart.split('#');
    const textParts = textPart.split('#');
    const strokeGroup = strokeParts.map((p) => `<path d="${p}"></path>`).join('');
    const textGroup = textParts
      .map((p, i) => `<text transform="matrix(${p})">${i + 1}</text>`)
      .join('');
    return {
      strokes: strokeGroup,
      text: textGroup
    };
  };

  const svgData = $derived.by(async () => convertSVGData(kanji ? await getSVG(kanji.l) : null));
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
        <div class="flex flex-col w-full items-center mt-4">
          <p class="text-xl font-bold">Stroke Order</p>
          <div class="max-w-64 w-full flex items-center justify-center aspect-square">
            {#await svgData}
              <Spinner size="16" />
            {:then data}
              {#if data === noDataSymbol}
                <p class="text-primary-600 text-center">SVG data has not been downloaded</p>
              {:else if data === null}
                <p class="text-primary-600 text-center">No SVG found for kanji</p>
              {:else}
                <svg viewBox="0 0 109 109" xmlns="http://www.w3.org/2000/svg">
                  <g
                    class="stroke-current"
                    style="fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;"
                    >{@html data.strokes}</g
                  >
                  <g class="fill-current" style="font-size:8px;">{@html data.text}</g>
                </svg>
              {/if}
            {/await}
          </div>
        </div>
      </Card>
    </div>
  </PageBody>
{:else}
  <PageBody title="404" />
{/if}
