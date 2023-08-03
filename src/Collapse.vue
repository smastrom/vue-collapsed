<script lang="ts">
import { defineComponent } from 'vue'

defineComponent({
   inheritAttrs: true,
})
</script>

<script setup lang="ts">
import {
   computed,
   ref,
   watch,
   toRef,
   shallowRef,
   onMounted,
   type Component,
   type CSSProperties as CSS,
} from 'vue'

import { SAFE_STYLES as safeStyles, VISUALLY_HIDDEN, AUTO_DUR_VAR } from './constants'
import { getTransition, getHeight, getAutoDuration, isReducedOrDisaled } from './utils'

export type TransitionState = 'expanding' | 'expanded' | 'collapsing' | 'collapsed'

const props = withDefaults(
   defineProps<{
      when: boolean
      baseHeight?: number
      as?: keyof HTMLElementTagNameMap
   }>(),
   { baseHeight: 0, as: 'div' }
)

const emit = defineEmits<{
   (e: 'collapse'): void
   (e: 'expand'): void
   (e: 'collapsed'): void
   (e: 'expanded'): void
}>()

defineSlots<{
   default({ state }: { state: TransitionState }): Component
}>()

// Props

const isExpanded = toRef(props, 'when')
const baseHeight = toRef(props, 'baseHeight')

// Computed from props

const baseHeightStyles = computed(() => ({ overflow: 'hidden', height: `${baseHeight.value}px` }))
const collapsedStyles = computed(() => ({
   ...safeStyles,
   ...(baseHeight.value === 0 ? { display: 'none' } : baseHeightStyles.value),
}))

// State

const collapseRef = ref<HTMLElement | null>(null)

const state = ref<TransitionState>(isExpanded.value ? 'expanded' : 'collapsed')
const style = shallowRef<CSS>({})

const autoDuration = ref(300)
const autoDurationVar = computed(() => ({ [AUTO_DUR_VAR]: `${autoDuration.value}ms` }))

function onExpanded() {
   style.value = safeStyles
   state.value = 'expanded'
   emit('expanded')
}

function onCollapsed() {
   style.value = collapsedStyles.value
   state.value = 'collapsed'
   emit('collapsed')
}

// Lifecycle / Watchers

onMounted(() => {
   if (!collapseRef.value) return
   if (!isExpanded.value && baseHeight.value === 0) style.value = VISUALLY_HIDDEN

   autoDuration.value = getAutoDuration(collapseRef.value.scrollHeight - baseHeight.value)
   style.value = isExpanded.value ? safeStyles : collapsedStyles.value
})

watch(isExpanded, (isExpanding) => {
   if (isExpanding) {
      if (isReducedOrDisaled(collapseRef.value)) return onExpanded()

      /**
       * If baseHeight === 0, at this point CSS height is set to
       * 'auto' and display to 'none'.
       *
       * In order to get the scrollHeight to trigger the transition,
       * we get rid of display: none by replacing the styles.
       *
       * We set the height to baseHeight as it is the 'current' height
       * we are transitioning from.
       */
      state.value = 'expanding'
      emit('expand')

      style.value = {
         ...safeStyles,
         ...baseHeightStyles.value,
         ...autoDurationVar.value,
         willChange: 'height',
      }

      requestAnimationFrame(() => {
         /** Set height to scrollHeight and trigger the transition. */
         style.value = {
            ...style.value,
            ...getHeight(collapseRef.value),
            ...getTransition(collapseRef.value),
         }
      })
   } else {
      if (isReducedOrDisaled(collapseRef.value)) return onCollapsed()

      /**
       * At this point CSS height property is set to 'auto'
       * and auto duration is already stored.
       *
       * Since the element is visible we get the 'current'
       * expanded height (scrollHeight) and set it as height.
       */
      state.value = 'collapsing'
      emit('collapse')

      style.value = {
         ...style.value,
         ...autoDurationVar.value,
         ...getHeight(collapseRef.value),
         willChange: 'height',
      }

      requestAnimationFrame(() => {
         /** Set height to baseHeight and trigger the transition. */
         style.value = {
            ...style.value,
            ...baseHeightStyles.value,
            ...getTransition(collapseRef.value),
         }
      })
   }
})

watch(baseHeight, (newBaseHeight) => {
   if (!isExpanded.value) {
      style.value = {
         ...style.value,
         /**
          * Disable transitions when baseHeight changes on
          * collapsed state in case users are using a rective value.
          *
          * Below styles are going to be replaced on next expand.
          */
         ...(newBaseHeight === 0
            ? { display: 'none' }
            : { transition: 'none', height: `${newBaseHeight}px` }),
      }
   }
})

// Event handlers

function onTransitionEnd(event: TransitionEvent) {
   if (event.target === collapseRef.value && event.propertyName === 'height') {
      /**
       * Reset styles to the initial style state,
       * we also make sure callbacks are triggered only once
       * when transitions are 100% finished.
       */
      if (isExpanded.value) {
         if (
            collapseRef.value?.scrollHeight ===
            parseFloat((event.target as HTMLElement).style.height)
         ) {
            onExpanded()
         }
      } else {
         if (collapseRef.value?.style.height === `${baseHeight.value}px`) {
            onCollapsed()
         }
      }
   }
}
</script>

<template>
   <Component
      :is="props.as"
      ref="collapseRef"
      :style="style"
      @transitionend="onTransitionEnd"
      :data-collapse="state"
   >
      <slot v-bind="{ state }" />
   </Component>
</template>
