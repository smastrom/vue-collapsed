![npm](https://img.shields.io/npm/v/vue-collapsed?color=46c119) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-collapsed/tests.yml?branch=main&label=tests) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-collapsed?color=success)
![dependency-count](https://img.shields.io/badge/dependency%20count-0-success)

# Vue Collapsed

Dynamic CSS height transition from _any to auto_ and vice versa. Accordion ready.

[Examples and Demo](https://vue-collapsed.netlify.com) - [Stackblitz](https://stackblitz.com/edit/vue-dmjqey?file=src/App.vue)

> :bulb: Requires Vue v3.0.0 or above.

<br />

Check out my other packages for Vue 3:

> 🔔 **Notivue**  
> _Fully-featured notification system for Vue and Nuxt._  
> [Visit repo ➔ ](https://github.com/smastrom/notivue)

> 🔥 **Vue Use Fixed Header**  
> _Turn your boring fixed header into a smart one with one line of code._  
> [Visit repo ➔ ](https://github.com/smastrom/vue-use-fixed-header)

> 👌 **Vue Use Active Scroll**  
> _Accurate TOC/sidebar links without compromises._  
> [Visit repo ➔ ](https://github.com/smastrom/vue-use-active-scroll)

<br />

## Installation

```shell
npm i -S vue-collapsed
# yarn add vue-collapsed
# pnpm add vue-collapsed
```

## Props

| name          | description                               | type                          | required           |
| ------------- | ----------------------------------------- | ----------------------------- | ------------------ |
| `when`        | Value to control collapse                 | boolean                       | :white_check_mark: |
| `baseHeight`  | Collapsed height in px, defaults to `0`.  | number                        | :x:                |
| `as`          | Tag to use instead of `div`               | _keyof_ HTMLElementTagNameMap | :x:                |
| `onExpand`    | Callback on expand transition start       | () => void                    | :x:                |
| `onExpanded`  | Callback on expand transition completed   | () => void                    | :x:                |
| `onCollapse`  | Callback on collapse transition start     | () => void                    | :x:                |
| `onCollapsed` | Callback on collapse transition completed | () => void                    | :x:                |

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Collapse } from 'vue-collapsed'

const isExpanded = ref(false)
</script>

<template>
  <button @click="isExpanded = !isExpanded">This a panel.</button>
  <Collapse :when="isExpanded" class="v-collapse">
    <p>This is a paragraph.</p>
  </Collapse>
</template>

<style>
.v-collapse {
  transition: height 300ms cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
```

## Auto Duration

Vue Collapsed automatically calculates the optimal duration according to the content height. Use it by referencing the variable `--vc-auto-duration`:

```css
.v-collapse {
  transition: height var(--vc-auto-duration) ease-out;
}
```

:bulb: Use [calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) to control the speed, _e.g. `calc(var(--vc-auto-duration) * 0.75)`_.

:bulb: Find a full list of easings at [easings.net](https://easings.net).

## Additional transitions/styles

To transition other properties or add granular styles use the attribute `data-collapse`:

| Transition | From        | Enter        | Leave       |
| ---------- | ----------- | ------------ | ----------- |
| Expand     | `collapsed` | `expanding`  | `expanded`  |
| Collapse   | `expanded`  | `collapsing` | `collapsed` |

```css
.v-collapse {
  --dur-easing: var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1);
  transition: height var(--dur-easing), opacity var(--dur-easing);
}

.v-collapse[data-collapse='expanded'],
.v-collapse[data-collapse='expanding'] {
  opacity: 1;
}

.v-collapse[data-collapse='collapsed'],
.v-collapse[data-collapse='collapsing'] {
  opacity: 0;
}
```

Above values can also be accessed using `v-slot`:

```vue
<Collapse :when="isExpanded" class="v-collapse" v-slot="{ state }">
  {{ state === 'collapsing' ? 'Collapsing...' : null }}
</Collapse>
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
  })
}

/**
 * For individual control you might use:
 *
 * function handleMultiple(index) {
 *   questions[index].isExpanded = !questions[index].isExpanded
 * }
 */
</script>

<template>
  <div v-for="(question, index) in questions" :key="question.title">
    <button @click="handleAccordion(index)">
      {{ question.title }}
    </button>
    <Collapse :when="questions[index].isExpanded" class="v-collapse">
      <p>
        {{ question.answer }}
      </p>
    </Collapse>
  </div>
</template>

<style>
.v-collapse {
  transition: height var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
```

## Example - Callbacks

```vue
<script setup>
// ...

const sectionsRef = ref([])

function scrollIntoView(index) {
  sectionsRef.value[index].scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div v-for="(question, index) in questions" :key="question.title" ref="sectionsRef">
    <button @click="handleAccordion(index)">
      {{ question.title }}
    </button>
    <Collapse
      :when="questions[index].isExpanded"
      :onExpanded="() => scrollIntoView(index)"
      class="v-collapse"
    >
      <p>
        {{ question.answer }}
      </p>
    </Collapse>
  </div>
</template>

<style>
.v-collapse {
  transition: height var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
```

## Make it accessible

```vue
<script setup>
import { ref, computed } from 'vue'
import { Collapse } from 'vue-collapsed'

const isExpanded = ref(false)

const toggleAttrs = computed(() => ({
  id: 'toggle-id',
  'aria-controls': 'collapse-id',
  'aria-expanded': isExpanded.value
}))

const collapseAttrs = {
  role: 'region',
  id: 'collapse-id',
  'aria-labelledby': 'toggle-id'
}

function handleCollapse() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div>
    <button v-bind="toggleAttrs" @click="handleCollapse">This a panel.</button>
    <Collapse v-bind="collapseAttrs" :when="isExpanded" class="v-collapse">
      <p>This is a paragraph.</p>
    </Collapse>
  </div>
</template>

<style>
.v-collapse {
  transition: height var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
```

## License

MIT
