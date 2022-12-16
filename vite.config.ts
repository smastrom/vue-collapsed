import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import terser from '@rollup/plugin-terser';

export default defineConfig(({ mode }) => {
	if (mode === 'app') {
		return {
			plugins: [vue()],
		};
	}
	return {
		build: {
			minify: 'terser',
			lib: {
				entry: 'src/Collapse.ts',
				name: 'VueCollapsed',
				fileName: 'index',
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
				include: ['src/Collapse.ts'],
				beforeWriteFile: (_, content) => ({
					filePath: path.resolve(__dirname, 'dist', 'index.d.ts'),
					content,
				}),
			}),
		],
	};
});
