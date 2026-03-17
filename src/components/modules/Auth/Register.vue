<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['back-to-login'])

const API_URL = window.API_URL || 'http://localhost:5000'

const usuario = ref({
  nombre: '',
  correo: '',
  contraseña: '',
  rol: 'cliente',
  estado: 'pendiente'
})

const mensaje = ref('')
const esError = ref(false)
const loading = ref(false)

function registrarUsuario() {
  // Validación
  if (!usuario.value.nombre || !usuario.value.correo || !usuario.value.contraseña) {
    mostrarMensaje('Por favor complete todos los campos', true)
    ElMessage.error('Por favor complete todos los campos')
    return
  }

  // Validar email
  const emailRegex = /^\S+@\S+\.\S+$/
  if (!emailRegex.test(usuario.value.correo)) {
    mostrarMensaje('El correo no es válido', true)
    ElMessage.error('El correo no es válido')
    return
  }

  loading.value = true

  // Datos a enviar al API
  const datosUsuario = {
    nombre: usuario.value.nombre,
    email: usuario.value.correo,
    password: usuario.value.contraseña,
    rol: 'cliente',
    estado: 'pendiente',
    id_area: 1 // Área por defecto
  }

  // Realizar llamada al API
  fetch(`${API_URL}/api/soporte/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosUsuario)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }
      return response.json()
    })
    .then(data => {
      console.log('Usuario registrado exitosamente:', data)
      mostrarMensaje('¡Usuario registrado exitosamente!', false)
      ElMessage.success('¡Usuario registrado exitosamente!')
      loading.value = false
      
      setTimeout(() => {
        limpiarFormulario()
        emit('back-to-login')
      }, 1500)
    })
    .catch(error => {
      console.error('Error al registrar usuario:', error)
      mostrarMensaje('Error al registrar. Intenta de nuevo.', true)
      ElMessage.error(`Error: ${error.message}`)
      loading.value = false
    })
}

function mostrarMensaje(texto, error) {
  mensaje.value = texto
  esError.value = error
  setTimeout(() => {
    mensaje.value = ''
  }, 3000)
}

function limpiarFormulario() {
  usuario.value = {
    nombre: '',
    correo: '',
    contraseña: '',
    rol: 'cliente',
    estado: 'pendiente'
  }
}

function volver() {
  emit('back-to-login')
}
</script>

<template>
  <div class="registro-container">
    <!-- Decorative user icons in background -->
    <div class="user-icon user-icon-1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    
    <div class="registro-card">
      <!-- Back Button -->
      <div class="back-button-container">
        <el-button 
          @click="volver" 
          type="info"
          plain
          icon="el-icon-arrow-left"
        >
          Volver al Login
        </el-button>
      </div>

      <h2>Registro de Usuario</h2>
      <form @submit.prevent="registrarUsuario">
        <div class="form-row">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              v-model="usuario.nombre" 
              required
              placeholder="Ingrese su nombre completo"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="correo">Correo:</label>
            <input 
              type="email" 
              id="correo" 
              v-model="usuario.correo" 
              required
              placeholder="correo@ejemplo.com"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="contraseña">Contraseña:</label>
            <input 
              type="password" 
              id="contraseña" 
              v-model="usuario.contraseña" 
              required
              placeholder="Ingrese su contraseña"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="rol">Rol:</label>
            <input
              id="rol"
              type="text"
              class="form-input"
              value="Cliente"
              disabled
            />
          </div>
        </div>

        <div v-if="mensaje" :class="['mensaje', esError ? 'error' : 'exito']">
          {{ mensaje }}
        </div>

        <div class="button-group">
          <el-button type="primary" native-type="submit" :loading="loading">
            <i class="el-icon-check mr-2"></i>Registrarse
          </el-button>
          <el-button @click="volver">
            <i class="el-icon-arrow-left mr-2"></i>Volver
          </el-button>
        </div>
      </form>

      <div class="info-box">
        <p><strong>ℹ️ Información importante:</strong></p>
        <ul>
          <li>✓ Completa todos los campos</li>
          <li>✓ Tu cuenta será verificada por un administrador</li>
          <li>✓ Recibirás un correo cuando sea aprobada</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.registro-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.user-icon {
  position: absolute;
  opacity: 0.1;
  color: #a78bfa;
  z-index: 0;
}

.user-icon-1 { top: 10%; left: 5%; width: 100px; height: 100px; }
.user-icon-2 { top: 20%; right: 10%; width: 120px; height: 120px; animation: float 6s ease-in-out infinite; }
.user-icon-3 { bottom: 20%; left: 10%; width: 90px; height: 90px; }
.user-icon-4 { bottom: 15%; right: 5%; width: 110px; height: 110px; animation: float 8s ease-in-out infinite; }
.user-icon-5 { top: 40%; left: 2%; width: 80px; height: 80px; }
.user-icon-6 { top: 60%; right: 3%; width: 95px; height: 95px; animation: float 7s ease-in-out infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.registro-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.15);
  width: 100%;
  max-width: 500px;
  z-index: 10;
  position: relative;
  border: 1px solid rgba(199, 210, 254, 0.3);
}

.back-button-container {
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  color: #4c1d95;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 700;
}

form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  color: #6b21a8;
  font-weight: 600;
  font-size: 14px;
}

.form-input {
  padding: 12px;
  border: 2px solid #e9d5ff;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #faf5ff;
}

.form-input:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.1);
  background-color: white;
  transform: translateY(-1px);
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.mensaje {
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 600;
}

.mensaje.exito {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 1px solid #6ee7b7;
  border-radius: 10px;
}

.mensaje.error {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 1px solid #fca5a5;
  border-radius: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

:deep(.el-button) {
  flex: 1;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.info-box {
  margin-top: 30px;
  padding: 15px;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-left: 4px solid #8b5cf6;
  border-radius: 10px;
  font-size: 13px;
  color: #4c1d95;
}

.info-box p {
  margin: 0 0 10px 0;
  font-weight: 600;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.info-box li {
  margin-bottom: 5px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .registro-card {
    padding: 30px 20px;
  }
  
  .user-icon {
    display: none;
  }
}
</style>
