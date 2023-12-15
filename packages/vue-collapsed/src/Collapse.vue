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

import { SAFE_STYLES, VISUALLY_HIDDEN, AUTO_DUR_VAR, FALLBACK_DURATION } from './constants'
import {
   getTransitionProp,
   getComputedHeight,
   getHeightProp,
   getAutoDuration,
   isReducedOrDisabled,
} from './utils'

export type TransitionState = 'expanding' | 'expanded' | 'collapsing' | 'collapsed'

defineOptions({
   inheritAttrs: true,
})

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
   ...SAFE_STYLES,
   ...(baseHeight.value === 0 ? { display: 'none' } : baseHeightStyles.value),
}))

// State

const collapseRef = ref<HTMLElement | null>(null)

const state = ref<TransitionState>(isExpanded.value ? 'expanded' : 'collapsed')
const setState = (newState: TransitionState) => (state.value = newState)

const style = shallowRef<CSS>({})
const replaceStyles = (newStyles: CSS) => (style.value = newStyles)
const addStyles = (newStyles: CSS) => replaceStyles({ ...style.value, ...newStyles })

const autoDuration = ref(FALLBACK_DURATION)
const setAutoDuration = (newDuration: number) => (autoDuration.value = newDuration)

const autoDurationVar = computed(() => ({ [AUTO_DUR_VAR]: `${autoDuration.value}ms` }))

function onExpanded() {
   replaceStyles(SAFE_STYLES)
   setState('expanded')
   emit('expanded')
}

function onCollapsed() {
   replaceStyles(collapsedStyles.value)
   setState('collapsed')
   emit('collapsed')
}

// Lifecycle / Watchers

function initStyles() {
   if (!isExpanded.value && baseHeight.value === 0) return VISUALLY_HIDDEN
}

onMounted(() => {
   if (!collapseRef.value) return
   if (!isExpanded.value && baseHeight.value === 0) replaceStyles(VISUALLY_HIDDEN)

   const _autoDuration = getAutoDuration(collapseRef.value.scrollHeight - baseHeight.value)

   /**
    * Autoduration cannot be calculated if collapseRef or any ancestor
    * has 'display:none' on mount. In this case we cast it to 300ms.
    */
   setAutoDuration(_autoDuration <= 0 ? FALLBACK_DURATION : _autoDuration)
   replaceStyles(isExpanded.value ? SAFE_STYLES : collapsedStyles.value)
})

watch(isExpanded, (isExpanding) => {
   if (isExpanding) {
      if (isReducedOrDisabled(collapseRef)) return onExpanded()

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

      setState('expanding')
      emit('expand')

      replaceStyles({
         ...SAFE_STYLES,
         ...baseHeightStyles.value,
         ...autoDurationVar.value,
      })

      requestAnimationFrame(() => {
         /** Set height to scrollHeight and trigger the transition. */
         addStyles({
            ...getHeightProp(collapseRef),
            ...getTransitionProp(collapseRef),
            willChange: 'height',
         })
      })
   } else {
      if (isReducedOrDisabled(collapseRef)) return onCollapsed()

      /**
       * At this point CSS height property is set to 'auto'
       * and auto duration is already stored.
       *
       * Since the element is visible we get the 'current'
       * expanded height (scrollHeight) and set it as height.
       */
      setState('collapsing')
      emit('collapse')

      addStyles({
         ...autoDurationVar.value,
         ...getHeightProp(collapseRef),
      })

      requestAnimationFrame(() => {
         /** Set height to baseHeight and trigger the transition. */
         addStyles({
            ...baseHeightStyles.value,
            ...getTransitionProp(collapseRef),
            willChange: 'height',
         })
      })
   }
})

// If while collapsed, baseHeight dynamically changes
watch(baseHeight, (newBaseHeight) => {
   if (!isExpanded.value) {
      if (newBaseHeight > 0) {
         addStyles({ display: undefined, height: `${newBaseHeight}px` })
      } else {
         addStyles({ display: 'none' })
      }
   }
})

// Event handlers

function onTransitionEnd(e: TransitionEvent) {
   if (e.target === collapseRef.value && e.propertyName === 'height') {
      /**
       * Reset styles to the initial style state,
       * we also make sure callbacks are triggered only once
       * when transitions are 100% finished.
       */
      if (isExpanded.value) {
         if (collapseRef.value?.scrollHeight === getComputedHeight(collapseRef)) {
            onExpanded()
         }
      } else {
         if (baseHeight.value === getComputedHeight(collapseRef)) {
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
