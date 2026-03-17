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

  // Llamar al API para login
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
      console.log('Response status:', response.status)
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Error al iniciar sesión')
        })
      }
      return response.json()
    })
    .then(data => {
      // Login exitoso
      console.log('Login exitoso:', data)
      ElMessage.success(`¡Bienvenido, ${data.usuario.nombre}!`)
      emit('login', { 
        email: data.usuario.email, 
        token: data.token,
        nombre: data.usuario.nombre,
        rol: data.usuario.rol
      })
      loading.value = false
    })
    .catch(error => {
      console.error('Error completo:', error)
      console.error('Error message:', error.message)
      error.value = error.message || 'Error de conexión con el servidor'
      
      // Mostrar mensaje específico para cuenta pendiente
      if (error.message === 'Cuenta pendiente de aprobación') {
        ElMessage.warning({
          message: 'Tu cuenta está pendiente de aprobación. Por favor, espera a que un administrador active tu cuenta.',
          duration: 5000
        })
      } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
        ElMessage.error('Error de red: No se puede conectar con el servidor. Verifica que el backend esté corriendo.')
      } else {
        ElMessage.error(error.message)
      }
      
      loading.value = false
    })
}

function goToRegistro() {
  emit('show-registro')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <div class="bg-white rounded-lg shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8">
          <h1 class="text-3xl font-bold text-white text-center">MAximo</h1>
          <p class="text-blue-100 text-center mt-2">Iniciar sesión</p>
        </div>

        <!-- Form Content -->
        <div class="px-8 py-8">
          <form @submit.prevent="submit" class="space-y-6">
            <!-- Email Input -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                <i class="el-icon-user mr-2"></i>Correo Electrónico
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="correo@ejemplo.com"
                class="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                <i class="el-icon-lock mr-2"></i>Contraseña
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                class="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p class="text-red-700 font-medium">{{ error }}</p>
            </div>

            <!-- Submit Button -->
            <el-button
              type="primary"
              size="large"
              class="w-full"
              @click="submit"
              :loading="loading"
            >
              <i class="el-icon-right mr-2"></i>Iniciar Sesión
            </el-button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
            </div>
          </div>

          <!-- Register Button -->
          <el-button
            @click="goToRegistro"
            size="large"
            class="w-full"
            style="background-color: #67C23A; border-color: #67C23A; color: white;"
          >
            <i class="el-icon-plus mr-2"></i>Registrarse
          </el-button>

          <!-- Hint -->
          <div class="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p class="text-sm text-gray-600 mb-2">
              <strong>📝 Información:</strong>
            </p>
            <ul class="text-sm space-y-1 text-gray-700">
              <li>✓ Inicia sesión con tu cuenta registrada</li>
              <li>✓ Tu cuenta debe estar activa para acceder</li>
              <li>✓ Si no tienes cuenta, regístrate</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-gray-400 text-sm">
          © 2026 MAximo. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales personalizados si es necesario */
:deep(.el-button) {
  border-radius: 0.5rem;
}
</style>
