<script setup lang="ts">
const sourceUrl = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

const migrateRepository = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Extract username and repo from GitHub URL
    const match = sourceUrl.value.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }

    const [, username, repository] = match;

    // Call migration endpoint
    await $fetch('/api/git/migrate', {
      method: 'POST',
      body: {
        username,
        repository: repository.replace('.git', '')
      }
    });

    // Reset form
    sourceUrl.value = '';

  } catch (e) {
    error.value = 'Failed to migrate repository';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-xl font-bold mb-4">Migrate Repository</h2>

    <form @submit.prevent="migrateRepository" class="space-y-4">
      <div>
        <label class="block text-sm mb-1">GitHub Repository URL</label>
        <input
          v-model="sourceUrl"
          type="text"
          class="w-full p-2 border rounded"
          placeholder="https://github.com/username/repository"
          required
        />
      </div>

      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
      >
        {{ loading ? 'Migrating...' : 'Migrate Repository' }}
      </button>
    </form>
  </div>
</template>
