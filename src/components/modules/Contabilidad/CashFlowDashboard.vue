<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const API_URL = window.API_URL || 'http://localhost:5000'

const loading = ref(false)
const data = reactive({
  periodo: { mes: new Date().getMonth() + 1, anio: new Date().getFullYear() },
  cuentas_por_cobrar: 0,
  cuentas_por_pagar: 0,
  nomina_mes: 0,
  liquidez_proyectada: 0
})

const filtros = reactive({
  mes: new Date().getMonth() + 1,
  anio: new Date().getFullYear()
})

const cargarCashflow = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({ mes: String(filtros.mes), anio: String(filtros.anio) })
    const response = await fetch(`${API_URL}/api/integracion/cashflow/proyeccion?${params.toString()}`)
    if (!response.ok) throw new Error('No se pudo cargar cash flow')

    const payload = await response.json()
    data.periodo = payload.periodo || { mes: filtros.mes, anio: filtros.anio }
    data.cuentas_por_cobrar = Number(payload.cuentas_por_cobrar || 0)
    data.cuentas_por_pagar = Number(payload.cuentas_por_pagar || 0)
    data.nomina_mes = Number(payload.nomina_mes || 0)
    data.liquidez_proyectada = Number(payload.liquidez_proyectada || 0)
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

onMounted(cargarCashflow)
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">Dashboard de Cash Flow</span>
          <div class="flex gap-2">
            <el-input-number v-model="filtros.mes" :min="1" :max="12" size="small" />
            <el-input-number v-model="filtros.anio" :min="2020" :max="2100" size="small" />
            <el-button type="primary" size="small" :loading="loading" @click="cargarCashflow">Actualizar</el-button>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <el-statistic title="Cuentas por Cobrar" :value="data.cuentas_por_cobrar" prefix="L " :precision="2" />
        <el-statistic title="Cuentas por Pagar" :value="data.cuentas_por_pagar" prefix="L " :precision="2" />
        <el-statistic title="Nómina del Mes" :value="data.nomina_mes" prefix="L " :precision="2" />
        <el-statistic title="Liquidez Proyectada" :value="data.liquidez_proyectada" prefix="L " :precision="2" />
      </div>

      <div class="mt-4 text-sm text-gray-600">
        Período consultado: {{ data.periodo.mes }}/{{ data.periodo.anio }}
      </div>
    </el-card>
  </div>
</template>
