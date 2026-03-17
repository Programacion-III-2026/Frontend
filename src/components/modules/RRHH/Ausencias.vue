<template>
  <div class="ausencias-container space-y-8">
    <el-row :gutter="24" class="mb-8">
      <el-col :xs="24" :lg="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Calendario de Equipo</span>
              <el-tag type="info">Mínimo 2 disponibles para aprobar</el-tag>
            </div>
          </template>

          <el-calendar v-model="fechaCalendarioSeleccionada">
            <template #date-cell="{ data }">
              <div class="calendar-cell">
                <div class="day-number">{{ data.day.split('-').slice(2).join('') }}</div>
                <div class="cell-metrics">
                  <el-tag size="small" type="danger">Ausentes: {{ getDisponibilidadDia(data.day).ausentes }}</el-tag>
                  <el-tag size="small" type="success">Disp.: {{ getDisponibilidadDia(data.day).disponibles }}</el-tag>
                </div>
              </div>
            </template>
          </el-calendar>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card>
          <template #header>
            <span>Disponibilidad del Día</span>
          </template>

          <p class="mb-2"><strong>Fecha:</strong> {{ formatDate(fechaCalendarioSeleccionada) }}</p>
          <p class="mb-2"><strong>Total empleados:</strong> {{ empleados.length }}</p>
          <p class="mb-2"><strong>Ausentes:</strong> {{ disponibilidadDiaSeleccionado.ausentes }}</p>
          <p class="mb-4"><strong>Disponibles:</strong> {{ disponibilidadDiaSeleccionado.disponibles }}</p>

          <el-divider />

          <div v-if="disponibilidadDiaSeleccionado.personasAusentes.length > 0">
            <p class="mb-2"><strong>No disponibles:</strong></p>
            <el-tag
              v-for="nombre in disponibilidadDiaSeleccionado.personasAusentes"
              :key="nombre"
              type="warning"
              style="margin: 0 6px 6px 0"
            >
              {{ nombre }}
            </el-tag>
          </div>
          <el-empty v-else description="Todo el equipo disponible" />
        </el-card>
      </el-col>
    </el-row>

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
            <el-table-column prop="tipo" label="Tipo" width="140">
              <template #default="{ row }">
                <el-tag>{{ getTipoLabel(row.tipo) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="estado" label="Estado" width="130">
              <template #default="{ row }">
                <el-tag :type="getEstadoTagType(row.estado)">
                  {{ getEstadoLabel(row.estado) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="descripcion_motivo" label="Motivo" />
            <el-table-column label="Acciones" width="260">
              <template #default="{ row }">
                <el-button
                  v-if="row.estado === 'pendiente'"
                  type="success"
                  text
                  size="small"
                  @click="cambiarEstadoAusencia(row.id_ausencia, 'aprobada')"
                >
                  Aprobar
                </el-button>
                <el-button
                  v-if="row.estado === 'pendiente'"
                  type="warning"
                  text
                  size="small"
                  @click="cambiarEstadoAusencia(row.id_ausencia, 'rechazada')"
                >
                  Rechazar
                </el-button>
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

        <el-form-item label="Tipo">
          <el-select v-model="formulario.tipo" placeholder="Selecciona tipo">
            <el-option label="Vacaciones" value="vacaciones" />
            <el-option label="Permiso" value="permiso" />
            <el-option label="Baja médica" value="baja_medica" />
          </el-select>
        </el-form-item>

        <el-form-item label="Estado">
          <el-select v-model="formulario.estado" placeholder="Estado">
            <el-option label="Pendiente" value="pendiente" />
            <el-option label="Aprobada" value="aprobada" />
            <el-option label="Rechazada" value="rechazada" />
          </el-select>
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'
const loading = ref(false)
const guardando = ref(false)
const mostrarFormulario = ref(false)
const modoEdicion = ref(false)
const ausencias = ref([])
const empleados = ref([])
const fechaCalendarioSeleccionada = ref(new Date())
const formulario = ref({
  id_ausencia: null,
  id_empleado: '',
  fecha_inicio: null,
  fecha_fin: null,
  tipo: 'vacaciones',
  estado: 'pendiente',
  descripcion_motivo: ''
})

const formatearFechaParaApi = (fecha) => {
  if (!fecha) return null
  const d = new Date(fecha)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const normalizarAKeyFecha = (fecha) => {
  const d = new Date(fecha)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const mapaAusenciasAprobadas = computed(() => {
  const mapa = {}
  const ausenciasAprobadas = ausencias.value.filter(a => (a.estado || 'pendiente') === 'aprobada')

  for (const ausencia of ausenciasAprobadas) {
    const nombreCompleto = `${ausencia.nombre || ''} ${ausencia.apellido || ''}`.trim()
    const inicio = new Date(ausencia.fecha_inicio)
    const fin = new Date(ausencia.fecha_fin)

    const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate())
    const finDia = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate())

    while (cursor <= finDia) {
      const key = normalizarAKeyFecha(cursor)
      if (!mapa[key]) {
        mapa[key] = new Set()
      }
      mapa[key].add(nombreCompleto)
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  return mapa
})

const disponibilidadDiaSeleccionado = computed(() => {
  return getDisponibilidadDia(normalizarAKeyFecha(fechaCalendarioSeleccionada.value))
})

const getDisponibilidadDia = (dayKey) => {
  const setAusentes = mapaAusenciasAprobadas.value[dayKey] || new Set()
  const ausentes = setAusentes.size
  const total = empleados.value.length
  return {
    ausentes,
    disponibles: Math.max(total - ausentes, 0),
    personasAusentes: [...setAusentes]
  }
}

const getTipoLabel = (tipo) => {
  if (tipo === 'vacaciones') return 'Vacaciones'
  if (tipo === 'permiso') return 'Permiso'
  if (tipo === 'baja_medica') return 'Baja médica'
  return tipo || 'Permiso'
}

const getEstadoLabel = (estado) => {
  if (estado === 'aprobada') return 'Aprobada'
  if (estado === 'rechazada') return 'Rechazada'
  return 'Pendiente'
}

const getEstadoTagType = (estado) => {
  if (estado === 'aprobada') return 'success'
  if (estado === 'rechazada') return 'danger'
  return 'warning'
}

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
        fecha_inicio: formatearFechaParaApi(formulario.value.fecha_inicio),
        fecha_fin: formatearFechaParaApi(formulario.value.fecha_fin),
        tipo: formulario.value.tipo,
        estado: formulario.value.estado,
        descripcion_motivo: formulario.value.descripcion_motivo
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Error al guardar')
    }
    
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
    tipo: ausencia.tipo || 'permiso',
    estado: ausencia.estado || 'pendiente',
    descripcion_motivo: ausencia.descripcion_motivo
  }
  mostrarFormulario.value = true
}

const cambiarEstadoAusencia = async (id, estado) => {
  try {
    const response = await fetch(`${API_URL}/api/rrhh/ausencias/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'No se pudo actualizar el estado')
    }

    ElMessage.success(`Ausencia ${estado}`)
    await cargarDatos()
  } catch (error) {
    ElMessage.error(error.message)
  }
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
    tipo: 'vacaciones',
    estado: 'pendiente',
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

.calendar-cell {
  min-height: 64px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-number {
  font-size: 12px;
  font-weight: 600;
}

.cell-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
