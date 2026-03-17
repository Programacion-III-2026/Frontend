<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const guardando = ref(false)
const modoEdicion = ref(false)
const clienteEditandoId = ref(null)
const clientes = ref([])

const clienteForm = reactive({
  nombre: '',
  telefono: '',
  email: '',
  direccion: '',
  tipo_cliente: 'estandar'
})

const fetchAll = async () => {
  loading.value = true
  try {
    const clientesRes = await fetch(`${API_URL}/api/soporte/clientes`)

    if (!clientesRes.ok) {
      throw new Error('No se pudieron cargar los datos de soporte')
    }

    clientes.value = await clientesRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  clienteForm.nombre = ''
  clienteForm.telefono = ''
  clienteForm.email = ''
  clienteForm.direccion = ''
  clienteForm.tipo_cliente = 'estandar'
  clienteEditandoId.value = null
  modoEdicion.value = false
}

const guardarCliente = async () => {
  guardando.value = true
  try {
    const url = modoEdicion.value
      ? `${API_URL}/api/soporte/clientes/${clienteEditandoId.value}`
      : `${API_URL}/api/soporte/clientes`

    const method = modoEdicion.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteForm)
    })

    if (!response.ok) {
      throw new Error(modoEdicion.value ? 'No se pudo actualizar el cliente' : 'No se pudo crear el cliente')
    }

    ElMessage.success(modoEdicion.value ? 'Cliente actualizado' : 'Cliente creado')
    resetForm()
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

const editarCliente = (cliente) => {
  modoEdicion.value = true
  clienteEditandoId.value = cliente.id_cliente
  clienteForm.nombre = cliente.nombre || ''
  clienteForm.telefono = cliente.telefono || ''
  clienteForm.email = cliente.email || ''
  clienteForm.direccion = cliente.direccion || ''
  clienteForm.tipo_cliente = cliente.tipo_cliente || 'estandar'
}

const eliminarCliente = async (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que deseas eliminar este cliente?',
    'Confirmar eliminación',
    { confirmButtonText: 'Sí', cancelButtonText: 'No', type: 'warning' }
  )
    .then(async () => {
      try {
        const response = await fetch(`${API_URL}/api/soporte/clientes/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('No se pudo eliminar el cliente')
        }

        ElMessage.success('Cliente eliminado')
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
    <div class="space-y-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Clientes</h2>
          <p class="text-gray-600">Gestión de clientes de soporte</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
        </div>
      </div>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="font-semibold">{{ modoEdicion ? 'Actualizar Cliente' : 'Crear Nuevo Cliente' }}</div>
        </template>
        <el-form label-width="120px" class="mb-4">
          <el-form-item label="Nombre">
            <el-input v-model="clienteForm.nombre" placeholder="Empresa ABC" />
          </el-form-item>
          <el-form-item label="Teléfono">
            <el-input v-model="clienteForm.telefono" placeholder="555-1234" />
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="clienteForm.email" placeholder="contacto@empresa.com" />
          </el-form-item>
          <el-form-item label="Dirección">
            <el-input v-model="clienteForm.direccion" placeholder="Calle Principal 123" />
          </el-form-item>
          <el-form-item label="Tipo Cliente">
            <el-select v-model="clienteForm.tipo_cliente" class="w-full">
              <el-option label="Estándar" value="estandar" />
              <el-option label="VIP" value="vip" />
            </el-select>
          </el-form-item>
          <div class="flex gap-2">
            <el-button type="success" @click="guardarCliente" :loading="guardando">
              {{ modoEdicion ? 'Actualizar cliente' : 'Crear cliente' }}
            </el-button>
            <el-button v-if="modoEdicion" @click="resetForm">Cancelar</el-button>
          </div>
        </el-form>
      </el-card>

      <el-card class="bg-white rounded-lg shadow" shadow="never">
        <template #header>
          <div class="font-semibold">Listado de Clientes</div>
        </template>
        <div class="overflow-x-auto">
          <el-table :data="clientes" stripe border class="w-full">
            <el-table-column prop="id_cliente" label="ID" width="80" />
            <el-table-column prop="nombre" label="Nombre" />
            <el-table-column prop="telefono" label="Teléfono" width="140" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="direccion" label="Dirección" width="200" />
            <el-table-column label="Tipo" width="130">
              <template #default="{ row }">
                <el-tag :type="(row.tipo_cliente || 'estandar') === 'vip' ? 'danger' : 'info'">
                  {{ (row.tipo_cliente || 'estandar') === 'vip' ? 'VIP' : 'Estándar' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Acciones" width="200">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="editarCliente(row)">
                  Actualizar
                </el-button>
                <el-button type="danger" text size="small" @click="eliminarCliente(row.id_cliente)">
                  Eliminar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
