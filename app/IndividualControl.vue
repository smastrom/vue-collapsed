<script setup lang="ts">
import { ref } from 'vue';
import ExampleHeader from './ExampleHeader.vue';
import fakeData from './fakeData.json';

const questions = ref(
	fakeData.map(({ title, answer }, index) => ({
		title,
		answer,
		isExpanded: index === 1 || index === 5 || false,
	}))
);

function handleIndividual(selectedIndex: number) {
	questions.value[selectedIndex].isExpanded = !questions.value[selectedIndex].isExpanded;
}
</script>

<template>
	<section class="Wrapper">
		<ExampleHeader
			title="Individual Control"
			href="blob/master/app/IndividualControl.vue"
			hint="Using ref()"
		/>
		<div v-for="(question, index) in questions" :key="question.title" class="Section">
			<button
				:class="[
					'Panel',
					{
						Active: question.isExpanded,
					},
				]"
				@click="() => handleIndividual(index)"
			>
				{{ question.title }}
			</button>
			<Collapse :when="question.isExpanded" class="Collapse">
				<p>
					{{ question.answer }}
				</p>
			</Collapse>
		</div>
	</section>
</template>

<!-- Find styles in App.vue -->
