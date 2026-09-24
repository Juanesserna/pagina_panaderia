import { useState, useMemo, useRef, useEffect } from 'react'
import { Box, Stack, Typography, IconButton, Divider, Collapse, Autocomplete, TextField, OutlinedInput, InputAdornment, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  IconSearch,
  IconPlus,
  IconMinus,
  IconFilter,
  IconX,
  IconDownload,
  IconUpload,
  IconReceipt,
  IconCircleCheck,
  IconCircleX,
  IconToggleRight,
} from '@tabler/icons-react'
import {
  initialVentas, estadoVariant, estadoOptions, estadoDotColor, // 👈 agregar
  esTransicionValida, opcionesEstadoParaFila, usuarioAutenticado,
  catalogoClientes, catalogoPanaderia, obtenerProductosVenta,
  obtenerNombreCliente, parseFechaVenta, fechaHoyFormateada, PAGE_SIZE,
} from '@features/ventas/data/ventasMockData'
import { KPICard } from '@features/ventas/components/KPICard'
import { StatusBadge } from '@features/ventas/components/StatusBadge'
import { Button } from '@features/ventas/components/Button'
import { Input } from '@features/ventas/components/Input'
import { Select } from '@features/ventas/components/Select'
import { DataTable } from '@features/ventas/components/DataTable'
import { Pagination } from '@features/ventas/components/Pagination'
import { Modal } from '@features/ventas/components/Modal'
import { ImageWithFallback } from '@features/ventas/components/ImageWithFallback'

// ---------- Helpers de presentación ----------

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

// Métodos de pago: mismos valores que muestra la columna "Método" del listado y el filtro
const metodoOptions = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
]

// Canales de venta
const canalOptions = [
  { value: 'pagina', label: 'Página' },
  { value: 'encargo', label: 'Encargo' },
  { value: 'presencial', label: 'Presencial' },
]

// Comprobantes permitidos según pago_unico:
// - pago_unico = true  → 1 comprobante (url_comprobante_1, 100%)
// - pago_unico = false → 2 comprobantes (url_comprobante_1 y url_comprobante_2, 50% c/u)
const pagosPermitidos = (venta) => (venta?.pagoUnico === false ? 2 : 1)

function FilterLabel({ children }) {
  return (
    <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
      {children}
    </Typography>
  )
}

// ---------- Sistema de notificaciones (toasts) ----------

const notificacionEstilos = {
  exito: { bg: '#DCE6D0', dot: '#5B7F44', titulo: '#2F3B22', texto: '#586B45' },
  advertencia: { bg: '#F5DFB3', dot: '#C97A45', titulo: '#4A2E17', texto: '#7A5230' },
  error: { bg: '#F2D4D4', dot: '#C0392B', titulo: '#6B1E1E', texto: '#8A3D3D' },
}

function Notificacion({ tipo, titulo, mensaje }) {
  const s = notificacionEstilos[tipo] || notificacionEstilos.exito
  return (
    <Box
      sx={{
        bgcolor: s.bg,
        borderRadius: 2,
        px: 2.25,
        py: 1.5,
        minWidth: 270,
        maxWidth: 340,
        boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
        animation: 'ah-notif-in 0.25s ease-out',
        '@keyframes ah-notif-in': {
          from: { opacity: 0, transform: 'translateX(24px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.dot, mb: 0.75 }} />
      <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: s.titulo, lineHeight: 1.3 }}>{titulo}</Typography>
      <Typography sx={{ fontSize: 12.5, color: s.texto, mt: 0.25 }}>{mensaje}</Typography>
    </Box>
  )
}

function NotificacionesContainer({ notificaciones }) {
  if (notificaciones.length === 0) return null
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        pointerEvents: 'none',
      }}
    >
      {notificaciones.map((n) => (
        <Box key={n.id} sx={{ pointerEvents: 'auto' }}>
          <Notificacion tipo={n.tipo} titulo={n.titulo} mensaje={n.mensaje} />
        </Box>
      ))}
    </Box>
  )
}

const contieneCaracterEspecial = (texto) => /[^a-zA-Z0-9À-ÿ\s]/.test(texto || '')

const normalizarTexto = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export default function VentasPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const autocompleteInputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: isDark ? '#30231C' : theme.palette.ahSurface2,
      '& fieldset': { borderColor: 'transparent' },
      '&:hover fieldset': { borderColor: theme.palette.divider },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
    },
  }

  const [ventas, setVentas] = useState(initialVentas)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [selected, setSelected] = useState(null)

  const [showFiltros, setShowFiltros] = useState(false)
  const [estadoFilter, setEstadoFilter] = useState('')
  const [metodoFilter, setMetodoFilter] = useState('')
  const [cantidadMin, setCantidadMin] = useState('')
  const [cantidadMax, setCantidadMax] = useState('')
  const [totalMin, setTotalMin] = useState('')
  const [totalMax, setTotalMax] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const [showEstadoModal, setShowEstadoModal] = useState(false)
  const [ventaEstadoModal, setVentaEstadoModal] = useState(null)
  const [estadoSeleccionadoModal, setEstadoSeleccionadoModal] = useState(null)

  const [showVentaModal, setShowVentaModal] = useState(false)
  const [formItems, setFormItems] = useState([])
  const [formId, setFormId] = useState('')
  const [formFecha, setFormFecha] = useState('')
  const [formHora, setFormHora] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [formMetodo, setFormMetodo] = useState('efectivo')
  const [formPagoDividido, setFormPagoDividido] = useState(false) // false = pago único (100%) · true = pago dividido (2 pagos de 50%)
  const [busquedaProducto, setBusquedaProducto] = useState('')

  const comprobanteRef = useRef(null)
  const transferenciaInputRef = useRef(null)
  const [uploadingVentaId, setUploadingVentaId] = useState(null)

  // Abonos: { id, idVenta, slot (1 | 2), fecha, urlComprobante } — slot 2 solo existe en ventas por encargo
  const [abonos, setAbonos] = useState([])
  const [showAbonoModal, setShowAbonoModal] = useState(false)
  const [ventaAbonoModal, setVentaAbonoModal] = useState(null)
  const abonoInputRef = useRef(null)
  const abonoSlotRef = useRef(null)

  const [notificaciones, setNotificaciones] = useState([])
  const timersNotificacionRef = useRef({})

  const mostrarNotificacion = (tipo, titulo, mensaje) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setNotificaciones((prev) => [...prev, { id, tipo, titulo, mensaje }])
    timersNotificacionRef.current[id] = setTimeout(() => {
      setNotificaciones((prev) => prev.filter((n) => n.id !== id))
      delete timersNotificacionRef.current[id]
    }, 4000)
  }

  useEffect(() => {
    return () => {
      Object.values(timersNotificacionRef.current).forEach(clearTimeout)
    }
  }, [])

  const clienteTuvoCaracterEspecialRef = useRef(false)
  const productoTuvoCaracterEspecialRef = useRef(false)

  const validarCaracterEspecial = (valor, ref) => {
    const tieneEspecial = contieneCaracterEspecial(valor)
    if (tieneEspecial && !ref.current) {
      mostrarNotificacion(
        'advertencia',
        'Carácter no permitido',
        'Evita usar símbolos especiales en el formulario de ventas'
      )
    }
    ref.current = tieneEspecial
  }

  const handleClickCargarTransferencia = (id) => {
    setUploadingVentaId(id)
    transferenciaInputRef.current?.click()
  }

  const handleImagenTransferenciaSeleccionada = (e) => {
    const file = e.target.files?.[0]
    const targetId = uploadingVentaId
    e.target.value = ''
    if (!file || !targetId || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setVentas((prev) => prev.map((v) => (v.id === targetId ? { ...v, imagenTransferencia: dataUrl } : v)))
      setSelected((prev) => (prev && prev.id === targetId ? { ...prev, imagenTransferencia: dataUrl } : prev))
    }
    reader.readAsDataURL(file)
    setUploadingVentaId(null)
  }

  const handleDescargarComprobante = () => {
    if (!selected) return
    const ventana = window.open('', '_blank', 'width=480,height=700')
    if (!ventana || !comprobanteRef.current) return
    ventana.document.write(`
      <!DOCTYPE html><html><head><meta charset="utf-8" /><title>Comprobante ${selected.id}</title>
      <style>body{margin:0;padding:24px;display:flex;justify-content:center;background:#fff;font-family:monospace;}@media print{body{padding:0;}}</style>
      </head><body>${comprobanteRef.current.outerHTML}
      <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};}<\/script>
      </body></html>
    `)
    ventana.document.close()
  }

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleCambiarEstado = (id, nuevoEstadoFila) => {
    setVentas((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v
        if (!esTransicionValida(v.estado, nuevoEstadoFila)) return v
        return { ...v, estado: nuevoEstadoFila }
      })
    )
    setSelected((prev) =>
      prev && prev.id === id && esTransicionValida(prev.estado, nuevoEstadoFila) ? { ...prev, estado: nuevoEstadoFila } : prev
    )
  }

  const abrirModalEstado = (venta) => {
    if (venta.estado === 'cancelado') return
    setVentaEstadoModal(venta)
    setEstadoSeleccionadoModal(venta.estado)
    setShowEstadoModal(true)
  }

  const cerrarModalEstado = () => {
    setShowEstadoModal(false)
    setVentaEstadoModal(null)
    setEstadoSeleccionadoModal(null)
  }

  const confirmarCambioEstado = () => {
    if (!ventaEstadoModal || !estadoSeleccionadoModal) return
    handleCambiarEstado(ventaEstadoModal.id, estadoSeleccionadoModal)
    cerrarModalEstado()
  }

  // ---------- Pagos (según canal: 1 comprobante, o 2 si es encargo) ----------

  const abrirModalAbono = (venta) => {
    setVentaAbonoModal(venta)
    setShowAbonoModal(true)
  }

  const cerrarModalAbono = () => {
    setShowAbonoModal(false)
    setVentaAbonoModal(null)
    abonoSlotRef.current = null
  }

  // slot: 1 o 2. Sirve tanto para subir como para reemplazar el comprobante.
  const handleClickSubirComprobante = (slot) => {
    abonoSlotRef.current = slot
    abonoInputRef.current?.click()
  }

  const handleImagenAbonoSeleccionada = (e) => {
    const file = e.target.files?.[0]
    const slot = abonoSlotRef.current
    e.target.value = ''
    abonoSlotRef.current = null
    if (!file || !slot || !ventaAbonoModal || !file.type.startsWith('image/')) return

    const idVenta = ventaAbonoModal.id
    // ¿Con este comprobante queda cubierto el 100% de la venta?
    const otrosComprobantes = abonos.filter((a) => a.idVenta === idVenta && a.slot !== slot).length
    const pagoCompleto = otrosComprobantes + 1 >= pagosPermitidos(ventaAbonoModal)
    const reader = new FileReader()
    reader.onload = () => {
      const urlComprobante = reader.result
      setAbonos((prev) => {
        const existe = prev.some((a) => a.idVenta === idVenta && a.slot === slot)
        if (existe) {
          return prev.map((a) =>
            a.idVenta === idVenta && a.slot === slot ? { ...a, urlComprobante, fecha: fechaHoyFormateada() } : a
          )
        }
        return [...prev, { id: `AB-${idVenta.replace('#', '')}-${slot}`, idVenta, slot, fecha: fechaHoyFormateada(), urlComprobante }]
      })

      // Al subir una captura la venta pasa a "pago parcial" mientras aún quede saldo por pagar
      if (!pagoCompleto) {
        setVentas((prev) =>
          prev.map((v) => (v.id === idVenta && esTransicionValida(v.estado, 'pago parcial') ? { ...v, estado: 'pago parcial' } : v))
        )
      }
    }
    reader.readAsDataURL(file)
  }

  const abonosDeVenta = useMemo(
    () => (ventaAbonoModal ? abonos.filter((a) => a.idVenta === ventaAbonoModal.id) : []),
    [abonos, ventaAbonoModal]
  )

  const comprobanteDeSlot = (slot) => abonosDeVenta.find((a) => a.slot === slot)

  const cantidadPagos = pagosPermitidos(ventaAbonoModal)
  const slotsPago = Array.from({ length: cantidadPagos }, (_, i) => i + 1)
  const montoPorPago = ventaAbonoModal ? ventaAbonoModal.total / cantidadPagos : 0
  const totalAbonadoVenta = abonosDeVenta.filter((a) => a.slot <= cantidadPagos).length * montoPorPago
  const saldoPendienteVenta = ventaAbonoModal ? Math.max(ventaAbonoModal.total - totalAbonadoVenta, 0) : 0

  const filtered = useMemo(() => {
    let data = ventas
    if (search)
      data = data.filter(
        (v) =>
          v.usuario.toLowerCase().includes(search.toLowerCase()) ||
          (v.cliente ?? '').toLowerCase().includes(search.toLowerCase()) ||
          v.id.includes(search)
      )
    if (estadoFilter) data = data.filter((v) => v.estado === estadoFilter)
    if (metodoFilter) data = data.filter((v) => v.metodo === metodoFilter)
    if (cantidadMin !== '') {
      const min = parseInt(cantidadMin, 10)
      if (!isNaN(min)) data = data.filter((v) => v.productos >= min)
    }
    if (cantidadMax !== '') {
      const max = parseInt(cantidadMax, 10)
      if (!isNaN(max)) data = data.filter((v) => v.productos <= max)
    }
    if (totalMin !== '') {
      const min = parseFloat(totalMin)
      if (!isNaN(min)) data = data.filter((v) => v.total >= min)
    }
    if (totalMax !== '') {
      const max = parseFloat(totalMax)
      if (!isNaN(max)) data = data.filter((v) => v.total <= max)
    }
    if (fechaDesde) {
      const desde = new Date(`${fechaDesde}T00:00:00`)
      data = data.filter((v) => parseFechaVenta(v) >= desde)
    }
    if (fechaHasta) {
      const hasta = new Date(`${fechaHasta}T23:59:59`)
      data = data.filter((v) => parseFechaVenta(v) <= hasta)
    }
    data = [...data].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'id') cmp = parseInt(a.id.replace('#', '')) - parseInt(b.id.replace('#', ''))
      if (sortKey === 'total') cmp = a.total - b.total
      return sortDir === 'asc' ? cmp : -cmp
    })
    return data
  }, [ventas, search, estadoFilter, metodoFilter, cantidadMin, cantidadMax, totalMin, totalMax, fechaDesde, fechaHasta, sortKey, sortDir])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const filtrosActivos = Boolean(
    estadoFilter || metodoFilter || cantidadMin || cantidadMax || totalMin || totalMax || fechaDesde || fechaHasta
  )
  const cantidadFiltrosActivos = [estadoFilter, metodoFilter, cantidadMin, cantidadMax, totalMin, totalMax, fechaDesde, fechaHasta].filter(Boolean).length

  const limpiarFiltros = () => {
    setEstadoFilter('')
    setMetodoFilter('')
    setCantidadMin('')
    setCantidadMax('')
    setTotalMin('')
    setTotalMax('')
    setFechaDesde('')
    setFechaHasta('')
    setPage(1)
  }

  const totalFormulario = formItems.reduce((s, i) => s + i.cantidad * i.precio, 0)

  const resetFormularioVenta = () => {
    setFormItems([])
    setClienteSeleccionado(null)
    setFormMetodo('efectivo')
    setFormPagoDividido(false)
    setBusquedaProducto('')
    clienteTuvoCaracterEspecialRef.current = false
    productoTuvoCaracterEspecialRef.current = false
  }

  const nextId = () => {
    const maxNum = ventas.reduce((max, v) => Math.max(max, parseInt(v.id.replace('#', ''), 10) || 0), 0)
    return `#${maxNum + 1}`
  }

  const handleNuevaVenta = () => {
    resetFormularioVenta()
    setFormId(nextId())
    setFormFecha(fechaHoyFormateada())
    const ahora = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    setFormHora(`${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`)
    setShowVentaModal(true)
  }

  const productoSinStock = (producto) => {
    if (!producto) return false
    if (typeof producto.stock === 'number') return producto.stock <= 0
    return normalizarTexto(producto.nombre) === 'pan frances'
  }

  // Agrega 1 unidad (la cantidad se modifica solo en el resumen). Devuelve true si se agregó.
  const agregarProducto = (producto) => {
    if (!producto) return false

    if (productoSinStock(producto)) {
      mostrarNotificacion('error', 'Sin stock disponible', `${producto.nombre} no cuenta con stock disponible`)
      return false
    }

    setFormItems((prev) => {
      const existente = prev.find((i) => i.nombre === producto.nombre)
      if (existente) {
        return prev.map((i) => (i.nombre === producto.nombre ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...prev, { nombre: producto.nombre, cantidad: 1, precio: producto.precio }]
    })
    return true
  }

  // Catálogo filtrado por el buscador (ignora mayúsculas y tildes)
  const productosFiltrados = useMemo(() => {
    const q = normalizarTexto(busquedaProducto).trim()
    if (!q) return catalogoPanaderia
    return catalogoPanaderia.filter((p) => normalizarTexto(p.nombre).includes(q))
  }, [busquedaProducto])

  // Agrega el primer producto que coincide con la búsqueda
  const handleAgregarProducto = () => {
    if (agregarProducto(productosFiltrados[0])) setBusquedaProducto('')
  }

  const handleQuitarProducto = (nombre) => setFormItems((prev) => prev.filter((i) => i.nombre !== nombre))

  const handleActualizarCantidad = (nombre, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleQuitarProducto(nombre)
      return
    }
    setFormItems((prev) => prev.map((i) => (i.nombre === nombre ? { ...i, cantidad: nuevaCantidad } : i)))
  }

  const clienteValido = Boolean(clienteSeleccionado)

  const handleConfirmarVenta = () => {
    if (formItems.length === 0 || !clienteValido) return
    const nuevaVenta = {
      id: formId,
      usuario: usuarioAutenticado.nombre,
      cliente: clienteSeleccionado.nombre || 'Cliente no especificado',
      nit: clienteSeleccionado.nit,
      origen: 'manual',
      productos: formItems.reduce((s, i) => s + i.cantidad, 0),
      total: totalFormulario,
      estado: 'pendiente',
      metodo: formMetodo,
      canal: 'presencial',
      pagoUnico: !formPagoDividido,
      fecha: formFecha,
      hora: formHora,
      items: formItems,
    }
    setVentas((prev) => [nuevaVenta, ...prev])
    setShowVentaModal(false)
    mostrarNotificacion('exito', 'Venta registrada', `La venta ${nuevaVenta.id} se creó correctamente`)
  }

  const completados = ventas.filter((v) => v.estado === 'completado').length
  const cancelados = ventas.filter((v) => v.estado === 'cancelado').length
  const puedeVerComprobante = (v) => v.estado === 'completado' || v.estado === 'cancelado'

  const columns = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '7%',
      accessor: (r) => <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>{r.id}</Typography>,
    },
    {
      key: 'nit',
      header: 'NIT/Cédula',
      width: '12%',
      accessor: (r) => <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{r.nit || '—'}</Typography>,
    },
    {
      key: 'metodo',
      header: 'Método',
      width: '11%',
      accessor: (r) => <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{r.metodo ? cap(r.metodo) : '—'}</Typography>,
    },
    {
      key: 'canal',
      header: 'Canal',
      width: '10%',
      accessor: (r) => (
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          {r.canal ? canalOptions.find((o) => o.value === r.canal)?.label ?? cap(r.canal) : '—'}
        </Typography>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      width: '9%',
      accessor: (r) => <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary' }}>${r.total.toFixed(2)}</Typography>,
    },
    {
      key: 'estado',
      header: 'Estado',
      width: '18%',
      accessor: (r) => {
        const bloqueado = r.estado === 'cancelado'
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <StatusBadge variant={estadoVariant[r.estado]} dot>
              {cap(r.estado)}
            </StatusBadge>
            <IconButton
              size="small"
              disabled={bloqueado}
              title={bloqueado ? 'Una venta cancelada no se puede modificar' : 'Cambiar estado'}
              onClick={(e) => {
                e.stopPropagation()
                abrirModalEstado(r)
              }}
              sx={{ color: bloqueado ? 'text.dim' : 'text.secondary' }}
            >
              <IconToggleRight size={16} />
            </IconButton>
          </Stack>
        )
      },
    },
    {
      key: 'fecha',
      header: 'Fecha',
      width: '12%',
      accessor: (r) => (
        <Typography sx={{ color: 'text.secondary', fontSize: 11 }}>
          {r.fecha} {r.hora}
        </Typography>
      ),
    },
    {
      key: 'acciones',
      header: '',
      align: 'right',
      width: '21%',
      accessor: (r) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5} sx={{ width: '100%' }}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<IconReceipt size={12} />}
            onClick={(e) => {
              e.stopPropagation()
              abrirModalAbono(r)
            }}
            sx={{ fontSize: 11 }}
          >
            Pagos
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!puedeVerComprobante(r)}
            onClick={(e) => {
              e.stopPropagation()
              setSelected(r)
              setShowModal(true)
            }}
            sx={{ fontSize: 11 }}
          >
            Ver comprobante
          </Button>
        </Stack>
      ),
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <NotificacionesContainer notificaciones={notificaciones} />

      <input ref={transferenciaInputRef} type="file" accept="image/*" hidden onChange={handleImagenTransferenciaSeleccionada} />
      <input ref={abonoInputRef} type="file" accept="image/*" hidden onChange={handleImagenAbonoSeleccionada} />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 2,
        '& > *': isDark ? { backgroundColor: '#2A1D16', backgroundImage: 'none' } : {}
      }}>
        <KPICard title="Completados" value={completados} icon={<IconCircleCheck size={16} />} variant="success" />
        <KPICard title="Cancelados" value={cancelados} icon={<IconCircleX size={16} />} variant="danger" />
      </Box>

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: isDark ? '#2A1D16' : 'background.paper', border: '1px solid', borderColor: 'divider', backgroundImage: 'none' }}>
        <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ px: 2.5, py: 2, alignItems: 'center', }}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'text.primary', mr: 'auto' }}>Registro de ventas</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25 }}>
            <OutlinedInput
              placeholder="Buscar pedido o cliente…"
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
                width: 250,
                bgcolor: isDark ? '#32251F' : '#F4EFEA',
                height: 35,
                borderRadius: 1,
                fontSize: 12,
                '& fieldset': {
                  borderColor: isDark ? 'transparent' : '#E5DCD3'
                },
                '&:hover fieldset': {
                  borderColor: '#C97A45'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C97A45'
                }
              }}
            />
            <Button
              variant="primary"
              size="sm"
              leftIcon={<IconPlus size={13} />}
              onClick={handleNuevaVenta}
              sx={{
                height: 28,
                borderRadius: 1,
                fontSize: 12,
                ...(isDark && {
                  backgroundColor: '#A85D33',
                  color: '#000000',
                  '&:hover': { backgroundColor: '#8A4A28' }
                })
              }}
            >
              Nueva venta
            </Button>
            <Button
              variant={filtrosActivos ? 'primary' : 'secondary'}
              size="sm"
              leftIcon={<IconFilter size={13} />}
              onClick={() => setShowFiltros((v) => !v)}
              sx={{
                height: 28,
                borderRadius: 1,
                fontSize: 12,
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
          </Box>
        </Stack>

        <Divider />

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
            <Box sx={{ width: 130 }}>
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
            <Box sx={{ width: 130 }}>
              <FilterLabel>Método</FilterLabel>
              <Select
                options={[{ value: '', label: 'Todos' }, ...metodoOptions]}
                value={metodoFilter}
                onChange={(e) => {
                  setMetodoFilter(e.target.value)
                  setPage(1)
                }}
              />
            </Box>
            <Box sx={{ width: 90 }}>
              <FilterLabel>Cantidad mín.</FilterLabel>
              <Input
                type="number"
                placeholder="0"
                value={cantidadMin}
                onChange={(e) => {
                  setCantidadMin(e.target.value)
                  setPage(1)
                }}
              />
            </Box>
            <Box sx={{ width: 100 }}>
              <FilterLabel>Cantidad máx.</FilterLabel>
              <Input
                type="number"
                placeholder="Sin límite"
                value={cantidadMax}
                onChange={(e) => {
                  setCantidadMax(e.target.value)
                  setPage(1)
                }}
              />
            </Box>
            <Box sx={{ width: 90 }}>
              <FilterLabel>Total mín.</FilterLabel>
              <Input
                type="number"
                placeholder="$0"
                value={totalMin}
                onChange={(e) => {
                  setTotalMin(e.target.value)
                  setPage(1)
                }}
              />
            </Box>
            <Box sx={{ width: 100 }}>
              <FilterLabel>Total máx.</FilterLabel>
              <Input
                type="number"
                placeholder="Sin límite"
                value={totalMax}
                onChange={(e) => {
                  setTotalMax(e.target.value)
                  setPage(1)
                }}
              />
            </Box>
            <Box sx={{ width: 140 }}>
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
            <Box sx={{ width: 140 }}>
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
            {filtrosActivos && (
              <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            )}
          </Stack>
        </Collapse>

        <DataTable
          columns={columns}
          data={paginated}
          keyExtractor={(r) => r.id}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyMessage="Sin ventas encontradas"
        />

        <Box
          sx={{
            px: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            '& p, & span, & .MuiTypography-root': {
              fontSize: '11px !important',
              color: `${theme.palette.text.secondary} !important`,
            },
          }}
        >
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Box>
      </Box>

      {/* Modal: Cambiar estado */}
      <Modal open={showEstadoModal} onClose={cerrarModalEstado} title="Cambiar estado" size="sm">
        {ventaEstadoModal && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Venta <b>{ventaEstadoModal.id}</b> · {obtenerNombreCliente(ventaEstadoModal)}
            </Typography>
            {opcionesEstadoParaFila(ventaEstadoModal.estado).map((o) => {
              const activo = estadoSeleccionadoModal === o.value
              const color = estadoDotColor[o.value]
              return (
                <Box
                  key={o.value}
                  onClick={() => setEstadoSeleccionadoModal(o.value)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: activo ? 'text.primary' : 'divider',
                    borderRadius: 1.5,
                    px: 1.25,
                    py: 0.875,
                    bgcolor: activo ? 'action.selected' : 'transparent',
                  }}
                >
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }} />
                  <Typography variant="body2" sx={{ flex: 1 }}>{o.label}</Typography>
                </Box>
              )
            })}

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
              <Button variant="secondary" size="sm" onClick={cerrarModalEstado}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!estadoSeleccionadoModal || estadoSeleccionadoModal === ventaEstadoModal?.estado}
                onClick={confirmarCambioEstado}
              >
                Confirmar
              </Button>
            </Stack>
          </Box>
        )}
      </Modal>

      {/* Modal: Comprobante */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Comprobante de venta" size="md">
        {selected && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
            <Box
              ref={comprobanteRef}
              sx={{
                width: '100%',
                maxWidth: 340,
                fontFamily: 'monospace',
                fontSize: 12,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.default',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, px: 2.5, pt: 2, pb: 1.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Typography sx={{ fontWeight: 700, letterSpacing: 2.5, fontSize: 13 }}>PANADERÍA</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Comprobante de venta</Typography>
                <Typography sx={{ fontSize: 12, mt: 1 }}>{selected.id}</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, px: 2.5, py: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>Cliente</span><b>{obtenerNombreCliente(selected)}</b></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>Fecha</span><span>{selected.fecha} · {selected.hora}</span></Box>
                {selected.nit && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>NIT/Cédula</span><span>{selected.nit}</span></Box>}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pago</span><span>{selected.metodo ? cap(selected.metodo) : '—'}</span>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, px: 2.5, py: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                {obtenerProductosVenta(selected).map((p, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                    <span>{p.cantidad}x</span>
                    <span style={{ flex: 1 }}>{p.nombre}</span>
                    <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, px: 2.5, py: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                  <span>Artículos</span><span>{selected.productos}</span>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', pt: 0.75 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>TOTAL</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>${selected.total.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, px: 2.5, py: 1.75 }}>
                <StatusBadge variant={estadoVariant[selected.estado]} dot>
                  {cap(selected.estado)}
                </StatusBadge>
                <Typography sx={{ fontSize: 11, color: 'text.dim' }}>¡Gracias por su compra!</Typography>
              </Box>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 340, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="sm"
                leftIcon={<IconDownload size={12} />}
                onClick={handleDescargarComprobante}
                sx={{
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
                Descargar comprobante
              </Button>
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ width: '100%' }}>
              <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
            </Stack>
          </Box>
        )}
      </Modal>

      {/* Modal: Pagos (encargo: 2 comprobantes de 50% · página/presencial: 1 comprobante de 100%) */}
      <Modal open={showAbonoModal} onClose={cerrarModalAbono} title="Pagos de la venta" size="md">
        {ventaAbonoModal && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Venta <b>{ventaAbonoModal.id}</b> · {obtenerNombreCliente(ventaAbonoModal)}
            </Typography>

            {/* Resumen: total, pagado y saldo pendiente */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                border: '1px solid',
                borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                borderRadius: 1.5,
                p: 1.75,
                bgcolor: isDark ? '#30231C' : '#F9F8F8',
              }}
            >
              <Box>
                <FilterLabel>Total venta</FilterLabel>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>${ventaAbonoModal.total.toFixed(2)}</Typography>
              </Box>
              <Box>
                <FilterLabel>Pagado</FilterLabel>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>${totalAbonadoVenta.toFixed(2)}</Typography>
              </Box>
              <Box>
                <FilterLabel>Saldo pendiente</FilterLabel>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: saldoPendienteVenta <= 0 ? 'success.main' : 'text.primary' }}>
                  ${saldoPendienteVenta.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <FilterLabel>Comprobantes de pago</FilterLabel>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: cantidadPagos === 2 ? '1fr 1fr' : '1fr' }, gap: 2 }}>
              {slotsPago.map((slot) => {
                const abono = comprobanteDeSlot(slot)
                return (
                  <Box
                    key={slot}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      minWidth: 0,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.5,
                      p: 1.25,
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{100 / cantidadPagos}% · ${montoPorPago.toFixed(2)}</Typography>

                    {abono ? (
                      <>
                        <ImageWithFallback
                          src={abono.urlComprobante}
                          alt={`Comprobante del pago ${slot}`}
                          onClick={() => window.open(abono.urlComprobante, '_blank')}
                          style={{ width: '100%', height: 130, borderRadius: 6, border: `1px solid ${theme.palette.divider}`, objectFit: 'cover', cursor: 'pointer' }}
                        />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: 11, color: 'text.dim' }}>{abono.fecha}</Typography>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<IconUpload size={12} />}
                            onClick={() => handleClickSubirComprobante(slot)}
                          >
                            Reemplazar
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => handleClickSubirComprobante(slot)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 3, borderStyle: 'dashed' }}
                      >
                        <IconUpload size={16} />
                        Subir comprobante
                      </Button>
                    )}
                  </Box>
                )
              })}
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
              <Button variant="secondary" size="sm" onClick={cerrarModalAbono}>
                Cerrar
              </Button>
            </Stack>
          </Box>
        )}
      </Modal>

      {/* Modal: Nueva venta (master-detail) */}
      <Modal
        open={showVentaModal}
        onClose={() => setShowVentaModal(false)}
        title="Nueva venta"
        size="lg"
        sx={{
          width: '100%',
          maxWidth: 1100,
          minHeight: 600,
          ...(isDark && {
            bgcolor: '#2A1D16',
            backgroundImage: 'none !important',
            '--Paper-overlay': 'none',
          }),
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: '20px' }}>
          {/* Parte superior: NIT/Cédula, Estado, Método de pago y Canal + ID/Fecha */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '0.8fr 1.3fr 1.5fr 1fr 1.8fr' },
              gap: 2,
              alignItems: 'end',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <FilterLabel>ID de venta</FilterLabel>
              <TextField
                fullWidth
                size="small"
                value={formId}
                disabled
                sx={autocompleteInputSx}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <FilterLabel>Fecha</FilterLabel>
              <TextField
                fullWidth
                size="small"
                value={`${formFecha} · ${formHora}`}
                disabled
                sx={autocompleteInputSx}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <FilterLabel>NIT/Cédula</FilterLabel>
              <Autocomplete
                size="small"
                options={catalogoClientes}
                getOptionLabel={(c) => `${c.nit} — ${c.nombre}`}
                value={clienteSeleccionado}
                onChange={(_, value) => setClienteSeleccionado(value)}
                onInputChange={(_, value) => validarCaracterEspecial(value, clienteTuvoCaracterEspecialRef)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar por NIT o nombre…"
                    sx={autocompleteInputSx}
                    InputProps={{
                      ...(params.InputProps || {}),
                      startAdornment: (
                        <InputAdornment position="start" sx={{ pl: 1 }}>
                          <IconSearch size={18} color="#A0968C" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <FilterLabel>Método de pago</FilterLabel>
              <TextField
                select
                fullWidth
                size="small"
                value={formMetodo}
                onChange={(e) => setFormMetodo(e.target.value)}
                sx={autocompleteInputSx}
              >
                {metodoOptions.map((opcion) => (
                  <MenuItem key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formPagoDividido}
                    onChange={(e) => setFormPagoDividido(e.target.checked)}
                  />
                }
                label="Pago dividido (dos pagos del 50%)"
                sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: 12 } }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Master-detail: catálogo (izquierda) + resumen (derecha) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr 1fr' }, gap: 2.5, alignItems: 'stretch' }}>
            {/* Catálogo de productos */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0 }}>
              <FilterLabel>Catálogo de productos</FilterLabel>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 1.25,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  p: 1.25,
                  minHeight: 180,
                  maxHeight: 380,
                  overflowY: 'auto',
                }}
              >
                {productosFiltrados.map((p) => {
                  const sinStock = productoSinStock(p)
                  return (
                    <Box
                      key={p.nombre}
                      component="button"
                      type="button"
                      onClick={() => agregarProducto(p)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 0.75,
                        p: 1.25,
                        font: 'inherit',
                        color: 'text.primary',
                        textAlign: 'left',
                        cursor: sinStock ? 'not-allowed' : 'pointer',
                        opacity: sinStock ? 0.5 : 1,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                        bgcolor: isDark ? '#30231C' : '#F9F8F8',
                        '&:hover': { borderColor: '#C97A45' },
                      }}
                    >
                      {p.imagen ? (
                        <ImageWithFallback
                          src={p.imagen}
                          alt={p.nombre}
                          style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                        />
                      ) : (
                        <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'text.secondary' }}>
                          {p.nombre.charAt(0)}
                        </Box>
                      )}
                      <Typography sx={{ fontSize: 12, lineHeight: 1.3 }}>{p.nombre}</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>${p.precio.toFixed(2)}</Typography>
                    </Box>
                  )
                })}
                {productosFiltrados.length === 0 && (
                  <Box sx={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5, color: 'text.secondary', fontSize: 13 }}>
                    Sin productos que coincidan
                  </Box>
                )}
              </Box>

              {/* Buscar producto (debajo del catálogo) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar producto…"
                    value={busquedaProducto}
                    onChange={(e) => {
                      validarCaracterEspecial(e.target.value, productoTuvoCaracterEspecialRef)
                      setBusquedaProducto(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (busquedaProducto.trim() && productosFiltrados.length > 0) handleAgregarProducto()
                      }
                    }}
                    sx={autocompleteInputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ pl: 1 }}>
                          <IconSearch size={18} color="#A0968C" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconPlus size={12} />}
                  disabled={!busquedaProducto.trim() || productosFiltrados.length === 0}
                  onClick={handleAgregarProducto}
                  sx={{
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
                  Agregar
                </Button>
              </Box>
            </Box>

            {/* Resumen de la venta (único lugar donde se modifica la cantidad) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0, width: '100%' }}>
              <FilterLabel>Resumen</FilterLabel>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, minHeight: 180, maxHeight: 380, overflowY: 'auto', flexGrow: 1 }}>
                {formItems.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5, color: 'text.secondary', fontSize: 13 }}>
                    Sin productos agregados
                  </Box>
                ) : (
                  formItems.map((item, idx) => (
                    <Box key={item.nombre} sx={{ px: 1.25, py: 0.875, borderTop: idx > 0 ? '1px solid' : 'none', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 0.7, mr: 1, border: '1px solid', borderColor: isDark ? '#4A3B32' : '#E4D9C8' }}>
                          <IconButton size="small" onClick={() => handleActualizarCantidad(item.nombre, item.cantidad - 1)}><IconMinus size={11} /></IconButton>
                          <Typography sx={{ width: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{item.cantidad}</Typography>
                          <IconButton size="small" onClick={() => handleActualizarCantidad(item.nombre, item.cantidad + 1)}><IconPlus size={11} /></IconButton>
                        </Box>
                        <Typography sx={{ fontSize: 12.5, flex: 1 }}>{item.nombre}</Typography>
                        <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mx: 1 }}>${(item.cantidad * item.precio).toFixed(2)}</Typography>
                        <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => handleQuitarProducto(item.nombre)}><IconX size={13} /></IconButton>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pt: 2, mt: 'auto' }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Total a pagar</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 17 }}>${totalFormulario.toFixed(2)}</Typography>
              </Box>

              <Button variant="primary" size="sm" fullWidth disabled={formItems.length === 0 || !clienteValido} onClick={handleConfirmarVenta}>
                Registrar venta
              </Button>
            </Box>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="secondary" size="sm" onClick={() => setShowVentaModal(false)}>
              Cancelar
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