import { getHead } from './utils/getHead'

export default defineNuxtConfig({
   ssr: true,
   app: {
      head: getHead(),
   },
})
