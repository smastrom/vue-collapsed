<script lang="ts" setup>
import { Collapse } from 'vue-collapsed'

const props = withDefaults(
   defineProps<{
      initialState?: boolean
   }>(),
   { initialState: true }
)

const isDisplayed = ref(props.initialState)
const isExpanded = ref(false)

function handleCollapse() {
   isExpanded.value = !isExpanded.value
}
</script>

<template>
   <article class="Wrapper">
      <ExampleHeader :title="props.initialState ? 'Displayed' : 'Hidden'">
         <button type="button" class="ActionButton" @click="isDisplayed = !isDisplayed">
            {{ isDisplayed ? 'Hide' : 'Display' }}
         </button>
      </ExampleHeader>

      <div class="Section" :style="{ display: isDisplayed ? 'block' : 'none' }">
         <button @click="handleCollapse" :class="['Panel', { Active: isExpanded }]">
            Hello buddy, how are you today?
         </button>
         <Collapse :when="isExpanded">
            <p class="CollapseContent">
               As an interesting side note, as a head without a body, I envy the dead. Kids don't
               turn rotten just from watching TV. Bender, I didn't know you liked cooking. That's so
               cute. That's right, baby. I ain't your loverboy Flexo, the guy you love so much. You
               even love anyone pretending to be him! I'll tell them you went down prying the
               wedding ring off his cold, dead finger.
            </p>
         </Collapse>
      </div>
   </article>
</template>
