import { defineConfig } from 'cypress';

export default defineConfig({
	component: {
		specPattern: 'src/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
		devServer: {
			framework: 'vue',
			bundler: 'vite',
		},
	},
});
