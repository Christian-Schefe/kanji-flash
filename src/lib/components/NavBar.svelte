<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';

  type NavLink = {
    name: string;
    href: string;
  };

  type Props = {
    title: string;
    pages: NavLink[];
  };

  const { title, pages }: Props = $props();
  const activeUrl = $derived(page.url.pathname);
</script>

<Navbar>
  <NavBrand href="{base}/">
    <span class="self-center whitespace-nowrap text-xl font-semibold">{title}</span>
  </NavBrand>
  <NavHamburger />
  <NavUl {activeUrl} slideParams={{ delay: 0, duration: 300 }}>
    {#each pages as { name, href }}
      <NavLi href="{base}/{href}">{name}</NavLi>
    {/each}
  </NavUl>
</Navbar>
