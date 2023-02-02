import { Collapse } from '../src';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).component('Collapse', Collapse).mount('#app');
