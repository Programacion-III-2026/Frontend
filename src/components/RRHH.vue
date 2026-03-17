<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import Ausencias from './Ausencias.vue'
import Descuentos from './Descuentos.vue'

const emit = defineEmits(['back-to-dashboard'])

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const empleados = ref([])
const asistencia = ref([])
const planilla = ref([])

const empleadoForm = reactive({
  nombre: '',
  apellido: '',
  puesto: '',
  salario: 0,
  fecha_ingreso: ''
})

const asistenciaForm = reactive({
  id_empleado: '',
  fecha: '',
  hora_entrada: '',
  hora_salida: ''
})

const planillaForm = reactive({
  id_empleado: '',
  mes: '',
  anio: '',
  total_pago: 0
})

const fetchAll = async () => {
  loading.value = true
  try {
    const [empleadosRes, asistenciaRes, planillaRes] = await Promise.all([
      fetch(`${API_URL}/api/rrhh/empleados`),
      fetch(`${API_URL}/api/rrhh/asistencia`),
      fetch(`${API_URL}/api/rrhh/planilla`)
    ])

    if (!empleadosRes.ok || !asistenciaRes.ok || !planillaRes.ok) {
      throw new Error('No se pudieron cargar los datos de RRHH')
    }

    empleados.value = await empleadosRes.json()
    asistencia.value = await asistenciaRes.json()
    planilla.value = await planillaRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const crearEmpleado = async () => {
  try {
    const response = await fetch(`${API_URL}/api/rrhh/empleados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empleadoForm)
    })

    if (!response.ok) {
      throw new Error('No se pudo crear el empleado')
    }

    ElMessage.success('Empleado creado')
    empleadoForm.nombre = ''
    empleadoForm.apellido = ''
    empleadoForm.puesto = ''
    empleadoForm.salario = 0
    empleadoForm.fecha_ingreso = ''
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const registrarAsistencia = async () => {
  try {
    const payload = {
      id_empleado: Number(asistenciaForm.id_empleado),
      fecha: asistenciaForm.fecha,
      hora_entrada: asistenciaForm.hora_entrada,
      hora_salida: asistenciaForm.hora_salida
    }

    const response = await fetch(`${API_URL}/api/rrhh/asistencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('No se pudo registrar la asistencia')
    }

    ElMessage.success('Asistencia registrada')
    asistenciaForm.id_empleado = ''
    asistenciaForm.fecha = ''
    asistenciaForm.hora_entrada = ''
    asistenciaForm.hora_salida = ''
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const crearPlanilla = async () => {
  try {
    const payload = {
      id_empleado: Number(planillaForm.id_empleado),
      mes: Number(planillaForm.mes),
      anio: Number(planillaForm.anio),
      total_pago: Number(planillaForm.total_pago)
    }

    const response = await fetch(`${API_URL}/api/rrhh/planilla`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('No se pudo crear la planilla')
    }

    ElMessage.success('Planilla creada')
    planillaForm.id_empleado = ''
    planillaForm.mes = ''
    planillaForm.anio = ''
    planillaForm.total_pago = 0
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const volver = () => emit('back-to-dashboard')

onMounted(fetchAll)
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Recursos Humanos</h1>
          <p class="text-slate-300">Empleados, asistencia y planilla</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
          <el-button type="info" plain @click="volver">Volver</el-button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Empleados</div>
          </template>
          <el-form label-width="120px" class="mb-4">
            <el-form-item label="Nombre">
              <el-input v-model="empleadoForm.nombre" placeholder="Juan" />
            </el-form-item>
            <el-form-item label="Apellido">
              <el-input v-model="empleadoForm.apellido" placeholder="Pérez" />
            </el-form-item>
            <el-form-item label="Puesto">
              <el-input v-model="empleadoForm.puesto" placeholder="Ingeniero" />
            </el-form-item>
            <el-form-item label="Salario">
              <el-input-number v-model="empleadoForm.salario" :min="0" class="w-full" />
            </el-form-item>
            <el-form-item label="Ingreso">
              <el-date-picker v-model="empleadoForm.fecha_ingreso" type="date" class="w-full" />
            </el-form-item>
            <el-button type="success" @click="crearEmpleado">Crear empleado</el-button>
          </el-form>
          <div class="overflow-x-auto">
            <el-table :data="empleados" stripe border class="w-full" height="280">
              <el-table-column prop="id_empleado" label="ID" width="80" />
              <el-table-column prop="nombre" label="Nombre" />
              <el-table-column prop="apellido" label="Apellido" />
              <el-table-column prop="puesto" label="Puesto" width="160" />
              <el-table-column prop="salario" label="Salario" width="120" />
            </el-table>
          </div>
        </el-card>

        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Asistencia</div>
          </template>
          <el-form label-width="120px" class="mb-4">
            <el-form-item label="Empleado">
              <el-input v-model="asistenciaForm.id_empleado" placeholder="ID empleado" />
            </el-form-item>
            <el-form-item label="Fecha">
              <el-date-picker v-model="asistenciaForm.fecha" type="date" class="w-full" />
            </el-form-item>
            <el-form-item label="Entrada">
              <el-time-picker v-model="asistenciaForm.hora_entrada" class="w-full" />
            </el-form-item>
            <el-form-item label="Salida">
              <el-time-picker v-model="asistenciaForm.hora_salida" class="w-full" />
            </el-form-item>
            <el-button type="success" @click="registrarAsistencia">Registrar asistencia</el-button>
          </el-form>
          <div class="overflow-x-auto">
            <el-table :data="asistencia" stripe border class="w-full" height="280">
              <el-table-column prop="id_asistencia" label="ID" width="80" />
              <el-table-column prop="empleado_nombre" label="Empleado" />
              <el-table-column prop="fecha" label="Fecha" width="140" />
              <el-table-column prop="hora_entrada" label="Entrada" width="120" />
              <el-table-column prop="hora_salida" label="Salida" width="120" />
            </el-table>
          </div>
        </el-card>
      </div>

      <div class="mt-6">
        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Planilla</div>
          </template>
          <el-form label-width="120px" class="mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <el-form-item label="Empleado">
                <el-input v-model="planillaForm.id_empleado" placeholder="ID empleado" />
              </el-form-item>
              <el-form-item label="Mes">
                <el-input v-model="planillaForm.mes" placeholder="2" />
              </el-form-item>
              <el-form-item label="Año">
                <el-input v-model="planillaForm.anio" placeholder="2026" />
              </el-form-item>
              <el-form-item label="Total pago">
                <el-input-number v-model="planillaForm.total_pago" :min="0" class="w-full" />
              </el-form-item>
            </div>
            <el-button type="success" @click="crearPlanilla">Crear planilla</el-button>
          </el-form>
          <div class="overflow-x-auto">
            <el-table :data="planilla" stripe border class="w-full">
              <el-table-column prop="id_planilla" label="ID" width="80" />
              <el-table-column prop="empleado_nombre" label="Empleado" />
              <el-table-column prop="mes" label="Mes" width="100" />
              <el-table-column prop="anio" label="Año" width="120" />
              <el-table-column prop="total_pago" label="Total" width="140" />
            </el-table>
          </div>
        </el-card>

        <el-divider />
        <Ausencias />
        <el-divider />
        <Descuentos />
      </div>
    </div>
  </div>
</template>
