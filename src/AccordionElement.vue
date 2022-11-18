<script setup lang="ts">
import { computed, isRef, type Ref } from "vue";
import { useCollapse } from "./useColllapse";

const props = defineProps<{ isOpen: Ref<boolean> | boolean }>();

const isOpen = computed<boolean>(() => (isRef(props.isOpen) ? props.isOpen.value : props.isOpen));

const collapseProps = useCollapse(isOpen);
</script>

<template>
	<div v-bind="collapseProps">
		<slot />
	</div>
</template>
