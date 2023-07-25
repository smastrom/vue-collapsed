import { DEFAULT_TRANSITION } from './constants'

export function getHeight(el: HTMLElement | null) {
   return {
      height: `${el?.scrollHeight ?? 0}px`,
   }
}

export function getTransition(el: HTMLElement | null) {
   if (!el) return {}

   const { transition } = getComputedStyle(el)

   // If user didn't specified a transition, use the default one
   if (transition === 'all 0s ease 0s') return { transition: DEFAULT_TRANSITION }

   return { transition }
}

/**
 * Forked from:
 * https://github.com/mui/material-ui/blob/master/packages/mui-material/src/styles/createTransitions.js#L35
 */

export function getAutoDuration(height = 0) {
   if (height === 0) return 0

   const constant = height / 36
   return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}
