import { useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Box, Stack, Typography, IconButton, ClickAwayListener, Popper, Paper, Checkbox } from '@mui/material'
import {
  IconTrendingUp,
  IconShoppingCart,
  IconShoppingBag,
  IconReceipt,
  IconDotsVertical,
  IconDownload,
  IconX,
  IconCalendar,
  IconChevronDown,
  IconCheck,
} from '@tabler/icons-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { KPICard } from '@features/dashboard/components/KPICard'
import { StatusBadge } from '@features/dashboard/components/StatusBadge'
import { Button } from '@features/dashboard/components/Button'
import { Input } from '@features/dashboard/components/Input'
import { DataTable } from '@features/dashboard/components/DataTable'
import { Modal } from '@features/dashboard/components/Modal'

// ============================================================
// --- Utilidades de fecha / agrupación dinámica ---
// (misma lógica que el mock original, sin cambios funcionales)
// ============================================================

const MS_DAY = 86_400_000

const DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTH_NAMES_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Formateador de dinero para los KPIs
const formatMoney = (n) => `$${n.toLocaleString('en-US')}`

function toInputValue(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromInputValue(value) {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

function formatShortDate(d) {
  return `${d.getDate()} ${MONTH_NAMES_SHORT[d.getMonth()].toLowerCase()}`
}

function daysBetweenInclusive(start, end) {
  const a = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const b = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((b.getTime() - a.getTime()) / MS_DAY) + 1
}

function getLast7DaysRange() {
  const end = new Date()
  end.setHours(0, 0, 0, 0)
  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  return { start, end }
}

// <=14 días -> "day" · 15-90 días -> "week" · >90 días -> "month"
function getGroupingMode(start, end) {
  const days = daysBetweenInclusive(start, end)
  if (days <= 14) return 'day'
  if (days <= 90) return 'week'
  return 'month'
}

function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function dateSeed(d) {
  return d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate()
}

function generateDayRecord(date) {
  const dow = date.getDay()
  const seed = dateSeed(date)
  const weekendBoost = dow === 0 || dow === 6 ? 18000 : dow === 5 ? 9000 : 0
  const base = 32000 + weekendBoost
  const variance = (pseudoRandom(seed) - 0.5) * 16000
  const ventas = Math.max(8000, Math.round(base + variance))

  const comprasBase = 19000 + (pseudoRandom(seed + 7) - 0.5) * 9000
  const monthTrend = date.getMonth() * 250
  const compras = Math.max(6000, Math.round(comprasBase + monthTrend))

  return { date: new Date(date), ventas, compras }
}

function buildDailySeries(start, end) {
  const series = []
  const cur = new Date(start)
  while (cur.getTime() <= end.getTime()) {
    series.push(generateDayRecord(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return series
}

function aggregateByDay(days) {
  return days.map((d) => ({ name: `${DAY_NAMES_SHORT[d.date.getDay()]} ${d.date.getDate()}`, ventas: d.ventas, compras: d.compras }))
}

function aggregateByWeek(days) {
  if (days.length === 0) return []
  const startTime = days[0].date.getTime()
  const buckets = new Map()
  days.forEach((d) => {
    const weekIdx = Math.floor((d.date.getTime() - startTime) / (7 * MS_DAY))
    const existing = buckets.get(weekIdx)
    if (existing) {
      existing.ventas += d.ventas
      existing.compras += d.compras
    } else {
      buckets.set(weekIdx, { name: `Semana ${weekIdx + 1}`, ventas: d.ventas, compras: d.compras })
    }
  })
  return Array.from(buckets.entries()).sort((a, b) => a[0] - b[0]).map(([, v]) => v)
}

function aggregateByMonth(days) {
  if (days.length === 0) return []
  const buckets = new Map()
  days.forEach((d) => {
    const key = `${d.date.getFullYear()}-${d.date.getMonth()}`
    const order = d.date.getFullYear() * 12 + d.date.getMonth()
    const existing = buckets.get(key)
    if (existing) {
      existing.ventas += d.ventas
      existing.compras += d.compras
    } else {
      buckets.set(key, { name: MONTH_NAMES_SHORT[d.date.getMonth()], ventas: d.ventas, compras: d.compras, order })
    }
  })
  const arr = Array.from(buckets.values()).sort((a, b) => a.order - b.order)
  const years = new Set(arr.map((m) => Math.floor(m.order / 12)))
  return arr.map((m) => ({
    name: years.size > 1 ? `${m.name} ${String(Math.floor(m.order / 12)).slice(-2)}` : m.name,
    ventas: m.ventas,
    compras: m.compras,
  }))
}

function aggregateSeries(days, grouping) {
  if (grouping === 'day') return aggregateByDay(days)
  if (grouping === 'week') return aggregateByWeek(days)
  return aggregateByMonth(days)
}

const GROUPING_LABEL = { day: 'diaria', week: 'semanal', month: 'mensual' }

// ============================================================
// --- Datos estáticos restantes ---
// ============================================================

const recentOrders = [
  { id: '#2851', cliente: 'María López', productos: 'Pan integral ×3, Croissant ×2', total: '$285.00', estado: 'completado', hora: '09:42' },
  { id: '#2850', cliente: 'Carlos Ruiz', productos: 'Pastel de chocolate (1kg)', total: '$520.00', estado: 'en proceso', hora: '09:35' },
  { id: '#2849', cliente: 'Ana García', productos: 'Galletas surtidas ×4', total: '$160.00', estado: 'completado', hora: '09:18' },
  { id: '#2848', cliente: 'José Martínez', productos: 'Baguette ×2, Empanadas ×6', total: '$340.00', estado: 'pendiente', hora: '09:05' },
  { id: '#2847', cliente: 'Laura Sánchez', productos: 'Torta de jamón, Café americano', total: '$185.00', estado: 'completado', hora: '08:52' },
  { id: '#2846', cliente: 'Pedro Flores', productos: 'Donas glaseadas ×12', total: '$210.00', estado: 'cancelado', hora: '08:40' },
]

const estadoVariant = {
  completado: 'success',
  'en proceso': 'accent',
  pendiente: 'warning',
  cancelado: 'danger',
}

const topProducts = [
  { name: 'Pan integral', unidades: 847, ingresos: '$12,705', tendencia: 12 },
  { name: 'Pastel chocolate', unidades: 234, ingresos: '$9,360', tendencia: 8 },
  { name: 'Croissant mantequilla', unidades: 612, ingresos: '$7,650', tendencia: 5 },
  { name: 'Empanada queso', unidades: 490, ingresos: '$5,880', tendencia: -3 },
  { name: 'Galletas surtidas', unidades: 380, ingresos: '$4,180', tendencia: 14 },
]

const orderColumns = [
  { key: 'id', header: 'Pedido', accessor: (r) => <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: 'text.primary' }}>{r.id}</Typography> },
  { key: 'cliente', header: 'Cliente', accessor: (r) => <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{r.cliente}</Typography> },
  { key: 'productos', header: 'Productos', accessor: (r) => <Typography sx={{ fontSize: 12, color: 'text.dim' }}>{r.productos}</Typography> },
  { key: 'total', header: 'Total', align: 'right', accessor: (r) => <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{r.total}</Typography> },
  { key: 'estado', header: 'Estado', accessor: (r) => <StatusBadge variant={estadoVariant[r.estado]} dot>{r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}</StatusBadge> },
  { key: 'hora', header: 'Hora', align: 'right', accessor: (r) => <Typography sx={{ fontSize: 12, color: 'text.dim' }}>{r.hora}</Typography> },
]

const MODULES = [
  { id: 'ventas', label: 'Ventas' },
  { id: 'produccion', label: 'Producción' },
  { id: 'compras', label: 'Compras' },
  { id: 'insumos', label: 'Insumos' },
  { id: 'productos', label: 'Productos' },
]

// Módulos que no se pueden incluir en la exportación
const DISABLED_MODULES = ['usuarios', 'proveedores']
const SELECTABLE_MODULES = MODULES.filter((m) => !DISABLED_MODULES.includes(m.id))

const dimLabelSx = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.dim' }

// ── Tarjeta contenedora de gráficas (equivalente a ChartWrapper) ─────────

function ChartCard({ title, subtitle, height = 260, children }) {
  return (
    <Box sx={{ borderRadius: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 2.5 }}>
      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
        {subtitle && <Typography sx={{ fontSize: 12, color: 'text.dim', mt: 0.25 }}>{subtitle}</Typography>}
      </Box>
      <Box sx={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

// ── Modal de exportación ─────────────────────────────────────────────────

function ExportModal({ open, onClose, onExport }) {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [selectedModules, setSelectedModules] = useState([])
  const [formato, setFormato] = useState('excel')

  const toggleModule = (id) => {
    if (DISABLED_MODULES.includes(id)) return
    setSelectedModules((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelectedModules(selectedModules.length === SELECTABLE_MODULES.length ? [] : SELECTABLE_MODULES.map((m) => m.id))
  }

  const canExport = fechaInicio && fechaFin && selectedModules.length > 0

  return (
    <Modal open={open} onClose={onClose} title="Exportar reporte" size="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box>
          <Typography sx={{ ...dimLabelSx, mb: 1.25 }}>Rango de fechas</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: 11, color: 'text.dim' }}>Fecha inicio</Typography>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: 11, color: 'text.dim' }}>Fecha fin</Typography>
              <Input type="date" value={fechaFin} min={fechaInicio} onChange={(e) => setFechaFin(e.target.value)} />
            </Box>
          </Box>
        </Box>

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
            <Typography sx={dimLabelSx}>Módulos</Typography>
            <Box component="button" onClick={toggleAll} sx={{ fontSize: 11, color: 'primary.main', background: 'none', border: 'none', cursor: 'pointer' }}>
              {selectedModules.length === SELECTABLE_MODULES.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </Box>
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {MODULES.map((mod) => {
              const active = selectedModules.includes(mod.id)
              const disabled = DISABLED_MODULES.includes(mod.id)
              return (
                <Box
                  key={mod.id}
                  component="button"
                  onClick={() => toggleModule(mod.id)}
                  disabled={disabled}
                  title={disabled ? 'Este módulo no está disponible para exportar' : undefined}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: disabled ? 'divider' : active ? 'primary.main' : 'divider',
                    bgcolor: !disabled && active ? 'action.selected' : 'background.paper',
                    color: disabled ? 'text.dim' : active ? 'primary.main' : 'text.secondary',
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    textAlign: 'left',
                  }}
                >
                  <Checkbox
                    checked={active && !disabled}
                    disabled={disabled}
                    size="small"
                    sx={{ p: 0 }}
                    checkedIcon={<IconCheck size={14} />}
                  />
                  {mod.label}
                </Box>
              )
            })}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ ...dimLabelSx, mb: 1.25 }}>Formato</Typography>
          <Stack direction="row" spacing={1}>
            {['excel', 'pdf'].map((fmt) => (
              <Box
                key={fmt}
                component="button"
                onClick={() => setFormato(fmt)}
                sx={{
                  flex: 1,
                  py: 1,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: formato === fmt ? 'primary.main' : 'divider',
                  bgcolor: formato === fmt ? 'action.selected' : 'background.paper',
                  color: formato === fmt ? 'primary.main' : 'text.dim',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {fmt === 'excel' ? 'Excel (.xlsx)' : 'PDF'}
              </Box>
            ))}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
          <Button variant="secondary" size="sm" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" fullWidth disabled={!canExport} leftIcon={<IconDownload size={14} />} onClick={() => onExport?.()}>
            Exportar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

// ── Panel de filtro por fecha (dropdown anclado al botón) ────────────────

function FilterPanel({ anchorEl, onClose, initialRange, onApply, onReset }) {
  const [tempStart, setTempStart] = useState(toInputValue(initialRange.start))
  const [tempEnd, setTempEnd] = useState(toInputValue(initialRange.end))

  const canApply = tempStart && tempEnd && fromInputValue(tempStart).getTime() <= fromInputValue(tempEnd).getTime()

  const handleApply = () => {
    if (!canApply) return
    onApply({ start: fromInputValue(tempStart), end: fromInputValue(tempEnd) })
  }

  return (
    <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-end" sx={{ zIndex: 50 }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ width: 320, borderRadius: 2, border: '1px solid', borderColor: 'divider', mt: 1 }} elevation={4}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Filtrar por fecha</Typography>
            <Typography sx={{ fontSize: 11, color: 'text.dim', mt: 0.25 }}>
              Las gráficas se agrupan automáticamente según el rango
            </Typography>
          </Box>

          <Box sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: 11, color: 'text.dim' }}>Desde</Typography>
                <Input type="date" value={tempStart} onChange={(e) => setTempStart(e.target.value)} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: 11, color: 'text.dim' }}>Hasta</Typography>
                <Input type="date" value={tempEnd} min={tempStart} onChange={(e) => setTempEnd(e.target.value)} />
              </Box>
            </Box>
            {!canApply && (
              <Typography sx={{ fontSize: 11, color: 'error.main' }}>Selecciona un rango de fechas válido</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1} sx={{ px: 2.5, pb: 2 }}>
            <Button variant="secondary" size="sm" fullWidth onClick={onReset}>
              Restablecer (últimos 7 días)
            </Button>
            <Button variant="primary" size="sm" fullWidth disabled={!canApply} onClick={handleApply}>
              Aplicar
            </Button>
          </Stack>
        </Paper>
      </ClickAwayListener>
    </Popper>
  )
}

// ── Toast flotante de exportación ─────────────────────────────────────────

function ExportToast({ open }) {
  if (!open) return null

  return (
    <Box
      role="status"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1400,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        minWidth: 300,
        maxWidth: 380,
        px: 2.25,
        py: 1.75,
        borderRadius: 2,
        bgcolor: '#E4F3F4',
        boxShadow: '0 10px 28px rgba(15, 61, 66, 0.18)',
        animation: 'exportToastIn 0.25s ease-out',
        '@keyframes exportToastIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ width: 8, height: 8, mt: 0.7, borderRadius: '50%', bgcolor: '#12767F', flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0F3238', lineHeight: 1.3 }}>
          Reporte generado
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: '#3E6468', mt: 0.25, lineHeight: 1.4 }}>
          El reporte de producción está listo para descargar
        </Typography>
      </Box>
    </Box>
  )
}

// ── Página principal ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const theme = useTheme()
  const [showExport, setShowExport] = useState(false)
  const [filterAnchor, setFilterAnchor] = useState(null)
  const [dateRange, setDateRange] = useState(() => getLast7DaysRange())
  const [showNotificacion, setShowNotificacion] = useState(false)

  const handleExport = () => {
    setShowExport(false)
    setShowNotificacion(true)
    setTimeout(() => setShowNotificacion(false), 4000)
  }

  const grouping = useMemo(() => getGroupingMode(dateRange.start, dateRange.end), [dateRange])

  const aggregated = useMemo(() => {
    const daily = buildDailySeries(dateRange.start, dateRange.end)
    return aggregateSeries(daily, grouping)
  }, [dateRange, grouping])

  // KPI: total de compras según el rango de fechas activo
  const totalCompras = useMemo(
    () => aggregated.reduce((acc, item) => acc + item.compras, 0),
    [aggregated]
  )

  // KPI: resumen de pedidos recientes
  const pedidosCompletados = recentOrders.filter((o) => o.estado === 'completado').length
  const pedidosEnCurso = recentOrders.filter((o) => o.estado === 'pendiente' || o.estado === 'en proceso').length

  const groupingLabel = GROUPING_LABEL[grouping]
  const filterLabel = `${formatShortDate(dateRange.start)} - ${formatShortDate(dateRange.end)}`

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1.5 }}>
      {/* Barra superior */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>Panel general</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.dim', mt: 0.25 }}>Resumen de operaciones</Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 'auto' }}>
          <Button
            variant={filterAnchor ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={<IconCalendar size={14} />}
            onClick={(e) => setFilterAnchor(filterAnchor ? null : e.currentTarget)}
          >
            {filterLabel}
            <IconChevronDown size={13} style={{ marginLeft: 4 }} />
          </Button>

          {filterAnchor && (
            <FilterPanel
              anchorEl={filterAnchor}
              onClose={() => setFilterAnchor(null)}
              initialRange={dateRange}
              onApply={(range) => {
                setDateRange(range)
                setFilterAnchor(null)
              }}
              onReset={() => {
                setDateRange(getLast7DaysRange())
                setFilterAnchor(null)
              }}
            />
          )}

          <Button variant="secondary" size="sm" leftIcon={<IconDownload size={14} />} onClick={() => setShowExport(true)}>
            Exportar
            <IconChevronDown size={13} style={{ marginLeft: 4 }} />
          </Button>
        </Stack>
      </Stack>

      {/* KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', xl: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <KPICard
          title="Total ventas del mes"
          value="$319,330"
          subtitle="Actualizado hace 2 min"
          icon={<IconTrendingUp size={16} />}
          variant="accent"
        />
        <KPICard
          title="Pedidos activos"
          value="127"
          subtitle="34 listos para entrega"
          icon={<IconShoppingCart size={16} />}
          variant="success"
        />
        <KPICard
          title="Compras del período"
          value={formatMoney(totalCompras)}
          subtitle={filterLabel}
          icon={<IconShoppingBag size={16} />}
          variant="warning"
        />
        <KPICard
          title="Pedidos recientes"
          value={String(recentOrders.length)}
          subtitle={`${pedidosCompletados} completados · ${pedidosEnCurso} en curso`}
          icon={<IconReceipt size={16} />}
          variant="accent"
        />
      </Box>

      {/* Ingresos */}
      <ChartCard title="Ingresos" subtitle={`Vista ${groupingLabel} — ${filterLabel}`}>
        <AreaChart data={aggregated}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area type="monotone" dataKey="ventas" strokeWidth={2} fillOpacity={0.15} />
        </AreaChart>
      </ChartCard>

      {/* Compras + Top productos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' }, gap: 2 }}>
        <ChartCard title="Compras" subtitle={`Vista ${groupingLabel} — ${filterLabel}`}>
          <BarChart data={aggregated}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="compras" radius={[4, 4, 0, 0]} fill={theme.palette.primary.main} />
          </BarChart>
        </ChartCard>

        <Box sx={{ borderRadius: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Más vendidos</Typography>
              <Typography sx={{ fontSize: 11, color: 'text.dim', mt: 0.25 }}>Este mes</Typography>
            </Box>
            <IconButton size="small" sx={{ color: 'text.dim' }}>
              <IconDotsVertical size={16} />
            </IconButton>
          </Stack>

          {topProducts.map((p, i) => (
            <Stack
              key={p.name}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  bgcolor: i === 0 ? 'action.selected' : 'action.hover',
                  color: i === 0 ? 'primary.main' : 'text.dim',
                }}
              >
                {i + 1}
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: 13, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.dim' }}>{p.unidades} uds.</Typography>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{p.ingresos}</Typography>
                <Typography sx={{ fontSize: 11, color: p.tendencia >= 0 ? 'success.main' : 'error.main' }}>
                  {p.tendencia >= 0 ? '+' : ''}{p.tendencia}%
                </Typography>
              </Box>
            </Stack>
          ))}
        </Box>
      </Box>

      {/* Pedidos recientes */}
      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Pedidos recientes</Typography>
        </Box>
        <DataTable columns={orderColumns} data={recentOrders} keyExtractor={(r) => r.id} emptyMessage="Sin pedidos recientes" />
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 1, pt: 2, pb: 2, textAlign: 'center', fontSize: 11, color: 'text.dim', borderTop: '1px solid', borderColor: 'divider' }}>
        © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
      </Box>

      {/* Toast de reporte generado (4s) */}
      <ExportToast open={showNotificacion} />

      {/* Modal de exportación */}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} onExport={handleExport} />
    </Box>
  )
}