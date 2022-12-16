import { ref, watch, computed, type Ref, type ComputedRef, type CSSProperties as CSS } from 'vue';

type UseCollapseOptions = {
	isExpanded: ComputedRef<boolean> | Ref<boolean>;
	baseHeight?: ComputedRef<number> | Ref<number>;
	onExpand?: () => void;
	onExpanded?: () => void;
	onCollapse?: () => void;
	onCollapsed?: () => void;
};

type TransitionState = 'expanding' | 'expanded' | 'collapsing' | 'collapsed';

type UseCollapseReturn = {
	style: Ref<CSS>;
	state: Ref<TransitionState>;
	onTransitionEnd: (event: TransitionEvent) => void;
};

const fixedStyles: CSS = { padding: 0, border: 0, margin: 0 };
const performanceStyles: CSS = {
	willChange: 'height',
};

export function useCollapse(
	collapseRef: Ref<HTMLElement | null>,
	{
		isExpanded,
		baseHeight = ref(0),
		onExpand = () => {},
		onExpanded = () => {},
		onCollapse = () => {},
		onCollapsed = () => {},
	}: UseCollapseOptions
): UseCollapseReturn {
	const collapseStyles = computed<Record<'visible' | 'collapsed', CSS>>(() => {
		const visible = {
			overflow: 'hidden',
			height: `${baseHeight.value}px`,
		};
		return {
			visible,
			collapsed: {
				...fixedStyles,
				...(baseHeight.value === 0 ? { display: 'none' } : visible),
			},
		};
	});

	const style = ref<CSS>(isExpanded.value ? fixedStyles : collapseStyles.value.collapsed);
	const state = ref<TransitionState>(isExpanded.value ? 'expanded' : 'collapsed');

	watch(
		() => isExpanded.value,
		(isExpanded) => {
			requestAnimationFrame(() => {
				if (isExpanded) {
					/**
					 * At this point CSS height is set to 'auto' and display to 'none'.
					 * In order to get the scrollHeight to trigger the transition,
					 * we get rid of display: none by replacing the styles.
					 *
					 * We set the height to baseHeight as it will be the property we will
					 * transition from and also to avoid the element being visible for
					 * the duration of this frame in case baseHeight equals to 0.
					 */
					style.value = {
						...fixedStyles,
						...performanceStyles,
						...collapseStyles.value.visible,
					};
					requestAnimationFrame(() => {
						/**
						 * Set the height to scrollHeight and trigger the transition.
						 */
						style.value = {
							...style.value,
							...getHeightStyles(collapseRef.value?.scrollHeight, baseHeight.value),
						};
						state.value = 'expanding';
						onExpand();
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
						...getHeightStyles(collapseRef.value?.scrollHeight, baseHeight.value),
					};
					requestAnimationFrame(() => {
						/**
						 * Set the height to baseHeight and trigger the transition.
						 */
						style.value = {
							...style.value,
							...collapseStyles.value.visible,
						};
						state.value = 'collapsing';
						onCollapse();
					});
				}
			});
		}
	);

	watch(
		() => baseHeight.value,
		(newbaseHeight) => {
			if (!isExpanded.value) {
				style.value = {
					...style.value,
					height: `${newbaseHeight}px`,
				};
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
					state.value = 'expanded';
					onExpanded();
				}
			} else {
				if (collapseRef.value?.style.height === `${baseHeight.value}px`) {
					style.value = collapseStyles.value.collapsed;
					state.value = 'collapsed';
					onCollapsed();
				}
			}
		}
	}

	return {
		style,
		state,
		onTransitionEnd,
	};
}

function getHeightStyles(height = 0, baseHeight = 0) {
	return {
		'--vc-auto-duration': `${getAutoDuration(height - baseHeight)}ms`,
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
