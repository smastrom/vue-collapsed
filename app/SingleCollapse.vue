<script lang="ts" setup>
import { computed, ref } from 'vue';
import ExampleHeader from './ExampleHeader.vue';

const isExpanded = ref(false);

function handleCollapse() {
	isExpanded.value = !isExpanded.value;
}

const toggleAttrs = computed(() => ({
	'aria-expanded': isExpanded.value,
	'aria-controls': 'my-collapse-id',
}));

const collapseAttrs = {
	id: 'my-collapse-id',
	role: 'region',
};
</script>

<template>
	<article class="Wrapper">
		<ExampleHeader
			title="Single Collapse"
			href="blob/main/app/SingleCollapse.vue"
			hint="With Aria attributes"
		/>
		<div class="Section">
			<button
				:class="[
					'Panel',
					{
						Active: isExpanded,
					},
				]"
				v-bind="toggleAttrs"
				@click="handleCollapse"
			>
				Hello buddy, how are you today?
			</button>
			<Collapse v-bind="collapseAttrs" :when="isExpanded" class="Collapse">
				<p>
					As an interesting side note, as a head without a body, I envy the dead. Kids don't turn
					rotten just from watching TV. Bender, I didn't know you liked cooking. That's so cute.
					That's right, baby. I ain't your loverboy Flexo, the guy you love so much. You even love
					anyone pretending to be him! I'll tell them you went down prying the wedding ring off his
					cold, dead finger.
				</p>
			</Collapse>
		</div>
	</article>
</template>

<!-- Check styles in App.vue -->
