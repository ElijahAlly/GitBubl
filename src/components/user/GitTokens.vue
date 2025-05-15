<script setup lang="ts">
import { useSupabase } from '~/lib/supabase';

const supabase = useSupabase();
const tokens = ref<Array<{ id: string, name: string, created_at: string }>>([]);
const newTokenName = ref('');
const newToken = ref<string | null>(null);
const loading = ref(false);

const loadTokens = async () => {
  const { data: session } = await supabase.auth.getSession();

  if (!session?.session) {
    console.error('could not get session');
    return;
  }

  const { data } = await supabase
    .from('git_tokens')
    .select('id, name, created_at')
    .eq('user_id', session.session.user.id)
    .order('created_at', { ascending: false });

  tokens.value = data || [];
};

const generateToken = async () => {
  try {
    loading.value = true;
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) throw new Error('Not authenticated');

    const token = crypto.randomUUID().replace(/-/g, '');

    const { data, error } = await supabase
      .from('git_tokens')
      .insert({
        name: newTokenName.value,
        user_id: session.session.user.id,
        token
      })
      .select('token')
      .single();

    if (error) throw error;

    newToken.value = data.token;
    await loadTokens();
    newTokenName.value = '';
  } catch (error) {
    console.error('Failed to generate token:', error);
  } finally {
    loading.value = false;
  }
};

const revokeToken = async (tokenId: string) => {
  await supabase
    .from('git_tokens')
    .delete()
    .eq('id', tokenId);

  await loadTokens();
};

onMounted(loadTokens);
</script>

<template>
  <div class="mt-8">
    <h2 class="text-xl font-semibold mb-4">Git Access Tokens</h2>

    <!-- New Token Display -->
    <div v-if="newToken" class="mb-6 p-4 bg-green-100 border border-green-300 rounded">
      <p class="text-green-700 font-semibold">New access token generated:</p>
      <p class="font-mono mt-2 p-2 bg-white border rounded text-black">{{ newToken }}</p>
      <p class="mt-2 text-sm text-green-600">Make sure to copy this token now. You won't be able to see it again!</p>
      <button @click="newToken = null" class="mt-2 text-green-700 underline">Close</button>
    </div>

    <!-- Generate New Token -->
    <form @submit.prevent="generateToken" class="mb-6">
      <input
        v-model="newTokenName"
        type="text"
        placeholder="Token name (e.g., 'laptop')"
        class="border rounded p-2 mr-2 text-black"
        required
      />
      <button
        type="submit"
        :disabled="loading"
        class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
      >
        {{ loading ? 'Generating...' : 'Generate Token' }}
      </button>
    </form>

    <!-- Existing Tokens -->
    <div class="space-y-3">
      <div v-for="token in tokens" :key="token.id" class="flex justify-between items-center p-3 border rounded">
        <div>
          <p class="font-semibold">{{ token.name }}</p>
          <p class="text-sm text-gray-500">Created: {{ new Date(token.created_at).toLocaleDateString() }}</p>
        </div>
        <button
          @click="revokeToken(token.id)"
          class="text-red-600 hover:text-red-800"
        >
          Revoke
        </button>
      </div>
    </div>
  </div>
</template>
