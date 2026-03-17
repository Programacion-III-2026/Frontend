<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SelectorMaterialesTicket from './SelectorMaterialesTicket.vue'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const tickets = ref([])
const usuarios = ref([])
const tecnicos = ref([])
const subcategorias = ref([])
const estados = ref([])
const usuariosFiltrados = ref([])
const tecnicosFiltrados = ref([])
const alertasSLA = ref([])
const mostrarAlertasSLA = ref(false)
const filtroConCosto = ref(false)
const materialesSeleccionados = ref([])
const dialogMaterialesVisible = ref(false)
const guardandoMateriales = ref(false)
const ticketMaterialesActivo = ref(null)
const materialesTicketDialogo = ref([])
const cacheMaterialesPorTicket = ref({})
const dialogCierreVisible = ref(false)
const guardandoCierre = ref(false)
const ticketCierreActivo = ref(null)

const cierreForm = reactive({
  horas_ticket: 0,
  costo_hora_empleado: 0
})

const ticketForm = reactive({
  titulo: '',
  descripcion: '',
  usuario_nombre: '',
  id_usuario: '',
  tecnico_nombre: '',
  id_tecnico: '',
  id_subcategoria: '',
  id_estado: ''
})

// Obtener el tipo de badge por estado
const getEstadoBadge = (estado) => {
  if (!estado) return { type: 'info', text: 'Desconocido' }
  
  const estadoNorm = estado.toLowerCase().trim()
  
  if (estadoNorm === 'pendiente') {
    return { type: 'warning', text: 'Pendiente' }
  } else if (estadoNorm === 'procesando') {
    return { type: 'info', text: 'Procesando' }
  } else if (estadoNorm === 'finalizado') {
    return { type: 'success', text: 'Finalizado' }
  }
  
  return { type: 'info', text: estado }
}

// Palabras clave para automatizar subcategorías
const palabrasClave = {
  'red': { palabras: ['red', 'conexión', 'internet', 'wifi', 'ethernet', 'conexiones', 'conexion'], gravedad: 'alta' },
  'impresora': { palabras: ['impresora', 'imprimir', 'impresión', 'impresion'], gravedad: 'media' },
  'software': { palabras: ['software', 'aplicación', 'aplicacion', 'programa', 'licencia', 'instalación', 'instalacion'], gravedad: 'media' },
  'hardware': { palabras: ['hardware', 'disco duro', 'memoria', 'pantalla', 'monitor', 'teclado', 'ratón', 'raton'], gravedad: 'alta' },
  'base datos': { palabras: ['base de datos', 'base datos', 'database', 'sql', 'datos', 'sincroni', 'respaldo'], gravedad: 'crítica' },
  'seguridad': { palabras: ['seguridad', 'contraseña', 'contrasena', 'acceso', 'permisos', 'virus', 'malware'], gravedad: 'crítica' }
}

// Detectar subcategoría automáticamente según la descripción
const detectarSubcategoria = (descripcion, titulo) => {
  if (!descripcion && !titulo) return ''
  
  const textoCompleto = `${titulo} ${descripcion}`.toLowerCase()
  let subcategoriaEncontrada = ''
  let prioridad = 'normal'
  
  for (const [subcat, config] of Object.entries(palabrasClave)) {
    for (const palabra of config.palabras) {
      if (textoCompleto.includes(palabra)) {
        subcategoriaEncontrada = subcat
        prioridad = config.gravedad
        break
      }
    }
    if (subcategoriaEncontrada) break
  }
  
  // Encontrar el ID de la subcategoría
  if (subcategoriaEncontrada) {
    const sub = subcategorias.value.find(s => s.nombre.toLowerCase().includes(subcategoriaEncontrada))
    if (sub) {
      return sub.id_subcategoria
    }
  }
  
  return ''
}

// Filtrar usuarios según lo que escribe el usuario
const handleUsuarioInput = (query) => {
  ticketForm.id_usuario = ''
  if (!query) {
    usuariosFiltrados.value = []
    return
  }
  usuariosFiltrados.value = usuarios.value.filter(u =>
    String(u.nombre || '').toLowerCase().includes(query.toLowerCase())
  )
}

// Seleccionar usuario
const selectUsuario = (usuario) => {
  ticketForm.usuario_nombre = usuario.nombre
  ticketForm.id_usuario = usuario.id_usuario
  usuariosFiltrados.value = []
}

// Filtrar técnicos según lo que escribe el usuario
const handleTecnicoInput = (query) => {
  if (!query) {
    tecnicosFiltrados.value = []
    return
  }
  tecnicosFiltrados.value = tecnicos.value.filter(t =>
    t.nombre.toLowerCase().includes(query.toLowerCase())
  )
}

// Seleccionar técnico
const selectTecnico = (tecnico) => {
  ticketForm.tecnico_nombre = tecnico.nombre
  ticketForm.id_tecnico = tecnico.id_usuario
  tecnicosFiltrados.value = []
}

// Autocompletar subcategoría al cambiar descripción
const actualizarSubcategoria = () => {
  const idSubcat = detectarSubcategoria(ticketForm.descripcion, ticketForm.titulo)
  if (idSubcat) {
    ticketForm.id_subcategoria = idSubcat
  }
}

// FUNCIONES DE SLA Y TIEMPOS

// Obtener color según estado del SLA
const obtenerColorSLA = (minutos, slaMinutos) => {
  if (!minutos) return 'gray'
  
  const porcentajeRestante = (minutos / slaMinutos) * 100
  
  if (porcentajeRestante > 50) {
    return '#10b981' // Verde: Aún hay tiempo
  } else if (porcentajeRestante > 20) {
    return '#f59e0b' // Naranja: Advertencia
  } else if (porcentajeRestante > 0) {
    return '#ef4444' // Rojo: Crítico
  } else {
    return '#7f1d1d' // Rojo oscuro: VENCIDO
  }
}

// Obtener tipo de prioridad (color)
const obtenerColorPrioridad = (prioridad) => {
  switch (prioridad) {
    case 'Crítica':
    case 'Alta':
      return 'danger'
    case 'Media':
      return 'warning'
    case 'Baja':
      return 'info'
    default:
      return 'info'
  }
}

// Formatear tiempo restante (minutos a formato legible)
const formatearTiempoRestante = (minutos) => {
  if (!minutos && minutos !== 0) return 'N/A'
  if (minutos === 0) return '⚠️ VENCIDO'
  
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  
  if (horas > 0) {
    return `${horas}h ${mins}m`
  }
  return `${mins}m`
}

const getTipoClienteTag = (tipo) => {
  return (tipo || 'estandar') === 'vip' ? 'danger' : 'info'
}

const getTipoClienteLabel = (tipo) => {
  return (tipo || 'estandar') === 'vip' ? 'VIP' : 'Estándar'
}

const getCriterioSLALabel = (criterio) => {
  return criterio === 'tipo_cliente' ? 'Por Cliente' : 'Por Prioridad'
}

const ticketsFiltrados = computed(() => {
  if (!filtroConCosto.value) {
    return tickets.value
  }

  return tickets.value.filter((ticket) => Number(ticket.costo_total_ticket || 0) > 0)
})

const ticketsConCostoCount = computed(() =>
  tickets.value.filter((ticket) => Number(ticket.costo_total_ticket || 0) > 0).length
)

const ticketsConCostoTagType = computed(() =>
  ticketsConCostoCount.value > 0 ? 'success' : 'info'
)

const formatCurrency = (value) => {
  const number = Number(value || 0)
  return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(number)
}

const fetchAll = async () => {
  loading.value = true
  try {
    const [ticketsRes, usuariosRes, tecnicosRes, subcategoriasRes, estadosRes] = await Promise.all([
      fetch(`${API_URL}/api/soporte/tickets`),
      fetch(`${API_URL}/api/soporte/usuarios`),
      fetch(`${API_URL}/api/soporte/usuarios`),
      fetch(`${API_URL}/api/soporte/subcategorias`),
      fetch(`${API_URL}/api/soporte/estados`)
    ])

    if (!ticketsRes.ok) {
      throw new Error('No se pudieron cargar los tickets')
    }

    tickets.value = await ticketsRes.json()
    
  if (usuariosRes.ok) usuarios.value = await usuariosRes.json()
    if (tecnicosRes.ok) tecnicos.value = await tecnicosRes.json()
    if (subcategoriasRes.ok) subcategorias.value = await subcategoriasRes.json()
    if (estadosRes.ok) estados.value = await estadosRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const normalizarMaterialesPayload = (materiales = []) => {
  return materiales
    .map((material) => ({
      id_item: Number(material.id_item),
      cantidad: Number(material.cantidad || 0),
      id_centro_costo: material.id_centro_costo ? Number(material.id_centro_costo) : null
    }))
    .filter((material) => Number.isFinite(material.id_item) && Number.isFinite(material.cantidad) && material.cantidad > 0)
}

const guardarMaterialesTicket = async (ticketId, materiales, { mostrarToast = true } = {}) => {
  const payload = normalizarMaterialesPayload(materiales)

  const response = await fetch(`${API_URL}/api/soporte/tickets/${ticketId}/materiales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ materiales: payload })
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data?.error || 'No se pudieron guardar los materiales del ticket')
  }

  cacheMaterialesPorTicket.value = {
    ...cacheMaterialesPorTicket.value,
    [ticketId]: payload
  }

  if (mostrarToast) {
    ElMessage.success('Materiales del ticket guardados')
  }
}

const cargarMaterialesTicket = async (ticketId) => {
  const response = await fetch(`${API_URL}/api/soporte/tickets/${ticketId}/materiales`)
  if (!response.ok) {
    throw new Error('No se pudieron cargar los materiales del ticket')
  }

  const data = await response.json()
  const materiales = Array.isArray(data?.materiales) ? data.materiales : []

  materialesTicketDialogo.value = materiales.map((material) => ({
    id_item: Number(material.id_item),
    item_id: material.item_id,
    descripcion: material.descripcion,
    stock_actual: Number(material.stock_actual || 0),
    precio: Number(material.precio_unitario_snapshot || 0),
    cantidad: Number(material.cantidad || 0),
    id_centro_costo: material.id_centro_costo || null
  }))
}

const abrirDialogoMateriales = async (ticket) => {
  ticketMaterialesActivo.value = ticket
  dialogMaterialesVisible.value = true

  try {
    await cargarMaterialesTicket(ticket.id_ticket)
  } catch (error) {
    materialesTicketDialogo.value = []
    ElMessage.error(error.message)
  }
}

const guardarDialogoMateriales = async () => {
  const idTicket = Number(ticketMaterialesActivo.value?.id_ticket)
  if (!Number.isFinite(idTicket)) {
    ElMessage.error('Ticket inválido para guardar materiales')
    return
  }

  guardandoMateriales.value = true
  try {
    await guardarMaterialesTicket(idTicket, materialesTicketDialogo.value)
    dialogMaterialesVisible.value = false
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardandoMateriales.value = false
  }
}

const abrirDialogoCierre = (ticket, estadoDestino = 'Finalizado') => {
  ticketCierreActivo.value = {
    ...ticket,
    estadoDestino
  }

  cierreForm.horas_ticket = Number(ticket?.horas_ticket || 0)
  cierreForm.costo_hora_empleado = Number(ticket?.costo_hora_empleado || 0)
  dialogCierreVisible.value = true
}

const confirmarCierreTicket = async () => {
  const ticket = ticketCierreActivo.value
  if (!ticket?.id_ticket) {
    ElMessage.error('No se pudo identificar el ticket a cerrar')
    return
  }

  if (Number(cierreForm.horas_ticket) < 0) {
    ElMessage.warning('Las horas del ticket no pueden ser negativas')
    return
  }

  if (Number(cierreForm.costo_hora_empleado) < 0) {
    ElMessage.warning('El costo por hora no puede ser negativo')
    return
  }

  guardandoCierre.value = true
  try {
    await cambiarEstado(ticket.id_ticket, ticket.estadoDestino || 'Finalizado', {
      horas_ticket: Number(cierreForm.horas_ticket || 0),
      costo_hora_empleado: Number(cierreForm.costo_hora_empleado || 0)
    })
    dialogCierreVisible.value = false
  } finally {
    guardandoCierre.value = false
  }
}

const crearTicket = async () => {
  try {
    const usuarioPorNombre = usuarios.value.find(
      u => String(u.nombre || '').trim().toLowerCase() === String(ticketForm.usuario_nombre || '').trim().toLowerCase()
    )

    const idUsuarioSeleccionado = Number(ticketForm.id_usuario) || Number(usuarioPorNombre?.id_usuario || 0)
    const idTecnicoSeleccionado = Number(ticketForm.id_tecnico)
    const idSubcategoriaSeleccionada = Number(ticketForm.id_subcategoria)
    const idEstadoSeleccionado = Number(ticketForm.id_estado)

    if (!ticketForm.titulo?.trim() || !ticketForm.descripcion?.trim()) {
      ElMessage.warning('Completa el título y la descripción del ticket')
      return
    }

    if (!idUsuarioSeleccionado) {
      ElMessage.warning('Selecciona un usuario válido para el ticket')
      return
    }

    if (!idTecnicoSeleccionado || !idSubcategoriaSeleccionada || !idEstadoSeleccionado) {
      ElMessage.warning('Selecciona técnico, subcategoría y estado para crear el ticket')
      return
    }

    const payload = {
      titulo: ticketForm.titulo,
      descripcion: ticketForm.descripcion,
      id_usuario_cliente: idUsuarioSeleccionado,
      id_tecnico: idTecnicoSeleccionado,
      id_subcategoria: idSubcategoriaSeleccionada,
      id_estado: idEstadoSeleccionado
    }

    const response = await fetch(`${API_URL}/api/soporte/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      let errorMsg = 'No se pudo crear el ticket'
      try {
        const data = await response.json()
        if (data?.error) errorMsg = data.error
      } catch {
        // no-op
      }
      throw new Error(errorMsg)
    }

    const data = await response.json().catch(() => ({}))
    const nuevoTicketId = Number(data?.id || data?.id_ticket || 0)

    if (nuevoTicketId && materialesSeleccionados.value.length > 0) {
      await guardarMaterialesTicket(nuevoTicketId, materialesSeleccionados.value, { mostrarToast: false })
    }

    ElMessage.success('Ticket creado')
    ticketForm.titulo = ''
    ticketForm.descripcion = ''
    ticketForm.usuario_nombre = ''
    ticketForm.id_usuario = ''
    ticketForm.tecnico_nombre = ''
    ticketForm.id_tecnico = ''
    ticketForm.id_subcategoria = ''
    ticketForm.id_estado = ''
    materialesSeleccionados.value = []
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// Cambiar estado del ticket CON HISTORIAL AUTOMÁTICO
const cambiarEstado = async (ticketId, nuevoEstadoNombre, cierreData = null) => {
  try {
    // Encontrar el ticket actual en la lista
    const ticket = tickets.value.find(t => t.id_ticket === ticketId)
    if (!ticket) {
      ElMessage.error('Ticket no encontrado')
      return
    }

    // Encontrar el ID del nuevo estado
    const estadoObj = estados.value.find(e => e.nombre === nuevoEstadoNombre)
    if (!estadoObj) {
      ElMessage.error('Estado no encontrado')
      return
    }

    if (nuevoEstadoNombre === 'Finalizado' || nuevoEstadoNombre === 'Cerrado') {
      const materialesCache = cacheMaterialesPorTicket.value[ticketId]
      if (Array.isArray(materialesCache)) {
        await guardarMaterialesTicket(ticketId, materialesCache, { mostrarToast: false })
      }
    }

    // Actualizar con todos los campos del ticket (nuevo endpoint con historial)
    const response = await fetch(`${API_URL}/api/soporte/tickets/${ticketId}/actualizar-con-historial`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: ticket.titulo,
        descripcion: ticket.descripcion,
        id_cliente: ticket.id_cliente,
        id_tecnico: ticket.id_tecnico,
        id_subcategoria: ticket.id_subcategoria,
        id_estado: estadoObj.id_estado,
        usuario_modificador: 'Técnico',
        ...(cierreData
          ? {
              horas_ticket: Number(cierreData.horas_ticket || 0),
              costo_hora_empleado: Number(cierreData.costo_hora_empleado || 0)
            }
          : {})
      })
    })

    if (response.ok) {
      ElMessage.success(`✓ Ticket actualizado a "${nuevoEstadoNombre}"`)
      // Si cambia a Procesando, mostrar notificación
      if (nuevoEstadoNombre === 'Procesando') {
        ElMessage.success('✓ Técnico comenzó revisión - Respuesta registrada')
      }
      await fetchAll()
    } else {
      throw new Error('Error en la respuesta del servidor')
    }
  } catch (error) {
    ElMessage.error('Error al cambiar estado: ' + error.message)
  }
}

// FUNCIÓN: Obtener alertas de SLA por vencer
const cargarAlertasSLA = async () => {
  try {
    const response = await fetch(`${API_URL}/api/soporte/tickets-alertas-sla`)
    if (response.ok) {
      const data = await response.json()
      alertasSLA.value = data.tickets
      if (alertasSLA.value.length > 0) {
        mostrarAlertasSLA.value = true
        ElMessage.warning(`⚠️ ${data.total} tickets con SLA por vencer en 10 minutos`)
      }
    }
  } catch (error) {
    console.error('Error cargando alertas SLA:', error)
  }
}

// FUNCIÓN: Marcar notificación como enviada
const marcarNotificacionEnviada = async (ticketId) => {
  try {
    const response = await fetch(`${API_URL}/api/soporte/tickets/${ticketId}/notificacion-enviada`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
      alertasSLA.value = alertasSLA.value.filter(t => t.id_ticket !== ticketId)
      if (alertasSLA.value.length === 0) {
        mostrarAlertasSLA.value = false
      }
    }
  } catch (error) {
    ElMessage.error('Error marcando notificación')
  }
}

// Actualizar tiempos cada minuto
let timerInterval = null

onMounted(() => {
  fetchAll()
  cargarAlertasSLA()
  
  // Actualizar tiempos restantes cada minuto
  timerInterval = setInterval(() => {
    tickets.value = tickets.value.map(t => ({ ...t }))
    cargarAlertasSLA() // Verificar alertas cada minuto
  }, 60000);
})

// Limpiar intervalo cuando se desmonta el componente
onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-8">
      <el-dialog v-model="dialogCierreVisible" title="Cierre de Ticket (FI-CO)" width="520px">
        <el-form label-width="170px">
          <el-form-item label="Horas del ticket">
            <el-input-number v-model="cierreForm.horas_ticket" :min="0" :step="0.5" controls-position="right" class="w-full" />
          </el-form-item>
          <el-form-item label="Costo/hora empleado">
            <el-input-number v-model="cierreForm.costo_hora_empleado" :min="0" :step="0.01" controls-position="right" class="w-full" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogCierreVisible = false">Cancelar</el-button>
            <el-button type="success" :loading="guardandoCierre" @click="confirmarCierreTicket">Confirmar cierre</el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog v-model="dialogMaterialesVisible" title="Materiales del Ticket" width="70%">
        <SelectorMaterialesTicket v-model="materialesTicketDialogo" :api-url="API_URL" />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogMaterialesVisible = false">Cancelar</el-button>
            <el-button type="primary" :loading="guardandoMateriales" @click="guardarDialogoMateriales">Guardar materiales</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- ALERTAS DE SLA POR VENCER -->
      <el-dialog 
        v-model="mostrarAlertasSLA" 
        title="⚠️ ALERTAS DE SLA POR VENCER" 
        width="70%"
      >
        <p class="text-sm text-gray-600 mb-4">Los siguientes tickets tienen SLA que vence en los próximos 10 minutos:</p>
        <el-table :data="alertasSLA" stripe border max-height="400">
          <el-table-column prop="id_ticket" label="ID" width="60" />
          <el-table-column prop="titulo" label="Título" min-width="180" />
          <el-table-column prop="cliente_nombre" label="Usuario" width="140" />
          <el-table-column prop="sla_nombre" label="SLA" width="150" />
          <el-table-column label="Acción" width="150" align="center">
            <template #default="{ row }">
              <el-button 
                size="small" 
                type="warning"
                @click="marcarNotificacionEnviada(row.id_ticket)"
              >
                ✓ Aceptado
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="mostrarAlertasSLA = false">Cerrar</el-button>
          </div>
        </template>
      </el-dialog>

      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Tickets</h2>
          <p class="text-gray-600">Gestión de tickets de soporte</p>
        </div>
        <div class="flex gap-2">
          <el-switch
            v-model="filtroConCosto"
            active-text="Con costo > 0"
            inactive-text="Todos"
          />
          <el-tag :type="ticketsConCostoTagType" effect="light">
            {{ ticketsConCostoCount }}/{{ tickets.length }}
          </el-tag>
          <el-button 
            type="warning" 
            @click="cargarAlertasSLA"
            v-if="alertasSLA.length > 0"
          >
            🔔 {{ alertasSLA.length }} ALERTAS SLA
          </el-button>
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
        </div>
      </div>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="font-semibold">Crear Nuevo Ticket</div>
        </template>
        <el-form label-width="120px" class="mb-4">
          <el-form-item label="Título">
            <el-input v-model="ticketForm.titulo" placeholder="Sistema no responde" />
          </el-form-item>
          <el-form-item label="Descripción">
            <el-input 
              v-model="ticketForm.descripcion" 
              placeholder="El sistema está lento"
              @input="actualizarSubcategoria"
              type="textarea"
              rows="3"
            />
          </el-form-item>
          <el-form-item label="Usuario">
            <div class="relative">
              <el-input 
                v-model="ticketForm.usuario_nombre"
                placeholder="Escribe el nombre del usuario"
                @input="handleUsuarioInput"
                clearable
              />
              <div v-if="usuariosFiltrados.length > 0" class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 z-10 shadow">
                <div
                  v-for="usuario in usuariosFiltrados"
                  :key="usuario.id_usuario"
                  @click="selectUsuario(usuario)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                >
                  {{ usuario.nombre }}
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="Técnico">
            <div class="relative">
              <el-input 
                v-model="ticketForm.tecnico_nombre"
                placeholder="Escribe el nombre del técnico"
                @input="handleTecnicoInput"
                clearable
              />
              <div v-if="tecnicosFiltrados.length > 0" class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 z-10 shadow">
                <div
                  v-for="tecnico in tecnicosFiltrados"
                  :key="tecnico.id_usuario"
                  @click="selectTecnico(tecnico)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                >
                  {{ tecnico.nombre }}
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="Subcategoría">
            <el-select v-model="ticketForm.id_subcategoria" placeholder="Se asignará automáticamente según el problema">
              <el-option
                v-for="sub in subcategorias"
                :key="sub.id_subcategoria"
                :label="sub.nombre"
                :value="sub.id_subcategoria"
              />
            </el-select>
            <p class="text-xs text-gray-500 mt-1">💡 La subcategoría se asigna automáticamente según palabras clave en la descripción</p>
          </el-form-item>
          <el-form-item label="Estado">
            <el-select v-model="ticketForm.id_estado" placeholder="Selecciona un estado">
              <el-option
                v-for="estado in estados"
                :key="estado.id_estado"
                :label="estado.nombre"
                :value="estado.id_estado"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Materiales">
            <SelectorMaterialesTicket v-model="materialesSeleccionados" :api-url="API_URL" />
          </el-form-item>

          <el-button type="success" @click="crearTicket">Crear ticket</el-button>
        </el-form>
      </el-card>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="font-semibold">Listado de Tickets</div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="ticketsFiltrados" stripe border class="w-full" v-loading="loading" max-height="600">
            <el-table-column prop="id_ticket" label="ID" width="60" />
            <el-table-column prop="titulo" label="Título" min-width="180" />
            <el-table-column prop="cliente_nombre" label="Usuario" width="140" />
            <el-table-column label="Tipo Cliente" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="getTipoClienteTag(row.cliente_tipo)" effect="light" round>
                  {{ getTipoClienteLabel(row.cliente_tipo) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <!-- Columna de Prioridad -->
            <el-table-column label="Prioridad" width="120" align="center">
              <template #default="{ row }">
                <el-tag 
                  :type="obtenerColorPrioridad(row.prioridad)"
                  effect="light"
                  round
                >
                  🎯 {{ row.prioridad || 'N/A' }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- Columna de SLA - Resolución -->
            <el-table-column label="SLA Resolución" min-width="220" align="center">
              <template #default="{ row }">
                <div v-if="row.sla_tiempo_resolucion" class="flex flex-col gap-1">
                  <div class="text-xs font-semibold">{{ row.sla_nombre }}</div>
                  <div class="text-xs text-blue-600 font-medium">{{ getCriterioSLALabel(row.criterio_sla) }}</div>
                  <div class="flex items-center gap-2">
                    <div 
                      class="flex-1 h-5 rounded relative overflow-hidden border border-gray-300"
                      :style="{ 
                        backgroundColor: '#e5e7eb'
                      }"
                    >
                      <div 
                        v-if="row.minutos_restantes_resolucion !== null"
                        class="h-full transition-all duration-300"
                        :style="{ 
                          width: `${Math.max(0, Math.min(100, (row.minutos_restantes_resolucion / row.sla_tiempo_resolucion) * 100))}%`,
                          backgroundColor: obtenerColorSLA(row.minutos_restantes_resolucion, row.sla_tiempo_resolucion)
                        }"
                      ></div>
                    </div>
                    <span class="text-xs font-bold min-w-fit">
                      {{ formatearTiempoRestante(row.minutos_restantes_resolucion) }}
                    </span>
                  </div>
                </div>
                <span v-else class="text-gray-400">Sin SLA</span>
              </template>
            </el-table-column>

            <el-table-column label="Costo Total" width="150" align="right">
              <template #default="{ row }">
                <span>{{ formatCurrency(row.costo_total_ticket) }}</span>
              </template>
            </el-table-column>

            <!-- Columna de Estado -->
            <el-table-column label="Estado" width="180" align="center">
              <template #default="{ row }">
                <div class="flex gap-2 justify-center items-center flex-wrap">
                  <el-tag 
                    :type="getEstadoBadge(row.estado_nombre).type"
                    effect="light"
                    round
                  >
                    {{ getEstadoBadge(row.estado_nombre).text }}
                  </el-tag>
                  <div class="flex gap-1 text-xs">
                    <el-button 
                      v-if="row.estado_nombre !== 'Procesando'"
                      size="small" 
                      type="info" 
                      link
                      @click="cambiarEstado(row.id_ticket, 'Procesando')"
                    >
                      ▶ Revisar
                    </el-button>
                    <el-button 
                      v-if="row.estado_nombre !== 'Finalizado'"
                      size="small" 
                      type="success" 
                      link
                      @click="abrirDialogoCierre(row, 'Finalizado')"
                    >
                      ✓ Finalizar
                    </el-button>
                    <el-button
                      size="small"
                      type="primary"
                      link
                      @click="abrirDialogoMateriales(row)"
                    >
                      🧰 Materiales
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
<style scoped>
/* Estilos para mejor presentación de tickets */
.el-table {
  font-size: 14px;
}

.el-table__header th {
  background-color: #f5f7fa;
  font-weight: 600;
}

/* Etiquetas de estado */
:deep(.el-tag--success.is-light) {
  background-color: #ecf5e6;
  border-color: #34a853;
  color: #0d652d;
}

:deep(.el-tag--warning.is-light) {
  background-color: #fef7e0;
  border-color: #f9ab00;
  color: #7f4f00;
}

:deep(.el-tag--info.is-light) {
  background-color: #e3f2fd;
  border-color: #1976d2;
  color: #0d47a1;
}
</style>