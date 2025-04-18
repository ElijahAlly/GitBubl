import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: false },

  devServer: {
    port: 5173
  },

  imports: {
    dirs: ['src/**']
  },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  typescript: {
    strict: true,
    typeCheck: false // make sure your ide is setup to check for typescript errors since vue-tsc is causing errors
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_SUPABASE_URL,
      supabaseKey: process.env.NUXT_SUPABASE_ANON_KEY,
      supabase: {
        url: process.env.NUXT_SUPABASE_URL,
        key: process.env.NUXT_SUPABASE_ANON_KEY,
        redirect: true,
      },
    }
  },

  compatibilityDate: '2025-04-13'
})
