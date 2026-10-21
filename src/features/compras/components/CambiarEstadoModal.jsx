import { Box, Typography } from '@mui/material'
import { Button, Modal, StatusBadge } from '@shared/ui'
import { estadoDotColor, estadoVariant } from '../constants/compras.constants'
import { opcionesEstadoParaFila } from '../utils/comprasHelpers'

// Solo ofrece los estados a los que la orden puede pasar (ver esTransicionValida en utils/).
export function CambiarEstadoModal({ open, compra, onClose, onSeleccionar }) {
  return (
    <Modal open={open} onClose={onClose} title="Cambiar estado" size="sm" showDivider>
      {compra && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.alt', borderRadius: 1.5, px: 1.5, py: 1.25 }}>
            <Typography variant="body2">Estado actual:</Typography>
            <StatusBadge variant={estadoVariant[compra.estado]} dot>
              {compra.estado}
            </StatusBadge>
          </Box>

          <Typography variant="body2">
            Selecciona el nuevo estado para la orden <b>{compra.id}</b>:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {opcionesEstadoParaFila(compra.estado)
              .filter((o) => o.value !== compra.estado)
              .map((o) => (
                <Box
                  key={o.value}
                  onClick={() => onSeleccionar(o.value)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    cursor: 'pointer',
                    borderRadius: 1.5,
                    px: 1.25,
                    py: 1,
                    bgcolor: 'background.alt',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, bgcolor: estadoDotColor[o.value] }} />
                  <Typography variant="subtitle1">{o.label}</Typography>
                  <Typography variant="body2">Cambiar a {o.label}</Typography>
                </Box>
              ))}
          </Box>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      )}
    </Modal>
  )
}
