<template>
  <div class="comentarios-container">
    <h3>Comentarios del Ticket</h3>
    
    <el-skeleton :loading="loading" animated>
      <template #default>
        <div class="comentarios-list">
          <div v-if="comentarios.length === 0" class="sin-datos">
            No hay comentarios aún
          </div>
          
          <div v-for="comentario in comentarios" :key="comentario.id_comentario" class="comentario-item">
            <div class="comentario-header">
              <strong>{{ comentario.usuario_nombre }}</strong>
              <span class="fecha">{{ formatDate(comentario.fecha) }}</span>
            </div>
            <p class="comentario-texto">{{ comentario.comentario }}</p>
          </div>
        </div>

        <div class="nuevo-comentario">
          <el-input
            v-model="nuevoComentario"
            type="textarea"
            :rows="3"
            placeholder="Escribe un comentario..."
            @keydown.ctrl.enter="agregarComentario"
          />
          <el-button type="primary" @click="agregarComentario" :loading="cargando">
            Agregar Comentario
          </el-button>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  idTicket: {
    type: Number,
    required: true
  },
  idUsuario: {
    type: Number,
    required: true
  }
})

const API_URL = window.API_URL || 'http://localhost:5000'
const loading = ref(false)
const cargando = ref(false)
const comentarios = ref([])
const nuevoComentario = ref('')

const cargarComentarios = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/api/soporte/tickets/${props.idTicket}/comentarios`)
    if (!response.ok) throw new Error('Error al cargar comentarios')
    comentarios.value = await response.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const agregarComentario = async () => {
  if (!nuevoComentario.value.trim()) {
    ElMessage.warning('El comentario no puede estar vacío')
    return
  }

  cargando.value = true
  try {
    const response = await fetch(
      `${API_URL}/api/soporte/tickets/${props.idTicket}/comentarios`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: props.idUsuario,
          comentario: nuevoComentario.value
        })
      }
    )
    if (!response.ok) throw new Error('Error al crear comentario')
    
    ElMessage.success('Comentario agregado')
    nuevoComentario.value = ''
    await cargarComentarios()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    cargando.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  cargarComentarios()
})
</script>

<style scoped>
.comentarios-container {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.comentarios-list {
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.comentario-item {
  background: white;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.comentario-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.fecha {
  color: #909399;
  font-size: 12px;
}

.comentario-texto {
  margin: 0;
  color: #606266;
  line-height: 1.5;
}

.sin-datos {
  text-align: center;
  color: #909399;
  padding: 20px;
}

.nuevo-comentario {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
