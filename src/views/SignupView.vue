<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRoute } from 'vue-router'

type SigninTabView = 'signup' | 'signin';

const route = useRoute();

const email = ref('');
const username = ref('');
const curTab = ref<SigninTabView>(route.query.existing ? 'signin' : 'signup');

const { handleSignUp, handleLogin, loading } = useAuth();

const toggleTab = (to: SigninTabView) => {
  curTab.value = to;
}

const handleSubmit = () => {
  if (curTab.value === 'signup') {
    handleSignUp(email.value, username.value);
  } else {
    handleLogin(email.value);
  }
}

const baseTabStyles = 'underline transition-all duration-200 p-1 rounded select-none';
const inactiveTabStyles = 'text-emerald-600 hover:bg-emerald-500 hover:text-white';
const activeTabStyles = 'text-white bg-emerald-700 hover:bg-emerald-700 hover:text-white';
</script>

<template>
  <section class="w-full h-full flex justify-center">
    <div class="h-fit w-96 flex flex-col gap-3 border rounded shadow-lg shadow-emerald-600/45 mt-48 p-12">
      <div class="flex gap-3">
        <div
          :class="[baseTabStyles, { [inactiveTabStyles]: curTab !== 'signup', [activeTabStyles]: curTab === 'signup' }]"
          role="button" @click="toggleTab('signup')">
          Signup
        </div>
        <div
          :class="[baseTabStyles, { [inactiveTabStyles]: curTab !== 'signin', [activeTabStyles]: curTab === 'signin' }]"
          role="button" @click="toggleTab('signin')">
          Sign in
        </div>
      </div>
      <form class="row flex-center flex" @submit.prevent="handleSubmit">
        <div v-if="curTab === 'signup'" class="col-6 form-widget">
          <div class="my-3">
            <input v-model="username" class="border rounded p-3" required placeholder="Your Username" />
          </div>
          <p class="dark:text-white">Sign up via a link to your email</p>
          <div class="my-3">
            <input v-model="email" class="border rounded p-3" required type="email" placeholder="Your email" />
          </div>
          <div>
            <input type="submit"
              class="text-white bg-emerald-500 hover:bg-emerald-700 rounded-md transition-all duration-200 p-1"
              role="button" :value="loading ? 'Loading' : 'Continue with Signup'" :disabled="loading" />
          </div>
        </div>
        <div v-else class="col-6 form-widget">
          <p class="my-3 dark:text-white">Sign into Bubl🫧 with your email</p>
          <div class="my-3">
            <input v-model="email" class="border rounded p-3" required type="email" placeholder="Your email" />
          </div>
          <div>
            <input type="submit"
              class="text-white bg-emerald-500 hover:bg-emerald-700 rounded-md transition-all duration-200 p-1"
              role="button" :value="loading ? 'Loading' : 'Sign in'" :disabled="loading" />
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
