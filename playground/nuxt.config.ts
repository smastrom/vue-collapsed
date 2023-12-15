import { getHead } from './utils/getHead'

export default defineNuxtConfig({
   ssr: true,
   app: {
      head: getHead(),
   },
   nitro: {
      preset: 'cloudflare-pages',
   },
   css: ['@/assets/style.css'],
})
