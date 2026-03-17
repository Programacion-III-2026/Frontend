<script setup>
import { onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const users = ref([])
const roles = ref([])
const loading = ref(false)
const error = ref('')

const rolesBase = ['admin', 'tecnico', 'cliente', 'usuario']

const pendingUsers = computed(() => users.value.filter(u => (u.estado || '').toLowerCase() === 'pendiente'))

const getRolPorDefecto = () => {
  if (roles.value.includes('cliente')) {
    return 'cliente'
  }
  return roles.value[0] || 'cliente'
}

const capitalizarRol = (rol) => {
  if (!rol) return ''
  return rol.charAt(0).toUpperCase() + rol.slice(1)
}

const fetchRoles = async () => {
  try {
    const response = await fetch(`${API_URL}/api/soporte/roles`)
    if (!response.ok) {
      throw new Error('No se pudieron cargar los roles')
    }

    const data = await response.json()
    const rolesApi = Array.isArray(data)
      ? data.map(r => (r.nombre || '').toLowerCase().trim()).filter(Boolean)
      : []

    const unidos = [...rolesApi, ...rolesBase]
    roles.value = [...new Set(unidos)]
  } catch {
    roles.value = [...rolesBase]
  }
}

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${API_URL}/api/soporte/usuarios`)
    if (!response.ok) {
      throw new Error('No se pudieron cargar los usuarios')
    }
    const data = await response.json()
    const rolDefecto = getRolPorDefecto()
    users.value = data.map(u => ({ ...u, nuevoRol: u.rol || rolDefecto }))
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

onMounted(async () => {
  await fetchRoles()
  await fetchUsers()
})
</script>

<template>
  <div class="space-y-8">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
      <p class="text-gray-600">Administración y aprobación de cuentas del sistema</p>
    </div>

      <div class="bg-white rounded-lg shadow p-4 mb-8">
        <p class="text-gray-700">Usuarios pendientes: <strong>{{ pendingUsers.length }}</strong></p>
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
                <el-option
                  v-for="rol in roles"
                  :key="rol"
                  :label="capitalizarRol(rol)"
                  :value="rol"
                />
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
</template>
