<script lang="ts">
  import type { Kanji } from '../../kanji-data/types';

  type Props = {
    kanji?: Kanji;
    pClass?: string;
  };

  const { kanji, pClass }: Props = $props();

  const keyword = $derived(kanji?.r?.k);
  const meanings = $derived.by(() => {
    if (!kanji) return '';
    if (!keyword) return kanji.m.join(', ');
    const notRtkMeanings = kanji.m.filter((m) => m !== keyword);
    const str = notRtkMeanings.join(', ');
    return notRtkMeanings.length === 0 ? str : `, ${str}`;
  });
</script>

<p class={pClass ?? 'text-2xl text-center'}>
  {#if keyword}<span class="underline">{keyword}</span>{/if}{meanings}
</p>
