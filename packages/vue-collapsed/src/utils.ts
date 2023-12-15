import { DEFAULT_TRANSITION } from './constants'

import type { Ref } from 'vue'

type RefEl = Ref<HTMLElement | null>

export function getComputedHeight(el: RefEl) {
   if (!el.value) return 0
   return parseFloat(getComputedStyle(el.value).height)
}

export function getHeightProp(el: RefEl) {
   return {
      height: `${el.value?.scrollHeight || 0}px`,
   }
}

export function getTransitionProp(el: RefEl) {
   if (!el.value) return {}

   const { transition } = getComputedStyle(el.value)

   // If transition is not defined, return the default one
   if (transition === 'all 0s ease 0s') return { transition: DEFAULT_TRANSITION }

   return { transition }
}

export function isReducedOrDisabled(el: RefEl) {
   if (!el.value) return true

   const { transition } = getComputedStyle(el.value)

   return (
      typeof window.requestAnimationFrame === 'undefined' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      transition.includes('none') ||
      transition.includes('height 0s')
   )
}

/**
 * Forked from:
 * https://github.com/mui/material-ui/blob/master/packages/mui-material/src/styles/createTransitions.js#L35
 */
export function getAutoDuration(height = 0) {
   if (height === 0) return 0

   const constant = height / 36
   const autoDuration = Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)

   return Number.isFinite(autoDuration) ? autoDuration : 0
}
