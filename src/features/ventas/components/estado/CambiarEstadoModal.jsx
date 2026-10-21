import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal } from '@shared/ui'
import { estadoDotColor } from '../../constants/ventas.constants'
import { obtenerNombreCliente, opcionesEstadoParaFila } from '../../utils/ventasHelpers'

export default function CambiarEstadoModal({ abierto, venta, estadoSeleccionado, onSeleccionar, onCerrar, onConfirmar }) {
  return (
    <Modal open={abierto} onClose={onCerrar} title="Cambiar estado" size="sm" showDivider>
      {venta && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Typography variant="body2">
            Venta <b>{venta.id}</b> · {obtenerNombreCliente(venta)}
          </Typography>
          {opcionesEstadoParaFila(venta.estado).map((o) => {
            const activo = estadoSeleccionado === o.value
            return (
              <Box
                key={o.value}
                onClick={() => onSeleccionar(o.value)}
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
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: estadoDotColor[o.value] }} />
                <Typography variant="body1" sx={{ flex: 1 }}>
                  {o.label}
                </Typography>
              </Box>
            )
          })}

          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
            <Button variant="secondary" size="sm" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!estadoSeleccionado || estadoSeleccionado === venta.estado}
              onClick={onConfirmar}
            >
              Confirmar
            </Button>
          </Stack>
        </Box>
      )}
    </Modal>
  )
}
