# 📊 ERP Frontend - Estructura Modular Reorganizada

## Menú de Navegación del Sistema

```
ERP (Sistema Principal)
│
├─ 🏠 Inicio
│   └─ Dashboard.vue
│
├─ ⚙️ Gestión
│   ├─ 👥 Usuarios → Usuarios.vue
│   ├─ 🏢 Clientes → Clientes.vue
│   └─ 📦 Proveedores → Proveedores.vue
│
├─ 🎧 Soporte
│   ├─ 🏢 Clientes → Clientes.vue
│   ├─ 🎫 Tickets → Tickets.vue
│   ├─ ⏱️ SLAs → SLAs.vue
│   ├─ 👔 Roles → Roles.vue
│   └─ 📋 Encuestas → Encuestas.vue
│
├─ 👨‍💼 RRHH
│   ├─ 👤 Empleados → Empleados.vue
│   ├─ 📄 Nómina → Nomina.vue
│   ├─ 💰 Beneficios y Deducciones → BeneficiosDeducciones.vue
│   └─ 📅 Ausencias → Ausencias.vue
│
├─ 💼 Contabilidad
│   └─ 📊 Contabilidad → Contabilidad.vue
│       ├─ Cuentas contables
│       ├─ Asientos contables
│       ├─ Movimientos
│       └─ Balance
│
├─ 📦 Inventario y Activos
│   ├─ 🏷️ Categorías → Categorias.vue
│   ├─ 📚 Productos → Productos.vue
│   ├─ 📈 Movimientos Inventario → MovimientosInventario.vue
│   ├─ 📊 Inventario (Legacy)
│   └─ 🏢 Activos Fijos → ActivosFijos.vue
│
└─ ⚙️ Configuración
    └─ Configuracion.vue
```

## 📁 Estructura de Archivos

```
Frontend/src/
│
├── components/
│   │
│   └── modules/
│       │
│       ├── Auth/
│       │   ├── Login.vue
│       │   └── Register.vue
│       │
│       ├── Dashboard/
│       │   └── Dashboard.vue
│       │
│       ├── Gestion/
│       │   ├── Usuarios.vue
│       │   ├── Clientes.vue
│       │   └── Proveedores.vue
│       │
│       ├── Soporte/
│       │   ├── Clientes.vue
│       │   ├── Tickets.vue
│       │   ├── SLAs.vue
│       │   ├── Roles.vue
│       │   └── Encuestas.vue
│       │
│       ├── RRHH/
│       │   ├── Empleados.vue
│       │   ├── Nomina.vue
│       │   ├── BeneficiosDeducciones.vue
│       │   └── Ausencias.vue
│       │
│       ├── Contabilidad/
│       │   └── Contabilidad.vue
│       │
│       ├── InventarioYActivos/
│       │   ├── Categorias.vue
│       │   ├── Productos.vue
│       │   ├── MovimientosInventario.vue
│       │   └── ActivosFijos.vue
│       │
│       └── Configuracion/
│           └── Configuracion.vue
│
├── App.vue (Componente raíz con navegación)
├── main.js
└── style.css
```

## 🎯 Características de la Nueva Estructura

### ✅ Ventajas

1. **Modularidad Clara**: Cada módulo en su propia carpeta
2. **Escalabilidad**: Fácil agregar nuevos módulos
3. **Mantenibilidad**: Código organizado por funcionalidad
4. **Reutilización**: Componentes independientes
5. **Claridad**: Estructura jerárquica intuitiva

### 🔄 Rutas de Navegación

| Vista | Componente | Ruta |
|-------|-----------|------|
| Login | Login.vue | modules/Auth/Login.vue |
| Registro | Register.vue | modules/Auth/Register.vue |
| Dashboard | Dashboard.vue | modules/Dashboard/Dashboard.vue |
| Usuarios | Usuarios.vue | modules/Gestion/Usuarios.vue |
| Clientes (Gestión) | Clientes.vue | modules/Gestion/Clientes.vue |
| Proveedores | Proveedores.vue | modules/Gestion/Proveedores.vue |
| Soporte Clientes | Clientes.vue | modules/Soporte/Clientes.vue |
| Tickets | Tickets.vue | modules/Soporte/Tickets.vue |
| SLAs | SLAs.vue | modules/Soporte/SLAs.vue |
| Roles | Roles.vue | modules/Soporte/Roles.vue |
| Encuestas | Encuestas.vue | modules/Soporte/Encuestas.vue |
| Empleados | Empleados.vue | modules/RRHH/Empleados.vue |
| Nómina | Nomina.vue | modules/RRHH/Nomina.vue |
| Beneficios | BeneficiosDeducciones.vue | modules/RRHH/BeneficiosDeducciones.vue |
| Ausencias | Ausencias.vue | modules/RRHH/Ausencias.vue |
| Contabilidad | Contabilidad.vue | modules/Contabilidad/Contabilidad.vue |
| Categorías | Categorias.vue | modules/InventarioYActivos/Categorias.vue |
| Productos | Productos.vue | modules/InventarioYActivos/Productos.vue |
| Movimientos | MovimientosInventario.vue | modules/InventarioYActivos/MovimientosInventario.vue |
| Activos Fijos | ActivosFijos.vue | modules/InventarioYActivos/ActivosFijos.vue |
| Configuración | Configuracion.vue | modules/Configuracion/Configuracion.vue |

## 🚀 Cómo Usar

### Ejecutar la Aplicación
```bash
cd Frontend
npm install
npm run dev
```

### Agregar un Nuevo Módulo
1. Crear carpeta en `src/components/modules/NombreModulo/`
2. Crear componentes Vue necesarios
3. Importar en `App.vue`
4. Agregar ruta de navegación en `handleNavigate()`

### Importar un Componente en App.vue
```javascript
import MiComponente from './components/modules/MiModulo/MiComponente.vue'
```

## 📝 Notas Importantes

- Todos los componentes usan **Composition API** (script setup)
- Los componentes emiten eventos `back-to-dashboard` para volver al dashboard
- Se utiliza **Element Plus** para componentes UI
- El sistema de navegación es basado en vistas (sin router tradicional)
- Cada módulo es independiente y reutilizable

## 🔗 Referencias

- **Element Plus**: https://element-plus.org/
- **Vue 3**: https://vuejs.org/
- **Tailwind CSS**: https://tailwindcss.com/

## 📧 Contacto

Para preguntas o sugerencias sobre la estructura, contactar al equipo de desarrollo.
