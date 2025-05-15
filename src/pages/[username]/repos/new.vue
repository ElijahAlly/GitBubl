<script setup lang="ts">
import { useSupabase } from '~/lib/supabase';

definePageMeta({
  layout: 'user',
  middleware: ['auth']
});

const route = useRoute();
const username = computed(() => route.params.username as string);
const supabase = useSupabase();
const { data: { session } } = await supabase.auth.getSession();

const repoName = ref('');
const description = ref('');
const isPrivate = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const createRepository = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Check if we have a session
    if (!session) {
      throw new Error('Not authenticated');
    }

    const res: any = await $fetch(`/api/git/repos/${username.value}/${repoName.value}/create`, {
      method: 'POST',
      body: {
        description: description.value,
        isPrivate: isPrivate.value
      },
      headers: {
        // Include the session token
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (res.error) throw res.error;

    // Redirect to the new repository page
    await navigateTo(`/${username.value}/${repoName.value}`);

  } catch (e) {
    error.value = 'Failed to create repository';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 dark:text-zinc-50">
    <h1 class="text-3xl font-bold mb-8">Create a new repository</h1>

    <form @submit.prevent="createRepository" class="space-y-6">
      <!-- Error Message -->
      <div v-if="error" class="text-red-500 bg-red-100 p-3 rounded">
        {{ error }}
      </div>

      <!-- Repository Name -->
      <div>
        <label class="block text-sm font-medium mb-2">Repository Name</label>
        <input v-model="repoName" type="text" required
          class="w-full p-2 border dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
          placeholder="my-awesome-project" />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium mb-2">Description (optional)</label>
        <textarea v-model="description" rows="3"
          class="w-full p-2 border dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
          placeholder="A short description of your project"></textarea>
      </div>

      <!-- Privacy Setting -->
      <div class="flex items-center gap-2">
        <input v-model="isPrivate" type="checkbox" id="private" class="rounded border-gray-300" />
        <label for="private">Private repository</label>
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="loading"
        class="w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50">
        {{ loading ? 'Creating...' : 'Create repository' }}
      </button>
    </form>

    <CreateRepo />

    <div class="mt-8 border-t pt-8">
      <MigrateRepo />
    </div>
  </div>
</template>
