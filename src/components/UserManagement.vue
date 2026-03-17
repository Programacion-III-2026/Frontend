<script setup>
import { onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['back-to-dashboard'])

const API_URL = window.API_URL || 'http://localhost:5000'

const users = ref([])
const loading = ref(false)
const error = ref('')

const pendingUsers = computed(() => users.value.filter(u => (u.estado || '').toLowerCase() === 'pendiente'))

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${API_URL}/api/soporte/usuarios`)
    if (!response.ok) {
      throw new Error('No se pudieron cargar los usuarios')
    }
    const data = await response.json()
    users.value = data.map(u => ({ ...u, nuevoRol: u.rol || 'cliente' }))
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const aprobarUsuario = async (user) => {
  try {
    const payload = {
      nombre: user.nombre,
      email: user.email,
      password: user.password,
      rol: user.nuevoRol,
      estado: 'activo',
      id_area: user.id_area || 1
    }

    const response = await fetch(`${API_URL}/api/soporte/usuarios/${user.id_usuario}` , {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('No se pudo actualizar el usuario')
    }

    ElMessage.success('Usuario aprobado y rol actualizado')
    await fetchUsers()
  } catch (err) {
    ElMessage.error(err.message)
  }
}

const volver = () => emit('back-to-dashboard')

onMounted(fetchUsers)
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Gestión de Usuarios</h1>
        <el-button type="info" plain @click="volver">Volver</el-button>
      </div>

      <div class="bg-slate-800 rounded-lg p-4 mb-6">
        <p class="text-slate-200">Usuarios pendientes: <strong>{{ pendingUsers.length }}</strong></p>
      </div>

      <el-alert v-if="error" type="error" :title="error" show-icon class="mb-4" />

      <div class="overflow-x-auto">
        <el-table
          v-loading="loading"
          :data="users"
          stripe
          border
          class="w-full"
        >
          <el-table-column prop="id_usuario" label="ID" width="80" />
          <el-table-column prop="nombre" label="Nombre" />
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="rol" label="Rol Actual" width="140" />
          <el-table-column prop="estado" label="Estado" width="140" />
          <el-table-column label="Nuevo Rol" width="180">
            <template #default="scope">
              <el-select v-model="scope.row.nuevoRol" placeholder="Rol" class="w-full">
                <el-option label="Cliente" value="cliente" />
                <el-option label="Técnico" value="tecnico" />
                <el-option label="Admin" value="admin" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Acciones" width="180">
            <template #default="scope">
              <el-button
                type="success"
                size="small"
                :disabled="(scope.row.estado || '').toLowerCase() !== 'pendiente'"
                @click="aprobarUsuario(scope.row)"
              >
                Aprobar
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
