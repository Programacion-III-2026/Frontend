<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const dialogVisible = ref(false)
const movimientos = ref([])
const editingId = ref(null)

const movimientoForm = reactive({
  descripcion: '',
  tipo_movimiento: 'entrada',
  cantidad: 0,
  motivo: '',
  fecha: new Date().toISOString().split('T')[0]
})

const resetForm = () => {
  movimientoForm.descripcion = ''
  movimientoForm.tipo_movimiento = 'entrada'
  movimientoForm.cantidad = 0
  movimientoForm.motivo = ''
  movimientoForm.fecha = new Date().toISOString().split('T')[0]
  editingId.value = null
}

const fetchMovimientos = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/inventario/movimientos`)
    if (!res.ok) throw new Error('No se pudieron cargar los movimientos')
    movimientos.value = await res.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// Funcionalidad de productos deshabilitada - tabla no existe en BD

const guardarMovimiento = async () => {
  try {
    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value 
      ? `${API_URL}/api/inventario/movimientos/${editingId.value}`
      : `${API_URL}/api/inventario/movimientos`

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movimientoForm)
    })

    if (!response.ok) throw new Error('Error al guardar movimiento')

    ElMessage.success(editingId.value ? 'Movimiento actualizado' : 'Movimiento registrado')
    dialogVisible.value = false
    resetForm()
    await fetchMovimientos()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const editarMovimiento = (movimiento) => {
  editingId.value = movimiento.id_movimiento
  movimientoForm.descripcion = movimiento.descripcion
  movimientoForm.tipo_movimiento = movimiento.tipo_movimiento
  movimientoForm.cantidad = movimiento.cantidad
  movimientoForm.motivo = movimiento.motivo
  movimientoForm.fecha = movimiento.fecha
  dialogVisible.value = true
}

const eliminarMovimiento = async (id) => {
  try {
    await ElMessageBox.confirm('¿Estás seguro?', 'Advertencia', {
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    })

    const response = await fetch(`${API_URL}/api/inventario/movimientos/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('No se pudo eliminar')

    ElMessage.success('Movimiento eliminado')
    await fetchMovimientos()
  } catch (error) {
    if (error.message !== 'cancel') ElMessage.error(error.message)
  }
}

const abrirDialogo = () => {
  resetForm()
  dialogVisible.value = true
}

onMounted(() => {
  fetchMovimientos()
})
</script>

<template>
  <div>
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Movimientos de Inventario</h2>
          <p class="text-gray-600">Registro de entradas y salidas</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="abrirDialogo">Nuevo Movimiento</el-button>
        </div>
      </div>

      <el-dialog v-model="dialogVisible" :title="editingId ? 'Editar Movimiento' : 'Nuevo Movimiento'" width="50%">
        <el-form label-width="150px">
          <el-form-item label="Descripción">
            <el-input v-model="movimientoForm.descripcion" placeholder="Descripción del artículo" />
          </el-form-item>
          <el-form-item label="Tipo de Movimiento">
            <el-select v-model="movimientoForm.tipo_movimiento">
              <el-option label="Entrada" value="entrada" />
              <el-option label="Salida" value="salida" />
              <el-option label="Ajuste" value="ajuste" />
              <el-option label="Devolución" value="devolucion" />
            </el-select>
          </el-form-item>
          <el-form-item label="Cantidad">
            <el-input v-model.number="movimientoForm.cantidad" type="number" placeholder="0" />
          </el-form-item>
          <el-form-item label="Fecha">
            <el-input v-model="movimientoForm.fecha" type="date" />
          </el-form-item>
          <el-form-item label="Motivo">
            <el-input v-model="movimientoForm.motivo" type="textarea" placeholder="Motivo del movimiento" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">Cancelar</el-button>
          <el-button type="primary" @click="guardarMovimiento">Guardar</el-button>
        </template>
      </el-dialog>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">Historial de Movimientos</span>
            <el-button text @click="fetchMovimientos" :loading="loading">Refrescar</el-button>
          </div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="movimientos" stripe border v-loading="loading">
            <el-table-column prop="id_movimiento" label="ID" width="80" />
            <el-table-column prop="descripcion" label="Descripción" width="200" />
            <el-table-column prop="tipo_movimiento" label="Tipo" width="110" />
            <el-table-column prop="cantidad" label="Cantidad" width="100" />
            <el-table-column prop="fecha" label="Fecha" width="120" />
            <el-table-column prop="motivo" label="Motivo" width="200" />
            <el-table-column label="Acciones" width="120" align="center">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="editarMovimiento(row)">Editar</el-button>
                <el-button text type="danger" size="small" @click="eliminarMovimiento(row.id_movimiento)">Eliminar</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
