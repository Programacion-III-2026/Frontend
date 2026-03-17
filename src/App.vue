<script setup>
import { onMounted, ref, watch } from 'vue'
import { language, setLanguage, t as translateText } from './i18n/runtimeTranslator'

// Layout
import MainLayout from './components/Layout/MainLayout.vue'

// Auth Components
import Login from './components/modules/Auth/Login.vue'
import Register from './components/modules/Auth/Register.vue'

// Dashboard
import Dashboard from './components/modules/Dashboard/Dashboard.vue'

// Gestion
import Usuarios from './components/modules/Gestion/Usuarios.vue'

// Soporte
import SoporteClientes from './components/modules/Soporte/Clientes.vue'
import Tickets from './components/modules/Soporte/Tickets.vue'
import SLAs from './components/modules/Soporte/SLAs.vue'
import Roles from './components/modules/Soporte/Roles.vue'
import Encuestas from './components/modules/Soporte/Encuestas.vue'
import OrdenesTrabajo from './components/modules/Soporte/OrdenesTrabajo.vue'

// RRHH
import Empleados from './components/modules/RRHH/Empleados.vue'
import Nomina from './components/modules/RRHH/Nomina.vue'
import BeneficiosDeducciones from './components/modules/RRHH/BeneficiosDeducciones.vue'
import Ausencias from './components/modules/RRHH/Ausencias.vue'

// Inventario
import ItemMaster from './components/modules/InventarioYActivos/ItemMaster.vue'
import EntradaMercancia from './components/modules/InventarioYActivos/EntradaMercancia.vue'

// Contabilidad
import Contabilidad from './components/modules/Contabilidad/Contabilidad.vue'
import CashFlowDashboard from './components/modules/Contabilidad/CashFlowDashboard.vue'

// Configuracion
import Configuracion from './components/modules/Configuracion/Configuracion.vue'

const currentView = ref('login')
const user = ref(null)
const showAccessAnimation = ref(false)

const viewTitles = {
  es: {
    login: 'Login',
    registrar: 'Registro',
    dashboard: 'Dashboard',
    usuarios: 'Usuarios',
    'soporte-tickets': 'Tickets de Soporte',
    'soporte-clientes': 'Clientes',
    'ordenes-trabajo': 'Órdenes de Trabajo',
    slas: 'SLAs',
    roles: 'Roles',
    encuestas: 'Encuestas',
    empleados: 'Empleados',
    nomina: 'Nómina',
    beneficios: 'Beneficios y Deducciones',
    ausencias: 'Ausencias',
    'inventario-item-master': 'Item Master',
    'inventario-entrada-mercancia': 'Entrada de Mercancía',
    contabilidad: 'Contabilidad',
    'contabilidad-cashflow': 'Cash Flow',
    configuracion: 'Configuración'
  },
  en: {
    login: 'Login',
    registrar: 'Register',
    dashboard: 'Dashboard',
    usuarios: 'Users',
    'soporte-tickets': 'Support Tickets',
    'soporte-clientes': 'Clients',
    'ordenes-trabajo': 'Work Orders',
    slas: 'SLAs',
    roles: 'Roles',
    encuestas: 'Surveys',
    empleados: 'Employees',
    nomina: 'Payroll',
    beneficios: 'Benefits & Deductions',
    ausencias: 'Absences',
    'inventario-item-master': 'Item Master',
    'inventario-entrada-mercancia': 'Goods Receipt',
    contabilidad: 'Accounting',
    'contabilidad-cashflow': 'Cash Flow',
    configuracion: 'Settings'
  }
}

const actualizarTitulo = (view) => {
  const titles = viewTitles[language.value] || viewTitles.es
  const nombreVista = titles[view] || (language.value === 'en' ? 'System' : 'Sistema')
  document.title = `${translateText('Sistema MAximo', 'MAximo System')} | ${nombreVista}`
}

const handleShowRegistro = () => {
  currentView.value = 'registrar'
}

const handleBackToLogin = () => {
  currentView.value = 'login'
}

const handleLogin = (userData) => {
  user.value = userData
  showAccessAnimation.value = true

  setTimeout(() => {
    currentView.value = 'dashboard'
    showAccessAnimation.value = false
  }, 1600)
}

const handleNavigate = (target) => {
  currentView.value = target
}

const handleLogout = () => {
  user.value = null
  showAccessAnimation.value = false
  currentView.value = 'login'
}

const handleLanguageChange = (newLanguage) => {
  setLanguage(newLanguage)
}

watch([currentView, language], ([nuevaVista]) => {
  actualizarTitulo(nuevaVista)
})

onMounted(() => {
  actualizarTitulo(currentView.value)
})
</script>

<template>
  <div>
    <Transition name="fade-overlay">
      <div v-if="showAccessAnimation" class="access-overlay">
        <div class="access-logo-wrap">
          <div class="access-ring"></div>
          <div class="access-logo">MAximo</div>
        </div>
        <p class="access-title">{{ translateText('Accediendo al sistema...', 'Accessing system...') }}</p>
      </div>
    </Transition>

    <!-- Auth -->
    <Login 
      v-if="currentView === 'login'"
      @show-registro="handleShowRegistro"
      @login="handleLogin"
    />
    <Register 
      v-if="currentView === 'registrar'"
      @back-to-login="handleBackToLogin"
    />
    
    <!-- Main Layout with Sidebar -->
    <MainLayout
      v-if="currentView !== 'login' && currentView !== 'registrar'"
      :user="user"
      :current-view="currentView"
      @navigate="handleNavigate"
      @logout="handleLogout"
      @language-change="handleLanguageChange"
    >
      <!-- Dashboard -->
      <Dashboard v-if="currentView === 'dashboard'" />
      
      <!-- Gestion -->
      <Usuarios v-if="currentView === 'usuarios'" />
      
      <!-- Soporte -->
      <SoporteClientes v-if="currentView === 'soporte-clientes'" />
      <OrdenesTrabajo v-if="currentView === 'ordenes-trabajo'" />
      <Tickets v-if="currentView === 'soporte-tickets'" />
      <SLAs v-if="currentView === 'slas'" />
      <Roles v-if="currentView === 'roles'" />
      <Encuestas v-if="currentView === 'encuestas'" />
      
      <!-- RRHH -->
      <Empleados v-if="currentView === 'empleados'" />
      <Nomina v-if="currentView === 'nomina'" />
      <BeneficiosDeducciones v-if="currentView === 'beneficios'" />
      <Ausencias v-if="currentView === 'ausencias'" />

      <!-- Inventario -->
      <ItemMaster v-if="currentView === 'inventario-item-master'" />
      <EntradaMercancia v-if="currentView === 'inventario-entrada-mercancia'" />
      
      <!-- Contabilidad -->
      <Contabilidad v-if="currentView === 'contabilidad'" />
      <CashFlowDashboard v-if="currentView === 'contabilidad-cashflow'" />
      
      <!-- Configuracion -->
      <Configuracion v-if="currentView === 'configuracion'" />
    </MainLayout>
  </div>
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
}

#app {
  width: 100%;
  min-height: 100vh;
}

.access-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf2f8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.access-logo-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.access-ring {
  position: absolute;
  width: 110px;
  height: 110px;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.access-logo {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.25);
  animation: pulse-logo 1.2s ease-in-out infinite;
}

.access-title {
  color: #4338ca;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.25s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-logo {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
</style>
