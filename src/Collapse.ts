import { computed, defineComponent, ref, defineExpose, h, type PropType, type VNodeRef } from 'vue';
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
		const collapseRef = ref<HTMLElement | null>(null);
		defineExpose({ collapseRef });

		const { style, onTransitionEnd } = useCollapse(collapseRef, {
			isExpanded: computed(() => props.when),
			onExpanded: props.onExpanded,
			onCollapsed: props.onCollapsed,
		});

		function pushRef(ref: HTMLElement | null) {
			collapseRef.value = ref;
		}

		return {
			pushRef,
			collapseRef,
			style,
			onTransitionEnd,
		};
	},
	render() {
		return h(
			this.$props.as,
			{ ref: this.pushRef as VNodeRef, style: this.style, ontransitionend: this.onTransitionEnd },
			this.$slots.default?.()
		);
	},
});
