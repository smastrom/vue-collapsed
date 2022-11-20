<script setup lang="ts">
import { reactive, ref, type VNodeRef } from 'vue';
import ExampleHeader from './ExampleHeader.vue';
import fakeData from './fakeData.json';

const collapseRefs = ref<Element[]>([]);

const questions = reactive(
	fakeData.map(({ title, answer }) => ({ title, answer, isExpanded: false }))
);

function handleAccordion(selectedIndex: number) {
	questions.forEach((_, index) => {
		questions[index].isExpanded = index === selectedIndex ? !questions[index].isExpanded : false;
	});
}

async function scrollIntoView(index: number) {
	collapseRefs.value[index].scrollIntoView({
		behavior: 'smooth',
	});
}

function pushToRef(ref: Element) {
	collapseRefs.value.push(ref);
}
</script>

<template>
	<section class="Wrapper">
		<ExampleHeader
			title="With Callback"
			href="blob/main/app/WithCallback.vue"
			hint="Expand and wait for scroll"
		/>
		<div
			v-for="(question, index) in questions"
			:key="question.title"
			class="Section"
			:ref="pushToRef as VNodeRef"
		>
			<button
				:class="[
					'Panel',
					{
						Active: question.isExpanded,
					},
				]"
				@click="() => handleAccordion(index)"
			>
				{{ question.title }}
			</button>
			<Collapse
				as="section"
				:when="question.isExpanded"
				class="Collapse"
				:onExpanded="() => scrollIntoView(index)"
			>
				<p>
					{{ question.answer }}
				</p>
			</Collapse>
		</div>
	</section>
</template>

<!-- Find styles in App.vue -->
