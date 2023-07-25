export function getHeightStyles(height = 0, baseHeight = 0) {
   return {
      '--vc-auto-duration': `${getAutoDuration(height - baseHeight)}ms`,
      height: `${height}px`,
   }
}

/**
 * Forked from:
 * https://github.com/mui/material-ui/blob/master/packages/mui-material/src/styles/createTransitions.js#L35
 */

function getAutoDuration(height = 0) {
   if (height === 0) {
      return 0
   }

   const constant = height / 36
   return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}
