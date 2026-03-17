<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
    <el-button @click="$emit('back-to-dashboard')" class="mb-4">← Volver al Dashboard</el-button>
    <Ausencias />
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import Ausencias from './Ausencias.vue'

defineEmits(['back-to-dashboard'])
</script>
