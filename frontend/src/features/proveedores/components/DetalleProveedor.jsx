import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal, StatusBadge } from '@shared/ui'
import { estadoVisualVariant } from '../constants/proveedores.constants'
import { formatoCodigo, getEstadoVisual } from '../utils/proveedoresHelpers'
import { CampoInfo } from './Campo'

const gridSx = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }
const anchoCompletoSx = { gridColumn: { sm: '1 / -1' } }

/**
 * Detalle de proveedor como modal flotante sobre la lista
 * (mismo <Modal> de @shared/ui que el formulario).
 */
export function DetalleProveedor({ open, proveedor, onEditar, onCerrar }) {
  if (!proveedor) return null
  const estadoVisual = getEstadoVisual(proveedor)

  return (
    <Modal open={open} onClose={onCerrar} title={proveedor.nombre} size="lg" showDivider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Estado</Typography>
          <StatusBadge variant={estadoVisualVariant[estadoVisual]}>{estadoVisual}</StatusBadge>
        </Stack>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">Información general</Typography>
          <Box sx={gridSx}>
            <CampoInfo label="Código" value={formatoCodigo(proveedor.id)} />
            <CampoInfo label="NIT" value={proveedor.nit} />
            <CampoInfo label="Nombre empresa" value={proveedor.nombre} sx={anchoCompletoSx} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">Contacto</Typography>
          <Box sx={gridSx}>
            <CampoInfo label="Nombre contacto" value={proveedor.nombreContacto} />
            <CampoInfo label="Teléfono" value={proveedor.telefono} />
            <CampoInfo label="Correo electrónico" value={proveedor.email} />
            <CampoInfo label="Dirección" value={proveedor.direccion} />
          </Box>
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="ghost" size="sm" onClick={onCerrar}>
            Cerrar
          </Button>
          <Button variant="primary" size="sm" onClick={onEditar}>
            Editar proveedor
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
