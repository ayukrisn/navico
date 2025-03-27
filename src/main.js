import './assets/main.css'
import './assets/base.css'
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { IoAnalytics } from "oh-vue-icons/icons";

addIcons(IoAnalytics);

const app = createApp(App)

app.component("v-icon", OhVueIcon);

app.use(createPinia())
app.use(router)
app.use(PrimeVue);

app.mount('#app')
