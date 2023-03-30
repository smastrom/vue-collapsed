import { defineConfig } from 'cypress';

export default defineConfig({
	component: {
		video: false,
		experimentalWebKitSupport: true,
		devServer: {
			framework: 'vue',
			bundler: 'vite',
		},
	},
});
