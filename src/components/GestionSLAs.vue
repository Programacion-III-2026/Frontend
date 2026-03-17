<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
    <el-button @click="$emit('back-to-dashboard')" class="mb-4">← Volver al Dashboard</el-button>
    <SLAs />
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import SLAs from './SLAs.vue'

defineEmits(['back-to-dashboard'])
</script>
