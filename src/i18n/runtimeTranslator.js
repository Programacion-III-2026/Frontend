import { ref, watch } from 'vue'

const STORAGE_KEY = 'app-language'
const SUPPORTED_LANGUAGES = ['es', 'en']

const savedLanguage = localStorage.getItem(STORAGE_KEY)
const initialLanguage = SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : 'es'

export const language = ref(initialLanguage)

const esToEn = {
  'Lenguaje': 'Language',
  'Cerrar sesión': 'Log out',
  'Usuario': 'User',
  'Inicio': 'Home',
  'Gestión': 'Management',
  'Usuarios': 'Users',
  'Soporte': 'Support',
  'Clientes': 'Clients',
  'Órdenes de Trabajo': 'Work Orders',
  'Tickets de Soporte': 'Support Tickets',
  'Tickets': 'Tickets',
  'Encuestas': 'Surveys',
  'Empleados': 'Employees',
  'Nómina': 'Payroll',
  'Beneficios y deducciones': 'Benefits and deductions',
  'Beneficios y Deducciones': 'Benefits and Deductions',
  'Ausencias': 'Absences',
  'Inventario': 'Inventory',
  'Contabilidad': 'Accounting',
  'Asientos Contables': 'Journal Entries',
  'Configuración': 'Settings',
  'Sistema MAximo': 'MAximo System',
  'Accediendo al sistema...': 'Accessing system...',
  'Usuarios Activos': 'Active Users',
  'Tickets Abiertos': 'Open Tickets',
  'Tickets Vencidos': 'Overdue Tickets',
  'Tendencia de Tickets Vencidos': 'Overdue Tickets Trend',
  'Calendario de Eventos': 'Events Calendar',
  'Sin eventos recientes.': 'No recent events.',
  'Distribución de Alertas': 'Alerts Distribution',
  'Alertas de Sistema Recientes': 'Recent System Alerts',
  'Sin alertas recientes.': 'No recent alerts.',
  'Actividad Reciente': 'Recent Activity',
  'Sin actividad reciente.': 'No recent activity.',
  'Corte de Nómina': 'Payroll Cutoff',
  'Cierre Contable': 'Accounting Close',
  'Ticket vencido': 'Overdue ticket',
  'Sin fecha': 'No date',
  'Reciente': 'Recent',
  'Hace ': '',
  ' min': ' min',
  ' h': ' h',
  ' d': ' d',
  'Login': 'Login',
  'Registro': 'Register',
  'Iniciar Sesión': 'Log in',
  'Registrarse': 'Sign up',
  'Correo electrónico': 'Email',
  'Contraseña': 'Password',
  '¿No tienes cuenta?': 'Don\'t have an account?',
  'Volver al Login': 'Back to Login',
  'Registro de Usuario': 'User Registration',
  'Nombre:': 'Name:',
  'Correo:': 'Email:',
  'Rol:': 'Role:',
  'Volver': 'Back',
  'Información importante:': 'Important information:',
  'Completa todos los campos': 'Fill in all fields',
  'Tu cuenta será verificada por un administrador': 'Your account will be verified by an administrator',
  'Recibirás un correo cuando sea aprobada': 'You will receive an email when approved',
  'Dashboard': 'Dashboard'
}

const esWordsToEn = {
  'de': 'of',
  'del': 'of the',
  'la': 'the',
  'el': 'the',
  'los': 'the',
  'las': 'the',
  'y': 'and',
  'para': 'for',
  'con': 'with',
  'sin': 'without',
  'nuevo': 'new',
  'nueva': 'new',
  'nuevos': 'new',
  'nuevas': 'new',
  'crear': 'create',
  'actualizar': 'update',
  'editar': 'edit',
  'eliminar': 'delete',
  'cancelar': 'cancel',
  'guardar': 'save',
  'listado': 'list',
  'sistema': 'system',
  'cliente': 'client',
  'clientes': 'clients',
  'soporte': 'support',
  'usuario': 'user',
  'usuarios': 'users',
  'nombre': 'name',
  'teléfono': 'phone',
  'telefono': 'phone',
  'dirección': 'address',
  'direccion': 'address',
  'tipo': 'type',
  'acciones': 'actions',
  'estado': 'status',
  'pendiente': 'pending',
  'procesando': 'processing',
  'finalizado': 'completed',
  'empleados': 'employees',
  'empleado': 'employee',
  'ausencias': 'absences',
  'beneficios': 'benefits',
  'deducciones': 'deductions',
  'contabilidad': 'accounting',
  'inventario': 'inventory',
  'configuración': 'settings',
  'configuracion': 'settings',
  'tickets': 'tickets',
  'encuestas': 'surveys',
  'roles': 'roles',
  'nómina': 'payroll',
  'nomina': 'payroll',
  'órdenes': 'orders',
  'ordenes': 'orders',
  'trabajo': 'work',
  'refrescar': 'refresh',
  'fecha': 'date',
  'actividad': 'activity',
  'alertas': 'alerts',
  'reciente': 'recent',
  'recientes': 'recent'
}

Object.assign(esToEn, {
  'Gestión de clientes de soporte': 'Support client management',
  'Crear Nuevo Cliente': 'Create New Client',
  'Actualizar Cliente': 'Update Client',
  'Crear cliente': 'Create client',
  'Actualizar cliente': 'Update client',
  'Listado de Clientes': 'Clients List',
  'Tipo Cliente': 'Client Type',
  'Refrescar': 'Refresh',
  'Acciones': 'Actions',
  'Confirmar eliminación': 'Confirm deletion',
  '¿Estás seguro de que deseas eliminar este cliente?': 'Are you sure you want to delete this client?',
  'Sí': 'Yes',
  'No': 'No',
  'Cliente actualizado': 'Client updated',
  'Cliente creado': 'Client created',
  'Cliente eliminado': 'Client deleted',
  'No se pudo actualizar el cliente': 'Could not update client',
  'No se pudo crear el cliente': 'Could not create client',
  'No se pudo eliminar el cliente': 'Could not delete client',
  'No se pudieron cargar los datos de soporte': 'Support data could not be loaded',
  'Empresa ABC': 'ABC Company',
  'Calle Principal 123': 'Main Street 123',
  'Estándar': 'Standard',
  'Órdenes de Trabajo': 'Work Orders',
  'Listado de Órdenes de Trabajo': 'Work Orders List',
  'Gestión de solicitudes de reparación y mantenimiento': 'Repair and maintenance request management',
  'Editar OT': 'Edit WO',
  'Crear Nueva OT': 'Create New WO',
  'Folio OT': 'WO Number',
  'Cliente/Solicitante': 'Client/Requester',
  'Selecciona usuario registrado': 'Select registered user',
  'Sin nombre': 'No name',
  'sin email': 'no email',
  'Solicitante Manual': 'Manual requester',
  'Nombre de persona no registrada': 'Name of unregistered person',
  'Descripción Problema': 'Problem description',
  'Describe el problema o la reparación solicitada': 'Describe the problem or requested repair',
  'Diagnóstico Técnico': 'Technical diagnosis',
  'Opcional para orden cerrada/finalizada': 'Optional for closed/completed order',
  'Prioridad': 'Priority',
  'Celular Solicitante': 'Requester phone',
  'Ubicación Problema': 'Problem location',
  'Especialidad/Categoría': 'Specialty/Category',
  'Taller Asignado': 'Assigned workshop',
  'Estado OT': 'WO status',
  'Actualizar OT': 'Update WO',
  'Crear OT': 'Create WO',
  'Limpiar': 'Clear',
  'Materiales Consumidos (Item Master)': 'Consumed materials (Item Master)',
  'Selecciona ítem 91G': 'Select 91G item',
  'Agregar': 'Add',
  'Código 91G': '91G code',
  'Descripción': 'Description',
  'Cantidad': 'Quantity',
  'Precio Unitario': 'Unit price',
  'Quitar': 'Remove',
  'Vista previa OT': 'WO preview',
  'Exportar OT PDF': 'Export WO PDF',
  'Selecciona una orden de trabajo para exportar': 'Select a work order to export',
  'Selecciona una orden de trabajo para vista previa': 'Select a work order for preview',
  'No se pudo generar el folio OT': 'Could not generate WO number',
  'No se pudo cargar la lista de usuarios': 'Could not load users list',
  'No se pudieron cargar las órdenes de trabajo': 'Could not load work orders',
  'No se pudo cargar el detalle de la OT': 'Could not load WO details',
  'Selecciona un item válido': 'Select a valid item',
  'La cantidad debe ser mayor a 0': 'Quantity must be greater than 0',
  'El precio unitario debe ser mayor o igual a 0': 'Unit price must be greater than or equal to 0',
  'El taller asignado es obligatorio': 'Assigned workshop is required',
  'Selecciona un usuario o escribe un solicitante manual': 'Select a user or type a manual requester',
  'La descripción del problema es obligatoria': 'Problem description is required',
  'El celular del solicitante es obligatorio': 'Requester phone is required',
  'La ubicación del problema es obligatoria': 'Problem location is required',
  'No se pudo guardar la orden de trabajo': 'Could not save work order',
  'OT actualizada correctamente': 'WO updated successfully',
  'OT creada: ': 'WO created: ',
  'No se pudo actualizar el estado de la OT': 'Could not update WO status',
  'Estado de OT actualizado': 'WO status updated',
  'Sin materiales consumidos registrados.': 'No consumed materials recorded.',
  'No se pudo abrir la vista de impresión del PDF': 'Could not open PDF print preview',
  'Vista previa OT - Folio: ': 'WO preview - Number: ',
  'Imprimir': 'Print',
  'Sistema de Soporte': 'Support System',
  'ORDEN DE TRABAJO': 'WORK ORDER',
  'Folio: ': 'Number: ',
  'Cliente:': 'Client:',
  'Teléfono:': 'Phone:',
  'Dirección:': 'Address:',
  'Especialidad:': 'Specialty:',
  'Fecha Creación:': 'Creation date:',
  'Estado:': 'Status:',
  'Descripción de la Falla / Problema': 'Failure / Problem Description',
  'Sin diagnóstico registrado.': 'No diagnosis recorded.',
  'Materiales Consumidos': 'Consumed materials',
  'Total Materiales: ': 'Materials total: ',
  'Firma del Técnico': 'Technician signature',
  'Firma de Conformidad del Cliente': 'Client acceptance signature',
  'Pendiente': 'Pending',
  'En Proceso': 'In Progress',
  'Finalizada': 'Completed',
  'Baja': 'Low',
  'Media': 'Medium',
  'Alta': 'High',
  'Electricidad': 'Electrical',
  'Plomería': 'Plumbing',
  'Mecánica': 'Mechanical',
  'Climatización': 'HVAC',
  'Obra Civil': 'Civil Works'
})

Object.assign(esToEn, {
  'Gestión de tickets de soporte': 'Support ticket management',
  'ALERTAS DE SLA POR VENCER': 'UPCOMING SLA ALERTS',
  'Los siguientes tickets tienen SLA que vence en los próximos 10 minutos:': 'The following tickets have an SLA that expires in the next 10 minutes:',
  'Acción': 'Action',
  'Aceptado': 'Accepted',
  'Cerrar': 'Close',
  'ALERTAS SLA': 'SLA ALERTS',
  'Crear Nuevo Ticket': 'Create New Ticket',
  'Título': 'Title',
  'Sistema no responde': 'System is not responding',
  'El sistema está lento': 'The system is slow',
  'Escribe el nombre del usuario': 'Type the user name',
  'Técnico': 'Technician',
  'Escribe el nombre del técnico': 'Type the technician name',
  'Subcategoría': 'Subcategory',
  'Se asignará automáticamente según el problema': 'It will be assigned automatically based on the problem',
  'La subcategoría se asigna automáticamente según palabras clave en la descripción': 'Subcategory is automatically assigned based on keywords in the description',
  'Selecciona un estado': 'Select a status',
  'Crear ticket': 'Create ticket',
  'Listado de Tickets': 'Tickets List',
  'Tipo Cliente': 'Client Type',
  'SLA Resolución': 'SLA Resolution',
  'Sin SLA': 'No SLA',
  'Revisar': 'Review',
  'Finalizar': 'Finish',
  'Completa el título y la descripción del ticket': 'Complete the ticket title and description',
  'Selecciona un usuario válido para el ticket': 'Select a valid user for the ticket',
  'Selecciona técnico, subcategoría y estado para crear el ticket': 'Select technician, subcategory and status to create the ticket',
  'No se pudo crear el ticket': 'Could not create the ticket',
  'Ticket creado': 'Ticket created',
  'Ticket no encontrado': 'Ticket not found',
  'Estado no encontrado': 'Status not found',
  'Técnico': 'Technician',
  'Ticket actualizado a "': 'Ticket updated to "',
  'Técnico comenzó revisión - Respuesta registrada': 'Technician started review - Response registered',
  'Error en la respuesta del servidor': 'Server response error',
  'Error al cambiar estado: ': 'Error changing status: ',
  'tickets con SLA por vencer en 10 minutos': 'tickets with SLA expiring in 10 minutes',
  'Error marcando notificación': 'Error marking notification',
  'Desconocido': 'Unknown',
  'Procesando': 'Processing',
  'Crítica': 'Critical',
  'N/A': 'N/A',
  'VENCIDO': 'OVERDUE',
  'Por Cliente': 'By Client',
  'Por Prioridad': 'By Priority',
  'Calendario de Equipo': 'Team Calendar',
  'Mínimo 2 disponibles para aprobar': 'Minimum 2 available to approve',
  'Ausentes:': 'Absent:',
  'Disp.:': 'Avail.:',
  'Disponibilidad del Día': 'Day Availability',
  'Fecha:': 'Date:',
  'Total empleados:': 'Total employees:',
  'Ausentes:': 'Absent:',
  'Disponibles:': 'Available:',
  'No disponibles:': 'Unavailable:',
  'Todo el equipo disponible': 'All team available',
  'Gestión de Ausencias': 'Absences Management',
  'Nueva Ausencia': 'New Absence',
  'Empleado': 'Employee',
  'Apellido': 'Last Name',
  'Fecha Inicio': 'Start Date',
  'Fecha Fin': 'End Date',
  'Tipo': 'Type',
  'Motivo': 'Reason',
  'Aprobar': 'Approve',
  'Rechazar': 'Reject',
  'Editar': 'Edit',
  'Eliminar': 'Delete',
  'Editar Ausencia': 'Edit Absence',
  'Selecciona un empleado': 'Select an employee',
  'Selecciona tipo': 'Select type',
  'Vacaciones': 'Vacation',
  'Permiso': 'Leave',
  'Baja médica': 'Medical leave',
  'Aprobada': 'Approved',
  'Rechazada': 'Rejected',
  'Describe el motivo de la ausencia': 'Describe the reason for the absence',
  'Actualizar': 'Update',
  'Crear': 'Create',
  'Error al cargar datos': 'Error loading data',
  'Completa todos los campos obligatorios': 'Complete all required fields',
  'Error al guardar': 'Save error',
  'Ausencia actualizada': 'Absence updated',
  'Ausencia creada': 'Absence created',
  'No se pudo actualizar el estado': 'Could not update status',
  'Ausencia ': 'Absence ',
  '¿Estás seguro de que deseas eliminar esta ausencia?': 'Are you sure you want to delete this absence?',
  'Confirmar': 'Confirm',
  'Error al eliminar': 'Delete error',
  'Ausencia eliminada': 'Absence deleted',
  'pendiente': 'pending',
  'aprobada': 'approved',
  'rechazada': 'rejected'
})

Object.assign(esToEn, {
  'Gestión de Usuarios': 'User Management',
  'Administración y aprobación de cuentas del sistema': 'Administration and approval of system accounts',
  'Usuarios pendientes:': 'Pending users:',
  'Rol Actual': 'Current Role',
  'Nuevo Rol': 'New Role',
  'Aprobar': 'Approve',
  'Usuario aprobado y rol actualizado': 'User approved and role updated',
  'No se pudieron cargar los roles': 'Could not load roles',
  'No se pudieron cargar los usuarios': 'Could not load users',
  'No se pudo actualizar el usuario': 'Could not update user',

  'Gestión de SLAs': 'SLA Management',
  'Nuevo SLA': 'New SLA',
  'Tiempo Respuesta (min)': 'Response Time (min)',
  'Tiempo Resolución (min)': 'Resolution Time (min)',
  'Tiempo de Respuesta (min)': 'Response Time (min)',
  'Tiempo de Resolución (min)': 'Resolution Time (min)',
  'Minutos para responder': 'Minutes to respond',
  'Minutos para resolver': 'Minutes to resolve',
  'Selecciona prioridad': 'Select priority',
  'Editar SLA': 'Edit SLA',
  'Error al cargar SLAs': 'Error loading SLAs',
  'SLA actualizado': 'SLA updated',
  'SLA creado': 'SLA created',
  'SLA eliminado': 'SLA deleted',
  '¿Estás seguro de que deseas eliminar este SLA?': 'Are you sure you want to delete this SLA?',

  'Gestión de Roles': 'Role Management',
  'Nuevo Rol': 'New Role',
  'Crear Rol': 'Create Role',
  'Error al cargar roles': 'Error loading roles',
  'El nombre del rol es requerido': 'Role name is required',
  'Error al crear rol': 'Error creating role',
  'Rol creado correctamente': 'Role created successfully',
  '¿Estás seguro de que deseas eliminar este rol?': 'Are you sure you want to delete this role?',
  'Rol eliminado': 'Role deleted',

  '📊 Encuestas': '📊 Surveys',
  '📋 Nueva Encuesta': '📋 New Survey',
  'Encuestas de Satisfacción': 'Satisfaction Surveys',
  'Total Encuestas': 'Total Surveys',
  'Promedio Calificación': 'Average Rating',
  'Distribución de Calificaciones': 'Ratings Distribution',
  'NPS (Net Promoter Score)': 'NPS (Net Promoter Score)',
  'NPS actual: ': 'Current NPS: ',
  'Resumen por Nivel': 'Summary by Level',
  'Excelente (5)': 'Excellent (5)',
  'Muy Bueno (4)': 'Very Good (4)',
  'Bueno (3)': 'Good (3)',
  'Regular (2)': 'Fair (2)',
  'Malo (1)': 'Poor (1)',
  'Cumplido': 'Met',
  'Incumplido': 'Breached',
  '👨‍💼 Calidad de Técnicos': '👨‍💼 Technician Quality',
  'Reporte de Calidad - Desempeño de Técnicos': 'Quality Report - Technician Performance',
  '📌 Criterios de Capacitación': '📌 Training Criteria',
  'Promedio < 3.0 (Muy crítico)': 'Average < 3.0 (Very critical)',
  'Calificaciones bajas > 50%': 'Low ratings > 50%',
  'Múltiples incumplimientos de SLA': 'Multiple SLA breaches',
  '⚠️ Necesita Capacitación': '⚠️ Needs Training',
  'Promedio de Calificación': 'Average Rating',
  'Calif. Bajas (1-3)': 'Low Ratings (1-3)',
  'Ver Detalles': 'View Details',
  'Sin datos de técnicos': 'No technician data',
  '📋 Guía de Criterios': '📋 Criteria Guide',
  'Criterios de Calificación - Escala CX': 'Rating Criteria - CX Scale',
  'Pregunta Adicional': 'Additional Question',
  'Preguntas Efectivas sobre el Técnico': 'Effective Questions about the Technician',
  'Nueva Encuesta de Satisfacción': 'New Satisfaction Survey',
  'Selecciona un ticket': 'Select a ticket',
  'Calificación General': 'Overall Rating',
  'Demora en SLA': 'SLA Delay',
  '¿En qué medida la demora en la resolución afectó tu operación?': 'To what extent did the delay in resolution affect your operation?',
  'Mucho - Afectó operaciones críticas': 'A lot - It affected critical operations',
  'Algo - Causó inconvenientes moderados': 'Somewhat - It caused moderate inconvenience',
  'Poco - Impacto mínimo': 'A little - Minimal impact',
  'Nada - No afectó operaciones': 'Not at all - It did not affect operations',
  'Preguntas sobre el Técnico': 'Questions about the Technician',
  'Comentario Adicional': 'Additional Comment',
  'Comparte tu opinión adicional sobre nuestro servicio': 'Share your additional opinion about our service',
  'Enviar Encuesta': 'Send Survey',
  'Detalles de Encuesta': 'Survey Details',
  'Cumplimiento SLA': 'SLA Compliance',
  'Respuestas a Preguntas': 'Answers to Questions',

  'Gestión de empleados': 'Employee management',
  'Actualizar Empleado': 'Update Employee',
  'Crear Nuevo Empleado': 'Create New Employee',
  'Ingreso': 'Start Date',
  'Actualizar empleado': 'Update employee',
  'Crear empleado': 'Create employee',
  'Listado de Empleados': 'Employees List',
  'No se pudieron cargar los datos de RRHH': 'Could not load HR data',
  'El nombre es obligatorio': 'First name is required',
  'El apellido es obligatorio': 'Last name is required',
  'El puesto es obligatorio': 'Job title is required',
  'La fecha de ingreso es obligatoria': 'Start date is required',
  'El salario no puede ser negativo': 'Salary cannot be negative',
  'No se pudo actualizar el empleado': 'Could not update employee',
  'No se pudo crear el empleado': 'Could not create employee',
  'Empleado actualizado': 'Employee updated',
  'Empleado creado': 'Employee created',
  '¿Estás seguro de que deseas eliminar este empleado?': 'Are you sure you want to delete this employee?',
  'No se pudo eliminar el empleado': 'Could not delete employee',
  'Empleado eliminado': 'Employee deleted',

  'Gestión de planillas de pago': 'Payroll sheet management',
  'Crear Nueva Planilla': 'Create New Payroll Sheet',
  'Selecciona un empleado': 'Select an employee',
  'Año': 'Year',
  'Salario base': 'Base salary',
  'Se toma automáticamente del empleado': 'Automatically taken from employee',
  'Crear planilla': 'Create payroll sheet',
  'Listado de Planillas': 'Payroll Sheets List',
  'Bruto': 'Gross',
  'Deducciones': 'Deductions',
  'Neto': 'Net',
  'No se pudieron cargar empleados': 'Could not load employees',
  'No se pudieron cargar los datos de planilla': 'Could not load payroll data',
  'No se pudo crear la planilla': 'Could not create payroll sheet',
  'Planilla creada. Neto: ': 'Payroll sheet created. Net: ',
  'Planilla creada': 'Payroll sheet created',

  'Gestión de beneficios, descuentos e ISR de nómina': 'Benefits, deductions and payroll ISR management',
  'Error al guardar beneficio': 'Error saving benefit',
  'Error al guardar deducción': 'Error saving deduction',
  'Beneficio actualizado': 'Benefit updated',
  'Beneficio creado': 'Benefit created',
  'Deducción actualizada': 'Deduction updated',
  'Deducción creada': 'Deduction created',
  '¿Estás seguro?': 'Are you sure?',
  'Advertencia': 'Warning',
  'No se pudo eliminar': 'Could not delete',
  'Beneficio eliminado': 'Benefit deleted',
  'Deducción eliminada': 'Deduction deleted',
  'Beneficios no disponible en la BD actual': 'Benefits are not available in the current DB',
  'Las deducciones están configuradas con las reglas legales (IHSS y RAP)': 'Deductions are configured with legal rules (IHSS and RAP)',
  'Nuevo': 'New',
  'Editar': 'Edit',
  'Beneficio': 'Benefit',
  'Deducción': 'Deduction',
  'Monetario': 'Monetary',
  'En especie': 'In kind',
  'Temporal': 'Temporary',
  'Impuesto': 'Tax',
  'Descuento': 'Discount',
  'Cuota': 'Fee',
  'Porcentaje': 'Percentage',
  'Monto Fijo': 'Fixed Amount',
  'ISR Anual': 'Annual ISR',
  'Total Salarios Anuales': 'Total Annual Salaries',
  'Total ISR Cobrado': 'Total ISR Collected',
  'Empleados con ISR': 'Employees with ISR',
  'Desglose de Salarios Anuales e ISR por Empleado': 'Breakdown of Annual Salaries and ISR by Employee',
  'Salario Anual': 'Annual Salary',
  'ISR Aplicado': 'ISR Applied',
  'ISR Cobrado': 'ISR Collected',
  'Neto a Pagar': 'Net to Pay',
  'Beneficios no disponible': 'Benefits not available',
  'Beneficios del Personal': 'Staff Benefits',
  'Deducciones legales activas: IHSS (L 600) y RAP (L 125)': 'Active legal deductions: IHSS (L 600) and RAP (L 125)',
  'Deducciones de Nómina': 'Payroll Deductions',

  'Gestión de ítems de inventario': 'Inventory item management',
  'Entrada de Mercancía': 'Goods Receipt',
  'Detalle de Ítems': 'Item Details',
  'N° Factura': 'Invoice #',
  'Proveedor (clientes)': 'Supplier (clients)',
  'Selecciona proveedor': 'Select supplier',
  'Fecha factura': 'Invoice date',
  'Fecha vencimiento': 'Due date',
  'Última factura generada:': 'Latest generated invoice:',
  'Selecciona item y cantidad válida': 'Select a valid item and quantity',
  'Item no válido': 'Invalid item',
  'Completa proveedor y al menos un ítem': 'Select a supplier and add at least one item',
  'No se pudieron cargar ítems de inventario': 'Could not load inventory items',
  'No se pudo registrar la entrada': 'Could not register goods receipt',
  'Entrada registrada con factura': 'Goods receipt registered with invoice',
  'Registrar Entrada': 'Register Goods Receipt',
  'Error cargando proveedores': 'Error loading suppliers',
  'Error cargando ítems': 'Error loading items',
  'Exportar Excel': 'Export Excel',
  'Actualizar Item': 'Update Item',
  'Crear Nuevo Item': 'Create New Item',
  'Número de Partes': 'Number of Parts',
  'Material o herramienta': 'Material or tool',
  'Proveedor': 'Supplier',
  'Selecciona o escribe proveedor': 'Select or type supplier',
  'Unidad de Medida': 'Unit of Measure',
  'Actualizar item': 'Update item',
  'Crear item': 'Create item',
  'Listado de Items': 'Items List',
  'Buscar por ID o descripción': 'Search by ID or description',
  'N° Partes': '# Parts',
  'No se pudieron cargar los items': 'Could not load items',
  'No se pudo cargar la lista de proveedores': 'Could not load suppliers list',
  'La descripción es obligatoria': 'Description is required',
  'Selecciona o escribe un proveedor': 'Select or type a supplier',
  'El número de partes es obligatorio y debe ser mayor a 0': 'Number of parts is required and must be greater than 0',
  'El número de partes debe ser un entero': 'Number of parts must be an integer',
  'Ingresa un precio válido': 'Enter a valid price',
  'No se pudo guardar el item': 'Could not save item',
  'Item actualizado': 'Item updated',
  'Item creado': 'Item created',
  '¿Eliminar el item ': 'Delete item ',
  'No se pudo eliminar el item': 'Could not delete item',
  'Item eliminado': 'Item deleted',
  'No hay datos para exportar': 'No data to export',
  'Excel generado correctamente': 'Excel generated successfully',

  'Asientos contables, reportes financieros y flujo de caja': 'Journal entries, financial reports and cash flow',
  'Asientos Excel': 'Entries Excel',
  'Asientos PDF': 'Entries PDF',
  'Cuentas contables': 'Chart of accounts',
  'Código': 'Code',
  'Caja': 'Cash',
  'Activo': 'Asset',
  'Pasivo': 'Liability',
  'Patrimonio': 'Equity',
  'Ingreso': 'Income',
  'Gasto': 'Expense',
  'Crear cuenta': 'Create account',
  'Asientos contables': 'Journal entries',
  'Selecciona fecha': 'Select date',
  'Pago de servicios': 'Service payment',
  'Crear asiento': 'Create entry',
  'Buscador avanzado': 'Advanced search',
  'Fecha desde': 'Date from',
  'Fecha hasta': 'Date to',
  'Monto mínimo': 'Minimum amount',
  'Monto máximo': 'Maximum amount',
  'Cuenta contable': 'Account',
  'Todas': 'All',
  'Buscar': 'Search',
  'Cuadrado': 'Balanced',
  'Descuadrado': 'Unbalanced',
  'Movimientos contables': 'Accounting movements',
  'Asiento': 'Entry',
  'Selecciona asiento': 'Select entry',
  'Sin descripción': 'No description',
  'Cuenta': 'Account',
  'Selecciona cuenta': 'Select account',
  'Debe': 'Debit',
  'Haber': 'Credit',
  'Crear movimiento': 'Create movement',
  'Balance': 'Balance',
  'Reportes financieros automáticos': 'Automatic financial reports',
  'P&L desde': 'P&L from',
  'P&L hasta': 'P&L to',
  'Balance hasta': 'Balance to',
  'Año flujo caja': 'Cash flow year',
  'Generar reportes': 'Generate reports',
  'Total Ingresos': 'Total Income',
  'Total Gastos': 'Total Expenses',
  'Utilidad Neta': 'Net Profit',
  'Estado de Resultados (P&L)': 'Profit & Loss (P&L)',
  'Saldo': 'Balance',
  'Balance General': 'Balance Sheet',
  'Balance cuadrado': 'Balanced sheet',
  'Balance descuadrado por ': 'Unbalanced sheet by ',
  'Flujo de Caja Mensual (Ingresos vs Egresos)': 'Monthly Cash Flow (Income vs Expenses)',
  'No se pudieron cargar los asientos': 'Could not load journal entries',
  'No se pudieron cargar los reportes contables': 'Could not load accounting reports',
  'No se pudieron cargar los datos de contabilidad': 'Could not load accounting data',
  'No se pudo crear la cuenta': 'Could not create account',
  'Cuenta creada': 'Account created',
  'No se pudo crear el asiento': 'Could not create entry',
  'Asiento creado': 'Entry created',
  'No se pudo crear el movimiento': 'Could not create movement',
  'Movimiento creado. Asiento #': 'Movement created. Entry #',
  ' cuadrado.': ' balanced.',
  ' descuadrado por ': ' unbalanced by ',
  'No se pudo abrir la ventana de impresión': 'Could not open print window',

  'Configuración del Sistema': 'System Configuration',
  'Parámetros generales de la aplicación': 'General application settings',
  'Empresa': 'Company',
  'Nombre de Empresa': 'Company Name',
  'Nombre de la empresa': 'Company name',
  'RFC de la empresa': 'Company tax ID',
  'Email Contacto': 'Contact Email',
  'Teléfono Contacto': 'Contact Phone',
  'País': 'Country',
  'Moneda': 'Currency',
  'MXN - Peso Mexicano': 'MXN - Mexican Peso',
  'USD - Dólar Estadounidense': 'USD - US Dollar',
  'Guardar Cambios': 'Save Changes',
  'Tiempo de Sesión (minutos)': 'Session Timeout (minutes)',
  'Respaldo Automático': 'Automatic Backup',
  'Frecuencia de Respaldo': 'Backup Frequency',
  'Cada hora': 'Hourly',
  'Diaria': 'Daily',
  'Semanal': 'Weekly',
  'Notificaciones por Email': 'Email Notifications',
  'Modo Debug': 'Debug Mode',
  'Autenticación de Dos Factores': 'Two-factor Authentication',
  'Política de Contraseña': 'Password Policy',
  'Débil': 'Weak',
  'Normal': 'Normal',
  'Fuerte': 'Strong',
  'Días para Expiración de Contraseña': 'Password Expiration Days',
  'Intentos Fallidos Máximos': 'Maximum Failed Attempts',
  'No se pudo cargar configuración': 'Could not load configuration',
  'Error al guardar configuración': 'Error saving configuration',
  'Configuración general guardada': 'General settings saved',
  'Configuración del sistema guardada': 'System settings saved',
  'Configuración de usuarios guardada': 'User settings saved'
})

Object.assign(esToEn, {
  'Cuenta pendiente de aprobación': 'Account pending approval',
  'Último ticket registrado': 'Latest registered ticket',
  'Último empleado incorporado': 'Latest employee onboarded',
  'Último asiento contable': 'Latest journal entry',
  'Sin título': 'Untitled',
  'Sin descripción': 'No description',
  'Errores Críticos': 'Critical Errors',
  'Accesos Pendientes': 'Pending Accesses',
  'Advertencias': 'Warnings',
  'Información': 'Information',

  'Correo y contraseña requeridos.': 'Email and password are required.',
  'Formato de correo inválido.': 'Invalid email format.',
  'Error de red: no se puede conectar con el servidor. Verifica que el backend esté activo.': 'Network error: cannot connect to server. Verify backend is running.',
  'Tu cuenta está pendiente de aprobación. Espera a que un administrador active tu cuenta.': 'Your account is pending approval. Wait for an administrator to activate it.',
  'Ingresa tu contraseña': 'Enter your password',

  'Categorías de Inventario': 'Inventory Categories',
  'Gestión de categorías de inventario': 'Inventory category management',
  'Nombre de categoría': 'Category name',
  'Categorías': 'Categories',
  'No se pudieron cargar las categorías': 'Could not load categories',
  'Categoría actualizada': 'Category updated',
  'Categoría creada': 'Category created',
  'Categoría eliminada': 'Category deleted',

  'Gestión de Productos': 'Product Management',
  'Catálogo de productos en inventario': 'Inventory product catalog',
  'Código': 'Code',
  'Categoría': 'Category',
  'Stock Mínimo': 'Minimum Stock',
  'Selecciona una categoría': 'Select a category',
  'No se pudieron cargar categorías': 'Could not load categories',

  'Gestión de Activos Fijos': 'Fixed Assets Management',
  'Registro y control de activos fijos de la empresa': 'Company fixed assets registration and control',
  'Fecha Adquisición': 'Acquisition Date',
  'Valor Adquisición': 'Acquisition Value',
  'Vida Útil (años)': 'Useful Life (years)',
  'Tasa Depreciación (%)': 'Depreciation Rate (%)',
  'Ubicación': 'Location',
  'Ubicación del activo': 'Asset location',

  'Nuevo Movimiento': 'New Movement',
  'Editar Movimiento': 'Edit Movement',
  'Descripción del artículo': 'Item description',
  'Devolución': 'Return',
  '¿Estás seguro?': 'Are you sure?',
  'Guardar': 'Save',

  'Encuestas de Satisfacción': 'Satisfaction Surveys',
  'Nueva Encuesta de Satisfacción': 'New Satisfaction Survey',
  'Promotores': 'Promoters',
  'Pasivos': 'Passives',
  'Detractores': 'Detractors',
  'Calificación': 'Rating',
  'Fecha': 'Date',
  'Calidad de Técnicos': 'Technician Quality',
  'Reporte de Calidad - Desempeño de Técnicos': 'Quality Report - Technician Performance',
  'Muy crítico': 'Very critical',
  'Necesita Capacitación': 'Needs Training',
  'Sin datos de técnicos': 'No technician data',
  'Guía de Criterios': 'Criteria Guide',
  'Criterios de Capacitación': 'Training Criteria',
  'Criterios de Calificación - Escala CX': 'Rating Criteria - CX Scale',
  'Resuelto dentro del SLA': 'Resolved within SLA',
  'Comunicación con cliente': 'Communication with client',
  'Pregunta Adicional': 'Additional Question',
  'Preguntas Efectivas sobre el Técnico': 'Effective Questions about the Technician',
  'Selecciona ticket y calificación': 'Select ticket and rating',
  'Sí / No': 'Yes / No',
  'Tu respuesta aquí': 'Your answer here',
  'Detalles de Encuesta': 'Survey Details',
  'Respuestas a Preguntas': 'Answers to Questions',

  'No se pudieron cargar los datos de RRHH': 'Could not load HR data',
  'Pérez': 'Perez',

  'No se pudo cargar Item Master': 'Could not load Item Master',
  'No se pudo abrir la vista de impresión del PDF': 'Could not open PDF print view'
})

Object.assign(esToEn, {
  'Error al iniciar sesión': 'Login error',
  'Error de conexión con el servidor': 'Server connection error',
  'Cuenta pendiente de aprobación': 'Account pending approval',
  'Error al registrar. Intenta de nuevo.': 'Registration error. Try again.',
  'Error al registrar usuario:': 'Error registering user:',

  'Error al guardar movimiento': 'Error saving movement',
  'Nuevo Movimiento': 'New Movement',
  'Editar Movimiento': 'Edit Movement',
  'Refrescar': 'Refresh',

  'Error al guardar categoría': 'Error saving category',
  'Gestión de categorías de inventario': 'Inventory category management',
  'Nueva Categoría': 'New Category',
  'Editar Categoría': 'Edit Category',

  'Error al guardar producto': 'Error saving product',
  'Gestión de Productos': 'Product Management',
  'Nuevo Producto': 'New Product',
  'Editar Producto': 'Edit Product',

  'Error al guardar activo': 'Error saving asset',
  'Gestión de Activos Fijos': 'Fixed Assets Management',
  'Nuevo Activo': 'New Asset',
  'Editar Activo': 'Edit Asset',

  'Error al guardar configuración': 'Error saving configuration',
  'Configuración general guardada': 'General settings saved',
  'Configuración del sistema guardada': 'System settings saved',
  'Configuración de usuarios guardada': 'User settings saved'
})

Object.assign(esToEn, {
  'Clientes y tickets': 'Clients and tickets',
  'Comentarios del Ticket': 'Ticket Comments',
  'Ejemplo de Formulario con Element Plus': 'Element Plus Form Example',
  'Inventario (Legacy)': 'Inventory (Legacy)',
  'Movimientos de Inventario': 'Inventory Movements',
  'Accede al panel principal del sistema': 'Access the main system dashboard',
  'Administra empleados y nóminas': 'Manage employees and payroll',
  'Administra roles de usuarios': 'Manage user roles',
  'Aprobar y gestionar cuentas': 'Approve and manage accounts',
  'Gestión de Descuentos': 'Discount Management',
  'Gestiona acuerdos de nivel de servicio': 'Manage service level agreements',
  'Gestiona clientes y tickets': 'Manage clients and tickets',
  'Gestiona encuestas de satisfacción': 'Manage satisfaction surveys',
  'Gestiona las cuentas y asientos contables': 'Manage accounts and journal entries',
  'Ir a Contabilidad': 'Go to Accounting',
  'Ir a Soporte': 'Go to Support',
  'Nueva Encuesta': 'New Survey',
  'Registra ausencias de empleados': 'Record employee absences',
  '¡Usuario registrado exitosamente!': 'User successfully registered!',
  '¿Estás seguro de que deseas eliminar este adjunto?': 'Are you sure you want to delete this attachment?',
  '¿Estás seguro de que deseas eliminar este descuento?': 'Are you sure you want to delete this discount?',
  '✓ Técnico comenzó revisión - Respuesta registrada': '✓ Technician started review - Response logged',
  'El comentario no puede estar vacío': 'Comment cannot be empty',
  'El correo no es válido': 'Email is not valid',
  'Encuesta enviada correctamente': 'Survey sent successfully',
  'Encuesta guardada correctamente': 'Survey saved successfully',
  'Error de red: No se puede conectar con el servidor. Verifica que el backend esté corriendo.': 'Network error: cannot connect to server. Verify backend is running.',
  'Función de descarga en desarrollo': 'Download feature in development',
  'No hay datos de salarios anuales disponibles': 'No annual salary data available',
  'Por favor complete todos los campos': 'Please complete all fields',
  'Selecciona un archivo primero': 'Select a file first',
  'Tu cuenta está pendiente de aprobación. Por favor, espera a que un administrador active tu cuenta.': 'Your account is pending approval. Please wait for an administrator to activate your account.',

  'Descripción de la deducción': 'Deduction description',
  'Descripción del beneficio': 'Benefit description',
  'Dirección de la empresa': 'Company address',
  'Ingresa tu nombre': 'Enter your name',
  'Ingrese su contraseña': 'Enter your password',
  'Ingrese su nombre completo': 'Enter your full name',
  'Motivo del movimiento': 'Movement reason',
  'Nombre de la deducción': 'Deduction name',
  'Nombre del activo': 'Asset name',
  'Nombre del beneficio': 'Benefit name',
  'Nombre del producto': 'Product name',
  'Selecciona un rol': 'Select a role',
  '⚠️ ALERTAS DE SLA POR VENCER': '⚠️ UPCOMING SLA ALERTS',
  '✓ Completa todos los campos': '✓ Complete all fields',
  '✓ Inicia sesión con tu cuenta registrada': '✓ Sign in with your registered account',
  '✓ Si no tienes cuenta, regístrate': '✓ If you do not have an account, sign up',
  '✓ Tu cuenta debe estar activa para acceder': '✓ Your account must be active to access',
  '✓ Tu cuenta será verificada por un administrador': '✓ Your account will be verified by an administrator',
  '📝 Información:': '📝 Information:',
  'Iniciar sesión': 'Log in',

  'Contraseña:': 'Password:',
  'Correo Electrónico': 'Email',
  'Cuentas, asientos, movimientos y balance': 'Accounts, entries, movements and balance',
  'Dado de baja': 'Decommissioned',
  'Dirección': 'Address',
  'El rol inicial es cliente y queda en estado pendiente.': 'The initial role is client and remains in pending status.',
  'Empleados, asistencia y planilla': 'Employees, attendance and payroll',
  'España': 'Spain',
  'Español': 'Spanish',
  'Éxito': 'Success',
  'ℹ️ Información importante:': 'ℹ️ Important information:',
  'México': 'Mexico',
  'No hay adjuntos aún': 'No attachments yet',
  'No hay comentarios aún': 'No comments yet',
  'Registro de entradas y salidas': 'Entry and exit log',
  'Sistema de inventario anterior': 'Previous inventory system',
  'Tipo de Movimiento': 'Movement Type'
})

Object.assign(esWordsToEn, {
  'gestión': 'management',
  'administración': 'administration',
  'aprobación': 'approval',
  'cuentas': 'accounts',
  'pendientes': 'pending',
  'actual': 'current',
  'rol': 'role',
  'aprobado': 'approved',
  'actualizado': 'updated',
  'calidad': 'quality',
  'técnicos': 'technicians',
  'tecnico': 'technician',
  'promedio': 'average',
  'calificación': 'rating',
  'calificaciones': 'ratings',
  'demora': 'delay',
  'resolución': 'resolution',
  'afectó': 'affected',
  'operación': 'operation',
  'operaciones': 'operations',
  'preguntas': 'questions',
  'respuesta': 'answer',
  'respuestas': 'answers',
  'comentario': 'comment',
  'detalles': 'details',
  'cumplimiento': 'compliance',
  'incumplimiento': 'breach',
  'proveedor': 'supplier',
  'ítems': 'items',
  'item': 'item',
  'unidad': 'unit',
  'medida': 'measure',
  'precio': 'price',
  'partes': 'parts',
  'salario': 'salary',
  'salarios': 'salaries',
  'bruto': 'gross',
  'neto': 'net',
  'planilla': 'payroll',
  'planillas': 'payrolls',
  'beneficio': 'benefit',
  'deducción': 'deduction',
  'deduccion': 'deduction',
  'descuento': 'discount',
  'impuesto': 'tax',
  'porcentaje': 'percentage',
  'monto': 'amount',
  'fijo': 'fixed',
  'anual': 'annual',
  'cobrado': 'collected',
  'cuenta': 'account',
  'cuentas': 'accounts',
  'asientos': 'entries',
  'asiento': 'entry',
  'movimientos': 'movements',
  'movimiento': 'movement',
  'balance': 'balance',
  'flujo': 'flow',
  'caja': 'cash',
  'ingresos': 'income',
  'gastos': 'expenses',
  'utilidad': 'profit',
  'reportes': 'reports',
  'reporte': 'report',
  'filtros': 'filters',
  'desde': 'from',
  'hasta': 'to',
  'mínimo': 'minimum',
  'máximo': 'maximum',
  'configuración': 'configuration',
  'empresa': 'company',
  'contacto': 'contact',
  'sesión': 'session',
  'sesion': 'session',
  'respaldo': 'backup',
  'frecuencia': 'frequency',
  'notificaciones': 'notifications',
  'autenticación': 'authentication',
  'politica': 'policy',
  'contraseña': 'password',
  'expiración': 'expiration',
  'intentos': 'attempts',
  'fallidos': 'failed',
  'máximos': 'maximum'
})

const enToEs = Object.entries(esToEn).reduce((acc, [esText, enText]) => {
  acc[enText] = esText
  return acc
}, {})

const enWordsToEs = Object.entries(esWordsToEn).reduce((acc, [esWord, enWord]) => {
  acc[enWord] = esWord
  return acc
}, {})

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const stripAccents = (text) => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const buildExpandedDictionary = (dictionary) => {
  const expanded = { ...dictionary }
  Object.entries(dictionary).forEach(([sourceText, targetText]) => {
    const normalizedSource = stripAccents(sourceText)
    if (normalizedSource && normalizedSource !== sourceText && !expanded[normalizedSource]) {
      expanded[normalizedSource] = targetText
    }
  })
  return expanded
}

let expandedEsToEn = null
let expandedEnToEs = null
let expandedEsWordsToEn = null
let expandedEnWordsToEs = null

const getExpandedPhraseDictionary = (targetLanguage) => {
  if (targetLanguage === 'en') {
    if (!expandedEsToEn) {
      expandedEsToEn = buildExpandedDictionary(esToEn)
    }
    return expandedEsToEn
  }

  if (!expandedEnToEs) {
    expandedEnToEs = buildExpandedDictionary(enToEs)
  }
  return expandedEnToEs
}

const getExpandedWordDictionary = (targetLanguage) => {
  if (targetLanguage === 'en') {
    if (!expandedEsWordsToEn) {
      expandedEsWordsToEn = buildExpandedDictionary(esWordsToEn)
    }
    return expandedEsWordsToEn
  }

  if (!expandedEnWordsToEs) {
    expandedEnWordsToEs = buildExpandedDictionary(enWordsToEs)
  }
  return expandedEnWordsToEs
}

const adaptCase = (source, target) => {
  if (!source || !target) {
    return target
  }

  if (source === source.toUpperCase()) {
    return target.toUpperCase()
  }

  if (source[0] === source[0].toUpperCase()) {
    return target.charAt(0).toUpperCase() + target.slice(1)
  }

  return target
}

const replaceWholeWord = (text, sourceWord, targetWord) => {
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegExp(sourceWord)})(?=$|[^\\p{L}\\p{N}_])`, 'giu')
  return text.replace(pattern, (fullMatch, prefix, word) => `${prefix}${adaptCase(word, targetWord)}`)
}

const applyDictionary = (text, targetLanguage) => {
  if (!text || !text.trim()) {
    return text
  }

  const sourceDictionary = getExpandedPhraseDictionary(targetLanguage)
  let translated = text

  const isSingleToken = (value) => /^[\p{L}\p{N}_-]+$/u.test(String(value || ''))

  Object.entries(sourceDictionary)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([sourceText, targetText]) => {
      if (!sourceText) {
        return
      }

      if (isSingleToken(sourceText)) {
        translated = replaceWholeWord(translated, sourceText, targetText)
        return
      }

      const pattern = new RegExp(escapeRegExp(sourceText), 'gi')
      translated = translated.replace(pattern, (matched) => adaptCase(matched, targetText))
    })

  const sourceWords = getExpandedWordDictionary(targetLanguage)
  Object.entries(sourceWords)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([sourceWord, targetWord]) => {
      translated = replaceWholeWord(translated, sourceWord, targetWord)
    })

  return translated
}

const translateTextNode = (node) => {
  const translated = applyDictionary(node.nodeValue, language.value)
  if (translated !== node.nodeValue) {
    node.nodeValue = translated
  }
}

const translateAttributes = (element) => {
  const attributes = ['placeholder', 'title', 'aria-label']
  attributes.forEach((attributeName) => {
    const currentValue = element.getAttribute(attributeName)
    if (!currentValue) {
      return
    }
    const translated = applyDictionary(currentValue, language.value)
    if (translated !== currentValue) {
      element.setAttribute(attributeName, translated)
    }
  })
}

export const translateDom = (root = document.body) => {
  if (!root) {
    return
  }

  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let textNode = textWalker.nextNode()

  while (textNode) {
    const parentTag = textNode.parentElement?.tagName
    if (parentTag !== 'SCRIPT' && parentTag !== 'STYLE') {
      translateTextNode(textNode)
    }
    textNode = textWalker.nextNode()
  }

  if (root.nodeType === 1) {
    translateAttributes(root)
  }

  if (root.querySelectorAll) {
    root.querySelectorAll('*').forEach((element) => {
      translateAttributes(element)
    })
  }
}

let observer = null
let translationTimer = null

const scheduleTranslation = () => {
  if (translationTimer) {
    window.clearTimeout(translationTimer)
  }
  translationTimer = window.setTimeout(() => {
    translateDom(document.body)
  }, 10)
}

export const setLanguage = (newLanguage) => {
  const nextLanguage = SUPPORTED_LANGUAGES.includes(newLanguage) ? newLanguage : 'es'
  language.value = nextLanguage
}

export const t = (esText, enText) => (language.value === 'en' ? enText : esText)

export const initializeI18n = () => {
  if (observer) {
    return
  }

  document.documentElement.lang = language.value

  watch(language, (newLanguage) => {
    localStorage.setItem(STORAGE_KEY, newLanguage)
    document.documentElement.lang = newLanguage
    scheduleTranslation()
  }, { immediate: true })

  observer = new MutationObserver(() => {
    scheduleTranslation()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  })

  scheduleTranslation()
}
