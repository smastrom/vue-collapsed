import { defineConfig } from 'cypress'

export default defineConfig({
   component: {
      video: false,
      devServer: {
         framework: 'vue',
         bundler: 'vite',
      },
   },
})
