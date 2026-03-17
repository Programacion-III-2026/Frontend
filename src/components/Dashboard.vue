<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
    <!-- Header -->
    <header class="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">MAximo</h1>
          <p class="text-slate-300 text-sm">Bienvenido, {{ user?.nombre || user?.email || 'Usuario' }}</p>
        </div>
        <el-button type="danger" plain @click="emitLogout">Cerrar sesión</el-button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card Example 1 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Dashboard</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Accede al panel principal del sistema</p>
            <el-button type="primary" round @click="navigate('dashboard')">
              <i class="el-icon-setting mr-2"></i>
              Ir al Dashboard
            </el-button>
          </div>
        </div>

        <!-- Card Example 2 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Contabilidad</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Gestiona las cuentas y asientos contables</p>
            <el-button type="success" round @click="navigate('contabilidad')">
              <i class="el-icon-management mr-2"></i>
              Ir a Contabilidad
            </el-button>
          </div>
        </div>

        <!-- Card Example 3 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Recursos Humanos</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Administra empleados y nóminas</p>
            <el-button type="warning" round @click="navigate('rrhh')">
              <i class="el-icon-user mr-2"></i>
              Ir a RRHH
            </el-button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Soporte</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Gestiona clientes y tickets</p>
            <el-button type="primary" round @click="navigate('soporte')">
              <i class="el-icon-tickets mr-2"></i>
              Ir a Soporte
            </el-button>
          </div>
        </div>

        <div v-if="isAdmin" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Usuarios</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Aprobar y gestionar cuentas</p>
            <el-button type="danger" round @click="navigate('usuarios')">
              <i class="el-icon-s-check mr-2"></i>
              Ir a Usuarios
            </el-button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">SLAs</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Gestiona acuerdos de nivel de servicio</p>
            <el-button round @click="navigate('slas')">
              <i class="el-icon-setting mr-2"></i>
              Ir a SLAs
            </el-button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Roles</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Administra roles de usuarios</p>
            <el-button round @click="navigate('roles')">
              <i class="el-icon-management mr-2"></i>
              Ir a Roles
            </el-button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-lime-500 to-lime-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Encuestas</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Gestiona encuestas de satisfacción</p>
            <el-button round @click="navigate('encuestas')">
              <i class="el-icon-document mr-2"></i>
              Ir a Encuestas
            </el-button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Ausencias</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Registra ausencias de empleados</p>
            <el-button round @click="navigate('ausencias')">
              <i class="el-icon-calendar mr-2"></i>
              Ir a Ausencias
            </el-button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Descuentos</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Gestiona descuentos salariales</p>
            <el-button round @click="navigate('descuentos')">
              <i class="el-icon-money mr-2"></i>
              Ir a Descuentos
            </el-button>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="mt-12 bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Ejemplo de Formulario con Element Plus</h2>
        
        <el-form :model="formData" label-width="120px" class="space-y-4">
          <el-form-item label="Nombre">
            <el-input v-model="formData.nombre" placeholder="Ingresa tu nombre"></el-input>
          </el-form-item>

          <el-form-item label="Email">
            <el-input v-model="formData.email" type="email" placeholder="correo@ejemplo.com"></el-input>
          </el-form-item>

          <el-form-item label="Rol">
            <el-select v-model="formData.rol" placeholder="Selecciona un rol" class="w-full">
              <el-option label="Admin" value="admin"></el-option>
              <el-option label="Usuario" value="user"></el-option>
              <el-option label="Técnico" value="tecnico"></el-option>
            </el-select>
          </el-form-item>

          <div class="flex gap-4">
            <el-button type="primary" @click="handleSubmit">Guardar</el-button>
            <el-button @click="resetForm">Limpiar</el-button>
          </div>
        </el-form>
      </div>

      <!-- Alert Examples -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-alert title="Información" type="info" description="Este es un mensaje informativo" closable></el-alert>
        <el-alert title="Éxito" type="success" description="La operación se completó correctamente" closable></el-alert>
        <el-alert title="Advertencia" type="warning" description="Presta atención a esto" closable></el-alert>
        <el-alert title="Error" type="error" description="Ocurrió un error en la operación" closable></el-alert>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['navigate', 'logout'])

const isAdmin = computed(() => (props.user?.rol || '').toLowerCase() === 'admin')

const navigate = (target) => emit('navigate', target)
const emitLogout = () => emit('logout')

const formData = reactive({
  nombre: '',
  email: '',
  rol: ''
})

const handleSubmit = () => {
  ElMessage.success('Datos guardados correctamente')
  console.log('Datos del formulario:', formData)
}

const resetForm = () => {
  formData.nombre = ''
  formData.email = ''
  formData.rol = ''
}
</script>

<style scoped>
/* Estilos adicionales específicos del componente */
</style>
