<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const dialogVisible = ref(false)
const productos = ref([])
const categorias = ref([])
const editingId = ref(null)

const productoForm = reactive({
  nombre: '',
  codigo: '',
  id_categoria: null,
  descripcion: '',
  precio_unitario: 0,
  cantidad_stock: 0,
  cantidad_minima: 0
})

const resetForm = () => {
  productoForm.nombre = ''
  productoForm.codigo = ''
  productoForm.id_categoria = null
  productoForm.descripcion = ''
  productoForm.precio_unitario = 0
  productoForm.cantidad_stock = 0
  productoForm.cantidad_minima = 0
  editingId.value = null
}

const fetchProductos = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/inventario/productos`)
    if (!res.ok) throw new Error('No se pudieron cargar los productos')
    productos.value = await res.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const fetchCategorias = async () => {
  try {
    const res = await fetch(`${API_URL}/api/inventario/categorias`)
    if (!res.ok) throw new Error('No se pudieron cargar categorías')
    categorias.value = await res.json()
  } catch (error) {
    console.error(error)
  }
}

const guardarProducto = async () => {
  try {
    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value 
      ? `${API_URL}/api/inventario/productos/${editingId.value}`
      : `${API_URL}/api/inventario/productos`

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoForm)
    })

    if (!response.ok) throw new Error('Error al guardar producto')

    ElMessage.success(editingId.value ? 'Producto actualizado' : 'Producto creado')
    dialogVisible.value = false
    resetForm()
    await fetchProductos()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const editarProducto = (producto) => {
  editingId.value = producto.id_producto
  productoForm.nombre = producto.nombre
  productoForm.codigo = producto.codigo
  productoForm.id_categoria = producto.id_categoria
  productoForm.descripcion = producto.descripcion
  productoForm.precio_unitario = producto.precio_unitario
  productoForm.cantidad_stock = producto.cantidad_stock
  productoForm.cantidad_minima = producto.cantidad_minima
  dialogVisible.value = true
}

const eliminarProducto = async (id) => {
  try {
    await ElMessageBox.confirm('¿Estás seguro?', 'Advertencia', {
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    })

    const response = await fetch(`${API_URL}/api/inventario/productos/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('No se pudo eliminar')

    ElMessage.success('Producto eliminado')
    await fetchProductos()
  } catch (error) {
    if (error.message !== 'cancel') ElMessage.error(error.message)
  }
}

const abrirDialogo = () => {
  resetForm()
  dialogVisible.value = true
}

onMounted(() => {
  fetchProductos()
  fetchCategorias()
})
</script>

<template>
  <div>
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
          <p class="text-gray-600">Catálogo de productos en inventario</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="abrirDialogo">Nuevo Producto</el-button>
        </div>
      </div>

      <el-dialog v-model="dialogVisible" :title="editingId ? 'Editar Producto' : 'Nuevo Producto'" width="50%">
        <el-form label-width="150px">
          <el-form-item label="Código">
            <el-input v-model="productoForm.codigo" placeholder="PROD-001" />
          </el-form-item>
          <el-form-item label="Nombre">
            <el-input v-model="productoForm.nombre" placeholder="Nombre del producto" />
          </el-form-item>
          <el-form-item label="Categoría">
            <el-select v-model="productoForm.id_categoria" placeholder="Selecciona una categoría">
              <el-option v-for="cat in categorias" :key="cat.id_categoria" :label="cat.nombre" :value="cat.id_categoria" />
            </el-select>
          </el-form-item>
          <el-form-item label="Descripción">
            <el-input v-model="productoForm.descripcion" type="textarea" placeholder="Descripción" />
          </el-form-item>
          <el-form-item label="Precio Unitario">
            <el-input v-model.number="productoForm.precio_unitario" type="number" placeholder="0.00" />
          </el-form-item>
          <el-form-item label="Stock Actual">
            <el-input v-model.number="productoForm.cantidad_stock" type="number" placeholder="0" />
          </el-form-item>
          <el-form-item label="Stock Mínimo">
            <el-input v-model.number="productoForm.cantidad_minima" type="number" placeholder="0" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">Cancelar</el-button>
          <el-button type="primary" @click="guardarProducto">Guardar</el-button>
        </template>
      </el-dialog>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">Inventario de Productos</span>
            <el-button text @click="fetchProductos" :loading="loading">Refrescar</el-button>
          </div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="productos" stripe border v-loading="loading">
            <el-table-column prop="id_producto" label="ID" width="80" />
            <el-table-column prop="codigo" label="Código" width="110" />
            <el-table-column prop="nombre" label="Nombre" />
            <el-table-column prop="precio_unitario" label="Precio" width="100" />
            <el-table-column prop="cantidad_stock" label="Stock" width="80" />
            <el-table-column prop="cantidad_minima" label="Mínimo" width="80" />
            <el-table-column label="Acciones" width="120" align="center">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="editarProducto(row)">Editar</el-button>
                <el-button text type="danger" size="small" @click="eliminarProducto(row.id_producto)">Eliminar</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
