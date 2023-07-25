<script lang="ts" setup>
import { reactive } from 'vue'

import ExampleHeader from './ExampleHeader.vue'

const nested = reactive({
   first: true, // Initial value
   second: false,
   third: false,
   fourth: false,
})

const innerText = `
As an interesting side note, as a head without a body, I envy the dead. Kids don't
turn rotten just from watching TV. Bender, I didn't know you liked cooking. That's so
cute. That's right, baby. I ain't your loverboy Flexo, the guy you love so much. You
even love anyone pretending to be him! I'll tell them you went down prying the
wedding ring off his cold, dead finger.
`
</script>

<template>
   <article class="Wrapper">
      <ExampleHeader
         title="Nested Collapse"
         href="NestedCollapse.vue"
         hint="Multiple collapse nested"
      />

      <div class="Section">
         <button @click="nested.first = !nested.first" :class="['Panel', { Active: nested.first }]">
            1. Hello buddy, how are you today?
         </button>

         <Collapse :when="nested.first">
            <p class="CollapseContent">{{ innerText }}</p>

            <div class="NestedCollapse">
               <button
                  @click="nested.second = !nested.second"
                  :class="['Panel', { Active: nested.second }]"
               >
                  2. Hello buddy, how are you today?
               </button>

               <Collapse :when="nested.second">
                  <p class="CollapseContent">{{ innerText }}</p>

                  <div class="NestedCollapse">
                     <button
                        @click="nested.third = !nested.third"
                        :class="['Panel', { Active: nested.third }]"
                     >
                        3. Hello buddy, how are you today?
                     </button>

                     <Collapse :when="nested.third">
                        <p class="CollapseContent">
                           {{ innerText }}
                        </p>
                     </Collapse>
                  </div>
               </Collapse>
            </div>
         </Collapse>
      </div>
   </article>
</template>

<!-- Check styles in App.vue -->
