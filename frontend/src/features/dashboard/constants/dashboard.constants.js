// Constantes y catálogos del dominio "dashboard".
// Son valores fijos (no datos de ejemplo): rangos, agrupación, estados, módulos exportables.

export const MS_DAY = 86_400_000

// Rango que se muestra al entrar (y al "Restablecer")
export const DIAS_RANGO_INICIAL = 7

export const CHART_HEIGHT = 260

// Duración (ms) de las notificaciones de confirmación
export const NOTIF_DURATION = 4000

export const NOMBRES_DIA_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
export const NOMBRES_MES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// ---------- Agrupación de las gráficas según el tamaño del rango ----------
// <= 14 días → por día · 15-90 días → por semana · > 90 días → por mes
export const AGRUPACION = { DIA: 'dia', SEMANA: 'semana', MES: 'mes' }
export const MAX_DIAS_AGRUPACION_DIARIA = 14
export const MAX_DIAS_AGRUPACION_SEMANAL = 90

export const agrupacionLabel = {
  [AGRUPACION.DIA]: 'diaria',
  [AGRUPACION.SEMANA]: 'semanal',
  [AGRUPACION.MES]: 'mensual',
}

// ---------- Pedidos ----------
export const ESTADO_PEDIDO = {
  COMPLETADO: 'completado',
  EN_PROCESO: 'en proceso',
  PENDIENTE: 'pendiente',
  CANCELADO: 'cancelado',
}

// Variante de <StatusBadge> según el estado del pedido
export const estadoPedidoVariant = {
  [ESTADO_PEDIDO.COMPLETADO]: 'success',
  [ESTADO_PEDIDO.EN_PROCESO]: 'process',
  [ESTADO_PEDIDO.PENDIENTE]: 'warning',
  [ESTADO_PEDIDO.CANCELADO]: 'danger',
}

// ---------- Exportación de reportes ----------
// Solo se listan los módulos que se pueden exportar (usuarios y proveedores no están disponibles).
export const MODULOS_EXPORTABLES = [
  { id: 'ventas', label: 'Ventas' },
  { id: 'produccion', label: 'Producción' },
  { id: 'compras', label: 'Compras' },
  { id: 'insumos', label: 'Insumos' },
  { id: 'productos', label: 'Productos' },
]

export const FORMATOS_EXPORTACION = [
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF' },
]

// Valores mientras carga el resumen
export const KPIS_VACIOS = {
  ventasDelMes: 0,
  pedidosActivos: 0,
  pedidosListos: 0,
  minutosDesdeActualizacion: 0,
}
