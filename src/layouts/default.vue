<script setup lang="ts">
import BublHeader from '~/components/ui/BublHeader.vue';
</script>

<template>
  <div>
    <BublHeader />

    <!-- Page Content -->
    <main class="min-h-screen min-w-screen dark:bg-zinc-700">
      <slot></slot>
    </main>
  </div>
</template>
