<script setup lang="ts">
import { Collapse } from 'vue-collapsed'

const questions = reactive(
   fakeData.map(({ title, answer }, index) => ({
      title,
      answer,
      isExpanded: index === 2, // Initial values, display expanded on mount
   }))
)

function handleAccordion(selectedIndex: number) {
   questions.forEach((_, index) => {
      questions[index].isExpanded = index === selectedIndex ? !questions[index].isExpanded : false
   })
}
</script>

<!-- Check how to set accessibility attributes in IndividualControl.vue -->

<template>
   <article class="Wrapper">
      <ExampleHeader title="Accordion" href="Accordion.vue" hint="Using reactive()" />
      <div v-for="(question, index) in questions" :key="question.title" class="Section">
         <button
            :class="['Panel', { Active: question.isExpanded }]"
            @click="handleAccordion(index)"
         >
            {{ question.title }}
         </button>

         <Collapse as="section" :when="question.isExpanded">
            <p class="CollapseContent">
               {{ question.answer }}
            </p>
         </Collapse>
      </div>
   </article>
</template>

<!-- Check styles in assets/style.css -->
