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

/**
 * Styles applied in order to trigger both expanding and collapsing transitions.
 *
 * - Expand - applied in the previous frame that triggers the transition.
 * - Collapse - applied in the same frame that triggers the transition.
 */
const baseHeightStyles = computed(() => ({ overflow: 'hidden', height: `${baseHeight.value}px` }))

/**
 * Styles applied when the element is collapsed, either on initial render
 * or when the transition is finished.
 */
const collapsedStyles = computed(() => ({
   ...SAFE_STYLES,
   ...(baseHeight.value === 0 ? { display: 'none' } : baseHeightStyles.value),
}))

// State

const collapseRef = ref<HTMLElement | null>(null)

const state = ref<TransitionState>(isExpanded.value ? 'expanded' : 'collapsed')
const setState = (newState: TransitionState) => (state.value = newState)

function getInitialRenderStyles(): CSS {
   if (!isExpanded.value) {
      /**
       * If collapse should be rendered with display: none, hide it in a way that
       * we can access the scrollHeight in an 'onMounted' hook to calculate the autoDuration.
       */
      if (baseHeight.value === 0) return VISUALLY_HIDDEN

      /**
       * If baseHeight > 0, element is not rendered with display: none
       * and the autoDuration will be calculated smoothly in the 'onMounted' hook.
       * In this case we can already apply the collapsed styles.
       */
      return collapsedStyles.value
   }

   return SAFE_STYLES // ...if expanded, just force the padding to be 0
}

const style = shallowRef<CSS>(getInitialRenderStyles())
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

// Auto duration

onMounted(() => {
   if (!collapseRef.value) return
   const _autoDuration = getAutoDuration(collapseRef.value.scrollHeight - baseHeight.value)

   /**
    * Autoduration cannot be calculated if any ancestor of the collapse has 'display:none' on mount.
    * In this case 0 is returned from 'getAutoDuration'. The autoduraion will fallback to the initial ref value.
    */
   if (_autoDuration > 0) setAutoDuration(_autoDuration)

   /**
    * Now we're ready to set the collapsedStyles (display: none) and get rid of VISUALLY_HIDDEN.
    */
   if (!isExpanded.value && baseHeight.value === 0) replaceStyles(collapsedStyles.value)
})

// Collapse / Expand handler

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

// Transition events

function onTransitionEnd(e: TransitionEvent) {
   if (e.target && e.target === collapseRef.value && e.propertyName === 'height') {
      /**
       * Reset styles to the initial style state,
       * we also make sure callbacks are triggered only once
       * when transitions are 100% finished.
       */
      if (isExpanded.value) {
         if (Math.abs(collapseRef.value.scrollHeight - getComputedHeight(collapseRef)) < 1) {
            onExpanded()
         }
      } else {
         if (Math.abs(collapseRef.value.scrollHeight - baseHeight.value) < 1) {
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
