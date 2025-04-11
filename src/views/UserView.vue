<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';

const route = useRoute();
const userStore = useUserStore();
const { username } = storeToRefs(userStore);

</script>

<template>
  <div class="flex flex-col dark:text-zinc-50">
    {{ route.params.username }}
    <p>User page</p>
    <p>{{ username }}</p>
  </div>
</template>
