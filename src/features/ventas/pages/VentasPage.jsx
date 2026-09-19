import { useState, useMemo, useRef } from 'react'
import { Box, Stack, Typography, IconButton, Divider, Collapse, Autocomplete, TextField, OutlinedInput, InputAdornment} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import {
  IconSearch,
  IconPlus,
  IconMinus,
  IconFilter,
  IconX,
  IconDownload,
  IconUpload,
  IconReceipt,
  IconTrash,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react'
import {
  initialVentas, estadoVariant, estadoOptions,
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

function FilterLabel({ children }) {
  return (
    <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
      {children}
    </Typography>
  )
}

export default function VentasPage() {
  const theme = useTheme()

  // El Autocomplete de MUI necesita un TextField como input interno;
  // los demás campos usan el componente `Input` compartido.
  const autocompleteInputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.ahSurface2,
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
  const [nuevoEstado, setNuevoEstado] = useState('pendiente')
  const [productoAutocomplete, setProductoAutocomplete] = useState(null)
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1)

  const comprobanteRef = useRef(null)
  const transferenciaInputRef = useRef(null)
  const [uploadingVentaId, setUploadingVentaId] = useState(null)

  const [abonos, setAbonos] = useState([])
  const [showAbonoModal, setShowAbonoModal] = useState(false)
  const [ventaAbonoModal, setVentaAbonoModal] = useState(null)
  const [abonoComprobante, setAbonoComprobante] = useState(null)
  const [abonoMonto, setAbonoMonto] = useState('')
  const [abonoMetodo, setAbonoMetodo] = useState('efectivo')
  const abonoInputRef = useRef(null)
  const [abonoAConfirmarEliminar, setAbonoAConfirmarEliminar] = useState(null)

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

  const nextAbonoId = () => {
    const maxNum = abonos.reduce((max, a) => Math.max(max, parseInt(a.id.replace('AB-', ''), 10) || 0), 0)
    return `AB-${String(maxNum + 1).padStart(3, '0')}`
  }

  const abrirModalAbono = (venta) => {
    setVentaAbonoModal(venta)
    setAbonoComprobante(null)
    setAbonoMonto('')
    setAbonoMetodo('efectivo')
    setAbonoAConfirmarEliminar(null)
    setShowAbonoModal(true)
  }

  const cerrarModalAbono = () => {
    setShowAbonoModal(false)
    setVentaAbonoModal(null)
    setAbonoComprobante(null)
    setAbonoMonto('')
    setAbonoAConfirmarEliminar(null)
  }

  const handleImagenAbonoSeleccionada = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setAbonoComprobante(reader.result)
    reader.readAsDataURL(file)
  }

  const abonosDeVenta = useMemo(
    () => (ventaAbonoModal ? abonos.filter((a) => a.idVenta === ventaAbonoModal.id) : []),
    [abonos, ventaAbonoModal]
  )

  const totalAbonadoVenta = abonosDeVenta.reduce((s, a) => s + a.monto, 0)
  const saldoPendienteVenta = ventaAbonoModal ? Math.max(ventaAbonoModal.total - totalAbonadoVenta, 0) : 0
  const montoAbonoValido = parseFloat(abonoMonto) > 0 && parseFloat(abonoMonto) <= saldoPendienteVenta + 0.001

  const handleCambiarMontoAbono = (valor) => {
    if (valor === '') {
      setAbonoMonto('')
      return
    }
    const numero = parseFloat(valor)
    if (isNaN(numero)) {
      setAbonoMonto(valor)
      return
    }
    if (numero > saldoPendienteVenta) setAbonoMonto(saldoPendienteVenta.toFixed(2))
    else setAbonoMonto(valor)
  }

  const resetNuevoAbono = () => {
    setAbonoComprobante(null)
    setAbonoMonto('')
    setAbonoMetodo('efectivo')
  }

  const handleRegistrarAbono = () => {
    if (!ventaAbonoModal || !abonoComprobante || !montoAbonoValido) return
    const nuevoAbono = {
      id: nextAbonoId(),
      idVenta: ventaAbonoModal.id,
      fecha: fechaHoyFormateada(),
      monto: parseFloat(abonoMonto),
      metodoPago: abonoMetodo,
      urlComprobante: abonoComprobante,
    }
    setAbonos((prev) => [nuevoAbono, ...prev])
    resetNuevoAbono()
  }

  const handleClickEliminarAbono = (idAbono) => {
    if (abonoAConfirmarEliminar === idAbono) {
      setAbonos((prev) => prev.filter((a) => a.id !== idAbono))
      setAbonoAConfirmarEliminar(null)
    } else {
      setAbonoAConfirmarEliminar(idAbono)
    }
  }

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
    setNuevoEstado('pendiente')
    setProductoAutocomplete(null)
    setCantidadSeleccionada(1)
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

  const handleAgregarProducto = () => {
    if (!productoAutocomplete || cantidadSeleccionada <= 0) return
    setFormItems((prev) => {
      const existente = prev.find((i) => i.nombre === productoAutocomplete.nombre)
      if (existente) {
        return prev.map((i) => (i.nombre === productoAutocomplete.nombre ? { ...i, cantidad: i.cantidad + cantidadSeleccionada } : i))
      }
      return [...prev, { nombre: productoAutocomplete.nombre, cantidad: cantidadSeleccionada, precio: productoAutocomplete.precio }]
    })
    setProductoAutocomplete(null)
    setCantidadSeleccionada(1)
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
      estado: nuevoEstado,
      fecha: formFecha,
      hora: formHora,
      items: formItems,
    }
    setVentas((prev) => [nuevaVenta, ...prev])
    setShowVentaModal(false)
  }

  const completados = ventas.filter((v) => v.estado === 'completado').length
  const cancelados = ventas.filter((v) => v.estado === 'cancelado').length
  const abonosCount = (idVenta) => abonos.filter((a) => a.idVenta === idVenta).length
  const puedeVerComprobante = (v) => v.estado === 'completado' || v.estado === 'cancelado'

  // ── Columnas de la tabla ────────────────────────────────────────────────

  const columns = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      accessor: (r) => <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{r.id}</Typography>,
    },
    {
      key: 'nit',
      header: 'NIT/Cédula',
      accessor: (r) => <Typography sx={{ color: 'text.secondary' }}>{r.nit || '—'}</Typography>,
    },
    {
      key: 'metodo',
      header: 'Método',
      accessor: (r) => <Typography sx={{ color: 'text.secondary' }}>{r.metodo ? cap(r.metodo) : '—'}</Typography>,
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      accessor: (r) => <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>${r.total.toFixed(2)}</Typography>,
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => {
        const bloqueado = r.estado === 'cancelado'
        return (
          <Box
            onClick={(e) => {
              e.stopPropagation()
              abrirModalEstado(r)
            }}
            title={bloqueado ? 'Una venta cancelada no se puede modificar' : 'Cambiar estado'}
            sx={{ display: 'inline-flex', cursor: bloqueado ? 'not-allowed' : 'pointer', opacity: bloqueado ? 0.5 : 1 }}
          >
            <StatusBadge variant={estadoVariant[r.estado]} dot>
              {cap(r.estado)}
            </StatusBadge>
          </Box>
        )
      },
    },
    {
      key: 'fecha',
      header: 'Fecha',
      accessor: (r) => (
        <Typography sx={{ color: 'text.dim', fontSize: 11.5 }}>
          {r.fecha} {r.hora}
        </Typography>
      ),
    },
    {
      key: 'acciones',
      header: '',
      align: 'right',
      accessor: (r) => (
        <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<IconReceipt size={12} />}
            onClick={(e) => {
              e.stopPropagation()
              abrirModalAbono(r)
            }}
          >
            {abonosCount(r.id) > 0 ? `Abonos (${abonosCount(r.id)})` : 'Abonos'}
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
          >
            Ver comprobante
          </Button>
        </Stack>
      ),
    },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <input ref={transferenciaInputRef} type="file" accept="image/*" hidden onChange={handleImagenTransferenciaSeleccionada} />
      <input ref={abonoInputRef} type="file" accept="image/*" hidden onChange={handleImagenAbonoSeleccionada} />

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <KPICard title="Completados" value={completados} icon={<IconCircleCheck size={16} />} variant="success" />
        <KPICard title="Cancelados" value={cancelados} icon={<IconCircleX size={16} />} variant="danger" />
      </Box>

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        {/* Toolbar */}
        <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ gap: 1.25, px: 2.5, py: 2, alignItems: 'center', }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary', mr: 'auto' }}>Registro de ventas</Typography>
          <Box sx={{ width: 250 }}>
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
                bgcolor: '#F4EFEA',           // Color beige
                height: 35,                   // Altura reducida
                borderRadius: 1,              // Bordes redondeados                // Espacio a la derecha
                '& fieldset': {
                  borderColor: '#E5DCD3'      // Borde sutil por defecto
                },
                '&:hover fieldset': {
                  borderColor: '#C97A45'      // Borde al pasar el mouse
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C97A45'      // Borde al hacer clic/escribir
                }
              }}
            />
          </Box>
          <Button variant="primary" size="sm" leftIcon={<IconPlus size={13} />} onClick={handleNuevaVenta}  sx={{ height: 28, borderRadius: 1,}}>
            Nueva venta
          </Button>
          <Button variant={filtrosActivos ? 'primary' : 'secondary'} size="sm" leftIcon={<IconFilter size={13} />} onClick={() => setShowFiltros((v) => !v)} sx={{ height: 28, borderRadius: 1,}}>
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
          <Stack direction="row" flexWrap="wrap" alignItems="flex-end" sx={{ gap: 2.5, px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.alt' }}>
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
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'tarjeta', label: 'Tarjeta' },
                  { value: 'transferencia', label: 'Transferencia' },
                ]}
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

        {/* Tabla */}
        <DataTable
          columns={columns}
          data={paginated}
          keyExtractor={(r) => r.id}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyMessage="Sin ventas encontradas"
        />

        <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
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
              const color = theme.palette[estadoVariant[o.value]].main
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

            <Box sx={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <FilterLabel>Captura de comprobante</FilterLabel>
                <Button variant="ghost" size="sm" leftIcon={<IconUpload size={12} />} onClick={() => handleClickCargarTransferencia(selected.id)}>
                  {selected.imagenTransferencia ? 'Reemplazar' : 'Cargar'}
                </Button>
              </Stack>
              {selected.imagenTransferencia ? (
                <ImageWithFallback
                  src={selected.imagenTransferencia}
                  alt="Comprobante"
                  style={{ width: '100%', borderRadius: 6, border: `1px solid ${theme.palette.divider}`, maxHeight: 220, objectFit: 'contain' }}
                />
              ) : (
                <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1.5, py: 2.5, textAlign: 'center', color: 'text.dim', fontSize: 11.5 }}>
                  Sin comprobante cargado
                </Box>
              )}
            </Box>

            <Button variant="primary" size="sm" leftIcon={<IconDownload size={12} />} onClick={handleDescargarComprobante}>
              Descargar comprobante
            </Button>
          </Box>
        )}
      </Modal>

      {/* Modal: Abonos */}
      <Modal open={showAbonoModal} onClose={cerrarModalAbono} title="Abonos de la venta" size="md">
        {ventaAbonoModal && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Venta <b>{ventaAbonoModal.id}</b> · {obtenerNombreCliente(ventaAbonoModal)}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                p: 1.75,
              }}
            >
              <Box>
                <FilterLabel>Total venta</FilterLabel>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>${ventaAbonoModal.total.toFixed(2)}</Typography>
              </Box>
              <Box>
                <FilterLabel>Abonado</FilterLabel>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>${totalAbonadoVenta.toFixed(2)}</Typography>
              </Box>
              <Box>
                <FilterLabel>Saldo pendiente</FilterLabel>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: saldoPendienteVenta <= 0 ? 'success.main' : 'text.primary' }}>
                  ${saldoPendienteVenta.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <FilterLabel>Historial de abonos {abonosDeVenta.length > 0 ? `(${abonosDeVenta.length})` : ''}</FilterLabel>

            {abonosDeVenta.length === 0 ? (
              <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1.5, py: 2.5, textAlign: 'center', color: 'text.dim', fontSize: 11.5 }}>
                Aún no hay abonos registrados para esta venta
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, maxHeight: 200, overflowY: 'auto' }}>
                {abonosDeVenta.map((a) => {
                  const confirmando = abonoAConfirmarEliminar === a.id
                  return (
                    <Stack
                      key={a.id}
                      direction="row"
                      alignItems="center"
                      spacing={1.25}
                      sx={{
                        border: '1px solid',
                        borderColor: confirmando ? 'error.main' : 'divider',
                        borderRadius: 1.5,
                        px: 1.25,
                        py: 0.875,
                        bgcolor: confirmando ? alpha(theme.palette.error.main, 0.12) : 'transparent',
                      }}
                    >
                      <ImageWithFallback
                        src={a.urlComprobante}
                        alt="Comprobante"
                        onClick={() => window.open(a.urlComprobante, '_blank')}
                        style={{ width: 38, height: 38, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, objectFit: 'cover', cursor: 'pointer' }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ fontSize: 12 }}>{a.id}</Typography>
                          <Typography sx={{ fontSize: 12, color: 'text.dim' }}>{a.fecha}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{cap(a.metodoPago)}</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: 12.5 }}>${a.monto.toFixed(2)}</Typography>
                        </Stack>
                      </Box>
                      <IconButton size="small" color={confirmando ? 'error' : 'default'} onClick={() => handleClickEliminarAbono(a.id)}>
                        <IconTrash size={13} />
                      </IconButton>
                    </Stack>
                  )
                })}
              </Box>
            )}

            <Divider />

            <FilterLabel>Nuevo abono</FilterLabel>

            {saldoPendienteVenta <= 0 ? (
              <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1.5, py: 2, textAlign: 'center', color: 'success.main', fontSize: 11.5 }}>
                Esta venta ya está completamente pagada.
              </Box>
            ) : !abonoComprobante ? (
              <Button
                variant="secondary"
                onClick={() => abonoInputRef.current?.click()}
                sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 3, borderStyle: 'dashed' }}
              >
                <IconUpload size={16} />
                Subir captura del comprobante
              </Button>
            ) : (
              <>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FilterLabel>Comprobante</FilterLabel>
                  <Button variant="ghost" size="sm" leftIcon={<IconUpload size={12} />} onClick={() => abonoInputRef.current?.click()}>
                    Reemplazar
                  </Button>
                </Stack>
                <ImageWithFallback
                  src={abonoComprobante}
                  alt="Comprobante"
                  style={{ width: '100%', borderRadius: 6, border: `1px solid ${theme.palette.divider}`, maxHeight: 190, objectFit: 'contain' }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <FilterLabel>Método de pago</FilterLabel>
                    <Select
                      options={[
                        { value: 'efectivo', label: '💵 Efectivo' },
                        { value: 'tarjeta', label: '💳 Tarjeta' },
                        { value: 'transferencia', label: '🏦 Transferencia' },
                      ]}
                      value={abonoMetodo}
                      onChange={(e) => setAbonoMetodo(e.target.value)}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <FilterLabel>Monto (máx. ${saldoPendienteVenta.toFixed(2)})</FilterLabel>
                    <Input type="number" placeholder="$0.00" value={abonoMonto} onChange={(e) => handleCambiarMontoAbono(e.target.value)} />
                  </Box>
                </Box>
              </>
            )}

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
              <Button variant="secondary" size="sm" onClick={cerrarModalAbono}>
                Cerrar
              </Button>
              {abonoComprobante && (
                <Button variant="primary" size="sm" disabled={!montoAbonoValido} onClick={handleRegistrarAbono}>
                  Registrar abono
                </Button>
              )}
            </Stack>
          </Box>
        )}
      </Modal>

      {/* Modal: Nueva venta */}
      <Modal 
        open={showVentaModal} 
        onClose={() => setShowVentaModal(false)} 
        title="Nueva venta" 
        size="lg" 
        sx={{ maxWidth: '720px !important', minHeight: '600px' }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, alignItems: 'start', height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0, width: '100%' }}>
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 1.5, px: 1.5, py: 1.25, display: 'flex', flexDirection: 'column', gap: 0.4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>ID de venta</span><b>{formId}</b>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>Fecha</span><span>{formFecha} · {formHora}</span>
              </Box>
            </Box>

            <Box>
              <FilterLabel>NIT/Cédula</FilterLabel>
              <Autocomplete
                size="small"
                options={catalogoClientes}
                getOptionLabel={(c) => `${c.nit} — ${c.nombre}`}
                value={clienteSeleccionado}
                onChange={(_, value) => setClienteSeleccionado(value)}
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

            <Box>
              <FilterLabel>Estado inicial</FilterLabel>
              <Select options={estadoOptions} value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)} />
            </Box>

            <Divider />

            <Box>
              <FilterLabel>Producto</FilterLabel>
              <Autocomplete
                size="small"
                options={catalogoPanaderia}
                getOptionLabel={(p) => p.nombre}
                value={productoAutocomplete}
                onChange={(_, value) => setProductoAutocomplete(value)}
                renderOption={(props, p) => (
                  <li {...props} key={p.nombre}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 13 }}>
                      <span>{p.nombre}</span><span>${p.precio.toFixed(2)}</span>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Buscar producto…" 
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 1.5 }}>
                <IconButton size="small" onClick={() => setCantidadSeleccionada((c) => Math.max(1, c - 1))}><IconMinus size={12} /></IconButton>
                <Typography sx={{ width: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{cantidadSeleccionada}</Typography>
                <IconButton size="small" onClick={() => setCantidadSeleccionada((c) => c + 1)}><IconPlus size={12} /></IconButton>
              </Box>
              <Button variant="secondary" size="sm" leftIcon={<IconPlus size={12} />} disabled={!productoAutocomplete} onClick={handleAgregarProducto}>
                Agregar
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0, width: '100%', height: '100%' }}>
            <FilterLabel>Resumen</FilterLabel>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, minHeight: 180, maxHeight: 320, overflowY: 'auto', flexGrow: 1 }}>
              {formItems.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5, color: 'text.dim', fontSize: 13 }}>
                  Sin productos agregados
                </Box>
              ) : (
                formItems.map((item, idx) => (
                  <Box key={item.nombre} sx={{ px: 1.25, py: 0.875, borderTop: idx > 0 ? '1px solid' : 'none', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 1, mr: 1 }}>
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
      </Modal>

      <Box component="footer" sx={{ pt: 2, pb: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center', fontSize: 11.5, color: 'text.dim' }}>
        © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
      </Box>
    </Box>
  )
}