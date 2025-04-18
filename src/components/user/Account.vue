<script setup lang="ts">
import { useSupabase } from '~/lib/supabase';
import type { User } from '~/types/user';

const supabase = useSupabase();
const userStore = useUserStore();
const { setUser } = userStore;
const { user, updatedSuccessfully } = storeToRefs(userStore);

const loading = ref(false);

const updatedUser = ref<Partial<User>>({ ...user.value });

const updateProfile = async () => {
  if (loading.value || updatedSuccessfully.value) return;

  try {
    loading.value = true;
    const { data: sessionData } = await  supabase.auth.getSession();

    const userId = user.value?.id || sessionData?.session?.user.id;

    if (!userId) return;

    const updates = {
      username: updatedUser.value.username,
      website: updatedUser.value.website,
      avatar_url: updatedUser.value.avatar_url,
      updated_at: new Date(),
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) throw error;

    const prevUsername = user.value?.username;

    setUser(data, true);

    if (prevUsername !== updatedUser.value.username) {
      await navigateTo(`/${updatedUser.value.username}`);
    }
  } catch (error) {
    alert(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form v-if="user" class="border rounded-md p-3 my-6 mx-12 flex flex-col justify-around items-center"
    @submit.prevent="updateProfile">
    <div class="w-full flex flex-col items-start justify-center my-3">
      <label for="email" class="mr-3">Email</label>
      <input id="email" type="text" class="border rounded-md p-2 text-lg bg-zinc-50 text-zinc-950"
        :value="updatedUser.email" disabled />
    </div>
    <div class="w-full flex flex-col items-start justify-center my-3">
      <label for="username" class="mr-3">Name</label>
      <input id="username" type="text" v-model="updatedUser.username"
        class="border rounded-md p-2 text-lg bg-zinc-50 text-zinc-950" />
    </div>
    <div class="w-full flex flex-col items-start justify-center my-3">
      <label for="website" class="mr-3">Website</label>
      <input id="website" type="url" v-model="updatedUser.website"
        class="border rounded-md p-2 text-lg bg-zinc-50 text-zinc-950" />
    </div>

    <div class="w-full flex flex-col items-start justify-center my-3">
      <input type="submit" class="border bg-emerald-500 hover:bg-emerald-600 rounded-md text-zinc-50 py-2 px-6"
        :value="loading ? 'Loading ...' : updatedSuccessfully ? 'Updated Successfully!' : 'Update'" :disabled="loading" />
    </div>
  </form>
</template>
