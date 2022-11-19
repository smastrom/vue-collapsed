import { computed, defineComponent, h, isRef, type PropType, type Ref } from 'vue';
import { useCollapse } from './useColllapse';

export const Collapse = defineComponent({
	name: 'Collapse',
	props: {
		when: {
			type: Boolean as PropType<Ref<boolean> | boolean>,
			required: true,
		},
		as: {
			type: String as PropType<keyof Omit<HTMLElementTagNameMap, 'details'>>,
			required: false,
			default: 'div',
		},
		onExpanded: {
			type: Function as PropType<() => void>,
			required: false,
			default: () => {},
		},
		onCollapsed: {
			type: Function as PropType<() => void>,
			required: false,
			default: () => {},
		},
	},
	setup(props) {
		const isOpen = computed<boolean>(() => (isRef(props.when) ? props.when.value : props.when));
		const collapseProps = useCollapse(isOpen, props.onExpanded, props.onCollapsed);

		return {
			collapseProps,
		};
	},
	render() {
		return h(this.$props.as, this.collapseProps, this.$slots.default?.());
	},
});
