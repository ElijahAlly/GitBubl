<script setup lang="ts">
import Account from '~/components/user/Account.vue';

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="flex flex-col dark:text-zinc-50">
    <Account />
    <hr class="m-6" />
  </div>
</template>
