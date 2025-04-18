import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "auth"
declare module "../../node_modules/.pnpm/nuxt@3.16.2_@parcel+watcher@2.5.1_@types+node@22.14.1_db0@0.3.1_eslint@9.24.0_jiti@2.4._d6b950c6eb60c7be0e7b4d5fede9fd3c/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}