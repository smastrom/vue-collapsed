import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig(({ mode }) => {
	if (mode === 'app') {
		return {
			plugins: [vue()],
		};
	}
	return {
		build: {
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
