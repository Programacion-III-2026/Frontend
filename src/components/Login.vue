<script setup>
import { ref } from 'vue'
const emit = defineEmits(['login'])

const email = ref('')
const password = ref('')
const error = ref('')

function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value)
}

function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Correo y contraseña requeridos.'
    return
  }
  if (!isValidEmail(email.value)) {
    error.value = 'Formato de correo inválido.'
    return
  }

  // Credenciales de ejemplo: admin@example.com / 1234
  if (email.value === 'admin@example.com' && password.value === '1234') {
    const token = btoa(email.value + ':' + Date.now())
    emit('login', { email: email.value, token })
  } else {
    error.value = 'Credenciales inválidas. Prueba admin@example.com / 1234.'
  }
}
</script>

<template>
  <div class="login">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="submit">
      <div>
        <label>Correo</label>
        <input v-model="email" type="email" placeholder="correo@ejemplo.com" />
      </div>
      <div>
        <label>Contraseña</label>
        <input v-model="password" type="password" placeholder="contraseña" />
      </div>
      <div class="actions">
        <button type="submit">Entrar</button>
      </div>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="hint">Credenciales de prueba: <strong>admin@example.com</strong> / <strong>1234</strong></p>
    </form>
  </div>
</template>

<style scoped>
.login {
  max-width: 320px;
  margin: 1.5rem auto;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  color: black;
}
.login label { display:block; margin-bottom:4px; font-weight:600 }
.login input { width:100%; padding:8px; margin-bottom:12px; box-sizing:border-box; background-color: white; color:black }
.login .actions { text-align:right }
.error { color: #b00020; margin-top:8px }
.hint { color:#666; font-size:0.9rem }
</style>
