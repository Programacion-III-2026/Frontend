<template>
  <div class="slas-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Gestión de SLAs</span>
          <el-button type="primary" @click="mostrarFormulario = true">
            Nuevo SLA
          </el-button>
        </div>
      </template>

      <el-skeleton :loading="loading" animated>
        <template #default>
          <el-table :data="slas" style="width: 100%">
            <el-table-column prop="nombre" label="Nombre" width="200" />
            <el-table-column prop="tiempo_respuesta" label="Tiempo Respuesta (min)" width="180">
              <template #default="{ row }">
                {{ row.tiempo_respuesta }} minutos
              </template>
            </el-table-column>
            <el-table-column prop="tiempo_resolucion" label="Tiempo Resolución (min)" width="180">
              <template #default="{ row }">
                {{ row.tiempo_resolucion }} minutos
              </template>
            </el-table-column>
            <el-table-column prop="prioridad" label="Prioridad" width="120">
              <template #default="{ row }">
                <el-tag :type="getPriorityType(row.prioridad)">
                  {{ row.prioridad }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Acciones" width="150">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="editarSla(row)">
                  Editar
                </el-button>
                <el-button type="danger" text size="small" @click="eliminarSla(row.id_sla)">
                  Eliminar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-skeleton>
    </el-card>

    <!-- Formulario -->
    <el-dialog v-model="mostrarFormulario" :title="modoEdicion ? 'Editar SLA' : 'Nuevo SLA'">
      <el-form :model="formulario" label-width="180px">
        <el-form-item label="Nombre">
          <el-input v-model="formulario.nombre" placeholder="Ej: Soporte Crítico" />
        </el-form-item>
        
        <el-form-item label="Tiempo de Respuesta (min)">
          <el-input-number
            v-model="formulario.tiempo_respuesta"
            :min="1"
            placeholder="Minutos para responder"
          />
        </el-form-item>
        
        <el-form-item label="Tiempo de Resolución (min)">
          <el-input-number
            v-model="formulario.tiempo_resolucion"
            :min="1"
            placeholder="Minutos para resolver"
          />
        </el-form-item>
        
        <el-form-item label="Prioridad">
          <el-select v-model="formulario.prioridad" placeholder="Selecciona prioridad">
            <el-option label="Crítica" value="Crítica" />
            <el-option label="Alta" value="Alta" />
            <el-option label="Media" value="Media" />
            <el-option label="Baja" value="Baja" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarFormulario = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarSla" :loading="guardando">
          {{ modoEdicion ? 'Actualizar' : 'Crear' }}
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
const modoEdicion = ref(false)
const slas = ref([])
const formulario = ref({
  id_sla: null,
  nombre: '',
  tiempo_respuesta: 1,
  tiempo_resolucion: 1,
  prioridad: ''
})

const cargarSlas = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/api/soporte/slas`)
    if (!response.ok) throw new Error('Error al cargar SLAs')
    slas.value = await response.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const guardarSla = async () => {
  if (!formulario.value.nombre || !formulario.value.prioridad) {
    ElMessage.warning('Completa todos los campos obligatorios')
    return
  }

  guardando.value = true
  try {
    const url = modoEdicion.value
      ? `${API_URL}/api/soporte/slas/${formulario.value.id_sla}`
      : `${API_URL}/api/soporte/slas`
    
    const method = modoEdicion.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formulario.value.nombre,
        tiempo_respuesta: formulario.value.tiempo_respuesta,
        tiempo_resolucion: formulario.value.tiempo_resolucion,
        prioridad: formulario.value.prioridad
      })
    })

    if (!response.ok) throw new Error('Error al guardar')
    
    ElMessage.success(modoEdicion.value ? 'SLA actualizado' : 'SLA creado')
    mostrarFormulario.value = false
    modoEdicion.value = false
    resetearFormulario()
    await cargarSlas()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

const editarSla = (sla) => {
  modoEdicion.value = true
  formulario.value = { ...sla }
  mostrarFormulario.value = true
}

const eliminarSla = async (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que deseas eliminar este SLA?',
    'Confirmar',
    { confirmButtonText: 'Sí', cancelButtonText: 'No', type: 'warning' }
  )
    .then(async () => {
      try {
        const response = await fetch(`${API_URL}/api/soporte/slas/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al eliminar')
        ElMessage.success('SLA eliminado')
        await cargarSlas()
      } catch (error) {
        ElMessage.error(error.message)
      }
    })
    .catch(() => {})
}

const resetearFormulario = () => {
  formulario.value = {
    id_sla: null,
    nombre: '',
    tiempo_respuesta: 1,
    tiempo_resolucion: 1,
    prioridad: ''
  }
}

const getPriorityType = (prioridad) => {
  const types = {
    'Crítica': 'danger',
    'Alta': 'warning',
    'Media': 'info',
    'Baja': 'success'
  }
  return types[prioridad] || 'info'
}

onMounted(() => {
  cargarSlas()
})
</script>

<style scoped>
.slas-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
