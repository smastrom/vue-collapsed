import {
	onBeforeUnmount,
	onMounted,
	onUnmounted,
	reactive,
	ref,
	watch,
	type ComputedRef,
	type HTMLAttributes,
} from 'vue';

const collapsedH = 'height: 0px;';
const overflowH = 'overflow: hidden;';
const displayN = 'display: none;';

export function useCollapse(isExpanding: ComputedRef<boolean>): HTMLAttributes {
	const rafId = ref<DOMHighResTimeStamp>();
	const collapseRef = ref<HTMLElement | null>(null);

	const collapseProps = reactive({
		ref: (thisRef: HTMLElement) => (collapseRef.value = thisRef),
		style: !isExpanding.value ? displayN : undefined,
	});

	onMounted(() => {
		collapseRef.value?.addEventListener('transitionend', onTransitionEnd);
	});

	watch(
		() => isExpanding.value,
		(isExpanding) => {
			let isFirstFrame = true;

			function collapse() {
				if (collapseRef.value) {
					const expandedH = `height: ${collapseRef.value.scrollHeight}px;`;

					if (isFirstFrame) {
						collapseProps.style = `${isExpanding ? collapsedH : expandedH} ${overflowH}`;
						isFirstFrame = false;
						rafId.value = requestAnimationFrame(collapse);
					} else {
						console.log('Next frame');
						collapseProps.style = `${isExpanding ? expandedH : collapsedH} ${overflowH}`;
					}
				}
			}

			rafId.value = requestAnimationFrame(collapse);
		}
	);

	onBeforeUnmount(() => {
		collapseRef.value?.removeEventListener('transitionend', onTransitionEnd);
	});

	onUnmounted(() => (rafId.value ? cancelAnimationFrame(rafId.value) : null));

	function onTransitionEnd(event: TransitionEvent) {
		if (event.target === collapseRef.value && event.propertyName === 'height') {
			if (isExpanding.value) {
				if (
					collapseRef.value?.scrollHeight ===
					parseFloat((event.target as HTMLDivElement).style.height)
				) {
					collapseProps.style = undefined;
				}
			} else {
				if (collapseRef.value?.style.height === '0px') {
					collapseProps.style = displayN;
				}
			}
		}
	}

	return collapseProps;
}
