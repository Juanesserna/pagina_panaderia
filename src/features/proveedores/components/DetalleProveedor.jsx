import { Box, Stack, Typography, IconButton } from '@mui/material'
import { IconArrowLeft, IconPencil } from '@tabler/icons-react'
import { Button } from '@features/produccion/components/Button'
import { StatusBadge } from '@features/produccion/components/StatusBadge'
import { CampoInfo, dimLabelSx } from './Campo'
import { formatoCodigo, getEstadoVisual, estadoVisualVariant } from '../utils/proveedoresHelpers'

const panelSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  borderRadius: 2.5,
  p: 2.5,
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
}

export function DetalleProveedor({ proveedor, onEditar, onVolver }) {
  const estadoVisual = getEstadoVisual(proveedor)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={onVolver} sx={{ color: 'text.secondary' }}>
            <IconArrowLeft size={18} />
          </IconButton>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>{proveedor.nombre}</Typography>
            <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: 'text.dim' }}>
              {formatoCodigo(proveedor.id)} · NIT {proveedor.nit}
            </Typography>
          </Box>
        </Stack>
        <Button variant="primary" size="sm" leftIcon={<IconPencil size={13} />} onClick={onEditar}>
          Editar
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={panelSx}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Información general</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <CampoInfo label="Código" value={formatoCodigo(proveedor.id)} />
              <CampoInfo label="NIT" value={proveedor.nit} />
              <CampoInfo label="Nombre empresa" value={proveedor.nombre} />
              <CampoInfo label="Descripción" value={proveedor.descripcion} />
            </Box>
          </Box>

          <Box sx={panelSx}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Contacto</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <CampoInfo label="Nombre contacto" value={proveedor.nombreContacto} />
              <CampoInfo label="Teléfono" value={proveedor.telefono} />
              <CampoInfo label="Correo" value={proveedor.email} />
              <CampoInfo label="Dirección" value={proveedor.direccion} />
            </Box>
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography sx={dimLabelSx}>Estado</Typography>
          <Box>
            <StatusBadge variant={estadoVisualVariant[estadoVisual]} dot>
              {estadoVisual}
            </StatusBadge>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
