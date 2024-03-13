import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { setupRouter } from '~/router'
import { setupNaiveDiscreteApi } from '~/plugins/naiveDiscreteApi'

// import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
setupRouter(app)
app.use(pinia)
setupNaiveDiscreteApi()
app.mount('#app')
