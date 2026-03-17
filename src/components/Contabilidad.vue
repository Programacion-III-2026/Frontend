<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['back-to-dashboard'])

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const cuentas = ref([])
const asientos = ref([])
const movimientos = ref([])
const balance = ref([])

const cuentaForm = reactive({
  codigo: '',
  nombre: '',
  tipo: ''
})

const asientoForm = reactive({
  fecha: '',
  descripcion: ''
})

const movimientoForm = reactive({
  id_asiento: '',
  id_cuenta: '',
  debe: 0,
  haber: 0
})

const fetchAll = async () => {
  loading.value = true
  try {
    const [cuentasRes, asientosRes, movimientosRes, balanceRes] = await Promise.all([
      fetch(`${API_URL}/api/contabilidad/cuentas`),
      fetch(`${API_URL}/api/contabilidad/asientos`),
      fetch(`${API_URL}/api/contabilidad/movimientos`),
      fetch(`${API_URL}/api/contabilidad/balance`)
    ])

    if (!cuentasRes.ok || !asientosRes.ok || !movimientosRes.ok || !balanceRes.ok) {
      throw new Error('No se pudieron cargar los datos de contabilidad')
    }

    cuentas.value = await cuentasRes.json()
    asientos.value = await asientosRes.json()
    movimientos.value = await movimientosRes.json()
    balance.value = await balanceRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const crearCuenta = async () => {
  try {
    const response = await fetch(`${API_URL}/api/contabilidad/cuentas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuentaForm)
    })

    if (!response.ok) {
      throw new Error('No se pudo crear la cuenta')
    }

    ElMessage.success('Cuenta creada')
    cuentaForm.codigo = ''
    cuentaForm.nombre = ''
    cuentaForm.tipo = ''
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const crearAsiento = async () => {
  try {
    const response = await fetch(`${API_URL}/api/contabilidad/asientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asientoForm)
    })

    if (!response.ok) {
      throw new Error('No se pudo crear el asiento')
    }

    ElMessage.success('Asiento creado')
    asientoForm.fecha = ''
    asientoForm.descripcion = ''
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const crearMovimiento = async () => {
  try {
    const payload = {
      id_asiento: Number(movimientoForm.id_asiento),
      id_cuenta: Number(movimientoForm.id_cuenta),
      debe: Number(movimientoForm.debe),
      haber: Number(movimientoForm.haber)
    }

    const response = await fetch(`${API_URL}/api/contabilidad/movimientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('No se pudo crear el movimiento')
    }

    ElMessage.success('Movimiento creado')
    movimientoForm.id_asiento = ''
    movimientoForm.id_cuenta = ''
    movimientoForm.debe = 0
    movimientoForm.haber = 0
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
          <h1 class="text-2xl font-bold">Contabilidad</h1>
          <p class="text-slate-300">Cuentas, asientos, movimientos y balance</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
          <el-button type="info" plain @click="volver">Volver</el-button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Cuentas contables</div>
          </template>
          <el-form label-width="120px" class="mb-4">
            <el-form-item label="Código">
              <el-input v-model="cuentaForm.codigo" placeholder="101" />
            </el-form-item>
            <el-form-item label="Nombre">
              <el-input v-model="cuentaForm.nombre" placeholder="Caja" />
            </el-form-item>
            <el-form-item label="Tipo">
              <el-select v-model="cuentaForm.tipo" placeholder="Activo" class="w-full">
                <el-option label="Activo" value="Activo" />
                <el-option label="Pasivo" value="Pasivo" />
                <el-option label="Patrimonio" value="Patrimonio" />
                <el-option label="Ingreso" value="Ingreso" />
                <el-option label="Gasto" value="Gasto" />
              </el-select>
            </el-form-item>
            <el-button type="success" @click="crearCuenta">Crear cuenta</el-button>
          </el-form>
          <div class="overflow-x-auto">
            <el-table :data="cuentas" stripe border class="w-full" height="280">
              <el-table-column prop="id_cuenta" label="ID" width="80" />
              <el-table-column prop="codigo" label="Código" width="120" />
              <el-table-column prop="nombre" label="Nombre" />
              <el-table-column prop="tipo" label="Tipo" width="140" />
            </el-table>
          </div>
        </el-card>

        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Asientos contables</div>
          </template>
          <el-form label-width="120px" class="mb-4">
            <el-form-item label="Fecha">
              <el-date-picker v-model="asientoForm.fecha" type="date" placeholder="Selecciona fecha" class="w-full" />
            </el-form-item>
            <el-form-item label="Descripción">
              <el-input v-model="asientoForm.descripcion" placeholder="Pago de servicios" />
            </el-form-item>
            <el-button type="success" @click="crearAsiento">Crear asiento</el-button>
          </el-form>
          <div class="overflow-x-auto">
            <el-table :data="asientos" stripe border class="w-full" height="280">
              <el-table-column prop="id_asiento" label="ID" width="80" />
              <el-table-column prop="fecha" label="Fecha" width="140" />
              <el-table-column prop="descripcion" label="Descripción" />
            </el-table>
          </div>
        </el-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Movimientos contables</div>
          </template>
          <el-form label-width="120px" class="mb-4">
            <el-form-item label="Asiento">
              <el-input v-model="movimientoForm.id_asiento" placeholder="ID de asiento" />
            </el-form-item>
            <el-form-item label="Cuenta">
              <el-input v-model="movimientoForm.id_cuenta" placeholder="ID de cuenta" />
            </el-form-item>
            <el-form-item label="Debe">
              <el-input-number v-model="movimientoForm.debe" :min="0" class="w-full" />
            </el-form-item>
            <el-form-item label="Haber">
              <el-input-number v-model="movimientoForm.haber" :min="0" class="w-full" />
            </el-form-item>
            <el-button type="success" @click="crearMovimiento">Crear movimiento</el-button>
          </el-form>
          <div class="overflow-x-auto">
            <el-table :data="movimientos" stripe border class="w-full" height="280">
              <el-table-column prop="id_movimiento" label="ID" width="80" />
              <el-table-column prop="codigo" label="Cuenta" width="140" />
              <el-table-column prop="descripcion" label="Asiento" />
              <el-table-column prop="debe" label="Debe" width="120" />
              <el-table-column prop="haber" label="Haber" width="120" />
            </el-table>
          </div>
        </el-card>

        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Balance</div>
          </template>
          <div class="overflow-x-auto">
            <el-table :data="balance" stripe border class="w-full" height="480">
              <el-table-column prop="codigo" label="Código" width="120" />
              <el-table-column prop="nombre" label="Cuenta" />
              <el-table-column prop="tipo" label="Tipo" width="140" />
              <el-table-column prop="total_debe" label="Debe" width="120" />
              <el-table-column prop="total_haber" label="Haber" width="120" />
            </el-table>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
