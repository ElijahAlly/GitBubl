// Generated by nitro
import type { Serialize, Simplify } from "nitropack/types";
declare module "nitropack/types" {
  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
  interface InternalApi {
    '/__nuxt_error': {
      'default': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/.pnpm/nuxt@3.16.2_@parcel+watcher@2.5.1_@types+node@22.14.1_db0@0.3.1_eslint@9.24.0_jiti@2.4._d6b950c6eb60c7be0e7b4d5fede9fd3c/node_modules/nuxt/dist/core/runtime/nitro/handlers/renderer').default>>>>
    }
    '/_ipx/**': {
      'default': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/.pnpm/@nuxt+image@1.10.0_db0@0.3.1_ioredis@5.6.1_magicast@0.3.5/node_modules/@nuxt/image/dist/runtime/ipx').default>>>>
    }
  }
}
export {}