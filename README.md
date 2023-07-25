![npm](https://img.shields.io/npm/v/vue-collapsed?color=46c119) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-collapsed/tests.yml?branch=main&label=tests) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-collapsed?color=success)
![dependency-count](https://img.shields.io/badge/dependency%20count-0-success)

# Vue Collapsed

Dynamic CSS height transition from _any to auto_ and vice versa. Accordion ready.

[Examples and Demo](https://vue-collapsed.netlify.com) - [Stackblitz](https://stackblitz.com/edit/vue-dmjqey?file=src/App.vue)

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

| Name         | Description                              | Type                          | Required           |
| ------------ | ---------------------------------------- | ----------------------------- | ------------------ |
| `when`       | Value to control collapse                | boolean                       | :white_check_mark: |
| `baseHeight` | Collapsed height in px, defaults to `0`. | number                        | :x:                |
| `as`         | Tag to use instead of `div`              | _keyof_ HTMLElementTagNameMap | :x:                |

## Emits

| Name         | Description                   | Type       |
| ------------ | ----------------------------- | ---------- |
| `@expand`    | Expand transition start       | () => void |
| `@expanded`  | Expand transition completed   | () => void |
| `@collapse`  | Collapse transition start     | () => void |
| `@collapsed` | Collapse transition completed | () => void |

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Collapse } from 'vue-collapsed'

const isExpanded = ref(false)
</script>

<template>
  <button @click="isExpanded = !isExpanded">Trigger</button>

  <Collapse :when="isExpanded">
    <p>This is a paragraph.</p>
  </Collapse>
</template>
```

## Automatic transition (default behavior)

By default, if no height transition is specified the following one is automatically added to the Collapse element:

`height var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1)`

`--vc-auto-duration` is calculated in background and corresponds to an optimal transition duration based on your content height.

This is the recommended way to use this package unless you need something more specific.

## Custom transition

If you prefer to use a custom duration or easing, add a class to Collapse that transitions the `height` property:

```vue
<Collapse :when="isExpanded" class="v-collapse">
  <p>This is a paragraph.</p>
</Collapse>
```

```css
.v-collapse {
  transition: height 300ms ease-out;
  /* or transition: height var(--vc-auto-duration) ease-in-out */
}
```

:bulb: Use [calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) to control the speed while keeping the ratio, _e.g. `calc(var(--vc-auto-duration) * 0.75)`_.

:bulb: Find a full list of easings at [easings.net](https://easings.net).

### Multiple transitions

To transition other properties use the attribute `data-collapse`:

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
  {{ state === 'collapsing' ? 'Collapsing the content...' : null }}
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
    <Collapse :when="questions[index].isExpanded">
      <p>
        {{ question.answer }}
      </p>
    </Collapse>
  </div>
</template>
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
    <Collapse :when="questions[index].isExpanded" @expanded="() => scrollIntoView(index)">
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
    <Collapse v-bind="collapseAttrs" :when="isExpanded" class="collapse-reduced">
      <p>This is a paragraph.</p>
    </Collapse>
  </div>
</template>

<style>
@media (prefers-reduced-motion: reduce) {
  .collapse-reduced {
    transition-duration: 1ms !important;
  }
}
</style>
```

## License

MIT
