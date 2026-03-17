<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const guardando = ref(false)
const modoEdicion = ref(false)
const empleadoEditandoId = ref(null)
const empleados = ref([])

const empleadoForm = reactive({
  nombre: '',
  apellido: '',
  puesto: '',
  salario: 0,
  fecha_ingreso: ''
})

const fetchAll = async () => {
  loading.value = true
  try {
    const empleadosRes = await fetch(`${API_URL}/api/rrhh/empleados`)

    if (!empleadosRes.ok) {
      throw new Error('No se pudieron cargar los datos de RRHH')
    }

    empleados.value = await empleadosRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  empleadoForm.nombre = ''
  empleadoForm.apellido = ''
  empleadoForm.puesto = ''
  empleadoForm.salario = 0
  empleadoForm.fecha_ingreso = ''
  modoEdicion.value = false
  empleadoEditandoId.value = null
}

const guardarEmpleado = async () => {
  if (!String(empleadoForm.nombre || '').trim()) {
    ElMessage.warning('El nombre es obligatorio')
    return
  }

  if (!String(empleadoForm.apellido || '').trim()) {
    ElMessage.warning('El apellido es obligatorio')
    return
  }

  if (!String(empleadoForm.puesto || '').trim()) {
    ElMessage.warning('El puesto es obligatorio')
    return
  }

  if (!empleadoForm.fecha_ingreso) {
    ElMessage.warning('La fecha de ingreso es obligatoria')
    return
  }

  if (Number(empleadoForm.salario) < 0) {
    ElMessage.warning('El salario no puede ser negativo')
    return
  }

  guardando.value = true
  try {
    const url = modoEdicion.value
      ? `${API_URL}/api/rrhh/empleados/${empleadoEditandoId.value}`
      : `${API_URL}/api/rrhh/empleados`

    const method = modoEdicion.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empleadoForm)
    })

    if (!response.ok) {
      throw new Error(modoEdicion.value ? 'No se pudo actualizar el empleado' : 'No se pudo crear el empleado')
    }

    ElMessage.success(modoEdicion.value ? 'Empleado actualizado' : 'Empleado creado')
    resetForm()
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

const editarEmpleado = (empleado) => {
  modoEdicion.value = true
  empleadoEditandoId.value = empleado.id_empleado
  empleadoForm.nombre = empleado.nombre || ''
  empleadoForm.apellido = empleado.apellido || ''
  empleadoForm.puesto = empleado.puesto || ''
  empleadoForm.salario = Number(empleado.salario || 0)
  empleadoForm.fecha_ingreso = empleado.fecha_ingreso || ''
}

const eliminarEmpleado = async (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que deseas eliminar este empleado?',
    'Confirmar eliminación',
    { confirmButtonText: 'Sí', cancelButtonText: 'No', type: 'warning' }
  )
    .then(async () => {
      try {
        const response = await fetch(`${API_URL}/api/rrhh/empleados/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('No se pudo eliminar el empleado')
        }

        ElMessage.success('Empleado eliminado')
        if (empleadoEditandoId.value === id) {
          resetForm()
        }
        await fetchAll()
      } catch (error) {
        ElMessage.error(error.message)
      }
    })
    .catch(() => {})
}

onMounted(fetchAll)
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Empleados</h2>
        <p class="text-gray-600">Gestión de empleados</p>
      </div>
      <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
    </div>

      <el-card shadow="hover">
        <template #header>
          <div class="font-semibold">{{ modoEdicion ? 'Actualizar Empleado' : 'Crear Nuevo Empleado' }}</div>
        </template>
        <el-form label-width="120px" class="mb-4">
          <el-form-item label="Nombre">
            <el-input v-model="empleadoForm.nombre" placeholder="Juan" />
          </el-form-item>
          <el-form-item label="Apellido">
            <el-input v-model="empleadoForm.apellido" placeholder="Pérez" />
          </el-form-item>
          <el-form-item label="Puesto">
            <el-input v-model="empleadoForm.puesto" placeholder="Ingeniero" />
          </el-form-item>
          <el-form-item label="Salario">
            <el-input-number v-model="empleadoForm.salario" :min="0" class="w-full" />
          </el-form-item>
          <el-form-item label="Ingreso">
            <el-date-picker v-model="empleadoForm.fecha_ingreso" type="date" class="w-full" />
          </el-form-item>
          <div class="flex gap-2">
            <el-button type="success" @click="guardarEmpleado" :loading="guardando">
              {{ modoEdicion ? 'Actualizar empleado' : 'Crear empleado' }}
            </el-button>
            <el-button v-if="modoEdicion" @click="resetForm">Cancelar</el-button>
          </div>
        </el-form>
      </el-card>

      <el-card class="bg-slate-800 border-none" shadow="never">
        <template #header>
          <div class="text-white font-semibold">Listado de Empleados</div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="empleados" stripe border class="w-full">
            <el-table-column prop="id_empleado" label="ID" width="80" />
            <el-table-column prop="nombre" label="Nombre" />
            <el-table-column prop="apellido" label="Apellido" />
            <el-table-column prop="puesto" label="Puesto" width="160" />
            <el-table-column prop="salario" label="Salario" width="120" />
            <el-table-column label="Acciones" width="220">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="editarEmpleado(row)">
                  Actualizar
                </el-button>
                <el-button type="danger" text size="small" @click="eliminarEmpleado(row.id_empleado)">
                  Eliminar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
  </div>
</template>
