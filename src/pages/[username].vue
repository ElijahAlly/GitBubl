<script setup lang="ts">
import Account from '~/components/user/Account.vue';
import ConnectExternalAccount from '~/components/user/ConnectExternalAccount.vue';

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})
</script>

<template>
  <div class="flex flex-col dark:text-zinc-50">
    <Account />
    <hr class="m-6" />
    <ConnectExternalAccount />
  </div>
</template>
