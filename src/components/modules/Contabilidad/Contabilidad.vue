<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import Chart from 'chart.js/auto'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const cuentas = ref([])
const asientos = ref([])
const movimientos = ref([])
const balance = ref([])

const estadoResultados = ref({ ingresos: [], gastos: [], resumen: { total_ingresos: 0, total_gastos: 0, utilidad_neta: 0 } })
const balanceGeneral = ref({ activos: [], pasivos: [], patrimonio: [], resumen: { total_activos: 0, total_pasivos: 0, total_patrimonio: 0, total_pasivo_mas_patrimonio: 0, diferencia_balance: 0, esta_cuadrado: true } })
const flujoCaja = ref({ anio: new Date().getFullYear(), flujo: [] })

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

const filtrosAsientos = reactive({
  fechaDesde: '',
  fechaHasta: '',
  montoMin: null,
  montoMax: null,
  idCuenta: ''
})

const filtrosReportes = reactive({
  fechaDesde: '',
  fechaHasta: '',
  fechaBalanceHasta: '',
  anioFlujo: new Date().getFullYear()
})

let flujoCajaChart = null
const flujoCajaChartRef = ref(null)

const formatDateParam = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(Number(value || 0))
}

const buildAsientosQuery = () => {
  const params = new URLSearchParams()
  const fechaDesde = formatDateParam(filtrosAsientos.fechaDesde)
  const fechaHasta = formatDateParam(filtrosAsientos.fechaHasta)

  if (fechaDesde) params.append('fechaDesde', fechaDesde)
  if (fechaHasta) params.append('fechaHasta', fechaHasta)
  if (filtrosAsientos.montoMin !== null && filtrosAsientos.montoMin !== '') params.append('montoMin', String(filtrosAsientos.montoMin))
  if (filtrosAsientos.montoMax !== null && filtrosAsientos.montoMax !== '') params.append('montoMax', String(filtrosAsientos.montoMax))
  if (filtrosAsientos.idCuenta) params.append('idCuenta', String(filtrosAsientos.idCuenta))

  const query = params.toString()
  return query ? `?${query}` : ''
}

const fetchAsientos = async () => {
  const query = buildAsientosQuery()
  const res = await fetch(`${API_URL}/api/contabilidad/asientos${query}`)
  if (!res.ok) throw new Error('No se pudieron cargar los asientos')
  asientos.value = await res.json()
}

const fetchReportes = async () => {
  const paramsPL = new URLSearchParams()
  const fechaDesde = formatDateParam(filtrosReportes.fechaDesde)
  const fechaHasta = formatDateParam(filtrosReportes.fechaHasta)
  if (fechaDesde) paramsPL.append('fechaDesde', fechaDesde)
  if (fechaHasta) paramsPL.append('fechaHasta', fechaHasta)

  const paramsBG = new URLSearchParams()
  const fechaBalanceHasta = formatDateParam(filtrosReportes.fechaBalanceHasta)
  if (fechaBalanceHasta) paramsBG.append('fechaHasta', fechaBalanceHasta)

  const paramsFlujo = new URLSearchParams({ anio: String(filtrosReportes.anioFlujo || new Date().getFullYear()) })

  const [plRes, bgRes, flujoRes] = await Promise.all([
    fetch(`${API_URL}/api/contabilidad/reportes/estado-resultados?${paramsPL.toString()}`),
    fetch(`${API_URL}/api/contabilidad/reportes/balance-general?${paramsBG.toString()}`),
    fetch(`${API_URL}/api/contabilidad/reportes/flujo-caja-mensual?${paramsFlujo.toString()}`)
  ])

  if (!plRes.ok || !bgRes.ok || !flujoRes.ok) {
    throw new Error('No se pudieron cargar los reportes contables')
  }

  estadoResultados.value = await plRes.json()
  balanceGeneral.value = await bgRes.json()
  flujoCaja.value = await flujoRes.json()

  renderFlujoCajaChart()
}

const fetchAll = async () => {
  loading.value = true
  try {
    const [cuentasRes, movimientosRes, balanceRes] = await Promise.all([
      fetch(`${API_URL}/api/contabilidad/cuentas`),
      fetch(`${API_URL}/api/contabilidad/movimientos`),
      fetch(`${API_URL}/api/contabilidad/balance`)
    ])

    if (!cuentasRes.ok || !movimientosRes.ok || !balanceRes.ok) {
      throw new Error('No se pudieron cargar los datos de contabilidad')
    }

    cuentas.value = await cuentasRes.json()
    movimientos.value = await movimientosRes.json()
    balance.value = await balanceRes.json()

    await Promise.all([fetchAsientos(), fetchReportes()])
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

    if (!response.ok) throw new Error('No se pudo crear la cuenta')

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
    const payload = {
      fecha: formatDateParam(asientoForm.fecha),
      descripcion: asientoForm.descripcion
    }

    const response = await fetch(`${API_URL}/api/contabilidad/asientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error('No se pudo crear el asiento')

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

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo crear el movimiento')
    }

    if (data.validacion_asiento?.esta_cuadrado) {
      ElMessage.success(`Movimiento creado. Asiento #${data.validacion_asiento.id_asiento} cuadrado.`)
    } else {
      ElMessage.warning(`Movimiento creado. Asiento #${data.validacion_asiento?.id_asiento} descuadrado por ${data.validacion_asiento?.diferencia || 0}.`)
    }

    movimientoForm.id_asiento = ''
    movimientoForm.id_cuenta = ''
    movimientoForm.debe = 0
    movimientoForm.haber = 0
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const aplicarFiltrosAsientos = async () => {
  loading.value = true
  try {
    await fetchAsientos()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const limpiarFiltrosAsientos = async () => {
  filtrosAsientos.fechaDesde = ''
  filtrosAsientos.fechaHasta = ''
  filtrosAsientos.montoMin = null
  filtrosAsientos.montoMax = null
  filtrosAsientos.idCuenta = ''
  await aplicarFiltrosAsientos()
}

const aplicarFiltrosReportes = async () => {
  loading.value = true
  try {
    await fetchReportes()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const renderFlujoCajaChart = () => {
  nextTick(() => {
    if (!flujoCajaChartRef.value) return
    if (flujoCajaChart) flujoCajaChart.destroy()

    const labels = flujoCaja.value.flujo.map(item => item.mes)
    const ingresos = flujoCaja.value.flujo.map(item => Number(item.ingresos || 0))
    const egresos = flujoCaja.value.flujo.map(item => Number(item.egresos || 0))
    const neto = flujoCaja.value.flujo.map(item => Number(item.neto || 0))

    flujoCajaChart = new Chart(flujoCajaChartRef.value.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Ingresos', data: ingresos, backgroundColor: '#10b981' },
          { label: 'Egresos', data: egresos, backgroundColor: '#ef4444' },
          { label: 'Neto', data: neto, type: 'line', borderColor: '#2563eb', backgroundColor: '#2563eb', tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    })
  })
}

const escapeHtml = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const downloadCsv = (filename, headers, rows) => {
  const headerLine = headers.join(',')
  const lines = rows.map(row => row.map(cell => {
    const value = String(cell ?? '').replace(/"/g, '""')
    return `"${value}"`
  }).join(','))

  const csvContent = ['\uFEFF' + headerLine, ...lines].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const openPrintView = (title, headers, rows, summaryRows = []) => {
  const tableHeaders = headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')
  const tableRows = rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')
  const summaryHtml = summaryRows.length > 0
    ? `<div class="summary">${summaryRows.map(s => `<p>${escapeHtml(s)}</p>`).join('')}</div>`
    : ''

  const win = window.open('', '_blank')
  if (!win) {
    ElMessage.error('No se pudo abrir la ventana de impresión')
    return
  }

  win.document.write(`
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { margin: 0 0 10px; }
          .meta { margin: 0 0 15px; color: #555; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #f3f4f6; text-align: left; }
          .summary { margin-top: 15px; }
          .summary p { margin: 4px 0; font-weight: 600; }
        </style>
      </head>
      <body>
        <h2>${escapeHtml(title)}</h2>
        <p class="meta">Generado: ${escapeHtml(new Date().toLocaleString())}</p>
        <table>
          <thead><tr>${tableHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        ${summaryHtml}
      </body>
    </html>
  `)

  win.document.close()
  win.focus()
  win.print()
}

const exportarAsientosExcel = () => {
  const headers = ['ID', 'Fecha', 'Descripcion', 'Monto', 'Debe', 'Haber', 'Diferencia', 'Cuadrado']
  const rows = asientos.value.map(a => [
    a.id_asiento,
    a.fecha,
    a.descripcion,
    a.monto_asiento,
    a.total_debe,
    a.total_haber,
    a.diferencia,
    a.esta_cuadrado ? 'Si' : 'No'
  ])
  downloadCsv('asientos_filtrados.csv', headers, rows)
}

const exportarAsientosPDF = () => {
  const headers = ['ID', 'Fecha', 'Descripcion', 'Monto', 'Debe', 'Haber', 'Diferencia', 'Cuadrado']
  const rows = asientos.value.map(a => [
    a.id_asiento,
    a.fecha,
    a.descripcion,
    formatCurrency(a.monto_asiento),
    formatCurrency(a.total_debe),
    formatCurrency(a.total_haber),
    formatCurrency(a.diferencia),
    a.esta_cuadrado ? 'Si' : 'No'
  ])
  openPrintView('Asientos Contables Filtrados', headers, rows)
}

const exportarEstadoResultadosExcel = () => {
  const data = [...estadoResultados.value.ingresos, ...estadoResultados.value.gastos]
  const headers = ['Codigo', 'Cuenta', 'Tipo', 'Saldo']
  const rows = data.map(i => [i.codigo, i.nombre, i.tipo, i.saldo])
  downloadCsv('estado_resultados.csv', headers, rows)
}

const exportarEstadoResultadosPDF = () => {
  const data = [...estadoResultados.value.ingresos, ...estadoResultados.value.gastos]
  const headers = ['Codigo', 'Cuenta', 'Tipo', 'Saldo']
  const rows = data.map(i => [i.codigo, i.nombre, i.tipo, formatCurrency(i.saldo)])
  const resumen = [
    `Total Ingresos: ${formatCurrency(estadoResultados.value.resumen.total_ingresos)}`,
    `Total Gastos: ${formatCurrency(estadoResultados.value.resumen.total_gastos)}`,
    `Utilidad Neta: ${formatCurrency(estadoResultados.value.resumen.utilidad_neta)}`
  ]
  openPrintView('Estado de Resultados (P&L)', headers, rows, resumen)
}

const exportarBalanceGeneralExcel = () => {
  const data = [...balanceGeneral.value.activos, ...balanceGeneral.value.pasivos, ...balanceGeneral.value.patrimonio]
  const headers = ['Codigo', 'Cuenta', 'Tipo', 'Saldo']
  const rows = data.map(i => [i.codigo, i.nombre, i.tipo, i.saldo])
  downloadCsv('balance_general.csv', headers, rows)
}

const exportarBalanceGeneralPDF = () => {
  const data = [...balanceGeneral.value.activos, ...balanceGeneral.value.pasivos, ...balanceGeneral.value.patrimonio]
  const headers = ['Codigo', 'Cuenta', 'Tipo', 'Saldo']
  const rows = data.map(i => [i.codigo, i.nombre, i.tipo, formatCurrency(i.saldo)])
  const resumen = [
    `Total Activos: ${formatCurrency(balanceGeneral.value.resumen.total_activos)}`,
    `Total Pasivos: ${formatCurrency(balanceGeneral.value.resumen.total_pasivos)}`,
    `Total Patrimonio: ${formatCurrency(balanceGeneral.value.resumen.total_patrimonio)}`,
    `Pasivo + Patrimonio: ${formatCurrency(balanceGeneral.value.resumen.total_pasivo_mas_patrimonio)}`,
    `Diferencia: ${formatCurrency(balanceGeneral.value.resumen.diferencia_balance)}`,
    `Cuadrado: ${balanceGeneral.value.resumen.esta_cuadrado ? 'Si' : 'No'}`
  ]
  openPrintView('Balance General', headers, rows, resumen)
}

onMounted(fetchAll)

onBeforeUnmount(() => {
  if (flujoCajaChart) {
    flujoCajaChart.destroy()
    flujoCajaChart = null
  }
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Contabilidad</h2>
          <p class="text-gray-600">Asientos contables, reportes financieros y flujo de caja</p>
        </div>
        <div class="flex gap-2">
          <el-button @click="exportarAsientosExcel">Asientos Excel</el-button>
          <el-button @click="exportarAsientosPDF">Asientos PDF</el-button>
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <el-card class="bg-white rounded-lg shadow" shadow="never">
          <template #header>
            <div class="font-semibold">Cuentas contables</div>
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

        <el-card class="bg-white rounded-lg shadow" shadow="never">
          <template #header>
            <div class="font-semibold">Asientos contables</div>
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

          <el-divider>Buscador avanzado</el-divider>
          <el-form label-width="120px" class="mb-4">
            <el-form-item label="Fecha desde">
              <el-date-picker v-model="filtrosAsientos.fechaDesde" type="date" class="w-full" />
            </el-form-item>
            <el-form-item label="Fecha hasta">
              <el-date-picker v-model="filtrosAsientos.fechaHasta" type="date" class="w-full" />
            </el-form-item>
            <el-form-item label="Monto mínimo">
              <el-input-number v-model="filtrosAsientos.montoMin" :min="0" class="w-full" />
            </el-form-item>
            <el-form-item label="Monto máximo">
              <el-input-number v-model="filtrosAsientos.montoMax" :min="0" class="w-full" />
            </el-form-item>
            <el-form-item label="Cuenta contable">
              <el-select v-model="filtrosAsientos.idCuenta" clearable placeholder="Todas" class="w-full">
                <el-option
                  v-for="cuenta in cuentas"
                  :key="cuenta.id_cuenta"
                  :label="`${cuenta.codigo} - ${cuenta.nombre}`"
                  :value="cuenta.id_cuenta"
                />
              </el-select>
            </el-form-item>
            <div class="flex gap-2">
              <el-button type="primary" @click="aplicarFiltrosAsientos">Buscar</el-button>
              <el-button @click="limpiarFiltrosAsientos">Limpiar</el-button>
            </div>
          </el-form>

          <div class="overflow-x-auto">
            <el-table :data="asientos" stripe border class="w-full" height="280">
              <el-table-column prop="id_asiento" label="ID" width="80" />
              <el-table-column prop="fecha" label="Fecha" width="140" />
              <el-table-column prop="descripcion" label="Descripción" />
              <el-table-column prop="monto_asiento" label="Monto" width="120">
                <template #default="{ row }">{{ formatCurrency(row.monto_asiento) }}</template>
              </el-table-column>
              <el-table-column label="Validación" width="130" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.esta_cuadrado ? 'success' : 'danger'">
                    {{ row.esta_cuadrado ? 'Cuadrado' : 'Descuadrado' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <el-card class="bg-white rounded-lg shadow" shadow="never">
          <template #header>
            <div class="font-semibold">Movimientos contables</div>
          </template>
          <el-form label-width="120px" class="mb-4">
            <el-form-item label="Asiento">
              <el-select v-model="movimientoForm.id_asiento" placeholder="Selecciona asiento" class="w-full">
                <el-option
                  v-for="asiento in asientos"
                  :key="asiento.id_asiento"
                  :label="`#${asiento.id_asiento} - ${asiento.descripcion || 'Sin descripción'}`"
                  :value="asiento.id_asiento"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Cuenta">
              <el-select v-model="movimientoForm.id_cuenta" placeholder="Selecciona cuenta" class="w-full">
                <el-option
                  v-for="cuenta in cuentas"
                  :key="cuenta.id_cuenta"
                  :label="`${cuenta.codigo} - ${cuenta.nombre}`"
                  :value="cuenta.id_cuenta"
                />
              </el-select>
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
              <el-table-column prop="asiento_fecha" label="Fecha" width="120" />
              <el-table-column prop="codigo" label="Cuenta" width="140" />
              <el-table-column prop="asiento_desc" label="Asiento" />
              <el-table-column prop="debe" label="Debe" width="120" />
              <el-table-column prop="haber" label="Haber" width="120" />
            </el-table>
          </div>
        </el-card>

        <el-card class="bg-white rounded-lg shadow" shadow="never">
          <template #header>
            <div class="font-semibold">Balance</div>
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

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="font-semibold">Reportes financieros automáticos</div>
            <div class="flex gap-2">
              <el-button @click="exportarEstadoResultadosExcel">P&L Excel</el-button>
              <el-button @click="exportarEstadoResultadosPDF">P&L PDF</el-button>
              <el-button @click="exportarBalanceGeneralExcel">Balance Excel</el-button>
              <el-button @click="exportarBalanceGeneralPDF">Balance PDF</el-button>
            </div>
          </div>
        </template>

        <el-form inline class="mb-4">
          <el-form-item label="P&L desde">
            <el-date-picker v-model="filtrosReportes.fechaDesde" type="date" />
          </el-form-item>
          <el-form-item label="P&L hasta">
            <el-date-picker v-model="filtrosReportes.fechaHasta" type="date" />
          </el-form-item>
          <el-form-item label="Balance hasta">
            <el-date-picker v-model="filtrosReportes.fechaBalanceHasta" type="date" />
          </el-form-item>
          <el-form-item label="Año flujo caja">
            <el-input-number v-model="filtrosReportes.anioFlujo" :min="2000" :max="2100" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="aplicarFiltrosReportes">Generar reportes</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="20" class="mb-4">
          <el-col :xs="24" :md="8">
            <el-statistic title="Total Ingresos" :value="estadoResultados.resumen.total_ingresos">
              <template #formatter>{{ formatCurrency(estadoResultados.resumen.total_ingresos) }}</template>
            </el-statistic>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-statistic title="Total Gastos" :value="estadoResultados.resumen.total_gastos">
              <template #formatter>{{ formatCurrency(estadoResultados.resumen.total_gastos) }}</template>
            </el-statistic>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-statistic title="Utilidad Neta" :value="estadoResultados.resumen.utilidad_neta">
              <template #formatter>{{ formatCurrency(estadoResultados.resumen.utilidad_neta) }}</template>
            </el-statistic>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :lg="12">
            <h4 class="mb-2">Estado de Resultados (P&L)</h4>
            <el-table :data="[...estadoResultados.ingresos, ...estadoResultados.gastos]" stripe border height="260">
              <el-table-column prop="codigo" label="Código" width="100" />
              <el-table-column prop="nombre" label="Cuenta" />
              <el-table-column prop="tipo" label="Tipo" width="120" />
              <el-table-column prop="saldo" label="Saldo" width="150">
                <template #default="{ row }">{{ formatCurrency(row.saldo) }}</template>
              </el-table-column>
            </el-table>
          </el-col>

          <el-col :xs="24" :lg="12">
            <h4 class="mb-2">Balance General</h4>
            <el-table :data="[...balanceGeneral.activos, ...balanceGeneral.pasivos, ...balanceGeneral.patrimonio]" stripe border height="260">
              <el-table-column prop="codigo" label="Código" width="100" />
              <el-table-column prop="nombre" label="Cuenta" />
              <el-table-column prop="tipo" label="Tipo" width="120" />
              <el-table-column prop="saldo" label="Saldo" width="150">
                <template #default="{ row }">{{ formatCurrency(row.saldo) }}</template>
              </el-table-column>
            </el-table>
            <el-alert
              style="margin-top: 10px"
              :title="balanceGeneral.resumen.esta_cuadrado ? 'Balance cuadrado' : `Balance descuadrado por ${formatCurrency(balanceGeneral.resumen.diferencia_balance)}`"
              :type="balanceGeneral.resumen.esta_cuadrado ? 'success' : 'warning'"
              :closable="false"
            />
          </el-col>
        </el-row>

        <el-divider />
        <h4 class="mb-2">Flujo de Caja Mensual (Ingresos vs Egresos)</h4>
        <div style="height: 320px;">
          <canvas ref="flujoCajaChartRef"></canvas>
        </div>
      </el-card>
    </div>
  </div>
</template>
