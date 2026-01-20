import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

window.API_URL = "http://10.108.110.121:8000"  // Tu IP de backend

createApp(App).mount('#app')