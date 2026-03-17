<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  apiUrl: {
    type: String,
    default: () => window.API_URL || 'http://localhost:5000'
  }
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const buscador = ref('')
const catalogo = ref([])
const seleccion = ref([...props.modelValue])

watch(
  () => props.modelValue,
  (value) => {
    seleccion.value = Array.isArray(value) ? [...value] : []
  },
  { deep: true }
)

const totalMateriales = computed(() =>
  seleccion.value.reduce((acc, item) => acc + Number(item.cantidad || 0), 0)
)

const totalEstimado = computed(() =>
  seleccion.value.reduce(
    (acc, item) => acc + Number(item.cantidad || 0) * Number(item.precio || 0),
    0
  )
)

const buscarMateriales = async () => {
  loading.value = true
  try {
    const query = encodeURIComponent(buscador.value || '')
    const response = await fetch(`${props.apiUrl}/api/inventario/item-master-disponible?q=${query}`)

    if (response.ok) {
      const payload = await response.json()
      catalogo.value = Array.isArray(payload.items)
        ? payload.items.map((item) => ({
            ...item,
            stock_actual: Number(item.stock_actual ?? item.numero_partes ?? 0)
          }))
        : []
      return
    }

    if (response.status === 404) {
      const legacyResponse = await fetch(`${props.apiUrl}/api/inventario/item-master`)
      if (!legacyResponse.ok) {
        throw new Error('No se pudo cargar inventario disponible')
      }

      const legacyItems = await legacyResponse.json()
      const normalized = (Array.isArray(legacyItems) ? legacyItems : []).map((item) => ({
        ...item,
        stock_actual: Number(item.stock_actual ?? item.numero_partes ?? 0)
      }))

      const filtrados = query
        ? normalized.filter((item) =>
            String(item.descripcion || '').toLowerCase().includes(String(buscador.value || '').toLowerCase()) ||
            String(item.item_id || '').toLowerCase().includes(String(buscador.value || '').toLowerCase())
          )
        : normalized

      catalogo.value = filtrados.filter((item) => Number(item.stock_actual || 0) > 0)
      return
    }

    throw new Error('No se pudo cargar inventario disponible')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const agregarMaterial = (material) => {
  const existente = seleccion.value.find((item) => item.id_item === material.id_item)
  if (existente) {
    if (existente.cantidad + 1 > Number(material.stock_actual || 0)) {
      ElMessage.warning(`Stock insuficiente para ${material.descripcion}`)
      return
    }

    existente.cantidad += 1
  } else {
    seleccion.value.push({
      id_item: material.id_item,
      item_id: material.item_id,
      descripcion: material.descripcion,
      stock_actual: Number(material.stock_actual || 0),
      precio: Number(material.precio || 0),
      cantidad: 1
    })
  }

  emit('update:modelValue', [...seleccion.value])
}

const actualizarCantidad = (index, nuevaCantidad) => {
  const cantidad = Number(nuevaCantidad || 0)
  const item = seleccion.value[index]

  if (!item) return
  if (cantidad <= 0) {
    seleccion.value.splice(index, 1)
  } else if (cantidad > Number(item.stock_actual || 0)) {
    ElMessage.warning(`Cantidad excede stock disponible (${item.stock_actual})`)
    item.cantidad = Number(item.stock_actual || 0)
  } else {
    item.cantidad = cantidad
  }

  emit('update:modelValue', [...seleccion.value])
}

const removerMaterial = (index) => {
  seleccion.value.splice(index, 1)
  emit('update:modelValue', [...seleccion.value])
}

onMounted(() => {
  buscarMateriales()
})
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="font-semibold">Selector de Materiales</div>
    </template>

    <div class="flex gap-2 mb-4">
      <el-input
        v-model="buscador"
        clearable
        placeholder="Buscar por código o descripción"
        @input="buscarMateriales"
      />
      <el-button :loading="loading" @click="buscarMateriales">Actualizar stock</el-button>
    </div>

    <el-table :data="catalogo" stripe border size="small" max-height="250" v-loading="loading">
      <el-table-column prop="item_id" label="Item" width="110" />
      <el-table-column prop="descripcion" label="Descripción" min-width="180" />
      <el-table-column prop="stock_actual" label="Stock" width="90" align="center" />
      <el-table-column prop="precio" label="Precio" width="100" align="right" />
      <el-table-column label="Acción" width="90" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="agregarMaterial(row)">Agregar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-5">
      <h4 class="font-medium mb-2">Materiales seleccionados</h4>
      <el-table :data="seleccion" stripe border size="small" empty-text="Sin materiales asociados">
        <el-table-column prop="item_id" label="Item" width="110" />
        <el-table-column prop="descripcion" label="Descripción" min-width="170" />
        <el-table-column label="Cantidad" width="140" align="center">
          <template #default="{ row, $index }">
            <el-input-number
              :model-value="row.cantidad"
              :min="1"
              :max="Number(row.stock_actual || 0)"
              controls-position="right"
              @update:model-value="(value) => actualizarCantidad($index, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="stock_actual" label="Stock" width="80" align="center" />
        <el-table-column label="Subtotal" width="120" align="right">
          <template #default="{ row }">
            {{ (Number(row.cantidad || 0) * Number(row.precio || 0)).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="" width="80" align="center">
          <template #default="{ $index }">
            <el-button type="danger" link @click="removerMaterial($index)">Quitar</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end gap-6 mt-3 text-sm">
        <span>Total piezas: <strong>{{ totalMateriales }}</strong></span>
        <span>Costo materiales: <strong>{{ totalEstimado.toFixed(2) }}</strong></span>
      </div>
    </div>
  </el-card>
</template>
