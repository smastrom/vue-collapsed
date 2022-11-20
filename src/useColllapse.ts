import {
	onBeforeUnmount,
	onMounted,
	reactive,
	ref,
	watch,
	type ComputedRef,
	type CSSProperties,
	type HTMLAttributes,
	type VNodeRef,
} from 'vue';

const nextFrame = typeof window !== 'undefined' ? requestAnimationFrame : () => {};

const idleStyles: CSSProperties = { padding: 0 };
const collapsedStyles: CSSProperties = { display: 'none', ...idleStyles };
const performanceStyles: CSSProperties = {
	willChange: 'auto',
	transform: 'translate3d(0, 0, 0)',
};
const hiddenStyles: CSSProperties = {
	overflow: 'hidden',
	height: 0,
};

type Bindings = { ref: VNodeRef; style: CSSProperties };

export function useCollapse(
	isExpanding: ComputedRef<boolean>,
	onExpanded: () => void = () => {},
	onCollapsed: () => void = () => {}
): HTMLAttributes {
	const collapseRef = ref<VNodeRef | null>(null);

	const collapseProps = reactive<Bindings>({
		ref: (thisRef) => (collapseRef.value = thisRef),
		style: !isExpanding.value ? collapsedStyles : idleStyles,
	});

	onMounted(() => {
		collapseRef.value?.addEventListener('transitionend', onTransitionEnd);
	});

	watch(
		() => isExpanding.value,
		(isExpanding) => {
			if (collapseRef.value) {
				requestAnimationFrame(() => {
					if (isExpanding) {
						/**
						 * At this point CSS height is set to 'auto' and display to 'none'.
						 * In order to get the scrollHeight to trigger the transition,
						 * we get rid of display: none by replacing the styles.
						 *
						 * We set the height to zero as it will be the property we will
						 * transition from and also to avoid the element being visible for
						 * the duration of this frame.
						 */
						collapseProps.style = {
							...performanceStyles,
							...hiddenStyles,
						};
						nextFrame(() => {
							/**
							 * Set the height to scrollHeight and trigger the transition.
							 */
							collapseProps.style = {
								...collapseProps.style,
								...getExpandedStyles(collapseRef.value.scrollHeight),
							};
						});
					} else {
						/**
						 * At this point CSS height property is set to 'auto'.
						 * Since the element is visible we get the scrollHeight
						 * and set it as height.
						 */
						collapseProps.style = {
							...performanceStyles,
							...getExpandedStyles(collapseRef.value.scrollHeight),
						};
						nextFrame(() => {
							/**
							 * Set the height to 0 and trigger the transition.
							 */
							collapseProps.style = {
								...collapseProps.style,
								...hiddenStyles,
							};
						});
					}
				});
			}
		}
	);

	onBeforeUnmount(() => {
		collapseRef.value?.removeEventListener('transitionend', onTransitionEnd);
	});

	function onTransitionEnd(event: TransitionEvent) {
		if (event.target === collapseRef.value && event.propertyName === 'height') {
			/**
			 * Reset styles to the initial state (same as onMounted),
			 * we also make sure this callback is triggered only when transitions
			 * are 100% finished.
			 */
			if (isExpanding.value) {
				if (
					collapseRef.value.scrollHeight === parseFloat((event.target as HTMLElement).style.height)
				) {
					collapseProps.style = idleStyles;
					onExpanded();
				}
			} else {
				if (collapseRef.value.style.height === '0px') {
					collapseProps.style = collapsedStyles;
					onCollapsed();
				}
			}
		}
	}

	return collapseProps;
}

function getExpandedStyles(height: number) {
	return {
		'--vc-auto-duration': `${getAutoDuration(height)}ms`,
		height: `${height}px`,
	};
}

/**
 * This has been slightly increased from the original implementation
 *
 * https://github.com/mui/material-ui/blob/master/packages/mui-material/src/styles/createTransitions.js#L35
 */

function getAutoDuration(height: number) {
	if (!height) {
		return 0;
	}

	const constant = height / 36;
	return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 12.5);
}
