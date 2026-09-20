import { useState, useMemo } from 'react'
import { Box, Stack, Typography, IconButton, Divider, Collapse, OutlinedInput, InputAdornment } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  IconSearch,
  IconPlus,
  IconMinus,
  IconFilter,
  IconX,
  IconEye,
  IconPencil,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { KPICard } from '@features/produccion/components/KPICard'
import { StatusBadge } from '@features/produccion/components/StatusBadge'
import { Button } from '@features/produccion/components/Button'
import { Input } from '@features/produccion/components/Input'
import { Select } from '@features/produccion/components/Select'
import { DataTable } from '@features/produccion/components/DataTable'
import { Pagination } from '@features/produccion/components/Pagination'
import { Modal } from '@features/produccion/components/Modal'

// Receta de insumos por producto: cuánto de cada insumo se necesita por unidad producida.
// En una integración real esto vendría de la base de datos de formulaciones.
const recetasProductos = {
  Jugo: [
    { nombre: 'Fruta (naranja)', cantidad: 0.3, unidad: 'kg' },
    { nombre: 'Azúcar', cantidad: 0.02, unidad: 'kg' },
    { nombre: 'Agua', cantidad: 0.15, unidad: 'l' },
  ],
  Pan: [
    { nombre: 'Harina de trigo', cantidad: 0.1, unidad: 'kg' },
    { nombre: 'Levadura', cantidad: 0.005, unidad: 'kg' },
    { nombre: 'Sal', cantidad: 0.002, unidad: 'kg' },
    { nombre: 'Mantequilla', cantidad: 0.01, unidad: 'kg' },
  ],
  'Palito Q': [
    { nombre: 'Harina de maíz', cantidad: 0.08, unidad: 'kg' },
    { nombre: 'Queso en polvo', cantidad: 0.03, unidad: 'kg' },
    { nombre: 'Aceite vegetal', cantidad: 0.005, unidad: 'l' },
    { nombre: 'Sal', cantidad: 0.002, unidad: 'kg' },
  ],
  'Palito G': [
    { nombre: 'Harina de maíz', cantidad: 0.12, unidad: 'kg' },
    { nombre: 'Queso en polvo', cantidad: 0.04, unidad: 'kg' },
    { nombre: 'Aceite vegetal', cantidad: 0.008, unidad: 'l' },
    { nombre: 'Sal', cantidad: 0.003, unidad: 'kg' },
  ],
  'Pastel P': [
    { nombre: 'Harina de trigo', cantidad: 0.15, unidad: 'kg' },
    { nombre: 'Huevo', cantidad: 0.05, unidad: 'kg' },
    { nombre: 'Azúcar', cantidad: 0.08, unidad: 'kg' },
    { nombre: 'Mantequilla', cantidad: 0.06, unidad: 'kg' },
  ],
  'Pastel H': [
    { nombre: 'Harina de trigo', cantidad: 0.15, unidad: 'kg' },
    { nombre: 'Huevo', cantidad: 0.05, unidad: 'kg' },
    { nombre: 'Azúcar', cantidad: 0.08, unidad: 'kg' },
    { nombre: 'Chocolate', cantidad: 0.07, unidad: 'kg' },
    { nombre: 'Mantequilla', cantidad: 0.04, unidad: 'kg' },
  ],
  'Pastel A': [
    { nombre: 'Harina de trigo', cantidad: 0.15, unidad: 'kg' },
    { nombre: 'Huevo', cantidad: 0.05, unidad: 'kg' },
    { nombre: 'Arequipe', cantidad: 0.09, unidad: 'kg' },
    { nombre: 'Mantequilla', cantidad: 0.04, unidad: 'kg' },
  ],
  'Palito GQ': [
    { nombre: 'Harina de maíz', cantidad: 0.1, unidad: 'kg' },
    { nombre: 'Queso en polvo', cantidad: 0.05, unidad: 'kg' },
    { nombre: 'Aceite vegetal', cantidad: 0.006, unidad: 'l' },
    { nombre: 'Sal', cantidad: 0.002, unidad: 'kg' },
    { nombre: 'Ajo en polvo', cantidad: 0.001, unidad: 'kg' },
  ],
}

// Calcula el total consolidado de insumos para todos los ítems de una orden,
// sumando insumos iguales entre productos distintos.
const calcularInsumos = (items) => {
  const acumulado = {}
  for (const item of items) {
    const receta = recetasProductos[item.nombre]
    if (!receta) continue
    for (const insumo of receta) {
      const total = insumo.cantidad * item.cantidad
      if (acumulado[insumo.nombre]) {
        acumulado[insumo.nombre].cantidad += total
      } else {
        acumulado[insumo.nombre] = { cantidad: total, unidad: insumo.unidad }
      }
    }
  }
  return Object.entries(acumulado).map(([nombre, { cantidad, unidad }]) => ({ nombre, cantidad, unidad }))
}

// Catálogo de productos disponibles para armar una orden (panel "Nueva orden" / "Editar").
const catalogoProductos = ['Jugo', 'Pan', 'Palito Q', 'Palito G', 'Pastel P', 'Pastel H', 'Pastel A', 'Palito GQ']

// Usuario actualmente autenticado en el sistema (operador que registra la orden manualmente
// desde este panel). En una integración real este dato debe obtenerse del contexto de
// autenticación / sesión activa, no de un valor fijo como aquí.
const usuarioAutenticado = { nombre: 'Andrea Gómez', nit: '1020304050' }

const initialOrdenes = [
  {
    id: 'OP-001',
    producto: 'Manual',
    items: [
      { nombre: 'Pan', cantidad: 3 },
      { nombre: 'Palito G', cantidad: 2 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 05:30',
    fechaFabricacion: '20/06/2026 06:15',
    estado: 'completado',
    generadoPor: { nombre: 'Andrea Gómez', documento: '1020304050' },
  },
  {
    id: 'OP-002',
    producto: 'Pagina',
    items: [
      { nombre: 'Pastel A', cantidad: 20 },
      { nombre: 'Pastel P', cantidad: 10 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 06:00',
    fechaFabricacion: '20/06/2026 07:30',
    estado: 'completado',
    generadoPor: { nombre: 'Camila Restrepo', documento: '1098765432' },
    ventaId: '#2210',
  },
  {
    id: 'OP-003',
    producto: 'Manual',
    items: [{ nombre: 'Palito G', cantidad: 15 }],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 07:00',
    fechaFabricacion: '',
    estado: 'en proceso',
    generadoPor: { nombre: 'Andrea Gómez', documento: '1020304050' },
  },
  {
    id: 'OP-004',
    producto: 'Manual',
    items: [
      { nombre: 'Jugo', cantidad: 10 },
      { nombre: 'Palito Q', cantidad: 10 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 08:30',
    fechaFabricacion: '',
    estado: 'en proceso',
    generadoPor: { nombre: 'Juan Pablo Restrepo', documento: '1015223344' },
  },
  {
    id: 'OP-005',
    producto: 'Pagina',
    items: [
      { nombre: 'Pastel H', cantidad: 40 },
      { nombre: 'Palito GQ', cantidad: 20 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 09:00',
    fechaFabricacion: '',
    estado: 'pendiente',
    generadoPor: { nombre: 'Laura Jiménez', documento: '43215678' },
    ventaId: '#2210',
  },
  {
    id: 'OP-006',
    producto: 'Manual',
    items: [{ nombre: 'Palito Q', cantidad: 30 }],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 09:30',
    fechaFabricacion: '20/06/2026 12:00',
    estado: 'retrasado',
    generadoPor: { nombre: 'Andrea Gómez', documento: '1020304050' },
  },
  {
    id: 'OP-007',
    producto: 'Pagina',
    items: [
      { nombre: 'Palito GQ', cantidad: 20 },
      { nombre: 'Pastel H', cantidad: 20 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 10:00',
    fechaFabricacion: '',
    estado: 'pendiente',
    generadoPor: { nombre: 'Mateo Salazar', documento: '71234567' },
    ventaId: '#2210',
  },
  {
    id: 'OP-008',
    producto: 'Manual',
    items: [
      { nombre: 'Jugo', cantidad: 6 },
      { nombre: 'Palito Q', cantidad: 4 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 11:00',
    fechaFabricacion: '',
    estado: 'pendiente',
    generadoPor: { nombre: 'Andrea Gómez', documento: '1020304050' },
  },
]

const estadoVariant = {
  completado: 'success',
  'en proceso': 'accent',
  pendiente: 'warning',
  retrasado: 'danger',
  cancelado: 'danger',
}

const estadoOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en proceso', label: 'En proceso' },
  { value: 'completado', label: 'Completado' },
  { value: 'retrasado', label: 'Retrasado' },
  { value: 'cancelado', label: 'Cancelado' },
]

// "completado" y "cancelado" son estados finales: una vez que una orden llega a alguno de
// los dos, la orden completa (estado e ítems) queda bloqueada y ya no se puede modificar.
const esEstadoFinal = (estado) => estado === 'completado' || estado === 'cancelado'

// Calcula el estado "efectivo" de una orden para mostrar en pantalla: si la orden lleva
// 2 días o más desde su fecha de solicitud y todavía no llegó a un estado final, se
// considera "retrasado" automáticamente (sin necesidad de que alguien la edite a mano).
const DOS_DIAS_MS = 2 * 24 * 60 * 60 * 1000
const estadoEfectivo = (orden) => {
  if (esEstadoFinal(orden.estado)) return orden.estado
  const solicitada = parseFechaSolicitud(orden.fechaSolicitud)
  const transcurrido = Date.now() - solicitada.getTime()
  if (transcurrido >= DOS_DIAS_MS) return 'retrasado'
  return orden.estado
}

const totalCantidad = (orden) => orden.items.reduce((s, i) => s + i.cantidad, 0)

const formatFecha = (d) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Convierte "DD/MM/YYYY HH:mm" a un Date real para poder comparar contra una franja de fechas.
function parseFechaSolicitud(fecha) {
  const [datePart, timePart] = fecha.split(' ')
  const [d, m, y] = datePart.split('/').map(Number)
  const [hh, mm] = (timePart || '00:00').split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

const PAGE_SIZE = 6

// dimLabelSx se mantiene para las etiquetas dentro de los modales de detalle
// (no forman parte del panel de filtros, así que no se homologan con FilterLabel).
const dimLabelSx = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.dim' }

// Mismo helper de etiqueta que usa VentasPage para el panel de filtros.
function FilterLabel({ children }) {
  return (
    <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
      {children}
    </Typography>
  )
}

export default function ProduccionPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [ordenes, setOrdenes] = useState(initialOrdenes)
  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [page, setPage] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [insumosAbiertos, setInsumosAbiertos] = useState(false)

  const [showFiltros, setShowFiltros] = useState(false)
  const [origenFilter, setOrigenFilter] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [cantidadMin, setCantidadMin] = useState('')
  const [cantidadMax, setCantidadMax] = useState('')

  const [deleteId, setDeleteId] = useState(null)

  const [estadoEditId, setEstadoEditId] = useState(null)
  const [estadoEditValue, setEstadoEditValue] = useState('pendiente')

  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderModalMode, setOrderModalMode] = useState('nueva')
  const [editingId, setEditingId] = useState(null)
  const [editingOrden, setEditingOrden] = useState(null)
  const [formItems, setFormItems] = useState([])
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('pendiente')
  const [productoBusqueda, setProductoBusqueda] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1)
  const [formId, setFormId] = useState('')
  const [formFechaSolicitud, setFormFechaSolicitud] = useState('')

  const handleEliminar = (id) => {
    setOrdenes((prev) => prev.filter((o) => o.id !== id))
  }

  const filtered = useMemo(() => {
    let data = ordenes
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (o) =>
          o.producto.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.generadoPor.documento.toLowerCase().includes(q) ||
          o.items.some((i) => i.nombre.toLowerCase().includes(q))
      )
    }
    if (estadoFilter) data = data.filter((o) => estadoEfectivo(o) === estadoFilter)
    if (origenFilter) data = data.filter((o) => o.producto === origenFilter)
    if (fechaDesde) {
      const desde = new Date(`${fechaDesde}T00:00:00`)
      data = data.filter((o) => parseFechaSolicitud(o.fechaSolicitud) >= desde)
    }
    if (fechaHasta) {
      const hasta = new Date(`${fechaHasta}T23:59:59`)
      data = data.filter((o) => parseFechaSolicitud(o.fechaSolicitud) <= hasta)
    }
    if (cantidadMin !== '') {
      const min = parseInt(cantidadMin, 10)
      if (!isNaN(min)) data = data.filter((o) => totalCantidad(o) >= min)
    }
    if (cantidadMax !== '') {
      const max = parseInt(cantidadMax, 10)
      if (!isNaN(max)) data = data.filter((o) => totalCantidad(o) <= max)
    }
    return data
  }, [ordenes, search, estadoFilter, origenFilter, fechaDesde, fechaHasta, cantidadMin, cantidadMax])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const filtrosActivos = Boolean(estadoFilter || origenFilter || fechaDesde || fechaHasta || cantidadMin || cantidadMax)
  const cantidadFiltrosActivos = [estadoFilter, origenFilter, fechaDesde, fechaHasta, cantidadMin, cantidadMax].filter(Boolean).length

  const limpiarFiltros = () => {
    setEstadoFilter('')
    setOrigenFilter('')
    setFechaDesde('')
    setFechaHasta('')
    setCantidadMin('')
    setCantidadMax('')
    setPage(1)
  }

  const completados = ordenes.filter((o) => estadoEfectivo(o) === 'completado').length
  const retrasados = ordenes.filter((o) => estadoEfectivo(o) === 'retrasado').length

  const productosFiltrados = useMemo(
    () => catalogoProductos.filter((p) => p.toLowerCase().includes(productoBusqueda.toLowerCase())),
    [productoBusqueda]
  )

  const resetFormulario = () => {
    setProductoBusqueda('')
    setProductoSeleccionado('')
    setCantidadSeleccionada(1)
    setFormItems([])
    setEstadoSeleccionado('pendiente')
  }

  const nextId = () => {
    const maxNum = ordenes.reduce((max, o) => Math.max(max, parseInt(o.id.replace(/\D/g, ''), 10) || 0), 0)
    return `OP-${String(maxNum + 1).padStart(3, '0')}`
  }

  const handleNuevaOrden = () => {
    setOrderModalMode('nueva')
    setEditingId(null)
    setEditingOrden(null)
    resetFormulario()
    setFormId(nextId())
    setFormFechaSolicitud(formatFecha(new Date()))
    setShowOrderModal(true)
  }

  const handleEditar = (orden) => {
    if (esEstadoFinal(orden.estado)) return
    setOrderModalMode('editar')
    setEditingId(orden.id)
    setEditingOrden(orden)
    setProductoBusqueda('')
    setProductoSeleccionado('')
    setCantidadSeleccionada(1)
    setFormItems(orden.items.map((i) => ({ ...i })))
    setEstadoSeleccionado(orden.estado)
    setShowOrderModal(true)
  }

  const handleVerDetalle = (orden) => {
    setSelected(orden)
    setInsumosAbiertos(false)
    setShowModal(true)
  }

  const handleAgregarProducto = () => {
    if (!productoSeleccionado || cantidadSeleccionada <= 0) return
    setFormItems((prev) => {
      const existente = prev.find((i) => i.nombre === productoSeleccionado)
      if (existente) {
        return prev.map((i) =>
          i.nombre === productoSeleccionado ? { ...i, cantidad: i.cantidad + cantidadSeleccionada } : i
        )
      }
      return [...prev, { nombre: productoSeleccionado, cantidad: cantidadSeleccionada }]
    })
    setProductoBusqueda('')
    setProductoSeleccionado('')
    setCantidadSeleccionada(1)
  }

  const handleQuitarProducto = (nombre) => {
    setFormItems((prev) => prev.filter((i) => i.nombre !== nombre))
  }

  const handleActualizarCantidad = (nombre, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleQuitarProducto(nombre)
      return
    }
    setFormItems((prev) => prev.map((i) => (i.nombre === nombre ? { ...i, cantidad: nuevaCantidad } : i)))
  }

  const handleConfirmarOrden = () => {
    if (formItems.length === 0) return
    if (orderModalMode === 'nueva') {
      const nuevaOrden = {
        id: formId,
        producto: 'Manual',
        items: formItems,
        unidad: 'piezas',
        fechaSolicitud: formFechaSolicitud,
        fechaFabricacion: '',
        estado: 'pendiente',
        generadoPor: { nombre: usuarioAutenticado.nombre, documento: usuarioAutenticado.nit },
      }
      setOrdenes((prev) => [nuevaOrden, ...prev])
    } else if (editingId) {
      setOrdenes((prev) =>
        prev.map((o) => {
          if (o.id !== editingId) return o
          if (esEstadoFinal(o.estado)) return o
          return {
            ...o,
            items: formItems,
            estado: estadoSeleccionado,
            fechaFabricacion: estadoSeleccionado === 'completado' && !o.fechaFabricacion ? formatFecha(new Date()) : o.fechaFabricacion,
          }
        })
      )
    }
    setShowOrderModal(false)
  }

  const handleAbrirCambioEstado = (orden) => {
    if (esEstadoFinal(orden.estado)) return
    setEstadoEditId(orden.id)
    setEstadoEditValue(estadoEfectivo(orden))
  }

  const handleConfirmarEstado = () => {
    if (!estadoEditId) return
    setOrdenes((prev) =>
      prev.map((o) => {
        if (o.id !== estadoEditId) return o
        if (esEstadoFinal(o.estado)) return o
        return {
          ...o,
          estado: estadoEditValue,
          fechaFabricacion: estadoEditValue === 'completado' && !o.fechaFabricacion ? formatFecha(new Date()) : o.fechaFabricacion,
        }
      })
    )
    setEstadoEditId(null)
  }

  const fechaFabricacionPreviewEditar = editingOrden
    ? editingOrden.fechaFabricacion || (estadoSeleccionado === 'completado' ? formatFecha(new Date()) : '')
    : ''

  const columns = [
    {
      key: 'id',
      header: 'Orden',
      accessor: (r) => (
        <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{r.id}</Typography>
      ),
    },
    {
      key: 'documento',
      header: 'NIT/Cédula',
      accessor: (r) => <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{r.generadoPor.documento}</Typography>,
    },
    {
      key: 'fechaSolicitud',
      header: 'Fecha solicitud',
      accessor: (r) => <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{r.fechaSolicitud}</Typography>,
    },
    {
      key: 'fechaFabricacion',
      header: 'Fecha fabricación',
      accessor: (r) =>
        r.fechaFabricacion ? (
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{r.fechaFabricacion}</Typography>
        ) : (
          <Typography sx={{ fontSize: 12.5, fontStyle: 'italic', color: 'text.dim' }}>Por definir</Typography>
        ),
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => {
        const efectivo = estadoEfectivo(r)
        const bloqueado = esEstadoFinal(r.estado)
        return (
          <Box
            component="button"
            type="button"
            disabled={bloqueado}
            onClick={(e) => {
              e.stopPropagation()
              handleAbrirCambioEstado(r)
            }}
            title={bloqueado ? 'Estado final, no editable' : 'Cambiar estado'}
            sx={{
              background: 'none',
              border: 'none',
              p: 0,
              cursor: bloqueado ? 'default' : 'pointer',
              '&:hover': { opacity: bloqueado ? 1 : 0.8 },
            }}
          >
            <StatusBadge variant={estadoVariant[efectivo]} dot>
              {efectivo.charAt(0).toUpperCase() + efectivo.slice(1)}
            </StatusBadge>
          </Box>
        )
      },
    },
    {
      key: 'acciones',
      header: '',
      align: 'right',
      accessor: (r) => {
        const bloqueado = esEstadoFinal(r.estado)
        return (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
            <IconButton
              size="small"
              title="Ver detalle"
              onClick={(e) => {
                e.stopPropagation()
                handleVerDetalle(r)
              }}
              sx={{ color: 'text.secondary' }}
            >
              <IconEye size={15} />
            </IconButton>
            <IconButton
              size="small"
              disabled={bloqueado}
              title={bloqueado ? 'Esta orden ya no se puede editar' : 'Editar orden'}
              onClick={(e) => {
                e.stopPropagation()
                handleEditar(r)
              }}
              sx={{ color: 'text.secondary' }}
            >
              <IconPencil size={15} />
            </IconButton>
            <IconButton
              size="small"
              title="Eliminar orden"
              onClick={(e) => {
                e.stopPropagation()
                setDeleteId(r.id)
              }}
              sx={{ color: 'error.main' }}
            >
              <IconTrash size={15} />
            </IconButton>
          </Stack>
        )
      },
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* KPIs */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 2,
        '& > *': isDark ? { backgroundColor: '#2A1D16', backgroundImage: 'none' } : {}
      }}>
        <KPICard title="Órdenes completadas" value={completados} icon={<IconCircleCheck size={16} />} variant="success" />
        <KPICard title="Retrasadas" value={retrasados} icon={<IconAlertTriangle size={16} />} variant="danger" />
      </Box>

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: isDark ? '#2A1D16' : 'background.paper', border: '1px solid', borderColor: 'divider', backgroundImage: 'none' }}>
        {/* Toolbar */}
        <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ gap: 1.25, px: 2.5, py: 2 }}>
          <Typography
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: 'text.primary',
              mr: 'auto',
            }}
          >
            Órdenes de producción
          </Typography>

          <Box sx={{ width: 250, display: 'flex', alignItems: 'center' }}>
            <OutlinedInput
              placeholder="Buscar orden, NIT o producto…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              startAdornment={
                <InputAdornment position="start">
                  <IconSearch size={18} color="#A0968C" />
                </InputAdornment>
              }
              sx={{
                bgcolor: isDark ? '#32251F' : '#F4EFEA',
                height: 35,
                borderRadius: 1,
                '& fieldset': {
                  borderColor: isDark ? 'transparent' : '#E5DCD3',
                },
                '&:hover fieldset': {
                  borderColor: '#C97A45',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C97A45',
                },
              }}
            />
          </Box>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<IconPlus size={13} />}
            onClick={handleNuevaOrden}
            sx={{
              height: 28,
              borderRadius: 1,
              ...(isDark && {
                backgroundColor: '#A85D33',
                color: '#000000',
                '&:hover': { backgroundColor: '#8A4A28' },
              }),
            }}
          >
            Nueva orden
          </Button>

          <Button
            variant={filtrosActivos ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={<IconFilter size={13} />}
            onClick={() => setShowFiltros((v) => !v)}
            sx={{
              height: 28,
              borderRadius: 1,
              border: '1px solid',
              backgroundColor: isDark ? '#32251F' : '#F0EBE3',
              color: isDark ? '#F2E9DD' : '#4A2E17',
              borderColor: isDark ? '#3D2C21' : '#E4D9C8',
              '&:hover': {
                backgroundColor: isDark ? '#32251F' : '#F0EBE3',
                borderColor: isDark ? '#3D2C21' : '#E4D9C8',
                opacity: 0.85,
              },
            }}
          >
            Filtrar
            {filtrosActivos && (
              <Box
                component="span"
                sx={{
                  ml: 0.75,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 16,
                  width: 16,
                  borderRadius: '50%',
                  fontSize: 9,
                  fontWeight: 700,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  color: 'inherit',
                }}
              >
                {cantidadFiltrosActivos}
              </Box>
            )}
          </Button>
        </Stack>

        <Divider />

        {/* Filtros */}
        <Collapse in={showFiltros}>
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="flex-end"
            sx={{
              gap: 2.5,
              px: 2.5,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: isDark ? '#2C1F18' : '#FAF8F6',
            }}
          >
            <Box sx={{ width: 144 }}>
              <FilterLabel>Estado</FilterLabel>
              <Select
                options={[{ value: '', label: 'Todos' }, ...estadoOptions]}
                value={estadoFilter}
                onChange={(e) => {
                  setEstadoFilter(e.target.value)
                  setPage(1)
                }}
              />
            </Box>

            <Box sx={{ width: 144 }}>
              <FilterLabel>Origen</FilterLabel>
              <Select
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'Manual', label: 'Manual' },
                  { value: 'Pagina', label: 'Página' },
                ]}
                value={origenFilter}
                onChange={(e) => {
                  setOrigenFilter(e.target.value)
                  setPage(1)
                }}
              />
            </Box>

            <Box sx={{ width: 144 }}>
              <FilterLabel>Desde</FilterLabel>
              <Input
                type="date"
                value={fechaDesde}
                onChange={(e) => {
                  setFechaDesde(e.target.value)
                  setPage(1)
                }}
              />
            </Box>

            <Box sx={{ width: 144 }}>
              <FilterLabel>Hasta</FilterLabel>
              <Input
                type="date"
                value={fechaHasta}
                onChange={(e) => {
                  setFechaHasta(e.target.value)
                  setPage(1)
                }}
              />
            </Box>

            <Box sx={{ width: 112 }}>
              <FilterLabel>Cantidad mín.</FilterLabel>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={cantidadMin}
                onChange={(e) => {
                  setCantidadMin(e.target.value)
                  setPage(1)
                }}
              />
            </Box>

            <Box sx={{ width: 112 }}>
              <FilterLabel>Cantidad máx.</FilterLabel>
              <Input
                type="number"
                min={0}
                placeholder="Sin límite"
                value={cantidadMax}
                onChange={(e) => {
                  setCantidadMax(e.target.value)
                  setPage(1)
                }}
              />
            </Box>

            {filtrosActivos && (
              <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            )}
          </Stack>
        </Collapse>

        {/* Tabla */}
        <DataTable columns={columns} data={paginated} keyExtractor={(r) => r.id} emptyMessage="Sin órdenes encontradas" />
        <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Box>
      </Box>

      {/* Modal: Ver detalle */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={`Detalle orden ${selected?.id ?? ''}`} size="md">
        {selected &&
          (() => {
            const insumos = calcularInsumos(selected.items)
            const efectivo = estadoEfectivo(selected)
            const detalleItems = [
              ...(selected.producto !== 'Manual' && selected.ventaId ? [{ label: 'Venta relacionada', value: selected.ventaId }] : []),
              { label: 'Cantidad', value: `${totalCantidad(selected)}${selected.unidad !== 'piezas' ? ` ${selected.unidad}` : ''}` },
              { label: 'Fecha solicitud', value: selected.fechaSolicitud },
              { label: 'Fecha fabricación', value: selected.fechaFabricacion || 'Por definir' },
              { label: 'Generado por', value: selected.generadoPor.nombre },
              { label: 'NIT/Cédula', value: selected.generadoPor.documento },
            ]
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  {detalleItems.map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        borderRadius: 1.5,
                        p: 1.5,
                        border: '1px solid',
                        borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                        bgcolor: isDark ? '#30231C' : '#F9F8F8',
                      }}
                    >
                      <Typography sx={dimLabelSx}>{item.label}</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={dimLabelSx}>Productos asociados</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    {selected.items.map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          px: 1.5,
                          py: 1,
                          bgcolor: isDark ? '#30231C' : '#F9F8F8',
                          borderTop: idx > 0 ? '1px solid' : 'none',
                          borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                        }}
                      >
                        <Typography sx={{ fontSize: 14, color: 'text.primary' }}>{item.nombre}</Typography>
                        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                          {item.cantidad}
                          {selected.unidad !== 'piezas' ? ` ${selected.unidad}` : ''}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {insumos.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setInsumosAbiertos((v) => !v)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 1.5,
                        px: 1.5,
                        py: 1.25,
                        bgcolor: isDark ? '#30231C' : '#F9F8F8',
                        border: '1px solid',
                        borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.9 },
                      }}
                    >
                      <Typography sx={{ ...dimLabelSx, fontWeight: 600, color: isDark ? '#E4D9C8' : dimLabelSx.color }}>
                        Insumos requeridos ({insumos.length})
                      </Typography>
                      {insumosAbiertos ? (
                        <IconChevronUp size={15} color={isDark ? '#E4D9C8' : undefined} />
                      ) : (
                        <IconChevronDown size={15} color={isDark ? '#E4D9C8' : undefined} />
                      )}
                    </Box>
                    {insumosAbiertos && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                        {insumos.map((insumo, idx) => (
                          <Box
                            key={insumo.nombre}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              px: 1.5,
                              py: 1,
                              bgcolor: isDark ? '#30231C' : '#F9F8F8',
                              borderTop: idx > 0 ? '1px solid' : 'none',
                              borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                            }}
                          >
                            <Typography sx={{ fontSize: 14, color: 'text.primary' }}>{insumo.nombre}</Typography>
                            <Typography sx={{ fontSize: 14, fontFamily: 'monospace', color: 'text.secondary' }}>
                              {insumo.cantidad % 1 === 0 ? insumo.cantidad : insumo.cantidad.toFixed(3).replace(/\.?0+$/, '')} {insumo.unidad}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>Estado:</Typography>
                  <StatusBadge variant={estadoVariant[efectivo]} dot>
                    {efectivo.charAt(0).toUpperCase() + efectivo.slice(1)}
                  </StatusBadge>
                </Box>
              </Box>
            )
          })()}
      </Modal>

      {/* Modal: Nueva orden / Editar */}
      <Modal
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={orderModalMode === 'nueva' ? 'Nueva orden' : `Editar orden ${editingId}`}
        size="lg"
        sx={{
          ...(isDark && {
            bgcolor: '#2A1D16',
            backgroundImage: 'none !important',
            '--Paper-overlay': 'none',
          }),
        }}
      >
        <Divider />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', marginTop: '20px' }, gap: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {orderModalMode === 'nueva' && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1.25,
                  border: '1px solid',
                  borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                  bgcolor: isDark ? '#30231C' : '#F9F8F8',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.dim' }}>ID de orden</Typography>
                  <Typography sx={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: 'text.primary' }}>{formId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Fecha solicitud</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.primary' }}>{formFechaSolicitud}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Fecha fabricación</Typography>
                  <Typography sx={{ fontSize: 12, fontStyle: 'italic', color: 'text.dim' }}>Por definir</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Estado</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.primary' }}>Pendiente</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Generado por</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.primary' }}>{usuarioAutenticado.nombre}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.dim' }}>NIT/Cédula</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.primary' }}>{usuarioAutenticado.nit}</Typography>
                </Box>
              </Box>
            )}

            {orderModalMode === 'editar' && editingOrden && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 1.25,
                    border: '1px solid',
                    borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                    bgcolor: isDark ? '#30231C' : '#F9F8F8',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 12, color: 'text.dim' }}>ID de orden</Typography>
                    <Typography sx={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: 'text.primary' }}>{editingOrden.id}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Fecha solicitud</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.primary' }}>{editingOrden.fechaSolicitud}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Fecha fabricación</Typography>
                    <Typography sx={{ fontSize: 12, fontStyle: fechaFabricacionPreviewEditar ? 'normal' : 'italic', color: fechaFabricacionPreviewEditar ? 'text.primary' : 'text.dim' }}>
                      {fechaFabricacionPreviewEditar || 'Por definir'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
                      {editingOrden.producto === 'Pagina' ? 'Solicitado por' : 'Generado por'}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.primary' }}>{editingOrden.generadoPor.nombre}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 12, color: 'text.dim' }}>NIT/Cédula</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.primary' }}>{editingOrden.generadoPor.documento}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FilterLabel>Estado</FilterLabel>
                  <Select options={estadoOptions} value={estadoSeleccionado} onChange={(e) => setEstadoSeleccionado(e.target.value)} />
                </Box>

                {editingOrden.producto === 'Pagina' && editingOrden.ventaId && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 1.5,
                      px: 1.5,
                      py: 1.25,
                      border: '1px solid',
                      borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                      bgcolor: isDark ? '#30231C' : '#F9F8F8',
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Venta relacionada</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>{editingOrden.ventaId}</Typography>
                  </Box>
                )}

                <Divider />
              </>
            )}

            <Box>
              <FilterLabel>Producto</FilterLabel>
              <Input
                placeholder="Buscar producto…"
                value={productoBusqueda}
                onChange={(e) => {
                  setProductoBusqueda(e.target.value)
                  setProductoSeleccionado('')
                }}
                leftIcon={<IconSearch size={13} />}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#30231C' : '#F0EBE3' } }}
              />
            </Box>
            <Select
              options={[
                { value: '', label: productosFiltrados.length ? 'Selecciona un producto' : 'Sin resultados' },
                ...productosFiltrados.map((p) => ({ value: p, label: p })),
              ]}
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              sx={{ bgcolor: isDark ? '#30231C' : '#F0EBE3' }} // 👈 nuevo
            />
            <Box>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconPlus size={13} />}
                disabled={!productoSeleccionado}
                onClick={handleAgregarProducto}
                sx={{
                  border: '1px solid',
                  borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                  backgroundColor: isDark ? '#30231C' : '#F0EBE3',
                  color: isDark ? '#FFFFFF' : undefined,
                }}
              >
                Agregar
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FilterLabel>Resumen</FilterLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflow: 'hidden', minHeight: 120, border: '1px solid', borderColor: 'divider' }}>
              {formItems.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 1.5, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 14, color: isDark ? '#E4D9C8' : 'text.dim' }}>Sin productos agregados</Typography>
                </Box>
              ) : (
                formItems.map((item, idx) => (
                  <Box
                    key={item.nombre}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.75,
                      px: 1.5,
                      py: 1,
                      bgcolor: isDark ? '#30231C' : '#F9F8F8',
                      borderTop: idx > 0 ? '1px solid' : 'none',
                      borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography sx={{ fontSize: 14, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.nombre}
                      </Typography>
                      <IconButton size="small" onClick={() => handleQuitarProducto(item.nombre)} aria-label={`Quitar ${item.nombre}`} sx={{ color: 'text.dim' }}>
                        <IconX size={14} />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleActualizarCantidad(item.nombre, item.cantidad - 1)}
                          aria-label={`Disminuir cantidad de ${item.nombre}`}
                          sx={{ height: 24, width: 24, borderRadius: 0, color: 'text.secondary' }}
                        >
                          <IconMinus size={12} />
                        </IconButton>
                        <Typography sx={{ width: 28, textAlign: 'center', fontSize: 14, color: 'text.primary' }}>{item.cantidad}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleActualizarCantidad(item.nombre, item.cantidad + 1)}
                          aria-label={`Aumentar cantidad de ${item.nombre}`}
                          sx={{ height: 24, width: 24, borderRadius: 0, color: 'text.secondary' }}
                        >
                          <IconPlus size={12} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
            <Button variant="primary" size="sm" fullWidth disabled={formItems.length === 0} onClick={handleConfirmarOrden}>
              Ordenar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal: Cambiar estado desde el listado */}
      <Modal open={!!estadoEditId} onClose={() => setEstadoEditId(null)} title={`Cambiar estado ${estadoEditId ?? ''}`} size="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <FilterLabel>Estado</FilterLabel>
            <Select options={estadoOptions} value={estadoEditValue} onChange={(e) => setEstadoEditValue(e.target.value)} />
          </Box>
          {estadoEditValue === 'retrasado' && (
            <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
              Nota: el estado "retrasado" también se aplica automáticamente cuando han pasado 2 días desde la fecha de
              solicitud.
            </Typography>
          )}
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="secondary" size="sm" onClick={() => setEstadoEditId(null)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmarEstado}>
              Guardar
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Confirmación de eliminación */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Eliminar orden" size="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            ¿Seguro que deseas eliminar la orden{' '}
            <Box component="span" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
              {deleteId}
            </Box>
            ? Esta acción no se puede deshacer.
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (deleteId) handleEliminar(deleteId)
                setDeleteId(null)
              }}
            >
              Eliminar
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box component="footer" sx={{ pt: 2, pb: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center', fontSize: 11.5, color: 'text.dim' }}>
        © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
      </Box>
    </Box>
  )
}