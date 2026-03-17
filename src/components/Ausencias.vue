<template>
  <div class="ausencias-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Gestión de Ausencias</span>
          <el-button type="primary" @click="mostrarFormulario = true">
            Nueva Ausencia
          </el-button>
        </div>
      </template>

      <el-skeleton :loading="loading" animated>
        <template #default>
          <el-table :data="ausencias" style="width: 100%">
            <el-table-column prop="nombre" label="Empleado" width="180" />
            <el-table-column prop="apellido" label="Apellido" width="180" />
            <el-table-column prop="fecha_inicio" label="Fecha Inicio" width="150">
              <template #default="{ row }">
                {{ formatDate(row.fecha_inicio) }}
              </template>
            </el-table-column>
            <el-table-column prop="fecha_fin" label="Fecha Fin" width="150">
              <template #default="{ row }">
                {{ formatDate(row.fecha_fin) }}
              </template>
            </el-table-column>
            <el-table-column prop="descripcion_motivo" label="Motivo" />
            <el-table-column label="Acciones" width="150">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="editarAusencia(row)">
                  Editar
                </el-button>
                <el-button type="danger" text size="small" @click="eliminarAusencia(row.id_ausencia)">
                  Eliminar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-skeleton>
    </el-card>

    <!-- Formulario -->
    <el-dialog v-model="mostrarFormulario" :title="modoEdicion ? 'Editar Ausencia' : 'Nueva Ausencia'">
      <el-form :model="formulario" label-width="150px">
        <el-form-item label="Empleado">
          <el-select v-model="formulario.id_empleado" placeholder="Selecciona un empleado">
            <el-option
              v-for="emp in empleados"
              :key="emp.id_empleado"
              :label="`${emp.nombre} ${emp.apellido}`"
              :value="emp.id_empleado"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Fecha Inicio">
          <el-date-picker v-model="formulario.fecha_inicio" type="date" />
        </el-form-item>
        
        <el-form-item label="Fecha Fin">
          <el-date-picker v-model="formulario.fecha_fin" type="date" />
        </el-form-item>
        
        <el-form-item label="Motivo">
          <el-input
            v-model="formulario.descripcion_motivo"
            type="textarea"
            :rows="3"
            placeholder="Describe el motivo de la ausencia"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarFormulario = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarAusencia" :loading="guardando">
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
const ausencias = ref([])
const empleados = ref([])
const formulario = ref({
  id_ausencia: null,
  id_empleado: '',
  fecha_inicio: null,
  fecha_fin: null,
  descripcion_motivo: ''
})

const cargarDatos = async () => {
  loading.value = true
  try {
    const [ausenciasRes, empleadosRes] = await Promise.all([
      fetch(`${API_URL}/api/rrhh/ausencias`),
      fetch(`${API_URL}/api/rrhh/empleados`)
    ])
    
    if (!ausenciasRes.ok || !empleadosRes.ok) throw new Error('Error al cargar datos')
    
    ausencias.value = await ausenciasRes.json()
    empleados.value = await empleadosRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const guardarAusencia = async () => {
  if (!formulario.value.id_empleado || !formulario.value.fecha_inicio || !formulario.value.fecha_fin) {
    ElMessage.warning('Completa todos los campos obligatorios')
    return
  }

  guardando.value = true
  try {
    const url = modoEdicion.value
      ? `${API_URL}/api/rrhh/ausencias/${formulario.value.id_ausencia}`
      : `${API_URL}/api/rrhh/ausencias`
    
    const method = modoEdicion.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_empleado: formulario.value.id_empleado,
        fecha_inicio: formulario.value.fecha_inicio,
        fecha_fin: formulario.value.fecha_fin,
        descripcion_motivo: formulario.value.descripcion_motivo
      })
    })

    if (!response.ok) throw new Error('Error al guardar')
    
    ElMessage.success(modoEdicion.value ? 'Ausencia actualizada' : 'Ausencia creada')
    mostrarFormulario.value = false
    modoEdicion.value = false
    resetearFormulario()
    await cargarDatos()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

const editarAusencia = (ausencia) => {
  modoEdicion.value = true
  formulario.value = {
    id_ausencia: ausencia.id_ausencia,
    id_empleado: ausencia.id_empleado,
    fecha_inicio: new Date(ausencia.fecha_inicio),
    fecha_fin: new Date(ausencia.fecha_fin),
    descripcion_motivo: ausencia.descripcion_motivo
  }
  mostrarFormulario.value = true
}

const eliminarAusencia = async (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que deseas eliminar esta ausencia?',
    'Confirmar',
    { confirmButtonText: 'Sí', cancelButtonText: 'No', type: 'warning' }
  )
    .then(async () => {
      try {
        const response = await fetch(`${API_URL}/api/rrhh/ausencias/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al eliminar')
        ElMessage.success('Ausencia eliminada')
        await cargarDatos()
      } catch (error) {
        ElMessage.error(error.message)
      }
    })
    .catch(() => {})
}

const resetearFormulario = () => {
  formulario.value = {
    id_ausencia: null,
    id_empleado: '',
    fecha_inicio: null,
    fecha_fin: null,
    descripcion_motivo: ''
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.ausencias-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
