import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const isWatch = process.argv.includes('--watch')

export default defineConfig({
   build: {
      emptyOutDir: !isWatch,
      lib: {
         entry: 'src/index.ts',
         name: 'vue-collapsed',
         fileName: 'index',
         formats: ['es', 'cjs'],
      },
      rollupOptions: {
         external: ['vue'],
         output: {
            globals: {
               vue: 'Vue',
            },
         },
      },
   },
   plugins: [
      vue(),
      dts({
         rollupTypes: true,
      }),
   ],
})
