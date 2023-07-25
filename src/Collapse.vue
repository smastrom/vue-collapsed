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

import { BASE_STYLES } from './constants'
import { getTransition, getHeight, getAutoDuration } from './utils'

type TransitionState = 'expanding' | 'expanded' | 'collapsing' | 'collapsed'

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

const isExpanded = toRef(props, 'when')
const baseHeight = toRef(props, 'baseHeight')

const idleStyles = computed(() => ({ overflow: 'hidden', height: `${baseHeight.value}px` }))
const collapsedStyles = computed(() => ({
   ...BASE_STYLES,
   ...(baseHeight.value === 0 ? { display: 'none' } : idleStyles.value),
}))

const collapseRef = ref<HTMLElement | null>(null)
const autoDuration = ref(0)

const state = ref<TransitionState>(isExpanded.value ? 'expanded' : 'collapsed')
const style = shallowRef<CSS>(isExpanded.value ? BASE_STYLES : collapsedStyles.value)

function setAutoDuration() {
   if (!collapseRef.value) return

   if (isExpanded.value || baseHeight.value > 0) {
      autoDuration.value = getAutoDuration(collapseRef.value.scrollHeight - baseHeight.value)
   }
}

onMounted(setAutoDuration)

watch(isExpanded, (isExpanding) => {
   requestAnimationFrame(() => {
      if (isExpanding) {
         /**
          * When baseHeight > 0, on this frame nothing will happen
          * as the height is already set and the element is visible.
          *
          * If baseHeight === 0, at this point CSS height equals to
          * 'auto' and display to 'none'.
          *
          * In order to get the scrollHeight to trigger the transition,
          * we must get rid of display: none by replacing the styles.
          *
          * We set the height to 0 (baseHeight) as it is the 'current' height
          * we are transition from.
          */

         style.value = {
            ...BASE_STYLES,
            ...idleStyles.value,
            '--vc-auto-duration': `${autoDuration.value}ms`,
            willChange: 'height',
         }

         state.value = 'expanding'
         emit('expand')

         requestAnimationFrame(() => {
            /**
             * Set height to scrollHeight and trigger the transition.
             */

            if (autoDuration.value === 0) setAutoDuration() // If was hidden on mount, get auto duration...

            style.value = {
               ...style.value,
               '--vc-auto-duration': `${autoDuration.value}ms`, // ...and set it again.
               ...getHeight(collapseRef.value),
               ...getTransition(collapseRef.value),
            }
         })
      } else {
         /**
          * At this point CSS height property is set to 'auto'.
          *
          * Since the element is visible we get the 'current'
          * expanded height (scrollHeight) and set it as height.
          */

         style.value = {
            ...style.value,
            ...getHeight(collapseRef.value),
            '--vc-auto-duration': `${autoDuration.value}ms`,
            willChange: 'height',
         }

         state.value = 'collapsing'
         emit('collapse')

         requestAnimationFrame(() => {
            /**
             * Set height to baseHeight and trigger the transition.
             */
            style.value = {
               ...style.value,
               ...idleStyles.value,
               ...getTransition(collapseRef.value),
            }
         })
      }
   })
})

watch(baseHeight, (newBaseHeight) => {
   if (!isExpanded.value) {
      style.value = {
         ...style.value,
         /**
          * Disable transitions when baseHeight changes on
          * collapsed state to give a native responsive feel if using
          * reactive value on resize.
          *
          * Below styles are going to be replaced on next expand.
          */
         transitionDuration: '0s',
         height: `${newBaseHeight}px`,
      }
   }
})

function onTransitionEnd(event: TransitionEvent) {
   if (event.target === collapseRef.value && event.propertyName === 'height') {
      /**
       * Reset styles to the initial ref state,
       * we also make sure this callback is triggered only when transitions
       * are 100% finished.
       */
      if (isExpanded.value) {
         if (
            collapseRef.value?.scrollHeight ===
            parseFloat((event.target as HTMLElement).style.height)
         ) {
            style.value = BASE_STYLES

            state.value = 'expanded'
            emit('expanded')
         }
      } else {
         if (collapseRef.value?.style.height === `${baseHeight.value}px`) {
            style.value = collapsedStyles.value

            state.value = 'collapsed'
            emit('collapsed')
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
