<script setup lang="ts">
import { giteaService } from '~/services/gitea.service';
import { useSupabase } from '~/lib/supabase';

const route = useRoute();
const username = route.params.username as string;
const repoName = route.params.repo as string;

const { data: repository } = await useAsyncData(
  `repo-${username}-${repoName}`,
  async () => {
    const supabase = useSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) throw new Error('Not authenticated');

    return await giteaService.getRepo(
      username,
      repoName,
      session.access_token
    );
  }
);
</script>

<template>
  <div v-if="repository" class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ repository.name }}</h1>
    <p class="text-gray-600">{{ repository.description }}</p>

    <!-- Clone URLs -->
    <div class="mt-4">
      <p class="font-semibold">Clone URL:</p>
      <code class="bg-gray-100 p-2 rounded">
        {{ repository.clone_url }}
      </code>
    </div>
  </div>
</template>
