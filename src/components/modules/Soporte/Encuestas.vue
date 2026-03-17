<template>
  <div class="encuestas-container">
    <!-- Tabs: Encuestas, Reportes, Guía -->
    <el-tabs v-model="tabActiva">
      
      <!-- TAB 1: ENCUESTAS DE SATISFACCIÓN -->
      <el-tab-pane label="📊 Encuestas" name="encuestas">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Encuestas de Satisfacción</span>
              <el-button type="primary" @click="abrirNuevaEncuesta">
                📋 Nueva Encuesta
              </el-button>
            </div>
          </template>

          <el-skeleton :loading="loading" animated>
            <template #default>
              <!-- Estadísticas Generales -->
              <el-row :gutter="20" style="margin-bottom: 20px">
                <el-col :xs="24" :sm="12" :md="6">
                  <el-statistic title="Total Encuestas" :value="encuestas.length" />
                </el-col>
                <el-col :xs="24" :sm="12" :md="6">
                  <el-statistic title="Promedio Calificación" :value="promedioGeneral.toFixed(2)" prefix="★ " suffix="/5" />
                </el-col>
                <el-col :xs="24" :sm="12" :md="6">
                  <el-statistic title="NPS" :value="npsScore" suffix=" pts" />
                </el-col>
              </el-row>

              <!-- Gráfico de Distribución -->
              <el-row :gutter="20" style="margin-bottom: 30px">
                <el-col :xs="24" :md="12">
                  <el-card shadow="never">
                    <template #header>
                      <span>Distribución de Calificaciones</span>
                    </template>
                    <div style="height: 300px;">
                      <canvas ref="chartContainer"></canvas>
                    </div>
                  </el-card>
                </el-col>
                <el-col :xs="24" :md="12">
                  <el-card shadow="never">
                    <template #header>
                      <span>NPS (Net Promoter Score)</span>
                    </template>
                    <div style="height: 300px; margin-bottom: 15px;">
                      <canvas ref="npsChartContainer"></canvas>
                    </div>
                    <el-alert
                      :title="`NPS actual: ${npsScore} (${npsEtiqueta})`"
                      :type="npsAlertType"
                      :closable="false"
                    />
                    <el-row :gutter="10" style="margin-top: 15px;">
                      <el-col :xs="8" class="summary-item">
                        <div class="summary-box excelente">
                          <div class="count">{{ npsResumen.promotores }}</div>
                          <div class="label">Promotores</div>
                          <div class="percentage">{{ npsResumen.porcentajePromotores }}%</div>
                        </div>
                      </el-col>
                      <el-col :xs="8" class="summary-item">
                        <div class="summary-box bueno">
                          <div class="count">{{ npsResumen.pasivos }}</div>
                          <div class="label">Pasivos</div>
                          <div class="percentage">{{ npsResumen.porcentajePasivos }}%</div>
                        </div>
                      </el-col>
                      <el-col :xs="8" class="summary-item">
                        <div class="summary-box malo">
                          <div class="count">{{ npsResumen.detractores }}</div>
                          <div class="label">Detractores</div>
                          <div class="percentage">{{ npsResumen.porcentajeDetractores }}%</div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>

              <el-row :gutter="20" style="margin-bottom: 30px">
                <el-col :xs="24">
                  <el-card shadow="never">
                    <template #header>
                      <span>Resumen por Nivel</span>
                    </template>
                    <el-row :gutter="10">
                      <el-col :xs="12" class="summary-item">
                        <div class="summary-box excelente">
                          <div class="count">{{ distribucion.excelente }}</div>
                          <div class="label">Excelente (5)</div>
                          <div class="percentage">{{ getPorcentaje(distribucion.excelente) }}%</div>
                        </div>
                      </el-col>
                      <el-col :xs="12" class="summary-item">
                        <div class="summary-box muybueno">
                          <div class="count">{{ distribucion.muy_bueno }}</div>
                          <div class="label">Muy Bueno (4)</div>
                          <div class="percentage">{{ getPorcentaje(distribucion.muy_bueno) }}%</div>
                        </div>
                      </el-col>
                      <el-col :xs="12" class="summary-item">
                        <div class="summary-box bueno">
                          <div class="count">{{ distribucion.bueno }}</div>
                          <div class="label">Bueno (3)</div>
                          <div class="percentage">{{ getPorcentaje(distribucion.bueno) }}%</div>
                        </div>
                      </el-col>
                      <el-col :xs="12" class="summary-item">
                        <div class="summary-box regular">
                          <div class="count">{{ distribucion.regular }}</div>
                          <div class="label">Regular (2)</div>
                          <div class="percentage">{{ getPorcentaje(distribucion.regular) }}%</div>
                        </div>
                      </el-col>
                      <el-col :xs="12" class="summary-item">
                        <div class="summary-box malo">
                          <div class="count">{{ distribucion.malo }}</div>
                          <div class="label">Malo (1)</div>
                          <div class="percentage">{{ getPorcentaje(distribucion.malo) }}%</div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>

              <!-- Tabla de Encuestas -->
              <el-table :data="encuestas" style="width: 100%" stripe>
                <el-table-column prop="cliente_nombre" label="Cliente" width="150" />
                <el-table-column prop="tecnico_nombre" label="Técnico" width="150" />
                <el-table-column prop="ticket_titulo" label="Ticket" min-width="200" />
                <el-table-column label="Calificación" width="120" align="center">
                  <template #default="{ row }">
                    <el-rate :model-value="row.calificacion_general" disabled show-score />
                  </template>
                </el-table-column>
                <el-table-column label="SLA" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag :type="row.cumplimiento_sla === 0 ? 'success' : 'danger'">
                      {{ row.cumplimiento_sla === 0 ? 'Cumplido' : 'Incumplido' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="fecha_creacion" label="Fecha" width="180">
                  <template #default="{ row }">
                    {{ formatDate(row.fecha_creacion) }}
                  </template>
                </el-table-column>
                <el-table-column label="Acción" width="100" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="verDetalles(row)">
                      Ver
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-skeleton>
        </el-card>
      </el-tab-pane>

      <!-- TAB 2: REPORTE DE CALIDAD DE TÉCNICOS -->
      <el-tab-pane label="👨‍💼 Calidad de Técnicos" name="calidad">
        <el-card>
          <template #header>
            <span>Reporte de Calidad - Desempeño de Técnicos</span>
          </template>

          <el-skeleton :loading="loadingReporte" animated>
            <template #default>
              <div v-if="reporteTecnicos.length > 0">
                <el-row :gutter="20" style="margin-bottom: 20px">
                  <el-col :xs="24" :sm="12" :md="8">
                    <el-alert title="📌 Criterios de Capacitación" type="warning" :closable="false">
                      <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Promedio < 3.0 (Muy crítico)</li>
                        <li>Calificaciones bajas > 50%</li>
                        <li>Múltiples incumplimientos de SLA</li>
                      </ul>
                    </el-alert>
                  </el-col>
                </el-row>

                <el-row :gutter="20" style="margin-bottom: 30px">
                  <el-col v-for="tecnico in reporteTecnicos" :key="tecnico.id_usuario" :xs="24" :sm="12" :md="8">
                    <el-card class="tecnico-card" shadow="hover">
                      <template #header>
                        <div class="tecnico-header">
                          <span class="tecnico-nombre">{{ tecnico.nombre }}</span>
                          <el-tag v-if="tecnico.necesita_capacitacion" type="danger">
                            ⚠️ Necesita Capacitación
                          </el-tag>
                        </div>
                      </template>

                      <el-row :gutter="10">
                        <el-col :span="24">
                          <div class="metric">
                            <div class="metric-label">Promedio de Calificación</div>
                            <el-progress 
                              :percentage="Number(tecnico.promedio_calificacion) * 20" 
                              :color="getPorcentajeColor(tecnico.promedio_calificacion)"
                            />
                            <div class="metric-value">{{ tecnico.promedio_calificacion }}/5.0</div>
                          </div>
                        </el-col>
                      </el-row>

                      <el-divider style="margin: 10px 0;" />

                      <el-row :gutter="10" style="margin-bottom: 10px;">
                        <el-col :span="12">
                          <div class="metric-small">
                            <div class="label">Encuestas</div>
                            <div class="value">{{ tecnico.total_encuestas }}</div>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="metric-small">
                            <div class="label">SLA Incumplido</div>
                            <div class="value">{{ tecnico.encuestas_con_sla_incumplido }}</div>
                          </div>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10" style="margin-bottom: 10px;">
                        <el-col :span="24">
                          <div class="metric-small">
                            <div class="label">Calif. Bajas (1-3)</div>
                            <div class="value">{{ tecnico.porcentaje_calificaciones_bajas }}%</div>
                          </div>
                        </el-col>
                      </el-row>

                      <el-row :gutter="5">
                        <el-col :span="8" class="dist-box">
                          <div class="dist-count excelente">{{ tecnico.distribucion.excelente }}</div>
                          <div class="dist-label">(5)</div>
                        </el-col>
                        <el-col :span="8" class="dist-box">
                          <div class="dist-count muybueno">{{ tecnico.distribucion.muy_bueno }}</div>
                          <div class="dist-label">(4)</div>
                        </el-col>
                        <el-col :span="8" class="dist-box">
                          <div class="dist-count bueno">{{ tecnico.distribucion.bueno }}</div>
                          <div class="dist-label">(3)</div>
                        </el-col>
                        <el-col :span="8" class="dist-box">
                          <div class="dist-count regular">{{ tecnico.distribucion.regular }}</div>
                          <div class="dist-label">(2)</div>
                        </el-col>
                        <el-col :span="8" class="dist-box">
                          <div class="dist-count malo">{{ tecnico.distribucion.malo }}</div>
                          <div class="dist-label">(1)</div>
                        </el-col>
                      </el-row>

                      <el-divider style="margin: 10px 0;" />

                      <el-button type="primary" @click="verDetallesTecnico(tecnico)" block>
                        Ver Detalles
                      </el-button>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
              <el-empty v-else description="Sin datos de técnicos" />
            </template>
          </el-skeleton>
        </el-card>
      </el-tab-pane>

      <!-- TAB 3: GUÍA DE CRITERIOS -->
      <el-tab-pane label="📋 Guía de Criterios" name="guia">
        <el-card>
          <template #header>
            <span>Criterios de Calificación - Escala CX</span>
          </template>

          <el-row :gutter="20">
            <el-col :xs="24" :md="12">
              <el-alert type="success" :closable="false">
                <template #title>
                  <span style="font-size: 16px; font-weight: bold;">⭐⭐⭐⭐⭐ Excelente (5)</span>
                </template>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Ticket resuelto dentro del SLA</li>
                  <li>Técnico excepcional y profesional</li>
                  <li>Problema completamente solucionado</li>
                  <li>Excelente comunicación con cliente</li>
                  <li>Primera solución sin necesidad de re-trabajo</li>
                </ul>
              </el-alert>
            </el-col>

            <el-col :xs="24" :md="12">
              <el-alert type="success" :closable="false">
                <template #title>
                  <span style="font-size: 16px; font-weight: bold;">⭐⭐⭐⭐ Muy Bueno (4)</span>
                </template>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Resuelto dentro del SLA</li>
                  <li>Técnico profesional y responsable</li>
                  <li>Áreas de mejora menores</li>
                  <li>Buena explicación de la solución</li>
                  <li>Cliente satisfecho con el servicio</li>
                </ul>
              </el-alert>
            </el-col>

            <el-col :xs="24" :md="12">
              <el-alert type="warning" :closable="false">
                <template #title>
                  <span style="font-size: 16px; font-weight: bold;">⭐⭐⭐ Bueno (3)</span>
                </template>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Resuelto pero con demoras menores</li>
                  <li>Técnico competente pero con áreas de mejora</li>
                  <li>Comunicación aceptable</li>
                  <li>Requiere supervisión ocasional</li>
                  <li><strong>⚠️ Indicador de necesidad de capacitación si es frecuente</strong></li>
                </ul>
              </el-alert>
            </el-col>

            <el-col :xs="24" :md="12">
              <el-alert type="warning" :closable="false">
                <template #title>
                  <span style="font-size: 16px; font-weight: bold;">⭐⭐ Regular (2)</span>
                </template>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Superó el SLA de resolución</li>
                  <li>Requiere mejoras significativas en atención</li>
                  <li>Problema resuelto pero con demoras</li>
                  <li>Comunicación deficiente</li>
                  <li><strong>🔴 Necesita capacitación urgente</strong></li>
                </ul>
              </el-alert>
            </el-col>

            <el-col :xs="24" :md="12">
              <el-alert type="error" :closable="false">
                <template #title>
                  <span style="font-size: 16px; font-weight: bold;">⭐ Malo (1)</span>
                </template>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Incumplimiento significativo del SLA</li>
                  <li>Múltiples áreas de mejora necesarias</li>
                  <li>Problema no completamente resuelto</li>
                  <li>Mala comunicación con cliente</li>
                  <li><strong>🔴 Requiere intervención gerencial inmediata</strong></li>
                </ul>
              </el-alert>
            </el-col>

            <el-col :xs="24" :md="12">
              <el-alert type="info" :closable="false">
                <template #title>
                  <span style="font-size: 16px; font-weight: bold;">❓ Pregunta Adicional</span>
                </template>
                <p style="margin: 10px 0;">Si el ticket superó el SLA, el cliente responde automáticamente:</p>
                <p style="font-style: italic; margin: 10px 0; padding: 10px 15px; background: #f0f9ff; border-left: 3px solid #0ea5e9;">
                  "¿En qué medida la demora en la resolución afectó tu operación?"
                </p>
                <p style="margin: 10px 0; font-size: 12px;">Respuestas: Mucho | Algo | Poco | Nada</p>
              </el-alert>
            </el-col>
          </el-row>

          <el-divider />

          <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :xs="24">
              <el-alert type="info" :closable="false">
                <template #title>
                  <span style="font-size: 16px; font-weight: bold;">📊 Preguntas Efectivas sobre el Técnico</span>
                </template>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>"¿El técnico fue amable y profesional?"</strong> - Evalúa actitud y comportamiento</li>
                  <li><strong>"¿Resolvió tu problema completamente?"</strong> - Mide efectividad de la solución</li>
                  <li><strong>"¿Explicó claramente la solución?"</strong> - Valora habilidades de comunicación</li>
                  <li><strong>"¿Qué mejoraría del servicio recibido?"</strong> - Recaba sugerencias constructivas</li>
                  <li><strong>"¿Recomendarías este servicio a otros?"</strong> - Mide satisfacción y lealtad</li>
                </ol>
              </el-alert>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>

    </el-tabs>

    <!-- DIÁLOGO: Nueva Encuesta -->
    <el-dialog v-model="mostrarFormulario" title="📋 Nueva Encuesta de Satisfacción" width="70%">
      <el-form :model="formularioEncuesta" label-width="180px">
        <!-- Selección de Ticket -->
        <el-form-item label="Ticket">
          <el-select v-model="formularioEncuesta.id_ticket" placeholder="Selecciona un ticket"
            @change="TicketSeleccionado">
            <el-option
              v-for="ticket in ticketsDisponibles"
              :key="ticket.id_ticket"
              :label="`#${ticket.id_ticket} - ${ticket.titulo}`"
              :value="ticket.id_ticket"
            />
          </el-select>
        </el-form-item>

        <!-- Info del Ticket -->
        <el-form-item label="Cliente">
          <el-input :model-value="ticketSeleccionadoInfo?.cliente_nombre" disabled />
        </el-form-item>
        <el-form-item label="Técnico">
          <el-input :model-value="ticketSeleccionadoInfo?.tecnico_nombre" disabled />
        </el-form-item>

        <!-- Calificación General -->
        <el-form-item label="Calificación General ⭐">
          <div style="padding: 20px; background: #f5f7fa; border-radius: 8px;">
            <el-rate v-model="formularioEncuesta.calificacion_general" :max="5" text-color="#ff9900" show-score />
            <div v-if="formularioEncuesta.calificacion_general" style="margin-top: 15px; padding: 10px; background: white; border-radius: 6px;">
              <p style="margin: 0; font-weight: bold;">{{ getCriterioCalificacion(formularioEncuesta.calificacion_general) }}</p>
            </div>
          </div>
        </el-form-item>

        <!-- Pregunta sobre Demora SLA (si aplica) -->
        <el-form-item v-if="ticketSeleccionadoInfo?.cumplimiento_sla === 'Incumplido'" label="⏰ Demora en SLA">
          <div style="padding: 15px; background: #fef3c7; border-radius: 8px;">
            <p style="margin: 0 0 15px 0; font-weight: bold;">¿En qué medida la demora en la resolución afectó tu operación?</p>
            <el-radio-group v-model="formularioEncuesta.pregunta_demora_sla">
              <el-radio label="Mucho - Afectó operaciones críticas">1</el-radio>
              <el-radio label="Algo - Causó inconvenientes moderados">2</el-radio>
              <el-radio label="Poco - Impacto mínimo">3</el-radio>
              <el-radio label="Nada - No afectó operaciones">4</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <!-- Preguntas sobre el Técnico -->
        <el-divider>❓ Preguntas sobre el Técnico</el-divider>

        <el-form-item v-for="(pregunta, idx) in preguntas" :key="pregunta.id_pregunta" :label="`${pregunta.numero_pregunta}. ${pregunta.pregunta}`">
          <el-input
            v-model="respuestasPreguntas[pregunta.id_pregunta]"
            type="textarea"
            :rows="2"
            :placeholder="`${pregunta.tipo_respuesta === 'si_no' ? 'Sí / No' : 'Tu respuesta aquí'}`"
          />
        </el-form-item>

        <!-- Comentario General -->
        <el-form-item label="Comentario Adicional">
          <el-input
            v-model="formularioEncuesta.comentario"
            type="textarea"
            :rows="3"
            placeholder="Comparte tu opinión adicional sobre nuestro servicio"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="mostrarFormulario = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarEncuesta" :loading="guardando">
          Enviar Encuesta
        </el-button>
      </template>
    </el-dialog>

    <!-- DIÁLOGO: Ver Detalles Encuesta -->
    <el-dialog v-model="mostrarDetalles" title="Detalles de Encuesta" width="70%">
      <div v-if="encuestaSeleccionada">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Cliente">{{ encuestaSeleccionada.cliente_nombre }}</el-descriptions-item>
          <el-descriptions-item label="Técnico">{{ encuestaSeleccionada.tecnico_nombre }}</el-descriptions-item>
          <el-descriptions-item label="Ticket">{{ encuestaSeleccionada.ticket_titulo }}</el-descriptions-item>
          <el-descriptions-item label="Calificación">
            <el-rate :model-value="encuestaSeleccionada.calificacion_general" disabled show-score />
          </el-descriptions-item>
          <el-descriptions-item label="Cumplimiento SLA">
            <el-tag :type="encuestaSeleccionada.cumplimiento_sla === 0 ? 'success' : 'danger'">
              {{ encuestaSeleccionada.cumplimiento_sla === 0 ? 'Cumplido' : 'Incumplido' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Fecha">{{ formatDate(encuestaSeleccionada.fecha_creacion) }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>Respuestas a Preguntas</el-divider>

        <div v-for="respuesta in encuestaSeleccionada.respuestas" :key="respuesta.id_respuesta" style="margin-bottom: 15px;">
          <p style="font-weight: bold; margin-bottom: 5px;">Pregunta {{ respuesta.numero_pregunta }}:</p>
          <el-input :model-value="respuesta.respuesta" type="textarea" :rows="2" disabled />
        </div>

        <el-divider>Comentario Adicional</el-divider>
        <el-input :model-value="encuestaSeleccionada.comentario" type="textarea" :rows="3" disabled />
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import Chart from 'chart.js/auto'

const API_URL = window.API_URL || 'http://localhost:5000'

// Estados principales
const tabActiva = ref('encuestas')
const loading = ref(false)
const loadingReporte = ref(false)
const guardando = ref(false)
const mostrarFormulario = ref(false)
const mostrarDetalles = ref(false)

// Datos
const encuestas = ref([])
const preguntas = ref([])
const tickets = ref([])
const reporteTecnicos = ref([])
const encuestaSeleccionada = ref(null)
const ticketSeleccionadoInfo = ref(null)

// Formulario
const formularioEncuesta = ref({
  id_ticket: '',
  calificacion_general: 0,
  pregunta_demora_sla: '',
  comentario: ''
})
const respuestasPreguntas = ref({})

// Chart
let chart = null
let chartNPS = null
const chartContainer = ref(null)
const npsChartContainer = ref(null)

// Distribución de calificaciones
const distribucion = computed(() => {
  const dist = { excelente: 0, muy_bueno: 0, bueno: 0, regular: 0, malo: 0 };
  encuestas.value.forEach(e => {
    if (e.calificacion_general === 5) dist.excelente++
    else if (e.calificacion_general === 4) dist.muy_bueno++
    else if (e.calificacion_general === 3) dist.bueno++
    else if (e.calificacion_general === 2) dist.regular++
    else if (e.calificacion_general === 1) dist.malo++
  });
  return dist;
})

// Promedio general
const promedioGeneral = computed(() => {
  if (encuestas.value.length === 0) return 0
  return encuestas.value.reduce((sum, e) => sum + e.calificacion_general, 0) / encuestas.value.length
})

const npsResumen = computed(() => {
  const total = encuestas.value.length
  if (total === 0) {
    return {
      total: 0,
      promotores: 0,
      pasivos: 0,
      detractores: 0,
      porcentajePromotores: 0,
      porcentajePasivos: 0,
      porcentajeDetractores: 0
    }
  }

  const promotores = encuestas.value.filter(e => e.calificacion_general === 5).length
  const pasivos = encuestas.value.filter(e => e.calificacion_general === 4).length
  const detractores = encuestas.value.filter(e => e.calificacion_general <= 3).length

  return {
    total,
    promotores,
    pasivos,
    detractores,
    porcentajePromotores: ((promotores / total) * 100).toFixed(1),
    porcentajePasivos: ((pasivos / total) * 100).toFixed(1),
    porcentajeDetractores: ((detractores / total) * 100).toFixed(1)
  }
})

const npsScore = computed(() => {
  if (npsResumen.value.total === 0) return 0
  const score = ((npsResumen.value.promotores / npsResumen.value.total) - (npsResumen.value.detractores / npsResumen.value.total)) * 100
  return Number(score.toFixed(1))
})

const npsEtiqueta = computed(() => {
  if (npsScore.value >= 50) return 'Excelente'
  if (npsScore.value >= 0) return 'Bueno'
  return 'Crítico'
})

const npsAlertType = computed(() => {
  if (npsScore.value >= 50) return 'success'
  if (npsScore.value >= 0) return 'warning'
  return 'error'
})

// Funciones auxiliares
function getPorcentaje(cantidad) {
  if (encuestas.value.length === 0) return '0'
  return ((cantidad / encuestas.value.length) * 100).toFixed(1)
}

function getPorcentajeColor(promedio) {
  const pct = (Number(promedio) / 5) * 100
  if (pct >= 80) return '#10b981'
  if (pct >= 60) return '#f97316'
  if (pct >= 40) return '#ea580c'
  return '#dc2626'
}

function getCriterioCalificacion(calificacion) {
  const criterios = {
    5: '⭐ Excelente: Resuelvor en SLA, técnico excepcional, problema completamente solucionado',
    4: '⭐ Muy Bueno: Resuelto en SLA, técnico profesional, áreas aceptables de mejora',
    3: '⭐ Bueno: Resuelto con demoras, técnico competente, algunas áreas de mejora',
    2: '⭐ Regular: Superó SLA, requiere mejoras en atención al cliente',
    1: '⭐ Malo: Superó SLA significativamente, múltiples áreas de mejora'
  };
  return criterios[calificacion] || '';
}

function abrirNuevaEncuesta() {
  formularioEncuesta.value = { id_ticket: '', calificacion_general: 0, pregunta_demora_sla: '', comentario: '' }
  respuestasPreguntas.value = {}
  ticketSeleccionadoInfo.value = null
  mostrarFormulario.value = true
}

function TicketSeleccionado(ticketId) {
  const ticket = tickets.value.find(t => t.id_ticket === ticketId)
  if (ticket) {
    ticketSeleccionadoInfo.value = ticket
    formularioEncuesta.value.id_tecnico = ticket.id_tecnico
    formularioEncuesta.value.id_cliente = ticket.id_cliente
  }
}

function filtrarTicketsPendientes() {
  ticketsDisponibles.value = tickets.value.filter(t => 
    t.estado_nombre === 'Finalizado' && !t.encuesta_enviada
  )
}

function verDetalles(encuesta) {
  encuestaSeleccionada.value = encuesta
  mostrarDetalles.value = true
}

function verDetallesTecnico(tecnico) {
  ElMessage.info(`Técnico: ${tecnico.nombre} - Promedio: ${tecnico.promedio_calificacion}`)
}

function crearGrafico() {
  nextTick(() => {
    if (!chartContainer.value) return
    if (chart) chart.destroy()

    const ctx = chartContainer.value.getContext('2d')
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Excelente (5)', 'Muy Bueno (4)', 'Bueno (3)', 'Regular (2)', 'Malo (1)'],
        datasets: [{
          data: [distribucion.value.excelente, distribucion.value.muy_bueno, distribucion.value.bueno, distribucion.value.regular, distribucion.value.malo],
          backgroundColor: ['#10b981', '#34d399', '#fbbf24', '#f97316', '#ef4444'],
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 15, font: { size: 12 } } },
          tooltip: { callbacks: { label: (c) => {
            const total = c.dataset.data.reduce((a, b) => a + b, 0)
            return `${c.label}: ${c.parsed || 0} (${((c.parsed / total) * 100).toFixed(1)}%)`
          }}}
        }
      }
    })
  })
}

function crearGraficoNPS() {
  nextTick(() => {
    if (!npsChartContainer.value) return
    if (chartNPS) chartNPS.destroy()

    const ctx = npsChartContainer.value.getContext('2d')
    chartNPS = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Promotores', 'Pasivos', 'Detractores'],
        datasets: [{
          data: [npsResumen.value.promotores, npsResumen.value.pasivos, npsResumen.value.detractores],
          backgroundColor: ['#10b981', '#fbbf24', '#ef4444'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => {
                const total = npsResumen.value.total || 1
                const porcentaje = ((c.parsed.y / total) * 100).toFixed(1)
                return `${c.label}: ${c.parsed.y} (${porcentaje}%)`
              }
            }
          }
        }
      }
    })
  })
}

async function cargarDatos() {
  loading.value = true
  try {
    const [encuestasRes, preguntasRes, ticketsRes] = await Promise.all([
      fetch(`${API_URL}/api/soporte/encuestas-satisfaccion`),
      fetch(`${API_URL}/api/soporte/preguntas-encuestas`),
      fetch(`${API_URL}/api/soporte/tickets`)
    ])

    if (!encuestasRes.ok || !preguntasRes.ok || !ticketsRes.ok) throw new Error('Error cargando datos')

    encuestas.value = await encuestasRes.json()
    preguntas.value = await preguntasRes.json()
    tickets.value = await ticketsRes.json()

    crearGrafico()
    crearGraficoNPS()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

async function cargarReporte() {
  loadingReporte.value = true
  try {
    const res = await fetch(`${API_URL}/api/soporte/reporte-calidad-tecnicos`)
    if (!res.ok) throw new Error('Error cargando reporte')
    const data = await res.json()
    reporteTecnicos.value = data.tecnicos
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loadingReporte.value = false
  }
}

async function guardarEncuesta() {
  if (!formularioEncuesta.value.id_ticket || formularioEncuesta.value.calificacion_general === 0) {
    ElMessage.warning('Selecciona ticket y calificación')
    return
  }

  guardando.value = true
  try {
    // 1. Crear encuesta principal
    const encuestaRes = await fetch(`${API_URL}/api/soporte/encuestas-satisfaccion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formularioEncuesta.value)
    })

    if (!encuestaRes.ok) throw new Error('Error guardando encuesta')
    const encuesta = await encuestaRes.json()

    // 2. Guardar respuestas a preguntas
    for (const [idPregunta, respuesta] of Object.entries(respuestasPreguntas.value)) {
      if (respuesta) {
        await fetch(`${API_URL}/api/soporte/encuestas-satisfaccion/${encuesta.id}/respuestas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numero_pregunta: parseInt(idPregunta), respuesta })
        })
      }
    }

    ElMessage.success('Encuesta enviada correctamente')
    mostrarFormulario.value = false
    await cargarDatos()
    await cargarReporte()
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    guardando.value = false
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString()
}

const ticketsDisponibles = computed(() => {
  return tickets.value.filter(t => t.estado_nombre === 'Finalizado')
})

watch(() => tabActiva.value, (newTab) => {
  if (newTab === 'calidad') cargarReporte()
})

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.encuestas-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item {
  margin-bottom: 10px;
}

.summary-box {
  padding: 15px;
  border-radius: 8px;
  color: white;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.summary-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.summary-box .count {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.summary-box .label {
  font-size: 13px;
  margin-bottom: 5px;
  opacity: 0.9;
}

.summary-box .percentage {
  font-size: 14px;
  font-weight: 600;
}

.summary-box.excelente {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.summary-box.muybueno {
  background: linear-gradient(135deg, #14b8a6 0%, #34d399 100%);
}

.summary-box.bueno {
  background: linear-gradient(135deg, #d97706 0%, #fbbf24 100%);
}

.summary-box.regular {
  background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
}

.summary-box.malo {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

/* Tarjetas de Técnicos */
.tecnico-card {
  border: 1px solid #e0e6ed;
  transition: all 0.3s ease;
}

.tecnico-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.tecnico-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.tecnico-nombre {
  font-weight: bold;
  font-size: 16px;
}

.metric {
  margin-bottom: 15px;
}

.metric-label {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.metric-value {
  text-align: right;
  font-weight: bold;
  color: #003366;
  font-size: 18px;
  margin-top: 5px;
}

.metric-small {
  text-align: center;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 6px;
}

.metric-small .label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 5px;
}

.metric-small .value {
  font-size: 18px;
  font-weight: bold;
  color: #003366;
}

.dist-box {
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  background: #f5f7fa;
}

.dist-count {
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-radius: 4px;
  color: white;
  margin-bottom: 5px;
}

.dist-count.excelente {
  background: #10b981;
}

.dist-count.muybueno {
  background: #34d399;
}

.dist-count.bueno {
  background: #fbbf24;
  color: #333;
}

.dist-count.regular {
  background: #f97316;
}

.dist-count.malo {
  background: #ef4444;
}

.dist-label {
  font-size: 11px;
  color: #606266;
  margin-top: 3px;
}
</style>
