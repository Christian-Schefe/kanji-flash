<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import { Card } from 'flowbite-svelte';
  import type { PageProps } from './$types';
  import { base } from '$app/paths';
  import { settings } from '$lib/settings.svelte';

  const { data }: PageProps = $props();

  const jlpt = ['N0', 'N1', 'N2 - N3', 'N4', 'N5'][data.kanji?.jlpt ?? 0];
  const grade = [
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
  ][data.kanji?.grade ?? 0];

  const fontClass = $derived(settings.settings.font);
</script>

{#if data.kanji != null}
  <PageBody title="Kanji" backHref="{base}/reference">
    <div class="flex flex-col items-center">
      <Card size="md">
        <div class="grid grid-cols-2" style="grid-template-columns: min-content 1fr;">
          <div class="flex flex-col gap-2 items-center mb-4 mr-4">
            <p class="text-8xl {fontClass}">
              {data.kanji.literal}
            </p>
            <p>{data.kanji.strokes} strokes</p>
          </div>
          <div>
            <p class="text-2xl mb-2">{data.kanji.meanings.join(', ')}</p>
            <p>Grade: <span class="font-bold">{grade}</span></p>
            <p>JLPT Level: <span class="font-bold">{jlpt}</span></p>
            <p>Frequency: <span class="font-bold">{data.kanji.frequency ?? 'Unknown'}</span></p>
          </div>
          <div class="grid grid-cols-2 col-span-2" style="grid-template-columns: min-content 1fr;">
            <p class="mr-2 font-bold">On:</p>
            <div class="flex flex-wrap">
              {#each data.kanji.onReadings as reading, index}
                {#if index > 0}
                  <p class="mr-2">,</p>
                {/if}
                <p class={fontClass}>{reading}</p>
              {/each}
            </div>
            <p class="mr-2 font-bold">Kun:</p>
            <div class="flex flex-wrap">
              {#each data.kanji.kunReadings as reading, index}
                {#if index > 0}
                  <p class="mr-2">,</p>
                {/if}
                <p class={fontClass}>{reading}</p>
              {/each}
            </div>
          </div>
        </div>
      </Card>
    </div>
  </PageBody>
{:else}
  <PageBody title="404" />
{/if}
