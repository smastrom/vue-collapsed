<script setup lang="ts">
defineProps<{ title: string; href: string; hint?: string }>();
</script>

<template>
	<header class="Header">
		<div class="HeaderTitle">
			<h2>{{ title }}</h2>
			<p v-if="hint">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="17.5"
					height="17.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="16" x2="12" y2="12"></line>
					<line x1="12" y1="8" x2="12.01" y2="8"></line></svg
				>{{ hint }}
			</p>
		</div>
		<a
			:href="`https://github.com/smastrom/vue-collapsed/blob/main/app/${href}`"
			class="CodeLink"
			target="_blank"
			>View Code</a
		>
	</header>
</template>
