import { getHead } from './utils/getHead'

export default defineNuxtConfig({
   compatibilityDate: '2025-12-30',
   ssr: true,
   app: {
      head: getHead(),
   },
   nitro: {
      preset: 'cloudflare-pages',
   },
   css: ['@/assets/style.css'],
})
