import { computed, defineComponent, h, type PropType } from 'vue';
import { useCollapse } from './useColllapse';

export const Collapse = defineComponent({
	name: 'Collapse',
	inheritAttrs: true,
	props: {
		/** Boolean value to control collapse. */
		when: {
			type: Boolean as PropType<boolean>,
			required: true,
		},
		/** Element tag to use instead of `div`. */
		as: {
			type: String as PropType<keyof HTMLElementTagNameMap>,
			required: false,
			default: 'div',
		},
		/** Callback on expand transition completed. */
		onExpanded: {
			type: Function as PropType<() => void>,
			required: false,
			default: () => {},
		},
		/** Callback on collapse transition completed. */
		onCollapsed: {
			type: Function as PropType<() => void>,
			required: false,
			default: () => {},
		},
	},
	setup(props) {
		const isExpanded = computed<boolean>(() => props.when);
		const collapseProps = useCollapse(isExpanded, props.onExpanded, props.onCollapsed);

		return {
			collapseProps,
		};
	},
	render() {
		return h(this.$props.as, this.collapseProps, this.$slots.default?.());
	},
});
