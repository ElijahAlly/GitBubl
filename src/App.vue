<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useAuth } from './composables/useAuth';
import { useTheme } from './composables/useTheme';

const { user, username } = useAuth();
const { toggleDarkMode, isDarkMode } = useTheme();
</script>

<template>
  <header class="sticky flex items-center w-screen h-12 bg-emerald-950 text-white">
    <RouterLink to="/" class="min-w-fit ml-9 text-2xl">
        Bubl🫧
    </RouterLink>
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
    <nav class="h-full w-full flex items-center justify-end gap-6 pr-9">
      <RouterLink to="/about">About</RouterLink>
      <RouterLink v-if="user" :to="{ name: 'user-profile', params: { username }}">
        Profile
      </RouterLink>
      <RouterLink v-else to="/signup">Signup</RouterLink>
      <button @click="toggleDarkMode" :title="isDarkMode ? 'Dark Mode' : 'Light Mode'"
        class="h-fit py-1 px-2 rounded bg-zinc-100 text-lg dark:bg-zinc-950">
        {{ isDarkMode ? '🌚' : '🌞' }}
      </button>
    </nav>
  </header>

  <main class="flex w-screen h-screen bg-zinc-50 dark:bg-zinc-950">
    <RouterView />
  </main>
</template>
