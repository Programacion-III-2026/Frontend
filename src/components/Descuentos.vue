<template>
  <div class="descuentos-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Gestión de Descuentos</span>
          <el-button type="primary" @click="mostrarFormulario = true">
            Nuevo Descuento
          </el-button>
        </div>
      </template>

      <el-skeleton :loading="loading" animated>
        <template #default>
          <el-table :data="descuentos" style="width: 100%">
            <el-table-column prop="nombre" label="Empleado" width="180" />
            <el-table-column prop="apellido" label="Apellido" width="180" />
            <el-table-column prop="concepto" label="Concepto" width="200" />
            <el-table-column prop="monto" label="Monto" width="120">
              <template #default="{ row }">
                ${{ row.monto.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="Acciones" width="150">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="editarDescuento(row)">
                  Editar
                </el-button>
                <el-button type="danger" text size="small" @click="eliminarDescuento(row.id_descuento)">
                  Eliminar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-skeleton>
    </el-card>

    <!-- Resumen -->
    <el-card style="margin-top: 20px">
      <el-statistic title="Total de Descuentos" :value="totalDescuentos" prefix="$" />
    </el-card>

    <!-- Formulario -->
    <el-dialog v-model="mostrarFormulario" :title="modoEdicion ? 'Editar Descuento' : 'Nuevo Descuento'">
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
        
        <el-form-item label="Concepto">
          <el-input
            v-model="formulario.concepto"
            placeholder="Ej: IMSS, Impuestos, etc"
          />
        </el-form-item>
        
        <el-form-item label="Monto">
          <el-input-number
            v-model="formulario.monto"
            :min="0"
            :step="0.01"
            placeholder="Cantidad a descontar"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarFormulario = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarDescuento" :loading="guardando">
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
const descuentos = ref([])
const empleados = ref([])
const formulario = ref({
  id_descuento: null,
  id_empleado: '',
  concepto: '',
  monto: 0
})

const totalDescuentos = computed(() => {
  return descuentos.value.reduce((sum, d) => sum + (d.monto || 0), 0).toFixed(2)
})

const cargarDatos = async () => {
  loading.value = true
  try {
    const [descuentosRes, empleadosRes] = await Promise.all([
      fetch(`${API_URL}/api/rrhh/descuentos`),
      fetch(`${API_URL}/api/rrhh/empleados`)
    ])
    
    if (!descuentosRes.ok || !empleadosRes.ok) throw new Error('Error al cargar datos')
    
    descuentos.value = await descuentosRes.json()
    empleados.value = await empleadosRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const guardarDescuento = async () => {
  if (!formulario.value.id_empleado || !formulario.value.concepto || formulario.value.monto <= 0) {
    ElMessage.warning('Completa todos los campos obligatorios')
    return
  }

  guardando.value = true
  try {
    const url = modoEdicion.value
      ? `${API_URL}/api/rrhh/descuentos/${formulario.value.id_descuento}`
      : `${API_URL}/api/rrhh/descuentos`
    
    const method = modoEdicion.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_empleado: formulario.value.id_empleado,
        concepto: formulario.value.concepto,
        monto: formulario.value.monto
      })
    })

    if (!response.ok) throw new Error('Error al guardar')
    
    ElMessage.success(modoEdicion.value ? 'Descuento actualizado' : 'Descuento creado')
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

const editarDescuento = (descuento) => {
  modoEdicion.value = true
  formulario.value = { ...descuento }
  mostrarFormulario.value = true
}

const eliminarDescuento = async (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que deseas eliminar este descuento?',
    'Confirmar',
    { confirmButtonText: 'Sí', cancelButtonText: 'No', type: 'warning' }
  )
    .then(async () => {
      try {
        const response = await fetch(`${API_URL}/api/rrhh/descuentos/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al eliminar')
        ElMessage.success('Descuento eliminado')
        await cargarDatos()
      } catch (error) {
        ElMessage.error(error.message)
      }
    })
    .catch(() => {})
}

const resetearFormulario = () => {
  formulario.value = {
    id_descuento: null,
    id_empleado: '',
    concepto: '',
    monto: 0
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.descuentos-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
