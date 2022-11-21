<script setup lang="ts">
import SingleCollapse from './SingleCollapse.vue';
import Accordion from './Accordion.vue';
import IndividualControl from './IndividualControl.vue';
import WithCallbacks from './WithCallback.vue';
</script>

<template>
	<header class="AppHeader">
		<h1>Vue Collapsed</h1>
		<a
			href="https://github.com/smastrom/vue-collapsed"
			target="_blank"
			aria-label="Visit GitHub Repo"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="23.408"
				viewBox="0 0 24 23.408"
				aria-hidden="true"
			>
				<path
					d="M12,0A12,12,0,0,0,8.207,23.387c.6.111.793-.261.793-.577V20.576C5.662,21.3,4.967,19.16,4.967,19.16A3.178,3.178,0,0,0,3.634,17.4c-1.089-.745.083-.729.083-.729a2.519,2.519,0,0,1,1.839,1.237,2.554,2.554,0,0,0,3.492,1,2.546,2.546,0,0,1,.762-1.6C7.145,17,4.343,15.971,4.343,11.374A4.644,4.644,0,0,1,5.579,8.153,4.316,4.316,0,0,1,5.7,4.977S6.7,4.655,9,6.207a11.374,11.374,0,0,1,6.009,0c2.291-1.552,3.3-1.23,3.3-1.23a4.312,4.312,0,0,1,.118,3.176,4.632,4.632,0,0,1,1.235,3.221c0,4.609-2.807,5.624-5.479,5.921A2.868,2.868,0,0,1,15,19.517V22.81c0,.319.192.694.8.576A12,12,0,0,0,12,0Z"
				/>
			</svg>
		</a>
	</header>

	<main>
		<SingleCollapse />
		<Accordion />
		<WithCallbacks />
		<IndividualControl />
	</main>

	<footer>
		Made with ❤ by
		<a href="https://github.com/smastrom" target="_blank" class="CodeLink">@smastrom</a>
	</footer>
</template>

<style>
@media (max-width: 639px) {
	#app {
		width: 100%;
	}
}

:root {
	--AccentColor: #41b883;
	--ForegroundColor: #c5c5c5;
	--ForegroundColorLight: #929292;
	--BackgroundColor: #1a1a1a;
	--BackgroundAlternateColor: #242424;
}
* {
	box-sizing: border-box;
}

h1,
h2,
p {
	margin: 0;
	padding: 0;
}

body {
	--Padding: 20px;
	margin: 0;
	padding: var(--Padding);
	font-synthesis: none;
	text-rendering: optimizeLegibility;
	line-height: 1.75;
	-moz-osx-font-smoothing: grayscale;
	background: var(--BackgroundColor);
	color: var(--ForegroundColor);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
		Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

main {
	width: 100%;
}

h2 {
	font-size: 1.25rem;
	margin: 0;
}

footer {
	font-size: 0.865rem;
}

.AppHeader {
	margin-bottom: 70px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.AppHeader h1 {
	font-size: 2rem;
}

.AppHeader svg {
	fill: var(--ForegroundColor);
	width: 40px;
	height: 40px;
}

.AppHeader a:hover svg {
	fill: var(--AccentColor);
}

.Header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 30px;
}

.HeaderTitle {
	display: flex;
	flex-direction: column;
	gap: 0;
	margin: 0;
	padding: 0;
}

.HeaderTitle > p {
	text-transform: uppercase;
	font-size: 0.725rem;
	color: var(--AccentColor);
	margin: 0;
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.Panel {
	width: 100%;
	font-size: 1rem;
	color: var(--ForegroundColor);
	text-align: left;
	font-weight: 600;
}

.Panel:hover {
	color: var(--AccentColor);
}

.Active {
	color: var(--AccentColor);
}

.CodeLink {
	font-size: 0.925rem;
	color: var(--AccentColor);
}

.CodeLink:hover {
	color: var(--ForegroundColor);
}

.Wrapper {
	margin-bottom: 80px;
}

.Section {
	background: var(--BackgroundAlternateColor);
	width: 100%;
	max-width: 600px;
	border-top: 1px solid var(--ForegroundColorLight);
	margin: 0;
}

.Section:last-of-type {
	border-bottom: 1px solid var(--ForegroundColorLight);
}

.Section button {
	width: 100%;
	padding: 20px 10px;
	border: none;
	background: none;
	cursor: pointer;
}

.Collapse {
	transition: height var(--vc-auto-duration) cubic-bezier(0.3, 0, 0.6, 1);
}

.Collapse p {
	padding: 0 10px 10px;
	margin: 0;
	color: var(--ForegroundColorLight);
	font-size: 1rem;
}

@media (min-width: 640px) {
	main {
		width: 600px;
	}

	h2 {
		font-size: 1.75rem;
	}

	footer {
		font-size: 0.925rem;
	}

	.Panel {
		font-size: 1.125rem;
	}

	.Section button {
		padding: 20px 10px;
	}

	.Collapse p {
		padding: 0 20px 20px;
		margin: 0;
		color: var(--ForegroundColorLight);
	}

	.AppHeader h1 {
		font-size: 2.5rem;
	}
}
</style>
