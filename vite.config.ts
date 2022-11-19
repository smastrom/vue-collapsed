import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

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
		plugins: [vue()],
	};
});
