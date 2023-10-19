![npm](https://img.shields.io/npm/v/vue-collapsed?color=46c119) ![dependencies](https://img.shields.io/badge/dependencies-0-success) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-collapsed?color=success) ![downloads](https://img.shields.io/npm/dm/vue-collapsed) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-collapsed/chrome-tests.yml?branch=main&label=tests)

# Vue Collapsed

Dynamic CSS height transition from _any to auto_ and vice versa. Accordion ready.

[Examples and Demo](https://vue-collapsed.netlify.com) - [Stackblitz](https://stackblitz.com/edit/vue-dmjqey?file=src/App.vue)

<br />

Check out my other packages for Vue 3:

> 🔔 **Notivue**  
> _Fully-featured notification system for Vue and Nuxt._  
> [Visit repo ➔ ](https://github.com/smastrom/notivue)

> 👌 **Vue Use Active Scroll**  
> _Accurate TOC/sidebar links without compromises._  
> [Visit repo ➔ ](https://github.com/smastrom/vue-use-active-scroll)

<br />

## Installation

```shell
npm i vue-collapsed
# yarn add vue-collapsed
# pnpm add vue-collapsed
# bun add vue-collapsed
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
    <p>{{ 'Collapsed '.repeat(100) }}</p>
  </Collapse>
</template>
```

## Automatic transition (default behavior)

By default, if no height transition is specified the following one is automatically added to the Collapse element:

`height var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1)`

`--vc-auto-duration` is calculated in background and corresponds to an optimal transition duration based on your content height.

This is the recommended way to use this package unless you want to customize the transition.

## Custom transition

If you prefer to use a custom duration or easing, add a class to Collapse that transitions the `height` property:

```vue
<Collapse :when="isExpanded" class="v-collapse">
  <p>{{ 'Collapsed '.repeat(100) }}</p>
</Collapse>
```

```css
.v-collapse {
  transition: height 300ms ease-out;
  /* or transition: height var(--vc-auto-duration) ease-in-out */
}
```

### Multiple transitions

To transition other properties use the attribute `data-collapse`:

| Transition | From        | Enter        | Leave       |
| ---------- | ----------- | ------------ | ----------- |
| Expand     | `collapsed` | `expanding`  | `expanded`  |
| Collapse   | `expanded`  | `collapsing` | `collapsed` |

```css
.v-collapse {
  --dur-easing: var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1);
  transition:
    height var(--dur-easing),
    opacity var(--dur-easing);
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

Or to use different easings/durations for expand and collapse:

```css
.v-collapse[data-collapse='expanding'] {
  transition: height 600ms ease-in-out;
}

.v-collapse[data-collapse='collapsing'] {
  transition: height 300ms ease-out;
}
```

Above values can also be accessed using `v-slot`:

```vue
<Collapse :when="isExpanded" class="v-collapse" v-slot="{ state }">
  {{ state === 'collapsing' ? 'Collapsing content...' : null }}
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

## Accessibility

`vue-collapsed` automatically detects if users prefer reduced motion and will disable transitions accordingly while keeping the same API behavior (emitting events and post-transition styles).

You should only add `aria` attributes to the Collapse element according to your use case.

```vue
<script setup>
import { ref, computed } from 'vue'
import { Collapse } from 'vue-collapsed'

const isExpanded = ref(false)

const TOGGLE_ID = 'toggle-id'
const COLLAPSE_ID = 'collapse-id'

const toggleAttrs = computed(() => ({
  id: TOGGLE_ID,
  'aria-controls': COLLAPSE_ID,
  'aria-expanded': isExpanded.value
}))

const collapseAttrs = {
  role: 'region',
  id: COLLAPSE_ID,
  'aria-labelledby': TOGGLE_ID
}

function handleCollapse() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div>
    <button v-bind="toggleAttrs" @click="handleCollapse">This a panel.</button>
    <Collapse v-bind="collapseAttrs" :when="isExpanded">
      <p>{{ 'Collapsed '.repeat(100) }}</p>
    </Collapse>
  </div>
</template>
```

## Manually disabling transitions

```vue
<template>
  <Collapse :when="isExpanded" class="instant-collapse">
    <p>{{ 'Collapsed '.repeat(100) }}</p>
  </Collapse>
</template>

<style>
.instant-collapse {
  transition: none;
}
</style>
```

## License

MIT
