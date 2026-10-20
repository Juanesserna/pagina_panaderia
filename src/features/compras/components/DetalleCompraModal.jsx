import { Box, Typography } from '@mui/material'
import { Button, Modal, StatusBadge } from '@shared/ui'
import { estadoVariant } from '../constants/compras.constants'
import { etiquetaProveedor, formatearMoneda } from '../utils/comprasHelpers'
import { Campo } from './Campo'

const COLUMNAS_DETALLE = '1.3fr 0.7fr 1fr 1fr'

export function DetalleCompraModal({ open, compra, proveedores, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Detalle de compra" size="md" showDivider>
      {compra && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            <Campo label="Orden de compra">
              <Typography variant="subtitle1">{compra.id}</Typography>
            </Campo>
            <Campo label="Proveedor">
              <Typography variant="subtitle1">{etiquetaProveedor(proveedores, compra.proveedorId)}</Typography>
            </Campo>
            <Campo label="Fecha">
              <Typography variant="subtitle1">{compra.fecha}</Typography>
            </Campo>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Campo label="Estado">
              <Box>
                <StatusBadge variant={estadoVariant[compra.estado]} dot>
                  {compra.estado}
                </StatusBadge>
              </Box>
            </Campo>
            <Campo label="Solicitante">
              <Typography variant="subtitle1">{compra.solicitante}</Typography>
            </Campo>
            <Campo label="Total facturado">
              <Typography variant="subtitle1">{formatearMoneda(compra.total)}</Typography>
            </Campo>
          </Box>

          <Campo label="Insumos recibidos">
            <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: COLUMNAS_DETALLE,
                  px: 1.5,
                  py: 1,
                  bgcolor: 'background.alt',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="overline">Insumo</Typography>
                <Typography variant="overline" sx={{ textAlign: 'center' }}>
                  Cant.
                </Typography>
                <Typography variant="overline">Lote</Typography>
                <Typography variant="overline">Vencimiento</Typography>
              </Box>
              {compra.detalle.map((item, idx) => (
                <Box
                  key={item.lote}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: COLUMNAS_DETALLE,
                    alignItems: 'center',
                    px: 1.5,
                    py: 1,
                    borderTop: idx > 0 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body1">{item.nombre}</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    {item.cantidad} {item.unidad}
                  </Typography>
                  <Typography variant="mono">{item.lote}</Typography>
                  <Typography variant="body2">{item.fechaVencimiento || 'N/A'}</Typography>
                </Box>
              ))}
            </Box>
          </Campo>

          {compra.notas && (
            <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'background.alt', border: '1px solid', borderColor: 'divider' }}>
              <Campo label="Notas / observaciones">
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {compra.notas}
                </Typography>
              </Campo>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cerrar ventana
            </Button>
          </Box>
        </Box>
      )}
    </Modal>
  )
}
