import { ref } from 'vue'

const STORAGE_KEY = 'erp-frontend-locale'

const detectDefaultLocale = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'es' || saved === 'en') {
    return saved
  }

  const browserLocale = navigator.language?.toLowerCase() || 'es'
  return browserLocale.startsWith('en') ? 'en' : 'es'
}

const locale = ref(detectDefaultLocale())

const messages = {
  es: {
    appName: 'MAximo',
    system: 'Sistema',
    language: 'Idioma',
    spanish: 'Español',
    english: 'Inglés',
    login: 'Login',
    register: 'Registro',
    dashboard: 'Dashboard',
    users: 'Usuarios',
    supportTickets: 'Tickets de Soporte',
    customers: 'Clientes',
    workOrders: 'Órdenes de Trabajo',
    slas: 'SLAs',
    roles: 'Roles',
    surveys: 'Encuestas',
    employees: 'Empleados',
    payroll: 'Nómina',
    benefits: 'Beneficios y Deducciones',
    absences: 'Ausencias',
    itemMaster: 'Item Master',
    accounting: 'Contabilidad',
    settings: 'Configuración',
    home: 'Inicio',
    management: 'Gestión',
    support: 'Soporte',
    inventory: 'Inventario',
    accountingEntries: 'Asientos Contables',
    userFallback: 'Usuario',
    logout: 'Cerrar sesión',
    accessSystem: 'Accediendo al sistema...',
    welcomeTo: 'Welcome to',
    createAccount: 'Create your account',
    freeMinutes: "It's just few minutes and free!",
    email: 'Correo electrónico',
    password: 'Contraseña',
    emailPlaceholder: 'correo@ejemplo.com',
    passwordPlaceholder: 'Ingresa tu contraseña',
    signIn: 'Iniciar sesión',
    noAccount: '¿No tienes cuenta?',
    signUp: 'Registrarse',
    requiredCredentials: 'Correo y contraseña requeridos.',
    invalidEmail: 'Formato de correo inválido.',
    loginError: 'Error al iniciar sesión',
    pendingApproval: 'Cuenta pendiente de aprobación',
    pendingApprovalMessage: 'Tu cuenta está pendiente de aprobación. Espera a que un administrador active tu cuenta.',
    networkError: 'Error de red: no se puede conectar con el servidor. Verifica que el backend esté activo.',
    connectionError: 'Error de conexión con el servidor',
    welcomeUser: 'Bienvenido, {name}!'
  },
  en: {
    appName: 'MAximo',
    system: 'System',
    language: 'Language',
    spanish: 'Spanish',
    english: 'English',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    users: 'Users',
    supportTickets: 'Support Tickets',
    customers: 'Customers',
    workOrders: 'Work Orders',
    slas: 'SLAs',
    roles: 'Roles',
    surveys: 'Surveys',
    employees: 'Employees',
    payroll: 'Payroll',
    benefits: 'Benefits and Deductions',
    absences: 'Absences',
    itemMaster: 'Item Master',
    accounting: 'Accounting',
    settings: 'Settings',
    home: 'Home',
    management: 'Management',
    support: 'Support',
    inventory: 'Inventory',
    accountingEntries: 'Journal Entries',
    userFallback: 'User',
    logout: 'Sign out',
    accessSystem: 'Accessing the system...',
    welcomeTo: 'Welcome to',
    createAccount: 'Create your account',
    freeMinutes: "It's just few minutes and free!",
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'email@example.com',
    passwordPlaceholder: 'Enter your password',
    signIn: 'Sign in',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    requiredCredentials: 'Email and password are required.',
    invalidEmail: 'Invalid email format.',
    loginError: 'Login error',
    pendingApproval: 'Account pending approval',
    pendingApprovalMessage: 'Your account is pending approval. Wait for an administrator to activate it.',
    networkError: 'Network error: unable to reach the server. Verify the backend is running.',
    connectionError: 'Connection error with the server',
    welcomeUser: 'Welcome, {name}!'
  }
}

const setLocale = (nextLocale) => {
  if (nextLocale !== 'es' && nextLocale !== 'en') {
    return
  }
  locale.value = nextLocale
  localStorage.setItem(STORAGE_KEY, nextLocale)
}

const t = (key, params = {}) => {
  const selectedMessages = messages[locale.value] || messages.es
  const fallbackMessages = messages.es
  const template = selectedMessages[key] || fallbackMessages[key] || key

  return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
    return result.replaceAll(`{${paramKey}}`, String(paramValue))
  }, template)
}

export function useI18n() {
  return {
    locale,
    setLocale,
    t
  }
}
