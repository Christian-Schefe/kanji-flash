<script lang="ts">
  import { base } from '$app/paths';
  import { settings } from '$lib/settings.svelte';

  type Props = {
    literal: string;
    size: number;
    margin: number;
    redText?: boolean;
  };
  const { literal, size, margin, redText }: Props = $props();
  const fontClass = $derived(settings.settings.font);

  const hoverBGClass = 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700';
  const hoverTextClass = redText
    ? 'text-primary-700 hover:text-primary-800 dark:text-primary-600 dark:hover:text-primary-500'
    : 'hover:text-gray-900 dark:hover:text-white';
  const activeOutlineClass =
    'active:outline-primary-700 dark:active:outline-primary-600 active:outline-2';
</script>

<a
  href="{base}/reference/kanji/{literal}"
  style="width: {size - margin}px; height: {size - margin}px; margin: {margin / 2}px;
              font-size: {size / 1.5 - 10}px;"
  class="{fontClass} {hoverBGClass} {hoverTextClass} p-1 outline outline-gray-400 dark:outline-gray-700 rounded-lg text-center {activeOutlineClass}"
>
  {literal}
</a>
