<script lang="ts">
  import type { Kanji } from '../../kanji-data/types';

  type Props = {
    kanji?: Kanji;
    pClass?: string;
  };

  const { kanji, pClass }: Props = $props();

  const keyword = $derived(kanji?.rtk?.keyword);
  const meanings = $derived.by(() => {
    if (!kanji) return '';
    if (!keyword) return kanji.meanings.join(', ');
    const notRtkMeanings = kanji.meanings.filter((m) => m !== keyword);
    const str = notRtkMeanings.join(', ');
    return notRtkMeanings.length === 0 ? str : `, ${str}`;
  });
</script>

<p class={pClass ?? 'text-2xl text-center'}>
  {#if keyword}<span class="underline">{keyword}</span>{/if}{meanings}
</p>
