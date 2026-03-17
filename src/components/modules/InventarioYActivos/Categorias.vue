<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const dialogVisible = ref(false)
const categorias = ref([])
const editingId = ref(null)

const categoriaForm = reactive({
  nombre: '',
  descripcion: '',
  codigo: ''
})

const resetForm = () => {
  categoriaForm.nombre = ''
  categoriaForm.descripcion = ''
  categoriaForm.codigo = ''
  editingId.value = null
}

const fetchCategorias = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/inventario/categorias`)
    if (!res.ok) throw new Error('No se pudieron cargar las categorías')
    categorias.value = await res.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const guardarCategoria = async () => {
  try {
    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value 
      ? `${API_URL}/api/inventario/categorias/${editingId.value}`
      : `${API_URL}/api/inventario/categorias`

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoriaForm)
    })

    if (!response.ok) throw new Error('Error al guardar categoría')

    ElMessage.success(editingId.value ? 'Categoría actualizada' : 'Categoría creada')
    dialogVisible.value = false
    resetForm()
    await fetchCategorias()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const editarCategoria = (categoria) => {
  editingId.value = categoria.id_categoria
  categoriaForm.nombre = categoria.nombre
  categoriaForm.descripcion = categoria.descripcion
  categoriaForm.codigo = categoria.codigo
  dialogVisible.value = true
}

const eliminarCategoria = async (id) => {
  try {
    await ElMessageBox.confirm('¿Estás seguro?', 'Advertencia', {
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    })

    const response = await fetch(`${API_URL}/api/inventario/categorias/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('No se pudo eliminar')

    ElMessage.success('Categoría eliminada')
    await fetchCategorias()
  } catch (error) {
    if (error.message !== 'cancel') ElMessage.error(error.message)
  }
}

const abrirDialogo = () => {
  resetForm()
  dialogVisible.value = true
}

onMounted(fetchCategorias)
</script>

<template>
  <div>
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Categorías de Inventario</h2>
          <p class="text-gray-600">Gestión de categorías de inventario</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="abrirDialogo">Nueva Categoría</el-button>
        </div>
      </div>

      <el-dialog v-model="dialogVisible" :title="editingId ? 'Editar Categoría' : 'Nueva Categoría'" width="45%">
        <el-form label-width="120px">
          <el-form-item label="Código">
            <el-input v-model="categoriaForm.codigo" placeholder="CAT-001" />
          </el-form-item>
          <el-form-item label="Nombre">
            <el-input v-model="categoriaForm.nombre" placeholder="Nombre de categoría" />
          </el-form-item>
          <el-form-item label="Descripción">
            <el-input v-model="categoriaForm.descripcion" type="textarea" placeholder="Descripción" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">Cancelar</el-button>
          <el-button type="primary" @click="guardarCategoria">Guardar</el-button>
        </template>
      </el-dialog>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">Categorías</span>
            <el-button text @click="fetchCategorias" :loading="loading">Refrescar</el-button>
          </div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="categorias" stripe border v-loading="loading">
            <el-table-column prop="id_categoria" label="ID" width="80" />
            <el-table-column prop="codigo" label="Código" width="120" />
            <el-table-column prop="nombre" label="Nombre" />
            <el-table-column prop="descripcion" label="Descripción" width="250" />
            <el-table-column label="Acciones" width="120" align="center">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="editarCategoria(row)">Editar</el-button>
                <el-button text type="danger" size="small" @click="eliminarCategoria(row.id_categoria)">Eliminar</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
