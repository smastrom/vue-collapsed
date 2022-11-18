import { computed, defineComponent, h, isRef, type PropType, type Ref } from "vue";
import { useCollapse } from "./useColllapse";

export const Collapse = defineComponent({
	name: "Collapse",
	props: {
		as: {
			type: String as PropType<keyof Omit<HTMLElementTagNameMap, "details">>,
			required: false,
			default: "div",
		},
		when: {
			type: Boolean as PropType<Ref<boolean> | boolean>,
			required: true,
		},
	},
	setup(props) {
		const isOpen = computed<boolean>(() => (isRef(props.when) ? props.when.value : props.when));
		const collapseProps = useCollapse(isOpen);

		return {
			collapseProps,
		};
	},
	render() {
		return h(this.$props.as, this.collapseProps, this.$slots.default?.());
	},
});
