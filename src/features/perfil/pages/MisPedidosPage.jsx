// src/features/pedidos/pages/MisPedidosPage.jsx
import { useState, useMemo, useRef } from 'react'
import {
    Box, Stack, Typography, IconButton, Collapse, OutlinedInput, InputAdornment, Chip,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import {
    IconSearch,
    IconFilter,
    IconDownload,
    IconUpload,
    IconReceipt,
    IconFileText,
    IconShoppingBag,
    IconX,
    IconChevronRight,
} from '@tabler/icons-react'
import {
    initialVentas, estadoVariant, estadoOptions,
    usuarioAutenticado,
    obtenerProductosVenta, obtenerNombreCliente, parseFechaVenta, fechaHoyFormateada, PAGE_SIZE,
} from '@features/ventas/data/ventasMockData'
import { StatusBadge } from '@features/ventas/components/StatusBadge'
import { Button } from '@features/ventas/components/Button'
import { Input } from '@features/ventas/components/Input'
import { Pagination } from '@features/ventas/components/Pagination'
import { Modal } from '@features/ventas/components/Modal'
import { ImageWithFallback } from '@features/ventas/components/ImageWithFallback'
import { ROUTES } from '@app/router/routes' // ← ajusta esta ruta

// ---------- Pedidos de muestra (borrar cuando haya datos reales) ----------
const pedidosMuestra = [
    {
        id: '#9001',
        cliente: usuarioAutenticado.nombre,
        nit: usuarioAutenticado.nit,
        metodo: 'Efectivo',
        canal: 'Presencial',
        total: 18.5,
        estado: 'completado',
        fecha: '20/09/2026',
        hora: '09:15',
        productos: 3,
        items: [
            { nombre: 'Pan de bono', cantidad: 2, precio: 3.5 },
            { nombre: 'Croissant', cantidad: 1, precio: 4.5 },
            { nombre: 'Café americano', cantidad: 1, precio: 7.0 },
        ],
    },
    {
        id: '#9003',
        cliente: usuarioAutenticado.nombre,
        nit: usuarioAutenticado.nit,
        metodo: 'tarjeta',
        canal: 'Pagina',
        total: 45.0,
        estado: 'cancelado',
        fecha: '18/09/2026',
        hora: '11:05',
        productos: 4,
        items: [
            { nombre: 'Torta de vainilla (entera)', cantidad: 1, precio: 30.0 },
            { nombre: 'Galletas de mantequilla', cantidad: 3, precio: 5.0 },
        ],
    },
    {
        id: '#9002',
        cliente: usuarioAutenticado.nombre,
        nit: usuarioAutenticado.nit,
        metodo: 'Transferencia',
        canal: 'Pagina',
        total: 12.0,
        estado: 'pendiente',
        fecha: '23/09/2026',
        hora: '15:40',
        productos: 2,
        items: [
            { nombre: 'Pan integral', cantidad: 1, precio: 5.0 },
            { nombre: 'Torta de chocolate (porción)', cantidad: 1, precio: 7.0 },
        ],
    },
]

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

// "Cancelado" ahora se muestra al cliente como "Rechazado" (el valor interno 'cancelado' no cambia,
// para no romper estadoVariant ni la lógica que ya depende de ese valor).
const ESTADOS_OCULTOS_EN_FILTRO = ['parcial', 'en_proceso', 'en-proceso', 'enproceso', 'proceso']
const estadoLabel = (estado) => (estado === 'cancelado' ? 'Rechazado' : cap(estado))
const esEstadoOcultoEnFiltro = (o) => {
    const valor = (o.value ?? '').toString().toLowerCase()
    const etiqueta = (o.label ?? '').toString().toLowerCase()
    return ESTADOS_OCULTOS_EN_FILTRO.some((k) => valor.includes(k)) || etiqueta.includes('parcial') || etiqueta.includes('proceso')
}
// Estados disponibles para filtrar: se excluyen "pago parcial" y "en proceso"
const estadoOptionsFiltro = estadoOptions.filter((o) => !esEstadoOcultoEnFiltro(o))

const metodoOptions = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
]

// En "Mis pedidos" solo se admite 1 comprobante por pedido, sin importar el canal
function esPedidoDelUsuarioActual(venta) {
    return venta.nit === usuarioAutenticado.nit || venta.cliente === usuarioAutenticado.nombre
}

function FilterLabel({ children }) {
    return (
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.75 }}>
            {children}
        </Typography>
    )
}

// Chip de filtro estilo "categorías del catálogo"
function FilterChip({ active, onClick, children, accent, textOn }) {
    return (
        <Chip
            label={children}
            onClick={onClick}
            sx={{
                height: 32,
                px: 0.5,
                fontSize: 12.5,
                fontWeight: 600,
                borderRadius: '999px',
                bgcolor: active ? accent : 'transparent',
                color: active ? textOn : 'text.secondary',
                border: '1px solid',
                borderColor: active ? accent : 'divider',
                '&:hover': { bgcolor: active ? accent : 'action.hover', opacity: active ? 0.92 : 1 },
                cursor: 'pointer',
            }}
        />
    )
}

export default function MisPedidosPage() {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const accent = '#C97A45'
    const dark = '#5B3023'

    const [ventas] = useState(() =>
        [...initialVentas, ...pedidosMuestra].filter(esPedidoDelUsuarioActual)
    )
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [selected, setSelected] = useState(null)

    const [showFiltros, setShowFiltros] = useState(false)
    const [estadoFilter, setEstadoFilter] = useState('')
    const [metodoFilter, setMetodoFilter] = useState('')
    const [fechaDesde, setFechaDesde] = useState('')
    const [fechaHasta, setFechaHasta] = useState('')

    // Pedidos con el desglose de productos abierto
    const [pedidosExpandidos, setPedidosExpandidos] = useState(() => new Set())
    const toggleExpandirPedido = (id) => {
        setPedidosExpandidos((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const comprobanteRef = useRef(null)

    const [abonos, setAbonos] = useState([])
    const [showAbonoModal, setShowAbonoModal] = useState(false)
    const [ventaAbonoModal, setVentaAbonoModal] = useState(null)
    const abonoInputRef = useRef(null)

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

    const abrirModalAbono = (venta) => {
        setVentaAbonoModal(venta)
        setShowAbonoModal(true)
    }

    const cerrarModalAbono = () => {
        setShowAbonoModal(false)
        setVentaAbonoModal(null)
    }

    const handleClickSubirComprobante = () => abonoInputRef.current?.click()

    const handleImagenAbonoSeleccionada = (e) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file || !ventaAbonoModal || !file.type.startsWith('image/')) return

        const idVenta = ventaAbonoModal.id
        const reader = new FileReader()
        reader.onload = () => {
            const urlComprobante = reader.result
            setAbonos((prev) => {
                const existe = prev.some((a) => a.idVenta === idVenta && a.slot === 1)
                if (existe) {
                    return prev.map((a) => (a.idVenta === idVenta && a.slot === 1 ? { ...a, urlComprobante, fecha: fechaHoyFormateada() } : a))
                }
                return [...prev, { id: `AB-${idVenta.replace('#', '')}-1`, idVenta, slot: 1, fecha: fechaHoyFormateada(), urlComprobante }]
            })
        }
        reader.readAsDataURL(file)
    }

    const comprobanteDeVenta = useMemo(
        () => (ventaAbonoModal ? abonos.find((a) => a.idVenta === ventaAbonoModal.id && a.slot === 1) : null),
        [abonos, ventaAbonoModal]
    )

    const filtered = useMemo(() => {
        let data = ventas
        if (search) data = data.filter((v) => v.id.includes(search) || (v.cliente ?? '').toLowerCase().includes(search.toLowerCase()))
        if (estadoFilter) data = data.filter((v) => v.estado === estadoFilter)
        if (metodoFilter) data = data.filter((v) => (v.metodo ?? '').toLowerCase() === metodoFilter)
        if (fechaDesde) {
            const desde = new Date(`${fechaDesde}T00:00:00`)
            data = data.filter((v) => parseFechaVenta(v) >= desde)
        }
        if (fechaHasta) {
            const hasta = new Date(`${fechaHasta}T23:59:59`)
            data = data.filter((v) => parseFechaVenta(v) <= hasta)
        }
        return [...data].sort((a, b) => parseInt(b.id.replace('#', '')) - parseInt(a.id.replace('#', '')))
    }, [ventas, search, estadoFilter, metodoFilter, fechaDesde, fechaHasta])

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const filtrosActivos = Boolean(estadoFilter || metodoFilter || fechaDesde || fechaHasta)
    const cantidadFiltrosActivos = [estadoFilter, metodoFilter, fechaDesde, fechaHasta].filter(Boolean).length

    const limpiarFiltros = () => {
        setEstadoFilter('')
        setMetodoFilter('')
        setFechaDesde('')
        setFechaHasta('')
        setPage(1)
    }

    const puedeVerComprobante = (v) => v.estado === 'completado' || v.estado === 'cancelado'

    return (
        <Box sx={{ bgcolor: isDark ? '#1A0D07' : '#FAF5EE', minHeight: '100vh' }}>
            <input ref={abonoInputRef} type="file" accept="image/*" hidden onChange={handleImagenAbonoSeleccionada} />

            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2.5, md: 3 }, pt: { xs: 12, md: 14 }, pb: 8 }}>
                <Typography
                    sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: { xs: 32, md: 40 },
                        color: isDark ? '#F3E9DC' : '#2E1810',
                        mb: 1,
                    }}
                >
                    Mis pedidos
                </Typography>
                <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 4, maxWidth: 520 }}>
                    Consulta el estado de tus compras, revisa tu comprobante y sube tu soporte de pago cuando lo necesites.
                </Typography>

                {/* Buscador + filtro */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 2 }}>
                    <OutlinedInput
                        placeholder="Buscar por número de pedido…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        startAdornment={
                            <InputAdornment position="start">
                                <IconSearch size={18} color="#A0968C" />
                            </InputAdornment>
                        }
                        sx={{
                            flex: 1,
                            bgcolor: isDark ? '#241209' : '#FFFFFF',
                            height: 44,
                            borderRadius: '999px',
                            fontSize: 13.5,
                            '& fieldset': { borderColor: isDark ? 'rgba(192,133,82,0.25)' : '#E5DCD3' },
                            '&:hover fieldset': { borderColor: accent },
                            '&.Mui-focused fieldset': { borderColor: accent },
                        }}
                    />
                    <Button
                        onClick={() => setShowFiltros((v) => !v)}
                        leftIcon={<IconFilter size={14} />}
                        sx={{
                            height: 44,
                            px: 2.5,
                            borderRadius: '999px',
                            fontSize: 13,
                            fontWeight: 600,
                            border: '1px solid',
                            bgcolor: filtrosActivos ? dark : 'transparent',
                            color: filtrosActivos ? '#FAF5EE' : (isDark ? '#F3E9DC' : dark),
                            borderColor: filtrosActivos ? dark : (isDark ? 'rgba(192,133,82,0.3)' : '#E5DCD3'),
                            '&:hover': { bgcolor: filtrosActivos ? dark : (isDark ? 'rgba(192,133,82,0.1)' : '#F4EFEA'), opacity: 0.95 },
                        }}
                    >
                        Filtrar
                        {filtrosActivos && (
                            <Box component="span" sx={{ ml: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 17, width: 17, borderRadius: '50%', fontSize: 9.5, fontWeight: 700, bgcolor: 'rgba(255,255,255,0.3)' }}>
                                {cantidadFiltrosActivos}
                            </Box>
                        )}
                    </Button>
                </Stack>

                {/* Panel de filtros */}
                <Collapse in={showFiltros}>
                    <Box
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(192,133,82,0.2)' : '#E5DCD3',
                            bgcolor: isDark ? '#241209' : '#FFFFFF',
                            p: 2.5,
                            mb: 3,
                        }}
                    >
                        <Stack spacing={2.25}>
                            {/* Estado y método de pago, lado a lado para agrupar los filtros de "qué" */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>
                                <Box sx={{ flex: 1 }}>
                                    <FilterLabel>Estado</FilterLabel>
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        <FilterChip active={!estadoFilter} onClick={() => { setEstadoFilter(''); setPage(1) }} accent={dark} textOn="#FAF5EE">Todos</FilterChip>
                                        {estadoOptionsFiltro.map((o) => (
                                            <FilterChip key={o.value} active={estadoFilter === o.value} onClick={() => { setEstadoFilter(o.value); setPage(1) }} accent={dark} textOn="#FAF5EE">
                                                {estadoLabel(o.value)}
                                            </FilterChip>
                                        ))}
                                    </Stack>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FilterLabel>Método de pago</FilterLabel>
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        <FilterChip active={!metodoFilter} onClick={() => { setMetodoFilter(''); setPage(1) }} accent={dark} textOn="#FAF5EE">Todos</FilterChip>
                                        {metodoOptions.map((o) => (
                                            <FilterChip key={o.value} active={metodoFilter === o.value} onClick={() => { setMetodoFilter(o.value); setPage(1) }} accent={dark} textOn="#FAF5EE">
                                                {o.label}
                                            </FilterChip>
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>

                            <Box sx={{ borderTop: '1px dashed', borderColor: isDark ? 'rgba(192,133,82,0.2)' : '#EEE3D6', pt: 2 }}>
                                <FilterLabel>Rango de fechas</FilterLabel>
                                <Stack direction="row" flexWrap="wrap" gap={2} alignItems="flex-end">
                                    <Box sx={{ width: 160 }}>
                                        <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>Desde</Typography>
                                        <Input type="date" value={fechaDesde} onChange={(e) => { setFechaDesde(e.target.value); setPage(1) }} />
                                    </Box>
                                    <Box sx={{ width: 160 }}>
                                        <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>Hasta</Typography>
                                        <Input type="date" value={fechaHasta} onChange={(e) => { setFechaHasta(e.target.value); setPage(1) }} />
                                    </Box>
                                    {filtrosActivos && (
                                        <Button variant="ghost" size="sm" leftIcon={<IconX size={13} />} onClick={limpiarFiltros} sx={{ ml: { sm: 'auto' } }}>
                                            Limpiar filtros
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                </Collapse>

                {/* Lista de pedidos */}
                {paginated.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, borderRadius: 3, border: '1px dashed', borderColor: isDark ? 'rgba(192,133,82,0.25)' : '#E5DCD3' }}>
                        <IconShoppingBag size={32} stroke={1.3} color={accent} />
                        <Typography sx={{ mt: 1.5, fontSize: 15, fontWeight: 600, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                            Aún no tienes pedidos
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 2.5 }}>
                            Explora la carta y haz tu primer pedido.
                        </Typography>
                        <Button
                            component={RouterLink}
                            to={ROUTES.CATALOGO}
                            sx={{ bgcolor: dark, color: '#FAF5EE', px: 3, borderRadius: '999px', '&:hover': { bgcolor: '#4a2519' } }}
                        >
                            Ver catálogo
                        </Button>
                    </Box>
                ) : (
                    <Stack spacing={1.75}>
                        {paginated.map((r) => (
                            <Box
                                key={r.id}
                                sx={{
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: isDark ? 'rgba(192,133,82,0.2)' : '#E5DCD3',
                                    bgcolor: isDark ? '#241209' : '#FFFFFF',
                                    p: { xs: 2, sm: 2.75 },
                                    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px rgba(91,48,35,0.06)',
                                }}
                            >
                                {/* Encabezado: identidad del pedido + estado, siempre visibles primero */}
                                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 42, height: 42, borderRadius: '50%',
                                                bgcolor: isDark ? 'rgba(192,133,82,0.12)' : '#FAF5EE',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <IconReceipt size={19} stroke={1.5} color={accent} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                                                Pedido {r.id}
                                            </Typography>
                                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                                                {r.fecha} · {r.hora}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <StatusBadge
                                        variant={estadoVariant[r.estado]}
                                        dot
                                        sx={{
                                            height: 16,
                                            minHeight: 16,
                                            py: 0,
                                            px: 0.75,
                                            lineHeight: '16px',
                                            fontSize: 10,
                                            '& .MuiSvgIcon-root, & svg': { width: 6, height: 6 },
                                        }}
                                    >
                                        {estadoLabel(r.estado)}
                                    </StatusBadge>
                                </Stack>

                                {/* Datos del pedido agrupados: artículos, método y total, con la misma jerarquía visual */}
                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    columnGap={3}
                                    rowGap={1.5}
                                    sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: isDark ? 'rgba(192,133,82,0.2)' : '#EEE3D6' }}
                                >
                                    <Stack direction="row" spacing={9} alignItems="center">
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleExpandirPedido(r.id)}
                                                sx={{
                                                    p: 0.25,
                                                    color: 'text.secondary',
                                                    transform: pedidosExpandidos.has(r.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.15s ease',
                                                }}
                                                aria-label={pedidosExpandidos.has(r.id) ? 'Ocultar productos' : 'Ver productos'}
                                            >
                                                <IconChevronRight size={16} />
                                            </IconButton>
                                            <Box>
                                                <Typography sx={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', mb: 0.25 }}>
                                                    Artículos
                                                </Typography>
                                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                                                    {r.productos} artículo{r.productos === 1 ? '' : 's'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Box>
                                            <Typography sx={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', mb: 0.25 }}>
                                                Método de pago
                                            </Typography>
                                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                                                {r.metodo ? cap(r.metodo) : '—'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', mb: 0.25 }}>
                                                Total
                                            </Typography>
                                            <Typography sx={{ fontSize: 17, fontWeight: 700, color: accent }}>
                                                ${r.total.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center"sx={{ mt: 1, ml: 5 }}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            leftIcon={<IconReceipt size={13} />}
                                            onClick={() => abrirModalAbono(r)}
                                            sx={{ fontSize: 12, height: 30, minHeight: 30, py: 0, borderRadius: '999px', border: '1px solid', borderColor: isDark ? 'rgba(192,133,82,0.3)' : '#E5DCD3' }}
                                        >
                                            Pagos
                                        </Button>
                                        <Button
                                            size="sm"
                                            disabled={!puedeVerComprobante(r)}
                                            leftIcon={<IconFileText size={13} />}
                                            onClick={() => { setSelected(r); setShowModal(true) }}
                                            sx={{
                                                fontSize: 12,
                                                height: 30,
                                                minHeight: 30,
                                                py: 0,
                                                borderRadius: '999px',
                                                bgcolor: puedeVerComprobante(r) ? dark : undefined,
                                                color: puedeVerComprobante(r) ? '#FAF5EE' : undefined,
                                                '&:hover': { bgcolor: puedeVerComprobante(r) ? '#4a2519' : undefined },
                                            }}
                                        >
                                            Ver comprobante
                                        </Button>
                                    </Stack>
                                </Stack>

                                {/* Desglose de productos, se abre con la flecha junto a "Artículos" */}
                                <Collapse in={pedidosExpandidos.has(r.id)} timeout="auto" unmountOnExit>
                                    <Stack
                                        spacing={0.75}
                                        sx={{
                                            mt: 1.5,
                                            pt: 1.5,
                                            borderTop: '1px dashed',
                                            borderColor: isDark ? 'rgba(192,133,82,0.2)' : '#EEE3D6',
                                        }}
                                    >
                                        {obtenerProductosVenta(r).map((p, idx) => (
                                            <Stack key={idx} direction="row" justifyContent="space-between" sx={{ fontSize: 12.5 }}>
                                                <Typography sx={{ fontSize: 12.5, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                                                    {p.cantidad}x {p.nombre}
                                                </Typography>
                                                <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                                                    ${(p.precio * p.cantidad).toFixed(2)}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Collapse>
                            </Box>
                        ))}
                    </Stack>
                )}

                <Box sx={{ mt: 3 }}>
                    <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
                </Box>
            </Box>

            {/* Modal: Comprobante */}
            <Modal open={showModal} onClose={() => setShowModal(false)} title="Comprobante de pedido" size="md">
                {selected && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
                        <Box
                            ref={comprobanteRef}
                            sx={{
                                width: '100%', maxWidth: 340, fontFamily: 'monospace', fontSize: 12,
                                border: '2px dashed', borderColor: accent, borderRadius: 2, bgcolor: isDark ? '#241209' : '#FFFFFF',
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, px: 2.5, pt: 2, pb: 1.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                <Typography sx={{ fontWeight: 700, letterSpacing: 2.5, fontSize: 13 }}>AL HORNO</Typography>
                                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Comprobante de venta</Typography>
                                <Typography sx={{ fontSize: 12, mt: 1 }}>{selected.id}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, px: 2.5, py: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>Cliente</span><b>{obtenerNombreCliente(selected)}</b></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>Fecha</span><span>{selected.fecha} · {selected.hora}</span></Box>
                                {selected.nit && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>NIT/Cédula</span><span>{selected.nit}</span></Box>}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>Pago</span><span>{selected.metodo ? cap(selected.metodo) : '—'}</span></Box>
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
                                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: accent }}>${selected.total.toFixed(2)}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, px: 2.5, py: 1.75 }}>
                                <StatusBadge variant={estadoVariant[selected.estado]} dot>{estadoLabel(selected.estado)}</StatusBadge>
                                <Typography sx={{ fontSize: 11, color: 'text.dim' }}>¡Gracias por su compra!</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ width: '100%', maxWidth: 340, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                size="sm"
                                leftIcon={<IconDownload size={12} />}
                                onClick={handleDescargarComprobante}
                                sx={{ borderRadius: '999px', bgcolor: dark, color: '#FAF5EE', '&:hover': { bgcolor: '#4a2519' } }}
                            >
                                Descargar comprobante
                            </Button>
                        </Box>

                        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ width: '100%' }}>
                            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cerrar</Button>
                        </Stack>
                    </Box>
                )}
            </Modal>

            {/* Modal: Pago (1 solo comprobante) */}
            <Modal open={showAbonoModal} onClose={cerrarModalAbono} title="Pago del pedido" size="sm">
                {ventaAbonoModal && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                            Pedido <b>{ventaAbonoModal.id}</b>
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2,
                                border: '1px solid', borderColor: isDark ? 'rgba(192,133,82,0.25)' : '#E5DCD3',
                                borderRadius: 2, p: 1.75, bgcolor: isDark ? '#2A1608' : '#FAF5EE',
                            }}
                        >
                            <Box>
                                <FilterLabel>Total a pagar</FilterLabel>
                                <Typography sx={{ fontWeight: 700, fontSize: 15, color: accent }}>${ventaAbonoModal.total.toFixed(2)}</Typography>
                            </Box>
                            <Box>
                                <FilterLabel>Estado del pago</FilterLabel>
                                <Typography sx={{ fontWeight: 700, fontSize: 14, color: comprobanteDeVenta ? 'success.main' : (isDark ? '#F3E9DC' : '#2E1810') }}>
                                    {comprobanteDeVenta ? 'Comprobante enviado' : 'Pendiente'}
                                </Typography>
                            </Box>
                        </Box>

                        <FilterLabel>Comprobante de pago</FilterLabel>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.25}}>
                            {comprobanteDeVenta ? (
                                <>
                                    <ImageWithFallback
                                        src={comprobanteDeVenta.urlComprobante}
                                        alt="Comprobante de pago"
                                        onClick={() => window.open(comprobanteDeVenta.urlComprobante, '_blank')}
                                        style={{ width: '100%', height: 160, borderRadius: 10, border: `1px solid ${theme.palette.divider}`, objectFit: 'cover', cursor: 'pointer' }}
                                    />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography sx={{ fontSize: 11, color: 'text.dim' }}>{comprobanteDeVenta.fecha}</Typography>
                                        <Button variant="ghost" size="sm" leftIcon={<IconUpload size={12} />} onClick={handleClickSubirComprobante}>
                                            Reemplazar
                                        </Button>
                                    </Stack>
                                </>
                            ) : (
                                <Button
                                    variant="secondary"
                                    onClick={handleClickSubirComprobante}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 3, borderRadius: 2, borderStyle: 'dashed', borderColor: accent }}
                                >
                                    <IconUpload size={16} />
                                    Subir comprobante
                                </Button>
                            )}
                        </Box>

                        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
                            <Button variant="secondary" size="sm" onClick={cerrarModalAbono}>Cerrar</Button>
                        </Stack>
                    </Box>
                )}
            </Modal>
        </Box>
    )
}