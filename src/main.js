import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import { initializeI18n } from './i18n/runtimeTranslator'

window.API_URL = "http://localhost:5000"  // URL del backend

const app = createApp(App)

initializeI18n()

app.use(ElementPlus)
app.mount('#app')