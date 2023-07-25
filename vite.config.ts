import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import terser from '@rollup/plugin-terser'

export default defineConfig(({ mode }) => {
   if (mode === 'app') {
      return {
         plugins: [vue()],
      }
   }
   return {
      build: {
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
            plugins: [
               terser({
                  compress: {
                     defaults: true,
                  },
               }),
            ],
         },
      },
      plugins: [
         vue(),
         dts({
            staticImport: true,
            insertTypesEntry: true,
            rollupTypes: true,
         }),
      ],
   }
})
