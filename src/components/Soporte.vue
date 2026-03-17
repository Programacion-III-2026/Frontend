<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import ComentariosTickets from './ComentariosTickets.vue'
import AdjuntosTickets from './AdjuntosTickets.vue'
import SLAs from './SLAs.vue'
import Roles from './Roles.vue'
import Encuestas from './Encuestas.vue'

const emit = defineEmits(['back-to-dashboard'])

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const clientes = ref([])
const tickets = ref([])

const clienteForm = reactive({
  nombre: '',
  telefono: '',
  email: '',
  direccion: ''
})

const ticketForm = reactive({
  titulo: '',
  descripcion: '',
  id_cliente: '',
  id_tecnico: '',
  id_subcategoria: '',
  id_estado: ''
})

const fetchAll = async () => {
  loading.value = true
  try {
    const [clientesRes, ticketsRes] = await Promise.all([
      fetch(`${API_URL}/api/soporte/clientes`),
      fetch(`${API_URL}/api/soporte/tickets`)
    ])

    if (!clientesRes.ok || !ticketsRes.ok) {
      throw new Error('No se pudieron cargar los datos de soporte')
    }

    clientes.value = await clientesRes.json()
    tickets.value = await ticketsRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const crearCliente = async () => {
  try {
    const response = await fetch(`${API_URL}/api/soporte/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteForm)
    })

    if (!response.ok) {
      throw new Error('No se pudo crear el cliente')
    }

    ElMessage.success('Cliente creado')
    clienteForm.nombre = ''
    clienteForm.telefono = ''
    clienteForm.email = ''
    clienteForm.direccion = ''
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const crearTicket = async () => {
  try {
    const payload = {
      titulo: ticketForm.titulo,
      descripcion: ticketForm.descripcion,
      id_cliente: Number(ticketForm.id_cliente),
      id_tecnico: Number(ticketForm.id_tecnico),
      id_subcategoria: Number(ticketForm.id_subcategoria),
      id_estado: Number(ticketForm.id_estado)
    }

    const response = await fetch(`${API_URL}/api/soporte/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('No se pudo crear el ticket')
    }

    ElMessage.success('Ticket creado')
    ticketForm.titulo = ''
    ticketForm.descripcion = ''
    ticketForm.id_cliente = ''
    ticketForm.id_tecnico = ''
    ticketForm.id_subcategoria = ''
    ticketForm.id_estado = ''
    await fetchAll()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const volver = () => emit('back-to-dashboard')

onMounted(fetchAll)
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Soporte</h1>
          <p class="text-slate-300">Clientes y tickets</p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="fetchAll" :loading="loading">Refrescar</el-button>
          <el-button type="info" plain @click="volver">Volver</el-button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Clientes</div>
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
            <el-button type="success" @click="crearCliente">Crear cliente</el-button>
          </el-form>
          <div class="overflow-x-auto">
            <el-table :data="clientes" stripe border class="w-full" height="280">
              <el-table-column prop="id_cliente" label="ID" width="80" />
              <el-table-column prop="nombre" label="Nombre" />
              <el-table-column prop="telefono" label="Teléfono" width="140" />
              <el-table-column prop="email" label="Email" />
            </el-table>
          </div>
        </el-card>

        <el-card class="bg-slate-800 border-none" shadow="never">
          <template #header>
            <div class="text-white font-semibold">Tickets</div>
          </template>
          <el-form label-width="120px" class="mb-4">
            <el-form-item label="Título">
              <el-input v-model="ticketForm.titulo" placeholder="Sistema no responde" />
            </el-form-item>
            <el-form-item label="Descripción">
              <el-input v-model="ticketForm.descripcion" placeholder="El sistema está lento" />
            </el-form-item>
            <el-form-item label="Cliente">
              <el-input v-model="ticketForm.id_cliente" placeholder="ID cliente" />
            </el-form-item>
            <el-form-item label="Técnico">
              <el-input v-model="ticketForm.id_tecnico" placeholder="ID técnico" />
            </el-form-item>
            <el-form-item label="Subcategoría">
              <el-input v-model="ticketForm.id_subcategoria" placeholder="ID subcategoría" />
            </el-form-item>
            <el-form-item label="Estado">
              <el-input v-model="ticketForm.id_estado" placeholder="ID estado" />
            </el-form-item>
            <el-button type="success" @click="crearTicket">Crear ticket</el-button>
          </el-form>
          <div class="overflow-x-auto">
            <el-table :data="tickets" stripe border class="w-full" height="280">
              <el-table-column prop="id_ticket" label="ID" width="80" />
              <el-table-column prop="titulo" label="Título" />
              <el-table-column prop="cliente_nombre" label="Cliente" width="160" />
              <el-table-column prop="estado_nombre" label="Estado" width="140" />
            </el-table>
          </div>
        </el-card>

        <el-divider />
        <SLAs />
        <el-divider />
        <Roles />
        <el-divider />
        <Encuestas />
      </div>
    </div>
  </div>
</template>
