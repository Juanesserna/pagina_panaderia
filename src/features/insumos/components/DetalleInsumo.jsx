import { Box, Typography, Stack } from '@mui/material'
import { Modal, ModalFooter, Button, StatusBadge } from '@shared/components'
import { LotesCard } from './LotesCard'
import {
    formatoCodigo,
    formatoMoneda,
    nombreCategoria,
    unidadAbrev,
    getEstadoVisual,
    estadoVisualVariant,
} from '../utils/insumosHelpers'

// Misma tipografía que usa FormularioInsumo, para que "Ver detalle" y
// "Editar/Nuevo insumo" se vean como parte del mismo módulo.
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
 * Detalle de insumo como modal flotante sobre la lista, igual que
 * FormularioInsumo (mismo componente <Modal>, misma tipografía y
 * espaciado), en vez de una vista de página completa aparte.
 */
export function DetalleInsumo({ open, insumo, onEditar, onCerrar }) {
    if (!insumo) return null
    const estadoVisual = getEstadoVisual(insumo)

    return (
        <Modal open={open} onClose={onCerrar} title={insumo.nombre} subtitle={formatoCodigo(insumo.id)} size="lg">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={seccionTituloSx}>Estado</Typography>
                    <StatusBadge variant={estadoVisualVariant[estadoVisual]}>{estadoVisual}</StatusBadge>
                </Stack>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={seccionTituloSx}>Información general</Typography>
                    <Box sx={gridSx}>
                        <CampoInfo label="Código" value={formatoCodigo(insumo.id)} />
                        <CampoInfo label="Categoría" value={nombreCategoria(insumo.idCategoria)} />
                        <CampoInfo label="Nombre" value={insumo.nombre} sx={anchoCompletoSx} />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={seccionTituloSx}>Inventario</Typography>
                    <Box sx={gridSx}>
                        <CampoInfo label="Unidad de medida" value={unidadAbrev(insumo.idUnidadMedida)} />
                        <CampoInfo label="Stock actual" value={`${insumo.stockActual} ${unidadAbrev(insumo.idUnidadMedida)}`} />
                        <CampoInfo label="Stock mínimo" value={`${insumo.stockMinimo} ${unidadAbrev(insumo.idUnidadMedida)}`} />
                        <CampoInfo label="Costo promedio" value={`${formatoMoneda(insumo.costoPromedio)} / ${unidadAbrev(insumo.idUnidadMedida)}`} />
                    </Box>
                </Box>

                <LotesCard lotes={insumo.lotes} unidad={unidadAbrev(insumo.idUnidadMedida)} />

                <ModalFooter>
                    <Button variant="ghost" size="sm" onClick={onCerrar}>
                        Cerrar
                    </Button>
                    <Button variant="primary" size="sm" onClick={onEditar}>
                        Editar insumo
                    </Button>
                </ModalFooter>
            </Box>
        </Modal>
    )
}
