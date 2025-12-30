![npm](https://img.shields.io/npm/v/vue-collapsed?color=46c119) ![dependencies](https://img.shields.io/badge/dependencies-0-success) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-collapsed?color=success) ![downloads](https://img.shields.io/npm/dm/vue-collapsed) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/vue-collapsed/chrome-tests.yml?branch=main&label=tests)

# Vue Collapsed

Dynamic CSS height transition from _any value to auto_ and vice versa. Accordion-ready.

[Examples and Demo](https://vue-collapsed.pages.dev) - [Stackblitz](https://stackblitz.com/edit/vue-dmjqey?file=src/App.vue)

## Installation

```shell
npm i vue-collapsed
```

## Usage

```vue
<script setup>
import { ref } from 'vue'

import { Collapse } from 'vue-collapsed'

const isExpanded = ref(false)
</script>

<template>
  <button @click="isExpanded = !isExpanded">Toggle</button>

  <Collapse :when="isExpanded">
    <p>{{ 'Collapsed '.repeat(100) }}</p>
  </Collapse>
</template>
```

## Props

| Name         | Type                          | Description                              | Required           |
| ------------ | ----------------------------- | ---------------------------------------- | ------------------ |
| `when`       | boolean                       | Controls the collapse/expand state       | :white_check_mark: |
| `baseHeight` | number                        | Collapsed height in px. Defaults to `0`. | :x:                |
| `as`         | _keyof_ HTMLElementTagNameMap | Tag to use instead of `div`              | :x:                |

## Emits

| Name         | Type       | Description                      |
| ------------ | ---------- | -------------------------------- |
| `@expand`    | () => void | Emitted when expansion starts    |
| `@expanded`  | () => void | Emitted when expansion completes |
| `@collapse`  | () => void | Emitted when collapse starts     |
| `@collapsed` | () => void | Emitted when collapse completes  |

## Automatic transition (default)

By default, the following transition is always added to the `Collapse` element:

```css
transition: height var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1);
```

`--vc-auto-duration` is calculated dynamically and corresponds to the optimal transition duration based on the element's height.

## Custom transition

To use a custom duration or easing, add a class to the `Collapse` component that transitions the `height` property:

```css
.collapsed-area {
  transition: height 300ms ease-out;
}
```

```vue
<Collapse :when="isExpanded" class="collapsed-area">
  <p>{{ 'Collapsed '.repeat(100) }}</p>
</Collapse>
```

### Multiple transitions

To transition other properties, use the `data-collapse` attribute:

| Transition | From        | Enter        | Leave       |
| ---------- | ----------- | ------------ | ----------- |
| Expand     | `collapsed` | `expanding`  | `expanded`  |
| Collapse   | `expanded`  | `collapsing` | `collapsed` |

```css
.collapsed-area {
  --transition-base: 300ms cubic-bezier(0.33, 1, 0.68, 1);

  transition:
    height var(--transition-base),
    opacity var(--transition-base);
}

.collapsed-area[data-collapse='expanded'],
.collapsed-area[data-collapse='expanding'] {
  opacity: 1;
}

.collapsed-area[data-collapse='collapsed'],
.collapsed-area[data-collapse='collapsing'] {
  opacity: 0;
}
```

Alternatively, to use different easings or durations for expanding and collapsing:

```css
.collapsed-area[data-collapse='expanding'] {
  transition: height 600ms ease-in-out;
}

.collapsed-area[data-collapse='collapsing'] {
  transition: height 300ms ease-out;
}
```

The values of the `data-collapse` attribute can be accessed using `v-slot`:

```vue
<Collapse :when="isExpanded" v-slot="{ state }">
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

function onQuestionToggle(toggleIndex) {
  questions.forEach((_, i) => {
    questions[i].isExpanded = i === toggleIndex ? !questions[i].isExpanded : false
  })
}
</script>

<template>
  <div v-for="(q, i) in questions" :key="q.title">
    <button @click="onQuestionToggle(i)">
      {{ q.title }}
    </button>
    <Collapse :when="q.isExpanded">
      <p>
        {{ q.answer }}
      </p>
    </Collapse>
  </div>
</template>
```

## Accessibility

`vue-collapsed` automatically detects if users prefer reduced motion and disables transitions accordingly, while maintaining the same API behavior (emitting events and applying post-transition styles).

You should add `aria` attributes to the `Collapse` element based on your specific use case.

```vue
<script setup>
import { ref, computed, useId } from 'vue'
import { Collapse } from 'vue-collapsed'

const isExpanded = ref(false)

const TOGGLE_ID = useId()
const COLLAPSE_ID = useId()

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
    <button v-bind="toggleAttrs" @click="handleCollapse">Toggle panel</button>
    <Collapse v-bind="collapseAttrs" :when="isExpanded">
      <p>{{ 'Collapsed '.repeat(100) }}</p>
    </Collapse>
  </div>
</template>
```

## Manually disabling transitions

```vue
<template>
  <Collapse :when="isExpanded" class="collapsed-area">
    <p>{{ 'Collapsed '.repeat(100) }}</p>
  </Collapse>
</template>

<style>
.collapsed-area {
  transition: none;
}
</style>
```

## License

MIT
