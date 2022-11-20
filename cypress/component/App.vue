<script lang="ts" setup>
import { Collapse } from '../../src/Collapse';
import { computed, ref } from 'vue';

const props = withDefaults(
	defineProps<{ initialValue: boolean; as: keyof HTMLElementTagNameMap }>(),
	{
		initialValue: false,
		as: 'div',
	}
);

const isOpen = ref(props.initialValue);

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

const countCollapsed = ref(0);
function onCollapsed() {
	countCollapsed.value++;
}

const countExpanded = ref(0);
function onExpanded() {
	countExpanded.value++;
}
</script>

<template>
	<section class="Wrapper">
		<div id="CountCollapsed">{{ countCollapsed }}</div>
		<div id="CountExpanded">{{ countExpanded }}</div>
		<div class="Section">
			<button
				id="TriggerButton"
				:class="[
					'Panel',
					{
						Active: isOpen,
					},
				]"
				v-bind="toggleAttrs"
				@click="handleCollapse"
			>
				Hello buddy, how are you today?
			</button>
			<Collapse
				v-bind="collapseAttrs"
				:as="as"
				:when="isOpen"
				class="Collapse"
				:onExpanded="onExpanded"
				:onCollapsed="onCollapsed"
			>
				<p>
					As an interesting side note, as a head without a body, I envy the dead. Kids don't turn
					rotten just from watching TV. Bender, I didn't know you liked cooking. That's so cute.
					That's right, baby. I ain't your loverboy Flexo, the guy you love so much. You even love
					anyone pretending to be him! I'll tell them you went down prying the wedding ring off his
					cold, dead finger. As an interesting side note, as a head without a body, I envy the dead.
					Kids don't turn rotten just from watching TV. Bender, I didn't know you liked cooking.
					That's so cute. That's right, baby. I ain't your loverboy Flexo, the guy you love so much.
					You even love anyone pretending to be him! I'll tell them you went down prying the wedding
					ring off his cold, dead finger.
				</p>
			</Collapse>
		</div>
	</section>
</template>

<style>
.Wrapper {
	margin-bottom: 80px;
}

.Section {
	width: 100%;
	max-width: 600px;
	border-top: 2px solid var(--ForegroundColorLight);
	margin: 0;
}

.Section:last-of-type {
	border-bottom: 2px solid var(--ForegroundColorLight);
}

.Section button {
	width: 100%;
	padding: 20px 10px;
	border: none;
	background: none;
	cursor: pointer;
}

.Collapse {
	transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.Collapse p {
	padding: 0 10px 10px;
	margin: 0;
	color: var(--ForegroundColorLight);
	font-size: 1rem;
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
</style>
