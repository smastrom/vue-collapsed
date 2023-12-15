<script setup lang="ts">
import { Collapse } from 'vue-collapsed'

const collapseRefs = ref<Element[]>([])

let indexToScroll = -1
let isCollapsing = false

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
   indexToScroll = index
   if (!isCollapsing) {
      scrollIntoView(index)
   }
}

function onCollapse() {
   isCollapsing = true
}

function onCollapsed() {
   if (isCollapsing && indexToScroll !== -1) {
      scrollIntoView(indexToScroll)
      isCollapsing = false
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
            :class="['Panel', { Active: question.isExpanded }]"
            @click="handleAccordion(index)"
         >
            {{ question.title }}
         </button>
         <Collapse
            as="section"
            :when="question.isExpanded"
            @expanded="() => onExpanded(index)"
            @collapse="onCollapse"
            @collapsed="onCollapsed"
         >
            <p class="CollapseContent">
               {{ question.answer }}
            </p>
         </Collapse>
      </div>
   </article>
</template>

<!-- Check styles in assets/style.css -->
