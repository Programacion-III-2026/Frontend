<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const dialogVisible = ref(false)
const beneficios = ref([])
const deducciones = ref([])
const salarioAnualISR = ref([])
const editingId = ref(null)
const tabActiva = ref('isr-anual')

const beneficioForm = reactive({
  nombre: '',
  tipo: 'monetario',
  monto: 0,
  descripcion: ''
})

const deduccionForm = reactive({
  nombre: '',
  tipo: 'impuesto',
  porcentaje: 0,
  monto_fijo: 0,
  descripcion: ''
})

const deduccionesLegalesHN = [
  {
    id_deduccion: 1,
    nombre: 'IHSS (Seguro Social de Honduras)',
    tipo: 'seguro_social',
    porcentaje: 0,
    monto_fijo: 600,
    descripcion: 'Deducción fija del trabajador al IHSS.'
  },
  {
    id_deduccion: 2,
    nombre: 'RAP (Régimen de Aportaciones Privadas)',
    tipo: 'rap',
    porcentaje: 0,
    monto_fijo: 125,
    descripcion: 'Deducción fija del trabajador al RAP.'
  }
]

// Cálculos agregados
const totalSalariosISR = computed(() => {
  return salarioAnualISR.value.reduce((sum, emp) => sum + (emp.salario_anual || 0), 0)
})

const totalISRCobrado = computed(() => {
  return salarioAnualISR.value.reduce((sum, emp) => sum + (emp.isr_calculado || 0), 0)
})

const empleadosConISR = computed(() => {
  return salarioAnualISR.value.filter(emp => emp.aplica_isr).length
})

const resetForm = () => {
  beneficioForm.nombre = ''
  beneficioForm.tipo = 'monetario'
  beneficioForm.monto = 0
  beneficioForm.descripcion = ''
  deduccionForm.nombre = ''
  deduccionForm.tipo = 'impuesto'
  deduccionForm.porcentaje = 0
  deduccionForm.monto_fijo = 0
  deduccionForm.descripcion = ''
  editingId.value = null
}

const fetchBeneficios = async () => {
  loading.value = true
  try {
    // Nota: No existe tabla de beneficios en la BD
    beneficios.value = []
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const fetchDeducciones = async () => {
  loading.value = true
  try {
    deducciones.value = deduccionesLegalesHN
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const fetchSalariosAnualesISR = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/rrhh/salarios-anuales-isr`)
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'No se pudieron cargar los salarios anuales')
    }
    const data = await res.json()
    salarioAnualISR.value = Array.isArray(data) ? data : []
    if (salarioAnualISR.value.length === 0) {
      ElMessage.warning('No hay datos de salarios anuales disponibles')
    }
  } catch (error) {
    console.error('Error al cargar salarios ISR:', error)
    ElMessage.error(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const guardarBeneficio = async () => {
  try {
    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value 
      ? `${API_URL}/api/rrhh/beneficios/${editingId.value}`
      : `${API_URL}/api/rrhh/beneficios`

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(beneficioForm)
    })

    if (!response.ok) throw new Error('Error al guardar beneficio')

    ElMessage.success(editingId.value ? 'Beneficio actualizado' : 'Beneficio creado')
    dialogVisible.value = false
    resetForm()
    await fetchBeneficios()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const guardarDeduccion = async () => {
  try {
    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value 
      ? `${API_URL}/api/rrhh/descuentos/${editingId.value}`
      : `${API_URL}/api/rrhh/descuentos`

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deduccionForm)
    })

    if (!response.ok) throw new Error('Error al guardar deducción')

    ElMessage.success(editingId.value ? 'Deducción actualizada' : 'Deducción creada')
    dialogVisible.value = false
    resetForm()
    await fetchDeducciones()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const editarBeneficio = (beneficio) => {
  editingId.value = beneficio.id_beneficio
  beneficioForm.nombre = beneficio.nombre
  beneficioForm.tipo = beneficio.tipo
  beneficioForm.monto = beneficio.monto
  beneficioForm.descripcion = beneficio.descripcion
  dialogVisible.value = true
}

const editarDeduccion = (deduccion) => {
  editingId.value = deduccion.id_deduccion
  deduccionForm.nombre = deduccion.nombre
  deduccionForm.tipo = deduccion.tipo
  deduccionForm.porcentaje = deduccion.porcentaje
  deduccionForm.monto_fijo = deduccion.monto_fijo
  deduccionForm.descripcion = deduccion.descripcion
  dialogVisible.value = true
}

const eliminarBeneficio = async (id) => {
  try {
    await ElMessageBox.confirm('¿Estás seguro?', 'Advertencia', {
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    })

    const response = await fetch(`${API_URL}/api/rrhh/beneficios/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('No se pudo eliminar')

    ElMessage.success('Beneficio eliminado')
    await fetchBeneficios()
  } catch (error) {
    if (error.message !== 'cancel') ElMessage.error(error.message)
  }
}

const eliminarDeduccion = async (id) => {
  try {
    await ElMessageBox.confirm('¿Estás seguro?', 'Advertencia', {
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    })

    const response = await fetch(`${API_URL}/api/rrhh/descuentos/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('No se pudo eliminar')

    ElMessage.success('Deducción eliminada')
    await fetchDeducciones()
  } catch (error) {
    if (error.message !== 'cancel') ElMessage.error(error.message)
  }
}

const abrirDialogo = () => {
  if (tabActiva.value === 'beneficios') {
    ElMessage.warning('Beneficios no disponible en la BD actual')
    return
  }
  if (tabActiva.value === 'deducciones') {
    ElMessage.warning('Las deducciones están configuradas con las reglas legales (IHSS y RAP)')
    return
  }
  resetForm()
  dialogVisible.value = true
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(value)
}

onMounted(() => {
  fetchBeneficios()
  fetchDeducciones()
  fetchSalariosAnualesISR()
})
</script>

<template>
  <div>
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Beneficios y Deducciones</h2>
          <p class="text-gray-600">Gestión de beneficios, descuentos e ISR de nómina</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="abrirDialogo" :disabled="tabActiva === 'beneficios'">Nuevo</el-button>
        </div>
      </div>

      <el-dialog v-model="dialogVisible" :title="`${editingId ? 'Editar' : 'Nuevo'} ${tabActiva === 'beneficios' ? 'Beneficio' : 'Deducción'}`" width="50%">
        <el-form label-width="140px" v-if="tabActiva === 'beneficios'">
          <el-form-item label="Nombre">
            <el-input v-model="beneficioForm.nombre" placeholder="Nombre del beneficio" />
          </el-form-item>
          <el-form-item label="Tipo">
            <el-select v-model="beneficioForm.tipo">
              <el-option label="Monetario" value="monetario" />
              <el-option label="En especie" value="especie" />
              <el-option label="Temporal" value="temporal" />
            </el-select>
          </el-form-item>
          <el-form-item label="Monto">
            <el-input v-model.number="beneficioForm.monto" type="number" placeholder="0.00" />
          </el-form-item>
          <el-form-item label="Descripción">
            <el-input v-model="beneficioForm.descripcion" type="textarea" placeholder="Descripción del beneficio" />
          </el-form-item>
        </el-form>
        <el-form label-width="140px" v-else>
          <el-form-item label="Nombre">
            <el-input v-model="deduccionForm.nombre" placeholder="Nombre de la deducción" />
          </el-form-item>
          <el-form-item label="Tipo">
            <el-select v-model="deduccionForm.tipo">
              <el-option label="Impuesto" value="impuesto" />
              <el-option label="Descuento" value="descuento" />
              <el-option label="Cuota" value="cuota" />
            </el-select>
          </el-form-item>
          <el-form-item label="Porcentaje">
            <el-input v-model.number="deduccionForm.porcentaje" type="number" placeholder="0.00" />
          </el-form-item>
          <el-form-item label="Monto Fijo">
            <el-input v-model.number="deduccionForm.monto_fijo" type="number" placeholder="0.00" />
          </el-form-item>
          <el-form-item label="Descripción">
            <el-input v-model="deduccionForm.descripcion" type="textarea" placeholder="Descripción de la deducción" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">Cancelar</el-button>
          <el-button type="primary" @click="tabActiva === 'beneficios' ? guardarBeneficio() : guardarDeduccion()">Guardar</el-button>
        </template>
      </el-dialog>

      <el-tabs v-model="tabActiva">
        <!-- ISR Anual -->
        <el-tab-pane label="ISR Anual" name="isr-anual">
          <el-row :gutter="20" style="margin-bottom: 20px">
            <el-col :xs="24" :sm="12" :md="6">
              <el-statistic title="Total Salarios Anuales" :value="totalSalariosISR" />
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-statistic title="Total ISR Cobrado" :value="totalISRCobrado" />
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-statistic title="Empleados con ISR" :value="empleadosConISR" />
            </el-col>
          </el-row>

          <el-card class="bg-white rounded-lg shadow mt-4" shadow="never">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-semibold">Desglose de Salarios Anuales e ISR por Empleado</span>
                <el-button text @click="fetchSalariosAnualesISR" :loading="loading">Refrescar</el-button>
              </div>
            </template>
            <div class="overflow-x-auto">
              <el-table :data="salarioAnualISR" stripe border v-loading="loading" class="w-full">
                <el-table-column prop="nombre_completo" label="Empleado" min-width="180" />
                <el-table-column prop="salario_anual" label="Salario Anual" width="150" align="right">
                  <template #default="{ row }">
                    <span class="font-semibold">{{ formatCurrency(row.salario_anual) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="ISR Aplicado" width="130" align="center">
                  <template #default="{ row }">
                    <el-tag v-if="row.aplica_isr" type="danger" effect="light">Sí</el-tag>
                    <el-tag v-else type="success" effect="light">No</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="isr_calculado" label="ISR Cobrado" width="150" align="right">
                  <template #default="{ row }">
                    <span v-if="row.isr_calculado > 0" class="font-semibold text-red-600">{{ formatCurrency(row.isr_calculado) }}</span>
                    <span v-else class="text-gray-400">{{ formatCurrency(0) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Neto a Pagar" width="150" align="right">
                  <template #default="{ row }">
                    <span class="font-semibold text-green-600">{{ formatCurrency(row.salario_anual - row.isr_calculado) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- Beneficios -->
        <el-tab-pane label="Beneficios" name="beneficios">
          <el-alert
            title="Beneficios no disponible"
            type="warning"
            show-icon
            class="mb-4"
          />
          <el-card class="bg-white rounded-lg shadow mt-4" shadow="never">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-semibold">Beneficios del Personal</span>
                <el-button text @click="fetchBeneficios" :loading="loading">Refrescar</el-button>
              </div>
            </template>
            <div class="overflow-x-auto">
              <el-table :data="beneficios" stripe border v-loading="loading">
                <el-table-column prop="id_beneficio" label="ID" width="80" />
                <el-table-column prop="nombre" label="Nombre" />
                <el-table-column prop="tipo" label="Tipo" width="120" />
                <el-table-column prop="monto" label="Monto" width="120" />
                <el-table-column prop="descripcion" label="Descripción" width="250" />
                <el-table-column label="Acciones" width="120" align="center">
                  <template #default="{ row }">
                    <el-button text type="primary" size="small" @click="editarBeneficio(row)">Editar</el-button>
                    <el-button text type="danger" size="small" @click="eliminarBeneficio(row.id_beneficio)">Eliminar</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- Deducciones -->
        <el-tab-pane label="Deducciones" name="deducciones">
          <el-alert
            title="Deducciones legales activas: IHSS (L 600) y RAP (L 125)"
            type="info"
            show-icon
            class="mb-4"
          />
          <el-card class="bg-white rounded-lg shadow mt-4" shadow="never">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-semibold">Deducciones de Nómina</span>
                <el-button text @click="fetchDeducciones" :loading="loading">Refrescar</el-button>
              </div>
            </template>
            <div class="overflow-x-auto">
              <el-table :data="deducciones" stripe border v-loading="loading">
                <el-table-column prop="id_deduccion" label="ID" width="80" />
                <el-table-column prop="nombre" label="Nombre" />
                <el-table-column prop="tipo" label="Tipo" width="120" />
                <el-table-column prop="porcentaje" label="Porcentaje" width="100" />
                <el-table-column prop="monto_fijo" label="Monto Fijo" width="120" />
              </el-table>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style scoped>
.el-statistic {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  margin-bottom: 10px;
}

:deep(.el-statistic__title) {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

:deep(.el-statistic__content) {
  font-size: 24px;
  color: #303133;
  font-weight: 700;
}

.el-table {
  font-size: 14px;
}

.el-alert {
  border-radius: 6px;
}
</style>