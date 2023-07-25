<script setup lang="ts">
import { reactive, ref } from 'vue'

import ExampleHeader from './ExampleHeader.vue'
import Collapse from '../src/Collapse.vue'

import fakeData from './fakeData.json'

const collapseRefs = ref<Element[]>([])
const indexToScroll = ref(-1)

let isBusy = false

const questions = reactive(
   fakeData.map(({ title, answer }) => ({ title, answer, isExpanded: false }))
)

function handleAccordion(selectedIndex: number) {
   questions.forEach((_, index) => {
      questions[index].isExpanded = index === selectedIndex ? !questions[index].isExpanded : false
   })
}

function scrollIntoView(index: number) {
   collapseRefs.value[index].scrollIntoView({
      behavior: 'smooth',
   })
}

function onExpanded(index: number) {
   indexToScroll.value = index
   if (!isBusy) {
      scrollIntoView(index)
   }
}

function onCollapse() {
   isBusy = true
}

function onCollapsed() {
   if (isBusy && indexToScroll.value !== -1) {
      scrollIntoView(indexToScroll.value)
      isBusy = false
   }
}
</script>

<!-- Check how to set accessibility attributes in IndividualControl.vue -->

<template>
   <article class="Wrapper">
      <ExampleHeader
         title="With Callbacks"
         href="WithCallbacks.vue"
         hint="Expand and wait for scroll"
      />
      <div
         v-for="(question, index) in questions"
         :key="question.title"
         class="Section"
         ref="collapseRefs"
      >
         <button
            :class="[
               'Panel',
               {
                  Active: question.isExpanded,
               },
            ]"
            @click="handleAccordion(index)"
         >
            {{ question.title }}
         </button>
         <Collapse
            as="section"
            :when="question.isExpanded"
            :onExpanded="() => onExpanded(index)"
            :onCollapse="onCollapse"
            :onCollapsed="onCollapsed"
         >
            <p class="CollapseContent">
               {{ question.answer }}
            </p>
         </Collapse>
      </div>
   </article>
</template>

<!-- Check styles in App.vue -->
