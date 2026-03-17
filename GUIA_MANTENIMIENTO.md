# 📋 Guía de Mantenimiento de la Estructura Modular

## ¿Cómo mantener la estructura consistente?

### 1️⃣ Estándar de Nombres

#### Carpetas de Módulos
- Usar **PascalCase** para nombres de carpetas
- Ejemplos: `Auth`, `Dashboard`, `Gestion`, `RRHH`, `InventarioYActivos`

#### Archivos de Componentes
- Usar **PascalCase** para nombres de archivos Vue
- Ejemplos: `Login.vue`, `Dashboard.vue`, `Usuarios.vue`

#### Variables y Funciones
- Usar **camelCase** para variables y funciones
- Ejemplos: `currentView`, `handleNavigate`, `cargarDatos()`

#### Constantes
- Usar **SCREAMING_SNAKE_CASE** para constantes
- Ejemplo: `const API_URL = window.API_URL || 'http://localhost:5000'`

---

## 2️⃣ Estructura de un Componente

### Plantilla Básica
```vue
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// Definir emits
const emit = defineEmits(['back-to-dashboard'])

// Variables reactivas
const API_URL = window.API_URL || 'http://localhost:5000'
const loading = ref(false)
const datos = ref([])

// Formularios reactivos
const formulario = reactive({
  campo1: '',
  campo2: ''
})

// Funciones
const cargarDatos = async () => {
  loading.value = true
  try {
    // Lógica
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const volver = () => emit('back-to-dashboard')

onMounted(() => {
  cargarDatos()
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Contenido -->
    </div>
  </div>
</template>

<style scoped>
/* Estilos del componente */
</style>
```

### Puntos Clave
✅ Usar `<script setup>` (Composition API)
✅ Importar `ElMessage` para notificaciones
✅ Definir `emit` para comunicación con padre
✅ Usar `ref()` para estado reactivo
✅ Usar `reactive()` para formularios
✅ Incluir manejo de errores `try/catch`
✅ Usar clases Tailwind CSS para estilos

---

## 3️⃣ Convenciones de Código

### Importaciones
```javascript
// 1. Importaciones de Vue
import { ref, reactive, onMounted } from 'vue'

// 2. Importaciones de Element Plus
import { ElMessage, ElMessageBox } from 'element-plus'

// 3. Componentes locales (si existen)
import MiComponente from '../MiComponente.vue'

// 4. Utilidades/helpers
import { miUtilidad } from '@/utils/helpers'
```

### Definición de Propiedades y Emits
```javascript
// Props
const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  datos: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['back-to-dashboard', 'guardar'])
```

### Variables Reactivas
```javascript
// Ref para valores primitivos
const loading = ref(false)
const nombre = ref('')
const edad = ref(0)

// Reactive para objetos
const usuario = reactive({
  nombre: '',
  email: '',
  edad: 0
})

// Computed para valores derivados
const nombreCompleto = computed(() => {
  return `${usuario.nombre} ${usuario.apellido}`
})
```

---

## 4️⃣ Comunicación Entre Componentes

### Flujo de Datos (Parent → Child)
```javascript
// Parent (App.vue)
<Dashboard :user="user" @navigate="handleNavigate" />

// Child (Dashboard.vue)
const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['navigate', 'logout'])
```

### Eventos (Child → Parent)
```javascript
// Child emite evento
const handleNavigate = (target) => {
  emit('navigate', target)
}

// Parent escucha evento
<Dashboard @navigate="handleNavigate" />

const handleNavigate = (target) => {
  currentView.value = target
}
```

---

## 5️⃣ Llamadas a API

### Patrón Estándar
```javascript
const API_URL = window.API_URL || 'http://localhost:5000'

const cargarDatos = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/api/modulo/endpoint`)
    if (!response.ok) {
      throw new Error('No se pudieron cargar los datos')
    }
    const data = await response.json()
    datos.value = data
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

const crear = async () => {
  try {
    const response = await fetch(`${API_URL}/api/modulo/endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario)
    })
    
    if (!response.ok) {
      throw new Error('No se pudo crear')
    }
    
    ElMessage.success('Creado exitosamente')
    await cargarDatos()
  } catch (error) {
    ElMessage.error(error.message)
  }
}
```

---

## 6️⃣ Estilos y CSS

### Usar Tailwind CSS
```html
<!-- ✅ Bien -->
<div class="min-h-screen bg-slate-900 text-white">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold">Título</h1>
  </div>
</div>

<!-- ❌ Evitar -->
<div style="height: 100vh; background-color: #0f172a;">
  <h1 style="font-size: 2rem; font-weight: bold;">Título</h1>
</div>
```

### Scoped Styles
```vue
<style scoped>
/* Los estilos solo aplican a este componente */
.mi-clase {
  color: white;
  background: #1e293b;
}
</style>
```

---

## 7️⃣ Agregar un Nuevo Componente

### Paso 1: Crear la Carpeta
```bash
mkdir -p src/components/modules/MiModulo
```

### Paso 2: Crear el Archivo Vue
```bash
touch src/components/modules/MiModulo/MiComponente.vue
```

### Paso 3: Implementar el Componente
Usar la plantilla básica (Ver sección 2️⃣)

### Paso 4: Importar en App.vue
```javascript
import MiComponente from './components/modules/MiModulo/MiComponente.vue'
```

### Paso 5: Agregar Ruta de Navegación
```javascript
<MiComponente
  v-if="currentView === 'mi-vista'"
  @back-to-dashboard="() => handleNavigate('dashboard')"
/>
```

### Paso 6: Actualizar Documentación
- Actualizar `COMPONENTES_INDICE.md`
- Actualizar `ESTRUCTURA_VISUAL.md`

---

## 8️⃣ Testing y Debugging

### Verificar Estructura
```bash
# Ver estructura de carpetas
tree src/components/modules/

# O en Windows
dir /s src\components\modules\
```

### Debugging en Navegador
1. Abrir DevTools (F12)
2. Ir a la pestaña de Vue (Vue DevTools)
3. Inspeccionar componentes activos
4. Ver props, emits y estado reactivo

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Component not found | Ruta incorrecta en import | Verificar ruta relativa |
| Event not emitted | Nombre del event incorrecto | Verificar nombre en `emit()` |
| API error | URL incorrecta | Verificar `API_URL` |
| Estilos no aplican | CSS sin `scoped` | Agregar `scoped` a style |

---

## 9️⃣ Checklist para Nuevo Componente

- [ ] Nombre en PascalCase
- [ ] Estructura completa (script, template, style)
- [ ] Emits definidos correctamente
- [ ] Error handling implementado
- [ ] Tailwind CSS para estilos
- [ ] Componentes de Element Plus utilizados
- [ ] Comentarios en código complejo
- [ ] Importado en App.vue
- [ ] Ruta de navegación agregada
- [ ] Documentación actualizada

---

## 🔟 Mejores Prácticas

### DO ✅
```javascript
// Usar computed para valores derivados
const usuariosActivos = computed(() => {
  return usuarios.value.filter(u => u.activo)
})

// Validar datos antes de enviar
const guardar = async () => {
  if (!formulario.nombre.trim()) {
    ElMessage.warning('El nombre es requerido')
    return
  }
  // Guardar...
}

// Usar loading state
const loading = ref(false)
loading.value = true
try {
  // Operación
} finally {
  loading.value = false
}
```

### DON'T ❌
```javascript
// No usar v-model con objetos complejos sin necesidad
v-model="usuario"

// No hacer llamadas API sin try/catch
fetch(url).then(res => res.json())

// No modificar estado sin validación
usuarios.value.push(new)

// No usar setTimeout excesivamente
setTimeout(() => { location.reload() }, 2000)
```

---

## 📞 Soporte

Para preguntas o problemas con la estructura:
1. Revisar esta guía
2. Consultar la documentación de Vue 3
3. Consultar la documentación de Element Plus
4. Contactar al equipo de desarrollo

---

**Versión**: 1.0
**Última actualización**: 4 de febrero de 2026
**Responsable**: Equipo de Desarrollo Frontend
