import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useStore } from './store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const store = useStore()

store.getUser().finally(() => {
  app.use(router)
  app.mount('#app')
})
