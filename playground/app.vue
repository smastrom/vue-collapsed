<template>
   <header class="AppHeader">
      <h1>Vue Collapsed</h1>
      <a
         href="https://github.com/smastrom/vue-collapsed"
         target="_blank"
         aria-label="Visit GitHub Repo"
      >
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="23.408"
            viewBox="0 0 24 23.408"
            aria-hidden="true"
         >
            <path
               d="M12,0A12,12,0,0,0,8.207,23.387c.6.111.793-.261.793-.577V20.576C5.662,21.3,4.967,19.16,4.967,19.16A3.178,3.178,0,0,0,3.634,17.4c-1.089-.745.083-.729.083-.729a2.519,2.519,0,0,1,1.839,1.237,2.554,2.554,0,0,0,3.492,1,2.546,2.546,0,0,1,.762-1.6C7.145,17,4.343,15.971,4.343,11.374A4.644,4.644,0,0,1,5.579,8.153,4.316,4.316,0,0,1,5.7,4.977S6.7,4.655,9,6.207a11.374,11.374,0,0,1,6.009,0c2.291-1.552,3.3-1.23,3.3-1.23a4.312,4.312,0,0,1,.118,3.176,4.632,4.632,0,0,1,1.235,3.221c0,4.609-2.807,5.624-5.479,5.921A2.868,2.868,0,0,1,15,19.517V22.81c0,.319.192.694.8.576A12,12,0,0,0,12,0Z"
            />
         </svg>
      </a>
   </header>

   <main>
      <SingleCollapse />
      <Accordion />
      <IndividualControl />
      <WithCallbacks />
      <AdvancedControl />
      <AdvancedControl :initialState="false" />
      <NestedCollapse />
      <MountUnmount />
      <MountUnmount :initialState="false" />
      <DisplayHide />
      <DisplayHide :initialState="false" />
   </main>

   <footer>
      Made with ❤ by
      <a href="https://github.com/smastrom" target="_blank" class="CodeLink">@smastrom</a>
   </footer>
</template>
