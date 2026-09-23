import { Box, Typography, Stack } from '@mui/material'
import { Modal, ModalFooter, Button, StatusBadge } from '@shared/components'
import { formatoCodigo, getEstadoVisual, estadoVisualVariant } from '../utils/proveedoresHelpers'

// Misma tipografía que usa FormularioProveedor, para que "Ver detalle" y
// "Editar/Nuevo proveedor" se vean como parte del mismo módulo (y del
// mismo módulo de Insumos).
const seccionTituloSx = { fontSize: 14, fontWeight: 700, color: 'text.primary' }
const gridSx = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }
const anchoCompletoSx = { gridColumn: { sm: '1 / -1' } }

function CampoInfo({ label, value, sx }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ...sx }}>
            <Typography
                sx={{
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: 11.5,
                }}
            >
                {label}
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: 'text.primary' }}>{value || '—'}</Typography>
        </Box>
    )
}

/**
 * Detalle de proveedor como modal flotante sobre la lista, igual que
 * FormularioProveedor y que DetalleInsumo (mismo componente <Modal>,
 * misma tipografía y espaciado), en vez de una vista de página completa aparte.
 */
export function DetalleProveedor({ open, proveedor, onEditar, onCerrar }) {
    if (!proveedor) return null
    const estadoVisual = getEstadoVisual(proveedor)

    return (
        <Modal open={open} onClose={onCerrar} title={proveedor.nombre} subtitle={formatoCodigo(proveedor.id)} size="lg">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={seccionTituloSx}>Estado</Typography>
                    <StatusBadge variant={estadoVisualVariant[estadoVisual]}>{estadoVisual}</StatusBadge>
                </Stack>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={seccionTituloSx}>Información general</Typography>
                    <Box sx={gridSx}>
                        <CampoInfo label="Código" value={formatoCodigo(proveedor.id)} />
                        <CampoInfo label="NIT" value={proveedor.nit} />
                        <CampoInfo label="Nombre empresa" value={proveedor.nombre} sx={anchoCompletoSx} />
                        <CampoInfo label="Descripción" value={proveedor.descripcion} sx={anchoCompletoSx} />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={seccionTituloSx}>Contacto</Typography>
                    <Box sx={gridSx}>
                        <CampoInfo label="Nombre contacto" value={proveedor.nombreContacto} />
                        <CampoInfo label="Teléfono" value={proveedor.telefono} />
                        <CampoInfo label="Correo electrónico" value={proveedor.email} />
                        <CampoInfo label="Dirección" value={proveedor.direccion} />
                    </Box>
                </Box>

                <ModalFooter>
                    <Button variant="ghost" size="sm" onClick={onCerrar}>
                        Cerrar
                    </Button>
                    <Button variant="primary" size="sm" onClick={onEditar}>
                        Editar proveedor
                    </Button>
                </ModalFooter>
            </Box>
        </Modal>
    )
}
