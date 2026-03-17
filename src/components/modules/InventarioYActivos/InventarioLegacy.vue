<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Inventario (Legacy)</h2>
      <p class="text-gray-600">Sistema de inventario anterior</p>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <el-alert
        title="Sistema Legacy"
        type="info"
        description="Este es el sistema de inventario anterior. Se mantiene por compatibilidad. Se recomienda usar el sistema nuevo de Inventario y Activos."
        show-icon
        :closable="false"
      />

      <div class="mt-6">
        <el-empty description="Sin datos disponibles" />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
