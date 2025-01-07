import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';

import Aura from '@primevue/themes/aura';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.use(DialogService);
app.use(ToastService);

app.mount('#app')
