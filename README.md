# Vue Collapsed

Dynamically transition the height _from 0 to auto_ and vice versa.

## Get Started

```shell
npm i -S vue-collapsed
# yarn add vue-collapsed
# pnpm install vue-collapsed
```

Register it globally:

```js
import { Collapse } from 'vue-collapsed'

createApp(App).component('Collapse', Collapse).mount('#app')
```

Or import it locally:

```js
import { Collapse } from 'vue-collapsed'
```

## Props

| name          | description                               | type                          | required           |
| ------------- | ----------------------------------------- | ----------------------------- | ------------------ |
| `when`        | Boolean value to control collapse         | boolean                       | :white_check_mark: |
| `class`       | Class with a transition (height) property | HTMLAttributes['class']       | :white_check_mark: |
| `as`          | Element tag to use instead of `div`       | _keyof_ HTMLElementTagNameMap | :x:                |
| `onExpanded`  | Callback on expand transition completed   | () => void                    | :x:                |
| `onCollapsed` | Callback on collapse transition completed | () => void                    | :x:                |

## Auto Duration

You can reference the CSS variable `--vc-auto-duration` in your transition property to use the optimal duration calculated according to the content height:

```css
.collapse {
  transition: height var(--vc-auto-duration) ease-out;
  /* or height 300ms ease-out; */
}
```

## Example - Single Element

```vue
<script setup>
import { ref } from 'vue'
import { Collapse } from 'vue-collapsed'

const isOpen = ref(false) // Initial value

function handleCollapse() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <button @click="handleCollapse">This a button.</button>
    <Collapse :when="isOpen" class="collapse">
      <p>This is a paragraph.</p>
    </Collapse>
  </div>
</template>

<style>
.collapse {
  transition: height var(--vc-auto-duration) cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
```

## Example - Accordion

```vue
<script setup>
import { reactive } from 'vue'
import { Collapse } from 'vue-collapsed'

const questions = reactive([
  {
    title: 'Question one',
    answer: 'Answer one',
    isExpanded: false // Initial value
  },
  {
    title: 'Question two',
    answer: 'Answer two',
    isExpanded: false
  },
  {
    title: 'Question three',
    answer: 'Answer three',
    isExpanded: false
  }
])

function handleAccordion(selectedIndex) {
  questions.forEach((_, index) => {
    questions[index].isExpanded = index === selectedIndex ? !questions[index].isExpanded : false
    /**
     *
     * For individual control use;
     *
     * function handleMultiple(index) {
     *   questions[index].isExpanded = !questions[index].isExpanded
     * }
     */
  })
}
</script>

<template>
  <div v-for="(question, index) in questions" :key="question.title">
    <button @click="() => handleAccordion(index)">
      {{ question.title }}
    </button>
    <Collapse :when="questions[index].isExpanded" class="collapse">
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

## Callbacks

```vue
<script setup>
// ...

const sectionsRef = ref([])

function pushToRef(ref) {
  sectionsRef.value.push(ref)
}

function scrollIntoView(index) {
  sectionsRef.value[index].scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div v-for="(question, index) in questions" :key="question.title" :ref="pushToRef">
    <button @click="() => handleAccordion(index)">
      {{ question.title }}
    </button>
    <Collapse
      :when="questions[index].isExpanded"
      :onExpanded="() => scrollIntoView(index)"
      class="collapse"
    >
      <p>
        {{ question.answer }}
      </p>
    </Collapse>
  </div>
</template>
```

## Make it accessible

```vue
<script setup>
import { ref, computed } from 'vue'
import { Collapse } from 'vue-collapsed'

const isOpen = ref(false)

const toggleAttrs = computed(() => ({
  'aria-expanded': isOpen.value,
  'aria-controls': 'my-collapse-id'
}))

const collapseAttrs = {
  id: 'my-collapse-id',
  role: 'region'
}

function handleCollapse() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <button v-bind="toggleAttrs" @click="handleCollapse">This a panel.</button>
    <Collapse v-bind="collapseAttrs" :when="isOpen" class="collapse">
      <p>This is a paragraph.</p>
    </Collapse>
  </div>
</template>
```

## License

MIT Licensed. (c) Simone Mastromattei 2022.
