<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';

  type Props = {
    title: string;
    backHref?: string;
    children?: Snippet<[]>;
  };
  const { title, children, backHref }: Props = $props();
</script>

<div class="flex flex-col p-2">
  <div class="relative flex justify-center mb-4">
    {#if backHref}
      <a href={backHref} class="h-full w-8 absolute left-0 flex items-center justify-center">
        <ArrowLeftOutline size="lg" />
      </a>
    {/if}
    <h1 class="align-middle text-2xl">{title}</h1>
  </div>
  {#if children}
    {@render children()}
  {/if}
</div>
