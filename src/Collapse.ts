import {
	computed,
	defineComponent,
	ref,
	h,
	watch,
	toRef,
	type PropType,
	type VNodeRef,
	type CSSProperties as CSS,
} from 'vue';

const callback = {
	type: Function as PropType<() => void>,
	required: false,
	default: () => {},
};

type TransitionState = 'expanding' | 'expanded' | 'collapsing' | 'collapsed';

const fixedStyles: CSS = { padding: 0, border: 0, margin: 0 };
const perfStyles: CSS = { willChange: 'height' };

export const Collapse = defineComponent({
	name: 'Collapse',
	inheritAttrs: true,
	emits: ['expand', 'expanded', 'collapse', 'collapsed'],
	props: {
		/** Boolean value to control collapse. */
		when: {
			type: Boolean,
			required: true,
		},
		/** Collapsed state height in px, defaults to `0`. */
		baseHeight: {
			type: Number,
			required: false,
			default: 0,
		},
		/** Element tag to use instead of `div`. */
		as: {
			type: String as PropType<keyof HTMLElementTagNameMap>,
			required: false,
			default: 'div',
		},
		/** Callback on expand transition start. */
		onExpand: callback,
		/** Callback on expand transition completed. */
		onExpanded: callback,
		/** Callback on collapse transition start. */
		onCollapse: callback,
		/** Callback on collapse transition completed. */
		onCollapsed: callback,
	},
	setup(props, { slots }) {
		const isExpanded = toRef(props, 'when');
		const baseHeight = toRef(props, 'baseHeight');

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

		const collapseRef = ref<VNodeRef | null>(null);
		const style = ref<CSS>(isExpanded.value ? fixedStyles : collapseStyles.value.collapsed);
		const state = ref<TransitionState>(isExpanded.value ? 'expanded' : 'collapsed');

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
					 * we are transition from. Overflow is hidden so users won't see any
					 * layout difference for the duration of this frame.
					 */
					style.value = {
						...fixedStyles,
						...perfStyles,
						...collapseStyles.value.visible,
					};
					requestAnimationFrame(() => {
						/**
						 * Set height to scrollHeight and trigger the transition.
						 */
						style.value = {
							...style.value,
							...getHeightStyles(collapseRef.value?.scrollHeight, baseHeight.value),
						};
						state.value = 'expanding';
						props.onExpand();
						this.$emit('expand');
					});
				} else {
					/**
					 * At this point CSS height property is set to 'auto'.
					 * Since the element is visible we get the 'current'
					 * expanded height (scrollHeight) and set it as height.
					 */
					style.value = {
						...style.value,
						...perfStyles,
						...getHeightStyles(collapseRef.value?.scrollHeight, baseHeight.value),
					};
					requestAnimationFrame(() => {
						/**
						 * Set height to baseHeight and trigger the transition.
						 */
						style.value = {
							...style.value,
							...collapseStyles.value.visible,
						};
						state.value = 'collapsing';
						props.onCollapse();
						this.$emit('collapse');
					});
				}
			});
		});

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
				};
			}
		});

		// "e" of "end" must be lowercase - https://vuejs.org/guide/extras/render-function.html#v-on
		function onTransitionend(event: TransitionEvent) {
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
						style.value = fixedStyles;
						state.value = 'expanded';
						props.onExpanded();
						this.$emit('expanded');
					}
				} else {
					if (collapseRef.value?.style.height === `${baseHeight.value}px`) {
						style.value = collapseStyles.value.collapsed;
						state.value = 'collapsed';
						props.onCollapsed();
						this.$emit('collapsed');
					}
				}
			}
		}

		return () =>
			h(
				props.as,
				{
					ref: (ref) => (collapseRef.value = ref),
					style: style.value,
					onTransitionend,
					'data-collapse': state.value,
				},
				slots.default?.({ state: state.value })
			);
	},
});

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
