<template>
  <div class="adjuntos-container">
    <h3>Archivos Adjuntos</h3>
    
    <el-skeleton :loading="loading" animated>
      <template #default>
        <div class="adjuntos-list">
          <div v-if="adjuntos.length === 0" class="sin-datos">
            No hay adjuntos aún
          </div>
          
          <div v-for="adjunto in adjuntos" :key="adjunto.id_adjunto" class="adjunto-item">
            <div class="adjunto-info">
              <el-icon><DocumentCopy /></el-icon>
              <div>
                <p class="nombre">{{ adjunto.nombre_archivo }}</p>
                <span class="fecha">{{ formatDate(adjunto.fecha) }}</span>
              </div>
            </div>
            <el-button-group>
              <el-button type="primary" text size="small" @click="descargarArchivo(adjunto)">
                Descargar
              </el-button>
              <el-button type="danger" text size="small" @click="eliminarAdjunto(adjunto.id_adjunto)">
                Eliminar
              </el-button>
            </el-button-group>
          </div>
        </div>

        <div class="nuevo-adjunto">
          <el-upload
            :action="`${API_URL}/api/soporte/tickets/${idTicket}/adjuntos`"
            :auto-upload="false"
            ref="uploadRef"
            @change="handleFileChange"
          >
            <template #trigger>
              <el-button type="primary">Seleccionar Archivo</el-button>
            </template>
          </el-upload>
          <el-button @click="subirArchivo" :loading="subiendo">
            Subir Archivo
          </el-button>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

const props = defineProps({
  idTicket: {
    type: Number,
    required: true
  }
})

const API_URL = window.API_URL || 'http://localhost:5000'
const loading = ref(false)
const subiendo = ref(false)
const adjuntos = ref([])
const uploadRef = ref(null)
const archivoSeleccionado = ref(null)

const cargarAdjuntos = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/api/soporte/tickets/${props.idTicket}/adjuntos`)
    if (!response.ok) throw new Error('Error al cargar adjuntos')
    adjuntos.value = await response.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const handleFileChange = (file) => {
  archivoSeleccionado.value = file
}

const subirArchivo = async () => {
  if (!archivoSeleccionado.value) {
    ElMessage.warning('Selecciona un archivo primero')
    return
  }

  subiendo.value = true
  try {
    const formData = new FormData()
    formData.append('nombre_archivo', archivoSeleccionado.value.name)
    formData.append('ruta_archivo', archivoSeleccionado.value.name)

    const response = await fetch(
      `${API_URL}/api/soporte/tickets/${props.idTicket}/adjuntos`,
      {
        method: 'POST',
        body: formData
      }
    )
    if (!response.ok) throw new Error('Error al subir archivo')
    
    ElMessage.success('Archivo subido correctamente')
    archivoSeleccionado.value = null
    uploadRef.value.clearFiles()
    await cargarAdjuntos()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    subiendo.value = false
  }
}

const eliminarAdjunto = async (idAdjunto) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que deseas eliminar este adjunto?',
    'Confirmar',
    {
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        const response = await fetch(`${API_URL}/api/soporte/adjuntos/${idAdjunto}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Error al eliminar')
        
        ElMessage.success('Adjunto eliminado')
        await cargarAdjuntos()
      } catch (error) {
        ElMessage.error(error.message)
      }
    })
    .catch(() => {})
}

const descargarArchivo = (adjunto) => {
  ElMessage.info('Función de descarga en desarrollo')
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  cargarAdjuntos()
})
</script>

<style scoped>
.adjuntos-container {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.adjuntos-list {
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.adjunto-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 4px;
  border-left: 3px solid #67c23a;
}

.adjunto-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.nombre {
  margin: 0;
  font-weight: 500;
}

.fecha {
  display: block;
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
}

.sin-datos {
  text-align: center;
  color: #909399;
  padding: 20px;
}

.nuevo-adjunto {
  display: flex;
  gap: 10px;
}
</style>
