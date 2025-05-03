<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';

  type Props = {
    title?: string;
    backHref?: string;
    children?: Snippet<[]>;
  };
  const { title, children, backHref }: Props = $props();

  const prevHref = () => {
    if (backHref) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        goto(backHref, { replaceState: true });
      }
    }
  };
</script>

<div class="flex flex-col p-2 mt-2">
  <div class="relative flex justify-center mb-4">
    {#if backHref}
      <button
        onclick={prevHref}
        class="h-full w-8 absolute left-0 flex items-center justify-center"
      >
        <ArrowLeftOutline size="lg" />
      </button>
    {/if}
    {#if title}
      <h1 class="align-middle text-2xl text-black dark:text-white">{title}</h1>
    {/if}
  </div>
  {#if children}
    {@render children()}
  {/if}
</div>
