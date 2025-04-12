<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../composables/useAuth';

type ProviderName = 'GitLab' | 'GitHub' | 'BitBucket';

enum ProviderNameLowercase {
  GitLab = 'gitlab',
  GitHub = 'github',
  BitBucket = 'bitbucket'
}

type ProviderType = {
  name: ProviderName;
  icon: string;
  styles: string;
}

type ProviderStatus = Record<ProviderName, boolean>;

const { session } = useAuth();
const isLoading = ref(false);

const hasLinkedProvider = computed<ProviderStatus>(() => {
  const providers = session.value?.user.app_metadata.providers;

  if (!providers || providers.length <= 1) return {
    GitLab: false,
    GitHub: false,
    BitBucket: false,
  }

  return {
    GitLab: providers.includes(ProviderNameLowercase.GitLab),
    GitHub: providers.includes(ProviderNameLowercase.GitHub),
    BitBucket: providers.includes(ProviderNameLowercase.BitBucket),
  };
});

const providers: ProviderType[] = [
  // GitLab -  Does not work :(
  { name: 'GitLab', icon: 'logos:gitlab', styles: 'text-zinc-950 bg-zinc-50 hover:bg-zinc-300' },
  // Github - Works !!! (In Development)
  { name: 'GitHub', icon: 'mdi:github', styles: 'text-zinc-50 bg-gray-700 hover:bg-gray-800' },
  // BitBucket - Does not work :(
  { name: 'BitBucket', icon: 'devicon:bitbucket', styles: 'text-zinc-50 hover:bg-blue-900 bg-blue-800' },
]

const signInWithProvider = async (providerName: ProviderName) => {
  if (ProviderNameLowercase[providerName] !== ProviderNameLowercase.GitHub) {
    window.alert('GitBubl is currently only processing GitHub Linking. Check back soon!');
    return;
  }

  isLoading.value = true;
  try {
    await supabase.auth.signInWithOAuth({
      provider: ProviderNameLowercase[providerName]
    })
  } catch (error: any) {
    console.error('Sign in error:', error.message)
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="border rounded-md p-3 m-6">
    <h1 class="text-lg dark:text-zinc-50">Link your accounts to import in your projects!</h1>
    <div class="grid grid-cols-2 gap-3">
      <button v-for="provider in providers" :key="provider.name" type="button" :class="[
          provider.styles,
          'relative flex w-full items-center justify-center gap-2 rounded-sm p-3 py-2 text-sm font-semibold transition-all duration-200 select-none',
          {'bg-zinc-600/50 pointer-events-none': hasLinkedProvider[provider.name] }
        ]" @click="signInWithProvider(provider.name)" :title="provider.name">
        <Icon :icon="provider.icon" class="h-5 w-5" :style="{ color: 'inherit' }" />
        <span>{{ provider.name }}</span>
        <Icon v-if="hasLinkedProvider[provider.name]" icon="mynaui:check" class="h-5 w-5 text-emerald-500" />
      </button>
    </div>
  </div>
</template>
