<script setup lang="ts">
import BublHeader from '~/components/ui/BublHeader.vue';

const route = useRoute();
const { username } = useAuth();
</script>

<template>
  <div class="min-h-screen">
    <BublHeader />

    <div class="flex dark:bg-zinc-700">
      <!-- Sidebar -->
      <aside class="w-64 min-h-screen border-r border-zinc-300 dark:border-zinc-950 p-4 dark:text-zinc-50 shrink-0">
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
            <NuxtLink :to="`/${username}`" class="p-2 rounded-md hover:bg-zinc-900 transition-colors"
              :class="{ 'bg-zinc-900': route.path === `/${username}` }">
              Overview
            </NuxtLink>
            <NuxtLink :to="`/${username}/repos`" class="p-2 rounded-md hover:bg-zinc-900 transition-colors"
              :class="{ 'bg-zinc-900': route.path.includes('/repos') }">
              Repositories
            </NuxtLink>
            <NuxtLink :to="`/${username}/orgs`" class="p-2 rounded-md hover:bg-zinc-900 transition-colors"
              :class="{ 'bg-zinc-900': route.path.includes('/orgs') }">
              Organizations
            </NuxtLink>
            <NuxtLink :to="`/${username}/ide`" class="p-2 rounded-md hover:bg-zinc-900 transition-colors"
              :class="{ 'bg-zinc-900': route.path.includes('/ide') }">
              Web IDE
            </NuxtLink>
          </nav>
          <hr class="border-zinc-300 dark:border-zinc-950" />
          <!-- Settings at the bottom -->
          <div class="w-full mt-auto flex flex-col">
            <NuxtLink :to="`/${username}/settings`" class="p-2 rounded-md hover:bg-zinc-900 transition-colors"
              :class="{ 'bg-zinc-900': route.path.includes('/settings') }">
              Settings
            </NuxtLink>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-x-hidden">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
