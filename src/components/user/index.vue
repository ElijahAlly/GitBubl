<script setup lang="ts">
const route = useRoute();
const username = computed(() => route.params.username as string);
</script>

<template>
  <div class="min-h-screen dark:bg-zinc-900">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 min-h-screen border-r dark:border-zinc-700 p-4 dark:text-zinc-50">
        <div class="flex flex-col gap-6">
          <!-- User Info Section -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-full bg-zinc-300">
              <!-- Avatar here -->
            </div>
            <div>
              <h2 class="font-semibold">{{ username }}</h2>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="flex flex-col gap-2">
            <NuxtLink :to="`/${username}`" class="p-2 rounded-md hover:bg-zinc-700 transition-colors"
              :class="{ 'bg-zinc-700': route.path === `/${username}` }">
              Overview
            </NuxtLink>
            <NuxtLink :to="`/${username}/repos`" class="p-2 rounded-md hover:bg-zinc-700 transition-colors"
              :class="{ 'bg-zinc-700': route.path.includes('/repos') }">
              Repositories
            </NuxtLink>
            <NuxtLink :to="`/${username}/orgs`" class="p-2 rounded-md hover:bg-zinc-700 transition-colors"
              :class="{ 'bg-zinc-700': route.path.includes('/orgs') }">
              Organizations
            </NuxtLink>
            <NuxtLink :to="`/${username}/ide`" class="p-2 rounded-md hover:bg-zinc-700 transition-colors"
              :class="{ 'bg-zinc-700': route.path.includes('/ide') }">
              Web IDE
            </NuxtLink>
          </nav>

          <!-- Settings at the bottom -->
          <div class="mt-auto">
            <NuxtLink :to="`/${username}/settings`" class="p-2 rounded-md hover:bg-zinc-700 transition-colors"
              :class="{ 'bg-zinc-700': route.path.includes('/settings') }">
              Settings
            </NuxtLink>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <slot name="main"></slot>
      </main>
    </div>
  </div>
</template>
