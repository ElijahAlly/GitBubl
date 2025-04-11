
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email);
  const username = computed(() => user.value?.username);

  const setUser = (newUser: User | null) => {
    user.value = newUser;
  }

  const clearUser = () => {
    user.value = null;
  }

  return {
    // state
    user,

    // getters
    isAuthenticated,
    userEmail,
    username,

    // actions
    setUser,
    clearUser
  }
})
