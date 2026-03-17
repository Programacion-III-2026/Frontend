<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const planilla = ref([])
const empleados = ref([])

const IHSS_MONTO_FIJO = 600
const RAP_MONTO_FIJO = 125

const planillaForm = reactive({
  id_empleado: '',
  mes: '',
  anio: ''
})

const empleadoSeleccionado = computed(() => {
  return empleados.value.find(emp => emp.id_empleado === planillaForm.id_empleado)
})

const redondear2 = (valor) => Math.round((Number(valor || 0) + Number.EPSILON) * 100) / 100

const calcularDeducciones = (salarioBruto) => {
  const bruto = Number(salarioBruto || 0)
  const deduccionIHSS = bruto > 0 ? IHSS_MONTO_FIJO : 0
  const deduccionRAP = bruto > 0 ? RAP_MONTO_FIJO : 0
  const totalDeducciones = redondear2(deduccionIHSS + deduccionRAP)
  const salarioNeto = redondear2(bruto - totalDeducciones)
  return { bruto, deduccionIHSS, deduccionRAP, totalDeducciones, salarioNeto }
}

const obtenerResumenNomina = (row) => {
  if (
    row.salario_bruto !== undefined &&
    row.deduccion_ihss !== undefined &&
    row.deduccion_rap !== undefined &&
    row.total_deducciones !== undefined &&
    row.salario_neto !== undefined
  ) {
    return {
      bruto: Number(row.salario_bruto || 0),
      deduccionIHSS: Number(row.deduccion_ihss || 0),
      deduccionRAP: Number(row.deduccion_rap || 0),
      totalDeducciones: Number(row.total_deducciones || 0),
      salarioNeto: Number(row.salario_neto || 0)
    }
  }

  return calcularDeducciones(row.total_pago)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(Number(value || 0))
}

const fetchEmpleados = async () => {
  try {
    const res = await fetch(`${API_URL}/api/rrhh/empleados`)
    if (!res.ok) throw new Error('No se pudieron cargar empleados')
    empleados.value = await res.json()
  } catch (error) {
    console.error('Error cargando empleados:', error.message)
  }
}

const fetchAll = async () => {
  loading.value = true
  try {
    await Promise.all([fetchEmpleados(), fetchPlanilla()])
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const fetchPlanilla = async () => {
  try {
    const planillaRes = await fetch(`${API_URL}/api/rrhh/planilla`)

    if (!planillaRes.ok) {
      throw new Error('No se pudieron cargar los datos de planilla')
    }

    planilla.value = await planillaRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const crearPlanilla = async () => {
  try {
    const payload = {
      id_empleado: Number(planillaForm.id_empleado),
      mes: Number(planillaForm.mes),
      anio: Number(planillaForm.anio)
    }

    const response = await fetch(`${API_URL}/api/rrhh/planilla`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('No se pudo crear la planilla')
    }

    const data = await response.json()
    const neto = data?.detalles?.salario_neto
    if (neto !== undefined) {
      ElMessage.success(`Planilla creada. Neto: ${formatCurrency(neto)}`)
    } else {
      ElMessage.success('Planilla creada')
    }

    planillaForm.id_empleado = ''
    planillaForm.mes = ''
    planillaForm.anio = ''
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

onMounted(fetchAll)
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Nómina</h2>
          <p class="text-gray-600">Gestión de planillas de pago</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
        </div>
      </div>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="font-semibold">Crear Nueva Planilla</div>
        </template>
        <el-form label-width="120px" class="mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="Empleado">
              <el-select v-model="planillaForm.id_empleado" placeholder="Selecciona un empleado" class="w-full">
                <el-option
                  v-for="emp in empleados"
                  :key="emp.id_empleado"
                  :label="`${emp.nombre} ${emp.apellido}`"
                  :value="emp.id_empleado"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Mes">
              <el-input v-model="planillaForm.mes" placeholder="2" />
            </el-form-item>
            <el-form-item label="Año">
              <el-input v-model="planillaForm.anio" placeholder="2026" />
            </el-form-item>
            <el-form-item label="Salario base">
              <el-input :model-value="empleadoSeleccionado ? formatCurrency(empleadoSeleccionado.salario) : ''" readonly placeholder="Se toma automáticamente del empleado" />
            </el-form-item>
          </div>
          <el-button type="success" @click="crearPlanilla">Crear planilla</el-button>
        </el-form>
      </el-card>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="font-semibold">Listado de Planillas</div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="planilla" stripe border class="w-full">
            <el-table-column prop="id_planilla" label="ID" width="80" />
            <el-table-column label="Empleado" min-width="200">
              <template #default="{ row }">
                {{ row.nombre }} {{ row.apellido }}
              </template>
            </el-table-column>
            <el-table-column prop="mes" label="Mes" width="100" />
            <el-table-column prop="anio" label="Año" width="120" />
            <el-table-column label="Bruto" width="140">
              <template #default="{ row }">
                {{ formatCurrency(obtenerResumenNomina(row).bruto) }}
              </template>
            </el-table-column>
            <el-table-column label="IHSS (L 600)" width="140">
              <template #default="{ row }">
                {{ formatCurrency(obtenerResumenNomina(row).deduccionIHSS) }}
              </template>
            </el-table-column>
            <el-table-column label="RAP (L 125)" width="140">
              <template #default="{ row }">
                {{ formatCurrency(obtenerResumenNomina(row).deduccionRAP) }}
              </template>
            </el-table-column>
            <el-table-column label="Deducciones" width="150">
              <template #default="{ row }">
                {{ formatCurrency(obtenerResumenNomina(row).totalDeducciones) }}
              </template>
            </el-table-column>
            <el-table-column label="Neto" width="140">
              <template #default="{ row }">
                {{ formatCurrency(obtenerResumenNomina(row).salarioNeto) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
