import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal } from '@shared/ui'
import { obtenerNombreCliente } from '../../utils/ventasHelpers'
import FilterLabel from '../FilterLabel'
import PagoSlot from './PagoSlot'

// `pagos` es lo que devuelve useAbonos().
export default function PagosModal({ pagos }) {
  const {
    abierto, venta, cerrar, inputRef, handleImagenSeleccionada, solicitarComprobante, comprobanteDeSlot,
    cantidadPagos, slots, montoPorPago,
  } = pagos

  return (
    <Modal open={abierto} onClose={cerrar} title="Captura de pagos" size="md" showDivider>
      {venta && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleImagenSeleccionada} />

          <Typography variant="body2">
            Venta <b>{venta.id}</b> · {obtenerNombreCliente(venta)}
          </Typography>

          {/* Resumen: solo total venta */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              p: 1.75,
              bgcolor: 'background.alt',
            }}
          >
            <FilterLabel>Total venta</FilterLabel>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${venta.total.toFixed(2)}
            </Typography>
          </Box>

          <FilterLabel>Comprobante de pago</FilterLabel>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            {slots.map((slot) => (
              <PagoSlot
                key={slot}
                slot={slot}
                cantidadPagos={cantidadPagos}
                montoPorPago={montoPorPago}
                abono={comprobanteDeSlot(slot)}
                onSubir={solicitarComprobante}
              />
            ))}
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
            <Button variant="secondary" size="sm" onClick={cerrar}>
              Cerrar
            </Button>
          </Stack>
        </Box>
      )}
    </Modal>
  )
}
