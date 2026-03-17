<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['login', 'show-registro'])

const API_URL = window.API_URL || 'http://localhost:5000'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value)
}

function submit() {
  error.value = ''
  loading.value = true

  if (!email.value || !password.value) {
    error.value = 'Correo y contraseña requeridos.'
    ElMessage.error('Correo y contraseña requeridos.')
    loading.value = false
    return
  }

  if (!isValidEmail(email.value)) {
    error.value = 'Formato de correo inválido.'
    ElMessage.error('Formato de correo inválido.')
    loading.value = false
    return
  }

  fetch(`${API_URL}/api/soporte/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Error al iniciar sesión')
        })
      }
      return response.json()
    })
    .then(data => {
      ElMessage.success(`Bienvenido, ${data.usuario.nombre}!`)
      emit('login', {
        email: data.usuario.email,
        token: data.token,
        nombre: data.usuario.nombre,
        rol: data.usuario.rol
      })
      loading.value = false
    })
    .catch(fetchError => {
      error.value = fetchError.message || 'Error de conexión con el servidor'

      if (fetchError.message === 'Cuenta pendiente de aprobación') {
        ElMessage.warning({
          message: 'Tu cuenta está pendiente de aprobación. Espera a que un administrador active tu cuenta.',
          duration: 5000
        })
      } else if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('fetch')) {
        ElMessage.error('Error de red: no se puede conectar con el servidor. Verifica que el backend esté activo.')
      } else {
        ElMessage.error(fetchError.message)
      }

      loading.value = false
    })
}

function goToRegistro() {
  emit('show-registro')
}
</script>

<template>
  <div class="auth-shell">
    <div class="auth-card">
      <section class="auth-hero">
        <h1>Welcome to<br />MAximo</h1>
      </section>

      <section class="auth-form-wrap">
        <h2>Create your account</h2>
        <p>It's just few minutes and free!</p>

        <form @submit.prevent="submit" class="auth-form">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="correo@ejemplo.com"
            class="auth-input"
          />

          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            class="auth-input"
          />

          <div v-if="error" class="auth-error">
            <p>{{ error }}</p>
          </div>

          <el-button
            type="primary"
            size="small"
            class="w-full max-w-xs mx-auto"
            @click="submit"
            :loading="loading"
          >
            <i class="el-icon-right mr-2"></i>Iniciar Sesión
          </el-button>
        </form>

        <div class="auth-divider">¿No tienes cuenta?</div>

        <el-button
          @click="goToRegistro"
          size="small"
          class="w-full max-w-xs mx-auto"
        >
          <i class="el-icon-plus mr-2"></i>Registrarse
        </el-button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at 0% 0%, rgba(45, 92, 255, 0.35) 0%, transparent 25%),
    radial-gradient(circle at 100% 100%, rgba(10, 40, 160, 0.55) 0%, transparent 35%),
    #020a4a;
}

.auth-card {
  width: 100%;
  max-width: 980px;
  min-height: 540px;
  border-radius: 12px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: linear-gradient(120deg, #03156d 0%, #071259 45%, #0a196c 100%);
  border: 1px solid rgba(149, 176, 255, 0.22);
  box-shadow: 0 28px 56px rgba(2, 6, 45, 0.5);
}

.auth-hero {
  position: relative;
  display: flex;
  align-items: center;
  padding: 64px;
  background:
    radial-gradient(circle at 15% 10%, rgba(71, 113, 255, 0.24) 0%, transparent 34%),
    radial-gradient(circle at 80% 85%, rgba(77, 125, 255, 0.15) 0%, transparent 42%);
}

.auth-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(130, 168, 255, 0.08) 0,
      rgba(130, 168, 255, 0.08) 1px,
      transparent 1px,
      transparent 40px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(130, 168, 255, 0.08) 0,
      rgba(130, 168, 255, 0.08) 1px,
      transparent 1px,
      transparent 40px
    );
}

.auth-hero h1 {
  position: relative;
  z-index: 1;
  margin: 0;
  color: #ffffff;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1;
  letter-spacing: 0.3px;
  font-weight: 800;
}

.auth-form-wrap {
  padding: 42px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #dce7ff;
}

.auth-form-wrap h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #f4f7ff;
}

.auth-form-wrap > p {
  margin: 6px 0 22px;
  font-size: 0.82rem;
  color: rgba(220, 231, 255, 0.75);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-form label {
  font-size: 0.75rem;
  color: rgba(220, 231, 255, 0.88);
}

.auth-input {
  width: 100%;
  border: 1px solid rgba(173, 197, 255, 0.42);
  border-radius: 8px;
  padding: 10px 12px;
  background: rgba(3, 17, 84, 0.45);
  color: #f3f7ff;
  transition: all 0.2s ease;
  margin-bottom: 6px;
}

.auth-input::placeholder {
  color: rgba(195, 214, 255, 0.55);
}

.auth-input:focus {
  outline: none;
  border-color: #84a9ff;
  box-shadow: 0 0 0 3px rgba(90, 137, 255, 0.2);
}

.auth-error {
  border: 1px solid rgba(255, 130, 148, 0.8);
  background: rgba(255, 76, 103, 0.18);
  color: #ffd6dc;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.auth-error p {
  margin: 0;
}

.auth-divider {
  margin: 14px 0 10px;
  text-align: center;
  font-size: 0.77rem;
  color: rgba(220, 231, 255, 0.7);
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 600;
}

:deep(.el-button--primary) {
  background: linear-gradient(90deg, #3b86ff 0%, #2f76f2 100%);
  border-color: transparent;
  color: #fff;
}

:deep(.el-button--default) {
  background: rgba(4, 23, 104, 0.65);
  border: 1px solid rgba(159, 190, 255, 0.42);
  color: #dce7ff;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
}

@media (max-width: 860px) {
  .auth-card {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .auth-hero {
    min-height: 220px;
    padding: 36px 28px;
  }
}
</style>

