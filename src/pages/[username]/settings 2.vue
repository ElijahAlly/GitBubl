<script setup lang="ts">
import Account from '~/components/user/Account.vue';

definePageMeta({
  layout: 'user',
  middleware: ['auth']
})
</script>

<template>
  <div class="flex flex-col dark:text-zinc-50">
    <h1 class="text-2xl font-semibold mb-6">Account Settings</h1>
    <Account />
  </div>
</template>
