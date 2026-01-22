<script setup>
import Registrar from './components/registrar.vue'
</script>

<template>
  <Registrar />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-attachment: fixed;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #a1c4fd 50%, #c2e9fb 75%, #fbc2eb 100%);

}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
