<template>
  <div class="h-screen bg-gray-100 p-3 sm:p-4 lg:p-7">
    <div class="flex h-full gap-3 sm:gap-4 lg:gap-6">
      <!-- Sidebar -->
      <aside class="ml-3 sm:ml-4 lg:ml-6 w-56 sm:w-60 lg:w-64 bg-gradient-to-b from-cyan-950 via-sky-900 to-indigo-950 text-white shadow-2xl overflow-y-auto border-r border-white/5 rounded-2xl">
      <!-- Header -->
      <div class="px-7 py-7 border-b border-slate-700/70 flex justify-center">
        <h1 class="maximo-logo text-3xl sm:text-4xl font-bold tracking-wide leading-none">MAximo</h1>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav px-2 py-5 text-sm sm:text-base text-amber-200 font-semibold tracking-wide">
        <!-- Inicio -->
           <div @click="$emit('navigate', 'dashboard')" 
             class="flex items-center justify-center gap-3 px-5 py-3 mb-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
             :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'dashboard'}">
          <el-icon class="text-lg text-cyan-200 bg-white/10 p-1 rounded-md"><HomeFilled /></el-icon>
          <span>{{ t('Inicio', 'Home') }}</span>
        </div>

        <!-- Gestión -->
          <div class="mb-3">
          <div @click="toggleMenu('gestion')" 
            class="flex items-center justify-between px-5 py-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out">
            <div class="flex flex-1 items-center justify-center gap-3">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><Setting /></el-icon>
              <span>{{ t('Gestión', 'Management') }}</span>
            </div>
            <el-icon class="text-slate-300 ml-2 shrink-0">
              <ArrowUp v-if="menuStates.gestion" />
              <ArrowDown v-else />
            </el-icon>
          </div>
              <div v-show="menuStates.gestion" class="ml-5 mt-3 space-y-2">
            <div @click="$emit('navigate', 'usuarios')"
                class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'usuarios'}">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><User /></el-icon>
              <span>{{ t('Usuarios', 'Users') }}</span>
            </div>
          </div>
        </div>

        <!-- Soporte -->
          <div class="mb-3">
          <div @click="toggleMenu('soporte')" 
            class="flex items-center justify-between px-5 py-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out">
            <div class="flex flex-1 items-center justify-center gap-3">
              <el-icon class="text-lg text-sky-200 bg-white/10 p-1 rounded-md"><Headset /></el-icon>
              <span>{{ t('Soporte', 'Support') }}</span>
            </div>
            <el-icon class="text-slate-300 ml-2 shrink-0">
              <ArrowUp v-if="menuStates.soporte" />
              <ArrowDown v-else />
            </el-icon>
          </div>
              <div v-show="menuStates.soporte" class="ml-5 mt-3 space-y-2">
            <div @click="$emit('navigate', 'soporte-tickets')"
                class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'soporte-tickets'}">
              <el-icon class="text-lg text-sky-200 bg-white/10 p-1 rounded-md"><Tickets /></el-icon>
              <span>{{ t('Tickets', 'Tickets') }}</span>
            </div>
            <div @click="$emit('navigate', 'slas')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'slas'}">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><Document /></el-icon>
              <span>SLAs</span>
            </div>
            <div @click="$emit('navigate', 'roles')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'roles'}">
              <el-icon class="text-lg text-indigo-200 bg-white/10 p-1 rounded-md"><Key /></el-icon>
              <span>{{ t('Roles', 'Roles') }}</span>
            </div>
            <div @click="$emit('navigate', 'encuestas')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'encuestas'}">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><Edit /></el-icon>
              <span>{{ t('Encuestas', 'Surveys') }}</span>
            </div>
          </div>
        </div>

        <!-- Clientes -->
        <div @click="$emit('navigate', 'soporte-clientes')"
             class="flex items-center justify-center gap-3 px-5 py-3 mb-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
             :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'soporte-clientes'}">
          <el-icon class="text-lg text-cyan-200 bg-white/10 p-1 rounded-md"><UserFilled /></el-icon>
          <span>{{ t('Clientes', 'Clients') }}</span>
        </div>

        <div @click="$emit('navigate', 'ordenes-trabajo')"
             class="flex items-center justify-center gap-3 px-5 py-3 mb-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
             :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'ordenes-trabajo'}">
          <el-icon class="text-lg text-sky-200 bg-white/10 p-1 rounded-md"><Document /></el-icon>
          <span>{{ t('Órdenes de Trabajo', 'Work Orders') }}</span>
        </div>

        <!-- RRHH -->
          <div class="mb-3">
          <div @click="toggleMenu('rrhh')" 
            class="flex items-center justify-between px-5 py-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out">
            <div class="flex flex-1 items-center justify-center gap-3">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><User /></el-icon>
              <span>{{ t('RRHH', 'HR') }}</span>
            </div>
            <el-icon class="text-slate-300 ml-2 shrink-0">
              <ArrowUp v-if="menuStates.rrhh" />
              <ArrowDown v-else />
            </el-icon>
          </div>
              <div v-show="menuStates.rrhh" class="ml-5 mt-3 space-y-2">
            <div @click="$emit('navigate', 'empleados')"
                class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'empleados'}">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><User /></el-icon>
              <span>{{ t('Empleados', 'Employees') }}</span>
            </div>
            <div @click="$emit('navigate', 'nomina')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'nomina'}">
              <el-icon class="text-lg text-sky-200 bg-white/10 p-1 rounded-md"><Document /></el-icon>
              <span>{{ t('Nómina', 'Payroll') }}</span>
            </div>
            <div @click="$emit('navigate', 'beneficios')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'beneficios'}">
              <el-icon class="text-lg text-cyan-200 bg-white/10 p-1 rounded-md"><DocumentChecked /></el-icon>
              <span>{{ t('Beneficios y deducciones', 'Benefits and deductions') }}</span>
            </div>
            <div @click="$emit('navigate', 'ausencias')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'ausencias'}">
              <el-icon class="text-lg text-indigo-200 bg-white/10 p-1 rounded-md"><Calendar /></el-icon>
              <span>{{ t('Ausencias', 'Absences') }}</span>
            </div>
          </div>
        </div>

        <!-- Inventario -->
        <div class="mb-3">
          <div @click="toggleMenu('inventario')" 
            class="flex items-center justify-between px-5 py-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out">
            <div class="flex flex-1 items-center justify-center gap-3">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><OfficeBuilding /></el-icon>
              <span>{{ t('Inventario', 'Inventory') }}</span>
            </div>
            <el-icon class="text-slate-300 ml-2 shrink-0">
              <ArrowUp v-if="menuStates.inventario" />
              <ArrowDown v-else />
            </el-icon>
          </div>
          <div v-show="menuStates.inventario" class="ml-5 mt-3 space-y-2">
            <div @click="$emit('navigate', 'inventario-item-master')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
              :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'inventario-item-master'}">
              <el-icon class="text-lg text-sky-200 bg-white/10 p-1 rounded-md"><Document /></el-icon>
              <span>Item Master</span>
            </div>
            <div @click="$emit('navigate', 'inventario-entrada-mercancia')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
              :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'inventario-entrada-mercancia'}">
              <el-icon class="text-lg text-sky-200 bg-white/10 p-1 rounded-md"><Document /></el-icon>
              <span>{{ t('Entrada de Mercancía', 'Goods Receipt') }}</span>
            </div>
          </div>
        </div>

        <!-- Contabilidad -->
        <div class="mb-3">
          <div @click="toggleMenu('contabilidad')" 
            class="flex items-center justify-between px-5 py-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out">
            <div class="flex flex-1 items-center justify-center gap-3">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><Coin /></el-icon>
              <span>{{ t('Contabilidad', 'Accounting') }}</span>
            </div>
            <el-icon class="text-slate-300 ml-2 shrink-0">
              <ArrowUp v-if="menuStates.contabilidad" />
              <ArrowDown v-else />
            </el-icon>
          </div>
            <div v-show="menuStates.contabilidad" class="ml-5 mt-3 space-y-2">
            <div @click="$emit('navigate', 'contabilidad')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                  :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'contabilidad'}">
                <el-icon class="text-lg text-sky-200 bg-white/10 p-1 rounded-md"><Document /></el-icon>
              <span>{{ t('Asientos Contables', 'Journal Entries') }}</span>
            </div>
            <div @click="$emit('navigate', 'contabilidad-cashflow')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                  :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'contabilidad-cashflow'}">
                <el-icon class="text-lg text-sky-200 bg-white/10 p-1 rounded-md"><Coin /></el-icon>
              <span>{{ t('Cash Flow', 'Cash Flow') }}</span>
            </div>
          </div>
        </div>

        <!-- Configuración -->
        <div class="mb-3">
          <div @click="toggleMenu('configuracion')" 
            class="flex items-center justify-between px-5 py-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out">
            <div class="flex flex-1 items-center justify-center gap-3">
              <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><Setting /></el-icon>
              <span>{{ t('Configuración', 'Settings') }}</span>
            </div>
            <el-icon class="text-slate-300 ml-2 shrink-0">
              <ArrowUp v-if="menuStates.configuracion" />
              <ArrowDown v-else />
            </el-icon>
          </div>
            <div v-show="menuStates.configuracion" class="ml-5 mt-3 space-y-2">
            <div @click="$emit('navigate', 'configuracion')"
              class="submenu-item flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-cyan-500/15 transition-all duration-300 ease-in-out"
                  :class="{'bg-cyan-500/25 text-yellow-100 border-l-4 border-yellow-300 ring-1 ring-yellow-300/30 shadow-lg shadow-yellow-500/15': currentView === 'configuracion'}">
                <el-icon class="text-lg text-blue-200 bg-white/10 p-1 rounded-md"><Setting /></el-icon>
              <span>{{ t('Configuración', 'Settings') }}</span>
            </div>
          </div>
        </div>
      </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-7 py-5 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800 ml-1">{{ pageTitle }}</h2>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 font-medium">{{ t('Lenguaje', 'Language') }}</span>
            <el-select
              :model-value="language"
              size="small"
              style="width: 130px"
              @change="handleLanguageChange"
            >
              <el-option label="Español" value="es" />
              <el-option label="English" value="en" />
            </el-select>
            <span class="text-gray-600">{{ user?.nombre || user?.email || t('Usuario', 'User') }}</span>
            <el-button type="danger" size="small" @click="$emit('logout')">{{ t('Cerrar sesión', 'Log out') }}</el-button>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="app-content flex-1 overflow-y-auto bg-gray-50 p-7 lg:p-8">
        <slot></slot>
      </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { language, setLanguage, t } from '../../i18n/runtimeTranslator'
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Coin,
  Document,
  DocumentChecked,
  Edit,
  Headset,
  HomeFilled,
  Key,
  OfficeBuilding,
  Setting,
  Tickets,
  User,
  UserFilled
} from '@element-plus/icons-vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  currentView: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['navigate', 'logout', 'language-change'])

const menuStates = ref({
  gestion: false,
  soporte: false,
  rrhh: false,
  inventario: false,
  contabilidad: false,
  configuracion: false
})

const toggleMenu = (menu) => {
  menuStates.value[menu] = !menuStates.value[menu]
}

const handleLanguageChange = (newLanguage) => {
  setLanguage(newLanguage)
  emit('language-change', newLanguage)
}

const pageTitle = computed(() => {
  const titles = {
    es: {
      'dashboard': 'Dashboard',
      'usuarios': 'Usuarios',
      'soporte-tickets': 'Tickets de Soporte',
      'soporte-clientes': 'Clientes',
      'ordenes-trabajo': 'Órdenes de Trabajo',
      'slas': 'SLAs',
      'roles': 'Roles',
      'encuestas': 'Encuestas',
      'empleados': 'Empleados',
      'nomina': 'Nómina',
      'beneficios': 'Beneficios y Deducciones',
      'ausencias': 'Ausencias',
      'inventario-item-master': 'Item Master',
      'contabilidad': 'Contabilidad',
      'configuracion': 'Configuración'
    },
    en: {
      'dashboard': 'Dashboard',
      'usuarios': 'Users',
      'soporte-tickets': 'Support Tickets',
      'soporte-clientes': 'Clients',
      'ordenes-trabajo': 'Work Orders',
      'slas': 'SLAs',
      'roles': 'Roles',
      'encuestas': 'Surveys',
      'empleados': 'Employees',
      'nomina': 'Payroll',
      'beneficios': 'Benefits and Deductions',
      'ausencias': 'Absences',
      'inventario-item-master': 'Item Master',
      'contabilidad': 'Accounting',
      'configuracion': 'Settings'
    }
  }
  const langTitles = titles[language.value] || titles.es
  return langTitles[props.currentView] || t('Sistema MAximo', 'MAximo System')
})
</script>

<style scoped>
.maximo-logo {
  color: transparent;
  background-image: repeating-linear-gradient(
    to bottom,
    #ffffff 0px,
    #ffffff 4px,
    #000000 4px,
    #000000 5px,
    #ffffff 5px,
    #ffffff 9px,
    #000000 9px,
    #000000 10px
  );
  -webkit-background-clip: text;
  background-clip: text;
}

.sidebar-nav .items-center.gap-3 {
  justify-content: flex-start !important;
}

.sidebar-nav .submenu-item {
  justify-content: center !important;
}
</style>
