<script lang="ts" setup>
import { Collapse } from '../src';
import { ref } from 'vue';

const props = withDefaults(
	// eslint-disable-next-line no-undef
	defineProps<{ initialValue: boolean; as: keyof HTMLElementTagNameMap; baseHeight: number }>(),
	{
		initialValue: false,
		as: 'div',
		baseHeight: 0,
	}
);

const isExpanded = ref(props.initialValue);

const baseHeight = ref(props.baseHeight);

const countExpand = ref(0);
const countExpanded = ref(0);
const countCollapse = ref(0);
const countCollapsed = ref(0);

function handleCollapse() {
	isExpanded.value = !isExpanded.value;
}

function onCollapsed() {
	countCollapsed.value++;
}

function onExpanded() {
	countExpanded.value++;
}

function onExpand() {
	countExpand.value++;
}

function onCollapse() {
	countCollapse.value++;
}

function increaseBaseHeight() {
	baseHeight.value += 10;
}

function decreaseBaseHeight() {
	baseHeight.value -= 10;
}
</script>

<template>
	<section class="Wrapper">
		<div id="CountExpand">{{ countExpand }}</div>
		<div id="CountExpanded">{{ countExpanded }}</div>
		<div id="CountCollapse">{{ countCollapse }}</div>
		<div id="CountCollapsed">{{ countCollapsed }}</div>

		<button @click="increaseBaseHeight" id="BaseHeightIncr">Increase BaseHeight</button>
		<button @click="decreaseBaseHeight" id="BaseHeightDecr">Decrease BaseHeight</button>

		<div class="Section">
			<button
				id="TriggerButton"
				:class="[
					'Panel',
					{
						Active: isExpanded,
					},
				]"
				@click="handleCollapse"
			>
				Hello buddy, how are you today?
			</button>
			<Collapse
				id="Collapse"
				class="v-collapse"
				:as="as"
				:when="isExpanded"
				:onExpand="onExpand"
				:onExpanded="onExpanded"
				:onCollapse="onCollapse"
				:onCollapsed="onCollapsed"
				:baseHeight="baseHeight"
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
					ring off his cold, dead finger. As an interesting side note, as a head without a body, I
					envy the dead. Kids don't turn rotten just from watching TV. Bender, I didn't know you
					liked cooking. That's so cute. That's right, baby. I ain't your loverboy Flexo, the guy
					you love so much. You even love anyone pretending to be him! I'll tell them you went down
					prying the wedding ring off his cold, dead finger. As an interesting side note, as a head
					without a body, I envy the dead. Kids don't turn rotten just from watching TV. Bender, I
					didn't know you liked cooking. That's so cute. That's right, baby. I ain't your loverboy
					Flexo, the guy you love so much. You even love anyone pretending to be him! I'll tell them
					you went down prying the wedding ring off his cold, dead finger.
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

.v-collapse {
	transition: height 300ms cubic-bezier(0.33, 1, 0.68, 1);
}

.v-collapse p {
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
