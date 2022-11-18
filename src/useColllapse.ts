import {
	onBeforeUnmount,
	onMounted,
	onUnmounted,
	reactive,
	ref,
	watch,
	type ComputedRef,
	type HTMLAttributes,
} from "vue";

export function useCollapse(isExpanding: ComputedRef<boolean>): HTMLAttributes {
	const rafId = ref<DOMHighResTimeStamp>();
	const collapseRef = ref<HTMLElement | null>(null);

	const collapseProps = reactive({
		ref: (thisRef: HTMLElement) => (collapseRef.value = thisRef),
		style: !isExpanding.value ? "display: none" : undefined,
	});

	onMounted(() => {
		collapseRef.value?.addEventListener("transitionend", onTransitionEnd);
	});

	watch(
		() => isExpanding.value,
		(isOpening) => {
			let isFirstFrame = true;

			function collapse() {
				if (collapseRef.value) {
					const expandedHeight = `height: ${collapseRef.value.scrollHeight}px;`;
					const collapsedHeight = `height: 0px;`;

					if (isFirstFrame) {
						collapseProps.style = `${
							isOpening ? collapsedHeight : expandedHeight
						} overflow: hidden;`;
						isFirstFrame = false;
						rafId.value = requestAnimationFrame(collapse);
					} else {
						console.log("Next frame");
						collapseProps.style = `${
							isOpening ? expandedHeight : collapsedHeight
						} overflow: hidden;`;
					}
				}
			}

			rafId.value = requestAnimationFrame(collapse);
		}
	);

	onBeforeUnmount(() => {
		collapseRef.value?.removeEventListener("transitionend", onTransitionEnd);
	});

	onUnmounted(() => (rafId.value ? cancelAnimationFrame(rafId.value) : null));

	function onTransitionEnd(event: TransitionEvent) {
		if (event.target === collapseRef.value && event.propertyName === "height") {
			if (isExpanding.value) {
				if (
					collapseRef.value?.scrollHeight ===
					parseFloat((event.target as HTMLDivElement).style.height)
				) {
					collapseProps.style = undefined;
				} else {
					collapseProps.style = `height: ${collapseRef.value?.scrollHeight}px;`;
				}
			} else {
				if (collapseRef.value?.style.height === "0px") {
					collapseProps.style = "display: none";
				}
			}
		}
	}

	return collapseProps;
}
