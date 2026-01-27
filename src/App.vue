<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login.vue'

const token = ref(localStorage.getItem('auth_token') || '')
const user = ref(localStorage.getItem('auth_email') || '')

function handleLogin(payload) {
  user.value = payload.email
  token.value = payload.token
  localStorage.setItem('auth_token', payload.token)
  localStorage.setItem('auth_email', payload.email)
}

function logout() {
  token.value = ''
  user.value = ''
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>

    <main>
      <div v-if="!token">
        <Login @login="handleLogin" />
      </div>

      <div v-else>
        <header style="display:flex; align-items:center; justify-content:space-between; max-width:880px; margin:1rem auto;">
          <div>Bienvenido, <strong>{{ user }}</strong></div>
          <div><button @click="logout">Cerrar sesión</button></div>
        </header>
        <HelloWorld msg="Vite + Vue (área protegida)" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #d81717aa);
}
</style>
