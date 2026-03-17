<template>
  <div class="encuestas-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Encuestas de Satisfacción</span>
          <el-button type="primary" @click="mostrarFormulario = true">
            Nueva Encuesta
          </el-button>
        </div>
      </template>

      <el-skeleton :loading="loading" animated>
        <template #default>
          <!-- Estadísticas -->
          <el-row :gutter="20" style="margin-bottom: 20px">
            <el-col :xs="24" :sm="12" :md="6">
              <el-statistic title="Total Encuestas" :value="encuestas.length" />
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-statistic title="Promedio Puntuación" :value="promedioEncuestas.toFixed(1)" suffix="/5" />
            </el-col>
          </el-row>

          <!-- Tabla -->
          <el-table :data="encuestas" style="width: 100%">
            <el-table-column prop="usuario_nombre" label="Usuario" width="180" />
            <el-table-column prop="apreciacion" label="Comentario" min-width="300" />
            <el-table-column prop="fecha" label="Fecha" width="180">
              <template #default="{ row }">
                {{ formatDate(row.fecha) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-skeleton>
    </el-card>

    <!-- Formulario -->
    <el-dialog v-model="mostrarFormulario" title="Nueva Encuesta de Satisfacción">
      <el-form :model="formulario" label-width="150px">
        <el-form-item label="Usuario">
          <el-select v-model="formulario.id_usuario" placeholder="Selecciona un usuario">
            <el-option
              v-for="user in usuarios"
              :key="user.id_usuario"
              :label="user.nombre"
              :value="user.id_usuario"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Puntuación">
          <el-rate v-model="puntuacion" :max="5" show-score allow-half />
        </el-form-item>
        
        <el-form-item label="Comentario">
          <el-input
            v-model="formulario.apreciacion"
            type="textarea"
            :rows="4"
            placeholder="Comparte tu opinión sobre nuestro servicio"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarFormulario = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarEncuesta" :loading="guardando">
          Enviar Encuesta
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'
const loading = ref(false)
const guardando = ref(false)
const mostrarFormulario = ref(false)
const encuestas = ref([])
const usuarios = ref([])
const puntuacion = ref(0)
const formulario = ref({
  id_usuario: '',
  apreciacion: ''
})

const promedioEncuestas = computed(() => {
  if (encuestas.value.length === 0) return 0
  // Aquí puedes adicionar lógica para extraer puntuación si la guardas
  return 4.5 // Placeholder
})

const cargarDatos = async () => {
  loading.value = true
  try {
    const [encuestasRes, usuariosRes] = await Promise.all([
      fetch(`${API_URL}/api/soporte/encuestas`),
      fetch(`${API_URL}/api/soporte/usuarios`)
    ])
    
    if (!encuestasRes.ok || !usuariosRes.ok) throw new Error('Error al cargar datos')
    
    encuestas.value = await encuestasRes.json()
    usuarios.value = await usuariosRes.json()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const guardarEncuesta = async () => {
  if (!formulario.value.id_usuario || !formulario.value.apreciacion.trim()) {
    ElMessage.warning('Completa todos los campos')
    return
  }

  guardando.value = true
  try {
    const response = await fetch(`${API_URL}/api/soporte/encuestas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: formulario.value.id_usuario,
        apreciacion: `Puntuación: ${puntuacion.value}/5 - ${formulario.value.apreciacion}`
      })
    })

    if (!response.ok) throw new Error('Error al guardar encuesta')
    
    ElMessage.success('Encuesta guardada correctamente')
    mostrarFormulario.value = false
    puntuacion.value = 0
    formulario.value = { id_usuario: '', apreciacion: '' }
    await cargarDatos()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.encuestas-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
