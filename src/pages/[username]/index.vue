<script setup lang="ts">
import { useSupabase } from '~/lib/supabase';

definePageMeta({
  layout: 'user',
  middleware: ['auth']
})

const route = useRoute();
const username = computed(() => route.params.username as string);
const supabase = useSupabase();

const loading = ref(true);

const repos: any[] = [];
const recentActivity: any[] = [];

// Fetch all repos (both personal and org repos)
// const { data: repos } = await useFetch('/api/repos', {
//   query: { username }
// });

// For the activity section
// const { data: recentActivity } = await useFetch('/api/activity', {
//   query: { username }
// });
</script>

<template>
  <div class="flex flex-col gap-6 dark:text-zinc-50">
    <!-- Repositories Section -->
    <section>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold">Repositories</h2>
        <NuxtLink :to="`/${username}/repos/new`"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">
          New Repository
        </NuxtLink>
      </div>

      <!-- Repository Grid -->
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="repo in repos" :key="repo.id"
          class="p-4 border dark:border-zinc-700 rounded-lg hover:border-emerald-500 transition-colors">
          <NuxtLink :to="`/${username}/${repo.name}`">
            <h3 class="font-semibold text-lg">{{ repo.name }}</h3>
            <p class="text-zinc-400 text-sm">{{ repo.description }}</p>
            <div class="mt-3 flex gap-4 text-sm text-zinc-400">
              <span>{{ repo.language }}</span>
              <span>{{ repo.stars }} stars</span>
              <span>{{ repo.forks }} forks</span>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-center py-8">
        Loading repositories...
      </div>
    </section>

    <!-- Recent Activity Section -->
    <section class="mt-8">
      <h2 class="text-2xl font-semibold mb-4">Recent Activity</h2>
      <div class="border dark:border-zinc-700 rounded-lg p-4">
        <div v-for="activity in recentActivity" :key="activity.id"
          class="py-2 border-b dark:border-zinc-700 last:border-0">
          <!-- Activity items here -->
        </div>
      </div>
    </section>
  </div>
</template>
