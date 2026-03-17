<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const tabActiva = ref('general')

const configGeneral = reactive({
  nombre_empresa: '',
  rfc_empresa: '',
  email_contacto: '',
  telefono_contacto: '',
  direccion_empresa: '',
  pais: 'México',
  moneda: 'MXN'
})

const configSistema = reactive({
  sesion_timeout: 30,
  respaldo_automatico: true,
  frecuencia_respaldo: 'diaria',
  notificaciones_email: true,
  modo_debug: false
})

const configUsuarios = reactive({
  requiere_2fa: false,
  politica_contrasenas: 'fuerte',
  dias_expiracion_contrasena: 90,
  intentos_fallidos_maximo: 5
})

const fetchConfiguracion = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/configuracion/general`)
    if (!res.ok) throw new Error('No se pudo cargar configuración')
    const data = await res.json()
    Object.assign(configGeneral, data)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const guardarConfigGeneral = async () => {
  try {
    const response = await fetch(`${API_URL}/api/configuracion/general`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configGeneral)
    })

    if (!response.ok) throw new Error('Error al guardar configuración')

    ElMessage.success('Configuración general guardada')
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const guardarConfigSistema = async () => {
  try {
    const response = await fetch(`${API_URL}/api/configuracion/sistema`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configSistema)
    })

    if (!response.ok) throw new Error('Error al guardar configuración')

    ElMessage.success('Configuración del sistema guardada')
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const guardarConfigUsuarios = async () => {
  try {
    const response = await fetch(`${API_URL}/api/configuracion/usuarios`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configUsuarios)
    })

    if (!response.ok) throw new Error('Error al guardar configuración')

    ElMessage.success('Configuración de usuarios guardada')
  } catch (error) {
    ElMessage.error(error.message)
  }
}

onMounted(fetchConfiguracion)
</script>

<template>
  <div>
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Configuración del Sistema</h2>
          <p class="text-gray-600">Parámetros generales de la aplicación</p>
        </div>
      </div>

      <el-tabs v-model="tabActiva">
        <el-tab-pane label="Empresa" name="general">
          <el-card class="bg-white rounded-lg shadow mt-4" shadow="never">
            <el-form label-width="180px">
              <el-form-item label="Nombre de Empresa">
                <el-input v-model="configGeneral.nombre_empresa" placeholder="Nombre de la empresa" />
              </el-form-item>
              <el-form-item label="RFC">
                <el-input v-model="configGeneral.rfc_empresa" placeholder="RFC de la empresa" />
              </el-form-item>
              <el-form-item label="Email Contacto">
                <el-input v-model="configGeneral.email_contacto" placeholder="contacto@empresa.com" />
              </el-form-item>
              <el-form-item label="Teléfono Contacto">
                <el-input v-model="configGeneral.telefono_contacto" placeholder="555-1234" />
              </el-form-item>
              <el-form-item label="Dirección">
                <el-input v-model="configGeneral.direccion_empresa" type="textarea" placeholder="Dirección de la empresa" />
              </el-form-item>
              <el-form-item label="País">
                <el-select v-model="configGeneral.pais">
                  <el-option label="México" value="México" />
                  <el-option label="España" value="España" />
                  <el-option label="Argentina" value="Argentina" />
                  <el-option label="Colombia" value="Colombia" />
                </el-select>
              </el-form-item>
              <el-form-item label="Moneda">
                <el-select v-model="configGeneral.moneda">
                  <el-option label="MXN - Peso Mexicano" value="MXN" />
                  <el-option label="USD - Dólar Estadounidense" value="USD" />
                  <el-option label="EUR - Euro" value="EUR" />
                </el-select>
              </el-form-item>
              <el-button type="primary" @click="guardarConfigGeneral">Guardar Cambios</el-button>
            </el-form>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="Sistema" name="sistema">
          <el-card class="bg-white rounded-lg shadow mt-4" shadow="never">
            <el-form label-width="200px">
              <el-form-item label="Tiempo de Sesión (minutos)">
                <el-input v-model.number="configSistema.sesion_timeout" type="number" />
              </el-form-item>
              <el-form-item label="Respaldo Automático">
                <el-switch v-model="configSistema.respaldo_automatico" />
              </el-form-item>
              <el-form-item label="Frecuencia de Respaldo">
                <el-select v-model="configSistema.frecuencia_respaldo">
                  <el-option label="Cada hora" value="horaria" />
                  <el-option label="Diaria" value="diaria" />
                  <el-option label="Semanal" value="semanal" />
                </el-select>
              </el-form-item>
              <el-form-item label="Notificaciones por Email">
                <el-switch v-model="configSistema.notificaciones_email" />
              </el-form-item>
              <el-form-item label="Modo Debug">
                <el-switch v-model="configSistema.modo_debug" />
              </el-form-item>
              <el-button type="primary" @click="guardarConfigSistema">Guardar Cambios</el-button>
            </el-form>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="Usuarios" name="usuarios">
          <el-card class="bg-white rounded-lg shadow mt-4" shadow="never">
            <el-form label-width="200px">
              <el-form-item label="Autenticación de Dos Factores">
                <el-switch v-model="configUsuarios.requiere_2fa" />
              </el-form-item>
              <el-form-item label="Política de Contraseña">
                <el-select v-model="configUsuarios.politica_contrasenas">
                  <el-option label="Débil" value="debil" />
                  <el-option label="Normal" value="normal" />
                  <el-option label="Fuerte" value="fuerte" />
                </el-select>
              </el-form-item>
              <el-form-item label="Días para Expiración de Contraseña">
                <el-input v-model.number="configUsuarios.dias_expiracion_contrasena" type="number" />
              </el-form-item>
              <el-form-item label="Intentos Fallidos Máximos">
                <el-input v-model.number="configUsuarios.intentos_fallidos_maximo" type="number" />
              </el-form-item>
              <el-button type="primary" @click="guardarConfigUsuarios">Guardar Cambios</el-button>
            </el-form>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
