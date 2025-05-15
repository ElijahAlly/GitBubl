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
        redirect: false,
        cookieOptions: {
          maxAge: 60 * 60 * 8, // 8 hours
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        }
      },
      giteaUrl: process.env.GITEA_URL || 'http://localhost:3000'
    },
    gitea: {
      url: process.env.GITEA_URL || 'http://localhost:3000',
      token: process.env.GITEA_ADMIN_TOKEN // We'll create this
    },
  },

  supabase: {
    // This ensures the session is properly maintained
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  },

  nitro: {
    storage: {
      'git-repos': {
        driver: 'fs',
        base: '/tmp/gitbubl/repos'
      },
      'git-temp': {
        driver: 'fs',
        base: '/tmp/gitbubl/temp'
      }
    },
  },

  compatibilityDate: '2025-04-13'
})
