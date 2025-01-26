// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  compatibilityDate: "2025-01-14",
  ssr: false,
  nitro: {
    preset: 'static'
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL,
      public: {
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseAnonKey: process.env.SUPABASE_KEY || ''
      }
    }
  },
  app: {
    baseURL: '/stash-web/',
  }
})
