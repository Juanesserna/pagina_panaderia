import { useState, useMemo, useRef, useEffect } from 'react'
import { Box, Stack, Typography, IconButton, Divider, Collapse, OutlinedInput, InputAdornment } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
    IconSearch,
    IconFilter,
    IconDownload,
    IconUpload,
    IconReceipt,
} from '@tabler/icons-react'
import {
    initialVentas, estadoVariant, estadoOptions,
    usuarioAutenticado,
    obtenerProductosVenta, obtenerNombreCliente, parseFechaVenta, fechaHoyFormateada, PAGE_SIZE,
} from '@features/ventas/data/ventasMockData'
import { StatusBadge } from '@features/ventas/components/StatusBadge'
import { Button } from '@features/ventas/components/Button'
import { Input } from '@features/ventas/components/Input'
import { Select } from '@features/ventas/components/Select'
import { DataTable } from '@features/ventas/components/DataTable'
import { Pagination } from '@features/ventas/components/Pagination'
import { Modal } from '@features/ventas/components/Modal'
import { ImageWithFallback } from '@features/ventas/components/ImageWithFallback'

// ---------- Helpers de presentación ----------

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

const metodoOptions = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
]

const canalOptions = [
    { value: 'pagina', label: 'Página' },
    { value: 'encargo', label: 'Encargo' },
    { value: 'presencial', label: 'Presencial' },
]

// En "Mis pedidos" solo se admite 1 comprobante por pedido, sin importar el canal
const pagosPermitidos = () => 1

function FilterLabel({ children }) {
    return (
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
            {children}
        </Typography>
    )
}

// ---------- Identificar los pedidos del usuario logueado ----------
// TODO: reemplaza esta condición cuando tengas el id/correo real del cliente autenticado.
// Hoy compara contra `usuarioAutenticado` del mock, igual que hace VentasPage.
function esPedidoDelUsuarioActual(venta) {
    return venta.nit === usuarioAutenticado.nit || venta.cliente === usuarioAutenticado.nombre
}

export default function MisPedidosPage() {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const [ventas] = useState(() =>
        [...initialVentas, ...pedidosMuestra].filter(esPedidoDelUsuarioActual)
    )
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [sortKey, setSortKey] = useState('id')
    const [sortDir, setSortDir] = useState('desc')
    const [selected, setSelected] = useState(null)

    const [showFiltros, setShowFiltros] = useState(false)
    const [estadoFilter, setEstadoFilter] = useState('')
    const [metodoFilter, setMetodoFilter] = useState('')
    const [fechaDesde, setFechaDesde] = useState('')
    const [fechaHasta, setFechaHasta] = useState('')

    const comprobanteRef = useRef(null)

    // Abonos: { id, idVenta, slot (siempre 1), fecha, urlComprobante }
    const [abonos, setAbonos] = useState([])
    const [showAbonoModal, setShowAbonoModal] = useState(false)
    const [ventaAbonoModal, setVentaAbonoModal] = useState(null)
    const abonoInputRef = useRef(null)

    const handleSort = (key) => {
        if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        else {
            setSortKey(key)
            setSortDir('asc')
        }
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

    // ---------- Pago (1 solo comprobante) ----------

    const abrirModalAbono = (venta) => {
        setVentaAbonoModal(venta)
        setShowAbonoModal(true)
    }

    const cerrarModalAbono = () => {
        setShowAbonoModal(false)
        setVentaAbonoModal(null)
    }

    const handleClickSubirComprobante = () => {
        abonoInputRef.current?.click()
    }

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
        if (metodoFilter) data = data.filter((v) => v.metodo === metodoFilter)
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
    }, [ventas, search, estadoFilter, metodoFilter, fechaDesde, fechaHasta, sortKey, sortDir])

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
    const columns = [
        {
            key: 'id',
            header: 'ID',
            sortable: true,
            width: '9%',
            accessor: (r) => <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>{r.id}</Typography>,
        },
        {
            key: 'metodo',
            header: 'Método',
            width: '13%',
            accessor: (r) => <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{r.metodo ? cap(r.metodo) : '—'}</Typography>,
        },
        {
            key: 'canal',
            header: 'Canal',
            width: '12%',
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
            width: '11%',
            accessor: (r) => <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary' }}>${r.total.toFixed(2)}</Typography>,
        },
        {
            key: 'estado',
            header: 'Estado',
            width: '15%',
            accessor: (r) => (
                <StatusBadge variant={estadoVariant[r.estado]} dot>
                    {cap(r.estado)}
                </StatusBadge>
            ),
        },
        {
            key: 'fecha',
            header: 'Fecha',
            width: '13%',
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
            width: '27%',
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
            <input ref={abonoInputRef} type="file" accept="image/*" hidden onChange={handleImagenAbonoSeleccionada} />

            <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: isDark ? '#2A1D16' : 'background.paper', border: '1px solid', borderColor: 'divider', backgroundImage: 'none' }}>
                <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ px: 2.5, py: 2, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'text.primary', mr: 'auto' }}>Mis pedidos</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25 }}>
                        <OutlinedInput
                            placeholder="Buscar pedido…"
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
                                '& fieldset': { borderColor: isDark ? 'transparent' : '#E5DCD3' },
                                '&:hover fieldset': { borderColor: '#C97A45' },
                                '&.Mui-focused fieldset': { borderColor: '#C97A45' },
                            }}
                        />
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
                    emptyMessage="Aún no tienes pedidos"
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

            {/* Modal: Comprobante */}
            <Modal open={showModal} onClose={() => setShowModal(false)} title="Comprobante de pedido" size="md">
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

            {/* Modal: Pago (1 solo comprobante) */}
            <Modal open={showAbonoModal} onClose={cerrarModalAbono} title="Pago del pedido" size="sm">
                {ventaAbonoModal && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                            Pedido <b>{ventaAbonoModal.id}</b>
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 2,
                                border: '1px solid',
                                borderColor: isDark ? '#4A3B32' : '#E4D9C8',
                                borderRadius: 1.5,
                                p: 1.75,
                                bgcolor: isDark ? '#30231C' : '#F9F8F8',
                            }}
                        >
                            <Box>
                                <FilterLabel>Total a pagar</FilterLabel>
                                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>${ventaAbonoModal.total.toFixed(2)}</Typography>
                            </Box>
                            <Box>
                                <FilterLabel>Estado del pago</FilterLabel>
                                <Typography sx={{ fontWeight: 700, fontSize: 14, color: comprobanteDeVenta ? 'success.main' : 'text.primary' }}>
                                    {comprobanteDeVenta ? 'Comprobante enviado' : 'Pendiente'}
                                </Typography>
                            </Box>
                        </Box>

                        <FilterLabel>Comprobante de pago</FilterLabel>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1.5,
                                p: 1.25,
                            }}
                        >
                            {comprobanteDeVenta ? (
                                <>
                                    <ImageWithFallback
                                        src={comprobanteDeVenta.urlComprobante}
                                        alt="Comprobante de pago"
                                        onClick={() => window.open(comprobanteDeVenta.urlComprobante, '_blank')}
                                        style={{ width: '100%', height: 160, borderRadius: 6, border: `1px solid ${theme.palette.divider}`, objectFit: 'cover', cursor: 'pointer' }}
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
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 3, borderStyle: 'dashed' }}
                                >
                                    <IconUpload size={16} />
                                    Subir comprobante
                                </Button>
                            )}
                        </Box>

                        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
                            <Button variant="secondary" size="sm" onClick={cerrarModalAbono}>
                                Cerrar
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Modal>

            <Box component="footer" sx={{ pt: 2, pb: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center', fontSize: 11.5, color: 'text.dim' }}>
                © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
            </Box>
        </Box>
    )
}