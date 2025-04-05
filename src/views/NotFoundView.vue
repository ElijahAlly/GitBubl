<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center px-4 py-8">
      <h1 class="text-9xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-700 mb-3">Page Not Found</h2>
      <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <router-link to="/"
        class="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg">
        Go back home
      </router-link>
    </div>
  </div>
</template>
