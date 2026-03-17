# 🚀 ERP Frontend - Vue 3 + Vite + Element Plus + Tailwind CSS

## Descripción
Frontend para el sistema ERP desarrollado con Vue 3, Vite, Element Plus y Tailwind CSS.

---

## 📦 Dependencias Instaladas

### Core
- **Vue 3** ^3.5.24 - Framework JavaScript progresivo
- **Vite** ^7.2.4 - Build tool rápido
- **@vitejs/plugin-vue** ^6.0.1 - Plugin de Vite para Vue

### UI Framework
- **Element Plus** ^2.13.1 - Librería de componentes para Vue 3

### CSS
- **Tailwind CSS** ^4.1.18 - Framework CSS utility-first
- **PostCSS** ^8.5.6 - Herramienta de transformación CSS
- **@tailwindcss/postcss** ^4.1.18 - Plugin de PostCSS para Tailwind
- **Autoprefixer** - Añade prefijos CSS automáticamente

---

## 🛠️ Configuración

### Archivos de Configuración

#### `tailwind.config.js`
Configuración de Tailwind CSS con:
- Contenido customizado para archivos `.vue`, `.js`, `.ts`, etc.
- Colores custom que coinciden con Element Plus
- `preflight: false` para evitar conflictos con Element Plus

#### `postcss.config.js`
Configuración de PostCSS para procesar Tailwind y autoprefixer

#### `vite.config.js`
Configuración de Vite con plugin de Vue ya incluido

#### `src/style.css`
Incluye las directivas principales de Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### `src/main.js`
Importa y configura Element Plus en la aplicación Vue

---

## 📚 Estructura del Proyecto

```
Frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes Vue reutilizables
│   │   ├── Dashboard.vue    # Ejemplo con Element Plus + Tailwind
│   │   ├── Login.vue
│   │   ├── registrar.vue
│   │   └── HelloWorld.vue
│   ├── assets/          # Recursos (imágenes, fuentes, etc.)
│   ├── App.vue          # Componente raíz
│   ├── main.js          # Punto de entrada
│   └── style.css        # Estilos globales
├── index.html           # HTML principal
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
├── postcss.config.js    # Configuración de PostCSS
├── package.json         # Dependencias del proyecto
└── README.md            # Este archivo
```

---

## 🚀 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar la compilación
npm run preview

# Instalar dependencias
npm install
```

---

## 💡 Guía de Uso

### Usando Element Plus

```vue
<template>
  <!-- Botones -->
  <el-button type="primary">Botón Primario</el-button>
  <el-button type="success">Botón Éxito</el-button>
  
  <!-- Inputs -->
  <el-input v-model="text" placeholder="Texto"></el-input>
  
  <!-- Select -->
  <el-select v-model="selected">
    <el-option label="Opción 1" value="1"></el-option>
  </el-select>
  
  <!-- Mensaje -->
  <el-button @click="showMessage">Mostrar Mensaje</el-button>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const showMessage = () => {
  ElMessage.success('¡Éxito!')
}
</script>
```

### Usando Tailwind CSS

```vue
<template>
  <!-- Grid responsivo -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="bg-blue-500 text-white p-4 rounded-lg">
      Contenido
    </div>
  </div>
  
  <!-- Flexbox -->
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold">Título</h1>
  </div>
</template>
```

### Combinando Ambas Librerías

```vue
<template>
  <div class="max-w-4xl mx-auto p-6">
    <el-card class="rounded-lg shadow-md">
      <template #header>
        <h2 class="text-xl font-bold text-gray-800">Formulario</h2>
      </template>
      
      <el-form :model="form">
        <el-form-item label="Nombre" class="mb-4">
          <el-input v-model="form.nombre"></el-input>
        </el-form-item>
        
        <div class="flex gap-2">
          <el-button type="primary">Guardar</el-button>
          <el-button>Cancelar</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
```

---

## 📖 Recursos Útiles

- [Documentación de Vue 3](https://vuejs.org/)
- [Documentación de Vite](https://vite.dev/)
- [Documentación de Element Plus](https://element-plus.org/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Componente Dashboard.vue](./src/components/Dashboard.vue) - Ejemplo completo

---

## 🎨 Colores Personalizados

Los colores en `tailwind.config.js` están configurados para coincidir con Element Plus:

- **primary**: #409EFF (Azul)
- **success**: #67C23A (Verde)
- **warning**: #E6A23C (Amarillo)
- **danger**: #F56C6C (Rojo)
- **info**: #909399 (Gris)

Puedes usarlos así:
```html
<div class="bg-primary text-white">Contenido con color primario</div>
```

---

## 🔗 API Backend

La URL del API backend está configurada en `src/main.js`:

```javascript
window.API_URL = "http://10.108.110.121:8000"
```

Cámbiala según tu configuración.

---

## 📝 Notas

- Element Plus y Tailwind CSS funcionan perfectamente juntos
- Se ha deshabilitado `preflight` en Tailwind para evitar conflictos
- Todos los componentes usan `<script setup>` (composición de Vue 3)
- Es recomendable revisar la documentación de [Dashboard.vue](./src/components/Dashboard.vue) para ver ejemplos prácticos

---

## 🐛 Troubleshooting

Si los estilos de Tailwind no se aplican:
1. Reinicia el servidor de desarrollo: `npm run dev`
2. Limpia el caché: Elimina carpeta `node_modules` y `.vite`
3. Reinstala dependencias: `npm install`

Si hay conflictos entre Element Plus y Tailwind:
- `preflight: false` en `tailwind.config.js` debería resolver la mayoría de problemas

---

**Última actualización:** 3 de febrero de 2026
