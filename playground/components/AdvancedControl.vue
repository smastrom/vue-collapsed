<script lang="ts" setup>
import { Collapse } from 'vue-collapsed'

const isExpanded = ref(true)

function handleCollapse() {
   isExpanded.value = !isExpanded.value
}
</script>

<template>
   <article class="Wrapper">
      <ExampleHeader
         title="Advanced Control"
         href="AdvancedControl.vue"
         hint="BaseHeight, state and data-collapse"
      />

      <Collapse :when="isExpanded" class="AdvancedCollapse" v-slot="{ state }" :baseHeight="140">
         <div class="InnerElement">
            <button @click="handleCollapse">Toggle</button>

            {{ state }}{{ state.endsWith('ing') ? '...' : '.' }}
         </div>
      </Collapse>
   </article>
</template>

<style>
.AdvancedCollapse {
   --easing-dur: calc(var(--vc-auto-duration) * 1.5) cubic-bezier(0.33, 1, 0.68, 1);

   transition:
      height var(--easing-dur),
      background-color var(--easing-dur),
      border-radius var(--easing-dur);
}

.AdvancedCollapse[data-collapse='collapsed'],
.AdvancedCollapse[data-collapse='collapsing'] {
   background-color: #34ebff;
   border-radius: 45px;
}

.AdvancedCollapse[data-collapse='expanded'],
.AdvancedCollapse[data-collapse='expanding'] {
   background-color: #5dffab;
   border-radius: 15px;
}

.InnerElement {
   padding: 20px;
   display: flex;
   justify-content: flex-start;
   gap: 10px;
   flex-direction: column;
   align-items: center;
   font-size: 1.75rem;
   color: var(--BackgroundColor);
   height: 400px;
   text-transform: capitalize;
}

.InnerElement button {
   padding: 0.4em;
   color: white;
   border-radius: 5px;
   border: none;
   background-color: var(--BackgroundColor);
   font-size: 1rem;
   cursor: pointer;
}

.InnerElement button:hover {
   opacity: 0.75;
}
</style>
