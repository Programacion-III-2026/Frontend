<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const guardando = ref(false)
const exportando = ref(false)
const modoEdicion = ref(false)
const otEditandoId = ref(null)
const ordenSeleccionadaId = ref(null)
const usuarios = ref([])
const ordenes = ref([])
const itemsInventario = ref([])
const materialesSeleccionados = ref([])

const especialidades = ['Electricidad', 'Plomería', 'Mecánica', 'Climatización', 'Obra Civil']
const estadosOT = ['Pendiente', 'En Proceso', 'Finalizada']
const prioridadesOT = ['Baja', 'Media', 'Alta']

const materialForm = reactive({
  id_item: '',
  cantidad: 1,
  precio_unitario: 0
})

const otForm = reactive({
  folio_ot: '',
  id_usuario: '',
  solicitante_manual: '',
  descripcion_problema: '',
  diagnostico_tecnico: '',
  prioridad: 'Media',
  celular_solicitante: '',
  ubicacion_problema: '',
  especialidad: 'Electricidad',
  taller_asignado: '',
  estado: 'Pendiente'
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(Number(value || 0))
}

const escapeHtml = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const cargarSiguienteFolio = async () => {
  try {
    const response = await fetch(`${API_URL}/api/soporte/ordenes-trabajo/siguiente-folio`)

    if (!response.ok) {
      throw new Error('No se pudo generar el folio OT')
    }

    const data = await response.json()
    otForm.folio_ot = data.folio_ot || ''
  } catch (error) {
    otForm.folio_ot = ''
    ElMessage.error(error.message)
  }
}

const cargarUsuarios = async () => {
  try {
    const response = await fetch(`${API_URL}/api/soporte/usuarios`)

    if (!response.ok) {
      throw new Error('No se pudo cargar la lista de usuarios')
    }

    usuarios.value = await response.json()
  } catch {
    usuarios.value = []
  }
}

const cargarItemsInventario = async () => {
  try {
    const response = await fetch(`${API_URL}/api/inventario/item-master`)
    if (!response.ok) {
      throw new Error('No se pudo cargar Item Master')
    }
    itemsInventario.value = await response.json()
  } catch {
    itemsInventario.value = []
  }
}

const cargarOrdenes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/soporte/ordenes-trabajo`)

    if (!response.ok) {
      throw new Error('No se pudieron cargar las órdenes de trabajo')
    }

    ordenes.value = await response.json()

    if (!ordenes.value.some(o => Number(o.id_ot) === Number(ordenSeleccionadaId.value))) {
      ordenSeleccionadaId.value = null
    }
  } catch {
    ordenes.value = []
    ordenSeleccionadaId.value = null
  }
}

const obtenerDetalleOrden = async (idOT, ordenBase = null) => {
  const response = await fetch(`${API_URL}/api/soporte/ordenes-trabajo/${idOT}/detalle`)

  if (response.ok) {
    return await response.json()
  }

  if (response.status === 404) {
    const listaResponse = await fetch(`${API_URL}/api/soporte/ordenes-trabajo`)
    if (listaResponse.ok) {
      const lista = await listaResponse.json()
      const encontrada = lista.find(o => Number(o.id_ot) === Number(idOT))
      if (encontrada) {
        return {
          ...encontrada,
          materiales: Array.isArray(ordenBase?.materiales) ? ordenBase.materiales : []
        }
      }
    }
  }

  const data = await response.json().catch(() => ({}))
  throw new Error(data?.error || 'No se pudo cargar el detalle de la OT')
}

const fetchAll = async () => {
  loading.value = true
  try {
    await Promise.all([cargarUsuarios(), cargarOrdenes(), cargarSiguienteFolio(), cargarItemsInventario()])
  } finally {
    loading.value = false
  }
}

const resetForm = async () => {
  modoEdicion.value = false
  otEditandoId.value = null
  materialesSeleccionados.value = []
  materialForm.id_item = ''
  materialForm.cantidad = 1
  materialForm.precio_unitario = 0

  otForm.id_usuario = ''
  otForm.solicitante_manual = ''
  otForm.descripcion_problema = ''
  otForm.diagnostico_tecnico = ''
  otForm.prioridad = 'Media'
  otForm.celular_solicitante = ''
  otForm.ubicacion_problema = ''
  otForm.especialidad = 'Electricidad'
  otForm.taller_asignado = ''
  otForm.estado = 'Pendiente'
  await cargarSiguienteFolio()
}

const onChangeMaterialItem = (idItem) => {
  const item = itemsInventario.value.find(i => i.id_item === idItem)
  if (!item) return
  materialForm.precio_unitario = Number(item.precio || 0)
}

const agregarMaterial = () => {
  const item = itemsInventario.value.find(i => i.id_item === materialForm.id_item)
  if (!item) {
    ElMessage.warning('Selecciona un item válido')
    return
  }

  if (!Number.isFinite(Number(materialForm.cantidad)) || Number(materialForm.cantidad) <= 0) {
    ElMessage.warning('La cantidad debe ser mayor a 0')
    return
  }

  if (!Number.isFinite(Number(materialForm.precio_unitario)) || Number(materialForm.precio_unitario) < 0) {
    ElMessage.warning('El precio unitario debe ser mayor o igual a 0')
    return
  }

  const idx = materialesSeleccionados.value.findIndex(m => m.id_item === item.id_item)
  if (idx >= 0) {
    materialesSeleccionados.value[idx].cantidad = Number(materialForm.cantidad)
    materialesSeleccionados.value[idx].precio_unitario = Number(materialForm.precio_unitario)
  } else {
    materialesSeleccionados.value.push({
      id_item: item.id_item,
      codigo_91g: item.item_id,
      descripcion: item.descripcion,
      cantidad: Number(materialForm.cantidad),
      precio_unitario: Number(materialForm.precio_unitario)
    })
  }

  materialForm.id_item = ''
  materialForm.cantidad = 1
  materialForm.precio_unitario = 0
}

const eliminarMaterial = (idItem) => {
  materialesSeleccionados.value = materialesSeleccionados.value.filter(m => m.id_item !== idItem)
}

const guardarOrdenTrabajo = async () => {
  const taller = String(otForm.taller_asignado || '').trim()
  const solicitanteManual = String(otForm.solicitante_manual || '').trim()
  const descripcionProblema = String(otForm.descripcion_problema || '').trim()
  const diagnosticoTecnico = String(otForm.diagnostico_tecnico || '').trim()
  const celularSolicitante = String(otForm.celular_solicitante || '').trim()
  const ubicacionProblema = String(otForm.ubicacion_problema || '').trim()

  if (!taller) {
    ElMessage.warning('El taller asignado es obligatorio')
    return
  }

  if (!otForm.id_usuario && !solicitanteManual) {
    ElMessage.warning('Selecciona un usuario o escribe un solicitante manual')
    return
  }

  if (!descripcionProblema) {
    ElMessage.warning('La descripción del problema es obligatoria')
    return
  }

  if (!celularSolicitante) {
    ElMessage.warning('El celular del solicitante es obligatorio')
    return
  }

  if (!ubicacionProblema) {
    ElMessage.warning('La ubicación del problema es obligatoria')
    return
  }

  guardando.value = true
  try {
    const payload = {
      id_usuario: otForm.id_usuario ? Number(otForm.id_usuario) : null,
      solicitante_nombre: solicitanteManual,
      descripcion_problema: descripcionProblema,
      diagnostico_tecnico: diagnosticoTecnico,
      prioridad: otForm.prioridad,
      celular_solicitante: celularSolicitante,
      ubicacion_problema: ubicacionProblema,
      especialidad: otForm.especialidad,
      taller_asignado: taller,
      estado: otForm.estado,
      materiales: materialesSeleccionados.value.map(m => ({
        id_item: Number(m.id_item),
        cantidad: Number(m.cantidad),
        precio_unitario: Number(m.precio_unitario)
      }))
    }

    const response = await fetch(
      modoEdicion.value
        ? `${API_URL}/api/soporte/ordenes-trabajo/${otEditandoId.value}`
        : `${API_URL}/api/soporte/ordenes-trabajo`,
      {
        method: modoEdicion.value ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error || 'No se pudo guardar la orden de trabajo')
    }

    ElMessage.success(modoEdicion.value ? 'OT actualizada correctamente' : `OT creada: ${data.folio_ot}`)
    await resetForm()
    await cargarOrdenes()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

const editarOrden = async (orden) => {
  try {
    const detalle = await obtenerDetalleOrden(orden.id_ot, orden)

    modoEdicion.value = true
    otEditandoId.value = detalle.id_ot
    otForm.folio_ot = detalle.folio_ot || ''
    otForm.id_usuario = detalle.id_usuario ?? ''
    otForm.solicitante_manual = detalle.id_usuario ? '' : (detalle.solicitante_nombre || '')
    otForm.descripcion_problema = detalle.descripcion_problema || ''
    otForm.diagnostico_tecnico = detalle.diagnostico_tecnico || ''
    otForm.prioridad = prioridadesOT.includes(detalle.prioridad) ? detalle.prioridad : 'Media'
    otForm.celular_solicitante = detalle.celular_solicitante || ''
    otForm.ubicacion_problema = detalle.ubicacion_problema || ''
    otForm.especialidad = detalle.especialidad || 'Electricidad'
    otForm.taller_asignado = detalle.taller_asignado || ''
    otForm.estado = estadosOT.includes(detalle.estado) ? detalle.estado : 'Pendiente'
    materialesSeleccionados.value = Array.isArray(detalle.materiales)
      ? detalle.materiales.map(m => ({
          id_item: m.id_item,
          codigo_91g: m.codigo_91g,
          descripcion: m.descripcion,
          cantidad: Number(m.cantidad || 0),
          precio_unitario: Number(m.precio_unitario || 0)
        }))
      : []
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const seleccionarOrden = (orden) => {
  ordenSeleccionadaId.value = Number(orden.id_ot)
}

const getRowClassName = ({ row }) => {
  return Number(row?.id_ot) === Number(ordenSeleccionadaId.value) ? 'ot-selected-row' : ''
}

const obtenerOrdenSeleccionada = () => {
  return ordenes.value.find(o => Number(o.id_ot) === Number(ordenSeleccionadaId.value)) || null
}

const actualizarEstadoOT = async (orden) => {
  try {
    const payload = {
      id_usuario: orden.id_usuario,
      solicitante_nombre: orden.solicitante_nombre,
      descripcion_problema: orden.descripcion_problema,
      diagnostico_tecnico: orden.diagnostico_tecnico || '',
      prioridad: prioridadesOT.includes(orden.prioridad) ? orden.prioridad : 'Media',
      celular_solicitante: orden.celular_solicitante,
      ubicacion_problema: orden.ubicacion_problema,
      especialidad: orden.especialidad,
      taller_asignado: orden.taller_asignado,
      estado: orden.estado
    }

    const response = await fetch(`${API_URL}/api/soporte/ordenes-trabajo/${orden.id_ot}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error || 'No se pudo actualizar el estado de la OT')
    }

    ElMessage.success('Estado de OT actualizado')
    await cargarOrdenes()
  } catch (error) {
    ElMessage.error(error.message)
    await cargarOrdenes()
  }
}

const abrirVistaImpresionOT = (detalle, autoPrint = true) => {
  const esCerrada = String(detalle?.estado || '').toLowerCase() === 'finalizada'
  const materiales = Array.isArray(detalle?.materiales) ? detalle.materiales : []
  const totalMateriales = materiales.reduce((sum, m) => sum + (Number(m.cantidad || 0) * Number(m.precio_unitario || 0)), 0)

  const tablaMateriales = materiales.length
    ? `
      <table class="tbl">
        <thead>
          <tr>
            <th>Código 91G</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          ${materiales.map(m => `
            <tr>
              <td>${escapeHtml(m.codigo_91g || '-')}</td>
              <td>${escapeHtml(m.descripcion || '-')}</td>
              <td>${escapeHtml(Number(m.cantidad || 0).toFixed(2))}</td>
              <td>${escapeHtml(formatCurrency(m.precio_unitario))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p class="total">Total Materiales: ${escapeHtml(formatCurrency(totalMateriales))}</p>
    `
    : '<p class="muted">Sin materiales consumidos registrados.</p>'

  const win = window.open('', '_blank')
  if (!win) {
    ElMessage.error('No se pudo abrir la vista de impresión del PDF')
    return
  }

  const barraVistaPrevia = autoPrint
    ? ''
    : `
      <div class="preview-bar">
        <div class="preview-folio">Vista previa OT - Folio: ${escapeHtml(detalle.folio_ot || '-')}</div>
        <button class="preview-btn" onclick="window.print()">Imprimir</button>
      </div>
    `

  win.document.write(`
    <html>
      <head>
        <title>OT ${escapeHtml(detalle.folio_ot || '')}</title>
        <style>
          @page { size: Letter; margin: 0.6in; }
          body { font-family: Arial, sans-serif; color: #1f2937; margin: 0; }
          .header { border-bottom: 2px solid #374151; padding-bottom: 10px; margin-bottom: 14px; display:flex; justify-content:space-between; align-items:flex-end; }
          .logo { font-size: 24px; font-weight: 800; letter-spacing: 1px; }
          .sistema { font-size: 12px; color: #4b5563; }
          .title { text-align:right; }
          .title h1 { margin: 0; font-size: 20px; letter-spacing: .5px; }
          .title p { margin: 4px 0 0; font-size: 12px; color: #4b5563; }
          .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-bottom: 14px; }
          .field { font-size: 12px; }
          .field b { display:inline-block; min-width: 130px; }
          .section { margin-top: 12px; }
          .section h3 { margin: 0 0 8px; font-size: 13px; color: #111827; text-transform: uppercase; }
          .box { border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; min-height: 70px; font-size: 12px; white-space: pre-wrap; }
          .tbl { width: 100%; border-collapse: collapse; font-size: 12px; }
          .tbl th, .tbl td { border: 1px solid #d1d5db; padding: 6px; text-align: left; }
          .tbl th { background: #f3f4f6; }
          .muted { color: #6b7280; font-size: 12px; }
          .total { margin-top: 8px; font-size: 12px; font-weight: 700; text-align: right; }
          .firmas { margin-top: 32px; display:grid; grid-template-columns: 1fr 1fr; gap: 30px; }
          .firma { text-align: center; font-size: 12px; }
          .linea { border-top: 1px solid #111827; margin-top: 34px; padding-top: 6px; }
          .preview-bar {
            position: sticky;
            top: 0;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            background: #e5e7eb;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 8px 12px;
            margin-bottom: 12px;
          }
          .preview-folio {
            font-size: 12px;
            font-weight: 700;
            color: #111827;
          }
          .preview-btn {
            background: #111827;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
          }
          @media print {
            .preview-bar { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${barraVistaPrevia}
        <div class="header">
          <div>
            <div class="logo">MAximo</div>
            <div class="sistema">Sistema de Soporte</div>
          </div>
          <div class="title">
            <h1>ORDEN DE TRABAJO</h1>
            <p>Folio: ${escapeHtml(detalle.folio_ot || '-')}</p>
          </div>
        </div>

        <div class="grid">
          <div class="field"><b>Cliente:</b> ${escapeHtml(detalle.solicitante_nombre || '-')}</div>
          <div class="field"><b>Teléfono:</b> ${escapeHtml(detalle.celular_solicitante || '-')}</div>
          <div class="field"><b>Dirección:</b> ${escapeHtml(detalle.ubicacion_problema || '-')}</div>
          <div class="field"><b>Especialidad:</b> ${escapeHtml(detalle.especialidad || '-')}</div>
          <div class="field"><b>Taller Asignado:</b> ${escapeHtml(detalle.taller_asignado || '-')}</div>
          <div class="field"><b>Fecha Creación:</b> ${escapeHtml(detalle.fecha_creacion ? new Date(detalle.fecha_creacion).toLocaleString() : '-')}</div>
          <div class="field"><b>Prioridad:</b> ${escapeHtml(detalle.prioridad || 'Media')}</div>
          <div class="field"><b>Estado:</b> ${escapeHtml(detalle.estado || '-')}</div>
        </div>

        <div class="section">
          <h3>Descripción de la Falla / Problema</h3>
          <div class="box">${escapeHtml(detalle.descripcion_problema || '-')}</div>
        </div>

        ${esCerrada ? `
        <div class="section">
          <h3>Diagnóstico Técnico</h3>
          <div class="box">${escapeHtml(detalle.diagnostico_tecnico || 'Sin diagnóstico registrado.')}</div>
        </div>

        <div class="section">
          <h3>Materiales Consumidos</h3>
          ${tablaMateriales}
        </div>
        ` : ''}

        <div class="firmas">
          <div class="firma">
            <div class="linea">Firma del Técnico</div>
          </div>
          <div class="firma">
            <div class="linea">Firma de Conformidad del Cliente</div>
          </div>
        </div>
      </body>
    </html>
  `)

  win.document.close()
  win.focus()
  if (autoPrint) {
    win.print()
  }
}

const exportarOTPDF = async (orden) => {
  exportando.value = true
  try {
    const detalle = await obtenerDetalleOrden(orden.id_ot, orden)
    abrirVistaImpresionOT(detalle, true)
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    exportando.value = false
  }
}

const exportarOTSeleccionadaPDF = async () => {
  const orden = obtenerOrdenSeleccionada()
  if (!orden) {
    ElMessage.warning('Selecciona una orden de trabajo para exportar')
    return
  }
  await exportarOTPDF(orden)
}

const vistaPreviaOT = async (orden) => {
  exportando.value = true
  try {
    const detalle = await obtenerDetalleOrden(orden.id_ot, orden)
    abrirVistaImpresionOT(detalle, false)
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    exportando.value = false
  }
}

const vistaPreviaOTSeleccionada = async () => {
  const orden = obtenerOrdenSeleccionada()
  if (!orden) {
    ElMessage.warning('Selecciona una orden de trabajo para vista previa')
    return
  }
  await vistaPreviaOT(orden)
}

onMounted(fetchAll)
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Órdenes de Trabajo</h2>
          <p class="text-gray-600">Gestión de solicitudes de reparación y mantenimiento</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
        </div>
      </div>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="font-semibold">{{ modoEdicion ? 'Editar OT' : 'Crear Nueva OT' }}</div>
        </template>
        <el-form label-width="170px" class="mb-4">
          <el-form-item label="Folio OT">
            <el-input v-model="otForm.folio_ot" disabled />
          </el-form-item>

          <el-form-item label="Cliente/Solicitante">
            <el-select
              v-model="otForm.id_usuario"
              class="w-full"
              filterable
              clearable
              placeholder="Selecciona usuario registrado"
            >
              <el-option
                v-for="usuario in usuarios"
                :key="usuario.id_usuario"
                :label="`${usuario.nombre || 'Sin nombre'} (${usuario.email || 'sin email'})`"
                :value="usuario.id_usuario"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Solicitante Manual">
            <el-input
              v-model="otForm.solicitante_manual"
              placeholder="Nombre de persona no registrada"
            />
          </el-form-item>

          <el-form-item label="Descripción Problema">
            <el-input
              v-model="otForm.descripcion_problema"
              type="textarea"
              :rows="3"
              placeholder="Describe el problema o la reparación solicitada"
            />
          </el-form-item>

          <el-form-item label="Diagnóstico Técnico">
            <el-input
              v-model="otForm.diagnostico_tecnico"
              type="textarea"
              :rows="2"
              placeholder="Opcional para orden cerrada/finalizada"
            />
          </el-form-item>

          <el-form-item label="Prioridad">
            <el-select v-model="otForm.prioridad" class="w-full">
              <el-option v-for="prioridad in prioridadesOT" :key="prioridad" :label="prioridad" :value="prioridad" />
            </el-select>
          </el-form-item>

          <el-form-item label="Celular Solicitante">
            <el-input
              v-model="otForm.celular_solicitante"
              placeholder="Ej: 9999-9999"
            />
          </el-form-item>

          <el-form-item label="Ubicación Problema">
            <el-input
              v-model="otForm.ubicacion_problema"
              placeholder="Ej: Sede Central, Piso 2, Oficina 8"
            />
          </el-form-item>

          <el-form-item label="Especialidad/Categoría">
            <el-select v-model="otForm.especialidad" class="w-full">
              <el-option v-for="especialidad in especialidades" :key="especialidad" :label="especialidad" :value="especialidad" />
            </el-select>
          </el-form-item>

          <el-form-item label="Taller Asignado">
            <el-input
              v-model="otForm.taller_asignado"
              placeholder="Ej: Taller Eléctrico A / Servicios Externos"
            />
          </el-form-item>

          <el-form-item label="Estado OT">
            <el-select v-model="otForm.estado" class="w-full">
              <el-option v-for="estado in estadosOT" :key="estado" :label="estado" :value="estado" />
            </el-select>
          </el-form-item>

          <div class="flex gap-2">
            <el-button type="success" @click="guardarOrdenTrabajo" :loading="guardando">
              {{ modoEdicion ? 'Actualizar OT' : 'Crear OT' }}
            </el-button>
            <el-button @click="resetForm">{{ modoEdicion ? 'Cancelar' : 'Limpiar' }}</el-button>
          </div>
        </el-form>

        <el-divider>Materiales Consumidos (Item Master)</el-divider>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <el-select
            v-model="materialForm.id_item"
            class="md:col-span-2"
            filterable
            clearable
            placeholder="Selecciona ítem 91G"
            @change="onChangeMaterialItem"
          >
            <el-option
              v-for="item in itemsInventario"
              :key="item.id_item"
              :label="`${item.item_id} - ${item.descripcion}`"
              :value="item.id_item"
            />
          </el-select>
          <el-input-number v-model="materialForm.cantidad" :min="0.01" :step="1" controls-position="right" />
          <div class="flex gap-2">
            <el-input v-model.number="materialForm.precio_unitario" type="number" min="0" step="0.01" />
            <el-button type="primary" @click="agregarMaterial">Agregar</el-button>
          </div>
        </div>

        <el-table :data="materialesSeleccionados" size="small" stripe border class="w-full">
          <el-table-column prop="codigo_91g" label="Código 91G" width="120" />
          <el-table-column prop="descripcion" label="Descripción" min-width="240" />
          <el-table-column label="Cantidad" width="110">
            <template #default="{ row }">
              {{ Number(row.cantidad || 0).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="Precio Unitario" width="140">
            <template #default="{ row }">
              {{ formatCurrency(row.precio_unitario) }}
            </template>
          </el-table-column>
          <el-table-column label="Acciones" width="100">
            <template #default="{ row }">
              <el-button type="danger" text size="small" @click="eliminarMaterial(row.id_item)">Quitar</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div class="font-semibold">Listado de Órdenes de Trabajo</div>
            <div class="flex gap-2">
              <el-button @click="vistaPreviaOTSeleccionada" :disabled="!ordenSeleccionadaId" :loading="exportando">
                Vista previa OT
              </el-button>
              <el-button @click="exportarOTSeleccionadaPDF" :disabled="!ordenSeleccionadaId" :loading="exportando">
                Exportar OT PDF
              </el-button>
            </div>
          </div>
        </template>
        <div class="overflow-x-auto">
          <el-table
            :data="ordenes"
            stripe
            border
            class="w-full"
            v-loading="loading"
            :row-class-name="getRowClassName"
            @row-click="seleccionarOrden"
          >
            <el-table-column label="Seleccionar" width="130">
              <template #default="{ row }">
                <el-button
                  size="small"
                  @click.stop="seleccionarOrden(row)"
                >
                  {{ Number(ordenSeleccionadaId) === Number(row.id_ot) ? 'Seleccionada' : 'Seleccionar' }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="folio_ot" label="Folio" width="170" />
            <el-table-column prop="solicitante_nombre" label="Solicitante" min-width="220" />
            <el-table-column prop="descripcion_problema" label="Descripción" min-width="260" />
            <el-table-column prop="prioridad" label="Prioridad" width="110" />
            <el-table-column prop="celular_solicitante" label="Celular" width="140" />
            <el-table-column prop="ubicacion_problema" label="Ubicación" min-width="220" />
            <el-table-column prop="especialidad" label="Especialidad" width="150" />
            <el-table-column prop="taller_asignado" label="Taller Asignado" min-width="220" />
            <el-table-column label="Estado" width="170">
              <template #default="{ row }">
                <el-select v-model="row.estado" size="small" @change="actualizarEstadoOT(row)">
                  <el-option v-for="estado in estadosOT" :key="estado" :label="estado" :value="estado" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="Fecha" width="170">
              <template #default="{ row }">
                {{ row.fecha_creacion ? new Date(row.fecha_creacion).toLocaleString() : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="Acciones" width="110">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="editarOrden(row)">
                  Editar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
:deep(.ot-selected-row td) {
  background-color: #eef2ff !important;
}
</style>