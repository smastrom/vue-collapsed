<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Collapse } from '../src/Collapse';

const data = reactive([
	{
		text: 'DataX',
		isOpen: false,
	},
	{
		text: 'DataY',
		isOpen: true,
	},
	{
		text: 'DataB',
		isOpen: false,
	},
	{
		text: 'DataC',
		isOpen: false,
	},
]);

const dataX = ref([
	{
		text: 'DataXX',
		isOpen: false,
	},
	{
		text: 'DataYY',
		isOpen: true,
	},
	{
		text: 'DataBB',
		isOpen: false,
	},
	{
		text: 'DataCC',
		isOpen: false,
	},
]);

function handleAccordion(selectedIndex: number) {
	data.forEach((_, index) => {
		data[index].isOpen = index === selectedIndex ? !data[index].isOpen : false;
	});
}

function handleAccordionX(selectedIndex: number) {
	dataX.value.forEach((_, index) => {
		dataX.value[index].isOpen = index === selectedIndex ? !dataX.value[index].isOpen : false;
	});
}

const isOpen = ref(false);

const toggleAttrs = computed(() => ({
	'aria-expanded': isOpen.value,
	'aria-controls': 'my-collapse-id',
}));

const collapseAttrs = {
	id: 'my-collapse-id',
	role: 'region',
};

function handleCollapse() {
	isOpen.value = !isOpen.value;
}
</script>

<template>
	<div class="section">
		<button v-bind="toggleAttrs" @click="handleCollapse">{{ isOpen }}</button>
		<Collapse v-bind="collapseAttrs" as="section" :when="isOpen" class="collapseElement">
			<p>
				As an interesting side note, as a head without a body, I envy the dead. Kids don't turn
				rotten just from watching TV. Bender, I didn't know you liked cooking. That's so cute.
				That's right, baby. I ain't your loverboy Flexo, the guy you love so much. You even love
				anyone pretending to be him! I'll tell them you went down prying the wedding ring off his
				cold, dead finger.
			</p>
		</Collapse>
	</div>

	<div style="height: 100px" />
	<div v-for="(element, index) in data" :key="element.text" class="section">
		<button @click="() => handleAccordion(index)">{{ element.isOpen }}</button>
		<Collapse as="section" :when="element.isOpen" class="collapseElement">
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
				envy the dead. Kids don't turn rotten just from watching TV. Bender, I didn't know you liked
				cooking. That's so cute. That's right, baby. I ain't your loverboy Flexo, the guy you love
				so much. You even love anyone pretending to be him! I'll tell them you went down prying the
				wedding ring off his cold, dead finger.
			</p>
		</Collapse>
	</div>

	<div style="height: 100px" />
	<div v-for="(element, index) in dataX" :key="element.text" class="section">
		<button @click="() => handleAccordionX(index)">{{ element.isOpen }}</button>
		<Collapse :when="element.isOpen" class="collapseElement">
			<p>
				As an interesting side note, as a head without a body, I envy the dead. Kids don't turn
				rotten just from watching TV. Bender, I didn't know you liked cooking. That's so cute.
				That's right, baby. I ain't your loverboy Flexo, the guy you love so much. You even love
				anyone pretending to be him! I'll tell them you went down prying the wedding ring off his
				cold, dead finger.
			</p>
		</Collapse>
	</div>
</template>

<style>
body {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>

<style scoped>
.section {
	max-width: 600px;
	border: 4px solid violet;
	margin: 20px 0;
	border-radius: 5px;
}
.section button {
	width: 100%;
	padding: 20px;
	border: none;
	background: none;
	cursor: pointer;
}

.collapseElement {
	overflow: hidden;
	background-color: aqua;
	transition: height var(--vc-auto-duration) cubic-bezier(0.25, 1, 0.5, 1);
}

.collapseElement p {
	border-top: 3px solid cadetblue;
	padding: 20px;
	margin: 0;
}
</style>
