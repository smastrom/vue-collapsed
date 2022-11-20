<script lang="ts" setup>
import { Collapse } from '../src/Collapse';
import { computed, ref } from 'vue';
import ExampleHeader from './ExampleHeader.vue';

const isOpen = ref(false);

function handleCollapse() {
	isOpen.value = !isOpen.value;
}

const toggleAttrs = computed(() => ({
	'aria-expanded': isOpen.value,
	'aria-controls': 'my-collapse-id',
}));

const collapseAttrs = {
	id: 'my-collapse-id',
	role: 'region',
};

const count = ref(0);

function addCount() {
	count.value++;
}
</script>

<template>
	<section class="Wrapper">
		<ExampleHeader title="Single Collapse" href="blob/master/app/SingleCollapse.vue" />
		<div class="Section">
			<button
				:class="[
					'Panel',
					{
						Active: isOpen,
					},
				]"
				v-bind="toggleAttrs"
				@click="handleCollapse"
			>
				Hello buddy, how are you today? {{ count }}
			</button>
			<Collapse
				v-bind="collapseAttrs"
				as="section"
				:when="isOpen"
				class="Collapse"
				:onExpanded="addCount"
			>
				<p>
					As an interesting side note, as a head without a body, I envy the dead. Kids don't turn
					rotten just from watching TV. Bender, I didn't know you liked cooking. That's so cute.
					That's right, baby. I ain't your loverboy Flexo, the guy you love so much. You even love
					anyone pretending to be him! I'll tell them you went down prying the wedding ring off his
					cold, dead finger.
				</p>
			</Collapse>
		</div>
	</section>
</template>

<!-- Find styles in App.vue -->
