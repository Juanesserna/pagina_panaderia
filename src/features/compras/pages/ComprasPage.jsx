import { useState, useMemo } from 'react'
import { Box, Stack, Typography, IconButton } from '@mui/material'
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconX,
  IconEye,
  IconPencil,
  IconTrash,
  IconCalendar,
  IconHash,
  IconChevronDown,
  IconChevronUp,
  IconLock,
  IconCurrencyDollar,
  IconClock,
  IconCircleCheck,
} from '@tabler/icons-react'
import { KPICard } from '@features/compras/components/KPICard'
import { StatusBadge } from '@features/compras/components/StatusBadge'
import { Button } from '@features/compras/components/Button'
import { Input } from '@features/compras/components/Input'
import { Select } from '@features/compras/components/Select'
import { DataTable } from '@features/compras/components/DataTable'
import { Pagination } from '@features/compras/components/Pagination'
import { Modal } from '@features/compras/components/Modal'

// ── Catálogos base ─────────────────────────────────────────────────────────

const PROVIDERS = [
  { id: 'PROV-001', name: 'Harinas del Norte' },
  { id: 'PROV-002', name: 'Lácteos del Norte' },
  { id: 'PROV-003', name: 'Distribuidora Panera' },
  { id: 'PROV-004', name: 'Azúcares Centro' },
  { id: 'PROV-005', name: 'Empaques Medellín' },
]

// "Mixto" se agrega para poder filtrar/mostrar órdenes cuyos insumos
// pertenecen a más de una categoría (ver derivarCategoria más abajo).
const CATEGORIES = ['Materias primas', 'Lácteos', 'Empaque', 'Herramientas', 'Mixto']

const INSUMOS = ['Harina', 'Azúcar', 'Leche', 'Café', 'Aceite', 'Arroz', 'Sal', 'Huevos']

// NOTA: esto es un mock local mientras el módulo de Insumos expone un
// catálogo real con unidad y categoría por insumo. La idea es que "Unidad"
// deje de ser texto libre por línea de compra —hoy cualquiera podría
// escribir "Kg", "kg" o "KILOS" para el mismo insumo— y en su lugar se
// herede del insumo seleccionado. Cuando el catálogo real esté disponible,
// este mapa se reemplaza por la data que traiga esa API/selector.
const INSUMO_META = {
  Harina: { unidad: 'kg', categoria: 'Materias primas' },
  Azúcar: { unidad: 'kg', categoria: 'Materias primas' },
  Leche: { unidad: 'lt', categoria: 'Lácteos' },
  Café: { unidad: 'kg', categoria: 'Materias primas' },
  Aceite: { unidad: 'lt', categoria: 'Materias primas' },
  Arroz: { unidad: 'kg', categoria: 'Materias primas' },
  Sal: { unidad: 'kg', categoria: 'Materias primas' },
  Huevos: { unidad: 'und', categoria: 'Lácteos' },
}

// tb_compras no tiene columna de categoría propia —es un dato derivado de
// los insumos de la orden—, así que aquí se calcula a partir de lo que el
// usuario realmente agregó: si todos los ítems son de la misma categoría
// se usa esa; si hay más de una, "Mixto".
const derivarCategoria = (items) => {
  const categorias = new Set(items.map((i) => INSUMO_META[i.nombre]?.categoria).filter(Boolean))
  if (categorias.size === 0) return CATEGORIES[0]
  if (categorias.size === 1) return [...categorias][0]
  return 'Mixto'
}

const generarNumeroLote = () => {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `LOTE-${ts}-${rand}`
}

const initialCompras = [
  {
    id: 'OC-045',
    fecha: '22/06/2026',
    proveedor: 'PROV-001 - Harinas del Norte',
    categoria: 'Materias primas',
    cantidadItems: 5,
    estado: 'Recibida',
    total: '$45.000',
    solicitante: 'Ana M.',
    detalle: [
      { nombre: 'Harina de trigo', cantidad: 50, unidad: 'kg', precio: '$35.000', lote: 'LOTE-INIT-0001', fechaVencimiento: '2026-12-01', cantidadDisponible: 50 },
      { nombre: 'Harina integral', cantidad: 10, unidad: 'kg', precio: '$10.000', lote: 'LOTE-INIT-0002', fechaVencimiento: '2026-10-15', cantidadDisponible: 10 },
    ],
    notas: 'Entrega verificada en bodega central.',
  },
  {
    id: 'OC-044',
    fecha: '20/06/2026',
    proveedor: 'PROV-002 - Lácteos del Norte',
    categoria: 'Lácteos',
    cantidadItems: 3,
    estado: 'Parcial',
    total: '$32.000',
    solicitante: 'Luis R.',
    detalle: [
      { nombre: 'Mantequilla', cantidad: 8, unidad: 'kg', precio: '$20.000', lote: 'LOTE-INIT-0003', fechaVencimiento: '2026-08-20', cantidadDisponible: 8 },
      { nombre: 'Leche entera', cantidad: 10, unidad: 'lt', precio: '$12.000', lote: 'LOTE-INIT-0004', fechaVencimiento: '2026-07-25', cantidadDisponible: 10 },
    ],
    notas: 'Pendiente confirmación del proveedor.',
  },
  {
    id: 'OC-043',
    fecha: '18/06/2026',
    proveedor: 'PROV-003 - Distribuidora Panera',
    categoria: 'Empaque',
    cantidadItems: 8,
    estado: 'Recibida',
    total: '$58.000',
    solicitante: 'Ana M.',
    detalle: [
      { nombre: 'Bolsas kraft', cantidad: 500, unidad: 'und', precio: '$28.000', lote: 'LOTE-INIT-0005', fechaVencimiento: '', cantidadDisponible: 500 },
      { nombre: 'Cajas plegables', cantidad: 100, unidad: 'und', precio: '$30.000', lote: 'LOTE-INIT-0006', fechaVencimiento: '', cantidadDisponible: 100 },
    ],
    notas: '',
  },
]

// ── Helpers de estado ────────────────────────────────────────────────────

// Se agrega "Parcial": la BD (tb_detalle_compra.estado) maneja
// pendiente/parcial/recibido/cancelado; sin "Parcial" no había forma de
// reflejar una orden a la que le llegó solo una parte de lo comprado.
const estadoVariant = {
  Recibida: 'success',
  Pendiente: 'warning',
  Parcial: 'accent',
  Cancelada: 'danger',
}

// Mismos tonos que usa StatusBadge/KPICard vía el theme, para que el
// puntito de color junto al Select de la fila combine con el resto de
// indicadores de estado de la app.
const estadoDotColor = {
  Recibida: 'success.main',
  Pendiente: 'warning.main',
  Parcial: 'primary.main',
  Cancelada: 'error.main',
}

const estadoOptions = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Parcial', label: 'Parcial' },
  { value: 'Recibida', label: 'Recibida' },
  { value: 'Cancelada', label: 'Cancelada' },
]

// Antes solo se contemplaba Pendiente/Recibida/Cancelada. Con "Parcial" en
// el medio, la regla queda: Pendiente puede ir a cualquiera; Parcial solo
// avanza a Recibida o se cancela (no puede "retroceder" a Pendiente);
// Recibida solo se cancela; Cancelada es definitivo.
const esTransicionValida = (actual, nuevo) => {
  if (actual === nuevo) return true
  if (actual === 'Cancelada') return false
  if (actual === 'Recibida') return nuevo === 'Cancelada'
  if (actual === 'Parcial') return nuevo === 'Recibida' || nuevo === 'Cancelada'
  return true // actual === 'Pendiente'
}

const opcionesEstadoParaFila = (actual) => estadoOptions.filter((o) => esTransicionValida(actual, o.value))

const parseFechaCompra = (compra) => {
  const [d, m, y] = compra.fecha.split('/').map(Number)
  return new Date(y, m - 1, d)
}

const nextId = (compras) => {
  const maxNum = compras.reduce((max, c) => Math.max(max, parseInt(c.id.replace('OC-', ''), 10) || 0), 0)
  return `OC-${String(maxNum + 1).padStart(3, '0')}`
}

// Cada columna ordenable sabe cómo extraer de una compra el valor
// comparable (texto en minúsculas, número o timestamp).
const sortAccessors = {
  id: (c) => parseInt(c.id.replace(/\D/g, ''), 10) || 0,
  fecha: (c) => parseFechaCompra(c).getTime(),
  proveedor: (c) => c.proveedor.toLowerCase(),
  total: (c) => parseInt(c.total.replace(/\D/g, ''), 10) || 0,
}

const PAGE_SIZE = 8

const dimLabelSx = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.dim' }

const nuevoFormItem = () => ({
  nombre: INSUMOS[0],
  cantidad: 1,
  unidad: INSUMO_META[INSUMOS[0]]?.unidad ?? 'kg',
  precio: 0,
  lote: generarNumeroLote(),
  fechaVencimiento: '',
  cantidadDisponible: 1,
})

// ── Componente principal ────────────────────────────────────────────────

export default function ComprasPage() {
  const [compras, setCompras] = useState(initialCompras)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [selected, setSelected] = useState(null)

  // Panel de filtros
  const [showFiltros, setShowFiltros] = useState(false)
  const [estadoFilter, setEstadoFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [providerFilter, setProviderFilter] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  // Modales
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Formulario "Nueva compra"
  const [formItems, setFormItems] = useState([nuevoFormItem()])
  const [formProvider, setFormProvider] = useState(PROVIDERS[0].id)
  const [formNotes, setFormNotes] = useState('')
  const [formDiscount, setFormDiscount] = useState(0)
  const [formEstado, setFormEstado] = useState('Pendiente')
  const [formSolicitor, setFormSolicitor] = useState('Andrés Mesa')
  const [formNewId, setFormNewId] = useState('')
  const [formFecha, setFormFecha] = useState('')

  // Estado de expansión del bloque "Trazabilidad del Lote" por ítem.
  // Colapsado por defecto: reduce el alto visible del formulario y evita
  // el scroll pronunciado; el usuario lo abre solo si necesita editar
  // el vencimiento.
  const [expandedLote, setExpandedLote] = useState({ 0: true })

  const toggleLote = (idx) => setExpandedLote((prev) => ({ ...prev, [idx]: !prev[idx] }))

  // ── Ordenamiento ─────────────────────────────────────────────────────

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  // ── Cambio de estado desde la tabla ──────────────────────────────────

  const handleCambiarEstado = (id, nuevoEstado) => {
    setCompras((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        if (!esTransicionValida(c.estado, nuevoEstado)) return c
        return { ...c, estado: nuevoEstado }
      })
    )
    setSelected((prev) =>
      prev && prev.id === id && esTransicionValida(prev.estado, nuevoEstado) ? { ...prev, estado: nuevoEstado } : prev
    )
  }

  // ── Filtrado + ordenamiento ──────────────────────────────────────────

  const filtered = useMemo(() => {
    let data = compras
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (c) => c.proveedor.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.categoria.toLowerCase().includes(q)
      )
    }
    if (estadoFilter) data = data.filter((c) => c.estado === estadoFilter)
    if (categoryFilter) data = data.filter((c) => c.categoria === categoryFilter)
    if (providerFilter) data = data.filter((c) => c.proveedor.includes(providerFilter))
    if (fechaDesde) {
      const desde = new Date(`${fechaDesde}T00:00:00`)
      data = data.filter((c) => parseFechaCompra(c) >= desde)
    }
    if (fechaHasta) {
      const hasta = new Date(`${fechaHasta}T23:59:59`)
      data = data.filter((c) => parseFechaCompra(c) <= hasta)
    }

    const accessor = sortAccessors[sortKey]
    if (accessor) {
      data = [...data].sort((a, b) => {
        const av = accessor(a)
        const bv = accessor(b)
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return data
  }, [compras, search, estadoFilter, categoryFilter, providerFilter, fechaDesde, fechaHasta, sortKey, sortDir])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const filtrosActivos = Boolean(estadoFilter || categoryFilter || providerFilter || fechaDesde || fechaHasta)
  const cantidadFiltrosActivos = [estadoFilter, categoryFilter, providerFilter, fechaDesde, fechaHasta].filter(Boolean).length

  const limpiarFiltros = () => {
    setEstadoFilter('')
    setCategoryFilter('')
    setProviderFilter('')
    setFechaDesde('')
    setFechaHasta('')
    setPage(1)
  }

  // ── Abrir modal "Nueva compra" ────────────────────────────────────────

  const handleNuevaCompra = () => {
    const ahora = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    setFormNewId(nextId(compras))
    setFormFecha(`${pad(ahora.getDate())}/${pad(ahora.getMonth() + 1)}/${ahora.getFullYear()}`)
    setFormItems([nuevoFormItem()])
    setFormProvider(PROVIDERS[0].id)
    setFormNotes('')
    setFormDiscount(0)
    setFormEstado('Pendiente')
    setFormSolicitor('Andrés Mesa')
    setExpandedLote({ 0: true })
    setShowCreateModal(true)
  }

  const subtotalForm = formItems.reduce((s, i) => s + i.cantidad * i.precio, 0)
  const totalForm = subtotalForm * (1 - formDiscount / 100)

  const handleItemChange = (idx, field, value) => {
    setFormItems((prev) => {
      const updated = [...prev]
      const current = { ...updated[idx], [field]: value }
      if (field === 'cantidad') {
        const cantidadNumerica = typeof value === 'number' ? value : parseInt(String(value), 10) || 0
        current.cantidadDisponible = cantidadNumerica
      }
      // Al cambiar el insumo, la unidad ya no se escribe a mano: se hereda
      // del insumo seleccionado (ver INSUMO_META más arriba).
      if (field === 'nombre') {
        const meta = INSUMO_META[String(value)]
        if (meta) current.unidad = meta.unidad
      }
      updated[idx] = current
      return updated
    })
  }

  const handleAddFormItem = () => {
    setFormItems((prev) => [...prev, nuevoFormItem()])
    // El nuevo ítem se agrega colapsado; el usuario lo expande si necesita
    // ajustar el vencimiento.
  }

  const handleRemoveFormItem = (idx) => {
    if (formItems.length > 1) {
      setFormItems((prev) => prev.filter((_, i) => i !== idx))
      setExpandedLote((prev) => {
        const next = {}
        Object.entries(prev).forEach(([key, val]) => {
          const k = Number(key)
          if (k === idx) return
          next[k > idx ? k - 1 : k] = val
        })
        return next
      })
    }
  }

  // ── Confirmar nueva compra ────────────────────────────────────────────

  const handleConfirmarCompra = () => {
    if (formItems.some((i) => !i.nombre || i.cantidad <= 0 || i.precio <= 0)) return
    const proveedorSeleccionado = PROVIDERS.find((p) => p.id === formProvider)
    const proveedorLabel = proveedorSeleccionado ? `${proveedorSeleccionado.id} - ${proveedorSeleccionado.name}` : formProvider

    const nuevaCompra = {
      id: formNewId,
      fecha: formFecha,
      proveedor: proveedorLabel,
      categoria: derivarCategoria(formItems),
      cantidadItems: formItems.reduce((s, i) => s + i.cantidad, 0),
      estado: formEstado,
      total: `$${totalForm.toLocaleString('es-CO')}`,
      solicitante: formSolicitor,
      detalle: formItems.map((i) => ({
        nombre: i.nombre,
        cantidad: i.cantidad,
        unidad: i.unidad,
        precio: `$${(i.cantidad * i.precio).toLocaleString('es-CO')}`,
        lote: i.lote,
        fechaVencimiento: i.fechaVencimiento,
        cantidadDisponible: i.cantidadDisponible,
      })),
      notas: formNotes + (formDiscount > 0 ? ` (Descuento del ${formDiscount}% aplicado)` : ''),
    }
    setCompras((prev) => [nuevaCompra, ...prev])
    setShowCreateModal(false)
  }

  const handleGuardarEdicion = (updated) => {
    setCompras((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setShowEditModal(false)
    setEditTarget(null)
  }

  const handleConfirmarEliminar = () => {
    if (!deleteTarget) return
    setCompras((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setShowDeleteModal(false)
    setDeleteTarget(null)
    if (paginated.length === 1 && page > 1) setPage((p) => p - 1)
  }

  // ── KPIs ──────────────────────────────────────────────────────────────
  // Nota: los porcentajes de tendencia (trend) son valores de ejemplo fijos,
  // igual que en el diseño original. Cuando exista el histórico real del mes
  // anterior, se calculan a partir de esos datos en vez de quedar fijos.

  const now = new Date()
  const comprasDelMes = compras.filter((c) => {
    const fecha = parseFechaCompra(c)
    return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear()
  })
  const totalMesValue = comprasDelMes.reduce((acc, c) => {
    const num = parseInt(c.total.replace(/\D/g, ''), 10)
    return acc + (isNaN(num) ? 0 : num)
  }, 0)
  const pendCount = compras.filter((c) => c.estado === 'Pendiente').length
  const recCount = compras.filter((c) => c.estado === 'Recibida').length

  // ── Columnas de la tabla ──────────────────────────────────────────────

  const columns = [
    {
      key: 'id',
      header: 'Orden',
      sortable: true,
      accessor: (r) => (
        <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{r.id}</Typography>
      ),
    },
    {
      key: 'fecha',
      header: 'Fecha',
      sortable: true,
      accessor: (r) => <Typography sx={{ fontSize: 12.5, color: 'text.dim' }}>{r.fecha}</Typography>,
    },
    {
      key: 'proveedor',
      header: 'Proveedor',
      sortable: true,
      accessor: (r) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 500,
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 220,
            }}
          >
            {r.proveedor}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.dim' }}>{r.categoria}</Typography>
        </Box>
      ),
    },
    {
      key: 'cantidadItems',
      header: 'Ítems',
      align: 'center',
      accessor: (r) => <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{r.cantidadItems}</Typography>,
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      accessor: (r) => <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>{r.total}</Typography>,
    },
    {
      key: 'solicitante',
      header: 'Solicitante',
      accessor: (r) => <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{r.solicitante}</Typography>,
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => {
        const bloqueado = r.estado === 'Cancelada'
        return (
          <Box
            onClick={(e) => e.stopPropagation()}
            title={bloqueado ? 'Una orden cancelada no se puede modificar' : undefined}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 152, opacity: bloqueado ? 0.5 : 1 }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, bgcolor: estadoDotColor[r.estado] }} />
            <Select
              options={opcionesEstadoParaFila(r.estado)}
              value={r.estado}
              disabled={bloqueado}
              onChange={(e) => handleCambiarEstado(r.id, e.target.value)}
            />
          </Box>
        )
      },
    },
    {
      key: 'acciones',
      header: '',
      align: 'right',
      accessor: (r) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
          <IconButton
            size="small"
            title="Ver detalle"
            onClick={(e) => {
              e.stopPropagation()
              setSelected(r)
              setShowViewModal(true)
            }}
            sx={{ color: 'text.secondary' }}
          >
            <IconEye size={15} />
          </IconButton>
          <IconButton
            size="small"
            title="Editar orden"
            onClick={(e) => {
              e.stopPropagation()
              setEditTarget(r)
              setShowEditModal(true)
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
              setDeleteTarget(r)
              setShowDeleteModal(true)
            }}
            sx={{ color: 'error.main' }}
          >
            <IconTrash size={15} />
          </IconButton>
        </Stack>
      ),
    },
  ]

  // ── Subcomponente de edición ─────────────────────────────────────────

  const EditForm = ({ compra }) => {
    const [proveedor, setProveedor] = useState(compra.proveedor)
    const [categoria, setCategoria] = useState(compra.categoria)
    const [estado, setEstado] = useState(compra.estado)
    const [notas, setNotas] = useState(compra.notas)
    const [solicitante, setSolicitante] = useState(compra.solicitante)
    const [detalle, setDetalle] = useState(compra.detalle.map((d) => ({ ...d })))

    const handleDetalleChange = (i, field, val) => {
      const updated = [...detalle]
      updated[i] = { ...updated[i], [field]: field === 'cantidad' ? parseInt(val) || 1 : val }
      setDetalle(updated)
    }

    const handleSubmit = () => {
      handleGuardarEdicion({
        ...compra,
        proveedor,
        categoria,
        estado,
        notas,
        solicitante,
        detalle,
        cantidadItems: detalle.length,
      })
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={dimLabelSx}>Proveedor</Typography>
            <Select
              options={PROVIDERS.map((p) => ({ value: `${p.id} - ${p.name}`, label: `${p.id} - ${p.name}` }))}
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={dimLabelSx}>Categoría</Typography>
            <Select options={CATEGORIES.map((c) => ({ value: c, label: c }))} value={categoria} onChange={(e) => setCategoria(e.target.value)} />
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={dimLabelSx}>Estado</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, bgcolor: estadoDotColor[estado] }} />
              <Select options={estadoOptions} value={estado} onChange={(e) => setEstado(e.target.value)} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={dimLabelSx}>Solicitante</Typography>
            <Input value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={dimLabelSx}>Ítems</Typography>
          {detalle.map((item, idx) => (
            <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1 }}>
              <Input placeholder="Insumo" value={item.nombre} onChange={(e) => handleDetalleChange(idx, 'nombre', e.target.value)} />
              <Input type="number" placeholder="Cant." value={item.cantidad} onChange={(e) => handleDetalleChange(idx, 'cantidad', e.target.value)} />
              <Input placeholder="Unidad" value={item.unidad} onChange={(e) => handleDetalleChange(idx, 'unidad', e.target.value)} />
              <Input placeholder="Valor" value={item.precio} onChange={(e) => handleDetalleChange(idx, 'precio', e.target.value)} />
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography sx={dimLabelSx}>Observaciones</Typography>
          <Box
            component="textarea"
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas internas…"
            sx={{
              width: '100%',
              p: 1.25,
              fontSize: 13,
              fontFamily: 'inherit',
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'transparent',
              outline: 'none',
              resize: 'none',
              color: 'text.primary',
            }}
          />
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
          <Button variant="secondary" size="sm" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Guardar cambios
          </Button>
        </Stack>
      </Box>
    )
  }

  // ── Render principal ──────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1.5 }}>
      {/* KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
        <KPICard
          title="Compras del mes"
          value={`$${totalMesValue.toLocaleString('es-CO')}`}
          icon={<IconCurrencyDollar size={16} />}
          trend={7.8}
          variant="accent"
        />
        <KPICard title="Pendientes" value={pendCount} icon={<IconClock size={16} />} trend={0} variant="warning" />
        <KPICard title="Recibidas (mes)" value={recCount} icon={<IconCircleCheck size={16} />} trend={15.4} variant="success" />
      </Box>

      {/* Tabla principal */}
      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            columnGap: 2,
            px: 2.5,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary', textAlign: 'center', whiteSpace: 'nowrap' }}>
            Órdenes de compra
          </Typography>
          <Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="flex-end" sx={{ gap: 3, columnGap: 3, rowGap: 1.5 }}>
            <Box sx={{ width: 224 }}>
              <Input
                placeholder="Buscar orden o proveedor…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                leftIcon={<IconSearch size={13} />}
              />
            </Box>
            <Button variant="primary" size="sm" leftIcon={<IconPlus size={13} />} onClick={handleNuevaCompra}>
              Nueva compra
            </Button>
            <Button
              variant={filtrosActivos ? 'primary' : 'secondary'}
              size="sm"
              leftIcon={<IconFilter size={13} />}
              onClick={() => setShowFiltros((v) => !v)}
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
                    fontSize: 10,
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
        </Box>

        {/* Panel de filtros */}
        {showFiltros && (
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="flex-end"
            sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.alt', gap: 3.5, columnGap: 3.5, rowGap: 2 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={dimLabelSx}>Estado</Typography>
              <Box sx={{ width: 144 }}>
                <Select
                  options={[{ value: '', label: 'Todos' }, ...estadoOptions]}
                  value={estadoFilter}
                  onChange={(e) => {
                    setEstadoFilter(e.target.value)
                    setPage(1)
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={dimLabelSx}>Categoría</Typography>
              <Box sx={{ width: 160 }}>
                <Select
                  options={[{ value: '', label: 'Todas' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value)
                    setPage(1)
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={dimLabelSx}>Proveedor</Typography>
              <Box sx={{ width: 200 }}>
                <Select
                  options={[{ value: '', label: 'Todos' }, ...PROVIDERS.map((p) => ({ value: p.id, label: `${p.id} - ${p.name}` }))]}
                  value={providerFilter}
                  onChange={(e) => {
                    setProviderFilter(e.target.value)
                    setPage(1)
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={dimLabelSx}>Desde</Typography>
              <Box sx={{ width: 144 }}>
                <Input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value)
                    setPage(1)
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={dimLabelSx}>Hasta</Typography>
              <Box sx={{ width: 144 }}>
                <Input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value)
                    setPage(1)
                  }}
                />
              </Box>
            </Box>

            {filtrosActivos && (
              <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            )}
          </Stack>
        )}

        <DataTable
          columns={columns}
          data={paginated}
          keyExtractor={(r) => r.id}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyMessage="Sin órdenes encontradas"
        />

        <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Box>
      </Box>

      {/* Modal: Ver detalle */}
      <Modal open={showViewModal} onClose={() => setShowViewModal(false)} title="Detalle de compra" size="md">
        {selected && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              {[
                { label: 'Orden de compra', val: selected.id },
                { label: 'Proveedor', val: selected.proveedor },
                { label: 'Fecha', val: selected.fecha },
              ].map(({ label, val }) => (
                <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={dimLabelSx}>{label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{val}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={dimLabelSx}>Estado</Typography>
                <StatusBadge variant={estadoVariant[selected.estado]} dot>
                  {selected.estado}
                </StatusBadge>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={dimLabelSx}>Solicitante</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{selected.solicitante}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={dimLabelSx}>Total facturado</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>{selected.total}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={dimLabelSx}>Insumos recibidos</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1.3fr 0.7fr 1fr 1fr',
                    px: 1.5,
                    py: 1,
                    bgcolor: 'background.alt',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ ...dimLabelSx, fontSize: 10 }}>Insumo</Typography>
                  <Typography sx={{ ...dimLabelSx, fontSize: 10, textAlign: 'center' }}>Cant.</Typography>
                  <Typography sx={{ ...dimLabelSx, fontSize: 10 }}>Lote</Typography>
                  <Typography sx={{ ...dimLabelSx, fontSize: 10 }}>Vencimiento</Typography>
                </Box>
                {selected.detalle.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1.3fr 0.7fr 1fr 1fr',
                      alignItems: 'center',
                      px: 1.5,
                      py: 1,
                      borderTop: idx > 0 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography sx={{ fontSize: 12.5, color: 'text.primary' }}>{item.nombre}</Typography>
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center' }}>
                      {item.cantidad} {item.unidad}
                    </Typography>
                    <Typography sx={{ fontSize: 11, fontFamily: 'monospace', color: 'text.secondary' }}>{item.lote}</Typography>
                    <Typography sx={{ fontSize: 12.5, color: 'text.dim' }}>{item.fechaVencimiento || 'N/A'}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {selected.notas && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1.5, borderRadius: 1.5, bgcolor: 'background.alt', border: '1px solid', borderColor: 'divider' }}>
                <Typography sx={dimLabelSx}>Notas / observaciones</Typography>
                <Typography sx={{ fontSize: 12.5, fontStyle: 'italic', color: 'text.secondary' }}>{selected.notas}</Typography>
              </Box>
            )}

            <Stack direction="row" justifyContent="flex-end">
              <Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)}>
                Cerrar ventana
              </Button>
            </Stack>
          </Box>
        )}
      </Modal>

      {/* Modal: Nueva orden de compra — cuerpo con scroll independiente, footer con el total siempre visible */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nueva orden de compra" size="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh' }}>
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 1 }}>
              {/* Identificación */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Typography sx={dimLabelSx}>ID de orden</Typography>
                  <Input value={formNewId} disabled rightIcon={<IconLock size={12} />} sx={{ fontFamily: 'monospace', borderStyle: 'dashed' }} />
                  <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>Generado automáticamente</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Typography sx={dimLabelSx}>Fecha</Typography>
                  <Input value={formFecha} disabled sx={{ borderStyle: 'dashed' }} />
                  <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>Fecha del sistema</Typography>
                </Box>
              </Box>

              {/* Configuración */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Typography sx={dimLabelSx}>Estado inicial</Typography>
                  <Select options={estadoOptions} value={formEstado} onChange={(e) => setFormEstado(e.target.value)} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Typography sx={dimLabelSx}>Proveedor</Typography>
                  <Select
                    options={PROVIDERS.map((p) => ({ value: p.id, label: `${p.id} - ${p.name}` }))}
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, maxWidth: 220 }}>
                <Typography sx={dimLabelSx}>Descuento especial (%)</Typography>
                <Input
                  type="number"
                  placeholder="Ej: 10"
                  value={formDiscount || ''}
                  onChange={(e) => setFormDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </Box>

              {/* Productos solicitados */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ ...dimLabelSx, fontWeight: 700 }}>Productos solicitados</Typography>

                {formItems.map((item, idx) => {
                  const abierto = Boolean(expandedLote[idx])
                  return (
                    <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, borderRadius: 2, bgcolor: 'background.alt', position: 'relative' }}>
                      {formItems.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFormItem(idx)}
                          aria-label="Eliminar insumo"
                          sx={{ position: 'absolute', top: 6, right: 6, color: 'text.dim', '&:hover': { color: 'error.main' } }}
                        >
                          <IconX size={14} />
                        </IconButton>
                      )}

                      {/* Fila principal: Insumo, Cantidad, Unidad, Valor */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1.6fr 0.8fr 0.8fr 1fr', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>Insumo</Typography>
                          <Select options={INSUMOS.map((ins) => ({ value: ins, label: ins }))} value={item.nombre} onChange={(e) => handleItemChange(idx, 'nombre', e.target.value)} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>Cantidad</Typography>
                          <Input
                            type="number"
                            min={1}
                            value={item.cantidad}
                            onChange={(e) => handleItemChange(idx, 'cantidad', Math.max(1, parseInt(e.target.value) || 1))}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>Unidad</Typography>
                          {/* Ya no es texto libre: se hereda del insumo elegido (INSUMO_META)
                              para no terminar con "kg"/"Kg"/"KILOS" mezclados para el mismo insumo. */}
                          <Input value={item.unidad} disabled sx={{ borderStyle: 'dashed' }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>Valor ($)</Typography>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.precio || ''}
                            onChange={(e) => handleItemChange(idx, 'precio', Math.max(0, parseInt(e.target.value) || 0))}
                          />
                        </Box>
                      </Box>

                      {/* Trazabilidad del lote — subgrupo colapsable, separado con una línea punteada */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                        <Box
                          component="button"
                          type="button"
                          onClick={() => toggleLote(idx)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'none',
                            border: 'none',
                            p: 0,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: '0.04em' }}>
                            <IconHash size={12} style={{ opacity: 0.5 }} />
                            Trazabilidad del lote
                            <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 400, color: 'text.dim' }}>
                              · {item.lote}
                            </Box>
                          </Box>
                          {abierto ? <IconChevronUp size={14} style={{ opacity: 0.6 }} /> : <IconChevronDown size={14} style={{ opacity: 0.6 }} />}
                        </Box>

                        {abierto && (
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>N.º de lote</Typography>
                              <Input value={item.lote} disabled leftIcon={<IconHash size={11} />} sx={{ fontFamily: 'monospace', fontSize: 11, borderStyle: 'dashed' }} />
                              <Typography sx={{ fontSize: 10, color: 'text.dim' }}>Automático · no editable</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>Vencimiento</Typography>
                              <Input
                                type="date"
                                value={item.fechaVencimiento}
                                onChange={(e) => handleItemChange(idx, 'fechaVencimiento', e.target.value)}
                                leftIcon={<IconCalendar size={12} />}
                              />
                              <Typography sx={{ fontSize: 10, color: 'text.dim' }}>Opcional, si aplica</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography sx={{ fontSize: 10.5, color: 'text.dim' }}>Cant. disponible</Typography>
                              <Input type="number" value={item.cantidadDisponible} disabled sx={{ borderStyle: 'dashed' }} />
                              <Typography sx={{ fontSize: 10, color: 'text.dim' }}>Igual al total comprado</Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )
                })}

                <Button variant="secondary" size="sm" leftIcon={<IconPlus size={13} />} onClick={handleAddFormItem}>
                  Agregar insumo
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={dimLabelSx}>Observaciones</Typography>
                <Box
                  component="textarea"
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Notas internas sobre esta orden…"
                  sx={{
                    width: '100%',
                    p: 1.25,
                    fontSize: 13,
                    fontFamily: 'inherit',
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'transparent',
                    outline: 'none',
                    resize: 'none',
                    color: 'text.primary',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Footer fijo: no se desplaza junto con el body */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: 11, color: 'text.dim' }}>Total a pagar</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary' }}>${totalForm.toLocaleString('es-CO')}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmarCompra}>
                Generar orden
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>

      {/* Modal: Editar */}
      <Modal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditTarget(null)
        }}
        title={`Editar orden ${editTarget?.id ?? ''}`}
        size="md"
      >
        {editTarget && <EditForm compra={editTarget} />}
      </Modal>

      {/* Modal: Eliminar */}
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteTarget(null)
        }}
        title="Confirmar eliminación"
        size="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            ¿Estás seguro de que deseas eliminar la orden{' '}
            <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.primary' }}>
              {deleteTarget?.id}
            </Box>
            ? Esta acción no se puede deshacer.
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteTarget(null)
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmarEliminar}>
              Eliminar permanentemente
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}