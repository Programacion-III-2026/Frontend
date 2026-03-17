<template>
  <div class="roles-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Gestión de Roles</span>
          <el-button type="primary" @click="mostrarFormulario = true">
            Nuevo Rol
          </el-button>
        </div>
      </template>

      <el-skeleton :loading="loading" animated>
        <template #default>
          <el-table :data="roles" style="width: 100%">
            <el-table-column prop="id_rol" label="ID" width="80" />
            <el-table-column prop="nombre" label="Nombre" width="300" />
            <el-table-column label="Acciones" width="150">
              <template #default="{ row }">
                <el-button type="danger" text size="small" @click="eliminarRol(row.id_rol)">
                  Eliminar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-skeleton>
    </el-card>

    <!-- Formulario -->
    <el-dialog v-model="mostrarFormulario" title="Nuevo Rol">
      <el-form :model="formulario" label-width="100px">
        <el-form-item label="Nombre">
          <el-input
            v-model="formulario.nombre"
            placeholder="Ej: Admin, Técnico, Cliente, etc"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarFormulario = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarRol" :loading="guardando">
          Crear Rol
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'
const loading = ref(false)
const guardando = ref(false)
const mostrarFormulario = ref(false)
const roles = ref([])
const rolesBase = ['admin', 'tecnico', 'cliente', 'usuario']
const formulario = ref({
  nombre: ''
})

const crearRolesBase = async () => {
  for (const nombre of rolesBase) {
    try {
      await fetch(`${API_URL}/api/soporte/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      })
    } catch {
      // ignorar errores de duplicado o red en inicialización
    }
  }
}

const cargarRoles = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/api/soporte/roles`)
    if (!response.ok) throw new Error('Error al cargar roles')
    const data = await response.json()

    if (Array.isArray(data) && data.length === 0) {
      await crearRolesBase()
      const reloadResponse = await fetch(`${API_URL}/api/soporte/roles`)
      if (!reloadResponse.ok) throw new Error('Error al cargar roles')
      roles.value = await reloadResponse.json()
      return
    }

    roles.value = data
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const guardarRol = async () => {
  if (!formulario.value.nombre.trim()) {
    ElMessage.warning('El nombre del rol es requerido')
    return
  }

  guardando.value = true
  try {
    const response = await fetch(`${API_URL}/api/soporte/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formulario.value.nombre
      })
    })

    if (!response.ok) throw new Error('Error al crear rol')
    
    ElMessage.success('Rol creado correctamente')
    mostrarFormulario.value = false
    formulario.value.nombre = ''
    await cargarRoles()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

const eliminarRol = async (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que deseas eliminar este rol?',
    'Confirmar',
    { confirmButtonText: 'Sí', cancelButtonText: 'No', type: 'warning' }
  )
    .then(async () => {
      try {
        const response = await fetch(`${API_URL}/api/soporte/roles/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al eliminar')
        ElMessage.success('Rol eliminado')
        await cargarRoles()
      } catch (error) {
        ElMessage.error(error.message)
      }
    })
    .catch(() => {})
}

onMounted(() => {
  cargarRoles()
})
</script>

<style scoped>
.roles-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
