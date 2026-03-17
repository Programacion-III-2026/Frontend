<template>
  <div class="space-y-10">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="text-3xl font-bold text-blue-600">{{ stats.usuariosActivos }}</div>
          <i class="el-icon-user text-4xl text-blue-600"></i>
        </div>
        <p class="text-gray-600 font-semibold">Usuarios Activos</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="text-3xl font-bold text-green-600">{{ stats.ticketsAbiertos }}</div>
          <i class="el-icon-tickets text-4xl text-green-600"></i>
        </div>
        <p class="text-gray-600 font-semibold">Tickets Abiertos</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="text-3xl font-bold text-purple-600">{{ stats.empleados }}</div>
          <i class="el-icon-user-solid text-4xl text-purple-600"></i>
        </div>
        <p class="text-gray-600 font-semibold">Empleados</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="text-3xl font-bold text-orange-600">{{ stats.clientes }}</div>
          <i class="el-icon-office-building text-4xl text-orange-600"></i>
        </div>
        <p class="text-gray-600 font-semibold">Clientes</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border-2 border-red-500">
        <div class="flex items-center justify-between mb-4">
          <div class="text-3xl font-bold text-red-600">{{ stats.ticketsVencidos }}</div>
          <i class="el-icon-warning text-4xl text-red-600"></i>
        </div>
        <p class="text-gray-600 font-semibold">Tickets Vencidos</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4 ml-1">
        <i class="el-icon-warning text-red-600 mr-2"></i>Tendencia de Tickets Vencidos
      </h3>
      <div class="h-64 relative">
        <canvas ref="ticketsVencidosChart" class="w-full h-full"></canvas>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4 ml-1">
          <i class="el-icon-date mr-2"></i>Calendario de Eventos
        </h3>
        <div class="space-y-3 mb-4">
          <div
            v-for="evento in eventosCalendario"
            :key="evento.id"
            class="flex items-center gap-3 p-3 rounded-lg border-l-4"
            :class="evento.bgClass"
          >
            <i class="el-icon-calendar text-2xl" :class="evento.iconClass"></i>
            <div class="flex-1">
              <p class="font-semibold text-gray-800">{{ evento.titulo }}</p>
              <p class="text-sm text-gray-600">{{ evento.detalle }}</p>
            </div>
          </div>
          <div v-if="eventosCalendario.length === 0" class="text-gray-500 text-sm">Sin eventos recientes.</div>
        </div>
        <div class="h-48 relative">
          <canvas ref="eventosChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4 ml-1">
          <i class="el-icon-warning-outline mr-2 text-red-600"></i>Distribución de Alertas
        </h3>
        <div class="h-64 relative">
          <canvas ref="alertasChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4 ml-1">
        <i class="el-icon-warning-outline mr-2 text-red-600"></i>Alertas de Sistema Recientes
      </h3>
      <div class="space-y-3">
        <div
          v-for="alerta in alertasRecientes"
          :key="alerta.id"
          class="flex items-center gap-4 p-3 rounded-lg border-l-4"
          :class="alerta.containerClass"
        >
          <i class="text-2xl" :class="alerta.iconClass"></i>
          <div class="flex-1">
            <p class="font-semibold" :class="alerta.titleClass">{{ alerta.titulo }}</p>
            <p class="text-sm text-gray-600">{{ alerta.detalle }}</p>
          </div>
          <span class="text-sm font-medium" :class="alerta.timeClass">{{ alerta.tiempo }}</span>
        </div>
        <div v-if="alertasRecientes.length === 0" class="text-gray-500 text-sm">Sin alertas recientes.</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4 ml-1">Actividad Reciente</h3>
      <div class="space-y-4">
        <div v-for="actividad in actividadesRecientes" :key="actividad.id" class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <i class="text-2xl" :class="actividad.iconClass"></i>
          <div class="flex-1">
            <p class="font-semibold">{{ actividad.titulo }}</p>
            <p class="text-sm text-gray-500">{{ actividad.detalle }}</p>
          </div>
          <span class="text-sm text-gray-400">{{ actividad.tiempo }}</span>
        </div>
        <div v-if="actividadesRecientes.length === 0" class="text-gray-500 text-sm">Sin actividad reciente.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

const API_URL = window.API_URL || 'http://localhost:5000'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const ticketsVencidosChart = ref(null)
const eventosChart = ref(null)
const alertasChart = ref(null)

const stats = reactive({
  usuariosActivos: 0,
  ticketsAbiertos: 0,
  empleados: 0,
  clientes: 0,
  ticketsVencidos: 0
})

const eventosCalendario = ref([])
const alertasRecientes = ref([])
const actividadesRecientes = ref([])

const datosTendencia = reactive({ labels: [], values: [] })
const resumenEventos = reactive({ nomina: 0, ausencias: 0, cierreContable: 0, ticketsVencidos: 0 })
const distribucionAlertas = reactive({ criticos: 0, accesos: 0, advertencias: 0, info: 0 })

let ticketsChartInstance = null
let eventosChartInstance = null
let alertasChartInstance = null
let autoRefreshId = null

const formatearFecha = (value) => {
  if (!value) return 'Sin fecha'
  return new Date(value).toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const haceCuanto = (value) => {
  if (!value) return 'Reciente'
  const fecha = new Date(value)
  const diffMin = Math.max(1, Math.floor((Date.now() - fecha.getTime()) / 60000))
  if (diffMin < 60) return `Hace ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `Hace ${diffH} h`
  const diffD = Math.floor(diffH / 24)
  return `Hace ${diffD} d`
}

const keyDia = (date) => {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const calcularTendenciaVencidos = (tickets) => {
  const dias = []
  const hoy = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() - i)
    dias.push(d)
  }

  const labels = dias.map(d => d.toLocaleDateString('es-HN', { weekday: 'short' }))
  const counts = dias.map((d) => {
    const key = keyDia(d)
    return tickets.filter(t => {
      const fechaLimite = t.fecha_limite_resolucion ? keyDia(t.fecha_limite_resolucion) : null
      return fechaLimite === key && (t.vencido_resolucion || t.cumplimiento_sla === 'Incumplido')
    }).length
  })

  datosTendencia.labels = labels
  datosTendencia.values = counts
}

const construirEventos = ({ planillas, asientos, ausencias }) => {
  const eventos = []

  if (planillas.length > 0) {
    const ultimaPlanilla = [...planillas].sort((a, b) => Number(b.anio) - Number(a.anio) || Number(b.mes) - Number(a.mes))[0]
    const fechaNomina = `${ultimaPlanilla.anio}-${String(ultimaPlanilla.mes).padStart(2, '0')}-15`
    eventos.push({
      id: 'nomina',
      titulo: 'Corte de Nómina',
      detalle: formatearFecha(fechaNomina),
      bgClass: 'bg-blue-50 border-blue-500',
      iconClass: 'text-blue-600'
    })
    resumenEventos.nomina = planillas.length
  } else {
    resumenEventos.nomina = 0
  }

  if (asientos.length > 0) {
    const ultimoAsiento = [...asientos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]
    eventos.push({
      id: 'contable',
      titulo: 'Cierre Contable',
      detalle: formatearFecha(ultimoAsiento.fecha),
      bgClass: 'bg-purple-50 border-purple-500',
      iconClass: 'text-purple-600'
    })
    resumenEventos.cierreContable = asientos.length
  } else {
    resumenEventos.cierreContable = 0
  }

  const ausenciasAprobadas = ausencias
    .filter(a => (a.estado || '').toLowerCase() === 'aprobada')
    .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio))

  resumenEventos.ausencias = ausenciasAprobadas.length

  ausenciasAprobadas.slice(0, 2).forEach((a) => {
    eventos.push({
      id: `aus-${a.id_ausencia}`,
      titulo: `Ausencia: ${a.nombre} ${a.apellido}`,
      detalle: `${formatearFecha(a.fecha_inicio)} - ${formatearFecha(a.fecha_fin)}`,
      bgClass: 'bg-green-50 border-green-500',
      iconClass: 'text-green-600'
    })
  })

  eventosCalendario.value = eventos
}

const construirAlertas = ({ tickets, usuarios }) => {
  const criticos = tickets.filter(t => t.vencido_resolucion || t.cumplimiento_sla === 'Incumplido')
  const advertencias = tickets.filter(t => t.estado_sla_resolucion === 'Advertencia')
  const info = tickets.filter(t => t.estado_sla_resolucion === 'Normal')
  const accesos = usuarios.filter(u => (u.estado || '').toLowerCase() !== 'activo')

  distribucionAlertas.criticos = criticos.length
  distribucionAlertas.advertencias = advertencias.length
  distribucionAlertas.info = info.length
  distribucionAlertas.accesos = accesos.length

  const alertas = []

  criticos.slice(0, 2).forEach((t) => {
    alertas.push({
      id: `crit-${t.id_ticket}`,
      titulo: 'Ticket vencido',
      detalle: `#${t.id_ticket} - ${t.titulo || 'Sin título'}`,
      tiempo: haceCuanto(t.fecha_limite_resolucion),
      containerClass: 'bg-red-50 border-red-500',
      iconClass: 'el-icon-circle-close text-red-600',
      titleClass: 'text-red-800',
      timeClass: 'text-red-600'
    })
  })

  accesos.slice(0, 1).forEach((u) => {
    alertas.push({
      id: `acceso-${u.id_usuario}`,
      titulo: 'Cuenta pendiente de aprobación',
      detalle: `${u.nombre} (${u.email})`,
      tiempo: 'Pendiente',
      containerClass: 'bg-yellow-50 border-yellow-500',
      iconClass: 'el-icon-warning text-yellow-600',
      titleClass: 'text-yellow-800',
      timeClass: 'text-yellow-600'
    })
  })

  advertencias.slice(0, 1).forEach((t) => {
    alertas.push({
      id: `adv-${t.id_ticket}`,
      titulo: 'Ticket en advertencia SLA',
      detalle: `#${t.id_ticket} - ${t.titulo || 'Sin título'}`,
      tiempo: haceCuanto(t.fecha_limite_resolucion),
      containerClass: 'bg-orange-50 border-orange-500',
      iconClass: 'el-icon-info text-orange-600',
      titleClass: 'text-orange-800',
      timeClass: 'text-orange-600'
    })
  })

  alertasRecientes.value = alertas
}

const construirActividades = ({ tickets, empleados, asientos }) => {
  const actividades = []

  const ultimoTicket = [...tickets].sort((a, b) => new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0))[0]
  if (ultimoTicket) {
    actividades.push({
      id: `ticket-${ultimoTicket.id_ticket}`,
      iconClass: 'el-icon-tickets text-blue-600',
      titulo: 'Último ticket registrado',
      detalle: `#${ultimoTicket.id_ticket} - ${ultimoTicket.titulo || 'Sin título'}`,
      tiempo: haceCuanto(ultimoTicket.fecha_creacion)
    })
  }

  const ultimoEmpleado = [...empleados].sort((a, b) => new Date(b.fecha_ingreso || 0) - new Date(a.fecha_ingreso || 0))[0]
  if (ultimoEmpleado) {
    actividades.push({
      id: `emp-${ultimoEmpleado.id_empleado}`,
      iconClass: 'el-icon-user text-green-600',
      titulo: 'Último empleado incorporado',
      detalle: `${ultimoEmpleado.nombre} ${ultimoEmpleado.apellido} - ${ultimoEmpleado.puesto || 'Sin puesto'}`,
      tiempo: haceCuanto(ultimoEmpleado.fecha_ingreso)
    })
  }

  const ultimoAsiento = [...asientos].sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))[0]
  if (ultimoAsiento) {
    actividades.push({
      id: `asiento-${ultimoAsiento.id_asiento}`,
      iconClass: 'el-icon-document text-purple-600',
      titulo: 'Último asiento contable',
      detalle: `#${ultimoAsiento.id_asiento} - ${ultimoAsiento.descripcion || 'Sin descripción'}`,
      tiempo: haceCuanto(ultimoAsiento.fecha)
    })
  }

  actividadesRecientes.value = actividades
}

const renderTicketsChart = () => {
  if (!ticketsVencidosChart.value) return
  if (ticketsChartInstance) ticketsChartInstance.destroy()

  ticketsChartInstance = new Chart(ticketsVencidosChart.value, {
    type: 'line',
    data: {
      labels: datosTendencia.labels,
      datasets: [
        {
          label: 'Tickets Vencidos',
          data: datosTendencia.values,
          borderColor: '#DC2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'top' } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  })
}

const renderEventosChart = () => {
  if (!eventosChart.value) return
  if (eventosChartInstance) eventosChartInstance.destroy()

  eventosChartInstance = new Chart(eventosChart.value, {
    type: 'bar',
    data: {
      labels: ['Nómina', 'Ausencias', 'Cierre Contable', 'Tickets Vencidos'],
      datasets: [
        {
          label: 'Eventos / Indicadores',
          data: [resumenEventos.nomina, resumenEventos.ausencias, resumenEventos.cierreContable, stats.ticketsVencidos],
          backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#EF4444']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  })
}

const renderAlertasChart = () => {
  if (!alertasChart.value) return
  if (alertasChartInstance) alertasChartInstance.destroy()

  alertasChartInstance = new Chart(alertasChart.value, {
    type: 'doughnut',
    data: {
      labels: ['Errores Críticos', 'Accesos Pendientes', 'Advertencias', 'Información'],
      datasets: [
        {
          data: [distribucionAlertas.criticos, distribucionAlertas.accesos, distribucionAlertas.advertencias, distribucionAlertas.info],
          backgroundColor: ['#DC2626', '#EAB308', '#F97316', '#3B82F6'],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  })
}

const actualizarDashboard = async () => {
  try {
    const [usuariosRes, ticketsRes, empleadosRes, clientesRes, planillaRes, asientosRes, ausenciasRes] = await Promise.all([
      fetch(`${API_URL}/api/soporte/usuarios`),
      fetch(`${API_URL}/api/soporte/tickets`),
      fetch(`${API_URL}/api/rrhh/empleados`),
      fetch(`${API_URL}/api/soporte/clientes`),
      fetch(`${API_URL}/api/rrhh/planilla`),
      fetch(`${API_URL}/api/contabilidad/asientos`),
      fetch(`${API_URL}/api/rrhh/ausencias`)
    ])

    if (!usuariosRes.ok || !ticketsRes.ok || !empleadosRes.ok || !clientesRes.ok || !planillaRes.ok || !asientosRes.ok || !ausenciasRes.ok) {
      throw new Error('No se pudieron cargar datos del dashboard')
    }

    const [usuarios, tickets, empleados, clientes, planillas, asientos, ausencias] = await Promise.all([
      usuariosRes.json(),
      ticketsRes.json(),
      empleadosRes.json(),
      clientesRes.json(),
      planillaRes.json(),
      asientosRes.json(),
      ausenciasRes.json()
    ])

    stats.usuariosActivos = usuarios.filter(u => String(u.estado || '').toLowerCase() === 'activo').length
    stats.ticketsAbiertos = tickets.filter(t => String(t.estado_nombre || '').toLowerCase() !== 'finalizado').length
    stats.empleados = empleados.length
    stats.clientes = clientes.length
    stats.ticketsVencidos = tickets.filter(t => t.vencido_resolucion || t.cumplimiento_sla === 'Incumplido').length

    calcularTendenciaVencidos(tickets)
    resumenEventos.ticketsVencidos = stats.ticketsVencidos
    construirEventos({ planillas, asientos, ausencias })
    construirAlertas({ tickets, usuarios })
    construirActividades({ tickets, empleados, asientos })

    await nextTick()
    renderTicketsChart()
    renderEventosChart()
    renderAlertasChart()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

onMounted(async () => {
  await actualizarDashboard()
  autoRefreshId = setInterval(() => {
    actualizarDashboard()
  }, 30000)
})

onBeforeUnmount(() => {
  if (autoRefreshId) clearInterval(autoRefreshId)
  if (ticketsChartInstance) ticketsChartInstance.destroy()
  if (eventosChartInstance) eventosChartInstance.destroy()
  if (alertasChartInstance) alertasChartInstance.destroy()
})
</script>
