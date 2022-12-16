import { computed, defineComponent, ref, h, type PropType, type VNodeRef } from 'vue';
import { useCollapse } from './useColllapse';

const callback = {
	type: Function as PropType<() => void>,
	required: false,
	default: () => {},
};

export const Collapse = defineComponent({
	name: 'Collapse',
	inheritAttrs: true,
	props: {
		/** Boolean value to control collapse. */
		when: {
			type: Boolean as PropType<boolean>,
			required: true,
		},
		/** Collapsed state height in px, defaults to `0`. */
		baseHeight: {
			type: Number as PropType<number>,
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
	setup(props) {
		const collapseRef = ref<VNodeRef | null>(null);

		const { style, state, onTransitionEnd } = useCollapse(collapseRef, {
			isExpanded: computed(() => props.when),
			baseHeight: computed(() => props.baseHeight),
			onExpand: props.onExpand,
			onExpanded: props.onExpanded,
			onCollapse: props.onCollapse,
			onCollapsed: props.onCollapsed,
		});

		function pushRef(ref: VNodeRef | null) {
			collapseRef.value = ref;
		}

		return {
			pushRef,
			collapseRef,
			style,
			onTransitionEnd,
			state,
		};
	},
	render() {
		return h(
			this.$props.as,
			{
				ref: this.pushRef as VNodeRef,
				style: this.style,
				ontransitionend: this.onTransitionEnd,
				'data-collapse': this.state,
			},
			this.$slots.default?.({ state: this.state })
		);
	},
});
