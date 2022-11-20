import { defineConfig } from 'cypress';

export default defineConfig({
	component: {
		specPattern: 'cypress/component/*.{cy,spec}.{js,ts,jsx,tsx}',
		devServer: {
			framework: 'vue',
			bundler: 'vite',
		},
	},
});
