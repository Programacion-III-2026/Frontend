# ERP Frontend - Estructura Reorganizada

## Descripción de la Estructura

El frontend ha sido reorganizado siguiendo una estructura modular basada en los módulos del sistema ERP. Cada módulo está en su propia carpeta dentro de `src/components/modules/`.

## Estructura de Carpetas

```
src/
├── components/
│   ├── modules/
│   │   ├── Auth/
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── Dashboard/
│   │   │   └── Dashboard.vue
│   │   ├── Gestion/
│   │   │   ├── Usuarios.vue
│   │   │   ├── Clientes.vue
│   │   │   └── Proveedores.vue
│   │   ├── Soporte/
│   │   │   ├── Clientes.vue
│   │   │   ├── Tickets.vue
│   │   │   ├── SLAs.vue
│   │   │   ├── Roles.vue
│   │   │   └── Encuestas.vue
│   │   ├── RRHH/
│   │   │   ├── Empleados.vue
│   │   │   ├── Nomina.vue
│   │   │   ├── BeneficiosDeducciones.vue
│   │   │   └── Ausencias.vue
│   │   ├── Contabilidad/
│   │   │   └── Contabilidad.vue
│   │   ├── InventarioYActivos/
│   │   │   ├── Categorias.vue
│   │   │   ├── Productos.vue
│   │   │   ├── MovimientosInventario.vue
│   │   │   └── ActivosFijos.vue
│   │   └── Configuracion/
│   │       └── Configuracion.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
```

## Módulos y Componentes

### Auth (Autenticación)
- **Login.vue**: Página de inicio de sesión
- **Register.vue**: Página de registro de nuevos usuarios

### Dashboard
- **Dashboard.vue**: Panel principal del sistema

### Gestión
- **Usuarios.vue**: Gestión de usuarios del sistema
- **Clientes.vue**: Gestión de clientes
- **Proveedores.vue**: Gestión de proveedores

### Soporte
- **Clientes.vue**: Gestión de clientes de soporte
- **Tickets.vue**: Sistema de tickets de soporte
- **SLAs.vue**: Acuerdos de nivel de servicio
- **Roles.vue**: Gestión de roles
- **Encuestas.vue**: Encuestas de satisfacción

### RRHH (Recursos Humanos)
- **Empleados.vue**: Registro y gestión de empleados
- **Nomina.vue**: Gestión de planillas de pago
- **BeneficiosDeducciones.vue**: Beneficios y deducciones salariales
- **Ausencias.vue**: Registro de ausencias y vacaciones

### Contabilidad
- **Contabilidad.vue**: Cuentas, asientos y movimientos contables

### Inventario y Activos
- **Categorias.vue**: Categorías de productos
- **Productos.vue**: Catálogo de productos
- **MovimientosInventario.vue**: Movimientos de inventario
- **ActivosFijos.vue**: Gestión de activos fijos

### Configuración
- **Configuracion.vue**: Configuraciones del sistema

## Cómo Usar

### Importar un Componente
```javascript
import Dashboard from './components/modules/Dashboard/Dashboard.vue'
```

### Navegar entre Vistas
En el archivo `App.vue`, usa el sistema de vistas con `currentView`:

```javascript
const handleNavigate = (target) => {
  currentView.value = target
}
```

Los valores válidos para navegación son:
- `login` - Página de login
- `registrar` - Página de registro
- `dashboard` - Dashboard principal
- `usuarios` - Gestión de usuarios
- `clientes` - Gestión de clientes
- `proveedores` - Gestión de proveedores
- `soporte-clientes` - Clientes de soporte
- `soporte-tickets` - Tickets de soporte
- `slas` - SLAs
- `roles` - Roles
- `encuestas` - Encuestas
- `empleados` - Empleados
- `nomina` - Nómina
- `beneficios` - Beneficios y deducciones
- `ausencias` - Ausencias
- `contabilidad` - Contabilidad
- `categorias` - Categorías
- `productos` - Productos
- `movimientos` - Movimientos de inventario
- `activos` - Activos fijos
- `configuracion` - Configuración

## Mejoras de la Nueva Estructura

✅ **Mejor Organización**: Componentes agrupados por módulo funcional
✅ **Escalabilidad**: Fácil agregar nuevos módulos o componentes
✅ **Mantenibilidad**: Separación clara de responsabilidades
✅ **Reutilización**: Componentes independientes y reutilizables
✅ **Claridad**: Estructura intuitiva y fácil de navegar

## Próximos Pasos

1. Completar la funcionalidad de los componentes en desarrollo
2. Agregar validaciones y manejo de errores
3. Implementar sistema de notificaciones
4. Agregar autenticación y autorización
5. Implementar temas personalizables
