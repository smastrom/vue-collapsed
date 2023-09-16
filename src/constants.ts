export const AUTO_DUR_VAR = '--vc-auto-duration'

export const DEFAULT_TRANSITION = `height var(${AUTO_DUR_VAR}) cubic-bezier(0.33, 1, 0.68, 1)`

export const SAFE_STYLES = { padding: 0 } as const

export const FALLBACK_DURATION = 300

export const VISUALLY_HIDDEN = {
   position: 'absolute',
   width: '1px',
   height: '1px',
   padding: '0',
   margin: '-1px',
   overflow: 'hidden',
   clip: 'rect(0, 0, 0, 0)',
   whiteSpace: 'nowrap',
   border: '0',
} as const
