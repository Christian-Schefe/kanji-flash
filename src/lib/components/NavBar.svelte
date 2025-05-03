<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { DarkMode, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';

  type NavLink = {
    name: string;
    href: string;
  };

  type Props = {
    title: string;
    pages: NavLink[];
  };

  const { title, pages }: Props = $props();
  const activeUrl = $derived.by(() => {
    const parts = page.url.pathname.slice(base.length + 1).split('/');
    return parts.length >= 1 ? `${base}/${parts[0]}` : '${base}/';
  });
</script>

<Navbar navContainerClass="max-w-6xl" class="border-b border-gray-200 dark:border-gray-700">
  <NavBrand href="{base}/">
    <span class="self-center whitespace-nowrap text-xl font-semibold">{title}</span>
  </NavBrand>
  <div class="flex md:order-2">
    <DarkMode />
    <NavHamburger />
  </div>
  <NavUl {activeUrl} slideParams={{ delay: 0, duration: 300 }}>
    {#each pages as { name, href }}
      <NavLi href="{base}/{href}">{name}</NavLi>
    {/each}
  </NavUl>
</Navbar>
