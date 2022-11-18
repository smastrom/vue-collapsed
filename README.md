# Vue Collapsed

Dynamically transition the height _from 0 to auto_ and vice versa.

## Single

```vue
<script setup>
import { ref } from "vue"
import { Collapse } from "vue-collapsed"

const isOpen = ref(false) // Initial value

function handleCollapse() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <button @click="handleCollapse">This a button.</button>
    <Collapse :isOpen="isOpen" class="collapse">
      <p>This is a paragraph.</p>
    </Collapse>
  </div>
</template>

<style>
.collapse {
  transition: height 600ms cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
```

## Accordion

```vue
<script setup>
import { reactive } from "vue"
import { Collapse } from "vue-collapsed"

const questions = reactive([
  {
    title: "Question one",
    answer: "Answer one",
    isExpanded: false // Initial value
  },
  {
    title: "Question two",
    answer: "Answer two",
    isExpanded: false
  },
  {
    title: "Question three",
    answer: "Answer three",
    isExpanded: false
  }
])

function handleAccordion(selectedIndex) {
  questions.forEach((_, index) => {
    questions[index].isExpanded = index === selectedIndex ? !questions[index].isExpanded : false
    /**
     * To open multiple at once:
     * questions[index].isExpanded = !questions[index].isExpanded
     */
  })
}
</script>

<template>
  <div v-for="(question, index) in questions" :key="question.title">
    <button @click="() => handleAccordion(index)">
      {{ question.title }}
    </button>
    <Collapse :isOpen="questions[index].isExpanded" class="collapse">
      <p>
        {{ question.answer }}
      </p>
    </Collapse>
  </div>
</template>

<style>
.collapse {
  transition: height 600ms cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
```
