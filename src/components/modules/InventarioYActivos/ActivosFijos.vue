<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const dialogVisible = ref(false)
const activos = ref([])
const editingId = ref(null)

const activoForm = reactive({
  nombre: '',
  codigo: '',
  descripcion: '',
  fecha_adquisicion: new Date().toISOString().split('T')[0],
  valor_adquisicion: 0,
  vida_util_anos: 0,
  tasa_depreciacion: 0,
  estado: 'operativo',
  ubicacion: ''
})

const resetForm = () => {
  activoForm.nombre = ''
  activoForm.codigo = ''
  activoForm.descripcion = ''
  activoForm.fecha_adquisicion = new Date().toISOString().split('T')[0]
  activoForm.valor_adquisicion = 0
  activoForm.vida_util_anos = 0
  activoForm.tasa_depreciacion = 0
  activoForm.estado = 'operativo'
  activoForm.ubicacion = ''
  editingId.value = null
}

const fetchActivos = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/inventario/activos`)
    if (!res.ok) throw new Error('No se pudieron cargar los activos')
    activos.value = await res.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const guardarActivo = async () => {
  try {
    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value 
      ? `${API_URL}/api/inventario/activos/${editingId.value}`
      : `${API_URL}/api/inventario/activos`

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activoForm)
    })

    if (!response.ok) throw new Error('Error al guardar activo')

    ElMessage.success(editingId.value ? 'Activo actualizado' : 'Activo registrado')
    dialogVisible.value = false
    resetForm()
    await fetchActivos()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const editarActivo = (activo) => {
  editingId.value = activo.id_activo
  activoForm.nombre = activo.nombre
  activoForm.codigo = activo.codigo
  activoForm.descripcion = activo.descripcion
  activoForm.fecha_adquisicion = activo.fecha_adquisicion
  activoForm.valor_adquisicion = activo.valor_adquisicion
  activoForm.vida_util_anos = activo.vida_util_anos
  activoForm.tasa_depreciacion = activo.tasa_depreciacion
  activoForm.estado = activo.estado
  activoForm.ubicacion = activo.ubicacion
  dialogVisible.value = true
}

const eliminarActivo = async (id) => {
  try {
    await ElMessageBox.confirm('¿Estás seguro?', 'Advertencia', {
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    })

    const response = await fetch(`${API_URL}/api/inventario/activos/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('No se pudo eliminar')

    ElMessage.success('Activo eliminado')
    await fetchActivos()
  } catch (error) {
    if (error.message !== 'cancel') ElMessage.error(error.message)
  }
}

const abrirDialogo = () => {
  resetForm()
  dialogVisible.value = true
}

onMounted(fetchActivos)
</script>

<template>
  <div>
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Gestión de Activos Fijos</h2>
          <p class="text-gray-600">Registro y control de activos fijos de la empresa</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="abrirDialogo">Nuevo Activo</el-button>
        </div>
      </div>

      <el-dialog v-model="dialogVisible" :title="editingId ? 'Editar Activo' : 'Nuevo Activo'" width="50%">
        <el-form label-width="150px">
          <el-form-item label="Código">
            <el-input v-model="activoForm.codigo" placeholder="ACT-001" />
          </el-form-item>
          <el-form-item label="Nombre">
            <el-input v-model="activoForm.nombre" placeholder="Nombre del activo" />
          </el-form-item>
          <el-form-item label="Descripción">
            <el-input v-model="activoForm.descripcion" type="textarea" placeholder="Descripción" />
          </el-form-item>
          <el-form-item label="Fecha Adquisición">
            <el-input v-model="activoForm.fecha_adquisicion" type="date" />
          </el-form-item>
          <el-form-item label="Valor Adquisición">
            <el-input v-model.number="activoForm.valor_adquisicion" type="number" placeholder="0.00" />
          </el-form-item>
          <el-form-item label="Vida Útil (años)">
            <el-input v-model.number="activoForm.vida_util_anos" type="number" placeholder="0" />
          </el-form-item>
          <el-form-item label="Tasa Depreciación (%)">
            <el-input v-model.number="activoForm.tasa_depreciacion" type="number" placeholder="0.00" />
          </el-form-item>
          <el-form-item label="Estado">
            <el-select v-model="activoForm.estado">
              <el-option label="Operativo" value="operativo" />
              <el-option label="Mantenimiento" value="mantenimiento" />
              <el-option label="Desuso" value="desuso" />
              <el-option label="Dado de baja" value="baja" />
            </el-select>
          </el-form-item>
          <el-form-item label="Ubicación">
            <el-input v-model="activoForm.ubicacion" placeholder="Ubicación del activo" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">Cancelar</el-button>
          <el-button type="primary" @click="guardarActivo">Guardar</el-button>
        </template>
      </el-dialog>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">Inventario de Activos Fijos</span>
            <el-button text @click="fetchActivos" :loading="loading">Refrescar</el-button>
          </div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="activos" stripe border v-loading="loading">
            <el-table-column prop="id_activo" label="ID" width="80" />
            <el-table-column prop="codigo" label="Código" width="110" />
            <el-table-column prop="nombre" label="Nombre" />
            <el-table-column prop="valor_adquisicion" label="Valor" width="120" />
            <el-table-column prop="estado" label="Estado" width="120" />
            <el-table-column prop="ubicacion" label="Ubicación" width="150" />
            <el-table-column label="Acciones" width="120" align="center">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="editarActivo(row)">Editar</el-button>
                <el-button text type="danger" size="small" @click="eliminarActivo(row.id_activo)">Eliminar</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
