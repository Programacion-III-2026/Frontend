<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { t as translateText } from '../../../i18n/runtimeTranslator'

const API_URL = window.API_URL || 'http://localhost:5000'
const ISV_RATE = 0.15

const loading = ref(false)
const guardando = ref(false)
const proveedores = ref([])
const itemsInventario = ref([])
const detalle = ref([])
const ultimaFacturaGenerada = ref('')

const form = reactive({
  numero_factura: 'Automático',
  id_proveedor: null,
  fecha_factura: new Date().toISOString().slice(0, 10),
  fecha_vencimiento: '',
  usuario: 'Sistema'
})

const lineaNueva = reactive({
  id_item: null,
  cantidad: 1,
  precio_unitario: 0
})

const subtotal = computed(() => detalle.value.reduce((acc, item) => acc + Number(item.base_linea || 0), 0))
const isv = computed(() => subtotal.value * ISV_RATE)
const total = computed(() => subtotal.value + isv.value)

const t = (esText, enText) => translateText(esText, enText)

const generarNumeroFacturaCliente = () => {
  const ahora = new Date()
  const y = ahora.getFullYear()
  const m = String(ahora.getMonth() + 1).padStart(2, '0')
  const d = String(ahora.getDate()).padStart(2, '0')
  const sufijo = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `FC${y}${m}${d}-${sufijo}`
}

const resetLinea = () => {
  lineaNueva.id_item = null
  lineaNueva.cantidad = 1
  lineaNueva.precio_unitario = 0
}

const cargarProveedores = async () => {
  const response = await fetch(`${API_URL}/api/integracion/compras/proveedores`)

  if (response.ok) {
    const data = await response.json()
    proveedores.value = data.proveedores || []
    return
  }

  if (response.status === 404) {
    const fallback = await fetch(`${API_URL}/api/soporte/clientes`)
    if (!fallback.ok) {
      throw new Error(t('No se pudieron cargar proveedores', 'Could not load suppliers'))
    }

    const clientes = await fallback.json()
    proveedores.value = (clientes || []).map((cliente) => ({
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion
    }))
    return
  }

  throw new Error(t('No se pudieron cargar proveedores', 'Could not load suppliers'))
}

const cargarItems = async () => {
  const response = await fetch(`${API_URL}/api/inventario/item-master`)
  if (!response.ok) {
    throw new Error(t('No se pudieron cargar ítems de inventario', 'Could not load inventory items'))
  }
  itemsInventario.value = await response.json()
}

const cargarCatalogos = async () => {
  loading.value = true
  try {
    const [resultadoProveedores, resultadoItems] = await Promise.allSettled([
      cargarProveedores(),
      cargarItems()
    ])

    const errores = []
    if (resultadoProveedores.status === 'rejected') {
      errores.push(resultadoProveedores.reason?.message || t('Error cargando proveedores', 'Error loading suppliers'))
    }
    if (resultadoItems.status === 'rejected') {
      errores.push(resultadoItems.reason?.message || t('Error cargando ítems', 'Error loading items'))
    }

    if (errores.length > 0) {
      throw new Error(errores.join(' | '))
    }
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const agregarLinea = () => {
  if (!lineaNueva.id_item || Number(lineaNueva.cantidad) <= 0) {
    ElMessage.warning(t('Selecciona item y cantidad válida', 'Select a valid item and quantity'))
    return
  }

  const item = itemsInventario.value.find((it) => Number(it.id_item) === Number(lineaNueva.id_item))
  if (!item) {
    ElMessage.warning(t('Item no válido', 'Invalid item'))
    return
  }

  const precio = Number(lineaNueva.precio_unitario) > 0 ? Number(lineaNueva.precio_unitario) : Number(item.precio || 0)
  const base = Number(lineaNueva.cantidad) * precio

  detalle.value.push({
    id_item: Number(lineaNueva.id_item),
    item_id: item.item_id,
    descripcion: item.descripcion,
    cantidad: Number(lineaNueva.cantidad),
    precio_unitario: precio,
    base_linea: base
  })

  resetLinea()
}

const eliminarLinea = (index) => {
  detalle.value.splice(index, 1)
}

const guardarEntrada = async () => {
  if (!form.id_proveedor || detalle.value.length === 0) {
    ElMessage.warning(t('Completa proveedor y al menos un ítem', 'Select a supplier and add at least one item'))
    return
  }

  guardando.value = true
  try {
    const payload = {
      numero_factura: generarNumeroFacturaCliente(),
      id_proveedor: form.id_proveedor,
      fecha_factura: form.fecha_factura,
      fecha_vencimiento: form.fecha_vencimiento,
      usuario: form.usuario,
      items: detalle.value.map((linea) => ({
        id_item: linea.id_item,
        cantidad: linea.cantidad,
        precio_unitario: linea.precio_unitario
      }))
    }

    const response = await fetch(`${API_URL}/api/integracion/compras/facturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || t('No se pudo registrar la entrada', 'Could not register goods receipt'))

    const numeroGenerado = String(data?.factura?.numero_factura || '').trim()
    ultimaFacturaGenerada.value = numeroGenerado
    ElMessage.success(
      `${t('Entrada registrada con factura', 'Goods receipt registered with invoice')} ${numeroGenerado}`.trim()
    )
    form.numero_factura = 'Automático'
    form.id_proveedor = null
    form.fecha_vencimiento = ''
    detalle.value = []
    await cargarCatalogos()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

onMounted(cargarCatalogos)
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">{{ t('Entrada de Mercancía', 'Goods Receipt') }}</div>
      </template>

      <el-form label-width="160px" class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <el-form-item :label="t('N° Factura', 'Invoice #')">
          <el-input v-model="form.numero_factura" disabled />
        </el-form-item>
        <el-form-item :label="t('Proveedor (clientes)', 'Supplier (clients)')">
          <el-select
            v-model="form.id_proveedor"
            filterable
            :placeholder="t('Selecciona proveedor', 'Select supplier')"
            class="w-full"
            :loading="loading"
          >
            <el-option v-for="prov in proveedores" :key="prov.id_cliente" :label="prov.nombre" :value="prov.id_cliente" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('Fecha factura', 'Invoice date')">
          <el-date-picker v-model="form.fecha_factura" type="date" value-format="YYYY-MM-DD" class="w-full" />
        </el-form-item>
        <el-form-item :label="t('Fecha vencimiento', 'Due date')">
          <el-date-picker v-model="form.fecha_vencimiento" type="date" value-format="YYYY-MM-DD" class="w-full" />
        </el-form-item>
      </el-form>

      <el-alert
        v-if="ultimaFacturaGenerada"
        type="success"
        :closable="false"
        show-icon
        class="mt-3"
        :title="`${t('Última factura generada:', 'Latest generated invoice:')} ${ultimaFacturaGenerada}`"
      />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">{{ t('Detalle de Ítems', 'Item Details') }}</div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-end mb-3">
        <el-select v-model="lineaNueva.id_item" filterable :placeholder="t('Item', 'Item')" :loading="loading">
          <el-option v-for="item in itemsInventario" :key="item.id_item" :label="`${item.item_id} - ${item.descripcion}`" :value="item.id_item" />
        </el-select>
        <el-input-number v-model="lineaNueva.cantidad" :min="1" :step="1" class="w-full" />
        <el-input-number v-model="lineaNueva.precio_unitario" :min="0" :step="0.01" :precision="2" class="w-full" />
        <el-button type="primary" @click="agregarLinea">{{ t('Agregar', 'Add') }}</el-button>
      </div>

      <el-table :data="detalle" border stripe size="small">
        <el-table-column prop="item_id" :label="t('Item', 'Item')" width="120" />
        <el-table-column prop="descripcion" :label="t('Descripción', 'Description')" />
        <el-table-column prop="cantidad" :label="t('Cantidad', 'Quantity')" width="100" />
        <el-table-column prop="precio_unitario" :label="t('Precio', 'Price')" width="120" />
        <el-table-column prop="base_linea" :label="t('Base', 'Base')" width="120" />
        <el-table-column :label="t('Acción', 'Action')" width="100">
          <template #default="{ $index }">
            <el-button text type="danger" @click="eliminarLinea($index)">{{ t('Quitar', 'Remove') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 text-right space-y-1">
        <div>{{ t('Subtotal', 'Subtotal') }}: L {{ subtotal.toFixed(2) }}</div>
        <div>ISV (15%): L {{ isv.toFixed(2) }}</div>
        <div class="font-semibold">{{ t('Total', 'Total') }}: L {{ total.toFixed(2) }}</div>
      </div>

      <div class="mt-4 flex justify-end">
        <el-button type="primary" :loading="guardando" @click="guardarEntrada">
          {{ t('Registrar Entrada', 'Register Goods Receipt') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>
