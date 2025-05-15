<script setup lang="ts">
const { user, username, signOut } = useAuth();
const { toggleDarkMode, isDarkMode } = useTheme();
</script>

<template>
  <header class="sticky flex items-center w-screen h-16 bg-zinc-300 dark:bg-zinc-800 dark:text-white">
    <NuxtLink to="/" class="min-w-fit ml-9 text-2xl">
      Bubl🫧
    </NuxtLink>
    <nav class="h-full w-full flex items-center justify-end gap-6 pr-9">
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink v-if="user && username" :to="`/${username}`">
        Profile
      </NuxtLink>
      <NuxtLink v-else to="/signup">Signup</NuxtLink>
      <button v-if="user" @click="signOut" class="text-white bg-red-500 rounded-md hover:bg-red-600 p-2">
        Logout
      </button>
      <button @click="toggleDarkMode" :title="isDarkMode ? 'Dark Mode' : 'Light Mode'"
        class="h-fit py-1 px-2 rounded bg-zinc-100 text-lg dark:bg-zinc-950">
        {{ isDarkMode ? '🌚' : '🌞' }}
      </button>
    </nav>
  </header>
</template>
