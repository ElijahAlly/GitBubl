import type { User } from '~/types/user';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const updatedSuccessfully = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email || '');
  const username = computed(() => user.value?.username || '');

  const setUser = (newUser: User | null, updated: boolean = false) => {
    user.value = newUser;
    if (updated) {
      updatedSuccessfully.value = true;
      setTimeout(() => updatedSuccessfully.value = false, 1200);
    }
  }

  const clearUser = () => {
    user.value = null;
  }

  return {
    // state
    user,
    updatedSuccessfully,

    // getters
    isAuthenticated,
    userEmail,
    username,

    // actions
    setUser,
    clearUser
  }
})
