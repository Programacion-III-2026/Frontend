<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const guardando = ref(false)
const items = ref([])
const proveedores = ref([])
const modoEdicion = ref(false)
const itemEditandoId = ref(null)
const busqueda = ref('')
const paginaActual = ref(1)
const tamanoPagina = ref(8)

const itemForm = reactive({
  item_id: '',
  descripcion: '',
  numero_partes: null,
  proveedor: '',
  precio: null,
  unidad_medida: 'Unidad'
})

const unidadesMedida = ['Unidad', 'PK', 'Par']

const itemsFiltrados = computed(() => {
  const termino = busqueda.value.trim().toLowerCase()
  if (!termino) return items.value

  return items.value.filter((item) => {
    const itemId = String(item.item_id || '').toLowerCase()
    const descripcion = String(item.descripcion || '').toLowerCase()
    return itemId.includes(termino) || descripcion.includes(termino)
  })
})

const totalFiltrados = computed(() => itemsFiltrados.value.length)

const itemsPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * tamanoPagina.value
  const fin = inicio + tamanoPagina.value
  return itemsFiltrados.value.slice(inicio, fin)
})

const siguienteCorrelativo = computed(() => {
  const maxCorrelativo = items.value.reduce((max, item) => {
    const match = /^91G(\d+)$/.exec(item.item_id || '')
    if (!match) return max
    return Math.max(max, Number(match[1]))
  }, 0)

  return maxCorrelativo + 1
})

const generarNuevoCodigo = () => {
  itemForm.item_id = `91G${String(siguienteCorrelativo.value).padStart(3, '0')}`
}

const resetForm = () => {
  modoEdicion.value = false
  itemEditandoId.value = null
  itemForm.descripcion = ''
  itemForm.numero_partes = null
  itemForm.proveedor = ''
  itemForm.precio = null
  itemForm.unidad_medida = 'Unidad'
  generarNuevoCodigo()
}

const cargarItems = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/api/inventario/item-master`)

    if (!response.ok) {
      throw new Error('No se pudieron cargar los items')
    }

    items.value = await response.json()
  } catch (error) {
    items.value = []
    ElMessage.error(error.message || 'No se pudieron cargar los items')
  } finally {
    loading.value = false
    generarNuevoCodigo()
  }
}

const cargarProveedores = async () => {
  try {
    const response = await fetch(`${API_URL}/api/soporte/clientes`)

    if (!response.ok) {
      throw new Error('No se pudo cargar la lista de proveedores')
    }

    const clientes = await response.json()
    const nombres = clientes
      .map(cliente => cliente.nombre)
      .filter(Boolean)

    proveedores.value = [...new Set(nombres)].sort((a, b) => a.localeCompare(b))
  } catch {
    proveedores.value = []
  }
}

const guardarItem = async () => {
  if (!itemForm.descripcion.trim()) {
    ElMessage.warning('La descripción es obligatoria')
    return
  }

  if (!itemForm.proveedor.trim()) {
    ElMessage.warning('Selecciona o escribe un proveedor')
    return
  }

  if (itemForm.numero_partes === null || Number(itemForm.numero_partes) < 1) {
    ElMessage.warning('El número de partes es obligatorio y debe ser mayor a 0')
    return
  }

  if (!Number.isInteger(Number(itemForm.numero_partes))) {
    ElMessage.warning('El número de partes debe ser un entero')
    return
  }

  if (itemForm.precio === null || Number(itemForm.precio) < 0) {
    ElMessage.warning('Ingresa un precio válido')
    return
  }

  guardando.value = true
  try {
    const payload = {
      item_id: itemForm.item_id,
      descripcion: itemForm.descripcion.trim(),
      numero_partes: Number(itemForm.numero_partes),
      proveedor: itemForm.proveedor.trim(),
      precio: Number(itemForm.precio),
      unidad_medida: itemForm.unidad_medida
    }

    const response = await fetch(
      modoEdicion.value
        ? `${API_URL}/api/inventario/item-master/${itemEditandoId.value}`
        : `${API_URL}/api/inventario/item-master`,
      {
      method: modoEdicion.value ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error || 'No se pudo guardar el item')
    }

    if (!proveedores.value.includes(payload.proveedor)) {
      proveedores.value = [...proveedores.value, payload.proveedor].sort((a, b) => a.localeCompare(b))
    }

    ElMessage.success(modoEdicion.value ? 'Item actualizado' : 'Item creado')
    await cargarItems()
    resetForm()
  } catch (error) {
    ElMessage.error(error.message || 'No se pudo guardar el item')
  } finally {
    guardando.value = false
  }
}

const editarItem = (item) => {
  modoEdicion.value = true
  itemEditandoId.value = item.id_item
  itemForm.item_id = item.item_id || ''
  itemForm.descripcion = item.descripcion || ''
  itemForm.numero_partes = Number(item.numero_partes || 0)
  itemForm.proveedor = item.proveedor || ''
  itemForm.precio = Number(item.precio || 0)
  itemForm.unidad_medida = item.unidad_medida || 'Unidad'
}

const eliminarItem = async (item) => {
  try {
    await ElMessageBox.confirm(
      `¿Eliminar el item ${item.item_id}?`,
      'Confirmar eliminación',
      { confirmButtonText: 'Sí', cancelButtonText: 'No', type: 'warning' }
    )

    const response = await fetch(`${API_URL}/api/inventario/item-master/${item.id_item}`, {
      method: 'DELETE'
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.error || 'No se pudo eliminar el item')
    }

    ElMessage.success('Item eliminado')

    if (modoEdicion.value && itemEditandoId.value === item.id_item) {
      resetForm()
    }

    await cargarItems()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || 'No se pudo eliminar el item')
    }
  }
}

const fetchAll = async () => {
  await Promise.all([cargarItems(), cargarProveedores()])
}

const exportarExcel = () => {
  const registros = itemsFiltrados.value

  if (!registros.length) {
    ElMessage.warning('No hay datos para exportar')
    return
  }

  const data = registros.map((item) => ({
    'ID (91G)': item.item_id,
    'Descripción': item.descripcion,
    'Número de Partes': item.numero_partes,
    'Proveedor': item.proveedor,
    'Precio': Number(item.precio || 0),
    'Unidad de Medida': item.unidad_medida
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Item Master')

  const hoy = new Date()
  const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
  const nombreArchivo = `item-master-${fecha}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  ElMessage.success('Excel generado correctamente')
}

watch(busqueda, () => {
  paginaActual.value = 1
})

watch(itemsFiltrados, (lista) => {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / tamanoPagina.value))
  if (paginaActual.value > totalPaginas) {
    paginaActual.value = totalPaginas
  }
})

onMounted(fetchAll)
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Item Master</h2>
          <p class="text-gray-600">Gestión de ítems de inventario</p>
        </div>
        <div class="flex gap-2">
          <el-button type="success" @click="exportarExcel">Exportar Excel</el-button>
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
        </div>
      </div>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="font-semibold">{{ modoEdicion ? 'Actualizar Item' : 'Crear Nuevo Item' }}</div>
        </template>
        <el-form label-width="140px" class="mb-4">
          <el-form-item label="Item ID">
            <el-input v-model="itemForm.item_id" disabled />
          </el-form-item>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="Descripción">
              <el-input v-model="itemForm.descripcion" placeholder="Material o herramienta" />
            </el-form-item>
            <el-form-item label="Número de Partes">
              <el-input v-model.number="itemForm.numero_partes" type="number" min="1" placeholder="Ej: 4" />
            </el-form-item>
          </div>
          <el-form-item label="Proveedor">
            <el-select
              v-model="itemForm.proveedor"
              class="w-full"
              filterable
              allow-create
              default-first-option
              placeholder="Selecciona o escribe proveedor"
            >
              <el-option v-for="proveedor in proveedores" :key="proveedor" :label="proveedor" :value="proveedor" />
            </el-select>
          </el-form-item>
          <el-form-item label="Precio">
            <el-input v-model.number="itemForm.precio" type="number" min="0" step="0.01" placeholder="0.00" />
          </el-form-item>
          <el-form-item label="Unidad de Medida">
            <el-select v-model="itemForm.unidad_medida" class="w-full">
              <el-option v-for="unidad in unidadesMedida" :key="unidad" :label="unidad" :value="unidad" />
            </el-select>
          </el-form-item>
          <div class="flex gap-2">
            <el-button type="success" @click="guardarItem" :loading="guardando">
              {{ modoEdicion ? 'Actualizar item' : 'Crear item' }}
            </el-button>
            <el-button v-if="modoEdicion" @click="resetForm">Cancelar</el-button>
          </div>
        </el-form>
      </el-card>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div class="font-semibold">Listado de Items</div>
            <el-input
              v-model="busqueda"
              placeholder="Buscar por ID o descripción"
              clearable
              class="w-80"
            />
          </div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="itemsPaginados" stripe border class="w-full" v-loading="loading">
            <el-table-column prop="item_id" label="ID (91G)" width="110" />
            <el-table-column prop="descripcion" label="Descripción" />
            <el-table-column label="N° Partes" width="120">
              <template #default="{ row }">
                {{ row.numero_partes ?? '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="proveedor" label="Proveedor" width="220" />
            <el-table-column label="Precio" width="140">
              <template #default="{ row }">
                {{ Number(row.precio || 0).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="unidad_medida" label="Unidad de Medida" width="170" />
            <el-table-column label="Acciones" width="180">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="editarItem(row)">
                  Editar
                </el-button>
                <el-button type="danger" text size="small" @click="eliminarItem(row)">
                  Eliminar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex justify-end mt-4">
          <el-pagination
            v-model:current-page="paginaActual"
            :page-size="tamanoPagina"
            layout="total, prev, pager, next"
            :total="totalFiltrados"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>
