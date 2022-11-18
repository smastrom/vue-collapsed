import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	build: {
		lib: {
			entry: "src/Collapse.ts",
			name: "VueCollapsed",
			fileName: "index",
		},
		rollupOptions: {
			external: ["vue"],
			output: {
				globals: {
					vue: "Vue",
				},
			},
		},
	},
	plugins: [vue()],
});
