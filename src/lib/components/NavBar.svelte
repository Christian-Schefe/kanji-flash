<script lang="ts">
  import { base } from '$app/paths';
  const linkStyle = 'text-blue-500 hover:text-blue-700';

  type NavLink = {
    name: string;
    href: string;
  };

  type Props = {
    title: string;
    pages: NavLink[];
  };

  const { title, pages }: Props = $props();
</script>

<nav class="w-full flex items-center gap-2 p-2 bg-gray-300">
  <div>{title}</div>
  {#each pages as { name, href }}
    <a class={linkStyle} href="{base}/{href}">{name}</a>
  {/each}
</nav>
