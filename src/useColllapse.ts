import { ref, watch, type Ref, type ComputedRef, type CSSProperties as CSS } from 'vue';

type UseCollapseOptions = {
	isExpanded: ComputedRef<boolean>;
	onExpanded?: () => void;
	onCollapsed?: () => void;
};

type UseCollapseReturn = {
	style: Ref<CSS>;
	onTransitionEnd: (event: TransitionEvent) => void;
};

const nextFrame = typeof window !== 'undefined' ? requestAnimationFrame : () => {};

const fixedStyles: CSS = { padding: 0, border: 0 };
const collapsedStyles: CSS = { display: 'none', ...fixedStyles };
const performanceStyles: CSS = {
	willChange: 'height',
};
const hiddenStyles: CSS = {
	overflow: 'hidden',
	height: 0,
};

export function useCollapse(
	collapseRef: Ref<HTMLElement | null>,
	{ isExpanded, onExpanded = () => {}, onCollapsed = () => {} }: UseCollapseOptions
): UseCollapseReturn {
	const style = ref<CSS>(!isExpanded.value ? collapsedStyles : fixedStyles);

	watch(
		() => isExpanded.value,
		(isExpanded) => {
			if (collapseRef.value) {
				requestAnimationFrame(() => {
					if (isExpanded) {
						/**
						 * At this point CSS height is set to 'auto' and display to 'none'.
						 * In order to get the scrollHeight to trigger the transition,
						 * we get rid of display: none by replacing the styles.
						 *
						 * We set the height to zero as it will be the property we will
						 * transition from and also to avoid the element being visible for
						 * the duration of this frame.
						 */
						style.value = {
							...fixedStyles,
							...performanceStyles,
							...hiddenStyles,
						};
						nextFrame(() => {
							/**
							 * Set the height to scrollHeight and trigger the transition.
							 */
							style.value = {
								...style.value,
								...getHeightStyles(collapseRef.value?.scrollHeight),
							};
						});
					} else {
						/**
						 * At this point CSS height property is set to 'auto'.
						 * Since the element is visible we get the scrollHeight
						 * and set it as height.
						 */
						style.value = {
							...style.value,
							...performanceStyles,
							...getHeightStyles(collapseRef.value?.scrollHeight),
						};
						nextFrame(() => {
							/**
							 * Set the height to 0 and trigger the transition.
							 */
							style.value = {
								...style.value,
								...hiddenStyles,
							};
						});
					}
				});
			}
		}
	);

	function onTransitionEnd(event: TransitionEvent) {
		if (event.target === collapseRef.value && event.propertyName === 'height') {
			/**
			 * Reset styles to the initial ref state,
			 * we also make sure this callback is triggered only when transitions
			 * are 100% finished.
			 */
			if (isExpanded.value) {
				if (
					collapseRef.value?.scrollHeight === parseFloat((event.target as HTMLElement).style.height)
				) {
					style.value = fixedStyles;
					onExpanded();
				}
			} else {
				if (collapseRef.value?.style.height === '0px') {
					style.value = collapsedStyles;
					onCollapsed();
				}
			}
		}
	}

	return {
		style,
		onTransitionEnd,
	};
}

function getHeightStyles(height = 0) {
	return {
		'--vc-auto-duration': `${getAutoDuration(height)}ms`,
		height: `${height}px`,
	};
}

/**
 * Forked from:
 * https://github.com/mui/material-ui/blob/master/packages/mui-material/src/styles/createTransitions.js#L35
 */

function getAutoDuration(height = 0) {
	if (height === 0) {
		return 0;
	}

	const constant = height / 36;
	return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
